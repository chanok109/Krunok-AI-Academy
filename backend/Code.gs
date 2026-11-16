/**
 * KruNok AI Academy — Backend (Google Apps Script + Google Sheets)
 * รายวิชา ว32281 ปัญญาประดิษฐ์เบื้องต้น ม.5 ภาคเรียนที่ 2/2569
 * ผู้สอน: นางมนัสชนก ตามวงค์ (Kru Nok)
 *
 * PHASE 1 — DATABASE
 *   - setupDatabase()        สร้าง/ซ่อมโครงฐานข้อมูล KruNok_AI_Academy_DB (ไม่ลบข้อมูลเดิม)
 *   - checkDatabase()        ตรวจโครงสร้างแบบอ่านอย่างเดียว
 *   - testDatabaseReadWrite() ทดสอบเขียน–อ่าน Google Sheets จริง 1 แถว (บันทึกลง AuditLogs)
 *   - writeAuditLog()        บันทึกเหตุการณ์
 *   - ตัวช่วยอ่าน/เขียนแถว (ใช้ร่วมกับ Phase 2–6)
 *
 * ยังไม่มี doGet() / การยืนยันตัวตน / API สำหรับนักเรียน — จะเพิ่มใน Phase 2
 * ฟังก์ชันที่ลงท้ายด้วย _ เป็น private: google.script.run เรียกจาก Browser ไม่ได้
 *
 * Runtime: V8
 */

/* =====================================================================
   1) CONFIG & SCHEMA
   ===================================================================== */
const APP = {
  name: 'KruNok AI Academy',
  dbName: 'KruNok_AI_Academy_DB',
  courseCode: 'ว32281',
  classrooms: ['ม.5/1', 'ม.5/2', 'ม.5/3', 'ม.5/4', 'ม.5/5', 'ม.5/6'],
  schemaVersion: 1,
  propDbId: 'DB_SPREADSHEET_ID',
  propSchemaVersion: 'DB_SCHEMA_VERSION',
  lockWaitMs: 30000,
  // สเปรดชีตเก็บคะแนน/ความก้าวหน้า ใช้เมื่อยังไม่ได้ตั้ง Script Property DB_SPREADSHEET_ID
  defaultDbId: '11RfS0KoG_xIajpyn_K2euRGX5L0RVUgv_4ys6BjNvUo',
  maxText: 2000,
};

const ENUMS = {
  role: ['STUDENT', 'TEACHER', 'ADMIN'],
  userStatus: ['PENDING', 'ACTIVE', 'SUSPENDED'],
  contentStatus: ['ACTIVE', 'DRAFT', 'ARCHIVED'],
  completionStatus: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'],
  projectStatus: ['DRAFT', 'SUBMITTED', 'RETURNED', 'ASSESSED'],
  auditResult: ['SUCCESS', 'DENIED', 'ERROR'],
};

/**
 * key = ชื่อชีต, headers = คอลัมน์ตามลำดับ, id = คอลัมน์คีย์หลัก
 * validations = { ชื่อคอลัมน์: รายการค่าที่อนุญาต } (ใช้ Data Validation ของ Sheets)
 */
const SCHEMA = {
  Users: {
    id: 'userId',
    headers: ['userId', 'googleSub', 'email', 'displayName', 'classroom', 'role', 'status', 'createdAt', 'updatedAt'],
    validations: { classroom: APP.classrooms, role: ENUMS.role, status: ENUMS.userStatus },
  },
  Units: {
    id: 'unitId',
    headers: ['unitId', 'unitName', 'totalLessons', 'passingPercent', 'status'],
    validations: { status: ENUMS.contentStatus },
  },
  Lessons: {
    id: 'lessonId',
    headers: ['lessonId', 'unitId', 'lessonName', 'sequence', 'status'],
    validations: { status: ENUMS.contentStatus },
  },
  Progress: {
    id: 'progressId',
    headers: ['progressId', 'userId', 'unitId', 'lessonId', 'activityId', 'completionStatus', 'updatedAt'],
    validations: { completionStatus: ENUMS.completionStatus },
  },
  QuizAttempts: {
    id: 'attemptId',
    headers: ['attemptId', 'userId', 'unitId', 'submittedAt', 'score', 'maxScore', 'percentage', 'passed', 'durationSeconds'],
    validations: {}, // passed เก็บเป็น Boolean ของ Sheets (TRUE/FALSE)
  },
  Projects: {
    id: 'projectId',
    headers: ['projectId', 'userId', 'unitId', 'projectTitle', 'description', 'status', 'evidenceLink', 'submittedAt'],
    validations: { status: ENUMS.projectStatus },
  },
  Assessments: {
    id: 'assessmentId',
    headers: ['assessmentId', 'userId', 'unitId', 'projectId', 'rubricScores', 'totalScore', 'maxScore', 'feedback', 'teacherId', 'updatedAt'],
    validations: {},
  },
  ScoreLog: {
    id: 'logId',
    headers: ['logId', 'submittedAt', 'userId', 'displayName', 'classroom', 'unitId', 'scoreType', 'itemId', 'itemName', 'score', 'maxScore', 'percentage', 'passed'],
    validations: {},
  },
  ProgressSnapshots: {
    id: 'userId',
    headers: ['userId', 'classroom', 'progressJson', 'overallPercent', 'clientUpdatedAt', 'serverUpdatedAt'],
    validations: {},
  },
  AuditLogs: {
    id: 'logId',
    headers: ['logId', 'timestamp', 'actorId', 'action', 'targetId', 'result'],
    validations: { result: ENUMS.auditResult },
  },
};

/** ข้อมูลตั้งต้น — ตรงกับรหัสหน่วย/บทเรียนในเว็บไซต์เดิม (UNITS ใน React) */
const SEED_UNITS = [
  { unitId: 'unit1', unitName: 'แนวคิดเบื้องต้นเกี่ยวกับปัญญาประดิษฐ์', passingPercent: 70,
    lessons: ['ความหมายของ AI', 'ประวัติและวิวัฒนาการ AI', 'ประเภทและเทคโนโลยี AI', 'จริยธรรม AI', 'กฎหมายและธรรมาภิบาล AI', 'Deepfake และ AI Safety'], prefix: 'u1-l' },
  { unitId: 'unit2', unitName: 'พื้นฐานคอมพิวเตอร์วิทัศน์', passingPercent: 70,
    lessons: ['Introduction to Computer Vision', 'Digital Image Fundamentals', 'Python & OpenCV Basics', 'Image Processing', 'Face & Object Detection'], prefix: 'u2-l' },
  { unitId: 'unit3', unitName: 'พื้นฐานการเรียนรู้ของเครื่องและการสร้างโมเดล', passingPercent: 70,
    lessons: ['Introduction to Machine Learning', 'Image Classifier', 'Object Detection', 'Pose Classifier', 'Hand Pose Classifier'], prefix: 'u3-l' },
  { unitId: 'unit4', unitName: 'การประยุกต์ใช้ AI เพื่อสร้างชิ้นงาน', passingPercent: 70,
    lessons: ['Define the Problem', 'Plan & Design', 'Collect & Prepare Data', 'Build AI Model', 'Test & Improve', 'Present & Reflect'], prefix: 'u4-s' },
];

/* =====================================================================
   2) SETUP — สร้างหรือซ่อมฐานข้อมูล (ไม่ลบ/ไม่เขียนทับข้อมูลเดิม)
   ===================================================================== */

/**
 * รันจาก Apps Script Editor โดยครู (เจ้าของสคริปต์) เท่านั้น
 * - ถ้ายังไม่มีฐานข้อมูล: สร้าง Spreadsheet ชื่อ KruNok_AI_Academy_DB ใน Drive ของผู้รัน
 * - ถ้ามีแล้ว: เพิ่มเฉพาะชีต/ข้อมูลตั้งต้นที่ขาด ไม่แตะแถวที่มีอยู่
 * - ถ้าหัวคอลัมน์ของชีตเดิมไม่ตรง: หยุดและรายงาน ไม่แก้ทับ
 */
function setupDatabase() {
  const lock = LockService.getScriptLock();
  lock.waitLock(APP.lockWaitMs);
  const report = { created: [], verified: [], seeded: [], skipped: [], problems: [] };
  try {
    const ss = getOrCreateSpreadsheet_(report);

    Object.keys(SCHEMA).forEach(function (name) {
      const def = SCHEMA[name];
      let sh = ss.getSheetByName(name);
      if (!sh) {
        sh = ss.insertSheet(name);
        writeHeaders_(sh, def.headers);
        report.created.push('sheet:' + name);
      } else {
        const problem = compareHeaders_(sh, def.headers);
        if (problem) { report.problems.push(name + ': ' + problem); return; }
        report.verified.push('sheet:' + name);
      }
      applyValidations_(sh, def);
    });

    if (report.problems.length) {
      throw new Error('หัวคอลัมน์ไม่ตรง Schema — ไม่ได้แก้ไขชีตเหล่านี้:\n' + report.problems.join('\n'));
    }

    removeEmptyDefaultSheet_(ss, report);
    seedUnitsAndLessons_(report);
    seedOwnerAsAdmin_(report);

    PropertiesService.getScriptProperties().setProperty(APP.propSchemaVersion, String(APP.schemaVersion));
    writeAuditLog(actorForEditor_(), 'SETUP_DATABASE', ss.getId(), 'SUCCESS');

    report.url = ss.getUrl();
    Logger.log(JSON.stringify(report, null, 2));
    return report;
  } catch (err) {
    try { writeAuditLog(actorForEditor_(), 'SETUP_DATABASE', '', 'ERROR'); } catch (e) { /* DB อาจยังไม่พร้อม */ }
    Logger.log(JSON.stringify(report, null, 2));
    throw err;
  } finally {
    lock.releaseLock();
  }
}

