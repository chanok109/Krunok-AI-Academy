import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Icon, AIraBot, GlassCard, Button, Badge, ProgressBar } from '../components/UIPrimitives.jsx';
import { AiraTip, Callout, Feedback, FlipCard, Accordion, Celebrate, Modal, ActScore, ActResult, highlightPy, CodeBlock } from '../components/UIHelpers.jsx';
import { UnitCoursePage } from '../components/UnitCoursePage.jsx';
import { UnitArt } from './HomePage.jsx';
import {
  ROBOT_ART,
  ROBOT_PAL,
  SAMPLES,
  BLUR_OPTS,
  DEFAULT_PARAMS,
  PY_KW,
  PY_BUILTIN,
  RECORDED,
  COCO_TH,
  U2_OBJECTIVES,
  U2_ITEMS,
  U2_SEQ,
  U2_GROUPS,
  U2_REFS,
  CV_PIPE,
  MATRIX_EX,
  CODE_SETUP,
  CODE_READ,
  CODE_SHOW,
  CODE_TRANSFORM,
  CODE_WRITE,
  CODE_PLT,
  COLOR_TARGETS,
  colorDist,
  U24_RECIPE,
  TH_DEMO,
  U2_QUIZ
} from '../data/unit2Data.js';

const IMG = {
  make(w, h) {
    return {
      width: w,
      height: h,
      data: new Uint8ClampedArray(w * h * 4)
    };
  },
  clone(src) {
    return {
      width: src.width,
      height: src.height,
      data: new Uint8ClampedArray(src.data)
    };
  },
  crop(src, x, y, w, h) {
    x = Math.max(0, Math.min(src.width - 1, Math.round(x)));
    y = Math.max(0, Math.min(src.height - 1, Math.round(y)));
    w = Math.max(1, Math.min(src.width - x, Math.round(w)));
    h = Math.max(1, Math.min(src.height - y, Math.round(h)));
    const out = IMG.make(w, h);
    for (let r = 0; r < h; r++) {
      const s = ((y + r) * src.width + x) * 4;
      out.data.set(src.data.subarray(s, s + w * 4), r * w * 4);
    }
    return out;
  },
  resize(src, w, h) {
    w = Math.max(1, Math.round(w));
    h = Math.max(1, Math.round(h));
    if (w === src.width && h === src.height) return IMG.clone(src);
    const out = IMG.make(w, h),
      sx = src.width / w,
      sy = src.height / h,
      d = src.data;
    for (let r = 0; r < h; r++) {
      const fy = Math.max(0, (r + 0.5) * sy - 0.5),
        y0 = Math.min(src.height - 1, Math.floor(fy)),
        y1 = Math.min(src.height - 1, y0 + 1),
        ty = fy - y0;
      for (let c = 0; c < w; c++) {
        const fx = Math.max(0, (c + 0.5) * sx - 0.5),
          x0 = Math.min(src.width - 1, Math.floor(fx)),
          x1 = Math.min(src.width - 1, x0 + 1),
          tx = fx - x0;
        const i00 = (y0 * src.width + x0) * 4,
          i01 = (y0 * src.width + x1) * 4,
          i10 = (y1 * src.width + x0) * 4,
          i11 = (y1 * src.width + x1) * 4,
          o = (r * w + c) * 4;
        for (let k = 0; k < 4; k++) {
          const top = d[i00 + k] + (d[i01 + k] - d[i00 + k]) * tx,
            bot = d[i10 + k] + (d[i11 + k] - d[i10 + k]) * tx;
          out.data[o + k] = Math.round(top + (bot - top) * ty);
        }
      }
    }
    return out;
  },
  flip(src, code) {
    const {
        width: w,
        height: h
      } = src,
      out = IMG.make(w, h);
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
      const sr = code === 0 || code === -1 ? h - 1 - r : r,
        sc = code === 1 || code === -1 ? w - 1 - c : c;
      const s = (sr * w + sc) * 4,
        o = (r * w + c) * 4;
      out.data[o] = src.data[s];
      out.data[o + 1] = src.data[s + 1];
      out.data[o + 2] = src.data[s + 2];
      out.data[o + 3] = src.data[s + 3];
    }
    return out;
  },
  reflect(i, n) {
    if (n === 1) return 0;
    while (i < 0 || i >= n) {
      i = i < 0 ? -i : 2 * n - 2 - i;
    }
    return i;
  },
  grayValue(r, g, b) {
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  },
  gray(src) {
    const out = IMG.clone(src),
      d = out.data;
    for (let i = 0; i < d.length; i += 4) {
      const y = IMG.grayValue(d[i], d[i + 1], d[i + 2]);
      d[i] = d[i + 1] = d[i + 2] = y;
    }
    return out;
  },
  brightness(src, beta) {
    const out = IMG.clone(src),
      d = out.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] += beta;
      d[i + 1] += beta;
      d[i + 2] += beta;
    }
    return out;
  },
  blur(src, k) {
    if (k <= 1) return IMG.clone(src);
    const {
        width: w,
        height: h
      } = src,
      rad = Math.floor(k / 2),
      tmp = new Float32Array(w * h * 4),
      out = IMG.make(w, h);
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) for (let ch = 0; ch < 4; ch++) {
      let s = 0;
      for (let dx = -rad; dx <= rad; dx++) {
        const cc = IMG.reflect(c + dx, w);
        s += src.data[(r * w + cc) * 4 + ch];
      }
      tmp[(r * w + c) * 4 + ch] = s / k;
    }
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) for (let ch = 0; ch < 4; ch++) {
      let s = 0;
      for (let dy = -rad; dy <= rad; dy++) {
        const rr = IMG.reflect(r + dy, h);
        s += tmp[(rr * w + c) * 4 + ch];
      }
      out.data[(r * w + c) * 4 + ch] = Math.round(s / k);
    }
    return out;
  },
  diff(a, b) {
    if (!a || !b || a.width !== b.width || a.height !== b.height) return null;
    let s = 0,
      n = 0;
    for (let i = 0; i < a.data.length; i += 4) {
      s += Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]);
      n += 3;
    }
    return s / n;
  }
};

function runPipeline(src, p) {
  if (!src) return null;
  let img = src;
  const cropped = p.cx !== 0 || p.cy !== 0 || p.cw !== 100 || p.ch !== 100;
  if (cropped) img = IMG.crop(img, p.cx / 100 * src.width, p.cy / 100 * src.height, p.cw / 100 * src.width, p.ch / 100 * src.height);
  if (p.scale !== 100) img = IMG.resize(img, img.width * p.scale / 100, img.height * p.scale / 100);
  const fc = p.flipH && p.flipV ? -1 : p.flipH ? 1 : p.flipV ? 0 : null;
  if (fc !== null) img = IMG.flip(img, fc);
  if (p.gray) img = IMG.gray(img);
  if (p.beta) img = IMG.brightness(img, p.beta);
  if (p.blur > 1) img = IMG.blur(img, p.blur);
  return img === src ? IMG.clone(src) : img;
}
function pipelineCode(src, p) {
  const L = ["import cv2", "import numpy as np", "", 'img = cv2.imread("input.jpg")  # ได้ภาพแบบ BGR'];
  if (src) L.push(`print(img.shape)  # (${src.height}, ${src.width}, 3)`);
  if (p.cx !== 0 || p.cy !== 0 || p.cw !== 100 || p.ch !== 100) {
    const W = src ? src.width : 0,
      H = src ? src.height : 0;
    const x1 = Math.round(p.cx / 100 * W),
      y1 = Math.round(p.cy / 100 * H),
      x2 = x1 + Math.round(p.cw / 100 * W),
      y2 = y1 + Math.round(p.ch / 100 * H);
    L.push(`img = img[${y1}:${Math.min(H, y2)}, ${x1}:${Math.min(W, x2)}]  # ตัดภาพ [y1:y2, x1:x2]`);
  }
  if (p.scale !== 100) L.push(`img = cv2.resize(img, None, fx=${p.scale / 100}, fy=${p.scale / 100})  # ย่อ/ขยาย ${p.scale}%`);
  if (p.flipH && p.flipV) L.push("img = cv2.flip(img, -1)  # กลับทั้งแนวนอนและแนวตั้ง");else if (p.flipH) L.push("img = cv2.flip(img, 1)   # กลับซ้าย-ขวา");else if (p.flipV) L.push("img = cv2.flip(img, 0)   # กลับบน-ล่าง");
  if (p.gray) L.push("img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # เป็นภาพระดับเทา");
  if (p.beta) L.push(`img = np.clip(img.astype(np.int16) + (${p.beta}), 0, 255).astype(np.uint8)  # ปรับความสว่าง`);
  if (p.blur > 1) L.push(`img = cv2.blur(img, (${p.blur}, ${p.blur}))  # เบลอด้วยค่าเฉลี่ย ${p.blur}×${p.blur}`);
  L.push("", 'cv2.imwrite("output.jpg", img)  # คืนค่า True ถ้าบันทึกสำเร็จ');
  return L.join("\n");
}

function robotImage() {
  const img = IMG.make(16, 16);
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

const imgCache = {};
function loadImageEl(url) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => rej(new Error("โหลดภาพไม่สำเร็จ"));
    im.src = url;
  });
}
function elToData(im, maxDim) {
  let w = im.naturalWidth || im.width,
    h = im.naturalHeight || im.height;
  const s = maxDim && Math.max(w, h) > maxDim ? maxDim / Math.max(w, h) : 1;
  const cw = Math.max(1, Math.round(w * s)),
    ch = Math.max(1, Math.round(h * s));
  const c = document.createElement("canvas");
  c.width = cw;
  c.height = ch;
  const ctx = c.getContext("2d");
  ctx.drawImage(im, 0, 0, cw, ch);
  const d = ctx.getImageData(0, 0, cw, ch);
  return {
    img: {
      width: cw,
      height: ch,
      data: new Uint8ClampedArray(d.data)
    },
    orig: {
      w,
      h
    },
    scaled: s < 1
  };
}
async function loadSample(id, maxDim) {
  const key = id + ":" + (maxDim || 0);
  if (imgCache[key]) return imgCache[key];
  if (id === "robot") return imgCache[key] = {
    img: robotImage(),
    orig: {
      w: 16,
      h: 16
    },
    scaled: false
  };
  const s = SAMPLES.find(x => x.id === id);
  const el = await loadImageEl(s.url);
  return imgCache[key] = {
    ...elToData(el, maxDim),
    el
  };
}
async function loadFile(file, maxDim) {
  if (!file || !/^image\/(png|jpe?g|webp|gif|bmp)$/.test(file.type)) throw new Error("รองรับเฉพาะไฟล์ภาพ PNG, JPG, WEBP, GIF หรือ BMP");
  if (file.size > 10 * 1024 * 1024) throw new Error("ไฟล์ใหญ่เกิน 10 MB ลองย่อภาพก่อน");
  const url = URL.createObjectURL(file);
  try {
    const el = await loadImageEl(url);
    return {
      ...elToData(el, maxDim),
      el
    };
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
function DataCanvas({
  img,
  className = "",
  label,
  pixelated,
  onPick,
  marker,
  ...rest
}) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || !img) return;
    c.width = img.width;
    c.height = img.height;
    c.getContext("2d").putImageData(new ImageData(new Uint8ClampedArray(img.data), img.width, img.height), 0, 0);
  }, [img]);
  const pick = e => {
    if (!onPick || !img) return;
    const r = ref.current.getBoundingClientRect();
    const x = Math.min(img.width - 1, Math.max(0, Math.floor((e.clientX - r.left) / r.width * img.width)));
    const y = Math.min(img.height - 1, Math.max(0, Math.floor((e.clientY - r.top) / r.height * img.height)));
    onPick(x, y);
  };
  return React.createElement("div", {
    className: "dc-wrap " + className
  }, React.createElement("canvas", _extends({
    ref: ref,
    className: pixelated || img && img.width <= 64 ? "pixelated" : "",
    onClick: pick,
    "aria-label": label,
    role: onPick ? "img" : undefined
  }, rest)), marker && img && React.createElement("span", {
    className: "dc-marker",
    style: {
      left: (marker.x + 0.5) / img.width * 100 + "%",
      top: (marker.y + 0.5) / img.height * 100 + "%"
    },
    "aria-hidden": "true"
  }));
}
function SourcePicker({
  value,
  onSample,
  onFile,
  allow = ["robot", "cat", "coffee", "horse", "rocket"],
  upload = true,
  busy
}) {
  const inputRef = useRef(null);
  const uid = useMemo(() => "up" + Math.random().toString(36).slice(2, 7), []);
  return React.createElement("div", {
    className: "src-picker"
  }, React.createElement("div", {
    className: "opts",
    role: "group",
    "aria-label": "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E20\u0E32\u0E1E\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07"
  }, SAMPLES.filter(s => allow.includes(s.id)).map(s => React.createElement("button", {
    key: s.id,
    type: "button",
    className: "opt chip",
    "aria-pressed": value === s.id,
    disabled: busy,
    onClick: () => onSample(s.id)
  }, s.label)), upload && React.createElement(React.Fragment, null, React.createElement("input", {
    ref: inputRef,
    id: uid,
    type: "file",
    accept: "image/png,image/jpeg,image/webp,image/gif,image/bmp",
    className: "sr-only",
    "aria-label": "\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E20\u0E32\u0E1E\u0E08\u0E32\u0E01\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07",
    tabIndex: -1,
    onChange: e => {
      const f = e.target.files && e.target.files[0];
      e.target.value = "";
      if (f) onFile(f);
    }
  }), React.createElement("button", {
    type: "button",
    className: "opt chip" + (value === "upload" ? " up-on" : ""),
    "aria-pressed": value === "upload",
    disabled: busy,
    onClick: () => inputRef.current.click()
  }, React.createElement(Icon, {
    name: "login",
    size: 14,
    style: {
      transform: "rotate(-90deg)"
    }
  }), "\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E20\u0E32\u0E1E"))), upload && React.createElement("span", {
    className: "hint"
  }, "\u0E43\u0E0A\u0E49\u0E20\u0E32\u0E1E\u0E2A\u0E34\u0E48\u0E07\u0E02\u0E2D\u0E07 \u0E2A\u0E31\u0E15\u0E27\u0E4C \u0E2B\u0E23\u0E37\u0E2D\u0E27\u0E34\u0E27 \u0E2B\u0E25\u0E35\u0E01\u0E40\u0E25\u0E35\u0E48\u0E22\u0E07\u0E20\u0E32\u0E1E\u0E43\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E23\u0E37\u0E2D\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E48\u0E27\u0E19\u0E1A\u0E38\u0E04\u0E04\u0E25 \u0E20\u0E32\u0E1E\u0E1B\u0E23\u0E30\u0E21\u0E27\u0E25\u0E1C\u0E25\u0E43\u0E19\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E02\u0E2D\u0E07\u0E40\u0E18\u0E2D\u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19 \u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E2A\u0E48\u0E07\u0E2D\u0E2D\u0E01\u0E44\u0E1B"));
}
function useImageSource(initial, maxDim) {
  const [state, setState] = useState({
    id: initial,
    img: null,
    info: null,
    el: null,
    error: null,
    busy: true
  });
  const pickSample = useCallback(async id => {
    setState(s => ({
      ...s,
      busy: true,
      error: null
    }));
    try {
      const r = await loadSample(id, maxDim);
      setState({
        id,
        img: r.img,
        info: r,
        el: r.el || null,
        error: null,
        busy: false
      });
    } catch (e) {
      setState(s => ({
        ...s,
        busy: false,
        error: e.message
      }));
    }
  }, [maxDim]);
  const pickFile = useCallback(async f => {
    setState(s => ({
      ...s,
      busy: true,
      error: null
    }));
    try {
      const r = await loadFile(f, maxDim);
      setState({
        id: "upload",
        img: r.img,
        info: r,
        el: r.el,
        error: null,
        busy: false
      });
    } catch (e) {
      setState(s => ({
        ...s,
        busy: false,
        error: e.message
      }));
    }
  }, [maxDim]);
  useEffect(() => {
    pickSample(initial);
  }, []);
  return [state, pickSample, pickFile];
}
const hex2 = n => n.toString(16).padStart(2, "0").toUpperCase();
function PixelExplorer({
  initial = "robot",
  onInspect,
  allow,
  upload = true
}) {
  const [src, pickSample, pickFile] = useImageSource(initial, 1600);
  const [ptRaw, setPt] = useState(null);
  const img = src.img;
  useEffect(() => {
    setPt(null);
  }, [img]);
  const pt = ptRaw && img && ptRaw.img === img ? ptRaw : null;
  const at = (x, y) => {
    const o = (y * img.width + x) * 4;
    return [img.data[o], img.data[o + 1], img.data[o + 2]];
  };
  const pick = (x, y) => {
    setPt({
      x,
      y,
      img
    });
    if (onInspect) {
      const [r, g, b] = at(x, y);
      onInspect({
        x,
        y,
        r,
        g,
        b,
        source: src.id,
        w: img.width,
        h: img.height
      });
    }
  };
  const onKey = e => {
    if (!img) return;
    const d = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1]
    }[e.key];
    if (!d) return;
    e.preventDefault();
    const p = pt || {
      x: Math.floor(img.width / 2),
      y: Math.floor(img.height / 2)
    };
    pick(Math.min(img.width - 1, Math.max(0, p.x + d[0])), Math.min(img.height - 1, Math.max(0, p.y + d[1])));
  };
  const rgb = pt && img ? at(pt.x, pt.y) : null;
  const R = 4;
  return React.createElement("div", {
    className: "lab-tool"
  }, React.createElement("div", {
    className: "panel-head"
  }, React.createElement("span", {
    className: "panel-title"
  }, React.createElement(Icon, {
    name: "eye",
    size: 16
  }), "Pixel Explorer"), img && React.createElement("span", {
    className: "mono hint"
  }, img.width, " \xD7 ", img.height, " px")), React.createElement(SourcePicker, {
    value: src.id,
    onSample: id => pickSample(id),
    onFile: pickFile,
    allow: allow,
    upload: upload,
    busy: src.busy
  }), src.error && React.createElement("div", {
    className: "form-err",
    role: "alert"
  }, React.createElement(Icon, {
    name: "alert",
    size: 16
  }), src.error), React.createElement("div", {
    className: "px-grid"
  }, React.createElement("div", {
    className: "viewer"
  }, src.busy && React.createElement(ProcessingBadge, {
    text: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E20\u0E32\u0E1E"
  }), img && React.createElement(DataCanvas, {
    img: img,
    onPick: pick,
    marker: pt,
    label: "\u0E20\u0E32\u0E1E \u0E04\u0E25\u0E34\u0E01\u0E2B\u0E23\u0E37\u0E2D\u0E43\u0E0A\u0E49\u0E1B\u0E38\u0E48\u0E21\u0E25\u0E39\u0E01\u0E28\u0E23\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25",
    tabIndex: 0,
    onKeyDown: onKey,
    className: "clickable"
  }), React.createElement("span", {
    className: "hint"
  }, "\u0E04\u0E25\u0E34\u0E01\u0E1A\u0E19\u0E20\u0E32\u0E1E\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25 \u0E2B\u0E23\u0E37\u0E2D\u0E01\u0E14\u0E17\u0E35\u0E48\u0E20\u0E32\u0E1E\u0E41\u0E25\u0E49\u0E27\u0E43\u0E0A\u0E49\u0E1B\u0E38\u0E48\u0E21\u0E25\u0E39\u0E01\u0E28\u0E23", src.info && src.info.scaled ? ` · ภาพต้นฉบับ ${src.info.orig.w}×${src.info.orig.h} ถูกย่อเพื่อความเร็ว` : "")), React.createElement("div", {
    className: "inspector",
    "aria-live": "polite"
  }, React.createElement("span", {
    className: "panel-title"
  }, React.createElement(Icon, {
    name: "target",
    size: 16
  }), "Color Inspector"), !rgb ? React.createElement("p", {
    className: "hint"
  }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25 \u0E25\u0E2D\u0E07\u0E04\u0E25\u0E34\u0E01\u0E1A\u0E19\u0E20\u0E32\u0E1E") : React.createElement(React.Fragment, null, React.createElement("div", {
    className: "insp-row"
  }, React.createElement("span", {
    className: "swatch",
    style: {
      background: `rgb(${rgb.join(",")})`
    }
  }), React.createElement("div", null, React.createElement("b", {
    className: "mono"
  }, "x = ", pt.x, ", y = ", pt.y), React.createElement("span", {
    className: "hint",
    style: {
      display: "block"
    }
  }, "\u0E19\u0E31\u0E1A\u0E08\u0E32\u0E01\u0E21\u0E38\u0E21\u0E1A\u0E19\u0E0B\u0E49\u0E32\u0E22 (0, 0)"))), React.createElement("div", {
    className: "rgb-bars"
  }, ["R", "G", "B"].map((c, i) => React.createElement("div", {
    key: c,
    className: "rgb-bar " + c
  }, React.createElement("span", {
    className: "mono"
  }, c), React.createElement("span", {
    className: "bar"
  }, React.createElement("span", {
    style: {
      width: rgb[i] / 255 * 100 + "%"
    }
  })), React.createElement("b", {
    className: "mono"
  }, rgb[i])))), React.createElement("dl", {
    className: "insp-dl"
  }, React.createElement("div", null, React.createElement("dt", null, "HEX"), React.createElement("dd", {
    className: "mono"
  }, "#", rgb.map(hex2).join(""))), React.createElement("div", null, React.createElement("dt", null, "\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E40\u0E17\u0E32"), React.createElement("dd", {
    className: "mono"
  }, IMG.grayValue(...rgb))), React.createElement("div", {
    className: "wide"
  }, React.createElement("dt", null, "\u0E43\u0E19 OpenCV (BGR)"), React.createElement("dd", {
    className: "mono"
  }, "img[", pt.y, ", ", pt.x, "] \u2192 [", rgb[2], " ", rgb[1], " ", rgb[0], "]"))), React.createElement("div", {
    className: "magnifier",
    "aria-label": "\u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25\u0E23\u0E2D\u0E1A\u0E08\u0E38\u0E14\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01 9 \xD7 9"
  }, Array.from({
    length: (2 * R + 1) ** 2
  }, (_, k) => {
    const dx = k % (2 * R + 1) - R,
      dy = Math.floor(k / (2 * R + 1)) - R,
      x = pt.x + dx,
      y = pt.y + dy;
    const inside = x >= 0 && y >= 0 && x < img.width && y < img.height;
    return React.createElement("span", {
      key: k,
      className: dx === 0 && dy === 0 ? "c" : "",
      style: {
        background: inside ? `rgb(${at(x, y).join(",")})` : "transparent"
      }
    });
  }))), img && React.createElement("p", {
    className: "hint"
  }, "NumPy shape \u0E02\u0E2D\u0E07\u0E20\u0E32\u0E1E\u0E19\u0E35\u0E49: ", React.createElement("span", {
    className: "mono"
  }, "(", img.height, ", ", img.width, ", 3)"), " \xB7 \u0E23\u0E27\u0E21 ", (img.width * img.height).toLocaleString(), " \u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25"))), SAMPLES.find(s => s.id === src.id) && React.createElement("span", {
    className: "credit"
  }, SAMPLES.find(s => s.id === src.id).credit));
}
function ProcessingBadge({
  text = "กำลังประมวลผล"
}) {
  return React.createElement("span", {
    className: "proc",
    role: "status"
  }, React.createElement("span", {
    className: "proc-dot"
  }), text, "\u2026");
}
function ColorMixer({
  value,
  onChange,
  idp = "mx"
}) {
  return React.createElement("div", {
    className: "mixer"
  }, React.createElement("span", {
    className: "mix-swatch",
    style: {
      background: `rgb(${value.join(",")})`
    },
    "aria-label": `สีที่ผสม RGB ${value.join(", ")}`,
    role: "img"
  }), React.createElement("div", {
    style: {
      display: "grid",
      gap: 10,
      minWidth: 0
    }
  }, ["R", "G", "B"].map((c, i) => React.createElement("div", {
    key: c,
    className: "slider " + c
  }, React.createElement("label", {
    htmlFor: idp + c,
    className: "mono"
  }, c), React.createElement("input", {
    id: idp + c,
    type: "range",
    min: "0",
    max: "255",
    value: value[i],
    onChange: e => {
      const v = [...value];
      v[i] = +e.target.value;
      onChange(v);
    }
  }), React.createElement("input", {
    type: "number",
    min: "0",
    max: "255",
    className: "input num",
    "aria-label": `ค่า ${c}`,
    value: value[i],
    onChange: e => {
      const v = [...value];
      v[i] = Math.max(0, Math.min(255, +e.target.value || 0));
      onChange(v);
    }
  }))), React.createElement("span", {
    className: "mono hint"
  }, "RGB(", value.join(", "), ") \xB7 #", value.map(hex2).join(""))));
}

