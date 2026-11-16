import React, { useEffect, useRef, useState } from 'react';
import { COURSE } from '../data/courseData.js';
import { useApp } from '../context/AppContext.jsx';
import { useRoute } from '../context/RouteContext.jsx';
import { Icon, AIraBot, GlassCard, Button, Badge, ProgressRing } from '../components/UIPrimitives.jsx';
import { HoloStage } from '../components/BackgroundEffects.jsx';
import { HeroNetwork } from '../components/HeroNetwork.jsx';
import { HeroOrb } from '../components/HeroOrb.jsx';

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


function LoginPage() {
  const { user, summary, login, resume, forgetUser, notify } = useApp();
  const { navigate } = useRoute();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [phase, setPhase] = useState("idle");
  const [welcome, setWelcome] = useState(null);
  const [confirmForget, setConfirmForget] = useState(false);

  const refs = {
    username: useRef(null),
    password: useRef(null)
  };
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const update = k => e => {
    const v = e.target.value;
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k] || errors.form) {
      setErrors(er => {
        const n = { ...er };
        delete n[k];
        delete n.form;
        return n;
      });
    }
  };

  const finish = (loggedUser, back) => {
    const isTeacher = loggedUser.role === 'TEACHER';
    setWelcome({
      name: loggedUser.displayName,
      classroom: loggedUser.classroom,
      role: loggedUser.role,
      back
    });
    setPhase("success");

    notify({
      type: "success",
      bot: "cheer",
      duration: 5200,
      title: back ? `ยินดีต้อนรับกลับมา ${loggedUser.displayName}!` : `ยินดีต้อนรับ ${loggedUser.displayName}!`,
      message: isTeacher
        ? "เข้าสู่ระบบครูผู้สอน กำลังเปิดแดชบอร์ดบริหารจัดการชั้นเรียน..."
        : `เข้าสู่ระบบสำเร็จ (${loggedUser.classroom}) พร้อมพาสำรวจโลก AI แล้ว`
    });

    timer.current = setTimeout(() => {
      navigate(isTeacher ? "teacher" : "home");
    }, 1500);
  };

  const submit = async e => {
    e.preventDefault();
    if (phase !== "idle") return;

    const u = form.username.trim();
    const p = form.password.trim();
    const er = {};
    if (!u) er.username = "กรุณากรอกรหัสประจำตัว (Username)";
    if (!p) er.password = "กรุณากรอกรหัสผ่าน (Password)";

    if (Object.keys(er).length > 0) {
      setErrors(er);
      if (er.username && refs.username.current) refs.username.current.focus();
      else if (er.password && refs.password.current) refs.password.current.focus();
      return;
    }

    setPhase("saving");
    try {
      const loggedUser = await login({ username: u, password: p });
      finish(loggedUser, false);
    } catch (err) {
      setPhase("idle");
      setErrors({
        form: err.message || "รหัสประจำตัวหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง"
      });
      if (refs.password.current) refs.password.current.select();
    }
  };

  const doResume = async () => {
    setPhase("saving");
    try {
      const loggedUser = await resume();
      finish(loggedUser, true);
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
    setForm({ username: "", password: "" });
    setErrors({});
    notify({
      type: "info",
      title: "ออกจากระบบแล้ว",
      message: old ? `ออกจากระบบบัญชี ${old} เรียบร้อยแล้ว` : undefined
    });
    setTimeout(() => refs.username.current && refs.username.current.focus(), 50);
  };

  let card;
  if (phase === "success" && welcome) {
    card = (
      <div className="success" role="status" aria-live="polite">
        <AIraBot mood="cheer" className="bot" />
        <h2>
          {welcome.back ? "ยินดีต้อนรับกลับมา" : "ยินดีต้อนรับ"}{" "}
          <span className="grad-text">{welcome.name}</span>
        </h2>
        <p className="lead" style={{ marginTop: 8 }}>
          {welcome.role === 'TEACHER' ? '👩‍🏫 ครูผู้สอน' : `👨‍🎓 ชั้น ${welcome.classroom}`} · กำลังพาไปหน้าบทเรียน…
        </p>
        <div className="spinner" aria-hidden="true" style={{ marginTop: 20 }} />
      </div>
    );
  } else if (user) {
    const isTeacher = user.role === 'TEACHER';
    card = (
      <>
        <div className="card-head">
          <h2 id="login-title">เรียนต่อจากครั้งก่อน</h2>
          <Badge tone={isTeacher ? "neon" : "ok"}>
            {isTeacher ? "👩‍🏫 ครูผู้สอน" : "👨‍🎓 บัญชีนักเรียน"}
          </Badge>
        </div>

        <div className="returning">
          <span className="avatar-lg" aria-hidden="true">
            {user.displayName.charAt(0)}
          </span>
          <div style={{ minWidth: 0 }}>
            <strong>{user.displayName}</strong>
            <span>
              {user.classroom} {user.no ? `· เลขที่ ${user.no}` : ''} {user.joinedAt ? `· เริ่มเรียน ${thaiDate(user.joinedAt)}` : ''}
            </span>
          </div>
          {!isTeacher && (
            <span style={{ marginLeft: "auto" }}>
              <ProgressRing
                value={summary.overall}
                size={52}
                stroke={6}
                label="ความก้าวหน้ารวม"
              />
            </span>
          )}
        </div>

        {errors.form && (
          <div className="form-err" role="alert">
            <Icon name="alert" size={18} />
            {errors.form}
          </div>
        )}

        <Button
          className="btn-glow"
          icon="login"
          onClick={doResume}
          disabled={phase !== "idle"}
          autoFocus
        >
          {phase === "saving" ? "กำลังเข้าสู่บทเรียน…" : `เรียนต่อในชื่อ ${user.displayName}`}
        </Button>

        {!confirmForget ? (
          <Button
            variant="ghost"
            icon="user"
            onClick={() => setConfirmForget(true)}
            disabled={phase !== "idle"}
          >
            เปลี่ยนผู้เรียน / ออกจากระบบ
          </Button>
        ) : (
          <div className="confirm" role="alertdialog" aria-labelledby="cf-title" aria-describedby="cf-desc">
            <strong id="cf-title">ยืนยันการออกจากระบบ?</strong>
            <p id="cf-desc">
              ออกจากระบบของ <b>{user.displayName}</b> เพื่อเข้าสู่ระบบด้วยรหัสอื่น
            </p>
            <div className="btn-row">
              <Button variant="danger" icon="logout" onClick={doForget}>
                ออกจากระบบ
              </Button>
              <Button variant="ghost" onClick={() => setConfirmForget(false)} autoFocus>
                ยกเลิก
              </Button>
            </div>
          </div>
        )}
      </>
    );
  } else {
    card = (
      <form onSubmit={submit} noValidate aria-labelledby="login-title" style={{ display: "contents" }}>
        <div className="card-head login-card-head">
          <div className="login-head-title-group">
            <span className="login-card-icon-badge" aria-hidden="true">
              <Icon name="lock" size={22} />
            </span>
            <div>
              <h2 id="login-title">เข้าสู่ระบบ</h2>
              <span className="login-card-sub">สำหรับนักเรียนและครู</span>
            </div>
          </div>
        </div>

        {errors.form && (
          <div className="form-err" role="alert">
            <Icon name="alert" size={18} />
            {errors.form}
          </div>
        )}

        {/* Username Field */}
        <div className="field">
          <label htmlFor="f-username">รหัสประจำตัว (Username)</label>
          <div className="login-input">
          <span className="login-input-icon" aria-hidden="true"><Icon name="user" size={18} /></span>
          <input
            id="f-username"
            ref={refs.username}
            className="input"
            value={form.username}
            onChange={update("username")}
            maxLength={30}
            autoComplete="username"
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "e-username" : undefined}
            placeholder="กรอกรหัสประจำตัว"
            autoFocus
          />
          </div>
          {errors.username && (
            <span id="e-username" className="field-err">
              {errors.username}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="field">
          <label htmlFor="f-pass">รหัสผ่าน (Password)</label>
          <div className="login-input">
            <span className="login-input-icon" aria-hidden="true"><Icon name="lock" size={18} /></span>
            <input
              id="f-pass"
              ref={refs.password}
              type={showPassword ? "text" : "password"}
              className="input"
              value={form.password}
              onChange={update("password")}
              maxLength={40}
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "e-pass" : undefined}
              placeholder="กรอกรหัสผ่าน"
              style={{ paddingRight: 42 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              title={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            >
              <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
            </button>
          </div>
          {errors.password && (
            <span id="e-pass" className="field-err">
              {errors.password}
            </span>
          )}
        </div>

        <Button
          type="submit"
          className="btn-glow login-submit-btn"
          icon="login"
          disabled={phase !== "idle"}
          style={{ marginTop: 6 }}
        >
          {phase === "saving" ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
        </Button>

      </form>
    );
  }

  return (
    <div className="login-wrap">
      <div className="login">
        <section className="login-hero" aria-labelledby="welcome-title" data-orb-host>
          <span className="rt-aurora" aria-hidden="true" />
          <HeroNetwork />
          <HeroOrb anchor=".holo-showcase-box" lift={0} px={720} />

          <div className="holo-showcase-box">
            <div className="holo-glow-ring" aria-hidden="true" />
            <HoloStage mood={phase === "success" ? "cheer" : "happy"} />
          </div>

          <h1 id="welcome-title">KruNok AI Academy</h1>
          <p className="th1"><strong>ยินดีต้อนรับสู่โลกแห่งปัญญาประดิษฐ์</strong><span>เรียนรู้ คิดวิเคราะห์ สร้างสรรค์นวัตกรรม AI อย่างมีความรับผิดชอบ</span></p>
          <div className="course-chip">
            <span className="code">{COURSE.code}</span>
            <span className="course-chip-lines">
              <strong className="course-line-title">{COURSE.name}</strong>
              <span className="course-line-level">ชั้น{COURSE.level}</span>
              <span className="course-line-school">โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เชียงราย</span>
            </span>
          </div>
        </section>

        <GlassCard
          pad={false}
          className="login-card"
          aria-labelledby={phase === "success" ? undefined : "login-title"}
        >
          {card}
        </GlassCard>
      </div>
    </div>
  );
}

export default LoginPage;
export { LoginPage };
