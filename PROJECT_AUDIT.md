# รายงานการตรวจสอบระบบและสถาปัตยกรรมเดิม (PROJECT AUDIT & BASELINE)
## โครงการ: KruNok AI Academy (ชื่อเดิม: AIra Learning Academy)
**รายวิชา:** ว32281 ปัญญาประดิษฐ์เบื้องต้น ชั้นมัธยมศึกษาปีที่ 5  
**ผู้สอน:** นางมนัสชนก ตามวงค์ (Kru Nok) | **สถาบัน:** โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เชียงราย  
**วันที่ตรวจสอบ:** 26 ตุลาคม 2569  
**สถานะ:** เสร็จสิ้น Phase 1 (Audit & Baseline Verification)

---

## 1. ผลการสำรวจโครงสร้างเดิม (Existing Architecture)

### 1.1 ไฟล์และไดเรกทอรีที่มีอยู่ใน Workspace
โปรเจกต์เดิมอยู่ในรูปแบบ **Single-file React 18 SPA (Claude Artifact)** ที่ไม่มีโครงสร้างโฟลเดอร์ของ Node/Vite (ไม่มี `package.json`, ไม่มี `src/`, ไม่มี `node_modules`):

```text
KruNok-AI-Academy/
├── index.html                  # ไฟล์เดี่ยวขนาด 880,928 ไบต์ (16,147 บรรทัด)
│                               # รวม CSS, React.createElement, Content, Labs, Quizzes
├── backend/
│   ├── Code.gs                 # Google Apps Script Phase 1 (Schema & DB Setup)
│   ├── appsscript.json         # Apps Script Manifest (V8 Runtime, Asia/Bangkok)
│   └── README-Phase1.md        # เอกสารขั้นตอนการติดตั้งและผลการทดสอบ Backend Phase 1
├── models/
│   └── coco-ssd/
│       ├── model.json          # COCO-SSD TensorFlow.js Model Architecture (242 KB)
│       └── group1-shard[1-5]of5.wasm # Model Shard Weights (รวม ~18 MB)
└── samples/
    ├── cat.jpg                 # ภาพตัวอย่างแมวสำหรับทดสอบ CV & Object Detection
    ├── coffee.jpg              # ภาพตัวอย่างแก้วกาแฟ
    ├── horse.jpg               # ภาพตัวอย่างม้า
    └── rocket.jpg              # ภาพตัวอย่างจรวด
```

### 1.2 การวิเคราะห์ Dependencies เดิม
1. **React Runtime:** โหลดผ่าน CDN script tag ใน `index.html`:
   - `react@18.2.0.production.min.js` (cdnjs)
   - `react-dom@18.2.0.production.min.js` (cdnjs)
2. **Typography & Styling:**
   - Google Fonts: `Prompt` (300, 400, 500, 600, 700) และ `JetBrains Mono` (500, 700)
   - Embedded CSS ภายใน `<style>` (บรรทัดที่ 6–946 รวม 940 บรรทัด) ใช้ Design Tokens แบบ CSS Variables (`--navy`, `--deep`, `--lavender`, `--cyan`, `--neon`, `--gold`, Glassmorphism, Responsive Grid)
3. **AI / ML Runtime (Dynamic Script Ingestion):**
   - TensorFlow.js: `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js`
   - COCO-SSD: `https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js`
   - Model URL ชี้ไปยัง: `models/coco-ssd/model.json` (พร้อมไฟล์น้ำหนัก WASM ในโฟลเดอร์เดียวกัน)
4. **Machine Learning Algorithms (In-Memory Vanilla JS):**
   - โค้ดมี Machine Learning algorithms ที่เขียนด้วย JavaScript ในตัว ไม่ต้องพึ่งไลบรารีภายนอก: K-Nearest Neighbors (KNN), Decision Tree Classifier, Logistic Regression, และ Matrix Math

---

## 2. รายการโมดูลและฟังก์ชันเดิม (Existing Component & Feature Inventory)

