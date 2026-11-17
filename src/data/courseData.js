// Course & Platform Data for KruNok AI Academy

export const COURSE = {
  code: "ว32281",
  name: "ปัญญาประดิษฐ์เบื้องต้น",
  level: "มัธยมศึกษาปีที่ 5",
  term: "ภาคเรียนที่ 2 ปีการศึกษา 2569",
  school: "โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เชียงราย",
  teacher: "นางมนัสชนก ตามวงค์ (Kru Nok)",
  academy: "KruNok AI Academy",
  tagline: "Learn AI • Think Smart • Create the Future",
  mascot: "AIra",
  classrooms: ["ม.5/1", "ม.5/2", "ม.5/3", "ม.5/4", "ม.5/5", "ม.5/6"],
  levelShort: "ม.5",
  credits: 1,
  periodsPerWeek: 2
};

export const QUIZ_PASS_PERCENT = 70;
// เกณฑ์ผ่านเฉพาะหน่วย (ต้องตรงกับ passingPercent ใน backend/Code.gs)
export const QUIZ_PASS_BY_UNIT = { unit1: 60 };
export const quizPassPercent = unitId => QUIZ_PASS_BY_UNIT[unitId] ?? QUIZ_PASS_PERCENT;

export const UNITS = [
  {
    id: "unit1",
    no: 1,
    prompt: "03",
    titleEn: "AI Foundations & Ethics",
    title: "แนวคิดเบื้องต้นเกี่ยวกับปัญญาประดิษฐ์",
    desc: "ความหมาย ประวัติ และประเภทของ AI พร้อมจริยธรรม กฎหมาย Deepfake และการใช้ AI อย่างรับผิดชอบ",
    lessons: [
      { id: "u1-l1", title: "ความหมายของ AI" },
      { id: "u1-l2", title: "ประวัติและวิวัฒนาการ AI" },
      { id: "u1-l3", title: "ประเภทและเทคโนโลยี AI" },
      { id: "u1-l4", title: "จริยธรรม AI" },
      { id: "u1-l5", title: "กฎหมายและธรรมาภิบาล AI" },
      { id: "u1-l6", title: "Deepfake และ AI Safety" }
    ],
    activities: [
      { id: "u1-a1", title: "AI or Not AI" },
      { id: "u1-a2", title: "AI Timeline Challenge" },
      { id: "u1-a3", title: "AI Technology Explorer" },
      { id: "u1-a4", title: "AI Ethics & Risk Challenge" },
      { id: "u1-a5", title: "Deepfake Detective" }
    ],
    practice: [],
    quiz: { id: "u1-quiz", questions: 10 }
  },
  {
    id: "unit2",
    no: 2,
    prompt: "04",
    titleEn: "Computer Vision Fundamentals",
    title: "พื้นฐานคอมพิวเตอร์วิทัศน์",
    desc: "เข้าใจว่าคอมพิวเตอร์มองเห็นภาพได้อย่างไร ตั้งแต่พิกเซล OpenCV การประมวลผลภาพ ไปจนถึงการตรวจจับวัตถุด้วยโมเดลจริง",
    lessons: [
      { id: "u2-l1", title: "Introduction to Computer Vision" },
      { id: "u2-l2", title: "Digital Image Fundamentals" },
      { id: "u2-l3", title: "Python & OpenCV Basics" },
      { id: "u2-l4", title: "Image Processing" },
      { id: "u2-l5", title: "Face & Object Detection" }
    ],
    activities: [
      { id: "u2-a1", title: "LAB 2.1 Pixel Explorer" },
      { id: "u2-a2", title: "LAB 2.2 RGB Color Detective" },
      { id: "u2-a3", title: "LAB 2.3 Image Transformation" },
      { id: "u2-a4", title: "LAB 2.4 Image Processing Challenge" },
      { id: "u2-a5", title: "LAB 2.5 Object Detection Explorer" }
    ],
    practice: [],
    quiz: { id: "u2-quiz", questions: 15 },
    slidesUrl: "unit2/index.html",
    setupUrl: "unit2/setup.html",
    activityUrl: "https://chanok109.github.io/Krunok-AI-Academy/krunok-ai-academy/unit2/activity-2-1.html",
    codeUrl: "code/code-2.3-2.5.zip"
  },
  {
    id: "unit3",
    no: 3,
    prompt: "05",
    titleEn: "Machine Learning Applications",
    title: "พื้นฐานการเรียนรู้ของเครื่องและการสร้างโมเดล",
    desc: "ฝึกโมเดลแบบมีผู้สอนตั้งแต่เตรียมข้อมูลจนทำนาย พร้อมตัวจำแนกภาพ วัตถุ ท่าทางร่างกาย และท่าทางมือ",
    lessons: [
      { id: "u3-l1", title: "Introduction to Machine Learning" },
      { id: "u3-l2", title: "Image Classifier" },
      { id: "u3-l3", title: "Object Detection" },
      { id: "u3-l4", title: "Pose Classifier" },
      { id: "u3-l5", title: "Hand Pose Classifier" }
    ],
    activities: [
      { id: "u3-a1", title: "LAB 3.1 Feature & Label Explorer" },
      { id: "u3-a2", title: "LAB 3.2 Dataset Preparation" },
      { id: "u3-a3", title: "LAB 3.3 Image Classifier" },
      { id: "u3-a4", title: "LAB 3.4 Object Detection" },
      { id: "u3-a5", title: "LAB 3.5 Pose Classifier" },
      { id: "u3-a6", title: "LAB 3.6 Hand Pose Classifier" }
    ],
    practice: [],
    quiz: { id: "u3-quiz", questions: 15 },
    slidesUrl: "unit3/index.html",
    codeUrl: "code/code-unit3.zip"
  },
  {
    id: "unit4",
    no: 4,
    prompt: "06",
    titleEn: "AI Innovation Project",
    title: "การประยุกต์ใช้ AI เพื่อสร้างชิ้นงาน",
    desc: "ออกแบบ พัฒนา ทดสอบ และนำเสนอโครงงาน AI ที่แก้ปัญหาจริง ผ่าน 6 ขั้นตอนใน Project Studio",
    lessons: [
      { id: "u4-s1", title: "Define the Problem" },
      { id: "u4-s2", title: "Plan & Design" },
      { id: "u4-s3", title: "Collect & Prepare Data" },
      { id: "u4-s4", title: "Build AI Model" },
      { id: "u4-s5", title: "Test & Improve" },
      { id: "u4-s6", title: "Present & Reflect" }
    ],
    activities: [
      { id: "u4-eval", title: "ประเมินตนเองตาม Rubric" }
    ],
    practice: [],
    quiz: null,
    slidesUrl: "unit5/index.html",
    codeUrl: "code/code-unit5.zip"
  }
];

