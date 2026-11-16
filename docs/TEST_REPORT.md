# TEST REPORT — QUALITY ASSURANCE & VERIFICATION
**โครงการ:** KruNok AI Academy (ว32281 ปัญญาประดิษฐ์เบื้องต้น ม.5)  
**โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เชียงราย**  
**ครูผู้สอน:** นางมนัสชนก ตามวงค์ (Kru Nok)  
**วันและเวลาทดสอบ:** 27 ตุลาคม 2026  
**เครื่องมือทดสอบ:** Vite Dev Server, Chromium Headless Browser Automation, Manual Unit Verification

---

## 1. ผลการทดสอบภาพรวม (Executive Summary Matrix)

| หมวดหมู่การทดสอบ | สถานะ | รายละเอียดผลลัพธ์ |
| :--- | :---: | :--- |
| **Build & Compilation** | ✅ PASS | `npm run build` ผ่าน 100% ภายใน 1.26 วินาที ไร้ข้อผิดพลาด |
| **Dev Server Execution** | ✅ PASS | `npm run dev` รันบนพอร์ต 5173 ได้อย่างเสถียร |
| **Authentication & Profile** | ✅ PASS | ล็อกอิน Demo Mode, เลือกห้อง ม.5/1–ม.5/6 บันทึกโปรไฟล์ได้สมบูรณ์ |
| **Home Dashboard** | ✅ PASS | แสดง Progress Ring, สถิติ 4 หน่วย, ป้ายสถานะ และทางลัดครบ |
| **Unit 1 (AI Foundations)** | ✅ PASS | 6 บทเรียน, กิจกรรมจำแนก AI vs Rule, จริยธรรม AI, บันทึกการเรียนผ่าน |
| **Unit 2 (Computer Vision)** | ✅ PASS | 5 บทเรียน, Pixel Matrix, OpenCV Snippets, COCO-SSD Lab ไม่พบ Error |
| **Unit 3 (Machine Learning)** | ✅ PASS | 5 บทเรียน, ML Studio, Decision Boundary, Hand/Pose Keypoints ครบ |
| **Unit 4 (AI Project Studio)** | ✅ PASS | 6 ขั้นตอน Wizard, Canvas, Rubric ประเมินผล, Export HTML/MD ได้จริง |
| **Quiz Engine** | ✅ PASS | คลังข้อสอบ 45 ข้อ ตรวจคำตอบ จับเวลา แสดงเฉลย และเกณฑ์ 70% |
| **Teacher Dashboard** | ✅ PASS | แดชบอร์ดครูผู้สอน คัดกรองรายห้อง ม.5/1–ม.5/6, ตารางนักเรียนพร้อมใช้งาน |
| **LocalStorage Persistence** | ✅ PASS | คีย์ `aira_v32281_user` และ `aira_v32281_progress_v1` รีเฟรชแล้วข้อมูลคงอยู่ |
| **AI Model & Static Assets** | ✅ PASS | โมเดล COCO-SSD (WASM 5 shards) และภาพ samples โหลดได้จาก `public/` |
| **Mobile Responsiveness** | ✅ PASS | รองรับหน้าจอ Desktop, Tablet, และ Mobile ผ่าน MobileNav และ Responsive CSS |

---

## 2. รายละเอียดผลการทดสอบแต่ละส่วน (Detailed Test Cases)

### Test Case 1: Build & Compilation Verification
- **คำสั่ง:** `npm run build`
- **เป้าหมาย:** คอมไพล์โปรเจกต์ React 18 + Vite ไปยังโฟลเดอร์ `dist/`
- **ผลการทดสอบ:** 
  - `dist/index.html` (0.94 kB)
  - `dist/assets/index-DcL8Njv2.css` (79.43 kB)
  - `dist/assets/index-Br-OuDxb.js` (534.87 kB)
  - เวลาในการคอมไพล์: **1.26 วินาที**
  - **สถานะ:** ✅ ผ่านสมบูรณ์ ไร้ Syntax Error

---