/** ตรวจโครงสร้างแบบอ่านอย่างเดียว — ไม่สร้าง ไม่แก้ ไม่ลบ */
function checkDatabase() {
  const id = PropertiesService.getScriptProperties().getProperty(APP.propDbId) || APP.defaultDbId;
  if (!id) throw new Error('ยังไม่ได้ตั้งค่าฐานข้อมูล — รัน setupDatabase() ก่อน');
  const ss = SpreadsheetApp.openById(id);
  const result = { url: ss.getUrl(), sheets: {}, ok: true };
  Object.keys(SCHEMA).forEach(function (name) {
    const sh = ss.getSheetByName(name);
    if (!sh) { result.sheets[name] = 'MISSING'; result.ok = false; return; }
    const problem = compareHeaders_(sh, SCHEMA[name].headers);
    result.sheets[name] = problem ? 'HEADER MISMATCH: ' + problem : 'OK (' + Math.max(0, sh.getLastRow() - 1) + ' rows)';
    if (problem) result.ok = false;
  });
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

/**
 * ทดสอบการเชื่อมต่อจริง: เขียน 1 แถวลง AuditLogs แล้วอ่านกลับมาเทียบ
 * ผลลัพธ์ "PASS" เท่านั้นที่ถือว่าอ่าน–เขียน Google Sheets ได้จริง
 * (แถวทดสอบถูกเก็บไว้เป็นหลักฐาน ไม่ลบ)
 */
function testDatabaseReadWrite() {
  const marker = 'RW_TEST_' + Utilities.getUuid();
  const logId = writeAuditLog(actorForEditor_(), 'DB_READ_WRITE_TEST', marker, 'SUCCESS');
  SpreadsheetApp.flush();
  const found = findRowById_('AuditLogs', logId);
  const pass = !!found && found.record.targetId === marker && found.record.action === 'DB_READ_WRITE_TEST';
  const out = { result: pass ? 'PASS' : 'FAIL', logId: logId, marker: marker, readBack: found ? found.record : null };
  Logger.log(JSON.stringify(out, null, 2));
  if (!pass) throw new Error('อ่านค่าที่เพิ่งเขียนกลับมาไม่ได้ — ตรวจสิทธิ์ไฟล์และ DB_SPREADSHEET_ID');
  return out;
}

/** ข้อมูลฐานข้อมูลสำหรับครู (ใช้ใน Editor) */
function getDatabaseInfo() {
  const ss = getDb_();
  const info = { name: ss.getName(), id: ss.getId(), url: ss.getUrl(),
    schemaVersion: PropertiesService.getScriptProperties().getProperty(APP.propSchemaVersion) };
  Logger.log(JSON.stringify(info, null, 2));
  return info;
}

/* =====================================================================
   3) AUDIT LOG
   ===================================================================== */

/**
 * บันทึกเหตุการณ์ลง AuditLogs (append-only)
 * @return {string} logId
 */
function writeAuditLog(actorId, action, targetId, result) {
  if (ENUMS.auditResult.indexOf(result) < 0) throw new Error('ผลลัพธ์ audit ไม่ถูกต้อง: ' + result);
  const logId = 'LOG-' + Utilities.getUuid();
  appendRecord_('AuditLogs', {
    logId: logId,
    timestamp: nowIso_(),
    actorId: cleanText_(actorId || 'UNKNOWN', 200),
    action: cleanText_(action, 100),
    targetId: cleanText_(targetId || '', 200),
    result: result,
  });
  return logId;
}

/* =====================================================================
   4) DATA ACCESS HELPERS (ใช้ร่วมกับ Phase 2–6)
   ===================================================================== */

function getDb_() {
  const id = PropertiesService.getScriptProperties().getProperty(APP.propDbId) || APP.defaultDbId;
  if (!id) throw new Error('ยังไม่ได้ตั้งค่าฐานข้อมูล — รัน setupDatabase() ก่อน');
  return SpreadsheetApp.openById(id);
}

function getSheet_(name) {
  if (!SCHEMA[name]) throw new Error('ไม่รู้จักชีต: ' + name);
  const sh = getDb_().getSheetByName(name);
  if (!sh) throw new Error('ไม่พบชีต ' + name + ' — รัน setupDatabase()');
  return sh;
}

/** อ่านทุกแถวเป็น object ตามหัวคอลัมน์ใน SCHEMA */
function readAll_(name) {
  const sh = getSheet_(name);
  const headers = SCHEMA[name].headers;
  const last = sh.getLastRow();
  if (last < 2) return [];
  const values = sh.getRange(2, 1, last - 1, headers.length).getValues();
  return values.map(function (row) { return rowToRecord_(headers, row); });
}

/** หาแถวด้วยคีย์หลัก → { rowIndex (1-based ในชีต), record } หรือ null */
function findRowById_(name, idValue) {
  const sh = getSheet_(name);
  const headers = SCHEMA[name].headers;
  const last = sh.getLastRow();
  if (last < 2) return null;
  const col = headers.indexOf(SCHEMA[name].id) + 1;
  const ids = sh.getRange(2, col, last - 1, 1).getValues();
  for (let i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]) === String(idValue)) {
      const row = sh.getRange(i + 2, 1, 1, headers.length).getValues()[0];
      return { rowIndex: i + 2, record: rowToRecord_(headers, row) };
    }
  }
  return null;
}

/** เพิ่มแถวใหม่ (ต้องมีคีย์หลัก และห้ามซ้ำ) — ผู้เรียกควรถือ Lock อยู่แล้วเมื่อเป็นข้อมูลคะแนน */
function appendRecord_(name, record) {
  const def = SCHEMA[name];
  if (!record[def.id]) throw new Error(name + ': ต้องมี ' + def.id);
  const sh = getSheet_(name);
  const row = def.headers.map(function (h) { return toCell_(record[h]); });
  sh.appendRow(row);
  return record[def.id];
}

/** แก้ไขบางคอลัมน์ของแถวที่มีอยู่ (ไม่อนุญาตให้เปลี่ยนคีย์หลัก) */
function updateRecord_(name, idValue, patch) {
  const def = SCHEMA[name];
  if (Object.prototype.hasOwnProperty.call(patch, def.id)) throw new Error('ห้ามแก้คีย์หลัก');
  const found = findRowById_(name, idValue);
  if (!found) throw new Error(name + ': ไม่พบ ' + idValue);
  const merged = Object.assign({}, found.record, patch);
  const row = def.headers.map(function (h) { return toCell_(merged[h]); });
  getSheet_(name).getRange(found.rowIndex, 1, 1, def.headers.length).setValues([row]);
  return merged;
}

/* =====================================================================
   5) VALIDATION / SANITIZING
   ===================================================================== */

/** ตัดช่องว่าง จำกัดความยาว และกันสูตร (=,+,-,@) ไม่ให้ถูกตีความใน Sheets */
function cleanText_(value, maxLen) {
  let s = String(value == null ? '' : value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
  s = s.slice(0, maxLen || APP.maxText);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

function toCell_(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'number') return isFinite(v) ? v : '';
  if (typeof v === 'boolean') return v;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'object') return cleanText_(JSON.stringify(v), 10000);
  const s = cleanText_(v);
  // กัน Sheets แปลงรหัสอย่าง "06999" เป็นตัวเลข 6999 (เลข 0 นำหน้าหาย)
  return /^0\d+$/.test(s) ? "'" + s : s;
}

/** เทียบรหัสผู้ใช้ โดยไม่สนเลข 0 นำหน้าที่ Sheets อาจตัดทิ้งไปแล้วในแถวเก่า */
function sameId_(a, b) {
  return String(a).replace(/^0+/, '') === String(b).replace(/^0+/, '');
}

function rowToRecord_(headers, row) {
  const o = {};
  headers.forEach(function (h, i) {
    let v = row[i];
    if (v instanceof Date) v = v.toISOString();
    if (typeof v === 'string' && v.charAt(0) === "'") v = v.slice(1);
    o[h] = v;
  });
  return o;
}

function isClassroom_(c) { return APP.classrooms.indexOf(c) >= 0; }
function nowIso_() { return new Date().toISOString(); }

/* =====================================================================
   6) PRIVATE SETUP HELPERS
   ===================================================================== */

