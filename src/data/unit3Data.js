import React from 'react';

const FRUIT_FEATURES = [{
  id: "mass",
  name: "น้ำหนัก",
  unit: "กรัม",
  min: 60,
  max: 280
}, {
  id: "width",
  name: "ความกว้าง",
  unit: "ซม.",
  min: 5,
  max: 10
}, {
  id: "height",
  name: "ความสูง",
  unit: "ซม.",
  min: 5,
  max: 10
}, {
  id: "color",
  name: "ค่าสี (0 เขียว – 1 แดง)",
  unit: "",
  min: 0.4,
  max: 1
}];
const FRUIT_CLASSES = [{
  id: "apple",
  name: "แอปเปิล",
  color: "#FF7A90"
}, {
  id: "orange",
  name: "ส้ม",
  color: "#FFB547"
}, {
  id: "lemon",
  name: "เลมอน",
  color: "#E8E26A"
}];
const FRUIT_SPEC = {
  apple: {
    mass: [130, 215],
    width: [6.8, 8.8],
    height: [6.6, 8.4],
    color: [0.7, 0.95]
  },
  orange: {
    mass: [140, 245],
    width: [7, 9.4],
    height: [6.8, 9],
    color: [0.6, 0.8]
  },
  lemon: {
    mass: [95, 160],
    width: [5.8, 7.4],
    height: [7.2, 8.8],
    color: [0.52, 0.7]
  }
};

const IMG_CLASSES = [{
  id: "apple",
  name: "แอปเปิล",
  color: "#FF7A90"
}, {
  id: "banana",
  name: "กล้วย",
  color: "#E8E26A"
}, {
  id: "orange",
  name: "ส้ม",
  color: "#FFB547"
}];

const POSE_CLASSES = [{
  id: "raise",
  name: "ยกมือ",
  color: "#00E5FF"
}, {
  id: "spread",
  name: "กางแขน",
  color: "#FFD66D"
}, {
  id: "straight",
  name: "ยืนตรง",
  color: "#9B87F5"
}];
const KP_NAMES = ["จมูก", "ไหล่ซ้าย", "ไหล่ขวา", "ศอกซ้าย", "ศอกขวา", "ข้อมือซ้าย", "ข้อมือขวา", "สะโพกซ้าย", "สะโพกขวา", "เข่าซ้าย", "เข่าขวา", "ข้อเท้าซ้าย", "ข้อเท้าขวา"];

const POSE_PRESETS = {
  raise: {
    ls: 170,
    le: 0,
    rs: 170,
    re: 0
  },
  spread: {
    ls: 90,
    le: 0,
    rs: 90,
    re: 0
  },
  straight: {
    ls: 8,
    le: 0,
    rs: 8,
    re: 0
  }
};

const HAND_CLASSES = [{
  id: "open",
  name: "Open Palm · แบมือ",
  color: "#5BE3A8"
}, {
  id: "fist",
  name: "Fist · กำมือ",
  color: "#FF7A90"
}, {
  id: "thumb",
  name: "Thumbs Up · ยกนิ้วโป้ง",
  color: "#FFD66D"
}];
const FINGERS = [{
  n: "นิ้วโป้ง",
  base: [-24, -16],
  dir: -0.75,
  len: [16, 14, 12]
}, {
  n: "นิ้วชี้",
  base: [-17, -58],
  dir: -0.08,
  len: [22, 16, 13]
}, {
  n: "นิ้วกลาง",
  base: [-4, -62],
  dir: 0,
  len: [24, 18, 14]
}, {
  n: "นิ้วนาง",
  base: [9, -58],
  dir: 0.08,
  len: [22, 16, 13]
}, {
  n: "นิ้วก้อย",
  base: [21, -50],
  dir: 0.18,
  len: [17, 13, 11]
}];

const HAND_PRESETS = {
  open: {
    c: [0, 0, 0, 0, 0],
    rot: 0
  },
  fist: {
    c: [1, 1, 1, 1, 1],
    rot: 0
  },
  thumb: {
    c: [0, 1, 1, 1, 1],
    rot: 75
  }
};

