import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { COURSE, UNITS } from '../data/courseData.js';
import { useApp } from '../context/AppContext.jsx';
import { api } from '../services/apiService.js';
import { Icon } from './UIPrimitives.jsx';

// โหมดสาธิต: นักเรียนจำลองห้องละ 8 คน (ไม่ใช้กับข้อมูลจริง)
const DEMO_FIRST = ['กิตติชัย', 'ศุภวิชญ์', 'อริญชญา', 'ณัฐธิดา', 'ปวีณ์กร', 'ธนพล', 'พิมพ์ชนก', 'ภูริช'];
const DEMO_LAST = ['จันทร์ชุม', 'ถาปะนา', 'พรหมปัญญา', 'ศรีสุข', 'วงศ์คำ', 'ใจดี', 'แสงทอง', 'บุญมา'];
function demoStudents(columns, quizMax, me) {
  const list = [];
  COURSE.classrooms.forEach((room, r) => {
    DEMO_FIRST.forEach((f, i) => {
      const k = (r * 7 + i * 13) % 17;
      const f01 = Math.max(0.3, 1 - k / 26);
      const activities = {};
      // ห้องสุดท้ายมีคนทำแค่ 1 คน ให้เห็นโพเดียมช่องว่างในโหมดสาธิต
      const idle = r === COURSE.classrooms.length - 1 && i > 0;
      if (!idle) columns.forEach((c, j) => { if ((i + j + r) % 9) activities[c.id] = Math.round(c.max * f01 - ((i + j) % 2)); });
      list.push({
        name: `${i % 2 ? 'นางสาว' : 'นาย'}${f} ${DEMO_LAST[(i + r) % 8]}`,
        classroom: room,
        no: i + 1,
        activities,
        quiz: i === 7 || idle ? null : Math.round(quizMax * f01),
        records: idle ? 0 : Object.keys(activities).length + 1 + (k % 3),
        me: false
      });
    });
  });
  if (me) {
    const mine = list.find(s => s.classroom === me.classroom) || list[0];
    Object.assign(mine, { name: me.displayName || mine.name, me: true });
  }
  return list;
}

const pctText = p => `${p.toFixed(2)}%`;
const num = x => +(+x).toFixed(2);


// มงกุฎทองมีอัญมณี (อันดับ 1)
function Crown() {
  return (
    <svg width="70" height="54" viewBox="0 0 70 54" aria-hidden="true">
      <defs>
        <linearGradient id="lbGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE88A" /><stop offset=".55" stopColor="#FFC83C" /><stop offset="1" stopColor="#E59A12" /></linearGradient>
      </defs>
      <path d="M6 18l14 12L35 6l15 24 14-12-5 26H11z" fill="url(#lbGold)" stroke="#FFF1B8" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="10" y="44" width="50" height="7" rx="3.5" fill="url(#lbGold)" />
      <circle cx="6" cy="17" r="4" fill="#FFE88A" /><circle cx="35" cy="5" r="4.5" fill="#FFE88A" /><circle cx="64" cy="17" r="4" fill="#FFE88A" />
      <circle cx="35" cy="33" r="5" fill="#FF5C8A" stroke="#FFF1B8" strokeWidth="1.5" />
      <circle cx="21" cy="36" r="3" fill="#5FD4FF" /><circle cx="49" cy="36" r="3" fill="#5FD4FF" />
    </svg>
  );
}

// เหรียญรางวัลมีริบบิ้น (อันดับ 2 เงิน, 3 ทองแดง)
function Medal({ rank }) {
  const [a, b, c] = rank === 2 ? ['#F4F7FF', '#C8D0E8', '#8C97B8'] : ['#FFD3A3', '#F08A24', '#A9530C'];
  const id = `lbMedal${rank}`;
  return (
    <svg width="48" height="58" viewBox="0 0 48 58" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset=".5" stopColor={b} /><stop offset="1" stopColor={c} /></linearGradient>
      </defs>
      <path d="M12 2h9l7 18h-9z" fill={rank === 2 ? '#6FB7FF' : '#8B5CF6'} />
      <path d="M36 2h-9l-7 18h9z" fill={rank === 2 ? '#3B82F6' : '#6D28D9'} />
      <circle cx="24" cy="36" r="17" fill={`url(#${id})`} stroke={a} strokeWidth="2" />
      <circle cx="24" cy="36" r="11.5" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="2 2.4" />
      <text x="24" y="42" textAnchor="middle" fontSize="17" fontWeight="800" fill={c} fontFamily="sans-serif">{rank}</text>
    </svg>
  );
}