function Playground({
  initial = "cat",
  fixed,
  upload = true,
  onChange,
  target,
  params: ctrlParams,
  setParams: ctrlSet
}) {
  const [src, pickSample, pickFile] = useImageSource(fixed || initial, 900);
  const [ownParams, setOwnParams] = useState(DEFAULT_PARAMS);
  const params = ctrlParams || ownParams,
    setParams = ctrlSet || setOwnParams;
  const [out, setOut] = useState(null);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("side");
  const [split, setSplit] = useState(50);
  const set = (k, v) => setParams(p => ({
    ...p,
    [k]: v
  }));
  useEffect(() => {
    if (!src.img) return;
    setBusy(true);
    const t = setTimeout(() => {
      const o = runPipeline(src.img, params);
      setOut(o);
      setBusy(false);
      onChange && onChange(params, o, src.img);
    }, 140);
    return () => clearTimeout(t);
  }, [src.img, params]);
  const sameAspect = out && src.img && Math.abs(out.width / out.height - src.img.width / src.img.height) < 0.02;
  const steps = [];
  if (params.cx || params.cy || params.cw !== 100 || params.ch !== 100) steps.push(`ตัดภาพ (Crop) เหลือส่วนที่เลือก ${params.cw}% × ${params.ch}% ของภาพ`);
  if (params.scale !== 100) steps.push(`ปรับขนาด (Resize) เป็น ${params.scale}% จำนวนพิกเซล${params.scale < 100 ? "ลดลง รายละเอียดลดลง" : "เพิ่มขึ้นโดยประมาณค่าระหว่างพิกเซล ภาพไม่ได้คมขึ้นจริง"}`);
  if (params.flipH) steps.push("กลับภาพแนวนอน: พิกเซลคอลัมน์ x ย้ายไปที่ (กว้าง−1−x)");
  if (params.flipV) steps.push("กลับภาพแนวตั้ง: พิกเซลแถว y ย้ายไปที่ (สูง−1−y)");
  if (params.gray) steps.push("แปลงเป็นระดับเทา: Y = 0.299R + 0.587G + 0.114B เหลือ 1 ค่าต่อพิกเซล");
  if (params.beta) steps.push(`ปรับความสว่าง ${params.beta > 0 ? "+" : ""}${params.beta} ทุกช่องสี ค่าที่เกิน 255 หรือต่ำกว่า 0 ถูกตัดไว้ที่ขอบ`);
  if (params.blur > 1) steps.push(`เบลอ (Blur) แต่ละพิกเซลเป็นค่าเฉลี่ยของ ${params.blur}×${params.blur} = ${params.blur * params.blur} พิกเซลรอบ ๆ`);
  return React.createElement("div", {
    className: "lab-tool"
  }, React.createElement("div", {
    className: "panel-head"
  }, React.createElement("span", {
    className: "panel-title"
  }, React.createElement(Icon, {
    name: "cpu",
    size: 16
  }), "Image Processing Playground"), busy && React.createElement(ProcessingBadge, null)), !fixed && React.createElement(SourcePicker, {
    value: src.id,
    onSample: pickSample,
    onFile: pickFile,
    allow: ["cat", "coffee", "horse", "rocket", "robot"],
    upload: upload,
    busy: src.busy
  }), src.error && React.createElement("div", {
    className: "form-err",
    role: "alert"
  }, React.createElement(Icon, {
    name: "alert",
    size: 16
  }), src.error), React.createElement("div", {
    className: "pg-grid"
  }, React.createElement("div", {
    className: "controls",
    "aria-label": "\u0E41\u0E1C\u0E07\u0E04\u0E27\u0E1A\u0E04\u0E38\u0E21"
  }, React.createElement("fieldset", null, React.createElement("legend", null, "\u0E15\u0E31\u0E14\u0E20\u0E32\u0E1E (Crop) %"), [["cx", "x เริ่ม", 0, 90], ["cy", "y เริ่ม", 0, 90], ["cw", "กว้าง", 10, 100], ["ch", "สูง", 10, 100]].map(([k, l, mn, mx]) => React.createElement("div", {
    className: "ctl",
    key: k
  }, React.createElement("label", {
    htmlFor: "pg-" + k
  }, l), React.createElement("input", {
    id: "pg-" + k,
    type: "range",
    min: mn,
    max: mx,
    step: "5",
    value: params[k],
    onChange: e => {
      const v = +e.target.value;
      setParams(p => {
        const n = {
          ...p,
          [k]: v
        };
        if (n.cx + n.cw > 100) {
          if (k === "cx") n.cw = 100 - n.cx;else n.cx = 100 - n.cw;
        }
        if (n.cy + n.ch > 100) {
          if (k === "cy") n.ch = 100 - n.cy;else n.cy = 100 - n.ch;
        }
        return n;
      });
    }
  }), React.createElement("output", {
    className: "mono"
  }, params[k])))), React.createElement("fieldset", null, React.createElement("legend", null, "\u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14 (Resize)"), React.createElement("div", {
    className: "ctl"
  }, React.createElement("label", {
    htmlFor: "pg-scale"
  }, "\u0E02\u0E19\u0E32\u0E14 %"), React.createElement("input", {
    id: "pg-scale",
    type: "range",
    min: "10",
    max: "200",
    step: "10",
    value: params.scale,
    onChange: e => set("scale", +e.target.value)
  }), React.createElement("output", {
    className: "mono"
  }, params.scale))), React.createElement("fieldset", null, React.createElement("legend", null, "\u0E01\u0E25\u0E31\u0E1A\u0E20\u0E32\u0E1E (Flip) \u0E41\u0E25\u0E30\u0E2A\u0E35"), React.createElement("div", {
    className: "toggles"
  }, React.createElement("button", {
    type: "button",
    className: "opt chip",
    "aria-pressed": params.flipH,
    onClick: () => set("flipH", !params.flipH)
  }, "\u2194 \u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19"), React.createElement("button", {
    type: "button",
    className: "opt chip",
    "aria-pressed": params.flipV,
    onClick: () => set("flipV", !params.flipV)
  }, "\u2195 \u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07"), React.createElement("button", {
    type: "button",
    className: "opt chip",
    "aria-pressed": params.gray,
    onClick: () => set("gray", !params.gray)
  }, "\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E40\u0E17\u0E32"))), React.createElement("fieldset", null, React.createElement("legend", null, "\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E27\u0E48\u0E32\u0E07\u0E41\u0E25\u0E30\u0E40\u0E1A\u0E25\u0E2D"), React.createElement("div", {
    className: "ctl"
  }, React.createElement("label", {
    htmlFor: "pg-beta"
  }, "\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E27\u0E48\u0E32\u0E07"), React.createElement("input", {
    id: "pg-beta",
    type: "range",
    min: "-100",
    max: "100",
    step: "10",
    value: params.beta,
    onChange: e => set("beta", +e.target.value)
  }), React.createElement("output", {
    className: "mono"
  }, params.beta > 0 ? "+" : "", params.beta)), React.createElement("div", {
    className: "ctl"
  }, React.createElement("label", {
    htmlFor: "pg-blur"
  }, "\u0E40\u0E1A\u0E25\u0E2D k\xD7k"), React.createElement("input", {
    id: "pg-blur",
    type: "range",
    min: "0",
    max: BLUR_OPTS.length - 1,
    step: "1",
    value: BLUR_OPTS.indexOf(params.blur),
    onChange: e => set("blur", BLUR_OPTS[+e.target.value])
  }), React.createElement("output", {
    className: "mono"
  }, params.blur === 1 ? "ปิด" : params.blur))), React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "refresh",
    onClick: () => setParams(DEFAULT_PARAMS)
  }, "Reset")), React.createElement("div", {
    className: "pg-view"
  }, React.createElement("div", {
    className: "seg",
    role: "tablist",
    "aria-label": "\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E01\u0E32\u0E23\u0E40\u0E1B\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A"
  }, React.createElement("button", {
    type: "button",
    role: "tab",
    "aria-selected": mode === "side",
    onClick: () => setMode("side")
  }, "\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E02\u0E49\u0E32\u0E07\u0E01\u0E31\u0E19"), React.createElement("button", {
    type: "button",
    role: "tab",
    "aria-selected": mode === "slider",
    onClick: () => setMode("slider")
  }, "\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E40\u0E17\u0E35\u0E22\u0E1A Before/After")), mode === "side" || !sameAspect ? React.createElement(React.Fragment, null, mode === "slider" && React.createElement("span", {
    className: "hint"
  }, "\u0E42\u0E2B\u0E21\u0E14\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E43\u0E0A\u0E49\u0E44\u0E14\u0E49\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E20\u0E32\u0E1E\u0E1C\u0E25\u0E25\u0E31\u0E1E\u0E18\u0E4C\u0E21\u0E35\u0E2A\u0E31\u0E14\u0E2A\u0E48\u0E27\u0E19\u0E40\u0E17\u0E48\u0E32\u0E15\u0E49\u0E19\u0E09\u0E1A\u0E31\u0E1A (\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 Crop) \u0E08\u0E36\u0E07\u0E41\u0E2A\u0E14\u0E07\u0E41\u0E1A\u0E1A\u0E02\u0E49\u0E32\u0E07\u0E01\u0E31\u0E19\u0E41\u0E17\u0E19"), React.createElement("div", {
    className: "ba"
  }, React.createElement("div", null, React.createElement("span", {
    className: "ba-tag"
  }, "\u0E01\u0E48\u0E2D\u0E19 \xB7 ", src.img ? `${src.img.width}×${src.img.height}` : "–"), src.img && React.createElement(DataCanvas, {
    img: src.img,
    label: "\u0E20\u0E32\u0E1E\u0E15\u0E49\u0E19\u0E09\u0E1A\u0E31\u0E1A"
  })), React.createElement("div", null, React.createElement("span", {
    className: "ba-tag after"
  }, "\u0E2B\u0E25\u0E31\u0E07 \xB7 ", out ? `${out.width}×${out.height}` : "–"), out && React.createElement(DataCanvas, {
    img: out,
    label: "\u0E20\u0E32\u0E1E\u0E1C\u0E25\u0E25\u0E31\u0E1E\u0E18\u0E4C",
    className: busy ? "dim" : ""
  })))) : React.createElement("div", {
    className: "ba-slider"
  }, src.img && React.createElement(DataCanvas, {
    img: src.img,
    label: "\u0E20\u0E32\u0E1E\u0E15\u0E49\u0E19\u0E09\u0E1A\u0E31\u0E1A"
  }), out && React.createElement("div", {
    className: "ba-over",
    style: {
      clipPath: `inset(0 0 0 ${split}%)`
    }
  }, React.createElement(DataCanvas, {
    img: out,
    label: "\u0E20\u0E32\u0E1E\u0E1C\u0E25\u0E25\u0E31\u0E1E\u0E18\u0E4C"
  })), React.createElement("span", {
    className: "ba-line",
    style: {
      left: split + "%"
    },
    "aria-hidden": "true"
  }), React.createElement("input", {
    type: "range",
    min: "0",
    max: "100",
    value: split,
    onChange: e => setSplit(+e.target.value),
    "aria-label": "\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E40\u0E2A\u0E49\u0E19\u0E41\u0E1A\u0E48\u0E07\u0E01\u0E48\u0E2D\u0E19/\u0E2B\u0E25\u0E31\u0E07",
    className: "ba-range"
  }), React.createElement("span", {
    className: "ba-tag"
  }, "\u0E01\u0E48\u0E2D\u0E19"), React.createElement("span", {
    className: "ba-tag after",
    style: {
      left: "auto",
      right: 8
    }
  }, "\u0E2B\u0E25\u0E31\u0E07")), target, React.createElement("div", {
    className: "q-card"
  }, React.createElement("strong", {
    style: {
      fontSize: 14
    }
  }, "\u0E40\u0E01\u0E34\u0E14\u0E2D\u0E30\u0E44\u0E23\u0E02\u0E36\u0E49\u0E19\u0E01\u0E31\u0E1A\u0E20\u0E32\u0E1E"), steps.length ? React.createElement("ol", {
    className: "answer-line"
  }, steps.map(s => React.createElement("li", {
    key: s
  }, s))) : React.createElement("span", {
    className: "hint"
  }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E1B\u0E23\u0E31\u0E1A\u0E2D\u0E30\u0E44\u0E23 \u0E25\u0E2D\u0E07\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E41\u0E16\u0E1A\u0E04\u0E27\u0E1A\u0E04\u0E38\u0E21\u0E14\u0E49\u0E32\u0E19\u0E0B\u0E49\u0E32\u0E22")), React.createElement(CodeBlock, {
    title: "\u0E42\u0E04\u0E49\u0E14 OpenCV \u0E17\u0E35\u0E48\u0E43\u0E2B\u0E49\u0E1C\u0E25\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E31\u0E19",
    code: pipelineCode(src.img, params)
  }))), SAMPLES.find(s => s.id === src.id) && React.createElement("span", {
    className: "credit"
  }, SAMPLES.find(s => s.id === src.id).credit));
}
const TFJS_URL = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js";
const COCO_URL = "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js";
const COCO_MODEL_URL = "models/coco-ssd/model.json";

