# KruNok AI Academy: Backend Phase 1 (Database)

This is the backend for รายวิชา ว32281 ปัญญาประดิษฐ์เบื้องต้น ม.5/1–ม.5/6, taught by นางมนัสชนก ตามวงค์ (Kru Nok).

Status: **Phase 1 code is complete but has not yet been run on real Google Sheets.** It is confirmed only after Kru Nok follows the steps below and `testDatabaseReadWrite()` returns `PASS`.

---

## 0. Environment check of the existing site

| Item | Finding |
|---|---|
| Site type | **Claude Artifact**: a React 18 SPA in a single file. JSX is precompiled. Hash routing: `#login #home #unit1–#unit4` |
| Current data | `localStorage` (keys `aira_v32281_user`, `aira_v32281_progress_v1`). Labelled **Demo Mode** |
| Connecting to Apps Script | **Not possible from the artifact.** The artifact's Content-Security-Policy blocks `fetch()` to `script.google.com` and other outside hosts. A direct connection cannot be assumed |
| Quiz answer keys | Currently in client code (U1/U2/U3_QUIZ). They must move to the server in Phase 3 |
| Model and image files | COCO-SSD weights and sample images are published as artifact files. They must move to the new host in Phase 6 |

### Recommended architecture

**Option A (recommended): put the frontend in Apps Script HTML Service in the same project as Code.gs.**
- The browser calls the server with `google.script.run`, not `fetch`. That avoids CORS and CSP problems.
- Deploy the Web App with **Execute as: Me** and **Who has access: everyone in the school domain** (pcccr.ac.th).
- Google's documentation states that `Session.getActiveUser().getEmail()` returns the email of the person using the app when that person is in the same Google Workspace domain as the developer. If the email comes back empty, access is denied. ([Class Session](https://developers.google.com/apps-script/reference/base/session))
- `Session.getEffectiveUser()` is **not used** to identify users, because under "Execute as me" it returns the script owner's account.
- Students **do not need access** to the Spreadsheet. Every read and write goes through server functions that check permissions.
- Prerequisite: students must sign in with a school Google Workspace account (@pcccr.ac.th). **This must be confirmed before Phase 2.**

**Option B: host the frontend elsewhere (Firebase Hosting, GitHub Pages, etc.).**
- Requires Google Identity Services (ID token) plus server-side verification of the signature, aud, iss and exp.
- Apps Script has no built-in RSA verify function, so a JWT verification library must be added. Web App responses also have CORS limits.
- More complex. Use this only if Option A is not possible.

The current Claude Artifact remains as the **Demo Mode** version and is not deleted.

---

## 1. Schema: KruNok_AI_Academy_DB

| Sheet | Columns (in order) | Primary key | Notes |
|---|---|---|---|
| Users | userId, googleSub, email, displayName, classroom, role, status, createdAt, updatedAt | userId | role = STUDENT/TEACHER/ADMIN; status = PENDING/ACTIVE/SUSPENDED |
| Units | unitId, unitName, totalLessons, passingPercent, status | unitId | Seeded with unit1–unit4 |
| Lessons | lessonId, unitId, lessonName, sequence, status | lessonId | Seeded with 22 lessons, using the same IDs as the website |
| Progress | progressId, userId, unitId, lessonId, activityId, completionStatus, updatedAt | progressId | NOT_STARTED/IN_PROGRESS/COMPLETED |
| QuizAttempts | attemptId, userId, unitId, submittedAt, score, maxScore, percentage, passed, durationSeconds | attemptId | The unique attemptId prevents duplicate saves (Phase 3) |
| Projects | projectId, userId, unitId, projectTitle, description, status, evidenceLink, submittedAt | projectId | DRAFT/SUBMITTED/RETURNED/ASSESSED |
| Assessments | assessmentId, userId, unitId, projectId, rubricScores, totalScore, maxScore, feedback, teacherId, updatedAt | assessmentId | Each assessment is a new row, so the full history is kept |
| AuditLogs | logId, timestamp, actorId, action, targetId, result | logId | Append-only. SUCCESS/DENIED/ERROR |

Seeded lessons:
- u1-l1…u1-l6
- u2-l1…u2-l5
- u3-l1…u3-l5
- u4-s1…u4-s6

The pass mark is 70% for every unit, matching `QUIZ_PASS_PERCENT` on the website. The teacher can edit the Units sheet, and setup will not overwrite those edits.

## 2. What Phase 1 code does

- **`setupDatabase()`**
  - Creates the database, or repairs only the parts that are missing.
  - **Never deletes and never overwrites existing rows.** If an existing sheet's headers don't match the schema, it stops and reports the problem.
  - Freezes the header row, sets a protection warning on headers, and adds dropdown validation to role/status columns.
  - Records the account running setup as ADMIN. `googleSub` is filled in at the first successful login in Phase 2.
