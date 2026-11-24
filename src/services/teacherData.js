// ข้อมูลแดชบอร์ดครู: แปลงข้อมูลนักเรียนจากเซิร์ฟเวอร์ (teacher/overview) เป็นแถวที่พร้อมแสดงผล
import { COURSE, UNITS, LOCKED_UNITS, quizPassPercent } from '../data/courseData.js';
import { normalizeProgress, buildSummary } from './quizService.js';
import { visitStats, dayKey } from './visitStats.js';
import { U1_SCORE_COLS, U2_SCORE_COLS } from '../components/unitScoreColumns.js';

// หน่วยที่เปิดให้นักเรียนเรียนแล้ว (ตัวเลขสรุปของครูนับเฉพาะหน่วยเหล่านี้)
export const OPEN_UNITS = UNITS.filter(u => !LOCKED_UNITS.includes(u.id));
export const QUIZ_UNITS = OPEN_UNITS.filter(u => u.quiz);
export const SCORE_COLS = { unit1: U1_SCORE_COLS, unit2: U2_SCORE_COLS };
export const IDLE_DAYS = 7;

const toDate = k => new Date(`${k}T00:00`);
export const daysBetween = (from, to) => Math.round((toDate(to) - toDate(from)) / 86400000);

export function toRow(s, today = dayKey()) {
  const progress = normalizeProgress(s.progress);
  const summary = buildSummary(progress);
  const days = progress.visitDays;
  const lastVisit = days[days.length - 1] || null;
  const daysIdle = lastVisit ? daysBetween(lastVisit, today) : null;
  const quiz = Object.fromEntries(QUIZ_UNITS.map(u => {
    const up = progress[u.id];
    const best = summary.units[u.id].quizBest;
    return [u.id, { best: best ? best.percent : null, passed: up.quizAttempts.some(a => a.passed), attempts: up.quizAttempts.length }];
  }));
  const openPct = OPEN_UNITS.length ? Math.round(OPEN_UNITS.reduce((n, u) => n + summary.units[u.id].percent, 0) / OPEN_UNITS.length) : 0;
  const flags = {
    idle: daysIdle == null || daysIdle >= IDLE_DAYS,
    notStarted: openPct === 0,
    quizPending: QUIZ_UNITS.some(u => !quiz[u.id].passed),
    quizFailed: QUIZ_UNITS.some(u => quiz[u.id].attempts > 0 && !quiz[u.id].passed)
  };
  return {
    ...s,
    id: s.userId,
    progress,
    summary,
    openPct,
    quiz,
    visit: visitStats(days, today),
    lastVisit,
    daysIdle,
    project: progress.unit4 ? progress.unit4.project : null,
    flags
  };
}

// สรุปของกลุ่มนักเรียน (ห้องเดียวหรือทุกห้อง)
export function groupSummary(rows) {
  const n = rows.length;
  const avg = f => (n ? Math.round(rows.reduce((t, r) => t + f(r), 0) / n) : 0);
  return {
    total: n,
    activeWeek: rows.filter(r => r.daysIdle != null && r.daysIdle < IDLE_DAYS).length,
    idle: rows.filter(r => r.flags.idle).length,
    notStarted: rows.filter(r => r.flags.notStarted).length,
    avgOpen: avg(r => r.openPct),
    unitAvg: Object.fromEntries(OPEN_UNITS.map(u => [u.id, avg(r => r.summary.units[u.id].percent)])),
    quizPassed: Object.fromEntries(QUIZ_UNITS.map(u => [u.id, rows.filter(r => r.quiz[u.id].passed).length])),
    quizTried: Object.fromEntries(QUIZ_UNITS.map(u => [u.id, rows.filter(r => r.quiz[u.id].attempts > 0).length])),
    avgVisitDays: n ? Math.round((rows.reduce((t, r) => t + r.visit.total, 0) / n) * 10) / 10 : 0
  };
}

// ช่วงคะแนนแบบทดสอบ (คะแนนดีที่สุดของแต่ละคน) สำหรับกราฟการกระจาย
export const QUIZ_BINS = [
  { label: '0–49%', min: 0, max: 49 },
  { label: '50–69%', min: 50, max: 69 },
  { label: '70–89%', min: 70, max: 89 },
  { label: '90–100%', min: 90, max: 100 }
];
export const quizBins = (rows, unitId) =>
  QUIZ_BINS.map(b => rows.filter(r => r.quiz[unitId].best != null && r.quiz[unitId].best >= b.min && r.quiz[unitId].best <= b.max).length);

