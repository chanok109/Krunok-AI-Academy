# MIGRATION REPORT — PHASE 2: REFACTOR TO REACT + VITE
**โครงการ:** KruNok AI Academy (ว32281 ปัญญาประดิษฐ์เบื้องต้น ม.5)  
**โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เชียงราย**  
**ครูผู้สอน:** นางมนัสชนก ตามวงค์ (Kru Nok)  
**วันที่ดำเนินการ:** 27 ตุลาคม 2026  
**สถานะ:** ✅ เสร็จสมบูรณ์ (Phase 1 & Phase 2 Verified)

---

## 1. บทสรุปผู้บริหาร (Executive Summary)

การปรับโครงสร้างและยกระดับเว็บไซต์เดิมจากไฟล์ HTML เดี่ยวขนาดมหึมา (`index.original.html` ขนาด 880 KB, 16,147 บรรทัด) ซึ่งเป็น React 18 ที่ถูก precompile เป็น JavaScript รวมอยู่ในแท็ก `<script>` มาเป็นโปรเจกต์ **React 18 + Vite** แบบโมดูลาร์ ได้ดำเนินการเสร็จสิ้นอย่างสมบูรณ์แบบ 

การ Refactor ครั้งนี้ยึดหลัก **"Zero Content Loss & Zero Behavioral Regression"** โดยเนื้อหาบทเรียนทั้ง 22 บทเรียน, กิจกรรมแล็บจำลอง 16 รายการ, คลังข้อสอบทั้ง 45 ข้อ, เกณฑ์การผ่าน 70%, โมเดล AI (COCO-SSD) ในเครื่อง, และคีย์ `localStorage` ดั้งเดิม ได้รับการอนุรักษ์ไว้อย่างครบถ้วน 100% พร้อมทั้งปรับปรุง Branding ใหม่เป็น **KruNok AI Academy** และรองรับการเชื่อมต่อกับ Google Apps Script Backend ในอนาคต

---

## 2. เปรียบเทียบโครงสร้าง ก่อน และ หลังการย้ายระบบ (Architecture Transformation)

| มิติการเปรียบเทียบ | ระบบเดิม (Baseline) | ระบบใหม่ (React 18 + Vite) |
| :--- | :--- | :--- |
| **โครงสร้างไฟล์** | ไฟล์เดี่ยว `index.html` (16,147 บรรทัด รวม HTML, CSS, JS, SVG, Data) | แยกเป็นโมดูลชัดเจน (Components, Pages, Context, Services, Data, Styles) |
| **เครื่องมือ Build** | ไม่มี (Precompiled monolith) | **Vite 5** (Fast HMR, Production Rollup bundler) |
| **การจัดการ State** | Global State รวมศูนย์ในฟังก์ชันใหญ่ แก้ไขจุดเดียวอาจกระทบทั้งระบบ | **AppContext (Context API)** แบ่งหมวดหมู่ Auth, Progress, UI, Notifications |
| **ระบบ Routing** | Hash Routing จัดการแบบฟังก์ชันเดี่ยว | **RouteContext** รองรับ History, Hash Change, และ Fallback 404 |
| **การบำรุงรักษาเนื้อหา** | เนื้อหาบทเรียนปนอยู่กับโค้ด React elements | แยกไฟล์ข้อมูลเนื้อหาเป็นระเบียบใน `src/data/unit[1-4]Data.js` |
| **Stylesheets** | CSS แทรกอยู่ใน `<style>` กว่า 1,300 บรรทัด มี Syntax error บางจุด | แยกเป็น `global.css` (Design tokens) และ `components.css` ตกแต่งเฉพาะจุด |
| **Static Assets** | โฟลเดอร์ `models/` และ `samples/` อยู่ที่ Root | ย้ายเข้า `public/models/` และ `public/samples/` ให้ Vite Serve ได้มาตรฐาน |
| **เวลา Build** | ไม่มีกระบวนการ Build | Build เสร็จสิ้นภายใน **1.26 วินาที** (Production Bundle ขนาดเล็ก โหลดเร็ว) |

---

## 3. รายละเอียดการแยกไฟล์และโมดูลาร์ (Component & Module Breakdown)

