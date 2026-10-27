import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { COURSE } from '../data/courseData.js';
import { useApp } from '../context/AppContext.jsx';
import { useRoute } from '../context/RouteContext.jsx';
import { Icon, AIraBot, GlassCard, Button, Badge, DemoBadge, ProgressRing, ProgressBar } from '../components/UIPrimitives.jsx';
import { AiraTip, Callout, Feedback, FlipCard, Accordion, Celebrate, Modal } from '../components/UIHelpers.jsx';
import {
  U4_OBJECTIVES,
  U4_STEPS,
  IDEAS,
  TOOLS4,
  DATA_CHECK,
  BUILD_CHECK,
  PLAN_FIELDS,
  TEST_FIELDS,
  PRESENT_FIELDS,
  RUBRIC,
  LEVELS,
  SHOWCASE,
  STATE_LABEL,
  STATE_TH
} from '../data/unit4Data.js';

function ShowArt({
  kind
}) {
  const C = {
    bin: "#5BE3A8",
    pose: "#00E5FF",
    fruit: "#FFD66D",
    hand: "#9B87F5",
    detect: "#57CCF2",
    leaf: "#5BE3A8"
  }[kind];
  return React.createElement("svg", {
    viewBox: "0 0 200 110",
    className: "show-art",
    "aria-hidden": "true"
  }, React.createElement("rect", {
    width: "200",
    height: "110",
    fill: "#0E1430"
  }), React.createElement("g", {
    opacity: ".25",
    stroke: "#9B87F5"
  }, [20, 40, 60, 80, 100].map(y => React.createElement("line", {
    key: y,
    x1: "0",
    x2: "200",
    y1: y,
    y2: y
  }))), kind === "bin" && React.createElement("g", null, React.createElement("rect", {
    x: "40",
    y: "40",
    width: "34",
    height: "50",
    rx: "5",
    fill: "#5BE3A8"
  }), React.createElement("rect", {
    x: "84",
    y: "40",
    width: "34",
    height: "50",
    rx: "5",
    fill: "#57CCF2"
  }), React.createElement("rect", {
    x: "128",
    y: "40",
    width: "34",
    height: "50",
    rx: "5",
    fill: "#FFD66D"
  }), React.createElement("rect", {
    x: "36",
    y: "34",
    width: "42",
    height: "8",
    rx: "3",
    fill: "#F4F6FB"
  }), React.createElement("rect", {
    x: "80",
    y: "34",
    width: "42",
    height: "8",
    rx: "3",
    fill: "#F4F6FB"
  }), React.createElement("rect", {
    x: "124",
    y: "34",
    width: "42",
    height: "8",
    rx: "3",
    fill: "#F4F6FB"
  }), React.createElement("path", {
    d: "M101 14 v14 M95 22 l6 6 6-6",
    stroke: "#F4F6FB",
    strokeWidth: "3",
    fill: "none"
  })), kind === "pose" && React.createElement("g", {
    stroke: "#00E5FF",
    strokeWidth: "5",
    strokeLinecap: "round",
    fill: "none"
  }, React.createElement("circle", {
    cx: "100",
    cy: "22",
    r: "8"
  }), React.createElement("path", {
    d: "M100 30 L96 58 L78 70 L82 92 M96 58 L114 70 L112 92 M98 40 L74 46 M98 40 L124 44"
  }), React.createElement("circle", {
    cx: "78",
    cy: "70",
    r: "3",
    fill: "#FFD66D",
    stroke: "none"
  }), React.createElement("circle", {
    cx: "114",
    cy: "70",
    r: "3",
    fill: "#FFD66D",
    stroke: "none"
  })), kind === "fruit" && React.createElement("g", null, React.createElement("ellipse", {
    cx: "72",
    cy: "62",
    rx: "22",
    ry: "28",
    fill: "#7FBF3F",
    transform: "rotate(-20 72 62)"
  }), React.createElement("ellipse", {
    cx: "128",
    cy: "62",
    rx: "22",
    ry: "28",
    fill: "#FFB547",
    transform: "rotate(20 128 62)"
  }), React.createElement("text", {
    x: "72",
    y: "104",
    textAnchor: "middle",
    fontSize: "10",
    fill: "#A9AEC9"
  }, "\u0E14\u0E34\u0E1A"), React.createElement("text", {
    x: "128",
    y: "104",
    textAnchor: "middle",
    fontSize: "10",
    fill: "#A9AEC9"
  }, "\u0E2A\u0E38\u0E01")), kind === "hand" && React.createElement("g", {
    stroke: "#9B87F5",
    strokeWidth: "8",
    strokeLinecap: "round"
  }, React.createElement("path", {
    d: "M100 92 V54 M86 60 V28 M100 54 V20 M114 58 V26 M126 66 V40 M82 78 L66 62"
  }), React.createElement("path", {
    d: "M150 50 l14 0 M157 43 l7 7 -7 7",
    stroke: "#FFD66D",
    strokeWidth: "4",
    fill: "none"
  })), kind === "detect" && React.createElement("g", null, React.createElement("rect", {
    x: "30",
    y: "30",
    width: "140",
    height: "64",
    rx: "6",
    fill: "#161336",
    stroke: "#57CCF2"
  }), React.createElement("rect", {
    x: "44",
    y: "44",
    width: "30",
    height: "36",
    fill: "none",
    stroke: "#00E5FF",
    strokeWidth: "2.5"
  }), React.createElement("rect", {
    x: "88",
    y: "52",
    width: "26",
    height: "22",
    fill: "none",
    stroke: "#00E5FF",
    strokeWidth: "2.5"
  }), React.createElement("rect", {
    x: "126",
    y: "40",
    width: "30",
    height: "40",
    fill: "none",
    stroke: "#FF7A90",
    strokeWidth: "2.5",
    strokeDasharray: "4 3"
  }), React.createElement("text", {
    x: "44",
    y: "40",
    fontSize: "9",
    fill: "#00E5FF"
  }, "beaker"), React.createElement("text", {
    x: "126",
    y: "36",
    fontSize: "9",
    fill: "#FF7A90"
  }, "\u0E02\u0E32\u0E14")), kind === "leaf" && React.createElement("g", null, React.createElement("path", {
    d: "M60 90 Q60 30 120 22 Q128 82 60 90Z",
    fill: "#5BE3A8"
  }), React.createElement("path", {
    d: "M60 90 L118 26",
    stroke: "#2f8a5b",
    strokeWidth: "2"
  }), React.createElement("circle", {
    cx: "96",
    cy: "58",
    r: "6",
    fill: "#B7791F"
  }), React.createElement("circle", {
    cx: "84",
    cy: "70",
    r: "4",
    fill: "#B7791F"
  }), React.createElement("rect", {
    x: "132",
    y: "40",
    width: "44",
    height: "18",
    rx: "5",
    fill: "#FFD66D"
  }), React.createElement("text", {
    x: "154",
    y: "53",
    textAnchor: "middle",
    fontSize: "9",
    fill: "#0B1026"
  }, "\u0E15\u0E23\u0E27\u0E08")), React.createElement("circle", {
    cx: "186",
    cy: "14",
    r: "5",
    fill: C
  }));
}
function InnovationStage({
  pct: p
}) {
  return React.createElement("div", {
    className: "inno-stage"
  }, React.createElement("div", {
    className: "inno-lab"
  }, React.createElement("svg", {
    viewBox: "0 0 340 200",
    "aria-hidden": "true",
    className: "inno-svg"
  }, React.createElement("defs", null, React.createElement("linearGradient", {
    id: "trophyG",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: "#FFE7A3"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: "#E0A93C"
  }))), React.createElement("path", {
    d: "M30 160 C90 160 90 110 150 110 S220 60 300 50",
    fill: "none",
    stroke: "rgba(155,135,245,.4)",
    strokeWidth: "3",
    strokeDasharray: "6 6"
  }), React.createElement("path", {
    className: "art-flow",
    d: "M30 160 C90 160 90 110 150 110 S220 60 300 50",
    fill: "none",
    stroke: "#00E5FF",
    strokeWidth: "3"
  }), [[30, 160], [80, 150], [130, 114], [180, 100], [235, 72], [300, 50]].map(([x, y], i) => React.createElement("g", {
    key: i
  }, React.createElement("circle", {
    cx: x,
    cy: y,
    r: "11",
    fill: i < Math.round(p / 100 * 6) ? "#00E5FF" : "#161336",
    stroke: "#00E5FF",
    strokeWidth: "2"
  }), React.createElement("text", {
    x: x,
    y: y + 4,
    textAnchor: "middle",
    fontSize: "10",
    fontWeight: "700",
    fill: i < Math.round(p / 100 * 6) ? "#0B1026" : "#F4F6FB",
    fontFamily: "JetBrains Mono, monospace"
  }, i + 1))), React.createElement("g", {
    transform: "translate(276 6)",
    className: "art-pulse"
  }, React.createElement("path", {
    d: "M6 4 h28 v12 a14 14 0 0 1 -28 0z",
    fill: "url(#trophyG)"
  }), React.createElement("path", {
    d: "M6 8 h-6 a6 6 0 0 0 6 10 M34 8 h6 a6 6 0 0 1 -6 10",
    fill: "none",
    stroke: "#FFD66D",
    strokeWidth: "2.5"
  }), React.createElement("rect", {
    x: "16",
    y: "28",
    width: "8",
    height: "6",
    fill: "#E0A93C"
  }), React.createElement("rect", {
    x: "10",
    y: "34",
    width: "20",
    height: "5",
    rx: "2",
    fill: "#FFD66D"
  })))), React.createElement("div", {
    className: "inno-cards",
    "aria-hidden": "true"
  }, ["Smart Bin", "Squat Coach", "Leaf Doctor"].map((n, i) => React.createElement("span", {
    key: n,
    className: "ds-card",
    style: {
      "--c": ["#5BE3A8", "#00E5FF", "#FFD66D"][i],
      animationDelay: -i * 1.6 + "s"
    }
  }, React.createElement("b", null, n), React.createElement("span", {
    className: "mono"
  }, "PROJECT")))), React.createElement("div", {
    className: "vs-bot ml-bot"
  }, React.createElement(AIraBot, {
    mood: p >= 100 ? "cheer" : "happy",
    title: "AIra \u0E1E\u0E35\u0E48\u0E40\u0E25\u0E35\u0E49\u0E22\u0E07\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19"
  }), React.createElement("span", {
    className: "vs-badge"
  }, "PROJECT MENTOR")));
}
const filled = (v, n = 3) => typeof v === "string" && v.trim().length >= n;
function stepStatus(pj) {
  const plan = pj.plan || {},
    test = pj.test || {},
    pres = pj.present || {},
    dc = pj.dataCheck || {},
    bc = pj.buildCheck || {};
  const parts = [[!!pj.idea, pj.idea === "custom" ? filled(pj.customIdea, 5) : !!pj.idea], [...PLAN_FIELDS.map(([k]) => filled(plan[k], k === "title" ? 3 : 10)), (plan.tools || []).length > 0], [...DATA_CHECK.map(([k]) => !!dc[k]), filled(pj.dataType, 2), +pj.dataPerClass > 0], [!!pj.tool, ...BUILD_CHECK.map(([k]) => k === "evidence" ? (pj.evidence || []).length > 0 && !!bc[k] : !!bc[k])], [...TEST_FIELDS.map(([k]) => filled(test[k], 10)), +test.total > 0 && test.correct !== "" && test.correct !== undefined && +test.correct >= 0 && +test.correct <= +test.total], PRESENT_FIELDS.map(([k]) => filled(pres[k], k === "name" ? 3 : k === "reflection" ? 40 : 10))];
  return parts.map((arr, i) => {
    const d = arr.filter(Boolean).length;
    return {
      id: U4_STEPS[i].id,
      done: d,
      total: arr.length,
      state: d === 0 ? "ns" : d === arr.length ? "done" : "ip"
    };
  });
}