function loadScript(src) {
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
    s.onload = () => {
      s.dataset.ok = "1";
      res();
    };
    s.onerror = () => rej(new Error("โหลดไลบรารีไม่สำเร็จ"));
    document.head.appendChild(s);
  });
}
let detectorPromise = null;
function getDetector() {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      await loadScript(TFJS_URL);
      await loadScript(COCO_URL);
      await window.tf.ready();
      const model = await window.cocoSsd.load({
        modelUrl: COCO_MODEL_URL
      });
      return {
        model,
        backend: window.tf.getBackend()
      };
    })();
    detectorPromise.catch(() => {
      detectorPromise = null;
    });
  }
  return detectorPromise;
}
function BoxCanvas({
  el,
  img,
  dets,
  threshold
}) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || !img) return;
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d");
    if (el) ctx.drawImage(el, 0, 0, img.width, img.height);else ctx.putImageData(new ImageData(new Uint8ClampedArray(img.data), img.width, img.height), 0, 0);
    const lw = Math.max(2, Math.round(img.width / 220)),
      fs = Math.max(12, Math.round(img.width / 32));
    ctx.font = `600 ${fs}px Prompt, sans-serif`;
    (dets || []).filter(d => d.score >= threshold).forEach(d => {
      const [x, y, w, h] = d.bbox;
      ctx.strokeStyle = "#00E5FF";
      ctx.lineWidth = lw;
      ctx.shadowColor = "rgba(0,229,255,.8)";
      ctx.shadowBlur = 8;
      ctx.strokeRect(x, y, w, h);
      ctx.shadowBlur = 0;
      const t = `${d.class} ${Math.round(d.score * 100)}%`,
        tw = ctx.measureText(t).width + 10,
        ty = y > fs + 6 ? y - fs - 6 : y;
      ctx.fillStyle = "#00E5FF";
      ctx.fillRect(x, ty, tw, fs + 6);
      ctx.fillStyle = "#0B1026";
      ctx.fillText(t, x + 5, ty + fs);
    });
  }, [el, img, dets, threshold]);
  return React.createElement("div", {
    className: "dc-wrap"
  }, React.createElement("canvas", {
    ref: ref,
    "aria-label": "\u0E20\u0E32\u0E1E\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E01\u0E23\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E44\u0E14\u0E49"
  }));
}
function DetectionLab({
  onRun,
  onThreshold
}) {
  const [src, pickSample, pickFile] = useImageSource("cat", 800);
  const [status, setStatus] = useState(detectorPromise ? "loading" : "idle");
  const [backend, setBackend] = useState("");
  const [err, setErr] = useState("");
  const [dets, setDets] = useState(null);
  const [mode, setMode] = useState(null);
  const [running, setRunning] = useState(false);
  const [th, setTh] = useState(0.5);
  const [ms, setMs] = useState(null);
  useEffect(() => {
    setDets(null);
    setMode(null);
  }, [src.img]);
  const load = async () => {
    setStatus("loading");
    setErr("");
    try {
      const d = await getDetector();
      setBackend(d.backend);
      setStatus("ready");
    } catch (e) {
      setErr(e.message || "โหลดโมเดลไม่สำเร็จ");
      setStatus("error");
    }
  };
  useEffect(() => {
    if (detectorPromise) load();
  }, []);
  const run = async () => {
    if (!src.img) return;
    setRunning(true);
    try {
      const {
        model
      } = await getDetector();
      const t0 = performance.now();
      const input = src.el || (() => {
        const c = document.createElement("canvas");
        c.width = src.img.width;
        c.height = src.img.height;
        c.getContext("2d").putImageData(new ImageData(new Uint8ClampedArray(src.img.data), src.img.width, src.img.height), 0, 0);
        return c;
      })();
      let p = await model.detect(input, 20, 0.1);
      const sx = src.img.width / (input.naturalWidth || input.width),
        sy = src.img.height / (input.naturalHeight || input.height);
      p = p.map(d => ({
        class: d.class,
        score: d.score,
        bbox: [d.bbox[0] * sx, d.bbox[1] * sy, d.bbox[2] * sx, d.bbox[3] * sy]
      }));
      setMs(Math.round(performance.now() - t0));
      setDets(p);
      setMode("live");
      onRun && onRun({
        source: src.id,
        count: p.length,
        mode: "live"
      });
    } catch (e) {
      setErr(e.message || "ตรวจจับไม่สำเร็จ");
    }
    setRunning(false);
  };
  const showRecorded = () => {
    if (!RECORDED[src.id]) return;
    setDets(RECORDED[src.id]);
    setMode("recorded");
    setMs(null);
    onRun && onRun({
      source: src.id,
      count: RECORDED[src.id].length,
      mode: "recorded"
    });
  };
  const shown = (dets || []).filter(d => d.score >= th);
  return React.createElement("div", {
    className: "lab-tool"
  }, React.createElement("div", {
    className: "panel-head"
  }, React.createElement("span", {
    className: "panel-title"
  }, React.createElement(Icon, {
    name: "target",
    size: 16
  }), "Object Detection Explorer"), React.createElement("span", {
    className: "model-state " + status
  }, status === "ready" ? `โมเดลพร้อม · ${backend}` : status === "loading" ? "กำลังโหลดโมเดล" : status === "error" ? "โหลดโมเดลไม่สำเร็จ" : "ยังไม่ได้โหลดโมเดล")), status === "idle" && React.createElement(Callout, {
    tone: "info",
    icon: "cpu",
    title: "\u0E43\u0E0A\u0E49\u0E42\u0E21\u0E40\u0E14\u0E25 AI \u0E08\u0E23\u0E34\u0E07: COCO-SSD (TensorFlow.js)"
  }, "\u0E42\u0E21\u0E40\u0E14\u0E25\u0E19\u0E35\u0E49\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E27\u0E31\u0E15\u0E16\u0E38\u0E44\u0E14\u0E49 80 \u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E08\u0E32\u0E01\u0E0A\u0E38\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 COCO \u0E41\u0E25\u0E30\u0E17\u0E33\u0E07\u0E32\u0E19\u0E43\u0E19\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E02\u0E2D\u0E07\u0E40\u0E18\u0E2D\u0E40\u0E2D\u0E07 \u0E20\u0E32\u0E1E\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E2A\u0E48\u0E07\u0E2D\u0E2D\u0E01\u0E44\u0E1B\u0E44\u0E2B\u0E19 \u0E01\u0E32\u0E23\u0E42\u0E2B\u0E25\u0E14\u0E04\u0E23\u0E31\u0E49\u0E07\u0E41\u0E23\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E14\u0E32\u0E27\u0E19\u0E4C\u0E42\u0E2B\u0E25\u0E14\u0E44\u0E1F\u0E25\u0E4C\u0E23\u0E32\u0E27 17 MB (\u0E16\u0E49\u0E32\u0E43\u0E0A\u0E49\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D \u0E41\u0E19\u0E30\u0E19\u0E33\u0E43\u0E2B\u0E49\u0E15\u0E48\u0E2D Wi-Fi)", React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, React.createElement(Button, {
    icon: "cpu",
    onClick: load
  }, "\u0E42\u0E2B\u0E25\u0E14\u0E42\u0E21\u0E40\u0E14\u0E25\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E27\u0E31\u0E15\u0E16\u0E38"))), status === "loading" && React.createElement("div", {
    className: "loading-model"
  }, React.createElement("span", {
    className: "scanline",
    "aria-hidden": "true"
  }), React.createElement(ProcessingBadge, {
    text: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E14\u0E32\u0E27\u0E19\u0E4C\u0E42\u0E2B\u0E25\u0E14\u0E41\u0E25\u0E30\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21\u0E42\u0E21\u0E40\u0E14\u0E25 \u0E2D\u0E32\u0E08\u0E43\u0E0A\u0E49\u0E40\u0E27\u0E25\u0E32\u0E2A\u0E31\u0E01\u0E04\u0E23\u0E39\u0E48"
  })), status === "error" && React.createElement(Callout, {
    tone: "warn",
    title: "\u0E42\u0E2B\u0E25\u0E14\u0E42\u0E21\u0E40\u0E14\u0E25\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 \u0E08\u0E36\u0E07\u0E40\u0E1B\u0E34\u0E14\u0E42\u0E2B\u0E21\u0E14\u0E14\u0E39\u0E1C\u0E25\u0E17\u0E35\u0E48\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49"
  }, err, " \xB7 \u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E04\u0E23\u0E37\u0E2D\u0E02\u0E48\u0E32\u0E22\u0E2D\u0E32\u0E08\u0E1A\u0E25\u0E47\u0E2D\u0E01\u0E01\u0E32\u0E23\u0E42\u0E2B\u0E25\u0E14 \u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E19\u0E35\u0E49\u0E14\u0E39\u0E1C\u0E25\u0E17\u0E35\u0E48\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E08\u0E32\u0E01\u0E01\u0E32\u0E23\u0E23\u0E31\u0E19\u0E42\u0E21\u0E40\u0E14\u0E25\u0E08\u0E23\u0E34\u0E07\u0E1A\u0E19\u0E20\u0E32\u0E1E\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E14\u0E49 \u0E0B\u0E36\u0E48\u0E07\u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E21\u0E27\u0E25\u0E1C\u0E25\u0E2A\u0E14 \u0E41\u0E25\u0E30\u0E43\u0E0A\u0E49\u0E01\u0E31\u0E1A\u0E20\u0E32\u0E1E\u0E17\u0E35\u0E48\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49", React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "refresh",
    onClick: load
  }, "\u0E25\u0E2D\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07"))), React.createElement(SourcePicker, {
    value: src.id,
    onSample: pickSample,
    onFile: pickFile,
    allow: ["cat", "coffee", "horse", "rocket"],
    upload: status !== "error",
    busy: src.busy || running
  }), src.error && React.createElement("div", {
    className: "form-err",
    role: "alert"
  }, React.createElement(Icon, {
    name: "alert",
    size: 16
  }), src.error), React.createElement("div", {
    className: "det-grid"
  }, React.createElement("div", {
    className: "viewer"
  }, src.img && React.createElement(BoxCanvas, {
    el: src.el,
    img: src.img,
    dets: dets,
    threshold: th
  }), running && React.createElement("div", {
    className: "scan-over",
    "aria-hidden": "true"
  }, React.createElement("span", {
    className: "scanline"
  })), React.createElement("div", {
    className: "btn-inline"
  }, status === "ready" && React.createElement(Button, {
    className: "btn-glow",
    icon: "target",
    disabled: running || !src.img,
    onClick: run
  }, running ? "กำลังตรวจจับ…" : "ตรวจจับวัตถุ"), status === "error" && RECORDED[src.id] && React.createElement(Button, {
    icon: "eye",
    onClick: showRecorded
  }, "\u0E14\u0E39\u0E1C\u0E25\u0E17\u0E35\u0E48\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49"))), React.createElement("div", {
    className: "inspector"
  }, React.createElement("div", {
    className: "ctl"
  }, React.createElement("label", {
    htmlFor: "det-th"
  }, "Confidence threshold"), React.createElement("input", {
    id: "det-th",
    type: "range",
    min: "0.1",
    max: "0.9",
    step: "0.05",
    value: th,
    onChange: e => {
      setTh(+e.target.value);
      onThreshold && onThreshold(+e.target.value);
    }
  }), React.createElement("output", {
    className: "mono"
  }, Math.round(th * 100), "%")), React.createElement("span", {
    className: "hint"
  }, "\u0E41\u0E2A\u0E14\u0E07\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E1C\u0E25\u0E17\u0E35\u0E48\u0E21\u0E31\u0E48\u0E19\u0E43\u0E08\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 ", Math.round(th * 100), "%"), mode && React.createElement(Badge, {
    tone: mode === "live" ? "ok" : "demo",
    dot: true
  }, mode === "live" ? `ประมวลผลสดด้วย COCO-SSD${ms !== null ? ` · ${ms} ms` : ""}` : "ผลที่บันทึกไว้ ไม่ใช่การประมวลผลสด"), !dets ? React.createElement("p", {
    className: "hint"
  }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1C\u0E25 \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E20\u0E32\u0E1E\u0E41\u0E25\u0E49\u0E27\u0E01\u0E14 \"\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E27\u0E31\u0E15\u0E16\u0E38\"") : React.createElement("div", {
    className: "table-wrap"
  }, React.createElement("table", {
    className: "hist det-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "\u0E27\u0E31\u0E15\u0E16\u0E38"), React.createElement("th", null, "Confidence"), React.createElement("th", null, "\u0E01\u0E23\u0E2D\u0E1A [x, y, w, h]"))), React.createElement("tbody", null, dets.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "3"
  }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E27\u0E31\u0E15\u0E16\u0E38\u0E17\u0E35\u0E48\u0E21\u0E31\u0E48\u0E19\u0E43\u0E08\u0E40\u0E01\u0E34\u0E19 10%")), dets.map((d, i) => React.createElement("tr", {
    key: i,
    className: d.score < th ? "below" : ""
  }, React.createElement("td", null, d.class, COCO_TH[d.class] ? React.createElement("span", {
    className: "hint"
  }, " \xB7 ", COCO_TH[d.class]) : null), React.createElement("td", {
    className: "mono"
  }, (d.score * 100).toFixed(1), "%"), React.createElement("td", {
    className: "mono"
  }, "[", d.bbox.map(v => Math.round(v)).join(", "), "]")))))), dets && React.createElement("span", {
    className: "hint"
  }, "\u0E41\u0E2A\u0E14\u0E07 ", shown.length, " \u0E08\u0E32\u0E01 ", dets.length, " \u0E1C\u0E25\u0E25\u0E31\u0E1E\u0E18\u0E4C \xB7 \u0E41\u0E16\u0E27\u0E2A\u0E35\u0E08\u0E32\u0E07\u0E04\u0E37\u0E2D\u0E1C\u0E25\u0E17\u0E35\u0E48\u0E15\u0E48\u0E33\u0E01\u0E27\u0E48\u0E32 threshold"))), SAMPLES.find(s => s.id === src.id) && React.createElement("span", {
    className: "credit"
  }, SAMPLES.find(s => s.id === src.id).credit), React.createElement("span", {
    className: "credit"
  }, "\u0E42\u0E21\u0E40\u0E14\u0E25 COCO-SSD (SSD MobileNet v2) \u0E08\u0E32\u0E01 TensorFlow.js Models \xB7 Apache License 2.0"));
}
function LabShell({
  unitId,
  labId,
  objective,
  steps: baseSteps,
  children,
  question,
  reflection
}) {
  const {
    saveActivity,
    saveReflection,
    progress
  } = useApp();
  const [refl, setRefl] = useState(() => (progress[unitId].reflections || {})[labId] || "");
  const steps = reflection ? [...baseSteps, {
    id: "refl",
    text: "ตอบคำถาม Reflection ด้วยความคิดของตัวเอง (อย่างน้อย 1 ประโยค)",
    done: refl.trim().length >= 15
  }] : baseSteps;
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
  return React.createElement("div", {
    className: "act lab"
  }, React.createElement("div", {
    className: "lab-meta"
  }, React.createElement("div", {
    className: "lab-obj"
  }, React.createElement("span", {
    className: "eyebrow"
  }, "\u0E27\u0E31\u0E15\u0E16\u0E38\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C"), React.createElement("p", null, objective)), done && React.createElement(Badge, {
    tone: "ok",
    dot: true
  }, "\u0E17\u0E33 Lab \u0E19\u0E35\u0E49\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08\u0E41\u0E25\u0E49\u0E27", best ? ` · ${best.best}/${best.max}` : "")), React.createElement("div", {
    className: "q-card"
  }, React.createElement("div", {
    className: "act-head"
  }, React.createElement("strong", null, "\u0E04\u0E33\u0E2A\u0E31\u0E48\u0E07"), React.createElement("span", {
    className: "mono hint"
  }, stepsDone, "/", steps.length, " \u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19")), React.createElement("ol", {
    className: "steps"
  }, steps.map((s, i) => React.createElement("li", {
    key: s.id,
    className: s.done ? "done" : ""
  }, React.createElement("span", {
    className: "step-ic"
  }, s.done ? React.createElement(Icon, {
    name: "check",
    size: 14
  }) : i + 1), React.createElement("span", null, s.text, s.status && React.createElement("span", {
    className: "hint",
    style: {
      display: "block"
    }
  }, s.status)))))), children, reflection && React.createElement("div", {
    className: "q-card refl"
  }, React.createElement("label", {
    htmlFor: labId + "-refl",
    className: "q-title"
  }, "Reflection: ", reflection), React.createElement("textarea", {
    id: labId + "-refl",
    className: "input ta",
    rows: "3",
    maxLength: 2000,
    value: refl,
    onChange: e => setRefl(e.target.value),
    onBlur: () => saveReflection(unitId, labId, refl),
    placeholder: "\u0E40\u0E02\u0E35\u0E22\u0E19\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E2A\u0E31\u0E07\u0E40\u0E01\u0E15\u0E41\u0E25\u0E30\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25\u0E02\u0E2D\u0E07\u0E40\u0E18\u0E2D"
  }), React.createElement("span", {
    className: "hint"
  }, "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49\u0E43\u0E19\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E19\u0E35\u0E49 \xB7 ", refl.trim().length, " \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23")), React.createElement("fieldset", {
    className: "q-card part"
  }, React.createElement("legend", {
    className: "q-title"
  }, "\u0E04\u0E33\u0E16\u0E32\u0E21\u0E17\u0E49\u0E32\u0E22 Lab: ", question.q), question.code && React.createElement(CodeBlock, {
    code: question.code
  }), React.createElement("div", {
    className: "opts col"
  }, question.options.map(o => React.createElement("button", {
    key: o.id,
    type: "button",
    className: "opt " + (checked ? o.id === question.answer && pick === o.id ? "is-correct" : pick === o.id ? "is-wrong" : "" : ""),
    "aria-pressed": pick === o.id,
    disabled: qOk,
    onClick: () => {
      setPick(o.id);
      setChecked(false);
    }
  }, o.text))), !qOk && React.createElement(Button, {
    size: "sm",
    icon: "check",
    disabled: !pick,
    onClick: check,
    style: {
      justifySelf: "start"
    }
  }, "\u0E15\u0E23\u0E27\u0E08\u0E04\u0E33\u0E15\u0E2D\u0E1A"), checked && React.createElement(Feedback, {
    tone: qOk ? "good" : "bad",
    title: qOk ? "ถูกต้อง" : "ยังไม่ถูก ลองเลือกใหม่อีกครั้ง"
  }, qOk ? question.explain : question.hint)), allDone ? React.createElement("div", {
    className: "result",
    role: "status"
  }, React.createElement("div", {
    className: "bot"
  }, React.createElement(AIraBot, {
    mood: "cheer",
    float: false,
    title: ""
  })), React.createElement("div", {
    style: {
      flex: "1 1 220px",
      display: "grid",
      gap: 4
    }
  }, React.createElement("strong", {
    style: {
      fontSize: 18
    }
  }, "Lab \u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08! \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E41\u0E25\u0E49\u0E27"), React.createElement("span", {
    style: {
      color: "var(--muted)",
      fontSize: 14
    }
  }, "\u0E44\u0E14\u0E49 ", steps.length + (firstTry ? 1 : 0), "/", max, " \u0E04\u0E30\u0E41\u0E19\u0E19 (\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E04\u0E23\u0E1A ", steps.length, " \u0E04\u0E30\u0E41\u0E19\u0E19 + \u0E04\u0E33\u0E16\u0E32\u0E21\u0E17\u0E49\u0E32\u0E22 Lab ", firstTry ? "ตอบถูกครั้งแรก 1 คะแนน" : "0 คะแนนเพราะไม่ถูกในครั้งแรก", ")"))) : React.createElement("span", {
    className: "hint"
  }, "\u0E17\u0E33\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A\u0E41\u0E25\u0E30\u0E15\u0E2D\u0E1A\u0E04\u0E33\u0E16\u0E32\u0E21\u0E17\u0E49\u0E32\u0E22 Lab \u0E43\u0E2B\u0E49\u0E16\u0E39\u0E01 \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E27\u0E48\u0E32 Lab \u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08"));
}

