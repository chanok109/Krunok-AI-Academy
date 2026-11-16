import React, { useEffect, useRef } from 'react';

// Home header background (Canvas 2D): a glowing plexus network on dark plum.
// - A low-poly mesh of white nodes with magenta glow fills the right side and
//   thins out to the left, a few stray nodes drifting further in.
// - Soft out-of-focus magenta blobs sit behind it for depth.
// - Nodes wander and the whole mesh sways slowly; signal pulses hop along the
//   lines and nodes flash as they arrive; the mesh brightens near the pointer.
// - Lines brighten as nodes
//   come close and fade as they part; some nodes swell softly now and then.
// - Text, buttons, stations, facts and AIra's bubble keep a dark margin.
// - Fewer nodes on narrow screens; pauses off screen or in a hidden tab;
//   one still frame under prefers-reduced-motion.

const QUIET = ['.rt-course', '.rt-hero h1', '.rt-sub', '.rt-actions > *', '.rt-line button', '.rt-facts > div', '.rt-aira p'];

function rand(a, b) { return a + Math.random() * (b - a); }

function glow(rgb) {
  const s = 64, c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  r.addColorStop(0, `rgba(${rgb}, 1)`);
  r.addColorStop(0.35, `rgba(${rgb}, 0.45)`);
  r.addColorStop(1, `rgba(${rgb}, 0)`);
  g.fillStyle = r;
  g.fillRect(0, 0, s, s);
  return c;
}