// สัดส่วนนักเรียนที่ทำแต่ละบทเรียน/กิจกรรมเสร็จ (หาจุดที่นักเรียนติด)
export function itemCompletion(rows, unit) {
  const items = [
    ...unit.lessons.map(x => ({ ...x, kind: 'บทเรียน', field: 'completedLessons' })),
    ...unit.activities.map(x => ({ ...x, kind: 'กิจกรรม', field: 'completedActivities' })),
    ...unit.practice.map(x => ({ ...x, kind: 'ฝึกปฏิบัติ', field: 'completedPractice' }))
  ];
  return items.map(it => ({
    ...it,
    done: rows.filter(r => r.progress[unit.id][it.field].includes(it.id)).length
  }));
}

export const passMark = unitId => quizPassPercent(unitId);

// ---------- ข้อมูลจำลองสำหรับโหมดสาธิต (คงที่ เปิดกี่ครั้งก็เหมือนเดิม) ----------
const FIRST = [['นาย', ['กิตติชัย', 'ศุภวิชญ์', 'ปวริศ', 'ธนกฤต', 'ภูมิพัฒน์', 'วรเมธ']], ['นางสาว', ['อริญชญา', 'ณัฐธิดา', 'ชนิกานต์', 'พิมพ์ชนก', 'กัญญาณัฐ', 'ปุณยวีร์']]];
const LAST = ['จันทร์ชุม', 'ถาปะนา', 'พรหมปัญญา', 'แสงคำ', 'อินต๊ะ', 'ใจมูล', 'ปัญญาวงศ์', 'ศรีวิชัย', 'คำแสน', 'บุญเรือง'];

export function demoOverview(today = new Date()) {
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const pick = (arr, f) => arr.filter(() => rnd() < f).map(x => x.id);
  const at = n => new Date(today.getFullYear(), today.getMonth(), today.getDate() - n);
  return COURSE.classrooms.flatMap((classroom, r) =>
    Array.from({ length: 28 }, (_, i) => {
      const keen = Math.max(0, Math.min(1, 0.2 + rnd() * 0.8 - r * 0.04));
      const progress = { visitDays: [] };
      for (let d = 59; d >= 0; d--) {
        const day = at(d), school = day.getDay() > 0 && day.getDay() < 6;
        if (rnd() < keen * (school ? 0.7 : 0.15)) progress.visitDays.push(dayKey(day));
      }
      OPEN_UNITS.forEach((u, k) => {
        const f = Math.max(0, keen - k * 0.25);
        const quizAttempts = [];
        if (u.quiz && rnd() < f + 0.2) {
          const tries = 1 + Math.floor(rnd() * 3);
          for (let t = 0; t < tries; t++) {
            const correct = Math.min(u.quiz.questions, Math.round((0.35 + keen * 0.55 + t * 0.08 + rnd() * 0.15) * u.quiz.questions));
            const percent = Math.round((correct / u.quiz.questions) * 100);
            quizAttempts.push({ correct, total: u.quiz.questions, percent, passed: percent >= quizPassPercent(u.id), at: at(10 - t * 2).toISOString() });
          }
        }
        const activityScores = {};
        (SCORE_COLS[u.id] || []).forEach(c => {
          if (rnd() > f + 0.1) return;
          const attempts = 1 + Math.floor(rnd() * 3);
          const best = Math.max(1, Math.round(c.max * (0.5 + rnd() * 0.5)));
          activityScores[c.id] = { best, last: best, sum: Math.max(attempts, Math.round(best * attempts * (0.8 + rnd() * 0.2))), max: c.max, attempts, at: at(5).toISOString() };
        });
        progress[u.id] = {
          completedLessons: pick(u.lessons, f + 0.1),
          completedActivities: pick(u.activities, f),
          completedPractice: pick(u.practice, f),
          quizAttempts,
          activityScores
        };
      });
      return {
        userId: `5${r + 1}${String(i + 1).padStart(3, '0')}`,
        no: i + 1,
        name: (([title, names]) => `${title}${names[Math.floor(rnd() * names.length)]} ${LAST[Math.floor(rnd() * LAST.length)]}`)(FIRST[rnd() < 0.5 ? 0 : 1]),
        classroom,
        progress,
        syncedAt: at(Math.floor(rnd() * 5)).toISOString(),
        assessment: null
      };
    })
  );
}
