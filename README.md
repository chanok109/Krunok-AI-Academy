# KruNok AI Academy 🚀
> **ห้องเรียนปัญญาประดิษฐ์กับครูนก**  
> *Learn AI • Think Smart • Create the Future*

ระบบการเรียนรู้ดิจิทัล (LMS) รายวิชา **ว32281 ปัญญาประดิษฐ์เบื้องต้น** ระดับชั้นมัธยมศึกษาปีที่ 5  
**ครูผู้สอน:** นางมนัสชนก ตามวงค์ (Kru Nok)  
**สถานศึกษา:** โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เชียงราย  
**มาสคอตประจำระบบ:** AIra (หุ่นยนต์ AI ผู้ช่วยการเรียนรู้)

---

## 🌟 ภาพรวมระบบ (Overview)

**KruNok AI Academy** ได้รับการปรับโครงสร้าง (Refactor & Modernize) จากแอปพลิเคชัน Single-Page HTML ขนาดใหญ่ สู่สถาปัตยกรรมโมเดิร์น **React 18 + Vite** ที่มีความเป็นโมดูลสูง ดูแลรักษาง่าย และพร้อมสำหรับการขยายผลสู่ Google Apps Script Backend ในอนาคต โดยยังคงรักษาเนื้อหาบทเรียน กิจกรรม Interactive โมเดล AI ในเครื่อง และข้อสอบเดิมไว้ครบถ้วน 100%

### คุณสมบัติเด่น (Key Features)
1. **4 หน่วยการเรียนรู้หลัก (22 บทเรียน, 16 ปฏิบัติการ/กิจกรรม):**
   - **Unit 1: AI Foundations & Ethics:** เจาะลึกนิยาม AI, ประวัติศาสตร์, Machine Learning vs Rule-Based, กฎหมาย PDPA และจริยธรรม AI
   - **Unit 2: Computer Vision Fundamentals:** โครงสร้างภาพดิจิทัล (Pixel, RGB Matrix), OpenCV Pipeline (Gray, Blur, Edge, Contour), Color Detection Lab และ Object Detection (COCO-SSD)
   - **Unit 3: Machine Learning Studio:** โมเดลการเรียนรู้แบบมีผู้สอน (Supervised Learning), จำแนกผลไม้ด้วย Decision Boundary, Keypoint Detection (MediaPipe Hand/Pose Landmarks)
   - **Unit 4: AI Project & Capstone:** AI Project Life Cycle 6 ขั้นตอน, Project Canvas Builder, Rubric เกณฑ์การประเมินตนเอง, พร้อมเครื่องมือ Export รายงานโครงงานเป็น Markdown / HTML
2. **ระบบ Quiz Engine:** คลังข้อสอบ 45 ข้อ ตรวจคำตอบพร้อมคำอธิบายแบบเรียลไทม์ เกณฑ์ผ่าน 70% และระบบเกียรติบัตร
3. **ระบบผู้ช่วย AIra Interactive Assistant:** มาสคอตผู้ช่วยคอยให้คำแนะนำ สรุปบทเรียน และตอบสนองต่อการกระทำของผู้เรียน
4. **Offline AI Model Execution:** รองรับการรันโมเดล Object Detection ด้วย COCO-SSD (TensorFlow.js WASM Shards ใน `public/models/coco-ssd/`) โดยไม่ต้องเชื่อมต่ออินเทอร์เน็ตภายนอก
5. **Teacher Dashboard:** แดชบอร์ดสรุปผลการเรียนสำหรับครูผู้สอน ตรวจสอบความก้าวหน้ารายห้อง (ม.5/1 - ม.5/6) คัดกรองนักเรียน และเตรียมพร้อมเชื่อมต่อ Google Sheets Database Phase 1
6. **Local Persistence:** บันทึกข้อมูลและคะแนนลงใน localStorage ด้วยคีย์เดิม (`aira_v32281_user`, `aira_v32281_progress_v1`)

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend Core:** React 18, JSX, JavaScript (ES2022)
- **Bundler & Dev Server:** Vite 5
- **Routing:** Custom Context-based Hash Router (`RouteContext.jsx`) รองรับการทำงานแบบ Single-Page App บนทุก Web Server
- **State Management:** React Context API (`AppContext.jsx`) + Custom Storage Service
- **Design System:** Vanilla CSS (`src/styles/global.css`, `src/styles/components.css`) ธีม Futuristic AI EdTech
  - `#0B1026` (Navy Background)
  - `#161336` (Deep Purple)
  - `#9B87F5` (Lavender Accent)
  - `#57CCF2` / `#00E5FF` (Cyan & Neon Cyan Glow)
  - `#FFD66D` (Gold Achievement)