### Test Case 2: Authentication & Student Profile (LoginPage)
- **ขั้นตอนการทดสอบ:**
  1. เข้าสู่หน้าหลักโดยไม่มี Token / Profile (`http://localhost:5173/`)
  2. ระบบแสดงหน้า `LoginPage` พร้อมชื่อสถาบัน **KruNok AI Academy** และข้อความต้อนรับ
  3. เลือกห้องเรียน `ม.5/1`
  4. กรอกชื่อนักเรียน `เด็กชายสมคิด พินิจการ`
  5. กดยอมรับเงื่อนไขและคลิกปุ่ม "เข้าสู่ระบบ (Demo Mode)"
- **ผลการทดสอบ:**
  - เข้าสู่หน้า Dashboard (`#home`) ทันที
  - ข้อมูลนักเรียนถูกบันทึกใน `localStorage['aira_v32281_user']`:
    ```json
    {
      "id": "std-demo-...",
      "name": "เด็กชายสมคิด พินิจการ",
      "classroom": "ม.5/1",
      "role": "student",
      "mode": "demo"
    }
    ```
  - **สถานะ:** ✅ ผ่านสมบูรณ์

---

### Test Case 3: Home Dashboard (`#home`)
- **การทดสอบ:**
  - ตรวจสอบ Progress Ring แสดงเปอร์เซ็นต์รวม
  - ตรวจสอบการ์ดสรุป 4 หน่วยการเรียนรู้
  - ตรวจสอบป้ายชื่อโรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เชียงราย และครูมนัสชนก ตามวงค์
- **ผลการทดสอบ:**
  - องค์ประกอบเรนเดอร์ครบถ้วนถูกต้อง ไม่มี Layout Shift
  - ลิงก์คลิกเข้าไปยัง `#unit1`, `#unit2`, `#unit3`, `#unit4` ทำงานได้ลื่นไหล
  - **สถานะ:** ✅ ผ่านสมบูรณ์

---

### Test Case 4: Unit 1 — AI Foundations & Ethics (`#unit1`)
- **การทดสอบ:**
  - เลื่อนดูบทเรียน 1.1 - 1.6
  - ทดสอบ Table of Contents (TOC) นำทางเร็ว
  - ทดสอบการกดปุ่ม "เรียนจบบทนี้แล้ว" (Mark as Completed)
- **ผลการทดสอบ:**
  - เมื่อคลิกปุ่มจบเนื้อหา บทเรียนเปลี่ยนสถานะเป็น Completed
  - Progress อัปเดตจาก 0% เป็น 2% รวม (8% ของ Unit 1)
  - ข้อมูลบันทึกและ Sync ลงใน `localStorage['aira_v32281_progress_v1']` ทันที
  - **สถานะ:** ✅ ผ่านสมบูรณ์

---

### Test Case 5: Unit 2 — Computer Vision & OpenCV Playground (`#unit2`)
- **การทดสอบ:**
  - ตรวจสอบการโหลดหน้า Unit 2 (หลังจากแก้ไขการเรียกใช้ `UnitArt`)
  - ตรวจสอบ Interactive Pixel Matrix Explorer
  - ตรวจสอบกล่องโค้ด Python OpenCV พร้อมปุ่มคัดลอกโค้ด
  - ตรวจสอบการโหลด COCO-SSD Object Detection Model ในเครื่อง
- **ผลการทดสอบ:**
  - หน้าเว็บโหลดได้สมบูรณ์ ไม่มีการแครชด้วย ErrorBoundary
  - สารบัญ TOC นำทางไปยังบทเรียน 2.3 "Python & OpenCV Basics" ได้อย่างแม่นยำ
  - ไฟล์ภาพในโฟลเดอร์ `samples/` (`cat.jpg`, `coffee.jpg`, `horse.jpg`, `rocket.jpg`) พร้อมใช้งาน
  - **สถานะ:** ✅ ผ่านสมบูรณ์

---

### Test Case 6: Unit 3 — Machine Learning Studio (`#unit3`)
- **การทดสอบ:**
  - ทดสอบเครื่องมือจำแนกข้อมูลส้มและมะนาว (Feature Space: Size vs Weight)
  - ทดสอบการลากเส้น Decision Boundary
  - ตรวจสอบการเรนเดอร์ Keypoint Detection (MediaPipe Hand 21 จุด และ Pose 33 จุด)
  - ตรวจสอบเครื่องมือคำนวณ IoU (Intersection over Union)