export const countItems = u => u.lessons.length + u.activities.length + u.practice.length + (u.quiz ? 1 : 0);
export const unitReady = u => countItems(u) > 0;

export const ROUTES = {
  login: { path: "/login", token: "login", label: "เข้าสู่ระบบ", public: true },
  home: { path: "/", token: "home", label: "หน้าหลัก" },
  unit1: { path: "/unit1", token: "unit1", label: "หน่วยที่ 1" },
  unit2: { path: "/unit2", token: "unit2", label: "หน่วยที่ 2" },
  unit3: { path: "/unit3", token: "unit3", label: "หน่วยที่ 3" },
  unit4: { path: "/unit4", token: "unit4", label: "หน่วยที่ 4" },
  teacher: { path: "/teacher", token: "teacher", label: "สำหรับครูผู้สอน" }
};

export const NAV_ORDER = ["home", "unit1", "unit2", "unit3", "unit4"];

export const API_CONFIG = {
  authProvider: typeof window !== 'undefined' && localStorage.getItem('krunok_auth_provider') ? localStorage.getItem('krunok_auth_provider') : "sheets",
  dataMode: typeof window !== 'undefined' && localStorage.getItem('krunok_data_mode') ? localStorage.getItem('krunok_data_mode') : "sheets",
  gasEndpoint: typeof window !== 'undefined' && localStorage.getItem('krunok_gas_endpoint') ? localStorage.getItem('krunok_gas_endpoint') : "https://script.google.com/macros/s/AKfycbwn0TUHLRizk49v3tS7X4296ZWd6CbkVaa3iM0Wr5U6OT_JE1WiavS7crdOYZeIi7vV/exec",
  googleClientId: typeof window !== 'undefined' && localStorage.getItem('krunok_google_client_id') ? localStorage.getItem('krunok_google_client_id') : ""
};