- **Local AI:** TensorFlow.js / COCO-SSD WASM runtime (`models/coco-ssd/model.json` + 5 shards)
- **Backend Ready:** Google Apps Script Phase 1 (`backend/Code.gs` + Google Sheets)

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
KruNok-AI-Academy/
├── backend/                  # Google Apps Script Backend (Phase 1)
│   ├── Code.gs               # สคริปต์จัดการชีต 8 ตาราง
│   ├── appsscript.json       # GAS Manifest & Scopes
│   └── README-Phase1.md      # คู่มือตั้งค่าฐานข้อมูล Google Sheets
├── public/                   # Static Assets สำหรับการเข้าถึงแบบออฟไลน์
│   ├── models/
│   │   └── coco-ssd/         # โมเดล COCO-SSD (model.json + 5 WASM shards)
│   └── samples/              # ภาพตัวอย่างทดสอบ (cat, coffee, horse, rocket)
├── src/                      # Source Code ที่จัดสถาปัตยกรรมใหม่
│   ├── components/           # Reusable UI & Feature Components
│   │   ├── ActivityCard.jsx  # Card & Engine Wrapper
│   │   ├── ActivityEngines.jsx # Interactive Lab Engines (Classify, Order, Reasoning)
│   │   ├── AIraAssistant.jsx # AIra Mascot Drawer & Chat Assistant
│   │   ├── BackgroundEffects.jsx # Particle Canvas & Holographic Stage
│   │   ├── LoadingState.jsx  # Loading & Error States
│   │   ├── Navbar.jsx        # Navigation Bar & Brand Header
│   │   ├── Navigation.jsx    # Unified Header, Sidebar, Footer, Toasts
│   │   ├── ProgressBar.jsx   # Progress Bar & Progress Ring
│   │   ├── QuizEngine.jsx    # Quiz Runner & Question Evaluator
│   │   ├── QuizRunner.jsx    # Multi-step Quiz Engine with Timer & Review
│   │   ├── Sidebar.jsx       # Side Navigation Drawer
│   │   ├── UIHelpers.jsx     # Tooltips, Callouts, Code Blocks, Formatters
│   │   ├── UIPrimitives.jsx  # Buttons, Badges, GlassCards, Icons, AIraBot
│   │   └── UnitCoursePage.jsx # Unit Layout Template พร้อม TOC และ Progress
│   ├── context/              # Context Providers
│   │   ├── AppContext.jsx    # Auth state, Progress state, Theme, Toasts
│   │   └── RouteContext.jsx  # Hash Routing Engine (#home, #unit1..4, #teacher)
│   ├── data/                 # Course Data & Question Banks (Preserved 100%)
│   │   ├── courseData.js     # โครงสร้างหลักสูตร, หน่วยการเรียน, ตราเกียรติยศ
│   │   ├── unit1Data.js      # บทเรียน 1.1-1.6, ข้อสอบ 15 ข้อ, จริยธรรม AI
│   │   ├── unit2Data.js      # บทเรียน 2.1-2.5, ข้อสอบ 15 ข้อ, OpenCV Recipes
│   │   ├── unit3Data.js      # บทเรียน 3.1-3.5, ข้อสอบ 15 ข้อ, ML Lab Datasets
│   │   └── unit4Data.js      # บทเรียน 4.1-4.6, 6-Step Project Wizard, Rubric
│   ├── pages/                # Page Views
│   │   ├── HomePage.jsx      # Dashboard ภาพรวม, สถิติ, ทางลัดหน่วยเรียน
│   │   ├── LoginPage.jsx     # หน้าลงทะเบียนเข้าสู่ระบบ (Demo & Official)
│   │   ├── NotFoundPage.jsx  # หน้า 404 กรณีระบุ Hash ไม่ถูกต้อง
│   │   ├── TeacherDashboard.jsx # แดชบอร์ดสรุปผลการเรียนสำหรับครูผู้สอน
│   │   ├── Unit1Page.jsx     # AI Foundations & Ethics
│   │   ├── Unit2Page.jsx     # Computer Vision & OpenCV Playground
│   │   ├── Unit3Page.jsx     # Machine Learning Studio & Landmark Lab
│   │   └── Unit4Page.jsx     # AI Project Studio & Canvas Generator
│   ├── services/             # Storage & API Logic
│   │   ├── apiService.js     # Google Apps Script Client & Mock Adapter
│   │   ├── quizService.js    # ตรรกะตรวจข้อสอบและคำนวณสถิติ
│   │   └── storageService.js # LocalStorage sync (`aira_v32281_*`)
│   ├── styles/               # Stylesheets
│   │   ├── components.css    # สไตล์ UI Primitives และ Component เฉพาะ
│   │   └── global.css        # Design tokens, Typography, Responsive layout
│   ├── App.jsx               # Root Route Switcher & Error Boundary
│   └── main.jsx              # React Entry Point & Global Bindings
├── dist/                     # Production Build Output
├── index.html                # Single Page Host HTML
├── index.original.html       # ต้นฉบับเดิมสำรอง (Pristine 16,147 lines backup)
├── package.json              # Dependencies & Scripts
├── vite.config.js            # Vite Configuration
├── PROJECT_AUDIT.md          # รายงานการวิเคราะห์ระบบเดิมและปัญหาที่พบ (Phase 1)
├── MIGRATION_REPORT.md       # รายงานรายละเอียดการย้ายระบบสู่ React+Vite (Phase 2)
└── TEST_REPORT.md            # บันทึกผลการทดสอบระบบและ UI ครบทุกมิติ
```

---

## 🚀 คำสั่งเริ่มต้นใช้งาน (Getting Started)

### 1. ความต้องการของระบบ (Prerequisites)
- [Node.js](https://nodejs.org/) เวอร์ชัน 18.0.0 หรือใหม่กว่า
- npm (มาพร้อมกับ Node.js) หรือ pnpm / yarn

### 2. การติดตั้ง (Installation)
เปิด Terminal ในโฟลเดอร์โปรเจกต์แล้วรันคำสั่ง:
```bash
npm install
```

### 3. การรันสำหรับพัฒนา (Run Development Server)
```bash
npm run dev
```
หลังจากรันคำสั่ง เบราว์เซอร์สามารถเข้าถึงได้ที่:
```text
http://localhost:5173/
```
(หรือพอร์ตถัดไปที่ Vite กำหนด เช่น `5174`)

### 4. การ Build สำหรับ Production
เพื่อคอมไพล์โค้ดเป็นไฟล์ Static Assets ที่บีบอัดและเพิ่มประสิทธิภาพสูงสุด:
```bash
npm run build
```
ผลลัพธ์จะถูกสร้างไว้ในโฟลเดอร์ `dist/`

### 5. การทดสอบเปิดดู Production Build ในเครื่อง (Preview)
```bash
npm run preview
```

---

## 🌐 คำแนะนำการนำขึ้นเซิร์ฟเวอร์ (Deployment Options)

เนื่องจากระบบใช้ Hash-based Routing (`#home`, `#unit1`, `#unit2`, `#unit3`, `#unit4`, `#teacher`) ทำให้สามารถนำโฟลเดอร์ `dist/` ไปโฮสต์บน Web Hosting หรือ Static File Server ใดๆ ได้ทันทีโดยไม่เจอปัญหา 404 เมื่อ Refresh:

### 1. GitHub Pages
- รัน `npm run build`
- Deploy โฟลเดอร์ `dist/` ขึ้น GitHub Pages ผ่าน Branch `gh-pages` หรือ GitHub Actions

### 2. Vercel
```bash
npx vercel
```
หรือเชื่อมต่อ GitHub Repository กับ Vercel Dashboard โดยตั้งค่า Build Command เป็น `npm run build` และ Output Directory เป็น `dist`

### 3. Firebase Hosting
```bash
firebase init hosting
# กำหนด public directory เป็น: dist
# กำหนด single-page app rewrite เป็น: Yes
firebase deploy
```

### 4. โรงเรียน / เซิร์ฟเวอร์ภายใน (Intranet Local Server)
คัดลอกไฟล์ทั้งหมดในโฟลเดอร์ `dist/` ไปวางในโฟลเดอร์ `htdocs` หรือ `www` ของเว็บเซิร์ฟเวอร์ Apache/Nginx ในโรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เชียงราย ได้ทันที

---

## 🔒 ข้อมูล LocalStorage และความปลอดภัย

ระบบ KruNok AI Academy ปฏิบัติตามมาตรฐานการเก็บข้อมูลอย่างปลอดภัย:
- `aira_v32281_user`: ข้อมูลโปรไฟล์นักเรียน (รหัสนักเรียน, ชื่อ-นามสกุล, ห้องเรียน ม.5/1 - ม.5/6)
- `aira_v32281_progress_v1`: ความก้าวหน้าการเรียน (Lessons completed, Lab scores, Quiz scores, Project status, Badge unlocks)

เมื่อผู้เรียนเข้าใช้งานใน **Demo Mode** ข้อมูลจะถูกเก็บไว้ในเครื่องเบราว์เซอร์ของผู้เรียนเท่านั้น โดยไม่ส่งออกไปยังเซิร์ฟเวอร์ภายนอกจนกว่าจะมีการเชื่อมต่อกับ Google Apps Script Backend ใน Phase ถัดไป

---

## 👨‍🏫 ข้อมูลติดต่อและการสนับสนุน

- **ผู้พัฒนาและดูแลเนื้อหา:** คุณครูมนัสชนก ตามวงค์ (Kru Nok)
- **กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี**
- **โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เชียงราย**
- **ลิขสิทธิ์:** © 2026 KruNok AI Academy. All rights reserved.
