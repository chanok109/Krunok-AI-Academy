import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Icon, AIraBot, GlassCard, Button, Badge, ProgressBar, ProgressRing } from '../components/UIPrimitives.jsx';
import { AiraTip, Callout, Feedback, FlipCard, Accordion, Celebrate, Modal, ActScore, ActResult, CodeBlock } from '../components/UIHelpers.jsx';
import { UnitCoursePage } from '../components/UnitCoursePage.jsx';
import { HoloStage } from '../components/BackgroundEffects.jsx';
import { SAMPLES, RECORDED, ROBOT_ART, ROBOT_PAL } from '../data/unit2Data.js';
import {
  FRUIT_FEATURES,
  FRUIT_CLASSES,
  FRUIT_SPEC,
  IMG_CLASSES,
  POSE_CLASSES,
  KP_NAMES,
  POSE_PRESETS,
  HAND_CLASSES,
  FINGERS,
  HAND_PRESETS,
  GROUND_TRUTH,
  ML_TOOLS,
  U3_OBJECTIVES,
  U3_ITEMS,
  U3_SEQ,
  U3_GROUPS,
  U3_REFS,
  PREP_ERRORS,
  U3_QUIZ
} from '../data/unit3Data.js';

function ProcessingBadge({ text }) {
  return React.createElement(
    "span",
    { className: "badge cyan" },
    React.createElement("span", { className: "dot" }),
    text
  );
}

const u3ImgCache = {};
function loadImageEl(url) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => rej(new Error("โหลดภาพไม่สำเร็จ"));
    im.src = url;
  });
}
function elToData(im, maxDim) {
  const w = im.naturalWidth || im.width;
  const h = im.naturalHeight || im.height;
  const s = maxDim && Math.max(w, h) > maxDim ? maxDim / Math.max(w, h) : 1;
  const cw = Math.max(1, Math.round(w * s));
  const ch = Math.max(1, Math.round(h * s));
  const c = document.createElement("canvas");
  c.width = cw;
  c.height = ch;
  const ctx = c.getContext("2d");
  ctx.drawImage(im, 0, 0, cw, ch);
  const d = ctx.getImageData(0, 0, cw, ch);
  return {
    img: { width: cw, height: ch, data: new Uint8ClampedArray(d.data) },
    orig: { w, h },
    scaled: s < 1
  };
}
function makeRobotImg() {
  const img = { width: 16, height: 16, data: new Uint8ClampedArray(16 * 16 * 4) };
  ROBOT_ART.forEach((row, y) => [...row].forEach((ch, x) => {
    const [r, g, b] = ROBOT_PAL[ch];
    const o = (y * 16 + x) * 4;
    img.data[o] = r;
    img.data[o + 1] = g;
    img.data[o + 2] = b;
    img.data[o + 3] = 255;
  }));
  return img;
}
async function loadSample(id, maxDim) {
  const key = id + ":" + (maxDim || 0);
  if (u3ImgCache[key]) return u3ImgCache[key];
  if (id === "robot") {
    return (u3ImgCache[key] = { img: makeRobotImg(), orig: { w: 16, h: 16 }, scaled: false });
  }
  const s = SAMPLES.find(x => x.id === id);
  const el = await loadImageEl(s.url);
  return (u3ImgCache[key] = { ...elToData(el, maxDim), el });
}
async function loadFile(file, maxDim) {
  if (!file || !/^image\/(png|jpe?g|webp|gif|bmp)$/.test(file.type)) {
    throw new Error("รองรับเฉพาะไฟล์ภาพ PNG, JPG, WEBP, GIF หรือ BMP");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("ไฟล์ใหญ่เกิน 10 MB ลองย่อภาพก่อน");
  }
  const url = URL.createObjectURL(file);
  try {
    const el = await loadImageEl(url);
    return { ...elToData(el, maxDim), el };
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

const TFJS_URL = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js";
const COCO_URL = "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js";
const COCO_MODEL_URL = "models/coco-ssd/model.json";
function loadExtScript(src) {
  return new Promise((res, rej) => {
    const ex = document.querySelector(`script[data-src="${src}"]`);
    if (ex) {
      if (ex.dataset.ok) return res();
      ex.addEventListener("load", () => res());
      ex.addEventListener("error", () => rej(new Error("โหลดไลบรารีไม่สำเร็จ")));
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.dataset.src = src;
    s.async = true;
    s.onload = () => { s.dataset.ok = "1"; res(); };
    s.onerror = () => rej(new Error("โหลดไลบรารีไม่สำเร็จ"));
    document.head.appendChild(s);
  });
}
let u3DetectorPromise = null;
function getDetector() {
  if (!u3DetectorPromise) {
    u3DetectorPromise = (async () => {
      await loadExtScript(TFJS_URL);
      await loadExtScript(COCO_URL);
      await window.tf.ready();
      const model = await window.cocoSsd.load({ modelUrl: COCO_MODEL_URL });
      return { model, backend: window.tf.getBackend() };
    })();
    u3DetectorPromise.catch(() => { u3DetectorPromise = null; });
  }
  return u3DetectorPromise;
}

function LabShell({ unitId, labId, objective, steps: baseSteps, children, question, reflection }) {
  const { saveActivity, saveReflection, progress } = useApp();
  const [refl, setRefl] = useState(() => (progress[unitId].reflections || {})[labId] || "");
  const steps = reflection
    ? [...baseSteps, { id: "refl", text: "ตอบคำถาม Reflection ด้วยความคิดของตัวเอง (อย่างน้อย 1 ประโยค)", done: refl.trim().length >= 15 }]
    : baseSteps;
  const done = progress[unitId].completedActivities.includes(labId);
  const best = progress[unitId].activityScores[labId];
  const [pick, setPick] = useState(null);
  const [checked, setChecked] = useState(false);
  const [firstTry, setFirstTry] = useState(null);
  const [saved, setSaved] = useState(false);
  const stepsDone = steps.filter(s => s.done).length;
  const qOk = checked && pick === question.answer;
  const allDone = stepsDone === steps.length && qOk;
  const max = steps.length + 1;
  useEffect(() => {
    if (allDone && !saved) {
      setSaved(true);
      if (reflection) saveReflection(unitId, labId, refl);
      saveActivity(unitId, labId, steps.length + (firstTry ? 1 : 0), max);
    }
  }, [allDone]);
  const check = () => {
    setChecked(true);
    if (firstTry === null) setFirstTry(pick === question.answer);
  };
  return React.createElement(
    "div",
    { className: "act lab" },
    React.createElement(
      "div",
      { className: "lab-meta" },
      React.createElement("div", { className: "lab-obj" }, React.createElement("span", { className: "eyebrow" }, "วัตถุประสงค์"), React.createElement("p", null, objective)),
      done && React.createElement(Badge, { tone: "ok", dot: true }, "ทำ Lab นี้สำเร็จแล้ว", best ? ` · ${best.best}/${best.max}` : "")
    ),
    React.createElement(
      "div",
      { className: "q-card" },
      React.createElement("div", { className: "act-head" }, React.createElement("strong", null, "คำสั่ง"), React.createElement("span", { className: "mono hint" }, stepsDone, "/", steps.length, " ขั้นตอน")),
      React.createElement(
        "ol",
        { className: "steps" },
        steps.map((s, i) =>
          React.createElement(
            "li",
            { key: s.id, className: s.done ? "done" : "" },
            React.createElement("span", { className: "step-ic" }, s.done ? React.createElement(Icon, { name: "check", size: 14 }) : i + 1),
            React.createElement("span", null, s.text, s.status && React.createElement("span", { className: "hint", style: { display: "block" } }, s.status))
          )
        )
      )
    ),
    children,
    reflection &&
      React.createElement(
        "div",
        { className: "q-card refl" },
        React.createElement("label", { htmlFor: labId + "-refl", className: "q-title" }, "Reflection: ", reflection),
        React.createElement("textarea", {
          id: labId + "-refl",
          className: "input ta",
          rows: "3",
          maxLength: 2000,
          value: refl,
          onChange: e => setRefl(e.target.value),
          onBlur: () => saveReflection(unitId, labId, refl),
          placeholder: "เขียนสิ่งที่สังเกตและเหตุผลของเธอ"
        }),
        React.createElement("span", { className: "hint" }, "บันทึกไว้ในเบราว์เซอร์นี้ · ", refl.trim().length, " ตัวอักษร")
      ),
    React.createElement(
      "fieldset",
      { className: "q-card part" },
      React.createElement("legend", { className: "q-title" }, "คำถามท้าย Lab: ", question.q),
      question.code && React.createElement(CodeBlock, { code: question.code }),
      React.createElement(
        "div",
        { className: "opts col" },
        question.options.map(o =>
          React.createElement(
            "button",
            {
              key: o.id,
              type: "button",
              className: "opt " + (checked ? (o.id === question.answer && pick === o.id ? "is-correct" : pick === o.id ? "is-wrong" : "") : ""),
              "aria-pressed": pick === o.id,
              disabled: qOk,
              onClick: () => { setPick(o.id); setChecked(false); }
            },
            o.text
          )
        )
      ),
      !qOk && React.createElement(Button, { size: "sm", icon: "check", disabled: !pick, onClick: check, style: { justifySelf: "start" } }, "ตรวจคำตอบ"),
      checked && React.createElement(Feedback, { tone: qOk ? "good" : "bad", title: qOk ? "ถูกต้อง" : "ยังไม่ถูก ลองเลือกใหม่อีกครั้ง" }, qOk ? question.explain : question.hint)
    ),
    allDone
      ? React.createElement(
          "div",
          { className: "result", role: "status" },
          React.createElement("div", { className: "bot" }, React.createElement(AIraBot, { mood: "cheer", float: false, title: "" })),
          React.createElement(
            "div",
            { style: { flex: "1 1 220px", display: "grid", gap: 4 } },
            React.createElement("strong", { style: { fontSize: 18 } }, "Lab สำเร็จ! บันทึกความก้าวหน้าแล้ว"),
            React.createElement("span", { style: { color: "var(--muted)", fontSize: 14 } }, "ได้ ", steps.length + (firstTry ? 1 : 0), "/", max, " คะแนน")
          )
        )
      : React.createElement("span", { className: "hint" }, "ทำขั้นตอนให้ครบและตอบคำถามท้าย Lab ให้ถูก ระบบจะบันทึกว่า Lab สำเร็จ")
  );
}

const ML = {
  rng(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0;
      a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  },
  shuffle(arr, seed) {
    const r = ML.rng(seed),
      a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  split(items, trainRatio, seed, labelOf = x => x.label) {
    const by = {};
    items.forEach(x => {
      (by[labelOf(x)] = by[labelOf(x)] || []).push(x);
    });
    const train = [],
      test = [];
    Object.keys(by).sort().forEach((k, ki) => {
      const g = ML.shuffle(by[k], seed + ki * 101);
      const n = Math.max(1, Math.min(g.length - 1, Math.round(g.length * trainRatio)));
      train.push(...g.slice(0, n));
      test.push(...g.slice(n));
    });
    return {
      train,
      test
    };
  },
  scaler(rows) {
    const d = rows[0].length,
      mn = Array(d).fill(Infinity),
      mx = Array(d).fill(-Infinity);
    rows.forEach(r => r.forEach((v, i) => {
      if (v < mn[i]) mn[i] = v;
      if (v > mx[i]) mx[i] = v;
    }));
    return r => r.map((v, i) => mx[i] > mn[i] ? (v - mn[i]) / (mx[i] - mn[i]) : 0);
  },
  dist(a, b) {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += (a[i] - b[i]) ** 2;
    return Math.sqrt(s);
  },
  train(examples, {
    scale = true,
    weighted = false
  } = {}) {
    const f = scale && examples.length ? ML.scaler(examples.map(e => e.x)) : r => r;
    return {
      f,
      weighted,
      ex: examples.map(e => ({
        ...e,
        z: f(e.x)
      }))
    };
  },
  predict(model, x, k, weighted = model && model.weighted) {
    if (!model || !model.ex.length) return null;
    const z = model.f(x);
    const nb = model.ex.map((e, i) => ({
      i,
      d: ML.dist(z, e.z),
      label: e.label
    })).sort((a, b) => a.d - b.d || a.i - b.i).slice(0, Math.min(k, model.ex.length));
    const votes = {};
    nb.forEach(n => {
      votes[n.label] = (votes[n.label] || 0) + (weighted ? 1 / (n.d + 1e-3) : 1);
    });
    if (weighted) {
      const t = Object.values(votes).reduce((a, b) => a + b, 0);
      Object.keys(votes).forEach(l => {
        votes[l] = votes[l] / t * nb.length;
      });
    }
    const best = Object.keys(votes).sort((a, b) => votes[b] - votes[a] || nb.findIndex(n => n.label === a) - nb.findIndex(n => n.label === b))[0];
    return {
      label: best,
      confidence: votes[best] / nb.length,
      votes,
      neighbors: nb
    };
  },
  evaluate(model, test, k, labels) {
    const cm = {};
    labels.forEach(a => {
      cm[a] = {};
      labels.forEach(b => {
        cm[a][b] = 0;
      });
    });
    const preds = test.map(t => {
      const p = ML.predict(model, t.x, k);
      if (cm[t.label] && p) cm[t.label][p.label] = (cm[t.label][p.label] || 0) + 1;
      return {
        item: t,
        pred: p,
        ok: p && p.label === t.label
      };
    });
    const correct = preds.filter(p => p.ok).length;
    return {
      acc: test.length ? correct / test.length : 0,
      correct,
      total: test.length,
      cm,
      preds
    };
  },
  iou(a, b) {
    const x1 = Math.max(a[0], b[0]),
      y1 = Math.max(a[1], b[1]),
      x2 = Math.min(a[0] + a[2], b[0] + b[2]),
      y2 = Math.min(a[1] + a[3], b[1] + b[3]);
    const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1),
      uni = a[2] * a[3] + b[2] * b[3] - inter;
    return uni > 0 ? inter / uni : 0;
  },
  matchDetections(preds, gts, iouTh = 0.5) {
    const used = new Set();
    const rows = [...preds].sort((a, b) => b.score - a.score).map(p => {
      let bi = -1,
        bv = 0;
      gts.forEach((g, gi) => {
        if (used.has(gi) || g.class !== p.class) return;
        const v = ML.iou(p.bbox, g.bbox);
        if (v > bv) {
          bv = v;
          bi = gi;
        }
      });
      if (bi >= 0 && bv >= iouTh) {
        used.add(bi);
        return {
          ...p,
          kind: "TP",
          iou: bv,
          gt: bi
        };
      }
      return {
        ...p,
        kind: "FP",
        iou: bv
      };
    });
    const fn = gts.map((g, gi) => ({
      ...g,
      gi
    })).filter(g => !used.has(g.gi));
    const tp = rows.filter(r => r.kind === "TP").length;
    return {
      rows,
      fn,
      tp,
      fp: rows.length - tp,
      fnCount: fn.length,
      precision: rows.length ? tp / rows.length : null,
      recall: gts.length ? tp / gts.length : null
    };
  }
};

function makeFruits(perClass = 20, seed = 32281) {
  const r = ML.rng(seed),
    out = [];
  FRUIT_CLASSES.forEach(c => {
    for (let i = 0; i < perClass; i++) {
      const s = FRUIT_SPEC[c.id],
        g = (lo, hi) => lo + (hi - lo) * (0.5 * r() + 0.5 * r());
      const v = {
        mass: Math.round(g(...s.mass)),
        width: +g(...s.width).toFixed(1),
        height: +g(...s.height).toFixed(1),
        color: +g(...s.color).toFixed(2)
      };
      out.push({
        id: `${c.id}-${i + 1}`,
        label: c.id,
        trueLabel: c.id,
        v
      });
    }
  });
  return out;
}
const fruitX = (f, feats) => feats.map(k => f.v[k]);
function imageFeatures(img) {
  const {
      width: w,
      height: h,
      data: d
    } = img,
    hue = Array(12).fill(0),
    lum = Array(4).fill(0),
    grid = Array(16).fill(0),
    gc = Array(16).fill(0);
  let n = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const o = (y * w + x) * 4,
      r = d[o] / 255,
      g = d[o + 1] / 255,
      b = d[o + 2] / 255;
    const mx = Math.max(r, g, b),
      mn = Math.min(r, g, b),
      c = mx - mn,
      L = 0.299 * r + 0.587 * g + 0.114 * b;
    let hh = 0;
    if (c > 0) {
      hh = mx === r ? (g - b) / c % 6 : mx === g ? (b - r) / c + 2 : (r - g) / c + 4;
      hh = (hh * 60 + 360) % 360;
    }
    const sat = mx > 0 ? c / mx : 0;
    hue[Math.floor(hh / 30) % 12] += sat;
    lum[Math.min(3, Math.floor(L * 4))] += 1;
    const gi = Math.min(3, Math.floor(y / h * 4)) * 4 + Math.min(3, Math.floor(x / w * 4));
    grid[gi] += L;
    gc[gi]++;
    n++;
  }
  const hs = hue.reduce((a, b) => a + b, 0) || 1;
  return [...hue.map(v => v / hs), ...lum.map(v => v / n), ...grid.map((v, i) => v / (gc[i] || 1))];
}
const pct = v => v === null || v === undefined ? "–" : Math.round(v * 100) + "%";
const clsName = (list, id) => (list.find(c => c.id === id) || {
  name: id
}).name;
const clsColor = (list, id) => (list.find(c => c.id === id) || {
  color: "#9B87F5"
}).color;
function MLStage() {
  const L = [[40, [50, 110, 170]], [130, [30, 80, 130, 180]], [220, [55, 105, 155]], [300, [80, 130]]];
  const E = L.slice(0, -1).flatMap(([x1, a], i) => a.flatMap(y1 => L[i + 1][1].map(y2 => [x1, y1, L[i + 1][0], y2])));
  return React.createElement("div", {
    className: "ml-stage"
  }, React.createElement("svg", {
    viewBox: "0 0 340 210",
    className: "ml-net",
    "aria-hidden": "true"
  }, E.map(([a, b, c, d], i) => React.createElement("line", {
    key: i,
    x1: a,
    y1: b,
    x2: c,
    y2: d,
    stroke: "rgba(155,135,245,.22)"
  })), E.filter((_, i) => i % 4 === 0).map(([a, b, c, d], i) => React.createElement("line", {
    key: "f" + i,
    className: "art-flow",
    x1: a,
    y1: b,
    x2: c,
    y2: d,
    stroke: "#00E5FF",
    strokeWidth: "2",
    strokeLinecap: "round",
    style: {
      animationDelay: -i * 0.35 + "s"
    }
  })), L.map(([x, ys], li) => ys.map(y => React.createElement("circle", {
    key: li + "-" + y,
    cx: x,
    cy: y,
    r: "8",
    fill: "#161336",
    stroke: li === 3 ? "#FFD66D" : li === 0 ? "#00E5FF" : "#9B87F5",
    strokeWidth: "2.4"
  }))), React.createElement("text", {
    x: "300",
    y: "60",
    textAnchor: "middle",
    fontSize: "10",
    fill: "#FFD66D",
    fontFamily: "JetBrains Mono, monospace"
  }, "\u0E41\u0E2D\u0E1B\u0E40\u0E1B\u0E34\u0E25")), React.createElement("div", {
    className: "ds-cards",
    "aria-hidden": "true"
  }, [["แอปเปิล", "#FF7A90", "172 g · 0.86"], ["ส้ม", "#FFB547", "205 g · 0.71"], ["เลมอน", "#E8E26A", "118 g · 0.60"]].map(([n, c, v], i) => React.createElement("span", {
    key: n,
    className: "ds-card",
    style: {
      "--c": c,
      animationDelay: -i * 1.4 + "s"
    }
  }, React.createElement("b", null, n), React.createElement("span", {
    className: "mono"
  }, v)))), React.createElement("div", {
    className: "vs-bot ml-bot"
  }, React.createElement(AIraBot, {
    mood: "happy",
    title: "AIra \u0E1C\u0E39\u0E49\u0E0A\u0E48\u0E27\u0E22\u0E1D\u0E36\u0E01\u0E42\u0E21\u0E40\u0E14\u0E25"
  }), React.createElement("span", {
    className: "vs-badge"
  }, "ML TRAINING ASSISTANT")));
}
const ML_PIPE = [{
  id: "data",
  icon: "grid",
  t: "Data",
  th: "ข้อมูล",
  d: "รวบรวมตัวอย่างจำนวนมาก แต่ละตัวอย่างมีคุณลักษณะ (Feature) และในการเรียนรู้แบบมีผู้สอนต้องมีคำตอบ (Label) กำกับ เช่น ผลไม้ 60 ลูกที่ชั่งน้ำหนัก วัดขนาด และบอกชื่อชนิดไว้"
}, {
  id: "prep",
  icon: "check",
  t: "Data Preparation",
  th: "เตรียมข้อมูล",
  d: "ตรวจ Label ที่ผิด ลบข้อมูลซ้ำหรือเสีย ทำให้แต่ละคลาสมีจำนวนพอ ๆ กัน และแบ่งเป็นข้อมูลฝึก (Training) กับข้อมูลทดสอบ (Testing) เช่น 80 : 20"
}, {
  id: "train",
  icon: "cpu",
  t: "Training",
  th: "ฝึกโมเดล",
  d: "ให้อัลกอริทึมเรียนรู้ความสัมพันธ์ระหว่าง Feature กับ Label จากข้อมูลฝึกเท่านั้น โมเดลแต่ละแบบเรียนรู้ต่างกัน เช่น kNN จดจำตัวอย่าง โครงข่ายประสาทปรับค่าน้ำหนัก"
}, {
  id: "model",
  icon: "puzzle",
  t: "Model",
  th: "โมเดล",
  d: "ผลลัพธ์จากการฝึก คือ 'กฎ' หรือค่าตัวเลขที่ใช้แปลง Feature ใหม่ให้เป็นคำตอบ โมเดลเก่งได้เท่าที่ข้อมูลฝึกสอนมา"
}, {
  id: "test",
  icon: "target",
  t: "Testing",
  th: "ทดสอบ",
  d: "วัดผลกับข้อมูลทดสอบที่โมเดลไม่เคยเห็น แล้วคำนวณความแม่นยำ (Accuracy) = จำนวนที่ทำนายถูก ÷ จำนวนทั้งหมด ถ้าทดสอบกับข้อมูลฝึกเอง ผลจะดูดีเกินจริง"
}, {
  id: "pred",
  icon: "sparkle",
  t: "Prediction",
  th: "ทำนาย",
  d: "นำโมเดลไปใช้กับข้อมูลใหม่จริง โมเดลตอบคำตอบพร้อมค่าความมั่นใจ (Confidence) และควรติดตามผลต่อเนื่องว่ายังแม่นยำอยู่หรือไม่"
}];
function MLPipeline() {
  const [step, setStep] = useState("data");
  const s = ML_PIPE.find(x => x.id === step);
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "pipe",
    role: "tablist",
    "aria-label": "\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E01\u0E32\u0E23\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E42\u0E21\u0E40\u0E14\u0E25 Machine Learning"
  }, ML_PIPE.map((x, i) => React.createElement(React.Fragment, {
    key: x.id
  }, React.createElement("button", {
    type: "button",
    role: "tab",
    "aria-selected": step === x.id,
    className: "pipe-step",
    onClick: () => setStep(x.id)
  }, React.createElement("span", {
    className: "pipe-ic"
  }, React.createElement(Icon, {
    name: x.icon,
    size: 20
  })), React.createElement("span", {
    className: "mono hint"
  }, i + 1), x.t), i < ML_PIPE.length - 1 && React.createElement("span", {
    className: "pipe-arrow",
    "aria-hidden": "true"
  }, React.createElement(Icon, {
    name: "chevR",
    size: 18
  }))))), React.createElement("div", {
    className: "glass tl-card one",
    key: step,
    role: "tabpanel"
  }, React.createElement("div", {
    style: {
      display: "grid",
      gap: 6
    }
  }, React.createElement("b", null, s.t, " \xB7 ", s.th), React.createElement("p", null, s.d))));
}
function ScatterPlot({
  items,
  feats,
  classes,
  model,
  k,
  query,
  pred,
  onPick,
  highlight,
  onPoint,
  showRegions = true
}) {
  const W = 360,
    H = 260,
    P = 36;
  const fx = FRUIT_FEATURES.find(f => f.id === feats[0]),
    fy = FRUIT_FEATURES.find(f => f.id === feats[1]);
  const sx = v => P + (v - fx.min) / (fx.max - fx.min) * (W - P - 10),
    sy = v => H - P - (v - fy.min) / (fy.max - fy.min) * (H - P - 10);
  const inv = (px, py) => [fx.min + (px - P) / (W - P - 10) * (fx.max - fx.min), fy.min + (H - P - py) / (H - P - 10) * (fy.max - fy.min)];
  const cells = useMemo(() => {
    if (!model || !showRegions) return [];
    const out = [],
      nx = 36,
      ny = 22,
      cw = (W - P - 10) / nx,
      ch = (H - P - 10) / ny;
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const [vx, vy] = inv(P + (i + 0.5) * cw, 10 + (j + 0.5) * ch);
      const p = ML.predict(model, [vx, vy], k);
      out.push({
        x: P + i * cw,
        y: 10 + j * ch,
        w: cw + 0.5,
        h: ch + 0.5,
        c: clsColor(classes, p.label)
      });
    }
    return out;
  }, [model, k, feats, showRegions]);
  const ticks = (f, n = 4) => Array.from({
    length: n + 1
  }, (_, i) => f.min + (f.max - f.min) * i / n);
  const click = e => {
    if (!onPick) return;
    const svg = e.currentTarget,
      r = svg.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width * W,
      py = (e.clientY - r.top) / r.height * H;
    if (px < P || py > H - P) return;
    const [vx, vy] = inv(px, py);
    onPick([+vx.toFixed(fx.id === "color" ? 2 : fx.id === "mass" ? 0 : 1), +vy.toFixed(fy.id === "color" ? 2 : fy.id === "mass" ? 0 : 1)]);
  };
  const fmt = (f, v) => f.id === "color" ? v.toFixed(1) : Math.round(v);
  return React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    className: "scatter",
    onClick: click,
    role: "img",
    "aria-label": `กราฟกระจาย ${fx.name} กับ ${fy.name}`,
    style: {
      cursor: onPick ? "crosshair" : "default"
    }
  }, React.createElement("rect", {
    x: P,
    y: "10",
    width: W - P - 10,
    height: H - P - 10,
    fill: "#F8FAFC",
    stroke: "#CBD5E1"
  }), cells.map((c, i) => React.createElement("rect", {
    key: i,
    x: c.x,
    y: c.y,
    width: c.w,
    height: c.h,
    fill: c.c,
    opacity: ".13"
  })), ticks(fx).map(v => React.createElement("g", {
    key: "x" + v
  }, React.createElement("line", {
    x1: sx(v),
    x2: sx(v),
    y1: "10",
    y2: H - P,
    stroke: "#E2E8F0"
  }), React.createElement("text", {
    x: sx(v),
    y: H - P + 14,
    textAnchor: "middle",
    fontSize: "10",
    fill: "#475569"
  }, fmt(fx, v)))), ticks(fy).map(v => React.createElement("g", {
    key: "y" + v
  }, React.createElement("line", {
    x1: P,
    x2: W - 10,
    y1: sy(v),
    y2: sy(v),
    stroke: "#E2E8F0"
  }), React.createElement("text", {
    x: P - 5,
    y: sy(v) + 3,
    textAnchor: "end",
    fontSize: "10",
    fill: "#475569"
  }, fmt(fy, v)))), React.createElement("text", {
    x: (W + P) / 2,
    y: H - 4,
    textAnchor: "middle",
    fontSize: "11",
    fill: "#0F172A"
  }, fx.name, fx.unit ? ` (${fx.unit})` : ""), React.createElement("text", {
    x: "10",
    y: (H - P) / 2,
    textAnchor: "middle",
    fontSize: "11",
    fill: "#0F172A",
    transform: `rotate(-90 10 ${(H - P) / 2})`
  }, fy.name.replace(/ \(.+\)/, ""), fy.unit ? ` (${fy.unit})` : ""), pred && query && model && pred.neighbors.map((n, i) => {
    const e = model.ex[n.i];
    return React.createElement("line", {
      key: "n" + i,
      x1: sx(query[0]),
      y1: sy(query[1]),
      x2: sx(e.x[0]),
      y2: sy(e.x[1]),
      stroke: "#334155",
      strokeDasharray: "3 3",
      opacity: ".7"
    });
  }), items.map(it => {
    const x = sx(it.x[0]),
      y = sy(it.x[1]),
      hl = highlight && highlight.includes(it.id);
    return React.createElement("g", {
      key: it.id,
      onClick: onPoint ? e => {
        e.stopPropagation();
        onPoint(it);
      } : undefined,
      style: {
        cursor: onPoint ? "pointer" : undefined
      }
    }, it.role === "test" ? React.createElement("rect", {
      x: x - 4.5,
      y: y - 4.5,
      width: "9",
      height: "9",
      fill: "none",
      stroke: clsColor(classes, it.label),
      strokeWidth: "2"
    }) : React.createElement("circle", {
      cx: x,
      cy: y,
      r: hl ? 7 : 4.5,
      fill: clsColor(classes, it.label),
      stroke: hl ? "#0F172A" : "#FFFFFF",
      strokeWidth: hl ? 2.5 : 1
    }));
  }), query && React.createElement("g", null, React.createElement("circle", {
    cx: sx(query[0]),
    cy: sy(query[1]),
    r: "9",
    fill: "none",
    stroke: "#0F172A",
    strokeWidth: "2.5"
  }), React.createElement("circle", {
    cx: sx(query[0]),
    cy: sy(query[1]),
    r: "3",
    fill: "#0F172A"
  })));
}
function ConfBars({
  votes,
  classes,
  total
}) {
  return React.createElement("div", {
    className: "conf-bars"
  }, classes.map(c => {
    const v = votes && votes[c.id] || 0;
    return React.createElement("div", {
      key: c.id,
      className: "conf-row"
    }, React.createElement("span", null, c.name), React.createElement("span", {
      className: "bar"
    }, React.createElement("span", {
      style: {
        width: v / total * 100 + "%",
        background: c.color
      }
    })), React.createElement("b", {
      className: "mono"
    }, Math.round(v / total * 100), "%"));
  }));
}
function ConfusionMatrix({
  ev,
  classes
}) {
  return React.createElement("div", {
    className: "table-wrap"
  }, React.createElement("table", {
    className: "hist cm"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "\u0E08\u0E23\u0E34\u0E07 \u2193 / \u0E17\u0E33\u0E19\u0E32\u0E22 \u2192"), classes.map(c => React.createElement("th", {
    key: c.id
  }, c.name)))), React.createElement("tbody", null, classes.map(r => React.createElement("tr", {
    key: r.id
  }, React.createElement("td", null, React.createElement("b", {
    style: {
      color: r.color
    }
  }, r.name)), classes.map(c => {
    const v = ev.cm[r.id] && ev.cm[r.id][c.id] || 0;
    return React.createElement("td", {
      key: c.id,
      className: "mono " + (v ? r.id === c.id ? "cm-ok" : "cm-no" : "")
    }, v);
  }))))));
}
function MLStudio({
  data,
  setData,
  onTrained,
  defaultFeats = ["mass", "color"],
  lockFeats,
  onPoint,
  highlight,
  extraDataset
}) {
  const [feats, setFeats] = useState(defaultFeats);
  const [incl, setIncl] = useState(FRUIT_CLASSES.map(c => c.id));
  const [perClass, setPerClass] = useState(20);
  const [ratio, setRatio] = useState(0.7);
  const [k, setK] = useState(3);
  const [model, setModel] = useState(null);
  const [training, setTraining] = useState(false);
  const [query, setQuery] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const classes = FRUIT_CLASSES.filter(c => incl.includes(c.id));
  const pool = useMemo(() => {
    const by = {};
    return data.filter(d => incl.includes(d.label) && !d.removed).filter(d => {
      by[d.label] = (by[d.label] || 0) + 1;
      return by[d.label] <= perClass;
    });
  }, [data, incl, perClass]);
  const stale = model && model.sig !== JSON.stringify([feats, incl, perClass, ratio, data.map(d => d.label + (d.removed ? "x" : ""))]);
  const doTrain = () => {
    setTraining(true);
    setQuery(null);
    setTimeout(() => {
      const items = pool.map(d => ({
        ...d,
        x: fruitX(d, feats)
      }));
      const {
        train,
        test
      } = ML.split(items, ratio, 7);
      const m = ML.train(train);
      const ev = ML.evaluate(m, test, k, classes.map(c => c.id));
      const res = {
        m,
        train,
        test,
        ev,
        feats: [...feats],
        k,
        sig: JSON.stringify([feats, incl, perClass, ratio, data.map(d => d.label + (d.removed ? "x" : ""))])
      };
      setModel(res);
      setTraining(false);
      onTrained && onTrained({
        acc: ev.acc,
        feats: [...feats],
        k,
        nTrain: train.length,
        nTest: test.length,
        perClass,
        cm: ev.cm
      });
    }, 900);
  };
  useEffect(() => {
    if (model && !stale && model.k !== k) {
      const ev = ML.evaluate(model.m, model.test, k, classes.map(c => c.id));
      setModel({
        ...model,
        ev,
        k
      });
      onTrained && onTrained({
        acc: ev.acc,
        feats: model.feats,
        k,
        nTrain: model.train.length,
        nTest: model.test.length,
        perClass
      });
    }
  }, [k]);
  const pred = model && !stale && query ? ML.predict(model.m, query, k) : null;
  const cycle = id => setData && setData(ds => ds.map(d => d.id === id ? {
    ...d,
    label: FRUIT_CLASSES[(FRUIT_CLASSES.findIndex(c => c.id === d.label) + 1) % FRUIT_CLASSES.length].id
  } : d));
  const plotItems = model && !stale ? [...model.train.map(t => ({
    ...t,
    role: "train"
  })), ...model.test.map(t => ({
    ...t,
    role: "test"
  }))] : pool.map(d => ({
    ...d,
    x: fruitX(d, feats),
    role: "train"
  }));
  const counts = FRUIT_CLASSES.map(c => [c, data.filter(d => d.label === c.id && !d.removed).length]);
  const wrong = model && !stale ? model.ev.preds.filter(p => !p.ok) : [];
  return React.createElement("div", {
    className: "studio"
  }, React.createElement(Callout, {
    tone: "info",
    icon: "cpu",
    title: "Simulator \u0E19\u0E35\u0E49\u0E04\u0E33\u0E19\u0E27\u0E13\u0E08\u0E23\u0E34\u0E07 \u0E41\u0E15\u0E48\u0E40\u0E1B\u0E47\u0E19\u0E42\u0E21\u0E40\u0E14\u0E25\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E07\u0E48\u0E32\u0E22"
  }, "\u0E43\u0E0A\u0E49\u0E2D\u0E31\u0E25\u0E01\u0E2D\u0E23\u0E34\u0E17\u0E36\u0E21 k-Nearest Neighbors (kNN) \u0E40\u0E02\u0E35\u0E22\u0E19\u0E14\u0E49\u0E27\u0E22 JavaScript \u0E01\u0E31\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E25\u0E44\u0E21\u0E49\u0E08\u0E33\u0E25\u0E2D\u0E07 60 \u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E2B\u0E25\u0E31\u0E01\u0E01\u0E32\u0E23 \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E42\u0E21\u0E40\u0E14\u0E25\u0E08\u0E33\u0E41\u0E19\u0E01\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E2D\u0E38\u0E15\u0E2A\u0E32\u0E2B\u0E01\u0E23\u0E23\u0E21"), React.createElement("div", {
    className: "studio-grid"
  }, React.createElement("section", {
    className: "st-panel",
    "aria-labelledby": "st1"
  }, React.createElement("h3", {
    className: "st-h",
    id: "st1"
  }, React.createElement("span", {
    className: "st-no"
  }, "1"), "Dataset"), !lockFeats && React.createElement("div", {
    className: "feat-pick"
  }, [0, 1].map(ax => React.createElement("div", {
    className: "field",
    key: ax
  }, React.createElement("label", {
    htmlFor: "ft" + ax
  }, "Feature \u0E41\u0E01\u0E19 ", ax ? "Y" : "X"), React.createElement("select", {
    id: "ft" + ax,
    className: "input",
    value: feats[ax],
    onChange: e => {
      const f = [...feats];
      f[ax] = e.target.value;
      if (f[0] === f[1]) f[1 - ax] = FRUIT_FEATURES.find(x => x.id !== e.target.value && x.id !== f[ax]).id;
      setFeats(f);
    }
  }, FRUIT_FEATURES.map(f => React.createElement("option", {
    key: f.id,
    value: f.id
  }, f.name)))))), React.createElement("div", {
    className: "opts",
    role: "group",
    "aria-label": "\u0E04\u0E25\u0E32\u0E2A\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49"
  }, counts.map(([c, n]) => React.createElement("button", {
    key: c.id,
    type: "button",
    className: "opt chip",
    "aria-pressed": incl.includes(c.id),
    onClick: () => setIncl(s => s.includes(c.id) ? s.length > 2 ? s.filter(x => x !== c.id) : s : [...s, c.id])
  }, React.createElement("span", {
    className: "dot-c",
    style: {
      background: c.color
    }
  }), c.name, " ", React.createElement("span", {
    className: "mono hint"
  }, n)))), extraDataset, React.createElement("div", {
    className: "ds-list",
    role: "region",
    "aria-label": "\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25",
    tabIndex: 0
  }, (showAll ? data : data.slice(0, 9)).filter(d => !d.removed).map(d => React.createElement("div", {
    key: d.id,
    className: "ds-row " + (highlight && highlight.includes(d.id) ? "hl" : "")
  }, React.createElement("span", {
    className: "mono hint"
  }, d.id), React.createElement("span", {
    className: "mono"
  }, d.v.mass, "g \xB7 ", d.v.width, "\xD7", d.v.height, " \xB7 ", d.v.color), React.createElement("button", {
    type: "button",
    className: "lbl-chip",
    style: {
      "--c": clsColor(FRUIT_CLASSES, d.label)
    },
    onClick: () => cycle(d.id),
    disabled: !setData,
    "aria-label": `Label ${clsName(FRUIT_CLASSES, d.label)}${setData ? " กดเพื่อเปลี่ยน" : ""}`
  }, clsName(FRUIT_CLASSES, d.label))))), React.createElement("button", {
    type: "button",
    className: "link-btn",
    onClick: () => setShowAll(v => !v)
  }, showAll ? "แสดงบางส่วน" : `ดูทั้งหมด ${data.filter(d => !d.removed).length} ตัวอย่าง`), setData && React.createElement("span", {
    className: "hint"
  }, "\u0E01\u0E14\u0E17\u0E35\u0E48\u0E1B\u0E49\u0E32\u0E22 Label \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E02\u0E2D\u0E07\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E31\u0E49\u0E19")), React.createElement("section", {
    className: "st-panel",
    "aria-labelledby": "st2"
  }, React.createElement("h3", {
    className: "st-h",
    id: "st2"
  }, React.createElement("span", {
    className: "st-no"
  }, "2"), "Training"), React.createElement("div", {
    className: "ctl wide"
  }, React.createElement("label", {
    htmlFor: "st-pc"
  }, "\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E15\u0E48\u0E2D\u0E04\u0E25\u0E32\u0E2A"), React.createElement("input", {
    id: "st-pc",
    type: "range",
    min: "2",
    max: "20",
    value: perClass,
    onChange: e => setPerClass(+e.target.value)
  }), React.createElement("output", {
    className: "mono"
  }, perClass)), React.createElement("div", {
    className: "ctl wide"
  }, React.createElement("label", {
    htmlFor: "st-ratio"
  }, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1D\u0E36\u0E01"), React.createElement("input", {
    id: "st-ratio",
    type: "range",
    min: "0.5",
    max: "0.9",
    step: "0.1",
    value: ratio,
    onChange: e => setRatio(+e.target.value)
  }), React.createElement("output", {
    className: "mono"
  }, Math.round(ratio * 100), "%")), React.createElement("div", {
    className: "ctl wide"
  }, React.createElement("label", null, "\u0E04\u0E48\u0E32 k"), React.createElement("div", {
    className: "opts"
  }, [1, 3, 5, 7].map(v => React.createElement("button", {
    key: v,
    type: "button",
    className: "opt chip",
    "aria-pressed": k === v,
    onClick: () => setK(v)
  }, v)))), React.createElement("span", {
    className: "hint"
  }, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49 ", pool.length, " \u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07 \u2192 \u0E1D\u0E36\u0E01\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 ", Math.round(pool.length * ratio), " \xB7 \u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 ", pool.length - Math.round(pool.length * ratio)), React.createElement(Button, {
    className: "btn-glow",
    icon: "cpu",
    onClick: doTrain,
    disabled: training || pool.length < 4
  }, training ? "กำลังฝึก…" : model ? "ฝึกโมเดลใหม่" : "เริ่มฝึกโมเดล"), training && React.createElement("div", {
    className: "train-anim",
    role: "status"
  }, React.createElement("span", {
    className: "scanline",
    "aria-hidden": "true"
  }), React.createElement(ProcessingBadge, {
    text: "kNN \u0E01\u0E33\u0E25\u0E31\u0E07\u0E08\u0E14\u0E08\u0E33\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E1D\u0E36\u0E01\u0E41\u0E25\u0E30\u0E1B\u0E23\u0E31\u0E1A\u0E2A\u0E40\u0E01\u0E25 Feature"
  })), stale && React.createElement(Feedback, {
    tone: "mid",
    title: "\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E41\u0E25\u0E49\u0E27"
  }, "\u0E01\u0E14\u0E1D\u0E36\u0E01\u0E42\u0E21\u0E40\u0E14\u0E25\u0E43\u0E2B\u0E21\u0E48\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E0A\u0E49\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14"), React.createElement("p", {
    className: "hint"
  }, "kNN \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E2A\u0E39\u0E15\u0E23 \u0E41\u0E15\u0E48\u0E08\u0E14\u0E08\u0E33\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E1D\u0E36\u0E01 \u0E40\u0E21\u0E37\u0E48\u0E2D\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E2B\u0E21\u0E48\u0E08\u0E30\u0E2B\u0E32 k \u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E17\u0E35\u0E48\u0E43\u0E01\u0E25\u0E49\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14 \u0E41\u0E25\u0E49\u0E27\u0E42\u0E2B\u0E27\u0E15\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E15\u0E32\u0E21\u0E40\u0E2A\u0E35\u0E22\u0E07\u0E02\u0E49\u0E32\u0E07\u0E21\u0E32\u0E01")), React.createElement("section", {
    className: "st-panel",
    "aria-labelledby": "st3"
  }, React.createElement("h3", {
    className: "st-h",
    id: "st3"
  }, React.createElement("span", {
    className: "st-no"
  }, "3"), "Testing"), !model ? React.createElement("p", {
    className: "hint"
  }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E1D\u0E36\u0E01\u0E42\u0E21\u0E40\u0E14\u0E25") : React.createElement(React.Fragment, null, React.createElement("div", {
    className: "acc-big"
  }, React.createElement(ProgressRing, {
    value: Math.round(model.ev.acc * 100),
    size: 72,
    stroke: 8,
    label: "\u0E04\u0E27\u0E32\u0E21\u0E41\u0E21\u0E48\u0E19\u0E22\u0E33"
  }), React.createElement("div", null, React.createElement("b", {
    className: "mono",
    style: {
      fontSize: 20
    }
  }, model.ev.correct, "/", model.ev.total), React.createElement("span", {
    className: "hint",
    style: {
      display: "block"
    }
  }, "\u0E17\u0E33\u0E19\u0E32\u0E22\u0E16\u0E39\u0E01\u0E43\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E14\u0E2A\u0E2D\u0E1A (k = ", model.k, ")"))), React.createElement(ConfusionMatrix, {
    ev: model.ev,
    classes: classes
  }), wrong.length > 0 ? React.createElement("div", {
    className: "wrong-list"
  }, React.createElement("b", {
    style: {
      fontSize: 13.5
    }
  }, "\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E17\u0E35\u0E48\u0E17\u0E33\u0E19\u0E32\u0E22\u0E1C\u0E34\u0E14"), wrong.slice(0, 4).map(w => React.createElement("span", {
    key: w.item.id,
    className: "hint"
  }, w.item.id, ": \u0E08\u0E23\u0E34\u0E07\u0E04\u0E37\u0E2D ", clsName(FRUIT_CLASSES, w.item.label), " \u0E41\u0E15\u0E48\u0E17\u0E32\u0E22\u0E27\u0E48\u0E32 ", clsName(FRUIT_CLASSES, w.pred.label), " \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E19\u0E1A\u0E49\u0E32\u0E19\u0E43\u0E01\u0E25\u0E49\u0E2A\u0E38\u0E14\u0E40\u0E1B\u0E47\u0E19 ", w.pred.neighbors.map(n => clsName(FRUIT_CLASSES, n.label)).join(", ")))) : React.createElement("span", {
    className: "hint"
  }, "\u0E17\u0E33\u0E19\u0E32\u0E22\u0E16\u0E39\u0E01\u0E17\u0E38\u0E01\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E17\u0E14\u0E2A\u0E2D\u0E1A \u0E25\u0E2D\u0E07\u0E25\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1D\u0E36\u0E01 \u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E25\u0E37\u0E2D\u0E01 Feature \u0E2D\u0E37\u0E48\u0E19\u0E14\u0E39\u0E27\u0E48\u0E32\u0E40\u0E01\u0E34\u0E14\u0E2D\u0E30\u0E44\u0E23\u0E02\u0E36\u0E49\u0E19"))), React.createElement("section", {
    className: "st-panel",
    "aria-labelledby": "st4"
  }, React.createElement("h3", {
    className: "st-h",
    id: "st4"
  }, React.createElement("span", {
    className: "st-no"
  }, "4"), "Prediction"), React.createElement(ScatterPlot, {
    items: plotItems,
    feats: model && !stale ? model.feats : feats,
    classes: FRUIT_CLASSES,
    model: model && !stale ? model.m : null,
    k: k,
    query: model && !stale ? query : null,
    pred: pred,
    onPick: model && !stale ? setQuery : null,
    onPoint: onPoint,
    highlight: highlight
  }), React.createElement("span", {
    className: "hint"
  }, "\u25CF \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1D\u0E36\u0E01 \u25A2 \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E14\u0E2A\u0E2D\u0E1A \xB7 \u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19\u0E2B\u0E25\u0E31\u0E07\u0E04\u0E37\u0E2D\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E42\u0E21\u0E40\u0E14\u0E25\u0E08\u0E30\u0E17\u0E32\u0E22", model && !stale ? " · คลิกบนกราฟเพื่อวางผลไม้ใหม่" : ""), pred && React.createElement("div", {
    className: "pred-box"
  }, React.createElement("b", null, "\u0E1C\u0E25\u0E44\u0E21\u0E49\u0E43\u0E2B\u0E21\u0E48 (", query.join(", "), ") \u2192 ", React.createElement("span", {
    style: {
      color: clsColor(FRUIT_CLASSES, pred.label)
    }
  }, clsName(FRUIT_CLASSES, pred.label))), React.createElement(ConfBars, {
    votes: pred.votes,
    classes: classes,
    total: pred.neighbors.length
  }), React.createElement("span", {
    className: "hint"
  }, "Confidence = \u0E2A\u0E31\u0E14\u0E2A\u0E48\u0E27\u0E19\u0E40\u0E2A\u0E35\u0E22\u0E07\u0E42\u0E2B\u0E27\u0E15\u0E08\u0E32\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E19\u0E1A\u0E49\u0E32\u0E19 ", pred.neighbors.length, " \u0E15\u0E31\u0E27 (\u0E40\u0E2A\u0E49\u0E19\u0E1B\u0E23\u0E30)")))));
}