const GROUND_TRUTH = {
  cat: [{
    class: "cat",
    bbox: [0, 0, 425, 300]
  }],
  coffee: [{
    class: "cup",
    bbox: [172, 18, 240, 290]
  }, {
    class: "spoon",
    bbox: [325, 65, 85, 262]
  }, {
    class: "dining table",
    bbox: [0, 0, 600, 400]
  }],
  horse: [{
    class: "horse",
    bbox: [18, 8, 374, 305]
  }],
  rocket: []
};

const ML_TOOLS = [{
  id: "tm",
  name: "Google Teachable Machine",
  url: "https://teachablemachine.withgoogle.com/",
  icon: "eye",
  what: "สร้างโมเดลจำแนกภาพ เสียง และท่าทางร่างกายผ่านเว็บเบราว์เซอร์ ใช้กล้องเก็บตัวอย่างได้ ไม่ต้องเขียนโค้ด",
  mission: ["เลือก Get Started แล้วสร้าง Image Project หรือ Pose Project", "ตั้งชื่อคลาส เช่น ยกมือ กางแขน ยืนตรง และเก็บตัวอย่างคลาสละ 30 ภาพขึ้นไป", "กด Train Model แล้วทดสอบในช่อง Preview", "บันทึกผลลงสมุด: ท่าไหนทายผิดบ่อย และเพราะอะไร"],
  note: "ต้องอนุญาตกล้องในเว็บไซต์ของ Teachable Machine เอง"
}, {
  id: "mlk",
  name: "Machine Learning for Kids",
  url: "https://machinelearningforkids.co.uk/",
  icon: "puzzle",
  what: "ฝึกโมเดลจำแนกข้อความ ภาพ ตัวเลข หรือเสียง แล้วนำไปใช้ในโปรเจกต์ Scratch",
  mission: ["เลือก Try it now หรือเข้าบัญชีห้องเรียนที่ครูสร้างให้", "สร้างโปรเจกต์ Recognising images ที่มี 2 คลาส เช่น ขยะรีไซเคิลได้/ไม่ได้", "เพิ่มตัวอย่างและกด Train new machine learning model", "เปิดใน Scratch แล้วสร้างเกมคัดแยกขยะ"],
  note: "รูปแบบบัญชีและขีดจำกัดเป็นไปตามที่เว็บไซต์กำหนด"
}, {
  id: "pb",
  name: "PictoBlox",
  url: "https://pictoblox.ai/",
  icon: "cpu",
  what: "โปรแกรมเขียนโค้ดแบบบล็อกและ Python ที่มีส่วนขยาย AI/ML เช่น ตรวจจับท่าทางและจำแนกภาพด้วยกล้อง ใช้ได้ทั้งแบบติดตั้งและบนเว็บ",
  mission: ["เปิด PictoBlox (เว็บหรือแอป) แล้วเพิ่มส่วนขยายด้าน AI หรือ Machine Learning", "ลองตัวอย่างการตรวจจับท่าทางมนุษย์ หรือฝึกตัวจำแนกภาพของตัวเอง", "เขียนบล็อกให้ตัวละครตอบสนองเมื่อพบท่า Thumbs Up", "จดว่าฟีเจอร์ใดใช้ได้ในบัญชีฟรี และฟีเจอร์ใดต้องใช้บัญชีพรีเมียม"],
  note: "บางฟีเจอร์ AI อาจต้องลงทะเบียนหรือใช้บัญชีแบบเสียเงิน"
}, {
  id: "colab",
  name: "Google Colab",
  url: "https://colab.research.google.com/",
  icon: "book",
  what: "เขียนและรัน Python บนคลาวด์ผ่านเบราว์เซอร์ มีไลบรารี ML เช่น scikit-learn ติดตั้งไว้แล้ว",
  mission: ["สร้าง Notebook ใหม่ (ใช้บัญชี Google)", "คัดลอกโค้ด kNN ในบทเรียน 3.1 ไปรัน", "เปลี่ยนค่า k และ Feature แล้วเปรียบเทียบ Accuracy", "แชร์ลิงก์ Notebook ให้ครูตามช่องทางของรายวิชา"],
  note: "ต้องเข้าสู่ระบบด้วยบัญชี Google"
}];

