import React, { useEffect, useRef, useState } from 'react';
import { COURSE } from '../data/courseData.js';
import { useApp } from '../context/AppContext.jsx';
import { useRoute } from '../context/RouteContext.jsx';
import { Icon, AIraBot, GlassCard, Button, Badge, ProgressRing } from '../components/UIPrimitives.jsx';
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

function NeuralNetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let width = 0;
    let height = 0;

    const COLORS = [
      { r: 109, g: 77, b: 211 },  // Primary #6D4DD3
      { r: 155, g: 135, b: 245 }, // Lavender #9B87F5
      { r: 87, g: 204, b: 242 },  // Cyan #57CCF2
      { r: 89, g: 56, b: 186 }    // Deep Primary #5938BA
    ];

    const nodes = [];
    const mouse = { x: -9999, y: -9999 };

    const initNodes = (w, h) => {
      nodes.length = 0;
      const count = Math.min(62, Math.max(36, Math.floor((w * h) / 22000)));
      for (let i = 0; i < count; i++) {
        const c = COLORS[i % COLORS.length];
        const isHub = i % 6 === 0;
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.42,
          vy: (Math.random() - 0.5) * 0.42,
          r: isHub ? 2.6 + Math.random() * 1.1 : 1.5 + Math.random() * 1.0,
          isHub,
          color: c,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.018 + Math.random() * 0.015
        });
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth || window.innerWidth;
      height = parent.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodes.length === 0) {
        initNodes(width, height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });

    let tick = 0;
    const MAX_DIST = 175;
    const MOUSE_DIST = 190;

    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      // Update node positions
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.phase += n.pulseSpeed;

        if (n.x < -20) n.x = width + 20;
        else if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        else if (n.y > height + 20) n.y = -20;
      }

      // Draw delicate neural edges between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < MAX_DIST * MAX_DIST) {
            const dist = Math.sqrt(distSq);
            const ratio = 1 - dist / MAX_DIST;
            const alpha = ratio * 0.17; // Subtle & delicate
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${a.color.r}, ${a.color.g}, ${a.color.b}, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();

            // Subtle traveling signal pulse on selected hub edges
            if ((i + j) % 11 === 0 && ratio > 0.35) {
              const t = ((tick * 0.006 + i * 0.17) % 1);
              const px = a.x + (b.x - a.x) * t;
              const py = a.y + (b.y - a.y) * t;
              ctx.beginPath();
              ctx.arc(px, py, 1.6, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(14, 165, 233, ${(ratio * 0.38).toFixed(3)})`;
              ctx.fill();
            }
          }
        }

        // Subtle interactive connection to mouse cursor
        const mdx = a.x - mouse.x;
        const mdy = a.y - mouse.y;
        const mDistSq = mdx * mdx + mdy * mdy;
        if (mDistSq < MOUSE_DIST * MOUSE_DIST) {
          const mDist = Math.sqrt(mDistSq);
          const mAlpha = (1 - mDist / MOUSE_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(79, 70, 229, ${mAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }

      // Draw neural nodes & soft halos
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const pulse = 0.5 + 0.5 * Math.sin(n.phase);
        const nodeAlpha = n.isHub ? 0.28 + pulse * 0.14 : 0.18 + pulse * 0.10;

        if (n.isHub) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 3.5 + pulse * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${(0.05 + pulse * 0.04).toFixed(3)})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${nodeAlpha.toFixed(3)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="login-neural-canvas" aria-hidden="true" />;
}

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
              <Icon name="sparkle" size={20} />
            </span>
            <div>
              <h2 id="login-title">เข้าสู่ระบบ</h2>
              <span className="login-card-sub">Student & Teacher Portal</span>
            </div>
          </div>
          <Badge tone="cyan">PCSHSCR</Badge>
        </div>

        <p className="login-card-desc">
          เข้าสู่ระบบด้วยรหัสประจำตัวและรหัสผ่านจากฐานข้อมูลโรงเรียน
        </p>

        {errors.form && (
          <div className="form-err" role="alert">
            <Icon name="alert" size={18} />
            {errors.form}
          </div>
        )}

        {/* Username Field */}
        <div className="field">
          <label htmlFor="f-username">
            <Icon name="user" size={15} style={{ verticalAlign: 'middle', marginRight: 6, color: '#4F46E5' }} />
            รหัสประจำตัว (Username)
          </label>
          <input
            id="f-username"
            ref={refs.username}
            className="input"
            value={form.username}
            onChange={update("username")}
            maxLength={30}
            autoComplete="username"
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "e-username" : "h-username"}
            placeholder="กรอกรหัสประจำตัว"
            autoFocus
          />
          <span id="h-username" className="hint">
            นักเรียน: รหัสประจำตัว 5 หลัก / ครูผู้สอน: รหัสครู
          </span>
          {errors.username && (
            <span id="e-username" className="field-err">
              {errors.username}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="field">
          <label htmlFor="f-pass">
            <Icon name="lock" size={15} style={{ verticalAlign: 'middle', marginRight: 6, color: '#0284C7' }} />
            รหัสผ่าน (Password)
          </label>
          <div style={{ position: "relative" }}>
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
          {phase === "saving" ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ (Sign In)"}
        </Button>

        <div className="login-card-perks" aria-hidden="true">
          <span><Icon name="book" size={13} /> 4 หน่วยการเรียนรู้</span>
          <span><Icon name="cpu" size={13} /> AI Lab โต้ตอบจริง</span>
          <span><Icon name="award" size={13} /> สะสมเหรียญรางวัล</span>
        </div>
      </form>
    );
  }

  return (
    <div className="login-wrap">
      <div className="login-aurora-bg" aria-hidden="true">
        <span className="aurora-orb orb-1" />
        <span className="aurora-orb orb-2" />
        <span className="aurora-orb orb-3" />
      </div>
      <NeuralNetworkBackground />
      <Particles />
      <div className="login">
        <section className="login-hero" aria-labelledby="welcome-title">
          <div className="login-eyebrow-pill">
            <span className="pulse-dot" />
            <span>NEXT-GEN AI LEARNING PLATFORM · PCSHSCR</span>
          </div>

          <div className="holo-showcase-box">
            <div className="holo-glow-ring" aria-hidden="true" />
            <HoloStage mood={phase === "success" ? "cheer" : "happy"} />
          </div>

          <h1 id="welcome-title">
            <span className="w">Welcome to</span>
            <span className="grad-text">KruNok AI Academy</span>
          </h1>
          <p className="th1">ยินดีต้อนรับสู่โลกแห่งปัญญาประดิษฐ์</p>
          <p className="lead">
            เรียนรู้ คิดวิเคราะห์ สร้างสรรค์นวัตกรรม AI อย่างมีความรับผิดชอบ
          </p>
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