export function Leaderboard({ unitId, columns, onClose }) {
  const { user } = useApp();
  const unit = UNITS.find(u => u.id === unitId);
  const quizMax = unit?.quiz?.questions || 0;
  const fullMark = columns.reduce((a, c) => a + c.max, 0) + quizMax;
  const [state, setState] = useState({ loading: true, error: '', students: [] });
  const [room, setRoom] = useState(COURSE.classrooms.includes(user?.classroom) ? user.classroom : COURSE.classrooms[0]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await api.getLeaderboard(unitId);
        if (!alive) return;
        if (r === null) setState({ loading: false, error: '', students: demoStudents(columns, quizMax, user) });
        else if (r && r.success) setState({ loading: false, error: '', students: r.students || [] });
        else throw new Error((r && r.error) || 'โหลดคะแนนไม่สำเร็จ');
      } catch (e) {
        if (alive) setState({ loading: false, error: e.message || String(e), students: [] });
      }
    })();
    return () => { alive = false; };
  }, [unitId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Esc ปิดหน้า
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [onClose]);

  const scored = useMemo(() => state.students.map(s => {
    const total = columns.reduce((a, c) => a + (s.activities?.[c.id] || 0), 0) + (s.quiz || 0);
    return { ...s, total: num(total), pct: fullMark ? (total / fullMark) * 100 : 0, active: (s.records || 0) > 0 };
  }), [state.students, columns, fullMark]);

  const stats = useMemo(() => {
    const act = scored.filter(s => s.active);
    const avg = list => (list.length ? list.reduce((a, s) => a + s.pct, 0) / list.length : 0);
    let topRoom = '-', topAvg = -1;
    COURSE.classrooms.forEach(c => {
      const a = act.filter(s => s.classroom === c);
      if (a.length && avg(a) > topAvg) { topAvg = avg(a); topRoom = c; }
    });
    return { players: act.length, records: scored.reduce((a, s) => a + (s.records || 0), 0), avg: avg(act), topRoom };
  }, [scored]);

  const rows = useMemo(
    () => scored.filter(s => s.classroom === room).sort((a, b) => b.pct - a.pct || (a.no || 0) - (b.no || 0)),
    [scored, room]
  );
  const podium = rows.filter(s => s.active).slice(0, 3);
  const order = [podium[1], podium[0], podium[2]];

  return createPortal(
    <div className="lb" role="dialog" aria-modal="true" aria-label={`Leaderboard หน่วยที่ ${UNITS.indexOf(unit) + 1}`}>
      <header className="lb-top">
        <button type="button" className="lb-back" onClick={onClose}>
          <Icon name="chevL" size={16} /> กลับสู่เนื้อหาบทเรียน
        </button>
        <span className="lb-title"><Icon name="trophy" size={22} /> Leaderboard · หน่วยที่ {UNITS.indexOf(unit) + 1}</span>
      </header>

      <div className="lb-body">
        {state.loading ? (
          <p className="lb-msg">กำลังโหลดผลคะแนน…</p>
        ) : state.error ? (
          <p className="lb-msg">โหลดผลคะแนนไม่สำเร็จ: {state.error}</p>
        ) : (
          <>
            <section className="lb-stats">
              {[
                ['users', 'ผู้ส่งกิจกรรมทั้งหมด', stats.players, 'c1'],
                ['puzzle', 'จำนวนการบันทึกกิจกรรม', stats.records, 'c2'],
                ['chart', 'คะแนนเฉลี่ยระดับชั้น', pctText(stats.avg), 'c3'],
                ['award', 'ห้องเรียนที่คะแนนเฉลี่ยสูงสุด', stats.topRoom, 'c4']
              ].map(([ic, l, v, c]) => (
                <div key={l} className="lb-stat">
                  <span className={`lb-stat-i ${c}`}><Icon name={ic} size={26} /></span>
                  <div><small>{l}</small><b>{v}</b></div>
                </div>
              ))}
            </section>

            <nav className="lb-rooms" aria-label="เลือกห้องเรียน">
              {COURSE.classrooms.map(c => (
                <button key={c} type="button" className={c === room ? 'on' : ''} aria-pressed={c === room} onClick={() => setRoom(c)}>
                  <Icon name="users" size={16} /> {c}
                </button>
              ))}
            </nav>

            {/* โพเดียม 3 ช่องเสมอ (2–1–3) ช่องที่ยังไม่มีผู้ทำคะแนนเว้นว่างไว้ */}
            <section className="lb-podium">
              {order.map((s, i) => {
                const rank = [2, 1, 3][i];
                return (
                  <div key={rank} className={`lb-pod p${rank} ${s ? '' : 'empty'} ${s?.me ? 'me' : ''}`}>
                    {rank === 1 && s && (
                      <span className="lb-spark" aria-hidden="true"><i>✦</i><i>✦</i><i>✦</i><i>✦</i></span>
                    )}
                    <span className="lb-pod-ic">{rank === 1 ? <Crown /> : <Medal rank={rank} />}</span>
                    <span className="lb-pod-av">
                      <span className="lb-pod-av-in"><Icon name={rank === 1 ? 'bot' : 'user'} size={rank === 1 ? 50 : 40} /></span>
                      <i>{rank}</i>
                    </span>
                    {s ? (
                      <>
                        <b>{s.name}{s.me && <em> (คุณ)</em>}</b>
                        <small>{s.no ? `เลขที่ ${s.no} • ` : ''}{s.classroom}</small>
                        <strong>{pctText(s.pct)}</strong>
                        <small>ความสำเร็จรวม</small>
                      </>
                    ) : <span className="lb-pod-wait" aria-label="ยังว่าง" />}
                    <span className="lb-plinth" aria-hidden="true">อันดับ {rank}</span>
                  </div>
                );
              })}
            </section>

            <section className="lb-table-wrap">
              <table className="lb-table">
                <thead>
                  <tr>
                    <th>อันดับ</th>
                    <th>เลขที่</th>
                    <th className="l">ชื่อ - นามสกุล</th>
                    {columns.map(c => <th key={c.id}>{c.label}<small>เต็ม {c.max}</small></th>)}
                    <th>แบบทดสอบ<small>เต็ม {quizMax}</small></th>
                    <th>คะแนนรวม<small>เต็ม {fullMark}</small></th>
                    <th>ความสำเร็จ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr><td colSpan={columns.length + 6} className="lb-empty">ยังไม่มีนักเรียนในห้องนี้</td></tr>
                  ) : rows.map((s, i) => (
                    <tr key={s.name + i} className={s.me ? 'me' : ''}>
                      <td><span className={`lb-rank r${i < 3 && s.active ? i + 1 : 0}`}>{s.active ? i + 1 : '-'}</span></td>
                      <td>{s.no || '-'}</td>
                      <td className="l">{s.name}{s.me && <span className="lb-me">คุณ</span>}</td>
                      {columns.map(c => <td key={c.id}>{s.activities?.[c.id] != null ? num(s.activities[c.id]) : <span className="lb-dash">–</span>}</td>)}
                      <td>{s.quiz != null ? num(s.quiz) : <span className="lb-dash">–</span>}</td>
                      <td className="b">{s.total}</td>
                      <td>
                        <div className="lb-bar"><span style={{ width: `${Math.min(100, s.pct)}%` }} /></div>
                        <small>{pctText(s.pct)}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <p className="lb-note">ใช้คะแนนเฉลี่ยของทุกครั้งที่ทำในแต่ละกิจกรรม · ช่อง – คือยังไม่ได้ทำ · กด Esc เพื่อกลับ</p>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
