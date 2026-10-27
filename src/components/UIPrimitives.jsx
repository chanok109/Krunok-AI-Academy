import React, { useMemo } from 'react';
import { ICONS } from '../data/courseData.js';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

function Icon({
  name,
  size = 20,
  stroke = 1.9,
  ...rest
}) {
  return React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, rest), React.createElement("path", {
    d: ICONS[name]
  }));
}
function AIraBot({
  mood = "happy",
  float = true,
  className = "",
  title = "AIra หุ่นยนต์ผู้ช่วย"
}) {
  const uid = useMemo(() => "b" + Math.random().toString(36).slice(2, 7), []);
  const eye = (cx, wink) => wink ? React.createElement("path", {
    d: `M${cx - 9} 101 q9 -8 18 0`,
    stroke: "#00E5FF",
    strokeWidth: "5",
    strokeLinecap: "round",
    fill: "none"
  }) : React.createElement("g", {
    className: "bot-eye"
  }, React.createElement("rect", {
    x: cx - 9,
    y: 89,
    width: "18",
    height: "24",
    rx: "9",
    fill: "#00E5FF"
  }), React.createElement("rect", {
    x: cx - 4,
    y: 93,
    width: "6",
    height: "7",
    rx: "3",
    fill: "#E9FDFF"
  }));
  return React.createElement("svg", _extends({
    viewBox: "0 0 200 220",
    className: className
  }, title ? {
    role: "img",
    "aria-label": title
  } : {
    "aria-hidden": "true",
    focusable: "false"
  }), React.createElement("defs", null, React.createElement("radialGradient", {
    id: uid + "pearl",
    cx: "35%",
    cy: "28%",
    r: "80%"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: "#FFFFFF"
  }), React.createElement("stop", {
    offset: ".55",
    stopColor: "#EEF0FA"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: "#C9C3EE"
  })), React.createElement("linearGradient", {
    id: uid + "lav",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: "#B7A8FF"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: "#7C67E8"
  })), React.createElement("linearGradient", {
    id: uid + "visor",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: "#1B1846"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: "#0B1026"
  })), React.createElement("radialGradient", {
    id: uid + "glow",
    cx: "50%",
    cy: "50%",
    r: "50%"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: "#00E5FF",
    stopOpacity: ".45"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: "#00E5FF",
    stopOpacity: "0"
  }))), React.createElement("ellipse", {
    cx: "100",
    cy: "208",
    rx: "46",
    ry: "7",
    fill: "#00E5FF",
    opacity: ".18"
  }), React.createElement("g", {
    className: float ? "bot-float" : ""
  }, React.createElement("path", {
    d: "M100 42 V22",
    stroke: "#B7A8FF",
    strokeWidth: "5",
    strokeLinecap: "round"
  }), React.createElement("path", {
    className: "bot-star",
    d: "M100 4 l4.2 8.6 9.4 1.4 -6.8 6.6 1.6 9.4 -8.4-4.4 -8.4 4.4 1.6-9.4 -6.8-6.6 9.4-1.4z",
    fill: "#FFD66D",
    stroke: "#FFF1C2",
    strokeWidth: "1.2"
  }), React.createElement("rect", {
    x: "22",
    y: "80",
    width: "18",
    height: "40",
    rx: "9",
    fill: `url(#${uid}lav)`
  }), React.createElement("rect", {
    x: "160",
    y: "80",
    width: "18",
    height: "40",
    rx: "9",
    fill: `url(#${uid}lav)`
  }), React.createElement("rect", {
    x: "32",
    y: "40",
    width: "136",
    height: "112",
    rx: "52",
    fill: `url(#${uid}pearl)`
  }), React.createElement("path", {
    d: "M58 50 q42 -18 84 0",
    stroke: "#FFFFFF",
    strokeWidth: "6",
    strokeLinecap: "round",
    opacity: ".85",
    fill: "none"
  }), React.createElement("rect", {
    x: "48",
    y: "70",
    width: "104",
    height: "64",
    rx: "30",
    fill: `url(#${uid}visor)`
  }), React.createElement("ellipse", {
    cx: "100",
    cy: "101",
    rx: "52",
    ry: "34",
    fill: `url(#${uid}glow)`
  }), eye(78, false), eye(122, mood === "wink"), mood === "think" ? React.createElement("path", {
    d: "M92 124 h16",
    stroke: "#57CCF2",
    strokeWidth: "4",
    strokeLinecap: "round"
  }) : React.createElement("path", {
    d: "M88 120 q12 10 24 0",
    stroke: "#57CCF2",
    strokeWidth: "4",
    strokeLinecap: "round",
    fill: "none"
  }), React.createElement("circle", {
    cx: "62",
    cy: "122",
    r: "5",
    fill: "#9B87F5",
    opacity: ".7"
  }), React.createElement("circle", {
    cx: "138",
    cy: "122",
    r: "5",
    fill: "#9B87F5",
    opacity: ".7"
  }), React.createElement("rect", {
    x: "64",
    y: "150",
    width: "72",
    height: "50",
    rx: "24",
    fill: `url(#${uid}pearl)`
  }), React.createElement("circle", {
    cx: "100",
    cy: "174",
    r: "11",
    fill: "#161336"
  }), React.createElement("path", {
    d: "M100 166 l2.4 5 5.4.8 -3.9 3.8.9 5.4 -4.8-2.6 -4.8 2.6.9-5.4 -3.9-3.8 5.4-.8z",
    fill: "#00E5FF"
  }), mood === "cheer" ? React.createElement(React.Fragment, null, React.createElement("rect", {
    x: "34",
    y: "128",
    width: "16",
    height: "40",
    rx: "8",
    transform: "rotate(35 42 148)",
    fill: `url(#${uid}lav)`
  }), React.createElement("rect", {
    x: "150",
    y: "128",
    width: "16",
    height: "40",
    rx: "8",
    transform: "rotate(-35 158 148)",
    fill: `url(#${uid}lav)`
  })) : React.createElement(React.Fragment, null, React.createElement("rect", {
    x: "46",
    y: "156",
    width: "16",
    height: "36",
    rx: "8",
    transform: "rotate(16 54 174)",
    fill: `url(#${uid}lav)`
  }), React.createElement("rect", {
    x: "138",
    y: "156",
    width: "16",
    height: "36",
    rx: "8",
    transform: "rotate(-16 146 174)",
    fill: `url(#${uid}lav)`
  }))));
}
function GlassCard({
  as: Tag = "div",
  className = "",
  pad = true,
  children,
  ...rest
}) {
  return React.createElement(Tag, _extends({
    className: `glass ${pad ? "pad" : ""} ${className}`
  }, rest), children);
}
function Button({
  variant = "primary",
  size,
  icon,
  iconRight,
  children,
  className = "",
  ...rest
}) {
  return React.createElement("button", _extends({
    className: `btn btn-${variant} ${size === "sm" ? "btn-sm" : ""} ${className}`
  }, rest), icon && React.createElement(Icon, {
    name: icon,
    size: 18
  }), children, iconRight && React.createElement(Icon, {
    name: iconRight,
    size: 18
  }));
}
function Badge({
  tone,
  dot,
  children
}) {
  return React.createElement("span", {
    className: `badge ${tone || ""}`
  }, dot && React.createElement("span", {
    className: "dot"
  }), children);
}
function DemoBadge() {
  return React.createElement(Badge, {
    tone: "demo",
    dot: true
  }, "Demo Mode");
}
function ProgressBar({
  value,
  label
}) {
  const v = Math.max(0, Math.min(100, value || 0));
  return React.createElement("div", {
    className: "progress-bar",
    role: "progressbar",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": v,
    "aria-label": label || "ความก้าวหน้า"
  }, React.createElement("span", {
    style: {
      width: v + "%"
    }
  }));
}
function ProgressRing({
  value = 0,
  size = 64,
  stroke = 7,
  label
}) {
  const r = (size - stroke) / 2,
    c = 2 * Math.PI * r,
    v = Math.max(0, Math.min(100, value));
  const gid = useMemo(() => "rg" + Math.random().toString(36).slice(2, 7), []);
  return React.createElement("div", {
    style: {
      position: "relative",
      width: size,
      height: size,
      flex: "none"
    },
    role: "img",
    "aria-label": `${label || "ความก้าวหน้า"} ${v}%`
  }, React.createElement("svg", {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`
  }, React.createElement("defs", null, React.createElement("linearGradient", {
    id: gid,
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
  }))), React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: "rgba(155,135,245,.18)",
    strokeWidth: stroke,
    fill: "none"
  }), React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: `url(#${gid})`,
    strokeWidth: stroke,
    fill: "none",
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: c * (1 - v / 100),
    transform: `rotate(-90 ${size / 2} ${size / 2})`,
    style: {
      transition: "stroke-dashoffset .8s ease"
    }
  })), React.createElement("span", {
    className: "ring-label",
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      fontSize: size * 0.24
    }
  }, v, "%"));
}
function PageHeader({
  eyebrow,
  title,
  lead,
  aside
}) {
  return React.createElement("header", {
    className: "page-head"
  }, React.createElement("div", {
    className: "head-text"
  }, eyebrow && React.createElement("span", {
    className: "eyebrow"
  }, eyebrow), React.createElement("h1", null, title), lead && React.createElement("p", {
    className: "lead"
  }, lead)), aside);
}
function LoadingState({
  text = "กำลังโหลดข้อมูล…"
}) {
  return React.createElement("div", {
    className: "state",
    role: "status",
    "aria-live": "polite"
  }, React.createElement("div", {
    className: "spinner"
  }), React.createElement("p", {
    style: {
      color: "var(--muted)"
    }
  }, text), React.createElement("div", {
    style: {
      width: "min(420px,100%)",
      display: "grid",
      gap: 10
    }
  }, React.createElement("div", {
    className: "skeleton",
    style: {
      height: 14
    }
  }), React.createElement("div", {
    className: "skeleton",
    style: {
      height: 14,
      width: "75%"
    }
  })));
}
function ErrorState({
  title = "เกิดข้อผิดพลาด",
  message,
  action
}) {
  return React.createElement(GlassCard, {
    className: "state",
    role: "alert"
  }, React.createElement(AIraBot, {
    mood: "think",
    className: "bot",
    float: false
  }), React.createElement("h2", null, title), message && React.createElement("p", {
    className: "lead"
  }, message), action);
}
class ErrorBoundary extends React.Component {
  constructor(p) {
    super(p);
    this.state = {
      error: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  componentDidCatch(error, info) {
    console.error("CRITICAL ERROR IN BOUNDARY:", error, info);
  }
  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({
      error: null
    });
  }
  render() {
    if (this.state.error) return React.createElement(ErrorState, {
      title: "หน้านี้แสดงผลไม่สำเร็จ",
      message: (this.state.error && this.state.error.message) ? ("ข้อผิดพลาด: " + this.state.error.message) : "ลองโหลดหน้านี้อีกครั้ง ถ้ายังไม่ได้ ให้กลับไปหน้าหลักแล้วเข้าใหม่",
      action: React.createElement(Button, {
        variant: "ghost",
        icon: "refresh",
        onClick: () => this.setState({
          error: null
        })
      }, "\u0E25\u0E2D\u0E07\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07")
    });
    return this.props.children;
  }
}


export {
  Icon,
  AIraBot,
  GlassCard,
  Button,
  Badge,
  DemoBadge,
  ProgressBar,
  ProgressRing,
  PageHeader,
  LoadingState,
  ErrorState,
  ErrorBoundary
};
