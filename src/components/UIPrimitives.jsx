import React, { useMemo } from 'react';
import { ICONS } from '../data/courseData.js';
import airaMascotUrl from '../assets/aira-mascot.png';

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
  size,
  className = "",
  style,
  title = "AIra (ไอร่า) หุ่นยนต์ผู้ช่วย"
}) {
  return React.createElement("svg", _extends({
    viewBox: "0 0 220 220",
    width: size || undefined,
    height: size || undefined,
    style: size ? _extends({ width: size, height: size, flexShrink: 0 }, style) : style,
    className: `aira-mascot-svg mood-${mood} ${className}`.trim()
  }, title ? {
    role: "img",
    "aria-label": title
  } : {
    "aria-hidden": "true",
    focusable: "false"
  }), React.createElement("ellipse", {
    cx: "106",
    cy: "210",
    rx: "48",
    ry: "7",
    fill: "#6366F1",
    opacity: ".16"
  }), React.createElement("g", {
    className: float ? "bot-float" : ""
  }, React.createElement("image", {
    href: airaMascotUrl,
    x: "2",
    y: "0",
    width: "216",
    height: "214",
    preserveAspectRatio: "xMidYMid meet"
  })));
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
    stopColor: "#6D4DD3"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: "#9B87F5"
  }))), React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: "var(--color-primary-soft, #EEE9FF)",
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
