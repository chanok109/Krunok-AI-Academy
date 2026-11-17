import React from 'react';
import { ClassifyActivity } from './ActivityEngines.jsx';
import { SlotOrderActivity } from './SlotOrderActivity.jsx';
import { ArcadeGame, mix } from './ArcadeGame.jsx';
import { U2_GAME22 } from '../data/unit2Data.js';

// ชื่อการ์ดใช้ใน aria-label จึงต้องเป็นข้อความ (จัดเป็นตัวโค้ดด้วย CSS แทน)
const PROGRAM = U2_GAME22.program.map(p => ({ ...p, title: p.code }));

// PIXEL QUEST: ทบทวนใบความรู้ 2.2 สองด่าน (คะแนนส่งเข้า ScoreLog ของครูผ่าน saveActivity)
// รหัสด่านเดิม u2-h1 / u2-h4 คงไว้ (CSS ตัวโค้ดผูกกับ .cvg-u2-h4)
const PIXEL_GAME_LEVELS = [
  {
    id: 'u2-h1', n: 1, title: 'งานนี้ใช้คำสั่งไหน?', icon: 'search', color: '#7DB8FF', pose: 'think',
    mission: <>อ่านสถานการณ์ แล้วเลือกว่าต้อง <b>แก้ค่าพิกเซล ตัดภาพ ปรับขนาด</b> หรือ <b>พลิกภาพ</b></>,
    render: () => <ClassifyActivity unitId="unit2" actId="u2-h1" items={mix(U2_GAME22.task.items)} options={U2_GAME22.task.options} />
  },
  {
    id: 'u2-h4', n: 2, title: 'เรียงโค้ดให้รันได้', icon: 'list', color: '#5FE0B5', pose: 'present',
    mission: <>เรียงโค้ด 6 บรรทัดให้โปรแกรม <b>ตัด ย่อ พลิก แล้วบันทึกภาพ</b> ได้ บรรทัดไหนต้องใช้ตัวแปรจากบรรทัดก่อน ต้องอยู่ทีหลัง</>,
    render: () => <SlotOrderActivity unitId="unit2" actId="u2-h4" events={PROGRAM} />
  }
];

export function PixelQuestGame() {
  return <ArcadeGame unitId="unit2" brand="PIXEL QUEST" tagline="ภารกิจนักแปลงภาพ" levels={PIXEL_GAME_LEVELS} />;
}