function drawFruitImage(cls, seed, bg) {
  const r = ML.rng(seed),
    S = 64,
    c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const g = c.getContext("2d");
  const bgs = {
    light: [`hsl(${Math.round(r() * 360)},25%,${86 + Math.round(r() * 8)}%)`],
    blue: [`hsl(${205 + Math.round(r() * 15)},70%,${55 + Math.round(r() * 10)}%)`],
    wood: [`hsl(${25 + Math.round(r() * 10)},45%,${42 + Math.round(r() * 10)}%)`]
  };
  g.fillStyle = bgs[bg || "light"][0];
  g.fillRect(0, 0, S, S);
  const cx = 32 + (r() - 0.5) * 14,
    cy = 34 + (r() - 0.5) * 12,
    sc = 0.8 + r() * 0.35,
    rot = (r() - 0.5) * 1.2,
    lt = Math.round((r() - 0.5) * 14);
  g.save();
  g.translate(cx, cy);
  g.rotate(rot);
  g.scale(sc, sc);
  g.fillStyle = "rgba(0,0,0,.18)";
  g.beginPath();
  g.ellipse(2, 18, 16, 4, 0, 0, Math.PI * 2);
  g.fill();
  if (cls === "apple") {
    g.fillStyle = `hsl(${352 + Math.round(r() * 14)},${70 + Math.round(r() * 15)}%,${42 + lt}%)`;
    g.beginPath();
    g.arc(-6, 0, 13, 0, Math.PI * 2);
    g.arc(6, 0, 13, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#5a3b1c";
    g.lineWidth = 2.5;
    g.beginPath();
    g.moveTo(0, -11);
    g.lineTo(2, -19);
    g.stroke();
    g.fillStyle = "#4caf50";
    g.beginPath();
    g.ellipse(7, -17, 6, 3, -0.5, 0, Math.PI * 2);
    g.fill();
  } else if (cls === "banana") {
    g.strokeStyle = `hsl(${50 + Math.round(r() * 8)},${85 + Math.round(r() * 10)}%,${55 + lt}%)`;
    g.lineWidth = 11;
    g.lineCap = "round";
    g.beginPath();
    g.arc(0, -16, 26, 0.35 * Math.PI, 0.85 * Math.PI);
    g.stroke();
    g.strokeStyle = "#6b4f1d";
    g.lineWidth = 3;
    g.beginPath();
    g.arc(0, -16, 26, 0.33 * Math.PI, 0.35 * Math.PI);
    g.stroke();
  } else {
    g.fillStyle = `hsl(${28 + Math.round(r() * 8)},${88 + Math.round(r() * 10)}%,${52 + lt}%)`;
    g.beginPath();
    g.arc(0, 0, 15, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "rgba(255,255,255,.18)";
    for (let i = 0; i < 10; i++) {
      g.beginPath();
      g.arc((r() - 0.5) * 20, (r() - 0.5) * 20, 1, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = "#3e7d2c";
    g.beginPath();
    g.arc(0, -14, 2.5, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
  const d = g.getImageData(0, 0, S, S);
  return {
    url: c.toDataURL(),
    img: {
      width: S,
      height: S,
      data: d.data
    }
  };
}
function makeImageSet(perClass, seed, biased) {
  const out = [];
  IMG_CLASSES.forEach((c, ci) => {
    for (let i = 0; i < perClass; i++) {
      const s = seed + ci * 1000 + i * 7,
        bg = biased ? c.id === "banana" ? "blue" : "light" : "light";
      const im = drawFruitImage(c.id, s, bg);
      out.push({
        id: `${c.id}-${i + 1}`,
        label: c.id,
        trueLabel: c.id,
        bg,
        url: im.url,
        x: imageFeatures(im.img)
      });
    }
  });
  return out;
}
function ImageClassifierLab({
  onEvent
}) {
  const [biased, setBiased] = useState(false);
  const [set, setSet] = useState(() => makeImageSet(10, 500, false));
  const UNL = useMemo(() => new Set(["apple-2", "apple-5", "apple-8", "banana-3", "banana-6", "banana-9", "orange-1", "orange-4", "orange-7"]), []);
  const [labels, setLabels] = useState({});
  const [ratio, setRatio] = useState(0.7);
  const [k, setK] = useState(3);
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sel, setSel] = useState(null);
  const unlabeled = biased ? [] : set.filter(s => UNL.has(s.id) && !labels[s.id]);
  const effLabel = s => UNL.has(s.id) && !biased ? labels[s.id] : s.label;
  const setLabel = (id, l) => {
    setLabels(m => {
      const n = {
        ...m,
        [id]: l
      };
      onEvent && onEvent({
        type: "label",
        done: Object.keys(n).length,
        correct: Object.entries(n).filter(([i, v]) => i.split("-")[0] === v).length
      });
      return n;
    });
    setRes(null);
  };
  const toggleBias = b => {
    setBiased(b);
    setRes(null);
    setSel(null);
    setSet(b ? makeImageSet(10, 900, true) : makeImageSet(10, 500, false));
  };
  const train = () => {
    setBusy(true);
    setTimeout(() => {
      const items = set.filter(s => effLabel(s)).map(s => ({
        ...s,
        label: effLabel(s)
      }));
      let {
        train,
        test
      } = ML.split(items, ratio, 11);
      if (biased) {
        test = [];
        IMG_CLASSES.forEach((c, ci) => {
          for (let i = 0; i < 4; i++) {
            const im = drawFruitImage(c.id, 7000 + ci * 50 + i, c.id === "banana" ? "light" : "blue");
            test.push({
              id: `test-${c.id}-${i + 1}`,
              label: c.id,
              url: im.url,
              x: imageFeatures(im.img),
              bg: c.id === "banana" ? "light" : "blue"
            });
          }
        });
      }
      const m = ML.train(train, {
        scale: false
      });
      const ev = ML.evaluate(m, test, k, IMG_CLASSES.map(c => c.id));
      const r = {
        m,
        train,
        test,
        ev,
        k,
        biased
      };
      setRes(r);
      setBusy(false);
      setSel(null);
      onEvent && onEvent({
        type: "train",
        acc: ev.acc,
        biased,
        nTrain: train.length,
        nTest: test.length,
        mislabeled: items.filter(i => i.label !== i.trueLabel).length
      });
    }, 700);
  };
  const wrong = res ? res.ev.preds.filter(p => !p.ok) : [];
  const selP = sel && res ? res.ev.preds.find(p => p.item.id === sel) : null;
  return React.createElement("div", {
    className: "lab-tool"
  }, React.createElement("div", {
    className: "panel-head"
  }, React.createElement("span", {
    className: "panel-title"
  }, React.createElement(Icon, {
    name: "eye",
    size: 16
  }), "Image Classification Lab"), React.createElement(Badge, {
    tone: biased ? "demo" : "cyan"
  }, biased ? "ชุดข้อมูลลำเอียง" : "ชุดข้อมูลปกติ")), React.createElement(Callout, {
    tone: "info",
    icon: "cpu",
    title: "\u0E1D\u0E36\u0E01\u0E41\u0E25\u0E30\u0E17\u0E33\u0E19\u0E32\u0E22\u0E08\u0E23\u0E34\u0E07\u0E43\u0E19\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C"
  }, "\u0E20\u0E32\u0E1E\u0E1C\u0E25\u0E44\u0E21\u0E49 30 \u0E20\u0E32\u0E1E\u0E40\u0E1B\u0E47\u0E19\u0E20\u0E32\u0E1E\u0E2A\u0E31\u0E07\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E17\u0E35\u0E48\u0E27\u0E32\u0E14\u0E14\u0E49\u0E27\u0E22\u0E42\u0E1B\u0E23\u0E41\u0E01\u0E23\u0E21 (\u0E2A\u0E35\u0E41\u0E25\u0E30\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E15\u0E48\u0E32\u0E07\u0E01\u0E31\u0E19\u0E17\u0E38\u0E01\u0E20\u0E32\u0E1E) \u0E15\u0E31\u0E27\u0E08\u0E33\u0E41\u0E19\u0E01\u0E43\u0E0A\u0E49 kNN \u0E01\u0E31\u0E1A\u0E04\u0E38\u0E13\u0E25\u0E31\u0E01\u0E29\u0E13\u0E30\u0E2A\u0E35\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E27\u0E48\u0E32\u0E07 32 \u0E04\u0E48\u0E32\u0E15\u0E48\u0E2D\u0E20\u0E32\u0E1E \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48 Deep Learning \u0E08\u0E36\u0E07\u0E40\u0E2B\u0E47\u0E19\u0E44\u0E14\u0E49\u0E0A\u0E31\u0E14\u0E27\u0E48\u0E32\u0E42\u0E21\u0E40\u0E14\u0E25\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E08\u0E32\u0E01 \"\u0E2D\u0E30\u0E44\u0E23\" \u0E43\u0E19\u0E20\u0E32\u0E1E"), React.createElement("div", {
    className: "seg",
    role: "tablist",
    "aria-label": "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E38\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25"
  }, React.createElement("button", {
    type: "button",
    role: "tab",
    "aria-selected": !biased,
    onClick: () => toggleBias(false)
  }, "\u0E0A\u0E38\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1B\u0E01\u0E15\u0E34"), React.createElement("button", {
    type: "button",
    role: "tab",
    "aria-selected": biased,
    onClick: () => toggleBias(true)
  }, "\u0E17\u0E14\u0E25\u0E2D\u0E07: \u0E0A\u0E38\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E25\u0E33\u0E40\u0E2D\u0E35\u0E22\u0E07")), biased && React.createElement(Callout, {
    tone: "warn",
    icon: "alert",
    title: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1D\u0E36\u0E01\u0E0A\u0E38\u0E14\u0E19\u0E35\u0E49\u0E21\u0E35\u0E2D\u0E04\u0E15\u0E34\u0E0B\u0E48\u0E2D\u0E19\u0E2D\u0E22\u0E39\u0E48"
  }, "\u0E20\u0E32\u0E1E\u0E01\u0E25\u0E49\u0E27\u0E22\u0E17\u0E38\u0E01\u0E20\u0E32\u0E1E\u0E43\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1D\u0E36\u0E01\u0E16\u0E48\u0E32\u0E22\u0E1A\u0E19\u0E1E\u0E37\u0E49\u0E19\u0E2B\u0E25\u0E31\u0E07\u0E2A\u0E35\u0E1F\u0E49\u0E32 \u0E2A\u0E48\u0E27\u0E19\u0E41\u0E2D\u0E1B\u0E40\u0E1B\u0E34\u0E25\u0E41\u0E25\u0E30\u0E2A\u0E49\u0E21\u0E2D\u0E22\u0E39\u0E48\u0E1A\u0E19\u0E1E\u0E37\u0E49\u0E19\u0E2A\u0E35\u0E2D\u0E48\u0E2D\u0E19 \u0E0A\u0E38\u0E14\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E43\u0E2B\u0E21\u0E48\u0E2A\u0E25\u0E31\u0E1A\u0E1E\u0E37\u0E49\u0E19\u0E2B\u0E25\u0E31\u0E07\u0E01\u0E31\u0E19 \u0E25\u0E2D\u0E07\u0E1D\u0E36\u0E01\u0E41\u0E25\u0E49\u0E27\u0E14\u0E39\u0E27\u0E48\u0E32\u0E42\u0E21\u0E40\u0E14\u0E25\u0E17\u0E32\u0E22\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E23"), !biased && React.createElement("div", {
    className: "q-card"
  }, React.createElement("div", {
    className: "act-head"
  }, React.createElement("strong", null, "1) \u0E15\u0E34\u0E14\u0E1B\u0E49\u0E32\u0E22\u0E01\u0E33\u0E01\u0E31\u0E1A (Labeling)"), React.createElement("span", {
    className: "mono hint"
  }, "\u0E40\u0E2B\u0E25\u0E37\u0E2D ", unlabeled.length, "/9 \u0E20\u0E32\u0E1E")), React.createElement("div", {
    className: "img-grid"
  }, set.filter(s => UNL.has(s.id)).map(s => React.createElement("div", {
    key: s.id,
    className: "img-card " + (labels[s.id] ? "done" : "")
  }, React.createElement("img", {
    src: s.url,
    alt: `ภาพที่ยังไม่มีป้ายกำกับ ${s.id}`,
    width: "64",
    height: "64"
  }), React.createElement("div", {
    className: "mini-opts"
  }, IMG_CLASSES.map(c => React.createElement("button", {
    key: c.id,
    type: "button",
    "aria-pressed": labels[s.id] === c.id,
    onClick: () => setLabel(s.id, c.id),
    style: {
      "--c": c.color
    }
  }, c.name)))))), React.createElement("span", {
    className: "hint"
  }, "\u0E20\u0E32\u0E1E\u0E2D\u0E35\u0E01 21 \u0E20\u0E32\u0E1E\u0E21\u0E35\u0E1B\u0E49\u0E32\u0E22\u0E01\u0E33\u0E01\u0E31\u0E1A\u0E41\u0E25\u0E49\u0E27 \u0E16\u0E49\u0E32\u0E15\u0E34\u0E14\u0E1B\u0E49\u0E32\u0E22\u0E1C\u0E34\u0E14 \u0E42\u0E21\u0E40\u0E14\u0E25\u0E08\u0E30\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E1C\u0E34\u0E14\u0E44\u0E1B\u0E14\u0E49\u0E27\u0E22")), React.createElement("div", {
    className: "q-card"
  }, React.createElement("strong", null, biased ? "1" : "2", ") \u0E41\u0E1A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E41\u0E25\u0E30\u0E1D\u0E36\u0E01\u0E42\u0E21\u0E40\u0E14\u0E25"), !biased && React.createElement("div", {
    className: "ctl wide"
  }, React.createElement("label", {
    htmlFor: "ic-ratio"
  }, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1D\u0E36\u0E01"), React.createElement("input", {
    id: "ic-ratio",
    type: "range",
    min: "0.5",
    max: "0.9",
    step: "0.1",
    value: ratio,
    onChange: e => {
      setRatio(+e.target.value);
      setRes(null);
    }
  }), React.createElement("output", {
    className: "mono"
  }, Math.round(ratio * 100), "%")), React.createElement("div", {
    className: "ctl wide"
  }, React.createElement("label", null, "\u0E04\u0E48\u0E32 k"), React.createElement("div", {
    className: "opts"
  }, [1, 3, 5].map(v => React.createElement("button", {
    key: v,
    type: "button",
    className: "opt chip",
    "aria-pressed": k === v,
    onClick: () => {
      setK(v);
      setRes(null);
    }
  }, v)))), React.createElement("div", {
    className: "mini-thumbs",
    role: "group",
    "aria-label": "\u0E20\u0E32\u0E1E\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\u0E43\u0E19\u0E0A\u0E38\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25"
  }, set.map(s => React.createElement("img", {
    key: s.id,
    src: s.url,
    alt: "",
    width: "32",
    height: "32",
    title: `${s.id}: ${effLabel(s) ? clsName(IMG_CLASSES, effLabel(s)) : "ยังไม่มีป้าย"}`,
    className: effLabel(s) ? "" : "unl"
  }))), React.createElement(Button, {
    className: "btn-glow",
    icon: "cpu",
    disabled: busy || unlabeled.length > 0,
    onClick: train
  }, busy ? "กำลังฝึก…" : "ฝึกตัวจำแนกภาพ"), unlabeled.length > 0 && React.createElement("span", {
    className: "hint"
  }, "\u0E15\u0E34\u0E14\u0E1B\u0E49\u0E32\u0E22\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A\u0E01\u0E48\u0E2D\u0E19\u0E08\u0E36\u0E07\u0E1D\u0E36\u0E01\u0E44\u0E14\u0E49"), busy && React.createElement("div", {
    className: "train-anim",
    role: "status"
  }, React.createElement("span", {
    className: "scanline",
    "aria-hidden": "true"
  }), React.createElement(ProcessingBadge, {
    text: "\u0E14\u0E36\u0E07\u0E04\u0E38\u0E13\u0E25\u0E31\u0E01\u0E29\u0E13\u0E30\u0E08\u0E32\u0E01\u0E20\u0E32\u0E1E\u0E41\u0E25\u0E30\u0E08\u0E14\u0E08\u0E33\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07"
  }))), res && React.createElement("div", {
    className: "q-card"
  }, React.createElement("div", {
    className: "act-head"
  }, React.createElement("strong", null, biased ? "2" : "3", ") \u0E1C\u0E25\u0E01\u0E32\u0E23\u0E17\u0E33\u0E19\u0E32\u0E22\u0E01\u0E31\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E14\u0E2A\u0E2D\u0E1A"), React.createElement("span", {
    className: "mono",
    style: {
      fontWeight: 700
    }
  }, "Accuracy ", pct(res.ev.acc), " (", res.ev.correct, "/", res.ev.total, ")")), React.createElement("div", {
    className: "img-grid"
  }, res.ev.preds.map(p => React.createElement("button", {
    key: p.item.id,
    type: "button",
    className: "img-card pred " + (p.ok ? "ok" : "no") + (sel === p.item.id ? " sel" : ""),
    onClick: () => setSel(p.item.id)
  }, React.createElement("img", {
    src: p.item.url,
    alt: `ภาพทดสอบ จริงคือ ${clsName(IMG_CLASSES, p.item.label)}`,
    width: "64",
    height: "64"
  }), React.createElement("span", {
    className: "mono"
  }, p.ok ? "✓" : "✗", " ", clsName(IMG_CLASSES, p.pred.label), " ", Math.round(p.pred.confidence * 100), "%")))), React.createElement("span", {
    className: "hint"
  }, "\u0E01\u0E14\u0E20\u0E32\u0E1E\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E27\u0E48\u0E32\u0E42\u0E21\u0E40\u0E14\u0E25\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E01\u0E31\u0E1A\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E1D\u0E36\u0E01\u0E20\u0E32\u0E1E\u0E44\u0E2B\u0E19"), selP && React.createElement("div", {
    className: "explain"
  }, React.createElement("b", null, "\u0E17\u0E33\u0E44\u0E21\u0E42\u0E21\u0E40\u0E14\u0E25\u0E17\u0E32\u0E22\u0E27\u0E48\u0E32 \"", clsName(IMG_CLASSES, selP.pred.label), "\""), React.createElement("div", {
    className: "nb-row"
  }, React.createElement("img", {
    src: selP.item.url,
    alt: "\u0E20\u0E32\u0E1E\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01",
    width: "56",
    height: "56",
    className: "sel-img"
  }), React.createElement(Icon, {
    name: "chevR",
    size: 18
  }), selP.pred.neighbors.map((n, i) => {
    const e = res.m.ex[n.i];
    return React.createElement("span", {
      key: i,
      className: "nb"
    }, React.createElement("img", {
      src: e.url,
      alt: "",
      width: "48",
      height: "48"
    }), React.createElement("span", {
      className: "mono hint"
    }, clsName(IMG_CLASSES, e.label)));
  })), React.createElement("span", {
    className: "hint"
  }, "\u0E20\u0E32\u0E1E\u0E1D\u0E36\u0E01\u0E17\u0E35\u0E48 \"\u0E43\u0E01\u0E25\u0E49\" \u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14 ", selP.pred.neighbors.length, " \u0E20\u0E32\u0E1E \u0E42\u0E21\u0E40\u0E14\u0E25\u0E14\u0E39\u0E08\u0E32\u0E01\u0E2A\u0E35\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E27\u0E48\u0E32\u0E07\u0E42\u0E14\u0E22\u0E23\u0E27\u0E21 ", !selP.ok && (res.biased ? "ภาพนี้ถูกเทียบกับภาพที่มีพื้นหลังสีเดียวกัน แสดงว่าโมเดลเรียนรู้สีพื้นหลังแทนผลไม้" : "ภาพนี้มีสีหรือพื้นหลังคล้ายคลาสอื่น หรืออาจมีป้ายกำกับผิดในข้อมูลฝึก"))), wrong.length > 0 && !selP && React.createElement(Feedback, {
    tone: "mid",
    title: `ทายผิด ${wrong.length} ภาพ`
  }, res.biased ? "โมเดลทายกล้วยไม่ได้เมื่อไม่มีพื้นหลังสีฟ้า และทายแอปเปิล/ส้มบนพื้นฟ้าว่าเป็นกล้วย เพราะในข้อมูลฝึก 'สีฟ้า' สัมพันธ์กับคำว่ากล้วยเสมอ นี่คือ Data Bias ที่ทำให้โมเดลเรียนรู้ทางลัดที่ผิด" : "กดภาพที่ทายผิดเพื่อดูสาเหตุ")));
}
function CustomImageClassifier() {
  const [cls, setCls] = useState([{
    name: "คลาส A",
    items: []
  }, {
    name: "คลาส B",
    items: []
  }]);
  const [model, setModel] = useState(null);
  const [test, setTest] = useState(null);
  const [err, setErr] = useState("");
  const add = async (ci, files) => {
    setErr("");
    for (const f of files) {
      try {
        const r = await loadFile(f, 64);
        const x = imageFeatures(r.img);
        const url = URL.createObjectURL(f);
        setCls(cs => cs.map((c, i) => i === ci ? {
          ...c,
          items: [...c.items, {
            url,
            x
          }]
        } : c));
        setModel(null);
      } catch (e) {
        setErr(e.message);
      }
    }
  };
  const train = () => setModel(ML.train(cls.flatMap((c, i) => c.items.map(it => ({
    x: it.x,
    label: String(i),
    url: it.url
  }))), {
    scale: false
  }));
  const predict = async f => {
    try {
      const r = await loadFile(f, 64);
      const url = URL.createObjectURL(f);
      setTest({
        url,
        p: ML.predict(model, imageFeatures(r.img), 3)
      });
    } catch (e) {
      setErr(e.message);
    }
  };
  const ready = cls.every(c => c.items.length >= 3);
  return React.createElement("div", {
    className: "lab-tool"
  }, React.createElement("div", {
    className: "panel-head"
  }, React.createElement("span", {
    className: "panel-title"
  }, React.createElement(Icon, {
    name: "sparkle",
    size: 16
  }), "Mini Teachable: \u0E1D\u0E36\u0E01\u0E14\u0E49\u0E27\u0E22\u0E20\u0E32\u0E1E\u0E02\u0E2D\u0E07\u0E40\u0E18\u0E2D")), React.createElement("p", {
    className: "hint"
  }, "\u0E15\u0E31\u0E49\u0E07\u0E0A\u0E37\u0E48\u0E2D 2 \u0E04\u0E25\u0E32\u0E2A \u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E04\u0E25\u0E32\u0E2A\u0E25\u0E30\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 3 \u0E20\u0E32\u0E1E (\u0E40\u0E0A\u0E48\u0E19 \u0E02\u0E27\u0E14\u0E1E\u0E25\u0E32\u0E2A\u0E15\u0E34\u0E01 \u0E01\u0E31\u0E1A \u0E01\u0E23\u0E30\u0E1B\u0E4B\u0E2D\u0E07) \u0E41\u0E25\u0E49\u0E27\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E14\u0E49\u0E27\u0E22\u0E20\u0E32\u0E1E\u0E43\u0E2B\u0E21\u0E48 \u0E15\u0E31\u0E27\u0E08\u0E33\u0E41\u0E19\u0E01\u0E19\u0E35\u0E49\u0E14\u0E39\u0E41\u0E04\u0E48\u0E2A\u0E35\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E27\u0E48\u0E32\u0E07 \u0E08\u0E36\u0E07\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E01\u0E31\u0E1A\u0E2A\u0E34\u0E48\u0E07\u0E02\u0E2D\u0E07\u0E17\u0E35\u0E48\u0E2A\u0E35\u0E15\u0E48\u0E32\u0E07\u0E01\u0E31\u0E19\u0E0A\u0E31\u0E14 \u0E43\u0E0A\u0E49\u0E20\u0E32\u0E1E\u0E2A\u0E34\u0E48\u0E07\u0E02\u0E2D\u0E07\u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19 \u0E20\u0E32\u0E1E\u0E44\u0E21\u0E48\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E02\u0E2D\u0E07\u0E40\u0E18\u0E2D"), err && React.createElement("div", {
    className: "form-err",
    role: "alert"
  }, React.createElement(Icon, {
    name: "alert",
    size: 16
  }), err), React.createElement("div", {
    className: "two-col"
  }, cls.map((c, ci) => React.createElement("div", {
    key: ci,
    className: "q-card"
  }, React.createElement("input", {
    className: "input",
    "aria-label": `ชื่อคลาส ${ci + 1}`,
    value: c.name,
    maxLength: 20,
    onChange: e => setCls(cs => cs.map((x, i) => i === ci ? {
      ...x,
      name: e.target.value
    } : x))
  }), React.createElement("div", {
    className: "mini-thumbs"
  }, c.items.map((it, i) => React.createElement("img", {
    key: i,
    src: it.url,
    alt: "",
    width: "40",
    height: "40"
  }))), React.createElement("label", {
    className: "btn btn-ghost btn-sm",
    style: {
      justifySelf: "start"
    }
  }, React.createElement(Icon, {
    name: "login",
    size: 14,
    style: {
      transform: "rotate(-90deg)"
    }
  }), "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E20\u0E32\u0E1E (", c.items.length, ")", React.createElement("input", {
    type: "file",
    accept: "image/*",
    multiple: true,
    className: "sr-only",
    onChange: e => {
      add(ci, [...e.target.files]);
      e.target.value = "";
    }
  }))))), React.createElement("div", {
    className: "btn-inline"
  }, React.createElement(Button, {
    icon: "cpu",
    disabled: !ready,
    onClick: train
  }, "\u0E1D\u0E36\u0E01\u0E42\u0E21\u0E40\u0E14\u0E25"), model && React.createElement("label", {
    className: "btn btn-ghost"
  }, React.createElement(Icon, {
    name: "target",
    size: 16
  }), "\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E14\u0E49\u0E27\u0E22\u0E20\u0E32\u0E1E\u0E43\u0E2B\u0E21\u0E48", React.createElement("input", {
    type: "file",
    accept: "image/*",
    className: "sr-only",
    onChange: e => {
      if (e.target.files[0]) predict(e.target.files[0]);
      e.target.value = "";
    }
  }))), !ready && React.createElement("span", {
    className: "hint"
  }, "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E20\u0E32\u0E1E\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22\u0E04\u0E25\u0E32\u0E2A\u0E25\u0E30 3 \u0E20\u0E32\u0E1E"), model && React.createElement(Badge, {
    tone: "ok",
    dot: true
  }, "\u0E1D\u0E36\u0E01\u0E41\u0E25\u0E49\u0E27\u0E14\u0E49\u0E27\u0E22 ", model.ex.length, " \u0E20\u0E32\u0E1E"), test && test.p && React.createElement("div", {
    className: "pred-box"
  }, React.createElement("div", {
    className: "nb-row"
  }, React.createElement("img", {
    src: test.url,
    alt: "\u0E20\u0E32\u0E1E\u0E17\u0E14\u0E2A\u0E2D\u0E1A",
    width: "64",
    height: "64",
    className: "sel-img"
  }), React.createElement("b", null, "\u0E17\u0E32\u0E22\u0E27\u0E48\u0E32: ", cls[+test.p.label].name, " (", Math.round(test.p.confidence * 100), "%)")), React.createElement(ConfBars, {
    votes: Object.fromEntries(Object.entries(test.p.votes).map(([k, v]) => [k, v])),
    classes: cls.map((c, i) => ({
      id: String(i),
      name: c.name,
      color: i ? "#57CCF2" : "#FF7A90"
    })),
    total: test.p.neighbors.length
  })));
}

function poseKeypoints(p) {
  const arm = (sx, s, a, b) => {
    const t = a * Math.PI / 180,
      t2 = (a + b) * Math.PI / 180;
    const e = [sx + s * 36 * Math.sin(t), 72 + 36 * Math.cos(t)];
    return [e, [e[0] + s * 32 * Math.sin(t2), e[1] + 32 * Math.cos(t2)]];
  };
  const [le, lw] = arm(80, -1, p.ls, p.le),
    [re, rw] = arm(120, 1, p.rs, p.re);
  const lean = p.lean || 0;
  return [[100 + lean, 40], [80, 72], [120, 72], le, re, lw, rw, [88, 132], [112, 132], [86 - (p.leg || 0), 182], [114 + (p.leg || 0), 182], [85 - (p.leg || 0) * 1.6, 230], [115 + (p.leg || 0) * 1.6, 230]];
}
function poseFeatures(kp) {
  const hx = (kp[7][0] + kp[8][0]) / 2,
    hy = (kp[7][1] + kp[8][1]) / 2,
    sx = (kp[1][0] + kp[2][0]) / 2,
    sy = (kp[1][1] + kp[2][1]) / 2;
  const L = Math.hypot(sx - hx, sy - hy) || 1;
  return kp.flatMap(([x, y]) => [(x - hx) / L, (y - hy) / L]);
}
function Manikin({
  kp,
  color = "#57CCF2",
  size = 200,
  label
}) {
  const B = [[1, 2], [1, 3], [3, 5], [2, 4], [4, 6], [1, 7], [2, 8], [7, 8], [7, 9], [9, 11], [8, 10], [10, 12]];
  return React.createElement("svg", {
    viewBox: "0 -10 200 250",
    width: size,
    className: "manikin",
    role: "img",
    "aria-label": label || "หุ่นแสดงท่าทาง"
  }, React.createElement("rect", {
    x: "0",
    y: "-10",
    width: "200",
    height: "250",
    rx: "12",
    fill: "#0B1026"
  }), B.map(([a, b], i) => React.createElement("line", {
    key: i,
    x1: kp[a][0],
    y1: kp[a][1],
    x2: kp[b][0],
    y2: kp[b][1],
    stroke: color,
    strokeWidth: "6",
    strokeLinecap: "round"
  })), React.createElement("circle", {
    cx: kp[0][0],
    cy: kp[0][1] - 4,
    r: "16",
    fill: "none",
    stroke: color,
    strokeWidth: "5"
  }), kp.map(([x, y], i) => React.createElement("circle", {
    key: i,
    cx: x,
    cy: i === 0 ? y : y,
    r: i === 0 ? 3.5 : 4,
    fill: "#0F172A"
  })));
}

function poseChallenge() {
  const P = [["raise", {
    ls: 165,
    le: 10,
    rs: 175,
    re: 0
  }], ["raise", {
    ls: 10,
    le: 0,
    rs: 160,
    re: 15
  }], ["raise", {
    ls: 150,
    le: 25,
    rs: 15,
    re: 10,
    lean: 4
  }], ["spread", {
    ls: 95,
    le: 5,
    rs: 85,
    re: 0
  }], ["spread", {
    ls: 80,
    le: 15,
    rs: 100,
    re: 10,
    leg: 6
  }], ["spread", {
    ls: 100,
    le: 0,
    rs: 92,
    re: 20
  }], ["straight", {
    ls: 5,
    le: 0,
    rs: 12,
    re: 0
  }], ["straight", {
    ls: 18,
    le: 10,
    rs: 6,
    re: 5,
    leg: 5
  }], ["straight", {
    ls: 2,
    le: 20,
    rs: 15,
    re: 15,
    lean: -4
  }]];
  return P.map(([label, p], i) => ({
    id: "pc" + i,
    label,
    p,
    kp: poseKeypoints(p)
  }));
}
function PoseExplorer({
  examples,
  setExamples,
  onEvent,
  showChallenge
}) {
  const [p, setP] = useState({
    ls: 8,
    le: 0,
    rs: 8,
    re: 0,
    lean: 0,
    leg: 0
  });
  const [model, setModel] = useState(null);
  const [chal, setChal] = useState(null);
  const kp = poseKeypoints(p);
  const pred = model ? ML.predict(model, poseFeatures(kp), 3) : null;
  const add = label => {
    setExamples(ex => [...ex, {
      label,
      x: poseFeatures(kp),
      kp
    }]);
    setModel(null);
    setChal(null);
    onEvent && onEvent({
      type: "add",
      label
    });
  };
  const counts = POSE_CLASSES.map(c => examples.filter(e => e.label === c.id).length);
  const train = () => {
    const m = ML.train(examples, {
      scale: false,
      weighted: true
    });
    setModel(m);
    onEvent && onEvent({
      type: "train",
      n: examples.length
    });
    setChal(null);
  };
  const runChallenge = () => {
    const cs = poseChallenge();
    const ev = ML.evaluate(model, cs.map(c => ({
      ...c,
      x: poseFeatures(c.kp)
    })), 3, POSE_CLASSES.map(c => c.id));
    setChal(ev);
    onEvent && onEvent({
      type: "challenge",
      acc: ev.acc
    });
  };
  const S = (k, l, mn, mx) => React.createElement("div", {
    className: "ctl wide"
  }, React.createElement("label", {
    htmlFor: "ps-" + k
  }, l), React.createElement("input", {
    id: "ps-" + k,
    type: "range",
    min: mn,
    max: mx,
    value: p[k],
    onChange: e => setP(q => ({
      ...q,
      [k]: +e.target.value
    }))
  }), React.createElement("output", {
    className: "mono"
  }, p[k], "\xB0"));
  return React.createElement("div", {
    className: "lab-tool"
  }, React.createElement("div", {
    className: "panel-head"
  }, React.createElement("span", {
    className: "panel-title"
  }, React.createElement(Icon, {
    name: "user",
    size: 16
  }), "Pose Classification Explorer"), React.createElement(Badge, {
    tone: "demo"
  }, "\u0E42\u0E2B\u0E21\u0E14\u0E1D\u0E36\u0E01\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E49\u0E01\u0E25\u0E49\u0E2D\u0E07")), React.createElement("div", {
    className: "pose-grid"
  }, React.createElement("div", {
    style: {
      display: "grid",
      gap: 8,
      justifyItems: "center"
    }
  }, React.createElement(Manikin, {
    kp: kp,
    color: pred ? clsColor(POSE_CLASSES, pred.label) : "#57CCF2",
    label: "\u0E2B\u0E38\u0E48\u0E19\u0E17\u0E48\u0E32\u0E17\u0E32\u0E07\u0E17\u0E35\u0E48\u0E1B\u0E23\u0E31\u0E1A\u0E44\u0E14\u0E49"
  }), React.createElement("div", {
    className: "opts"
  }, POSE_CLASSES.map(c => React.createElement("button", {
    key: c.id,
    type: "button",
    className: "opt chip",
    onClick: () => setP(q => ({
      ...q,
      ...POSE_PRESETS[c.id]
    }))
  }, "\u0E17\u0E48\u0E32\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07: ", c.name)))), React.createElement("div", {
    style: {
      display: "grid",
      gap: 10,
      minWidth: 0,
      alignContent: "start"
    }
  }, React.createElement("fieldset", {
    className: "controls"
  }, React.createElement("legend", null, "\u0E1B\u0E23\u0E31\u0E1A\u0E17\u0E48\u0E32\u0E17\u0E32\u0E07 (\u0E0B\u0E49\u0E32\u0E22/\u0E02\u0E27\u0E32\u0E15\u0E32\u0E21\u0E21\u0E38\u0E21\u0E21\u0E2D\u0E07\u0E20\u0E32\u0E1E)"), S("ls", "ไหล่ซ้าย", 0, 180), S("le", "ศอกซ้าย", 0, 90), S("rs", "ไหล่ขวา", 0, 180), S("re", "ศอกขวา", 0, 90)), React.createElement("span", {
    className: "hint"
  }, "\u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E23\u0E34\u0E07\u0E43\u0E0A\u0E49\u0E42\u0E21\u0E40\u0E14\u0E25 Pose Estimation (\u0E40\u0E0A\u0E48\u0E19 MoveNet, PoseNet) \u0E2B\u0E32\u0E08\u0E38\u0E14\u0E2A\u0E33\u0E04\u0E31\u0E0D\u0E08\u0E32\u0E01\u0E20\u0E32\u0E1E\u0E01\u0E25\u0E49\u0E2D\u0E07 \u0E2B\u0E38\u0E48\u0E19\u0E19\u0E35\u0E49\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E08\u0E38\u0E14\u0E2A\u0E33\u0E04\u0E31\u0E0D 13 \u0E08\u0E38\u0E14\u0E41\u0E17\u0E19\u0E01\u0E25\u0E49\u0E2D\u0E07 \u0E41\u0E25\u0E49\u0E27\u0E2A\u0E48\u0E07\u0E1E\u0E34\u0E01\u0E31\u0E14\u0E43\u0E2B\u0E49\u0E15\u0E31\u0E27\u0E08\u0E33\u0E41\u0E19\u0E01 kNN \u0E0B\u0E36\u0E48\u0E07\u0E1D\u0E36\u0E01\u0E41\u0E25\u0E30\u0E17\u0E33\u0E19\u0E32\u0E22\u0E08\u0E23\u0E34\u0E07"), React.createElement("div", {
    className: "q-card"
  }, React.createElement("strong", {
    style: {
      fontSize: 14
    }
  }, "\u0E40\u0E01\u0E47\u0E1A\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E17\u0E48\u0E32\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E47\u0E19"), React.createElement("div", {
    className: "opts"
  }, POSE_CLASSES.map((c, i) => React.createElement("button", {
    key: c.id,
    type: "button",
    className: "opt",
    onClick: () => add(c.id)
  }, React.createElement("span", {
    className: "dot-c",
    style: {
      background: c.color
    }
  }), c.name, " ", React.createElement("span", {
    className: "mono hint"
  }, counts[i])))), React.createElement("div", {
    className: "btn-inline"
  }, React.createElement(Button, {
    size: "sm",
    icon: "cpu",
    disabled: counts.some(n => n < 2),
    onClick: train
  }, "\u0E1D\u0E36\u0E01\u0E15\u0E31\u0E27\u0E08\u0E33\u0E41\u0E19\u0E01\u0E17\u0E48\u0E32\u0E17\u0E32\u0E07"), React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    icon: "refresh",
    disabled: !examples.length,
    onClick: () => {
      setExamples([]);
      setModel(null);
      setChal(null);
    }
  }, "\u0E25\u0E49\u0E32\u0E07\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07")), counts.some(n => n < 2) && React.createElement("span", {
    className: "hint"
  }, "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22\u0E17\u0E48\u0E32\u0E25\u0E30 2 \u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07")), pred && React.createElement("div", {
    className: "pred-box"
  }, React.createElement("b", null, "\u0E17\u0E48\u0E32\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19 \u2192 ", React.createElement("span", {
    style: {
      color: clsColor(POSE_CLASSES, pred.label)
    }
  }, clsName(POSE_CLASSES, pred.label))), React.createElement(ConfBars, {
    votes: pred.votes,
    classes: POSE_CLASSES,
    total: pred.neighbors.length
  })))), model && showChallenge && React.createElement("div", {
    className: "q-card"
  }, React.createElement("div", {
    className: "act-head"
  }, React.createElement("strong", null, "\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E01\u0E31\u0E1A\u0E17\u0E48\u0E32\u0E43\u0E2B\u0E21\u0E48 9 \u0E17\u0E48\u0E32\u0E17\u0E35\u0E48\u0E42\u0E21\u0E40\u0E14\u0E25\u0E44\u0E21\u0E48\u0E40\u0E04\u0E22\u0E40\u0E2B\u0E47\u0E19"), React.createElement(Button, {
    size: "sm",
    icon: "target",
    onClick: runChallenge
  }, "\u0E40\u0E23\u0E34\u0E48\u0E21\u0E17\u0E14\u0E2A\u0E2D\u0E1A")), chal && React.createElement(React.Fragment, null, React.createElement("b", {
    className: "mono"
  }, "Accuracy ", pct(chal.acc), " (", chal.correct, "/", chal.total, ")"), React.createElement("div", {
    className: "pose-chal"
  }, chal.preds.map(r => React.createElement("div", {
    key: r.item.id,
    className: "pc " + (r.ok ? "ok" : "no")
  }, React.createElement(Manikin, {
    kp: r.item.kp,
    size: 84,
    color: clsColor(POSE_CLASSES, r.item.label),
    label: `ท่าทดสอบ ${clsName(POSE_CLASSES, r.item.label)}`
  }), React.createElement("span", {
    className: "mono"
  }, r.ok ? "✓" : "✗", " ", clsName(POSE_CLASSES, r.pred.label)), React.createElement("span", {
    className: "hint"
  }, "\u0E08\u0E23\u0E34\u0E07: ", clsName(POSE_CLASSES, r.item.label))))), chal.acc < 1 && React.createElement("span", {
    className: "hint"
  }, "\u0E17\u0E48\u0E32\u0E17\u0E35\u0E48\u0E1C\u0E34\u0E14\u0E21\u0E31\u0E01\u0E15\u0E48\u0E32\u0E07\u0E08\u0E32\u0E01\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E17\u0E35\u0E48\u0E40\u0E01\u0E47\u0E1A\u0E44\u0E27\u0E49 \u0E40\u0E0A\u0E48\u0E19 \u0E22\u0E01\u0E21\u0E37\u0E2D\u0E02\u0E49\u0E32\u0E07\u0E40\u0E14\u0E35\u0E22\u0E27\u0E2B\u0E23\u0E37\u0E2D\u0E07\u0E2D\u0E28\u0E2D\u0E01 \u0E25\u0E2D\u0E07\u0E40\u0E01\u0E47\u0E1A\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E17\u0E35\u0E48\u0E2B\u0E25\u0E32\u0E01\u0E2B\u0E25\u0E32\u0E22\u0E02\u0E36\u0E49\u0E19\u0E41\u0E25\u0E49\u0E27\u0E1D\u0E36\u0E01\u0E43\u0E2B\u0E21\u0E48"))));
}

function handLandmarks(h) {
  const pts = [[0, 0]];
  FINGERS.forEach((f, fi) => {
    let [x, y] = f.base,
      ang = f.dir;
    pts.push([x, y]);
    f.len.forEach(L => {
      ang += fi === 0 ? h.c[0] * 0.75 : h.c[fi] * 1.2;
      x += L * Math.sin(ang) * (fi === 0 ? 1 : 1);
      y -= L * Math.cos(ang);
      pts.push([x, y]);
    });
  });
  const r = (h.rot || 0) * Math.PI / 180;
  return pts.map(([x, y]) => [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)]);
}
function handFeatures(lm) {
  const ref = Math.hypot(lm[9][0], lm[9][1]) || 1;
  return lm.flatMap(([x, y]) => [x / ref, y / ref]);
}
function HandView({
  lm,
  color = "#57CCF2",
  size = 170,
  label
}) {
  const xs = lm.map(p => p[0]),
    ys = lm.map(p => p[1]),
    cx = (Math.min(...xs) + Math.max(...xs)) / 2,
    cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const sc = Math.min(1.9, 150 / Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 1));
  const T = p => [100 + (p[0] - cx) * sc, 100 + (p[1] - cy) * sc];
  const palm = [0, 1, 5, 9, 13, 17].map(i => T(lm[i]));
  return React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: size,
    className: "manikin",
    role: "img",
    "aria-label": label || "ภาพมือ"
  }, React.createElement("rect", {
    width: "200",
    height: "200",
    rx: "12",
    fill: "#0B1026"
  }), React.createElement("polygon", {
    points: palm.map(p => p.join(",")).join(" "),
    fill: color,
    opacity: ".22"
  }), [0, 1, 2, 3, 4].map(f => {
    const ids = [0, f * 4 + 1, f * 4 + 2, f * 4 + 3, f * 4 + 4];
    return React.createElement("polyline", {
      key: f,
      points: ids.map(i => T(lm[i]).join(",")).join(" "),
      fill: "none",
      stroke: color,
      strokeWidth: Math.max(8, 9 * sc),
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: ".9"
    });
  }), [[5, 9], [9, 13], [13, 17], [0, 17]].map(([a, b], i) => React.createElement("line", {
    key: i,
    x1: T(lm[a])[0],
    y1: T(lm[a])[1],
    x2: T(lm[b])[0],
    y2: T(lm[b])[1],
    stroke: color,
    strokeWidth: "4",
    opacity: ".6"
  })), lm.map((p, i) => {
    const q = T(p);
    return React.createElement("circle", {
      key: i,
      cx: q[0],
      cy: q[1],
      r: i === 0 ? 5 : 3,
      fill: "#0F172A"
    });
  }));
}

