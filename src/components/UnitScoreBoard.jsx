import React, { useMemo } from 'react';
import { COURSE, UNITS } from '../data/courseData.js';
import { GlassCard, Badge } from './UIPrimitives.jsx';

const num = x => +(+x).toFixed(2);

// ตารางคะแนนรายกิจกรรมของหน่วยหนึ่ง แยกตามห้อง (ใช้ในแดชบอร์ดครู)
// student.unitScores[unitId] = { activities: { actId: { best, max } }, quiz: { correct, total, percent } | null }
export function UnitScoreBoard({ unitId, columns, students, selectedClass, onSelectClass }) {
  const unit = UNITS.find(u => u.id === unitId);
  const quizMax = unit?.quiz?.questions || 0;
  const list = useMemo(
    () => students.filter(s => selectedClass === 'all' || s.classroom === selectedClass),
    [students, selectedClass]
  );

  // คะแนนเต็มของแต่ละกิจกรรมเอามาจากผลที่บันทึกไว้ (ทุกคนเล่นชุดเดียวกัน คะแนนเต็มจึงเท่ากัน)
  // shortcut: ถ้ายังไม่มีใครในทุกห้องเล่นกิจกรรมนั้น จะไม่รู้คะแนนเต็ม จึงยังไม่นับในคะแนนรวม
  const colMax = useMemo(() => {
    const m = {};
    for (const c of columns) {
      m[c.id] = c.max || Math.max(0, ...students.map(s => s.unitScores?.[unitId]?.activities?.[c.id]?.max || 0));
    }
    return m;
  }, [students, columns, unitId]);
  const fullMark = columns.reduce((a, c) => a + colMax[c.id], 0) + quizMax;

  const rows = list.map(s => {
    const us = s.unitScores?.[unitId] || {};
    const acts = columns.map(c => us.activities?.[c.id] || null);
    const quiz = us.quiz || null;
    const total = acts.reduce((a, x) => a + (x ? x.best : 0), 0) + (quiz ? quiz.correct : 0);
    return { s, acts, quiz, total, pct: fullMark ? Math.round((total / fullMark) * 100) : 0 };
  });

  const avg = k => (rows.length ? Math.round((rows.reduce((a, r) => a + k(r), 0) / rows.length) * 10) / 10 : 0);
  const th = { padding: '10px 12px', whiteSpace: 'nowrap' };
  const td = { padding: '10px 12px', textAlign: 'center' };

  return (
    <GlassCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
          คะแนนหน่วยที่ {UNITS.indexOf(unit) + 1} {unit?.title}
        </h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>ห้องเรียน:</span>
          {['all', ...COURSE.classrooms].map(c => (
            <button
              key={c}
              type="button"
              className={`tag ${selectedClass === c ? 'active' : ''}`}
              style={{ cursor: 'pointer', padding: '6px 14px' }}
              onClick={() => onSelectClass(c)}
            >
              {c === 'all' ? 'ทุกห้อง' : c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--line)', color: 'var(--muted)', fontSize: 13 }}>
              <th style={{ ...th, textAlign: 'left' }}>ที่</th>
              <th style={{ ...th, textAlign: 'left' }}>ชื่อ - นามสกุล</th>
              <th style={th}>ห้อง</th>
              {columns.map(c => (
                <th key={c.id} style={th}>
                  {c.label}
                  <div style={{ fontWeight: 400, fontSize: 11 }}>เต็ม {colMax[c.id] || '–'}</div>
                </th>
              ))}
              <th style={th}>
                แบบทดสอบหลังเรียน
                <div style={{ fontWeight: 400, fontSize: 11 }}>เต็ม {quizMax}</div>
              </th>
              <th style={th}>
                คะแนนรวม
                <div style={{ fontWeight: 400, fontSize: 11 }}>เต็ม {fullMark}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 5} style={{ textAlign: 'center', padding: 36, color: 'var(--muted)' }}>
                  ยังไม่มีนักเรียนในห้องที่เลือก
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={r.s.id} style={{ borderBottom: '1px solid rgba(155,135,245,.1)', background: i % 2 ? '#FFFDF6' : 'transparent' }}>
                  <td style={{ ...td, textAlign: 'left', color: 'var(--muted)' }}>{i + 1}</td>
                  <td style={{ ...td, textAlign: 'left', fontWeight: 600 }}>{r.s.name}</td>
                  <td style={td}><Badge tone="cyan">{r.s.classroom}</Badge></td>
                  {r.acts.map((a, k) => (
                    <td key={columns[k].id} style={td}>
                      {a ? num(a.best) : <span style={{ color: 'var(--muted)' }} title="ยังไม่ได้เล่น">–</span>}
                    </td>
                  ))}
                  <td style={td}>
                    {r.quiz ? num(r.quiz.correct) : <span style={{ color: 'var(--muted)' }} title="ยังไม่ได้ทำ">–</span>}
                  </td>
                  <td style={{ ...td, fontWeight: 700 }}>
                    {num(r.total)}
                    <span style={{ fontWeight: 400, color: 'var(--muted)', fontSize: 12 }}> ({r.pct}%)</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {rows.length > 0 && (
            <tfoot>
              <tr style={{ borderTop: '2px solid var(--line)', fontWeight: 700 }}>
                <td style={{ ...td, textAlign: 'left' }} colSpan={3}>
                  ค่าเฉลี่ย ({rows.length} คน)
                </td>
                {columns.map((c, k) => (
                  <td key={c.id} style={td}>{avg(r => (r.acts[k] ? r.acts[k].best : 0))}</td>
                ))}
                <td style={td}>{avg(r => (r.quiz ? r.quiz.correct : 0))}</td>
                <td style={td}>{avg(r => r.total)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <p style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
        แสดงคะแนนเฉลี่ยของทุกครั้งที่ทำในแต่ละกิจกรรม · ช่อง – คือยังไม่ได้ทำ (นับเป็น 0 ในคะแนนรวม)
      </p>
    </GlassCard>
  );
}
