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
  const wrongNums = order.map((q, k) => result.answers[q.id] !== q.answer ? k + 1 : 0).filter(Boolean);
  // หลายบทอาจชี้ไปใบความรู้เดียวกัน: แสดงปุ่มละหนึ่งหัวข้อ
  const reviewTopics = [];
  order.filter(q => result.answers[q.id] !== q.answer).forEach(q => {
    const title = lessonTitle(q.lesson);
    if (!reviewTopics.some(t => t.title === title)) reviewTopics.push({ lesson: q.lesson, title });
  });
  const missing = Math.max(need - result.correct, 1);
  return (
    <div className="act" ref={topRef}>
      <div className={"quiz-result qr-hero " + (result.passed ? "pass" : "fail")}>
        <ProgressRing value={result.percent} size={104} stroke={10} label="คะแนนแบบทดสอบ" />
        <div className="qr-hero-main">
          <span className="eyebrow">ผลแบบทดสอบ</span>
          <strong className="qr-score mono">
            {result.correct}<span> / {result.total} คะแนน</span>
          </strong>
          <div className="qr-badges">
            {result.passed
              ? <Badge tone="ok" dot>ผ่านเกณฑ์ {passPct}%</Badge>
              : <Badge tone="demo" dot>ยังไม่ผ่าน ต้องได้ {need} ข้อขึ้นไป</Badge>}
            <Badge><Icon name="clock" size={12} />ใช้เวลา {fmtDuration(result.durationSec)} นาที</Badge>
          </div>
        </div>
      </div>

      <div className={"qr-aira " + (result.passed ? "pass" : "fail")} role="status">
        <div className="qr-aira-bot">
          <AIraBot mood={result.passed ? "cheer" : "think"} float={false} title="" />
        </div>
        <div className="qr-bubble">
          <span className="qr-bubble-name">พี่ AIra</span>
          {result.passed ? (
            <>
              <strong>ยินดีด้วยนะ! ได้ {result.correct}/{result.total} คะแนน</strong>
              <p>เธอเข้าใจเนื้อหาหน่วยนี้ดีมาก พี่ภูมิใจในตัวเธอนะ</p>
            </>
          ) : (
            <>
              <strong>ได้ {result.correct}/{result.total} คะแนน พี่เป็นกำลังใจให้นะ</strong>
              <p>อีกแค่ {missing} คะแนนก็ผ่านแล้ว ลองทบทวนหัวข้อด้านล่าง แล้วกลับมาทำใหม่ได้เลย</p>
              {wrongNums.length > 0 && (
                <div className="qr-wrong">
                  <span>ข้อที่ตอบผิด</span>
                  <ul className="qr-chips" aria-label="ข้อที่ตอบผิด">
                    {wrongNums.map(n => <li key={n}>ข้อ {n}</li>)}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {reviewTopics.length > 0 && (
        <div className="qr-review">
          <div className="qr-review-head">
            <Icon name="book" size={18} />
            <strong>หัวข้อที่ควรทบทวน</strong>
          </div>
          <div className="qr-review-list">
            {reviewTopics.map(t => (
              <button key={t.lesson} type="button" className="qr-review-item" onClick={() => onGoLesson(t.lesson)}>
                <span>{t.title}</span>
                <Icon name="chevR" size={16} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="step-nav">
        <Button className="btn-glow" icon="refresh" onClick={start}>ทำแบบทดสอบใหม่</Button>
        <Button variant="ghost" icon="clock" onClick={() => { setPhase("intro"); toTop(); }}>ดูประวัติการทำแบบทดสอบ</Button>
      </div>
    </div>
  );
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