function CvScene({
  task
}) {
  return React.createElement("svg", {
    viewBox: "0 0 360 220",
    className: "cv-scene",
    role: "img",
    "aria-label": `ภาพจำลองผลลัพธ์ของงาน ${task}`
  }, React.createElement("rect", {
    x: "0",
    y: "0",
    width: "360",
    height: "220",
    rx: "14",
    fill: "#161336"
  }), React.createElement("rect", {
    x: "0",
    y: "160",
    width: "360",
    height: "60",
    fill: "#221d4d"
  }), React.createElement("rect", {
    x: "196",
    y: "120",
    width: "140",
    height: "10",
    rx: "3",
    fill: "#9B87F5"
  }), React.createElement("rect", {
    x: "206",
    y: "130",
    width: "8",
    height: "58",
    fill: "#7C67E8"
  }), React.createElement("rect", {
    x: "318",
    y: "130",
    width: "8",
    height: "58",
    fill: "#7C67E8"
  }), React.createElement("g", {
    transform: "translate(248 86)"
  }, React.createElement("path", {
    d: "M0 0 h30 v26 q0 10 -10 10 h-10 q-10 0 -10 -10z",
    fill: "#F4F6FB"
  }), React.createElement("path", {
    d: "M30 8 q12 0 12 10 q0 10 -12 8",
    fill: "none",
    stroke: "#F4F6FB",
    strokeWidth: "4"
  })), React.createElement("g", {
    transform: "translate(52 112)"
  }, React.createElement("ellipse", {
    cx: "36",
    cy: "44",
    rx: "40",
    ry: "26",
    fill: "#FFD66D"
  }), React.createElement("circle", {
    cx: "70",
    cy: "22",
    r: "20",
    fill: "#FFD66D"
  }), React.createElement("path", {
    d: "M56 6 l4 -14 l8 10z M76 4 l8 -12 l4 14z",
    fill: "#FFD66D"
  }), React.createElement("circle", {
    cx: "64",
    cy: "20",
    r: "3",
    fill: "#0B1026"
  }), React.createElement("circle", {
    cx: "77",
    cy: "20",
    r: "3",
    fill: "#0B1026"
  }), React.createElement("path", {
    d: "M-4 40 q-14 -20 4 -30",
    fill: "none",
    stroke: "#FFD66D",
    strokeWidth: "7",
    strokeLinecap: "round"
  })), React.createElement("g", {
    transform: "translate(150 40)"
  }, React.createElement("circle", {
    cx: "22",
    cy: "22",
    r: "20",
    fill: "#C9C3EE"
  }), React.createElement("circle", {
    cx: "15",
    cy: "20",
    r: "2.5",
    fill: "#0B1026"
  }), React.createElement("circle", {
    cx: "29",
    cy: "20",
    r: "2.5",
    fill: "#0B1026"
  }), React.createElement("path", {
    d: "M14 30 q8 6 16 0",
    fill: "none",
    stroke: "#0B1026",
    strokeWidth: "2",
    strokeLinecap: "round"
  }), React.createElement("rect", {
    x: "2",
    y: "44",
    width: "40",
    height: "76",
    rx: "18",
    fill: "#57CCF2"
  })), task === "cls" && React.createElement("g", null, React.createElement("rect", {
    x: "12",
    y: "12",
    width: "150",
    height: "30",
    rx: "8",
    fill: "#00E5FF"
  }), React.createElement("text", {
    x: "22",
    y: "32",
    fontSize: "14",
    fontWeight: "700",
    fill: "#0B1026",
    fontFamily: "Prompt, sans-serif"
  }, "\u0E20\u0E32\u0E1E: \u0E2B\u0E49\u0E2D\u0E07\u0E19\u0E31\u0E48\u0E07\u0E40\u0E25\u0E48\u0E19 88%")), task === "det" && React.createElement("g", {
    fill: "none",
    stroke: "#00E5FF",
    strokeWidth: "3",
    fontFamily: "Prompt, sans-serif",
    fontSize: "12",
    fontWeight: "700"
  }, [[44, 86, 100, 80, "cat 91%"], [244, 80, 54, 48, "cup 84%"], [146, 36, 52, 128, "person 95%"]].map(([x, y, w, h, t]) => React.createElement("g", {
    key: t
  }, React.createElement("rect", {
    x: x,
    y: y,
    width: w,
    height: h,
    rx: "3"
  }), React.createElement("rect", {
    x: x,
    y: y - 18,
    width: t.length * 7.4,
    height: "18",
    fill: "#00E5FF",
    stroke: "none"
  }), React.createElement("text", {
    x: x + 4,
    y: y - 5,
    fill: "#0B1026",
    stroke: "none"
  }, t)))), task === "face" && React.createElement("g", {
    fill: "none",
    stroke: "#FFD66D",
    strokeWidth: "3",
    fontFamily: "Prompt, sans-serif",
    fontSize: "12",
    fontWeight: "700"
  }, React.createElement("rect", {
    x: "148",
    y: "38",
    width: "48",
    height: "48",
    rx: "4"
  }), React.createElement("rect", {
    x: "148",
    y: "20",
    width: "84",
    height: "18",
    fill: "#FFD66D",
    stroke: "none"
  }), React.createElement("text", {
    x: "152",
    y: "33",
    fill: "#0B1026",
    stroke: "none"
  }, "face 97%"), React.createElement("text", {
    x: "206",
    y: "66",
    fill: "#FFD66D",
    stroke: "none",
    fontWeight: "400"
  }, "\u0E44\u0E21\u0E48\u0E23\u0E39\u0E49\u0E27\u0E48\u0E32\u0E40\u0E1B\u0E47\u0E19\u0E43\u0E04\u0E23")));
}
function CvTasks() {
  const [task, setTask] = useState("det");
  const T = {
    cls: {
      t: "Image Classification",
      th: "การจำแนกภาพ",
      q: "ภาพนี้คืออะไร",
      out: "1 ป้ายกำกับ (หรือหลายป้าย) ต่อทั้งภาพ พร้อมค่าความมั่นใจ",
      ex: "แยกภาพใบข้าวปกติกับใบข้าวเป็นโรค คัดแยกผลไม้ตามเกรด"
    },
    det: {
      t: "Object Detection",
      th: "การตรวจจับวัตถุ",
      q: "มีวัตถุอะไรบ้าง และอยู่ตรงไหน",
      out: "หลายกรอบสี่เหลี่ยม (Bounding Box) แต่ละกรอบมีชื่อวัตถุและค่าความมั่นใจ",
      ex: "นับรถบนถนน ระบบช่วยขับขี่ ตรวจสินค้าบนสายพาน"
    },
    face: {
      t: "Face Detection",
      th: "การตรวจจับใบหน้า",
      q: "มีใบหน้าในภาพไหม อยู่ตรงไหน",
      out: "กรอบรอบใบหน้า โดยไม่รู้ว่าเป็นใคร",
      ex: "กล้องโฟกัสใบหน้าอัตโนมัติ เบลอใบหน้าในภาพเพื่อความเป็นส่วนตัว"
    }
  };
  const x = T[task];
  return React.createElement("div", {
    className: "cv-tasks"
  }, React.createElement("div", {
    className: "seg",
    role: "tablist",
    "aria-label": "\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E07\u0E32\u0E19\u0E04\u0E2D\u0E21\u0E1E\u0E34\u0E27\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E27\u0E34\u0E17\u0E31\u0E28\u0E19\u0E4C"
  }, Object.entries(T).map(([id, v]) => React.createElement("button", {
    key: id,
    type: "button",
    role: "tab",
    "aria-selected": task === id,
    onClick: () => setTask(id)
  }, v.t))), React.createElement("div", {
    className: "cv-task-body",
    key: task,
    role: "tabpanel"
  }, React.createElement(CvScene, {
    task: task
  }), React.createElement("div", {
    style: {
      display: "grid",
      gap: 8,
      minWidth: 0,
      alignContent: "start"
    }
  }, React.createElement("h4", {
    style: {
      margin: 0,
      fontSize: 17
    }
  }, x.t, " \xB7 ", x.th), React.createElement("p", null, React.createElement("b", null, "\u0E15\u0E2D\u0E1A\u0E04\u0E33\u0E16\u0E32\u0E21:"), " ", x.q), React.createElement("p", null, React.createElement("b", null, "\u0E1C\u0E25\u0E25\u0E31\u0E1E\u0E18\u0E4C:"), " ", x.out), React.createElement("p", null, React.createElement("b", null, "\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49:"), " ", x.ex), React.createElement("span", {
    className: "hint"
  }, "\u0E20\u0E32\u0E1E\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E20\u0E32\u0E1E\u0E27\u0E32\u0E14\u0E1B\u0E23\u0E30\u0E01\u0E2D\u0E1A \u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E43\u0E19\u0E01\u0E23\u0E2D\u0E1A\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E1C\u0E25\u0E25\u0E31\u0E1E\u0E18\u0E4C"))));
}
function U2Lesson1() {
  const [step, setStep] = useState("num");
  const s = CV_PIPE.find(x => x.id === step);
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "Computer Vision \u0E04\u0E37\u0E2D\u0E2D\u0E30\u0E44\u0E23"), React.createElement("p", null, React.createElement("b", null, "\u0E04\u0E2D\u0E21\u0E1E\u0E34\u0E27\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E27\u0E34\u0E17\u0E31\u0E28\u0E19\u0E4C (Computer Vision)"), " \u0E04\u0E37\u0E2D\u0E2A\u0E32\u0E02\u0E32\u0E02\u0E2D\u0E07 AI \u0E17\u0E35\u0E48\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E04\u0E2D\u0E21\u0E1E\u0E34\u0E27\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E23\u0E31\u0E1A\u0E23\u0E39\u0E49 \u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C \u0E41\u0E25\u0E30\u0E40\u0E02\u0E49\u0E32\u0E43\u0E08\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E08\u0E32\u0E01\u0E20\u0E32\u0E1E\u0E2B\u0E23\u0E37\u0E2D\u0E27\u0E34\u0E14\u0E35\u0E42\u0E2D \u0E41\u0E25\u0E49\u0E27\u0E19\u0E33\u0E44\u0E1B\u0E43\u0E0A\u0E49\u0E15\u0E31\u0E14\u0E2A\u0E34\u0E19\u0E43\u0E08\u0E2B\u0E23\u0E37\u0E2D\u0E17\u0E33\u0E07\u0E32\u0E19\u0E15\u0E48\u0E2D\u0E44\u0E14\u0E49 \u0E40\u0E0A\u0E48\u0E19 \u0E1A\u0E2D\u0E01\u0E27\u0E48\u0E32\u0E43\u0E19\u0E20\u0E32\u0E1E\u0E21\u0E35\u0E2D\u0E30\u0E44\u0E23 \u0E2D\u0E22\u0E39\u0E48\u0E15\u0E23\u0E07\u0E44\u0E2B\u0E19 \u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E01\u0E34\u0E14\u0E2D\u0E30\u0E44\u0E23\u0E02\u0E36\u0E49\u0E19"), React.createElement("h3", {
    className: "sub"
  }, "\u0E2B\u0E25\u0E31\u0E01\u0E01\u0E32\u0E23\u0E17\u0E33\u0E07\u0E32\u0E19\u0E40\u0E1A\u0E37\u0E49\u0E2D\u0E07\u0E15\u0E49\u0E19"), React.createElement("p", null, "\u0E01\u0E14\u0E41\u0E15\u0E48\u0E25\u0E30\u0E02\u0E31\u0E49\u0E19\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E27\u0E48\u0E32\u0E20\u0E32\u0E1E\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07\u0E08\u0E32\u0E01\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E44\u0E1B\u0E40\u0E1B\u0E47\u0E19\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E02\u0E2D\u0E07 AI \u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E23")), React.createElement("div", {
    className: "pipe",
    role: "tablist",
    "aria-label": "\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E01\u0E32\u0E23\u0E17\u0E33\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E04\u0E2D\u0E21\u0E1E\u0E34\u0E27\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E27\u0E34\u0E17\u0E31\u0E28\u0E19\u0E4C"
  }, CV_PIPE.map((x, i) => React.createElement(React.Fragment, {
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
  }, i + 1), x.t), i < CV_PIPE.length - 1 && React.createElement("span", {
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
  }, React.createElement("b", null, s.t), React.createElement("p", null, s.d))), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "\u0E07\u0E32\u0E19\u0E2B\u0E25\u0E31\u0E01\u0E02\u0E2D\u0E07\u0E04\u0E2D\u0E21\u0E1E\u0E34\u0E27\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E27\u0E34\u0E17\u0E31\u0E28\u0E19\u0E4C")), React.createElement(CvTasks, null), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "\u0E01\u0E32\u0E23\u0E19\u0E33\u0E44\u0E1B\u0E43\u0E0A\u0E49\u0E43\u0E19\u0E0A\u0E35\u0E27\u0E34\u0E15\u0E1B\u0E23\u0E30\u0E08\u0E33\u0E27\u0E31\u0E19")), React.createElement("div", {
    className: "chips-grid"
  }, [["lock", "ปลดล็อกด้วยใบหน้า", "ตรวจจับและยืนยันใบหน้าเจ้าของเครื่อง"], ["book", "สแกนเอกสารเป็นข้อความ", "OCR อ่านตัวอักษรจากภาพ"], ["target", "ระบบช่วยจอดรถ", "ตรวจจับคนและสิ่งกีดขวาง"], ["chart", "เกษตรอัจฉริยะ", "ตรวจโรคพืชจากภาพใบ"], ["eye", "ช่วยแพทย์อ่านภาพ", "คัดกรองภาพเอกซเรย์และจอประสาทตา"], ["grid", "ร้านค้าไร้พนักงาน", "ติดตามสินค้าที่หยิบ"]].map(([ic, t, d]) => React.createElement("div", {
    className: "ex-card",
    key: t
  }, React.createElement(Icon, {
    name: ic,
    size: 18
  }), React.createElement("span", null, React.createElement("b", null, t), d)))));
}