function getOrCreateSpreadsheet_(report) {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty(APP.propDbId) || APP.defaultDbId;
  if (id) {
    try {
      const existing = SpreadsheetApp.openById(id);
      report.verified.push('spreadsheet:' + existing.getName());
      return existing;
    } catch (e) {
      // ไม่สร้างไฟล์ใหม่ทับเงียบ ๆ — อาจเป็นไฟล์ถูกย้าย/ไม่มีสิทธิ์
      throw new Error('เปิดฐานข้อมูลเดิม (' + id + ') ไม่ได้: ' + e.message +
        '\nถ้าตั้งใจสร้างใหม่ ให้ลบ Script Property ' + APP.propDbId + ' ก่อน แล้วรันอีกครั้ง');
    }
  }
  const ss = SpreadsheetApp.create(APP.dbName);
  props.setProperty(APP.propDbId, ss.getId());
  report.created.push('spreadsheet:' + APP.dbName);
  return ss;
}

function writeHeaders_(sh, headers) {
  sh.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontWeight('bold').setBackground('#161336').setFontColor('#F4F6FB');
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, headers.length).protect()
    .setDescription('หัวคอลัมน์ฐานข้อมูล — ห้ามแก้ไข')
    .setWarningOnly(true);
}

function compareHeaders_(sh, headers) {
  if (sh.getLastColumn() < headers.length) {
    if (sh.getLastRow() === 0) { writeHeaders_(sh, headers); return null; } // ชีตว่าง: เติมหัวคอลัมน์ได้
    return 'คอลัมน์ไม่ครบ (มี ' + sh.getLastColumn() + ' ต้องการ ' + headers.length + ')';
  }
  const actual = sh.getRange(1, 1, 1, headers.length).getValues()[0].map(String);
  for (let i = 0; i < headers.length; i++) {
    if (actual[i] !== headers[i]) return 'คอลัมน์ ' + (i + 1) + ' เป็น "' + actual[i] + '" แต่ควรเป็น "' + headers[i] + '"';
  }
  return null;
}

function applyValidations_(sh, def) {
  const rows = Math.max(sh.getMaxRows() - 1, 1);
  Object.keys(def.validations).forEach(function (col) {
    const idx = def.headers.indexOf(col) + 1;
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(def.validations[col], true)
      .setAllowInvalid(false)
      .build();
    sh.getRange(2, idx, rows, 1).setDataValidation(rule);
  });
}

function removeEmptyDefaultSheet_(ss, report) {
  ss.getSheets().forEach(function (sh) {
    const n = sh.getName();
    if (!SCHEMA[n] && sh.getLastRow() === 0 && ss.getSheets().length > 1 && /^(Sheet1|ชีต1|แผ่น1)$/.test(n)) {
      ss.deleteSheet(sh);
      report.skipped.push('removed empty default sheet ' + n);
    }
  });
}

function seedUnitsAndLessons_(report) {
  const units = readAll_('Units').map(function (r) { return String(r.unitId); });
  const lessons = readAll_('Lessons').map(function (r) { return String(r.lessonId); });
  SEED_UNITS.forEach(function (u) {
    if (units.indexOf(u.unitId) < 0) {
      appendRecord_('Units', { unitId: u.unitId, unitName: u.unitName, totalLessons: u.lessons.length,
        passingPercent: u.passingPercent, status: 'ACTIVE' });
      report.seeded.push('unit:' + u.unitId);
    } else {
      report.skipped.push('unit:' + u.unitId + ' (มีอยู่แล้ว ไม่เขียนทับ)');
    }
    u.lessons.forEach(function (title, i) {
      const lessonId = u.prefix + (i + 1);
      if (lessons.indexOf(lessonId) >= 0) return;
      appendRecord_('Lessons', { lessonId: lessonId, unitId: u.unitId, lessonName: title, sequence: i + 1, status: 'ACTIVE' });
      report.seeded.push('lesson:' + lessonId);
    });
  });
}

/**
 * บัญชีที่รัน setup (ครูเจ้าของสคริปต์) ถูกบันทึกเป็น ADMIN
 * googleSub ยังว่าง — Phase 2 จะผูก sub หลังยืนยัน Google ID Token สำเร็จครั้งแรก
 */
function seedOwnerAsAdmin_(report) {
  const email = Session.getActiveUser().getEmail();
  if (!email) {
    report.problems.push('อ่านอีเมลผู้รันไม่ได้ — ยังไม่ได้เพิ่ม ADMIN (เพิ่มเองในชีต Users ได้)');
    return;
  }
  const exists = readAll_('Users').some(function (u) { return String(u.email).toLowerCase() === email.toLowerCase(); });
  if (exists) { report.skipped.push('admin:' + email + ' (มีอยู่แล้ว)'); return; }
  const t = nowIso_();
  appendRecord_('Users', { userId: 'USR-' + Utilities.getUuid(), googleSub: '', email: email.toLowerCase(),
    displayName: 'Kru Nok', classroom: '', role: 'ADMIN', status: 'ACTIVE', createdAt: t, updatedAt: t });
  report.seeded.push('admin:' + email);
}

/** ใช้เฉพาะงานที่ครูรันใน Editor — ไม่ใช่การยืนยันตัวตนของผู้ใช้เว็บ */
function actorForEditor_() {
  const email = Session.getActiveUser().getEmail();
  return email ? 'EDITOR:' + email.toLowerCase() : 'EDITOR:unknown';
}


/* =====================================================================
   7) OFFICIAL SERVER-SIDE QUIZ KEYS & GRADING ENGINE (Phase C)
   ===================================================================== */

/**
 * เฉลยทางการและคำอธิบายข้อสอบ ย้ายมาฝั่งเซิร์ฟเวอร์เพื่อความปลอดภัย
 * ผู้เรียนไม่สามารถอ่านเฉลยจากโค้ดฝั่ง Client ได้ก่อนทำข้อสอบ
 */
