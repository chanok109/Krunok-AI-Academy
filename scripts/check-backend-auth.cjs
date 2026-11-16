// Self-check for backend/Code.gs login + session auth, with Apps Script services mocked. Run: npm run test:backend
const fs = require('fs'), vm = require('vm'), assert = require('assert');
const src = fs.readFileSync(require('path').join(__dirname, '../backend/Code.gs'), 'utf8');
const cache = new Map(); let uuid = 0; const props = {};
const rows = [['class','no','username','psssword','title','name','lastname'],
  ['1','3','s001','pw1','นาย','สมชาย','ใจดี'], ['0','0','t01','tpw','ครู','นก','ครูนก']];
const ctx = {
  CacheService: { getScriptCache: () => ({ put: (k,v) => cache.set(k,v), get: k => cache.get(k) || null }) },
  Utilities: { getUuid: () => 'aaaa-' + (++uuid) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => props[k] || null }) },
  SpreadsheetApp: { openById: () => ({ getSheetByName: () => ({ getDataRange: () => ({ getValues: () => rows }) }) }) },
  console,
};
vm.createContext(ctx); vm.runInContext(src + '\n;this.T={loginWithUsernamePassword_,createSession_,resolveUser_,verifyGoogleIdToken_};', ctx);
const T = ctx.T;
const s = T.loginWithUsernamePassword_('s001', 'pw1');
assert.strictEqual(s.classroom, 'ม.5/1'); assert.strictEqual(s.role, 'STUDENT');
const t = T.loginWithUsernamePassword_('t01', 'tpw');
assert.strictEqual(t.role, 'TEACHER'); assert.strictEqual(t.classroom, 'ครูผู้สอน');
assert.throws(() => T.loginWithUsernamePassword_('s001', 'bad'), /ไม่ถูกต้อง/);
const tok = T.createSession_(s);
const r = T.resolveUser_({ sessionToken: tok, userId: 't01' });
assert.deepStrictEqual([r.userId, r.role], ['s001', 'STUDENT']);
assert.throws(() => T.resolveUser_({ sessionToken: 'forged' }), /SESSION_EXPIRED/);
assert.throws(() => T.verifyGoogleIdToken_('DEMO_MOCK_TOKEN:x:krunok@pcccr.ac.th:x'), /ปิดใช้งาน/);
props.ALLOW_DEMO_TOKENS = 'true';
assert.strictEqual(T.verifyGoogleIdToken_('DEMO_MOCK_TOKEN:x:a@b:x').email, 'a@b');
console.log('auth-check: all passed');
