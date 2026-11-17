import React from 'react';
import { ClassifyActivity } from './ActivityEngines.jsx';
import { SlotOrderActivity } from './SlotOrderActivity.jsx';
import { ArcadeGame, mix } from './ArcadeGame.jsx';
import { U2_GAME } from '../data/unit2Data.js';

// โค้ดแสดงเป็นตัวโค้ดในการ์ด (ข้อมูลเก็บเป็นข้อความใน unit2Data.js)
const asCode = s => <code className="cvg-code">{s}</code>;
const CODE_ITEMS = U2_GAME.code.items.map(it => ({ ...it, text: asCode(it.code) }));
// ชื่อการ์ดใช้ใน aria-label จึงต้องเป็นข้อความ (จัดเป็นตัวโค้ดด้วย CSS แทน)
const PROGRAM = U2_GAME.program.map(p => ({ ...p, title: p.code }));

// CV QUEST: ทบทวนใบความรู้ 2.1 สี่ด่าน (คะแนนส่งเข้า ScoreLog ของครูผ่าน saveActivity)
const CV_GAME_LEVELS = [
  {
    id: 'u2-g1', n: 1, title: 'ใช่ CV ไหม?', icon: 'eye', color: '#7DB8FF', pose: 'think',
    mission: <>สถานการณ์ไหน <b>ต้องให้คอมพิวเตอร์มองและเข้าใจภาพ</b> ถึงจะทำงานได้</>,
    render: () => <ClassifyActivity unitId="unit2" actId="u2-g1" items={mix(U2_GAME.isCv.items)} options={U2_GAME.isCv.options} />
  },
  {
    id: 'u2-g3', n: 2, title: 'เรียงขั้นตอนการมองเห็น', icon: 'list', color: '#FFC266', pose: 'book',
    mission: <>คอมพิวเตอร์ "มองเห็น" ภาพได้อย่างไร เรียง 4 ขั้นตอนจาก <b>ทำก่อน</b> ไป <b>ทำหลัง</b> แล้วกดตรวจคำตอบ</>,
    render: () => <SlotOrderActivity unitId="unit2" actId="u2-g3" events={U2_GAME.steps} />
  },
  {
    id: 'u2-g4', n: 3, title: 'คำสั่งนี้ทำอะไร?', icon: 'code', color: '#FF6F91', pose: 'idea',
    mission: <>อ่านโค้ด OpenCV แต่ละบรรทัด แล้วเลือกว่า <b>บรรทัดนี้สั่งให้คอมพิวเตอร์ทำอะไร</b></>,
    render: () => <ClassifyActivity unitId="unit2" actId="u2-g4" items={mix(CODE_ITEMS)} options={U2_GAME.code.options} />
  },
  {
    id: 'u2-g5', n: 4, title: 'เรียงโค้ดให้รันได้', icon: 'list', color: '#5FE0B5', pose: 'present',
    mission: <>เรียงโค้ด 6 บรรทัดให้โปรแกรม <b>อ่านภาพ แปลงเป็นภาพเทา แล้วแสดงผล</b> ได้ บรรทัดไหนต้องใช้ตัวแปรจากบรรทัดก่อน ต้องอยู่ทีหลัง</>,
    render: () => <SlotOrderActivity unitId="unit2" actId="u2-g5" events={PROGRAM} />
  }
];

export function CvMiniGame() {
  return <ArcadeGame unitId="unit2" brand="CV QUEST" tagline="ภารกิจฝึกสายตาคอมพิวเตอร์" levels={CV_GAME_LEVELS} />;
}
