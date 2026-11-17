import React, { useState } from 'react';
import { UNITS } from '../data/courseData.js';
import { useApp } from '../context/AppContext.jsx';
import { GlassCard, ProgressBar, Icon, Button } from './UIPrimitives.jsx';
import { Leaderboard } from './Leaderboard.jsx';

// คะแนนเฉลี่ยของทุกครั้งที่ทำ (sum/attempts) ข้อมูลเก่าที่ไม่มี sum ใช้ best
const avgOf = s => (s.attempts ? (s.sum != null ? s.sum : s.best * s.attempts) / s.attempts : s.best);
const num = x => +(+x).toFixed(2);

// แดชบอร์ดคะแนนของนักเรียน: เห็นเฉพาะคะแนนของตนเอง (ข้อมูลจากความก้าวหน้าในเครื่อง/ที่ซิงก์ไว้)
export function MyUnitScores({ unitId, columns }) {
  const { progress } = useApp();
  const [showAll, setShowAll] = useState(false);
  const up = progress?.[unitId];
  const unit = UNITS.find(u => u.id === unitId);
  const quizMax = unit?.quiz?.questions || 0;
  const qa = up?.quizAttempts || [];
  const quizAvg = qa.length ? qa.reduce((a, x) => a + (x.correct || 0), 0) / qa.length : null;

  const items = columns.map(c => {
    const s = up?.activityScores?.[c.id];
    return { key: c.id, label: c.label, score: s ? num(avgOf(s)) : null, max: c.max || s?.max || 0, tries: s?.attempts || 0 };
  });
  items.push({
    key: 'quiz', label: 'แบบทดสอบหลังเรียน', quiz: true,
    score: quizAvg == null ? null : num(quizAvg), max: quizMax, tries: qa.length
  });
  const total = num(items.reduce((a, x) => a + (x.score || 0), 0));
  const full = items.reduce((a, x) => a + x.max, 0);
  const pct = full ? Math.round((total / full) * 100) : 0;
  const done = items.filter(x => x.score != null).length;

  return (
    <GlassCard className="my-scores">
      <div className="my-scores-head">
        <div>
          <span className="curr-section-kicker"><Icon name="trophy" size={13} /> MY SCORE</span>
          <h2>คะแนนของฉัน หน่วยที่ {UNITS.indexOf(unit) + 1}</h2>
          <p>คะแนนเฉลี่ยของทุกครั้งที่ทำ · ทำแล้ว {done}/{items.length} กิจกรรม</p>
        </div>
        <div className="my-scores-total" aria-label={`คะแนนรวม ${total} จาก ${full}`}>
          <b>{total}<small>/{full}</small></b>
          <span>คะแนนรวม {pct}%</span>
          <ProgressBar value={pct} />
          <Button variant="primary" icon="trophy" className="my-scores-btn" onClick={() => setShowAll(true)}>
            ดูผลคะแนนทั้งหมด
          </Button>
        </div>
      </div>
      <div className="my-scores-grid">
        {items.map(x => (
          <div key={x.key} className={`my-score ${x.score == null ? 'todo' : ''} ${x.quiz ? 'quiz' : ''}`}>
            <span className="my-score-l">{x.quiz ? 'แบบทดสอบ' : 'AI QUEST'}</span>
            <b className="my-score-t">{x.label}</b>
            <span className="my-score-n">
              {x.score == null ? 'ยังไม่ได้ทำ' : <>{x.score}<small>/{x.max}</small></>}
            </span>
            <ProgressBar value={x.score == null || !x.max ? 0 : Math.round((x.score / x.max) * 100)} />
            {x.tries > 0 && <small className="my-score-a">ทำแล้ว {x.tries} ครั้ง</small>}
          </div>
        ))}
      </div>
      {showAll && <Leaderboard unitId={unitId} columns={columns} onClose={() => setShowAll(false)} />}
    </GlassCard>
  );
}
