import React, { useMemo } from 'react';
import { ACHIEVEMENTS, COURSE, QUIZ_PASS_PERCENT, UNITS, COURSE_RESOURCES } from '../data/courseData.js';
import { useApp } from '../context/AppContext.jsx';
import { useRoute } from '../context/RouteContext.jsx';
import { Icon, AIraBot, GlassCard, Button, Badge, DemoBadge, ProgressRing, ProgressBar } from '../components/UIPrimitives.jsx';
import { BRAIN_PATH, BRAIN_GYRI } from '../components/BackgroundEffects.jsx';
import { thaiDate } from '../components/UIHelpers.jsx';
import { goToProgress } from '../components/Navigation.jsx';

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

const CATEGORY_MAP = {
  unit1: 'AI FOUNDATIONS & ETHICS',
  unit2: 'COMPUTER VISION FUNDAMENTALS',
  unit3: 'MACHINE LEARNING APPLICATIONS',
  unit4: 'AI INNOVATION PROJECT'
};

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
        <text x="18" y="196" fill="#7A8699" fontSize="8" fontFamily="JetBrains Mono, monospace">
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
            fill={idx === 3 ? "#FFD66D" : "#7A8699"}
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
        <rect x="103" y="158" width="30" height="9" rx="3" fill="#E6E8F5" stroke="#CBD5E1" strokeWidth="1" />
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
          <stop offset="75%" stopColor="#8B5CF6" />
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

