import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Icon } from './UIPrimitives.jsx';
import { shuffle } from './UIHelpers.jsx';
// แผ่นท่าทาง AIra 3x3 (โปร่งใส) ใช้เป็น sprite: เลือกท่าด้วยคลาส pose-* ใน premium.css
import airaPoses from '../assets/aira-poses.webp';

// กรอบมินิเกมแบบอาร์เคด ใช้ร่วมกันทุกหน่วย (หน่วย 1 AI QUEST, หน่วย 2 CV QUEST)
// levels: [{ id, n, title, icon, color, pose, mission, render }] — render() สร้างเนื้อหาด่าน ครั้งเดียวต่อการเปิดด่าน

// สุ่มลำดับข้อ แต่ไม่ให้คำตอบสลับไปมาเป็นจังหวะ (เช่น ใช่-ไม่-ใช่-ไม่) ที่เดาได้โดยไม่อ่าน
const alternates = a => a.every((it, i) => i < 2 || it.answer === a[i - 2].answer && it.answer !== a[i - 1].answer);
export const mix = items => { let a; do { a = shuffle(items); } while (alternates(a)); return a; };

// 3 ดาวเมื่อเต็ม, 2 ดาวเมื่อได้ 75% ขึ้นไป, 1 ดาวเมื่อได้คะแนน
const starsFor = s => (!s || !s.best ? 0 : s.best >= s.max ? 3 : s.best / s.max >= 0.75 ? 2 : 1);

function Stars({ n }) {
  return (
    <span className="cvg-stars-row" aria-label={`${n} ดาว จาก 3`}>
      {[0, 1, 2].map(i => <i key={i} className={i < n ? 'on' : ''} aria-hidden="true">★</i>)}
    </span>
  );
}

// เนื้อหาด่านคำนวณครั้งเดียวตอนเปิดด่าน (สุ่มลำดับข้อไม่เปลี่ยนระหว่างเล่น)
function LevelBody({ render }) {
  return useMemo(render, []); // eslint-disable-line react-hooks/exhaustive-deps
}

export function ArcadeGame({ unitId, brand, tagline, levels }) {
  const { progress } = useApp();
  const [level, setLevel] = useState(levels[0].id);
  const scores = progress?.[unitId]?.activityScores || {};
  const maxStars = levels.length * 3;
  const total = levels.reduce((a, l) => a + starsFor(scores[l.id]), 0);
  const cur = levels.find(l => l.id === level);

  return (
    <div className="quest-game" style={{ '--aira-poses': `url(${airaPoses})` }}>
      <header className="cvg-hud">
        <div className="cvg-brand">
          <span className="cvg-logo cvg-pose pose-wave" aria-hidden="true" />
          <div>
            <b>{brand}</b>
            <small>{tagline}</small>
          </div>
        </div>
        <div className="cvg-total" aria-label={`ดาวรวม ${total} จาก ${maxStars}`}>
          <span className="cvg-total-n"><i aria-hidden="true">★</i> {total}<small>/{maxStars}</small></span>
          <span className="cvg-total-bar" aria-hidden="true"><span style={{ width: `${(total / maxStars) * 100}%` }} /></span>
        </div>
      </header>

      <nav className="cvg-levels" role="tablist" aria-label="เลือกด่าน" style={{ "--n": levels.length }}>
        {levels.map(l => (
          <button
            key={l.id}
            type="button"
            role="tab"
            aria-selected={level === l.id}
            className={`cvg-level ${level === l.id ? 'active' : ''} ${scores[l.id] ? 'played' : ''}`}
            style={{ '--lc': l.color }}
            onClick={() => setLevel(l.id)}
          >
            <span className="cvg-level-n">{scores[l.id] ? <Icon name="check" size={18} /> : l.n}</span>
            <span className="cvg-level-t">
              <small>ด่าน {l.n}</small>
              <b>{l.title}</b>
            </span>
            <Stars n={starsFor(scores[l.id])} />
          </button>
        ))}
      </nav>

      <section className={`cvg-stage cvg-${cur.id}`} style={{ '--lc': cur.color }} aria-label={`ด่าน ${cur.n} ${cur.title}`}>
        <div className="cvg-mission">
          <span key={cur.id} className={`cvg-mission-aira cvg-pose pose-${cur.pose}`} aria-hidden="true" />
          <span className="cvg-mission-tag"><Icon name={cur.icon} size={15} /> MISSION {cur.n}</span>
          <p>{cur.mission}</p>
        </div>
        <LevelBody key={cur.id} render={cur.render} />
      </section>
    </div>
  );
}
