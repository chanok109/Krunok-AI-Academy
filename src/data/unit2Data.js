import React from 'react';

const ROBOT_ART = ["................", ".......YY.......", ".......LL.......", "...LLWWWWWWLL...", "..LWWWWWWWWWWL..", "..LWNNNNNNNNWL..", "..LWNCCNNCCNWL..", "..LWNCCNNCCNWL..", "..LWNNNNNNNNWL..", "..LWNNNCCNNNWL..", "..LWWWWWWWWWWL..", "...LLWWWWWWLL...", ".....WWNNWW.....", ".....WWYYWW.....", ".....WWWWWW.....", "................"];
const ROBOT_PAL = {
  ".": [11, 16, 38],
  W: [244, 246, 251],
  L: [155, 135, 245],
  N: [22, 19, 54],
  C: [0, 229, 255],
  Y: [255, 214, 109]
};
function robotImage() {
  const img = {
    width: 16,
    height: 16,
    data: new Uint8ClampedArray(16 * 16 * 4)
  };
  ROBOT_ART.forEach((row, y) => [...row].forEach((ch, x) => {
    const [r, g, b] = ROBOT_PAL[ch];
    const o = (y * 16 + x) * 4;
    img.data[o] = r;
    img.data[o + 1] = g;
    img.data[o + 2] = b;
    img.data[o + 3] = 255;
  }));
  return img;
}
const SAMPLES = [{
  id: "robot",
  label: "AIra พิกเซลอาร์ต 16×16",
  credit: "สร้างในหน้าเว็บนี้"
}, {
  id: "cat",
  label: "แมว",
  url: "samples/cat.jpg",
  credit: "ภาพแมว Chelsea · CC0 โดย Stefan van der Walt (scikit-image)"
}, {
  id: "coffee",
  label: "กาแฟ",
  url: "samples/coffee.jpg",
  credit: "ภาพกาแฟ · CC0 โดย Rachel Michetti (scikit-image)"
}, {
  id: "horse",
  label: "เงาม้า",
  url: "samples/horse.jpg",
  credit: "ภาพเงาม้า · CC0 โดย Andreas Preuss (scikit-image)"
}, {
  id: "rocket",
  label: "จรวด",
  url: "samples/rocket.jpg",
  credit: "จรวด Falcon 9 · สาธารณสมบัติโดย SpaceX (scikit-image)"
}];


const BLUR_OPTS = [1, 3, 5, 7, 9, 11, 15];

const DEFAULT_PARAMS = {
  cx: 0,
  cy: 0,
  cw: 100,
  ch: 100,
  scale: 100,
  flipH: false,
  flipV: false,
  gray: false,
  beta: 0,
  blur: 1
};

const PY_KW = new Set(["import", "from", "as", "def", "return", "if", "else", "elif", "for", "in", "while", "and", "or", "not", "with", "True", "False", "None", "is", "lambda", "try", "except"]);
const PY_BUILTIN = new Set(["print", "len", "range", "int", "float", "str", "type", "list", "round", "max", "min"]);


const RECORDED = {
  cat: [{
    class: "cat",
    score: 0.929,
    bbox: [1, 2, 406, 296]
  }],
  coffee: [{
    class: "cup",
    score: 0.964,
    bbox: [174, 21, 239, 219]
  }],
  horse: [{
    class: "horse",
    score: 0.946,
    bbox: [20, 8, 372, 308]
  }],
  rocket: [{
    class: "boat",
    score: 0.294,
    bbox: [94, 95, 128, 303]
  }, {
    class: "boat",
    score: 0.223,
    bbox: [343, 111, 107, 290]
  }]
};
const COCO_TH = {
  person: "คน",
  bicycle: "จักรยาน",
  car: "รถยนต์",
  motorcycle: "รถจักรยานยนต์",
  airplane: "เครื่องบิน",
  bus: "รถบัส",
  train: "รถไฟ",
  truck: "รถบรรทุก",
  boat: "เรือ",
  "traffic light": "ไฟจราจร",
  bird: "นก",
  cat: "แมว",
  dog: "สุนัข",
  horse: "ม้า",
  sheep: "แกะ",
  cow: "วัว",
  elephant: "ช้าง",
  bear: "หมี",
  zebra: "ม้าลาย",
  giraffe: "ยีราฟ",
  backpack: "กระเป๋าเป้",
  umbrella: "ร่ม",
  handbag: "กระเป๋าถือ",
  bottle: "ขวด",
  "wine glass": "แก้วไวน์",
  cup: "ถ้วย/แก้ว",
  fork: "ส้อม",
  knife: "มีด",
  spoon: "ช้อน",
  bowl: "ชาม",
  banana: "กล้วย",
  apple: "แอปเปิล",
  orange: "ส้ม",
  chair: "เก้าอี้",
  couch: "โซฟา",
  "potted plant": "กระถางต้นไม้",
  bed: "เตียง",
  "dining table": "โต๊ะอาหาร",
  tv: "โทรทัศน์",
  laptop: "แล็ปท็อป",
  mouse: "เมาส์",
  keyboard: "คีย์บอร์ด",
  "cell phone": "โทรศัพท์มือถือ",
  book: "หนังสือ",
  clock: "นาฬิกา",
  vase: "แจกัน",
  scissors: "กรรไกร",
  "teddy bear": "ตุ๊กตาหมี"
};