function HeroCircuit() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const host = canvas.closest('.rt-hero');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const halo = glow('201, 181, 224');
    const blob = glow('96, 97, 182');
    let w = 0, h = 0, quiet = [], nodes = [], edges = [], blobs = [], raf = 0, visible = true, last = 0, t = 0, narrow = false;
    let adj = [], pulses = [];
    const pointer = { x: -9999, y: -9999 };

    const show = (x, y) => {
      // full on the right, fading to nothing toward the left (gentler on phones)
      let k = narrow ? Math.min(1, Math.max(0, (x / w - 0.1) / 0.6)) : Math.min(1, Math.max(0, (x / w - 0.32) / 0.3));
      k = k * k * (3 - 2 * k);
      for (const q of quiet) {
        const dx = Math.max(q.l - x, 0, x - q.r), dy = Math.max(q.t - y, 0, y - q.b);
        const d = Math.hypot(dx, dy);
        if (d < 26) k *= 0.06 + 0.94 * (d / 26) ** 2;
      }
      return k;
    };

    const layout = () => {
      const b = canvas.getBoundingClientRect();
      w = b.width; h = b.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      quiet = QUIET.flatMap(sel => [...host.querySelectorAll(sel)]).map(el => {
        const r = el.getBoundingClientRect();
        return { l: r.left - b.left, r: r.right - b.left, t: r.top - b.top, b: r.bottom - b.top };
      });
      narrow = w < 700;
      const gap = narrow ? 78 : 92;

      // jittered grid over the right side → reads as a low-poly mesh
      nodes = [];
      for (let y = -gap / 2; y < h + gap; y += gap * 0.86) {
        for (let x = w * (narrow ? 0.05 : 0.38); x < w + gap; x += gap) {
          const bias = narrow ? 0.85 : Math.min(1, (x / w - 0.38) / 0.35 + 0.2);
          if (Math.random() > bias) continue;
          nodes.push(node(x + rand(-gap, gap) * 0.42, y + rand(-gap, gap) * 0.42));
        }
      }
      // a few strays further left
      for (let i = 0; i < (narrow ? 3 : 7); i++) nodes.push(node(rand(0.3, 0.6) * w, rand(0.1, 0.9) * h));

      // connect each node to its nearest neighbours
      edges = [];
      const seen = new Set();
      nodes.forEach((n, i) => {
        nodes
          .map((m, j) => ({ j, d: (m.bx - n.bx) ** 2 + (m.by - n.by) ** 2 }))
          .filter(o => o.j !== i && o.d < (gap * 1.7) ** 2)
          .sort((a, c) => a.d - c.d)
          .slice(0, 4)
          .forEach(({ j }) => {
            const key = i < j ? i * 100000 + j : j * 100000 + i;
            if (!seen.has(key)) { seen.add(key); edges.push([i, j]); }
          });
      });

      adj = nodes.map(() => []);
      edges.forEach(([i, j], e) => { adj[i].push(e); adj[j].push(e); });
      // signal pulses that hop along the lines from node to node
      pulses = Array.from({ length: narrow ? 5 : 12 }, () => newPulse());

      blobs = Array.from({ length: narrow ? 8 : 16 }, () => ({
        bx: rand(narrow ? 0.1 : 0.4, 1) * w, by: rand(0, 1) * h, r: rand(40, 120),
        ph: rand(0, 6.28), a: rand(0.12, 0.28)
      }));
    };

    function newPulse() {
      const e = Math.floor(Math.random() * edges.length);
      return { e, dir: Math.random() < 0.5 ? 1 : -1, s: Math.random(), v: rand(0.0007, 0.0013) };
    }

    function node(x, y) {
      return {
        bx: x, by: y, ax: rand(10, 22), ay: rand(8, 18),
        fx: rand(0.00028, 0.0006), fy: rand(0.00024, 0.00055), ph: rand(0, 6.28),
        r: Math.random() < 0.25 ? rand(2.6, 3.6) : rand(1.4, 2.4),
        tw: rand(0.0003, 0.0008), x, y, k: 1, flash: -1e9
      };
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // depth: blurred magenta glow behind the mesh
      for (const bl of blobs) {
        const x = bl.bx + Math.sin(t * 0.00008 + bl.ph) * 20;
        const y = bl.by + Math.cos(t * 0.00007 + bl.ph) * 16;
        ctx.globalAlpha = bl.a * show(x, y);
        ctx.drawImage(blob, x - bl.r, y - bl.r, bl.r * 2, bl.r * 2);
      }

      // the whole mesh sways slowly around a point on the right
      const ang = Math.sin(t * 0.00016) * 0.05, ca = Math.cos(ang), sa = Math.sin(ang);
      const ox = w * 0.78, oy = h * 0.5, drift = Math.sin(t * 0.0001) * 14;
      for (const n of nodes) {
        const x = n.bx + Math.sin(t * n.fx + n.ph) * n.ax - ox;
        const y = n.by + Math.cos(t * n.fy + n.ph) * n.ay - oy;
        n.x = ox + x * ca - y * sa + drift;
        n.y = oy + x * sa + y * ca;
        n.k = show(n.x, n.y);
        // brighten near the pointer
        n.near = Math.max(0, 1 - Math.hypot(n.x - pointer.x, n.y - pointer.y) / 160);
      }

      // lines: magenta glow under a thin white-pink core, brighter when short
      ctx.lineCap = 'round';
      for (const [i, j] of edges) {
        const a = nodes[i], c = nodes[j];
        const k = Math.min(a.k, c.k) * (1 + Math.min(a.near, c.near) * 0.8);
        if (k < 0.03) continue;
        const d = Math.hypot(a.x - c.x, a.y - c.y);
        const f = Math.max(0, 1 - d / 190);
        ctx.globalAlpha = k * (0.28 + f * 0.32);
        ctx.strokeStyle = '#8C8FE0';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke();
        ctx.globalAlpha = k * (0.6 + f * 0.4);
        ctx.strokeStyle = '#F1EAFF';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke();
      }

      // nodes: magenta halo + white core; an occasional soft swell
      for (const n of nodes) {
        if (n.k < 0.03) continue;
        const fl = Math.max(0, 1 - (t - n.flash) / 700);
        const sw = Math.max(Math.pow(Math.max(0, Math.sin(t * n.tw + n.ph)), 6), fl, n.near * 0.8);
        const hs = n.r * (9 + sw * 7);
        ctx.globalAlpha = n.k * (0.8 + sw * 0.2);
        ctx.drawImage(halo, n.x - hs / 2, n.y - hs / 2, hs, hs);
        ctx.globalAlpha = n.k;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (0.75 + sw * 0.35), 0, Math.PI * 2); ctx.fill();
      }

      // pulses: a bright packet with a short tail
      for (const p of pulses) {
        const [i, j] = edges[p.e] || [];
        if (i === undefined) continue;
        const a = p.dir > 0 ? nodes[i] : nodes[j], c = p.dir > 0 ? nodes[j] : nodes[i];
        const k = Math.min(a.k, c.k);
        if (k < 0.05) continue;
        for (let q = 0; q < 4; q++) {
          const s = Math.max(0, p.s - q * 0.06);
          const x = a.x + (c.x - a.x) * s, y = a.y + (c.y - a.y) * s;
          const size = 16 - q * 3;
          ctx.globalAlpha = k * (1 - q * 0.25);
          ctx.drawImage(halo, x - size / 2, y - size / 2, size, size);
        }
        const x = a.x + (c.x - a.x) * p.s, y = a.y + (c.y - a.y) * p.s;
        ctx.globalAlpha = k;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min(now - (last || now), 50);
      t += dt;
      last = now;
      if (edges.length) for (const p of pulses) {
        p.s += p.v * dt;
        if (p.s < 1) continue;
        // arrived: flash the node and hop onto another line from it
        const [i, j] = edges[p.e];
        const at = p.dir > 0 ? j : i;
        nodes[at].flash = t;
        const next = adj[at].filter(e => e !== p.e);
        p.e = next.length ? next[Math.floor(Math.random() * next.length)] : p.e;
        p.dir = edges[p.e][0] === at ? 1 : -1;
        p.s = 0;
      }
      draw();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (raf || reduce) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    layout();
    t = 3000;
    draw();
    start();

    const ro = new ResizeObserver(() => { layout(); draw(); });
    ro.observe(host);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); });
    io.observe(canvas);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVis);
    const onMove = (ev) => { const b = canvas.getBoundingClientRect(); pointer.x = ev.clientX - b.left; pointer.y = ev.clientY - b.top; };
    const onLeave = () => { pointer.x = pointer.y = -9999; };
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className="rt-circuit" aria-hidden="true" />;
}

export { HeroCircuit };