- **`checkDatabase()`**: checks the structure, read-only.
- **`testDatabaseReadWrite()`**: writes one row to AuditLogs and reads it back to compare. It prints **PASS** only when both match.
- **`writeAuditLog()`** plus row read/write helpers (`readAll_`, `findRowById_`, `appendRecord_`, `updateRecord_`) for use in later phases.
- **Protections:**
  - Script Lock during setup.
  - Strips control characters and limits text length.
  - Neutralises cell formulas (text starting with `= + - @` is stored as plain text).
  - Primary keys cannot be edited.
  - If the original database file can't be opened, setup **will not silently create a new one**.
- Function names ending in `_` are private and cannot be called from the browser.

## 3. Installation (about 10 minutes)

1. Sign in to Google with **the teacher's school account** (the one that will own the data).
2. Go to <https://script.google.com>, click **New project**, and rename it `KruNok AI Academy Backend`.
3. Open **Project Settings** (gear icon) and tick **Show "appsscript.json" manifest file in editor**.
4. Open `appsscript.json` in the editor, replace everything with the contents of the `appsscript.json` file provided, and save.
5. Open `Code.gs`, delete the existing code, paste in the whole `Code.gs` file provided, and save (Ctrl+S).
6. Select the function **`setupDatabase`** from the dropdown and click **Run**.
   - The first run asks for permission. Click Review permissions, choose the school account, then Allow. If you see "Google hasn't verified this app", click Advanced, then Go to … (this is your own script).
   - Wait for **Execution completed**. The Execution log shows the report: `created`, `seeded`, and `url`.
7. Select **`testDatabaseReadWrite`** and click **Run**. The log must show `"result": "PASS"`.
8. Select **`checkDatabase`** and click **Run**. Every sheet must show `OK (n rows)`.
9. Open the Spreadsheet using the URL in the log, then check:
   - there are 8 sheets with the column headers listed above;
   - Units has 4 rows and Lessons has 22 rows;
   - Users has one ADMIN row (the teacher's email);
   - AuditLogs has rows for SETUP_DATABASE and DB_READ_WRITE_TEST.
10. **Do not share the Spreadsheet with students.** Share it only with co-teachers who need it, and only as Viewer or Editor as appropriate.

Running `setupDatabase()` again is safe: it adds only what is missing.

### Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `เปิดฐานข้อมูลเดิม (...) ไม่ได้` | The file was moved or deleted, or the account has no access. Open the file to check. To create a new one on purpose: Project Settings → Script Properties → delete `DB_SPREADSHEET_ID` → run setup again |
| `หัวคอลัมน์ไม่ตรง Schema` | Someone edited a column header. Change it back to the name shown in the error, then run again |
| Report says `อ่านอีเมลผู้รันไม่ได้` | Add your own row to the Users sheet (role = ADMIN, status = ACTIVE) |

## 4. Test results so far (honest status)

| Test | Result |
|---|---|
| Logic tests against simulated Apps Script services (in-memory Node.js mock), 17 cases: creating 8 sheets, exact headers, seeding 4 units / 22 lessons, idempotent on re-run, not overwriting teacher edits, stopping on header mismatch, formula guard, read/write test, blank email | **17/17 pass** |
| Run on real Google Apps Script and Google Sheets | **Not tested yet.** Waiting for Kru Nok to do steps 6–8 |
| Authentication / score saving / student–teacher separation | Not built yet (Phases 2–4) |

**The system is not ready for real use.** The connection counts as working only once `testDatabaseReadWrite()` shows PASS on the real account.

## 5. Next phases

| Phase | Work | Key points |
|---|---|---|
| 2 Authentication | `doGet()`, `getCurrentUser()`, register a student (classroom) as PENDING, teacher approval | Identity comes from the server (Option A) and never from values sent by the browser. Every function checks permissions. Blank email means access denied |
| 3 Score saving | `submitQuiz()` grades on the server from `QuizKeys` (Script Properties); `saveLessonProgress()`, `saveActivityResult()`, `getMyProgress()`, `getMyQuizHistory()` | LockService plus a unique attemptId. No answer keys sent to the client. Never trust scores from the browser |
| 4 Teacher Dashboard | `/teacher` (#teacher): `getTeacherDashboard()`, `getStudentsByClass()`, `getStudentScores()`, `exportClassReport()` | Only TEACHER/ADMIN. Charts and classroom filter |
| 5 Project Assessment | `getMyProjects()`, `saveProject()`, `saveTeacherAssessment()` | 20-point rubric. History kept in Assessments and AuditLogs |
| 6 Integration and testing | Move the React build into HTML Service. Data Service separates Demo and Production. Model files hosted on jsdelivr | Old localStorage scores are not uploaded as official scores. Real tests: student account, teacher account, impersonation attempts |