const U2_OBJECTIVES = ["อธิบายความหมายและหลักการทำงานของคอมพิวเตอร์วิทัศน์ และจำแนกงาน Classification, Object Detection และ Face Detection ได้", "อธิบายองค์ประกอบของภาพดิจิทัล ได้แก่ พิกเซล ความละเอียด ระบบสี RGB ระดับเทา และเมทริกซ์ภาพ", "เขียนโปรแกรม Python ด้วย OpenCV เพื่ออ่าน ปรับขนาด แปลงสี กลับภาพ และบันทึกภาพได้", "ประมวลผลภาพ และอธิบายผลการตรวจจับวัตถุจาก Bounding Box และ Confidence Score พร้อมข้อจำกัด"];
const U2_ITEMS = {
  "u2-l1": {
    kind: "lesson",
    no: 1,
    tag: "บทเรียน 2.1",
    ch: "A",
    title: "Introduction to Computer Vision",
    en: "รู้จักคอมพิวเตอร์วิทัศน์",
    mins: 15,
    tip: "เริ่มจากคำถามว่า คอมพิวเตอร์ 'เห็น' ภาพเป็นอะไร กดแต่ละขั้นในแผนภาพ แล้วสลับดูว่างานจำแนก ตรวจจับ และตรวจจับใบหน้าให้ผลต่างกันอย่างไร"
  },
  "u2-l2": {
    kind: "lesson",
    no: 2,
    tag: "บทเรียน 2.2",
    ch: "A",
    title: "Digital Image Fundamentals",
    en: "พื้นฐานภาพดิจิทัล",
    mins: 20,
    tip: "ใช้ Pixel Explorer คลิกดูค่าสีจริงของพิกเซล แล้วสังเกตว่า OpenCV เก็บสีเรียงเป็น B G R ไม่ใช่ R G B"
  },
  "u2-a1": {
    kind: "activity",
    no: 1,
    tag: "LAB 2.1",
    ch: "A",
    title: "Pixel Explorer",
    en: "สำรวจพิกเซลและ shape ของภาพ",
    mins: 10,
    tip: "ภาพหุ่นยนต์มีแค่ 16×16 พิกเซล ลองนับดูว่าดวงตาอยู่ที่พิกัดไหน"
  },
  "u2-a2": {
    kind: "activity",
    no: 2,
    tag: "LAB 2.2",
    ch: "A",
    title: "RGB Color Detective",
    en: "ผสมสีจากค่า R G B",
    mins: 10,
    tip: "เริ่มจากถามตัวเองว่าสีนี้ 'มีแดงมากไหม' แล้วค่อยปรับเขียวและน้ำเงิน แสงสียิ่งผสมยิ่งสว่าง"
  },
  "u2-l3": {
    kind: "lesson",
    no: 3,
    tag: "บทเรียน 2.3",
    ch: "B",
    title: "Python & OpenCV Basics",
    en: "ใช้ Python และ OpenCV",
    mins: 25,
    tip: "อ่านคอมเมนต์ภาษาไทยในโค้ดทีละบรรทัด แล้วลองคัดลอกไปรันใน Google Colab ด้วยภาพของตัวเอง"
  },
  "u2-l4": {
    kind: "lesson",
    no: 4,
    tag: "บทเรียน 2.4",
    ch: "B",
    title: "Image Processing",
    en: "การประมวลผลภาพ",
    mins: 20,
    tip: "ปรับแถบควบคุมทีละอย่าง สังเกตทั้งภาพผลลัพธ์ ขนาดภาพ และโค้ด OpenCV ที่เปลี่ยนตาม"
  },
  "u2-a3": {
    kind: "activity",
    no: 3,
    tag: "LAB 2.3",
    ch: "B",
    title: "Image Transformation",
    en: "แปลงภาพตามโจทย์",
    mins: 10,
    tip: "อ่านโจทย์ให้ครบทุกข้อก่อน แล้วใช้เฉพาะเครื่องมือที่โจทย์ขอ ส่วนอื่นปล่อยเป็นค่าเริ่มต้น"
  },
  "u2-a4": {
    kind: "activity",
    no: 4,
    tag: "LAB 2.4",
    ch: "B",
    title: "Image Processing Challenge",
    en: "สร้างภาพให้ตรงเป้าหมาย",
    mins: 15,
    tip: "ดูขนาดภาพเป้าหมายก่อน จะรู้ว่าต้องตัดภาพเท่าไร จากนั้นสังเกตสี ทิศทาง และความคม"
  },
  "u2-l5": {
    kind: "lesson",
    no: 5,
    tag: "บทเรียน 2.5",
    ch: "C",
    title: "Face & Object Detection",
    en: "การตรวจจับใบหน้าและวัตถุ",
    mins: 20,
    tip: "จำให้แม่น 'ตรวจจับ' คือบอกว่ามีวัตถุอยู่ตรงไหน ส่วน 'ระบุตัวบุคคล' คือบอกว่าเป็นใคร สองอย่างนี้ต่างกันมาก"
  },
  "u2-a5": {
    kind: "activity",
    no: 5,
    tag: "LAB 2.5",
    ch: "C",
    title: "Object Detection Explorer",
    en: "ทดลองโมเดลตรวจจับวัตถุจริง",
    mins: 15,
    tip: "ลองภาพจรวด แล้วถามตัวเองว่าทำไมโมเดลถึงตอบผิดและไม่มั่นใจ คำตอบอยู่ที่ข้อมูลที่ใช้ฝึกโมเดล"
  },
  "u2-quiz": {
    kind: "quiz",
    no: 2,
    tag: "แบบทดสอบ",
    ch: "Q",
    title: "แบบทดสอบท้ายหน่วยที่ 2",
    en: "Unit 2 Assessment",
    mins: 20,
    tip: "ข้อที่มีโค้ด ให้ไล่ทีละบรรทัดว่าตัวแปรเปลี่ยนเป็นอะไร โดยเฉพาะลำดับ (สูง, กว้าง) และ BGR"
  }
};
const U2_SEQ = ["u2-l1", "u2-l2", "u2-a1", "u2-a2", "u2-l3", "u2-l4", "u2-a3", "u2-a4", "u2-l5", "u2-a5", "u2-quiz"];
const U2_GROUPS = [{
  label: "Part A · ภาพดิจิทัลในสายตาคอมพิวเตอร์",
  ids: ["u2-l1", "u2-l2", "u2-a1", "u2-a2"]
}, {
  label: "Part B · Python, OpenCV และการประมวลผลภาพ",
  ids: ["u2-l3", "u2-l4", "u2-a3", "u2-a4"]
}, {
  label: "Part C · การตรวจจับใบหน้าและวัตถุ",
  ids: ["u2-l5", "u2-a5"]
}, {
  label: "ประเมินผล",
  ids: ["u2-quiz"]
}];
const U2_REFS = [{
  tag: "OpenCV · ทางการ",
  title: "OpenCV: Image file reading and writing (cv2.imread, cv2.imwrite)",
  url: "https://docs.opencv.org/4.x/d4/da8/group__imgcodecs.html"
}, {
  tag: "OpenCV · ทางการ",
  title: "OpenCV: Geometric Image Transformations (cv2.resize)",
  url: "https://docs.opencv.org/4.x/da/d54/group__imgproc__transform.html"
}, {
  tag: "OpenCV · ทางการ",
  title: "OpenCV: Color conversions (สูตร RGB → GRAY)",
  url: "https://docs.opencv.org/4.x/de/d25/imgproc_color_conversions.html"
}, {
  tag: "OpenCV · ทางการ",
  title: "OpenCV: Operations on arrays (cv2.flip)",
  url: "https://docs.opencv.org/4.x/d2/de8/group__core__array.html"
}, {
  tag: "OpenCV · ทางการ",
  title: "OpenCV: Image Filtering (cv2.blur)",
  url: "https://docs.opencv.org/4.x/d4/d86/group__imgproc__filter.html"
}, {
  tag: "NumPy · ทางการ",
  title: "NumPy: Indexing on ndarrays",
  url: "https://numpy.org/doc/stable/user/basics.indexing.html"
}, {
  tag: "โมเดลตรวจจับ",
  title: "TensorFlow.js Models: COCO-SSD (Apache License 2.0)",
  url: "https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd"
}, {
  tag: "ชุดข้อมูล",
  title: "COCO: Common Objects in Context",
  url: "https://cocodataset.org/"
}, {
  tag: "ภาพตัวอย่าง",
  title: "scikit-image: skimage.data (ภาพ CC0 และสาธารณสมบัติ)",
  url: "https://scikit-image.org/docs/stable/api/skimage.data.html"
}];
const CV_PIPE = [{
  id: "in",
  icon: "eye",
  t: "รับภาพ",
  d: "กล้องหรือไฟล์ภาพส่งข้อมูลเข้ามา เหมือนดวงตารับแสง"
}, {
  id: "num",
  icon: "grid",
  t: "แปลงเป็นตัวเลข",
  d: "ภาพถูกเก็บเป็นตารางพิกเซล แต่ละพิกเซลมีค่าสีเป็นตัวเลข 0–255 คอมพิวเตอร์ 'เห็น' แค่ตัวเลขเหล่านี้"
}, {
  id: "pre",
  icon: "cpu",
  t: "เตรียมภาพ",
  d: "ปรับขนาด แปลงสี ลดสัญญาณรบกวน ให้ภาพพร้อมสำหรับวิเคราะห์ (Image Processing)"
}, {
  id: "feat",
  icon: "puzzle",
  t: "หาลักษณะเด่น",
  d: "หาเส้นขอบ มุม พื้นผิว รูปทรง ในยุค Deep Learning โมเดลเรียนรู้ลักษณะเด่นเองจากข้อมูลตัวอย่างจำนวนมาก"
}, {
  id: "dec",
  icon: "target",
  t: "ตัดสินใจ",
  d: "โมเดลบอกผล เช่น ภาพนี้คืออะไร วัตถุอยู่ตรงไหน พร้อมค่าความมั่นใจ (Confidence)"
}];


