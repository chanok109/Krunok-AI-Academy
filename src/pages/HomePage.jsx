import React, { useMemo } from 'react';
import { ACHIEVEMENTS, COURSE, QUIZ_PASS_PERCENT, UNITS } from '../data/courseData.js';
import { useApp } from '../context/AppContext.jsx';
import { useRoute } from '../context/RouteContext.jsx';
import { Icon, AIraBot, GlassCard, Button, Badge, DemoBadge, ProgressRing, ProgressBar } from '../components/UIPrimitives.jsx';
import { BRAIN_PATH, BRAIN_GYRI } from '../components/BackgroundEffects.jsx';
import { thaiDate } from '../components/UIHelpers.jsx';

function gearPath(cx, cy, rOut, rIn, teeth) {
  const step = Math.PI * 2 / teeth;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    [[rIn, a], [rOut, a + step * 0.12], [rOut, a + step * 0.42], [rIn, a + step * 0.54]].forEach(([r, t], j) => {
      d += (i === 0 && j === 0 ? "M" : "L") + (cx + r * Math.cos(t)).toFixed(1) + " " + (cy + r * Math.sin(t)).toFixed(1) + " ";
    });
  }
  return d + "Z";
}
const PIXELS = Array.from({
  length: 48
}, (_, i) => ({
  x: 14 + i % 6 * 11,
  y: 46 + Math.floor(i / 6) * 11,
  o: (0.08 + i * 37 % 11 / 22).toFixed(2),
  c: i % 5 === 0
}));
const NN_LAYERS = [[64, [64, 100, 136]], [128, [46, 82, 118, 154]], [192, [46, 82, 118, 154]], [256, [82, 118]]];
const NN_EDGES = NN_LAYERS.slice(0, -1).flatMap(([x1, ys1], li) => ys1.flatMap(y1 => NN_LAYERS[li + 1][1].map(y2 => [x1, y1, NN_LAYERS[li + 1][0], y2])));
const GEAR = gearPath(214, 112, 50, 40, 12);
function UnitArt({
  id
}) {
  const uid = useMemo(() => "ua" + Math.random().toString(36).slice(2, 7), []);
  const g = n => `url(#${uid}${n})`;
  let body = null;
  if (id === "unit1") body = React.createElement(React.Fragment, null, [[46, 46], [276, 50], [36, 154], [284, 150], [160, 186], [160, 14]].map(([x, y], i) => React.createElement("g", {
    key: i
  }, React.createElement("line", {
    x1: x,
    y1: y,
    x2: "160",
    y2: "98",
    stroke: "rgba(87,204,242,.2)"
  }), React.createElement("line", {
    className: "art-flow",
    x1: x,
    y1: y,
    x2: "160",
    y2: "98",
    stroke: "#00E5FF",
    strokeWidth: "2",
    strokeLinecap: "round",
    style: {
      animationDelay: -i * 0.5 + "s"
    }
  }), React.createElement("circle", {
    cx: x,
    cy: y,
    r: "4",
    fill: i % 2 ? "#9B87F5" : "#00E5FF"
  }))), React.createElement("ellipse", {
    cx: "160",
    cy: "98",
    rx: "132",
    ry: "30",
    fill: "none",
    stroke: "rgba(155,135,245,.4)",
    strokeDasharray: "3 6",
    transform: "rotate(-10 160 98)"
  }), React.createElement("g", {
    className: "art-pulse",
    transform: "translate(160 96) scale(.74) translate(-240 -105)"
  }, React.createElement("path", {
    d: BRAIN_PATH,
    fill: g("f"),
    stroke: g("a"),
    strokeWidth: "3"
  }), BRAIN_GYRI.map((d, i) => React.createElement("path", {
    key: i,
    d: d,
    fill: "none",
    stroke: "rgba(183,168,255,.75)",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }))), React.createElement("g", {
    transform: "translate(232 112)"
  }, React.createElement("path", {
    d: "M22 0 L42 8 V24 C42 38 32 46 22 50 C12 46 2 38 2 24 V8 Z",
    fill: "#161336",
    stroke: "#FFD66D",
    strokeWidth: "2"
  }), React.createElement("path", {
    d: "M13 25 l6 6 11-12",
    fill: "none",
    stroke: "#FFD66D",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
  if (id === "unit2") body = React.createElement(React.Fragment, null, PIXELS.map((p, i) => React.createElement("rect", {
    key: i,
    x: p.x,
    y: p.y,
    width: "9",
    height: "9",
    rx: "1.5",
    fill: p.c ? "#00E5FF" : "#9B87F5",
    opacity: p.o
  })), React.createElement("path", {
    d: "M50 100 Q160 22 270 100 Q160 178 50 100Z",
    fill: "#0B1026",
    stroke: g("a"),
    strokeWidth: "2.6"
  }), React.createElement("circle", {
    cx: "160",
    cy: "100",
    r: "40",
    fill: g("iris")
  }), React.createElement("circle", {
    cx: "160",
    cy: "100",
    r: "31",
    fill: "none",
    stroke: "rgba(255,255,255,.3)",
    strokeDasharray: "2 5"
  }), React.createElement("circle", {
    cx: "160",
    cy: "100",
    r: "16",
    fill: "#0B1026"
  }), React.createElement("circle", {
    cx: "151",
    cy: "91",
    r: "6",
    fill: "#E9FDFF"
  }), React.createElement("g", {
    clipPath: g("eyeclip")
  }, React.createElement("line", {
    className: "art-scan",
    x1: "50",
    x2: "270",
    y1: "100",
    y2: "100",
    stroke: "#00E5FF",
    strokeWidth: "2",
    opacity: ".75"
  })), React.createElement("path", {
    d: "M118 52 h-14 v14 M202 52 h14 v14 M118 148 h-14 v-14 M202 148 h14 v-14",
    fill: "none",
    stroke: "#FFD66D",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }), React.createElement("g", {
    transform: "translate(206 26)"
  }, React.createElement("rect", {
    width: "92",
    height: "20",
    rx: "6",
    fill: "#FFD66D"
  }), React.createElement("text", {
    x: "46",
    y: "14",
    textAnchor: "middle",
    fontSize: "11",
    fontFamily: "JetBrains Mono, monospace",
    fontWeight: "700",
    fill: "#0B1026"
  }, "eye")));
  if (id === "unit3") body = React.createElement(React.Fragment, null, NN_EDGES.map(([x1, y1, x2, y2], i) => React.createElement("line", {
    key: i,
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    stroke: "rgba(155,135,245,.25)",
    strokeWidth: "1.2"
  })), NN_EDGES.filter((_, i) => i % 3 === 0).map(([x1, y1, x2, y2], i) => React.createElement("line", {
    key: "f" + i,
    className: "art-flow",
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    stroke: "#00E5FF",
    strokeWidth: "2",
    strokeLinecap: "round",
    style: {
      animationDelay: -i * 0.3 + "s"
    }
  })), NN_LAYERS.map(([x, ys], li) => ys.map(y => React.createElement("circle", {
    key: li + "-" + y,
    cx: x,
    cy: y,
    r: "9",
    fill: "#161336",
    stroke: li === 0 || li === 3 ? "#00E5FF" : "#9B87F5",
    strokeWidth: "2.4"
  }))), React.createElement("circle", {
    className: "art-pulse",
    cx: "256",
    cy: "82",
    r: "4.5",
    fill: "#FFD66D"
  }), React.createElement("text", {
    x: "64",
    y: "176",
    textAnchor: "middle",
    fontSize: "10",
    fontFamily: "JetBrains Mono, monospace",
    fill: "#7A7FA0"
  }, "input"), React.createElement("text", {
    x: "160",
    y: "186",
    textAnchor: "middle",
    fontSize: "10",
    fontFamily: "JetBrains Mono, monospace",
    fill: "#7A7FA0"
  }, "hidden"), React.createElement("text", {
    x: "256",
    y: "152",
    textAnchor: "middle",
    fontSize: "10",
    fontFamily: "JetBrains Mono, monospace",
    fill: "#7A7FA0"
  }, "output"));
  if (id === "unit4") body = React.createElement(React.Fragment, null, React.createElement("path", {
    className: "art-spin",
    d: GEAR,
    fill: "rgba(155,135,245,.16)",
    stroke: "#9B87F5",
    strokeWidth: "2"
  }), React.createElement("circle", {
    cx: "214",
    cy: "112",
    r: "16",
    fill: "#0B1026",
    stroke: "#9B87F5",
    strokeWidth: "2"
  }), [-150, -120, -90, -60, -30, 180].map((deg, i) => {
    const r = deg * Math.PI / 180;
    return React.createElement("line", {
      key: i,
      x1: 130 + 58 * Math.cos(r),
      y1: 84 + 58 * Math.sin(r),
      x2: 130 + 72 * Math.cos(r),
      y2: 84 + 72 * Math.sin(r),
      stroke: "#FFD66D",
      strokeWidth: "3",
      strokeLinecap: "round"
    });
  }), React.createElement("circle", {
    className: "art-pulse",
    cx: "130",
    cy: "84",
    r: "46",
    fill: g("bulb"),
    stroke: "#FFD66D",
    strokeWidth: "2.4"
  }), React.createElement("rect", {
    x: "116",
    y: "70",
    width: "28",
    height: "28",
    rx: "5",
    fill: "none",
    stroke: "#0B1026",
    strokeWidth: "2.6"
  }), React.createElement("path", {
    d: "M123 70 v-7 M137 70 v-7 M123 98 v7 M137 98 v7 M116 77 h-7 M116 91 h-7 M144 77 h7 M144 91 h7",
    stroke: "#0B1026",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }), React.createElement("text", {
    x: "130",
    y: "89",
    textAnchor: "middle",
    fontSize: "11",
    fontFamily: "JetBrains Mono, monospace",
    fontWeight: "700",
    fill: "#0B1026"
  }, "AI"), React.createElement("rect", {
    x: "114",
    y: "130",
    width: "32",
    height: "10",
    rx: "3",
    fill: "#E6E8F5"
  }), React.createElement("rect", {
    x: "117",
    y: "142",
    width: "26",
    height: "9",
    rx: "3",
    fill: "#C9C3EE"
  }), React.createElement("path", {
    d: "M262 36 l3 7 7 3 -7 3 -3 7 -3-7 -7-3 7-3z",
    fill: "#00E5FF"
  }), React.createElement("path", {
    d: "M50 150 l2.4 5.6 5.6 2.4 -5.6 2.4 -2.4 5.6 -2.4-5.6 -5.6-2.4 5.6-2.4z",
    fill: "#FFD66D"
  }));
  return React.createElement("svg", {
    viewBox: "0 0 320 200",
    className: "unit-art",
    "aria-hidden": "true",
    preserveAspectRatio: "xMidYMid meet"
  }, React.createElement("defs", null, React.createElement("linearGradient", {
    id: uid + "a",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: "#9B87F5"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: "#00E5FF"
  })), React.createElement("radialGradient", {
    id: uid + "f",
    cx: "50%",
    cy: "45%",
    r: "60%"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: "#57CCF2",
    stopOpacity: ".4"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: "#9B87F5",
    stopOpacity: ".05"
  })), React.createElement("radialGradient", {
    id: uid + "iris",
    cx: "50%",
    cy: "50%",
    r: "50%"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: "#00E5FF"
  }), React.createElement("stop", {
    offset: ".6",
    stopColor: "#57CCF2"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: "#6A55D8"
  })), React.createElement("radialGradient", {
    id: uid + "bulb",
    cx: "45%",
    cy: "38%",
    r: "62%"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: "#FFF6D6"
  }), React.createElement("stop", {
    offset: ".55",
    stopColor: "#FFD66D"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: "#E0A93C"
  })), React.createElement("clipPath", {
    id: uid + "eyeclip"
  }, React.createElement("path", {
    d: "M50 100 Q160 22 270 100 Q160 178 50 100Z"
  })), React.createElement("pattern", {
    id: uid + "dots",
    width: "16",
    height: "16",
    patternUnits: "userSpaceOnUse"
  }, React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1",
    fill: "rgba(155,135,245,.22)"
  }))), React.createElement("rect", {
    width: "320",
    height: "200",
    fill: g("dots")
  }), body);
}
const unitById = id => UNITS.find(u => u.id === id);
const pad2 = n => String(n).padStart(2, "0");
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
const lessonText = (su, u) => su.lessonsTotal ? u && u.id === "unit4" ? `ทำเสร็จ ${su.lessonsDone}/${su.lessonsTotal} ขั้นตอนโครงงาน` : `เรียนครบ ${su.lessonsDone}/${su.lessonsTotal} บทเรียน` : "บทเรียนยังไม่เปิด";
function UnitStatusBadge({
  su
}) {
  if (su.completed) return React.createElement(Badge, {
    tone: "ok",
    dot: true
  }, "\u0E40\u0E23\u0E35\u0E22\u0E19\u0E04\u0E23\u0E1A\u0E41\u0E25\u0E49\u0E27");
  if (su.ready && su.percent > 0) return React.createElement(Badge, {
    tone: "cyan",
    dot: true
  }, "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E23\u0E35\u0E22\u0E19");
  if (su.ready) return React.createElement(Badge, {
    dot: true
  }, "\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E40\u0E23\u0E35\u0E22\u0E19");
  return React.createElement(Badge, {
    dot: true
  }, "\u0E23\u0E2D\u0E40\u0E1B\u0E34\u0E14\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E2B\u0E32");
}
function StatIcon({
  name
}) {
  return React.createElement("span", {
    className: "stat-ic"
  }, React.createElement(Icon, {
    name: name,
    size: 22
  }));
}
const MEDAL_ICON = {
  brain: "sparkle",
  eye: "eye",
  net: "cpu",
  bulb: "bulb",
  crown: "trophy"
};
function HomePage() {
  const {
    student,
    summary,
    progress
  } = useApp();
  const {
    navigate
  } = useRoute();
  const target = continueTarget(summary);
  const advice = airaAdvice(summary, target);
  const hasHistory = !!summary.lastVisited;
  const tsu = summary.units[target.id];
  const unlocked = summary.achievements.filter(a => a.unlocked).length;
  const lq = summary.lastQuiz;
  return React.createElement(React.Fragment, null, React.createElement(GlassCard, {
    pad: false,
    className: "welcome"
  }, React.createElement("div", {
    className: "welcome-text"
  }, React.createElement("div", {
    className: "hero-meta"
  }, React.createElement(Badge, {
    tone: "cyan",
    dot: true
  }, "\u0E2B\u0E49\u0E2D\u0E07 ", student.classroom), React.createElement(Badge, null, COURSE.code, " ", COURSE.name), React.createElement(DemoBadge, null)), React.createElement("h1", null, "Welcome Back, ", React.createElement("span", {
    className: "grad-text"
  }, student.displayName)), React.createElement("p", {
    className: "welcome-th"
  }, "\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E2D\u0E2D\u0E01\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07\u0E2A\u0E39\u0E48\u0E42\u0E25\u0E01\u0E41\u0E2B\u0E48\u0E07\u0E1B\u0E31\u0E0D\u0E0D\u0E32\u0E1B\u0E23\u0E30\u0E14\u0E34\u0E29\u0E10\u0E4C\u0E41\u0E25\u0E49\u0E27\u0E2B\u0E23\u0E37\u0E2D\u0E22\u0E31\u0E07?"), React.createElement("div", {
    className: "btn-inline"
  }, React.createElement(Button, {
    className: "btn-glow",
    icon: "play",
    onClick: () => navigate(target.id)
  }, hasHistory ? "เรียนต่อจากครั้งล่าสุด" : "เริ่มเรียนหน่วยที่ 1"), React.createElement(Button, {
    variant: "ghost",
    icon: "chart",
    onClick: () => goToProgress("home", navigate)
  }, "\u0E14\u0E39\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32")), hasHistory && React.createElement("p", {
    className: "hint"
  }, "\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14: \u0E2B\u0E19\u0E48\u0E27\u0E22\u0E17\u0E35\u0E48 ", unitById(summary.lastVisited.unitId).no, " \xB7 ", unitById(summary.lastVisited.unitId).titleEn, " \xB7 ", relTime(summary.lastVisited.at))), React.createElement("div", {
    className: "welcome-aira"
  }, React.createElement("p", {
    className: "speech",
    role: "status",
    "aria-live": "polite"
  }, React.createElement("span", {
    className: "speech-name"
  }, "AIra"), advice.text), React.createElement(AIraBot, {
    mood: advice.mood,
    className: "welcome-bot",
    title: "AIra"
  }))), React.createElement("section", {
    className: "stats4",
    "aria-label": "\u0E2A\u0E23\u0E38\u0E1B\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19"
  }, React.createElement(GlassCard, {
    pad: false,
    className: "stat"
  }, React.createElement(ProgressRing, {
    value: summary.overall,
    size: 62,
    label: "\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E23\u0E27\u0E21"
  }), React.createElement("div", null, React.createElement("div", {
    className: "stat-lbl"
  }, "\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E23\u0E27\u0E21"), React.createElement("div", {
    className: "stat-sub"
  }, summary.totalItems ? `${summary.doneItems}/${summary.totalItems} ภารกิจ` : "ยังไม่มีบทเรียนที่เปิด"))), React.createElement(GlassCard, {
    pad: false,
    className: "stat"
  }, React.createElement(StatIcon, {
    name: "award"
  }), React.createElement("div", null, React.createElement("div", {
    className: "stat-num"
  }, summary.completed, React.createElement("small", null, "/", UNITS.length)), React.createElement("div", {
    className: "stat-lbl"
  }, "\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E17\u0E35\u0E48\u0E40\u0E23\u0E35\u0E22\u0E19\u0E04\u0E23\u0E1A"))), React.createElement(GlassCard, {
    pad: false,
    className: "stat"
  }, React.createElement(StatIcon, {
    name: "puzzle"
  }), React.createElement("div", null, React.createElement("div", {
    className: "stat-num"
  }, summary.activitiesDone, summary.activitiesTotal > 0 && React.createElement("small", null, "/", summary.activitiesTotal)), React.createElement("div", {
    className: "stat-lbl"
  }, "\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21\u0E17\u0E35\u0E48\u0E17\u0E33\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08"), !summary.activitiesTotal && React.createElement("div", {
    className: "stat-sub"
  }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21\u0E17\u0E35\u0E48\u0E40\u0E1B\u0E34\u0E14"))), React.createElement(GlassCard, {
    pad: false,
    className: "stat"
  }, React.createElement(StatIcon, {
    name: "target"
  }), lq ? React.createElement("div", null, React.createElement("div", {
    className: "stat-num"
  }, lq.percent, React.createElement("small", null, "%")), React.createElement("div", {
    className: "stat-lbl"
  }, "\u0E41\u0E1A\u0E1A\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14"), React.createElement("div", {
    className: "stat-sub"
  }, "\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E17\u0E35\u0E48 ", unitById(lq.unitId).no, " \xB7 ", lq.correct, "/", lq.total, " \u0E02\u0E49\u0E2D \xB7 ", lq.passed ? "ผ่าน" : "ยังไม่ผ่าน")) : React.createElement("div", null, React.createElement("div", {
    className: "stat-empty"
  }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E17\u0E33\u0E41\u0E1A\u0E1A\u0E17\u0E14\u0E2A\u0E2D\u0E1A"), React.createElement("div", {
    className: "stat-lbl"
  }, "\u0E41\u0E1A\u0E1A\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14")))), React.createElement("section", {
    style: {
      display: "grid",
      gap: 16
    },
    "aria-labelledby": "units-title"
  }, React.createElement("div", {
    className: "section-title"
  }, React.createElement("h2", {
    id: "units-title"
  }, "\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49"), React.createElement("span", {
    className: "hint"
  }, "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E23\u0E35\u0E22\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E43\u0E14\u0E01\u0E48\u0E2D\u0E19\u0E01\u0E47\u0E44\u0E14\u0E49 \xB7 \u0E40\u0E01\u0E13\u0E11\u0E4C\u0E1C\u0E48\u0E32\u0E19\u0E41\u0E1A\u0E1A\u0E17\u0E14\u0E2A\u0E2D\u0E1A ", QUIZ_PASS_PERCENT, "% \u0E17\u0E38\u0E01\u0E2B\u0E19\u0E48\u0E27\u0E22")), React.createElement("div", {
    className: "ucards"
  }, UNITS.map(u => {
    const su = summary.units[u.id];
    return React.createElement("article", {
      key: u.id,
      className: "glass ucard",
      "aria-labelledby": u.id + "-h"
    }, React.createElement("div", {
      className: "ucard-art"
    }, React.createElement(UnitArt, {
      id: u.id
    }), React.createElement("span", {
      className: "ucard-no"
    }, "UNIT ", pad2(u.no)), React.createElement("span", {
      className: "ucard-status"
    }, React.createElement(UnitStatusBadge, {
      su: su
    }))), React.createElement("div", {
      className: "ucard-body"
    }, React.createElement("span", {
      className: "ucard-en"
    }, u.titleEn), React.createElement("h3", {
      id: u.id + "-h"
    }, u.title), React.createElement("p", null, u.desc), React.createElement("div", {
      className: "ucard-progress"
    }, React.createElement(ProgressBar, {
      value: su.percent,
      label: `ความก้าวหน้าหน่วยที่ ${u.no}`
    }), React.createElement("span", {
      className: "mono"
    }, su.percent, "%")), React.createElement("div", {
      className: "ucard-meta"
    }, React.createElement("span", null, React.createElement(Icon, {
      name: "book",
      size: 14
    }), lessonText(su, u)), su.visited && React.createElement("span", null, React.createElement(Icon, {
      name: "clock",
      size: 14
    }), "\u0E40\u0E1B\u0E34\u0E14\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14 ", relTime(su.visitedAt))), React.createElement(Button, {
      icon: su.visited ? "play" : "login",
      onClick: () => navigate(u.id),
      "aria-label": `${su.visited ? "เรียนต่อ" : "เข้าสู่บทเรียน"} หน่วยที่ ${u.no}`
    }, su.visited ? "เรียนต่อ" : "เข้าสู่บทเรียน")));
  }))), React.createElement("div", {
    className: "home-split"
  }, React.createElement(GlassCard, {
    className: "continue",
    "aria-labelledby": "cont-title"
  }, React.createElement("div", {
    className: "section-title"
  }, React.createElement("h2", {
    id: "cont-title"
  }, "\u0E40\u0E23\u0E35\u0E22\u0E19\u0E15\u0E48\u0E2D"), hasHistory && React.createElement("span", {
    className: "hint"
  }, "\u0E40\u0E1B\u0E34\u0E14\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14 ", relTime(summary.lastVisited.at))), React.createElement("div", {
    className: "continue-row"
  }, React.createElement("div", {
    className: "continue-art"
  }, React.createElement(UnitArt, {
    id: target.id
  })), React.createElement("div", {
    style: {
      display: "grid",
      gap: 8,
      minWidth: 0
    }
  }, React.createElement("span", {
    className: "eyebrow"
  }, "UNIT ", pad2(target.no)), React.createElement("h3", {
    style: {
      fontSize: 18
    }
  }, target.titleEn), React.createElement("p", {
    style: {
      color: "var(--muted)",
      fontSize: 14
    }
  }, target.title), React.createElement("div", {
    className: "ucard-progress"
  }, React.createElement(ProgressBar, {
    value: tsu.percent,
    label: "\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E19\u0E35\u0E49"
  }), React.createElement("span", {
    className: "mono"
  }, tsu.percent, "%")), React.createElement("span", {
    className: "hint"
  }, hasHistory ? lessonText(tsu, target) : "ยังไม่เคยเปิดบทเรียน เริ่มจากหน่วยแรกได้เลย"), React.createElement(Button, {
    icon: "play",
    onClick: () => navigate(target.id),
    style: {
      justifySelf: "start"
    }
  }, hasHistory ? "เรียนต่อจากครั้งล่าสุด" : "เริ่มเรียน")))), React.createElement(GlassCard, {
    className: "overview",
    "aria-labelledby": "ov-title"
  }, React.createElement("div", {
    className: "section-title"
  }, React.createElement("h2", {
    id: "ov-title"
  }, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E23\u0E32\u0E22\u0E27\u0E34\u0E0A\u0E32")), React.createElement("dl", {
    className: "facts"
  }, React.createElement("div", null, React.createElement("dt", null, "\u0E23\u0E2B\u0E31\u0E2A\u0E27\u0E34\u0E0A\u0E32"), React.createElement("dd", {
    className: "mono"
  }, COURSE.code)), React.createElement("div", null, React.createElement("dt", null, "\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E0A\u0E31\u0E49\u0E19"), React.createElement("dd", null, COURSE.levelShort)), React.createElement("div", {
    className: "wide"
  }, React.createElement("dt", null, "\u0E0A\u0E37\u0E48\u0E2D\u0E27\u0E34\u0E0A\u0E32"), React.createElement("dd", null, COURSE.name)), React.createElement("div", null, React.createElement("dt", null, "\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E01\u0E34\u0E15"), React.createElement("dd", null, React.createElement("span", {
    className: "mono"
  }, COURSE.credits), " \u0E2B\u0E19\u0E48\u0E27\u0E22\u0E01\u0E34\u0E15")), React.createElement("div", null, React.createElement("dt", null, "\u0E40\u0E27\u0E25\u0E32\u0E40\u0E23\u0E35\u0E22\u0E19"), React.createElement("dd", null, React.createElement("span", {
    className: "mono"
  }, COURSE.periodsPerWeek), " \u0E04\u0E32\u0E1A/\u0E2A\u0E31\u0E1B\u0E14\u0E32\u0E2B\u0E4C")), React.createElement("div", {
    className: "wide"
  }, React.createElement("dt", null, "\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49"), React.createElement("dd", null, React.createElement("span", {
    className: "mono"
  }, UNITS.length), " \u0E2B\u0E19\u0E48\u0E27\u0E22"))), React.createElement("p", {
    className: "hint"
  }, COURSE.term, " \xB7 ", COURSE.school))), React.createElement("section", {
    id: "my-progress",
    tabIndex: -1,
    "aria-labelledby": "mp-title"
  }, React.createElement("div", {
    className: "section-title"
  }, React.createElement("h2", {
    id: "mp-title"
  }, "My Progress"), React.createElement("span", {
    className: "hint"
  }, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E08\u0E23\u0E34\u0E07\u0E08\u0E32\u0E01\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E19\u0E35\u0E49", progress.updatedAt ? ` · อัปเดต ${relTime(progress.updatedAt)}` : "")), React.createElement("div", {
    className: "mp-grid"
  }, React.createElement(GlassCard, {
    className: "mp-list",
    "aria-label": "\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E23\u0E32\u0E22\u0E2B\u0E19\u0E48\u0E27\u0E22"
  }, UNITS.map(u => {
    const su = summary.units[u.id];
    return React.createElement("div", {
      className: "mp-row",
      key: u.id
    }, React.createElement("span", {
      className: "side-num"
    }, u.no), React.createElement("div", {
      className: "mp-main"
    }, React.createElement("div", {
      className: "mp-head"
    }, React.createElement("strong", null, u.titleEn), React.createElement("span", {
      className: "mono"
    }, su.percent, "%")), React.createElement(ProgressBar, {
      value: su.percent,
      label: `หน่วยที่ ${u.no}`
    }), React.createElement("div", {
      className: "mp-meta"
    }, React.createElement("span", null, su.lessonsTotal ? `${u.id === "unit4" ? "ขั้นตอนโครงงาน" : "บทเรียน"} ${su.lessonsDone}/${su.lessonsTotal}` : "บทเรียนยังไม่เปิด"), React.createElement("span", null, u.id === "unit4" ? su.activitiesDone ? "ประเมินตนเองแล้ว" : "ยังไม่ได้ประเมินตนเอง" : su.activitiesTotal ? `กิจกรรม/Lab ${su.activitiesDone}/${su.activitiesTotal}` : "กิจกรรมยังไม่เปิด"), React.createElement("span", null, !u.quiz ? "ประเมินด้วย Rubric 20 คะแนน" : su.quizBest ? `แบบทดสอบดีที่สุด ${su.quizBest.correct}/${su.quizBest.total} (${su.quizBest.percent}%)` : "ยังไม่ได้ทำแบบทดสอบ"))));
  })), React.createElement(GlassCard, {
    "aria-labelledby": "ach-title",
    style: {
      display: "grid",
      gap: 14,
      alignContent: "start"
    }
  }, React.createElement("div", {
    className: "section-title"
  }, React.createElement("h3", {
    id: "ach-title",
    style: {
      fontSize: 18
    }
  }, "\u0E40\u0E2B\u0E23\u0E35\u0E22\u0E0D\u0E15\u0E23\u0E32"), React.createElement("span", {
    className: "mono hint"
  }, unlocked, "/", ACHIEVEMENTS.length)), React.createElement("div", {
    className: "badges"
  }, summary.achievements.map(a => React.createElement("div", {
    key: a.id,
    className: "ach " + (a.unlocked ? "on" : "off"),
    "aria-label": `${a.name} ${a.unlocked ? "ได้รับแล้ว" : "ยังไม่ได้รับ: " + a.rule}`
  }, React.createElement("span", {
    className: "medal-wrap"
  }, React.createElement("span", {
    className: "medal"
  }, React.createElement(Icon, {
    name: MEDAL_ICON[a.art],
    size: 24
  }))), React.createElement("strong", null, a.name), React.createElement("small", null, a.th), React.createElement("span", {
    className: "ach-rule"
  }, a.unlocked ? React.createElement(React.Fragment, null, React.createElement(Icon, {
    name: "check",
    size: 12
  }), "\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E41\u0E25\u0E49\u0E27") : React.createElement(React.Fragment, null, React.createElement(Icon, {
    name: "lock",
    size: 12
  }), a.rule)))))))));
}


export default HomePage;
export { HomePage, UnitArt };