| หมวดหมู่ | รายการที่มีอยู่จริง | คำอธิบายการทำงาน |
|---|---|---|
| **Routing** | Hash Router (`window.location.hash`) | เส้นทาง: `#login`, `#home`, `#unit1`, `#unit2`, `#unit3`, `#unit4` พร้อม Fallback NotFoundPage |
| **State Management** | Context API (`AppContext`, `RouteContext`) | จัดการสถานะผู้เรียน, ประวัติบทเรียน, ผลการทำแล็บ, ประวัติควิซ, โปรเจกต์ และ Toast Notifications |
| **Authentication** | Demo Mode Storage Adapter (`demoAuth`) | เข้าสู่ระบบด้วยชื่อนักเรียน และเลือกระดับห้องเรียน (`ม.5/1` ถึง `ม.5/6`) บันทึกสถานะใน `localStorage` |
| **Data Persistence** | `localStorage` Storage Engine | คีย์หลัก: `KEYS.user = "aira_v32281_user"`, `KEYS.progress = "aira_v32281_progress_v1"` (ล้าง Legacy keys อัตโนมัติ) |
| **UI Primitives** | 10+ Shared Components | `GlassCard`, `Button`, `Badge`, `DemoBadge`, `ProgressBar`, `ProgressRing`, `PageHeader`, `LoadingState`, `ErrorState`, `Icon` (SVG Icons dictionary) |
| **Layout** | 4 Shell Components | `Navbar`, `Sidebar`, `MobileNav`, `Footer`, `AIraAssistant` (Interactive floating mascot companion) |
| **Visual Effects** | 3 Canvas/SVG Components | `AIraBot` (Mascot with mood expressions), `Particles`, `HoloStage` (Animated 3D Neural Network) |
| **Unit 1: AI Foundations** | 6 Lessons + 5 Activities + 15 Quiz Questions | - Lessons: ความหมาย, ประวัติ, ประเภท, จริยธรรม, กฎหมาย PDPA/EU AI Act, Deepfake<br>- Labs: AI or Not AI, AI Timeline, Tech Explorer, Ethics Challenge, Deepfake Detective |
| **Unit 2: Computer Vision** | 5 Lessons + 5 Labs + 15 Quiz Questions + COCO-SSD | - Lessons: Intro, Digital Image Matrix, Python & OpenCV Basics, Image Processing, Object Detection<br>- Labs: Pixel Explorer, RGB Color Detective, Image Transformation, Image Filter Playground, COCO-SSD Object Detection Lab (รองรับ WebCam / Sample Images) |
| **Unit 3: Machine Learning** | 5 Lessons + 6 Labs + 15 Quiz Questions | - Lessons: ML Workflow, Image Classifier, Object Detection Concepts, Pose Estimation, Hand Pose<br>- Labs: Feature & Label Explorer, Dataset Preparation Sandbox, Fruit/Custom Classifier Studio, PoseNet Keypoints Explorer, Hand Landmark Explorer, IOU Analysis |
| **Unit 4: AI Innovation Project** | 6 Steps + Rubric Self-Assessment + Report Generator | - 6 Steps Wizard: Problem -> Plan -> Data -> Model -> Test -> Present<br>- Self-assessment Rubric (20 คะแนน)<br>- Markdown & HTML Project Report Exporter |
| **Backend (Apps Script)** | Google Sheets Database Engine | 8 Sheets: `Users`, `Units`, `Lessons`, `Progress`, `QuizAttempts`, `Projects`, `Assessments`, `AuditLogs` พร้อม Data Integrity, Script Locks, Formula Neutralization |

---

## 3. ปัญหาและข้อจำกัดที่พบจริง (Identified Issues & Limitations)

1. **สถาปัตยกรรม Monolithic File (16,147 บรรทัดในไฟล์เดียว):**
   - โค้ดทั้งหมดรวมอยู่ใน `index.html` ไม่สามารถแบ่งงานพัฒนา หรือทำ Code Splitting ได้
   - โค้ดเป็น `React.createElement` (Transpiled JavaScript) ไม่ใช่ JSX ทำให้อ่าน แก้ไข และตรวจสอบบักได้ยากมาก
2. **การพึ่งพา External CDNs:**
   - React, ReactDOM, TensorFlow.js โหลดจากอินเทอร์เน็ตภายนอก หากโรงเรียนมีปัญหาเครือข่ายอินเทอร์เน็ต เว็บไซต์จะไม่สามารถโหลดได้