const OFFICIAL_QUIZ = {
  "unit1": [
    {
      "id": "q1",
      "lesson": "u1-l1",
      "level": "ความรู้ความเข้าใจ",
      "answer": "a",
      "explain": "McCarthy นิยาม AI ว่าเป็นศาสตร์และวิศวกรรมของการสร้างเครื่องจักรที่ฉลาด โดยเฉพาะโปรแกรมคอมพิวเตอร์ที่ฉลาด ไม่จำเป็นต้องมีรูปร่างเป็นหุ่นยนต์"
    },
    {
      "id": "q2",
      "lesson": "u1-l1",
      "level": "การประยุกต์ใช้",
      "answer": "d",
      "explain": "การเลือกการกระทำที่ให้ผลลัพธ์ดีที่สุดตามเป้าหมาย (ไปถึงเร็วที่สุดภายใต้ข้อจำกัดจริง) คือแนวคิด Rational Agent หรือ Acting Rationally"
    },
    {
      "id": "q3",
      "lesson": "u1-l2",
      "level": "การวิเคราะห์",
      "answer": "c",
      "explain": "AI Winter เกิดจากข้อจำกัดด้านพลังคำนวณและข้อมูลทำให้ผลงานไม่เป็นไปตามคำโฆษณา จึงถูกตัดงบวิจัย ส่วนยุคปัจจุบันก้าวกระโดดด้วย 3 ปัจจัยหลักคือ Big Data, GPU และอัลกอริทึมที่ก้าวหน้า"
    },
    {
      "id": "q4",
      "lesson": "u1-l3",
      "level": "ความรู้ความเข้าใจ",
      "answer": "b",
      "explain": "AI ที่ใช้งานจริงในปัจจุบันทั้งหมดยังเป็น ANI (Narrow AI) คือมีความสามารถสูงเฉพาะด้านที่ถูกฝึกมาเท่านั้น ยังไม่ใช่ AGI หรือ ASI"
    },
    {
      "id": "q5",
      "lesson": "u1-l3",
      "level": "การวิเคราะห์",
      "answer": "c",
      "explain": "โครงสร้างซ้อนชั้นคือ AI ⊃ ML ⊃ DL ⊃ Generative AI โดย DL ใช้โครงข่ายประสาทเทียมหลายชั้น และเป็นรากฐานของ Generative AI ที่สร้างข้อความหรือภาพใหม่ได้"
    },
    {
      "id": "q6",
      "lesson": "u1-l4",
      "level": "การวิเคราะห์",
      "answer": "a",
      "explain": "เมื่อข้อมูลฝึกสอน (Training Data) มีความลำเอียงในอดีต โมเดลจะเรียนรู้และผลิตซ้ำอคตินั้น (Data Bias) ทำให้ผลการตัดสินใจขาดความเป็นธรรม (Fairness)"
    },
    {
      "id": "q7",
      "lesson": "u1-l4",
      "level": "การประยุกต์ใช้",
      "answer": "c",
      "explain": "Generative AI ทำนายคำถัดไปตามความน่าจะเป็น จึงสามารถแต่งข้อมูลเท็จที่ฟังดูสมจริงขึ้นมาได้ (Hallucination) ผู้ใช้จึงต้องตรวจสอบกับแหล่งอ้างอิงต้นทางเสมอ"
    },
    {
      "id": "q8",
      "lesson": "u1-l5",
      "level": "การวิเคราะห์",
      "answer": "b",
      "explain": "หลักการสำคัญคือกฎหมายควบคุมเข้มงวดตามผลกระทบต่อสิทธิของมนุษย์ โดย Social Scoring ถูกห้ามใช้เด็ดขาด (Unacceptable Risk) ส่วน AI คัดเลือกการศึกษาเป็น High Risk ที่ต้องโปร่งใส ตรวจสอบได้ และมีมนุษย์กำกับ"
    },
    {
      "id": "q9",
      "lesson": "u1-l5",
      "level": "ความรู้ความเข้าใจ",
      "answer": "d",
      "explain": "พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) มีผลบังคับใช้เต็มรูปแบบตั้งแต่วันที่ 1 มิ.ย. 2565 ข้อมูลชีวมิติและสุขภาพเป็นข้อมูลอ่อนไหว (มาตรา 26) และเจ้าของข้อมูลมีสิทธิเข้าถึง คัดค้าน หรือขอให้ลบข้อมูลได้"
    },
    {
      "id": "q10",
      "lesson": "u1-l6",
      "level": "การประยุกต์ใช้",
      "answer": "c",
      "explain": "เทคโนโลยี Deepfake และ AI Voice Cloning สามารถปลอมใบหน้าและเสียงแบบเรียลไทม์ได้ วิธีป้องกันที่ดีที่สุดคือหยุดความเร่งด่วน แล้วโทรกลับไปยืนยันผ่านช่องทางหลักที่เรารู้จักอยู่เดิม"
    }
  ],
  "unit2": [
    {
      "id": "q1",
      "lesson": "u2-l1",
      "level": "ความรู้ความเข้าใจ",
      "answer": "c",
      "explain": "Computer Vision มุ่งให้คอมพิวเตอร์ 'เข้าใจ' ภาพ เช่น บอกว่ามีอะไรอยู่ตรงไหน ไม่ใช่แค่แสดงหรือแต่งภาพ"
    },
    {
      "id": "q2",
      "lesson": "u2-l1",
      "level": "การประยุกต์ใช้",
      "answer": "a",
      "explain": "การบอกทั้งประเภทและตำแหน่งของวัตถุหลายชิ้นด้วย Bounding Box คือ Object Detection ส่วน Classification ให้ป้ายกำกับกับทั้งภาพ"
    },
    {
      "id": "q3",
      "lesson": "u2-l2",
      "level": "ความรู้ความเข้าใจ",
      "answer": "d",
      "explain": "1920 × 1080 = 2,073,600 พิกเซล ส่วน 6,220,800 คือจำนวนค่าตัวเลขเมื่อคูณ 3 ช่องสี"
    },
    {
      "id": "q4",
      "lesson": "u2-l2",
      "level": "การประยุกต์ใช้",
      "answer": "b",
      "explain": "แดงเต็ม + น้ำเงินเต็ม ไม่มีเขียว ผสมแสงได้สีม่วงแดง (Magenta) ส่วนเหลือง = แดง + เขียว"
    },
    {
      "id": "q5",
      "lesson": "u2-l2",
      "level": "การวิเคราะห์",
      "answer": "c",
      "explain": "0.299×200 + 0.587×100 + 0.114×50 = 59.8 + 58.7 + 5.7 = 124.2 ≈ 124 OpenCV ให้น้ำหนักสีเขียวมากที่สุด จึงไม่ใช่ค่าเฉลี่ยธรรมดา"
    },
    {
      "id": "q6",
      "lesson": "u2-l3",
      "level": "การวิเคราะห์",
      "answer": "a",
      "explain": "shape เรียงเป็น (สูง, กว้าง, ช่องสี) จึงเป็น (480, 640, 3)"
    },
    {
      "id": "q7",
      "lesson": "u2-l3",
      "level": "การวิเคราะห์",
      "answer": "b",
      "explain": "ขนาดใน cv2.resize เขียนเป็น (กว้าง, สูง) = กว้าง 320 สูง 240 แต่ shape แสดง (สูง, กว้าง, ช่องสี) = (240, 320, 3)"
    },
    {
      "id": "q8",
      "lesson": "u2-l3",
      "level": "การวิเคราะห์",
      "answer": "d",
      "explain": "ภาพระดับเทามีค่าเดียวต่อพิกเซล OpenCV จึงคืนอาร์เรย์ 2 มิติ (480, 640)"
    },
    {
      "id": "q9",
      "lesson": "u2-l3",
      "level": "การวิเคราะห์",
      "answer": "c",
      "explain": "OpenCV เก็บสีเรียงเป็น B G R สีแดงล้วนจึงเป็น [0 0 255]"
    },
    {
      "id": "q10",
      "lesson": "u2-l3",
      "level": "การประยุกต์ใช้",
      "answer": "a",
      "explain": "Colab ไม่มีหน้าต่างแสดงผลแบบ GUI จึงต้องใช้ cv2_imshow() หรือ matplotlib ส่วน imwrite ใช้บันทึกไฟล์ ไม่ได้แสดงภาพ"
    },
    {
      "id": "q11",
      "lesson": "u2-l4",
      "level": "การประยุกต์ใช้",
      "answer": "b",
      "explain": "cv2.flip รหัส 0 กลับรอบแกนนอน (บน-ล่าง) รหัส 1 กลับซ้าย-ขวา และ -1 กลับทั้งสองแกน"
    },
    {
      "id": "q12",
      "lesson": "u2-l4",
      "level": "การวิเคราะห์",
      "answer": "d",
      "explain": "ตำแหน่งแรกคือแถว (y) 100 ถึง 199 ตำแหน่งที่สองคือคอลัมน์ (x) 50 ถึง 149 ค่าปลายไม่รวม ได้ 100 × 100 พิกเซล"
    },
    {
      "id": "q13",
      "lesson": "u2-l5",
      "level": "ความรู้ความเข้าใจ",
      "answer": "a",
      "explain": "การตรวจจับบอกตำแหน่ง ไม่รู้ตัวตน การจดจำต้องเปรียบเทียบกับฐานข้อมูลใบหน้า จึงใช้ข้อมูลชีวภาพและมีความเสี่ยงด้านความเป็นส่วนตัวสูงกว่า"
    },
    {
      "id": "q14",
      "lesson": "u2-l5",
      "level": "การวิเคราะห์",
      "answer": "c",
      "explain": "Threshold เป็นเกณฑ์ตัดผล ยิ่งสูงยิ่งเหลือเฉพาะผลที่มั่นใจมาก ลดผลผิด (False Positive) แต่เพิ่มโอกาสพลาด (False Negative)"
    },
    {
      "id": "q15",
      "lesson": "u2-l5",
      "level": "การวิเคราะห์",
      "answer": "b",
      "explain": "COCO มีประเภท sports ball แต่ไม่แยกชนิดลูกบอล ความสามารถของโมเดลขึ้นกับข้อมูลที่ใช้ฝึก งานเฉพาะทางจึงต้องเก็บข้อมูลและฝึกเพิ่ม (Fine-tuning)"
    }
  ],
  "unit3": [
    {
      "id": "q1",
      "lesson": "u3-l1",
      "level": "ความรู้ความเข้าใจ",
      "answer": "b",
      "explain": "ML เรียนรู้รูปแบบจากข้อมูลแทนการเขียนกฎทุกข้อเอง แล้วนำไปใช้กับข้อมูลที่ไม่เคยเห็น"
    },
    {
      "id": "q2",
      "lesson": "u3-l1",
      "level": "ความรู้ความเข้าใจ",
      "answer": "c",
      "explain": "Supervised Learning เรียนจากตัวอย่างที่มี Label (สแปม/ไม่ใช่สแปม) ส่วนการจัดกลุ่มโดยไม่มีป้ายเป็น Unsupervised"
    },
    {
      "id": "q3",
      "lesson": "u3-a1",
      "level": "การประยุกต์ใช้",
      "answer": "a",
      "explain": "Label คือค่าที่ต้องการทำนาย (ราคาขาย) ส่วน Feature คือข้อมูลที่ใช้ทำนาย"
    },
    {
      "id": "q4",
      "lesson": "u3-a2",
      "level": "การวิเคราะห์",
      "answer": "d",
      "explain": "การทดสอบกับข้อมูลฝึกเหมือนสอบด้วยข้อสอบที่เห็นเฉลยแล้ว ต้องแยกข้อมูลทดสอบเพื่อวัดความสามารถกับข้อมูลใหม่"
    },
    {
      "id": "q5",
      "lesson": "u3-a2",
      "level": "การวิเคราะห์",
      "answer": "b",
      "explain": "ตอบแมวทุกครั้งถูก 950 จาก 1000 = 95% ตัวเลขดูดีแต่หลอกตา ต้องดู Confusion Matrix และทำข้อมูลให้สมดุล"
    },
    {
      "id": "q6",
      "lesson": "u3-l1",
      "level": "การวิเคราะห์",
      "answer": "c",
      "explain": "Overfitting คือโมเดลจำข้อมูลฝึกละเอียดเกินไป รวมถึงความบังเอิญในข้อมูล จึงใช้กับข้อมูลใหม่ได้ไม่ดี"
    },
    {
      "id": "q7",
      "lesson": "u3-l1",
      "level": "การประยุกต์ใช้",
      "answer": "a",
      "explain": "kNN โหวตเสียงข้างมาก ส้มได้ 2 จาก 3 เสียง จึงทายส้ม ความมั่นใจ 2/3 ≈ 67%"
    },
    {
      "id": "q8",
      "lesson": "u3-l2",
      "level": "การประยุกต์ใช้",
      "answer": "d",
      "explain": "โมเดลเรียนรู้พื้นหลังสีขาวร่วมด้วย (Data Bias) การเพิ่มความหลากหลายของข้อมูลฝึกช่วยให้เรียนรู้ลักษณะของขวดจริง"
    },
    {
      "id": "q9",
      "lesson": "u3-l2",
      "level": "ความรู้ความเข้าใจ",
      "answer": "b",
      "explain": "Transfer Learning นำความรู้จากโมเดลที่ฝึกกับภาพนับล้านมาใช้สกัดคุณลักษณะ แล้วฝึกเฉพาะส่วนจำแนกด้วยภาพของเรา"
    },
    {
      "id": "q10",
      "lesson": "u3-l3",
      "level": "ความรู้ความเข้าใจ",
      "answer": "c",
      "explain": "Detection ให้ผลละเอียดกว่า คือทั้งชนิดและตำแหน่งของวัตถุแต่ละชิ้น"
    },
    {
      "id": "q11",
      "lesson": "u3-l3",
      "level": "การวิเคราะห์",
      "answer": "a",
      "explain": "Precision = 3 ÷ (3 + 0) = 100% เพราะทุกกรอบถูก Recall = 3 ÷ (3 + 1) = 75% เพราะพลาดแมว 1 ตัว (FN)"
    },
    {
      "id": "q12",
      "lesson": "u3-l3",
      "level": "การประยุกต์ใช้",
      "answer": "b",
      "explain": "IoU = 40 ÷ 100 = 0.4 ต่ำกว่า 0.5 ตำแหน่งจึงยังไม่แม่นพอ นับเป็น FP และวัตถุจริงนั้นกลายเป็น FN"
    },
    {
      "id": "q13",
      "lesson": "u3-l4",
      "level": "ความรู้ความเข้าใจ",
      "answer": "d",
      "explain": "Pose Estimation หาจุดสำคัญ เช่น ไหล่ ศอก ข้อมือ แล้วตัวจำแนกใช้พิกัดเหล่านั้นตัดสินท่าทาง"
    },
    {
      "id": "q14",
      "lesson": "u3-l5",
      "level": "การวิเคราะห์",
      "answer": "c",
      "explain": "มือซ้ายเป็นภาพสะท้อนของมือขวา ตำแหน่งจุดจึงต่างกัน ถ้าข้อมูลฝึกไม่ครอบคลุม โมเดลก็ใช้ไม่ได้ดี"
    },
    {
      "id": "q15",
      "lesson": "u3-l4",
      "level": "การวิเคราะห์",
      "answer": "a",
      "explain": "ต้องคำนึงทั้งความเป็นส่วนตัว (PDPA) ความหลากหลายของข้อมูล และการกำกับดูแลโดยมนุษย์ ตามที่เรียนในหน่วยที่ 1"
    }
  ]
};

