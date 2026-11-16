import React, { useState } from 'react';
import { Icon, AIraBot, Button, Badge } from '../../UIPrimitives.jsx';
import { Callout } from '../../UIHelpers.jsx';
import { U1_TIMELINE, NEST } from '../../../data/unit1Data.js';

/* =====================================================================
   Sub-components: Interactive Timeline & Nested Diagram
   ===================================================================== */
export function U1Timeline() {
  const [sel, setSel] = useState(0);
  const e = U1_TIMELINE[sel];
  const n = U1_TIMELINE.length;
  const onKey = ev => {
    if (ev.key === "ArrowRight") {
      ev.preventDefault();
      setSel(s => Math.min(n - 1, s + 1));
    }
    if (ev.key === "ArrowLeft") {
      ev.preventDefault();
      setSel(s => Math.max(0, s - 1));
    }
  };
  return (
    <div className="tl">
      <div className="tl-scroll">
        <div
          className="tl-track"
          role="tablist"
          aria-label="เส้นเวลาประวัติศาสตร์ AI"
          onKeyDown={onKey}
        >
          <span
            className="tl-fill"
            style={{ width: `calc(${sel / (n - 1) * 86}%)` }}
            aria-hidden="true"
          />
          {U1_TIMELINE.map((x, k) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={k === sel}
              tabIndex={k === sel ? 0 : -1}
              className={"tl-dot " + (k < sel ? "past" : "")}
              onClick={() => setSel(k)}
              aria-label={`${x.yearLabel} ${x.title}`}
            >
              <span className="d" />
              <span className="y">{x.year}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="glass tl-card" key={e.id} role="tabpanel">
        <div className="tl-side">
          <span className="tl-icon">
            <Icon name={e.icon} size={26} />
          </span>
          <span className="tl-year grad-text">{e.year}</span>
          <span className="hint">{e.yearLabel}</span>
        </div>
        <div style={{ display: "grid", gap: 10, minWidth: 0 }}>
          <h3 style={{ fontSize: 20 }}>{e.title}</h3>
          <p>{e.text}</p>
          <Callout tone="info" icon="sparkle" title="ทำไมสำคัญ">
            {e.point}
          </Callout>
          <div className="step-nav">
            <Button
              variant="ghost"
              size="sm"
              icon="chevL"
              disabled={sel === 0}
              onClick={() => setSel(sel - 1)}
            >
              เหตุการณ์ก่อนหน้า
            </Button>
            <span className="mono hint">{sel + 1}/{n}</span>
            <Button
              variant="ghost"
              size="sm"
              iconRight="chevR"
              disabled={sel === n - 1}
              onClick={() => setSel(sel + 1)}
            >
              เหตุการณ์ถัดไป
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NestedDiagram() {
  const [sel, setSel] = useState("gen");
  const info = NEST[sel];
  const reg = id => ({
    className: "region" + (sel === id ? " on" : ""),
    role: "button",
    tabIndex: 0,
    "aria-pressed": sel === id,
    "aria-label": NEST[id].name,
    onClick: () => setSel(id),
    onKeyDown: e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSel(id);
      }
    }
  });

  return (
    <div className="nest">
      <div className="nest-fig">
        <svg
          viewBox="0 0 560 380"
          role="group"
          aria-label="แผนภาพความสัมพันธ์ AI, ML, DL และ Generative AI"
        >
          <rect
            {...reg("ai")}
            x="8"
            y="8"
            width="544"
            height="364"
            rx="30"
            fill="rgba(96, 97, 182,.08)"
            stroke="#6061B6"
            strokeWidth={sel === "ai" ? 4 : 2}
          />
          <rect
            {...reg("ml")}
            x="52"
            y="64"
            width="456"
            height="292"
            rx="26"
            fill="rgba(3,105,161,.08)"
            stroke="#1F67B3"
            strokeWidth={sel === "ml" ? 4 : 2}
          />
          <rect
            {...reg("dl")}
            x="100"
            y="124"
            width="300"
            height="214"
            rx="22"
            fill="rgba(47, 127, 209,.10)"
            stroke="#2F7FD1"
            strokeWidth={sel === "dl" ? 4 : 2}
          />
          <ellipse
            {...reg("gen")}
            cx="318"
            cy="256"
            rx="150"
            ry="68"
            fill="rgba(217,119,6,.12)"
            stroke="#D97706"
            strokeWidth={sel === "gen" ? 4 : 2}
            strokeDasharray="7 5"
          />
          <g pointerEvents="none" fontFamily="Prompt, sans-serif" fontWeight="600">
            <text x="30" y="42" fill="#4E4F9E" fontSize="18">AI</text>
            <text x="74" y="96" fill="#1F67B3" fontSize="17">Machine Learning</text>
            <text x="122" y="156" fill="#2F7FD1" fontSize="16">Deep Learning</text>
            <text x="318" y="252" fill="#B45309" fontSize="16" textAnchor="middle">Generative AI</text>
            <text x="318" y="274" fill="#92400E" fontSize="11.5" fontWeight="500" textAnchor="middle">ส่วนใหญ่ใช้ DL</text>
            <text x="388" y="40" fill="#474D7A" fontSize="11.5" fontWeight="500">เช่น ระบบกฎ IF–THEN</text>
            <text x="320" y="112" fill="#474D7A" fontSize="11.5" fontWeight="500">เช่น Decision Tree</text>
          </g>
        </svg>

        <div className="nest-legend" role="group" aria-label="เลือกชั้นของแผนภาพ">
          {Object.entries(NEST).map(([id, n]) => (
            <button
              key={id}
              type="button"
              className="pill-btn"
              aria-pressed={sel === id}
              onClick={() => setSel(id)}
            >
              <span className="sw" style={{ background: n.color }} />
              {n.name.replace(/ \(.+\)/, "")}
            </button>
          ))}
        </div>
      </div>

      <div className="glass nest-info" key={sel} aria-live="polite">
        <span className="eyebrow" style={{ color: info.color }}>เลือกอยู่</span>
        <h4 style={{ margin: 0, fontSize: 18 }}>{info.name}</h4>
        <p style={{ fontSize: 14.5 }}>{info.def}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {info.ex.map(x => <Badge key={x}>{x}</Badge>)}
        </div>
        {info.note && (
          <Callout tone="warn" title="อ่านแผนภาพให้ถูก">
            {info.note}
          </Callout>
        )}
      </div>
    </div>
  );
}

/* =====================================================================
   Slide Vector Illustrations (Unit 1 Rich Classroom Graphics)
   ===================================================================== */
export function SlideSceneArt({ kind }) {
  switch (kind) {
    case "input-scan":
      return (
        <svg viewBox="0 0 260 96" className="u1-scene-svg" aria-hidden="true">
          <rect width="260" height="96" rx="12" fill="#EFF6FF" />
          <rect x="24" y="14" width="56" height="68" rx="10" fill="#14205E" />
          <rect x="30" y="21" width="44" height="54" rx="6" fill="#DBEAFE" />
          <circle cx="52" cy="42" r="10" fill="#2563EB" />
          <path d="M38 64c2-9 26-9 28 0" fill="#3B82F6" />
          <path d="M98 32h42M98 48h56M98 64h34" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
          <rect x="174" y="20" width="62" height="56" rx="12" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="2" />
          <circle cx="194" cy="40" r="6" fill="#7DB8FF" />
          <path d="M182 64l14-12 10 8 18-18" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "model-brain":
      return (
        <svg viewBox="0 0 260 96" className="u1-scene-svg" aria-hidden="true">
          <rect width="260" height="96" rx="12" fill="#F1EDF9" />
          {[[64, 24], [64, 48], [64, 72]].map(([x, y], i) => (
            <g key={`l1-${i}`}>
              <line x1={x} y1={y} x2="130" y2="34" stroke="#C9B5E0" strokeWidth="2" />
              <line x1={x} y1={y} x2="130" y2="62" stroke="#C9B5E0" strokeWidth="2" />
              <circle cx={x} cy={y} r="8" fill="#7475C4" />
            </g>
          ))}
          {[[130, 34], [130, 62]].map(([x, y], i) => (
            <g key={`l2-${i}`}>
              <line x1={x} y1={y} x2="196" y2="48" stroke="#9C9AD8" strokeWidth="2.5" />
              <circle cx={x} cy={y} r="10" fill="#6061B6" />
            </g>
          ))}
          <circle cx="196" cy="48" r="14" fill="#4D9BE0" />
          <path d="M190 48l4 4 9-9" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "output-action":
      return (
        <svg viewBox="0 0 260 96" className="u1-scene-svg" aria-hidden="true">
          <rect width="260" height="96" rx="12" fill="rgba(255,255,255,0.16)" />
          <circle cx="76" cy="48" r="28" fill="#34D399" />
          <path d="M63 48l9 9 18-18" fill="none" stroke="#064E3B" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="122" y="22" width="112" height="22" rx="8" fill="rgba(255,255,255,0.9)" />
          <circle cx="136" cy="33" r="5" fill="#10B981" />
          <rect x="148" y="30" width="72" height="6" rx="3" fill="#1E40AF" />
          <rect x="122" y="52" width="92" height="22" rx="8" fill="rgba(255,255,255,0.75)" />
          <circle cx="136" cy="63" r="5" fill="#F59E0B" />
          <rect x="148" y="60" width="52" height="6" rx="3" fill="#3B82F6" />
        </svg>
      );
    case "big-data":
      return (
        <svg viewBox="0 0 280 104" className="u1-scene-svg" aria-hidden="true">
          <rect width="280" height="104" rx="14" fill="#EFF6FF" />
          <ellipse cx="86" cy="32" rx="34" ry="11" fill="#3B82F6" />
          <path d="M52 32v18c0 6 15 11 34 11s34-5 34-11V32" fill="#60A5FA" />
          <path d="M52 50v18c0 6 15 11 34 11s34-5 34-11V50" fill="#2563EB" />
          <rect x="148" y="20" width="48" height="30" rx="7" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="2" />
          <polygon points="168,29 168,41 180,35" fill="#2563EB" />
          <rect x="206" y="26" width="50" height="32" rx="7" fill="#DBEAFE" />
          <circle cx="220" cy="38" r="5" fill="#1D4ED8" />
          <path d="M212 52l12-9 9 6 11-10" fill="none" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="156" y="60" width="88" height="24" rx="8" fill="#1D4ED8" />
          <text x="200" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="700">1000M+ DATA</text>
        </svg>
      );
    case "gpu-chip":
      return (
        <svg viewBox="0 0 280 104" className="u1-scene-svg" aria-hidden="true">
          <rect width="280" height="104" rx="14" fill="#FFFBEB" />
          <rect x="74" y="18" width="132" height="68" rx="12" fill="#14205E" />
          {[0, 1, 2, 3].map(r =>
            [0, 1, 2, 3, 4, 5].map(c => (
              <rect key={`${r}-${c}`} x={88 + c * 18} y={28 + r * 13} width="12" height="9" rx="2.5" fill={(r + c) % 2 === 0 ? "#F59E0B" : "#7DB8FF"} />
            ))
          )}
          {[28, 46, 64].map(y => (
            <g key={y}>
              <rect x="58" y={y} width="16" height="6" rx="2" fill="#D97706" />
              <rect x="206" y={y} width="16" height="6" rx="2" fill="#D97706" />
            </g>
          ))}
        </svg>
      );
    case "deep-net":
      return (
        <svg viewBox="0 0 280 104" className="u1-scene-svg" aria-hidden="true">
          <rect width="280" height="104" rx="14" fill="#F7F3FB" />
          {[[48, 24], [48, 52], [48, 80]].map(([x, y], i) =>
            [[112, 20], [112, 42], [112, 64], [112, 86]].map(([x2, y2], j) => (
              <line key={`a-${i}-${j}`} x1={x} y1={y} x2={x2} y2={y2} stroke="#C9B5E0" strokeWidth="1.6" />
            ))
          )}
          {[[112, 20], [112, 42], [112, 64], [112, 86]].map(([x, y], i) =>
            [[176, 30], [176, 52], [176, 74]].map(([x2, y2], j) => (
              <line key={`b-${i}-${j}`} x1={x} y1={y} x2={x2} y2={y2} stroke="#B49FDA" strokeWidth="1.8" />
            ))
          )}
          {[[176, 30], [176, 52], [176, 74]].map(([x, y], i) => (
            <line key={`c-${i}`} x1={x} y1={y} x2="232" y2="52" stroke="#6E55B0" strokeWidth="2.4" />
          ))}
          {[24, 52, 80].map(y => <circle key={`n1-${y}`} cx="48" cy={y} r="7" fill="#7475C4" />)}
          {[20, 42, 64, 86].map(y => <circle key={`n2-${y}`} cx="112" cy={y} r="7" fill="#6E55B0" />)}
          {[30, 52, 74].map(y => <circle key={`n3-${y}`} cx="176" cy={y} r="7" fill="#8C74C6" />)}
          <circle cx="232" cy="52" r="12" fill="#10B981" />
        </svg>
      );
    case "ani-bot":
      return (
        <svg viewBox="0 0 280 112" className="u1-scene-svg" aria-hidden="true">
          <rect width="280" height="112" rx="14" fill="#ECFDF5" />
          <rect x="34" y="24" width="84" height="64" rx="14" fill="#10B981" />
          <rect x="48" y="38" width="56" height="26" rx="8" fill="#064E3B" />
          <circle cx="64" cy="51" r="5" fill="#6EE7B7" />
          <circle cx="88" cy="51" r="5" fill="#6EE7B7" />
          <rect x="138" y="24" width="108" height="28" rx="9" fill="#FFFFFF" stroke="#6EE7B7" strokeWidth="2" />
          <text x="192" y="43" textAnchor="middle" fill="#065F46" fontSize="13" fontWeight="700">✓ แปลภาษาแม่น</text>
          <rect x="138" y="60" width="108" height="28" rx="9" fill="#FEE2E2" stroke="#FCA5A5" strokeWidth="1.5" />
          <text x="192" y="79" textAnchor="middle" fill="#991B1B" fontSize="13" fontWeight="700">✕ ขับรถไม่ได้</text>
        </svg>
      );
    case "agi-brain":
      return (
        <svg viewBox="0 0 280 112" className="u1-scene-svg" aria-hidden="true">
          <rect width="280" height="112" rx="14" fill="#FFFBEB" />
          <circle cx="140" cy="56" r="34" fill="#F59E0B" opacity="0.2" />
          <circle cx="140" cy="56" r="22" fill="#D97706" />
          <text x="140" y="61" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800">AGI</text>
          {[[56, 30, "วิทย์"], [224, 30, "ศิลปะ"], [56, 82, "วางแผน"], [224, 82, "เหตุผล"]].map(([x, y, lbl]) => (
            <g key={lbl}>
              <line x1="140" y1="56" x2={x} y2={y} stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 3" />
              <rect x={x - 32} y={y - 13} width="64" height="26" rx="13" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.8" />
              <text x={x} y={y + 4} textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="700">{lbl}</text>
            </g>
          ))}
        </svg>
      );
    case "asi-core":
      return (
        <svg viewBox="0 0 280 112" className="u1-scene-svg" aria-hidden="true">
          <rect width="280" height="112" rx="14" fill="#F7F3FB" />
          <ellipse cx="140" cy="56" rx="78" ry="26" fill="none" stroke="#B49FDA" strokeWidth="2" transform="rotate(-14 140 56)" />
          <ellipse cx="140" cy="56" rx="78" ry="26" fill="none" stroke="#7DB8FF" strokeWidth="2" transform="rotate(14 140 56)" />
          <circle cx="140" cy="56" r="24" fill="#5B4397" />
          <polygon points="140,38 145,51 158,56 145,61 140,74 135,61 122,56 135,51" fill="#FDE68A" />
        </svg>
      );
    case "soft-ethics":
      return (
        <svg viewBox="0 0 280 100" className="u1-scene-svg" aria-hidden="true">
          <rect width="280" height="100" rx="14" fill="#ECFDF5" />
          <circle cx="92" cy="50" r="28" fill="#10B981" opacity="0.18" />
          <circle cx="92" cy="50" r="18" fill="#059669" />
          <path d="M84 50l6 6 12-12" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="136" y="26" width="112" height="48" rx="12" fill="#FFFFFF" stroke="#6EE7B7" strokeWidth="2" />
          <text x="192" y="47" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="800">Soft Law</text>
          <text x="192" y="64" textAnchor="middle" fill="#047857" fontSize="12" fontWeight="600">จิตสำนึก · ข้อตกลงสังคม</text>
        </svg>
      );
    case "hard-law":
      return (
        <svg viewBox="0 0 280 100" className="u1-scene-svg" aria-hidden="true">
          <rect width="280" height="100" rx="14" fill="#FFF1F2" />
          <rect x="58" y="26" width="64" height="48" rx="10" fill="#BE123C" />
          <rect x="70" y="36" width="40" height="6" rx="3" fill="#FFE4E6" />
          <rect x="70" y="48" width="28" height="6" rx="3" fill="#FDA4AF" />
          <rect x="138" y="26" width="112" height="48" rx="12" fill="#FFFFFF" stroke="#FDA4AF" strokeWidth="2" />
          <text x="194" y="47" textAnchor="middle" fill="#9F1239" fontSize="14" fontWeight="800">Hard Law</text>
          <text x="194" y="64" textAnchor="middle" fill="#BE123C" fontSize="12" fontWeight="600">ข้อบังคับ · มีบทลงโทษ</text>
        </svg>
      );
    case "provider-lab":
      return (
        <svg viewBox="0 0 280 96" className="u1-scene-svg" aria-hidden="true">
          <rect width="280" height="96" rx="14" fill="#EFF6FF" />
          <rect x="36" y="18" width="92" height="60" rx="10" fill="#1E3A8A" />
          <text x="82" y="45" textAnchor="middle" fill="#93C5FD" fontSize="12" fontWeight="700">&lt;AI Model /&gt;</text>
          <rect x="54" y="54" width="56" height="10" rx="5" fill="#3B82F6" />
          <path d="M142 48h26" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="180" y="22" width="66" height="52" rx="10" fill="#FFFFFF" stroke="#60A5FA" strokeWidth="2" />
          <text x="213" y="45" textAnchor="middle" fill="#1D4ED8" fontSize="12" fontWeight="800">คู่มือ +</text>
          <text x="213" y="61" textAnchor="middle" fill="#1D4ED8" fontSize="12" fontWeight="800">มาตรฐาน</text>
        </svg>
      );
    case "deployer-org":
      return (
        <svg viewBox="0 0 280 96" className="u1-scene-svg" aria-hidden="true">
          <rect width="280" height="96" rx="14" fill="#FFFBEB" />
          <rect x="36" y="20" width="84" height="56" rx="10" fill="#D97706" />
          <text x="78" y="45" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800">องค์กร /</text>
          <text x="78" y="61" textAnchor="middle" fill="#FEF3C7" fontSize="12" fontWeight="700">โรงเรียน</text>
          <path d="M134 48h26" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="172" y="20" width="74" height="56" rx="10" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
          <text x="209" y="45" textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="800">คนกำกับ +</text>
          <text x="209" y="61" textAnchor="middle" fill="#B45309" fontSize="11.5" fontWeight="700">Log ≥ 6 เดือน</text>
        </svg>
      );
    case "pdpa-id":
      return (
        <svg viewBox="0 0 280 94" className="u1-scene-svg" aria-hidden="true">
          <rect width="280" height="94" rx="14" fill="#EFF6FF" />
          <rect x="52" y="16" width="176" height="62" rx="12" fill="#FFFFFF" stroke="#60A5FA" strokeWidth="2" />
          <circle cx="88" cy="47" r="16" fill="#DBEAFE" />
          <circle cx="88" cy="42" r="6" fill="#2563EB" />
          <path d="M77 57c2-7 20-7 22 0" fill="#2563EB" />
          <rect x="118" y="31" width="88" height="8" rx="4" fill="#1D4ED8" />
          <rect x="118" y="45" width="66" height="7" rx="3.5" fill="#93C5FD" />
          <rect x="118" y="57" width="76" height="7" rx="3.5" fill="#BFDBFE" />
        </svg>
      );
    case "pdpa-bio":
      return (
        <svg viewBox="0 0 280 94" className="u1-scene-svg" aria-hidden="true">
          <rect width="280" height="94" rx="14" fill="#FFF1F2" />
          <circle cx="96" cy="47" r="26" fill="#FFE4E6" stroke="#E11D48" strokeWidth="2" strokeDasharray="5 3" />
          <path d="M86 54c0-10 4-18 10-18s10 8 10 18M91 56c0-7 2-12 5-12s5 5 5 12" fill="none" stroke="#BE123C" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="142" y="23" width="96" height="48" rx="12" fill="#BE123C" />
          <text x="190" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="12.5" fontWeight="800">มาตรา 26</text>
          <text x="190" y="60" textAnchor="middle" fill="#FFE4E6" fontSize="11.5" fontWeight="600">ต้องยินยอมชัดแจ้ง</text>
        </svg>
      );
    case "face-swap":
      return (
        <svg viewBox="0 0 280 94" className="u1-scene-svg" aria-hidden="true">
          <rect width="280" height="94" rx="14" fill="#EFF6FF" />
          <circle cx="78" cy="47" r="24" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
          <circle cx="78" cy="42" r="8" fill="#2563EB" />
          <path d="M64 60c3-8 25-8 28 0" fill="#2563EB" />
          <path d="M118 40h44M150 32l12 8-12 8M162 56h-44M130 48l-12 8 12 8" fill="none" stroke="#2563EB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="176" y="21" width="56" height="52" rx="12" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
          <circle cx="204" cy="41" r="8" fill="#EF4444" />
          <path d="M190 59c3-8 25-8 28 0" fill="#EF4444" />
        </svg>
      );
    case "voice-clone":
      return (
        <svg viewBox="0 0 280 94" className="u1-scene-svg" aria-hidden="true">
          <rect width="280" height="94" rx="14" fill="#FFFBEB" />
          <circle cx="62" cy="47" r="22" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
          <rect x="56" y="34" width="12" height="18" rx="6" fill="#D97706" />
          <path d="M51 47a11 11 0 0 0 22 0M62 58v6" fill="none" stroke="#B45309" strokeWidth="2.4" strokeLinecap="round" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
            const h = [16, 34, 24, 42, 30, 38, 20, 28][i];
            return <rect key={i} x={102 + i * 13} y={47 - h / 2} width="7" height={h} rx="3.5" fill={i % 2 === 0 ? "#F59E0B" : "#EF4444"} />;
          })}
          <rect x="214" y="29" width="44" height="36" rx="10" fill="#DC2626" />
          <text x="236" y="51" textAnchor="middle" fill="#FFFFFF" fontSize="11.5" fontWeight="800">FAKE</text>
        </svg>
      );
    case "ai-gen":
      return (
        <svg viewBox="0 0 280 94" className="u1-scene-svg" aria-hidden="true">
          <rect width="280" height="94" rx="14" fill="#FFF1F2" />
          <rect x="42" y="18" width="112" height="58" rx="10" fill="#FFFFFF" stroke="#FB7185" strokeWidth="2" />
          <circle cx="72" cy="38" r="7" fill="#F43F5E" />
          <path d="M52 64l24-18 18 12 20-22 28 28" fill="none" stroke="#E11D48" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <polygon points="184,26 189,39 202,44 189,49 184,62 179,49 166,44 179,39" fill="#E11D48" />
          <rect x="206" y="31" width="46" height="30" rx="8" fill="#BE123C" />
          <text x="229" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800">100% AI</text>
        </svg>
      );
    default:
      return null;
  }
}

/* =====================================================================
   AIra End-of-Deck Congratulations Component
   ===================================================================== */
export function AIraSlideCongrats({
  tone = "blue",
  stepBadge,
  completedTitle,
  congratsSpeech,
  nextKicker,
  nextIcon = "sparkle",
  nextTitle,
  nextDesc,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  sheetLabel,
  onOpenSheet,
  onMenu
}) {
  return (
    <div className={`u1-aira-congrats tone-${tone}`}>
      <div className="u1-congrats-bot-panel">
        <div className={`u1-congrats-orb tone-${tone}`}>
          <span className="u1-star s1" aria-hidden="true">✦</span>
          <span className="u1-star s2" aria-hidden="true">★</span>
          <span className="u1-star s3" aria-hidden="true">✦</span>
          <AIraBot mood="cheer" size={196} className="u1-congrats-mascot" />
        </div>
        <div className="u1-congrats-bot-tag">
          <span className="u1-bot-online-dot" />
          <span>น้องหุ่นยนต์ <b>AIra (ไอร่า)</b></span>
        </div>
      </div>

      <div className="u1-congrats-main">
        <div className="u1-congrats-top">
          <span className={`u1-congrats-pill tone-${tone}`}>
            <Icon name="award" size={16} />
            <span>{stepBadge}</span>
          </span>
          <h2 className="u1-congrats-heading">
            ยินดีด้วยนะ! เรียนจบเรื่อง<br />
            <span>“{completedTitle}”</span> แล้ว 🎉
          </h2>
          <div className="u1-congrats-speech">
            <Icon name="chat" size={19} />
            <p>{congratsSpeech}</p>
          </div>
        </div>

        <div className={`u1-congrats-next-box tone-${tone}`}>
          <div className="u1-congrats-next-info">
            <span className="u1-next-eyebrow">
              <Icon name={nextIcon} size={15} />
              <span>{nextKicker}</span>
            </span>
            <h3>{nextTitle}</h3>
            <p>{nextDesc}</p>
          </div>

          <div className="u1-congrats-actions">
            <button
              type="button"
              className={`u1-congrats-cta-primary tone-${tone}`}
              onClick={onPrimary}
            >
              <span>{primaryLabel}</span>
              <Icon name="chevR" size={20} />
            </button>

            <div className="u1-congrats-sub-actions">
              {secondaryLabel && onSecondary && (
                <button
                  type="button"
                  className="u1-congrats-cta-secondary highlight"
                  onClick={onSecondary}
                >
                  <Icon name="target" size={16} />
                  <span>{secondaryLabel}</span>
                </button>
              )}
              {sheetLabel && onOpenSheet && (
                <button
                  type="button"
                  className="u1-congrats-cta-secondary"
                  onClick={onOpenSheet}
                >
                  <Icon name="book" size={16} />
                  <span>{sheetLabel}</span>
                </button>
              )}
              {onMenu && (
                <button
                  type="button"
                  className="u1-congrats-cta-secondary"
                  onClick={onMenu}
                >
                  <Icon name="grid" size={16} />
                  <span>กลับเมนูบทเรียน</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
