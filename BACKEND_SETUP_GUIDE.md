# คู่มือการติดตั้งและเชื่อมต่อ BACKEND (Google Apps Script + Google Sheets)
**โครงการ:** KruNok AI Academy (ว32281 ปัญญาประดิษฐ์เบื้องต้น ม.5)  
**โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เชียงราย**  
**ครูผู้สอน:** นางมนัสชนก ตามวงค์ (Kru Nok)  
**เอกสารสำหรับ:** Phase A & Phase B (Database, Secure Authentication, Server Grading & Teacher Dashboard)

---

## 1. การวิเคราะห์สถาปัตยกรรมการโฮสต์และความปลอดภัย (Hosting Architecture)

### ทางเลือกที่ 1 (แนะนำและนำมาใช้งานจริง): Decoupled Modern Architecture (Vite Frontend + GAS Web App REST API)
- **Frontend:** โฮสต์ด้วย Static Web Hosting ที่รวดเร็ว (GitHub Pages, Vercel, Firebase Hosting หรือเซิร์ฟเวอร์ Intranet โรงเรียน)
- **Backend:** Google Apps Script Web App (`doPost(e)` / `doGet(e)`) ผูกกับ Google Spreadsheet `KruNok_AI_Academy_DB`
- **การยืนยันตัวตน:** 
  - ใช้ **Google Identity Services (ID Token / JWT)**
  - เซิร์ฟเวอร์ตรวจสอบความถูกต้องผ่าน Google OAuth2 Tokeninfo Endpoint (`https://oauth2.googleapis.com/tokeninfo`)
  - ตรวจสอบ `email_verified == true`, ตรวจสอบโดเมน `@pcccr.ac.th`, และอ่าน Role (`STUDENT`, `TEACHER`, `ADMIN`) จากแผ่นงาน `Users` บนเซิร์ฟเวอร์
- **ข้อดี:**
  - ไคลเอนต์ไม่สามารถแก้ไขคะแนนหรือปลอมแปลง Role ได้เด็ดขาด
  - นักเรียน **ไม่มีสิทธิ์เข้าถึง Google Spreadsheet โดยตรง** แม้แต่สิทธิ์ Viewer ทุกคำขอต้องผ่านเซิร์ฟเวอร์
  - นักเรียนไม่สามารถแอบอ่านเฉลยข้อสอบได้ เพราะเฉลยทางการถูกย้ายมาตรวจที่ฝั่งเซิร์ฟเวอร์
  - ป้องกันการส่งคำตอบซ้ำด้วย `attemptId` (Idempotent Submission)
  - รองรับการทำงานแบบออฟไลน์/ทดลองเรียน (Demo Mode) ได้อย่างราบรื่น
- **ข้อพิจารณา:**
  - ต้องตั้งค่า Web App ใน Apps Script เป็น **Execute as: Me (เจ้าของสคริปต์/ครูนก)** และ **Who has access: Anyone** เพื่อให้ Frontend สามารถยิงคำขอ POST ข้าม Origin ได้

---

## 2. โครงสร้างฐานข้อมูล Google Sheets ทั้ง 8 แผ่นงาน (Database Schema)

เมื่อรัน `setupDatabase()` สคริปต์จะสร้าง Spreadsheet ชื่อ **`KruNok_AI_Academy_DB`** พร้อม 8 แผ่นงานดังนี้:

| แผ่นงาน | คอลัมน์ (ตามลำดับ) | Primary Key | หน้าที่และความปลอดภัย |
| :--- | :--- | :---: | :--- |
| **`Users`** | `userId`, `googleSub`, `email`, `displayName`, `classroom`, `role`, `status`, `createdAt`, `updatedAt` | `userId` | เก็บข้อมูลผู้เรียน ครูผู้สอน และสิทธิ์เข้าถึง (`STUDENT`, `TEACHER`, `ADMIN`) |
| **`Units`** | `unitId`, `unitName`, `totalLessons`, `passingPercent`, `status` | `unitId` | หน่วยการเรียนรู้ทั้ง 4 หน่วย เกณฑ์ผ่าน 70% |
| **`Lessons`** | `lessonId`, `unitId`, `lessonName`, `sequence`, `status` | `lessonId` | บทเรียนทั้งหมด 22 บทเรียน (`u1-l1` ถึง `u4-s6`) |
| **`Progress`** | `progressId`, `userId`, `unitId`, `lessonId`, `activityId`, `completionStatus`, `updatedAt` | `progressId` | บันทึกการจบบทเรียนและกิจกรรม Lab ของนักเรียน |
| **`QuizAttempts`** | `attemptId`, `userId`, `unitId`, `submittedAt`, `score`, `maxScore`, `percentage`, `passed`, `durationSeconds` | `attemptId` | ประวัติการทำแบบทดสอบ ตรวจโดยเซิร์ฟเวอร์ ป้องกันการส่งซ้ำ |
| **`Projects`** | `projectId`, `userId`, `unitId`, `projectTitle`, `description`, `status`, `evidenceLink`, `submittedAt` | `projectId` | โครงงาน AI Capstone (สถานะ: `DRAFT`, `SUBMITTED`, `ASSESSED`) |
| **`Assessments`** | `assessmentId`, `userId`, `unitId`, `projectId`, `rubricScores`, `totalScore`, `maxScore`, `feedback`, `teacherId`, `updatedAt` | `assessmentId` | ผลการประเมินรูบริก 4 ด้าน (เต็ม 16 คะแนน) พร้อมคำแนะนำจากครูนก |
| **`AuditLogs`** | `logId`, `timestamp`, `actorId`, `action`, `targetId`, `result` | `logId` | บันทึกประวัติความปลอดภัยแบบ Append-only (`SUCCESS`, `DENIED`, `ERROR`) |

---

## 3. ขั้นตอนการติดตั้งบน Google Workspace (สำหรับคุณครูมนัสชนก)

### วิธีที่ 1: ติดตั้งผ่าน Google Apps Script Editor (แนะนำ — สะดวกและรวดเร็ว)