/**
 * ตรวจข้อสอบฝั่งเซิร์ฟเวอร์ คำนวณคะแนน เกณฑ์ผ่าน 70% และบันทึกประวัติการสอบ
 * ป้องกันการส่งคำตอบซ้ำด้วย attemptId
 */
function gradeQuizOnServer_(unitId, answers, durationSeconds, attemptId, userId) {
  const qList = OFFICIAL_QUIZ[unitId];
  if (!qList) throw new Error('ไม่พบข้อสอบสำหรับหน่วย ' + unitId);
  if (!attemptId) throw new Error('ต้องระบุ attemptId เพื่อป้องกันการบันทึกซ้ำ');
  if (!userId) throw new Error('ต้องระบุ userId');

  // ตรวจสอบว่า attemptId นี้เคยบันทึกไปแล้วหรือไม่ (Idempotency)
  const existing = findRowById_('QuizAttempts', attemptId);
  if (existing) {
    return {
      duplicate: true,
      attemptId: attemptId,
      score: existing.record.score,
      maxScore: existing.record.maxScore,
      percentage: existing.record.percentage,
      passed: Boolean(existing.record.passed),
      submittedAt: existing.record.submittedAt,
      message: 'ข้อสอบชุดนี้ได้รับการตรวจและบันทึกคะแนนไปแล้ว'
    };
  }

  let score = 0;
  const breakdown = {};

  qList.forEach(function (q) {
    const studentAns = answers && answers[q.id];
    const isCorrect = studentAns === q.answer;
    if (isCorrect) score++;

    breakdown[q.id] = {
      correct: isCorrect,
      studentAnswer: studentAns || null,
      officialAnswer: q.answer,
      explain: q.explain,
      lesson: q.lesson,
      level: q.level
    };
  });

  const maxScore = qList.length;
  const percentage = Math.round((score / maxScore) * 100);
  const passed = percentage >= (APP.passPercent || 70);
  const now = nowIso_();

  // บันทึกลง QuizAttempts
  appendRecord_('QuizAttempts', {
    attemptId: attemptId,
    userId: userId,
    unitId: unitId,
    submittedAt: now,
    score: score,
    maxScore: maxScore,
    percentage: percentage,
    passed: passed,
    durationSeconds: Number(durationSeconds) || 0
  });

  // บันทึกลง AuditLogs
  writeAuditLog(userId, 'QUIZ_SUBMIT', unitId + ':' + attemptId + ':' + score + '/' + maxScore, 'SUCCESS');

  return {
    duplicate: false,
    attemptId: attemptId,
    score: score,
    maxScore: maxScore,
    percentage: percentage,
    passed: passed,
    submittedAt: now,
    durationSeconds: durationSeconds,
    breakdown: breakdown
  };
}

/* =====================================================================
   8) AUTHENTICATION & ACCESS CONTROL (RBAC) (Phase B)
   ===================================================================== */

/* ---------------------------------------------------------------------
   PROGRESS SYNC — เก็บความก้าวหน้าทั้งก้อนเป็น JSON 1 แถวต่อนักเรียน
   --------------------------------------------------------------------- */
const PROGRESS_MAX_JSON = 45000; // ต่ำกว่าเพดานเซลล์ Sheets (50,000 ตัวอักษร)

function str_(v, max) { return typeof v === 'string' ? v.slice(0, max) : null; }
function newer_(a, b) { return !a ? b : !b ? a : (String(b) > String(a) ? b : a); }

/** รับเฉพาะหน่วย/ฟิลด์ที่รู้จัก ตัดความยาว — ข้อมูลจากเบราว์เซอร์เชื่อไม่ได้ */
function sanitizeProgress_(raw) {
  raw = raw && typeof raw === 'object' ? raw : {};
  const ids = function (x) {
    return Array.isArray(x) ? x.filter(function (s) { return typeof s === 'string' && s.length <= 100; }).slice(0, 300) : [];
  };
  const out = { version: 1, updatedAt: str_(raw.updatedAt, 40), lastVisited: null };
  if (raw.lastVisited && SEED_UNITS.some(function (u) { return u.unitId === raw.lastVisited.unitId; })) {
    out.lastVisited = { unitId: raw.lastVisited.unitId, at: str_(raw.lastVisited.at, 40) };
  }
  SEED_UNITS.forEach(function (unit) {
    const r = raw[unit.unitId] && typeof raw[unit.unitId] === 'object' ? raw[unit.unitId] : {};
    const scores = {};
    Object.keys(r.activityScores || {}).slice(0, 100).forEach(function (k) {
      const s = r.activityScores[k] || {};
      if (k.length > 100) return;
      scores[k] = { best: Number(s.best) || 0, last: Number(s.last) || 0, max: Number(s.max) || 0, attempts: Number(s.attempts) || 0, at: str_(s.at, 40) };
    });
    const reflections = {};
    Object.keys(r.reflections || {}).slice(0, 50).forEach(function (k) {
      if (k.length <= 100 && typeof r.reflections[k] === 'string') reflections[k] = r.reflections[k].slice(0, APP.maxText);
    });
    let project = r.project && typeof r.project === 'object' ? r.project : null;
    if (project && JSON.stringify(project).length > 10000) project = null;
    out[unit.unitId] = {
      completedLessons: ids(r.completedLessons),
      completedActivities: ids(r.completedActivities),
      completedPractice: ids(r.completedPractice),
      quizAttempts: [],
      activityScores: scores,
      reflections: reflections,
      project: project,
      completed: r.completed === true,
      visitedAt: str_(r.visitedAt, 40),
      updatedAt: str_(r.updatedAt, 40),
    };
  });
  return out;
}

