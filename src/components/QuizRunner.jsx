import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { quizPassPercent } from '../data/courseData.js';
import { scoreQuiz } from '../services/quizService.js';
import { api } from '../services/apiService.js';
import { Icon, AIraBot, GlassCard, Button, Badge, ProgressBar, ProgressRing } from './UIPrimitives.jsx';
import { Celebrate, Feedback, CodeBlock, fmtDuration, scrollToEl, thaiDateTime, shuffle } from './UIHelpers.jsx';

const LETTERS = ["ก", "ข", "ค", "ง"];
const LEVEL_TONE = {
  "ความรู้ความเข้าใจ": "",
  "การประยุกต์ใช้": "cyan",
  "การวิเคราะห์": "demo"
};
function QuizRunner({
  unitId,
  questions,
  lessonTitle,
  onGoLesson
}) {
  const {
    progress,
    recordQuiz,
    notify
  } = useApp();
  const attempts = progress[unitId].quizAttempts;
  const [phase, setPhase] = useState("intro");
  const [order, setOrder] = useState([]);
  const [i, setI] = useState(0);
  const [ans, setAns] = useState({});
  const [startAt, setStartAt] = useState(0);
  const [result, setResult] = useState(null);
  const [warn, setWarn] = useState(false);
  const [onlyWrong, setOnlyWrong] = useState(true);
  const topRef = useRef(null);
  const passPct = quizPassPercent(unitId);
  const need = Math.ceil(passPct / 100 * questions.length);
  const best = attempts.reduce((b, a) => !b || a.percent > b.percent ? a : b, null);
  const toTop = () => setTimeout(() => scrollToEl(topRef.current), 30);
  const start = () => {
    setOrder(questions.map(q => ({
      ...q,
      opts: shuffle(q.options)
    })));
    setAns({});
    setI(0);
    setStartAt(Date.now());
    setResult(null);
    setWarn(false);
    setOnlyWrong(true);
    setPhase("run");
    toTop();
  };
  const unanswered = order.map((q, k) => ans[q.id] ? -1 : k).filter(k => k >= 0);
  const submit = async () => {
    if (unanswered.length) {
      setWarn(true);
      return;
    }
    const durationSec = Math.round((Date.now() - startAt) / 1000);
    const attemptId = 'ATT-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
    try {
      const r = await api.submitQuiz(unitId, ans, durationSec, attemptId, questions);
      const quizRes = {
        correct: r.score,
        total: r.maxScore,
        percent: r.percentage,
        passed: r.passed,
        durationSec,
        attemptId: r.attemptId
      };
      recordQuiz(unitId, quizRes);
      setResult({
        ...quizRes,
        answers: ans,
        breakdown: r.breakdown
      });
      setPhase("result");
      toTop();
      notify(r.passed ? {
        type: "success",
        bot: "cheer",
        title: `ผ่านแบบทดสอบ! ${r.score}/${r.maxScore} คะแนน`,
        message: "AIra บันทึกคะแนนลงความก้าวหน้าแล้ว"
      } : {
        type: "info",
        title: `ได้ ${r.score}/${r.maxScore} คะแนน`,
        message: `ต้องได้อย่างน้อย ${need} ข้อจึงผ่าน ทบทวนแล้วลองใหม่ได้เลย`
      });
    } catch (err) {
      notify({
        type: "error",
        title: "เกิดข้อผิดพลาดในการส่งข้อสอบ",
        message: err.message || "กรุณาลองใหม่อีกครั้ง"
      });
    }
  };
  if (phase === "intro") return React.createElement("div", {
    className: "act",
    ref: topRef
  }, React.createElement("div", {
    className: "quiz-facts"
  }, React.createElement("div", null, React.createElement("b", {
    className: "mono"
  }, questions.length), React.createElement("span", null, "\u0E02\u0E49\u0E2D \u0E1B\u0E23\u0E19\u0E31\u0E22 4 \u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01")), React.createElement("div", null, React.createElement("b", {
    className: "mono"
  }, questions.length), React.createElement("span", null, "\u0E04\u0E30\u0E41\u0E19\u0E19\u0E40\u0E15\u0E47\u0E21")), React.createElement("div", null, React.createElement("b", {
    className: "mono"
  }, passPct, "%"), React.createElement("span", null, "\u0E40\u0E01\u0E13\u0E11\u0E4C\u0E1C\u0E48\u0E32\u0E19 (", need, " \u0E02\u0E49\u0E2D\u0E02\u0E36\u0E49\u0E19\u0E44\u0E1B)")), React.createElement("div", null, React.createElement("b", {
    className: "mono"
  }, attempts.length), React.createElement("span", null, "\u0E04\u0E23\u0E31\u0E49\u0E07\u0E17\u0E35\u0E48\u0E17\u0E33\u0E41\u0E25\u0E49\u0E27"))), React.createElement("p", {
    style: {
      color: "var(--muted)"
    }
  }, "\u0E41\u0E2A\u0E14\u0E07\u0E17\u0E35\u0E25\u0E30\u0E02\u0E49\u0E2D \u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\u0E44\u0E1B\u0E41\u0E01\u0E49\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E44\u0E14\u0E49 \u0E15\u0E49\u0E2D\u0E07\u0E15\u0E2D\u0E1A\u0E04\u0E23\u0E1A\u0E17\u0E38\u0E01\u0E02\u0E49\u0E2D\u0E01\u0E48\u0E2D\u0E19\u0E2A\u0E48\u0E07 \u0E2B\u0E25\u0E31\u0E07\u0E2A\u0E48\u0E07\u0E08\u0E30\u0E40\u0E2B\u0E47\u0E19\u0E40\u0E09\u0E25\u0E22\u0E41\u0E25\u0E30\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E23\u0E32\u0E22\u0E02\u0E49\u0E2D \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48\u0E04\u0E27\u0E23\u0E17\u0E1A\u0E17\u0E27\u0E19 \u0E17\u0E33\u0E43\u0E2B\u0E21\u0E48\u0E44\u0E14\u0E49\u0E44\u0E21\u0E48\u0E08\u0E33\u0E01\u0E31\u0E14\u0E04\u0E23\u0E31\u0E49\u0E07 \u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E01\u0E47\u0E1A\u0E04\u0E30\u0E41\u0E19\u0E19\u0E17\u0E38\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07"), React.createElement(Button, {
    className: "btn-glow",
    icon: "play",
    onClick: start,
    style: {
      alignSelf: "flex-start"
    }
  }, attempts.length ? "ทำแบบทดสอบอีกครั้ง" : "เริ่มทำแบบทดสอบ"), React.createElement(QuizHistory, {
    attempts: attempts,
    best: best
  }));
  if (phase === "run") {
    const q = order[i];
    const answeredCount = order.length - unanswered.length;
    return React.createElement("div", {
      className: "act",
      ref: topRef
    }, React.createElement("div", {
      className: "quiz-top"
    }, React.createElement("span", {
      className: "qnum"
    }, "\u0E02\u0E49\u0E2D ", i + 1, " / ", order.length), React.createElement(Badge, {
      tone: LEVEL_TONE[q.level]
    }, q.level)), React.createElement("div", {
      style: {
        display: "grid",
        gap: 6
      }
    }, React.createElement(ProgressBar, {
      value: Math.round(answeredCount / order.length * 100),
      label: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48\u0E15\u0E2D\u0E1A\u0E41\u0E25\u0E49\u0E27"
    }), React.createElement("span", {
      className: "hint"
    }, "\u0E15\u0E2D\u0E1A\u0E41\u0E25\u0E49\u0E27 ", answeredCount, "/", order.length, " \u0E02\u0E49\u0E2D")), React.createElement("fieldset", {
      className: "q-card quiz-q",
      key: q.id
    }, React.createElement("legend", {
      className: "qtext"
    }, q.q), q.code && React.createElement(CodeBlock, {
      code: q.code
    }), React.createElement("div", {
      className: "opts col"
    }, q.opts.map((o, k) => React.createElement("button", {
      key: o.id,
      type: "button",
      className: "opt",
      "aria-pressed": ans[q.id] === o.id,
      onClick: () => {
        setAns(s => ({
          ...s,
          [q.id]: o.id
        }));
        setWarn(false);
      }
    }, React.createElement("span", {
      className: "opt-letter"
    }, LETTERS[k]), React.createElement("span", {
      style: {
        flex: 1
      }
    }, o.text))))), React.createElement("div", {
      className: "step-nav"
    }, React.createElement(Button, {
      variant: "ghost",
      icon: "chevL",
      disabled: i === 0,
      onClick: () => setI(i - 1)
    }, "\u0E02\u0E49\u0E2D\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32"), i < order.length - 1 ? React.createElement(Button, {
      iconRight: "chevR",
      onClick: () => setI(i + 1)
    }, "\u0E02\u0E49\u0E2D\u0E16\u0E31\u0E14\u0E44\u0E1B") : React.createElement(Button, {
      icon: "check",
      className: "btn-glow",
      onClick: submit
    }, "\u0E2A\u0E48\u0E07\u0E04\u0E33\u0E15\u0E2D\u0E1A")), React.createElement("div", {
      style: {
        display: "grid",
        gap: 8
      }
    }, React.createElement("span", {
      className: "hint"
    }, "\u0E44\u0E1B\u0E22\u0E31\u0E07\u0E02\u0E49\u0E2D"), React.createElement("div", {
      className: "palette"
    }, order.map((x, k) => React.createElement("button", {
      key: x.id,
      type: "button",
      className: ans[x.id] ? "ans" : "",
      "aria-current": k === i ? "true" : undefined,
      "aria-label": `ข้อ ${k + 1} ${ans[x.id] ? "ตอบแล้ว" : "ยังไม่ตอบ"}`,
      onClick: () => setI(k)
    }, k + 1)))), i < order.length - 1 && React.createElement(Button, {
      variant: "ghost",
      icon: "check",
      onClick: submit,
      style: {
        alignSelf: "flex-start"
      }
    }, "\u0E2A\u0E48\u0E07\u0E04\u0E33\u0E15\u0E2D\u0E1A (", answeredCount, "/", order.length, ")"), warn && unanswered.length > 0 && React.createElement("div", {
      className: "form-err",
      role: "alert"
    }, React.createElement(Icon, {
      name: "alert",
      size: 18
    }), React.createElement("span", null, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E2D\u0E1A ", unanswered.length, " \u0E02\u0E49\u0E2D: ", unanswered.map(k => React.createElement("button", {
      key: k,
      type: "button",
      className: "link-btn",
      onClick: () => {
        setI(k);
        setWarn(false);
      }
    }, "\u0E02\u0E49\u0E2D ", k + 1)), " \u0E15\u0E2D\u0E1A\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A\u0E01\u0E48\u0E2D\u0E19\u0E2A\u0E48\u0E07")));
  }
  const wrongQs = order.filter(q => result.answers[q.id] !== q.answer);
  const reviewLessons = [...new Set(wrongQs.map(q => q.lesson))];
  const shown = onlyWrong ? wrongQs : order;
  return React.createElement("div", {
    className: "act",
    ref: topRef
  }, React.createElement("div", {
    className: "quiz-result " + (result.passed ? "pass" : "fail")
  }, React.createElement(ProgressRing, {
    value: result.percent,
    size: 96,
    stroke: 9,
    label: "\u0E04\u0E30\u0E41\u0E19\u0E19\u0E41\u0E1A\u0E1A\u0E17\u0E14\u0E2A\u0E2D\u0E1A"
  }), React.createElement("div", {
    style: {
      display: "grid",
      gap: 6,
      minWidth: 0,
      flex: "1 1 240px"
    }
  }, React.createElement("span", {
    className: "eyebrow"
  }, "\u0E1C\u0E25\u0E41\u0E1A\u0E1A\u0E17\u0E14\u0E2A\u0E2D\u0E1A"), React.createElement("strong", {
    style: {
      fontSize: 26
    },
    className: "mono"
  }, result.correct, " / ", result.total, " \u0E04\u0E30\u0E41\u0E19\u0E19"), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, result.passed ? React.createElement(Badge, {
    tone: "ok",
    dot: true
  }, "\u0E1C\u0E48\u0E32\u0E19\u0E40\u0E01\u0E13\u0E11\u0E4C ", passPct, "%") : React.createElement(Badge, {
    tone: "demo",
    dot: true
  }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E1C\u0E48\u0E32\u0E19 \u0E15\u0E49\u0E2D\u0E07\u0E44\u0E14\u0E49 ", need, " \u0E02\u0E49\u0E2D\u0E02\u0E36\u0E49\u0E19\u0E44\u0E1B"), React.createElement(Badge, null, React.createElement(Icon, {
    name: "clock",
    size: 12
  }), "\u0E43\u0E0A\u0E49\u0E40\u0E27\u0E25\u0E32 ", fmtDuration(result.durationSec), " \u0E19\u0E32\u0E17\u0E35"))), React.createElement("div", {
    className: "bot",
    style: {
      width: 90
    }
  }, React.createElement(AIraBot, {
    mood: result.passed ? "cheer" : "think",
    float: false,
    title: ""
  }))), React.createElement("div", {
    className: "q-card",
    role: "status"
  }, result.passed ? React.createElement(React.Fragment, null, React.createElement("strong", null, "พี่ AIra ขอแสดงความยินดีด้วย! ได้ ", result.correct, "/", result.total, " คะแนน"), React.createElement("span", null, "เธอเข้าใจเนื้อหาหน่วยนี้ดีมาก พี่ภูมิใจในตัวเธอนะ")) : React.createElement(React.Fragment, null, React.createElement("strong", null, "ได้ ", result.correct, "/", result.total, " คะแนน พี่ AIra เป็นกำลังใจให้นะ"), React.createElement("span", null, "อีกแค่ ", Math.max(need - result.correct, 1), " คะแนนก็ผ่านแล้ว ลองอ่านคำอธิบายข้อที่ผิดด้านล่าง แล้วทำใหม่ได้เลย"), React.createElement("span", null, "ข้อที่ตอบผิด: ", wrongQs.map(q => "ข้อ " + (order.indexOf(q) + 1)).join(", ")))), reviewLessons.length > 0 && React.createElement("div", {
    className: "q-card"
  }, React.createElement("strong", null, "\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48\u0E04\u0E27\u0E23\u0E17\u0E1A\u0E17\u0E27\u0E19"), React.createElement("span", {
    className: "hint"
  }, "\u0E08\u0E32\u0E01\u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48\u0E15\u0E2D\u0E1A\u0E1C\u0E34\u0E14 ", wrongQs.length, " \u0E02\u0E49\u0E2D"), React.createElement("div", {
    className: "opts"
  }, reviewLessons.map(l => React.createElement("button", {
    key: l,
    type: "button",
    className: "opt",
    onClick: () => onGoLesson(l)
  }, React.createElement(Icon, {
    name: "book",
    size: 16
  }), lessonTitle(l))))), React.createElement("div", {
    className: "act-head"
  }, React.createElement("h3", {
    className: "sub"
  }, "\u0E40\u0E09\u0E25\u0E22\u0E41\u0E25\u0E30\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22"), React.createElement("div", {
    className: "seg",
    role: "tablist",
    "aria-label": "\u0E15\u0E31\u0E27\u0E01\u0E23\u0E2D\u0E07\u0E40\u0E09\u0E25\u0E22"
  }, React.createElement("button", {
    type: "button",
    role: "tab",
    "aria-selected": onlyWrong,
    onClick: () => setOnlyWrong(true)
  }, "\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48\u0E1C\u0E34\u0E14 (", wrongQs.length, ")"), React.createElement("button", {
    type: "button",
    role: "tab",
    "aria-selected": !onlyWrong,
    onClick: () => setOnlyWrong(false)
  }, "\u0E17\u0E38\u0E01\u0E02\u0E49\u0E2D (", order.length, ")"))), shown.length === 0 && React.createElement(Feedback, {
    tone: "good",
    title: "\u0E15\u0E2D\u0E1A\u0E16\u0E39\u0E01\u0E17\u0E38\u0E01\u0E02\u0E49\u0E2D!"
  }, "\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21\u0E21\u0E32\u0E01 \u0E25\u0E2D\u0E07\u0E40\u0E25\u0E37\u0E2D\u0E01 \"\u0E17\u0E38\u0E01\u0E02\u0E49\u0E2D\" \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2D\u0E48\u0E32\u0E19\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21"), shown.map(q => {
    const k = order.indexOf(q);
    const mine = result.answers[q.id];
    const ok = mine === q.answer;
    return React.createElement("div", {
      key: q.id,
      className: "q-card " + (ok ? "correct" : "wrong")
    }, React.createElement("div", {
      className: "quiz-top"
    }, React.createElement("span", {
      className: "qnum"
    }, "\u0E02\u0E49\u0E2D ", k + 1), React.createElement(Badge, {
      tone: ok ? "ok" : "",
      dot: true
    }, ok ? "ถูก" : "ผิด")), React.createElement("div", {
      className: "q-title"
    }, q.q), q.code && React.createElement(CodeBlock, {
      code: q.code
    }), React.createElement("div", {
      className: "opts col"
    }, q.opts.map((o, n) => React.createElement("div", {
      key: o.id,
      className: "opt static " + (o.id === q.answer ? "is-correct" : o.id === mine ? "is-wrong" : "")
    }, React.createElement("span", {
      className: "opt-letter"
    }, LETTERS[n]), React.createElement("span", {
      style: {
        flex: 1
      }
    }, o.text), o.id === q.answer && React.createElement("span", {
      className: "q-tag best"
    }, "\u0E40\u0E09\u0E25\u0E22"), o.id === mine && o.id !== q.answer && React.createElement("span", {
      className: "q-tag poor"
    }, "\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E02\u0E2D\u0E07\u0E40\u0E18\u0E2D")))), React.createElement(Feedback, {
      tone: ok ? "good" : "mid",
      title: "\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22"
    }, q.explain), !ok && React.createElement("button", {
      type: "button",
      className: "link-btn",
      onClick: () => onGoLesson(q.lesson)
    }, "\u0E17\u0E1A\u0E17\u0E27\u0E19: ", lessonTitle(q.lesson)));
  }), React.createElement("div", {
    className: "step-nav"
  }, React.createElement(Button, {
    className: "btn-glow",
    icon: "refresh",
    onClick: start
  }, "\u0E17\u0E33\u0E41\u0E1A\u0E1A\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E43\u0E2B\u0E21\u0E48"), React.createElement(Button, {
    variant: "ghost",
    icon: "clock",
    onClick: () => {
      setPhase("intro");
      toTop();
    }
  }, "\u0E14\u0E39\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E17\u0E33\u0E41\u0E1A\u0E1A\u0E17\u0E14\u0E2A\u0E2D\u0E1A")));
}
function QuizHistory({
  attempts,
  best
}) {
  if (!attempts.length) return React.createElement(Feedback, {
    tone: "mid",
    title: "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E17\u0E33\u0E41\u0E1A\u0E1A\u0E17\u0E14\u0E2A\u0E2D\u0E1A"
  }, "\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E17\u0E33\u0E40\u0E2A\u0E23\u0E47\u0E08 \u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E04\u0E30\u0E41\u0E19\u0E19\u0E41\u0E25\u0E30\u0E40\u0E27\u0E25\u0E32\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49\u0E08\u0E30\u0E41\u0E2A\u0E14\u0E07\u0E17\u0E35\u0E48\u0E19\u0E35\u0E48");
  const rows = attempts.map((a, k) => ({
    ...a,
    n: k + 1
  })).reverse();
  return React.createElement("div", {
    className: "q-card"
  }, React.createElement("div", {
    className: "act-head"
  }, React.createElement("strong", null, "\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E17\u0E33\u0E41\u0E1A\u0E1A\u0E17\u0E14\u0E2A\u0E2D\u0E1A"), best && React.createElement(Badge, {
    tone: "ok",
    dot: true
  }, "\u0E14\u0E35\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14 ", best.correct, "/", best.total, " (", best.percent, "%)")), React.createElement("div", {
    className: "table-wrap"
  }, React.createElement("table", {
    className: "hist"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "\u0E04\u0E23\u0E31\u0E49\u0E07\u0E17\u0E35\u0E48"), React.createElement("th", null, "\u0E27\u0E31\u0E19\u0E40\u0E27\u0E25\u0E32"), React.createElement("th", null, "\u0E04\u0E30\u0E41\u0E19\u0E19"), React.createElement("th", null, "\u0E23\u0E49\u0E2D\u0E22\u0E25\u0E30"), React.createElement("th", null, "\u0E40\u0E27\u0E25\u0E32\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49"), React.createElement("th", null, "\u0E1C\u0E25"))), React.createElement("tbody", null, rows.map(a => React.createElement("tr", {
    key: a.at + a.n
  }, React.createElement("td", {
    className: "mono"
  }, a.n), React.createElement("td", null, thaiDateTime(a.at)), React.createElement("td", {
    className: "mono"
  }, a.correct, "/", a.total), React.createElement("td", {
    className: "mono"
  }, a.percent, "%"), React.createElement("td", {
    className: "mono"
  }, a.durationSec !== undefined ? fmtDuration(a.durationSec) : "–"), React.createElement("td", null, a.passed ? React.createElement("span", {
    style: {
      color: "var(--ok)"
    }
  }, "\u0E1C\u0E48\u0E32\u0E19") : React.createElement("span", {
    style: {
      color: "var(--muted)"
    }
  }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E1C\u0E48\u0E32\u0E19"))))))));
}


export {
  QuizRunner,
  QuizHistory
};