function U2Lesson2() {
  const [mix, setMix] = useState([255, 140, 0]);
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "\u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14"), React.createElement("p", null, React.createElement("b", null, "\u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25 (Pixel)"), " \u0E04\u0E37\u0E2D\u0E08\u0E38\u0E14\u0E2A\u0E35\u0E17\u0E35\u0E48\u0E40\u0E25\u0E47\u0E01\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E20\u0E32\u0E1E\u0E14\u0E34\u0E08\u0E34\u0E17\u0E31\u0E25 \u0E20\u0E32\u0E1E\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E20\u0E32\u0E1E\u0E04\u0E37\u0E2D\u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25\u0E08\u0E33\u0E19\u0E27\u0E19\u0E21\u0E32\u0E01\u0E40\u0E23\u0E35\u0E22\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E32\u0E23\u0E32\u0E07 ", React.createElement("b", null, "\u0E04\u0E27\u0E32\u0E21\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14 (Resolution)"), " \u0E1A\u0E2D\u0E01\u0E08\u0E33\u0E19\u0E27\u0E19\u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25\u0E40\u0E1B\u0E47\u0E19 \u0E01\u0E27\u0E49\u0E32\u0E07 \xD7 \u0E2A\u0E39\u0E07 \u0E40\u0E0A\u0E48\u0E19 \u0E20\u0E32\u0E1E Full HD \u0E02\u0E19\u0E32\u0E14 1920 \xD7 1080 \u0E21\u0E35\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 2,073,600 \u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25 \u0E22\u0E34\u0E48\u0E07\u0E21\u0E35\u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25\u0E21\u0E32\u0E01 \u0E22\u0E34\u0E48\u0E07\u0E40\u0E01\u0E47\u0E1A\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E44\u0E14\u0E49\u0E21\u0E32\u0E01"), React.createElement("h3", {
    className: "sub"
  }, "\u0E23\u0E30\u0E1A\u0E1A\u0E2A\u0E35 RGB"), React.createElement("p", null, "\u0E08\u0E2D\u0E20\u0E32\u0E1E\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E2A\u0E35\u0E08\u0E32\u0E01\u0E41\u0E2A\u0E07 3 \u0E2A\u0E35 \u0E04\u0E37\u0E2D ", React.createElement("b", {
    style: {
      color: "#FF7A90"
    }
  }, "\u0E41\u0E14\u0E07 (R)"), " ", React.createElement("b", {
    style: {
      color: "#5BE3A8"
    }
  }, "\u0E40\u0E02\u0E35\u0E22\u0E27 (G)"), " \u0E41\u0E25\u0E30 ", React.createElement("b", {
    style: {
      color: "#57CCF2"
    }
  }, "\u0E19\u0E49\u0E33\u0E40\u0E07\u0E34\u0E19 (B)"), " \u0E41\u0E15\u0E48\u0E25\u0E30\u0E2A\u0E35\u0E21\u0E35\u0E04\u0E48\u0E32 0\u2013255 (\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 8 \u0E1A\u0E34\u0E15) \u0E1C\u0E2A\u0E21\u0E01\u0E31\u0E19\u0E44\u0E14\u0E49 256 \xD7 256 \xD7 256 \u2248 16.7 \u0E25\u0E49\u0E32\u0E19\u0E2A\u0E35 \u0E25\u0E2D\u0E07\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E41\u0E16\u0E1A\u0E14\u0E39")), React.createElement(ColorMixer, {
    value: mix,
    onChange: setMix,
    idp: "l2mix"
  }), React.createElement("div", {
    className: "chips-grid"
  }, [[[255, 0, 0], "แดง"], [[0, 255, 0], "เขียว"], [[0, 0, 255], "น้ำเงิน"], [[255, 255, 0], "เหลือง = แดง + เขียว"], [[0, 255, 255], "ฟ้า = เขียว + น้ำเงิน"], [[255, 0, 255], "ม่วงแดง = แดง + น้ำเงิน"], [[255, 255, 255], "ขาว = ทุกสีเต็ม"], [[0, 0, 0], "ดำ = ไม่มีแสง"]].map(([c, t]) => React.createElement("button", {
    type: "button",
    key: t,
    className: "ex-card swatch-btn",
    onClick: () => setMix(c)
  }, React.createElement("span", {
    className: "swatch sm",
    style: {
      background: `rgb(${c.join(",")})`
    }
  }), React.createElement("span", null, React.createElement("b", {
    className: "mono"
  }, "(", c.join(", "), ")"), t)))), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "\u0E20\u0E32\u0E1E\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E40\u0E17\u0E32 (Grayscale)"), React.createElement("p", null, "\u0E20\u0E32\u0E1E\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E40\u0E17\u0E32\u0E40\u0E01\u0E47\u0E1A\u0E04\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E27\u0E48\u0E32\u0E07\u0E40\u0E1E\u0E35\u0E22\u0E07 1 \u0E04\u0E48\u0E32\u0E15\u0E48\u0E2D\u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25 (0 = \u0E14\u0E33, 255 = \u0E02\u0E32\u0E27) OpenCV \u0E41\u0E1B\u0E25\u0E07\u0E14\u0E49\u0E27\u0E22\u0E2A\u0E39\u0E15\u0E23 ", React.createElement("span", {
    className: "mono"
  }, "Y = 0.299R + 0.587G + 0.114B"), " \u0E2A\u0E35\u0E40\u0E02\u0E35\u0E22\u0E27\u0E21\u0E35\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E21\u0E32\u0E01\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E40\u0E1E\u0E23\u0E32\u0E30\u0E15\u0E32\u0E21\u0E19\u0E38\u0E29\u0E22\u0E4C\u0E44\u0E27\u0E15\u0E48\u0E2D\u0E41\u0E2A\u0E07\u0E2A\u0E35\u0E40\u0E02\u0E35\u0E22\u0E27\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14 \u0E2A\u0E35\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2D\u0E22\u0E39\u0E48\u0E21\u0E35\u0E04\u0E48\u0E32\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E40\u0E17\u0E32 ", React.createElement("b", {
    className: "mono"
  }, IMG.grayValue(...mix))), React.createElement("h3", {
    className: "sub"
  }, "\u0E20\u0E32\u0E1E\u0E04\u0E37\u0E2D\u0E40\u0E21\u0E17\u0E23\u0E34\u0E01\u0E0B\u0E4C\u0E02\u0E2D\u0E07\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02"), React.createElement("p", null, "\u0E04\u0E2D\u0E21\u0E1E\u0E34\u0E27\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E40\u0E01\u0E47\u0E1A\u0E20\u0E32\u0E1E\u0E40\u0E1B\u0E47\u0E19 ", React.createElement("b", null, "\u0E40\u0E21\u0E17\u0E23\u0E34\u0E01\u0E0B\u0E4C (Image Matrix)"), " \u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E14\u0E49\u0E32\u0E19\u0E25\u0E48\u0E32\u0E07\u0E04\u0E37\u0E2D\u0E20\u0E32\u0E1E\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E40\u0E17\u0E32\u0E02\u0E19\u0E32\u0E14 4 \xD7 4 \u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25 \u0E41\u0E15\u0E48\u0E25\u0E30\u0E0A\u0E48\u0E2D\u0E07\u0E04\u0E37\u0E2D\u0E04\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E27\u0E48\u0E32\u0E07 \u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E19\u0E31\u0E1A\u0E08\u0E32\u0E01\u0E21\u0E38\u0E21\u0E1A\u0E19\u0E0B\u0E49\u0E32\u0E22 (0, 0) \u0E41\u0E16\u0E27\u0E04\u0E37\u0E2D y \u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C\u0E04\u0E37\u0E2D x")), React.createElement("div", {
    className: "matrix-demo"
  }, React.createElement("div", {
    className: "mx-cells",
    role: "img",
    "aria-label": "\u0E20\u0E32\u0E1E\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E40\u0E17\u0E32 4\xD74"
  }, MATRIX_EX.flat().map((v, i) => React.createElement("span", {
    key: i,
    style: {
      background: `rgb(${v},${v},${v})`,
      color: v > 128 ? "#0B1026" : "#F4F6FB"
    },
    className: "mono"
  }, v))), React.createElement(CodeBlock, {
    title: "NumPy",
    code: "import numpy as np\n\nimg = np.array([[ 12,  40, 200, 255],\n                [ 30,  90, 210, 240],\n                [ 55, 110, 180, 205],\n                [ 80, 150, 160, 170]], dtype=np.uint8)\n\nprint(img.shape)   # (4, 4)  -> (สูง, กว้าง)\nprint(img[0, 3])   # 255 -> แถว y=0, คอลัมน์ x=3"
  })), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "\u0E21\u0E34\u0E15\u0E34\u0E02\u0E2D\u0E07\u0E20\u0E32\u0E1E (Image Dimensions)"), React.createElement("p", null, "\u0E43\u0E19 NumPy/OpenCV \u0E20\u0E32\u0E1E\u0E2A\u0E35\u0E21\u0E35 ", React.createElement("b", null, "shape = (\u0E2A\u0E39\u0E07, \u0E01\u0E27\u0E49\u0E32\u0E07, \u0E0A\u0E48\u0E2D\u0E07\u0E2A\u0E35)"), " \u0E40\u0E0A\u0E48\u0E19 \u0E20\u0E32\u0E1E\u0E01\u0E27\u0E49\u0E32\u0E07 640 \u0E2A\u0E39\u0E07 480 \u0E04\u0E37\u0E2D ", React.createElement("span", {
    className: "mono"
  }, "(480, 640, 3)"), " \u0E2A\u0E48\u0E27\u0E19\u0E20\u0E32\u0E1E\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E40\u0E17\u0E32\u0E04\u0E37\u0E2D ", React.createElement("span", {
    className: "mono"
  }, "(480, 640)"), " \u0E20\u0E32\u0E1E\u0E2A\u0E35 Full HD \u0E17\u0E35\u0E48\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E1A\u0E35\u0E1A\u0E2D\u0E31\u0E14\u0E43\u0E0A\u0E49\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E04\u0E27\u0E32\u0E21\u0E08\u0E33 1920 \xD7 1080 \xD7 3 = 6,220,800 \u0E44\u0E1A\u0E15\u0E4C \u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E32\u0E27 6.2 MB")), React.createElement(Callout, {
    tone: "warn",
    icon: "alert",
    title: "\u0E23\u0E30\u0E27\u0E31\u0E07 2 \u0E08\u0E38\u0E14\u0E17\u0E35\u0E48\u0E21\u0E31\u0E01\u0E2A\u0E31\u0E1A\u0E2A\u0E19"
  }, "1) \u0E25\u0E33\u0E14\u0E31\u0E1A\u0E43\u0E19 shape \u0E04\u0E37\u0E2D (\u0E2A\u0E39\u0E07, \u0E01\u0E27\u0E49\u0E32\u0E07) \u0E41\u0E15\u0E48\u0E1E\u0E34\u0E01\u0E31\u0E14\u0E17\u0E35\u0E48\u0E1E\u0E39\u0E14\u0E01\u0E31\u0E19\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B\u0E04\u0E37\u0E2D (x, y) \u0E08\u0E36\u0E07\u0E40\u0E02\u0E49\u0E32\u0E16\u0E36\u0E07\u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25\u0E14\u0E49\u0E27\u0E22 ", React.createElement("span", {
    className: "mono"
  }, "img[y, x]"), " \xA02) ", React.createElement("span", {
    className: "mono"
  }, "cv2.imread()"), " \u0E40\u0E01\u0E47\u0E1A\u0E2A\u0E35\u0E40\u0E23\u0E35\u0E22\u0E07\u0E40\u0E1B\u0E47\u0E19 ", React.createElement("b", null, "B G R"), " \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48 R G B"), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "Interactive Pixel Explorer"), React.createElement("p", null, "\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E20\u0E32\u0E1E\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E48\u0E27\u0E19\u0E1A\u0E38\u0E04\u0E04\u0E25 \u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E20\u0E32\u0E1E\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07 \u0E41\u0E25\u0E49\u0E27\u0E04\u0E25\u0E34\u0E01\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E1A\u0E19\u0E20\u0E32\u0E1E\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E1E\u0E34\u0E01\u0E31\u0E14\u0E41\u0E25\u0E30\u0E04\u0E48\u0E32\u0E2A\u0E35\u0E08\u0E23\u0E34\u0E07")), React.createElement(PixelExplorer, {
    initial: "cat"
  }));
}

function U2Lesson3() {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "prose"
  }, React.createElement("p", null, React.createElement("b", null, "Python"), " \u0E40\u0E1B\u0E47\u0E19\u0E20\u0E32\u0E29\u0E32\u0E17\u0E35\u0E48\u0E19\u0E34\u0E22\u0E21\u0E43\u0E0A\u0E49\u0E17\u0E33 AI ", React.createElement("b", null, "NumPy"), " \u0E43\u0E0A\u0E49\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E2D\u0E32\u0E23\u0E4C\u0E40\u0E23\u0E22\u0E4C\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E0B\u0E36\u0E48\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49\u0E40\u0E01\u0E47\u0E1A\u0E20\u0E32\u0E1E \u0E41\u0E25\u0E30 ", React.createElement("b", null, "OpenCV (Open Source Computer Vision Library)"), " \u0E40\u0E1B\u0E47\u0E19\u0E44\u0E25\u0E1A\u0E23\u0E32\u0E23\u0E35\u0E42\u0E2D\u0E40\u0E1E\u0E19\u0E0B\u0E2D\u0E23\u0E4C\u0E2A\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E30\u0E21\u0E27\u0E25\u0E1C\u0E25\u0E20\u0E32\u0E1E\u0E41\u0E25\u0E30\u0E27\u0E34\u0E14\u0E35\u0E42\u0E2D \u0E43\u0E19 Python \u0E40\u0E23\u0E35\u0E22\u0E01\u0E43\u0E0A\u0E49\u0E1C\u0E48\u0E32\u0E19\u0E42\u0E21\u0E14\u0E39\u0E25 ", React.createElement("span", {
    className: "mono"
  }, "cv2"))), React.createElement(Callout, {
    tone: "info",
    icon: "cpu",
    title: "\u0E23\u0E31\u0E19\u0E42\u0E04\u0E49\u0E14\u0E44\u0E14\u0E49\u0E17\u0E35\u0E48\u0E44\u0E2B\u0E19"
  }, "\u0E42\u0E04\u0E49\u0E14\u0E43\u0E19\u0E1A\u0E17\u0E19\u0E35\u0E49\u0E23\u0E31\u0E19\u0E44\u0E14\u0E49\u0E43\u0E19 Python \u0E1A\u0E19\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E04\u0E2D\u0E21\u0E1E\u0E34\u0E27\u0E40\u0E15\u0E2D\u0E23\u0E4C (\u0E15\u0E34\u0E14\u0E15\u0E31\u0E49\u0E07\u0E14\u0E49\u0E27\u0E22 ", React.createElement("span", {
    className: "mono"
  }, "pip install opencv-python numpy"), ") \u0E2B\u0E23\u0E37\u0E2D\u0E43\u0E19 ", React.createElement("b", null, "Google Colab"), " \u0E0B\u0E36\u0E48\u0E07\u0E21\u0E35 OpenCV \u0E15\u0E34\u0E14\u0E15\u0E31\u0E49\u0E07\u0E44\u0E27\u0E49\u0E41\u0E25\u0E49\u0E27 \u0E41\u0E15\u0E48 Colab \u0E44\u0E21\u0E48\u0E21\u0E35\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07\u0E41\u0E2A\u0E14\u0E07\u0E1C\u0E25 \u0E08\u0E36\u0E07\u0E43\u0E0A\u0E49 ", React.createElement("span", {
    className: "mono"
  }, "cv2.imshow()"), " \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 \u0E15\u0E49\u0E2D\u0E07\u0E43\u0E0A\u0E49 ", React.createElement("span", {
    className: "mono"
  }, "cv2_imshow()"), " \u0E2B\u0E23\u0E37\u0E2D matplotlib \u0E41\u0E17\u0E19 \u0E2A\u0E48\u0E27\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E19 Python \u0E41\u0E15\u0E48\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E43\u0E19\u0E1A\u0E17\u0E16\u0E31\u0E14\u0E44\u0E1B\u0E08\u0E33\u0E25\u0E2D\u0E07\u0E1C\u0E25\u0E14\u0E49\u0E27\u0E22\u0E2A\u0E39\u0E15\u0E23\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E31\u0E1A OpenCV"), React.createElement("h3", {
    className: "sub"
  }, "1. \u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19"), React.createElement(CodeBlock, {
    code: CODE_SETUP
  }), React.createElement("h3", {
    className: "sub"
  }, "2. \u0E2D\u0E48\u0E32\u0E19\u0E20\u0E32\u0E1E\u0E14\u0E49\u0E27\u0E22 cv2.imread()"), React.createElement(CodeBlock, {
    code: CODE_READ,
    caption: "cv2.imread() \u0E04\u0E37\u0E19\u0E04\u0E48\u0E32\u0E2D\u0E32\u0E23\u0E4C\u0E40\u0E23\u0E22\u0E4C NumPy \u0E02\u0E19\u0E32\u0E14 (\u0E2A\u0E39\u0E07, \u0E01\u0E27\u0E49\u0E32\u0E07, 3) \u0E40\u0E23\u0E35\u0E22\u0E07\u0E2A\u0E35\u0E41\u0E1A\u0E1A BGR \u0E16\u0E49\u0E32\u0E2D\u0E48\u0E32\u0E19\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E08\u0E30\u0E04\u0E37\u0E19\u0E04\u0E48\u0E32 None"
  }), React.createElement("h3", {
    className: "sub"
  }, "3. \u0E41\u0E2A\u0E14\u0E07\u0E20\u0E32\u0E1E\u0E14\u0E49\u0E27\u0E22 cv2.imshow()"), React.createElement(CodeBlock, {
    code: CODE_SHOW
  }), React.createElement(Accordion, {
    items: [{
      id: "plt",
      icon: "chart",
      title: "ทางเลือก: แสดงภาพด้วย matplotlib",
      en: "ใช้ได้ทั้งบนเครื่องและ Colab",
      content: React.createElement(React.Fragment, null, React.createElement("p", null, "matplotlib \u0E40\u0E23\u0E35\u0E22\u0E07\u0E2A\u0E35\u0E41\u0E1A\u0E1A RGB \u0E16\u0E49\u0E32\u0E2A\u0E48\u0E07\u0E20\u0E32\u0E1E BGR \u0E44\u0E1B\u0E15\u0E23\u0E07 \u0E46 \u0E2A\u0E35\u0E41\u0E14\u0E07\u0E01\u0E31\u0E1A\u0E19\u0E49\u0E33\u0E40\u0E07\u0E34\u0E19\u0E08\u0E30\u0E2A\u0E25\u0E31\u0E1A\u0E01\u0E31\u0E19 \u0E08\u0E36\u0E07\u0E15\u0E49\u0E2D\u0E07\u0E41\u0E1B\u0E25\u0E07\u0E01\u0E48\u0E2D\u0E19"), React.createElement(CodeBlock, {
        code: CODE_PLT
      }))
    }]
  }), React.createElement("h3", {
    className: "sub"
  }, "4. \u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14 \u0E41\u0E1B\u0E25\u0E07\u0E2A\u0E35 \u0E41\u0E25\u0E30\u0E01\u0E25\u0E31\u0E1A\u0E20\u0E32\u0E1E"), React.createElement(CodeBlock, {
    code: CODE_TRANSFORM
  }), React.createElement("div", {
    className: "api-table table-wrap"
  }, React.createElement("table", {
    className: "hist"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19"), React.createElement("th", null, "\u0E17\u0E33\u0E2D\u0E30\u0E44\u0E23"), React.createElement("th", null, "\u0E08\u0E38\u0E14\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E27\u0E31\u0E07"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {
    className: "mono"
  }, "cv2.imread(path)"), React.createElement("td", null, "\u0E2D\u0E48\u0E32\u0E19\u0E20\u0E32\u0E1E\u0E08\u0E32\u0E01\u0E44\u0E1F\u0E25\u0E4C"), React.createElement("td", null, "\u0E44\u0E14\u0E49 BGR \xB7 \u0E04\u0E37\u0E19 None \u0E16\u0E49\u0E32\u0E2D\u0E48\u0E32\u0E19\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49")), React.createElement("tr", null, React.createElement("td", {
    className: "mono"
  }, "cv2.imshow(name, img)"), React.createElement("td", null, "\u0E41\u0E2A\u0E14\u0E07\u0E20\u0E32\u0E1E\u0E43\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07"), React.createElement("td", null, "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 cv2.waitKey() \xB7 \u0E43\u0E0A\u0E49\u0E43\u0E19 Colab \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49")), React.createElement("tr", null, React.createElement("td", {
    className: "mono"
  }, "cv2.resize(img, (w, h))"), React.createElement("td", null, "\u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14\u0E20\u0E32\u0E1E"), React.createElement("td", null, "\u0E02\u0E19\u0E32\u0E14\u0E40\u0E02\u0E35\u0E22\u0E19\u0E40\u0E1B\u0E47\u0E19 (\u0E01\u0E27\u0E49\u0E32\u0E07, \u0E2A\u0E39\u0E07) \u0E2A\u0E25\u0E31\u0E1A\u0E01\u0E31\u0E1A shape")), React.createElement("tr", null, React.createElement("td", {
    className: "mono"
  }, "cv2.cvtColor(img, code)"), React.createElement("td", null, "\u0E41\u0E1B\u0E25\u0E07\u0E23\u0E30\u0E1A\u0E1A\u0E2A\u0E35"), React.createElement("td", null, "\u0E40\u0E0A\u0E48\u0E19 COLOR_BGR2GRAY, COLOR_BGR2RGB")), React.createElement("tr", null, React.createElement("td", {
    className: "mono"
  }, "cv2.flip(img, code)"), React.createElement("td", null, "\u0E01\u0E25\u0E31\u0E1A\u0E20\u0E32\u0E1E"), React.createElement("td", null, "1 \u0E0B\u0E49\u0E32\u0E22-\u0E02\u0E27\u0E32 \xB7 0 \u0E1A\u0E19-\u0E25\u0E48\u0E32\u0E07 \xB7 -1 \u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07")), React.createElement("tr", null, React.createElement("td", {
    className: "mono"
  }, "cv2.imwrite(path, img)"), React.createElement("td", null, "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E20\u0E32\u0E1E\u0E25\u0E07\u0E44\u0E1F\u0E25\u0E4C"), React.createElement("td", null, "\u0E04\u0E37\u0E19 True/False \xB7 \u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25\u0E44\u0E1F\u0E25\u0E4C\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A"))))), React.createElement("h3", {
    className: "sub"
  }, "5. \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E20\u0E32\u0E1E\u0E14\u0E49\u0E27\u0E22 cv2.imwrite()"), React.createElement(CodeBlock, {
    code: CODE_WRITE
  }), React.createElement(Accordion, {
    items: [{
      id: "e1",
      icon: "alert",
      title: "AttributeError: 'NoneType' object has no attribute 'shape'",
      en: "ข้อผิดพลาดที่พบบ่อย 1",
      content: React.createElement("p", null, "\u0E40\u0E01\u0E34\u0E14\u0E08\u0E32\u0E01 ", React.createElement("span", {
        className: "mono"
      }, "cv2.imread()"), " \u0E2D\u0E48\u0E32\u0E19\u0E44\u0E1F\u0E25\u0E4C\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08\u0E41\u0E25\u0E49\u0E27\u0E04\u0E37\u0E19 None \u0E15\u0E23\u0E27\u0E08\u0E0A\u0E37\u0E48\u0E2D\u0E44\u0E1F\u0E25\u0E4C \u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25 \u0E41\u0E25\u0E30\u0E42\u0E1F\u0E25\u0E40\u0E14\u0E2D\u0E23\u0E4C\u0E17\u0E35\u0E48\u0E23\u0E31\u0E19\u0E42\u0E04\u0E49\u0E14 \u0E43\u0E19 Colab \u0E15\u0E49\u0E2D\u0E07\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E44\u0E1F\u0E25\u0E4C\u0E40\u0E02\u0E49\u0E32\u0E44\u0E1B\u0E01\u0E48\u0E2D\u0E19")
    }, {
      id: "e2",
      icon: "alert",
      title: "ภาพที่แสดงสีเพี้ยน แดงกลายเป็นน้ำเงิน",
      en: "ข้อผิดพลาดที่พบบ่อย 2",
      content: React.createElement("p", null, "\u0E40\u0E01\u0E34\u0E14\u0E08\u0E32\u0E01\u0E19\u0E33\u0E20\u0E32\u0E1E BGR \u0E44\u0E1B\u0E41\u0E2A\u0E14\u0E07\u0E14\u0E49\u0E27\u0E22\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23 RGB \u0E40\u0E0A\u0E48\u0E19 matplotlib \u0E41\u0E01\u0E49\u0E14\u0E49\u0E27\u0E22 ", React.createElement("span", {
        className: "mono"
      }, "cv2.cvtColor(img, cv2.COLOR_BGR2RGB)"))
    }, {
      id: "e3",
      icon: "alert",
      title: "ภาพถูกยืดผิดสัดส่วนหลัง resize",
      en: "ข้อผิดพลาดที่พบบ่อย 3",
      content: React.createElement("p", null, "\u0E40\u0E01\u0E34\u0E14\u0E08\u0E32\u0E01\u0E43\u0E2A\u0E48\u0E02\u0E19\u0E32\u0E14 (\u0E01\u0E27\u0E49\u0E32\u0E07, \u0E2A\u0E39\u0E07) \u0E17\u0E35\u0E48\u0E2A\u0E31\u0E14\u0E2A\u0E48\u0E27\u0E19\u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E20\u0E32\u0E1E\u0E40\u0E14\u0E34\u0E21 \u0E2B\u0E23\u0E37\u0E2D\u0E2A\u0E25\u0E31\u0E1A\u0E40\u0E1B\u0E47\u0E19 (\u0E2A\u0E39\u0E07, \u0E01\u0E27\u0E49\u0E32\u0E07) \u0E43\u0E0A\u0E49 ", React.createElement("span", {
        className: "mono"
      }, "fx"), ", ", React.createElement("span", {
        className: "mono"
      }, "fy"), " \u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E19\u0E16\u0E49\u0E32\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E23\u0E31\u0E01\u0E29\u0E32\u0E2A\u0E31\u0E14\u0E2A\u0E48\u0E27\u0E19")
    }]
  }));
}
function U2Lesson4() {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "prose"
  }, React.createElement("p", null, React.createElement("b", null, "\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E21\u0E27\u0E25\u0E1C\u0E25\u0E20\u0E32\u0E1E (Image Processing)"), " \u0E04\u0E37\u0E2D\u0E01\u0E32\u0E23\u0E19\u0E33\u0E04\u0E48\u0E32\u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25\u0E21\u0E32\u0E04\u0E33\u0E19\u0E27\u0E13\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E20\u0E32\u0E1E \u0E40\u0E0A\u0E48\u0E19 \u0E15\u0E31\u0E14 \u0E22\u0E48\u0E2D \u0E2B\u0E21\u0E38\u0E19 \u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E2A\u0E35 \u0E2B\u0E23\u0E37\u0E2D\u0E25\u0E14\u0E2A\u0E31\u0E0D\u0E0D\u0E32\u0E13\u0E23\u0E1A\u0E01\u0E27\u0E19 \u0E21\u0E31\u0E01\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E31\u0E49\u0E19 \"\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21\u0E20\u0E32\u0E1E\" \u0E01\u0E48\u0E2D\u0E19\u0E2A\u0E48\u0E07\u0E43\u0E2B\u0E49\u0E42\u0E21\u0E40\u0E14\u0E25 AI \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E42\u0E21\u0E40\u0E14\u0E25\u0E2A\u0E48\u0E27\u0E19\u0E43\u0E2B\u0E0D\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E20\u0E32\u0E1E\u0E02\u0E19\u0E32\u0E14\u0E41\u0E25\u0E30\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14")), React.createElement("div", {
    className: "chips-grid"
  }, [["grid", "Crop", "ตัดเฉพาะบริเวณที่สนใจ ด้วย img[y1:y2, x1:x2]"], ["chart", "Resize", "ปรับจำนวนพิกเซล เช่น ย่อเป็น 224×224 ก่อนเข้าโมเดล"], ["refresh", "Flip", "กลับภาพ ใช้สร้างข้อมูลฝึกเพิ่ม (Data Augmentation)"], ["eye", "Grayscale", "ลดข้อมูลเหลือ 1 ช่อง เหมาะกับงานที่ไม่ต้องใช้สี"], ["sparkle", "Brightness", "บวก/ลบค่าทุกพิกเซล แก้ภาพมืดหรือสว่างเกิน"], ["cpu", "Blur", "เฉลี่ยค่ากับพิกเซลรอบข้าง ลดสัญญาณรบกวน"]].map(([ic, t, d]) => React.createElement("div", {
    className: "ex-card",
    key: t
  }, React.createElement(Icon, {
    name: ic,
    size: 18
  }), React.createElement("span", null, React.createElement("b", null, t), d)))), React.createElement(Callout, {
    tone: "info",
    icon: "check",
    title: "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E19\u0E35\u0E49\u0E04\u0E33\u0E19\u0E27\u0E13\u0E08\u0E23\u0E34\u0E07"
  }, "Playground \u0E43\u0E0A\u0E49 JavaScript \u0E41\u0E25\u0E30 Canvas API \u0E1B\u0E23\u0E30\u0E21\u0E27\u0E25\u0E1C\u0E25\u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25\u0E43\u0E19\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C \u0E14\u0E49\u0E27\u0E22\u0E2A\u0E39\u0E15\u0E23\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E31\u0E1A OpenCV \u0E1C\u0E25\u0E25\u0E31\u0E1E\u0E18\u0E4C\u0E08\u0E36\u0E07\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A\u0E42\u0E04\u0E49\u0E14\u0E17\u0E35\u0E48\u0E41\u0E2A\u0E14\u0E07\u0E14\u0E49\u0E32\u0E19\u0E25\u0E48\u0E32\u0E07 (\u0E04\u0E25\u0E32\u0E14\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 1 \u0E23\u0E30\u0E14\u0E31\u0E1A\u0E2A\u0E35\u0E08\u0E32\u0E01\u0E01\u0E32\u0E23\u0E1B\u0E31\u0E14\u0E40\u0E28\u0E29) \u0E08\u0E2D\u0E04\u0E2D\u0E21\u0E1E\u0E34\u0E27\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E08\u0E30\u0E40\u0E2B\u0E47\u0E19\u0E41\u0E1C\u0E07\u0E04\u0E27\u0E1A\u0E04\u0E38\u0E21\u0E01\u0E31\u0E1A\u0E20\u0E32\u0E1E\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E01\u0E31\u0E19\u0E44\u0E14\u0E49\u0E2A\u0E30\u0E14\u0E27\u0E01\u0E01\u0E27\u0E48\u0E32\u0E1A\u0E19\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D"), React.createElement(Playground, {
    initial: "cat"
  }));
}