export const KEYS = {
  user: "aira_v32281_user",
  progress: "aira_v32281_progress_v1"
};

export const LEGACY_KEYS = ["aira.v1.student", "aira.v1.progress"];

export const ACHIEVEMENTS = [
  {
    id: "explorer",
    name: "AI Explorer",
    th: "นักสำรวจ AI",
    rule: "เรียนครบหน่วยที่ 1",
    art: "brain",
    test: s => s.units.unit1.completed
  },
  {
    id: "vision",
    name: "Vision Detective",
    th: "นักสืบภาพ",
    rule: "เรียนครบหน่วยที่ 2",
    art: "eye",
    test: s => s.units.unit2.completed
  },
  {
    id: "ml",
    name: "ML Engineer",
    th: "วิศวกรโมเดล",
    rule: "เรียนครบหน่วยที่ 3",
    art: "net",
    test: s => s.units.unit3.completed
  },
  {
    id: "innovator",
    name: "AI Innovator",
    th: "นักสร้างนวัตกรรม",
    rule: "ทำโครงงานครบ 6 ขั้นตอนและประเมินตนเอง",
    art: "bulb",
    test: s => s.units.unit4.completed
  },
  {
    id: "master",
    name: "AI Master",
    th: "ปรมาจารย์ AI",
    rule: "เรียนครบทั้ง 4 หน่วย",
    art: "crown",
    test: s => UNITS.every(u => s.units[u.id].completed)
  }
];

export const ICONS = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5",
  login: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  check: "M20 6 9 17l-5-5",
  x: "M18 6 6 18M6 6l12 12",
  info: "M12 16v-4M12 8h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z",
  alert: "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01",
  sparkle: "M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  flask: "M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3",
  puzzle: "M19.4 13a2 2 0 1 0 0-4H18V5a1 1 0 0 0-1-1h-4v-.6a2 2 0 1 0-4 0V4H5a1 1 0 0 0-1 1v4h.6a2 2 0 1 1 0 4H4v4a1 1 0 0 0 1 1h4v-.6a2 2 0 1 1 4 0v.6h4a1 1 0 0 0 1-1v-4z",
  target: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0zM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0z",
  trophy: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3",
  chevL: "M15 18l-6-6 6-6",
  chevR: "M9 18l6-6-6-6",
  refresh: "M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5",
  user: "M20 21a8 8 0 0 0-16 0M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  chart: "M3 3v18h18M7 15l4-4 3 3 6-6",
  play: "M6 4l14 8-14 8z",
  clock: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM12 6v6l4 2",
  award: "M15.5 13.5 17 22l-5-3-5 3 1.5-8.5M19 8A7 7 0 1 1 5 8a7 7 0 0 1 14 0z",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  eyeOff: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22",
  cpu: "M6 6h12v12H6zM9 9h6v6H9zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4",
  bulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  scale: "M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zm-14 0l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zm7-13v18M4 7h16",
  fileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  list: "M3 12h.01M3 18h.01M3 6h.01M8 12h13M8 18h13M8 6h13",
  expand: "M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7",
  minimize: "M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm18 2-10 7L2 6",
  map: "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zm7-4v16m8-12v16",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  mic: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  layers: "M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  image: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 10v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75",
  copy: "M9 9h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
  bot: "M12 2v4M8 6h8a4 4 0 0 1 4 4v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-7a4 4 0 0 1 4-4zM9 12h.01M15 12h.01M9 16h6M2 12h2M20 12h2",
  tv: "M4 5h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm4 16h8M12 18v3",
  external: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  openBook: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  slidePlay: "M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5zM8 21h8M12 18v3M10 8.5l5 2.5-5 2.5v-5z",
  arrowRight: "M5 12h14M12 5l7 7-7 7"
};