function handChallenge() {
  const r = ML.rng(4242),
    j = (v, a) => Math.max(0, Math.min(1, v + (r() - 0.5) * a));
  const H = [["open", 0, 0.25, -15], ["open", 0, 0.2, 20], ["open", 0.1, 0.3, 0], ["fist", 1, 0.2, 10], ["fist", 0.9, 0.15, -20], ["fist", 1, 0.2, 35], ["thumb", 0, 0.15, 70], ["thumb", 0.1, 0.2, 90], ["thumb", 0, 0.2, 55]];
  return H.map(([label, base, jit, rot], i) => {
    const c = label === "thumb" ? [j(0.05, 0.1), j(1, jit), j(1, jit), j(1, jit), j(1, jit)] : [0, 1, 2, 3, 4].map(() => j(base, jit));
    return {
      id: "h" + i,
      label,
      h: {
        c,
        rot
      },
      lm: handLandmarks({
        c,
        rot
      })
    };
  });
}
function HandExplorer({
  examples,
  setExamples,
  onEvent,
  challenge
}) {
  const [h, setH] = useState({
    c: [0, 0, 0, 0, 0],
    rot: 0
  });
  const [model, setModel] = useState(null);
  const lm = handLandmarks(h);
  const pred = model ? ML.predict(model, handFeatures(lm), 3) : null;
  const counts = HAND_CLASSES.map(c => examples.filter(e => e.label === c.id).length);
  const add = label => {
    setExamples(ex => [...ex, {
      label,
      x: handFeatures(lm)
    }]);
    setModel(null);
    onEvent && onEvent({
      type: "add"
    });
  };
  const train = () => {
    setModel(ML.train(examples, {
      scale: false,
      weighted: true
    }));
    onEvent && onEvent({
      type: "train"
    });
  };
  return React.createElement("div", {
    className: "lab-tool"
  }, React.createElement("div", {
    className: "panel-head"
  }, React.createElement("span", {
    className: "panel-title"
  }, React.createElement(Icon, {
    name: "user",
    size: 16
  }), "Hand Pose Explorer"), React.createElement(Badge, {
    tone: "demo"
  }, "\u0E42\u0E2B\u0E21\u0E14\u0E1D\u0E36\u0E01\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E49\u0E40\u0E27\u0E47\u0E1A\u0E41\u0E04\u0E21")), React.createElement("div", {
    className: "pose-grid"
  }, React.createElement("div", {
    style: {
      display: "grid",
      gap: 8,
      justifyItems: "center"
    }
  }, React.createElement(HandView, {
    lm: lm,
    color: pred ? clsColor(HAND_CLASSES, pred.label) : "#57CCF2",
    label: "\u0E21\u0E37\u0E2D\u0E17\u0E35\u0E48\u0E1B\u0E23\u0E31\u0E1A\u0E44\u0E14\u0E49 21 \u0E08\u0E38\u0E14"
  }), React.createElement("div", {
    className: "opts"
  }, HAND_CLASSES.map(c => React.createElement("button", {
    key: c.id,
    type: "button",
    className: "opt chip",
    onClick: () => setH(HAND_PRESETS[c.id])
  }, c.name.split(" · ")[0])))), React.createElement("div", {
    style: {
      display: "grid",
      gap: 10,
      minWidth: 0,
      alignContent: "start"
    }
  }, React.createElement("fieldset", {
    className: "controls"
  }, React.createElement("legend", null, "\u0E07\u0E2D\u0E19\u0E34\u0E49\u0E27 (0 = \u0E40\u0E2B\u0E22\u0E35\u0E22\u0E14, 100 = \u0E07\u0E2D\u0E2A\u0E38\u0E14)"), FINGERS.map((f, i) => React.createElement("div", {
    className: "ctl wide",
    key: i
  }, React.createElement("label", {
    htmlFor: "hf" + i
  }, f.n), React.createElement("input", {
    id: "hf" + i,
    type: "range",
    min: "0",
    max: "100",
    value: Math.round(h.c[i] * 100),
    onChange: e => setH(q => {
      const c = [...q.c];
      c[i] = +e.target.value / 100;
      return {
        ...q,
        c
      };
    })
  }), React.createElement("output", {
    className: "mono"
  }, Math.round(h.c[i] * 100)))), React.createElement("div", {
    className: "ctl wide"
  }, React.createElement("label", {
    htmlFor: "hrot"
  }, "\u0E2B\u0E21\u0E38\u0E19\u0E21\u0E37\u0E2D"), React.createElement("input", {
    id: "hrot",
    type: "range",
    min: "-90",
    max: "90",
    value: h.rot,
    onChange: e => setH(q => ({
      ...q,
      rot: +e.target.value
    }))
  }), React.createElement("output", {
    className: "mono"
  }, h.rot, "\xB0"))), React.createElement("span", {
    className: "hint"
  }, "\u0E42\u0E21\u0E40\u0E14\u0E25\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E21\u0E37\u0E2D \u0E40\u0E0A\u0E48\u0E19 MediaPipe Hands \u0E2B\u0E32\u0E08\u0E38\u0E14\u0E2A\u0E33\u0E04\u0E31\u0E0D 21 \u0E08\u0E38\u0E14\u0E08\u0E32\u0E01\u0E20\u0E32\u0E1E\u0E01\u0E25\u0E49\u0E2D\u0E07 \u0E41\u0E25\u0E49\u0E27\u0E19\u0E33\u0E1E\u0E34\u0E01\u0E31\u0E14\u0E44\u0E1B\u0E08\u0E33\u0E41\u0E19\u0E01\u0E17\u0E48\u0E32 \u0E17\u0E35\u0E48\u0E19\u0E35\u0E48\u0E43\u0E0A\u0E49\u0E41\u0E16\u0E1A\u0E04\u0E27\u0E1A\u0E04\u0E38\u0E21\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E08\u0E38\u0E14\u0E41\u0E17\u0E19\u0E01\u0E25\u0E49\u0E2D\u0E07"), React.createElement("div", {
    className: "q-card"
  }, React.createElement("strong", {
    style: {
      fontSize: 14
    }
  }, "\u0E40\u0E01\u0E47\u0E1A\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E17\u0E48\u0E32\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E47\u0E19"), React.createElement("div", {
    className: "opts"
  }, HAND_CLASSES.map((c, i) => React.createElement("button", {
    key: c.id,
    type: "button",
    className: "opt",
    onClick: () => add(c.id)
  }, React.createElement("span", {
    className: "dot-c",
    style: {
      background: c.color
    }
  }), c.name.split(" · ")[0], " ", React.createElement("span", {
    className: "mono hint"
  }, counts[i])))), React.createElement("div", {
    className: "btn-inline"
  }, React.createElement(Button, {
    size: "sm",
    icon: "cpu",
    disabled: counts.some(n => n < 2),
    onClick: train
  }, "\u0E1D\u0E36\u0E01\u0E15\u0E31\u0E27\u0E08\u0E33\u0E41\u0E19\u0E01\u0E17\u0E48\u0E32\u0E21\u0E37\u0E2D"), React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    icon: "refresh",
    disabled: !examples.length,
    onClick: () => {
      setExamples([]);
      setModel(null);
    }
  }, "\u0E25\u0E49\u0E32\u0E07\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07"))), pred && React.createElement("div", {
    className: "pred-box"
  }, React.createElement("b", null, "\u0E17\u0E48\u0E32\u0E21\u0E37\u0E2D\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19 \u2192 ", React.createElement("span", {
    style: {
      color: clsColor(HAND_CLASSES, pred.label)
    }
  }, clsName(HAND_CLASSES, pred.label))), React.createElement(ConfBars, {
    votes: pred.votes,
    classes: HAND_CLASSES,
    total: pred.neighbors.length
  })))), challenge && challenge(model));
}