### 3.1 Data Modules (`src/data/`)
เนื้อหาทั้งหมดถูกสกัดออกจาก logic แสดงผล เพื่อให้คุณครูหรือผู้ดูแลสามารถปรับปรุงเนื้อหาได้ง่าย:
- `courseData.js`: ข้อมูลรายวิชา ว32281, สหภาพ 4 หน่วยการเรียน, รายการเหรียญรางวัล (Achievements), Route Configuration
- `unit1Data.js`: บทเรียน 1.1 - 1.6 (นิยาม AI, ประวัติ, AI vs Rule-Based, Machine Learning, กฎหมาย PDPA และจริยธรรม) พร้อมแบบทดสอบ 15 ข้อ
- `unit2Data.js`: บทเรียน 2.1 - 2.5 (พิกเซล, RGB Matrix, OpenCV Pipeline, Color Filtering, COCO-SSD) พร้อมสูตรโค้ด Python และแบบทดสอบ 15 ข้อ
- `unit3Data.js`: บทเรียน 3.1 - 3.5 (Dataset ส้ม/มะนาว, Decision Boundary, MediaPipe Keypoints, IoU Calculation) พร้อมแบบทดสอบ 15 ข้อ
- `unit4Data.js`: บทเรียน 4.1 - 4.6 (6 ขั้นตอนวงจรโครงงาน AI, AI Project Canvas, เกณฑ์ประเมิน Rubrics, Showcases)

### 3.2 Services & Utilities (`src/services/`)
- `storageService.js`: จัดการ LocalStorage อย่างรัดกุม รักษาคีย์มาตรฐาน:
  - `aira_v32281_user`: เก็บข้อมูลนักเรียนและห้องเรียน
  - `aira_v32281_progress_v1`: เก็บบันทึกการเรียนรู้ ความก้าวหน้า และคะแนน
- `apiService.js`: รองรับทั้ง **Demo Mode (Local Offline)** และ **Production Mode (Google Apps Script API)**
- `quizService.js`: คำนวณคะแนนแบบทดสอบ, ตรวจสอบเกณฑ์ผ่าน (70%), คำนวณเวลาที่ใช้, และบันทึกประวัติการสอบ

### 3.3 Context Providers (`src/context/`)
- `RouteContext.jsx`: ให้บริการการเปลี่ยนหน้าและตรวจจับ `window.location.hash` (`#home`, `#unit1`, `#unit2`, `#unit3`, `#unit4`, `#teacher`)
- `AppContext.jsx`: ให้บริการ Shared State ระดับแอปพลิเคชัน:
  - `user`: ข้อมูลผู้ใช้ปัจจุบัน
  - `progress`: ความก้าวหน้าและการปลดล็อกบทเรียน
  - `toasts`: ระบบแจ้งเตือน Floating Toast Notification

### 3.4 Reusable UI Components (`src/components/`)
- `UIPrimitives.jsx`: Icon, AIraBot (SVG Animation 4 อารมณ์), GlassCard, Button, Badge, DemoBadge, ProgressBar, ProgressRing, LoadingState, ErrorBoundary
- `Navigation.jsx`: Navbar (ตรา KruNok AI Academy + Mascot), Sidebar, MobileNav, Footer, AIraAssistant (Floating drawer), Toasts
- `ActivityEngines.jsx`: เครื่องมือทำกิจกรรมอินเทอร์แอคทีฟ (ClassifyActivity, OrderActivity, ReasoningActivity)
- `QuizRunner.jsx`: ระบบทำแบบทดสอบจับเวลา แสดงข้อละหน้า ตรวจสอบความถูกต้อง แสดงเฉลย และใบรายงานผล
- `UnitCoursePage.jsx`: Page Harness มาตรฐานสำหรับหน่วยการเรียนรู้ พร้อมสารบัญเลื่อนเร็ว (Quick-jump TOC)

