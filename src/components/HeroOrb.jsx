import React, { useEffect, useRef } from 'react';

// A glowing 3D neural sphere behind AIra in the home header ("AIra's brain core").
// Two crystalline shells of nodes joined to their nearest neighbours, drawn with
// custom shaders (noise breathing, soft round points, depth fade) and a bloom pass.
// Click/tap anywhere on the header sends a ripple through the sphere; one also
// fires by itself every few seconds. three.js is loaded lazily after the page.
// Sits only in AIra's corner and fades out before the unit timeline.

const NODE_COLORS = ['#CFF2EC', '#CFF2EC', '#CFF2EC', '#FF6F91', '#B28CFF', '#5FE0B5', '#FFC266'];

const GLSL_MOTION = /* glsl */ `
  uniform float uTime;
  uniform vec3 uPulsePos;
  uniform float uPulseTime;
  attribute float aSeed;
  float wave(vec3 p) {
    float t = uTime - uPulseTime;
    if (t < 0.0 || t > 3.0) return 0.0;
    float d = distance(p, uPulsePos);
    float front = t * 1.6;
    return exp(-pow(d - front, 2.0) * 10.0) * exp(-t * 1.1);
  }
  vec3 moved(vec3 p, out float w) {
    vec3 n = normalize(p);
    float breathe = sin(uTime * 0.9 + aSeed * 6.2831 + p.y * 2.0) * 0.045
                  + sin(uTime * 0.5 + aSeed * 12.0) * 0.025;
    w = wave(p);
    return p + n * (breathe + w * 0.22);
  }
`;

function fibonacciSphere(n, r) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts.push([Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r]);
  }
  return pts;
}

