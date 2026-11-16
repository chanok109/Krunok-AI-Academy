// Self-check for backend/Code.gs (login, sessions, progress sync) with Apps Script services mocked.
// Run: npm run test:backend
const fs = require('fs'), vm = require('vm'), assert = require('assert');
const src = fs.readFileSync(require('path').join(__dirname, '../backend/Code.gs'), 'utf8');
const cache = new Map(); let uuid = 0; const props = { DB_SPREADSHEET_ID: 'db' };

// Fake sheet that mimics Sheets: "'06999" is stored as text "06999", bare "06999" becomes number 6999.
const cell = v => typeof v === 'string' && v[0] === "'" ? v.slice(1) : (typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : v);
function fakeSheet(rows) {
  return {
    rows,
    getDataRange: () => ({ getValues: () => rows }),
    getLastRow: () => rows.length,
    appendRow: r => rows.push(r.map(cell)),
    getRange: (r, c, n, m) => ({
      getValues: () => rows.slice(r - 1, r - 1 + n).map(x => x.slice(c - 1, c - 1 + m)),
      setValues: vals => vals.forEach((v, i) => { rows[r - 1 + i] = v.map(cell); }),
    }),
  };
}
const usersSheet = fakeSheet([['class','no','username','psssword','title','name','lastname'],
  ['1','3','06999','pw1','นาย','สมชาย','ใจดี'], ['0','0','t01','tpw','ครู','นก','ครูนก']]);
const db = {};
const ctx = {
  CacheService: { getScriptCache: () => ({ put: (k,v) => cache.set(k,v), get: k => cache.get(k) || null }) },
  Utilities: { getUuid: () => 'aaaa-' + (++uuid) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => props[k] || null }) },
  SpreadsheetApp: { openById: id => ({ getSheetByName: n => id === 'db' ? db[n] : usersSheet }) },
  console,
};
vm.createContext(ctx);
vm.runInContext(src + '\n;this.T={SCHEMA,loginWithUsernamePassword_,createSession_,resolveUser_,verifyGoogleIdToken_,syncProgress_};', ctx);
const T = ctx.T;
for (const name of ['ProgressSnapshots', 'QuizAttempts']) db[name] = fakeSheet([T.SCHEMA[name].headers.slice()]);

// --- auth ---
const s = T.loginWithUsernamePassword_('06999', 'pw1');
assert.strictEqual(s.classroom, 'ม.5/1'); assert.strictEqual(s.role, 'STUDENT');
const t = T.loginWithUsernamePassword_('t01', 'tpw');
assert.strictEqual(t.role, 'TEACHER'); assert.strictEqual(t.classroom, 'ครูผู้สอน');
assert.throws(() => T.loginWithUsernamePassword_('06999', 'bad'), /ไม่ถูกต้อง/);
const tok = T.createSession_(s);
const r = T.resolveUser_({ sessionToken: tok, userId: 't01' });
assert.deepStrictEqual([r.userId, r.role], ['06999', 'STUDENT']);
assert.throws(() => T.resolveUser_({ sessionToken: 'forged' }), /SESSION_EXPIRED/);
assert.throws(() => T.verifyGoogleIdToken_('DEMO_MOCK_TOKEN:x:krunok@pcccr.ac.th:x'), /ปิดใช้งาน/);
props.ALLOW_DEMO_TOKENS = 'true';
assert.strictEqual(T.verifyGoogleIdToken_('DEMO_MOCK_TOKEN:x:a@b:x').email, 'a@b');

// --- progress sync: two devices merge, quiz scores come only from QuizAttempts ---
const plain = x => JSON.parse(JSON.stringify(x));
const deviceA = { updatedAt: '2026-11-16T01:00:00Z', unit1: {
  completedLessons: ['u1-l1'], activityScores: { a1: { best: 5, last: 5, max: 10, attempts: 1, at: '2026-11-16T01:00:00Z' } },
  reflections: { lab1: 'A' }, quizAttempts: [{ percent: 100, passed: true }] } };
const deviceB = { updatedAt: '2026-11-16T02:00:00Z', unit1: {
  completedLessons: ['u1-l2'], activityScores: { a1: { best: 3, last: 3, max: 10, attempts: 2, at: '2026-11-16T02:00:00Z' } } },
  unit9: { completedLessons: ['x'] } };
db.QuizAttempts.appendRow(['ATT-1', 6999, 'unit1', '2026-11-16T01:30:00Z', 8, 10, 80, true, 60]); // old row: leading 0 lost
T.syncProgress_(s, { progress: deviceA, overallPercent: 10 });
const merged = plain(T.syncProgress_(s, { progress: deviceB, overallPercent: 20 }));
assert.strictEqual(db.ProgressSnapshots.rows.length, 2, 'one row per student, no duplicates');
assert.strictEqual(db.ProgressSnapshots.rows[1][0], '06999', 'userId stored as text');
const u1 = merged.unit1;
assert.deepStrictEqual(u1.completedLessons.sort(), ['u1-l1', 'u1-l2']);
assert.deepStrictEqual(u1.activityScores.a1, { best: 5, last: 3, max: 10, attempts: 2, at: '2026-11-16T02:00:00Z' });
assert.strictEqual(u1.reflections.lab1, 'A');
assert.deepStrictEqual(u1.quizAttempts.map(a => [a.percent, a.passed]), [[80, true]], 'forged client quiz ignored');
assert.strictEqual(merged.unit9, undefined, 'unknown unit dropped');
assert.strictEqual(merged.updatedAt, '2026-11-16T02:00:00Z');
assert.throws(() => T.syncProgress_(s, { progress: { unit1: { reflections: Object.fromEntries(Array.from({ length: 50 }, (_, i) => ['r' + i, 'x'.repeat(2000)])) } } }), /PROGRESS_TOO_LARGE/);
console.log('backend-check: all passed');