1. เข้าสู่ระบบ Google ด้วยบัญชีคุณครูของโรงเรียน (เช่น `@pcccr.ac.th`)
2. เปิดเบราว์เซอร์ไปที่ <https://script.google.com> แล้วคลิก **"โครงการใหม่" (New Project)**
3. ตั้งชื่อโครงการว่า: **`KruNok AI Academy Backend`**
4. เปิดการตั้งค่าโครงการ (ไอคอนรูปเฟือง ⚙️ ด้านซ้าย) -> ติ๊กเลือก **"แสดงไฟล์ Manifest 'appsscript.json' ในตัวแก้ไข"**
5. คลิกแท็บ `<>` (ตัวแก้ไข) ด้านซ้าย:
   - เปิดไฟล์ `appsscript.json` -> ลบโค้ดเดิมทั้งหมด -> คัดลอกเนื้อหาจากไฟล์ [backend/appsscript.json](file:///f:/0-my_app/KruNok-AI-Academy/backend/appsscript.json) ไปวาง -> บันทึก (Ctrl+S)
   - เปิดไฟล์ `Code.gs` -> ลบโค้ดเดิมทั้งหมด -> คัดลอกเนื้อหาจากไฟล์ [backend/Code.gs](file:///f:/0-my_app/KruNok-AI-Academy/backend/Code.gs) ไปวาง -> บันทึก (Ctrl+S)
6. **รันการตั้งค่าฐานข้อมูลครั้งแรก:**
   - ที่แถบเครื่องมือด้านบน เลือกฟังก์ชัน **`setupDatabase`** จากเมนูดรอปดาวน์ แล้วกด **"เรียกใช้" (Run)**
   - ระบบจะขออนุญาตเข้าถึง Google Drive และ Sheets ให้กด **"ตรวจสอบสิทธิ์" (Review permissions)** -> เลือกบัญชีครู -> กด **"ขั้นสูง" (Advanced)** -> กด **"ไปที่ KruNok AI Academy Backend (ไม่ปลอดภัย)"** -> กด **"อนุญาต" (Allow)**
   - รอจนกระทั่งแถบสถานะขึ้น **"การดำเนินการเสร็จสิ้น" (Execution completed)**
   - สังเกตบันทึกการทำงาน (Log) จะแสดง URL ของ Google Sheets ที่ถูกสร้างขึ้นอัตโนมัติ
7. **ทดสอบการอ่าน-เขียนจริง:**
   - เลือกฟังก์ชัน **`testDatabaseReadWrite`** แล้วกด **"เรียกใช้" (Run)**
   - บันทึกการทำงานต้องแสดงผลลัพธ์:  
     `"result": "PASS"`
8. **ตรวจสอบความสมบูรณ์:**
   - เลือกฟังก์ชัน **`checkDatabase`** แล้วกด **"เรียกใช้" (Run)** ทุกแผ่นงานต้องขึ้นสถานะ `OK (n rows)`
9. **นำไปใช้งานเป็น Web App (Deploy):**
   - คลิกปุ่มสีน้ำเงิน **"ทำให้ใช้งานได้" (Deploy) -> "การทำให้ใช้งานได้ใหม่" (New deployment)**
   - คลิกไอคอนรูปเฟือง ⚙️ ข้าง "เลือกประเภท" -> เลือก **"เว็บแอป" (Web app)**
   - กำหนดค่า:
     - คำอธิบาย: `KruNok AI Academy API v1`
     - ดำเนินการในฐานะ (Execute as): **ฉัน (Me)**
     - ผู้ที่มีสิทธิ์เข้าถึง (Who has access): **ทุกคน (Anyone)**
   - คลิกปุ่ม **"ทำให้ใช้งานได้" (Deploy)**
   - คัดลอก **URL เว็บแอป (Web app URL)** เช่น:  
     `https://script.google.com/macros/s/AKfycb.../exec`

---

### วิธีที่ 2: ติดตั้งผ่าน Google clasp (Command Line Interface)

หากต้องการติดตั้งผ่านคอมมานด์ไลน์ในเครื่อง:
```bash
# 1. ติดตั้ง clasp ทั่วโลก (หากยังไม่มี)
npm install -g @google/clasp

# 2. เข้าสู่ระบบด้วยบัญชี Google ของครูผู้สอน
clasp login

# 3. สร้างโครงการ Apps Script ใหม่ในโฟลเดอร์ backend
clasp create --title "KruNok AI Academy Backend" --type webapp --rootDir ./backend

# 4. อัปโหลดโค้ดขึ้น Apps Script
clasp push

# 5. เปิด Editor เพื่อสั่งรัน setupDatabase()
clasp open
```

---

## 4. การเชื่อมต่อ Frontend กับ Google Apps Script Web App

1. เปิดเว็บไซต์ KruNok AI Academy ที่ `http://localhost:5173/` (หรือ Production URL)
2. เข้าสู่หน้า **Teacher Dashboard** ผ่าน URL: `#teacher`
3. คลิกแท็บ **"สถานะ Backend"**
4. นำ Web App URL ที่ได้จากขั้นตอน Deploy ไปวางในช่อง **"Google Apps Script Web App URL"**
5. คลิกปุ่ม **"ทดสอบ & บันทึก"**
6. เมื่อระบบเชื่อมต่อสำเร็จ จะแสดงข้อความ:  
   `เชื่อมต่อสำเร็จ! ระบบ: KruNok AI Academy (ว32281) Schema v1`

---

## 5. มาตรการความปลอดภัยและ PDPA Compliance

1. **Role-Based Access Control (RBAC):**
   - นักเรียน (`STUDENT`) ดูได้เฉพาะคะแนนและโครงงานของตนเอง
   - คุณครู (`TEACHER` และ `ADMIN`) เท่านั้นที่สามารถดูคะแนนรายห้อง ประเมินโครงงาน และส่งออกไฟล์ CSV ได้
2. **Server-Side Grading:**
   - ข้อสอบ 45 ข้อถูกตรวจคำตอบที่ฝั่งเซิร์ฟเวอร์ นักเรียนไม่สามารถเปิด Inspect หรือดักจับ Request เพื่อส่งคะแนนปลอมได้
3. **Idempotent Attempt Protection:**
   - แต่ละครั้งที่ส่งข้อสอบ ระบบจะสร้าง `attemptId` แบบสุ่มเฉพาะ หากมีการส่งคำขอซ้ำ ระบบจะส่งคืนผลลัพธ์เดิมโดยไม่เพิ่มจำนวนครั้งการสอบ
4. **Data Neutralization:**
   - ฟังก์ชัน `cleanText_()` ล้างอักขระแปลกปลอม และป้องกันการแทรกสูตร Spreadsheet Formula Injection (`=`, `+`, `-`, `@`) โดยอัตโนมัติ
