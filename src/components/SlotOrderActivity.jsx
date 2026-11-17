import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Icon, Button } from './UIPrimitives.jsx';
import { ActScore, ActResult, shuffle } from './UIHelpers.jsx';

// เรียงลำดับแบบ "ตัวเลือกซ้าย → ช่องวางขวา"
// ลากการ์ดไปวางในช่อง (วางทับช่องที่มีการ์ด = สลับกัน, ลากกลับซ้าย = เอาออก)
// หรือกด/แตะการ์ด: ฝั่งซ้ายไปช่องว่างช่องแรก, ฝั่งขวากลับไปฝั่งซ้าย (ใช้ได้บนมือถือและคีย์บอร์ด)
export function SlotOrderActivity({ unitId, actId, events }) {
  const { saveActivity, progress } = useApp();
  const fresh = () => ({ pool: shuffle(events.map(e => e.id)), slots: events.map(() => null) });
  const [st, setSt] = useState(fresh);
  const [checked, setChecked] = useState(false);
  const [over, setOver] = useState(null); // ช่องที่กำลังลากผ่าน
  const ev = id => events.find(e => e.id === id);
  const full = st.slots.every(Boolean);
  const score = st.slots.filter((id, i) => id === events[i].id).length;
  const best = progress[unitId].activityScores[actId];

  // ย้าย id ไปยังช่อง i (null = กลับไปฝั่งซ้าย)
  const place = (id, to) => setSt(s => {
    const pool = s.pool.filter(x => x !== id);
    const slots = s.slots.map(x => (x === id ? null : x));
    const from = s.slots.indexOf(id);
    if (to == null) return { pool: [...pool, id], slots };
    const occupant = slots[to];
    slots[to] = id;
    if (occupant) {
      if (from >= 0) slots[from] = occupant; // สลับช่อง
      else pool.push(occupant); // การ์ดเดิมกลับฝั่งซ้าย
    }
    return { pool, slots };
  });
  const tap = id => {
    if (checked) return;
    if (st.slots.includes(id)) place(id, null);
    else {
      const empty = st.slots.indexOf(null);
      if (empty >= 0) place(id, empty);
    }
  };
  const check = () => {
    setChecked(true);
    saveActivity(unitId, actId, score, events.length);
  };
  const retry = () => {
    setSt(fresh());
    setChecked(false);
  };

  // ลากด้วย Pointer Events (ใช้ได้ทั้งเมาส์และจอสัมผัส) — ขยับเกิน 6px จึงนับเป็นการลาก ไม่งั้นเป็นการกดปกติ
  // จอสัมผัสลากที่ที่จับ ⠿ เท่านั้น ส่วนอื่นของการ์ดยังเลื่อนหน้าได้
  const [ghost, setGhost] = useState(null); // { id, x, y } การ์ดลอยตามนิ้ว/เมาส์
  const suppressClick = useRef(false);
  const targetAt = (x, y) => {
    const el = document.elementFromPoint(x, y);
    const slot = el && el.closest('[data-slot]');
    if (slot) return Number(slot.dataset.slot);
    return el && el.closest('.so-pool') ? 'pool' : undefined;
  };
  const startDrag = (e, id) => {
    if (checked || (e.pointerType !== 'mouse' && !e.target.closest('.so-grip'))) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const x0 = e.clientX, y0 = e.clientY;
    let dragging = false;
    const onMove = m => {
      if (!dragging && Math.hypot(m.clientX - x0, m.clientY - y0) < 6) return;
      dragging = true;
      m.preventDefault();
      setGhost({ id, x: m.clientX, y: m.clientY });
      const t = targetAt(m.clientX, m.clientY);
      setOver(t === undefined ? null : t);
    };
    const onUp = u => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (dragging) {
        suppressClick.current = true; // ปล่อยลากแล้วอย่าให้นับเป็นการกด (click มาก่อน timer นี้)
        setTimeout(() => { suppressClick.current = false; }, 0);
        const t = u.type === 'pointerup' ? targetAt(u.clientX, u.clientY) : undefined;
        if (t !== undefined) place(id, t === 'pool' ? null : t);
      }
      setGhost(null);
      setOver(null);
    };
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  // ฟังก์ชันธรรมดา (ไม่ใช่คอมโพเนนต์) การ์ดจะไม่ถูก remount ระหว่างลาก
  const card = (id, inSlot) => {
    const e = ev(id);
    return (
      <button
        type="button"
        key={id}
        className={`so-card ${ghost && ghost.id === id ? 'is-lifted' : ''}`}
        disabled={checked}
        onPointerDown={p => startDrag(p, id)}
        onClick={() => {
          if (suppressClick.current) { suppressClick.current = false; return; }
          tap(id);
        }}
        aria-label={inSlot ? `${e.title} กดเพื่อนำกลับไปฝั่งตัวเลือก` : `${e.title} กดเพื่อวางในช่องว่างถัดไป`}
      >
        <span className="so-grip" aria-hidden="true">⠿</span>
        <span className="so-txt">
          <b>{e.title}</b>
          <small>{e.clue}</small>
        </span>
      </button>
    );
  };

  return (
    <div className="act so-act">
      <div className="act-head">
        <span className="hint">ลากการ์ดจากฝั่งซ้ายไปวางในช่องฝั่งขวา หรือกดที่การ์ดเพื่อวางในช่องว่างถัดไป</span>
        {checked && <ActScore score={score} max={events.length} />}
      </div>

      <div className="so-board">
        <section className={`so-pool ${over === 'pool' ? 'is-over' : ''}`} aria-label="ตัวเลือก">
          <h5 className="so-head"><Icon name="list" size={15} /> ตัวเลือก <small>{st.pool.length}</small></h5>
          {st.pool.length ? st.pool.map(id => card(id, false)) : (
            <p className="so-empty">วางครบทุกช่องแล้ว กดตรวจคำตอบได้เลย</p>
          )}
        </section>

        <section className="so-slots" aria-label="ลำดับคำตอบ">
          <h5 className="so-head"><Icon name="target" size={15} /> ลำดับคำตอบ</h5>
          <ol>
            {st.slots.map((id, i) => {
              const ok = checked && id === events[i].id;
              return (
                <li
                  key={i}
                  data-slot={i}
                  className={`so-slot ${id ? 'filled' : ''} ${over === i ? 'is-over' : ''} ${checked ? (ok ? 'ok' : 'no') : ''}`}
                >
                  <span className="so-n">{i + 1}</span>
                  {id ? card(id, true) : <span className="so-placeholder">วางการ์ดที่นี่</span>}
                  {checked && (
                    <span className="so-verdict">
                      <Icon name={ok ? 'check' : 'x'} size={16} />
                      {ok ? 'ถูกต้อง' : `ช่องนี้คือ ${events[i].title}`}
                      {events[i].year && ` · ${events[i].yearLabel}`}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      {!checked ? (
        <Button icon="check" onClick={check} disabled={!full} style={{ alignSelf: 'flex-start' }}>
          {full ? 'ตรวจคำตอบ' : `วางให้ครบก่อน (${st.slots.filter(Boolean).length}/${events.length})`}
        </Button>
      ) : (
        <ActResult score={score} max={events.length} onRetry={retry} best={best && best.best} />
      )}

      {ghost && (
        <div className="so-ghost" style={{ left: ghost.x, top: ghost.y }} aria-hidden="true">
          <b>{ev(ghost.id).title}</b>
        </div>
      )}
    </div>
  );
}