/** รวมสองก้อน: ความก้าวหน้าเพิ่มขึ้นอย่างเดียว จึง union / ค่ามากสุด / ใหม่กว่า (b = ที่เพิ่งส่งมา) */
function mergeProgress_(a, b) {
  const union = function (x, y) {
    const seen = {}; const out = [];
    x.concat(y).forEach(function (s) { if (!seen[s]) { seen[s] = true; out.push(s); } });
    return out;
  };
  const out = { version: 1, updatedAt: newer_(a.updatedAt, b.updatedAt), lastVisited: null };
  out.lastVisited = !a.lastVisited ? b.lastVisited : !b.lastVisited ? a.lastVisited
    : (String(b.lastVisited.at) > String(a.lastVisited.at) ? b.lastVisited : a.lastVisited);
  SEED_UNITS.forEach(function (unit) {
    const x = a[unit.unitId], y = b[unit.unitId];
    const scores = Object.assign({}, x.activityScores);
    Object.keys(y.activityScores).forEach(function (k) {
      const p = scores[k], q = y.activityScores[k];
      if (!p) { scores[k] = q; return; }
      const latest = String(q.at) > String(p.at) ? q : p;
      scores[k] = { best: Math.max(p.best, q.best), last: latest.last, max: latest.max, attempts: Math.max(p.attempts, q.attempts), at: latest.at };
    });
    const px = x.project, py = y.project;
    out[unit.unitId] = {
      completedLessons: union(x.completedLessons, y.completedLessons),
      completedActivities: union(x.completedActivities, y.completedActivities),
      completedPractice: union(x.completedPractice, y.completedPractice),
      quizAttempts: [],
      activityScores: scores,
      // reflections ไม่มีเวลากำกับ: ข้อความที่เพิ่งส่งมาชนะ
      reflections: Object.assign({}, x.reflections, y.reflections),
      project: !px ? py : !py ? px : (String(py.updatedAt) >= String(px.updatedAt) ? py : px),
      completed: x.completed || y.completed,
      visitedAt: newer_(x.visitedAt, y.visitedAt),
      updatedAt: newer_(x.updatedAt, y.updatedAt),
    };
  });
  return out;
}

/** ประวัติสอบมาจากชีต QuizAttempts ที่เซิร์ฟเวอร์ตรวจเองเท่านั้น (นักเรียนแก้คะแนนไม่ได้) */
function attachQuizAttempts_(progress, userId) {
  readAll_('QuizAttempts')
    .filter(function (r) { return sameId_(r.userId, userId) && progress[r.unitId]; })
    .sort(function (p, q) { return String(p.submittedAt) < String(q.submittedAt) ? -1 : 1; })
    .forEach(function (r) {
      progress[r.unitId].quizAttempts.push({
        correct: Number(r.score) || 0,
        total: Number(r.maxScore) || 0,
        percent: Number(r.percentage) || 0,
        passed: r.passed === true || String(r.passed).toUpperCase() === 'TRUE',
        at: String(r.submittedAt),
        durationSec: Number(r.durationSeconds) || 0,
        attemptId: String(r.attemptId),
      });
    });
  SEED_UNITS.forEach(function (u) { progress[u.unitId].quizAttempts = progress[u.unitId].quizAttempts.slice(-20); });
  return progress;
}

/* ---------------------------------------------------------------------
   SCORE LOG — 1 แถวต่อการส่ง 1 ครั้ง (มินิเกม/แบบทดสอบหลังเรียน) ให้ครูเปิดดูในชีตได้ตรงๆ
   --------------------------------------------------------------------- */
const SCORE_ITEM_NAMES = {
  'u1-a1': 'ด่าน 1: AI or Not AI',
  'u1-a2': 'ด่าน 2: Timeline Challenge',
  'u1-a3': 'ด่าน 3: Tech Explorer',
  'u1-a4': 'ด่าน 4: Ethics Challenge',
  'u1-a5': 'ด่าน 5: Deepfake Detective',
  'posttest': 'แบบทดสอบหลังเรียน',
};

function logScore_(user, unitId, scoreType, itemId, score, maxScore, passed) {
  score = Number(score) || 0;
  maxScore = Number(maxScore) || 0;
  appendRecord_('ScoreLog', {
    logId: 'SCR-' + Utilities.getUuid().slice(0, 8),
    submittedAt: nowIso_(),
    userId: String(user.userId),
    displayName: user.displayName || '',
    classroom: user.classroom || '',
    unitId: unitId,
    scoreType: scoreType,
    itemId: itemId,
    itemName: SCORE_ITEM_NAMES[itemId] || itemId,
    score: score,
    maxScore: maxScore,
    percentage: maxScore ? Math.round((score / maxScore) * 100) : 0,
    passed: passed === null || passed === undefined ? '' : Boolean(passed),
  });
}

function syncProgress_(user, payload) {
  const incoming = sanitizeProgress_(payload.progress);
  const found = findRowById_('ProgressSnapshots', user.userId);
  let stored = null;
  if (found && found.record.progressJson) {
    try { stored = sanitizeProgress_(JSON.parse(found.record.progressJson)); } catch (e) { stored = null; }
  }
  const merged = attachQuizAttempts_(stored ? mergeProgress_(stored, incoming) : incoming, user.userId);
  const json = JSON.stringify(merged);
  if (json.length > PROGRESS_MAX_JSON) throw new Error('PROGRESS_TOO_LARGE');
  const percent = Math.max(0, Math.min(100, Math.round(Number(payload.overallPercent) || 0)));
  // userId ใส่ ' นำหน้าเพื่อให้เป็นข้อความเสมอ, progressJson เขียนตรงเพราะ toCell_ ตัดที่ 2,000 ตัวอักษร
  const row = ["'" + user.userId, cleanText_(user.classroom || '', 40), json, percent, toCell_(merged.updatedAt), nowIso_()];
  const sh = getSheet_('ProgressSnapshots');
  if (found) sh.getRange(found.rowIndex, 1, 1, row.length).setValues([row]);
  else sh.appendRow(row);
  return merged;
}

/**
 * ยืนยันตัวตนผ่าน Google ID Token (Google Identity Services)
 * ตรวจสอบความถูกต้องของ Token ผ่าน Google OAuth2 Tokeninfo Endpoint
 */
function verifyGoogleIdToken_(idToken) {
  if (!idToken) throw new Error('MISSING_TOKEN');

  // สำหรับการทดสอบจำลอง: ปิดไว้เป็นค่าเริ่มต้น เพราะใครก็ปลอม token นี้เป็นอีเมลครูได้
  if (idToken.startsWith('DEMO_MOCK_TOKEN:')) {
    if (PropertiesService.getScriptProperties().getProperty('ALLOW_DEMO_TOKENS') !== 'true') {
      throw new Error('Demo token ถูกปิดใช้งานบนเซิร์ฟเวอร์นี้');
    }
    const parts = idToken.split(':');
    return {
      sub: parts[1] || 'demo-sub',
      email: (parts[2] || 'demo@pcccr.ac.th').toLowerCase(),
      name: parts[3] || 'Demo Student',
      isDemo: true
    };
  }

  const url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken);
  let resp;
  try {
    resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  } catch (e) {
    throw new Error('ไม่สามารถติดต่อ Google Auth Server: ' + e.message);
  }

  if (resp.getResponseCode() !== 200) {
    throw new Error('Google ID Token ไม่ถูกต้องหรือหมดอายุ');
  }

  const info = JSON.parse(resp.getContentText());
  if (info.email_verified !== 'true' && info.email_verified !== true) {
    throw new Error('อีเมล Google นี้ยังไม่ได้รับการยืนยัน');
  }

  // ตรวจสอบ Google OAuth Client ID ถ้ามีการตั้งค่าใน Script Properties
  const expectedClientId = PropertiesService.getScriptProperties().getProperty('GOOGLE_CLIENT_ID');
  if (expectedClientId && info.aud !== expectedClientId) {
    throw new Error('Token Client ID mismatch');
  }

  return {
    sub: info.sub,
    email: String(info.email).toLowerCase(),
    name: info.name || info.email.split('@')[0],
    isDemo: false
  };
}

/**
 * ค้นหาหรือลงทะเบียนผู้ใช้ในระบบ และคืนค่าโปรไฟล์พร้อม Role ที่แท้จริงจากฐานข้อมูล
 */
function authenticateAndResolveUser_(authPayload) {
  if (!authPayload || !authPayload.idToken) {
    throw new Error('ต้องส่ง idToken เพื่อยืนยันตัวตน');
  }

  const verified = verifyGoogleIdToken_(authPayload.idToken);
  const email = verified.email;
  const sub = verified.sub;

  const users = readAll_('Users');
  let user = null;

  // ค้นหาตาม googleSub หรือ email
  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    if ((u.googleSub && String(u.googleSub) === sub) || (u.email && String(u.email).toLowerCase() === email)) {
      user = u;
      break;
    }
  }

  const now = nowIso_();

  if (!user) {
    // ผู้ใช้ใหม่: ลงทะเบียนอัตโนมัติ
    // ตรวจสอบว่าอีเมลตรงกับรายการครูผู้สอนหรือไม่
    const teacherEmails = (PropertiesService.getScriptProperties().getProperty('TEACHER_EMAILS') || '')
      .toLowerCase().split(',').map(function (s) { return s.trim(); });

    let role = 'STUDENT';
    if (teacherEmails.indexOf(email) >= 0) {
      role = 'TEACHER';
    }

    const userId = 'USR-' + Utilities.getUuid().slice(0, 8);
    const classroom = authPayload.classroom && isClassroom_(authPayload.classroom) ? authPayload.classroom : '';

    const newRecord = {
      userId: userId,
      googleSub: sub,
      email: email,
      displayName: cleanText_(authPayload.displayName || verified.name, 100),
      classroom: classroom,
      role: role,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };

    appendRecord_('Users', newRecord);
    writeAuditLog(userId, 'USER_REGISTER', email, 'SUCCESS');
    user = newRecord;
  } else {
    // อัปเดต googleSub หรือ displayName ถ้ายังไม่มี
    const patch = {};
    if (!user.googleSub && sub) patch.googleSub = sub;
    if (authPayload.classroom && isClassroom_(authPayload.classroom) && !user.classroom) {
      patch.classroom = authPayload.classroom;
    }
    if (Object.keys(patch).length > 0) {
      patch.updatedAt = now;
      user = updateRecord_('Users', user.userId, patch);
    }
  }

  if (user.status === 'SUSPENDED') {
    writeAuditLog(user.userId, 'AUTH_BLOCKED', 'User is SUSPENDED', 'DENIED');
    throw new Error('บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อคุณครูผู้ดูแลระบบ');
  }

  return user;
}

