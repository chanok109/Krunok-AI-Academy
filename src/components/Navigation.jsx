import React, { useCallback, useEffect, useState } from 'react';
import { ASSISTANT_SCRIPT, COURSE, NAV_ORDER, QUIZ_PASS_PERCENT, ROUTES, UNITS, unitLocked } from '../data/courseData.js';
import { useApp } from '../context/AppContext.jsx';
import { useRoute } from '../context/RouteContext.jsx';
import { Icon, AIraBot, GlassCard, Button, DemoBadge, ProgressRing, ErrorBoundary } from './UIPrimitives.jsx';

function getRouteTitle(route) {
  if (route === "home") return "หน้าหลัก";
  if (route === "teacher") return "แดชบอร์ดครูผู้สอน";
  const u = UNITS.find(x => x.id === route);
  if (u) return `หน่วยที่ ${u.no} · ${u.title}`;
  return "หน้าหลัก";
}

function Navbar({ collapsed, onToggleSidebar }) {
  const {
    student,
    summary,
    logout,
    notify
  } = useApp();
  const {
    route,
    navigate
  } = useRoute();
  const inShell = typeof onToggleSidebar === "function";
  return React.createElement("nav", {
    className: "navbar" + (inShell ? " navbar-in-shell" : ""),
    "aria-label": "\u0E41\u0E16\u0E1A\u0E19\u0E33\u0E17\u0E32\u0E07\u0E2B\u0E25\u0E31\u0E01"
  }, inShell ? React.createElement("div", {
    className: "navbar-page-left"
  }, React.createElement("button", {
    type: "button",
    className: "sidebar-hamburger-btn",
    onClick: onToggleSidebar,
    title: collapsed ? "ขยายเมนูด้านซ้าย" : "ย่อเมนูด้านซ้าย",
    "aria-label": collapsed ? "ขยายเมนูด้านซ้าย" : "ย่อเมนูด้านซ้าย"
  }, React.createElement("svg", {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round"
  }, React.createElement("line", { x1: 4, y1: 6, x2: 20, y2: 6 }), React.createElement("line", { x1: 4, y1: 12, x2: 20, y2: 12 }), React.createElement("line", { x1: 4, y1: 18, x2: 20, y2: 18 }))), React.createElement("span", {
    className: "navbar-page-title"
  }, getRouteTitle(route))) : React.createElement("button", {
    className: "brand",
    onClick: () => navigate(student ? "home" : "login"),
    "aria-label": "\u0E44\u0E1B\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01 KruNok AI Academy"
  }, React.createElement(AIraBot, {
    className: "brand-mark",
    float: false,
    title: ""
  }), React.createElement("span", {
    style: {
      textAlign: "left"
    }
  }, React.createElement("span", {
    className: "brand-name"
  }, "KruNok ", React.createElement("span", {
    className: "grad-text"
  }, "AI Academy")), React.createElement("br", null), React.createElement("span", {
    className: "brand-sub"
  }, COURSE.code, " \xB7 ", COURSE.name))), React.createElement("span", {
    className: "nav-spacer"
  }), student && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "nav-progress",
    title: "\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E23\u0E27\u0E21"
  }, React.createElement("span", {
    className: "np-text"
  }, "\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E23\u0E27\u0E21"), React.createElement(ProgressRing, {
    value: summary.overall,
    size: 38,
    stroke: 5,
    label: "\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E23\u0E27\u0E21"
  })), React.createElement("div", {
    className: "user-chip"
  }, React.createElement("span", {
    className: "user-name"
  }, (student.name || (student.displayName || '').replace(/^(นาย|นางสาว|นาง|เด็กชาย|เด็กหญิง|ด\.ช\.|ด\.ญ\.|ครู)\s*/, '').split(/\s+/)[0]), " ", React.createElement("span", {
    style: {
      color: "var(--dim)"
    }
  }, "\xB7 ", student.classroom)), React.createElement("span", {
    className: "avatar",
    "aria-hidden": "true"
  }, ((student.name || student.displayName || '').trim().replace(/^(นาย|นางสาว|นาง|เด็กชาย|เด็กหญิง|ด\.ช\.|ด\.ญ\.|ครู)\s*/, '').charAt(0) || 'U'))), inShell && React.createElement("button", {
    type: "button",
    className: "topbar-action-btn",
    onClick: async () => {
      await logout();
      navigate("login");
      notify({
        type: "info",
        title: "ออกจากระบบแล้ว",
        message: "ความก้าวหน้ายังเก็บไว้ในเครื่องนี้"
      });
    }
  }, "ออกจากระบบ \u2192")));
}
function unitStatusText(su) {
  if (!su.ready) return su.visited ? "เคยเข้าแล้ว · รอเปิดเนื้อหา" : "รอเปิดเนื้อหา";
  if (su.completed) return "เรียนครบแล้ว";
  return su.percent > 0 ? `${su.percent}% เสร็จแล้ว` : "ยังไม่เริ่ม";
}
export function goToProgress(route, navigate) {
  const go = () => {
    const el = document.getElementById("achievements") || document.getElementById("my-progress");
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      el.focus({
        preventScroll: true
      });
    }
  };
  if (route !== "home") {
    navigate("home");
    setTimeout(go, 420);
  } else go();
}
function Sidebar({ collapsed, onToggle }) {
  const {
    route,
    navigate
  } = useRoute();
  const {
    summary,
    student,
    logout,
    notify,
    resetProgress
  } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  return React.createElement("aside", {
    className: "sidebar" + (collapsed ? " is-collapsed" : ""),
    "aria-label": "\u0E40\u0E21\u0E19\u0E39\u0E1A\u0E17\u0E40\u0E23\u0E35\u0E22\u0E19"
  }, React.createElement("button", {
    type: "button",
    className: "side-brand-head",
    onClick: () => navigate("home"),
    title: "KruNok AI Academy · ห้องเรียนปัญญาประดิษฐ์"
  }, React.createElement(AIraBot, {
    className: "side-brand-logo",
    float: false,
    title: ""
  }), !collapsed && React.createElement("span", {
    className: "side-brand-text"
  }, React.createElement("strong", null, "KruNok AI"), React.createElement("small", null, "ห้องเรียน ว32281 · ม.5"))), !collapsed && React.createElement("div", {
    className: "side-label"
  }, "บทเรียน"), React.createElement("button", {
    className: "side-link",
    "aria-current": route === "home" ? "page" : undefined,
    onClick: () => navigate("home"),
    title: "หน้าแรกบทเรียน"
  }, React.createElement("span", {
    className: "side-num"
  }, React.createElement(Icon, {
    name: "home",
    size: 16
  })), !collapsed && React.createElement("span", {
    className: "lbl"
  }, "หน้าแรก", React.createElement("small", null, "ภาพรวมห้องเรียน"))), UNITS.map(u => {
    const su = summary.units[u.id];
    const isCompleted = Boolean(su && su.completed);
    return React.createElement(React.Fragment, { key: u.id }, React.createElement("button", {
      className: "side-link " + (isCompleted ? "is-done" : ""),
      "data-unit": u.no,
      "aria-current": route === u.id ? "page" : undefined,
      disabled: unitLocked(u.id, student),
      onClick: () => navigate(u.id),
      title: `หน่วยที่ ${u.no}: ${u.title}`
    }, React.createElement("span", {
      className: "side-num " + (isCompleted ? "done" : "")
    }, isCompleted ? React.createElement(Icon, {
      name: "check",
      size: 15
    }) : u.no), !collapsed && React.createElement("span", {
      className: "lbl"
    }, React.createElement("span", {
      className: "side-title"
    }, `หน่วยที่ ${u.no}: ${u.title}`), React.createElement("small", {
      className: isCompleted ? "status-done" : ""
    }, unitLocked(u.id, student) ? "เร็วๆ นี้" : unitStatusText(su)))));
  }), !collapsed && React.createElement("div", {
    className: "side-label"
  }, "ความก้าวหน้า"), React.createElement("button", {
    className: "side-link",
    onClick: () => goToProgress(route, navigate),
    title: "ความก้าวหน้าและเหรียญตรา"
  }, React.createElement("span", {
    className: "side-num"
  }, React.createElement(Icon, {
    name: "award",
    size: 16
  })), !collapsed && React.createElement("span", {
    className: "lbl"
  }, "เหรียญตราและความก้าวหน้า", React.createElement("small", null, "สรุปผลการเรียน"))), React.createElement("div", {
    className: "side-foot"
  }, !collapsed && (!confirmReset ? React.createElement("button", {
    type: "button",
    className: "side-link side-sub-btn",
    onClick: () => setConfirmReset(true)
  }, React.createElement("span", {
    className: "side-num"
  }, React.createElement(Icon, {
    name: "refresh",
    size: 15
  })), React.createElement("span", {
    className: "lbl"
  }, "\u0E25\u0E49\u0E32\u0E07\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32")) : React.createElement("div", {
    className: "side-reset-confirm"
  }, React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "#E2DCEC"
    }
  }, "\u0E25\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14?"), React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, React.createElement(Button, {
    variant: "danger",
    size: "sm",
    onClick: async () => {
      await resetProgress();
      setConfirmReset(false);
      notify({
        type: "info",
        title: "ล้างความก้าวหน้าแล้ว"
      });
    }
  }, "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19"), React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => setConfirmReset(false)
  }, "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01")))), React.createElement("button", {
    type: "button",
    className: "side-collapse-btn",
    onClick: onToggle,
    title: collapsed ? "ขยายเมนู" : "ย่อเมนู"
  }, React.createElement("span", {
    className: "collapse-ic"
  }, collapsed ? "\u21E5" : "\u21E4"), !collapsed && React.createElement("span", null, "ย่อเมนู"))));
}
function MobileNav() {
  const {
    route,
    navigate
  } = useRoute();
  return React.createElement("nav", {
    className: "mobile-nav",
    "aria-label": "\u0E40\u0E21\u0E19\u0E39\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D"
  }, NAV_ORDER.map(k => React.createElement("button", {
    key: k,
    "aria-current": route === k ? "page" : undefined,
    onClick: () => navigate(k)
  }, k === "home" ? React.createElement(Icon, {
    name: "home",
    size: 20
  }) : React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 16,
      fontWeight: 700,
      lineHeight: "20px"
    }
  }, k.slice(-1)), React.createElement("span", null, k === "home" ? "Dashboard" : "หน่วย " + k.slice(-1)))), React.createElement("button", {
    onClick: () => goToProgress(route, navigate)
  }, React.createElement(Icon, {
    name: "award",
    size: 20
  }), React.createElement("span", null, "\u0E40\u0E2B\u0E23\u0E35\u0E22\u0E0D\u0E15\u0E23\u0E32")));
}
function Footer() {
  const {
    student,
    logout,
    notify
  } = useApp();
  const {
    navigate
  } = useRoute();
  return React.createElement("footer", {
    className: "footer"
  }, React.createElement("span", null, COURSE.code, " ", COURSE.name, " \xB7 ", COURSE.level, " \xB7 ", COURSE.term), React.createElement("span", {
    style: {
      display: "flex",
      gap: 14,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, COURSE.school, student && React.createElement("button", {
    className: "btn btn-ghost btn-sm mobile-only-logout",
    onClick: async () => {
      await logout();
      navigate("login");
      notify({
        type: "info",
        title: "ออกจากระบบแล้ว",
        message: "ความก้าวหน้ายังเก็บไว้ในเครื่องนี้"
      });
    }
  }, React.createElement(Icon, {
    name: "logout",
    size: 16
  }), "ออกจากระบบ")));
}
function Toasts() {
  const {
    toasts,
    dismiss
  } = useApp();
  const icon = {
    success: "check",
    info: "info",
    error: "alert"
  };
  return React.createElement("div", {
    className: "toasts",
    "aria-live": "polite",
    "aria-atomic": "false"
  }, toasts.map(t => React.createElement("div", {
    key: t.id,
    className: `toast ${t.type}`,
    role: t.type === "error" ? "alert" : "status"
  }, t.bot ? React.createElement("span", {
    className: "t-bot"
  }, React.createElement(AIraBot, {
    mood: t.bot,
    float: false,
    title: ""
  })) : React.createElement("span", {
    className: "t-ic"
  }, React.createElement(Icon, {
    name: icon[t.type] || "info",
    size: 16
  })), React.createElement("div", {
    className: "t-body"
  }, React.createElement("strong", null, t.title), t.message && React.createElement("span", null, t.message)), React.createElement("button", {
    className: "x",
    onClick: () => dismiss(t.id),
    "aria-label": "\u0E1B\u0E34\u0E14\u0E01\u0E32\u0E23\u0E41\u0E08\u0E49\u0E07\u0E40\u0E15\u0E37\u0E2D\u0E19"
  }, React.createElement(Icon, {
    name: "x",
    size: 16
  })))));
}

function AIraAssistant() {
  const {
    route
  } = useRoute();
  const [open, setOpen] = useState(false);
  const key = route === "home" ? "home" : ASSISTANT_SCRIPT[route] ? route : route.startsWith("unit") ? "unit" : "notfound";
  const s = ASSISTANT_SCRIPT[key];
  useEffect(() => {
    setOpen(false);
  }, [route]);
  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return React.createElement("div", {
    className: "assistant"
  }, open && React.createElement(GlassCard, {
    pad: false,
    className: "assistant-panel",
    id: "aira-panel",
    role: "dialog",
    "aria-label": "\u0E1C\u0E39\u0E49\u0E0A\u0E48\u0E27\u0E22 AIra"
  }, React.createElement("div", {
    className: "assistant-head"
  }, React.createElement(AIraBot, {
    mood: s.mood,
    className: "bot-mini",
    float: false,
    title: ""
  }), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("strong", null, "AIra"), React.createElement("small", null, "\u0E1C\u0E39\u0E49\u0E0A\u0E48\u0E27\u0E22\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49")), React.createElement("button", {
    className: "icon-btn",
    style: {
      width: 34,
      height: 34
    },
    onClick: () => setOpen(false),
    "aria-label": "\u0E1B\u0E34\u0E14\u0E1C\u0E39\u0E49\u0E0A\u0E48\u0E27\u0E22"
  }, React.createElement(Icon, {
    name: "x",
    size: 16
  }))), React.createElement("p", {
    className: "bubble"
  }, s.msg), s.tips.length > 0 && React.createElement("ul", {
    className: "tips"
  }, s.tips.map(t => React.createElement("li", {
    key: t
  }, React.createElement(Icon, {
    name: "sparkle",
    size: 14
  }), t)))), React.createElement("button", {
    className: "assistant-fab",
    onClick: () => setOpen(o => !o),
    "aria-expanded": open,
    "aria-controls": "aira-panel",
    "aria-label": open ? "ปิดผู้ช่วย AIra" : "เปิดผู้ช่วย AIra"
  }, React.createElement(AIraBot, {
    mood: s.mood,
    title: ""
  })));
}
function AppLayout({
  children
}) {
  const {
    route
  } = useRoute();
  const [collapsed, setCollapsed] = useState(false);
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "shell" + (collapsed ? " sidebar-collapsed" : "")
  }, React.createElement(Sidebar, {
    collapsed: collapsed,
    onToggle: () => setCollapsed(c => !c)
  }), React.createElement("div", {
    className: "main"
  }, React.createElement(Navbar, {
    collapsed: collapsed,
    onToggleSidebar: () => setCollapsed(c => !c)
  }), React.createElement("main", {
    className: "content page-enter",
    key: route,
    id: "main"
  }, React.createElement(ErrorBoundary, {
    resetKey: route
  }, children)), React.createElement(Footer, null))), React.createElement(MobileNav, null), React.createElement(AIraAssistant, null));
}


export {
  Navbar,
  Sidebar,
  MobileNav,
  Footer,
  Toasts,
  AIraAssistant,
  AppLayout
};
