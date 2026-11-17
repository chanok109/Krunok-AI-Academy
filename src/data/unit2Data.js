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
const U2_OBJECTIVES = ["อธิบายความหมายและหลักการทำงานของคอมพิวเตอร์วิทัศน์ และจำแนกงาน Classification, Object Detection และ Face Detection ได้", "อธิบายองค์ประกอบของภาพดิจิทัล ได้แก่ พิกเซล ความละเอียด ระบบสี RGB ระดับเทา และเมทริกซ์ภาพ", "เขียนโปรแกรม Python ด้วย OpenCV เพื่ออ่าน ปรับขนาด แปลงสี กลับภาพ และบันทึกภาพได้", "ประมวลผลภาพ และอธิบายผลการตรวจจับวัตถุจาก Bounding Box และ Confidence Score พร้อมข้อจำกัด"];
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


// มินิเกม 2.1.1 แนวคิดคอมพิวเตอร์วิทัศน์ (3 ด่าน) ใช้ ClassifyActivity / OrderActivity ร่วมกับหน่วย 1
const U2_GAME = {
  isCv: {
    options: [
      { id: "cv", label: "ใช้คอมพิวเตอร์วิทัศน์", icon: "eye" },
      { id: "no", label: "ไม่ได้ใช้", icon: "eyeOff" }
    ],
    items: [
      { id: "g1-1", text: "ประตูโรงเรียนสแกนใบหน้านักเรียนเพื่อเช็กชื่อเข้าเรียน", answer: "cv", why: "กล้องรับภาพใบหน้า แล้วระบบหารูปแบบของใบหน้าเพื่อบอกว่าเป็นใคร" },
      { id: "g1-2", text: "ลำโพงอัจฉริยะเปิดเพลงเมื่อเราพูดสั่ง", answer: "no", why: "ระบบรับเสียงพูด ไม่ได้รับภาพ จึงเป็นงานรู้จำเสียง ไม่ใช่คอมพิวเตอร์วิทัศน์" },
      { id: "g1-3", text: "แอปส่องกล้องไปที่เมนูภาษาญี่ปุ่น แล้วแปลเป็นภาษาไทยให้", answer: "cv", why: "แอปต้องอ่านตัวอักษรจากภาพที่กล้องถ่ายก่อน จึงจะนำไปแปลได้" },
      { id: "g1-4", text: "เครื่องคิดเลขบวกเลขที่เราพิมพ์เข้าไป", answer: "no", why: "รับตัวเลขที่พิมพ์และคำนวณตามสูตร ไม่มีภาพและไม่ต้องตีความอะไร" },
      { id: "g1-5", text: "โดรนบินถ่ายภาพแปลงนา แล้วชี้จุดที่ต้นข้าวเป็นโรค", answer: "cv", why: "ระบบวิเคราะห์สีและลักษณะใบข้าวในภาพถ่ายทางอากาศ เพื่อบอกว่าตรงไหนผิดปกติ" },
      { id: "g1-6", text: "อีเมลย้ายข้อความโฆษณาหลอกลวงไปไว้ในโฟลเดอร์สแปม", answer: "no", why: "ระบบอ่านข้อความในอีเมล ไม่ได้ดูภาพ จึงเป็นงานประมวลผลภาษา" },
      { id: "g1-7", text: "ไม้กั้นลานจอดรถเปิดเองเมื่อกล้องอ่านป้ายทะเบียนที่ลงทะเบียนไว้", answer: "cv", why: "กล้องถ่ายภาพป้าย แล้วระบบอ่านตัวอักษรและตัวเลขบนป้ายจากภาพ" },
      { id: "g1-8", text: "นาฬิกาอัจฉริยะนับจำนวนก้าวเดินในแต่ละวัน", answer: "no", why: "นาฬิกาใช้เซนเซอร์วัดการเคลื่อนไหวของข้อมือ ไม่ได้ใช้กล้องหรือภาพ" }
    ]
  },
  steps: [
    { id: "s1", yearLabel: "ขั้นที่ 1", title: "รับภาพ", clue: "กล้องถ่ายภาพหรือวิดีโอเข้ามาในคอมพิวเตอร์" },
    { id: "s2", yearLabel: "ขั้นที่ 2", title: "อ่านเป็นตัวเลข", clue: "แต่ละพิกเซลกลายเป็นค่าสี B G R ตั้งแต่ 0 ถึง 255" },
    { id: "s3", yearLabel: "ขั้นที่ 3", title: "คำนวณหารูปแบบ", clue: "หาขอบ สี และรูปร่างที่ซ่อนอยู่ในตารางตัวเลข" },
    { id: "s4", yearLabel: "ขั้นที่ 4", title: "ตอบความหมาย", clue: "บอกว่าในภาพมีอะไร อยู่ตรงไหน หรือกำลังเกิดอะไรขึ้น" }
  ],
  // ด่าน 4: โค้ดบรรทัดนี้ทำอะไร (code แสดงเป็นตัวโค้ดในเกม)
  code: {
    options: [
      { id: "read", label: "อ่านภาพ", icon: "openBook" },
      { id: "show", label: "แสดงภาพ", icon: "tv" },
      { id: "save", label: "บันทึกภาพ", icon: "download" },
      { id: "color", label: "แปลงสี", icon: "layers" },
      { id: "pixel", label: "อ่านค่าพิกเซล", icon: "search" },
      { id: "win", label: "ควบคุมหน้าต่าง", icon: "grid" }
    ],
    items: [
      { id: "g4-1", code: 'img = cv2.imread("fruits.png")', answer: "read", why: "imread อ่านไฟล์ภาพเข้ามาเป็นตารางตัวเลข ถ้าหาไฟล์ไม่เจอจะได้ None" },
      { id: "g4-2", code: 'cv2.imshow("Color", img)', answer: "show", why: "imshow เปิดหน้าต่างชื่อ Color แล้วแสดงภาพ img ในหน้าต่างนั้น" },
      { id: "g4-3", code: 'cv2.imwrite("fruits_gray.png", gray)', answer: "save", why: "imwrite บันทึกภาพ gray เป็นไฟล์ใหม่ ชนิดไฟล์ดูจากนามสกุล .png" },
      { id: "g4-4", code: "gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)", answer: "color", why: "cvtColor แปลงระบบสี ที่นี่แปลงจาก BGR เป็นภาพเทา ภาพจึงเหลือ 1 ช่องสี" },
      { id: "g4-5", code: "b, g, r = img[660, 420]", answer: "pixel", why: "img[y, x] อ่านค่าสีของพิกเซลแถว 660 คอลัมน์ 420 ออกมาเป็น B, G, R" },
      { id: "g4-6", code: "cv2.waitKey(0)", answer: "win", why: "waitKey(0) หยุดรอจนกว่าจะกดปุ่มใดก็ได้บนหน้าต่างภาพ ถ้าไม่มีบรรทัดนี้หน้าต่างจะปิดทันที" },
      { id: "g4-7", code: "cv2.destroyAllWindows()", answer: "win", why: "destroyAllWindows ปิดหน้าต่างภาพทั้งหมดที่เปิดไว้" },
      { id: "g4-8", code: 'img = cv2.imread("cat.jpg", cv2.IMREAD_GRAYSCALE)', answer: "read", why: "ยังเป็นการอ่านภาพด้วย imread แต่สั่งให้อ่านเป็นภาพเทาตั้งแต่ตอนอ่าน" }
    ]
  },
  // ด่าน 5: เรียงโค้ดให้รันได้ ลำดับนี้มีทางเดียว (แต่ละบรรทัดใช้ผลของบรรทัดก่อน)
  program: [
    { id: "p1", yearLabel: "บรรทัด 1", code: "import cv2", clue: "นำเข้าไลบรารี OpenCV ก่อนเรียกใช้คำสั่ง cv2" },
    { id: "p2", yearLabel: "บรรทัด 2", code: 'img = cv2.imread("fruits.png")', clue: "อ่านภาพเข้ามาเก็บในตัวแปร img" },
    { id: "p3", yearLabel: "บรรทัด 3", code: "gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)", clue: "ต้องมี img ก่อน จึงแปลงเป็นภาพเทาได้" },
    { id: "p4", yearLabel: "บรรทัด 4", code: 'cv2.imshow("Gray", gray)', clue: "ต้องมี gray ก่อน จึงแสดงได้" },
    { id: "p5", yearLabel: "บรรทัด 5", code: "cv2.waitKey(0)", clue: "รอให้กดปุ่ม หน้าต่างจะได้ไม่ปิดทันที" },
    { id: "p6", yearLabel: "บรรทัด 6", code: "cv2.destroyAllWindows()", clue: "ปิดหน้าต่างทั้งหมดเมื่อดูเสร็จ" }
  ]
};

export {
  U2_GAME,
  ROBOT_ART,
  ROBOT_PAL,
  SAMPLES,
  DEFAULT_PARAMS,
  PY_KW,
  PY_BUILTIN,
  RECORDED,
  U2_OBJECTIVES,
  U2_REFS,
  U2_QUIZ
};