// anchor: element the sphere centres on; lift: px to raise it on wide screens; px: canvas size on wide screens
function HeroOrb({ anchor = ".rt-aira-bot", lift = 55, px = 500 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const [THREE, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = await Promise.all([
        import('three'),
        import('three/examples/jsm/postprocessing/EffectComposer.js'),
        import('three/examples/jsm/postprocessing/RenderPass.js'),
        import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
        import('three/examples/jsm/postprocessing/OutputPass.js')
      ]);
      if (disposed) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
      } catch (e) {
        return; // no WebGL: the header still has its gradient and stars
      }
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const host = canvas.closest('[data-orb-host]');
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 1); // black + CSS screen blend = transparent over the header

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.06);
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
      camera.position.set(0, 0.4, 7);
      const group = new THREE.Group();
      scene.add(group);

      // nodes: an outer shell and an inner core
      const outer = fibonacciSphere(170, 1.55);
      const inner = fibonacciSphere(60, 0.85);
      const pts = outer.concat(inner);
      const pos = new Float32Array(pts.length * 3);
      const col = new Float32Array(pts.length * 3);
      const size = new Float32Array(pts.length);
      const seed = new Float32Array(pts.length);
      const c = new THREE.Color();
      pts.forEach((p, i) => {
        pos.set(p, i * 3);
        c.set(NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)]);
        col.set([c.r, c.g, c.b], i * 3);
        size[i] = i < outer.length ? 5 + Math.random() * 5 : 7 + Math.random() * 4;
        seed[i] = Math.random();
      });

      // connections: each node to its 3 nearest, plus core-to-shell spokes
      const seg = [];
      const segSeed = [];
      const link = (a, b) => { seg.push(...pts[a], ...pts[b]); segSeed.push(seed[a], seed[b]); };
      pts.forEach((p, i) => {
        pts
          .map((q, j) => ({ j, d: (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2 + (q[2] - p[2]) ** 2 }))
          .filter(o => o.j > i)
          .sort((x, y) => x.d - y.d)
          .slice(0, i < outer.length ? 3 : 2)
          .forEach(o => link(i, o.j));
      });
      inner.forEach((_, k) => { if (k % 3 === 0) link(outer.length + k, Math.floor(Math.random() * outer.length)); });

      const uniforms = {
        uTime: { value: 0 },
        uPulsePos: { value: new THREE.Vector3(9, 9, 9) },
        uPulseTime: { value: -10 },
        uPixelRatio: { value: renderer.getPixelRatio() }
      };

      const nodeGeo = new THREE.BufferGeometry();
      nodeGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      nodeGeo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
      nodeGeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
      nodeGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
      const nodeMat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          ${GLSL_MOTION}
          uniform float uPixelRatio;
          attribute vec3 aColor;
          attribute float aSize;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            float w;
            vec3 p = moved(position, w);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = aSize * uPixelRatio * (1.0 + w * 1.6) * (6.0 / -mv.z);
            vColor = mix(aColor, vec3(1.0), w);
            vAlpha = smoothstep(9.5, 5.2, -mv.z);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5) * 2.0;
            if (d > 1.0) discard;
            float a = pow(1.0 - d, 2.0) * vAlpha;
            gl_FragColor = vec4(vColor, a);
          }
        `
      });
      const nodes = new THREE.Points(nodeGeo, nodeMat);

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(seg), 3));
      lineGeo.setAttribute('aSeed', new THREE.BufferAttribute(new Float32Array(segSeed), 1));
      const lineMat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          ${GLSL_MOTION}
          varying float vAlpha;
          varying float vWave;
          void main() {
            float w;
            vec3 p = moved(position, w);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            vWave = w;
            vAlpha = smoothstep(9.5, 5.2, -mv.z);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vAlpha;
          varying float vWave;
          void main() {
            vec3 col = mix(vec3(0.45, 0.9, 0.85), vec3(1.0), vWave);
            gl_FragColor = vec4(col, (0.16 + vWave * 0.7) * vAlpha);
          }
        `
      });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      group.add(lines, nodes);

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.9, 0.55, 0.12);
      composer.addPass(bloom);
      composer.addPass(new OutputPass());

      // size and place the canvas so the sphere centres on AIra
      const place = () => {
        const bot = host?.querySelector(anchor);
        const hb = host?.getBoundingClientRect();
        const small = window.innerWidth <= 760;
        const s = small ? 320 : px;
        canvas.style.width = `${s}px`;
        canvas.style.height = `${s}px`;
        if (bot && hb) {
          const r = bot.getBoundingClientRect();
          canvas.style.left = `${r.left - hb.left + r.width / 2 - s / 2}px`;
          canvas.style.top = `${r.top - hb.top + r.height / 2 - s / 2 - (small ? 0 : lift)}px`;
        }
        renderer.setSize(s, s, false);
        composer.setSize(s, s);
        bloom.resolution.set(s, s);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
      };
      place();

      // ripples: click/tap on the header (not on its buttons), plus an occasional self-pulse
      const ray = new THREE.Raycaster();
      const sphere = new THREE.Sphere(new THREE.Vector3(), 1.55);
      const hit = new THREE.Vector3();
      const pulseAt = (localPoint) => {
        uniforms.uPulsePos.value.copy(localPoint);
        uniforms.uPulseTime.value = uniforms.uTime.value;
      };
      const onDown = (ev) => {
        if (ev.target.closest('button, a, input')) return;
        const b = canvas.getBoundingClientRect();
        const x = ((ev.clientX - b.left) / b.width) * 2 - 1;
        const y = -((ev.clientY - b.top) / b.height) * 2 + 1;
        ray.setFromCamera(new THREE.Vector2(x, y), camera);
        const local = ray.ray.intersectSphere(sphere, hit)
          ? group.worldToLocal(hit.clone())
          : new THREE.Vector3().setFromSphericalCoords(1.55, Math.random() * Math.PI, Math.random() * Math.PI * 2);
        pulseAt(local);
      };
      host?.addEventListener('pointerdown', onDown);

      const pointer = { x: 0, y: 0 };
      const onMove = (ev) => {
        pointer.x = (ev.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (ev.clientY / window.innerHeight) * 2 - 1;
      };
      host?.addEventListener('pointermove', onMove);

      let raf = 0, visible = true, last = performance.now(), nextAuto = 2.5;
      const frame = (now) => {
        raf = 0;
        if (!visible || document.hidden) return;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        uniforms.uTime.value += dt;
        group.rotation.y += dt * 0.22;
        group.rotation.x += ((pointer.y * 0.25) - group.rotation.x) * 0.04;
        group.rotation.z += ((-pointer.x * 0.12) - group.rotation.z) * 0.04;
        if (uniforms.uTime.value > nextAuto) {
          pulseAt(new THREE.Vector3().setFromSphericalCoords(1.55, Math.random() * Math.PI, Math.random() * Math.PI * 2));
          nextAuto = uniforms.uTime.value + 4 + Math.random() * 2;
        }
        composer.render();
        raf = requestAnimationFrame(frame);
      };
      const start = () => { if (!raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame); } };

      uniforms.uTime.value = 1.2;
      composer.render();
      start();

      const ro = new ResizeObserver(() => { place(); if (reduce) composer.render(); });
      ro.observe(host || canvas);
      const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); });
      io.observe(canvas);
      const onVis = () => { if (!document.hidden) start(); };
      document.addEventListener('visibilitychange', onVis);
      canvas.classList.add('is-ready');

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        document.removeEventListener('visibilitychange', onVis);
        host?.removeEventListener('pointerdown', onDown);
        host?.removeEventListener('pointermove', onMove);
        nodeGeo.dispose(); lineGeo.dispose(); nodeMat.dispose(); lineMat.dispose();
        composer.dispose?.();
        renderer.dispose();
      };
      if (disposed) cleanup();
    })();

    return () => { disposed = true; cleanup(); };
  }, []);

  return <canvas ref={ref} className="rt-orb" aria-hidden="true" />;
}

export { HeroOrb };
