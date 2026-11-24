import React, { useEffect, useMemo, useState } from 'react';
import { ACHIEVEMENTS, COURSE, QUIZ_PASS_PERCENT, UNITS, unitLocked } from '../data/courseData.js';
import { useApp } from '../context/AppContext.jsx';
import { useRoute } from '../context/RouteContext.jsx';
import { Icon, AIraBot, GlassCard, Button, Badge, DemoBadge, ProgressRing, ProgressBar } from '../components/UIPrimitives.jsx';
import { BRAIN_PATH, BRAIN_GYRI } from '../components/BackgroundEffects.jsx';
import { thaiDate } from '../components/UIHelpers.jsx';
import { visitStats, classVisitStats, dayKey } from '../services/visitStats.js';
import { api } from '../services/apiService.js';
import { VisitCalendar, dayTh } from '../components/VisitCalendar.jsx';
import { goToProgress } from '../components/Navigation.jsx';
import { HeroCircuit } from '../components/HeroCircuit.jsx';
import unit1Photo from '../assets/images/units/unit1.jpg';
import unit2Photo from '../assets/images/units/unit2.jpg';
import unit3Photo from '../assets/images/units/unit3.jpg';
import unit4Photo from '../assets/images/units/unit4.jpg';

const UNIT_PHOTO = { 1: unit1Photo, 2: unit2Photo, 3: unit3Photo, 4: unit4Photo };

function gearPath(cx, cy, rOut, rIn, teeth) {
  const step = (Math.PI * 2) / teeth;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    [
      [rIn, a],
      [rOut, a + step * 0.14],
      [rOut, a + step * 0.44],
      [rIn, a + step * 0.58]
    ].forEach(([r, t], j) => {
      d += (i === 0 && j === 0 ? "M" : "L") + (cx + r * Math.cos(t)).toFixed(1) + " " + (cy + r * Math.sin(t)).toFixed(1) + " ";
    });
  }
  return d + "Z";
}

const U3_LAYERS = [
  { x: 65, nodes: [76, 114, 152], label: "Input [3]" },
  { x: 135, nodes: [58, 96, 134, 170], label: "Dense_1 [4]" },
  { x: 205, nodes: [58, 96, 134, 170], label: "Dense_2 [4]" },
  { x: 275, nodes: [96, 134], label: "Output [2]" }
];

const U3_EDGES = [];
for (let l = 0; l < U3_LAYERS.length - 1; l++) {
  const fromL = U3_LAYERS[l];
  const toL = U3_LAYERS[l + 1];
  fromL.nodes.forEach((y1, i) => {
    toL.nodes.forEach((y2, j) => {
      U3_EDGES.push({
        x1: fromL.x,
        y1,
        x2: toL.x,
        y2,
        active: (i + j) % 2 === 0,
        delay: -((i * 0.4 + j * 0.25) % 2)
      });
    });
  });
}

const GEAR_L = gearPath(224, 122, 50, 40, 12);
const GEAR_S = gearPath(286, 78, 34, 26, 10);


