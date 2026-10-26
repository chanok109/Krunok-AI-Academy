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
  const id = PropertiesService.getScriptProperties().getProperty(APP.propDbId);
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
  const id = PropertiesService.getScriptProperties().getProperty(APP.propDbId);
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
  return cleanText_(v);
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
  const id = props.getProperty(APP.propDbId);
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