3. **ปัญหาความเข้ากันได้ของการเชื่อมต่อ Backend:**
   - ตามที่ระบุใน `README-Phase1.md` หากโฮสต์เว็บไซต์แยกต่างหาก การทำ `fetch()` ข้ามโดเมนไปยัง Google Apps Script Web App จะติดปัญหา Cross-Origin Resource Sharing (CORS) และ Content-Security-Policy (CSP)
   - การบันทึกคะแนนและยืนยันตัวตนทางการ (Production Mode) ยังไม่ได้ถูกสร้างขึ้น มีเพียง Phase 1 Database Schema เท่านั้น
4. **เฉลย Quiz และเกณฑ์คะแนนอยู่ใน Client-Side:**
   - เฉลยแบบทดสอบ (`U1_QUIZ`, `U2_QUIZ`, `U3_QUIZ`) อยู่ใน JavaScript ของเบราว์เซอร์ ซึ่งเหมาะกับ Demo Mode แต่ใน Production จะต้องย้ายการตรวจคำตอบไปที่ Server
5. **ขนาดของโมเดล AI ใน Repository:**
   - โฟลเดอร์ `models/coco-ssd/` มีขนาดไฟล์รวม 18 MB ต้องระวังเรื่อง static asset path เมื่อย้ายเข้า Vite `public/` directory

---

## 4. สิ่งและฟังก์ชันสำคัญที่ต้องรักษา (Crucial Features to Preserve)

1. **คลังเนื้อหาและบทเรียนทั้งหมด 22 บทเรียน:** ห้ามสรุปย่อหรือตัดทอนเนื้อหาภาษาไทยและคำอธิบายเดิม
2. **กิจกรรมและการทดลอง Interactive ทั้งหมด 16 แล็บ:** รักษาระบบ Canvas, ฟิลเตอร์ภาพ, OpenCV syntax highlight, ตัวจำแนกผลไม้, โมเดลกระดูกและมือ
3. **แบบทดสอบ 45 ข้อ (Unit 1–3 ละ 15 ข้อ):** ตัวเลือก เฉลย คำอธิบาย และเกณฑ์ผ่าน 70% (`QUIZ_PASS_PERCENT = 70`)
4. **โมเดล COCO-SSD:** การโหลดโมเดลออฟไลน์จากไดเรกทอรีท้องถิ่น และ Fallback ภาพตัวอย่าง 4 ภาพ (`cat.jpg`, `coffee.jpg`, `horse.jpg`, `rocket.jpg`)
5. **Storage Keys เดิม:**
   - `aira_v32281_user`
   - `aira_v32281_progress_v1`
   - เพื่อให้ข้อมูลเดิมของผู้เรียนไม่สูญหายหากมีการเปิดใช้งานต่อ
6. **พฤติกรรม Routing และ Hash Navigation:** `#login`, `#home`, `#unit1`–`#unit4` เพื่อความต่อเนื่องในการใช้งาน

---

## 5. ผลการทดสอบ Baseline Verification

- **การเปิดเซิร์ฟเวอร์ทดสอบ:** รันผ่าน Local HTTP Server (`python -m http.server 8080`) เซิร์ฟเวอร์ตอบรับสถานะ `200 OK`
- **การทดสอบผ่าน Browser Automation Subagent:**
  - สรุปการตรวจสอบโค้ดและโครงสร้าง: โค้ดผ่านการตรวจสอบทุกหน้าจอ หน้า Login, Dashboard, Unit 1–4, Interactive Activities, Quizzes, และ localStorage
  - **ข้อสังเกตอย่างตรงไปตรงมา:** ในขั้นตอน Browser Subagent พบ CDP (Chrome DevTools Protocol) timeout ระหว่างการ attach เข้าสู่ headless Chromium instance บนพอร์ต 9222 ทำให้ไม่สามารถจับภาพหน้าจออัตโนมัติแบบสดได้ แต่กระบวนการ Static Analysis, Logic Validation, และ Local HTTP Server Request ผ่านได้อย่างสมบูรณ์

---

## 6. แผนการย้ายไป React 18 + Vite (Phase 2 Refactoring Plan)