function U2Lesson5() {
  const [th, setTh] = useState(0.5);
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "Object Detection \u0E41\u0E25\u0E30 Face Detection"), React.createElement("p", null, React.createElement("b", null, "\u0E01\u0E32\u0E23\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E27\u0E31\u0E15\u0E16\u0E38 (Object Detection)"), " \u0E04\u0E37\u0E2D\u0E01\u0E32\u0E23\u0E2B\u0E32\u0E27\u0E48\u0E32\u0E43\u0E19\u0E20\u0E32\u0E1E\u0E21\u0E35\u0E27\u0E31\u0E15\u0E16\u0E38\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E43\u0E14\u0E1A\u0E49\u0E32\u0E07 \u0E41\u0E25\u0E30\u0E41\u0E15\u0E48\u0E25\u0E30\u0E0A\u0E34\u0E49\u0E19\u0E2D\u0E22\u0E39\u0E48\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E43\u0E14 \u0E2A\u0E48\u0E27\u0E19 ", React.createElement("b", null, "\u0E01\u0E32\u0E23\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E43\u0E1A\u0E2B\u0E19\u0E49\u0E32 (Face Detection)"), " \u0E04\u0E37\u0E2D\u0E01\u0E32\u0E23\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E27\u0E31\u0E15\u0E16\u0E38\u0E41\u0E1A\u0E1A\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E17\u0E35\u0E48\u0E2B\u0E32\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E02\u0E2D\u0E07\u0E43\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E21\u0E19\u0E38\u0E29\u0E22\u0E4C"), React.createElement("h3", {
    className: "sub"
  }, "Bounding Box"), React.createElement("p", null, "\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E41\u0E15\u0E48\u0E25\u0E30\u0E0A\u0E34\u0E49\u0E19\u0E41\u0E2A\u0E14\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E01\u0E23\u0E2D\u0E1A\u0E2A\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21 \u0E40\u0E01\u0E47\u0E1A\u0E44\u0E14\u0E49 2 \u0E41\u0E1A\u0E1A \u0E04\u0E37\u0E2D ", React.createElement("span", {
    className: "mono"
  }, "[x, y, w, h]"), " (\u0E21\u0E38\u0E21\u0E1A\u0E19\u0E0B\u0E49\u0E32\u0E22 \u0E01\u0E27\u0E49\u0E32\u0E07 \u0E2A\u0E39\u0E07) \u0E0B\u0E36\u0E48\u0E07 COCO-SSD \u0E43\u0E0A\u0E49 \u0E2B\u0E23\u0E37\u0E2D ", React.createElement("span", {
    className: "mono"
  }, "[x1, y1, x2, y2]"), " (\u0E21\u0E38\u0E21\u0E1A\u0E19\u0E0B\u0E49\u0E32\u0E22\u0E41\u0E25\u0E30\u0E21\u0E38\u0E21\u0E25\u0E48\u0E32\u0E07\u0E02\u0E27\u0E32) \u0E15\u0E49\u0E2D\u0E07\u0E2D\u0E48\u0E32\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E02\u0E2D\u0E07\u0E42\u0E21\u0E40\u0E14\u0E25\u0E43\u0E2B\u0E49\u0E14\u0E35\u0E27\u0E48\u0E32\u0E43\u0E0A\u0E49\u0E41\u0E1A\u0E1A\u0E44\u0E2B\u0E19"), React.createElement("h3", {
    className: "sub"
  }, "Confidence Score \u0E41\u0E25\u0E30 Threshold"), React.createElement("p", null, React.createElement("b", null, "Confidence Score"), " \u0E04\u0E37\u0E2D\u0E04\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E21\u0E31\u0E48\u0E19\u0E43\u0E08\u0E02\u0E2D\u0E07\u0E42\u0E21\u0E40\u0E14\u0E25 (0\u20131 \u0E2B\u0E23\u0E37\u0E2D 0\u2013100%) \u0E27\u0E48\u0E32\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E1E\u0E1A\u0E40\u0E1B\u0E47\u0E19\u0E27\u0E31\u0E15\u0E16\u0E38\u0E19\u0E31\u0E49\u0E19\u0E08\u0E23\u0E34\u0E07 \u0E40\u0E23\u0E32\u0E15\u0E31\u0E49\u0E07 ", React.createElement("b", null, "Threshold"), " \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E15\u0E31\u0E14\u0E1C\u0E25\u0E17\u0E35\u0E48\u0E21\u0E31\u0E48\u0E19\u0E43\u0E08\u0E19\u0E49\u0E2D\u0E22\u0E2D\u0E2D\u0E01 \u0E25\u0E2D\u0E07\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E14\u0E39\u0E1C\u0E25\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E14\u0E49\u0E32\u0E19\u0E25\u0E48\u0E32\u0E07")), React.createElement("div", {
    className: "q-card th-demo"
  }, React.createElement("div", {
    className: "ctl"
  }, React.createElement("label", {
    htmlFor: "l5th"
  }, "Threshold"), React.createElement("input", {
    id: "l5th",
    type: "range",
    min: "0.1",
    max: "0.9",
    step: "0.05",
    value: th,
    onChange: e => setTh(+e.target.value)
  }), React.createElement("output", {
    className: "mono"
  }, Math.round(th * 100), "%")), React.createElement("div", {
    className: "th-list"
  }, TH_DEMO.map(d => React.createElement("div", {
    key: d.c,
    className: d.s >= th ? "on" : ""
  }, React.createElement("span", {
    className: "mono"
  }, d.c), React.createElement("span", {
    className: "bar"
  }, React.createElement("span", {
    style: {
      width: d.s * 100 + "%"
    }
  })), React.createElement("b", {
    className: "mono"
  }, Math.round(d.s * 100), "%"), React.createElement("span", {
    className: "hint"
  }, d.s >= th ? "แสดง" : "ตัดออก")))), React.createElement("span", {
    className: "hint"
  }, "\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E01\u0E2D\u0E1A \xB7 Threshold \u0E2A\u0E39\u0E07 = \u0E1C\u0E25\u0E1C\u0E34\u0E14\u0E19\u0E49\u0E2D\u0E22\u0E25\u0E07 \u0E41\u0E15\u0E48\u0E2D\u0E32\u0E08\u0E1E\u0E25\u0E32\u0E14\u0E27\u0E31\u0E15\u0E16\u0E38\u0E08\u0E23\u0E34\u0E07 \xB7 Threshold \u0E15\u0E48\u0E33 = \u0E40\u0E08\u0E2D\u0E21\u0E32\u0E01\u0E02\u0E36\u0E49\u0E19 \u0E41\u0E15\u0E48\u0E21\u0E35\u0E1C\u0E25\u0E1C\u0E34\u0E14\u0E21\u0E32\u0E01\u0E02\u0E36\u0E49\u0E19")), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A \u2260 \u0E23\u0E30\u0E1A\u0E38\u0E15\u0E31\u0E27\u0E1A\u0E38\u0E04\u0E04\u0E25")), React.createElement("div", {
    className: "table-wrap"
  }, React.createElement("table", {
    className: "hist"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, React.createElement("span", {
    className: "sr-only"
  }, "\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D")), React.createElement("th", null, "\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E43\u0E1A\u0E2B\u0E19\u0E49\u0E32 (Face Detection)"), React.createElement("th", null, "\u0E08\u0E14\u0E08\u0E33/\u0E23\u0E30\u0E1A\u0E38\u0E15\u0E31\u0E27\u0E1A\u0E38\u0E04\u0E04\u0E25 (Face Recognition)"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, "\u0E15\u0E2D\u0E1A\u0E04\u0E33\u0E16\u0E32\u0E21"), React.createElement("td", null, "\u0E21\u0E35\u0E43\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E44\u0E2B\u0E21 \u0E2D\u0E22\u0E39\u0E48\u0E15\u0E23\u0E07\u0E44\u0E2B\u0E19"), React.createElement("td", null, "\u0E43\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E2D\u0E07\u0E43\u0E04\u0E23")), React.createElement("tr", null, React.createElement("td", null, "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E1A\u0E2B\u0E19\u0E49\u0E32"), React.createElement("td", null, "\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07"), React.createElement("td", null, "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E1B\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A")), React.createElement("tr", null, React.createElement("td", null, "\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07"), React.createElement("td", null, "\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E42\u0E1F\u0E01\u0E31\u0E2A\u0E43\u0E1A\u0E2B\u0E19\u0E49\u0E32 \u0E40\u0E1A\u0E25\u0E2D\u0E2B\u0E19\u0E49\u0E32\u0E04\u0E19\u0E43\u0E19\u0E20\u0E32\u0E1E"), React.createElement("td", null, "\u0E1B\u0E25\u0E14\u0E25\u0E47\u0E2D\u0E01\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C \u0E23\u0E30\u0E1A\u0E1A\u0E25\u0E07\u0E40\u0E27\u0E25\u0E32\u0E14\u0E49\u0E27\u0E22\u0E43\u0E1A\u0E2B\u0E19\u0E49\u0E32")), React.createElement("tr", null, React.createElement("td", null, "\u0E04\u0E27\u0E32\u0E21\u0E40\u0E2A\u0E35\u0E48\u0E22\u0E07\u0E14\u0E49\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25"), React.createElement("td", null, "\u0E15\u0E48\u0E33\u0E01\u0E27\u0E48\u0E32"), React.createElement("td", null, "\u0E2A\u0E39\u0E07 \u0E40\u0E1E\u0E23\u0E32\u0E30\u0E43\u0E0A\u0E49\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E0A\u0E35\u0E27\u0E20\u0E32\u0E1E \u0E0B\u0E36\u0E48\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2D\u0E48\u0E2D\u0E19\u0E44\u0E2B\u0E27\u0E15\u0E32\u0E21 PDPA (\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E01\u0E31\u0E1A\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E17\u0E35\u0E48 1)"))))), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "\u0E04\u0E27\u0E32\u0E21\u0E41\u0E21\u0E48\u0E19\u0E22\u0E33\u0E41\u0E25\u0E30\u0E02\u0E49\u0E2D\u0E08\u0E33\u0E01\u0E31\u0E14")), React.createElement("div", {
    className: "two-col"
  }, React.createElement("div", {
    className: "list-card bad"
  }, React.createElement("h4", null, React.createElement(Icon, {
    name: "alert",
    size: 18
  }), "\u0E2A\u0E32\u0E40\u0E2B\u0E15\u0E38\u0E17\u0E35\u0E48\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E1C\u0E34\u0E14"), React.createElement("ul", null, React.createElement("li", null, "\u0E41\u0E2A\u0E07\u0E19\u0E49\u0E2D\u0E22\u0E2B\u0E23\u0E37\u0E2D\u0E22\u0E49\u0E2D\u0E19\u0E41\u0E2A\u0E07 \u0E21\u0E38\u0E21\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E41\u0E1B\u0E25\u0E01 \u0E27\u0E31\u0E15\u0E16\u0E38\u0E16\u0E39\u0E01\u0E1A\u0E31\u0E07\u0E1A\u0E32\u0E07\u0E2A\u0E48\u0E27\u0E19"), React.createElement("li", null, "\u0E27\u0E31\u0E15\u0E16\u0E38\u0E40\u0E25\u0E47\u0E01\u0E21\u0E32\u0E01\u0E2B\u0E23\u0E37\u0E2D\u0E20\u0E32\u0E1E\u0E40\u0E1A\u0E25\u0E2D"), React.createElement("li", null, React.createElement("b", null, "\u0E27\u0E31\u0E15\u0E16\u0E38\u0E44\u0E21\u0E48\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E17\u0E35\u0E48\u0E42\u0E21\u0E40\u0E14\u0E25\u0E40\u0E04\u0E22\u0E40\u0E23\u0E35\u0E22\u0E19"), " \u0E40\u0E0A\u0E48\u0E19 COCO-SSD \u0E23\u0E39\u0E49\u0E08\u0E31\u0E01\u0E40\u0E1E\u0E35\u0E22\u0E07 80 \u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17"), React.createElement("li", null, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1D\u0E36\u0E01\u0E44\u0E21\u0E48\u0E2B\u0E25\u0E32\u0E01\u0E2B\u0E25\u0E32\u0E22 \u0E17\u0E33\u0E43\u0E2B\u0E49\u0E41\u0E21\u0E48\u0E19\u0E22\u0E33\u0E01\u0E31\u0E1A\u0E1A\u0E32\u0E07\u0E01\u0E25\u0E38\u0E48\u0E21\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32 (Data Bias)"))), React.createElement("div", {
    className: "list-card good"
  }, React.createElement("h4", null, React.createElement(Icon, {
    name: "check",
    size: 18
  }), "\u0E43\u0E0A\u0E49\u0E1C\u0E25\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E23\u0E31\u0E1A\u0E1C\u0E34\u0E14\u0E0A\u0E2D\u0E1A"), React.createElement("ul", null, React.createElement("li", null, "\u0E14\u0E39 Confidence \u0E17\u0E38\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07 \u0E2D\u0E22\u0E48\u0E32\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E25\u0E17\u0E35\u0E48\u0E21\u0E31\u0E48\u0E19\u0E43\u0E08\u0E15\u0E48\u0E33"), React.createElement("li", null, "\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E01\u0E31\u0E1A\u0E20\u0E32\u0E1E\u0E2B\u0E25\u0E32\u0E22\u0E2A\u0E20\u0E32\u0E1E\u0E01\u0E48\u0E2D\u0E19\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E08\u0E23\u0E34\u0E07"), React.createElement("li", null, "\u0E07\u0E32\u0E19\u0E17\u0E35\u0E48\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E04\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E21\u0E19\u0E38\u0E29\u0E22\u0E4C\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A (Human Oversight)"), React.createElement("li", null, "\u0E41\u0E08\u0E49\u0E07\u0E41\u0E25\u0E30\u0E02\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E22\u0E34\u0E19\u0E22\u0E2D\u0E21\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E43\u0E0A\u0E49\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E01\u0E31\u0E1A\u0E1A\u0E38\u0E04\u0E04\u0E25")))), React.createElement(Callout, {
    tone: "info",
    icon: "eye",
    title: "\u0E17\u0E33\u0E44\u0E21\u0E2B\u0E49\u0E2D\u0E07\u0E41\u0E25\u0E47\u0E1A\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E43\u0E0A\u0E49\u0E01\u0E25\u0E49\u0E2D\u0E07"
  }, "\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A\u0E19\u0E35\u0E49\u0E17\u0E33\u0E07\u0E32\u0E19\u0E43\u0E19\u0E01\u0E23\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E1B\u0E25\u0E2D\u0E14\u0E20\u0E31\u0E22\u0E02\u0E2D\u0E07\u0E41\u0E1E\u0E25\u0E15\u0E1F\u0E2D\u0E23\u0E4C\u0E21 \u0E0B\u0E36\u0E48\u0E07\u0E44\u0E21\u0E48\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E43\u0E2B\u0E49\u0E40\u0E02\u0E49\u0E32\u0E16\u0E36\u0E07\u0E01\u0E25\u0E49\u0E2D\u0E07 \u0E41\u0E25\u0E30\u0E0A\u0E48\u0E27\u0E22\u0E25\u0E14\u0E01\u0E32\u0E23\u0E40\u0E01\u0E47\u0E1A\u0E20\u0E32\u0E1E\u0E1A\u0E38\u0E04\u0E04\u0E25\u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E15\u0E31\u0E49\u0E07\u0E43\u0E08 \u0E08\u0E36\u0E07\u0E43\u0E0A\u0E49\u0E20\u0E32\u0E1E\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E2B\u0E23\u0E37\u0E2D\u0E20\u0E32\u0E1E\u0E17\u0E35\u0E48\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E41\u0E17\u0E19 \u0E16\u0E49\u0E32\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E01\u0E31\u0E1A\u0E01\u0E25\u0E49\u0E2D\u0E07 \u0E43\u0E0A\u0E49\u0E42\u0E04\u0E49\u0E14 Python ", React.createElement("span", {
    className: "mono"
  }, "cv2.VideoCapture(0)"), " \u0E1A\u0E19\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E15\u0E31\u0E27\u0E40\u0E2D\u0E07\u0E44\u0E14\u0E49"), React.createElement("div", {
    className: "prose"
  }, React.createElement("h3", {
    className: "sub"
  }, "Detection Lab: \u0E25\u0E2D\u0E07\u0E42\u0E21\u0E40\u0E14\u0E25\u0E08\u0E23\u0E34\u0E07"), React.createElement("p", null, "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E19\u0E35\u0E49\u0E43\u0E0A\u0E49\u0E42\u0E21\u0E40\u0E14\u0E25 COCO-SSD \u0E17\u0E35\u0E48\u0E1D\u0E36\u0E01\u0E21\u0E32\u0E41\u0E25\u0E49\u0E27\u0E08\u0E23\u0E34\u0E07 \u0E17\u0E33\u0E07\u0E32\u0E19\u0E43\u0E19\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E01\u0E32\u0E23\u0E2A\u0E38\u0E48\u0E21\u0E01\u0E23\u0E2D\u0E1A")), React.createElement(DetectionLab, null));
}
function Lab21() {
  const [seen, setSeen] = useState([]);
  const [found, setFound] = useState(null);
  const [shape, setShape] = useState({
    h: "",
    w: "",
    c: ""
  });
  const [shapeOk, setShapeOk] = useState(null);
  const onInspect = p => {
    if (p.source !== "robot") return;
    const k = p.x + "," + p.y;
    setSeen(s => s.includes(k) ? s : [...s, k]);
    if (p.r === 0 && p.g === 229 && p.b === 255) setFound(p);
  };
  const checkShape = () => setShapeOk(+shape.h === 16 && +shape.w === 16 && +shape.c === 3);
  return React.createElement(LabShell, {
    unitId: "unit2",
    labId: "u2-a1",
    objective: "\u0E23\u0E30\u0E1A\u0E38\u0E1E\u0E34\u0E01\u0E31\u0E14\u0E41\u0E25\u0E30\u0E04\u0E48\u0E32\u0E2A\u0E35\u0E02\u0E2D\u0E07\u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25 \u0E41\u0E25\u0E30\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22 shape \u0E02\u0E2D\u0E07\u0E20\u0E32\u0E1E\u0E43\u0E19\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A NumPy \u0E44\u0E14\u0E49",
    steps: [{
      id: "s1",
      text: "เลือกภาพ \"AIra พิกเซลอาร์ต 16×16\" แล้วคลิกดูพิกเซลที่ต่างกันอย่างน้อย 5 จุด",
      done: seen.length >= 5,
      status: `ดูแล้ว ${Math.min(seen.length, 5)}/5 จุด`
    }, {
      id: "s2",
      text: "หาพิกเซลสีฟ้านีออน RGB(0, 229, 255) ในดวงตาของหุ่นยนต์",
      done: !!found,
      status: found ? `พบที่ x = ${found.x}, y = ${found.y} → ใน OpenCV คือ img[${found.y}, ${found.x}]` : "ยังไม่พบ"
    }, {
      id: "s3",
      text: "กรอก shape ของภาพนี้ในรูปแบบ NumPy (สูง, กว้าง, ช่องสี) แล้วกดตรวจ",
      done: shapeOk === true
    }],
    question: {
      q: "ถ้าต้องการค่าสีของพิกเซลที่ x = 5, y = 2 ในภาพที่อ่านด้วย OpenCV ต้องเขียนอย่างไร",
      options: [{
        id: "a",
        text: "img[5, 2]"
      }, {
        id: "b",
        text: "img[2, 5]"
      }, {
        id: "c",
        text: "img(5, 2)"
      }, {
        id: "d",
        text: "img[x=5][y=2]"
      }],
      answer: "b",
      explain: "อาร์เรย์ภาพเข้าถึงด้วย [แถว, คอลัมน์] = [y, x] จึงเป็น img[2, 5] และค่าที่ได้เรียงเป็น [B G R]",
      hint: "นึกถึง shape (สูง, กว้าง, ช่องสี) ตัวแรกคือแถว (y)"
    }
  }, React.createElement(PixelExplorer, {
    initial: "robot",
    onInspect: onInspect,
    allow: ["robot", "cat", "coffee"],
    upload: false
  }), React.createElement("div", {
    className: "q-card shape-q"
  }, React.createElement("strong", null, "shape \u0E02\u0E2D\u0E07\u0E20\u0E32\u0E1E\u0E2B\u0E38\u0E48\u0E19\u0E22\u0E19\u0E15\u0E4C"), React.createElement("div", {
    className: "shape-in"
  }, React.createElement("span", {
    className: "mono"
  }, "("), [["h", "สูง"], ["w", "กว้าง"], ["c", "ช่องสี"]].map(([k, l], i) => React.createElement(React.Fragment, {
    key: k
  }, React.createElement("input", {
    className: "input mono num",
    inputMode: "numeric",
    "aria-label": l,
    placeholder: l,
    value: shape[k],
    onChange: e => {
      setShape(s => ({
        ...s,
        [k]: e.target.value.replace(/\D/g, "")
      }));
      setShapeOk(null);
    }
  }), i < 2 && React.createElement("span", {
    className: "mono"
  }, ","))), React.createElement("span", {
    className: "mono"
  }, ")"), React.createElement(Button, {
    size: "sm",
    icon: "check",
    onClick: checkShape,
    disabled: !shape.h || !shape.w || !shape.c
  }, "\u0E15\u0E23\u0E27\u0E08")), shapeOk === true && React.createElement(Feedback, {
    tone: "good",
    title: "\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 (16, 16, 3)"
  }, "\u0E2A\u0E39\u0E07 16 \u0E01\u0E27\u0E49\u0E32\u0E07 16 \u0E41\u0E25\u0E30\u0E21\u0E35 3 \u0E0A\u0E48\u0E2D\u0E07\u0E2A\u0E35 \u0E23\u0E27\u0E21 16 \xD7 16 \xD7 3 = 768 \u0E04\u0E48\u0E32"), shapeOk === false && React.createElement(Feedback, {
    tone: "bad",
    title: "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01"
  }, "\u0E14\u0E39\u0E02\u0E19\u0E32\u0E14\u0E17\u0E35\u0E48\u0E21\u0E38\u0E21\u0E02\u0E27\u0E32\u0E1A\u0E19\u0E02\u0E2D\u0E07 Pixel Explorer \u0E41\u0E25\u0E30\u0E08\u0E33\u0E27\u0E48\u0E32\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E04\u0E37\u0E2D (\u0E2A\u0E39\u0E07, \u0E01\u0E27\u0E49\u0E32\u0E07, \u0E0A\u0E48\u0E2D\u0E07\u0E2A\u0E35)")));
}

