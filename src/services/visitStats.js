// สถิติการเข้าเรียน: progress.visitDays เก็บวันที่ (เวลาเครื่องนักเรียน) แบบ 'YYYY-MM-DD' วันละครั้ง
export const dayKey = (d = new Date()) => d.toLocaleDateString('en-CA');
const shift = (key, n) => {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + n));
};

export function visitStats(visitDays, today = dayKey()) {
  const days = [...new Set(visitDays)].sort();
  const set = new Set(days);
  // ต่อเนื่องตอนนี้: นับย้อนจากวันนี้ (ถ้าวันนี้ยังไม่เข้า เริ่มนับจากเมื่อวาน)
  let streak = 0;
  for (let k = set.has(today) ? today : shift(today, -1); set.has(k); k = shift(k, -1)) streak++;
  let best = 0, run = 0;
  days.forEach((k, i) => {
    run = i > 0 && shift(days[i - 1], 1) === k ? run + 1 : 1;
    best = Math.max(best, run);
  });
  // ปฏิทิน 12 สัปดาห์ล่าสุด เริ่มวันจันทร์ จบสัปดาห์นี้
  const [y, m, d] = today.split('-').map(Number);
  const dow = (new Date(y, m - 1, d).getDay() + 6) % 7; // จันทร์ = 0
  const start = shift(today, -dow - 7 * 11);
  const weeks = Array.from({ length: 12 }, (_, w) =>
    Array.from({ length: 7 }, (_, i) => {
      const k = shift(start, w * 7 + i);
      return { key: k, on: set.has(k), future: k > today };
    })
  );
  return {
    total: days.length,
    streak,
    best,
    month: days.filter(k => k.slice(0, 7) === today.slice(0, 7)).length,
    first: days[0] || null,
    weeks
  };
}

// สถิติรวมของนักเรียนทั้งหมด: students = [{ classroom, days: ['YYYY-MM-DD', ...] }]
export function classVisitStats(students, today = dayKey(), span = 30) {
  const keys = Array.from({ length: span }, (_, i) => shift(today, i - span + 1));
  const week = new Set(keys.slice(-7));
  const count = Object.fromEntries(keys.map(k => [k, 0]));
  let activeWeek = 0, everVisited = 0;
  students.forEach(s => {
    const d = new Set(s.days);
    d.forEach(k => { if (k in count) count[k]++; });
    if ([...d].some(k => week.has(k))) activeWeek++;
    if (d.size) everVisited++;
  });
  const daily = keys.map(k => ({ key: k, count: count[k] }));
  return {
    total: students.length,
    today: count[today],
    activeWeek,
    everVisited,
    avg: Math.round((daily.reduce((n, x) => n + x.count, 0) / span) * 10) / 10,
    peak: Math.max(0, ...daily.map(x => x.count)),
    daily
  };
}