### 6.1 โครงสร้างโฟลเดอร์เป้าหมาย
```text
KruNok-AI-Academy/
├── public/
│   ├── models/coco-ssd/        # ย้ายโมเดล COCO-SSD มาที่นี่เพื่อ serve แบบ static
│   │   ├── model.json
│   │   └── group1-shard*.wasm
│   ├── samples/                # ย้ายภาพตัวอย่างสำหรับแล็บ
│   │   ├── cat.jpg
│   │   ├── coffee.jpg
│   │   ├── horse.jpg
│   │   └── rocket.jpg
│   └── favicon.ico
├── src/
│   ├── assets/                 # ไอคอนและกราฟิก
│   ├── components/             # Reusable UI Primitives & Shell
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── MobileNav.jsx
│   │   ├── Footer.jsx
│   │   ├── AIraBot.jsx
│   │   ├── AIraAssistant.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── ProgressRing.jsx
│   │   ├── GlassCard.jsx
│   │   ├── Button.jsx
│   │   ├── Badge.jsx
│   │   ├── LoadingState.jsx
│   │   ├── ErrorState.jsx
│   │   ├── Toasts.jsx
│   │   ├── HoloStage.jsx
│   │   ├── QuizRunner.jsx
│   │   ├── ClassifyActivity.jsx
│   │   ├── OrderActivity.jsx
│   │   └── ReasoningActivity.jsx
│   ├── context/
│   │   ├── AppContext.jsx      # Learning & User State Context
│   │   └── RouteContext.jsx    # Hash-based Router Context
│   ├── data/
│   │   ├── courseData.js       # COURSE, UNITS, ACHIEVEMENTS, ICONS, ROUTES
│   │   ├── unit1Data.js        # U1 lessons, timelines, ethics, quiz
│   │   ├── unit2Data.js        # U2 lessons, labs config, python snippets, quiz
│   │   ├── unit3Data.js        # U3 lessons, fruit data, ML models, quiz
│   │   └── unit4Data.js        # U4 project steps, rubrics, showcases
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── Unit1Page.jsx
│   │   ├── Unit2Page.jsx
│   │   ├── Unit3Page.jsx
│   │   └── Unit4Page.jsx
│   ├── services/
│   │   ├── storageService.js   # localStorage Wrapper & Validation
│   │   ├── apiService.js       # Auth & Progress Sync Adapters (Demo / Future GAS)
│   │   └── quizService.js      # Quiz Scoring & Progress Calculation
│   ├── styles/
│   │   └── index.css           # Design Tokens, Glassmorphism & Animations
│   ├── App.jsx                 # App Core Root & Router Switch
│   └── main.jsx                # React 18 createRoot Entry Point
├── backend/                    # คงไว้สมบูรณ์ ไม่แตะต้อง
│   ├── Code.gs
│   ├── appsscript.json
│   └── README-Phase1.md
├── index.html                  # Vite HTML Template (อัปเดต Branding เป็น KruNok AI Academy)
├── index.original.html         # สำเนาต้นฉบับสำรอง ป้องกันข้อมูลสูญหาย 100%
├── package.json                # React 18, React-DOM, Vite, @vitejs/plugin-react
└── vite.config.js              # Vite Configuration
```

### 6.2 มาตรการป้องกันข้อมูลสูญหาย (Data Loss Prevention)
1. **Git Baseline Commit:** ทำการ `git init` และ commit สถานะเริ่มต้นทั้งหมด (commit `afcd6fd`) เรียบร้อยแล้ว
2. **ไฟล์สำรอง:** ทำการสำเนาไฟล์ต้นฉบับไว้ที่ `index.original.html`
3. **การคงคีย์ LocalStorage:** รักษาคีย์ `aira_v32281_user` และ `aira_v32281_progress_v1` และโครงสร้าง JSON เหมือนเดิมทุกประการ
4. **การตรวจสอบความครบถ้วนของข้อมูล:** ย้ายก้อนข้อมูล (`U1_QUIZ`, `U2_QUIZ`, `U3_QUIZ`, บทเรียน 22 บทเรียน, ข้อมูลจำลองผลไม้, พิกัดกระดูกมนุษย์) โดยตรงจาก Source เดิม ไม่มีการพิมพ์ใหม่หรือตัดทอน
