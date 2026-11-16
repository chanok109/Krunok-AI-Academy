import React, { useEffect, useRef } from 'react';

// Quiet starfield behind the home header: tiny twinkling dots, no lines, so it
// never competes with the unit timeline. The 3D orb (HeroOrb) sits on top of it.
// Still frame under reduced motion; pauses off screen or in a hidden tab.
function HeroNetwork() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, visible = true, time = 0, stars = [];

    const resize = () => {
      const b = canvas.getBoundingClientRect();
      w = b.width; h = b.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.round((w * h) / 7000) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.85 ? 0.8 : 1.5,
        ph: Math.random() * Math.PI * 2,
        sp: 0.0008 + Math.random() * 0.0016
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#FFFFFF';
      stars.forEach(s => {
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * s.sp + s.ph));
        ctx.globalAlpha = tw * (s.r > 1 ? 0.55 : 0.35);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const step = now => {
      raf = 0;
      if (!visible || document.hidden) return;
      time = now;
      draw();
      raf = requestAnimationFrame(step);
    };
    const start = () => { if (!raf && !reduce) raf = requestAnimationFrame(step); };

    resize();
    draw();
    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); });
    io.observe(canvas);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVis);
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="rt-net" aria-hidden="true" />;
}

export { HeroNetwork };