/**
 * Session สำหรับผู้ใช้ที่เข้าระบบด้วยรหัสประจำตัว (ไม่มี Google idToken)
 * เก็บใน CacheService อายุ 6 ชั่วโมง (เพดานของ CacheService) — หมดอายุแล้วต้องเข้าระบบใหม่
 */
const SESSION_TTL_SEC = 21600;

function createSession_(user) {
  const token = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, '');
  const session = { userId: user.userId, role: user.role, classroom: user.classroom, displayName: user.displayName };
  CacheService.getScriptCache().put('sess:' + token, JSON.stringify(session), SESSION_TTL_SEC);
  return token;
}

function resolveUser_(payload) {
  if (payload && payload.sessionToken) {
    const raw = CacheService.getScriptCache().get('sess:' + String(payload.sessionToken));
    if (!raw) throw new Error('SESSION_EXPIRED');
    return JSON.parse(raw);
  }
  return authenticateAndResolveUser_(payload);
}

/**
 * ตรวจสอบสิทธิ์ (RBAC Guard)
 */
function requireRole_(user, allowedRoles) {
  if (!user || allowedRoles.indexOf(user.role) < 0) {
    writeAuditLog(user ? user.userId : 'ANON', 'RBAC_VIOLATION', 'Required: ' + allowedRoles.join(','), 'DENIED');
    throw new Error('FORBIDDEN: สิทธิ์การเข้าถึงไม่เพียงพอ (ต้องการ ' + allowedRoles.join('/') + ')');
  }
}

/* =====================================================================
   9) WEB API ROUTER & CONTROLLER (doGet & doPost) (Phase B, C, D)
   ===================================================================== */

/**
 * Handle HTTP GET — ตรวจสอบสถานะการทำงานของ API
 */
function doGet(e) {
  const p = e && e.parameter ? e.parameter : {};
  const action = p.action || 'ping';

  if (action === 'ping') {
    return jsonResponse_({
      status: 'online',
      app: APP.name,
      courseCode: APP.courseCode,
      version: APP.schemaVersion,
      timestamp: nowIso_()
    });
  }

  if (action === 'check') {
    try {
      const dbStatus = checkDatabase();
      return jsonResponse_({ success: true, database: dbStatus });
    } catch (err) {
      return jsonResponse_({ success: false, error: err.message });
    }
  }

  if (action === 'login') {
    try {
      const user = loginWithUsernamePassword_(p.username, p.password);
      return jsonResponse_({ success: true, user: user });
    } catch (err) {
      return jsonResponse_({ success: false, error: err.message });
    }
  }

  return jsonResponse_({ success: false, error: 'Unknown GET action: ' + action });
}