### 3.5 Pages (`src/pages/`)
- `LoginPage.jsx`: หน้าล็อกอินเลือกห้องเรียน ม.5/1 - ม.5/6 และ Demo Mode
- `HomePage.jsx`: แดชบอร์ดผู้เรียน แสดงสถิติเปอร์เซ็นต์รวม กราฟวงกลม และการเข้าสู่แต่ละหน่วย
- `Unit1Page.jsx`: หน่วยที่ 1 — AI Foundations & Ethics
- `Unit2Page.jsx`: หน่วยที่ 2 — Computer Vision & OpenCV
- `Unit3Page.jsx`: หน่วยที่ 3 — Machine Learning Studio
- `Unit4Page.jsx`: หน่วยที่ 4 — AI Project & Capstone Wizard
- `TeacherDashboard.jsx`: แดชบอร์ดครูผู้สอน คัดกรองนักเรียนตามห้อง สรุปความก้าวหน้ารายบุคคล และแสดงสถานะ Google Apps Script Phase 1
- `NotFoundPage.jsx`: หน้าแจ้งเตือนกรณีผู้ใช้พิมพ์ Hash URL ผิดพลาด

---

## 4. มาตรการรักษาความเข้ากันได้และการป้องกันข้อผิดพลาด (Safety & Compatibility)

1. **การสำรองไฟล์ต้นฉบับอย่างสมบูรณ์:**
   - ทำ Git Commit Snapshot ที่ Commit `afcd6fd` ก่อนทำการแก้ไขใดๆ
   - เก็บไฟล์ `index.original.html` (880 KB) ไว้ที่รากโปรเจกต์เป็นหลักฐานอ้างอิงเทียบเคียงแบบบรรทัดต่อบรรทัด
2. **การคงคีย์ LocalStorage เดิม:**
   - ใช้คีย์ `aira_v32281_user` และ `aira_v32281_progress_v1` เดิม ทำให้นักเรียนเดิมที่เคยใช้งานเว็บไซต์มาก่อนไม่สูญเสียความก้าวหน้า
3. **Compatibility Layer ใน `main.jsx`:**
   - ประกาศ Global bindings บน `window` (`window.React`, `window.COURSE`, `window.UNITS`, `window.QUIZ_PASS_PERCENT`, `window.AIraBot`, `window.pad2`, `window.HoloStage`, ฯลฯ) เพื่อให้แน่ใจว่าฟังก์ชันย่อยหรือ Event callbacks เดิมที่อาจอ้างอิง Global object สามารถทำงานได้อย่างราบรื่น
4. **ความถูกต้องของโมเดล AI ในเครื่อง:**
   - จัดวางโครงสร้างไฟล์ `public/models/coco-ssd/` และ `public/samples/` ทำให้เบราว์เซอร์สามารถเรียกใช้ไฟล์โมเดลผ่าน URL `/models/coco-ssd/model.json` ได้โดยตรงทั้งบน Dev Server และ Production Build

---

## 5. ผลการ Build และประสิทธิภาพ (Build Performance Benchmark)

ผลการรันคำสั่ง `npm run build`:
```text
vite v5.4.21 building for production...
transforming...
✓ 57 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.94 kB │ gzip:   0.65 kB
dist/assets/index-DcL8Njv2.css   79.43 kB │ gzip:  15.94 kB
dist/assets/index-Br-OuDxb.js   534.87 kB │ gzip: 189.11 kB
✓ built in 1.26s
```

- **JavaScript Bundle (Gzipped):** เพียง 189.11 kB (โหลดเร็วและประหยัด Bandwidth ของโรงเรียน)
- **CSS Bundle (Gzipped):** 15.94 kB
- **Build Time:** 1.26 วินาที

---

## 6. ข้อเสนอแนะสำหรับ Phase 3 และ Phase 4 (Next Steps)

1. **Phase 3 (Branding & Design Polish):**
   - ได้ปรับปรุงชื่อสถาบันเป็น "KruNok AI Academy" และชื่อครูผู้สอน "นางมนัสชนก ตามวงค์ (Kru Nok)" เรียบร้อยแล้ว
   - สามารถเสริมไอคอนโรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เชียงราย ในส่วน Header เพิ่มเติมได้ตามต้องการ
2. **Phase 4 (Backend Integration & Production Mode):**
   - เชื่อมต่อ `src/services/apiService.js` เข้ากับ Web App URL ของ Google Apps Script ที่ Deploy จาก `backend/Code.gs`
   - เพิ่มระบบ Sync คะแนนจาก LocalStorage ขึ้น Google Sheets อัตโนมัติเมื่อนักเรียนส่งงานหรือทำแบบทดสอบ
