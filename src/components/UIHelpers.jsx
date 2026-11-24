import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon, AIraBot, GlassCard, Button } from './UIPrimitives.jsx';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pad2 = n => String(n).padStart(2, "0");
const fmtDuration = sec => {
  const s = Math.max(0, Math.round(sec || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const thaiDate = iso => {
  try {
    return new Date(iso).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch (e) {
    return "";
  }
};
const thaiDateTime = iso => {
  try {
    return new Date(iso).toLocaleString("th-TH", {
      day: "numeric",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (e) {
    return "";
  }
};
const scrollToEl = el => {
  if (el && el.scrollIntoView) el.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
};
function AiraTip({
  mood = "happy",
  title = "AIra แนะนำ",
  children
}) {
  return React.createElement("div", {
    className: "aira-tip"
  }, React.createElement("div", {
    className: "bot"
  }, React.createElement(AIraBot, {
    mood: mood,
    float: false,
    title: ""
  })), React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, React.createElement("strong", null, title), React.createElement("p", null, children)));
}
function Callout({
  tone = "info",
  icon,
  title,
  children
}) {
  const ic = icon || (tone === "warn" ? "alert" : tone === "ok" ? "check" : "info");
  return React.createElement("div", {
    className: "callout " + tone
  }, React.createElement(Icon, {
    name: ic,
    size: 18
  }), React.createElement("div", {
    style: {
      minWidth: 0,
      display: "grid",
      gap: 4
    }
  }, title && React.createElement("strong", null, title), React.createElement("div", null, children)));
}
function Feedback({
  tone = "good",
  title,
  children
}) {
  const ic = tone === "good" ? "check" : tone === "mid" ? "info" : "alert";
  return React.createElement("div", {
    className: "feedback " + tone,
    role: "status"
  }, React.createElement(Icon, {
    name: ic,
    size: 16
  }), React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, title && React.createElement("strong", {
    style: {
      display: "block"
    }
  }, title), children));
}
function FlipCard({
  label,
  front,
  back
}) {
  const [on, setOn] = useState(false);
  return React.createElement("button", {
    type: "button",
    className: "flip",
    "aria-pressed": on,
    onClick: () => setOn(v => !v),
    "aria-label": `${label}: ${on ? "แสดงคำอธิบายอยู่ กดเพื่อพลิกกลับ" : "กดเพื่อพลิกดูคำอธิบาย"}`
  }, React.createElement("span", {
    className: "flip-inner"
  }, React.createElement("span", {
    className: "flip-face flip-front",
    "aria-hidden": on
  }, front, React.createElement("span", {
    className: "flip-hint"
  }, React.createElement(Icon, {
    name: "refresh",
    size: 13
  }), "\u0E41\u0E15\u0E30\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1E\u0E25\u0E34\u0E01\u0E01\u0E32\u0E23\u0E4C\u0E14")), React.createElement("span", {
    className: "flip-face flip-back",
    "aria-hidden": !on
  }, back)));
}
function Accordion({
  items,
  defaultOpen
}) {
  const [open, setOpen] = useState(defaultOpen ? [defaultOpen] : []);
  const uid = useMemo(() => "ac" + Math.random().toString(36).slice(2, 7), []);
  return React.createElement("div", {
    className: "acc"
  }, items.map(it => {
    const isOpen = open.includes(it.id);
    return React.createElement("div", {
      className: "acc-item",
      key: it.id
    }, React.createElement("h3", {
      className: "acc-h"
    }, React.createElement("button", {
      type: "button",
      className: "acc-btn",
      id: uid + it.id + "b",
      "aria-expanded": isOpen,
      "aria-controls": uid + it.id,
      onClick: () => setOpen(o => isOpen ? o.filter(x => x !== it.id) : [...o, it.id])
    }, it.icon && React.createElement("span", {
      className: "acc-ic"
    }, React.createElement(Icon, {
      name: it.icon,
      size: 18
    })), React.createElement("span", {
      style: {
        minWidth: 0
      }
    }, it.title, it.en && React.createElement("span", {
      className: "acc-en"
    }, it.en)), React.createElement(Icon, {
      name: "chevR",
      size: 18,
      className: "chev"
    }))), isOpen && React.createElement("div", {
      className: "acc-panel",
      id: uid + it.id,
      role: "region",
      "aria-labelledby": uid + it.id + "b"
    }, it.content));
  }));
}
const CONFETTI = Array.from({
  length: 30
}, (_, i) => ({
  x: Math.round(Math.cos(i * 0.83) * (130 + i * 23 % 170)),
  y: Math.round(Math.sin(i * 0.83) * (100 + i * 31 % 150)) - 40,
  r: i * 47 % 360,
  c: ["#9B87F5", "#00E5FF", "#FFD66D", "#57CCF2", "#F4F6FB"][i % 5],
  d: i % 6 * 0.04
}));
function Celebrate({
  data
}) {
  if (!data) return null;
  const el = React.createElement("div", {
    className: "celebrate no-print",
    style: { zIndex: 10050 },
    role: "status",
    "aria-live": "polite"
  }, React.createElement("div", {
    className: "confetti",
    "aria-hidden": "true"
  }, CONFETTI.map((c, i) => React.createElement("i", {
    key: i,
    style: {
      background: c.c,
      "--x": c.x + "px",
      "--y": c.y + "px",
      "--r": c.r + "deg",
      animationDelay: c.d + "s"
    }
  }))), React.createElement("div", {
    className: "glass celebrate-card"
  }, React.createElement(AIraBot, {
    mood: "cheer",
    className: "bot",
    title: ""
  }), React.createElement("strong", {
    style: {
      fontSize: 20
    }
  }, data.title), data.sub && React.createElement("span", {
    style: {
      color: "var(--muted)"
    }
  }, data.sub)));
  return typeof document !== "undefined" ? createPortal(el, document.body) : el;
}
function Modal({
  open,
  onClose,
  title,
  children
}) {
  const ref = useRef(null);
  const uid = useMemo(() => "md" + Math.random().toString(36).slice(2, 7), []);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    ref.current && ref.current.focus();
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev && prev.focus && prev.focus();
    };
  }, [open, onClose]);
  if (!open) return null;
  // วาดที่ body: ถ้าอยู่ใต้กล่องที่มี transform (เช่นแอนิเมชันหน้า) position: fixed จะไม่อิงหน้าจอ
  return createPortal(React.createElement("div", {
    className: "modal-backdrop",
    onClick: e => {
      if (e.target === e.currentTarget) onClose();
    }
  }, React.createElement("div", {
    className: "glass modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": uid,
    tabIndex: -1,
    ref: ref
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      alignItems: "center"
    }
  }, React.createElement("h2", {
    id: uid,
    style: {
      fontSize: 21
    }
  }, title), React.createElement("button", {
    className: "icon-btn",
    onClick: onClose,
    "aria-label": "\u0E1B\u0E34\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07"
  }, React.createElement(Icon, {
    name: "x",
    size: 18
  }))), children)), document.body);
}
function ActScore({
  score,
  max,
  answered,
  total
}) {
  return React.createElement("div", {
    className: "scorebox",
    "aria-live": "polite"
  }, React.createElement(Icon, {
    name: "target",
    size: 16
  }), React.createElement("span", null, score, "/", max), answered !== undefined && React.createElement("span", {
    style: {
      color: "var(--dim)",
      fontWeight: 500,
      fontSize: 12
    }
  }, "\xB7 \u0E17\u0E33\u0E41\u0E25\u0E49\u0E27 ", answered, "/", total));
}
function ActResult({
  score,
  max,
  onRetry,
  best
}) {
  const pct = max ? Math.round(score / max * 100) : 0;
  const mood = pct >= 80 ? "cheer" : pct >= 50 ? "happy" : "think";
  const msg = pct >= 80 ? "ยอดเยี่ยม! เข้าใจเรื่องนี้ดีมาก" : pct >= 50 ? "ดีแล้ว ลองอ่านคำอธิบายข้อที่พลาดอีกครั้งนะ" : "ไม่เป็นไร ลองทบทวนบทเรียนแล้วเล่นใหม่อีกรอบ";
  return React.createElement("div", {
    className: "result",
    role: "status"
  }, React.createElement("div", {
    className: "bot"
  }, React.createElement(AIraBot, {
    mood: mood,
    float: false,
    title: ""
  })), React.createElement("div", {
    style: {
      flex: "1 1 220px",
      display: "grid",
      gap: 4,
      minWidth: 0
    }
  }, React.createElement("strong", {
    style: {
      fontSize: 18
    }
  }, "\u0E44\u0E14\u0E49 ", score, " \u0E08\u0E32\u0E01 ", max, " \u0E04\u0E30\u0E41\u0E19\u0E19 (", pct, "%)"), React.createElement("span", {
    style: {
      color: "var(--muted)",
      fontSize: 14
    }
  }, msg), React.createElement("span", {
    className: "hint"
  }, "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E27\u0E48\u0E32\u0E17\u0E33\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21\u0E19\u0E35\u0E49\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08\u0E41\u0E25\u0E49\u0E27", best !== undefined && best !== null ? ` · คะแนนดีที่สุด ${best}/${max}` : "")), React.createElement(Button, {
    variant: "ghost",
    icon: "refresh",
    onClick: onRetry
  }, "\u0E40\u0E25\u0E48\u0E19\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07"));
}