/**
 * Handle HTTP POST — จัดการคำขอแบบ API สำหรับ Frontend
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(APP.lockWaitMs);
  } catch (lockErr) {
    return jsonResponse_({ success: false, error: 'ระบบกำลังประมวลผลคำขอจำนวนมาก กรุณาลองใหม่อีกครั้ง' });
  }

  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (pe) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action;
    if (!action) {
      return jsonResponse_({ success: false, error: 'Missing action parameter' });
    }

    let responseData = null;

    // 0. Auth: Login with Username & Password (Google Sheets Users sheet)
    if (action === 'login') {
      const user = loginWithUsernamePassword_(payload.username, payload.password);
      user.sessionToken = createSession_(user);
      responseData = { success: true, user: user };
    }

    // 1. Auth: Verify / Register / Get Profile
    else if (action === 'auth/verify') {
      const user = authenticateAndResolveUser_(payload);
      responseData = {
        success: true,
        user: {
          userId: user.userId,
          email: user.email,
          displayName: user.displayName,
          classroom: user.classroom,
          role: user.role,
          status: user.status
        }
      };
    }

    // 2. Auth: Update Classroom / Display Name
    else if (action === 'auth/updateProfile') {
      const user = authenticateAndResolveUser_(payload);
      const patch = {};
      if (payload.classroom && isClassroom_(payload.classroom)) patch.classroom = payload.classroom;
      if (payload.displayName) patch.displayName = cleanText_(payload.displayName, 100);
      patch.updatedAt = nowIso_();
      const updated = updateRecord_('Users', user.userId, patch);
      responseData = { success: true, user: updated };
    }

    // 3. Quiz: Server-Side Grading & Submit (Phase C)
    else if (action === 'quiz/submit') {
      const user = resolveUser_(payload);
      const result = gradeQuizOnServer_(
        payload.unitId,
        payload.answers,
        payload.durationSeconds,
        payload.attemptId,
        user.userId
      );
      if (!result.duplicate) {
        logScore_(user, payload.unitId, 'POSTTEST', 'posttest', result.score, result.maxScore, result.passed);
      }
      responseData = { success: true, result: result };
    }

    // 3b. Mini-game: record a stage score (graded in the browser)
    else if (action === 'activity/submit') {
      const user = resolveUser_(payload);
      const unitId = String(payload.unitId || '');
      const actId = String(payload.actId || '');
      const max = Number(payload.max), score = Number(payload.score);
      if (!SEED_UNITS.some(function (u) { return u.unitId === unitId; })) throw new Error('ไม่รู้จักหน่วย ' + unitId);
      if (!/^[a-z0-9-]{1,40}$/.test(actId)) throw new Error('รหัสกิจกรรมไม่ถูกต้อง');
      if (!(max >= 1 && max <= 100 && score >= 0 && score <= max)) throw new Error('คะแนนไม่ถูกต้อง');
      logScore_(user, unitId, 'MINIGAME', actId, score, max, null);
      responseData = { success: true };
    }

    // 4. Progress: Get Student Progress (Phase C)
    else if (action === 'progress/get') {
      const user = resolveUser_(payload);
      const targetUserId = (user.role === 'TEACHER' || user.role === 'ADMIN') && payload.targetUserId
        ? payload.targetUserId
        : user.userId;

      const progressRows = readAll_('Progress').filter(function (r) {
        return String(r.userId) === String(targetUserId);
      });
      const attempts = readAll_('QuizAttempts').filter(function (r) {
        return String(r.userId) === String(targetUserId);
      });
      const projects = readAll_('Projects').filter(function (r) {
        return String(r.userId) === String(targetUserId);
      });

      responseData = {
        success: true,
        userId: targetUserId,
        progress: progressRows,
        quizAttempts: attempts,
        projects: projects
      };
    }

    // 5. Progress: Save Lesson / Activity Completion (Phase C)
    else if (action === 'progress/saveLesson') {
      const user = resolveUser_(payload);
      const unitId = payload.unitId;
      const lessonId = payload.lessonId;
      if (!unitId || !lessonId) throw new Error('Missing unitId or lessonId');

      const existing = readAll_('Progress').find(function (r) {
        return String(r.userId) === user.userId && String(r.lessonId) === lessonId;
      });

      const now = nowIso_();
      if (!existing) {
        appendRecord_('Progress', {
          progressId: 'PRG-' + Utilities.getUuid().slice(0, 8),
          userId: user.userId,
          unitId: unitId,
          lessonId: lessonId,
          activityId: '',
          completionStatus: 'COMPLETED',
          updatedAt: now
        });
      } else {
        updateRecord_('Progress', existing.progressId, {
          completionStatus: 'COMPLETED',
          updatedAt: now
        });
      }
      responseData = { success: true, lessonId: lessonId, status: 'COMPLETED' };
    }

    // 6. Project: Submit Capstone Project (Phase C)
    else if (action === 'project/submit') {
      const user = resolveUser_(payload);
      const projectId = payload.projectId || ('PRJ-' + Utilities.getUuid().slice(0, 8));
      const now = nowIso_();

      const existing = findRowById_('Projects', projectId);
      if (existing) {
        if (existing.record.userId !== user.userId && user.role === 'STUDENT') {
          throw new Error('FORBIDDEN: ไม่อนุญาตให้แก้ไขโครงงานของผู้อื่น');
        }
        updateRecord_('Projects', projectId, {
          projectTitle: cleanText_(payload.projectTitle, 200),
          description: cleanText_(payload.description, 4000),
          evidenceLink: cleanText_(payload.evidenceLink, 500),
          status: 'SUBMITTED',
          submittedAt: now
        });
      } else {
        appendRecord_('Projects', {
          projectId: projectId,
          userId: user.userId,
          unitId: 'unit4',
          projectTitle: cleanText_(payload.projectTitle, 200),
          description: cleanText_(payload.description, 4000),
          status: 'SUBMITTED',
          evidenceLink: cleanText_(payload.evidenceLink, 500),
          submittedAt: now
        });
      }
      writeAuditLog(user.userId, 'PROJECT_SUBMIT', projectId, 'SUCCESS');
      responseData = { success: true, projectId: projectId, status: 'SUBMITTED' };
    }

    // 7. Teacher: Get Roster with Scores & Progress (Phase D)
    else if (action === 'teacher/getRoster') {
      const user = resolveUser_(payload);
      requireRole_(user, ['TEACHER', 'ADMIN']);

      const classroom = payload.classroom; // filter by classroom or 'all'
      const allUsers = readAll_('Users').filter(function (u) {
        return u.role === 'STUDENT';
      });

      const allAttempts = readAll_('QuizAttempts');
      const allProgress = readAll_('Progress');
      const allProjects = readAll_('Projects');
      const allAssessments = readAll_('Assessments');

      const roster = allUsers
        .filter(function (u) {
          return !classroom || classroom === 'all' || u.classroom === classroom;
        })
        .map(function (u) {
          const userAttempts = allAttempts.filter(function (a) { return a.userId === u.userId; });
          const userProgress = allProgress.filter(function (p) { return p.userId === u.userId && p.completionStatus === 'COMPLETED'; });
          const userProject = allProjects.find(function (p) { return p.userId === u.userId; });
          const userAssess = allAssessments.filter(function (as) { return as.userId === u.userId; });

          // Best quiz scores per unit
          const bestScores = { unit1: 0, unit2: 0, unit3: 0 };
          userAttempts.forEach(function (a) {
            if (bestScores[a.unitId] === undefined || a.percentage > bestScores[a.unitId]) {
              bestScores[a.unitId] = a.percentage;
            }
          });

          return {
            userId: u.userId,
            displayName: u.displayName,
            email: u.email,
            classroom: u.classroom,
            status: u.status,
            completedLessonsCount: userProgress.length,
            quizScores: bestScores,
            projectStatus: userProject ? userProject.status : 'NOT_STARTED',
            projectTitle: userProject ? userProject.projectTitle : '',
            latestAssessment: userAssess.length ? userAssess[userAssess.length - 1] : null,
            updatedAt: u.updatedAt
          };
        });

      responseData = { success: true, classroom: classroom || 'all', roster: roster };
    }

    // 8. Teacher: Assess Project & Give Feedback (Phase D)
    else if (action === 'teacher/assessProject') {
      const user = resolveUser_(payload);
      requireRole_(user, ['TEACHER', 'ADMIN']);

      const assessmentId = 'ASM-' + Utilities.getUuid().slice(0, 8);
      const now = nowIso_();

      appendRecord_('Assessments', {
        assessmentId: assessmentId,
        userId: payload.studentUserId,
        unitId: 'unit4',
        projectId: payload.projectId || '',
        rubricScores: JSON.stringify(payload.rubricScores || {}),
        totalScore: Number(payload.totalScore) || 0,
        maxScore: Number(payload.maxScore) || 16,
        feedback: cleanText_(payload.feedback || '', 1000),
        teacherId: user.userId,
        updatedAt: now
      });

      if (payload.projectId) {
        try {
          updateRecord_('Projects', payload.projectId, { status: 'ASSESSED' });
        } catch (e) {
          // ignore if project row doesn't exist
        }
      }

      writeAuditLog(user.userId, 'PROJECT_ASSESS', payload.studentUserId + ':' + assessmentId, 'SUCCESS');
      responseData = { success: true, assessmentId: assessmentId };
    }

    // 9. Teacher: Summary Analytics across Classrooms (Phase D)
    else if (action === 'teacher/getAnalytics') {
      const user = resolveUser_(payload);
      requireRole_(user, ['TEACHER', 'ADMIN']);

      const users = readAll_('Users').filter(function (u) { return u.role === 'STUDENT'; });
      const attempts = readAll_('QuizAttempts');
      const projects = readAll_('Projects');

      const classStats = {};
      APP.classrooms.forEach(function (c) {
        classStats[c] = { total: 0, passedU1: 0, passedU2: 0, passedU3: 0, submittedProjects: 0 };
      });

      users.forEach(function (u) {
        if (classStats[u.classroom]) {
          classStats[u.classroom].total++;
          const uAttempts = attempts.filter(function (a) { return a.userId === u.userId && a.passed; });
          if (uAttempts.some(function (a) { return a.unitId === 'unit1'; })) classStats[u.classroom].passedU1++;
          if (uAttempts.some(function (a) { return a.unitId === 'unit2'; })) classStats[u.classroom].passedU2++;
          if (uAttempts.some(function (a) { return a.unitId === 'unit3'; })) classStats[u.classroom].passedU3++;
          if (projects.some(function (p) { return p.userId === u.userId && (p.status === 'SUBMITTED' || p.status === 'ASSESSED'); })) {
            classStats[u.classroom].submittedProjects++;
          }
        }
      });

      responseData = { success: true, classStats: classStats, totalStudents: users.length };
    }

    // 10. Progress: Sync whole progress snapshot (merge with server copy)
    else if (action === 'progress/sync') {
      const user = resolveUser_(payload);
      responseData = { success: true, progress: syncProgress_(user, payload) };
    }

    else {
      return jsonResponse_({ success: false, error: 'Unknown API action: ' + action });
    }

    return jsonResponse_(responseData);
  } catch (err) {
    return jsonResponse_({ success: false, error: err.message });
  } finally {
    lock.releaseLock();
  }
}

/**
 * ตัวช่วยสร้าง HTTP JSON Response พร้อม CORS Header
 */
function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ฟังก์ชันตรวจสอบการเข้าสู่ระบบด้วย Username & Password จากแผ่นงาน Users
 */
function loginWithUsernamePassword_(username, password) {
  const uClean = String(username || '').trim();
  const pClean = String(password || '').trim();
  if (!uClean || !pClean) {
    throw new Error('กรุณากรอกรหัสประจำตัว (Username) และรหัสผ่าน (Password)');
  }

  // กำหนด Spreadsheet ID ของ KruNok AI Academy
  const targetId = '19TFaVI3mof8KipcstjbtgfYL7Qmywo4xk7vxdnt9oNw';
  let ss = null;
  try {
    ss = SpreadsheetApp.openById(targetId);
  } catch (e) {
    try {
      ss = getDb_();
    } catch (dbErr) {
      throw new Error('ไม่สามารถเข้าถึง Google Sheets ได้: ' + e.message);
    }
  }

  if (!ss) {
    throw new Error('ไม่พบฐานข้อมูล Google Sheets');
  }

  const sheet = ss.getSheetByName('Users');
  if (!sheet) {
    throw new Error('ไม่พบแผ่นงานชื่อ Users ใน Google Sheet');
  }

  const data = sheet.getDataRange().getValues();
  if (!data || data.length < 2) {
    throw new Error('ไม่พบข้อมูลผู้ใช้ในตาราง Users');
  }

  // Row 0 is header: ["class","no","username","psssword","title","name","lastname"]
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowClass = String(row[0] != null ? row[0] : '').trim();
    const rowNo = String(row[1] != null ? row[1] : '').trim();
    const rowUser = String(row[2] != null ? row[2] : '').trim();
    const rowPass = String(row[3] != null ? row[3] : '').trim();
    const rowTitle = String(row[4] != null ? row[4] : '').trim();
    const rowName = String(row[5] != null ? row[5] : '').trim();
    const rowLastname = String(row[6] != null ? row[6] : '').trim();

    if (rowUser === uClean && rowPass === pClean) {
      const isTeacher = rowClass === '0' || rowTitle.indexOf('ครู') !== -1;
      const role = isTeacher ? 'TEACHER' : 'STUDENT';
      const classroom = isTeacher ? 'ครูผู้สอน' : (rowClass.indexOf('ม.') === 0 ? rowClass : 'ม.5/' + rowClass);
      const firstName = rowName.trim() || rowUser;
      const fullName = (rowTitle + rowName + ' ' + rowLastname).trim() || rowUser;
      const displayName = firstName; // แสดงเฉพาะชื่อจริง

      return {
        id: rowUser,
        userId: rowUser,
        username: rowUser,
        title: rowTitle,
        name: rowName,
        lastname: rowLastname,
        displayName: displayName,
        classroom: classroom,
        no: Number(rowNo) || 1,
        role: role,
        email: isTeacher ? 'krunok@pcccr.ac.th' : rowUser + '@student.pcccr.ac.th',
        status: 'ACTIVE',
        mode: 'sheets',
        joinedAt: new Date().toISOString(),
        signedIn: true
      };
    }
  }

  throw new Error('รหัสประจำตัว (Username) หรือรหัสผ่าน (Password) ไม่ถูกต้อง');
}