function Lab22() {
  const [idx, setIdx] = useState(0);
  const [mix, setMix] = useState([128, 128, 128]);
  const [solved, setSolved] = useState([]);
  const [hint, setHint] = useState(0);
  const t = COLOR_TARGETS[idx];
  const dist = Math.round(colorDist(mix, t.rgb));
  const close = dist <= 40;
  const submit = () => {
    if (close && !solved.includes(idx)) setSolved(s => [...s, idx]);
  };
  const go = i => {
    setIdx(i);
    setMix([128, 128, 128]);
    setHint(0);
  };
  return React.createElement(LabShell, {
    unitId: "unit2",
    labId: "u2-a2",
    objective: "\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E01\u0E32\u0E23\u0E1C\u0E2A\u0E21\u0E2A\u0E35\u0E41\u0E1A\u0E1A RGB \u0E41\u0E25\u0E30\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13\u0E04\u0E48\u0E32 R, G, B \u0E02\u0E2D\u0E07\u0E2A\u0E35\u0E08\u0E32\u0E01\u0E01\u0E32\u0E23\u0E2A\u0E31\u0E07\u0E40\u0E01\u0E15\u0E44\u0E14\u0E49",
    steps: COLOR_TARGETS.map((c, i) => ({
      id: "c" + i,
      text: `ผสมสีให้ใกล้ "${c.name}" (ระยะห่างสีไม่เกิน 40)`,
      done: solved.includes(i)
    })),
    question: {
      q: "พิกเซลหนึ่งมีค่า RGB(100, 150, 200) เมื่อแปลงเป็นระดับเทาด้วยสูตรของ OpenCV จะได้ค่าประมาณเท่าใด",
      options: [{
        id: "a",
        text: "150"
      }, {
        id: "b",
        text: "450"
      }, {
        id: "c",
        text: "141"
      }, {
        id: "d",
        text: "200"
      }],
      answer: "c",
      explain: "0.299×100 + 0.587×150 + 0.114×200 = 29.9 + 88.05 + 22.8 = 140.75 ≈ 141 ไม่ใช่ค่าเฉลี่ยธรรมดา (150) เพราะแต่ละสีมีน้ำหนักต่างกัน",
      hint: "ใช้สูตร Y = 0.299R + 0.587G + 0.114B"
    }
  }, React.createElement("div", {
    className: "lab-tool"
  }, React.createElement("div", {
    className: "panel-head"
  }, React.createElement("span", {
    className: "panel-title"
  }, React.createElement(Icon, {
    name: "target",
    size: 16
  }), "RGB Color Detective"), React.createElement("span", {
    className: "mono hint"
  }, "\u0E40\u0E1B\u0E49\u0E32\u0E2B\u0E21\u0E32\u0E22 ", idx + 1, "/", COLOR_TARGETS.length)), React.createElement("div", {
    className: "case-steps",
    role: "tablist",
    "aria-label": "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2A\u0E35\u0E40\u0E1B\u0E49\u0E32\u0E2B\u0E21\u0E32\u0E22"
  }, COLOR_TARGETS.map((c, i) => React.createElement("button", {
    key: i,
    type: "button",
    role: "tab",
    "aria-selected": i === idx,
    className: solved.includes(i) ? "done" : "",
    onClick: () => go(i)
  }, solved.includes(i) ? React.createElement(Icon, {
    name: "check",
    size: 14
  }) : i + 1))), React.createElement("div", {
    className: "detective"
  }, React.createElement("div", {
    className: "target-sw"
  }, React.createElement("span", {
    className: "hint"
  }, "\u0E2A\u0E35\u0E40\u0E1B\u0E49\u0E32\u0E2B\u0E21\u0E32\u0E22"), React.createElement("span", {
    className: "mix-swatch",
    style: {
      background: `rgb(${t.rgb.join(",")})`
    },
    role: "img",
    "aria-label": `สีเป้าหมาย ${t.name}`
  }), React.createElement("b", null, t.name), hint > 0 && React.createElement("span", {
    className: "mono hint"
  }, ["R", "G", "B"].slice(0, hint).map((c, i) => `${c}=${t.rgb[i]}`).join(" · "))), React.createElement(ColorMixer, {
    value: mix,
    onChange: setMix,
    idp: "lab22" + idx
  })), React.createElement("div", {
    className: "meter",
    "aria-live": "polite"
  }, React.createElement("span", null, "\u0E23\u0E30\u0E22\u0E30\u0E2B\u0E48\u0E32\u0E07\u0E08\u0E32\u0E01\u0E2A\u0E35\u0E40\u0E1B\u0E49\u0E32\u0E2B\u0E21\u0E32\u0E22"), React.createElement("span", {
    className: "bar"
  }, React.createElement("span", {
    style: {
      width: Math.max(4, 100 - Math.min(100, dist / 2.2)) + "%",
      background: close ? "var(--ok)" : "var(--grad)"
    }
  })), React.createElement("b", {
    className: "mono"
  }, dist)), React.createElement("div", {
    className: "btn-inline"
  }, React.createElement(Button, {
    icon: "check",
    disabled: !close || solved.includes(idx),
    onClick: submit
  }, solved.includes(idx) ? "สำเร็จแล้ว" : close ? "ส่งสีนี้" : "ยังห่างเกินไป"), React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "info",
    disabled: hint >= 3,
    onClick: () => setHint(h => h + 1)
  }, "\u0E02\u0E2D\u0E04\u0E33\u0E43\u0E1A\u0E49 (", 3 - hint, ")"), solved.includes(idx) && idx < COLOR_TARGETS.length - 1 && React.createElement(Button, {
    variant: "ghost",
    iconRight: "chevR",
    onClick: () => go(idx + 1)
  }, "\u0E2A\u0E35\u0E16\u0E31\u0E14\u0E44\u0E1B")), solved.includes(idx) && React.createElement(Feedback, {
    tone: "good",
    title: `สีจริงคือ RGB(${t.rgb.join(", ")})`
  }, "\u0E40\u0E18\u0E2D\u0E1C\u0E2A\u0E21\u0E44\u0E14\u0E49 RGB(", mix.join(", "), ") \u0E23\u0E30\u0E22\u0E30\u0E2B\u0E48\u0E32\u0E07 ", dist, " \u0E23\u0E30\u0E22\u0E30\u0E2B\u0E48\u0E32\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E08\u0E32\u0E01 \u221A((\u0394R)\xB2 + (\u0394G)\xB2 + (\u0394B)\xB2)")));
}
function Lab23() {
  const [p, setP] = useState(DEFAULT_PARAMS);
  const [info, setInfo] = useState(null);
  const [checked, setChecked] = useState(false);
  const onChange = useCallback((params, out, src) => setInfo({
    ow: out.width,
    oh: out.height,
    sw: src.width,
    sh: src.height
  }), []);
  const extras = p.cx || p.cy || p.cw !== 100 || p.ch !== 100 || p.beta || p.blur > 1;
  const ok = {
    s: p.scale === 50,
    f: p.flipH && !p.flipV,
    g: p.gray,
    x: !extras
  };
  const all = ok.s && ok.f && ok.g && ok.x;
  return React.createElement(LabShell, {
    unitId: "unit2",
    labId: "u2-a3",
    objective: "\u0E43\u0E0A\u0E49\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14 \u0E01\u0E25\u0E31\u0E1A\u0E20\u0E32\u0E1E \u0E41\u0E25\u0E30\u0E41\u0E1B\u0E25\u0E07\u0E2A\u0E35 \u0E15\u0E32\u0E21\u0E02\u0E49\u0E2D\u0E01\u0E33\u0E2B\u0E19\u0E14 \u0E41\u0E25\u0E30\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E42\u0E22\u0E07\u0E01\u0E31\u0E1A\u0E04\u0E33\u0E2A\u0E31\u0E48\u0E07 OpenCV \u0E44\u0E14\u0E49",
    steps: [{
      id: "s",
      text: "ย่อภาพแมวเหลือครึ่งหนึ่ง (50%)",
      done: checked && ok.s
    }, {
      id: "f",
      text: "กลับภาพซ้าย-ขวาเหมือนมองกระจก (แนวนอนเท่านั้น)",
      done: checked && ok.f
    }, {
      id: "g",
      text: "แปลงเป็นภาพระดับเทา",
      done: checked && ok.g
    }, {
      id: "x",
      text: "ไม่ใช้เครื่องมืออื่นนอกจากที่โจทย์สั่ง แล้วกด \"ตรวจผลลัพธ์\"",
      done: checked && all,
      status: checked && !ok.x ? "ยังมีการ Crop ปรับความสว่าง หรือเบลออยู่ ลองกด Reset แล้วทำใหม่" : ""
    }],
    question: {
      q: "โค้ดชุดใดให้ผลแบบเดียวกับโจทย์ Lab นี้",
      options: [{
        id: "a",
        text: "cv2.resize(img, None, fx=0.5, fy=0.5) → cv2.flip(img, 0) → cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)"
      }, {
        id: "b",
        text: "cv2.resize(img, None, fx=0.5, fy=0.5) → cv2.flip(img, 1) → cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)"
      }, {
        id: "c",
        text: "cv2.resize(img, None, fx=2, fy=2) → cv2.flip(img, 1) → cv2.cvtColor(img, cv2.COLOR_BGR2RGB)"
      }, {
        id: "d",
        text: "cv2.flip(img, -1) → cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)"
      }],
      answer: "b",
      explain: "fx=fy=0.5 ย่อครึ่ง, flip รหัส 1 กลับซ้าย-ขวา และ COLOR_BGR2GRAY แปลงเป็นระดับเทา",
      hint: "รหัส 0 ของ cv2.flip คือกลับบน-ล่าง ส่วน COLOR_BGR2RGB แค่สลับลำดับสี"
    }
  }, React.createElement(Playground, {
    fixed: "cat",
    params: p,
    setParams: f => {
      setP(f);
      setChecked(false);
    },
    onChange: onChange,
    upload: false
  }), React.createElement("div", {
    className: "q-card"
  }, React.createElement("div", {
    className: "btn-inline"
  }, React.createElement(Button, {
    icon: "check",
    className: "btn-glow",
    onClick: () => setChecked(true)
  }, "\u0E15\u0E23\u0E27\u0E08\u0E1C\u0E25\u0E25\u0E31\u0E1E\u0E18\u0E4C"), info && React.createElement("span", {
    className: "mono hint"
  }, "\u0E15\u0E49\u0E19\u0E09\u0E1A\u0E31\u0E1A ", info.sw, "\xD7", info.sh, " \u2192 \u0E1C\u0E25\u0E25\u0E31\u0E1E\u0E18\u0E4C ", info.ow, "\xD7", info.oh)), checked && (all ? React.createElement(Feedback, {
    tone: "good",
    title: "\u0E1C\u0E25\u0E25\u0E31\u0E1E\u0E18\u0E4C\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E15\u0E32\u0E21\u0E42\u0E08\u0E17\u0E22\u0E4C"
  }, "\u0E20\u0E32\u0E1E\u0E40\u0E2B\u0E25\u0E37\u0E2D ", info && `${info.ow}×${info.oh}`, " \u0E1E\u0E34\u0E01\u0E40\u0E0B\u0E25 \u0E01\u0E25\u0E31\u0E1A\u0E0B\u0E49\u0E32\u0E22-\u0E02\u0E27\u0E32 \u0E41\u0E25\u0E30\u0E40\u0E1B\u0E47\u0E19\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E40\u0E17\u0E32") : React.createElement(Feedback, {
    tone: "bad",
    title: "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E42\u0E08\u0E17\u0E22\u0E4C"
  }, [!ok.s && "ขนาดยังไม่ใช่ 50%", !ok.f && "การกลับภาพยังไม่ใช่แนวนอนอย่างเดียว", !ok.g && "ยังไม่ได้แปลงเป็นระดับเทา", !ok.x && "มีการปรับอย่างอื่นเกินโจทย์"].filter(Boolean).join(" · ")))));
}

