import { U1_A1, U1_TIMELINE, U1_A4, U1_A5 } from '../data/unit1Data.js';
import { caseMax } from './ActivityEngines.jsx';

// คอลัมน์คะแนนหน่วยที่ 1 = มินิเกม AI QUEST 4 ด่าน (รหัสเดียวกับที่ saveActivity บันทึก)
// คะแนนเต็มคำนวณจากข้อมูลเกม จึงรู้คะแนนเต็มแม้ยังไม่มีใครเล่น
const sumCases = cases => cases.reduce((s, c) => s + caseMax(c), 0);
export const U1_SCORE_COLS = [
  { id: 'u1-a1', label: 'AI or Not AI', max: U1_A1.items.length },
  { id: 'u1-a2', label: 'Timeline', max: U1_TIMELINE.length },
  { id: 'u1-a4', label: 'Ethics', max: sumCases(U1_A4) },
  { id: 'u1-a5', label: 'Deepfake', max: sumCases(U1_A5) }
];
