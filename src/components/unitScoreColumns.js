import { U1_A1, U1_TIMELINE, U1_A4, U1_A5 } from '../data/unit1Data.js';
import { U2_GAME, U2_GAME22 } from '../data/unit2Data.js';
import { caseMax } from './ActivityEngines.jsx';

// คอลัมน์คะแนนหน่วยที่ 1 = มินิเกม AI QUEST 4 ด่าน (รหัสเดียวกับที่ saveActivity บันทึก)
// คะแนนเต็มคำนวณจากข้อมูลเกม จึงรู้คะแนนเต็มแม้ยังไม่มีใครเล่น
const sumCases = cases => cases.reduce((s, c) => s + caseMax(c), 0);
export const U1_SCORE_COLS = [
  { id: 'u1-a1', group: 'AI QUEST', label: 'AI or Not AI', max: U1_A1.items.length },
  { id: 'u1-a2', group: 'AI QUEST', label: 'Timeline', max: U1_TIMELINE.length },
  { id: 'u1-a4', group: 'AI QUEST', label: 'Ethics', max: sumCases(U1_A4) },
  { id: 'u1-a5', group: 'AI QUEST', label: 'Deepfake', max: sumCases(U1_A5) }
];

// คอลัมน์คะแนนหน่วยที่ 2 = CV QUEST 4 ด่าน + PIXEL QUEST 2 ด่าน (คะแนนเต็ม = จำนวนข้อ/การ์ดในแต่ละด่าน)
export const U2_SCORE_COLS = [
  { id: 'u2-g1', group: 'CV QUEST', label: 'ใช่ CV ไหม?', max: U2_GAME.isCv.items.length },
  { id: 'u2-g3', group: 'CV QUEST', label: 'เรียงขั้นตอน', max: U2_GAME.steps.length },
  { id: 'u2-g4', group: 'CV QUEST', label: 'อ่านโค้ด', max: U2_GAME.code.items.length },
  { id: 'u2-g5', group: 'CV QUEST', label: 'เรียงโค้ด CV', max: U2_GAME.program.length },
  { id: 'u2-h1', group: 'PIXEL QUEST', label: 'เลือกคำสั่ง', max: U2_GAME22.task.items.length },
  { id: 'u2-h4', group: 'PIXEL QUEST', label: 'เรียงโค้ดแปลงภาพ', max: U2_GAME22.program.length }
];
