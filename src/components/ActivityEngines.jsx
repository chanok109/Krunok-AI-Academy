import React, { useEffect, useRef, useState } from 'react';
import { Icon, GlassCard, Button, Badge } from './UIPrimitives.jsx';
import { Callout, Feedback, Celebrate, ActScore, ActResult, shuffle, pad2 } from './UIHelpers.jsx';

function ClassifyActivity({
  unitId,
  actId,
  items,
  options
}) {
  const {
    saveActivity,
    progress
  } = useApp();
  const [ans, setAns] = useState({});
  const [round, setRound] = useState(0);
  const saved = useRef(false);
  const answered = Object.keys(ans).length;
  const done = answered === items.length;
  const score = items.filter(it => ans[it.id] === it.answer).length;
  useEffect(() => {
    if (done && !saved.current) {
      saved.current = true;
      saveActivity(unitId, actId, score, items.length);
    }
  }, [done, score]);
  const retry = () => {
    saved.current = false;
    setAns({});
    setRound(r => r + 1);
  };
  const best = progress[unitId].activityScores[actId];
  const optLabel = id => (options.find(o => o.id === id) || {}).label;
  return React.createElement("div", {
    className: "act"
  }, React.createElement("div", {
    className: "act-head"
  }, React.createElement("span", {
    className: "hint"
  }, "\u0E15\u0E2D\u0E1A\u0E44\u0E14\u0E49\u0E04\u0E23\u0E31\u0E49\u0E07\u0E40\u0E14\u0E35\u0E22\u0E27\u0E15\u0E48\u0E2D\u0E02\u0E49\u0E2D \u0E23\u0E30\u0E1A\u0E1A\u0E15\u0E23\u0E27\u0E08\u0E17\u0E31\u0E19\u0E17\u0E35"), React.createElement(ActScore, {
    score: score,
    max: items.length,
    answered: answered,
    total: items.length
  })), React.createElement("div", {
    className: "q-grid"
  }, items.map((it, i) => {
    const a = ans[it.id];
    const ok = a === it.answer;
    return React.createElement("div", {
      key: it.id + "-" + round,
      className: "q-card " + (a ? ok ? "correct" : "wrong" : "")
    }, React.createElement("div", {
      className: "q-title"
    }, React.createElement("span", {
      className: "mono",
      style: {
        color: "var(--dim)",
        marginRight: 8
      }
    }, pad2(i + 1)), it.text), React.createElement("div", {
      className: "opts"
    }, options.map(o => React.createElement("button", {
      key: o.id,
      type: "button",
      disabled: !!a,
      "aria-pressed": a === o.id,
      className: "opt " + (a ? o.id === it.answer ? "is-correct" : o.id === a ? "is-wrong" : "" : ""),
      onClick: () => setAns(s => ({
        ...s,
        [it.id]: o.id
      }))
    }, o.icon && React.createElement(Icon, {
      name: o.icon,
      size: 16
    }), o.label))), a && React.createElement(Feedback, {
      tone: ok ? "good" : "bad",
      title: ok ? "ถูกต้อง" : `ยังไม่ถูก คำตอบที่เหมาะสมคือ "${optLabel(it.answer)}"`
    }, it.why));
  })), done && React.createElement(ActResult, {
    score: score,
    max: items.length,
    onRetry: retry,
    best: best && best.best
  }));
}
function OrderActivity({
  unitId,
  actId,
  events
}) {
  const {
    saveActivity,
    progress
  } = useApp();
  const makeOrder = () => {
    let s;
    do {
      s = shuffle(events.map(e => e.id));
    } while (s.every((id, i) => id === events[i].id));
    return s;
  };
  const [order, setOrder] = useState(makeOrder);
  const [checked, setChecked] = useState(false);
  const pos = id => events.findIndex(e => e.id === id);
  const ev = id => events.find(e => e.id === id);
  const score = order.filter((id, i) => pos(id) === i).length;
  const move = (i, d) => setOrder(o => {
    const n = [...o];
    [n[i], n[i + d]] = [n[i + d], n[i]];
    return n;
  });
  const check = () => {
    setChecked(true);
    saveActivity(unitId, actId, score, events.length);
  };
  const retry = () => {
    setOrder(makeOrder());
    setChecked(false);
  };
  const best = progress[unitId].activityScores[actId];
  return React.createElement("div", {
    className: "act"
  }, React.createElement("div", {
    className: "act-head"
  }, React.createElement("span", {
    className: "hint"
  }, "\u0E01\u0E14\u0E25\u0E39\u0E01\u0E28\u0E23\u0E02\u0E36\u0E49\u0E19/\u0E25\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E23\u0E35\u0E22\u0E07\u0E08\u0E32\u0E01\u0E40\u0E2B\u0E15\u0E38\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E17\u0E35\u0E48\u0E40\u0E01\u0E34\u0E14\u0E01\u0E48\u0E2D\u0E19\u0E44\u0E1B\u0E2B\u0E25\u0E31\u0E07"), checked && React.createElement(ActScore, {
    score: score,
    max: events.length
  })), React.createElement("ol", {
    className: "order-list",
    "aria-label": "\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E40\u0E2B\u0E15\u0E38\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E02\u0E2D\u0E07\u0E40\u0E18\u0E2D"
  }, order.map((id, i) => {
    const e = ev(id);
    const ok = pos(id) === i;
    return React.createElement("li", {
      key: id,
      className: "order-item " + (checked ? ok ? "ok" : "no" : "")
    }, React.createElement("span", {
      className: "order-pos"
    }, i + 1), React.createElement("span", {
      className: "txt"
    }, React.createElement("b", null, e.title), React.createElement("span", {
      className: "hint",
      style: {
        display: "block"
      }
    }, checked ? `${e.yearLabel} · ${ok ? "ตำแหน่งถูกต้อง" : `ควรอยู่ลำดับที่ ${pos(id) + 1}`}` : e.clue)), !checked && React.createElement("span", {
      className: "order-btns"
    }, React.createElement("button", {
      type: "button",
      onClick: () => move(i, -1),
      disabled: i === 0,
      "aria-label": `เลื่อน ${e.title} ขึ้น`
    }, React.createElement(Icon, {
      name: "chevL",
      size: 16,
      style: {
        transform: "rotate(90deg)"
      }
    })), React.createElement("button", {
      type: "button",
      onClick: () => move(i, 1),
      disabled: i === order.length - 1,
      "aria-label": `เลื่อน ${e.title} ลง`
    }, React.createElement(Icon, {
      name: "chevR",
      size: 16,
      style: {
        transform: "rotate(90deg)"
      }
    }))));
  })), !checked ? React.createElement(Button, {
    icon: "check",
    onClick: check,
    style: {
      alignSelf: "flex-start"
    }
  }, "\u0E15\u0E23\u0E27\u0E08\u0E04\u0E33\u0E15\u0E2D\u0E1A") : React.createElement(React.Fragment, null, React.createElement("div", {
    className: "q-card"
  }, React.createElement("strong", null, "\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E17\u0E35\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07"), React.createElement("ol", {
    className: "answer-line"
  }, events.map(e => React.createElement("li", {
    key: e.id
  }, React.createElement("span", {
    className: "mono"
  }, e.yearLabel), " ", e.title)))), React.createElement(ActResult, {
    score: score,
    max: events.length,
    onRetry: retry,
    best: best && best.best
  })));
}
const QUALITY = {
  best: {
    label: "เหมาะสมที่สุด",
    cls: "is-correct",
    pts: 2
  },
  ok: {
    label: "เหมาะสมบางส่วน",
    cls: "is-ok",
    pts: 1
  },
  poor: {
    label: "ไม่เหมาะสม",
    cls: "is-wrong",
    pts: 0
  }
};
function caseMax(c) {
  return 2 + (c.risk ? 1 : 0) + 2;
}
function caseScore(c, st) {
  const right = st.issues.filter(x => c.issues.primary.includes(x)).length;
  const wrong = st.issues.length - right;
  const issue = Math.max(0, Math.min(2, right) - wrong);
  const risk = c.risk && st.risk === c.risk.answer ? 1 : 0;
  const q = (c.action.options.find(o => o.id === st.action) || {}).quality;
  return {
    issue,
    risk,
    action: q ? QUALITY[q].pts : 0,
    total: issue + risk + (q ? QUALITY[q].pts : 0)
  };
}
function ReasoningActivity({
  unitId,
  actId,
  cases,
  maxIssues = 3
}) {
  const {
    saveActivity,
    progress
  } = useApp();
  const [idx, setIdx] = useState(0);
  const [state, setState] = useState({});
  const [limitMsg, setLimitMsg] = useState(false);
  const saved = useRef(false);
  const topRef = useRef(null);
  const c = cases[idx];
  const empty = {
    issues: [],
    risk: null,
    action: null,
    checked: false
  };
  const st = state[c.id] || empty;
  const upd = patch => setState(s => ({
    ...s,
    [c.id]: {
      ...(s[c.id] || empty),
      ...patch
    }
  }));
  const max = cases.reduce((s, x) => s + caseMax(x), 0);
  const total = cases.reduce((s, x) => s + (state[x.id] && state[x.id].checked ? caseScore(x, state[x.id]).total : 0), 0);
  const allChecked = cases.every(x => state[x.id] && state[x.id].checked);
  useEffect(() => {
    if (allChecked && !saved.current) {
      saved.current = true;
      saveActivity(unitId, actId, total, max);
    }
  }, [allChecked, total]);
  const toggleIssue = id => {
    if (st.checked) return;
    if (st.issues.includes(id)) {
      setLimitMsg(false);
      return upd({
        issues: st.issues.filter(x => x !== id)
      });
    }
    if (st.issues.length >= maxIssues) {
      setLimitMsg(true);
      return;
    }
    setLimitMsg(false);
    upd({
      issues: [...st.issues, id]
    });
  };
  const canCheck = st.issues.length > 0 && st.action && (!c.risk || st.risk);
  const goCase = i => {
    setIdx(i);
    setLimitMsg(false);
    setTimeout(() => scrollToEl(topRef.current), 30);
  };
  const retry = () => {
    saved.current = false;
    setState({});
    goCase(0);
  };
  const sc = st.checked ? caseScore(c, st) : null;
  const best = progress[unitId].activityScores[actId];
  const optLabel = id => (c.issues.options.find(o => o.id === id) || {}).label;
  return React.createElement("div", {
    className: "act",
    ref: topRef
  }, React.createElement(Callout, {
    tone: "info",
    title: "\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21\u0E19\u0E35\u0E49\u0E43\u0E2B\u0E49\u0E04\u0E30\u0E41\u0E19\u0E19\u0E15\u0E32\u0E21\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25"
  }, "\u0E2B\u0E25\u0E32\u0E22\u0E2A\u0E16\u0E32\u0E19\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E21\u0E35\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E2A\u0E21\u0E44\u0E14\u0E49\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E41\u0E1A\u0E1A \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30\u0E1A\u0E2D\u0E01\u0E27\u0E48\u0E32\u0E41\u0E15\u0E48\u0E25\u0E30\u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01 \"\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E2A\u0E21\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\" \"\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E2A\u0E21\u0E1A\u0E32\u0E07\u0E2A\u0E48\u0E27\u0E19\" \u0E2B\u0E23\u0E37\u0E2D \"\u0E44\u0E21\u0E48\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E2A\u0E21\" \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25 \u0E2D\u0E48\u0E32\u0E19\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E17\u0E38\u0E01\u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2B\u0E25\u0E31\u0E07\u0E15\u0E23\u0E27\u0E08\u0E19\u0E30"), React.createElement("div", {
    className: "act-head"
  }, React.createElement("div", {
    className: "case-steps",
    role: "tablist",
    "aria-label": "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2A\u0E16\u0E32\u0E19\u0E01\u0E32\u0E23\u0E13\u0E4C"
  }, cases.map((x, i) => React.createElement("button", {
    key: x.id,
    type: "button",
    role: "tab",
    "aria-selected": i === idx,
    className: state[x.id] && state[x.id].checked ? "done" : "",
    onClick: () => goCase(i)
  }, state[x.id] && state[x.id].checked ? React.createElement(Icon, {
    name: "check",
    size: 14
  }) : i + 1, React.createElement("span", {
    className: "sr-only"
  }, x.title)))), React.createElement(ActScore, {
    score: total,
    max: max
  })), React.createElement("div", {
    className: "q-card case"
  }, React.createElement("span", {
    className: "eyebrow"
  }, "\u0E2A\u0E16\u0E32\u0E19\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E17\u0E35\u0E48 ", idx + 1, " \u0E08\u0E32\u0E01 ", cases.length), React.createElement("h3", {
    style: {
      fontSize: 19
    }
  }, c.title), c.media && React.createElement("div", {
    className: "media-wrap"
  }, c.media), React.createElement("p", null, c.text)), React.createElement("fieldset", {
    className: "q-card part"
  }, React.createElement("legend", {
    className: "q-title"
  }, "1) ", c.issues.label, " ", React.createElement("span", {
    className: "hint"
  }, "(\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E14\u0E49\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 ", maxIssues, " \u0E02\u0E49\u0E2D \xB7 2 \u0E04\u0E30\u0E41\u0E19\u0E19)")), React.createElement("div", {
    className: "opts"
  }, c.issues.options.map(o => {
    const sel = st.issues.includes(o.id);
    const prim = c.issues.primary.includes(o.id);
    const cls = st.checked ? prim ? sel ? "is-correct" : "is-ok" : sel ? "is-wrong" : "" : "";
    return React.createElement("button", {
      key: o.id,
      type: "button",
      className: "opt " + cls,
      "aria-pressed": sel,
      disabled: st.checked,
      onClick: () => toggleIssue(o.id)
    }, st.checked && prim && React.createElement(Icon, {
      name: sel ? "check" : "info",
      size: 14
    }), o.label);
  })), limitMsg && !st.checked && React.createElement("span", {
    className: "field-err"
  }, "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E14\u0E49\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14 ", maxIssues, " \u0E02\u0E49\u0E2D \u0E01\u0E14\u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E27\u0E49\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\u0E01\u0E48\u0E2D\u0E19"), st.checked && React.createElement(Feedback, {
    tone: sc.issue === 2 ? "good" : sc.issue === 1 ? "mid" : "bad",
    title: `ได้ ${sc.issue}/2 คะแนน · ประเด็นหลักคือ ${c.issues.primary.map(optLabel).join(", ")}`
  }, React.createElement("ul", {
    className: "why-list"
  }, c.issues.primary.map(id => React.createElement("li", {
    key: id
  }, React.createElement("b", null, optLabel(id), ":"), " ", c.issues.why[id])), st.issues.filter(id => !c.issues.primary.includes(id)).map(id => React.createElement("li", {
    key: id
  }, React.createElement("b", null, optLabel(id)), " (\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E02\u0E49\u0E2D\u0E07\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32): ", c.issues.other && c.issues.other[id] || "ไม่ใช่ประเด็นหลักของสถานการณ์นี้"))))), c.risk && React.createElement("fieldset", {
    className: "q-card part"
  }, React.createElement("legend", {
    className: "q-title"
  }, "2) ", c.risk.label, " ", React.createElement("span", {
    className: "hint"
  }, "(1 \u0E04\u0E30\u0E41\u0E19\u0E19)")), React.createElement("div", {
    className: "opts"
  }, c.risk.options.map(o => React.createElement("button", {
    key: o.id,
    type: "button",
    disabled: st.checked,
    "aria-pressed": st.risk === o.id,
    className: "opt " + (st.checked ? o.id === c.risk.answer ? "is-correct" : st.risk === o.id ? "is-wrong" : "" : ""),
    onClick: () => upd({
      risk: o.id
    })
  }, o.label))), st.checked && React.createElement(Feedback, {
    tone: sc.risk ? "good" : "bad",
    title: sc.risk ? "ถูกต้อง" : `ยังไม่ถูก คำตอบคือ ${(c.risk.options.find(o => o.id === c.risk.answer) || {}).label}`
  }, c.risk.explain)), React.createElement("fieldset", {
    className: "q-card part"
  }, React.createElement("legend", {
    className: "q-title"
  }, c.risk ? 3 : 2, ") ", c.action.label, " ", React.createElement("span", {
    className: "hint"
  }, "(2 \u0E04\u0E30\u0E41\u0E19\u0E19)")), React.createElement("div", {
    className: "opts col"
  }, c.action.options.map(o => React.createElement("button", {
    key: o.id,
    type: "button",
    disabled: st.checked,
    "aria-pressed": st.action === o.id,
    className: "opt " + (st.checked ? QUALITY[o.quality].cls : ""),
    onClick: () => upd({
      action: o.id
    })
  }, React.createElement("span", {
    style: {
      flex: 1
    }
  }, o.label), st.checked && React.createElement("span", {
    className: "q-tag " + o.quality
  }, QUALITY[o.quality].label, st.action === o.id ? " · คำตอบของเธอ" : "")))), st.checked && React.createElement(Feedback, {
    tone: sc.action === 2 ? "good" : sc.action === 1 ? "mid" : "bad",
    title: `ได้ ${sc.action}/2 คะแนน · เหตุผลของแต่ละตัวเลือก`
  }, React.createElement("ul", {
    className: "why-list"
  }, c.action.options.map(o => React.createElement("li", {
    key: o.id
  }, React.createElement("b", null, QUALITY[o.quality].label, ":"), " ", o.why))))), React.createElement("div", {
    className: "step-nav"
  }, !st.checked ? React.createElement(Button, {
    icon: "check",
    disabled: !canCheck,
    onClick: () => upd({
      checked: true
    })
  }, "\u0E15\u0E23\u0E27\u0E08\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E2A\u0E16\u0E32\u0E19\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E19\u0E35\u0E49") : React.createElement("span", {
    className: "done-chip"
  }, React.createElement(Icon, {
    name: "check",
    size: 18
  }), "\u0E2A\u0E16\u0E32\u0E19\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E19\u0E35\u0E49\u0E44\u0E14\u0E49 ", sc.total, "/", caseMax(c), " \u0E04\u0E30\u0E41\u0E19\u0E19"), idx < cases.length - 1 && React.createElement(Button, {
    variant: "ghost",
    iconRight: "chevR",
    onClick: () => goCase(idx + 1)
  }, "\u0E2A\u0E16\u0E32\u0E19\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E16\u0E31\u0E14\u0E44\u0E1B")), !canCheck && !st.checked && React.createElement("span", {
    className: "hint"
  }, "\u0E15\u0E2D\u0E1A\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A\u0E17\u0E38\u0E01\u0E2A\u0E48\u0E27\u0E19\u0E01\u0E48\u0E2D\u0E19 \u0E08\u0E36\u0E07\u0E08\u0E30\u0E15\u0E23\u0E27\u0E08\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E44\u0E14\u0E49"), allChecked && React.createElement(ActResult, {
    score: total,
    max: max,
    onRetry: retry,
    best: best && best.best
  }));
}


export {
  ClassifyActivity,
  OrderActivity,
  ReasoningActivity
};