function GtCanvas({
  el,
  img,
  preds,
  gts
}) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || !img) return;
    c.width = img.width;
    c.height = img.height;
    const g = c.getContext("2d");
    g.drawImage(el, 0, 0, img.width, img.height);
    const fs = Math.max(12, Math.round(img.width / 34));
    g.font = `600 ${fs}px Prompt, sans-serif`;
    gts.forEach(t => {
      const [x, y, w, h] = t.bbox;
      g.setLineDash([8, 6]);
      g.strokeStyle = "#FFD66D";
      g.lineWidth = 3;
      g.strokeRect(x + 2, y + 2, w - 4, h - 4);
      g.setLineDash([]);
      g.fillStyle = "#FFD66D";
      const tw = g.measureText("GT " + t.class).width + 8;
      g.fillRect(x + 2, y + h - fs - 8, tw, fs + 6);
      g.fillStyle = "#0B1026";
      g.fillText("GT " + t.class, x + 6, y + h - 6);
    });
    preds.forEach(p => {
      const [x, y, w, h] = p.bbox;
      const col = p.kind === "TP" ? "#5BE3A8" : "#FF7A90";
      g.strokeStyle = col;
      g.lineWidth = 3;
      g.strokeRect(x, y, w, h);
      const t = `${p.kind} ${p.class} ${Math.round(p.score * 100)}%`,
        tw = g.measureText(t).width + 8;
      g.fillStyle = col;
      g.fillRect(x, y, tw, fs + 6);
      g.fillStyle = "#0B1026";
      g.fillText(t, x + 4, y + fs);
    });
  }, [el, img, preds, gts]);
  return React.createElement("div", {
    className: "dc-wrap"
  }, React.createElement("canvas", {
    ref: ref,
    "aria-label": "\u0E20\u0E32\u0E1E\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E01\u0E23\u0E2D\u0E1A\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E23\u0E34\u0E07\u0E41\u0E25\u0E30\u0E01\u0E23\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E42\u0E21\u0E40\u0E14\u0E25\u0E17\u0E33\u0E19\u0E32\u0E22"
  }));
}
function DetectionAnalysis({
  onAnalyze
}) {
  const [id, setId] = useState("coffee");
  const [src, setSrc] = useState(null);
  const [th, setTh] = useState(0.5);
  const [iouTh, setIouTh] = useState(0.5);
  const [live, setLive] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => {
    let on = true;
    loadSample(id, 800).then(r => on && setSrc(r));
    return () => {
      on = false;
    };
  }, [id]);
  const preds = (live[id] || RECORDED[id] || []).filter(p => p.score >= th);
  const res = ML.matchDetections(preds, GROUND_TRUTH[id], iouTh);
  useEffect(() => {
    onAnalyze && onAnalyze({
      id,
      th,
      iouTh,
      res
    });
  }, [id, th, iouTh, live]);
  const runLive = async () => {
    setLoading(true);
    setErr("");
    try {
      const {
        model
      } = await getDetector();
      const p = await model.detect(src.el, 20, 0.1);
      setLive(l => ({
        ...l,
        [id]: p.map(d => ({
          class: d.class,
          score: d.score,
          bbox: d.bbox
        }))
      }));
    } catch (e) {
      setErr("โหลดโมเดลไม่สำเร็จ ใช้ผลที่บันทึกไว้ต่อได้");
    }
    setLoading(false);
  };
  return React.createElement("div", {
    className: "lab-tool"
  }, React.createElement("div", {
    className: "panel-head"
  }, React.createElement("span", {
    className: "panel-title"
  }, React.createElement(Icon, {
    name: "target",
    size: 16
  }), "Detection Result Analyzer"), React.createElement(Badge, {
    tone: live[id] ? "ok" : "cyan"
  }, live[id] ? "ผลสดจาก COCO-SSD" : "ผลจริงที่บันทึกจาก COCO-SSD")), React.createElement("div", {
    className: "opts"
  }, ["cat", "coffee", "horse", "rocket"].map(s => React.createElement("button", {
    key: s,
    type: "button",
    className: "opt chip",
    "aria-pressed": id === s,
    onClick: () => setId(s)
  }, SAMPLES.find(x => x.id === s).label))), React.createElement("div", {
    className: "det-grid"
  }, React.createElement("div", {
    className: "viewer"
  }, src && src.el && React.createElement(GtCanvas, {
    el: src.el,
    img: src.img,
    preds: res.rows,
    gts: GROUND_TRUTH[id]
  }), React.createElement("span", {
    className: "hint"
  }, React.createElement("b", {
    style: {
      color: "#FFD66D"
    }
  }, "\u0E40\u0E2A\u0E49\u0E19\u0E1B\u0E23\u0E30\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E07"), " = \u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E23\u0E34\u0E07 (Ground Truth) \u0E17\u0E35\u0E48\u0E04\u0E23\u0E39\u0E27\u0E32\u0E14\u0E44\u0E27\u0E49 \xB7 ", React.createElement("b", {
    style: {
      color: "#5BE3A8"
    }
  }, "\u0E40\u0E02\u0E35\u0E22\u0E27"), " = \u0E17\u0E33\u0E19\u0E32\u0E22\u0E16\u0E39\u0E01 (TP) \xB7 ", React.createElement("b", {
    style: {
      color: "#FF7A90"
    }
  }, "\u0E0A\u0E21\u0E1E\u0E39"), " = \u0E17\u0E33\u0E19\u0E32\u0E22\u0E1C\u0E34\u0E14 (FP)")), React.createElement("div", {
    className: "inspector"
  }, React.createElement("div", {
    className: "ctl"
  }, React.createElement("label", {
    htmlFor: "da-th"
  }, "Confidence"), React.createElement("input", {
    id: "da-th",
    type: "range",
    min: "0.1",
    max: "0.9",
    step: "0.05",
    value: th,
    onChange: e => setTh(+e.target.value)
  }), React.createElement("output", {
    className: "mono"
  }, Math.round(th * 100), "%")), React.createElement("div", {
    className: "ctl"
  }, React.createElement("label", {
    htmlFor: "da-iou"
  }, "IoU \u0E02\u0E31\u0E49\u0E19\u0E15\u0E48\u0E33"), React.createElement("input", {
    id: "da-iou",
    type: "range",
    min: "0.3",
    max: "0.9",
    step: "0.05",
    value: iouTh,
    onChange: e => setIouTh(+e.target.value)
  }), React.createElement("output", {
    className: "mono"
  }, iouTh.toFixed(2))), React.createElement("div", {
    className: "metric-row"
  }, React.createElement("div", null, React.createElement("b", {
    className: "mono"
  }, res.tp), React.createElement("span", null, "TP")), React.createElement("div", null, React.createElement("b", {
    className: "mono"
  }, res.fp), React.createElement("span", null, "FP")), React.createElement("div", null, React.createElement("b", {
    className: "mono"
  }, res.fnCount), React.createElement("span", null, "FN"))), React.createElement("div", {
    className: "metric-row two"
  }, React.createElement("div", null, React.createElement("b", {
    className: "mono"
  }, pct(res.precision)), React.createElement("span", null, "Precision")), React.createElement("div", null, React.createElement("b", {
    className: "mono"
  }, pct(res.recall)), React.createElement("span", null, "Recall"))), React.createElement("div", {
    className: "table-wrap"
  }, React.createElement("table", {
    className: "hist det-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "\u0E1C\u0E25\u0E17\u0E33\u0E19\u0E32\u0E22"), React.createElement("th", null, "Conf."), React.createElement("th", null, "IoU"), React.createElement("th", null, "\u0E1C\u0E25"))), React.createElement("tbody", null, res.rows.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "4"
  }, "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1C\u0E25\u0E17\u0E35\u0E48\u0E1C\u0E48\u0E32\u0E19 threshold")), res.rows.map((r, i) => React.createElement("tr", {
    key: i
  }, React.createElement("td", null, r.class), React.createElement("td", {
    className: "mono"
  }, Math.round(r.score * 100), "%"), React.createElement("td", {
    className: "mono"
  }, r.iou.toFixed(2)), React.createElement("td", null, React.createElement("b", {
    style: {
      color: r.kind === "TP" ? "var(--ok)" : "var(--err)"
    }
  }, r.kind)))), res.fn.map((f, i) => React.createElement("tr", {
    key: "fn" + i
  }, React.createElement("td", null, f.class), React.createElement("td", {
    className: "mono"
  }, "\u2013"), React.createElement("td", {
    className: "mono"
  }, "\u2013"), React.createElement("td", null, React.createElement("b", {
    style: {
      color: "var(--gold)"
    }
  }, "FN (\u0E1E\u0E25\u0E32\u0E14)"))))))), React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    icon: "cpu",
    disabled: loading || !src,
    onClick: runLive
  }, loading ? "กำลังตรวจจับ…" : "รันโมเดลสดกับภาพนี้"), err && React.createElement("span", {
    className: "field-err"
  }, err))));
}
function IouDemo() {
  const [off, setOff] = useState(30);
  const a = [40, 40, 120, 100],
    b = [40 + off, 40 + off * 0.4, 120, 100],
    v = ML.iou(a, b);
  return React.createElement("div", {
    className: "q-card iou-demo"
  }, React.createElement("svg", {
    viewBox: "0 0 300 200",
    role: "img",
    "aria-label": `ตัวอย่าง IoU ${v.toFixed(2)}`
  }, React.createElement("rect", {
    width: "300",
    height: "200",
    rx: "10",
    fill: "#0B1026"
  }), React.createElement("rect", {
    x: a[0],
    y: a[1],
    width: a[2],
    height: a[3],
    fill: "rgba(255,214,109,.15)",
    stroke: "#FFD66D",
    strokeWidth: "3",
    strokeDasharray: "7 5"
  }), React.createElement("rect", {
    x: b[0],
    y: b[1],
    width: b[2],
    height: b[3],
    fill: "rgba(0,229,255,.15)",
    stroke: "#00E5FF",
    strokeWidth: "3"
  }), React.createElement("text", {
    x: "44",
    y: "34",
    fill: "#FFD66D",
    fontSize: "12"
  }, "\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E23\u0E34\u0E07"), React.createElement("text", {
    x: b[0] + 4,
    y: b[1] + b[3] + 16,
    fill: "#00E5FF",
    fontSize: "12"
  }, "\u0E1C\u0E25\u0E17\u0E33\u0E19\u0E32\u0E22")), React.createElement("div", {
    style: {
      display: "grid",
      gap: 8,
      alignContent: "start"
    }
  }, React.createElement("div", {
    className: "ctl wide"
  }, React.createElement("label", {
    htmlFor: "iou-off"
  }, "\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E01\u0E23\u0E2D\u0E1A"), React.createElement("input", {
    id: "iou-off",
    type: "range",
    min: "0",
    max: "140",
    value: off,
    onChange: e => setOff(+e.target.value)
  }), React.createElement("output", {
    className: "mono"
  }, off)), React.createElement("b", {
    className: "mono",
    style: {
      fontSize: 22
    }
  }, "IoU = ", v.toFixed(2)), React.createElement("span", {
    className: "hint"
  }, "IoU (Intersection over Union) = \u0E1E\u0E37\u0E49\u0E19\u0E17\u0E35\u0E48\u0E0B\u0E49\u0E2D\u0E19\u0E17\u0E31\u0E1A \xF7 \u0E1E\u0E37\u0E49\u0E19\u0E17\u0E35\u0E48\u0E23\u0E27\u0E21\u0E02\u0E2D\u0E07\u0E2A\u0E2D\u0E07\u0E01\u0E23\u0E2D\u0E1A \u0E04\u0E48\u0E32 1 \u0E04\u0E37\u0E2D\u0E17\u0E31\u0E1A\u0E01\u0E31\u0E19\u0E1E\u0E2D\u0E14\u0E35 \u0E16\u0E49\u0E32\u0E15\u0E31\u0E49\u0E07\u0E40\u0E01\u0E13\u0E11\u0E4C IoU \u2265 0.5 \u0E01\u0E23\u0E2D\u0E1A\u0E19\u0E35\u0E49", v >= 0.5 ? "นับว่าทำนายตำแหน่งถูก" : "ยังไม่นับว่าถูก")));
}