const PY_KW = new Set(["import", "from", "as", "def", "return", "if", "else", "elif", "for", "in", "while", "and", "or", "not", "with", "True", "False", "None", "is", "lambda", "try", "except"]);
const PY_BUILTIN = new Set(["print", "len", "range", "int", "float", "str", "type", "list", "round", "max", "min"]);
function highlightPy(code) {
  const out = [];
  const re = /(#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+|[^\sA-Za-z0-9_#"']+)/g;
  let m,
    k = 0;
  while (m = re.exec(code)) {
    const [t, com, str, num, id] = m;
    let cls = null;
    if (com) cls = "tk-c";else if (str) cls = "tk-s";else if (num) cls = "tk-n";else if (id) {
      const nextCh = code[re.lastIndex];
      cls = PY_KW.has(id) ? "tk-k" : id === "cv2" || id === "np" ? "tk-m" : PY_BUILTIN.has(id) ? "tk-b" : nextCh === "(" ? "tk-f" : /^[A-Z][A-Z0-9_]+$/.test(id) ? "tk-const" : null;
    }
    out.push(cls ? React.createElement("span", {
      key: k++,
      className: cls
    }, t) : t);
  }
  return out;
}
function CodeBlock({
  code,
  title = "Python",
  caption
}) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef(null);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      const sel = window.getSelection();
      const r = document.createRange();
      r.selectNodeContents(preRef.current);
      sel.removeAllRanges();
      sel.addRange(r);
    }
  };
  return React.createElement("figure", {
    className: "code"
  }, React.createElement("div", {
    className: "code-bar"
  }, React.createElement("span", {
    className: "code-dots",
    "aria-hidden": "true"
  }, React.createElement("i", null), React.createElement("i", null), React.createElement("i", null)), React.createElement("span", {
    className: "mono"
  }, title), React.createElement("button", {
    type: "button",
    className: "code-copy",
    onClick: copy
  }, copied ? "คัดลอกแล้ว" : "คัดลอกโค้ด")), React.createElement("pre", {
    ref: preRef,
    tabIndex: 0
  }, React.createElement("code", null, highlightPy(code))), caption && React.createElement("figcaption", null, caption));
}


export {
  shuffle,
  pad2,
  fmtDuration,
  thaiDate,
  thaiDateTime,
  scrollToEl,
  AiraTip,
  Callout,
  Feedback,
  FlipCard,
  Accordion,
  Celebrate,
  Modal,
  ActScore,
  ActResult,
  highlightPy,
  CodeBlock
};