export const ASSISTANT_SCRIPT = {
  home: {
    mood: "happy",
    msg: "ยินดีต้อนรับสู่ KruNok AI Academy! เราคือ AIra หุ่นยนต์ AI ผู้ช่วยการเรียนรู้ จะพาไปเรียนรู้ปัญญาประดิษฐ์ทีละหน่วย เลือกหน่วยจากเมนูได้เลย",
    tips: ["วงแหวนมุมขวาบนคือความก้าวหน้ารวมของเธอ", "หน่วยที่ขึ้นว่า \"รอเปิดเนื้อหา\" ครูกำลังเตรียมบทเรียนอยู่"]
  },
  unit: {
    mood: "wink",
    msg: "หน่วยนี้ยังเตรียมเนื้อหาอยู่ เมื่อเปิดแล้วจะมีบทเรียน กิจกรรม แบบฝึก และแบบทดสอบให้ทำครบในหน้าเดียว",
    tips: [`แบบทดสอบผ่านเมื่อได้ ${QUIZ_PASS_PERCENT}% ขึ้นไป ทุกหน่วยใช้เกณฑ์เดียวกัน`, "ความก้าวหน้าบันทึกให้อัตโนมัติในเครื่องนี้"]
  },
  notfound: {
    mood: "think",
    msg: "อืม… ไม่พบหน้านี้ ลองกลับไปหน้าหลักนะ",
    tips: []
  },
  unit4: {
    mood: "happy",
    msg: "ยินดีต้อนรับสู่ Project Studio! พี่ AIra จะเป็นพี่เลี้ยงโครงงาน ทำตาม 6 ขั้นตอน ข้อมูลทุกช่องบันทึกอัตโนมัติในเบราว์เซอร์นี้",
    tips: ["Timeline อัปเดตจากข้อมูลที่กรอกจริง", "เพิ่มลิงก์หลักฐานได้เฉพาะที่ได้รับอนุญาตให้แชร์", "โหมดทดลองยังไม่ได้ส่งงานถึงครู"]
  },
  unit3: {
    mood: "happy",
    msg: "ยินดีต้อนรับสู่ ML Studio! หน่วยนี้มี 5 บทเรียน 6 Lab และแบบทดสอบ 15 ข้อ ทุกโมเดลฝึกและทำนายจริงในเบราว์เซอร์ของเธอ",
    tips: ["ฝึกโมเดลแล้วต้องทดสอบกับข้อมูลที่ไม่เคยเห็นเสมอ", "ทุก Lab มีคำถาม Reflection ให้เขียนสิ่งที่สังเกต", "เครื่องมือภายนอกเปิดในแท็บใหม่ ผลงานไม่ได้ส่งกลับมาเว็บนี้"]
  },
  unit2: {
    mood: "wink",
    msg: "ยินดีต้อนรับสู่ AI Vision Lab! หน่วยนี้มี 5 บทเรียน 5 Lab และแบบทดสอบ 15 ข้อ เครื่องมือทุกชิ้นประมวลผลภาพในเบราว์เซอร์ของเธอจริง",
    tips: ["ใช้ภาพที่ไม่ใช่ข้อมูลส่วนบุคคลเมื่ออัปโหลด", "Lab 2.5 โหลดโมเดล COCO-SSD ในเครื่องหรือออนไลน์", "จอคอมพิวเตอร์ใช้แผงควบคุมได้สะดวกกว่ามือถือ"]
  },
  unit1: {
    mood: "happy",
    msg: "หน่วยที่ 1 มี 6 บทเรียน 5 กิจกรรม และแบบทดสอบ 15 ข้อ เลือกหัวข้อจากสารบัญ หรือกด \"เริ่มเรียน\" ได้เลย",
    tips: ["กดปุ่ม \"เรียนจบบทนี้แล้ว\" ท้ายบทเพื่อบันทึกความก้าวหน้า", `แบบทดสอบผ่านเมื่อได้ ${QUIZ_PASS_PERCENT}% ขึ้นไป ทำใหม่ได้ไม่จำกัด`, "ข้อมูลกฎหมายดูวันที่ตรวจสอบได้ที่ปุ่ม \"แหล่งอ้างอิง\""]
  }
};
