import React, { useEffect, useRef, useState } from 'react';
import { COURSE } from '../data/courseData.js';
import { useApp } from '../context/AppContext.jsx';
import { useRoute } from '../context/RouteContext.jsx';
import { Icon, AIraBot, GlassCard, Button, Badge, DemoBadge, ProgressRing } from '../components/UIPrimitives.jsx';
import { Particles, HoloStage } from '../components/BackgroundEffects.jsx';

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
function validateLogin(f) {
  const er = {};
  const name = f.displayName.trim();
  if (!name) er.displayName = "กรอกชื่อที่ใช้แสดงในบทเรียน";
  else if (name.length < 2) er.displayName = "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร";
  else if (name.length > 30) er.displayName = "ชื่อยาวได้ไม่เกิน 30 ตัวอักษร";
  if (f.role === 'STUDENT' && !COURSE.classrooms.includes(f.classroom)) er.classroom = "เลือกห้องเรียนของเธอ";
  if (!f.consent) er.consent = "ติ๊กยอมรับก่อน เพื่อให้ระบบบันทึกความก้าวหน้าในเบราว์เซอร์นี้ได้";
  return er;
}
function LoginPage() {
  const {
    user,
    summary,
    login,
    resume,
    forgetUser,
    notify
  } = useApp();
  const {
    navigate
  } = useRoute();
  const [form, setForm] = useState({
    displayName: "",
    classroom: "",
    role: "STUDENT",
    consent: false
  });
  const [errors, setErrors] = useState({});
  const [phase, setPhase] = useState("idle");
  const [welcome, setWelcome] = useState(null);
  const [confirmForget, setConfirmForget] = useState(false);
  const refs = {
    displayName: useRef(null),
    classroom: useRef(null),
    consent: useRef(null)
  };
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const update = k => e => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(f => ({
      ...f,
      [k]: v
    }));
    if (errors[k]) setErrors(er => {
      const n = {
        ...er
      };
      delete n[k];
      return n;
    });
  };
  const finish = (name, back) => {
    setWelcome({
      name,
      back
    });
    setPhase("success");
    notify({
      type: "success",
      bot: "cheer",
      duration: 5200,
      title: back ? `ยินดีต้อนรับกลับมา ${name}!` : `ยินดีต้อนรับ ${name}!`,
      message: back ? "AIra เก็บความก้าวหน้าเดิมไว้ให้แล้ว ไปเรียนต่อกันเลย" : "AIra พร้อมพาเธอสำรวจโลกปัญญาประดิษฐ์แล้ว"
    });
    timer.current = setTimeout(() => navigate(form.role === 'TEACHER' ? "teacher" : "home"), 1500);
  };
  const submit = async e => {
    e.preventDefault();
    if (phase !== "idle") return;
    const er = validateLogin(form);
    setErrors(er);
    const first = ["displayName", "classroom", "consent"].find(k => er[k]);
    if (first) {
      refs[first].current && refs[first].current.focus();
      return;
    }
    setPhase("saving");
    try {
      const u = await login({
        displayName: form.displayName,
        classroom: form.role === 'TEACHER' ? (form.classroom || 'ม.5/1') : form.classroom,
        role: form.role
      });
      finish(u.displayName, false);
    } catch (err) {
      setPhase("idle");
      setErrors({
        form: "บันทึกข้อมูลไม่สำเร็จ เบราว์เซอร์นี้อาจปิดการเก็บข้อมูลไว้ (เช่น โหมดไม่ระบุตัวตน) ลองเปิดด้วยหน้าต่างปกติ"
      });
    }
  };
  const doResume = async () => {
    setPhase("saving");
    try {
      const u = await resume();
      finish(u.displayName, true);
    } catch (err) {
      setPhase("idle");
      setErrors({
        form: "เข้าเรียนต่อไม่สำเร็จ เบราว์เซอร์นี้อาจปิดการเก็บข้อมูลไว้"
      });
    }
  };
  const doForget = async () => {
    const old = user && user.displayName;
    await forgetUser();
    setConfirmForget(false);
    setForm({
      displayName: "",
      classroom: "",
      consent: false
    });
    setErrors({});
    notify({
      type: "info",
      title: "ล้างข้อมูลผู้เรียนเดิมแล้ว",
      message: old ? `ลบชื่อและความก้าวหน้าของ ${old} ออกจากเครื่องนี้แล้ว` : undefined
    });
    setTimeout(() => refs.displayName.current && refs.displayName.current.focus(), 50);
  };
  let card;
  if (phase === "success" && welcome) {
    card = React.createElement("div", {
      className: "success",
      role: "status",
      "aria-live": "polite"
    }, React.createElement(AIraBot, {
      mood: "cheer",
      className: "bot"
    }), React.createElement("h2", null, welcome.back ? "ยินดีต้อนรับกลับมา" : "ยินดีต้อนรับ", " ", React.createElement("span", {
      className: "grad-text"
    }, welcome.name)), React.createElement("p", {
      className: "lead"
    }, "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1E\u0E32\u0E44\u0E1B\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01\u0E02\u0E2D\u0E07\u0E1A\u0E17\u0E40\u0E23\u0E35\u0E22\u0E19\u2026"), React.createElement("div", {
      className: "spinner",
      "aria-hidden": "true"
    }));
  } else if (user) {
    card = React.createElement(React.Fragment, null, React.createElement("div", {
      className: "card-head"
    }, React.createElement("h2", {
      id: "login-title"
    }, "\u0E40\u0E23\u0E35\u0E22\u0E19\u0E15\u0E48\u0E2D\u0E08\u0E32\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07\u0E01\u0E48\u0E2D\u0E19"), React.createElement(DemoBadge, null)), React.createElement("div", {
      className: "returning"
    }, React.createElement("span", {
      className: "avatar-lg",
      "aria-hidden": "true"
    }, user.displayName.charAt(0)), React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, React.createElement("strong", null, user.displayName), React.createElement("span", null, user.classroom, " \xB7 \u0E40\u0E23\u0E34\u0E48\u0E21\u0E40\u0E23\u0E35\u0E22\u0E19 ", thaiDate(user.joinedAt))), React.createElement("span", {
      style: {
        marginLeft: "auto"
      }
    }, React.createElement(ProgressRing, {
      value: summary.overall,
      size: 52,
      stroke: 6,
      label: "\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E23\u0E27\u0E21"
    }))), errors.form && React.createElement("div", {
      className: "form-err",
      role: "alert"
    }, React.createElement(Icon, {
      name: "alert",
      size: 18
    }), errors.form), React.createElement(Button, {
      className: "btn-glow",
      icon: "login",
      onClick: doResume,
      disabled: phase !== "idle",
      autoFocus: true
    }, phase === "saving" ? "กำลังเข้าสู่บทเรียน…" : `เรียนต่อในชื่อ ${user.displayName}`), !confirmForget ? React.createElement(Button, {
      variant: "ghost",
      icon: "user",
      onClick: () => setConfirmForget(true),
      disabled: phase !== "idle"
    }, "\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E1C\u0E39\u0E49\u0E40\u0E23\u0E35\u0E22\u0E19 / \u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E2B\u0E21\u0E48") : React.createElement("div", {
      className: "confirm",
      role: "alertdialog",
      "aria-labelledby": "cf-title",
      "aria-describedby": "cf-desc"
    }, React.createElement("strong", {
      id: "cf-title"
    }, "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E2B\u0E21\u0E48?"), React.createElement("p", {
      id: "cf-desc"
    }, "\u0E0A\u0E37\u0E48\u0E2D ", React.createElement("b", null, user.displayName), " \u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E38\u0E01\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E17\u0E35\u0E48\u0E40\u0E01\u0E47\u0E1A\u0E43\u0E19\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E19\u0E35\u0E49\u0E08\u0E30\u0E16\u0E39\u0E01\u0E25\u0E1A \u0E41\u0E25\u0E30\u0E01\u0E39\u0E49\u0E04\u0E37\u0E19\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49"), React.createElement("div", {
      className: "btn-row"
    }, React.createElement(Button, {
      variant: "danger",
      icon: "refresh",
      onClick: doForget
    }, "\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E41\u0E25\u0E30\u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E2B\u0E21\u0E48"), React.createElement(Button, {
      variant: "ghost",
      onClick: () => setConfirmForget(false),
      autoFocus: true
    }, "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01"))), React.createElement(DemoLimits, null));
  } else {
    card = React.createElement("form", {
      onSubmit: submit,
      noValidate: true,
      "aria-labelledby": "login-title",
      style: {
        display: "contents"
      }
    }, React.createElement("div", {
      className: "card-head"
    }, React.createElement("h2", {
      id: "login-title"
    }, "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E1A\u0E17\u0E40\u0E23\u0E35\u0E22\u0E19"), React.createElement(DemoBadge, null)), errors.form && React.createElement("div", {
      className: "form-err",
      role: "alert"
    }, React.createElement(Icon, {
      name: "alert",
      size: 18
    }), errors.form), React.createElement("div", {
      className: "field",
      style: { marginBottom: 14 }
    }, React.createElement("label", {
      style: { display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }
    }, "บทบาทผู้ใช้งาน (Role)"), React.createElement("div", {
      style: { display: "flex", gap: 10 }
    }, React.createElement("button", {
      type: "button",
      className: `btn ${form.role === 'STUDENT' ? 'btn-primary' : 'btn-ghost'}`,
      style: { flex: 1, padding: "8px 12px", fontSize: 13 },
      onClick: () => setForm(f => ({ ...f, role: 'STUDENT' }))
    }, "👨‍🎓 นักเรียน (ม.5)"), React.createElement("button", {
      type: "button",
      className: `btn ${form.role === 'TEACHER' ? 'btn-primary' : 'btn-ghost'}`,
      style: { flex: 1, padding: "8px 12px", fontSize: 13 },
      onClick: () => setForm(f => ({ ...f, role: 'TEACHER' }))
    }, "👩‍🏫 ครูผู้สอน (Teacher)"))), React.createElement("div", {
      className: "field"
    }, React.createElement("label", {
      htmlFor: "f-display"
    }, form.role === 'TEACHER' ? "ชื่อครูผู้สอน" : "ชื่อที่ใช้แสดงในบทเรียน"), React.createElement("input", {
      id: "f-display",
      ref: refs.displayName,
      className: "input",
      value: form.displayName,
      onChange: update("displayName"),
      maxLength: 40,
      autoComplete: "nickname",
      "aria-invalid": !!errors.displayName,
      "aria-describedby": errors.displayName ? "e-display h-display" : "h-display",
      placeholder: "\u0E40\u0E0A\u0E48\u0E19 \u0E44\u0E2D\u0E23\u0E32, Neo, \u0E19\u0E49\u0E2D\u0E07\u0E1F\u0E49\u0E32"
    }), React.createElement("span", {
      id: "h-display",
      className: "hint"
    }, "\u0E43\u0E0A\u0E49\u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E48\u0E19\u0E2B\u0E23\u0E37\u0E2D\u0E19\u0E32\u0E21\u0E41\u0E1D\u0E07\u0E44\u0E14\u0E49 \u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E0A\u0E37\u0E48\u0E2D\u0E08\u0E23\u0E34\u0E07"), errors.displayName && React.createElement("span", {
      id: "e-display",
      className: "field-err"
    }, errors.displayName)), React.createElement("div", {
      className: "field"
    }, React.createElement("label", {
      htmlFor: "f-class"
    }, "\u0E2B\u0E49\u0E2D\u0E07\u0E40\u0E23\u0E35\u0E22\u0E19"), React.createElement("select", {
      id: "f-class",
      ref: refs.classroom,
      className: "input",
      value: form.classroom,
      onChange: update("classroom"),
      "aria-invalid": !!errors.classroom,
      "aria-describedby": errors.classroom ? "e-class" : undefined
    }, React.createElement("option", {
      value: ""
    }, "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2B\u0E49\u0E2D\u0E07\u0E40\u0E23\u0E35\u0E22\u0E19"), COURSE.classrooms.map(r => React.createElement("option", {
      key: r,
      value: r
    }, r))), errors.classroom && React.createElement("span", {
      id: "e-class",
      className: "field-err"
    }, errors.classroom)), React.createElement("div", {
      className: "field"
    }, React.createElement("label", {
      className: "check",
      htmlFor: "f-consent",
      "data-invalid": !!errors.consent
    }, React.createElement("input", {
      id: "f-consent",
      ref: refs.consent,
      type: "checkbox",
      checked: form.consent,
      onChange: update("consent"),
      "aria-invalid": !!errors.consent,
      "aria-describedby": errors.consent ? "e-consent" : undefined
    }), React.createElement("span", null, "\u0E23\u0E31\u0E1A\u0E17\u0E23\u0E32\u0E1A\u0E27\u0E48\u0E32\u0E0A\u0E37\u0E48\u0E2D\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32\u0E08\u0E30\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49 ", React.createElement("b", null, "\u0E43\u0E19\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E19\u0E35\u0E49\u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19"), " (\u0E42\u0E2B\u0E21\u0E14\u0E17\u0E14\u0E25\u0E2D\u0E07) \u0E16\u0E49\u0E32\u0E25\u0E49\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07 \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E08\u0E30\u0E44\u0E21\u0E48\u0E15\u0E32\u0E21\u0E44\u0E1B")), errors.consent && React.createElement("span", {
      id: "e-consent",
      className: "field-err"
    }, errors.consent)), React.createElement(Button, {
      type: "submit",
      className: "btn-glow",
      icon: "login",
      disabled: phase !== "idle"
    }, phase === "saving" ? "กำลังบันทึก…" : "เข้าสู่บทเรียน"), React.createElement(DemoLimits, null));
  }
  return React.createElement("div", {
    className: "login-wrap"
  }, React.createElement(Particles, null), React.createElement("div", {
    className: "login"
  }, React.createElement("section", {
    className: "login-hero",
    "aria-labelledby": "welcome-title"
  }, React.createElement(HoloStage, {
    mood: phase === "success" ? "cheer" : "happy"
  }), React.createElement("h1", {
    id: "welcome-title"
  }, React.createElement("span", {
    className: "w"
  }, "Welcome to"), React.createElement("span", {
    className: "grad-text"
  }, "KruNok AI Academy")), React.createElement("p", {
    className: "th1"
  }, "\u0E22\u0E34\u0E19\u0E14\u0E35\u0E15\u0E49\u0E2D\u0E19\u0E23\u0E31\u0E1A\u0E2A\u0E39\u0E48\u0E42\u0E25\u0E01\u0E41\u0E2B\u0E48\u0E07\u0E1B\u0E31\u0E0D\u0E0D\u0E32\u0E1B\u0E23\u0E30\u0E14\u0E34\u0E29\u0E10\u0E4C"), React.createElement("p", {
    className: "lead"
  }, "\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49 \u0E04\u0E34\u0E14\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C \u0E2A\u0E23\u0E49\u0E32\u0E07\u0E2A\u0E23\u0E23\u0E04\u0E4C\u0E19\u0E27\u0E31\u0E15\u0E01\u0E23\u0E23\u0E21 AI \u0E2D\u0E22\u0E48\u0E32\u0E07\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E23\u0E31\u0E1A\u0E1C\u0E34\u0E14\u0E0A\u0E2D\u0E1A"), React.createElement("div", {
    className: "course-chip"
  }, React.createElement("span", {
    className: "code"
  }, COURSE.code), React.createElement("span", null, COURSE.name, React.createElement("small", null, "\u0E0A\u0E31\u0E49\u0E19", COURSE.level)))), React.createElement(GlassCard, {
    pad: false,
    className: "login-card",
    "aria-labelledby": phase === "success" ? undefined : "login-title"
  }, card)));
}
function DemoLimits() {
  return React.createElement("ul", {
    className: "limits",
    "aria-label": "\u0E02\u0E49\u0E2D\u0E08\u0E33\u0E01\u0E31\u0E14\u0E02\u0E2D\u0E07\u0E42\u0E2B\u0E21\u0E14\u0E17\u0E14\u0E25\u0E2D\u0E07"
  }, React.createElement("li", null, React.createElement(Icon, {
    name: "info",
    size: 14
  }), "\u0E42\u0E2B\u0E21\u0E14\u0E17\u0E14\u0E25\u0E2D\u0E07: \u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E41\u0E25\u0E30\u0E44\u0E21\u0E48\u0E21\u0E35\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E15\u0E31\u0E27\u0E15\u0E19 \u0E43\u0E04\u0E23\u0E43\u0E0A\u0E49\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E19\u0E35\u0E49\u0E01\u0E47\u0E40\u0E2B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E14\u0E49"), React.createElement("li", null, React.createElement(Icon, {
    name: "info",
    size: 14
  }), "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E1B\u0E40\u0E0B\u0E34\u0E23\u0E4C\u0E1F\u0E40\u0E27\u0E2D\u0E23\u0E4C\u0E2B\u0E23\u0E37\u0E2D Google Sheets \u0E04\u0E23\u0E39\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E40\u0E2B\u0E47\u0E19\u0E04\u0E30\u0E41\u0E19\u0E19\u0E08\u0E32\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49"));
}


export default LoginPage;
export { LoginPage };