const MATRIX_EX = [[12, 40, 200, 255], [30, 90, 210, 240], [55, 110, 180, 205], [80, 150, 160, 170]];

const CODE_SETUP = `# ติดตั้งบนเครื่องตัวเอง (Google Colab ติดตั้งมาให้แล้ว)
# pip install opencv-python numpy

import cv2          # ไลบรารีประมวลผลภาพ
import numpy as np  # ไลบรารีจัดการอาร์เรย์ตัวเลข

print(cv2.__version__)  # ตรวจเวอร์ชัน OpenCV`;
const CODE_READ = `img = cv2.imread("cat.jpg")       # อ่านภาพสี ได้อาร์เรย์ NumPy แบบ BGR

if img is None:                    # ถ้าชื่อไฟล์หรือที่อยู่ผิด จะได้ None ไม่ใช่ error
    print("อ่านไฟล์ภาพไม่สำเร็จ")
else:
    print(img.shape)               # (300, 451, 3) -> สูง 300 กว้าง 451 มี 3 ช่องสี
    print(img.dtype)               # uint8 -> ค่า 0–255
    print(img[0, 0])               # ค่า [B G R] ของพิกเซลมุมบนซ้าย`;
const CODE_SHOW = `# บนคอมพิวเตอร์ (เปิดหน้าต่างแสดงภาพ)
cv2.imshow("My Cat", img)
cv2.waitKey(0)            # รอจนกดปุ่มใดก็ได้
cv2.destroyAllWindows()   # ปิดหน้าต่างทั้งหมด

# บน Google Colab ใช้ cv2.imshow() ไม่ได้ ให้ใช้แทน
from google.colab.patches import cv2_imshow
cv2_imshow(img)`;
const CODE_TRANSFORM = `small = cv2.resize(img, (200, 150))           # กำหนดขนาด (กว้าง, สูง)
half  = cv2.resize(img, None, fx=0.5, fy=0.5) # หรือกำหนดเป็นอัตราส่วน

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # แปลงเป็นระดับเทา
print(gray.shape)                             # (300, 451) -> เหลือ 2 มิติ

rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)    # สลับเป็น RGB ก่อนแสดงด้วย matplotlib

mirror = cv2.flip(img, 1)    # 1 = กลับซ้าย-ขวา
upside = cv2.flip(img, 0)    # 0 = กลับบน-ล่าง
both   = cv2.flip(img, -1)   # -1 = กลับทั้งสองแกน

crop = img[50:200, 100:300]  # ตัดภาพด้วย NumPy slicing [y1:y2, x1:x2]`;
const CODE_WRITE = `ok = cv2.imwrite("cat_gray.jpg", gray)   # บันทึกภาพ นามสกุลไฟล์กำหนดรูปแบบ
print(ok)                                  # True ถ้าบันทึกสำเร็จ`;
const CODE_PLT = `import matplotlib.pyplot as plt

plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))   # matplotlib ต้องการ RGB
plt.axis("off")
plt.show()`;


