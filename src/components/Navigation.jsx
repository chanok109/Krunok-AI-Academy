import React, { useCallback, useEffect, useState } from 'react';
import { ASSISTANT_SCRIPT, COURSE, NAV_ORDER, QUIZ_PASS_PERCENT, ROUTES, UNITS } from '../data/courseData.js';
import { useApp } from '../context/AppContext.jsx';
import { useRoute } from '../context/RouteContext.jsx';
import { Icon, AIraBot, GlassCard, Button, DemoBadge, ProgressRing, ErrorBoundary } from './UIPrimitives.jsx';

function Navbar() {
  const {
    student,
    summary
  } = useApp();
  const {
    navigate
  } = useRoute();
  return React.createElement("nav", {
    className: "navbar",
    "aria-label": "\u0E41\u0E16\u0E1A\u0E19\u0E33\u0E17\u0E32\u0E07\u0E2B\u0E25\u0E31\u0E01"
  }, React.createElement("button", {
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
    size: 40,
    stroke: 5,
    label: "\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E23\u0E27\u0E21"
  })), React.createElement("div", {
    className: "user-chip"
  }, React.createElement("span", {
    className: "user-name"
  }, student.displayName, " ", React.createElement("span", {
    style: {
      color: "var(--dim)"
    }
  }, "\xB7 ", student.classroom)), React.createElement("span", {
    className: "avatar",
    "aria-hidden": "true"
  }, student.displayName.trim().charAt(0)))));
}
function unitStatusText(su) {
  if (!su.ready) return su.visited ? "เคยเข้าแล้ว · รอเปิดเนื้อหา" : "รอเปิดเนื้อหา";
  if (su.completed) return "เรียนครบแล้ว";
  return su.percent > 0 ? `${su.percent}% เสร็จแล้ว` : "ยังไม่เริ่ม";
}
function goToProgress(route, navigate) {
  const go = () => {
    const el = document.getElementById("my-progress");
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
function Sidebar() {
  const {
    route,
    navigate
  } = useRoute();
  const {
    summary,
    logout,
    notify,
    resetProgress
  } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  return React.createElement("aside", {
    className: "sidebar",
    "aria-label": "\u0E40\u0E21\u0E19\u0E39\u0E1A\u0E17\u0E40\u0E23\u0E35\u0E22\u0E19"
  }, React.createElement("button", {
    className: "side-link",
    "aria-current": route === "home" ? "page" : undefined,
    onClick: () => navigate("home")
  }, React.createElement("span", {
    className: "side-num"
  }, React.createElement(Icon, {
    name: "grid",
    size: 16
  })), React.createElement("span", {
    className: "lbl"
  }, "Dashboard", React.createElement("small", null, "\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01"))), React.createElement("div", {
    className: "side-label"
  }, "\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49"), UNITS.map(u => React.createElement("button", {
    key: u.id,
    className: "side-link",
    "aria-current": route === u.id ? "page" : undefined,
    onClick: () => navigate(u.id)
  }, React.createElement("span", {
    className: "side-num"
  }, u.no), React.createElement("span", {
    className: "lbl"
  }, u.titleEn, React.createElement("small", null, "\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E17\u0E35\u0E48 ", u.no, " \xB7 ", unitStatusText(summary.units[u.id]))))), React.createElement("div", {
    className: "side-label"
  }, "\u0E15\u0E34\u0E14\u0E15\u0E32\u0E21\u0E1C\u0E25"), React.createElement("button", {
    className: "side-link",
    onClick: () => goToProgress(route, navigate)
  }, React.createElement("span", {
    className: "side-num"
  }, React.createElement(Icon, {
    name: "chart",
    size: 16
  })), React.createElement("span", {
    className: "lbl"
  }, "My Progress", React.createElement("small", null, "\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E41\u0E25\u0E30\u0E40\u0E2B\u0E23\u0E35\u0E22\u0E0D\u0E15\u0E23\u0E32"))), React.createElement("div", {
    className: "side-foot"
  }, React.createElement(GlassCard, {
    pad: false,
    style: {
      padding: 14,
      display: "grid",
      gap: 10
    }
  }, React.createElement(DemoBadge, null), React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: "var(--muted)",
      lineHeight: 1.5
    }
  }, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E01\u0E47\u0E1A\u0E43\u0E19\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E19\u0E35\u0E49\u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19"), !confirmReset ? React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "refresh",
    onClick: () => setConfirmReset(true)
  }, "\u0E25\u0E49\u0E32\u0E07\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32") : React.createElement("div", {
    style: {
      display: "grid",
      gap: 8
    }
  }, React.createElement("span", {
    style: {
      fontSize: 12.5
    }
  }, "\u0E25\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\u0E43\u0E19\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E19\u0E35\u0E49?"), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
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
    className: "side-link",
    onClick: async () => {
      await logout();
      navigate("login");
      notify({
        type: "info",
        title: "ออกจากโหมดทดลองแล้ว",
        message: "ความก้าวหน้ายังเก็บไว้ในเครื่องนี้"
      });
    }
  }, React.createElement("span", {
    className: "side-num"
  }, React.createElement(Icon, {
    name: "logout",
    size: 16
  })), React.createElement("span", {
    className: "lbl"
  }, "Logout", React.createElement("small", null, "\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E42\u0E2B\u0E21\u0E14\u0E17\u0E14\u0E25\u0E2D\u0E07 \u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E22\u0E31\u0E07\u0E2D\u0E22\u0E39\u0E48")))));
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
    name: "chart",
    size: 20
  }), React.createElement("span", null, "\u0E1C\u0E25\u0E02\u0E2D\u0E07\u0E09\u0E31\u0E19")));
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
        title: "ออกจากโหมดทดลองแล้ว",
        message: "ความก้าวหน้ายังเก็บไว้ในเครื่องนี้"
      });
    }
  }, React.createElement(Icon, {
    name: "logout",
    size: 16
  }), "\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E42\u0E2B\u0E21\u0E14\u0E17\u0E14\u0E25\u0E2D\u0E07")));
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
  return React.createElement(React.Fragment, null, React.createElement(Navbar, null), React.createElement("div", {
    className: "shell"
  }, React.createElement(Sidebar, null), React.createElement("div", {
    className: "main"
  }, React.createElement("main", {
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