function continueTarget(summary) {
  const last = summary.lastVisited && unitById(summary.lastVisited.unitId);
  if (last && !summary.units[last.id].completed) return last;
  const next = UNITS.find(u => summary.units[u.id].ready && !summary.units[u.id].completed);
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

function HomePage() {
  const { student, summary } = useApp();
  const { navigate } = useRoute();
  const target = continueTarget(summary);
  const advice = airaAdvice(summary, target);
  const hasHistory = !!summary.lastVisited;
  const unlocked = summary.achievements.filter(a => a.unlocked).length;
  const lq = summary.lastQuiz;

  const studentDisplayName = student?.displayName || student?.name || 'นักเรียน';

  return (
    <div className="classroom-home">
      {/* 1. Hero Welcome Card */}
      <GlassCard pad={false} className="welcome">
        <div className="welcome-text">
          <div className="hero-meta">
            <Badge tone="cyan" dot>
              ห้อง {student?.classroom || 'ม.5/1'}
            </Badge>
            <Badge>
              {COURSE.code} {COURSE.name}
            </Badge>
            <DemoBadge />
          </div>

          <h1>
            Welcome Back, <span className="grad-text">{studentDisplayName}</span>
          </h1>

          <p className="welcome-th">
            พร้อมออกเดินทางสู่โลกแห่งปัญญาประดิษฐ์แล้วหรือยัง?
          </p>

          <div className="btn-inline">
            <Button
              className="btn-glow"
              icon="play"
              onClick={() => navigate(target.id)}
            >
              {hasHistory ? "เรียนต่อจากครั้งล่าสุด" : "เริ่มเรียนหน่วยที่ 1"}
            </Button>
            <Button
              variant="ghost"
              icon="award"
              className="btn-outline"
              onClick={() => goToProgress("home", navigate)}
            >
              ดูเหรียญตรา
            </Button>
          </div>

          {hasHistory && summary.lastVisited?.at && (
            <p className="hint">
              <Icon name="clock" size={13} /> ล่าสุด: หน่วยที่ {target.no} · {target.titleEn} · {relTime(summary.lastVisited.at)}
            </p>
          )}
        </div>

        <div className="welcome-aira">
          <p className="speech" role="status" aria-live="polite">
            <span className="speech-name">AIra</span>
            {advice.text}
          </p>
          <AIraBot mood={advice.mood} className="welcome-bot" title="AIra" />
        </div>
      </GlassCard>

      {/* 2. 4 Stat Cards */}
      <section className="stats4" aria-label="สรุปผลการเรียน">
        {/* Stat 1: ความก้าวหน้ารวม */}
        <GlassCard pad={false} className="stat">
          <span className="stat-ic">
            <Icon name="clock" size={22} />
          </span>
          <div>
            <div className="stat-num">
              {summary.overall}
              <small>%</small>
            </div>
            <div className="stat-lbl">
              ความก้าวหน้ารวม ({summary.doneItems || 0}/{summary.totalItems || 40} ภารกิจ)
            </div>
          </div>
        </GlassCard>

        {/* Stat 2: หน่วยที่เรียนครบ */}
        <GlassCard pad={false} className="stat">
          <span className="stat-ic">
            <Icon name="award" size={22} />
          </span>
          <div>
            <div className="stat-num">
              {summary.completed}
              <small>/{UNITS.length}</small>
            </div>
            <div className="stat-lbl">หน่วยที่เรียนครบ</div>
          </div>
        </GlassCard>

        {/* Stat 3: กิจกรรมที่ทำเสร็จ */}
        <GlassCard pad={false} className="stat">
          <span className="stat-ic">
            <Icon name="puzzle" size={22} />
          </span>
          <div>
            <div className="stat-num">
              {summary.activitiesDone}
              <small>/{summary.activitiesTotal || 17}</small>
            </div>
            <div className="stat-lbl">กิจกรรมที่ทำเสร็จ</div>
          </div>
        </GlassCard>

        {/* Stat 4: คะแนนทดสอบล่าสุด */}
        <GlassCard pad={false} className="stat">
          <span className="stat-ic">
            <Icon name="check" size={22} />
          </span>
          <div>
            {lq ? (
              <div className="stat-num">
                {lq.percent}
                <small>% ({lq.passed ? 'ผ่าน' : 'ไม่ผ่าน'})</small>
              </div>
            ) : (
              <div className="stat-empty">ยังไม่ได้ทำแบบทดสอบ</div>
            )}
            <div className="stat-lbl">คะแนนทดสอบล่าสุด</div>
          </div>
        </GlassCard>
      </section>

      {/* 3. การ์ดเมนูของแต่ละหน่วย 4 การ์ด (Units Grid 4 Cards Row) */}
      <section className="units-grid-section" aria-label="หน่วยการเรียนรู้ทั้งหมด">
        <div className="units-section-header">
          <div className="units-header-left">
            <h2 className="units-grid-title">หน่วยการเรียนรู้</h2>
          </div>
          <div className="units-header-right">
            <span className="units-header-note">
              เลือกเรียนหน่วยใดก่อนก็ได้ · เกณฑ์ผ่านแบบทดสอบ {QUIZ_PASS_PERCENT}% ทุกหน่วย
            </span>
          </div>
        </div>

        <div className="classroom-units-grid">
          {UNITS.map(u => {
            const su = summary.units[u.id] || { percent: 0, visited: false, completed: false, ready: true };
            const isCompleted = su.completed || su.percent === 100;
            const isInProgress = !isCompleted && su.percent > 0;
            const isCurrent = target.id === u.id;

            return (
              <article
                key={u.id}
                className={`unit-menu-card ${isCurrent ? 'is-target' : ''} ${isCompleted ? 'is-done' : ''}`}
              >
                {/* Visual Top Banner with Cyber HUD Graphics */}
                <div
                  className="unit-card-visual"
                  onClick={() => navigate(u.id)}
                  role="button"
                  tabIndex={0}
                  title={`คลิกเพื่อเข้าสู่ ${u.title}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(u.id); }}
                >
                  <UnitArt id={u.id} />
                  <div className="visual-top-overlay">
                    <span className="unit-pill-tag">UNIT 0{u.no}</span>
                    <span className={`unit-status-pill ${isCompleted ? 'status-pill-done' : isInProgress ? 'status-pill-progress' : 'status-pill-ready'}`}>
                      <span className="status-dot" />
                      {isCompleted ? 'เรียนครบแล้ว' : isInProgress ? `กำลังเรียน ${su.percent}%` : 'พร้อมเรียน'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="unit-card-body">
                  <div className="unit-cat-tag">{CATEGORY_MAP[u.id] || u.titleEn}</div>
                  <h3
                    className="unit-card-title"
                    onClick={() => navigate(u.id)}
                    title={u.title}
                  >
                    {u.title}
                  </h3>
                  <p className="unit-card-desc">{u.desc}</p>

                  {/* Quick Link Chip for Unit 2 if present */}
                  {u.id === 'unit2' && (
                    <div className="unit-quick-chips">
                      <a
                        href="/unit2/setup.html"
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
                        : `เรียนครบ ${isCompleted ? (u.lessons?.length || 0) : Math.round((su.percent / 100) * (u.lessons?.length || 0))}/${u.lessons?.length || 0} บทเรียน`
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
                    icon={isCompleted ? "check" : isCurrent || isInProgress ? "play" : "arrowRight"}
                    onClick={() => navigate(u.id)}
                    className="btn-unit-card-cta"
                  >
                    {isCompleted ? "ทบทวนบทเรียน" : isInProgress || isCurrent ? "เรียนต่อ" : "เข้าสู่บทเรียน"}
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
              <h2 className="clean-section-title">เหรียญตราและความสำเร็จ</h2>
              <p className="clean-section-desc">สะสมเหรียญตราเมื่อผ่านบทเรียนและทำกิจกรรมครบ</p>
            </div>
            <span className="ach-count-pill">
              ได้รับแล้ว {unlocked} / {ACHIEVEMENTS.length}
            </span>
          </div>

          <div className="ach-classroom-grid">
            {summary.achievements.map(a => (
              <div
                key={a.id}
                className={`ach-classroom-item ${a.unlocked ? 'is-unlocked' : 'is-locked'}`}
                aria-label={`${a.name} ${a.unlocked ? 'ได้รับแล้ว' : 'ยังไม่ได้รับ: ' + a.rule}`}
              >
                <div className="ach-medal-box">
                  <Icon name={MEDAL_ICON[a.art] || "award"} size={22} />
                </div>
                <div className="ach-item-content">
                  <strong className="ach-item-title">{a.name}</strong>
                  <span className="ach-item-th">{a.th}</span>
                  <span className="ach-item-status">
                    {a.unlocked ? (
                      <span className="ach-status-ok">
                        <Icon name="check" size={11} /> ได้รับแล้ว
                      </span>
                    ) : (
                      <span className="ach-status-lock">{a.rule}</span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* สรุปความก้าวหน้า & คลังไฟล์เอกสาร */}
        <div className="classroom-bottom-side">
          {/* การ์ด: สรุปความก้าวหน้า (Progress Summary) */}
          <section className="classroom-card summary-card" aria-label="สรุปความก้าวหน้า">
            <div className="side-card-header">
              <div className="side-card-title-group">
                <Icon name="award" size={16} />
                <h2 className="side-card-title">สรุปความก้าวหน้า</h2>
              </div>
              <button
                type="button"
                className="link-all-progress"
                onClick={() => goToProgress("home", navigate)}
              >
                ดูทั้งหมด →
              </button>
            </div>

            <div className="summary-ring-container">
              <ProgressRing
                value={summary.overall}
                size={74}
                label="ความก้าวหน้ารวม"
              />
              <div className="summary-ring-labels">
                <span className="summary-ring-title">ความก้าวหน้ารวม</span>
                <strong className="summary-ring-val">{summary.overall}%</strong>
                <span className="summary-ring-sub">
                  {summary.totalItems ? `${summary.doneItems}/${summary.totalItems} ภารกิจ` : "ยังไม่มีบทเรียนที่เปิด"}
                </span>
              </div>
            </div>

            <div className="summary-metrics-list">
              <div className="summary-metric-row">
                <span className="metric-name">
                  <Icon name="book" size={13} /> หน่วยที่เรียนครบ
                </span>
                <strong className="metric-val">{summary.completed} / {UNITS.length}</strong>
              </div>
              <div className="summary-metric-row">
                <span className="metric-name">
                  <Icon name="puzzle" size={13} /> กิจกรรมที่ทำสำเร็จ
                </span>
                <strong className="metric-val">
                  {summary.activitiesDone} {summary.activitiesTotal > 0 ? `/ ${summary.activitiesTotal}` : ''}
                </strong>
              </div>
              <div className="summary-metric-row">
                <span className="metric-name">
                  <Icon name="target" size={13} /> แบบทดสอบล่าสุด
                </span>
                <strong className="metric-val">
                  {lq ? `${lq.percent}% (${lq.passed ? 'ผ่าน' : 'ไม่ผ่าน'})` : 'ยังไม่มี'}
                </strong>
              </div>
            </div>
          </section>

          {/* การ์ด: คลังไฟล์และเอกสารประกอบการเรียน */}
          <section className="classroom-card resources-card" aria-label="คลังไฟล์และเอกสารประกอบการเรียน">
            <div className="side-card-header">
              <div className="side-card-title-group">
                <Icon name="sparkle" size={16} />
                <h2 className="side-card-title">คลังไฟล์และเอกสาร</h2>
              </div>
              <span className="task-summary-badge all-done">
                {COURSE_RESOURCES.length} ไฟล์
              </span>
            </div>
            <p className="side-card-desc">ไฟล์ตัวอย่างโค้ด ใบกิจกรรม และคู่มือติดตั้งสำหรับนักเรียน</p>

            <div className="classroom-res-list">
              {COURSE_RESOURCES.map(r => (
                <a
                  key={r.id}
                  href={r.url}
                  target={r.type === 'zip' ? '_self' : '_blank'}
                  download={r.type === 'zip' ? true : undefined}
                  rel="noopener noreferrer"
                  className="res-list-item"
                >
                  <div className="res-item-top">
                    <span className={`res-badge-pill res-${r.type}`}>{r.badge}</span>
                    <span className="res-unit-tag">หน่วยที่ {r.unitNo}</span>
                  </div>
                  <strong className="res-item-title">{r.title}</strong>
                  <p className="res-item-desc">{r.desc}</p>
                  <span className="res-action-hint">
                    {r.type === 'zip' ? 'ดาวน์โหลดไฟล์ .zip ↓' : 'เปิดดูในแท็บใหม่ ↗'}
                  </span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
export { HomePage, UnitArt };