const U3_OBJECTIVES = ["อธิบายกระบวนการ Machine Learning แบบมีผู้สอน ตั้งแต่ข้อมูล การเตรียมข้อมูล การฝึก การทดสอบ จนถึงการทำนาย", "ระบุ Feature และ Label เตรียมชุดข้อมูล และแบ่งข้อมูลฝึกกับข้อมูลทดสอบได้อย่างเหมาะสม", "ฝึกและประเมินตัวจำแนกภาพ วัตถุ ท่าทางร่างกาย และท่าทางมือ ด้วย Accuracy, Precision และ Recall", "วิเคราะห์สาเหตุที่โมเดลผิดพลาด เช่น Overfitting และ Data Bias และเลือกใช้เครื่องมือ AI ภายนอกได้"];
const U3_ITEMS = {
  "u3-l1": {
    kind: "lesson",
    no: 1,
    tag: "บทเรียน 3.1",
    title: "Introduction to Machine Learning",
    en: "รู้จักการเรียนรู้ของเครื่อง",
    mins: 25,
    tip: "กดแต่ละขั้นในแผนภาพ ML แล้วลองใช้ Simulator ท้ายบท ฝึกโมเดลด้วย Feature ต่างคู่กันดูว่า Accuracy เปลี่ยนอย่างไร"
  },
  "u3-a1": {
    kind: "activity",
    no: 1,
    tag: "LAB 3.1",
    title: "Feature & Label Explorer",
    en: "เลือก Feature ที่ช่วยให้ทายแม่น",
    mins: 12,
    tip: "Feature ที่ดีคือข้อมูลที่ 'ต่างกันชัด' ระหว่างคลาส ลองคิดว่าแอปเปิลกับส้มต่างกันที่น้ำหนักหรือสีมากกว่ากัน"
  },
  "u3-a2": {
    kind: "activity",
    no: 2,
    tag: "LAB 3.2",
    title: "Dataset Preparation",
    en: "เตรียมชุดข้อมูลให้พร้อมฝึก",
    mins: 15,
    tip: "จุดสีที่อยู่ผิดกลุ่มในกราฟ มักเป็นตัวอย่างที่ติด Label ผิด กดที่จุดเพื่อดูว่าเป็นตัวอย่างไหน"
  },
  "u3-l2": {
    kind: "lesson",
    no: 2,
    tag: "บทเรียน 3.2",
    title: "Image Classifier",
    en: "ตัวจำแนกภาพ",
    mins: 20,
    tip: "สังเกตว่าตัวจำแนกภาพไม่ได้ 'เห็น' ผลไม้แบบคน มันดูตัวเลขสีของพิกเซล ลองชุดข้อมูลลำเอียงเพื่อดูว่าโมเดลหลงทางได้อย่างไร"
  },
  "u3-a3": {
    kind: "activity",
    no: 3,
    tag: "LAB 3.3",
    title: "Image Classifier",
    en: "ติดป้าย ฝึก ทดสอบ และหาสาเหตุที่ผิด",
    mins: 15,
    tip: "ติดป้ายให้ถูกทุกภาพก่อน แล้วค่อยลองชุดข้อมูลลำเอียง เปรียบเทียบ Accuracy ทั้งสองแบบ"
  },
  "u3-l3": {
    kind: "lesson",
    no: 3,
    tag: "บทเรียน 3.3",
    title: "Object Detection",
    en: "การตรวจจับวัตถุและการวัดผล",
    mins: 15,
    tip: "ลากแถบในตัวอย่าง IoU ให้เห็นว่ากรอบต้องซ้อนกันมากแค่ไหนจึงนับว่าทำนายตำแหน่งถูก"
  },
  "u3-a4": {
    kind: "activity",
    no: 4,
    tag: "LAB 3.4",
    title: "Object Detection",
    en: "วิเคราะห์ความถูกต้องของผลตรวจจับ",
    mins: 15,
    tip: "ดูทั้งกรอบที่โมเดลเจอ และกรอบคำตอบจริงที่โมเดลพลาด (FN) Precision กับ Recall บอกคนละเรื่องกัน"
  },
  "u3-l4": {
    kind: "lesson",
    no: 4,
    tag: "บทเรียน 3.4",
    title: "Pose Classifier",
    en: "ตัวจำแนกท่าทางร่างกาย",
    mins: 15,
    tip: "ตัวจำแนกท่าทางไม่ได้ดูภาพทั้งภาพ แต่ดูตำแหน่งจุดสำคัญของร่างกาย ลองขยับแขนหุ่นแล้วดูพิกัดเปลี่ยน"
  },
  "u3-a5": {
    kind: "activity",
    no: 5,
    tag: "LAB 3.5",
    title: "Pose Classifier",
    en: "ฝึกโมเดลจำแนก ยกมือ กางแขน ยืนตรง",
    mins: 15,
    tip: "เก็บตัวอย่างหลากหลาย เช่น ยกมือข้างเดียว ยกสองข้าง งอศอกเล็กน้อย โมเดลจะรับมือกับท่าใหม่ได้ดีขึ้น"
  },
  "u3-l5": {
    kind: "lesson",
    no: 5,
    tag: "บทเรียน 3.5",
    title: "Hand Pose Classifier",
    en: "ตัวจำแนกท่าทางมือ",
    mins: 15,
    tip: "Thumbs Up กับกำมือต่างกันแค่นิ้วโป้งนิ้วเดียว สังเกตว่าจุดสำคัญจุดไหนที่ช่วยแยกสองท่านี้"
  },
  "u3-a6": {
    kind: "activity",
    no: 6,
    tag: "LAB 3.6",
    title: "Hand Pose Classifier",
    en: "Hand Gesture Challenge",
    mins: 15,
    tip: "จำแนกด้วยตาตัวเองก่อน แล้วค่อยให้โมเดลที่เธอฝึกจำแนก เปรียบเทียบว่าใครแม่นกว่า และผิดตรงไหน"
  },
  "u3-quiz": {
    kind: "quiz",
    no: 3,
    tag: "แบบทดสอบ",
    title: "แบบทดสอบท้ายหน่วยที่ 3",
    en: "Unit 3 Assessment",
    mins: 20,
    tip: "ข้อที่ถามเรื่องผลลัพธ์ ให้คิดว่าข้อมูลที่ใช้ฝึกเป็นอย่างไร และทดสอบกับข้อมูลชุดไหน"
  }
};
const U3_SEQ = ["u3-l1", "u3-a1", "u3-a2", "u3-l2", "u3-a3", "u3-l3", "u3-a4", "u3-l4", "u3-a5", "u3-l5", "u3-a6", "u3-quiz"];
const U3_GROUPS = [{
  label: "Part A · หลักการ Machine Learning",
  ids: ["u3-l1", "u3-a1", "u3-a2"]
}, {
  label: "Part B · จำแนกภาพและตรวจจับวัตถุ",
  ids: ["u3-l2", "u3-a3", "u3-l3", "u3-a4"]
}, {
  label: "Part C · ท่าทางร่างกายและท่ามือ",
  ids: ["u3-l4", "u3-a5", "u3-l5", "u3-a6"]
}, {
  label: "ประเมินผล",
  ids: ["u3-quiz"]
}];
const U3_REFS = [{
  tag: "ML · อ้างอิงหลัก",
  title: "scikit-learn User Guide: Nearest Neighbors (kNN)",
  url: "https://scikit-learn.org/stable/modules/neighbors.html"
}, {
  tag: "ML · อ้างอิงหลัก",
  title: "scikit-learn: Cross-validation และการแบ่งข้อมูลฝึก/ทดสอบ",
  url: "https://scikit-learn.org/stable/modules/cross_validation.html"
}, {
  tag: "ML · อ้างอิงหลัก",
  title: "Google Machine Learning Crash Course",
  url: "https://developers.google.com/machine-learning/crash-course"
}, {
  tag: "Detection",
  title: "COCO Detection Evaluation (IoU, Precision, Recall)",
  url: "https://cocodataset.org/#detection-eval"
}, {
  tag: "Pose",
  title: "TensorFlow.js Pose Detection (MoveNet, PoseNet, BlazePose)",
  url: "https://github.com/tensorflow/tfjs-models/tree/master/pose-detection"
}, {
  tag: "Hand",
  title: "Google AI Edge: MediaPipe Hand Landmarker (21 จุดสำคัญ)",
  url: "https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker"
}, {
  tag: "เครื่องมือ",
  title: "Google Teachable Machine",
  url: "https://teachablemachine.withgoogle.com/"
}, {
  tag: "เครื่องมือ",
  title: "Machine Learning for Kids",
  url: "https://machinelearningforkids.co.uk/"
}, {
  tag: "เครื่องมือ",
  title: "PictoBlox (STEMpedia)",
  url: "https://pictoblox.ai/"
}, {
  tag: "เครื่องมือ",
  title: "Google Colab",
  url: "https://colab.research.google.com/"
}];