function ToolCards({
  ids
}) {
  return React.createElement("div", {
    className: "tool-grid"
  }, ML_TOOLS.filter(t => !ids || ids.includes(t.id)).map(t => React.createElement("article", {
    key: t.id,
    className: "tool-card"
  }, React.createElement("div", {
    className: "tool-top"
  }, React.createElement("span", {
    className: "tool-ic"
  }, React.createElement(Icon, {
    name: t.icon,
    size: 20
  })), React.createElement("h4", null, t.name)), React.createElement("p", null, t.what), React.createElement("b", {
    className: "eyebrow"
  }, "\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08"), React.createElement("ol", {
    className: "answer-line"
  }, t.mission.map(m => React.createElement("li", {
    key: m
  }, m))), React.createElement("span", {
    className: "hint"
  }, t.note, " \xB7 \u0E1C\u0E25\u0E07\u0E32\u0E19\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E19\u0E31\u0E49\u0E19 \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E2A\u0E48\u0E07\u0E01\u0E25\u0E31\u0E1A\u0E21\u0E32\u0E17\u0E35\u0E48\u0E40\u0E27\u0E47\u0E1A\u0E19\u0E35\u0E49"), React.createElement("a", {
    className: "btn btn-ghost btn-sm",
    href: t.url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "\u0E40\u0E1B\u0E34\u0E14 ", t.name.replace("Google ", ""), " \u0E43\u0E19\u0E41\u0E17\u0E47\u0E1A\u0E43\u0E2B\u0E21\u0E48 ", React.createElement(Icon, {
    name: "chevR",
    size: 14
  })))));
}

const KNN_CODE = `from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Feature: [น้ำหนัก (กรัม), ค่าสี]   Label: ชนิดผลไม้
X = [[172, 0.86], [205, 0.71], [118, 0.60], [160, 0.90], [230, 0.68], [104, 0.57]]
y = ["แอปเปิล", "ส้ม", "เลมอน", "แอปเปิล", "ส้ม", "เลมอน"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=7)

model = KNeighborsClassifier(n_neighbors=1)   # k = 1 เพราะตัวอย่างนี้มีข้อมูลน้อย
model.fit(X_train, y_train)                   # ฝึกโมเดล

pred = model.predict(X_test)                  # ทำนายข้อมูลทดสอบ
print(accuracy_score(y_test, pred))           # ความแม่นยำ 0.0–1.0
print(model.predict([[190, 0.88]]))           # ทำนายผลไม้ลูกใหม่`;
function U3Lesson1() {
  const [data, setData] = useState(() => makeFruits(20));
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "Machine Learning \u0E04\u0E37\u0E2D\u0E2D\u0E30\u0E44\u0E23"), React.createElement("p", null, React.createElement("b", null, "\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E02\u0E2D\u0E07\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07 (Machine Learning: ML)"), " \u0E04\u0E37\u0E2D\u0E2A\u0E32\u0E02\u0E32\u0E02\u0E2D\u0E07 AI \u0E17\u0E35\u0E48\u0E43\u0E2B\u0E49\u0E04\u0E2D\u0E21\u0E1E\u0E34\u0E27\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E08\u0E32\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07 \u0E41\u0E25\u0E49\u0E27\u0E19\u0E33\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E19\u0E31\u0E49\u0E19\u0E44\u0E1B\u0E17\u0E33\u0E19\u0E32\u0E22\u0E2B\u0E23\u0E37\u0E2D\u0E15\u0E31\u0E14\u0E2A\u0E34\u0E19\u0E43\u0E08\u0E01\u0E31\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E2B\u0E21\u0E48 \u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E02\u0E35\u0E22\u0E19\u0E01\u0E0E\u0E17\u0E38\u0E01\u0E02\u0E49\u0E2D\u0E40\u0E2D\u0E07 \u0E40\u0E0A\u0E48\u0E19 \u0E41\u0E17\u0E19\u0E17\u0E35\u0E48\u0E08\u0E30\u0E40\u0E02\u0E35\u0E22\u0E19\u0E27\u0E48\u0E32 \"\u0E16\u0E49\u0E32\u0E2B\u0E19\u0E31\u0E01\u0E40\u0E01\u0E34\u0E19 180 \u0E01\u0E23\u0E31\u0E21\u0E41\u0E25\u0E30\u0E2A\u0E35\u0E41\u0E14\u0E07\u0E04\u0E37\u0E2D\u0E41\u0E2D\u0E1B\u0E40\u0E1B\u0E34\u0E25\" \u0E40\u0E23\u0E32\u0E43\u0E2B\u0E49\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E1C\u0E25\u0E44\u0E21\u0E49\u0E17\u0E35\u0E48\u0E23\u0E39\u0E49\u0E0A\u0E37\u0E48\u0E2D\u0E41\u0E25\u0E49\u0E27\u0E2B\u0E25\u0E32\u0E22\u0E23\u0E49\u0E2D\u0E22\u0E25\u0E39\u0E01 \u0E43\u0E2B\u0E49\u0E23\u0E30\u0E1A\u0E1A\u0E2B\u0E32\u0E40\u0E01\u0E13\u0E11\u0E4C\u0E40\u0E2D\u0E07")), React.createElement("div", {
    className: "flip-grid"
  }, React.createElement(FlipCard, {
    label: "Supervised Learning",
    front: React.createElement(React.Fragment, null, React.createElement("span", {
      className: "ft-tag"
    }, "\u0E21\u0E35\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E43\u0E2B\u0E49\u0E40\u0E23\u0E35\u0E22\u0E19"), React.createElement("span", {
      className: "ft"
    }, "Supervised Learning"), React.createElement("span", {
      className: "fp"
    }, "\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E41\u0E1A\u0E1A\u0E21\u0E35\u0E1C\u0E39\u0E49\u0E2A\u0E2D\u0E19")),
    back: React.createElement(React.Fragment, null, React.createElement("span", {
      className: "ft-sm"
    }, "\u0E40\u0E23\u0E35\u0E22\u0E19\u0E08\u0E32\u0E01\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E17\u0E35\u0E48\u0E21\u0E35 Label"), React.createElement("span", {
      className: "fp"
    }, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1D\u0E36\u0E01\u0E17\u0E38\u0E01\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E21\u0E35\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E01\u0E33\u0E01\u0E31\u0E1A \u0E42\u0E21\u0E40\u0E14\u0E25\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E31\u0E21\u0E1E\u0E31\u0E19\u0E18\u0E4C\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07 Feature \u0E01\u0E31\u0E1A Label \u0E40\u0E0A\u0E48\u0E19 \u0E20\u0E32\u0E1E\u0E1C\u0E25\u0E44\u0E21\u0E49\u0E17\u0E35\u0E48\u0E15\u0E34\u0E14\u0E1B\u0E49\u0E32\u0E22\u0E0A\u0E37\u0E48\u0E2D \u0E43\u0E0A\u0E49\u0E01\u0E31\u0E1A\u0E07\u0E32\u0E19\u0E08\u0E33\u0E41\u0E19\u0E01 (Classification) \u0E41\u0E25\u0E30\u0E17\u0E33\u0E19\u0E32\u0E22\u0E04\u0E48\u0E32\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02 (Regression) \u0E17\u0E38\u0E01 Lab \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E41\u0E1A\u0E1A\u0E21\u0E35\u0E1C\u0E39\u0E49\u0E2A\u0E2D\u0E19"))
  }), React.createElement(FlipCard, {
    label: "Unsupervised Learning",
    front: React.createElement(React.Fragment, null, React.createElement("span", {
      className: "ft-tag"
    }, "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E04\u0E33\u0E15\u0E2D\u0E1A"), React.createElement("span", {
      className: "ft"
    }, "Unsupervised Learning"), React.createElement("span", {
      className: "fp"
    }, "\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1C\u0E39\u0E49\u0E2A\u0E2D\u0E19")),
    back: React.createElement(React.Fragment, null, React.createElement("span", {
      className: "ft-sm"
    }, "\u0E2B\u0E32\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E43\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E2D\u0E07"), React.createElement("span", {
      className: "fp"
    }, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E21\u0E35 Label \u0E42\u0E21\u0E40\u0E14\u0E25\u0E08\u0E31\u0E14\u0E01\u0E25\u0E38\u0E48\u0E21 (Clustering) \u0E15\u0E32\u0E21\u0E04\u0E27\u0E32\u0E21\u0E04\u0E25\u0E49\u0E32\u0E22\u0E40\u0E2D\u0E07 \u0E40\u0E0A\u0E48\u0E19 \u0E41\u0E1A\u0E48\u0E07\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E40\u0E1B\u0E47\u0E19\u0E01\u0E25\u0E38\u0E48\u0E21\u0E15\u0E32\u0E21\u0E1E\u0E24\u0E15\u0E34\u0E01\u0E23\u0E23\u0E21\u0E01\u0E32\u0E23\u0E0B\u0E37\u0E49\u0E2D \u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E21\u0E35\u0E43\u0E04\u0E23\u0E1A\u0E2D\u0E01\u0E25\u0E48\u0E27\u0E07\u0E2B\u0E19\u0E49\u0E32\u0E27\u0E48\u0E32\u0E21\u0E35\u0E01\u0E35\u0E48\u0E01\u0E25\u0E38\u0E48\u0E21\u0E2B\u0E23\u0E37\u0E2D\u0E01\u0E25\u0E38\u0E48\u0E21\u0E0A\u0E37\u0E48\u0E2D\u0E2D\u0E30\u0E44\u0E23"))
  })), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "\u0E04\u0E33\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E2A\u0E33\u0E04\u0E31\u0E0D")), React.createElement("div", {
    className: "table-wrap"
  }, React.createElement("table", {
    className: "hist"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E17\u0E35\u0E48"), React.createElement("th", null, "\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01 (g) ", React.createElement(Badge, {
    tone: "cyan"
  }, "Feature")), React.createElement("th", null, "\u0E04\u0E48\u0E32\u0E2A\u0E35 ", React.createElement(Badge, {
    tone: "cyan"
  }, "Feature")), React.createElement("th", null, "\u0E0A\u0E19\u0E34\u0E14 ", React.createElement(Badge, {
    tone: "demo"
  }, "Label")))), React.createElement("tbody", null, [["1", 172, 0.86, "แอปเปิล"], ["2", 205, 0.71, "ส้ม"], ["3", 118, 0.6, "เลมอน"]].map(r => React.createElement("tr", {
    key: r[0]
  }, r.map((c, i) => React.createElement("td", {
    key: i,
    className: i < 3 ? "mono" : ""
  }, c))))))), React.createElement(Accordion, {
    items: [{
      id: "fl",
      icon: "grid",
      title: "Feature และ Label",
      en: "ตัวแปรต้นและคำตอบ",
      content: React.createElement("p", null, React.createElement("b", null, "Feature"), " \u0E04\u0E37\u0E2D\u0E04\u0E38\u0E13\u0E25\u0E31\u0E01\u0E29\u0E13\u0E30\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E02\u0E49\u0E32 \u0E40\u0E0A\u0E48\u0E19 \u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01 \u0E02\u0E19\u0E32\u0E14 \u0E2A\u0E35 ", React.createElement("b", null, "Label"), " \u0E04\u0E37\u0E2D\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E43\u0E2B\u0E49\u0E42\u0E21\u0E40\u0E14\u0E25\u0E17\u0E32\u0E22 \u0E40\u0E0A\u0E48\u0E19 \u0E0A\u0E19\u0E34\u0E14\u0E1C\u0E25\u0E44\u0E21\u0E49 \u0E43\u0E19\u0E15\u0E32\u0E23\u0E32\u0E07\u0E02\u0E49\u0E32\u0E07\u0E1A\u0E19 \u0E41\u0E15\u0E48\u0E25\u0E30\u0E41\u0E16\u0E27\u0E04\u0E37\u0E2D 1 \u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07")
    }, {
      id: "tt",
      icon: "chart",
      title: "Training Data และ Testing Data",
      en: "ข้อมูลฝึกและข้อมูลทดสอบ",
      content: React.createElement("p", null, "\u0E41\u0E1A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E1B\u0E47\u0E19 2 \u0E2A\u0E48\u0E27\u0E19 \u0E2A\u0E48\u0E27\u0E19\u0E43\u0E2B\u0E0D\u0E48 (\u0E40\u0E0A\u0E48\u0E19 70\u201380%) \u0E43\u0E0A\u0E49\u0E1D\u0E36\u0E01 \u0E2A\u0E48\u0E27\u0E19\u0E17\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E40\u0E01\u0E47\u0E1A\u0E44\u0E27\u0E49\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E40\u0E2B\u0E21\u0E37\u0E2D\u0E19\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E40\u0E04\u0E22\u0E40\u0E2B\u0E47\u0E19 \u0E16\u0E49\u0E32\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E01\u0E31\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49\u0E1D\u0E36\u0E01 \u0E01\u0E47\u0E40\u0E2B\u0E21\u0E37\u0E2D\u0E19\u0E2D\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A\u0E08\u0E32\u0E01\u0E41\u0E1A\u0E1A\u0E1D\u0E36\u0E01\u0E2B\u0E31\u0E14\u0E17\u0E35\u0E48\u0E40\u0E09\u0E25\u0E22\u0E44\u0E1B\u0E41\u0E25\u0E49\u0E27 \u0E04\u0E30\u0E41\u0E19\u0E19\u0E08\u0E30\u0E2A\u0E39\u0E07\u0E40\u0E01\u0E34\u0E19\u0E08\u0E23\u0E34\u0E07")
    }, {
      id: "mp",
      icon: "puzzle",
      title: "Model และ Prediction",
      en: "โมเดลและการทำนาย",
      content: React.createElement("p", null, React.createElement("b", null, "\u0E42\u0E21\u0E40\u0E14\u0E25"), " \u0E04\u0E37\u0E2D\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E44\u0E14\u0E49\u0E08\u0E32\u0E01\u0E01\u0E32\u0E23\u0E1D\u0E36\u0E01 \u0E43\u0E0A\u0E49\u0E41\u0E1B\u0E25\u0E07 Feature \u0E43\u0E2B\u0E21\u0E48\u0E43\u0E2B\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E04\u0E33\u0E15\u0E2D\u0E1A ", React.createElement("b", null, "\u0E01\u0E32\u0E23\u0E17\u0E33\u0E19\u0E32\u0E22 (Prediction)"), " \u0E04\u0E37\u0E2D\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E42\u0E21\u0E40\u0E14\u0E25\u0E43\u0E2B\u0E49\u0E01\u0E31\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E2B\u0E21\u0E48 \u0E21\u0E31\u0E01\u0E21\u0E32\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E04\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E21\u0E31\u0E48\u0E19\u0E43\u0E08 (Confidence)")
    }, {
      id: "acc",
      icon: "target",
      title: "Accuracy",
      en: "ความแม่นยำ",
      content: React.createElement("p", null, "Accuracy = \u0E08\u0E33\u0E19\u0E27\u0E19\u0E17\u0E35\u0E48\u0E17\u0E33\u0E19\u0E32\u0E22\u0E16\u0E39\u0E01 \xF7 \u0E08\u0E33\u0E19\u0E27\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 \u0E40\u0E0A\u0E48\u0E19 \u0E17\u0E32\u0E22\u0E16\u0E39\u0E01 17 \u0E08\u0E32\u0E01 20 \u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07 = 85% \u0E41\u0E15\u0E48\u0E23\u0E30\u0E27\u0E31\u0E07 \u0E16\u0E49\u0E32\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E2A\u0E21\u0E14\u0E38\u0E25 \u0E40\u0E0A\u0E48\u0E19 \u0E21\u0E35\u0E41\u0E2D\u0E1B\u0E40\u0E1B\u0E34\u0E25 95 \u0E25\u0E39\u0E01 \u0E40\u0E25\u0E21\u0E2D\u0E19 5 \u0E25\u0E39\u0E01 \u0E42\u0E21\u0E40\u0E14\u0E25\u0E17\u0E35\u0E48\u0E15\u0E2D\u0E1A \"\u0E41\u0E2D\u0E1B\u0E40\u0E1B\u0E34\u0E25\" \u0E17\u0E38\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07\u0E01\u0E47\u0E44\u0E14\u0E49 95% \u0E17\u0E31\u0E49\u0E07\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1B\u0E23\u0E30\u0E42\u0E22\u0E0A\u0E19\u0E4C")
    }, {
      id: "of",
      icon: "alert",
      title: "Overfitting",
      en: "โมเดลจำแต่ไม่เข้าใจ",
      content: React.createElement("p", null, "\u0E42\u0E21\u0E40\u0E14\u0E25\u0E17\u0E35\u0E48\u0E08\u0E33\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1D\u0E36\u0E01\u0E44\u0E14\u0E49\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B \u0E08\u0E19\u0E08\u0E33\u0E41\u0E21\u0E49\u0E41\u0E15\u0E48\u0E04\u0E27\u0E32\u0E21\u0E1A\u0E31\u0E07\u0E40\u0E2D\u0E34\u0E0D\u0E2B\u0E23\u0E37\u0E2D\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14\u0E43\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 \u0E08\u0E30\u0E17\u0E33\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1D\u0E36\u0E01\u0E44\u0E14\u0E49\u0E14\u0E35\u0E21\u0E32\u0E01 \u0E41\u0E15\u0E48\u0E17\u0E33\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E2B\u0E21\u0E48\u0E44\u0E14\u0E49\u0E41\u0E22\u0E48 \u0E40\u0E2B\u0E21\u0E37\u0E2D\u0E19\u0E19\u0E31\u0E01\u0E40\u0E23\u0E35\u0E22\u0E19\u0E17\u0E48\u0E2D\u0E07\u0E40\u0E09\u0E25\u0E22\u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E40\u0E02\u0E49\u0E32\u0E43\u0E08 \u0E43\u0E19 kNN \u0E04\u0E48\u0E32 k = 1 \u0E40\u0E2A\u0E35\u0E48\u0E22\u0E07 Overfitting \u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32 k \u0E17\u0E35\u0E48\u0E43\u0E2B\u0E0D\u0E48\u0E02\u0E36\u0E49\u0E19")
    }, {
      id: "bias",
      icon: "chart",
      title: "Data Bias เบื้องต้น",
      en: "ข้อมูลลำเอียง",
      content: React.createElement("p", null, "\u0E16\u0E49\u0E32\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1D\u0E36\u0E01\u0E44\u0E21\u0E48\u0E04\u0E23\u0E2D\u0E1A\u0E04\u0E25\u0E38\u0E21\u0E2B\u0E23\u0E37\u0E2D\u0E21\u0E35\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E1A\u0E31\u0E07\u0E40\u0E2D\u0E34\u0E0D\u0E0B\u0E48\u0E2D\u0E19\u0E2D\u0E22\u0E39\u0E48 \u0E42\u0E21\u0E40\u0E14\u0E25\u0E08\u0E30\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E04\u0E27\u0E32\u0E21\u0E25\u0E33\u0E40\u0E2D\u0E35\u0E22\u0E07\u0E19\u0E31\u0E49\u0E19\u0E44\u0E1B\u0E14\u0E49\u0E27\u0E22 \u0E40\u0E0A\u0E48\u0E19 \u0E20\u0E32\u0E1E\u0E01\u0E25\u0E49\u0E27\u0E22\u0E17\u0E38\u0E01\u0E20\u0E32\u0E1E\u0E2D\u0E22\u0E39\u0E48\u0E1A\u0E19\u0E1E\u0E37\u0E49\u0E19\u0E2A\u0E35\u0E1F\u0E49\u0E32 \u0E42\u0E21\u0E40\u0E14\u0E25\u0E2D\u0E32\u0E08\u0E08\u0E33 \"\u0E2A\u0E35\u0E1F\u0E49\u0E32\" \u0E41\u0E17\u0E19 \"\u0E01\u0E25\u0E49\u0E27\u0E22\" \u0E0B\u0E36\u0E48\u0E07\u0E40\u0E18\u0E2D\u0E08\u0E30\u0E44\u0E14\u0E49\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E43\u0E19 LAB 3.3")
    }]
  }), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E01\u0E32\u0E23\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E42\u0E21\u0E40\u0E14\u0E25"), React.createElement("p", null, "\u0E04\u0E25\u0E34\u0E01\u0E41\u0E15\u0E48\u0E25\u0E30\u0E02\u0E31\u0E49\u0E19\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22")), React.createElement(MLPipeline, null), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "ML Training Simulator"), React.createElement("p", null, "\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E04\u0E23\u0E1A\u0E17\u0E31\u0E49\u0E07 4 \u0E2A\u0E48\u0E27\u0E19: \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 \u0E01\u0E33\u0E2B\u0E19\u0E14 Label (\u0E01\u0E14\u0E17\u0E35\u0E48\u0E1B\u0E49\u0E32\u0E22) \u0E1D\u0E36\u0E01 \u0E17\u0E14\u0E2A\u0E2D\u0E1A \u0E41\u0E25\u0E30\u0E17\u0E33\u0E19\u0E32\u0E22\u0E1C\u0E25\u0E44\u0E21\u0E49\u0E25\u0E39\u0E01\u0E43\u0E2B\u0E21\u0E48 \u0E25\u0E2D\u0E07\u0E25\u0E14\u0E08\u0E33\u0E19\u0E27\u0E19\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E15\u0E48\u0E2D\u0E04\u0E25\u0E32\u0E2A\u0E43\u0E2B\u0E49\u0E40\u0E2B\u0E25\u0E37\u0E2D 2 \u0E41\u0E25\u0E49\u0E27\u0E14\u0E39 Accuracy")), React.createElement(MLStudio, {
    data: data,
    setData: setData
  }), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "\u0E42\u0E04\u0E49\u0E14\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E31\u0E19\u0E43\u0E19 Python"), React.createElement("p", null, "\u0E04\u0E31\u0E14\u0E25\u0E2D\u0E01\u0E44\u0E1B\u0E23\u0E31\u0E19\u0E43\u0E19 Google Colab \u0E44\u0E14\u0E49 \u0E43\u0E0A\u0E49\u0E44\u0E25\u0E1A\u0E23\u0E32\u0E23\u0E35 scikit-learn \u0E0B\u0E36\u0E48\u0E07\u0E15\u0E34\u0E14\u0E15\u0E31\u0E49\u0E07\u0E21\u0E32\u0E43\u0E19 Colab \u0E41\u0E25\u0E49\u0E27")), React.createElement(CodeBlock, {
    code: KNN_CODE
  }));
}
function Lab31() {
  const [data] = useState(() => makeFruits(20));
  const [log, setLog] = useState([]);
  const [fl, setFl] = useState({});
  const onTrained = r => setLog(l => [...l.filter(x => !(x.feats.join() === r.feats.join() && x.k === r.k)), r]);
  const pairs = [...new Set(log.map(r => r.feats.join("+")))];
  const best = log.reduce((b, r) => !b || r.acc > b.acc ? r : b, null);
  const FL = [["mass", "น้ำหนัก (กรัม)", "f"], ["color", "ค่าสี", "f"], ["width", "ความกว้าง", "f"], ["label", "ชนิดผลไม้", "l"]];
  const flOk = FL.every(([id,, ans]) => fl[id] === ans);
  return React.createElement(LabShell, {
    unitId: "unit3",
    labId: "u3-a1",
    objective: "\u0E23\u0E30\u0E1A\u0E38 Feature \u0E41\u0E25\u0E30 Label \u0E02\u0E2D\u0E07\u0E0A\u0E38\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 \u0E41\u0E25\u0E30\u0E40\u0E1B\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E1C\u0E25\u0E02\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E40\u0E25\u0E37\u0E2D\u0E01 Feature \u0E15\u0E48\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E21\u0E48\u0E19\u0E22\u0E33\u0E02\u0E2D\u0E07\u0E42\u0E21\u0E40\u0E14\u0E25\u0E44\u0E14\u0E49",
    steps: [{
      id: "fl",
      text: "ระบุว่าคอลัมน์ใดเป็น Feature และคอลัมน์ใดเป็น Label",
      done: flOk
    }, {
      id: "three",
      text: "ฝึกโมเดลด้วย Feature อย่างน้อย 3 คู่ที่ต่างกัน",
      done: pairs.length >= 3,
      status: `ทดลองแล้ว ${pairs.length} คู่`
    }, {
      id: "best",
      text: "หาคู่ Feature ที่ได้ Accuracy ตั้งแต่ 90% ขึ้นไป",
      done: !!best && best.acc >= 0.9,
      status: best ? `ดีที่สุดตอนนี้ ${best.feats.map(f => FRUIT_FEATURES.find(x => x.id === f).name).join(" + ")} = ${pct(best.acc)}` : ""
    }],
    reflection: "\u0E17\u0E33\u0E44\u0E21 Feature \u0E1A\u0E32\u0E07\u0E04\u0E39\u0E48\u0E08\u0E36\u0E07\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E42\u0E21\u0E40\u0E14\u0E25\u0E41\u0E21\u0E48\u0E19\u0E22\u0E33\u0E01\u0E27\u0E48\u0E32\u0E04\u0E39\u0E48\u0E2D\u0E37\u0E48\u0E19 \u0E22\u0E01\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E08\u0E32\u0E01\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E02\u0E2D\u0E07\u0E40\u0E18\u0E2D",
    question: {
      q: "ถ้าต้องการสร้างโมเดลทำนายว่านักเรียนจะสอบผ่านหรือไม่ จากชั่วโมงอ่านหนังสือและคะแนนเก็บ ข้อใดถูกต้อง",
      options: [{
        id: "a",
        text: "Feature คือ ผ่าน/ไม่ผ่าน และ Label คือ ชั่วโมงอ่านหนังสือ"
      }, {
        id: "b",
        text: "Feature คือ ชั่วโมงอ่านหนังสือและคะแนนเก็บ ส่วน Label คือ ผ่าน/ไม่ผ่าน"
      }, {
        id: "c",
        text: "ทุกคอลัมน์เป็น Label"
      }, {
        id: "d",
        text: "ไม่ต้องมี Label เพราะเป็น Unsupervised Learning"
      }],
      answer: "b",
      explain: "Feature คือข้อมูลที่ใช้ทำนาย ส่วน Label คือคำตอบที่ต้องการทำนาย งานนี้มีคำตอบในข้อมูลฝึก จึงเป็น Supervised Learning",
      hint: "ถามตัวเองว่าอะไรคือสิ่งที่ 'อยากรู้' และอะไรคือข้อมูลที่ 'มีอยู่แล้ว'"
    }
  }, React.createElement("div", {
    className: "q-card"
  }, React.createElement("strong", null, "\u0E23\u0E30\u0E1A\u0E38\u0E0A\u0E19\u0E34\u0E14\u0E02\u0E2D\u0E07\u0E41\u0E15\u0E48\u0E25\u0E30\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C"), React.createElement("div", {
    className: "fl-grid"
  }, FL.map(([id, name]) => React.createElement("div", {
    key: id,
    className: "fl-row"
  }, React.createElement("span", null, name), React.createElement("div", {
    className: "mini-opts"
  }, [["f", "Feature"], ["l", "Label"]].map(([v, l]) => React.createElement("button", {
    key: v,
    type: "button",
    "aria-pressed": fl[id] === v,
    onClick: () => setFl(s => ({
      ...s,
      [id]: v
    })),
    style: {
      "--c": v === "f" ? "#57CCF2" : "#FFD66D"
    }
  }, l))), fl[id] && React.createElement("span", {
    className: fl[id] === FL.find(x => x[0] === id)[2] ? "ok-t" : "no-t"
  }, fl[id] === FL.find(x => x[0] === id)[2] ? "✓" : "✗"))))), React.createElement(MLStudio, {
    data: data,
    onTrained: onTrained,
    defaultFeats: ["width", "height"]
  }), log.length > 0 && React.createElement("div", {
    className: "q-card"
  }, React.createElement("strong", null, "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E17\u0E14\u0E25\u0E2D\u0E07"), React.createElement("div", {
    className: "table-wrap"
  }, React.createElement("table", {
    className: "hist"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Feature X"), React.createElement("th", null, "Feature Y"), React.createElement("th", null, "k"), React.createElement("th", null, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1D\u0E36\u0E01/\u0E17\u0E14\u0E2A\u0E2D\u0E1A"), React.createElement("th", null, "Accuracy"))), React.createElement("tbody", null, log.map((r, i) => React.createElement("tr", {
    key: i
  }, React.createElement("td", null, FRUIT_FEATURES.find(f => f.id === r.feats[0]).name), React.createElement("td", null, FRUIT_FEATURES.find(f => f.id === r.feats[1]).name), React.createElement("td", {
    className: "mono"
  }, r.k), React.createElement("td", {
    className: "mono"
  }, r.nTrain, "/", r.nTest), React.createElement("td", {
    className: "mono"
  }, React.createElement("b", null, pct(r.acc))))))))));
}