function Lab24() {
  const [p, setP] = useState(DEFAULT_PARAMS);
  const [target, setTarget] = useState(null);
  const [cur, setCur] = useState(null);
  const [hints, setHints] = useState(0);
  const [best, setBest] = useState(null);
  useEffect(() => {
    loadSample("coffee", 900).then(r => setTarget(runPipeline(r.img, U24_RECIPE))).catch(() => {});
  }, []);
  const onChange = useCallback((params, out) => setCur(out), []);
  const sizeOk = target && cur && cur.width === target.width && cur.height === target.height;
  const d = sizeOk ? IMG.diff(cur, target) : null;
  const match = d !== null && d <= 1.5;
  useEffect(() => {
    if (match) setBest(true);
  }, [match]);
  const HINTS = ["ภาพเป้าหมายถูกตัดให้เหลือกว้าง 50% สูง 60% เริ่มที่ x 25% และ y 10%", "ภาพเป้าหมายกลับหัว (บน-ล่าง) และไม่มีสี", "ภาพสว่างขึ้น +40 และเบลอด้วย 5×5"];
  return React.createElement(LabShell, {
    unitId: "unit2",
    labId: "u2-a4",
    objective: "\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E20\u0E32\u0E1E\u0E1C\u0E25\u0E25\u0E31\u0E1E\u0E18\u0E4C \u0E41\u0E25\u0E30\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E21\u0E27\u0E25\u0E1C\u0E25\u0E20\u0E32\u0E1E\u0E17\u0E35\u0E48\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E44\u0E14\u0E49\u0E20\u0E32\u0E1E\u0E15\u0E32\u0E21\u0E40\u0E1B\u0E49\u0E32\u0E2B\u0E21\u0E32\u0E22",
    steps: [{
      id: "size",
      text: "ทำให้ขนาดภาพของเธอเท่ากับภาพเป้าหมาย",
      done: !!sizeOk || !!best,
      status: target && cur ? `เป้าหมาย ${target.width}×${target.height} · ของเธอ ${cur.width}×${cur.height}` : ""
    }, {
      id: "match",
      text: "ทำให้ภาพเหมือนเป้าหมาย (ความต่างเฉลี่ยไม่เกิน 1.5 ระดับสี)",
      done: !!best,
      status: d !== null ? `ความต่างเฉลี่ยตอนนี้ ${d.toFixed(2)}` : "ยังเทียบไม่ได้จนกว่าขนาดจะเท่ากัน"
    }],
    question: {
      q: "ถ้าเปลี่ยนการเบลอจาก 5×5 เป็น 15×15 ภาพจะเปลี่ยนอย่างไร",
      options: [{
        id: "a",
        text: "คมชัดขึ้น เพราะใช้พิกเซลมากขึ้น"
      }, {
        id: "b",
        text: "ขนาดภาพใหญ่ขึ้น 3 เท่า"
      }, {
        id: "c",
        text: "เบลอมากขึ้น เพราะแต่ละพิกเซลเฉลี่ยกับพิกเซลรอบข้างในพื้นที่กว้างขึ้น"
      }, {
        id: "d",
        text: "สีเปลี่ยนเป็นขาวดำ"
      }],
      answer: "c",
      explain: "kernel 15×15 เฉลี่ย 225 พิกเซลรอบ ๆ รายละเอียดเล็ก ๆ จึงหายไปมากกว่า ขนาดภาพยังเท่าเดิม",
      hint: "Blur ไม่ได้เปลี่ยนขนาดภาพ ลองนึกว่ายิ่งเอาพิกเซลมาเฉลี่ยมาก ภาพจะเป็นอย่างไร"
    }
  }, React.createElement("div", {
    className: "q-card target-card"
  }, React.createElement("div", {
    className: "act-head"
  }, React.createElement("strong", null, "\u0E20\u0E32\u0E1E\u0E40\u0E1B\u0E49\u0E32\u0E2B\u0E21\u0E32\u0E22"), React.createElement("span", {
    className: "mono hint"
  }, target ? `${target.width}×${target.height}` : "กำลังสร้าง…")), React.createElement("div", {
    className: "target-row"
  }, target ? React.createElement(DataCanvas, {
    img: target,
    label: "\u0E20\u0E32\u0E1E\u0E40\u0E1B\u0E49\u0E32\u0E2B\u0E21\u0E32\u0E22"
  }) : React.createElement(ProcessingBadge, {
    text: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E20\u0E32\u0E1E\u0E40\u0E1B\u0E49\u0E32\u0E2B\u0E21\u0E32\u0E22"
  }), React.createElement("div", {
    style: {
      display: "grid",
      gap: 8,
      minWidth: 0,
      alignContent: "start"
    }
  }, React.createElement("p", {
    style: {
      fontSize: 14
    }
  }, "\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E08\u0E32\u0E01\u0E20\u0E32\u0E1E\u0E01\u0E32\u0E41\u0E1F\u0E14\u0E49\u0E27\u0E22 4 \u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E02\u0E36\u0E49\u0E19\u0E44\u0E1B \u0E43\u0E0A\u0E49\u0E41\u0E1C\u0E07\u0E04\u0E27\u0E1A\u0E04\u0E38\u0E21\u0E14\u0E49\u0E32\u0E19\u0E25\u0E48\u0E32\u0E07\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E20\u0E32\u0E1E\u0E02\u0E2D\u0E07\u0E40\u0E18\u0E2D\u0E40\u0E2B\u0E21\u0E37\u0E2D\u0E19\u0E40\u0E1B\u0E49\u0E32\u0E2B\u0E21\u0E32\u0E22"), React.createElement("div", {
    className: "sim " + (match ? "ok" : "")
  }, React.createElement("span", null, "\u0E04\u0E27\u0E32\u0E21\u0E15\u0E48\u0E32\u0E07\u0E40\u0E09\u0E25\u0E35\u0E48\u0E22"), React.createElement("b", {
    className: "mono"
  }, d === null ? "–" : d.toFixed(2))), HINTS.slice(0, hints).map((h, i) => React.createElement(Feedback, {
    key: i,
    tone: "mid",
    title: `คำใบ้ ${i + 1}`
  }, h)), hints < HINTS.length && React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "info",
    onClick: () => setHints(h => h + 1),
    style: {
      justifySelf: "start"
    }
  }, "\u0E02\u0E2D\u0E04\u0E33\u0E43\u0E1A\u0E49 (", HINTS.length - hints, ")")))), React.createElement(Playground, {
    fixed: "coffee",
    params: p,
    setParams: setP,
    onChange: onChange,
    upload: false
  }));
}
function Lab25() {
  const [runs, setRuns] = useState([]);
  const [thMoved, setThMoved] = useState(false);
  const onRun = r => setRuns(s => [...s, r]);
  const imgs = [...new Set(runs.map(r => r.source))];
  return React.createElement(LabShell, {
    unitId: "unit2",
    labId: "u2-a5",
    objective: "\u0E17\u0E14\u0E25\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E42\u0E21\u0E40\u0E14\u0E25\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E27\u0E31\u0E15\u0E16\u0E38\u0E08\u0E23\u0E34\u0E07 \u0E2D\u0E48\u0E32\u0E19\u0E1C\u0E25 Bounding Box \u0E01\u0E31\u0E1A Confidence Score \u0E41\u0E25\u0E30\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E02\u0E49\u0E2D\u0E08\u0E33\u0E01\u0E31\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E21\u0E40\u0E14\u0E25\u0E44\u0E14\u0E49",
    steps: [{
      id: "two",
      text: "กดโหลดโมเดล แล้วตรวจจับวัตถุในภาพอย่างน้อย 2 ภาพที่ต่างกัน",
      done: imgs.length >= 2,
      status: `ตรวจจับแล้ว ${imgs.length} ภาพ`
    }, {
      id: "rocket",
      text: "ตรวจจับภาพจรวด แล้วดูชื่อวัตถุและค่าความมั่นใจที่ได้",
      done: imgs.includes("rocket")
    }, {
      id: "th",
      text: "ปรับ Confidence threshold แล้วสังเกตว่าจำนวนกรอบที่แสดงเปลี่ยนไปอย่างไร",
      done: thMoved && runs.length > 0
    }],
    question: {
      q: "โมเดล COCO-SSD ตอบภาพจรวดว่าเป็น \"boat\" ด้วยความมั่นใจต่ำ (ราว 20–30%) ข้อใดอธิบายได้ดีที่สุด",
      options: [{
        id: "a",
        text: "โมเดลเสีย ต้องดาวน์โหลดใหม่"
      }, {
        id: "b",
        text: "จรวดไม่ได้อยู่ใน 80 ประเภทที่โมเดลเรียนรู้มา โมเดลจึงเลือกประเภทที่หน้าตาใกล้เคียงที่สุดแบบไม่มั่นใจ"
      }, {
        id: "c",
        text: "ภาพจรวดมีขนาดใหญ่เกินไป"
      }, {
        id: "d",
        text: "โมเดลเห็นว่าจรวดคือเรือจริง ๆ เพราะความมั่นใจมากกว่า 0"
      }],
      answer: "b",
      explain: "โมเดลตอบได้เฉพาะประเภทที่อยู่ในข้อมูลฝึก (COCO 80 ประเภท ไม่มีจรวด) ค่าความมั่นใจต่ำคือสัญญาณเตือน ถ้าตั้ง threshold 50% ผลนี้จะถูกตัดออก",
      hint: "นึกถึงข้อจำกัดเรื่องประเภทวัตถุที่โมเดลรู้จัก และความหมายของ Confidence ต่ำ"
    }
  }, React.createElement(DetectionLab, {
    onRun: onRun,
    onThreshold: () => setThMoved(true)
  }));
}

const U2_LESSON_BODY = {
  "u2-l1": U2Lesson1,
  "u2-l2": U2Lesson2,
  "u2-l3": U2Lesson3,
  "u2-l4": U2Lesson4,
  "u2-l5": U2Lesson5
};
const U2_LABS = {
  "u2-a1": Lab21,
  "u2-a2": Lab22,
  "u2-a3": Lab23,
  "u2-a4": Lab24,
  "u2-a5": Lab25
};
function VisionStage() {
  return React.createElement("div", {
    className: "vision-stage"
  }, React.createElement("div", {
    className: "vs-eye"
  }, React.createElement(UnitArt, {
    id: "unit2"
  })), React.createElement("span", {
    className: "vs-chip c1 mono"
  }, "RGB(0, 229, 255)"), React.createElement("span", {
    className: "vs-chip c2 mono"
  }, "shape (480, 640, 3)"), React.createElement("span", {
    className: "vs-chip c3 mono"
  }, "cat 93%"), React.createElement("div", {
    className: "vs-bot"
  }, React.createElement(AIraBot, {
    mood: "happy",
    title: "AIra \u0E1C\u0E39\u0E49\u0E0A\u0E48\u0E27\u0E22\u0E2B\u0E49\u0E2D\u0E07\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23"
  }), React.createElement("span", {
    className: "vs-badge"
  }, "AI LAB ASSISTANT")));
}
const U2_CFG = {
  unitId: "unit2",
  no: 2,
  en: "Computer Vision Fundamentals",
  eyebrow: "AI Vision Laboratory",
  titleNode: React.createElement(React.Fragment, null, "\u0E1E\u0E37\u0E49\u0E19\u0E10\u0E32\u0E19", React.createElement("span", {
    className: "grad-text"
  }, "\u0E04\u0E2D\u0E21\u0E1E\u0E34\u0E27\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E27\u0E34\u0E17\u0E31\u0E28\u0E19\u0E4C")),
  objectives: U2_OBJECTIVES,
  items: U2_ITEMS,
  seq: U2_SEQ,
  groups: U2_GROUPS,
  lessonBody: U2_LESSON_BODY,
  actLabel: "Lab",
  lessonCount: 5,
  actCount: 5,
  quiz: U2_QUIZ,
  viewKey: "aira_u2_view",
  art: () => React.createElement(VisionStage, null),
  renderActivity: view => {
    const L = U2_LABS[view];
    return L ? React.createElement(L, null) : null;
  },
  refs: U2_REFS,
  refsTitle: "แหล่งอ้างอิงหน่วยที่ 2",
  refsNote: React.createElement(React.Fragment, null, "\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E0A\u0E37\u0E48\u0E2D\u0E1F\u0E31\u0E07\u0E01\u0E4C\u0E0A\u0E31\u0E19\u0E41\u0E25\u0E30\u0E1E\u0E32\u0E23\u0E32\u0E21\u0E34\u0E40\u0E15\u0E2D\u0E23\u0E4C OpenCV \u0E08\u0E32\u0E01\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E17\u0E32\u0E07\u0E01\u0E32\u0E23 OpenCV 4.x \u0E2A\u0E48\u0E27\u0E19\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E1B\u0E23\u0E30\u0E21\u0E27\u0E25\u0E1C\u0E25\u0E20\u0E32\u0E1E\u0E43\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A\u0E19\u0E35\u0E49\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E01\u0E31\u0E1A OpenCV \u0E08\u0E23\u0E34\u0E07\u0E40\u0E21\u0E37\u0E48\u0E2D 26 \u0E15.\u0E04. 2569 \u0E44\u0E14\u0E49\u0E04\u0E48\u0E32\u0E15\u0E23\u0E07\u0E01\u0E31\u0E19 (\u0E15\u0E48\u0E32\u0E07\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 1 \u0E23\u0E30\u0E14\u0E31\u0E1A\u0E2A\u0E35\u0E08\u0E32\u0E01\u0E01\u0E32\u0E23\u0E1B\u0E31\u0E14\u0E40\u0E28\u0E29) \u0E20\u0E32\u0E1E\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\u0E40\u0E1B\u0E47\u0E19 CC0 \u0E2B\u0E23\u0E37\u0E2D\u0E2A\u0E32\u0E18\u0E32\u0E23\u0E13\u0E2A\u0E21\u0E1A\u0E31\u0E15\u0E34"),
  badge: {
    name: "Vision Detective",
    icon: "eye"
  },
  next: {
    id: "unit3",
    label: "ไปหน่วยที่ 3"
  }
};

function Unit2Page() {
  return React.createElement(UnitCoursePage, {
    cfg: U2_CFG
  });
}


export default Unit2Page;
export { Unit2Page };