const PREP_ERRORS = {
  "apple-3": "orange",
  "apple-11": "lemon",
  "orange-5": "apple",
  "orange-14": "apple",
  "lemon-2": "orange",
  "lemon-9": "apple"
};

const U3_QUIZ = [{
  id: "q1",
  lesson: "u3-l1",
  level: "ความรู้ความเข้าใจ",
  answer: "b",
  q: "ข้อใดอธิบาย Machine Learning ได้ถูกต้องที่สุด",
  options: [{
    id: "a",
    text: "การเขียนกฎ IF–THEN ครอบคลุมทุกกรณีด้วยมือ"
  }, {
    id: "b",
    text: "การให้คอมพิวเตอร์เรียนรู้รูปแบบจากข้อมูลตัวอย่าง แล้วนำไปทำนายข้อมูลใหม่"
  }, {
    id: "c",
    text: "การเพิ่มความเร็วของซีพียู"
  }, {
    id: "d",
    text: "การเก็บข้อมูลจำนวนมากในฐานข้อมูล"
  }],
  explain: "ML เรียนรู้รูปแบบจากข้อมูลแทนการเขียนกฎทุกข้อเอง แล้วนำไปใช้กับข้อมูลที่ไม่เคยเห็น"
}, {
  id: "q2",
  lesson: "u3-l1",
  level: "ความรู้ความเข้าใจ",
  answer: "c",
  q: "ข้อใดเป็นงานแบบ Supervised Learning",
  options: [{
    id: "a",
    text: "จัดกลุ่มลูกค้าโดยไม่รู้ล่วงหน้าว่ามีกี่กลุ่ม"
  }, {
    id: "b",
    text: "หาหัวข้อที่พูดถึงบ่อยในข้อความจำนวนมากโดยไม่มีป้ายกำกับ"
  }, {
    id: "c",
    text: "ทำนายว่าอีเมลเป็นสแปมหรือไม่ จากอีเมลที่ติดป้ายสแปม/ไม่ใช่สแปมไว้แล้ว"
  }, {
    id: "d",
    text: "สุ่มเลือกข้อมูลมาแสดง"
  }],
  explain: "Supervised Learning เรียนจากตัวอย่างที่มี Label (สแปม/ไม่ใช่สแปม) ส่วนการจัดกลุ่มโดยไม่มีป้ายเป็น Unsupervised"
}, {
  id: "q3",
  lesson: "u3-a1",
  level: "การประยุกต์ใช้",
  answer: "a",
  q: "ชุดข้อมูลทำนายราคาบ้านมีคอลัมน์ พื้นที่ใช้สอย จำนวนห้องนอน ระยะห่างจากรถไฟฟ้า และราคาขาย ข้อใดถูกต้อง",
  options: [{
    id: "a",
    text: "ราคาขายคือ Label ส่วนอีก 3 คอลัมน์คือ Feature"
  }, {
    id: "b",
    text: "จำนวนห้องนอนคือ Label"
  }, {
    id: "c",
    text: "ทุกคอลัมน์เป็น Feature ไม่มี Label"
  }, {
    id: "d",
    text: "ระยะห่างจากรถไฟฟ้าคือ Label เพราะเป็นตัวเลข"
  }],
  explain: "Label คือค่าที่ต้องการทำนาย (ราคาขาย) ส่วน Feature คือข้อมูลที่ใช้ทำนาย"
}, {
  id: "q4",
  lesson: "u3-a2",
  level: "การวิเคราะห์",
  answer: "d",
  q: "นักเรียนฝึกโมเดลแล้วทดสอบกับข้อมูลชุดเดียวกับที่ใช้ฝึก ได้ Accuracy 100% ข้อสรุปใดเหมาะสมที่สุด",
  options: [{
    id: "a",
    text: "โมเดลสมบูรณ์แบบ นำไปใช้งานจริงได้ทันที"
  }, {
    id: "b",
    text: "ควรลบข้อมูลทดสอบทิ้ง"
  }, {
    id: "c",
    text: "Accuracy 100% แปลว่าไม่มี Data Bias"
  }, {
    id: "d",
    text: "ผลนี้ยังบอกความสามารถจริงไม่ได้ ต้องทดสอบกับข้อมูลที่โมเดลไม่เคยเห็น"
  }],
  explain: "การทดสอบกับข้อมูลฝึกเหมือนสอบด้วยข้อสอบที่เห็นเฉลยแล้ว ต้องแยกข้อมูลทดสอบเพื่อวัดความสามารถกับข้อมูลใหม่"
}, {
  id: "q5",
  lesson: "u3-a2",
  level: "การวิเคราะห์",
  answer: "b",
  q: "ชุดข้อมูลมีภาพแมว 950 ภาพ และสุนัข 50 ภาพ โมเดลที่ตอบว่า \"แมว\" ทุกครั้งจะได้ Accuracy เท่าใด และสะท้อนปัญหาอะไร",
  options: [{
    id: "a",
    text: "50% ไม่มีปัญหา"
  }, {
    id: "b",
    text: "95% แต่ไม่มีประโยชน์ เพราะข้อมูลไม่สมดุล โมเดลจำแนกสุนัขไม่ได้เลย"
  }, {
    id: "c",
    text: "100% เพราะแมวมีมากกว่า"
  }, {
    id: "d",
    text: "5% เพราะสุนัขมีน้อย"
  }],
  explain: "ตอบแมวทุกครั้งถูก 950 จาก 1000 = 95% ตัวเลขดูดีแต่หลอกตา ต้องดู Confusion Matrix และทำข้อมูลให้สมดุล"
}, {
  id: "q6",
  lesson: "u3-l1",
  level: "การวิเคราะห์",
  answer: "c",
  q: "โมเดลทำข้อมูลฝึกได้ 99% แต่ทำข้อมูลทดสอบได้เพียง 60% อาการนี้เรียกว่าอะไร",
  options: [{
    id: "a",
    text: "Underfitting"
  }, {
    id: "b",
    text: "Data Augmentation"
  }, {
    id: "c",
    text: "Overfitting"
  }, {
    id: "d",
    text: "Transfer Learning"
  }],
  explain: "Overfitting คือโมเดลจำข้อมูลฝึกละเอียดเกินไป รวมถึงความบังเอิญในข้อมูล จึงใช้กับข้อมูลใหม่ได้ไม่ดี"
}, {
  id: "q7",
  lesson: "u3-l1",
  level: "การประยุกต์ใช้",
  answer: "a",
  q: "ใช้ kNN ที่ k = 3 ทำนายผลไม้ลูกใหม่ เพื่อนบ้านใกล้ที่สุด 3 ตัวคือ ส้ม ส้ม แอปเปิล โมเดลจะทายว่าอะไร และ Confidence เท่าใด",
  options: [{
    id: "a",
    text: "ส้ม · ประมาณ 67%"
  }, {
    id: "b",
    text: "แอปเปิล · 33%"
  }, {
    id: "c",
    text: "ส้ม · 100%"
  }, {
    id: "d",
    text: "ทายไม่ได้"
  }],
  explain: "kNN โหวตเสียงข้างมาก ส้มได้ 2 จาก 3 เสียง จึงทายส้ม ความมั่นใจ 2/3 ≈ 67%"
}, {
  id: "q8",
  lesson: "u3-l2",
  level: "การประยุกต์ใช้",
  answer: "d",
  q: "ถังขยะอัจฉริยะที่ฝึกด้วยภาพขวดพลาสติกบนโต๊ะสีขาวทั้งหมด มักทายผิดเมื่อวางขวดบนโต๊ะไม้ วิธีแก้ที่ดีที่สุดคือข้อใด",
  options: [{
    id: "a",
    text: "ห้ามใช้บนโต๊ะไม้"
  }, {
    id: "b",
    text: "ลดจำนวนภาพฝึก"
  }, {
    id: "c",
    text: "ตั้ง Confidence threshold เป็น 0"
  }, {
    id: "d",
    text: "เก็บภาพฝึกเพิ่มให้หลากหลาย ทั้งพื้นหลัง แสง และมุมกล้อง ทุกคลาส"
  }],
  explain: "โมเดลเรียนรู้พื้นหลังสีขาวร่วมด้วย (Data Bias) การเพิ่มความหลากหลายของข้อมูลฝึกช่วยให้เรียนรู้ลักษณะของขวดจริง"
}, {
  id: "q9",
  lesson: "u3-l2",
  level: "ความรู้ความเข้าใจ",
  answer: "b",
  q: "Teachable Machine ใช้เทคนิคใด จึงฝึกตัวจำแนกภาพได้ดีแม้มีภาพตัวอย่างไม่มาก",
  options: [{
    id: "a",
    text: "เขียนกฎ IF–THEN อัตโนมัติ"
  }, {
    id: "b",
    text: "Transfer Learning: ต่อยอดโมเดลที่ฝึกกับภาพจำนวนมหาศาลมาแล้ว"
  }, {
    id: "c",
    text: "ส่งภาพให้คนจำแนกทีละภาพ"
  }, {
    id: "d",
    text: "ใช้เฉพาะสีของภาพ"
  }],
  explain: "Transfer Learning นำความรู้จากโมเดลที่ฝึกกับภาพนับล้านมาใช้สกัดคุณลักษณะ แล้วฝึกเฉพาะส่วนจำแนกด้วยภาพของเรา"
}, {
  id: "q10",
  lesson: "u3-l3",
  level: "ความรู้ความเข้าใจ",
  answer: "c",
  q: "ข้อใดแสดงความแตกต่างระหว่าง Image Classification กับ Object Detection ได้ถูกต้อง",
  options: [{
    id: "a",
    text: "Classification ให้ Bounding Box ส่วน Detection ให้แค่ชื่อ"
  }, {
    id: "b",
    text: "ทั้งสองให้ผลแบบเดียวกัน"
  }, {
    id: "c",
    text: "Classification บอกว่าภาพคืออะไร ส่วน Detection บอกว่ามีวัตถุอะไรบ้างและอยู่ตรงไหน"
  }, {
    id: "d",
    text: "Detection ใช้ได้กับภาพขาวดำเท่านั้น"
  }],
  explain: "Detection ให้ผลละเอียดกว่า คือทั้งชนิดและตำแหน่งของวัตถุแต่ละชิ้น"
}, {
  id: "q11",
  lesson: "u3-l3",
  level: "การวิเคราะห์",
  answer: "a",
  q: "ในภาพมีแมว 4 ตัว โมเดลตรวจจับเจอแมว 3 กรอบ ถูกทั้งหมด (TP = 3) และไม่มีกรอบผิด Precision และ Recall เป็นเท่าใด",
  options: [{
    id: "a",
    text: "Precision 100%, Recall 75%"
  }, {
    id: "b",
    text: "Precision 75%, Recall 100%"
  }, {
    id: "c",
    text: "ทั้งสองค่า 75%"
  }, {
    id: "d",
    text: "ทั้งสองค่า 100%"
  }],
  explain: "Precision = 3 ÷ (3 + 0) = 100% เพราะทุกกรอบถูก Recall = 3 ÷ (3 + 1) = 75% เพราะพลาดแมว 1 ตัว (FN)"
}, {
  id: "q12",
  lesson: "u3-l3",
  level: "การประยุกต์ใช้",
  answer: "b",
  q: "กรอบที่โมเดลทำนายกับกรอบคำตอบจริงมีพื้นที่ซ้อนทับ 40 ตารางหน่วย และพื้นที่รวมของทั้งสองกรอบ 100 ตารางหน่วย ถ้าใช้เกณฑ์ IoU ≥ 0.5 กรอบนี้นับเป็นอะไร",
  options: [{
    id: "a",
    text: "TP เพราะชื่อวัตถุถูก"
  }, {
    id: "b",
    text: "ไม่นับเป็น TP เพราะ IoU = 0.4 ต่ำกว่าเกณฑ์"
  }, {
    id: "c",
    text: "TP เพราะ IoU = 2.5"
  }, {
    id: "d",
    text: "FN เพราะกรอบใหญ่เกินไป"
  }],
  explain: "IoU = 40 ÷ 100 = 0.4 ต่ำกว่า 0.5 ตำแหน่งจึงยังไม่แม่นพอ นับเป็น FP และวัตถุจริงนั้นกลายเป็น FN"
}, {
  id: "q13",
  lesson: "u3-l4",
  level: "ความรู้ความเข้าใจ",
  answer: "d",
  q: "ตัวจำแนกท่าทางร่างกายในเครื่องมืออย่าง Teachable Machine (Pose Project) นำข้อมูลอะไรไปจำแนก",
  options: [{
    id: "a",
    text: "สีเสื้อของผู้ใช้"
  }, {
    id: "b",
    text: "ชื่อและอายุของผู้ใช้"
  }, {
    id: "c",
    text: "เสียงพูดของผู้ใช้"
  }, {
    id: "d",
    text: "พิกัดจุดสำคัญของร่างกาย (Keypoints) ที่ได้จากโมเดล Pose Estimation"
  }],
  explain: "Pose Estimation หาจุดสำคัญ เช่น ไหล่ ศอก ข้อมือ แล้วตัวจำแนกใช้พิกัดเหล่านั้นตัดสินท่าทาง"
}, {
  id: "q14",
  lesson: "u3-l5",
  level: "การวิเคราะห์",
  answer: "c",
  q: "โมเดลท่ามือที่ฝึกด้วยมือขวาของนักเรียนคนเดียว ทำงานได้ไม่ดีกับมือซ้ายของเพื่อน ข้อใดอธิบายได้ดีที่สุด",
  options: [{
    id: "a",
    text: "มือซ้ายมีจุดสำคัญน้อยกว่า 21 จุด"
  }, {
    id: "b",
    text: "โมเดลเสียต้องติดตั้งใหม่"
  }, {
    id: "c",
    text: "ข้อมูลฝึกไม่หลากหลาย ไม่ครอบคลุมมือซ้ายและมือของคนอื่น จึงเกิด Data Bias"
  }, {
    id: "d",
    text: "ท่ามือใช้ได้เฉพาะในห้องเรียน"
  }],
  explain: "มือซ้ายเป็นภาพสะท้อนของมือขวา ตำแหน่งจุดจึงต่างกัน ถ้าข้อมูลฝึกไม่ครอบคลุม โมเดลก็ใช้ไม่ได้ดี"
}, {
  id: "q15",
  lesson: "u3-l4",
  level: "การวิเคราะห์",
  answer: "a",
  q: "โรงเรียนจะใช้ระบบจำแนกท่าทางจากกล้องในโรงยิม เพื่อนับจำนวนครั้งที่นักเรียนกระโดดตบ ข้อใดเป็นแนวปฏิบัติที่เหมาะสมที่สุด",
  options: [{
    id: "a",
    text: "แจ้งนักเรียนเรื่องการใช้กล้อง ใช้เฉพาะพิกัดจุดสำคัญไม่เก็บภาพใบหน้า ทดสอบกับนักเรียนหลายรูปร่าง และให้ครูตรวจสอบผล"
  }, {
    id: "b",
    text: "บันทึกวิดีโอทุกคนเก็บไว้ถาวรเพื่อฝึกโมเดลในอนาคต"
  }, {
    id: "c",
    text: "ฝึกโมเดลจากนักเรียนคนเดียวก็พอ"
  }, {
    id: "d",
    text: "ใช้ผลของระบบตัดเกรดทันทีโดยไม่ต้องตรวจสอบ"
  }],
  explain: "ต้องคำนึงทั้งความเป็นส่วนตัว (PDPA) ความหลากหลายของข้อมูล และการกำกับดูแลโดยมนุษย์ ตามที่เรียนในหน่วยที่ 1"
}];


export {
  FRUIT_FEATURES,
  FRUIT_CLASSES,
  FRUIT_SPEC,
  IMG_CLASSES,
  POSE_CLASSES,
  KP_NAMES,
  POSE_PRESETS,
  HAND_CLASSES,
  FINGERS,
  HAND_PRESETS,
  GROUND_TRUTH,
  ML_TOOLS,
  U3_OBJECTIVES,
  U3_ITEMS,
  U3_SEQ,
  U3_GROUPS,
  U3_REFS,
  PREP_ERRORS,
  U3_QUIZ
};