function Lab32() {
  const [data, setData] = useState(() => makeFruits(20).map(d => PREP_ERRORS[d.id] ? {
    ...d,
    label: PREP_ERRORS[d.id]
  } : d).map(d => d.label === "lemon" && d.trueLabel === "lemon" && +d.id.split("-")[1] > 8 ? {
    ...d,
    removed: true
  } : d));
  const [first, setFirst] = useState(null);
  const [last, setLast] = useState(null);
  const [pick, setPick] = useState(null);
  const fixed = data.filter(d => PREP_ERRORS[d.id] && d.label === d.trueLabel).length;
  const broken = data.filter(d => !PREP_ERRORS[d.id] && d.label !== d.trueLabel && !d.removed).length;
  const lemons = data.filter(d => d.trueLabel === "lemon" && !d.removed).length;
  const onTrained = r => {
    if (!first) setFirst(r);
    setLast({
      ...r,
      fixed,
      lemons
    });
  };
  const addLemons = () => setData(ds => ds.map(d => d.trueLabel === "lemon" ? {
    ...d,
    removed: false
  } : d));
  return React.createElement(LabShell, {
    unitId: "unit3",
    labId: "u3-a2",
    objective: "\u0E15\u0E23\u0E27\u0E08\u0E2B\u0E32\u0E41\u0E25\u0E30\u0E41\u0E01\u0E49\u0E1B\u0E31\u0E0D\u0E2B\u0E32\u0E43\u0E19\u0E0A\u0E38\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 \u0E44\u0E14\u0E49\u0E41\u0E01\u0E48 Label \u0E1C\u0E34\u0E14\u0E41\u0E25\u0E30\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E2A\u0E21\u0E14\u0E38\u0E25 \u0E41\u0E25\u0E49\u0E27\u0E40\u0E1B\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E1C\u0E25\u0E01\u0E48\u0E2D\u0E19\u0E41\u0E25\u0E30\u0E2B\u0E25\u0E31\u0E07\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25",
    steps: [{
      id: "base",
      text: "ฝึกโมเดลกับข้อมูลดิบหนึ่งครั้ง เพื่อเก็บผลก่อนเตรียมข้อมูล",
      done: !!first,
      status: first ? `ก่อนเตรียมข้อมูล: Accuracy ${pct(first.acc)}` : ""
    }, {
      id: "fix",
      text: "หาตัวอย่างที่ติด Label ผิด 6 ตัวอย่าง แล้วแก้ให้ถูก (กดจุดในกราฟเพื่อดูว่าเป็นตัวอย่างไหน)",
      done: fixed === 6 && broken === 0,
      status: `แก้แล้ว ${fixed}/6${broken ? ` · มี ${broken} ตัวอย่างที่ถูกเปลี่ยนเป็น Label ผิด` : ""}`
    }, {
      id: "bal",
      text: "แก้ปัญหาข้อมูลไม่สมดุล: เลมอนมีแค่ 8 ตัวอย่าง ให้เพิ่มข้อมูลเลมอน",
      done: lemons >= 20,
      status: `เลมอน ${lemons} ตัวอย่าง`
    }, {
      id: "after",
      text: "ฝึกโมเดลใหม่ด้วยข้อมูลที่เตรียมแล้ว ให้ได้ Accuracy อย่างน้อย 90%",
      done: !!last && last.fixed === 6 && last.lemons >= 20 && last.acc >= 0.9,
      status: last ? `ล่าสุด: Accuracy ${pct(last.acc)}` : ""
    }],
    reflection: "\u0E16\u0E49\u0E32\u0E44\u0E21\u0E48\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E48\u0E2D\u0E19\u0E1D\u0E36\u0E01 \u0E08\u0E30\u0E40\u0E01\u0E34\u0E14\u0E1C\u0E25\u0E40\u0E2A\u0E35\u0E22\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E23\u0E01\u0E31\u0E1A\u0E42\u0E21\u0E40\u0E14\u0E25\u0E43\u0E19\u0E0A\u0E35\u0E27\u0E34\u0E15\u0E08\u0E23\u0E34\u0E07 \u0E22\u0E01\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07 1 \u0E2A\u0E16\u0E32\u0E19\u0E01\u0E32\u0E23\u0E13\u0E4C",
    question: {
      q: "ทำไมจึงต้องแยกข้อมูลทดสอบไว้ และไม่นำมาใช้ฝึกโมเดล",
      options: [{
        id: "a",
        text: "เพื่อให้ฝึกเร็วขึ้นเท่านั้น"
      }, {
        id: "b",
        text: "เพราะข้อมูลทดสอบมักติด Label ผิด"
      }, {
        id: "c",
        text: "เพื่อวัดว่าโมเดลทำงานกับข้อมูลที่ไม่เคยเห็นได้ดีแค่ไหน ถ้าทดสอบกับข้อมูลฝึก คะแนนจะสูงเกินจริง"
      }, {
        id: "d",
        text: "เพราะกฎหมายกำหนดให้แบ่งข้อมูลเสมอ"
      }],
      answer: "c",
      explain: "ข้อมูลทดสอบทำหน้าที่เหมือนข้อสอบที่ไม่เคยเห็น จึงบอกความสามารถจริงของโมเดลในการใช้งานกับข้อมูลใหม่",
      hint: "นึกถึงการสอบด้วยข้อสอบที่เคยเห็นเฉลยแล้ว"
    }
  }, pick && React.createElement(Feedback, {
    tone: "mid",
    title: `ตัวอย่าง ${pick.id}`
  }, "\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01 ", pick.v.mass, " g \xB7 \u0E01\u0E27\u0E49\u0E32\u0E07 ", pick.v.width, " \xB7 \u0E2A\u0E39\u0E07 ", pick.v.height, " \xB7 \u0E04\u0E48\u0E32\u0E2A\u0E35 ", pick.v.color, " \xB7 Label \u0E15\u0E2D\u0E19\u0E19\u0E35\u0E49: ", React.createElement("b", null, clsName(FRUIT_CLASSES, data.find(d => d.id === pick.id).label)), React.createElement("div", {
    className: "mini-opts",
    style: {
      marginTop: 6
    }
  }, FRUIT_CLASSES.map(c => React.createElement("button", {
    key: c.id,
    type: "button",
    style: {
      "--c": c.color
    },
    "aria-pressed": data.find(d => d.id === pick.id).label === c.id,
    onClick: () => setData(ds => ds.map(d => d.id === pick.id ? {
      ...d,
      label: c.id
    } : d))
  }, c.name)))), React.createElement(MLStudio, {
    data: data,
    setData: setData,
    onTrained: onTrained,
    defaultFeats: ["mass", "color"],
    onPoint: it => setPick(it),
    highlight: pick ? [pick.id] : [],
    extraDataset: React.createElement("div", {
      className: "btn-inline"
    }, React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      icon: "grid",
      disabled: lemons >= 20,
      onClick: addLemons
    }, "\u0E40\u0E01\u0E47\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E25\u0E21\u0E2D\u0E19\u0E40\u0E1E\u0E34\u0E48\u0E21 12 \u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07"))
  }));
}
function U3Lesson2() {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "prose"
  }, React.createElement("p", null, React.createElement("b", null, "\u0E15\u0E31\u0E27\u0E08\u0E33\u0E41\u0E19\u0E01\u0E20\u0E32\u0E1E (Image Classifier)"), " \u0E04\u0E37\u0E2D\u0E42\u0E21\u0E40\u0E14\u0E25\u0E17\u0E35\u0E48\u0E23\u0E31\u0E1A\u0E20\u0E32\u0E1E\u0E40\u0E02\u0E49\u0E32\u0E44\u0E1B \u0E41\u0E25\u0E49\u0E27\u0E15\u0E2D\u0E1A\u0E27\u0E48\u0E32\u0E20\u0E32\u0E1E\u0E19\u0E31\u0E49\u0E19\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E04\u0E25\u0E32\u0E2A\u0E43\u0E14 \u0E40\u0E0A\u0E48\u0E19 \u0E41\u0E21\u0E27/\u0E2A\u0E38\u0E19\u0E31\u0E02 \u0E1C\u0E25\u0E44\u0E21\u0E49\u0E0A\u0E19\u0E34\u0E14\u0E15\u0E48\u0E32\u0E07 \u0E46 \u0E2B\u0E23\u0E37\u0E2D\u0E02\u0E22\u0E30\u0E23\u0E35\u0E44\u0E0B\u0E40\u0E04\u0E34\u0E25\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E27\u0E14 \u0E01\u0E23\u0E30\u0E1B\u0E4B\u0E2D\u0E07 \u0E01\u0E23\u0E30\u0E14\u0E32\u0E29 \u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E40\u0E2B\u0E21\u0E37\u0E2D\u0E19 ML \u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B \u0E04\u0E37\u0E2D \u0E40\u0E01\u0E47\u0E1A\u0E20\u0E32\u0E1E \u0E15\u0E34\u0E14\u0E1B\u0E49\u0E32\u0E22\u0E01\u0E33\u0E01\u0E31\u0E1A \u0E41\u0E1A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 \u0E1D\u0E36\u0E01 \u0E17\u0E14\u0E2A\u0E2D\u0E1A \u0E41\u0E25\u0E49\u0E27\u0E19\u0E33\u0E44\u0E1B\u0E43\u0E0A\u0E49")), React.createElement("div", {
    className: "chips-grid"
  }, [["eye", "แมว / สุนัข", "ตัวอย่างคลาสสิก 2 คลาส ต้องมีภาพหลายสายพันธุ์และหลายมุม"], ["sparkle", "ผลไม้ประเภทต่าง ๆ", "คัดแยกผลไม้ตามชนิดหรือความสุกในโรงคัดแยก"], ["refresh", "วัตถุรีไซเคิล", "ถังขยะอัจฉริยะแยกขวดพลาสติก กระป๋อง และกระดาษ"]].map(([ic, t, d]) => React.createElement("div", {
    className: "ex-card",
    key: t
  }, React.createElement(Icon, {
    name: ic,
    size: 18
  }), React.createElement("span", null, React.createElement("b", null, t), d)))), React.createElement(Accordion, {
    items: [{
      id: "how",
      icon: "cpu",
      title: "โมเดลมองภาพอย่างไร",
      en: "จากพิกเซลสู่คุณลักษณะ",
      content: React.createElement(React.Fragment, null, React.createElement("p", null, "\u0E42\u0E21\u0E40\u0E14\u0E25\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E40\u0E2B\u0E47\u0E19\u0E20\u0E32\u0E1E\u0E41\u0E1A\u0E1A\u0E04\u0E19 \u0E41\u0E15\u0E48\u0E40\u0E2B\u0E47\u0E19\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25 (\u0E40\u0E2B\u0E21\u0E37\u0E2D\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E17\u0E35\u0E48 2) \u0E41\u0E25\u0E49\u0E27\u0E41\u0E1B\u0E25\u0E07\u0E40\u0E1B\u0E47\u0E19 ", React.createElement("b", null, "\u0E04\u0E38\u0E13\u0E25\u0E31\u0E01\u0E29\u0E13\u0E30 (Features)"), " \u0E15\u0E31\u0E27\u0E08\u0E33\u0E41\u0E19\u0E01\u0E43\u0E19 Lab \u0E19\u0E35\u0E49\u0E43\u0E0A\u0E49\u0E04\u0E38\u0E13\u0E25\u0E31\u0E01\u0E29\u0E13\u0E30\u0E07\u0E48\u0E32\u0E22 \u0E46 32 \u0E04\u0E48\u0E32 \u0E44\u0E14\u0E49\u0E41\u0E01\u0E48 \u0E2A\u0E31\u0E14\u0E2A\u0E48\u0E27\u0E19\u0E02\u0E2D\u0E07\u0E2A\u0E35 \u0E04\u0E27\u0E32\u0E21\u0E2A\u0E27\u0E48\u0E32\u0E07 \u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E27\u0E48\u0E32\u0E07\u0E43\u0E19 16 \u0E2A\u0E48\u0E27\u0E19\u0E02\u0E2D\u0E07\u0E20\u0E32\u0E1E"), React.createElement("p", null, "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E2D\u0E22\u0E48\u0E32\u0E07 Teachable Machine \u0E43\u0E0A\u0E49 ", React.createElement("b", null, "Transfer Learning"), " \u0E04\u0E37\u0E2D\u0E19\u0E33\u0E42\u0E04\u0E23\u0E07\u0E02\u0E48\u0E32\u0E22\u0E1B\u0E23\u0E30\u0E2A\u0E32\u0E17\u0E40\u0E0A\u0E34\u0E07\u0E25\u0E36\u0E01\u0E17\u0E35\u0E48\u0E1D\u0E36\u0E01\u0E01\u0E31\u0E1A\u0E20\u0E32\u0E1E\u0E19\u0E31\u0E1A\u0E25\u0E49\u0E32\u0E19\u0E21\u0E32\u0E41\u0E25\u0E49\u0E27 (MobileNet) \u0E21\u0E32\u0E2A\u0E01\u0E31\u0E14\u0E04\u0E38\u0E13\u0E25\u0E31\u0E01\u0E29\u0E13\u0E30\u0E17\u0E35\u0E48\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E01\u0E27\u0E48\u0E32\u0E21\u0E32\u0E01 \u0E08\u0E36\u0E07\u0E41\u0E22\u0E01\u0E41\u0E21\u0E27\u0E01\u0E31\u0E1A\u0E2A\u0E38\u0E19\u0E31\u0E02\u0E44\u0E14\u0E49\u0E41\u0E21\u0E49\u0E2A\u0E35\u0E04\u0E25\u0E49\u0E32\u0E22\u0E01\u0E31\u0E19"))
    }, {
      id: "good",
      icon: "check",
      title: "ชุดข้อมูลภาพที่ดี",
      en: "Dataset Quality",
      content: React.createElement("ul", {
        className: "bul"
      }, React.createElement("li", null, "\u0E41\u0E15\u0E48\u0E25\u0E30\u0E04\u0E25\u0E32\u0E2A\u0E21\u0E35\u0E08\u0E33\u0E19\u0E27\u0E19\u0E20\u0E32\u0E1E\u0E43\u0E01\u0E25\u0E49\u0E40\u0E04\u0E35\u0E22\u0E07\u0E01\u0E31\u0E19"), React.createElement("li", null, "\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E2B\u0E25\u0E32\u0E01\u0E2B\u0E25\u0E32\u0E22: \u0E21\u0E38\u0E21\u0E01\u0E25\u0E49\u0E2D\u0E07 \u0E41\u0E2A\u0E07 \u0E02\u0E19\u0E32\u0E14 \u0E1E\u0E37\u0E49\u0E19\u0E2B\u0E25\u0E31\u0E07"), React.createElement("li", null, "\u0E15\u0E34\u0E14\u0E1B\u0E49\u0E32\u0E22\u0E01\u0E33\u0E01\u0E31\u0E1A\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07"), React.createElement("li", null, "\u0E1E\u0E37\u0E49\u0E19\u0E2B\u0E25\u0E31\u0E07\u0E2B\u0E23\u0E37\u0E2D\u0E2A\u0E34\u0E48\u0E07\u0E41\u0E27\u0E14\u0E25\u0E49\u0E2D\u0E21\u0E44\u0E21\u0E48\u0E1C\u0E39\u0E01\u0E01\u0E31\u0E1A\u0E04\u0E25\u0E32\u0E2A\u0E43\u0E14\u0E04\u0E25\u0E32\u0E2A\u0E2B\u0E19\u0E36\u0E48\u0E07 (\u0E1B\u0E49\u0E2D\u0E07\u0E01\u0E31\u0E19 Data Bias)"))
    }, {
      id: "err",
      icon: "alert",
      title: "ทำไมตัวจำแนกภาพจึงผิด",
      en: "Error Analysis",
      content: React.createElement("ul", {
        className: "bul"
      }, React.createElement("li", null, "\u0E20\u0E32\u0E1E\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E15\u0E48\u0E32\u0E07\u0E08\u0E32\u0E01\u0E20\u0E32\u0E1E\u0E1D\u0E36\u0E01\u0E21\u0E32\u0E01 \u0E40\u0E0A\u0E48\u0E19 \u0E41\u0E2A\u0E07\u0E21\u0E37\u0E14 \u0E21\u0E38\u0E21\u0E41\u0E1B\u0E25\u0E01"), React.createElement("li", null, "\u0E04\u0E25\u0E32\u0E2A\u0E17\u0E35\u0E48\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E32\u0E04\u0E25\u0E49\u0E32\u0E22\u0E01\u0E31\u0E19 \u0E40\u0E0A\u0E48\u0E19 \u0E2A\u0E49\u0E21\u0E01\u0E31\u0E1A\u0E41\u0E2D\u0E1B\u0E40\u0E1B\u0E34\u0E25\u0E40\u0E02\u0E35\u0E22\u0E27"), React.createElement("li", null, "Label \u0E1C\u0E34\u0E14\u0E43\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1D\u0E36\u0E01"), React.createElement("li", null, "\u0E42\u0E21\u0E40\u0E14\u0E25\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E02\u0E49\u0E2D\u0E07 \u0E40\u0E0A\u0E48\u0E19 \u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19\u0E2B\u0E25\u0E31\u0E07 (\u0E17\u0E32\u0E07\u0E25\u0E31\u0E14\u0E17\u0E35\u0E48\u0E1C\u0E34\u0E14)"))
    }]
  }), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "Image Classification Lab"), React.createElement("p", null, "\u0E15\u0E34\u0E14\u0E1B\u0E49\u0E32\u0E22\u0E20\u0E32\u0E1E\u0E17\u0E35\u0E48\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1B\u0E49\u0E32\u0E22 \u0E41\u0E1A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 \u0E1D\u0E36\u0E01 \u0E41\u0E25\u0E49\u0E27\u0E01\u0E14\u0E20\u0E32\u0E1E\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E27\u0E48\u0E32\u0E42\u0E21\u0E40\u0E14\u0E25\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E01\u0E31\u0E1A\u0E20\u0E32\u0E1E\u0E1D\u0E36\u0E01\u0E20\u0E32\u0E1E\u0E44\u0E2B\u0E19")), React.createElement(ImageClassifierLab, null), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "\u0E25\u0E2D\u0E07\u0E1D\u0E36\u0E01\u0E14\u0E49\u0E27\u0E22\u0E20\u0E32\u0E1E\u0E02\u0E2D\u0E07\u0E15\u0E31\u0E27\u0E40\u0E2D\u0E07")), React.createElement(CustomImageClassifier, null), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D AI \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E15\u0E48\u0E2D\u0E22\u0E2D\u0E14"), React.createElement("p", null, "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E40\u0E2B\u0E25\u0E48\u0E32\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E19\u0E41\u0E17\u0E47\u0E1A\u0E43\u0E2B\u0E21\u0E48 \u0E1C\u0E25\u0E07\u0E32\u0E19\u0E17\u0E35\u0E48\u0E17\u0E33\u0E08\u0E30\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E19\u0E31\u0E49\u0E19 \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E2A\u0E48\u0E07\u0E01\u0E25\u0E31\u0E1A\u0E21\u0E32\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E43\u0E19\u0E40\u0E27\u0E47\u0E1A\u0E19\u0E35\u0E49")), React.createElement(ToolCards, null));
}
function Lab33() {
  const [lab, setLab] = useState({
    labeled: 0,
    correct: 0
  });
  const [normal, setNormal] = useState(null);
  const [biased, setBiased] = useState(null);
  const [viewed, setViewed] = useState(false);
  const onEvent = e => {
    if (e.type === "label") setLab({
      labeled: e.done,
      correct: e.correct
    });
    if (e.type === "train") (e.biased ? setBiased : setNormal)(e);
  };
  return React.createElement(LabShell, {
    unitId: "unit3",
    labId: "u3-a3",
    objective: "\u0E15\u0E34\u0E14\u0E1B\u0E49\u0E32\u0E22\u0E01\u0E33\u0E01\u0E31\u0E1A \u0E41\u0E1A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 \u0E1D\u0E36\u0E01\u0E15\u0E31\u0E27\u0E08\u0E33\u0E41\u0E19\u0E01\u0E20\u0E32\u0E1E \u0E41\u0E25\u0E30\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E2A\u0E32\u0E40\u0E2B\u0E15\u0E38\u0E17\u0E35\u0E48\u0E42\u0E21\u0E40\u0E14\u0E25\u0E17\u0E33\u0E19\u0E32\u0E22\u0E1C\u0E34\u0E14 \u0E23\u0E27\u0E21\u0E16\u0E36\u0E07\u0E1C\u0E25\u0E02\u0E2D\u0E07 Data Bias",
    steps: [{
      id: "lab",
      text: "ติดป้ายกำกับภาพ 9 ภาพที่ยังไม่มีป้ายให้ถูกต้อง",
      done: lab.labeled === 9 && lab.correct === 9,
      status: `ติดแล้ว ${lab.labeled}/9${lab.labeled === 9 && lab.correct < 9 ? ` · ผิด ${9 - lab.correct} ภาพ ลองดูภาพอีกครั้ง` : ""}`
    }, {
      id: "train",
      text: "ฝึกโมเดลกับชุดข้อมูลปกติ และอ่านค่า Accuracy",
      done: !!normal && normal.mislabeled === 0,
      status: normal ? `ชุดปกติ Accuracy ${pct(normal.acc)}` : ""
    }, {
      id: "why",
      text: "กดภาพทดสอบอย่างน้อย 1 ภาพ เพื่อดูภาพฝึกที่โมเดลใช้เทียบ",
      done: viewed
    }, {
      id: "bias",
      text: "สลับเป็นชุดข้อมูลลำเอียง ฝึกใหม่ แล้วเปรียบเทียบ Accuracy",
      done: !!biased,
      status: biased ? `ชุดลำเอียง Accuracy ${pct(biased.acc)}` : ""
    }],
    reflection: "\u0E08\u0E32\u0E01\u0E01\u0E32\u0E23\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E0A\u0E38\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E25\u0E33\u0E40\u0E2D\u0E35\u0E22\u0E07 \u0E16\u0E49\u0E32\u0E42\u0E23\u0E07\u0E40\u0E23\u0E35\u0E22\u0E19\u0E08\u0E30\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E16\u0E31\u0E07\u0E02\u0E22\u0E30\u0E04\u0E31\u0E14\u0E41\u0E22\u0E01\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34 \u0E04\u0E27\u0E23\u0E40\u0E01\u0E47\u0E1A\u0E20\u0E32\u0E1E\u0E1D\u0E36\u0E01\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E23\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E44\u0E21\u0E48\u0E43\u0E2B\u0E49\u0E40\u0E01\u0E34\u0E14\u0E1B\u0E31\u0E0D\u0E2B\u0E32\u0E41\u0E1A\u0E1A\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E31\u0E19",
    question: {
      q: "ในชุดข้อมูลลำเอียง ภาพกล้วยทุกภาพในข้อมูลฝึกอยู่บนพื้นหลังสีฟ้า เมื่อทดสอบกับแอปเปิลบนพื้นฟ้า โมเดลมักทายว่าเป็นกล้วย เพราะอะไร",
      options: [{
        id: "a",
        text: "แอปเปิลกับกล้วยมีรูปร่างเหมือนกัน"
      }, {
        id: "b",
        text: "โมเดลเรียนรู้ว่า 'พื้นสีฟ้า' สัมพันธ์กับกล้วย แทนที่จะเรียนรู้ลักษณะของผลไม้"
      }, {
        id: "c",
        text: "ค่า k น้อยเกินไปเสมอ"
      }, {
        id: "d",
        text: "ภาพทดสอบมีความละเอียดสูงเกินไป"
      }],
      answer: "b",
      explain: "นี่คือ Data Bias ที่ทำให้โมเดลใช้ทางลัด (Shortcut Learning) แก้ได้ด้วยการเก็บภาพหลากหลายพื้นหลังให้ทุกคลาส",
      hint: "ดูภาพฝึกที่โมเดลนำมาเทียบเมื่อทายผิด มันมีอะไรเหมือนกัน"
    }
  }, React.createElement("div", {
    onClickCapture: e => {
      if (e.target.closest && e.target.closest(".img-card.pred")) setViewed(true);
    }
  }, React.createElement(ImageClassifierLab, {
    onEvent: onEvent
  })));
}
function U3Lesson3() {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "prose"
  }, React.createElement("p", null, "\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E17\u0E35\u0E48 2 \u0E40\u0E18\u0E2D\u0E44\u0E14\u0E49\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E42\u0E21\u0E40\u0E14\u0E25\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E27\u0E31\u0E15\u0E16\u0E38\u0E08\u0E23\u0E34\u0E07\u0E41\u0E25\u0E49\u0E27 \u0E1A\u0E17\u0E19\u0E35\u0E49\u0E08\u0E30\u0E40\u0E19\u0E49\u0E19\u0E27\u0E48\u0E32 ", React.createElement("b", null, "\u0E40\u0E23\u0E32\u0E27\u0E31\u0E14\u0E27\u0E48\u0E32\u0E42\u0E21\u0E40\u0E14\u0E25\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E41\u0E21\u0E48\u0E19\u0E41\u0E04\u0E48\u0E44\u0E2B\u0E19\u0E44\u0E14\u0E49\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E23"))), React.createElement("div", {
    className: "table-wrap"
  }, React.createElement("table", {
    className: "hist"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, React.createElement("span", {
    className: "sr-only"
  }, "\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D")), React.createElement("th", null, "Image Classification"), React.createElement("th", null, "Object Detection"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, "\u0E04\u0E33\u0E16\u0E32\u0E21"), React.createElement("td", null, "\u0E20\u0E32\u0E1E\u0E19\u0E35\u0E49\u0E04\u0E37\u0E2D\u0E2D\u0E30\u0E44\u0E23"), React.createElement("td", null, "\u0E21\u0E35\u0E2D\u0E30\u0E44\u0E23\u0E1A\u0E49\u0E32\u0E07 \u0E2D\u0E22\u0E39\u0E48\u0E15\u0E23\u0E07\u0E44\u0E2B\u0E19")), React.createElement("tr", null, React.createElement("td", null, "\u0E1C\u0E25\u0E25\u0E31\u0E1E\u0E18\u0E4C"), React.createElement("td", null, "1 Label + Confidence \u0E15\u0E48\u0E2D\u0E20\u0E32\u0E1E"), React.createElement("td", null, "\u0E2B\u0E25\u0E32\u0E22 Bounding Box \u0E41\u0E15\u0E48\u0E25\u0E30\u0E01\u0E23\u0E2D\u0E1A\u0E21\u0E35 Label + Confidence")), React.createElement("tr", null, React.createElement("td", null, "Label \u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49\u0E1D\u0E36\u0E01"), React.createElement("td", null, "\u0E0A\u0E37\u0E48\u0E2D\u0E04\u0E25\u0E32\u0E2A\u0E02\u0E2D\u0E07\u0E20\u0E32\u0E1E"), React.createElement("td", null, "\u0E0A\u0E37\u0E48\u0E2D\u0E04\u0E25\u0E32\u0E2A + \u0E1E\u0E34\u0E01\u0E31\u0E14\u0E01\u0E23\u0E2D\u0E1A\u0E02\u0E2D\u0E07\u0E27\u0E31\u0E15\u0E16\u0E38\u0E17\u0E38\u0E01\u0E0A\u0E34\u0E49\u0E19 (\u0E15\u0E34\u0E14\u0E1B\u0E49\u0E32\u0E22\u0E22\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32\u0E21\u0E32\u0E01)")), React.createElement("tr", null, React.createElement("td", null, "\u0E27\u0E31\u0E14\u0E1C\u0E25\u0E14\u0E49\u0E27\u0E22"), React.createElement("td", null, "Accuracy"), React.createElement("td", null, "IoU, Precision, Recall"))))), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "IoU: \u0E01\u0E23\u0E2D\u0E1A\u0E0B\u0E49\u0E2D\u0E19\u0E01\u0E31\u0E19\u0E41\u0E04\u0E48\u0E44\u0E2B\u0E19")), React.createElement(IouDemo, null), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "TP, FP, FN \u0E41\u0E25\u0E30 Precision \u0E01\u0E31\u0E1A Recall"), React.createElement("ul", {
    className: "bul"
  }, React.createElement("li", null, React.createElement("b", null, "True Positive (TP):"), " \u0E17\u0E32\u0E22\u0E16\u0E39\u0E01\u0E17\u0E31\u0E49\u0E07\u0E0A\u0E37\u0E48\u0E2D\u0E41\u0E25\u0E30\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07 (IoU \u0E16\u0E36\u0E07\u0E40\u0E01\u0E13\u0E11\u0E4C)"), React.createElement("li", null, React.createElement("b", null, "False Positive (FP):"), " \u0E17\u0E32\u0E22\u0E27\u0E48\u0E32\u0E21\u0E35 \u0E41\u0E15\u0E48\u0E44\u0E21\u0E48\u0E21\u0E35\u0E08\u0E23\u0E34\u0E07 \u0E2B\u0E23\u0E37\u0E2D\u0E01\u0E23\u0E2D\u0E1A\u0E1C\u0E34\u0E14\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07"), React.createElement("li", null, React.createElement("b", null, "False Negative (FN):"), " \u0E21\u0E35\u0E27\u0E31\u0E15\u0E16\u0E38\u0E08\u0E23\u0E34\u0E07 \u0E41\u0E15\u0E48\u0E42\u0E21\u0E40\u0E14\u0E25\u0E1E\u0E25\u0E32\u0E14 \u0E44\u0E21\u0E48\u0E40\u0E08\u0E2D"), React.createElement("li", null, React.createElement("b", null, "Precision"), " = TP \xF7 (TP + FP) \u0E43\u0E19\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E42\u0E21\u0E40\u0E14\u0E25\u0E1A\u0E2D\u0E01\u0E27\u0E48\u0E32\u0E40\u0E08\u0E2D \u0E16\u0E39\u0E01\u0E01\u0E35\u0E48\u0E2A\u0E48\u0E27\u0E19"), React.createElement("li", null, React.createElement("b", null, "Recall"), " = TP \xF7 (TP + FN) \u0E43\u0E19\u0E27\u0E31\u0E15\u0E16\u0E38\u0E08\u0E23\u0E34\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 \u0E42\u0E21\u0E40\u0E14\u0E25\u0E40\u0E08\u0E2D\u0E01\u0E35\u0E48\u0E2A\u0E48\u0E27\u0E19"))), React.createElement(Callout, {
    tone: "warn",
    icon: "alert",
    title: "Confidence \u0E2A\u0E39\u0E07 \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E41\u0E1B\u0E25\u0E27\u0E48\u0E32\u0E16\u0E39\u0E01\u0E40\u0E2A\u0E21\u0E2D"
  }, "\u0E04\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E21\u0E31\u0E48\u0E19\u0E43\u0E08\u0E04\u0E37\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E21\u0E31\u0E48\u0E19\u0E43\u0E08\u0E02\u0E2D\u0E07\u0E42\u0E21\u0E40\u0E14\u0E25\u0E40\u0E2D\u0E07 \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E04\u0E27\u0E32\u0E21\u0E08\u0E23\u0E34\u0E07 \u0E42\u0E21\u0E40\u0E14\u0E25\u0E2D\u0E32\u0E08\u0E21\u0E31\u0E48\u0E19\u0E43\u0E08\u0E1C\u0E34\u0E14\u0E44\u0E14\u0E49 \u0E01\u0E32\u0E23\u0E27\u0E31\u0E14\u0E1C\u0E25\u0E17\u0E35\u0E48\u0E14\u0E35\u0E08\u0E36\u0E07\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E01\u0E31\u0E1A\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E23\u0E34\u0E07 (Ground Truth) \u0E17\u0E35\u0E48\u0E04\u0E19\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E41\u0E25\u0E49\u0E27"), React.createElement(DetectionAnalysis, null));
}
function Lab34() {
  const [seen, setSeen] = useState({});
  const [thMoved, setThMoved] = useState(false);
  const [ans, setAns] = useState({
    fn: "",
    rec: ""
  });
  const [chk, setChk] = useState(null);
  const onAnalyze = ({
    id,
    th,
    res
  }) => {
    setSeen(s => ({
      ...s,
      [id]: res
    }));
    if (th !== 0.5) setThMoved(true);
  };
  const check = () => setChk(+ans.fn === 2 && Math.abs(+ans.rec - 33) <= 1);
  return React.createElement(LabShell, {
    unitId: "unit3",
    labId: "u3-a4",
    objective: "\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E27\u0E31\u0E15\u0E16\u0E38\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E01\u0E31\u0E1A\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E23\u0E34\u0E07 \u0E41\u0E25\u0E30\u0E04\u0E33\u0E19\u0E27\u0E13 Precision \u0E01\u0E31\u0E1A Recall \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E04\u0E27\u0E32\u0E21\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E41\u0E25\u0E30\u0E02\u0E49\u0E2D\u0E08\u0E33\u0E01\u0E31\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E21\u0E40\u0E14\u0E25",
    steps: [{
      id: "three",
      text: "วิเคราะห์ผลตรวจจับอย่างน้อย 3 ภาพ",
      done: Object.keys(seen).length >= 3,
      status: `ดูแล้ว ${Object.keys(seen).length} ภาพ`
    }, {
      id: "th",
      text: "ปรับ Confidence threshold แล้วสังเกตว่า TP, FP, FN เปลี่ยนอย่างไร",
      done: thMoved
    }, {
      id: "calc",
      text: "ภาพกาแฟ (Confidence 50%, IoU 0.5): กรอกจำนวน FN และค่า Recall (%) ให้ถูกต้อง",
      done: chk === true
    }],
    reflection: "\u0E16\u0E49\u0E32\u0E08\u0E30\u0E43\u0E0A\u0E49\u0E42\u0E21\u0E40\u0E14\u0E25\u0E19\u0E35\u0E49\u0E19\u0E31\u0E1A\u0E08\u0E33\u0E19\u0E27\u0E19\u0E0A\u0E49\u0E2D\u0E19\u0E43\u0E19\u0E42\u0E23\u0E07\u0E2D\u0E32\u0E2B\u0E32\u0E23 \u0E40\u0E18\u0E2D\u0E04\u0E34\u0E14\u0E27\u0E48\u0E32\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48 \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E2D\u0E30\u0E44\u0E23 \u0E41\u0E25\u0E30\u0E04\u0E27\u0E23\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E23",
    question: {
      q: "โมเดลตรวจจับคนเดินถนนสำหรับรถยนต์ไร้คนขับ ค่าใดสำคัญที่สุดที่ต้องทำให้สูง",
      options: [{
        id: "a",
        text: "Recall เพราะการพลาดไม่เห็นคน (FN) อาจทำให้เกิดอุบัติเหตุร้ายแรง"
      }, {
        id: "b",
        text: "จำนวนกรอบที่วาดได้ต่อวินาทีเท่านั้น"
      }, {
        id: "c",
        text: "Precision อย่างเดียว ไม่ต้องสนใจคนที่ตรวจไม่เจอ"
      }, {
        id: "d",
        text: "ขนาดไฟล์ของโมเดล"
      }],
      answer: "a",
      explain: "งานด้านความปลอดภัยยอมให้เตือนผิดบ้าง (FP) ดีกว่าพลาดไม่เห็นคนจริง (FN) จึงต้องการ Recall สูง แต่ก็ต้องดู Precision ไม่ให้เบรกผิดบ่อยเกินไป",
      hint: "คิดว่าความผิดพลาดแบบไหนอันตรายกว่า เห็นคนทั้งที่ไม่มี หรือไม่เห็นคนที่มีอยู่จริง"
    }
  }, React.createElement(DetectionAnalysis, {
    onAnalyze: onAnalyze
  }), React.createElement("div", {
    className: "q-card"
  }, React.createElement("strong", null, "\u0E04\u0E33\u0E19\u0E27\u0E13\u0E08\u0E32\u0E01\u0E20\u0E32\u0E1E\u0E01\u0E32\u0E41\u0E1F"), React.createElement("div", {
    className: "shape-in"
  }, React.createElement("label", {
    className: "hint",
    htmlFor: "l34fn"
  }, "FN"), React.createElement("input", {
    id: "l34fn",
    className: "input mono num",
    inputMode: "numeric",
    value: ans.fn,
    onChange: e => {
      setAns(a => ({
        ...a,
        fn: e.target.value.replace(/\D/g, "")
      }));
      setChk(null);
    }
  }), React.createElement("label", {
    className: "hint",
    htmlFor: "l34rec"
  }, "Recall (%)"), React.createElement("input", {
    id: "l34rec",
    className: "input mono num",
    inputMode: "numeric",
    value: ans.rec,
    onChange: e => {
      setAns(a => ({
        ...a,
        rec: e.target.value.replace(/\D/g, "")
      }));
      setChk(null);
    }
  }), React.createElement(Button, {
    size: "sm",
    icon: "check",
    onClick: check,
    disabled: !ans.fn || !ans.rec
  }, "\u0E15\u0E23\u0E27\u0E08")), chk === true && React.createElement(Feedback, {
    tone: "good",
    title: "\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07"
  }, "\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E23\u0E34\u0E07\u0E21\u0E35 3 \u0E27\u0E31\u0E15\u0E16\u0E38 (cup, spoon, dining table) \u0E42\u0E21\u0E40\u0E14\u0E25\u0E40\u0E08\u0E2D\u0E41\u0E04\u0E48 cup \u2192 TP 1, FN 2, Recall = 1 \xF7 3 \u2248 33%"), chk === false && React.createElement(Feedback, {
    tone: "bad",
    title: "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01"
  }, "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E20\u0E32\u0E1E\u0E01\u0E32\u0E41\u0E1F \u0E15\u0E31\u0E49\u0E07 Confidence 50% \u0E41\u0E25\u0E30 IoU 0.50 \u0E41\u0E25\u0E49\u0E27\u0E19\u0E31\u0E1A\u0E41\u0E16\u0E27 FN \u0E43\u0E19\u0E15\u0E32\u0E23\u0E32\u0E07 Recall = TP \xF7 (TP + FN)")));
}
function U3Lesson4() {
  const [ex, setEx] = useState([]);
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "prose"
  }, React.createElement("p", null, React.createElement("b", null, "\u0E15\u0E31\u0E27\u0E08\u0E33\u0E41\u0E19\u0E01\u0E17\u0E48\u0E32\u0E17\u0E32\u0E07 (Pose Classifier)"), " \u0E17\u0E33\u0E07\u0E32\u0E19 2 \u0E02\u0E31\u0E49\u0E19 \u0E04\u0E37\u0E2D 1) ", React.createElement("b", null, "Pose Estimation"), " \u0E43\u0E0A\u0E49\u0E42\u0E21\u0E40\u0E14\u0E25 \u0E40\u0E0A\u0E48\u0E19 MoveNet \u0E2B\u0E23\u0E37\u0E2D PoseNet \u0E2B\u0E32\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07 ", React.createElement("b", null, "\u0E08\u0E38\u0E14\u0E2A\u0E33\u0E04\u0E31\u0E0D (Keypoints)"), " \u0E02\u0E2D\u0E07\u0E23\u0E48\u0E32\u0E07\u0E01\u0E32\u0E22\u0E08\u0E32\u0E01\u0E20\u0E32\u0E1E \u0E40\u0E0A\u0E48\u0E19 \u0E08\u0E21\u0E39\u0E01 \u0E44\u0E2B\u0E25\u0E48 \u0E28\u0E2D\u0E01 \u0E02\u0E49\u0E2D\u0E21\u0E37\u0E2D \u0E2A\u0E30\u0E42\u0E1E\u0E01 \u0E40\u0E02\u0E48\u0E32 \u0E02\u0E49\u0E2D\u0E40\u0E17\u0E49\u0E32 (17 \u0E08\u0E38\u0E14\u0E43\u0E19\u0E21\u0E32\u0E15\u0E23\u0E10\u0E32\u0E19 COCO) 2) ", React.createElement("b", null, "Classification"), " \u0E19\u0E33\u0E1E\u0E34\u0E01\u0E31\u0E14\u0E02\u0E2D\u0E07\u0E08\u0E38\u0E14\u0E40\u0E2B\u0E25\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19\u0E44\u0E1B\u0E08\u0E33\u0E41\u0E19\u0E01\u0E27\u0E48\u0E32\u0E40\u0E1B\u0E47\u0E19\u0E17\u0E48\u0E32\u0E2D\u0E30\u0E44\u0E23"), React.createElement("p", null, "\u0E40\u0E1E\u0E23\u0E32\u0E30\u0E14\u0E39\u0E41\u0E04\u0E48\u0E1E\u0E34\u0E01\u0E31\u0E14\u0E08\u0E38\u0E14 \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E14\u0E39\u0E2A\u0E35\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E2B\u0E23\u0E37\u0E2D\u0E1E\u0E37\u0E49\u0E19\u0E2B\u0E25\u0E31\u0E07 \u0E15\u0E31\u0E27\u0E08\u0E33\u0E41\u0E19\u0E01\u0E17\u0E48\u0E32\u0E17\u0E32\u0E07\u0E08\u0E36\u0E07\u0E17\u0E19\u0E15\u0E48\u0E2D\u0E01\u0E32\u0E23\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E2A\u0E20\u0E32\u0E1E\u0E41\u0E27\u0E14\u0E25\u0E49\u0E2D\u0E21\u0E44\u0E14\u0E49\u0E14\u0E35\u0E01\u0E27\u0E48\u0E32\u0E01\u0E32\u0E23\u0E08\u0E33\u0E41\u0E19\u0E01\u0E08\u0E32\u0E01\u0E20\u0E32\u0E1E\u0E17\u0E31\u0E49\u0E07\u0E20\u0E32\u0E1E \u0E41\u0E25\u0E30\u0E43\u0E0A\u0E49\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32")), React.createElement("div", {
    className: "chips-grid"
  }, [["user", "ยกมือ", "ข้อมืออยู่สูงกว่าศีรษะ อย่างน้อย 1 ข้าง"], ["grid", "กางแขน", "แขนทั้งสองข้างเหยียดออกด้านข้าง ระดับไหล่"], ["target", "ยืนตรง", "แขนแนบลำตัว ข้อมืออยู่ระดับสะโพก"]].map(([ic, t, d]) => React.createElement("div", {
    className: "ex-card",
    key: t
  }, React.createElement(Icon, {
    name: ic,
    size: 18
  }), React.createElement("span", null, React.createElement("b", null, t), d)))), React.createElement(Callout, {
    tone: "info",
    icon: "eye",
    title: "\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A Live Pose Detection"
  }, "\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A\u0E19\u0E35\u0E49\u0E17\u0E33\u0E07\u0E32\u0E19\u0E43\u0E19\u0E01\u0E23\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E41\u0E1E\u0E25\u0E15\u0E1F\u0E2D\u0E23\u0E4C\u0E21\u0E44\u0E21\u0E48\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E43\u0E2B\u0E49\u0E43\u0E0A\u0E49\u0E01\u0E25\u0E49\u0E2D\u0E07 \u0E08\u0E36\u0E07\u0E43\u0E0A\u0E49 \"\u0E2B\u0E38\u0E48\u0E19\u0E17\u0E48\u0E32\u0E17\u0E32\u0E07\" \u0E2A\u0E23\u0E49\u0E32\u0E07\u0E08\u0E38\u0E14\u0E2A\u0E33\u0E04\u0E31\u0E0D\u0E41\u0E17\u0E19 \u0E41\u0E25\u0E30\u0E23\u0E30\u0E1A\u0E38\u0E27\u0E48\u0E32\u0E40\u0E1B\u0E47\u0E19\u0E42\u0E2B\u0E21\u0E14\u0E1D\u0E36\u0E01\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C \u0E16\u0E49\u0E32\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E01\u0E31\u0E1A\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E08\u0E23\u0E34\u0E07 \u0E43\u0E0A\u0E49 Teachable Machine (Pose Project) \u0E2B\u0E23\u0E37\u0E2D PictoBlox \u0E0B\u0E36\u0E48\u0E07\u0E08\u0E30\u0E02\u0E2D\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E43\u0E0A\u0E49\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E43\u0E19\u0E40\u0E27\u0E47\u0E1A\u0E44\u0E0B\u0E15\u0E4C\u0E02\u0E2D\u0E07\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E19\u0E31\u0E49\u0E19\u0E40\u0E2D\u0E07"), React.createElement(PoseExplorer, {
    examples: ex,
    setExamples: setEx
  }), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "\u0E17\u0E33\u0E1A\u0E19\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E08\u0E23\u0E34\u0E07")), React.createElement(ToolCards, {
    ids: ["tm", "pb"]
  }));
}
function Lab35() {
  const [ex, setEx] = useState([]);
  const [trained, setTrained] = useState(false);
  const [acc, setAcc] = useState(null);
  const counts = POSE_CLASSES.map(c => ex.filter(e => e.label === c.id).length);
  const onEvent = e => {
    if (e.type === "train") setTrained(true);
    if (e.type === "add") {
      setTrained(false);
    }
    if (e.type === "challenge") setAcc(e.acc);
  };
  return React.createElement(LabShell, {
    unitId: "unit3",
    labId: "u3-a5",
    objective: "\u0E40\u0E01\u0E47\u0E1A\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E17\u0E48\u0E32\u0E17\u0E32\u0E07 \u0E1D\u0E36\u0E01\u0E15\u0E31\u0E27\u0E08\u0E33\u0E41\u0E19\u0E01\u0E17\u0E48\u0E32\u0E17\u0E32\u0E07\u0E23\u0E48\u0E32\u0E07\u0E01\u0E32\u0E22\u0E08\u0E32\u0E01\u0E08\u0E38\u0E14\u0E2A\u0E33\u0E04\u0E31\u0E0D \u0E41\u0E25\u0E30\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E01\u0E31\u0E1A\u0E17\u0E48\u0E32\u0E17\u0E35\u0E48\u0E42\u0E21\u0E40\u0E14\u0E25\u0E44\u0E21\u0E48\u0E40\u0E04\u0E22\u0E40\u0E2B\u0E47\u0E19",
    steps: [{
      id: "collect",
      text: "เก็บตัวอย่างท่า ยกมือ กางแขน ยืนตรง อย่างน้อยท่าละ 3 ตัวอย่าง (ปรับให้ต่างกันเล็กน้อย)",
      done: counts.every(n => n >= 3),
      status: POSE_CLASSES.map((c, i) => `${c.name} ${counts[i]}`).join(" · ")
    }, {
      id: "train",
      text: "กดฝึกตัวจำแนกท่าทาง",
      done: trained
    }, {
      id: "test",
      text: "ทดสอบกับท่าใหม่ 9 ท่า ให้ได้ Accuracy อย่างน้อย 7/9 (78%)",
      done: acc !== null && acc >= 7 / 9 - 0.001,
      status: acc !== null ? `Accuracy ล่าสุด ${pct(acc)}` : ""
    }],
    reflection: "\u0E17\u0E48\u0E32\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E17\u0E48\u0E32\u0E44\u0E2B\u0E19\u0E17\u0E35\u0E48\u0E42\u0E21\u0E40\u0E14\u0E25\u0E17\u0E32\u0E22\u0E1C\u0E34\u0E14 \u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E01\u0E37\u0E2D\u0E1A\u0E1C\u0E34\u0E14 \u0E41\u0E25\u0E30\u0E40\u0E18\u0E2D\u0E41\u0E01\u0E49\u0E14\u0E49\u0E27\u0E22\u0E01\u0E32\u0E23\u0E40\u0E01\u0E47\u0E1A\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E41\u0E1A\u0E1A\u0E44\u0E2B\u0E19",
    question: {
      q: "ทำไมตัวจำแนกท่าทางที่ใช้จุดสำคัญ (Keypoints) จึงไม่ค่อยถูกรบกวนจากสีเสื้อหรือพื้นหลัง",
      options: [{
        id: "a",
        text: "เพราะใช้กล้องความละเอียดสูง"
      }, {
        id: "b",
        text: "เพราะข้อมูลที่ใช้จำแนกเป็นพิกัดของจุดบนร่างกาย ไม่ใช่สีของพิกเซลในภาพ"
      }, {
        id: "c",
        text: "เพราะโมเดลรู้ว่าแต่ละคนเป็นใคร"
      }, {
        id: "d",
        text: "เพราะท่าทางมีแค่ 3 แบบ"
      }],
      answer: "b",
      explain: "ขั้น Pose Estimation แปลงภาพเป็นพิกัดจุดสำคัญก่อน ตัวจำแนกจึงเห็นแค่ตำแหน่งของร่างกาย ไม่เห็นสีเสื้อหรือพื้นหลัง",
      hint: "ดูว่าข้อมูลที่ส่งให้ kNN ในเครื่องมือนี้คืออะไร"
    }
  }, React.createElement(PoseExplorer, {
    examples: ex,
    setExamples: setEx,
    onEvent: onEvent,
    showChallenge: true
  }));
}
function U3Lesson5() {
  const [ex, setEx] = useState([]);
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "prose"
  }, React.createElement("p", null, React.createElement("b", null, "\u0E01\u0E32\u0E23\u0E23\u0E39\u0E49\u0E08\u0E33\u0E17\u0E48\u0E32\u0E17\u0E32\u0E07\u0E21\u0E37\u0E2D (Hand Pose Classification)"), " \u0E43\u0E0A\u0E49\u0E2B\u0E25\u0E31\u0E01\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E31\u0E1A\u0E17\u0E48\u0E32\u0E17\u0E32\u0E07\u0E23\u0E48\u0E32\u0E07\u0E01\u0E32\u0E22 \u0E41\u0E15\u0E48\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E01\u0E27\u0E48\u0E32 \u0E42\u0E21\u0E40\u0E14\u0E25\u0E2D\u0E22\u0E48\u0E32\u0E07 MediaPipe Hand Landmarker \u0E2B\u0E32 ", React.createElement("b", null, "\u0E08\u0E38\u0E14\u0E2A\u0E33\u0E04\u0E31\u0E0D 21 \u0E08\u0E38\u0E14"), " \u0E02\u0E2D\u0E07\u0E21\u0E37\u0E2D \u0E44\u0E14\u0E49\u0E41\u0E01\u0E48 \u0E02\u0E49\u0E2D\u0E21\u0E37\u0E2D 1 \u0E08\u0E38\u0E14 \u0E41\u0E25\u0E30\u0E19\u0E34\u0E49\u0E27\u0E25\u0E30 4 \u0E08\u0E38\u0E14 \u0E08\u0E32\u0E01\u0E19\u0E31\u0E49\u0E19\u0E19\u0E33\u0E1E\u0E34\u0E01\u0E31\u0E14\u0E44\u0E1B\u0E08\u0E33\u0E41\u0E19\u0E01\u0E17\u0E48\u0E32")), React.createElement("div", {
    className: "chips-grid"
  }, [["sparkle", "Open Palm · แบมือ", "นิ้วทุกนิ้วเหยียด ใช้เป็นสัญญาณหยุด"], ["lock", "Fist · กำมือ", "นิ้วทุกนิ้วงอเข้าหาฝ่ามือ"], ["check", "Thumbs Up · ยกนิ้วโป้ง", "สี่นิ้วงอ นิ้วโป้งเหยียดชี้ขึ้น ใช้แสดงว่าเห็นด้วย"]].map(([ic, t, d]) => React.createElement("div", {
    className: "ex-card",
    key: t
  }, React.createElement(Icon, {
    name: ic,
    size: 18
  }), React.createElement("span", null, React.createElement("b", null, t), d)))), React.createElement(Accordion, {
    items: [{
      id: "use",
      icon: "bulb",
      title: "นำไปใช้ทำอะไรได้บ้าง",
      content: React.createElement("ul", {
        className: "bul"
      }, React.createElement("li", null, "\u0E2A\u0E31\u0E48\u0E07\u0E07\u0E32\u0E19\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E2A\u0E31\u0E21\u0E1C\u0E31\u0E2A \u0E40\u0E0A\u0E48\u0E19 \u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E2A\u0E44\u0E25\u0E14\u0E4C"), React.createElement("li", null, "\u0E0A\u0E48\u0E27\u0E22\u0E41\u0E1B\u0E25\u0E20\u0E32\u0E29\u0E32\u0E21\u0E37\u0E2D (\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E2D\u0E2D\u0E01\u0E41\u0E1A\u0E1A\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E23\u0E2D\u0E1A\u0E04\u0E2D\u0E1A\u0E23\u0E48\u0E27\u0E21\u0E01\u0E31\u0E1A\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E20\u0E32\u0E29\u0E32\u0E21\u0E37\u0E2D)"), React.createElement("li", null, "\u0E40\u0E01\u0E21\u0E41\u0E25\u0E30\u0E2A\u0E37\u0E48\u0E2D\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E41\u0E1A\u0E1A\u0E42\u0E15\u0E49\u0E15\u0E2D\u0E1A"))
    }, {
      id: "lim",
      icon: "alert",
      title: "ข้อจำกัด",
      content: React.createElement("ul", {
        className: "bul"
      }, React.createElement("li", null, "\u0E19\u0E34\u0E49\u0E27\u0E1A\u0E31\u0E07\u0E01\u0E31\u0E19\u0E40\u0E2D\u0E07\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E2B\u0E32\u0E08\u0E38\u0E14\u0E1C\u0E34\u0E14"), React.createElement("li", null, "\u0E21\u0E37\u0E2D\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48\u0E44\u0E01\u0E25\u0E2B\u0E23\u0E37\u0E2D\u0E41\u0E2A\u0E07\u0E19\u0E49\u0E2D\u0E22\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E22\u0E32\u0E01"), React.createElement("li", null, "\u0E17\u0E48\u0E32\u0E17\u0E35\u0E48\u0E04\u0E25\u0E49\u0E32\u0E22\u0E01\u0E31\u0E19 \u0E40\u0E0A\u0E48\u0E19 \u0E01\u0E33\u0E21\u0E37\u0E2D\u0E01\u0E31\u0E1A Thumbs Up \u0E15\u0E48\u0E32\u0E07\u0E01\u0E31\u0E19\u0E41\u0E04\u0E48\u0E19\u0E34\u0E49\u0E27\u0E40\u0E14\u0E35\u0E22\u0E27"), React.createElement("li", null, "\u0E04\u0E27\u0E32\u0E21\u0E2B\u0E21\u0E32\u0E22\u0E02\u0E2D\u0E07\u0E17\u0E48\u0E32\u0E21\u0E37\u0E2D\u0E15\u0E48\u0E32\u0E07\u0E01\u0E31\u0E19\u0E43\u0E19\u0E41\u0E15\u0E48\u0E25\u0E30\u0E27\u0E31\u0E12\u0E19\u0E18\u0E23\u0E23\u0E21"))
    }]
  }), React.createElement(Callout, {
    tone: "info",
    icon: "eye",
    title: "\u0E42\u0E2B\u0E21\u0E14\u0E1D\u0E36\u0E01\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C"
  }, "\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E43\u0E0A\u0E49\u0E40\u0E27\u0E47\u0E1A\u0E41\u0E04\u0E21 \u0E43\u0E0A\u0E49\u0E41\u0E16\u0E1A\u0E04\u0E27\u0E1A\u0E04\u0E38\u0E21\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E08\u0E38\u0E14\u0E2A\u0E33\u0E04\u0E31\u0E0D 21 \u0E08\u0E38\u0E14\u0E41\u0E17\u0E19 \u0E2A\u0E48\u0E27\u0E19\u0E01\u0E32\u0E23\u0E1D\u0E36\u0E01\u0E41\u0E25\u0E30\u0E17\u0E33\u0E19\u0E32\u0E22\u0E04\u0E33\u0E19\u0E27\u0E13\u0E08\u0E23\u0E34\u0E07\u0E14\u0E49\u0E27\u0E22 kNN"), React.createElement(HandExplorer, {
    examples: ex,
    setExamples: setEx
  }), React.createElement(ToolCards, {
    ids: ["pb", "tm"]
  }));
}
function Lab36() {
  const [ex, setEx] = useState([]);
  const [chal] = useState(handChallenge);
  const [mine, setMine] = useState({});
  const [modelRes, setModelRes] = useState(null);
  const humanScore = chal.filter(c => mine[c.id] === c.label).length;
  const counts = HAND_CLASSES.map(c => ex.filter(e => e.label === c.id).length);
  const challenge = model => React.createElement("div", {
    className: "q-card"
  }, React.createElement("div", {
    className: "act-head"
  }, React.createElement("strong", null, "Hand Gesture Challenge: \u0E20\u0E32\u0E1E\u0E17\u0E48\u0E32\u0E21\u0E37\u0E2D 9 \u0E20\u0E32\u0E1E"), React.createElement("span", {
    className: "mono hint"
  }, "\u0E40\u0E18\u0E2D\u0E08\u0E33\u0E41\u0E19\u0E01\u0E16\u0E39\u0E01 ", humanScore, "/", Object.keys(mine).length)), React.createElement("div", {
    className: "pose-chal"
  }, chal.map(c => React.createElement("div", {
    key: c.id,
    className: "pc " + (mine[c.id] ? mine[c.id] === c.label ? "ok" : "no" : "")
  }, React.createElement(HandView, {
    lm: c.lm,
    size: 92,
    color: "#57CCF2",
    label: `ภาพท่ามือที่ ${c.id.slice(1)}`
  }), React.createElement("div", {
    className: "mini-opts"
  }, HAND_CLASSES.map(h => React.createElement("button", {
    key: h.id,
    type: "button",
    "aria-pressed": mine[c.id] === h.id,
    disabled: !!mine[c.id],
    onClick: () => setMine(m => ({
      ...m,
      [c.id]: h.id
    })),
    style: {
      "--c": h.color
    }
  }, h.name.split(" · ")[0]))), modelRes && React.createElement("span", {
    className: "mono hint"
  }, "\u0E42\u0E21\u0E40\u0E14\u0E25: ", clsName(HAND_CLASSES, modelRes.preds.find(p => p.item.id === c.id).pred.label).split(" · ")[0], " ", modelRes.preds.find(p => p.item.id === c.id).ok ? "✓" : "✗")))), React.createElement("div", {
    className: "btn-inline"
  }, React.createElement(Button, {
    size: "sm",
    icon: "cpu",
    disabled: !model,
    onClick: () => setModelRes(ML.evaluate(model, chal.map(c => ({
      ...c,
      x: handFeatures(c.lm)
    })), 3, HAND_CLASSES.map(h => h.id)))
  }, "\u0E43\u0E2B\u0E49\u0E42\u0E21\u0E40\u0E14\u0E25\u0E02\u0E2D\u0E07\u0E40\u0E18\u0E2D\u0E08\u0E33\u0E41\u0E19\u0E01 9 \u0E20\u0E32\u0E1E\u0E19\u0E35\u0E49"), modelRes && React.createElement("b", {
    className: "mono"
  }, "\u0E42\u0E21\u0E40\u0E14\u0E25\u0E16\u0E39\u0E01 ", modelRes.correct, "/9 (", pct(modelRes.acc), ")")), !model && React.createElement("span", {
    className: "hint"
  }, "\u0E40\u0E01\u0E47\u0E1A\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E41\u0E25\u0E30\u0E1D\u0E36\u0E01\u0E42\u0E21\u0E40\u0E14\u0E25\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19\u0E01\u0E48\u0E2D\u0E19 \u0E08\u0E36\u0E07\u0E43\u0E2B\u0E49\u0E42\u0E21\u0E40\u0E14\u0E25\u0E08\u0E33\u0E41\u0E19\u0E01\u0E44\u0E14\u0E49"));
  return React.createElement(LabShell, {
    unitId: "unit3",
    labId: "u3-a6",
    objective: "\u0E08\u0E33\u0E41\u0E19\u0E01\u0E17\u0E48\u0E32\u0E17\u0E32\u0E07\u0E21\u0E37\u0E2D\u0E14\u0E49\u0E27\u0E22\u0E15\u0E19\u0E40\u0E2D\u0E07\u0E41\u0E25\u0E30\u0E14\u0E49\u0E27\u0E22\u0E42\u0E21\u0E40\u0E14\u0E25\u0E17\u0E35\u0E48\u0E1D\u0E36\u0E01\u0E08\u0E32\u0E01\u0E08\u0E38\u0E14\u0E2A\u0E33\u0E04\u0E31\u0E0D 21 \u0E08\u0E38\u0E14 \u0E41\u0E25\u0E49\u0E27\u0E40\u0E1B\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07",
    steps: [{
      id: "human",
      text: "จำแนกภาพท่ามือทั้ง 9 ภาพด้วยตัวเอง",
      done: Object.keys(mine).length === 9,
      status: `ทำแล้ว ${Object.keys(mine).length}/9`
    }, {
      id: "collect",
      text: "เก็บตัวอย่างท่ามือ 3 ท่า อย่างน้อยท่าละ 3 ตัวอย่าง แล้วฝึกโมเดล",
      done: counts.every(n => n >= 3) && !!modelRes,
      status: HAND_CLASSES.map((c, i) => `${c.name.split(" · ")[0]} ${counts[i]}`).join(" · ")
    }, {
      id: "model",
      text: "ให้โมเดลจำแนก 9 ภาพ ได้ถูกอย่างน้อย 7 ภาพ",
      done: !!modelRes && modelRes.correct >= 7,
      status: modelRes ? `โมเดลถูก ${modelRes.correct}/9` : ""
    }],
    reflection: "\u0E17\u0E48\u0E32\u0E04\u0E39\u0E48\u0E44\u0E2B\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E31\u0E1A\u0E2A\u0E19\u0E07\u0E48\u0E32\u0E22\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14 \u0E17\u0E31\u0E49\u0E07\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E40\u0E18\u0E2D\u0E41\u0E25\u0E30\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E42\u0E21\u0E40\u0E14\u0E25 \u0E41\u0E25\u0E30\u0E08\u0E38\u0E14\u0E2A\u0E33\u0E04\u0E31\u0E0D\u0E08\u0E38\u0E14\u0E44\u0E2B\u0E19\u0E0A\u0E48\u0E27\u0E22\u0E41\u0E22\u0E01\u0E17\u0E48\u0E32\u0E04\u0E39\u0E48\u0E19\u0E31\u0E49\u0E19",
    question: {
      q: "โมเดลจำแนกท่ามือมักสับสนระหว่าง Fist กับ Thumbs Up วิธีใดช่วยปรับปรุงได้ดีที่สุด",
      options: [{
        id: "a",
        text: "ลดจำนวนตัวอย่างให้เหลือท่าละ 1 ตัวอย่าง"
      }, {
        id: "b",
        text: "เก็บตัวอย่างทั้งสองท่าเพิ่มในหลายมุมและหลายมือ โดยเฉพาะตำแหน่งนิ้วโป้งที่ต่างกัน"
      }, {
        id: "c",
        text: "เปลี่ยนสีพื้นหลังของหน้าเว็บ"
      }, {
        id: "d",
        text: "เลิกใช้จุดสำคัญ แล้วใช้ชื่อผู้ใช้แทน"
      }],
      answer: "b",
      explain: "สองท่านี้ต่างกันที่นิ้วโป้ง การเพิ่มตัวอย่างที่หลากหลายช่วยให้โมเดลเรียนรู้ความต่างนี้ได้ชัดขึ้น",
      hint: "คิดถึงหลัก 'ข้อมูลฝึกที่ดีต้องหลากหลายและเพียงพอ'"
    }
  }, React.createElement(HandExplorer, {
    examples: ex,
    setExamples: setEx,
    challenge: challenge
  }));
}