function UnitArt({ id }) {
  const uid = useMemo(() => "ua" + Math.random().toString(36).slice(2, 7), []);
  const g = n => `url(#${uid}${n})`;

  let body = null;

  if (id === "unit1") {
    body = (
      <g>
        {/* Orbital radar rings */}
        <ellipse cx="152" cy="116" rx="142" ry="46" fill="none" stroke="rgba(155,135,245,0.22)" strokeDasharray="3 6" transform="rotate(-6 152 116)" />
        <ellipse cx="152" cy="116" rx="115" ry="36" fill="none" stroke="rgba(87,204,242,0.18)" strokeDasharray="2 4" transform="rotate(4 152 116)" />

        {/* Shimmering Star Field */}
        <circle className="art-shimmer" cx="48" cy="62" r="2" fill="#57CCF2" style={{ animationDelay: '0.2s' }} />
        <circle className="art-shimmer" cx="318" cy="168" r="2.2" fill="#FFD66D" style={{ animationDelay: '1.1s' }} />
        <circle className="art-shimmer" cx="112" cy="182" r="1.6" fill="#9B87F5" style={{ animationDelay: '0.7s' }} />
        <circle className="art-shimmer" cx="304" cy="58" r="1.8" fill="#57CCF2" style={{ animationDelay: '1.6s' }} />

        {/* Telemetry HUD - Placed cleanly below overlay badges */}
        <text x="18" y="48" fill="#57CCF2" fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="700" letterSpacing="0.4">
          SYS://NEURAL_CORE_v4.2
        </text>
        <text x="342" y="48" textAnchor="end" fill="#FFD66D" fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="700" letterSpacing="0.4">
          ETHICS_LOCK: SECURE
        </text>

        {/* Neural Synapse Rays connecting into Brain */}
        {[
          [38, 70], [38, 140], [80, 178], [152, 188],
          [280, 56], [320, 140], [152, 54]
        ].map(([x, y], i) => (
          <g key={i}>
            <line x1={x} y1={y} x2="152" y2="116" stroke="rgba(87,204,242,0.25)" strokeWidth="1.2" />
            <line
              className="art-flow"
              x1={x}
              y1={y}
              x2="152"
              y2="116"
              stroke="#57CCF2"
              strokeWidth="2.2"
              strokeLinecap="round"
              style={{ animationDelay: `${-i * 0.35}s` }}
            />
            <circle className="art-neuron" cx={x} cy={y} r="4" fill={i % 2 === 0 ? "#57CCF2" : "#9B87F5"} filter={g("glow")} style={{ animationDelay: `${i * 0.25}s` }} />
            <circle cx={x} cy={y} r="1.5" fill="#FFFFFF" />
          </g>
        ))}

        {/* Detailed Dual-Hemisphere Cyber Brain */}
        <g className="art-pulse" transform="translate(152 114) scale(.78) translate(-240 -105)">
          <path d={BRAIN_PATH} fill={g("f")} stroke={g("a")} strokeWidth="3" filter={g("glow")} />
          {BRAIN_GYRI.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={i % 2 === 0 ? "rgba(183,168,255,0.92)" : "rgba(87,204,242,0.85)"}
              strokeWidth={i % 3 === 0 ? "2.6" : "2"}
              strokeLinecap="round"
            />
          ))}
          {/* Luminous Corpus Callosum Core */}
          <ellipse cx="240" cy="105" rx="18" ry="34" fill="rgba(87,204,242,0.28)" stroke="#57CCF2" strokeWidth="2" filter={g("glow")} />
        </g>

        {/* Metallic Gold Cyber Ethics Shield */}
        <g className="art-pulse-fast" transform="translate(244 92)" filter={g("glow")}>
          <path
            d="M26 0 L50 9 V28 C50 44 38 54 26 58 C14 54 2 44 2 28 V9 Z"
            fill={g("shieldGrad")}
            stroke="#FFD66D"
            strokeWidth="2.5"
          />
          <path
            d="M26 6 L44 14 V27 C44 40 34 48 26 51 C18 48 8 40 8 27 V14 Z"
            fill="none"
            stroke="rgba(255,214,109,0.4)"
            strokeWidth="1.2"
          />
          {/* Shield Checkmark & Circuits */}
          <path d="M16 29 l7 7 13-14" fill="none" stroke="#211B3B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 29 l7 7 13-14" fill="none" stroke="#FFD66D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          {/* Shield Sparkle Glint */}
          <circle className="art-shimmer" cx="44" cy="14" r="2.5" fill="#FFF9D2" style={{ animationDelay: '0.5s' }} />
        </g>

        {/* Bottom HUD Telemetry */}
        <text x="18" y="196" fill="#7A7EA3" fontSize="8" fontFamily="JetBrains Mono, monospace">
          TENSORS: 4D | WEIGHT_NORM: L2
        </text>
        <text x="342" y="196" textAnchor="end" fill="#57CCF2" fontSize="8" fontFamily="JetBrains Mono, monospace">
          ALGO: BACKPROP_ADAM
        </text>
      </g>
    );
  }

  if (id === "unit2") {
    body = (
      <g>
        {/* Top HUD Telemetry */}
        <text x="18" y="48" fill="#57CCF2" fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="700" letterSpacing="0.4">
          CV2://FRAME_CAPTURE [LIVE]
        </text>
        <text x="342" y="48" textAnchor="end" fill="#FFD66D" fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="700" letterSpacing="0.4">
          KERNEL: 3x3_SOBEL
        </text>

        {/* Left Side: 3x3 Convolution Matrix Visualizer with sequential scan pulses */}
        <g transform="translate(18, 76)">
          <rect x="-4" y="-4" width="46" height="46" rx="6" fill="rgba(33,27,59,0.6)" stroke="rgba(87,204,242,0.3)" strokeWidth="1" />
          {[0, 1, 2].flatMap(r => [0, 1, 2].map(c => ({ r, c }))).map(({ r, c }, idx) => (
            <rect
              key={idx}
              className="art-matrix-cell"
              x={c * 12 + 2}
              y={r * 12 + 2}
              width="9"
              height="9"
              rx="2"
              fill={idx === 4 ? "#57CCF2" : idx % 2 === 0 ? "#9B87F5" : "rgba(155,135,245,0.4)"}
              style={{ animationDelay: `${(r * 3 + c) * 0.14}s` }}
            />
          ))}
          <text x="19" y="52" textAnchor="middle" fill="#57CCF2" fontSize="7.5" fontFamily="JetBrains Mono, monospace" fontWeight="600">
            CONV_3x3
          </text>
        </g>

        {/* Center: High-Tech Biometric Cyber Eye */}
        {/* Circular HUD Aperture with Rotating Radar Degree Ticks */}
        <g className="art-spin-radar">
          <circle cx="180" cy="116" r="62" fill="none" stroke="rgba(87,204,242,0.22)" strokeDasharray="3 6" />
          <circle cx="180" cy="116" r="48" fill="none" stroke="rgba(155,135,245,0.25)" strokeDasharray="2 4" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={180 + 58 * Math.cos(rad)}
                y1={116 + 58 * Math.sin(rad)}
                x2={180 + 64 * Math.cos(rad)}
                y2={116 + 64 * Math.sin(rad)}
                stroke="#57CCF2"
                strokeWidth="1.5"
              />
            );
          })}
        </g>

        {/* Eye Contour */}
        <path
          d="M72 116 Q180 44 288 116 Q180 188 72 116 Z"
          fill="#1C1838"
          stroke={g("a")}
          strokeWidth="3"
          filter={g("glow")}
        />
        <path
          d="M86 116 Q180 58 274 116 Q180 174 86 116 Z"
          fill="none"
          stroke="rgba(87,204,242,0.3)"
          strokeWidth="1"
        />

        {/* Multi-Layer Iris with Dilation */}
        <circle className="art-iris-pulse" cx="180" cy="116" r="40" fill={g("iris")} filter={g("glow")} />
        <circle cx="180" cy="116" r="32" fill="none" stroke="rgba(255,255,255,0.4)" strokeDasharray="2 4" />
        {/* Iris radial spokes */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={180 + 16 * Math.cos(rad)}
              y1={116 + 16 * Math.sin(rad)}
              x2={180 + 38 * Math.cos(rad)}
              y2={116 + 38 * Math.sin(rad)}
              stroke="rgba(87,204,242,0.4)"
              strokeWidth="1"
            />
          );
        })}
        {/* Dark pupil */}
        <circle cx="180" cy="116" r="16" fill="#140F2B" />
        {/* Specular Glint */}
        <circle cx="171" cy="107" r="5.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="190" cy="123" r="2" fill="#57CCF2" opacity="0.8" />

        {/* Laser Scanning Beam with Illuminated Sweep Cone */}
        <g clipPath={g("eyeclip")}>
          <polygon
            className="art-scan-beam"
            points="72,116 288,116 288,134 72,134"
            fill={g("laserGrad")}
          />
          <line
            className="art-scan"
            x1="72"
            x2="288"
            y1="116"
            y2="116"
            stroke="#57CCF2"
            strokeWidth="2.5"
            filter={g("glow")}
          />
        </g>

        {/* Precision Targeting Corner Reticles with Target Pulse */}
        <g className="art-reticle-pulse">
          <path
            d="M130 68 h-18 v18 M230 68 h18 v18 M130 164 h-18 v-18 M230 164 h18 v-18"
            fill="none"
            stroke="#FFD66D"
            strokeWidth="2.4"
            strokeLinecap="round"
            filter={g("glow")}
          />
          {/* Center Crosshair Target */}
          <line x1="180" y1="106" x2="180" y2="126" stroke="#FFD66D" strokeWidth="1.2" />
          <line x1="170" y1="116" x2="190" y2="116" stroke="#FFD66D" strokeWidth="1.2" />
        </g>

        {/* Right Side: Detection Tag with Live Beacon */}
        <g transform="translate(254, 76)">
          <rect width="88" height="20" rx="5" fill="rgba(21,17,45,0.85)" stroke="#57CCF2" strokeWidth="1.2" />
          <circle className="art-beacon" cx="12" cy="10" r="3" fill="#00E5FF" filter={g("glow")} />
          <text x="50" y="13.5" textAnchor="middle" fill="#57CCF2" fontSize="8" fontFamily="JetBrains Mono, monospace" fontWeight="700">
            DETECT: 99.8%
          </text>
        </g>

        {/* Bottom HUD */}
        <text x="18" y="196" fill="#57CCF2" fontSize="8" fontFamily="JetBrains Mono, monospace">
          FPS: 60.0 | RES: 1920x1080
        </text>
        <text x="342" y="196" textAnchor="end" fill="#9B87F5" fontSize="8" fontFamily="JetBrains Mono, monospace">
          TRACK_ID: #CAM_02
        </text>
      </g>
    );
  }

  if (id === "unit3") {
    body = (
      <g>
        {/* Top HUD Telemetry */}
        <text x="18" y="48" fill="#9B87F5" fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="700" letterSpacing="0.4">
          MODEL://DEEP_MLP_CLASSIFIER
        </text>

        {/* Floating Miniature Loss Convergence Curve */}
        <g transform="translate(248, 28)">
          <line x1="0" y1="24" x2="94" y2="24" stroke="rgba(155,135,245,0.3)" strokeWidth="1" />
          <line x1="0" y1="4" x2="0" y2="24" stroke="rgba(155,135,245,0.3)" strokeWidth="1" />
          {/* Curve decaying to zero */}
          <path d="M4 6 Q28 22 92 23" fill="none" stroke="#57CCF2" strokeWidth="2" filter={g("glow")} />
          <circle className="art-pulse-fast" cx="92" cy="23" r="3.5" fill="#FFD66D" filter={g("glow")} />
          <text x="92" y="0" textAnchor="end" fill="#FFD66D" fontSize="8" fontFamily="JetBrains Mono, monospace" fontWeight="600">
            LOSS: 0.012
          </text>
        </g>

        {/* Neural Network Edges with Flow Packets */}
        {U3_EDGES.map((e, idx) => (
          <line
            key={`e-${idx}`}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke={e.active ? "rgba(87,204,242,0.32)" : "rgba(155,135,245,0.18)"}
            strokeWidth={e.active ? "1.6" : "1"}
          />
        ))}
        {U3_EDGES.filter(e => e.active).map((e, idx) => (
          <line
            key={`ef-${idx}`}
            className="art-flow"
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke="#57CCF2"
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{ animationDelay: `${e.delay}s` }}
          />
        ))}

        {/* Layer Nodes with Firing Pulse */}
        {U3_LAYERS.map((layer, li) =>
          layer.nodes.map((y, ni) => {
            const isWinner = li === 3 && ni === 0;
            return (
              <g key={`n-${li}-${ni}`} className="art-neuron" style={{ animationDelay: `${li * 0.35 + ni * 0.12}s` }}>
                {/* Outer Glow Ring */}
                <circle
                  cx={layer.x}
                  cy={y}
                  r="10"
                  fill="#1C1838"
                  stroke={isWinner ? "#FFD66D" : li === 0 ? "#57CCF2" : "#9B87F5"}
                  strokeWidth="2.4"
                  filter={g("glow")}
                />
                {/* Inner Core */}
                <circle
                  cx={layer.x}
                  cy={y}
                  r={isWinner ? "5.5" : "4"}
                  fill={isWinner ? "#FFD66D" : li === 0 ? "#57CCF2" : "#9B87F5"}
                />
                {isWinner && (
                  <circle
                    className="art-ping"
                    cx={layer.x}
                    cy={y}
                    r="8"
                    fill="none"
                    stroke="#FFD66D"
                    strokeWidth="2"
                  />
                )}
              </g>
            );
          })
        )}

        {/* Layer Label Columns */}
        {U3_LAYERS.map((layer, idx) => (
          <text
            key={`lbl-${idx}`}
            x={layer.x}
            y="182"
            textAnchor="middle"
            fill={idx === 3 ? "#FFD66D" : "#7A7EA3"}
            fontSize="8"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            {layer.label}
          </text>
        ))}

        {/* Bottom HUD */}
        <text x="18" y="198" fill="#57CCF2" fontSize="8" fontFamily="JetBrains Mono, monospace">
          EPOCHS: 500/500 | ACC: 99.4%
        </text>
        <text x="342" y="198" textAnchor="end" fill="#FFD66D" fontSize="8" fontFamily="JetBrains Mono, monospace">
          OPTIMIZER: ADAM(1e-3)
        </text>
      </g>
    );
  }

  if (id === "unit4") {
    body = (
      <g>
        {/* Top HUD Telemetry */}
        <text x="18" y="48" fill="#FFD66D" fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="700" letterSpacing="0.4">
          STUDIO://PROJECT_PIPELINE
        </text>
        <text x="342" y="48" textAnchor="end" fill="#57CCF2" fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="700" letterSpacing="0.4">
          STAGE: 4/4 [DEPLOY]
        </text>

        {/* Circuit PCB Background Traces with Flowing Data */}
        <path d="M20 110 h60 l20 20 h20" fill="none" stroke="rgba(87,204,242,0.22)" strokeWidth="1.2" />
        <path className="art-flow" d="M20 110 h60 l20 20 h20" fill="none" stroke="#57CCF2" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M120 60 v-15 h40 l15 -15" fill="none" stroke="rgba(155,135,245,0.25)" strokeWidth="1.2" />
        <circle cx="20" cy="110" r="2.5" fill="#57CCF2" />
        <circle cx="175" cy="30" r="2.5" fill="#9B87F5" />

        {/* Primary Purple Gear - Full Group Smooth Rotation */}
        <g className="art-spin-gear1">
          <path d={GEAR_L} fill="rgba(155,135,245,0.22)" stroke="#9B87F5" strokeWidth="2.2" filter={g("glow")} />
          {/* 4 Weight-reduction lightening holes */}
          {[0, 90, 180, 270].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <circle
                key={i}
                cx={224 + 22 * Math.cos(rad)}
                cy={122 + 22 * Math.sin(rad)}
                r="7"
                fill="#16132F"
                stroke="rgba(155,135,245,0.5)"
                strokeWidth="1.2"
              />
            );
          })}
          <circle cx="224" cy="122" r="14" fill="#1C1838" stroke="#9B87F5" strokeWidth="2" />
          <circle cx="224" cy="122" r="5" fill="#FFD66D" />
        </g>

        {/* Secondary Cyan Gear - Interlocking Reverse Spin */}
        <g className="art-spin-gear2">
          <path d={GEAR_S} fill="rgba(87,204,242,0.22)" stroke="#57CCF2" strokeWidth="2.2" filter={g("glow")} />
          <circle cx="286" cy="78" r="9" fill="#1C1838" stroke="#57CCF2" strokeWidth="1.8" />
          <circle cx="286" cy="78" r="3.5" fill="#57CCF2" />
        </g>

        {/* Left Side: Innovation Lightbulb with AI Microchip */}
        {/* Shimmering Radial Rays */}
        {[-150, -120, -90, -60, -30, 180].map((deg, i) => {
          const r = (deg * Math.PI) / 180;
          return (
            <line
              key={i}
              className="art-ray-shimmer"
              x1={118 + 52 * Math.cos(r)}
              y1={114 + 52 * Math.sin(r)}
              x2={118 + 66 * Math.cos(r)}
              y2={114 + 66 * Math.sin(r)}
              stroke="#FFD66D"
              strokeWidth="2.8"
              strokeLinecap="round"
              filter={g("glow")}
              style={{ animationDelay: `${i * 0.28}s` }}
            />
          );
        })}

        {/* Glass Bulb Body with Breathing Pulse */}
        <circle className="art-pulse" cx="118" cy="114" r="44" fill={g("bulb")} stroke="#FFD66D" strokeWidth="2.6" filter={g("glow")} />

        {/* Central AI Processor Core with Fast Pulse */}
        <g className="art-pulse-fast">
          <rect x="101" y="97" width="34" height="34" rx="6" fill="#1C1838" stroke="#FFD66D" strokeWidth="2.4" filter={g("glow")} />
          {/* Processor Pins */}
          <path
            d="M109 97 v-6 M127 97 v-6 M109 131 v6 M127 131 v6 M101 105 h-6 M101 123 h-6 M135 105 h6 M135 123 h6"
            stroke="#FFD66D"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text x="118" y="119" textAnchor="middle" fontSize="13" fontFamily="JetBrains Mono, monospace" fontWeight="800" fill="#FFD66D">
            AI
          </text>
        </g>

        {/* Bulb Screw Base */}
        <rect x="103" y="158" width="30" height="9" rx="3" fill="#E6E8F5" stroke="#D6D0E6" strokeWidth="1" />
        <rect x="106" y="168" width="24" height="8" rx="3" fill="#C9C3EE" />

        {/* Sparkles */}
        <path className="art-shimmer" d="M42 66 l3 7 7 3 -7 3 -3 7 -3-7 -7-3 7-3z" fill="#57CCF2" filter={g("glow")} style={{ animationDelay: '0.3s' }} />
        <path className="art-shimmer" d="M52 168 l2.5 5.5 5.5 2.5 -5.5 2.5 -2.5 5.5 -2.5-5.5 -5.5-2.5 5.5-2.5z" fill="#FFD66D" filter={g("glow")} style={{ animationDelay: '1.2s' }} />

        {/* Bottom HUD */}
        <text x="18" y="198" fill="#57CCF2" fontSize="8" fontFamily="JetBrains Mono, monospace">
          RUNTIME: ONNX_FP16 | LATENCY: 8ms
        </text>
        <text x="342" y="198" textAnchor="end" fill="#9B87F5" fontSize="8" fontFamily="JetBrains Mono, monospace">
          STATUS: PRODUCTION_READY
        </text>
      </g>
    );
  }

  return (
    <svg viewBox="0 0 360 210" className="unit-art" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* Glow Filters */}
        <filter id={`${uid}glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id={`${uid}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6D4DD3" />
          <stop offset="60%" stopColor="#9B87F5" />
          <stop offset="100%" stopColor="#57CCF2" />
        </linearGradient>

        <linearGradient id={`${uid}laserGrad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#57CCF2" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#57CCF2" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={`${uid}shieldGrad`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2A2050" />
          <stop offset="60%" stopColor="#211B3B" />
          <stop offset="100%" stopColor="#18132D" />
        </linearGradient>

        <radialGradient id={`${uid}f`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#57CCF2" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#6D4DD3" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#16132F" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={`${uid}iris`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="45%" stopColor="#57CCF2" />
          <stop offset="75%" stopColor="#8C74C6" />
          <stop offset="100%" stopColor="#4C1D95" />
        </radialGradient>

        <radialGradient id={`${uid}bulb`} cx="45%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#FFF4D0" />
          <stop offset="65%" stopColor="#FFD66D" />
          <stop offset="100%" stopColor="#E09F20" />
        </radialGradient>

        <clipPath id={`${uid}eyeclip`}>
          <path d="M72 116 Q180 44 288 116 Q180 188 72 116 Z" />
        </clipPath>

        <pattern id={`${uid}dots`} width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(155,135,245,0.18)" />
        </pattern>
      </defs>

      {/* Cyber Space Dark Canvas */}
      <rect width="360" height="210" fill="#130F2B" />
      <rect width="360" height="210" fill={g("dots")} />
      {body}
    </svg>
  );
}

const unitById = id => UNITS.find(u => u.id === id);

function relTime(iso) {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso).getTime()) / 60000;
  if (diff < 1) return "เมื่อสักครู่";
  if (diff < 60) return `${Math.floor(diff)} นาทีที่แล้ว`;
  if (diff < 60 * 24) return `${Math.floor(diff / 60)} ชั่วโมงที่แล้ว`;
  if (diff < 60 * 24 * 7) return `${Math.floor(diff / 1440)} วันที่แล้ว`;
  return thaiDate(iso);
}


// โหมดสาธิต: ข้อมูลจำลอง 6 ห้อง ห้องละ 30 คน (สุ่มแบบคงที่ เปิดกี่ครั้งก็เหมือนเดิม)
function demoVisitStudents() {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const today = new Date();
  return COURSE.classrooms.flatMap((classroom, r) =>
    Array.from({ length: 30 }, () => {
      const keen = 0.15 + rnd() * 0.5 - r * 0.03;
      const days = [];
      for (let i = 59; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
        const school = d.getDay() > 0 && d.getDay() < 6;
        if (rnd() < keen * (school ? 1 : 0.25)) days.push(dayKey(d));
      }
      return { classroom, days };
    })
  );
}

function ClassVisitStatsCard() {
  const [students, setStudents] = useState(null);
  const [error, setError] = useState('');
  const [room, setRoom] = useState('all');
  const [hover, setHover] = useState(null);
  useEffect(() => {
    let alive = true;
    if (api.isDemo()) { setStudents(demoVisitStudents()); return undefined; }
    api.getVisitSummary()
      .then(r => {
        if (!alive) return;
        if (!r || !r.success) throw new Error((r && r.error) || 'โหลดข้อมูลไม่สำเร็จ');
        setStudents(r.students);
      })
      .catch(e => alive && setError(e.message || String(e)));
    return () => { alive = false; };
  }, []);

  const rooms = useMemo(() => [...new Set((students || []).map(s => s.classroom))].sort(), [students]);
  const s = useMemo(() => students && classVisitStats(room === 'all' ? students : students.filter(x => x.classroom === room)), [students, room]);
  const pct = n => (s && s.total ? Math.round((n / s.total) * 100) : 0);
  const shown = s && (hover || s.daily[s.daily.length - 1]);

  return (
    <section className="classroom-card visit-section" aria-label="สถิติการเข้าเรียนเว็บไซต์ของนักเรียนทั้งหมด">
      <div className="section-head-clean">
        <div>
          <h2 className="clean-section-title"><Icon name="users" size={22} />สถิติการเข้าเรียนเว็บไซต์ของนักเรียนทั้งหมด</h2>
          <p className="clean-section-desc">จำนวนนักเรียนที่เปิดเว็บไซต์ในแต่ละวัน · 30 วันล่าสุด</p>
        </div>
      </div>

      {!s ? (
        <p className="visit-empty">{error ? `โหลดข้อมูลไม่สำเร็จ: ${error}` : 'กำลังโหลดข้อมูล…'}</p>
      ) : (
        <>
          {rooms.length > 1 && (
            <div className="visit-rooms" role="tablist" aria-label="เลือกห้อง">
              {['all', ...rooms].map(r => (
                <button key={r} type="button" role="tab" aria-selected={room === r} className={room === r ? 'on' : ''} onClick={() => setRoom(r)}>
                  {r === 'all' ? 'ทุกห้อง' : r}
                </button>
              ))}
            </div>
          )}

          <dl className="visit-tiles">
            <div className="visit-tile"><dt><Icon name="users" size={15} />นักเรียนทั้งหมด</dt><dd>{s.total}<small>คน</small></dd></div>
            <div className="visit-tile"><dt><Icon name="check" size={15} />เข้าเรียนวันนี้</dt><dd>{s.today}<small>คน · {pct(s.today)}%</small></dd></div>
            <div className="visit-tile"><dt><Icon name="clock" size={15} />7 วันล่าสุด</dt><dd>{s.activeWeek}<small>คน · {pct(s.activeWeek)}%</small></dd></div>
            <div className="visit-tile"><dt><Icon name="chart" size={15} />เฉลี่ยต่อวัน</dt><dd>{s.avg}<small>คน</small></dd></div>
          </dl>

          <p className="visit-readout" aria-live="polite">
            {dayTh(shown.key)}{hover ? '' : ' (วันนี้)'} · <b>{shown.count}</b> คน
          </p>
          <div
            className="visit-bars"
            role="img"
            aria-label={`กราฟจำนวนนักเรียนที่เข้าเรียนรายวัน 30 วันล่าสุด เฉลี่ยวันละ ${s.avg} คน สูงสุด ${s.peak} คน`}
            onMouseLeave={() => setHover(null)}
          >
            <span className="visit-peak" aria-hidden="true">{s.peak} คน</span>
            {s.daily.map(d => (
              <span key={d.key} className={`visit-bar${hover?.key === d.key ? ' is-hover' : ''}`} onMouseEnter={() => setHover(d)}>
                <i style={{ height: `${s.peak ? (d.count / s.peak) * 100 : 0}%` }} />
              </span>
            ))}
          </div>
          <div className="visit-axis" aria-hidden="true">
            <span>{dayTh(s.daily[0].key)}</span>
            <span>วันนี้</span>
          </div>
        </>
      )}
    </section>
  );
}

function VisitStatsCard({ visitDays }) {
  const s = useMemo(() => visitStats(visitDays), [visitDays]);
  const tiles = [
    { icon: 'book', label: 'เข้าเรียนทั้งหมด', value: s.total },
    { icon: 'sparkle', label: 'ต่อเนื่องตอนนี้', value: s.streak },
    { icon: 'trophy', label: 'ต่อเนื่องสูงสุด', value: s.best },
    { icon: 'clock', label: 'เดือนนี้', value: s.month }
  ];
  return (
    <section className="classroom-card visit-section" aria-label="สถิติการเข้าเรียนเว็บไซต์ของฉัน">
      <div className="section-head-clean">
        <div>
          <h2 className="clean-section-title"><Icon name="user" size={22} />สถิติการเข้าเรียนเว็บไซต์ของฉัน</h2>
          <p className="clean-section-desc">
            {s.first ? `เริ่มเข้าเรียนเมื่อ ${dayTh(s.first)} · นับวันละ 1 ครั้งที่เปิดเว็บไซต์` : 'นับวันละ 1 ครั้งที่เปิดเว็บไซต์'}
          </p>
        </div>
      </div>

      <dl className="visit-tiles">
        {tiles.map(t => (
          <div key={t.label} className="visit-tile">
            <dt><Icon name={t.icon} size={15} />{t.label}</dt>
            <dd>{t.value}<small>วัน</small></dd>
          </div>
        ))}
      </dl>

      <VisitCalendar weeks={s.weeks} />
    </section>
  );
}

function continueTarget(summary, student) {
  const open = u => u && !unitLocked(u.id, student);
  const last0 = summary.lastVisited && unitById(summary.lastVisited.unitId);
  const last = open(last0) ? last0 : null;
  if (last && !summary.units[last.id].completed) return last;
  const next = UNITS.find(u => open(u) && summary.units[u.id].ready && !summary.units[u.id].completed);
  return next || last || UNITS[0];
}

function airaAdvice(summary, target) {
  const n = summary.completed;
  if (n === UNITS.length) return {
    mood: "cheer",
    text: "สุดยอดมาก! เธอเรียนครบทั้ง 4 หน่วยแล้ว เหรียญ AI Master เป็นของเธอ"
  };
  if (n > 0) return {
    mood: "cheer",
    text: `เยี่ยมเลย! เรียนครบแล้ว ${n} หน่วย ไปต่อที่หน่วยที่ ${target.no} ${target.titleEn} กันเถอะ`
  };
  if (summary.overall > 0) return {
    mood: "happy",
    text: `ตอนนี้ไปได้ ${summary.overall}% แล้ว เรียนต่อที่หน่วยที่ ${target.no} อีกนิดเดียวก็ได้เหรียญแรก`
  };
  if (summary.readyCount === 0) return summary.lastVisited ? {
    mood: "wink",
    text: "ครูกำลังเตรียมบทเรียนอยู่ ระหว่างนี้แวะดูภาพรวมของแต่ละหน่วยไว้ก่อนได้นะ"
  } : {
    mood: "happy",
    text: "ยินดีที่ได้เจอ! บทเรียนกำลังจะเปิดเร็ว ๆ นี้ ลองสำรวจหน่วยที่ 1 ก่อนได้เลย"
  };
  return {
    mood: "happy",
    text: "เริ่มจากหน่วยที่ 1 ก่อนนะ เรียนครบแต่ละหน่วยจะได้เหรียญตราสะสม"
  };
}

const MEDAL_ICON = {
  brain: "sparkle",
  eye: "eye",
  net: "cpu",
  bulb: "bulb",
  crown: "trophy"
};

// นับขึ้นจาก 0 ถึงค่าจริงตอนเปิดหน้า (ข้ามถ้าเครื่องตั้งค่าลดการเคลื่อนไหว)
function CountUp({ value, ms = 900, delay = 500 }) {
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [n, setN] = useState(reduce ? value : 0);
  useEffect(() => {
    if (reduce) { setN(value); return; }
    let raf, start;
    const t = setTimeout(() => {
      const step = now => {
        start ??= now;
        const p = Math.min((now - start) / ms, 1);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [value]);
  return n;
}

function HomePage() {
  const { student, summary, progress } = useApp();
  const lessonDone = (u, l) => !!progress[u.id]?.completedLessons?.includes(l.id);
  const { navigate } = useRoute();
  const target = continueTarget(summary, student);
  const advice = airaAdvice(summary, target);
  const hasHistory = !!summary.lastVisited;
  const unlocked = summary.achievements.filter(a => a.unlocked).length;
  const lq = summary.lastQuiz;

  const studentDisplayName = student?.displayName || student?.name || 'นักเรียน';

  return (
    <div className="classroom-home">
      {/* 1. เส้นทางวิชา: 4 หน่วยเป็นสถานีบนเส้นทางเดียว */}
      <section className="rt-hero" aria-labelledby="rt-title">
        <HeroCircuit />
        <div className="rt-head">
          <div className="rt-intro">
            <p className="rt-course">
              <span className="rt-room">ห้อง {student?.classroom || 'ม.5/1'}</span>
              <span>{COURSE.code} {COURSE.name}</span>
              <DemoBadge />
            </p>
            <h1 id="rt-title">
              สวัสดี {studentDisplayName}
              <span className="rt-sub">เส้นทางวิชา AI ของเธอ</span>
            </h1>
          </div>
          <aside className="rt-aira" aria-live="polite">
            <AIraBot mood={advice.mood} className="rt-aira-bot" title="AIra" />
            <p><b>AIra</b>{advice.text}</p>
          </aside>
        </div>

        <div className="rt-track" style={{ "--at": Math.max(0, UNITS.findIndex(u => u.id === target.id)) }}>
        <span className="rt-train" aria-hidden="true" data-unit={target.no} />
        <ol className="rt-line">
          {UNITS.map(u => {
            const su = summary.units[u.id] || { percent: 0 };
            const done = su.completed || su.percent === 100;
            const here = target.id === u.id && !done;
            const locked = unitLocked(u.id, student);
            const state = locked ? "เร็วๆ นี้" : done ? "เรียนครบแล้ว" : su.percent > 0 ? `เรียนไปแล้ว ${su.percent}%` : "ยังไม่เริ่ม";
            return (
              <li key={u.id} data-unit={u.no} className={locked ? "is-locked" : done ? "is-done" : here ? "is-here" : su.percent > 0 ? "is-started" : ""}>
                <button type="button" disabled={locked} onClick={() => navigate(u.id)} aria-current={here ? "step" : undefined}>
                  <span className="rt-stop" aria-hidden="true">{locked ? <Icon name="lock" size={16} /> : done ? <Icon name="check" size={18} /> : u.no}</span>
                  <span className="rt-name">หน่วยที่ {u.no} {u.title}</span>
                  <span className="rt-state">{state}</span>
                  {u.lessons?.length > 0 && (
                    <span className="rt-dots" aria-label={`เรียนแล้ว ${u.lessons.filter(l => lessonDone(u, l)).length} จาก ${u.lessons.length} บท`}>
                      {u.lessons.map(l => <i key={l.id} className={lessonDone(u, l) ? "on" : ""} title={l.title} />)}
                    </span>
                  )}
                  {here && <span className="rt-here">อยู่ตรงนี้</span>}
                </button>
              </li>
            );
          })}
        </ol>
        </div>

        <div className="rt-actions">
          <Button icon="play" className="rt-go" onClick={() => navigate(target.id)}>
            {hasHistory ? `เรียนต่อ หน่วยที่ ${target.no}` : "เริ่มเรียนหน่วยที่ 1"}
          </Button>
          <Button variant="ghost" icon="award" onClick={() => goToProgress("home", navigate)}>ดูเหรียญตรา</Button>
          {hasHistory && summary.lastVisited?.at && (
            <span className="rt-last"><Icon name="clock" size={14} /> เปิดล่าสุด {relTime(summary.lastVisited.at)}</span>
          )}
        </div>

        <dl className="rt-facts">
          <div><dt><Icon name="chart" size={16} />ความก้าวหน้ารวม</dt><dd><CountUp value={summary.overall} />%<small>{summary.doneItems || 0}/{summary.totalItems || 0} ภารกิจ</small></dd></div>
          <div><dt><Icon name="award" size={16} />หน่วยที่เรียนครบ</dt><dd><CountUp value={summary.completed} /><small>จาก {UNITS.length} หน่วย</small></dd></div>
          <div><dt><Icon name="puzzle" size={16} />กิจกรรมที่ทำเสร็จ</dt><dd><CountUp value={summary.activitiesDone} /><small>จาก {summary.activitiesTotal || 0} กิจกรรม</small></dd></div>
          <div><dt><Icon name="target" size={16} />แบบทดสอบล่าสุด</dt><dd>{lq ? <><CountUp value={lq.percent} />%</> : "–"}<small>{lq ? (lq.passed ? "ผ่านเกณฑ์" : "ยังไม่ผ่าน") : "ยังไม่ได้ทำ"}</small></dd></div>
        </dl>
      </section>

      {/* 3. การ์ดเมนูของแต่ละหน่วย 4 การ์ด (Units Grid 4 Cards Row) */}
      <section className="units-grid-section" aria-label="หน่วยการเรียนรู้ทั้งหมด">
        <div className="units-section-header">
          <div className="units-header-left">
            <h2 className="units-grid-title"><Icon name="map" size={22} />หน่วยการเรียนรู้</h2>
          </div>
          <div className="units-header-right">
            <span className="units-header-note">
              เลือกเรียนหน่วยใดก่อนก็ได้
            </span>
          </div>
        </div>

        <div className="classroom-units-grid">
          {UNITS.map(u => {
            const su = summary.units[u.id] || { percent: 0, visited: false, completed: false, ready: true };
            const isCompleted = su.completed || su.percent === 100;
            const isInProgress = !isCompleted && su.percent > 0;
            const isCurrent = target.id === u.id;
            const locked = unitLocked(u.id, student);
            const go = () => !locked && navigate(u.id);

            return (
              <article
                key={u.id}
                data-unit={u.no}
                className={`unit-menu-card ${isCurrent ? 'is-target' : ''} ${isCompleted ? 'is-done' : ''} ${locked ? 'is-locked' : ''}`}
              >
                <button type="button" className="unit-photo" disabled={locked} onClick={go} tabIndex={-1} aria-hidden="true">
                  <img src={UNIT_PHOTO[u.no]} alt="" width="760" height="424" loading="lazy" decoding="async" />
                  <span className={`unit-fx fx-${u.no}`}><i /><i /><i /><i /></span>
                </button>

                {/* Card Body */}
                <div className="unit-card-body">
                  <div className="unit-card-top">
                    <span className="unit-roundel" aria-hidden="true">{isCompleted ? <Icon name="check" size={16} /> : u.no}</span>
                    <span className={`unit-status-pill ${locked ? "status-pill-locked" : isCompleted ? "status-pill-done" : isInProgress ? "status-pill-progress" : "status-pill-ready"}`}>
                      {locked ? "เร็วๆ นี้" : isCompleted ? "เรียนครบแล้ว" : isInProgress ? `กำลังเรียน ${su.percent}%` : "พร้อมเรียน"}
                    </span>
                  </div>
                  <h3
                    className="unit-card-title"
                    onClick={go}
                    title={u.title}
                  >
                    {u.title}
                  </h3>
                  <p className="unit-card-desc">{u.desc}</p>
                  {u.lessons?.length > 0 && (() => {
                    const next = u.lessons.find(l => !lessonDone(u, l));
                    return (
                      <p className="unit-next">
                        {next ? <><span>บทถัดไป</span>{next.title}</> : isCompleted ? <span>เรียนครบทุกบทแล้ว</span> : <><span>ต่อไป</span>กิจกรรมและแบบทดสอบท้ายหน่วย</>}
                      </p>
                    );
                  })()}

                  {/* Quick Link Chip for Unit 2 if present */}
                  {u.id === 'unit2' && (
                    <div className="unit-quick-chips">
                      <a
                        href="unit2/setup.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="unit-quick-link"
                        title="คู่มือติดตั้ง VS Code, Python และ OpenCV 4"
                      >
                        <Icon name="cpu" size={12} /> ติดตั้ง VS Code, Python & OpenCV 4 ↗
                      </a>
                    </div>
                  )}

                  {/* Progress Bar Track */}
                  <div className="unit-card-progress">
                    <div className="unit-card-progress-track">
                      <div
                        className="unit-card-progress-fill"
                        style={{ width: `${su.percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Card Meta Row */}
                  <div className="unit-card-meta">
                    <span className="unit-meta-item">
                      <Icon name="book" size={12} />
                      {u.id === 'unit4'
                        ? `ทำเสร็จ ${su.percent === 100 ? 4 : Math.round((su.percent / 100) * 4)}/4 ขั้นตอนโครงงาน`
                        : `เรียนครบ ${(u.lessons || []).filter(l => lessonDone(u, l)).length}/${u.lessons?.length || 0} บทเรียน`
                      }
                    </span>
                    {su.visited && (
                      <span className="unit-meta-item meta-time">
                        <Icon name="clock" size={11} /> เปิดล่าสุด
                      </span>
                    )}
                  </div>

                  {/* Card Action Button */}
                  <Button
                    variant={isCurrent ? "primary" : isCompleted ? "secondary" : "primary"}
                    icon={locked ? "lock" : isCompleted ? "check" : isCurrent || isInProgress ? "play" : "arrowRight"}
                    disabled={locked}
                    onClick={go}
                    className="btn-unit-card-cta"
                  >
                    {locked ? "ยังไม่เปิดให้เรียน" : isCompleted ? "ทบทวนบทเรียน" : isInProgress || isCurrent ? "เรียนต่อ" : "เข้าสู่บทเรียน"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. แถวล่าง: เหรียญตรา + สรุปความก้าวหน้า + คลังไฟล์ (Bottom Row) */}
      <div className="classroom-bottom-row">
        {/* พื้นที่ "เหรียญตราเกียรติยศ" (Achievements) */}
        <section className="classroom-card ach-section" id="achievements" tabIndex={-1} aria-label="เหรียญตราเกียรติยศ">
          <div className="section-head-clean">
            <div>
              <h2 className="clean-section-title"><Icon name="trophy" size={22} />เหรียญตราและความสำเร็จ</h2>
              <p className="clean-section-desc">สะสมเหรียญตราเมื่อผ่านบทเรียนและทำกิจกรรมครบ</p>
            </div>
            <span className="ach-count-pill">
              ได้รับแล้ว {unlocked} / {ACHIEVEMENTS.length}
            </span>
          </div>

          <div className="medal-grid">
            {summary.achievements.map((a, i) => {
              // เหรียญหน่วย 1–4 ใช้ % ของหน่วยนั้น เหรียญสุดท้ายใช้ % รวม
              const pct = a.unlocked ? 100 : (UNITS[i] ? summary.units[UNITS[i].id]?.percent : summary.overall) || 0;
              return (
                <div
                  key={a.id}
                  className={`medal-card tone-${i + 1} ${a.unlocked ? 'is-unlocked' : 'is-locked'}`}
                  aria-label={`${a.name} ${a.unlocked ? 'ได้รับแล้ว' : `ยังไม่ได้รับ: ${a.rule} ความคืบหน้า ${pct}%`}`}
                >
                  <div className="medal-art" aria-hidden="true">
                    <span className="medal-ribbon" />
                    <span className="medal-disc">
                      <Icon name={MEDAL_ICON[a.art] || "award"} size={26} stroke={2.1} />
                    </span>
                    {!a.unlocked && <span className="medal-lock"><Icon name="lock" size={11} stroke={2.4} /></span>}
                  </div>
                  <strong className="medal-name">{a.name}</strong>
                  <span className="medal-th">{a.th}</span>
                  <span className="medal-rule">{a.rule}</span>
                  {a.unlocked ? (
                    <span className="medal-got"><Icon name="check" size={12} stroke={2.6} /> ได้รับแล้ว</span>
                  ) : (
                    <span className="medal-progress">
                      <span className="medal-bar"><i style={{ width: `${pct}%` }} /></span>
                      <b>{pct}%</b>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <ClassVisitStatsCard />
        <VisitStatsCard visitDays={progress.visitDays || []} />

      </div>
    </div>
  );
}

export default HomePage;
export { HomePage, UnitArt };