const TH_DEMO = [{
  c: "cat",
  s: 0.93
}, {
  c: "cup",
  s: 0.71
}, {
  c: "chair",
  s: 0.42
}, {
  c: "dog",
  s: 0.18
}];

const COLOR_TARGETS = [{
  name: "ม่วงลาเวนเดอร์ของ AIra",
  rgb: [155, 135, 245]
}, {
  name: "ส้ม",
  rgb: [255, 140, 0]
}, {
  name: "เขียวมะนาว",
  rgb: [150, 220, 60]
}];
const colorDist = (a, b) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);

const U24_RECIPE = {
  ...DEFAULT_PARAMS,
  cx: 25,
  cy: 10,
  cw: 50,
  ch: 60,
  flipV: true,
  gray: true,
  beta: 40,
  blur: 5
};


const U2_QUIZ = [{
  id: "q1",
  lesson: "u2-l1",
  level: "ความรู้ความเข้าใจ",
  answer: "c",
  q: "ข้อใดอธิบายคอมพิวเตอร์วิทัศน์ (Computer Vision) ได้ถูกต้องที่สุด",
  options: [{
    id: "a",
    text: "การทำให้จอคอมพิวเตอร์แสดงภาพคมชัดขึ้น"
  }, {
    id: "b",
    text: "การออกแบบกล้องให้มีความละเอียดสูง"
  }, {
    id: "c",
    text: "สาขาของ AI ที่ทำให้คอมพิวเตอร์รับรู้ วิเคราะห์ และเข้าใจข้อมูลจากภาพหรือวิดีโอ"
  }, {
    id: "d",
    text: "โปรแกรมตกแต่งภาพสำหรับนักออกแบบ"
  }],
  explain: "Computer Vision มุ่งให้คอมพิวเตอร์ 'เข้าใจ' ภาพ เช่น บอกว่ามีอะไรอยู่ตรงไหน ไม่ใช่แค่แสดงหรือแต่งภาพ"
}, {
  id: "q2",
  lesson: "u2-l1",
  level: "การประยุกต์ใช้",
  answer: "a",
  q: "ระบบนับรถบนถนนที่วาดกรอบรอบรถแต่ละคันพร้อมชื่อ \"car\" เป็นงานประเภทใด",
  options: [{
    id: "a",
    text: "Object Detection"
  }, {
    id: "b",
    text: "Image Classification"
  }, {
    id: "c",
    text: "Face Recognition"
  }, {
    id: "d",
    text: "Grayscale Conversion"
  }],
  explain: "การบอกทั้งประเภทและตำแหน่งของวัตถุหลายชิ้นด้วย Bounding Box คือ Object Detection ส่วน Classification ให้ป้ายกำกับกับทั้งภาพ"
}, {
  id: "q3",
  lesson: "u2-l2",
  level: "ความรู้ความเข้าใจ",
  answer: "d",
  q: "ภาพความละเอียด 1920 × 1080 มีพิกเซลทั้งหมดกี่พิกเซล",
  options: [{
    id: "a",
    text: "3,000"
  }, {
    id: "b",
    text: "1,920,000"
  }, {
    id: "c",
    text: "6,220,800"
  }, {
    id: "d",
    text: "2,073,600"
  }],
  explain: "1920 × 1080 = 2,073,600 พิกเซล ส่วน 6,220,800 คือจำนวนค่าตัวเลขเมื่อคูณ 3 ช่องสี"
}, {
  id: "q4",
  lesson: "u2-l2",
  level: "การประยุกต์ใช้",
  answer: "b",
  q: "พิกเซลที่มีค่า RGB(255, 0, 255) จะแสดงเป็นสีใด",
  options: [{
    id: "a",
    text: "เหลือง"
  }, {
    id: "b",
    text: "ม่วงแดง (Magenta)"
  }, {
    id: "c",
    text: "ฟ้า (Cyan)"
  }, {
    id: "d",
    text: "ขาว"
  }],
  explain: "แดงเต็ม + น้ำเงินเต็ม ไม่มีเขียว ผสมแสงได้สีม่วงแดง (Magenta) ส่วนเหลือง = แดง + เขียว"
}, {
  id: "q5",
  lesson: "u2-l2",
  level: "การวิเคราะห์",
  answer: "c",
  q: "พิกเซล RGB(200, 100, 50) เมื่อแปลงเป็นระดับเทาด้วย cv2.COLOR_BGR2GRAY จะได้ค่าประมาณเท่าใด",
  options: [{
    id: "a",
    text: "117 (ค่าเฉลี่ยธรรมดา)"
  }, {
    id: "b",
    text: "200 (ค่าที่มากที่สุด)"
  }, {
    id: "c",
    text: "124"
  }, {
    id: "d",
    text: "350 (ผลรวม)"
  }],
  explain: "0.299×200 + 0.587×100 + 0.114×50 = 59.8 + 58.7 + 5.7 = 124.2 ≈ 124 OpenCV ให้น้ำหนักสีเขียวมากที่สุด จึงไม่ใช่ค่าเฉลี่ยธรรมดา"
}, {
  id: "q6",
  lesson: "u2-l3",
  level: "การวิเคราะห์",
  answer: "a",
  q: "ภาพ cat.jpg กว้าง 640 พิกเซล สูง 480 พิกเซล โค้ดนี้จะแสดงผลอะไร",
  code: 'img = cv2.imread("cat.jpg")\nprint(img.shape)',
  options: [{
    id: "a",
    text: "(480, 640, 3)"
  }, {
    id: "b",
    text: "(640, 480, 3)"
  }, {
    id: "c",
    text: "(640, 480)"
  }, {
    id: "d",
    text: "(3, 640, 480)"
  }],
  explain: "shape เรียงเป็น (สูง, กว้าง, ช่องสี) จึงเป็น (480, 640, 3)"
}, {
  id: "q7",
  lesson: "u2-l3",
  level: "การวิเคราะห์",
  answer: "b",
  q: "ต่อจากข้อก่อนหน้า โค้ดนี้จะแสดงผลอะไร",
  code: "small = cv2.resize(img, (320, 240))\nprint(small.shape)",
  options: [{
    id: "a",
    text: "(320, 240, 3)"
  }, {
    id: "b",
    text: "(240, 320, 3)"
  }, {
    id: "c",
    text: "(160, 120, 3)"
  }, {
    id: "d",
    text: "(240, 320)"
  }],
  explain: "ขนาดใน cv2.resize เขียนเป็น (กว้าง, สูง) = กว้าง 320 สูง 240 แต่ shape แสดง (สูง, กว้าง, ช่องสี) = (240, 320, 3)"
}, {
  id: "q8",
  lesson: "u2-l3",
  level: "การวิเคราะห์",
  answer: "d",
  q: "จากภาพเดิมขนาด (480, 640, 3) โค้ดนี้จะแสดงผลอะไร",
  code: "gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)\nprint(gray.shape)",
  options: [{
    id: "a",
    text: "(480, 640, 3)"
  }, {
    id: "b",
    text: "(480, 640, 1)"
  }, {
    id: "c",
    text: "(640, 480)"
  }, {
    id: "d",
    text: "(480, 640)"
  }],
  explain: "ภาพระดับเทามีค่าเดียวต่อพิกเซล OpenCV จึงคืนอาร์เรย์ 2 มิติ (480, 640)"
}, {
  id: "q9",
  lesson: "u2-l3",
  level: "การวิเคราะห์",
  answer: "c",
  q: "พิกเซลมุมบนซ้ายของภาพ red.png เป็นสีแดงล้วน RGB(255, 0, 0) โค้ดนี้จะแสดงผลอะไร",
  code: 'img = cv2.imread("red.png")\nprint(img[0, 0])',
  options: [{
    id: "a",
    text: "[255   0   0]"
  }, {
    id: "b",
    text: "[0 255   0]"
  }, {
    id: "c",
    text: "[  0   0 255]"
  }, {
    id: "d",
    text: "255"
  }],
  explain: "OpenCV เก็บสีเรียงเป็น B G R สีแดงล้วนจึงเป็น [0 0 255]"
}, {
  id: "q10",
  lesson: "u2-l3",
  level: "การประยุกต์ใช้",
  answer: "a",
  q: "นักเรียนรันโค้ดใน Google Colab แล้ว cv2.imshow() ใช้ไม่ได้ ควรแก้อย่างไร",
  options: [{
    id: "a",
    text: "ใช้ cv2_imshow() จาก google.colab.patches หรือแสดงด้วย matplotlib หลังแปลง BGR เป็น RGB"
  }, {
    id: "b",
    text: "เปลี่ยนเป็น cv2.imwrite() เพื่อแสดงภาพบนจอ"
  }, {
    id: "c",
    text: "ติดตั้ง OpenCV ใหม่ทุกครั้ง"
  }, {
    id: "d",
    text: "แปลงภาพเป็นระดับเทาก่อนจะแสดงได้"
  }],
  explain: "Colab ไม่มีหน้าต่างแสดงผลแบบ GUI จึงต้องใช้ cv2_imshow() หรือ matplotlib ส่วน imwrite ใช้บันทึกไฟล์ ไม่ได้แสดงภาพ"
}, {
  id: "q11",
  lesson: "u2-l4",
  level: "การประยุกต์ใช้",
  answer: "b",
  q: "ต้องการกลับภาพบน-ล่าง (หัวกลับ) ควรใช้คำสั่งใด",
  options: [{
    id: "a",
    text: "cv2.flip(img, 1)"
  }, {
    id: "b",
    text: "cv2.flip(img, 0)"
  }, {
    id: "c",
    text: "cv2.flip(img, 2)"
  }, {
    id: "d",
    text: "cv2.resize(img, (-1, -1))"
  }],
  explain: "cv2.flip รหัส 0 กลับรอบแกนนอน (บน-ล่าง) รหัส 1 กลับซ้าย-ขวา และ -1 กลับทั้งสองแกน"
}, {
  id: "q12",
  lesson: "u2-l4",
  level: "การวิเคราะห์",
  answer: "d",
  q: "จากภาพขนาด (480, 640, 3) โค้ดนี้ได้ผลอย่างไร",
  code: "crop = img[100:200, 50:150]\nprint(crop.shape)",
  options: [{
    id: "a",
    text: "(200, 150, 3) ตัดจากมุมบนซ้าย"
  }, {
    id: "b",
    text: "(100, 100, 3) ช่วง x = 100–199 และ y = 50–149"
  }, {
    id: "c",
    text: "(150, 200, 3)"
  }, {
    id: "d",
    text: "(100, 100, 3) ช่วง y = 100–199 และ x = 50–149"
  }],
  explain: "ตำแหน่งแรกคือแถว (y) 100 ถึง 199 ตำแหน่งที่สองคือคอลัมน์ (x) 50 ถึง 149 ค่าปลายไม่รวม ได้ 100 × 100 พิกเซล"
}, {
  id: "q13",
  lesson: "u2-l5",
  level: "ความรู้ความเข้าใจ",
  answer: "a",
  q: "ข้อใดอธิบายความแตกต่างระหว่าง Face Detection กับ Face Recognition ได้ถูกต้อง",
  options: [{
    id: "a",
    text: "Face Detection หาว่ามีใบหน้าอยู่ตรงไหน ส่วน Face Recognition ระบุว่าใบหน้านั้นเป็นของใคร"
  }, {
    id: "b",
    text: "ทั้งสองอย่างคือสิ่งเดียวกัน"
  }, {
    id: "c",
    text: "Face Detection ต้องมีฐานข้อมูลใบหน้าของทุกคน"
  }, {
    id: "d",
    text: "Face Recognition ใช้ได้กับภาพการ์ตูนเท่านั้น"
  }],
  explain: "การตรวจจับบอกตำแหน่ง ไม่รู้ตัวตน การจดจำต้องเปรียบเทียบกับฐานข้อมูลใบหน้า จึงใช้ข้อมูลชีวภาพและมีความเสี่ยงด้านความเป็นส่วนตัวสูงกว่า"
}, {
  id: "q14",
  lesson: "u2-l5",
  level: "การวิเคราะห์",
  answer: "c",
  q: "ถ้าเพิ่ม Confidence threshold จาก 0.3 เป็น 0.8 ผลการตรวจจับมักเปลี่ยนอย่างไร",
  options: [{
    id: "a",
    text: "ได้กรอบมากขึ้นและแม่นขึ้นทุกกรณี"
  }, {
    id: "b",
    text: "Bounding Box ใหญ่ขึ้น"
  }, {
    id: "c",
    text: "แสดงกรอบน้อยลง ผลผิดลดลง แต่อาจพลาดวัตถุจริงที่โมเดลไม่ค่อยมั่นใจ"
  }, {
    id: "d",
    text: "โมเดลเรียนรู้ประเภทวัตถุใหม่เพิ่ม"
  }],
  explain: "Threshold เป็นเกณฑ์ตัดผล ยิ่งสูงยิ่งเหลือเฉพาะผลที่มั่นใจมาก ลดผลผิด (False Positive) แต่เพิ่มโอกาสพลาด (False Negative)"
}, {
  id: "q15",
  lesson: "u2-l5",
  level: "การวิเคราะห์",
  answer: "b",
  q: "โรงเรียนใช้โมเดลตรวจจับวัตถุ COCO-SSD เพื่อนับ \"ลูกบาสเกตบอล\" ในโรงยิม แต่ผลออกมาเป็น \"sports ball\" ปนกับวัตถุทรงกลมอื่น ข้อสรุปใดเหมาะสมที่สุด",
  options: [{
    id: "a",
    text: "โมเดลผิดพลาด เพราะ AI ทุกตัวต้องแยกลูกบาสได้"
  }, {
    id: "b",
    text: "โมเดลรู้จักเพียงประเภทกว้าง ๆ ที่อยู่ในข้อมูลฝึก ถ้าต้องการแยกลูกบาสโดยเฉพาะ ต้องฝึกหรือปรับโมเดลด้วยข้อมูลลูกบาสเพิ่ม"
  }, {
    id: "c",
    text: "ต้องเปลี่ยนภาพเป็นระดับเทาเพื่อให้แม่นขึ้น"
  }, {
    id: "d",
    text: "ต้องลด threshold ให้เหลือ 0.01"
  }],
  explain: "COCO มีประเภท sports ball แต่ไม่แยกชนิดลูกบอล ความสามารถของโมเดลขึ้นกับข้อมูลที่ใช้ฝึก งานเฉพาะทางจึงต้องเก็บข้อมูลและฝึกเพิ่ม (Fine-tuning)"
}];


export {
  ROBOT_ART,
  ROBOT_PAL,
  SAMPLES,
  BLUR_OPTS,
  DEFAULT_PARAMS,
  PY_KW,
  PY_BUILTIN,
  RECORDED,
  COCO_TH,
  U2_OBJECTIVES,
  U2_ITEMS,
  U2_SEQ,
  U2_GROUPS,
  U2_REFS,
  CV_PIPE,
  MATRIX_EX,
  CODE_SETUP,
  CODE_READ,
  CODE_SHOW,
  CODE_TRANSFORM,
  CODE_WRITE,
  CODE_PLT,
  COLOR_TARGETS,
  colorDist,
  U24_RECIPE,
  TH_DEMO,
  U2_QUIZ
};
