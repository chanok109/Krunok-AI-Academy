import React from 'react';
import { ClassifyActivity, ReasoningActivity } from './ActivityEngines.jsx';
import { SlotOrderActivity } from './SlotOrderActivity.jsx';
import { ArcadeGame, mix } from './ArcadeGame.jsx';
import { U1_A1, U1_A4, U1_A5, U1_TIMELINE } from '../data/unit1Data.js';

// AI QUEST: มินิเกมทบทวนหน่วยที่ 1 สี่ด่าน (รหัสกิจกรรม u1-a1..a5 เดิม คะแนนและความก้าวหน้าเดิมจึงยังอยู่)
const AI_GAME_LEVELS = [
  {
    id: 'u1-a1', n: 1, title: 'AI or Not AI', icon: 'puzzle', color: '#7DB8FF', pose: 'think',
    mission: <>อ่านสถานการณ์ แล้วตัดสินว่าระบบนั้น <b>เป็น AI</b> หรือ <b>ไม่ใช่ AI</b></>,
    render: () => <ClassifyActivity unitId="unit1" actId="u1-a1" items={mix(U1_A1.items)} options={U1_A1.options} />
  },
  {
    id: 'u1-a2', n: 2, title: 'Timeline Challenge', icon: 'clock', color: '#C9B5E0', pose: 'book',
    mission: <>เรียงเหตุการณ์สำคัญในประวัติศาสตร์ AI จาก <b>เกิดก่อน</b> ไป <b>เกิดหลัง</b> แล้วกดตรวจคำตอบ</>,
    render: () => <SlotOrderActivity unitId="unit1" actId="u1-a2" events={U1_TIMELINE} />
  },
  {
    id: 'u1-a4', n: 3, title: 'Ethics Challenge', icon: 'scale', color: '#FF6F91', pose: 'idea',
    mission: <>อ่านกรณีศึกษาการใช้ AI แล้วระบุ <b>ประเด็นจริยธรรม</b> <b>ระดับความเสี่ยงตาม EU AI Act</b> และ <b>สิ่งที่ควรทำ</b></>,
    render: () => <ReasoningActivity unitId="unit1" actId="u1-a4" cases={U1_A4} />
  },
  {
    id: 'u1-a5', n: 4, title: 'Deepfake Detective', icon: 'eye', color: '#5FE0B5', pose: 'present',
    mission: <>อ่านสถานการณ์ แล้วหา <b>สัญญาณเตือนของ Deepfake</b> และ <b>วิธีตรวจสอบที่ดีที่สุด</b></>,
    render: () => <ReasoningActivity unitId="unit1" actId="u1-a5" cases={U1_A5} />
  }
];

export function AiQuestGame() {
  return <ArcadeGame unitId="unit1" brand="AI QUEST" tagline="ภารกิจนักสำรวจโลก AI" levels={AI_GAME_LEVELS} />;
}