const evalDone = se => RUBRIC.every(r => se && se[r.id] && se[r.id].level !== undefined && filled(se[r.id].why, 10));
const selfScore = se => RUBRIC.reduce((s, r) => s + (se && se[r.id] && se[r.id].level !== undefined ? r.max * LEVEL_FRAC[se[r.id].level] : 0), 0);
const normUrl = u => {
  try {
    const x = new URL(u.trim());
    return /^https?:$/.test(x.protocol) ? x.href : null;
  } catch (e) {
    return null;
  }
};
function Field({
  id,
  label,
  value,
  onChange,
  max = 600,
  area,
  hint,
  placeholder,
  minLen
}) {
  const len = (value || "").trim().length;
  return React.createElement("div", {
    className: "field"
  }, React.createElement("label", {
    htmlFor: id
  }, label, minLen ? React.createElement("span", {
    className: "req " + (len >= minLen ? "ok" : "")
  }, len >= minLen ? "✓" : `อย่างน้อย ${minLen} ตัวอักษร`) : null), area ? React.createElement("textarea", {
    id: id,
    className: "input ta",
    rows: "3",
    maxLength: max,
    value: value || "",
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }) : React.createElement("input", {
    id: id,
    className: "input",
    maxLength: max,
    value: value || "",
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }), hint && React.createElement("span", {
    className: "hint"
  }, hint));
}
function CheckRow({
  id,
  checked,
  onChange,
  children
}) {
  return React.createElement("label", {
    className: "check",
    htmlFor: id
  }, React.createElement("input", {
    id: id,
    type: "checkbox",
    checked: !!checked,
    onChange: e => onChange(e.target.checked)
  }), React.createElement("span", null, children));
}
function reportData(pj, student) {
  const idea = IDEAS.find(x => x.id === pj.idea);
  const pr = pj.present || {},
    pl = pj.plan || {},
    t = pj.test || {};
  const acc = +t.total > 0 ? Math.round(+t.correct / +t.total * 100) : null;
  return {
    idea,
    pr,
    pl,
    t,
    acc,
    student,
    tool: pj.tool ? TOOLS4[pj.tool].name : "–",
    se: pj.selfEval || {}
  };
}
const esc = s => String(s || "").replace(/[&<>"]/g, c => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
})[c]);
function reportMarkdown(pj, student) {
  const d = reportData(pj, student);
  const L = [`# ${d.pr.name || d.pl.title || "โครงงาน AI"}`, "", `ผู้จัดทำ: ${student.displayName} (${student.classroom}) · รายวิชา ว32281 ปัญญาประดิษฐ์เบื้องต้น`, `ไอเดีย: ${d.idea ? d.idea.name : pj.customIdea || "–"} · เครื่องมือ: ${d.tool}`, "", "## บทคัดย่อ", d.pr.abstract || "–", "", "## ปัญหาและวัตถุประสงค์", d.pl.problem || "–", "", d.pl.objective || "–", "", "## กลุ่มผู้ใช้งาน", d.pl.users || "–", "", "## ข้อมูล", `${pj.dataType || "–"} · คลาสละ ${pj.dataPerClass || "–"} ตัวอย่าง`, d.pl.data || "", "", "## วิธีการพัฒนา", d.pr.method || "–", "", "## การทดสอบ", d.t.method || "–", d.acc !== null ? `ผลการทดสอบ: ถูก ${d.t.correct}/${d.t.total} (${d.acc}%)` : "", "", "ข้อผิดพลาด: " + (d.t.errors || "–"), "", "การปรับปรุง: " + (d.t.improve || "–"), "", "## ผลการทดลอง", d.pr.results || "–", "", "## ประโยชน์", d.pr.benefits || "–", "", "## ข้อจำกัด", d.pr.limits || "–", "", "จริยธรรมและความปลอดภัย: " + (d.t.ethics || "–"), "", "## แนวทางพัฒนาต่อ", d.pr.future || "–", "", "## Reflection", d.pr.reflection || "–", "", "## หลักฐาน", ...(pj.evidence || []).map(e => `- ${e.label}: ${e.url}`), "", `## ประเมินตนเอง: ${selfScore(pj.selfEval).toFixed(1)} / 20`, ...RUBRIC.map(r => `- ${r.name}: ${d.se[r.id] && d.se[r.id].level !== undefined ? LEVELS[d.se[r.id].level] : "–"}`), "", "คะแนนจากครู: ยังไม่มี (โหมดทดลอง ไม่ได้ส่งงานถึงครู)", ""];
  return L.join("\n");
}
function reportHtml(pj, student) {
  const md = reportMarkdown(pj, student).split("\n");
  const body = md.map(l => l.startsWith("# ") ? `<h1>${esc(l.slice(2))}</h1>` : l.startsWith("## ") ? `<h2>${esc(l.slice(3))}</h2>` : l.startsWith("- ") ? `<li>${esc(l.slice(2))}</li>` : l ? `<p>${esc(l)}</p>` : "").join("\n");
  return `<!doctype html><html lang="th"><head><meta charset="utf-8"><title>${esc((pj.present || {}).name || "รายงานโครงงาน AI")}</title><style>body{font-family:Tahoma,"Noto Sans Thai",sans-serif;max-width:780px;margin:32px auto;padding:0 20px;line-height:1.7;color:#111}h1{font-size:24px;border-bottom:3px solid #6A55D8;padding-bottom:8px}h2{font-size:17px;color:#3b2fa0;margin-top:22px}li{margin-left:18px}@media print{body{margin:0}}</style></head><body>${body}<p style="color:#666;font-size:12px">สร้างจาก AIra Learning Academy · ${new Date().toLocaleDateString("th-TH")}</p></body></html>`;
}
function ReportView({
  pj,
  student
}) {
  const d = reportData(pj, student);
  const [dl, setDl] = useState(null);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    let on = true;
    try {
      if (window.claude && window.claude.use) window.claude.use("downloads").then(x => on && setDl(x)).catch(() => {});
    } catch (e) {}
    return () => {
      on = false;
    };
  }, []);
  const save = async ext => {
    setMsg("");
    const base = (d.pr.name || d.pl.title || "AI-Project").replace(/[\\/:*?"<>|]+/g, " ").trim().slice(0, 60) || "AI-Project";
    try {
      await dl.save({
        filename: `${base}.${ext}`,
        data: ext === "html" ? reportHtml(pj, student) : reportMarkdown(pj, student)
      });
      setMsg("บันทึกไฟล์แล้ว");
    } catch (e) {
      setMsg(e && e.code === "declined" ? "ยกเลิกการบันทึกไฟล์" : "บันทึกไฟล์ไม่ได้ในมุมมองนี้ ใช้ปุ่มคัดลอกข้อความแทน");
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reportMarkdown(pj, student));
      setMsg("คัดลอกข้อความรายงานแล้ว");
    } catch (e) {
      setMsg("คัดลอกไม่สำเร็จ เลือกข้อความในรายงานแล้วคัดลอกเองได้");
    }
  };
  const Sec = ({
    t,
    v
  }) => React.createElement("section", null, React.createElement("h4", null, t), React.createElement("p", null, v || React.createElement("span", {
    className: "hint"
  }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E01\u0E23\u0E2D\u0E01")));
  return React.createElement("div", {
    className: "report-wrap"
  }, React.createElement("div", {
    className: "btn-inline"
  }, dl && React.createElement(Button, {
    icon: "book",
    onClick: () => save("html")
  }, "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E40\u0E1B\u0E47\u0E19\u0E44\u0E1F\u0E25\u0E4C\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19 (.html \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E1E\u0E34\u0E21\u0E1E\u0E4C)"), dl && React.createElement(Button, {
    variant: "ghost",
    icon: "book",
    onClick: () => save("md")
  }, "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E40\u0E1B\u0E47\u0E19 Markdown (.md)"), React.createElement(Button, {
    variant: "ghost",
    icon: "check",
    onClick: copy
  }, "\u0E04\u0E31\u0E14\u0E25\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19")), msg && React.createElement("span", {
    className: "hint",
    role: "status"
  }, msg), !dl && React.createElement("span", {
    className: "hint"
  }, "\u0E21\u0E38\u0E21\u0E21\u0E2D\u0E07\u0E19\u0E35\u0E49\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E1F\u0E25\u0E4C\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 \u0E43\u0E0A\u0E49\u0E1B\u0E38\u0E48\u0E21\u0E04\u0E31\u0E14\u0E25\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21 \u0E41\u0E25\u0E49\u0E27\u0E27\u0E32\u0E07\u0E43\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E02\u0E2D\u0E07\u0E40\u0E18\u0E2D"), React.createElement("article", {
    className: "report",
    "aria-label": "\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E2A\u0E23\u0E38\u0E1B\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19"
  }, React.createElement("header", null, React.createElement("span", {
    className: "eyebrow"
  }, "\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E2A\u0E23\u0E38\u0E1B\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19 \xB7 \u0E2732281"), React.createElement("h3", null, d.pr.name || d.pl.title || "ยังไม่ได้ตั้งชื่อผลงาน"), React.createElement("span", {
    className: "hint"
  }, student.displayName, " \xB7 ", student.classroom, " \xB7 \u0E44\u0E2D\u0E40\u0E14\u0E35\u0E22: ", d.idea ? d.idea.name : pj.customIdea || "–", " \xB7 \u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D: ", d.tool)), React.createElement(Sec, {
    t: "\u0E1A\u0E17\u0E04\u0E31\u0E14\u0E22\u0E48\u0E2D",
    v: d.pr.abstract
  }), React.createElement(Sec, {
    t: "\u0E1B\u0E31\u0E0D\u0E2B\u0E32\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49",
    v: d.pl.problem
  }), React.createElement(Sec, {
    t: "\u0E27\u0E31\u0E15\u0E16\u0E38\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C",
    v: d.pl.objective
  }), React.createElement(Sec, {
    t: "\u0E27\u0E34\u0E18\u0E35\u0E01\u0E32\u0E23\u0E1E\u0E31\u0E12\u0E19\u0E32",
    v: d.pr.method
  }), React.createElement(Sec, {
    t: "\u0E01\u0E32\u0E23\u0E17\u0E14\u0E2A\u0E2D\u0E1A",
    v: d.t.method ? `${d.t.method}${d.acc !== null ? ` · ถูก ${d.t.correct}/${d.t.total} (${d.acc}%)` : ""}` : ""
  }), React.createElement(Sec, {
    t: "\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E17\u0E14\u0E25\u0E2D\u0E07",
    v: d.pr.results
  }), React.createElement(Sec, {
    t: "\u0E1B\u0E23\u0E30\u0E42\u0E22\u0E0A\u0E19\u0E4C\u0E17\u0E35\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A",
    v: d.pr.benefits
  }), React.createElement(Sec, {
    t: "\u0E02\u0E49\u0E2D\u0E08\u0E33\u0E01\u0E31\u0E14",
    v: d.pr.limits
  }), React.createElement(Sec, {
    t: "\u0E41\u0E19\u0E27\u0E17\u0E32\u0E07\u0E1E\u0E31\u0E12\u0E19\u0E32\u0E15\u0E48\u0E2D",
    v: d.pr.future
  }), React.createElement(Sec, {
    t: "Reflection",
    v: d.pr.reflection
  }), React.createElement("section", null, React.createElement("h4", null, "\u0E2B\u0E25\u0E31\u0E01\u0E10\u0E32\u0E19"), (pj.evidence || []).length ? React.createElement("ul", {
    className: "bul"
  }, pj.evidence.map(e => React.createElement("li", {
    key: e.id
  }, React.createElement("a", {
    href: e.url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, e.label)))) : React.createElement("p", {
    className: "hint"
  }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E25\u0E34\u0E07\u0E01\u0E4C\u0E2B\u0E25\u0E31\u0E01\u0E10\u0E32\u0E19"))));
}
function Unit4Page() {
  const {
    progress,
    summary,
    student,
    saveProject,
    markItem,
    saveActivity,
    visitUnit,
    notify
  } = useApp();
  const {
    navigate
  } = useRoute();
  useEffect(() => {
    visitUnit("unit4");
  }, [visitUnit]);
  const up = progress.unit4,
    su = summary.units.unit4;
  const [pj, setPj] = useState(() => up.project || {});
  const [tab, setTab] = useState(() => {
    try {
      return sessionStorage.getItem("aira_u4_tab") || "steps";
    } catch (e) {
      return "steps";
    }
  });
  const [step, setStep] = useState(() => {
    try {
      return +sessionStorage.getItem("aira_u4_step") || 1;
    } catch (e) {
      return 1;
    }
  });
  useEffect(() => {
    try {
      sessionStorage.setItem("aira_u4_tab", tab);
      sessionStorage.setItem("aira_u4_step", String(step));
    } catch (e) {}
  }, [tab, step]);
  const [savedAt, setSavedAt] = useState(null);
  const timer = useRef(null),
    latest = useRef(pj),
    dirty = useRef(false);
  const flush = useCallback(() => {
    if (dirty.current) {
      saveProject(latest.current);
      dirty.current = false;
      setSavedAt(new Date());
    }
  }, [saveProject]);
  useEffect(() => {
    const h = () => flush();
    window.addEventListener("pagehide", h);
    window.addEventListener("beforeunload", h);
    return () => {
      window.removeEventListener("pagehide", h);
      window.removeEventListener("beforeunload", h);
      flush();
      clearTimeout(timer.current);
    };
  }, [flush]);
  const update = fn => {
    setPj(prev => {
      const next = typeof fn === "function" ? fn(prev) : {
        ...prev,
        ...fn
      };
      latest.current = next;
      return next;
    });
    dirty.current = true;
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, 400);
  };
  const setIn = (sec, k, v) => update(p => ({
    ...p,
    [sec]: {
      ...(p[sec] || {}),
      [k]: v
    }
  }));
  const st = stepStatus(pj);
  useEffect(() => {
    st.forEach(s => {
      const isDone = s.state === "done",
        stored = up.completedLessons.includes(s.id);
      if (isDone !== stored) markItem("unit4", "lessons", s.id, isDone);
    });
    if (evalDone(pj.selfEval) && !up.completedActivities.includes("u4-eval")) saveActivity("unit4", "u4-eval", selfScore(pj.selfEval), 20);
  }, [JSON.stringify(st.map(s => s.state)), evalDone(pj.selfEval)]);
  const prevDone = useRef(st.map(s => s.state));
  useEffect(() => {
    st.forEach((s, i) => {
      if (s.state === "done" && prevDone.current[i] !== "done") notify({
        type: "success",
        bot: "cheer",
        title: `ขั้นที่ ${i + 1} ${U4_STEPS[i].th} เสร็จแล้ว!`,
        message: "AIra บันทึกความก้าวหน้าให้แล้ว"
      });
    });
    prevDone.current = st.map(s => s.state);
  }, [JSON.stringify(st.map(s => s.state))]);
  const totalReq = st.reduce((a, s) => a + s.total, 0),
    doneReq = st.reduce((a, s) => a + s.done, 0);
  const overall = Math.round(doneReq / totalReq * 100);
  const cur = U4_STEPS[step - 1],
    cs = st[step - 1];
  const [ev, setEv] = useState({
    label: "",
    url: ""
  });
  const [evErr, setEvErr] = useState("");
  const [note, setNote] = useState("");
  const addEvidence = () => {
    const u = normUrl(ev.url);
    if (!filled(ev.label, 2)) return setEvErr("ใส่คำอธิบายลิงก์ เช่น วิดีโอสาธิตผลงาน");
    if (!u) return setEvErr("ลิงก์ต้องขึ้นต้นด้วย http:// หรือ https://");
    update(p => ({
      ...p,
      evidence: [...(p.evidence || []), {
        id: Date.now().toString(36),
        label: ev.label.trim(),
        url: u,
        at: new Date().toISOString()
      }]
    }));
    setEv({
      label: "",
      url: ""
    });
    setEvErr("");
  };
  const addNote = () => {
    if (!filled(note, 5)) return;
    update(p => ({
      ...p,
      notes: [{
        id: Date.now().toString(36),
        text: note.trim(),
        at: new Date().toISOString()
      }, ...(p.notes || [])]
    }));
    setNote("");
  };
  const tasks = [...(pj.idea ? [] : [["เลือกไอเดียโครงงาน", 1]]), ...PLAN_FIELDS.filter(([k]) => !filled((pj.plan || {})[k], k === "title" ? 3 : 10)).map(([, l]) => [`กรอก${l}`, 2]), ...(((pj.plan || {}).tools || []).length ? [] : [["เลือกเครื่องมือที่จะใช้ในแผน", 2]]), ...DATA_CHECK.filter(([k]) => !(pj.dataCheck || {})[k]).map(([, l]) => [l, 3]), ...(pj.tool ? [] : [["เลือกเครื่องมือสร้างโมเดล", 4]]), ...BUILD_CHECK.filter(([k]) => !(pj.buildCheck || {})[k]).map(([, l]) => [l, 4]), ...TEST_FIELDS.filter(([k]) => !filled((pj.test || {})[k], 10)).map(([, l]) => [`บันทึก${l}`, 5]), ...PRESENT_FIELDS.filter(([k]) => !filled((pj.present || {})[k], k === "reflection" ? 40 : k === "name" ? 3 : 10)).map(([, l]) => [`เขียน${l.replace("Reflection: ", "Reflection ")}`, 6])];
  const se = pj.selfEval || {};
  const setSe = (rid, patch) => update(p => ({
    ...p,
    selfEval: {
      ...(p.selfEval || {}),
      [rid]: {
        ...((p.selfEval || {})[rid] || {}),
        ...patch
      }
    }
  }));
  const acc = +(pj.test || {}).total > 0 ? Math.round(+(pj.test || {}).correct / +(pj.test || {}).total * 100) : null;
  const goStep = n => {
    setStep(n);
    setTab("steps");
    setTimeout(() => scrollToEl(document.getElementById("u4-work")), 40);
  };
  return React.createElement(React.Fragment, null, React.createElement("section", {
    className: "glass u1-hero hero-unit4",
    "aria-labelledby": "u4-title"
  }, React.createElement("div", {
    style: {
      display: "grid",
      gap: 14,
      minWidth: 0
    }
  }, React.createElement("div", {
    className: "hero-meta"
  }, React.createElement(Badge, {
    tone: "cyan"
  }, "UNIT 04"), React.createElement(Badge, null, "AI Innovation Project"), React.createElement(Badge, null, "AI Innovation & Project Studio"), React.createElement(DemoBadge, null)), React.createElement("h1", {
    id: "u4-title"
  }, "\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E22\u0E38\u0E01\u0E15\u0E4C\u0E43\u0E0A\u0E49 AI \u0E40\u0E1E\u0E37\u0E48\u0E2D", React.createElement("span", {
    className: "grad-text"
  }, "\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E0A\u0E34\u0E49\u0E19\u0E07\u0E32\u0E19")), React.createElement("div", {
    style: {
      display: "grid",
      gap: 8
    }
  }, React.createElement("span", {
    className: "eyebrow"
  }, "\u0E08\u0E38\u0E14\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49"), React.createElement("ul", {
    className: "objectives"
  }, U4_OBJECTIVES.map(o => React.createElement("li", {
    key: o
  }, React.createElement(Icon, {
    name: "target",
    size: 16
  }), o)))), React.createElement("div", {
    className: "u1-progress"
  }, React.createElement(ProgressRing, {
    value: overall,
    size: 64,
    stroke: 7,
    label: "\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19"
  }), React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6
    }
  }, React.createElement(Badge, null, React.createElement(Icon, {
    name: "check",
    size: 12
  }), "\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E40\u0E2A\u0E23\u0E47\u0E08 ", st.filter(s => s.state === "done").length, "/6"), React.createElement(Badge, {
    tone: evalDone(pj.selfEval) ? "ok" : ""
  }, React.createElement(Icon, {
    name: "award",
    size: 12
  }), evalDone(pj.selfEval) ? `ประเมินตนเอง ${selfScore(pj.selfEval).toFixed(1)}/20` : "ยังไม่ได้ประเมินตนเอง"), savedAt && React.createElement(Badge, {
    tone: "ok",
    dot: true
  }, "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34 ", savedAt.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit"
  })))), React.createElement("div", {
    className: "btn-inline"
  }, React.createElement(Button, {
    className: "btn-glow",
    icon: "play",
    onClick: () => goStep(st.findIndex(s => s.state !== "done") + 1 || 6)
  }, doneReq === 0 ? "เริ่มโครงงาน" : "ทำต่อ"), React.createElement(Button, {
    variant: "ghost",
    icon: "grid",
    onClick: () => navigate("home")
  }, "\u0E01\u0E25\u0E31\u0E1A Dashboard"))), React.createElement(InnovationStage, {
    pct: overall
  })), su.completed && React.createElement("div", {
    className: "glass unit-done",
    role: "status"
  }, React.createElement("span", {
    className: "medal-wrap",
    style: {
      filter: "drop-shadow(0 0 14px rgba(255,214,109,.6))"
    }
  }, React.createElement("span", {
    className: "medal",
    style: {
      background: "linear-gradient(150deg,#FFE7A3,var(--gold) 45%,var(--lavender))",
      color: "var(--navy)"
    }
  }, React.createElement(Icon, {
    name: "trophy",
    size: 26
  }))), React.createElement("div", {
    style: {
      display: "grid",
      gap: 4,
      minWidth: 0
    }
  }, React.createElement("strong", {
    style: {
      fontSize: 18
    }
  }, "\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19\u0E04\u0E23\u0E1A\u0E17\u0E38\u0E01\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19! \u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E40\u0E2B\u0E23\u0E35\u0E22\u0E0D AI Innovator"), React.createElement("span", {
    style: {
      color: "var(--muted)",
      fontSize: 14
    }
  }, "\u0E17\u0E33 Checklist \u0E04\u0E23\u0E1A \u0E40\u0E02\u0E35\u0E22\u0E19 Reflection \u0E41\u0E25\u0E30\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E15\u0E19\u0E40\u0E2D\u0E07\u0E41\u0E25\u0E49\u0E27 \u0E41\u0E01\u0E49\u0E44\u0E02\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E15\u0E48\u0E2D\u0E44\u0E14\u0E49\u0E15\u0E25\u0E2D\u0E14\u0E40\u0E27\u0E25\u0E32")), React.createElement(Button, {
    variant: "ghost",
    iconRight: "grid",
    onClick: () => navigate("home")
  }, "\u0E14\u0E39\u0E40\u0E2B\u0E23\u0E35\u0E22\u0E0D\u0E43\u0E19 Dashboard")), React.createElement("section", {
    className: "glass roadmap",
    "aria-labelledby": "rm-title"
  }, React.createElement("div", {
    className: "section-title"
  }, React.createElement("h2", {
    id: "rm-title"
  }, "Project Timeline"), React.createElement("span", {
    className: "hint"
  }, "\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E04\u0E33\u0E19\u0E27\u0E13\u0E08\u0E32\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E01\u0E23\u0E2D\u0E01\u0E08\u0E23\u0E34\u0E07 \xB7 \u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32 ", doneReq, "/", totalReq, " \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23")), React.createElement(ProgressBar, {
    value: overall,
    label: "\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19"
  }), React.createElement("ol", {
    className: "rm-list"
  }, U4_STEPS.map((s, i) => React.createElement("li", {
    key: s.id,
    className: "rm-item " + st[i].state
  }, React.createElement("button", {
    type: "button",
    onClick: () => goStep(i + 1),
    "aria-label": `ขั้นที่ ${i + 1} ${s.ms} สถานะ ${STATE_TH[st[i].state]}`
  }, React.createElement("span", {
    className: "rm-dot"
  }, st[i].state === "done" ? React.createElement(Icon, {
    name: "check",
    size: 16
  }) : i + 1), React.createElement("span", {
    className: "rm-name"
  }, s.ms), React.createElement("span", {
    className: "rm-state " + st[i].state
  }, STATE_LABEL[st[i].state]), React.createElement("span", {
    className: "mono hint"
  }, st[i].done, "/", st[i].total)), React.createElement("label", {
    className: "rm-date"
  }, React.createElement("span", {
    className: "sr-only"
  }, "\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E02\u0E31\u0E49\u0E19\u0E17\u0E35\u0E48 ", i + 1), React.createElement("input", {
    type: "date",
    className: "input",
    value: (pj.dates || {})[s.id] || "",
    onChange: e => setIn("dates", s.id, e.target.value)
  })))))), React.createElement("div", {
    className: "seg u4-tabs",
    role: "tablist",
    "aria-label": "\u0E2A\u0E48\u0E27\u0E19\u0E02\u0E2D\u0E07 Project Workspace"
  }, [["overview", "ภาพรวมโครงงาน"], ["steps", "6 ขั้นตอน"], ["eval", "ประเมินผล"], ["gallery", "แกลเลอรีไอเดีย"], ["report", "รายงานสรุป"]].map(([id, l]) => React.createElement("button", {
    key: id,
    type: "button",
    role: "tab",
    "aria-selected": tab === id,
    onClick: () => setTab(id)
  }, l))), React.createElement("div", {
    id: "u4-work",
    className: "glass lesson",
    key: tab
  }, tab === "overview" && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "lesson-head"
  }, React.createElement("span", {
    className: "eyebrow"
  }, "Project Workspace"), React.createElement("h2", null, "\u0E20\u0E32\u0E1E\u0E23\u0E27\u0E21\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19")), React.createElement("div", {
    className: "ov-grid"
  }, React.createElement("div", {
    className: "q-card"
  }, React.createElement("strong", null, "Project Overview"), React.createElement("dl", {
    className: "facts"
  }, React.createElement("div", {
    className: "wide"
  }, React.createElement("dt", null, "\u0E0A\u0E37\u0E48\u0E2D\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19"), React.createElement("dd", null, (pj.plan || {}).title || "–")), React.createElement("div", null, React.createElement("dt", null, "\u0E44\u0E2D\u0E40\u0E14\u0E35\u0E22"), React.createElement("dd", null, pj.idea === "custom" ? "ไอเดียของฉันเอง" : (IDEAS.find(x => x.id === pj.idea) || {}).name || "–")), React.createElement("div", null, React.createElement("dt", null, "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D"), React.createElement("dd", null, pj.tool ? TOOLS4[pj.tool].name : "–")), React.createElement("div", {
    className: "wide"
  }, React.createElement("dt", null, "\u0E01\u0E25\u0E38\u0E48\u0E21\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49"), React.createElement("dd", null, (pj.plan || {}).users || "–")), React.createElement("div", null, React.createElement("dt", null, "\u0E1C\u0E25\u0E17\u0E14\u0E2A\u0E2D\u0E1A"), React.createElement("dd", {
    className: "mono"
  }, acc !== null ? `${acc}%` : "–")), React.createElement("div", null, React.createElement("dt", null, "\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E15\u0E19\u0E40\u0E2D\u0E07"), React.createElement("dd", {
    className: "mono"
  }, evalDone(pj.selfEval) ? `${selfScore(pj.selfEval).toFixed(1)}/20` : "–")))), React.createElement("div", {
    className: "q-card"
  }, React.createElement("strong", null, "Progress Tracker"), U4_STEPS.map((s, i) => React.createElement("div", {
    key: s.id,
    className: "pt-row"
  }, React.createElement("span", null, i + 1, ". ", s.th), React.createElement(ProgressBar, {
    value: Math.round(st[i].done / st[i].total * 100),
    label: s.th
  }), React.createElement("span", {
    className: "rm-state " + st[i].state
  }, STATE_TH[st[i].state]))))), React.createElement("div", {
    className: "q-card"
  }, React.createElement("div", {
    className: "act-head"
  }, React.createElement("strong", null, "Task Checklist \xB7 \u0E07\u0E32\u0E19\u0E17\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E37\u0E2D"), React.createElement("span", {
    className: "mono hint"
  }, tasks.length, " \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23")), tasks.length === 0 ? React.createElement(Feedback, {
    tone: "good",
    title: "\u0E17\u0E33\u0E04\u0E23\u0E1A\u0E17\u0E38\u0E01\u0E07\u0E32\u0E19\u0E41\u0E25\u0E49\u0E27"
  }, "\u0E2D\u0E22\u0E48\u0E32\u0E25\u0E37\u0E21\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E15\u0E19\u0E40\u0E2D\u0E07\u0E43\u0E19\u0E41\u0E17\u0E47\u0E1A \"\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E1C\u0E25\"") : React.createElement("ul", {
    className: "task-list"
  }, tasks.slice(0, 12).map(([t, n], i) => React.createElement("li", {
    key: i
  }, React.createElement("button", {
    type: "button",
    className: "link-btn",
    onClick: () => goStep(n)
  }, "\u0E02\u0E31\u0E49\u0E19 ", n), " ", t)), tasks.length > 12 && React.createElement("li", {
    className: "hint"
  }, "\u0E41\u0E25\u0E30\u0E2D\u0E35\u0E01 ", tasks.length - 12, " \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"))), React.createElement("div", {
    className: "q-card"
  }, React.createElement("strong", null, "Evidence Links \xB7 \u0E25\u0E34\u0E07\u0E01\u0E4C\u0E2B\u0E25\u0E31\u0E01\u0E10\u0E32\u0E19"), React.createElement("span", {
    className: "hint"
  }, "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E25\u0E34\u0E07\u0E01\u0E4C\u0E17\u0E35\u0E48\u0E40\u0E08\u0E49\u0E32\u0E02\u0E2D\u0E07\u0E1C\u0E25\u0E07\u0E32\u0E19\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E43\u0E2B\u0E49\u0E41\u0E0A\u0E23\u0E4C \u0E40\u0E0A\u0E48\u0E19 \u0E27\u0E34\u0E14\u0E35\u0E42\u0E2D\u0E2A\u0E32\u0E18\u0E34\u0E15 \u0E25\u0E34\u0E07\u0E01\u0E4C\u0E42\u0E21\u0E40\u0E14\u0E25 Teachable Machine \u0E2B\u0E23\u0E37\u0E2D Notebook \u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E01\u0E47\u0E1A\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E25\u0E34\u0E07\u0E01\u0E4C \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E44\u0E1F\u0E25\u0E4C"), React.createElement("div", {
    className: "ev-form"
  }, React.createElement("input", {
    className: "input",
    "aria-label": "\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E25\u0E34\u0E07\u0E01\u0E4C",
    placeholder: "\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22 \u0E40\u0E0A\u0E48\u0E19 \u0E27\u0E34\u0E14\u0E35\u0E42\u0E2D\u0E2A\u0E32\u0E18\u0E34\u0E15",
    maxLength: 80,
    value: ev.label,
    onChange: e => setEv(x => ({
      ...x,
      label: e.target.value
    }))
  }), React.createElement("input", {
    className: "input",
    "aria-label": "URL",
    placeholder: "https://",
    maxLength: 500,
    value: ev.url,
    onChange: e => setEv(x => ({
      ...x,
      url: e.target.value
    }))
  }), React.createElement(Button, {
    size: "sm",
    icon: "check",
    onClick: addEvidence
  }, "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E25\u0E34\u0E07\u0E01\u0E4C")), evErr && React.createElement("span", {
    className: "field-err"
  }, evErr), React.createElement("ul", {
    className: "ev-list"
  }, (pj.evidence || []).map(e => React.createElement("li", {
    key: e.id
  }, React.createElement("a", {
    href: e.url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, e.label), React.createElement("span", {
    className: "hint mono"
  }, e.url.length > 48 ? e.url.slice(0, 48) + "…" : e.url), React.createElement("button", {
    type: "button",
    className: "icon-btn",
    "aria-label": `ลบลิงก์ ${e.label}`,
    onClick: () => update(p => ({
      ...p,
      evidence: p.evidence.filter(x => x.id !== e.id)
    }))
  }, React.createElement(Icon, {
    name: "x",
    size: 14
  })))))), React.createElement("div", {
    className: "q-card"
  }, React.createElement("strong", null, "Reflection Notes \xB7 \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E17\u0E33\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19"), React.createElement("div", {
    className: "ev-form"
  }, React.createElement("textarea", {
    className: "input ta",
    rows: "2",
    "aria-label": "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E43\u0E2B\u0E21\u0E48",
    maxLength: 800,
    placeholder: "\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49\u0E17\u0E33\u0E2D\u0E30\u0E44\u0E23 \u0E40\u0E08\u0E2D\u0E1B\u0E31\u0E0D\u0E2B\u0E32\u0E2D\u0E30\u0E44\u0E23 \u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E2D\u0E30\u0E44\u0E23",
    value: note,
    onChange: e => setNote(e.target.value)
  }), React.createElement(Button, {
    size: "sm",
    icon: "check",
    disabled: !filled(note, 5),
    onClick: addNote
  }, "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01")), React.createElement("ul", {
    className: "note-list"
  }, (pj.notes || []).map(n => React.createElement("li", {
    key: n.id
  }, React.createElement("span", {
    className: "hint mono"
  }, thaiDateTime(n.at)), React.createElement("p", null, n.text), React.createElement("button", {
    type: "button",
    className: "icon-btn",
    "aria-label": "\u0E25\u0E1A\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01",
    onClick: () => update(p => ({
      ...p,
      notes: p.notes.filter(x => x.id !== n.id)
    }))
  }, React.createElement(Icon, {
    name: "x",
    size: 14
  }))))))), tab === "steps" && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "step-tabs",
    role: "tablist",
    "aria-label": "6 \u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E02\u0E2D\u0E07\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19"
  }, U4_STEPS.map((s, i) => React.createElement("button", {
    key: s.id,
    type: "button",
    role: "tab",
    "aria-selected": step === i + 1,
    className: st[i].state,
    onClick: () => setStep(i + 1)
  }, React.createElement("span", {
    className: "mono"
  }, st[i].state === "done" ? "✓" : i + 1), s.en))), React.createElement("header", {
    className: "lesson-head"
  }, React.createElement("span", {
    className: "eyebrow"
  }, "Step ", cur.no, " \xB7 ", STATE_LABEL[cs.state], " \xB7 ", cs.done, "/", cs.total), React.createElement("h2", null, cur.en), React.createElement("span", {
    className: "hint"
  }, cur.th)), React.createElement(AiraTip, {
    mood: cs.state === "done" ? "cheer" : "happy",
    title: "AIra \u0E1E\u0E35\u0E48\u0E40\u0E25\u0E35\u0E49\u0E22\u0E07\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19"
  }, cur.mentor), step === 1 && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "idea-grid",
    role: "radiogroup",
    "aria-label": "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E2D\u0E40\u0E14\u0E35\u0E22\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19"
  }, IDEAS.map(x => React.createElement("button", {
    key: x.id,
    type: "button",
    role: "radio",
    "aria-checked": pj.idea === x.id,
    className: "idea-card",
    onClick: () => update({
      idea: x.id
    })
  }, React.createElement("span", {
    className: "idea-top"
  }, React.createElement("span", {
    className: "tool-ic"
  }, React.createElement(Icon, {
    name: x.icon,
    size: 20
  })), React.createElement("b", null, x.name)), React.createElement("span", {
    className: "fp"
  }, x.desc), React.createElement("span", {
    className: "idea-meta"
  }, React.createElement(Badge, {
    tone: "cyan"
  }, x.type)), React.createElement("span", {
    className: "hint"
  }, React.createElement("b", null, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25:"), " ", x.data), React.createElement("span", {
    className: "hint"
  }, React.createElement("b", null, "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D:"), " ", x.tools), React.createElement("span", {
    className: "idea-lim"
  }, React.createElement("b", null, "\u0E02\u0E49\u0E2D\u0E08\u0E33\u0E01\u0E31\u0E14"), x.limits.map(l => React.createElement("span", {
    key: l
  }, "\xB7 ", l))))), React.createElement("button", {
    type: "button",
    role: "radio",
    "aria-checked": pj.idea === "custom",
    className: "idea-card custom",
    onClick: () => update({
      idea: "custom"
    })
  }, React.createElement("span", {
    className: "idea-top"
  }, React.createElement("span", {
    className: "tool-ic"
  }, React.createElement(Icon, {
    name: "bulb",
    size: 20
  })), React.createElement("b", null, "\u0E44\u0E2D\u0E40\u0E14\u0E35\u0E22\u0E02\u0E2D\u0E07\u0E09\u0E31\u0E19\u0E40\u0E2D\u0E07")), React.createElement("span", {
    className: "fp"
  }, "\u0E21\u0E35\u0E1B\u0E31\u0E0D\u0E2B\u0E32\u0E2D\u0E37\u0E48\u0E19\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E32\u0E01\u0E41\u0E01\u0E49\u0E14\u0E49\u0E27\u0E22 AI \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E01\u0E32\u0E23\u0E4C\u0E14\u0E19\u0E35\u0E49\u0E41\u0E25\u0E49\u0E27\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E44\u0E2D\u0E40\u0E14\u0E35\u0E22"))), pj.idea === "custom" && React.createElement(Field, {
    id: "u4-custom",
    label: "\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E44\u0E2D\u0E40\u0E14\u0E35\u0E22\u0E02\u0E2D\u0E07\u0E40\u0E18\u0E2D",
    area: true,
    value: pj.customIdea,
    onChange: v => update({
      customIdea: v
    }),
    minLen: 5,
    max: 500,
    placeholder: "\u0E1B\u0E31\u0E0D\u0E2B\u0E32\u0E04\u0E37\u0E2D\u0E2D\u0E30\u0E44\u0E23 AI \u0E08\u0E30\u0E0A\u0E48\u0E27\u0E22\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E23 \u0E43\u0E0A\u0E49\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E41\u0E1A\u0E1A\u0E44\u0E2B\u0E19"
  })), step === 2 && React.createElement("div", {
    className: "form-grid"
  }, PLAN_FIELDS.map(([k, l, max]) => React.createElement(Field, {
    key: k,
    id: "u4-plan-" + k,
    label: l,
    area: k !== "title",
    max: max,
    value: (pj.plan || {})[k],
    onChange: v => setIn("plan", k, v),
    minLen: k === "title" ? 3 : 10,
    placeholder: {
      title: "เช่น Smart Bin ถังขยะบอกทาง",
      problem: "เช่น นักเรียนทิ้งขยะผิดถังบ่อย ทำให้รีไซเคิลไม่ได้",
      objective: "เช่น จำแนกขยะ 3 ประเภทให้ถูกอย่างน้อย 80%",
      users: "เช่น นักเรียนและแม่ครัวในโรงอาหาร",
      data: "เช่น ภาพขยะ 3 ประเภท ประเภทละ 50 ภาพ",
      outcome: "เช่น ลดขยะที่ทิ้งผิดถังลงครึ่งหนึ่ง"
    }[k]
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("span", {
    className: "lbl-txt"
  }, "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49 (\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E14\u0E49\u0E2B\u0E25\u0E32\u0E22\u0E2D\u0E22\u0E48\u0E32\u0E07)"), React.createElement("div", {
    className: "opts"
  }, Object.entries(TOOLS4).map(([id, t]) => {
    const on = ((pj.plan || {}).tools || []).includes(id);
    return React.createElement("button", {
      key: id,
      type: "button",
      className: "opt chip",
      "aria-pressed": on,
      onClick: () => setIn("plan", "tools", on ? (pj.plan.tools || []).filter(x => x !== id) : [...((pj.plan || {}).tools || []), id])
    }, t.name);
  })))), step === 3 && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "form-grid"
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("label", {
    htmlFor: "u4-dtype"
  }, "\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25"), React.createElement("select", {
    id: "u4-dtype",
    className: "input",
    value: pj.dataType || "",
    onChange: e => update({
      dataType: e.target.value
    })
  }, React.createElement("option", {
    value: ""
  }, "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25"), ["ภาพ", "ท่าทางร่างกาย", "ท่าทางมือ", "เสียง", "ข้อความ", "ตัวเลข/ตาราง"].map(x => React.createElement("option", {
    key: x
  }, x)))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", {
    htmlFor: "u4-dpc"
  }, "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E15\u0E48\u0E2D\u0E04\u0E25\u0E32\u0E2A (\u0E27\u0E32\u0E07\u0E41\u0E1C\u0E19)"), React.createElement("input", {
    id: "u4-dpc",
    className: "input mono",
    inputMode: "numeric",
    value: pj.dataPerClass || "",
    onChange: e => update({
      dataPerClass: e.target.value.replace(/\D/g, "").slice(0, 5)
    }),
    placeholder: "\u0E40\u0E0A\u0E48\u0E19 50"
  }), +pj.dataPerClass > 0 && +pj.dataPerClass < 20 && React.createElement("span", {
    className: "hint"
  }, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32 20 \u0E15\u0E48\u0E2D\u0E04\u0E25\u0E32\u0E2A\u0E2D\u0E32\u0E08\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E42\u0E21\u0E40\u0E14\u0E25\u0E44\u0E21\u0E48\u0E41\u0E21\u0E48\u0E19\u0E22\u0E33 \u0E25\u0E2D\u0E07\u0E27\u0E32\u0E07\u0E41\u0E1C\u0E19\u0E40\u0E01\u0E47\u0E1A\u0E40\u0E1E\u0E34\u0E48\u0E21")), React.createElement(Field, {
    id: "u4-classes",
    label: "\u0E23\u0E32\u0E22\u0E0A\u0E37\u0E48\u0E2D\u0E04\u0E25\u0E32\u0E2A",
    value: pj.classes,
    onChange: v => update({
      classes: v
    }),
    max: 200,
    placeholder: "\u0E40\u0E0A\u0E48\u0E19 \u0E02\u0E27\u0E14\u0E1E\u0E25\u0E32\u0E2A\u0E15\u0E34\u0E01, \u0E01\u0E23\u0E30\u0E1B\u0E4B\u0E2D\u0E07, \u0E01\u0E23\u0E30\u0E14\u0E32\u0E29"
  })), React.createElement("div", {
    className: "q-card"
  }, React.createElement("div", {
    className: "act-head"
  }, React.createElement("strong", null, "Data Preparation Checklist"), React.createElement("span", {
    className: "mono hint"
  }, DATA_CHECK.filter(([k]) => (pj.dataCheck || {})[k]).length, "/", DATA_CHECK.length)), React.createElement("div", {
    className: "checklist"
  }, DATA_CHECK.map(([k, l]) => React.createElement(CheckRow, {
    key: k,
    id: "u4-dc-" + k,
    checked: (pj.dataCheck || {})[k],
    onChange: v => setIn("dataCheck", k, v)
  }, l)))), React.createElement(Callout, {
    tone: "warn",
    icon: "lock",
    title: "\u0E04\u0E27\u0E32\u0E21\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27 (PDPA)"
  }, "\u0E16\u0E49\u0E32\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E21\u0E35\u0E20\u0E32\u0E1E\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E2A\u0E35\u0E22\u0E07\u0E02\u0E2D\u0E07\u0E1A\u0E38\u0E04\u0E04\u0E25 \u0E15\u0E49\u0E2D\u0E07\u0E1A\u0E2D\u0E01\u0E27\u0E31\u0E15\u0E16\u0E38\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C\u0E41\u0E25\u0E30\u0E02\u0E2D\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E40\u0E08\u0E49\u0E32\u0E02\u0E2D\u0E07\u0E01\u0E48\u0E2D\u0E19 \u0E43\u0E0A\u0E49\u0E40\u0E17\u0E48\u0E32\u0E17\u0E35\u0E48\u0E08\u0E33\u0E40\u0E1B\u0E47\u0E19 \u0E41\u0E25\u0E30\u0E44\u0E21\u0E48\u0E40\u0E1C\u0E22\u0E41\u0E1E\u0E23\u0E48\u0E20\u0E32\u0E1E\u0E1C\u0E39\u0E49\u0E2D\u0E37\u0E48\u0E19\u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15 \u0E15\u0E32\u0E21\u0E17\u0E35\u0E48\u0E40\u0E23\u0E35\u0E22\u0E19\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E17\u0E35\u0E48 1")), step === 4 && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "tool-grid"
  }, Object.entries(TOOLS4).map(([id, t]) => React.createElement("button", {
    key: id,
    type: "button",
    className: "tool-card pick" + (pj.tool === id ? " on" : ""),
    "aria-pressed": pj.tool === id,
    onClick: () => update({
      tool: id
    })
  }, React.createElement("span", {
    className: "tool-top"
  }, React.createElement("span", {
    className: "tool-ic"
  }, React.createElement(Icon, {
    name: pj.tool === id ? "check" : "cpu",
    size: 18
  })), React.createElement("b", null, t.name)), React.createElement("span", {
    className: "fp"
  }, t.fit)))), pj.tool && React.createElement("div", {
    className: "q-card"
  }, React.createElement("div", {
    className: "act-head"
  }, React.createElement("strong", null, "\u0E04\u0E33\u0E41\u0E19\u0E30\u0E19\u0E33\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A ", TOOLS4[pj.tool].name), React.createElement("a", {
    className: "btn btn-ghost btn-sm",
    href: TOOLS4[pj.tool].url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E19\u0E41\u0E17\u0E47\u0E1A\u0E43\u0E2B\u0E21\u0E48 ", React.createElement(Icon, {
    name: "chevR",
    size: 14
  }))), React.createElement("ol", {
    className: "answer-line"
  }, TOOLS4[pj.tool].tips.map(t => React.createElement("li", {
    key: t
  }, t))), React.createElement("span", {
    className: "hint"
  }, "\u0E07\u0E32\u0E19\u0E17\u0E35\u0E48\u0E17\u0E33\u0E43\u0E19\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E01\u0E31\u0E1A\u0E40\u0E27\u0E47\u0E1A\u0E19\u0E35\u0E49\u0E42\u0E14\u0E22\u0E15\u0E23\u0E07 \u0E43\u0E0A\u0E49 Checklist \u0E41\u0E25\u0E30\u0E25\u0E34\u0E07\u0E01\u0E4C\u0E2B\u0E25\u0E31\u0E01\u0E10\u0E32\u0E19\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E04\u0E27\u0E32\u0E21\u0E04\u0E37\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E14\u0E49\u0E27\u0E22\u0E15\u0E31\u0E27\u0E40\u0E2D\u0E07")), React.createElement("div", {
    className: "q-card"
  }, React.createElement("div", {
    className: "act-head"
  }, React.createElement("strong", null, "Model Development Checklist"), React.createElement("span", {
    className: "mono hint"
  }, BUILD_CHECK.filter(([k]) => (pj.buildCheck || {})[k]).length, "/", BUILD_CHECK.length)), React.createElement("div", {
    className: "checklist"
  }, BUILD_CHECK.map(([k, l]) => React.createElement(CheckRow, {
    key: k,
    id: "u4-bc-" + k,
    checked: (pj.buildCheck || {})[k],
    onChange: v => setIn("buildCheck", k, v)
  }, l, k === "evidence" && !(pj.evidence || []).length ? React.createElement("span", {
    className: "hint",
    style: {
      display: "block"
    }
  }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E25\u0E34\u0E07\u0E01\u0E4C \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E44\u0E14\u0E49\u0E14\u0E49\u0E32\u0E19\u0E25\u0E48\u0E32\u0E07") : null))), React.createElement("div", {
    className: "ev-form"
  }, React.createElement("input", {
    className: "input",
    "aria-label": "\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E25\u0E34\u0E07\u0E01\u0E4C\u0E2B\u0E25\u0E31\u0E01\u0E10\u0E32\u0E19",
    placeholder: "\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22 \u0E40\u0E0A\u0E48\u0E19 \u0E25\u0E34\u0E07\u0E01\u0E4C\u0E42\u0E21\u0E40\u0E14\u0E25",
    maxLength: 80,
    value: ev.label,
    onChange: e => setEv(x => ({
      ...x,
      label: e.target.value
    }))
  }), React.createElement("input", {
    className: "input",
    "aria-label": "URL \u0E2B\u0E25\u0E31\u0E01\u0E10\u0E32\u0E19",
    placeholder: "https://",
    maxLength: 500,
    value: ev.url,
    onChange: e => setEv(x => ({
      ...x,
      url: e.target.value
    }))
  }), React.createElement(Button, {
    size: "sm",
    icon: "check",
    onClick: addEvidence
  }, "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E25\u0E34\u0E07\u0E01\u0E4C")), evErr && React.createElement("span", {
    className: "field-err"
  }, evErr), (pj.evidence || []).length > 0 && React.createElement("span", {
    className: "hint"
  }, "\u0E21\u0E35\u0E25\u0E34\u0E07\u0E01\u0E4C\u0E2B\u0E25\u0E31\u0E01\u0E10\u0E32\u0E19 ", pj.evidence.length, " \u0E25\u0E34\u0E07\u0E01\u0E4C (\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E44\u0E14\u0E49\u0E43\u0E19\u0E41\u0E17\u0E47\u0E1A\u0E20\u0E32\u0E1E\u0E23\u0E27\u0E21\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19)"))), step === 5 && React.createElement("div", {
    className: "form-grid"
  }, React.createElement("div", {
    className: "q-card acc-calc"
  }, React.createElement("strong", null, "\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E17\u0E14\u0E2A\u0E2D\u0E1A"), React.createElement("div", {
    className: "shape-in"
  }, React.createElement("label", {
    className: "hint",
    htmlFor: "u4-tt"
  }, "\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14"), React.createElement("input", {
    id: "u4-tt",
    className: "input mono num",
    inputMode: "numeric",
    value: (pj.test || {}).total || "",
    onChange: e => setIn("test", "total", e.target.value.replace(/\D/g, "").slice(0, 5))
  }), React.createElement("label", {
    className: "hint",
    htmlFor: "u4-tc"
  }, "\u0E16\u0E39\u0E01"), React.createElement("input", {
    id: "u4-tc",
    className: "input mono num",
    inputMode: "numeric",
    value: (pj.test || {}).correct ?? "",
    onChange: e => setIn("test", "correct", e.target.value.replace(/\D/g, "").slice(0, 5))
  }), React.createElement("b", {
    className: "mono"
  }, acc !== null && +(pj.test || {}).correct <= +(pj.test || {}).total ? `Accuracy ${acc}%` : "")), +(pj.test || {}).correct > +(pj.test || {}).total && React.createElement("span", {
    className: "field-err"
  }, "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E17\u0E35\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E17\u0E35\u0E48\u0E17\u0E14\u0E2A\u0E2D\u0E1A"), React.createElement("span", {
    className: "hint"
  }, "\u0E1B\u0E23\u0E30\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E20\u0E32\u0E1E\u0E02\u0E2D\u0E07\u0E42\u0E21\u0E40\u0E14\u0E25\u0E04\u0E33\u0E19\u0E27\u0E13\u0E08\u0E32\u0E01\u0E08\u0E33\u0E19\u0E27\u0E19\u0E17\u0E35\u0E48\u0E40\u0E18\u0E2D\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E08\u0E23\u0E34\u0E07 \u0E43\u0E0A\u0E49\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E2B\u0E21\u0E48\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E43\u0E0A\u0E49\u0E1D\u0E36\u0E01")), TEST_FIELDS.map(([k, l, ph]) => React.createElement(Field, {
    key: k,
    id: "u4-test-" + k,
    label: l,
    area: true,
    value: (pj.test || {})[k],
    onChange: v => setIn("test", k, v),
    minLen: 10,
    max: 1000,
    placeholder: ph
  }))), step === 6 && React.createElement("div", {
    className: "form-grid"
  }, PRESENT_FIELDS.map(([k, l, max]) => React.createElement(Field, {
    key: k,
    id: "u4-pres-" + k,
    label: l,
    area: k !== "name",
    value: (pj.present || {})[k],
    onChange: v => setIn("present", k, v),
    max: max,
    minLen: k === "name" ? 3 : k === "reflection" ? 40 : 10,
    hint: k === "reflection" ? "เช่น เรียนรู้อะไรเกี่ยวกับ AI ทักษะอะไรพัฒนาขึ้น ถ้าทำใหม่จะเปลี่ยนอะไร" : k === "abstract" ? "สรุปทั้งโครงงานใน 3–5 ประโยค" : undefined
  }))), React.createElement("nav", {
    className: "step-nav lesson-nav",
    "aria-label": "\u0E44\u0E1B\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E23\u0E37\u0E2D\u0E16\u0E31\u0E14\u0E44\u0E1B"
  }, step > 1 ? React.createElement(Button, {
    variant: "ghost",
    icon: "chevL",
    onClick: () => goStep(step - 1)
  }, "\u0E02\u0E31\u0E49\u0E19\u0E17\u0E35\u0E48 ", step - 1) : React.createElement("span", null), step < 6 ? React.createElement(Button, {
    iconRight: "chevR",
    onClick: () => goStep(step + 1)
  }, "\u0E02\u0E31\u0E49\u0E19\u0E17\u0E35\u0E48 ", step + 1, ": ", U4_STEPS[step].th) : React.createElement(Button, {
    iconRight: "chevR",
    onClick: () => setTab("eval")
  }, "\u0E44\u0E1B\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E15\u0E19\u0E40\u0E2D\u0E07"))), tab === "eval" && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "lesson-head"
  }, React.createElement("span", {
    className: "eyebrow"
  }, "Project Evaluation \xB7 20 \u0E04\u0E30\u0E41\u0E19\u0E19"), React.createElement("h2", null, "\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E1C\u0E25\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19")), React.createElement(Callout, {
    tone: "warn",
    icon: "info",
    title: "\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E15\u0E19\u0E40\u0E2D\u0E07 \u0E01\u0E31\u0E1A \u0E04\u0E30\u0E41\u0E19\u0E19\u0E08\u0E32\u0E01\u0E04\u0E23\u0E39 \u0E41\u0E22\u0E01\u0E01\u0E31\u0E19"
  }, "\u0E0A\u0E48\u0E2D\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E15\u0E19\u0E40\u0E2D\u0E07\u0E43\u0E2B\u0E49\u0E19\u0E31\u0E01\u0E40\u0E23\u0E35\u0E22\u0E19\u0E2A\u0E30\u0E17\u0E49\u0E2D\u0E19\u0E04\u0E38\u0E13\u0E20\u0E32\u0E1E\u0E07\u0E32\u0E19\u0E14\u0E49\u0E27\u0E22\u0E40\u0E01\u0E13\u0E11\u0E4C\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E31\u0E1A\u0E04\u0E23\u0E39 \u0E2A\u0E48\u0E27\u0E19\u0E04\u0E30\u0E41\u0E19\u0E19\u0E08\u0E32\u0E01\u0E04\u0E23\u0E39\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E43\u0E19\u0E42\u0E2B\u0E21\u0E14\u0E17\u0E14\u0E25\u0E2D\u0E07 \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E30\u0E1A\u0E1A\u0E2A\u0E48\u0E07\u0E07\u0E32\u0E19\u0E16\u0E36\u0E07\u0E04\u0E23\u0E39 \u0E19\u0E31\u0E01\u0E40\u0E23\u0E35\u0E22\u0E19\u0E08\u0E36\u0E07\u0E01\u0E23\u0E2D\u0E01\u0E04\u0E30\u0E41\u0E19\u0E19\u0E04\u0E23\u0E39\u0E40\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 \u0E41\u0E25\u0E30\u0E07\u0E32\u0E19\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E16\u0E39\u0E01\u0E2A\u0E48\u0E07\u0E44\u0E1B\u0E17\u0E35\u0E48\u0E43\u0E14"), React.createElement("div", {
    className: "table-wrap"
  }, React.createElement("table", {
    className: "hist rubric"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "\u0E40\u0E01\u0E13\u0E11\u0E4C (\u0E04\u0E30\u0E41\u0E19\u0E19)"), LEVELS.map((l, i) => React.createElement("th", {
    key: l
  }, l)))), React.createElement("tbody", null, RUBRIC.map(r => React.createElement("tr", {
    key: r.id
  }, React.createElement("td", null, React.createElement("b", null, r.name), React.createElement("span", {
    className: "hint mono",
    style: {
      display: "block"
    }
  }, r.max, " \u0E04\u0E30\u0E41\u0E19\u0E19")), r.levels.map((d, i) => React.createElement("td", {
    key: i
  }, React.createElement("span", {
    className: "mono rb-pt"
  }, (r.max * LEVEL_FRAC[i]).toString()), d))))))), React.createElement("div", {
    className: "eval-grid"
  }, RUBRIC.map(r => React.createElement("fieldset", {
    key: r.id,
    className: "q-card"
  }, React.createElement("legend", {
    className: "q-title"
  }, r.name, " ", React.createElement("span", {
    className: "hint"
  }, "(", r.max, " \u0E04\u0E30\u0E41\u0E19\u0E19)")), React.createElement("div", {
    className: "opts",
    role: "radiogroup",
    "aria-label": `ประเมินตนเอง ${r.name}`
  }, LEVELS.map((l, i) => React.createElement("button", {
    key: l,
    type: "button",
    role: "radio",
    "aria-checked": (se[r.id] || {}).level === i,
    className: "opt chip",
    onClick: () => setSe(r.id, {
      level: i
    })
  }, l, " \xB7 ", r.max * LEVEL_FRAC[i]))), React.createElement("textarea", {
    className: "input ta",
    rows: "2",
    maxLength: 500,
    "aria-label": `เหตุผลการประเมิน ${r.name}`,
    placeholder: "\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25/\u0E2B\u0E25\u0E31\u0E01\u0E10\u0E32\u0E19\u0E17\u0E35\u0E48\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E19\u0E35\u0E49",
    value: (se[r.id] || {}).why || "",
    onChange: e => setSe(r.id, {
      why: e.target.value
    })
  }), React.createElement("div", {
    className: "score-pair"
  }, React.createElement("span", null, "\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E15\u0E19\u0E40\u0E2D\u0E07: ", React.createElement("b", {
    className: "mono"
  }, (se[r.id] || {}).level !== undefined ? r.max * LEVEL_FRAC[se[r.id].level] : "–")), React.createElement("span", {
    className: "hint"
  }, "\u0E04\u0E30\u0E41\u0E19\u0E19\u0E08\u0E32\u0E01\u0E04\u0E23\u0E39: ", React.createElement("b", {
    className: "mono"
  }, "\u2013"), " (\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49)"))))), React.createElement("div", {
    className: "sum-row"
  }, React.createElement("div", null, React.createElement("span", {
    className: "hint"
  }, "\u0E23\u0E27\u0E21\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E15\u0E19\u0E40\u0E2D\u0E07"), React.createElement("b", {
    className: "mono"
  }, selfScore(pj.selfEval).toFixed(1), " / 20")), React.createElement("div", null, React.createElement("span", {
    className: "hint"
  }, "\u0E04\u0E30\u0E41\u0E19\u0E19\u0E08\u0E32\u0E01\u0E04\u0E23\u0E39"), React.createElement("b", {
    className: "mono"
  }, "\u2013 / 20"), React.createElement("span", {
    className: "hint"
  }, "\u0E42\u0E2B\u0E21\u0E14\u0E17\u0E14\u0E25\u0E2D\u0E07 \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E2A\u0E48\u0E07\u0E07\u0E32\u0E19")), evalDone(pj.selfEval) ? React.createElement(Badge, {
    tone: "ok",
    dot: true
  }, "\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E15\u0E19\u0E40\u0E2D\u0E07\u0E04\u0E23\u0E1A\u0E41\u0E25\u0E49\u0E27") : React.createElement(Badge, {
    dot: true
  }, "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E41\u0E25\u0E30\u0E40\u0E02\u0E35\u0E22\u0E19\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A 4 \u0E14\u0E49\u0E32\u0E19"))), tab === "gallery" && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "lesson-head"
  }, React.createElement("span", {
    className: "eyebrow"
  }, "Project Showcase"), React.createElement("h2", null, "\u0E41\u0E01\u0E25\u0E40\u0E25\u0E2D\u0E23\u0E35\u0E44\u0E2D\u0E40\u0E14\u0E35\u0E22\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19 AI")), React.createElement(Callout, {
    tone: "info",
    icon: "info",
    title: "\u0E19\u0E35\u0E48\u0E04\u0E37\u0E2D\u0E41\u0E19\u0E27\u0E04\u0E34\u0E14\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19 \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E1C\u0E25\u0E07\u0E32\u0E19\u0E08\u0E23\u0E34\u0E07\u0E02\u0E2D\u0E07\u0E19\u0E31\u0E01\u0E40\u0E23\u0E35\u0E22\u0E19"
  }, "\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E17\u0E31\u0E49\u0E07 6 \u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E40\u0E02\u0E35\u0E22\u0E19\u0E02\u0E36\u0E49\u0E19\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E1B\u0E47\u0E19\u0E41\u0E23\u0E07\u0E1A\u0E31\u0E19\u0E14\u0E32\u0E25\u0E43\u0E08 \u0E1C\u0E25\u0E25\u0E31\u0E1E\u0E18\u0E4C\u0E17\u0E35\u0E48\u0E23\u0E30\u0E1A\u0E38\u0E40\u0E1B\u0E47\u0E19 \"\u0E1C\u0E25\u0E17\u0E35\u0E48\u0E04\u0E32\u0E14\u0E2B\u0E27\u0E31\u0E07\" \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E1C\u0E25\u0E17\u0E35\u0E48\u0E27\u0E31\u0E14\u0E44\u0E14\u0E49\u0E08\u0E23\u0E34\u0E07"), React.createElement("div", {
    className: "show-grid"
  }, SHOWCASE.map(x => React.createElement("article", {
    key: x.id,
    className: "show-card"
  }, React.createElement(ShowArt, {
    kind: x.art
  }), React.createElement("div", {
    className: "show-body"
  }, React.createElement("span", {
    className: "badge demo"
  }, "\u0E41\u0E19\u0E27\u0E04\u0E34\u0E14\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19"), React.createElement("h3", null, x.name), React.createElement("p", null, React.createElement("b", null, "\u0E27\u0E31\u0E15\u0E16\u0E38\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C:"), " ", x.obj), React.createElement("p", null, React.createElement("b", null, "\u0E40\u0E17\u0E04\u0E42\u0E19\u0E42\u0E25\u0E22\u0E35:"), " ", x.tech), React.createElement("ol", {
    className: "answer-line"
  }, x.steps.map(s => React.createElement("li", {
    key: s
  }, s))), React.createElement("p", null, React.createElement("b", null, "\u0E1C\u0E25\u0E25\u0E31\u0E1E\u0E18\u0E4C\u0E17\u0E35\u0E48\u0E04\u0E32\u0E14\u0E2B\u0E27\u0E31\u0E07:"), " ", x.expect)))))), tab === "report" && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "lesson-head"
  }, React.createElement("span", {
    className: "eyebrow"
  }, "Project Summary"), React.createElement("h2", null, "\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E2A\u0E23\u0E38\u0E1B\u0E42\u0E04\u0E23\u0E07\u0E07\u0E32\u0E19"), React.createElement("span", {
    className: "hint"
  }, "\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E08\u0E32\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E01\u0E23\u0E2D\u0E01\u0E43\u0E19 6 \u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19 \u0E41\u0E01\u0E49\u0E44\u0E02\u0E44\u0E14\u0E49\u0E17\u0E35\u0E48\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E19\u0E31\u0E49\u0E19 \u0E46")), React.createElement(ReportView, {
    pj: pj,
    student: student
  }))));
}


export default Unit4Page;
export { Unit4Page };