- **ผลการทดสอบ:**
  - องค์ประกอบกราฟิก SVG และ Interactive Canvas ตอบสนองราบรื่น
  - คำนวณค่า Precision, Recall และ F1-Score ถูกต้องตามสูตรคณิตศาสตร์
  - **สถานะ:** ✅ ผ่านสมบูรณ์

---

### Test Case 7: Unit 4 — AI Project Studio & Capstone (`#unit4`)
- **การทดสอบ:**
  - ทดสอบ 6-Step Project Wizard:
    1. Problem Scoping
    2. Data Acquisition
    3. Data Exploration & Prep
    4. Modeling
    5. Evaluation
    6. Deployment & Ethics
  - ทดสอบ Rubric เกณฑ์การประเมินตนเอง 4 ระดับ (ดีเยี่ยม, ดี, พอใช้, ปรับปรุง)
  - ทดสอบฟังก์ชัน Export รายงานโครงงาน
- **ผลการทดสอบ:**
  - ฟังก์ชันบันทึกข้อมูลโครงงานลง LocalStorage ทำงานถูกต้อง
  - ฟังก์ชันดาวน์โหลดรายงานโครงงานเป็น Markdown (`.md`) และ HTML ทำงานได้จริง
  - **สถานะ:** ✅ ผ่านสมบูรณ์

---

### Test Case 8: Teacher Dashboard (`#teacher`)
- **การทดสอบ:**
  - ตรวจสอบการแสดงผลแดชบอร์ดครูผู้สอน
  - ทดสอบการกดปุ่มตัวกรองห้องเรียน: `ทั้งหมด`, `ม.5/1`, `ม.5/2`, `ม.5/3`, `ม.5/4`, `ม.5/5`, `ม.5/6`
  - ตรวจสอบตารางรายชื่อนักเรียน สถิติเวลาที่ใช้ และความก้าวหน้า
  - ตรวจสอบป้ายสถานะความพร้อม Google Apps Script Backend (Phase 1 Ready)
- **ผลการทดสอบ:**
  - ระบบกรองข้อมูลรายชื่อนักเรียนตามห้องได้ทันทีโดยไม่ต้องรีโหลดหน้า
  - แสดงสถานะ 8 Sheets Database ครบถ้วน
  - **สถานะ:** ✅ ผ่านสมบูรณ์

---

### Test Case 9: Persistence & Data Resilience
- **การทดสอบ:**
  - บันทึกความก้าวหน้าการเรียน
  - ปิดเบราว์เซอร์แล้วเปิดใหม่ / กดปุ่ม Reload (F5)
  - ตรวจสอบค่าใน Developer Tools -> Application -> Local Storage
- **ผลการทดสอบ:**
  - ค่าของคีย์ `aira_v32281_user` และ `aira_v32281_progress_v1` ยังคงอยู่ครบถ้วน
  - ผู้เรียนไม่ต้องล็อกอินซ้ำ และความก้าวหน้าไม่สูญหาย
  - **สถานะ:** ✅ ผ่านสมบูรณ์

---

## 3. สรุปบันทึกการบันทึกวิดีโอหลักฐาน (Video & Screenshot Artifacts)

บันทึกหลักฐานการทดสอบอัตโนมัติถูกจัดเก็บไว้ใน Artifacts Directory:
- `krunok_all_units_perfect_1793074362848.webp`: บันทึกการทดสอบหน้า Login, Home Dashboard, Unit 1, Unit 3, Unit 4, และ Teacher Dashboard
- `test_unit2_lab_1793074792894.webp`: บันทึกการทดสอบเฉพาะของ Unit 2 (Computer Vision, OpenCV, TOC, Code Snippets)
- ภาพ Screenshot:
  - `unit2_initial_1793074802621.png`
  - `unit2_scrolled_1793074816683.png`
  - `unit2_scrolled_down_1793074826322.png`
  - `unit2_code_snippets_1793074838395.png`
  - `lesson2_3_view_1793074865565.png`

**บทสรุป:** ระบบ KruNok AI Academy ผ่านเกณฑ์การประเมินคุณภาพทุกข้อใน Phase 1 และ Phase 2 พร้อมสำหรับการตรวจสอบโดยผู้ใช้งาน
