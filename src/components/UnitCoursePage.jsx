import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext.jsx';
import { useRoute } from '../context/RouteContext.jsx';
import { Icon, AIraBot, GlassCard, Button, Badge, DemoBadge, ProgressRing, ProgressBar } from './UIPrimitives.jsx';
import { Celebrate, Modal, scrollToEl, pad2, AiraTip, Callout } from './UIHelpers.jsx';
import { QuizRunner } from './QuizRunner.jsx';
import { HoloStage } from './BackgroundEffects.jsx';

const itemKind = it => it.tag || (it.kind === "lesson" ? `บทเรียนที่ ${it.no}` : it.kind === "activity" ? `กิจกรรมที่ ${it.no}` : "แบบทดสอบ");
function UnitCoursePage({
  cfg
}) {
  const {
    progress,
    summary,
    markItem,
    visitUnit
  } = useApp();
  const {
    navigate
  } = useRoute();
  const {
    unitId,
    items,
    seq
  } = cfg;
  useEffect(() => {
    visitUnit(unitId);
  }, [unitId, visitUnit]);
  const up = progress[unitId];
  const su = summary.units[unitId];
  const isDone = id => {
    const it = items[id];
    if (it.kind === "lesson") return up.completedLessons.includes(id);
    if (it.kind === "activity") return up.completedActivities.includes(id);
    return su.quizPassed;
  };
  const firstOpen = seq.find(id => !isDone(id)) || null;
  const [view, setView] = useState(() => {
    try {
      const v = sessionStorage.getItem(cfg.viewKey);
      if (v && items[v]) return v;
    } catch (e) {}
    return firstOpen || seq[0];
  });
  useEffect(() => {
    try {
      sessionStorage.setItem(cfg.viewKey, view);
    } catch (e) {}
  }, [view]);
  const [tocOpen, setTocOpen] = useState(false);
  const [fsOpen, setFsOpen] = useState(false);
  const [fsTocOpen, setFsTocOpen] = useState(false);
  const [refsOpen, setRefsOpen] = useState(false);
  const [party, setParty] = useState(null);
  const contentRef = useRef(null);
  const partyTimer = useRef(null);
  useEffect(() => () => clearTimeout(partyTimer.current), []);
  useEffect(() => {
    if (!fsOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = e => {
      if (e.key === "Escape") {
        if (fsTocOpen) setFsTocOpen(false);
        else setFsOpen(false);
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onEsc);
    };
  }, [fsOpen, fsTocOpen]);
  const closeRefs = useCallback(() => setRefsOpen(false), []);
  const go = (id, openFull = true) => {
    setView(id);
    setTocOpen(false);
    setFsTocOpen(false);
    if (openFull) setFsOpen(true);
    else setTimeout(() => scrollToEl(contentRef.current), 40);
  };
  const completeLesson = id => {
    if (isDone(id)) return;
    markItem(unitId, "lessons", id, true);
    setParty({
      title: `เรียนจบ${itemKind(items[id])} แล้ว!`,
      sub: items[id].title
    });
    clearTimeout(partyTimer.current);
    partyTimer.current = setTimeout(() => setParty(null), 2000);
  };
  const it = items[view];
  const pos = seq.indexOf(view);
  const prev = seq[pos - 1],
    next = seq[pos + 1];
  const LessonBody = cfg.lessonBody[view];
  const lessonsDone = up.completedLessons.filter(x => items[x]).length;
  const actsDone = up.completedActivities.filter(x => items[x]).length;
  const startLabel = !firstOpen ? "ทบทวนบทเรียน" : lessonsDone === 0 && actsDone === 0 ? "เริ่มเรียน" : "เรียนต่อ";
  const lessonTitle = id => `${itemKind(items[id])} ${items[id].title}`;
  return React.createElement(React.Fragment, null, React.createElement(Celebrate, {
    data: party
  }), React.createElement("section", {
    className: "glass u1-hero hero-" + unitId,
    "aria-labelledby": unitId + "-title"
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
  }, "UNIT ", pad2(cfg.no)), React.createElement(Badge, null, cfg.en), React.createElement(DemoBadge, null)), React.createElement("h1", {
    id: unitId + "-title"
  }, cfg.titleNode), React.createElement("div", {
    style: {
      display: "grid",
      gap: 8
    }
  }, React.createElement("span", {
    className: "eyebrow"
  }, "\u0E08\u0E38\u0E14\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49"), React.createElement("ul", {
    className: "objectives"
  }, cfg.objectives.map(o => React.createElement("li", {
    key: o
  }, React.createElement(Icon, {
    name: "target",
    size: 16
  }), o)))), React.createElement("div", {
    className: "u1-progress"
  }, React.createElement(ProgressRing, {
    value: su.percent,
    size: 64,
    stroke: 7,
    label: `ความก้าวหน้าหน่วยที่ ${cfg.no}`
  }), React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6
    }
  }, React.createElement(Badge, null, React.createElement(Icon, {
    name: "book",
    size: 12
  }), "\u0E1A\u0E17\u0E40\u0E23\u0E35\u0E22\u0E19 ", lessonsDone, "/", cfg.lessonCount), React.createElement(Badge, null, React.createElement(Icon, {
    name: "puzzle",
    size: 12
  }), cfg.actLabel, " ", actsDone, "/", cfg.actCount), React.createElement(Badge, {
    tone: su.quizPassed ? "ok" : ""
  }, React.createElement(Icon, {
    name: "target",
    size: 12
  }), su.quizBest ? `แบบทดสอบดีที่สุด ${su.quizBest.correct}/${cfg.quiz.length}` : "ยังไม่ได้ทำแบบทดสอบ"))), React.createElement("div", {
    className: "btn-inline"
  }, React.createElement(Button, {
    className: "btn-glow",
    icon: "play",
    onClick: () => go(firstOpen || seq[0])
  }, startLabel), cfg.slidesUrl && React.createElement("a", {
    className: "btn btn-secondary",
    href: cfg.slidesUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    style: { textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }
  }, React.createElement(Icon, { name: "play", size: 14 }), "สไลด์เต็มจอ ↗"), cfg.setupUrl && React.createElement("a", {
    className: "btn btn-ghost",
    href: cfg.setupUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    style: { textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }
  }, React.createElement(Icon, { name: "cpu", size: 14 }), "คู่มือติดตั้ง ↗"), cfg.codeUrl && React.createElement("a", {
    className: "btn btn-ghost",
    href: cfg.codeUrl,
    download: true,
    style: { textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }
  }, React.createElement(Icon, { name: "sparkle", size: 14 }), "โค้ดตัวอย่าง ↓"), React.createElement(Button, {
    variant: "ghost",
    icon: "book",
    onClick: () => setRefsOpen(true)
  }, "\u0E41\u0E2B\u0E25\u0E48\u0E07\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07"), React.createElement(Button, {
    variant: "ghost",
    icon: "grid",
    onClick: () => navigate("home")
  }, "\u0E01\u0E25\u0E31\u0E1A Dashboard"))), cfg.art ? cfg.art(su) : React.createElement(HoloStage, { mood: su.completed ? "cheer" : "happy" })), su.completed && React.createElement("div", {
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
    name: cfg.badge.icon,
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
  }, "\u0E40\u0E23\u0E35\u0E22\u0E19\u0E04\u0E23\u0E1A\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E17\u0E35\u0E48 ", cfg.no, " \u0E41\u0E25\u0E49\u0E27! \u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E40\u0E2B\u0E23\u0E35\u0E22\u0E0D ", cfg.badge.name), React.createElement("span", {
    style: {
      color: "var(--muted)",
      fontSize: 14
    }
  }, "\u0E40\u0E23\u0E35\u0E22\u0E19\u0E04\u0E23\u0E1A\u0E17\u0E38\u0E01\u0E1A\u0E17 \u0E17\u0E33", cfg.actLabel, "\u0E04\u0E23\u0E1A \u0E41\u0E25\u0E30\u0E1C\u0E48\u0E32\u0E19\u0E41\u0E1A\u0E1A\u0E17\u0E14\u0E2A\u0E2D\u0E1A \u0E17\u0E1A\u0E17\u0E27\u0E19\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D\u0E43\u0E14\u0E01\u0E47\u0E44\u0E14\u0E49\u0E15\u0E25\u0E2D\u0E14\u0E40\u0E27\u0E25\u0E32")), cfg.next && React.createElement(Button, {
    variant: "ghost",
    iconRight: "chevR",
    onClick: () => navigate(cfg.next.id)
  }, cfg.next.label)), React.createElement("div", {
    className: "u1-layout",
    ref: contentRef
  }, React.createElement("nav", {
    className: "glass toc",
    "aria-label": `สารบัญหน่วยที่ ${cfg.no}`
  }, React.createElement("button", {
    type: "button",
    className: "btn btn-ghost toc-toggle",
    "aria-expanded": tocOpen,
    "aria-controls": unitId + "-toc",
    onClick: () => setTocOpen(o => !o)
  }, React.createElement(Icon, {
    name: "book",
    size: 18
  }), React.createElement("span", {
    style: {
      flex: 1,
      textAlign: "left"
    }
  }, "\u0E2A\u0E32\u0E23\u0E1A\u0E31\u0E0D \xB7 ", itemKind(it), " ", it.title), React.createElement(Icon, {
    name: "chevR",
    size: 16,
    style: {
      transform: tocOpen ? "rotate(90deg)" : "none"
    }
  })), React.createElement("div", {
    id: unitId + "-toc",
    className: "toc-body",
    "data-open": tocOpen
  }, cfg.groups.map(g => React.createElement("div", {
    key: g.label,
    style: {
      display: "grid",
      gap: 2
    }
  }, React.createElement("div", {
    className: "toc-group"
  }, g.label), g.ids.map(id => {
    const x = items[id];
    const d = isDone(id);
    return React.createElement("button", {
      key: id,
      type: "button",
      className: "toc-item " + (d ? "done" : "") + " k-" + x.kind,
      "aria-current": view === id ? "step" : undefined,
      onClick: () => go(id)
    }, React.createElement("span", {
      className: "toc-ic"
    }, d ? React.createElement(Icon, {
      name: "check",
      size: 14
    }) : x.kind === "lesson" ? x.no : x.kind === "activity" ? React.createElement(Icon, {
      name: "puzzle",
      size: 13
    }) : React.createElement(Icon, {
      name: "target",
      size: 13
    })), React.createElement("span", {
      style: {
        minWidth: 0
      }
    }, React.createElement("span", {
      className: "toc-kind"
    }, itemKind(x), " \xB7 ", x.mins, " \u0E19\u0E32\u0E17\u0E35"), x.title));
  }))))), React.createElement("article", {
    className: "glass lesson",
    "aria-labelledby": "lesson-title",
    key: view
  }, React.createElement("header", {
    className: "lesson-head"
  }, React.createElement("div", {
    style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }
  }, React.createElement("span", {
    className: "eyebrow"
  }, itemKind(it), " \xB7 \u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 ", it.mins, " \u0E19\u0E32\u0E17\u0E35"), React.createElement("button", {
    type: "button",
    className: "deck-fullscreen-btn",
    onClick: () => setFsOpen(true)
  }, "\u2922 \u0E02\u0E22\u0E32\u0E22\u0E2A\u0E44\u0E25\u0E14\u0E4C\u0E40\u0E15\u0E47\u0E21\u0E08\u0E2D")), React.createElement("h2", {
    id: "lesson-title"
  }, it.title), React.createElement("span", {
    className: "hint"
  }, it.en)), React.createElement(AiraTip, {
    mood: it.kind === "quiz" ? "think" : it.kind === "activity" ? "wink" : "happy",
    title: cfg.tipTitle || "AIra แนะนำ"
  }, it.tip), LessonBody && React.createElement(LessonBody, null), it.kind === "activity" && cfg.renderActivity(view, go), it.kind === "quiz" && React.createElement(QuizRunner, {
    unitId: unitId,
    questions: cfg.quiz,
    lessonTitle: lessonTitle,
    onGoLesson: go
  }), it.kind === "lesson" && React.createElement("div", {
    className: "lesson-foot"
  }, isDone(view) ? React.createElement("span", {
    className: "done-chip"
  }, React.createElement(Icon, {
    name: "check",
    size: 18
  }), "\u0E40\u0E23\u0E35\u0E22\u0E19\u0E08\u0E1A\u0E1A\u0E17\u0E19\u0E35\u0E49\u0E41\u0E25\u0E49\u0E27") : React.createElement("span", {
    className: "hint"
  }, "\u0E2D\u0E48\u0E32\u0E19\u0E41\u0E25\u0E30\u0E25\u0E2D\u0E07\u0E42\u0E15\u0E49\u0E15\u0E2D\u0E1A\u0E04\u0E23\u0E1A\u0E41\u0E25\u0E49\u0E27 \u0E01\u0E14\u0E1B\u0E38\u0E48\u0E21\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32"), !isDone(view) && React.createElement(Button, {
    className: "btn-glow",
    icon: "check",
    onClick: () => completeLesson(view)
  }, "\u0E40\u0E23\u0E35\u0E22\u0E19\u0E08\u0E1A\u0E1A\u0E17\u0E19\u0E35\u0E49\u0E41\u0E25\u0E49\u0E27")), React.createElement("nav", {
    className: "step-nav lesson-nav",
    "aria-label": "\u0E44\u0E1B\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E23\u0E37\u0E2D\u0E16\u0E31\u0E14\u0E44\u0E1B"
  }, prev ? React.createElement(Button, {
    variant: "ghost",
    icon: "chevL",
    onClick: () => go(prev)
  }, React.createElement("span", {
    className: "nav-lbl"
  }, React.createElement("small", null, "\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32"), items[prev].title)) : React.createElement(Button, {
    variant: "ghost",
    icon: "grid",
    onClick: () => navigate("home")
  }, "\u0E01\u0E25\u0E31\u0E1A Dashboard"), next ? React.createElement(Button, {
    iconRight: "chevR",
    onClick: () => go(next)
  }, React.createElement("span", {
    className: "nav-lbl"
  }, React.createElement("small", null, "\u0E16\u0E31\u0E14\u0E44\u0E1B"), items[next].title)) : React.createElement(Button, {
    variant: "ghost",
    iconRight: "grid",
    onClick: () => navigate("home")
  }, "\u0E01\u0E25\u0E31\u0E1A Dashboard")))), React.createElement(Modal, {
    open: refsOpen,
    onClose: closeRefs,
    title: cfg.refsTitle
  }, cfg.refsNote && React.createElement(Callout, {
    tone: "warn",
    icon: "info",
    title: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E32\u0E23\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A"
  }, cfg.refsNote), React.createElement("ul", {
    className: "ref-list"
  }, cfg.refs.map(r => React.createElement("li", {
    key: r.url
  }, React.createElement("span", {
    className: "ref-tag"
  }, r.tag), React.createElement("a", {
    href: r.url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, r.title))))), fsOpen && typeof document !== "undefined" && createPortal(
    React.createElement("div", {
      className: "lesson-slide-deck deck-fullscreen",
      "aria-label": `สไลด์เต็มจอ หน่วยที่ ${cfg.no}`
    },
      React.createElement("div", { className: "deck-toolbar" },
        React.createElement("div", { className: "deck-toolbar-left" },
          React.createElement("button", {
            type: "button",
            className: "deck-fs-back-btn",
            onClick: () => setFsOpen(false)
          },
            React.createElement(Icon, { name: "grid", size: 15 }),
            React.createElement("span", null, "เมนูบทเรียน")
          ),
          React.createElement("div", { className: "deck-fs-unit-meta" },
            React.createElement("span", { className: "deck-fs-unit-kicker" }, "UNIT ", pad2(cfg.no)),
            React.createElement("span", { className: "deck-fs-unit-title" }, `${itemKind(it)} · ${it.title}`)
          )
        ),
        React.createElement("div", { className: "deck-toolbar-right" },
          React.createElement("div", { className: "deck-toc-wrapper" },
            React.createElement("button", {
              type: "button",
              className: `deck-fullscreen-btn ${fsTocOpen ? "active" : ""}`,
              onClick: () => setFsTocOpen(o => !o)
            },
              React.createElement(Icon, { name: "list", size: 15 }),
              React.createElement("span", null, "สารบัญ")
            ),
            fsTocOpen && React.createElement("div", { className: "deck-toc-popover", role: "menu" },
              React.createElement("div", { className: "deck-toc-header" },
                React.createElement("strong", null, `สารบัญหน่วยที่ ${cfg.no} (${seq.length} หัวข้อ)`),
                React.createElement("button", {
                  type: "button",
                  className: "deck-toc-close",
                  onClick: () => setFsTocOpen(false)
                }, "✕")
              ),
              React.createElement("div", { className: "deck-toc-list" },
                seq.map((id, idx) => {
                  const x = items[id];
                  return React.createElement("button", {
                    key: id,
                    type: "button",
                    className: `deck-toc-item ${id === view ? "active" : ""}`,
                    onClick: () => go(id, true)
                  },
                    React.createElement("span", { className: "deck-toc-num" }, idx + 1),
                    React.createElement("span", { className: "deck-toc-text" }, `${itemKind(x)}: ${x.title}`)
                  );
                })
              )
            )
          ),
          React.createElement("button", {
            type: "button",
            className: "deck-fullscreen-btn active",
            onClick: () => setFsOpen(false)
          },
            React.createElement("span", null, "⤡ ออกจากเต็มจอ")
          )
        )
      ),
      React.createElement("div", { className: "deck-slide-stage" },
        React.createElement("div", { className: "deck-slide-card", key: view },
          React.createElement("div", { className: "deck-slide-header" },
            React.createElement("div", { className: "deck-slide-header-row" },
              React.createElement("span", {
                className: `deck-slide-icon-badge ${it.kind === "quiz" ? "gold" : it.kind === "activity" ? "green" : "blue"}`
              },
                React.createElement(Icon, {
                  name: it.kind === "quiz" ? "target" : it.kind === "activity" ? "puzzle" : "book",
                  size: 20
                })
              ),
              React.createElement("div", { className: "deck-slide-header-text" },
                React.createElement("h3", { className: "deck-slide-heading" }, it.title)
              )
            ),
            it.en && React.createElement("p", { className: "deck-slide-sub" }, it.en)
          ),
          React.createElement("div", { className: "deck-slide-body", style: { justifyContent: "flex-start" } },
            React.createElement(AiraTip, {
              mood: it.kind === "quiz" ? "think" : it.kind === "activity" ? "wink" : "happy",
              title: cfg.tipTitle || "AIra แนะนำ"
            }, it.tip),
            LessonBody && React.createElement(LessonBody, null),
            it.kind === "activity" && cfg.renderActivity(view, id => go(id, true)),
            it.kind === "quiz" && React.createElement(QuizRunner, {
              unitId: unitId,
              questions: cfg.quiz,
              lessonTitle: lessonTitle,
              onGoLesson: id => go(id, true)
            }),
            it.kind === "lesson" && React.createElement("div", { className: "lesson-foot", style: { marginTop: 12 } },
              isDone(view) ? React.createElement("span", { className: "done-chip" },
                React.createElement(Icon, { name: "check", size: 18 }),
                "เรียนจบบทนี้แล้ว"
              ) : React.createElement("span", { className: "hint" },
                "อ่านและลองโต้ตอบครบแล้ว กดปุ่มเพื่อบันทึกความก้าวหน้า"
              ),
              !isDone(view) && React.createElement(Button, {
                className: "btn-glow",
                icon: "check",
                onClick: () => completeLesson(view)
              }, "เรียนจบบทนี้แล้ว")
            )
          )
        )
      ),
      React.createElement("div", { className: "deck-bottom-bar" },
        React.createElement("button", {
          type: "button",
          className: "deck-fs-nav-btn deck-fs-prev",
          disabled: !prev,
          onClick: () => prev && go(prev, true)
        }, "← ก่อนหน้า"),
        React.createElement("div", { className: "deck-seg-track", role: "tablist" },
          seq.map((id, idx) => {
            const isVisited = idx < pos;
            const isTeal = isVisited && idx >= Math.ceil(seq.length * 0.35);
            return React.createElement("button", {
              key: id,
              type: "button",
              role: "tab",
              "aria-selected": idx === pos,
              className: [
                "deck-seg-bar",
                idx === pos ? "active" : "",
                isVisited ? "visited" : "",
                isTeal ? "visited-teal" : ""
              ].filter(Boolean).join(" "),
              onClick: () => go(id, true),
              title: `${idx + 1}. ${items[id].title}`
            });
          })
        ),
        React.createElement("div", { className: "deck-bottom-right" },
          React.createElement("span", { className: "deck-fs-counter" },
            React.createElement("strong", null, pos + 1),
            " / ",
            seq.length
          ),
          React.createElement("button", {
            type: "button",
            className: "deck-fs-nav-btn deck-fs-next",
            disabled: !next,
            onClick: () => next && go(next, true)
          }, next ? "ถัดไป →" : "หัวข้อสุดท้าย")
        )
      )
    ),
    document.body
  ));
}


export {
  itemKind,
  UnitCoursePage
};