const U3_LESSON_BODY = {
  "u3-l1": U3Lesson1,
  "u3-l2": U3Lesson2,
  "u3-l3": U3Lesson3,
  "u3-l4": U3Lesson4,
  "u3-l5": U3Lesson5
};
const U3_LABS = {
  "u3-a1": Lab31,
  "u3-a2": Lab32,
  "u3-a3": Lab33,
  "u3-a4": Lab34,
  "u3-a5": Lab35,
  "u3-a6": Lab36
};
const U3_CFG = {
  unitId: "unit3",
  no: 3,
  en: "Machine Learning Applications",
  titleNode: React.createElement(React.Fragment, null, "พื้นฐาน", React.createElement("br"), React.createElement("span", {
    className: "grad-text"
  }, "การเรียนรู้ของเครื่อง")),
  objectives: U3_OBJECTIVES,
  items: U3_ITEMS,
  seq: U3_SEQ,
  groups: U3_GROUPS,
  lessonBody: U3_LESSON_BODY,
  actLabel: "Lab",
  lessonCount: 5,
  actCount: 6,
  quiz: U3_QUIZ,
  viewKey: "aira_u3_view",
  tipTitle: "AIra ผู้ช่วยฝึกโมเดล",
  art: su => React.createElement(HoloStage, { mood: su?.completed ? "cheer" : "happy" }),
  renderActivity: view => {
    const L = U3_LABS[view];
    return L ? React.createElement(L, null) : null;
  },
  refs: U3_REFS,
  refsTitle: "แหล่งอ้างอิงหน่วยที่ 3",
  refsNote: React.createElement(React.Fragment, null, "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E19\u0E35\u0E49\u0E1D\u0E36\u0E01\u0E41\u0E25\u0E30\u0E17\u0E33\u0E19\u0E32\u0E22\u0E08\u0E23\u0E34\u0E07\u0E14\u0E49\u0E27\u0E22 k-Nearest Neighbors \u0E17\u0E35\u0E48\u0E40\u0E02\u0E35\u0E22\u0E19\u0E14\u0E49\u0E27\u0E22 JavaScript \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E25\u0E44\u0E21\u0E49\u0E41\u0E25\u0E30\u0E20\u0E32\u0E1E\u0E1C\u0E25\u0E44\u0E21\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E08\u0E33\u0E25\u0E2D\u0E07\u0E17\u0E35\u0E48\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E14\u0E49\u0E27\u0E22\u0E42\u0E1B\u0E23\u0E41\u0E01\u0E23\u0E21 \u0E08\u0E38\u0E14\u0E2A\u0E33\u0E04\u0E31\u0E0D\u0E02\u0E2D\u0E07\u0E17\u0E48\u0E32\u0E17\u0E32\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E08\u0E32\u0E01\u0E2B\u0E38\u0E48\u0E19\u0E41\u0E17\u0E19\u0E01\u0E25\u0E49\u0E2D\u0E07 \u0E1C\u0E25\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E27\u0E31\u0E15\u0E16\u0E38\u0E40\u0E1B\u0E47\u0E19\u0E1C\u0E25\u0E08\u0E23\u0E34\u0E07\u0E08\u0E32\u0E01 COCO-SSD \u0E2A\u0E48\u0E27\u0E19\u0E01\u0E23\u0E2D\u0E1A\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E23\u0E34\u0E07\u0E27\u0E32\u0E14\u0E14\u0E49\u0E27\u0E22\u0E21\u0E37\u0E2D \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E20\u0E32\u0E22\u0E19\u0E2D\u0E01\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E40\u0E21\u0E37\u0E48\u0E2D 26 \u0E15.\u0E04. 2569 \u0E1F\u0E35\u0E40\u0E08\u0E2D\u0E23\u0E4C\u0E41\u0E25\u0E30\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E2D\u0E32\u0E08\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E44\u0E14\u0E49"),
  badge: {
    name: "ML Engineer",
    icon: "cpu"
  },
  slidesUrl: "/unit3/index.html",
  codeUrl: "/code/code-unit3.zip",
  next: {
    id: "unit4",
    label: "ไปหน่วยที่ 4"
  }
};
function Unit3Page() {
  return React.createElement(UnitCoursePage, {
    cfg: U3_CFG
  });
}


export default Unit3Page;
export { Unit3Page };
