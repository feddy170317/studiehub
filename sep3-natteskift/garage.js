// Natteskift 3D: værkstedet (garage-mode). Agent C.
// Klassisk script uden moduler. Kræver THREE r128 + OrbitControls og window.SNE (se KONTRAKT.md).
// API: Garage.init(SNE), Garage.open({ onClose }), Garage.isOpen(), Garage.frame(dtReal), Garage.resize(w, h), Garage.close()
(function () {
  'use strict';
  let SNE = null, THREE = null, RND = null;
  let scene = null, camera = null, controls = null, world = null, floorGroup = null, robotRoot = null, robot = null, ttFloor = null;
  let reflRT = null, floorMat = null, ledMats = [], snow = null, snowIn = null, cones = [], glowSprites = [], chargerLeds = null, underLight = null;
  let inited = false, isOpen = false, onClose = null, root = null;
  let parts = [], partById = {}, allMeshes = [], wheelInfo = [], plowMeshes = [], ballastGroup = null, guide = null;
  let bodyBox = null, robotSize = null, defTarget = null, defDist = 4.2;
  const st = {
    E: 0, Et: 0, heat: false, sel: null, hover: null, ttAng: 0.6, ttVel: 0, idle: 0, t: 0,
    camTween: null, anim: null, dispT: 0, dispKr: 0, dispMin: 0, snowMul: 1, snowT: 0, keys: {}, frameN: 0,
    fps: 0, fpsAcc: 0, fpsN: 0, lastLook: '', tab: null, sheet: '', mouse: null, down: null, tireShown: null,
    ballastShown: -1, dentShown: -1, saved: null, exiting: false,
  };
  const listeners = [];
  const OPT = { mirror: true };
  const D2R = Math.PI / 180;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const lerp = (a, b, t) => a + (b - a) * t;
  const eio = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const eout = t => 1 - Math.pow(1 - t, 3);
  const ein = t => t * t * t;
  const eback = t => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const f0 = x => Math.round(x).toLocaleString('da-DK');
  const f1 = x => x.toFixed(1).replace('.', ',');
  const f2 = x => x.toFixed(2).replace('.', ',');
  const kr = x => Math.round(x).toLocaleString('da-DK') + ' kr';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clock = t => { const m = 120 + Math.floor(t / 60); return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  const left = t => { const l = Math.max(0, SNE.sim.st.slut - t); return Math.floor(l / 3600) + ' t ' + String(Math.floor(l % 3600 / 60)).padStart(2, '0') + ' min tilbage'; };
  const SIDE = ['Venstre side', 'H\u00f8jre side'];
  const COL = { ok: 0x5cc28d, warn: 0xf2c14e, crit: 0xee5a4b, sodium: 0xf0a43a, snow: 0xe6edf6, ice: 0x8cc6e6 };
  const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
  let sRGB = false;
  function col(hex) { const c = new THREE.Color(hex); if (sRGB) c.convertSRGBToLinear(); return c; }
  function on(el, ev, fn, opt) { el.addEventListener(ev, fn, opt); listeners.push([el, ev, fn, opt]); }

  // ---------------------------------------------------------------- canvas-teksturer
  function canvas(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return c; }
  function tex(c, rep, color) {
    const t = new THREE.CanvasTexture(c); t.anisotropy = Math.min(8, RND.capabilities.getMaxAnisotropy());
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
    if (color !== false && sRGB) t.encoding = THREE.sRGBEncoding;
    return t;
  }
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function texConcrete() {
    return canvas(1024, 1024, (g, w, h) => {
      const r = rng(7);
      g.fillStyle = 'rgba(46,49,55,0.9)'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 9000; i++) { const v = 30 + r() * 40 | 0; g.fillStyle = `rgba(${v},${v + 2},${v + 6},${0.06 + r() * 0.12})`; g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 3); }
      for (let i = 0; i < 26; i++) { const x = r() * w, y = r() * h, rr = 40 + r() * 160, gr = g.createRadialGradient(x, y, 0, x, y, rr);
        const d = r() < 0.5; gr.addColorStop(0, d ? 'rgba(15,16,19,0.28)' : 'rgba(80,84,92,0.12)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
      g.strokeStyle = 'rgba(12,13,16,0.85)'; g.lineWidth = 3;
      for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * 256, 0); g.lineTo(k * 256, h); g.stroke(); g.beginPath(); g.moveTo(0, k * 256); g.lineTo(w, k * 256); g.stroke(); }
      g.strokeStyle = 'rgba(120,124,130,0.10)'; g.lineWidth = 1;
      for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * 256 + 2, 0); g.lineTo(k * 256 + 2, h); g.stroke(); }
      // våde pletter: lavere alfa = mere spejling. Alfa bygges i et separat lærred og lægges ind bagefter.
      const am = canvas(w, h, (a) => { a.fillStyle = '#000'; a.fillRect(0, 0, w, h);
        for (let i = 0; i < 16; i++) { const x = r() * w, y = r() * h, rx = 70 + r() * 220, gr = a.createRadialGradient(x, y, 0, x, y, rx);
          gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.6, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); a.fillStyle = gr;
          a.save(); a.translate(x, y); a.scale(1, 0.35 + r() * 0.6); a.translate(-x, -y); a.fillRect(x - rx, y - rx, rx * 2, rx * 2); a.restore(); } });
      const id = g.getImageData(0, 0, w, h), wa = am.getContext('2d').getImageData(0, 0, w, h).data, d = id.data;
      for (let i = 0; i < d.length; i += 4) d[i + 3] = 205 - wa[i] * 0.42;
      g.putImageData(id, 0, 0);
    });
  }
  function texDiamond() {
    return canvas(256, 256, (g, w, h) => {
      g.fillStyle = 'rgba(70,74,82,0.82)'; g.fillRect(0, 0, w, h);
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
        const cx = x * 32 + (y % 2) * 16 + 8, cy = y * 32 + 16;
        g.save(); g.translate(cx, cy); g.rotate((x + y) % 2 ? 0.8 : -0.8);
        const gr = g.createLinearGradient(-9, 0, 9, 0); gr.addColorStop(0, 'rgba(150,156,166,0.95)'); gr.addColorStop(1, 'rgba(40,43,48,0.95)');
        g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, 11, 3, 0, 0, Math.PI * 2); g.fill(); g.restore();
      }
    });
  }
  function texPeg() {
    return canvas(1024, 512, (g, w, h) => {
      g.fillStyle = '#2b2e33'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#16181b'; for (let y = 10; y < h; y += 22) for (let x = 10; x < w; x += 22) { g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); }
      const r = rng(3);
      g.lineCap = 'round';
      for (let i = 0; i < 26; i++) {
        const x = 50 + (i % 13) * 74, y = i < 13 ? 70 : 290, k = i % 5;
        g.strokeStyle = g.fillStyle = ['#c9ced6', '#b8bec7', '#e06b3a', '#d9a33a', '#9aa3ad'][(i * 7) % 5];
        g.lineWidth = 7;
        if (k === 0) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 150); g.stroke(); g.beginPath(); g.arc(x, y, 16, 0.6, 5.6); g.lineWidth = 6; g.stroke(); }
        else if (k === 1) { g.fillRect(x - 6, y + 40, 12, 120); g.fillStyle = '#e06b3a'; g.fillRect(x - 10, y, 20, 50); }
        else if (k === 2) { g.beginPath(); g.moveTo(x - 20, y); g.lineTo(x + 6, y + 160); g.moveTo(x + 20, y); g.lineTo(x - 6, y + 160); g.stroke(); }
        else if (k === 3) { g.fillRect(x - 26, y, 52, 22); g.fillRect(x - 5, y + 20, 10, 110); }
        else { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 120 + r() * 40); g.stroke(); g.beginPath(); g.arc(x, y + 10, 12, 0, 7); g.lineWidth = 5; g.stroke(); }
      }
      g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, h - 40, w, 40);
    });
  }
  const neonQ = [];
  function texNeon(text, hex, sub) {
    const draw = (g, w, h) => {
      g.clearRect(0, 0, w, h); g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = '700 150px "Saira Condensed", "Arial Narrow", sans-serif';
      g.shadowColor = hex; g.shadowBlur = 40; g.fillStyle = hex; g.fillText(text, w / 2, sub ? h / 2 - 22 : h / 2);
      g.shadowBlur = 12; g.fillStyle = '#fff6e6'; g.fillText(text, w / 2, sub ? h / 2 - 22 : h / 2);
      if (sub) { g.font = '600 44px "Saira Condensed", "Arial Narrow", sans-serif'; g.shadowBlur = 18; g.fillStyle = hex; g.fillText(sub, w / 2, h - 34); }
    };
    const c = canvas(1024, 256, draw); neonQ.push([c, draw]); return c;
  }
  function redrawNeon(texs) {
    if (!document.fonts || !document.fonts.load) return;
    document.fonts.load('700 150px "Saira Condensed"').then(() => {
      for (const [c, draw] of neonQ) { const g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.shadowBlur = 0; draw(g, c.width, c.height); }
      for (const t of texs) t.needsUpdate = true;
    }).catch(() => {});
  }
  function texGlow() {
    return canvas(128, 128, (g, w, h) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.18, 'rgba(255,255,255,0.55)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.12)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  }
  function texShadow() {
    return canvas(256, 256, (g, w, h) => { const gr = g.createRadialGradient(128, 128, 10, 128, 128, 128);
      gr.addColorStop(0, 'rgba(0,0,0,0.85)'); gr.addColorStop(0.55, 'rgba(0,0,0,0.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  }
  function texHazard() {
    return canvas(128, 128, (g, w, h) => { g.fillStyle = '#e8b52e'; g.fillRect(0, 0, w, h); g.fillStyle = '#15161a';
      for (let x = -128; x < w + 128; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 32, 0); g.lineTo(x + 32 + h, h); g.lineTo(x + h, h); g.closePath(); g.fill(); } });
  }
  function texSky() {
    return canvas(64, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, '#04070d'); gr.addColorStop(0.6, '#0d1626'); gr.addColorStop(0.86, '#2a2a33'); gr.addColorStop(1, '#3a3026'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  }
  function texSnowGround() {
    return canvas(512, 512, (g, w, h) => { const gr = g.createRadialGradient(330, 200, 10, 330, 200, 330);
      gr.addColorStop(0, '#d9b98d'); gr.addColorStop(0.35, '#8d8a8c'); gr.addColorStop(1, '#2b3442'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      const r = rng(11); for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(255,255,255,${r() * 0.08})`; g.fillRect(r() * w, r() * h, 2, 2); }
      g.fillStyle = 'rgba(30,34,44,0.35)'; for (let i = 0; i < 6; i++) { g.fillRect(240 + i * 14, 0, 5, h); } });
  }
  function texSlats() {
    return canvas(64, 256, (g, w, h) => { for (let y = 0; y < h; y += 16) { const gr = g.createLinearGradient(0, y, 0, y + 16);
      gr.addColorStop(0, '#8a9099'); gr.addColorStop(0.5, '#5d636c'); gr.addColorStop(1, '#30343a'); g.fillStyle = gr; g.fillRect(0, y, w, 16); } });
  }
  function texWall() {
    return canvas(512, 512, (g, w, h) => {
      g.fillStyle = '#2a2d33'; g.fillRect(0, 0, w, h); const r = rng(5);
      for (let i = 0; i < 4000; i++) { const v = 34 + r() * 20 | 0; g.fillStyle = `rgba(${v},${v + 2},${v + 5},0.25)`; g.fillRect(r() * w, r() * h, 2, 2); }
      g.strokeStyle = 'rgba(14,15,18,0.8)'; g.lineWidth = 2;
      for (let y = 0; y <= h; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke();
        for (let x = (y / 64) % 2 ? 64 : 0; x <= w; x += 128) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 64); g.stroke(); } }
      const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.25)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    });
  }

  // ---------------------------------------------------------------- statisk geometri slås sammen pr. materiale
  function Batch() {
    const lists = new Map();
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3();
    return {
      add(geo, mat, x, y, z, rx, ry, rz, sx, sy, sz, uvScale) {
        e.set(rx || 0, ry || 0, rz || 0); q.setFromEuler(e); s.set(sx || 1, sy || 1, sz || 1);
        m4.compose(v3(x, y, z), q, s);
        if (!lists.has(mat)) lists.set(mat, []);
        lists.get(mat).push({ geo, m: m4.clone(), uvScale });
      },
      box(mat, x0, y0, z0, x1, y1, z1, uvScale) { this.add(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, 0, 0, 0, 1, 1, 1, uvScale); },
      build(parent) {
        for (const [mat, list] of lists) { const m = new THREE.Mesh(merge(list), mat); m.matrixAutoUpdate = false; m.updateMatrix(); parent.add(m); if (mat.userData.reflect) m.layers.enable(1); }
        lists.clear();
      },
    };
  }
  function merge(list) {
    let n = 0; const gs = [];
    for (const { geo, m, uvScale } of list) {
      const g = geo.index ? geo.toNonIndexed() : geo.clone(); g.applyMatrix4(m);
      if (uvScale) { // kasseprojektion i verdenskoordinater, så teksturen har samme skala overalt
        const p = g.attributes.position, nn = g.attributes.normal, uv = new Float32Array(p.count * 2);
        for (let i = 0; i < p.count; i++) {
          const ax = Math.abs(nn.getX(i)), ay = Math.abs(nn.getY(i)), az = Math.abs(nn.getZ(i));
          let u, v; if (ay >= ax && ay >= az) { u = p.getX(i); v = p.getZ(i); } else if (ax >= az) { u = p.getZ(i); v = p.getY(i); } else { u = p.getX(i); v = p.getY(i); }
          uv[i * 2] = u / uvScale; uv[i * 2 + 1] = v / uvScale;
        }
        g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      }
      gs.push(g); n += g.attributes.position.count; geo.dispose();
    }
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2); let o = 0;
    for (const g of gs) {
      pos.set(g.attributes.position.array, o * 3); nor.set(g.attributes.normal.array, o * 3);
      if (g.attributes.uv) uv.set(g.attributes.uv.array, o * 2); o += g.attributes.position.count; g.dispose();
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    out.computeBoundingSphere(); return out;
  }

  // ---------------------------------------------------------------- shaders
  function ledMaterial(inner, outer, strength, additive) {
    const m = new THREE.ShaderMaterial({
      uniforms: { uT: { value: 0 }, uC: { value: col(COL.sodium) }, uI: { value: strength }, uR0: { value: inner }, uR1: { value: outer }, uBoost: { value: 0 } },
      vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform float uT,uI,uR0,uR1,uBoost; uniform vec3 uC; varying vec2 vP;
        void main(){ float r = length(vP); float a = atan(vP.y, vP.x);
          float mid = (uR0+uR1)*0.5, hw = (uR1-uR0)*0.5; float rad = 1.0 - clamp(abs(r-mid)/hw, 0.0, 1.0);
          float chase = pow(0.5+0.5*sin(a*8.0 - uT*2.6), 6.0); float seg = step(0.18, fract(a*36.0/6.2831853));
          float k = (0.55 + 0.9*chase + uBoost) * mix(1.0, seg, 0.35);
          gl_FragColor = vec4(uC * k * uI * pow(rad, 1.6), pow(rad,1.6)); }`,
      transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, side: THREE.DoubleSide,
    });
    ledMats.push(m); return m;
  }
  function coneMaterial(hex, strength) {
    return new THREE.ShaderMaterial({
      uniforms: { uC: { value: col(hex) }, uI: { value: strength } },
      vertexShader: `varying float vY; varying vec3 vN; varying vec3 vV; void main(){ vY = uv.y; vec4 mv = modelViewMatrix*vec4(position,1.0);
        vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform vec3 uC; uniform float uI; varying float vY; varying vec3 vN; varying vec3 vV;
        void main(){ float f = pow(abs(dot(vN, vV)), 1.6); float a = f * pow(vY, 1.4) * uI; gl_FragColor = vec4(uC * a, a); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
    });
  }
  function snowPoints(n, x0, x1, y0, y1, z0, z1, size, tint) {
    const g = new THREE.BufferGeometry(), p = new Float32Array(n * 3), a = new Float32Array(n), r = rng(n);
    for (let i = 0; i < n; i++) { p[i * 3] = lerp(x0, x1, r()); p[i * 3 + 1] = lerp(y0, y1, r()); p[i * 3 + 2] = lerp(z0, z1, r()); a[i] = r(); }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('aR', new THREE.BufferAttribute(a, 1));
    g.boundingSphere = new THREE.Sphere(v3((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), 40);
    const m = new THREE.ShaderMaterial({
      uniforms: { uT: { value: 0 }, uY0: { value: y0 }, uH: { value: y1 - y0 }, uS: { value: size }, uC: { value: col(tint) }, uWind: { value: 0.35 } },
      vertexShader: `attribute float aR; uniform float uT,uY0,uH,uS,uWind; varying float vA;
        void main(){ vec3 p = position; float sp = 0.45 + 0.6*aR;
          p.y = uY0 + mod(p.y - uY0 - uT*sp, uH);
          p.x += sin(uT*0.8 + aR*31.0)*0.22 + uWind*mod(uT*sp*0.6+aR*7.0, 2.0);
          p.z += cos(uT*0.6 + aR*17.0)*0.18;
          vec4 mv = modelViewMatrix*vec4(p,1.0); gl_PointSize = uS*(0.5+aR)/max(0.5,-mv.z);
          vA = smoothstep(0.0, 0.6, p.y-uY0) * smoothstep(uH, uH-0.6, p.y-uY0); gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform vec3 uC; varying float vA; void main(){ float d = length(gl_PointCoord-0.5); float a = smoothstep(0.5, 0.05, d)*vA*0.9; gl_FragColor = vec4(uC*a, a); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
    });
    const pts = new THREE.Points(g, m); pts.frustumCulled = false; return pts;
  }

  // ---------------------------------------------------------------- hallen
  function buildHall() {
    const T = {
      conc: tex(texConcrete(), [6, 6]), wall: tex(texWall(), [1, 1]), peg: tex(texPeg()), hazard: tex(texHazard(), [1, 1]),
      glow: tex(texGlow()), shadow: tex(texShadow()), diamond: tex(texDiamond(), [5, 5]), sky: tex(texSky()), snowG: tex(texSnowGround()), slats: tex(texSlats(), [1, 1.2]),
    };
    st.T = T;
    const M = {
      wall: new THREE.MeshStandardMaterial({ color: col(0x8a8f99), map: T.wall, roughness: 0.92, metalness: 0.0 }),
      steel: new THREE.MeshStandardMaterial({ color: col(0x4b525c), roughness: 0.45, metalness: 0.75 }),
      dark: new THREE.MeshStandardMaterial({ color: col(0x17191d), roughness: 0.7, metalness: 0.3 }),
      yellow: new THREE.MeshStandardMaterial({ color: col(0xe0a92a), roughness: 0.55, metalness: 0.2 }),
      red: new THREE.MeshStandardMaterial({ color: col(0xa3241c), roughness: 0.35, metalness: 0.5 }),
      rubber: new THREE.MeshStandardMaterial({ color: col(0x15161a), roughness: 0.85, metalness: 0.0 }),
      wood: new THREE.MeshStandardMaterial({ color: col(0x5b4630), roughness: 0.8, metalness: 0.0 }),
      blue: new THREE.MeshStandardMaterial({ color: col(0x24476b), roughness: 0.5, metalness: 0.4 }),
      hazard: new THREE.MeshStandardMaterial({ color: col(0xffffff), map: T.hazard, roughness: 0.6 }),
      peg: new THREE.MeshStandardMaterial({ color: col(0xffffff), map: T.peg, roughness: 0.75 }),
      slats: new THREE.MeshStandardMaterial({ color: col(0xb0b6c0), map: T.slats, roughness: 0.5, metalness: 0.6 }),
      lampW: new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 2.6, 2.9) }),
      lampO: new THREE.MeshBasicMaterial({ color: new THREE.Color(3.0, 1.6, 0.45) }),
      boxes: new THREE.MeshStandardMaterial({ color: col(0x6d5a3f), roughness: 0.9 }),
    };
    st.M = M; M.lampW.userData.reflect = M.lampO.userData.reflect = true;
    const B = Batch(), X0 = -9, X1 = 9, Z0 = -7, Z1 = 8, H = 6;
    // vægge (bagvæg med portåbning)
    const gx0 = -2.6, gx1 = 2.6, gh = 3.9;
    B.box(M.wall, X0, 0, Z0 - 0.3, gx0, H, Z0, 2.4); B.box(M.wall, gx1, 0, Z0 - 0.3, X1, H, Z0, 2.4); B.box(M.wall, gx0, gh, Z0 - 0.3, gx1, H, Z0, 2.4);
    B.box(M.wall, X0 - 0.3, 0, Z0, X0, H, Z1, 2.4); B.box(M.wall, X1, 0, Z0, X1 + 0.3, H, Z1, 2.4); B.box(M.wall, X0, 0, Z1, X1, H, Z1 + 0.3, 2.4);
    B.box(M.dark, X0, H, Z0 - 0.3, X1, H + 0.2, Z1 + 0.3);
    // sokkel og gule kantlister nederst på væggene
    B.box(M.hazard, X0, 0, Z0 + 0.0, X1, 0.18, Z0 + 0.04, 0.36); B.box(M.hazard, X0, 0, Z0, X0 + 0.04, 0.18, Z1, 0.36); B.box(M.hazard, X1 - 0.04, 0, Z0, X1, 0.18, Z1, 0.36);
    // port: karm, rulleport halvt oppe, gul-sort afmærkning
    B.box(M.steel, gx0 - 0.25, 0, Z0 - 0.35, gx0, gh + 0.25, Z0 + 0.08); B.box(M.steel, gx1, 0, Z0 - 0.35, gx1 + 0.25, gh + 0.25, Z0 + 0.08);
    B.box(M.steel, gx0 - 0.25, gh, Z0 - 0.35, gx1 + 0.25, gh + 0.25, Z0 + 0.08);
    B.box(M.hazard, gx0 - 0.27, 0, Z0 + 0.08, gx0 - 0.02, 1.4, Z0 + 0.1, 0.5); B.box(M.hazard, gx1 + 0.02, 0, Z0 + 0.08, gx1 + 0.27, 1.4, Z0 + 0.1, 0.5);
    B.add(new THREE.PlaneGeometry(gx1 - gx0, 1.25), M.slats, 0, gh - 0.62, Z0 - 0.15);
    B.box(M.dark, gx0, gh - 1.28, Z0 - 0.2, gx1, gh - 1.22, Z0 - 0.1);
    B.add(new THREE.CylinderGeometry(0.28, 0.28, gx1 - gx0 + 0.4, 16), M.dark, 0, gh + 0.45, Z0 + 0.2, 0, 0, Math.PI / 2);
    // søjler med påkørselsværn
    for (const x of [-7.0, 7.0]) for (const z of [-4.4, 5.6]) {
      B.box(M.steel, x - 0.15, 0, z - 0.15, x + 0.15, H, z + 0.15);
      B.add(new THREE.CylinderGeometry(0.24, 0.24, 1.1, 20), M.hazard, x, 0.55, z);
    }
    // tagspær
    for (let z = -6; z <= 7; z += 3.25) { B.box(M.steel, X0, H - 0.45, z - 0.08, X1, H - 0.35, z + 0.08); B.box(M.steel, X0, H - 0.75, z - 0.03, X1, H - 0.45, z + 0.03); B.box(M.steel, X0, H - 0.85, z - 0.08, X1, H - 0.75, z + 0.08); }
    for (const x of [-7.0, 0, 7.0]) B.box(M.steel, x - 0.06, H - 0.4, Z0, x + 0.06, H - 0.3, Z1);
    // lysbånd (koldt hvidt) i loftet
    for (const x of [-3.2, 0, 3.2]) for (let z = -5; z <= 6; z += 2.75) {
      B.box(M.dark, x - 0.09, 4.6, z - 0.75, x + 0.09, 4.7, z + 0.75); B.box(M.lampW, x - 0.06, 4.56, z - 0.72, x + 0.06, 4.6, z + 0.72);
      B.add(new THREE.CylinderGeometry(0.004, 0.004, 1.3, 3), M.steel, x, 5.3, z - 0.6); B.add(new THREE.CylinderGeometry(0.004, 0.004, 1.3, 3), M.steel, x, 5.3, z + 0.6);
    }
    // lysbånd langs væggene i natriumorange
    B.box(M.lampO, X0 + 0.02, 2.62, Z0 + 0.5, X0 + 0.06, 2.68, Z1 - 0.5); B.box(M.lampO, X1 - 0.06, 2.62, Z0 + 0.5, X1 - 0.02, 2.68, Z1 - 0.5);
    B.box(M.lampO, gx1 + 0.6, 2.62, Z0 + 0.02, X1 - 0.5, 2.68, Z0 + 0.06); B.box(M.lampO, X0 + 0.5, 2.62, Z0 + 0.02, gx0 - 0.6, 2.68, Z0 + 0.06);
    // værktøjsvæg til højre: pegboard, arbejdsbænk, rødt værktøjsskab
    B.add(new THREE.PlaneGeometry(4.2, 2.1), M.peg, X1 - 0.05, 2.05, -1.0, 0, -Math.PI / 2, 0);
    B.box(M.steel, X1 - 0.85, 0.86, -3.1, X1 - 0.05, 0.92, 1.1); B.box(M.wood, X1 - 0.85, 0.92, -3.1, X1 - 0.05, 0.97, 1.1);
    for (const z of [-3.0, -1.0, 1.0]) { B.box(M.dark, X1 - 0.82, 0, z - 0.04, X1 - 0.76, 0.86, z + 0.04); B.box(M.dark, X1 - 0.14, 0, z - 0.04, X1 - 0.08, 0.86, z + 0.04); }
    B.box(M.red, X1 - 0.75, 0.1, -2.9, X1 - 0.1, 0.62, -1.9);
    for (let k = 0; k < 5; k++) B.box(M.steel, X1 - 0.77, 0.16 + k * 0.095, -2.85, X1 - 0.76, 0.2 + k * 0.095, -1.95);
    B.box(M.red, X1 - 0.8, 0, 2.0, X1 - 0.1, 1.45, 3.1); for (let k = 0; k < 7; k++) B.box(M.steel, X1 - 0.82, 0.12 + k * 0.19, 2.08, X1 - 0.8, 0.15 + k * 0.19, 3.02);
    B.box(M.dark, X1 - 0.8, 1.45, 2.0, X1 - 0.1, 1.5, 3.1);
    // dækstabler
    const tyre = () => new THREE.TorusGeometry(0.27, 0.11, 10, 24);
    for (const [x, z, n] of [[-7.6, 3.3, 4], [-7.0, 4.2, 3], [6.9, 5.2, 5]]) for (let k = 0; k < n; k++) B.add(tyre(), M.rubber, x, 0.11 + k * 0.22, z, Math.PI / 2, 0, k * 0.4);
    // reoler til venstre med kasser
    for (const z0 of [-5.6, -2.6]) {
      for (const z of [z0, z0 + 2.4]) for (const x of [X0 + 0.08, X0 + 0.7]) B.box(M.blue, x, 0, z, x + 0.06, 3.2, z + 0.06);
      for (const y of [0.1, 1.1, 2.1, 3.1]) B.box(M.blue, X0 + 0.08, y, z0, X0 + 0.76, y + 0.06, z0 + 2.46);
      const r = rng(z0 * -13);
      for (const y of [0.16, 1.16, 2.16]) for (let k = 0; k < 4; k++) { const w = 0.35 + r() * 0.2, h2 = 0.3 + r() * 0.45, zz = z0 + 0.15 + k * 0.58;
        B.box(r() < 0.3 ? M.red : M.boxes, X0 + 0.15, y, zz, X0 + 0.15 + 0.5, y + h2, zz + w); }
    }
    // olietønder
    for (const [x, z, m] of [[-7.8, 6.3, M.blue], [-7.15, 6.5, M.red], [-7.5, 7.1, M.blue]]) { B.add(new THREE.CylinderGeometry(0.29, 0.29, 0.88, 20), m, x, 0.44, z); B.add(new THREE.TorusGeometry(0.29, 0.015, 6, 20), M.steel, x, 0.3, z, Math.PI / 2); B.add(new THREE.TorusGeometry(0.29, 0.015, 6, 20), M.steel, x, 0.6, z, Math.PI / 2); }
    // ladeskab ved drejeskiven
    B.box(M.dark, -3.4, 0, -2.3, -2.7, 1.6, -1.8); B.box(M.steel, -3.42, 1.6, -2.32, -2.68, 1.66, -1.78);
    B.box(M.yellow, -3.41, 0.0, -1.81, -2.69, 0.12, -1.79);
    B.add(new THREE.TorusGeometry(0.16, 0.025, 8, 20), M.rubber, -2.68, 1.0, -2.05, 0, Math.PI / 2);
    // kabelkurv i loftet
    B.box(M.steel, X0 + 0.2, 4.2, Z0 + 0.2, X1 - 0.2, 4.24, Z0 + 0.5);
    B.build(world);

    // gulv: delvist gennemsigtigt, så spejlingen fra spejl-passet skinner igennem
    floorMat = reflective(new THREE.MeshStandardMaterial({ color: col(0xa9afb9), map: T.conc, roughness: 0.38, metalness: 0.1, envMapIntensity: 0.5 }), 0.3, 0.9);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(X1 - X0, Z1 - Z0), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, (Z0 + Z1) / 2); floorGroup.add(floor);
    T.conc.repeat.set((X1 - X0) / 3.2, (Z1 - Z0) / 3.2);
    // afmærkning omkring drejeskiven og kørespor mod porten
    const hz = new THREE.Mesh(new THREE.RingGeometry(1.98, 2.1, 96, 1), new THREE.MeshStandardMaterial({ color: col(0xe0a92a), roughness: 0.6, transparent: true, opacity: 0.85 }));
    hz.rotation.x = -Math.PI / 2; hz.position.y = 0.003; floorGroup.add(hz);
    for (const x of [-1.2, 1.2]) { const ln = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 4.2), hz.material); ln.rotation.x = -Math.PI / 2; ln.position.set(x, 0.003, -4.4); floorGroup.add(ln); }
    // drejeskive (flugter med gulvet) + mørk fuge + LED-ring
    ttFloor = new THREE.Group(); floorGroup.add(ttFloor);
    const plate = new THREE.Mesh(new THREE.CircleGeometry(1.86, 96), reflective(new THREE.MeshStandardMaterial({ color: col(0x4a5058), map: T.diamond, roughness: 0.45, metalness: 0.6, envMapIntensity: 0.55 }), 0.85, 0.2));
    plate.rotation.x = -Math.PI / 2; plate.position.y = 0.002; ttFloor.add(plate);
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: T.shadow, transparent: true, depthWrite: false, opacity: 0.9 }));
    sh.rotation.x = -Math.PI / 2; sh.position.y = 0.006; sh.renderOrder = 2; ttFloor.add(sh); st.shadow = sh;
    const seam = new THREE.Mesh(new THREE.RingGeometry(1.86, 1.93, 96, 1), new THREE.MeshBasicMaterial({ color: 0x050607 }));
    seam.rotation.x = -Math.PI / 2; seam.position.y = 0.003; floorGroup.add(seam);
    const ledFlat = new THREE.Mesh(new THREE.RingGeometry(1.80, 1.99, 128, 1), ledMaterial(1.80, 1.99, 1.6, true));
    ledFlat.rotation.x = -Math.PI / 2; ledFlat.position.y = 0.007; floorGroup.add(ledFlat);
    const ledGlow = new THREE.Mesh(new THREE.RingGeometry(1.45, 2.45, 128, 1), ledMaterial(1.45, 2.45, 0.45, true));
    ledGlow.rotation.x = -Math.PI / 2; ledGlow.position.y = 0.009; floorGroup.add(ledGlow);
    // LED-ringen hæver sig en anelse, så den også ses i spejlingen
    const ledTube = new THREE.Mesh(new THREE.TorusGeometry(1.895, 0.012, 6, 160), new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 1.7, 0.5) }));
    ledTube.rotation.x = -Math.PI / 2; ledTube.position.y = 0.012; world.add(ledTube); st.ledTube = ledTube; ledTube.layers.enable(1);

    // natriumlamper (højloftslamper) med lyskegler
    for (const [x, z] of [[-3.6, 1.2], [3.6, -1.0]]) {
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 0.28, 24, 1, true), M.dark); lamp.position.set(x, 4.95, z); world.add(lamp);
      const bulb = new THREE.Mesh(new THREE.CircleGeometry(0.33, 24), M.lampO); bulb.rotation.x = Math.PI / 2; bulb.position.set(x, 4.82, z); world.add(bulb);
      const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 2.3, 4.8, 32, 1, true), coneMaterial(COL.sodium, 0.11)); cone.position.set(x, 2.42, z); world.add(cone); cones.push(cone); bulb.layers.enable(1);
      glowSprite(x, 4.75, z, 1.6, 0xffb253, 0.55);
    }
    // spot over drejeskiven: koldt hvid kegle
    const spotHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.3, 20, 1, true), M.dark); spotHousing.position.set(0, 4.65, 1.4); spotHousing.rotation.x = 0.35; world.add(spotHousing);
    const cone2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 1.9, 4.6, 32, 1, true), coneMaterial(0xcfe3ff, 0.06)); cone2.position.set(0, 2.38, 0.6); cone2.rotation.x = 0.17; world.add(cone2); cones.push(cone2);
    glowSprite(0, 4.5, 1.37, 0.9, 0xdde9ff, 0.7);
    // neonskilte
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 1.0), new THREE.MeshBasicMaterial({ map: tex(texNeon('V\u00c6RKSTED', '#f0a43a', 'NATTESKIFT \u00b7 SERVICE \u00b7 LADESTATION')), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    sign.position.set(X0 + 0.06, 3.55, 1.0); sign.rotation.y = Math.PI / 2; world.add(sign);
    const sign2 = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.6), new THREE.MeshBasicMaterial({ map: tex(texNeon('PORT 1', '#8cc6e6')), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    sign2.position.set(4.2, 3.2, Z0 + 0.05); world.add(sign2);
    redrawNeon([sign.material.map, sign2.material.map]);
    // ladeskabets dioder
    chargerLeds = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.06), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.4, 2.0, 0.9) }));
    chargerLeds.position.set(-3.05, 1.35, -1.79); world.add(chargerLeds);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.3), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.25, 0.55, 0.9) }));
    scr.position.set(-3.05, 1.05, -1.79); world.add(scr);

    // udenfor porten: snedækket plads, himmel, lygtepæl, sne der falder
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 24), new THREE.MeshBasicMaterial({ map: T.snowG, color: new THREE.Color(0.85, 0.85, 0.9) }));
    ground.rotation.x = -Math.PI / 2; ground.position.set(0, 0.01, Z0 - 12); world.add(ground);
    const drift = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: col(0xdfe7f2), roughness: 0.9 }));
    drift.scale.set(2.3, 0.09, 0.7); drift.position.set(-0.3, 0, Z0 - 0.05); world.add(drift);
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(60, 18), new THREE.MeshBasicMaterial({ map: T.sky, fog: false })); sky.position.set(0, 7, Z0 - 24); world.add(sky);
    const treeM = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.012, 0.018, 0.03) });
    const r = rng(99);
    for (let i = 0; i < 26; i++) { const t = new THREE.Mesh(new THREE.ConeGeometry(0.8 + r() * 0.8, 3 + r() * 3.5, 7), treeM); const x = -16 + i * 1.3 + r() * 0.6; t.position.set(x, 1.5 + r(), Z0 - 18 - r() * 4); world.add(t); }
    const fence = new THREE.Mesh(new THREE.PlaneGeometry(26, 1.2), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.03, 0.035, 0.05) })); fence.position.set(0, 0.6, Z0 - 13); world.add(fence);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 6, 8), new THREE.MeshBasicMaterial({ color: 0x0b0d10 })); pole.position.set(3.2, 3, Z0 - 7); world.add(pole);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.12), new THREE.MeshBasicMaterial({ color: 0x0b0d10 })); arm.position.set(2.75, 5.95, Z0 - 7); world.add(arm);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.2), new THREE.MeshBasicMaterial({ color: new THREE.Color(3.4, 1.9, 0.6) })); head.position.set(2.4, 5.88, Z0 - 7); world.add(head);
    glowSprite(2.4, 5.8, Z0 - 7, 3.2, 0xffa33a, 0.9);
    const cone3 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 3.4, 5.8, 32, 1, true), coneMaterial(0xffa33a, 0.16)); cone3.position.set(2.4, 2.95, Z0 - 7); world.add(cone3);
    snow = snowPoints(2400, -9, 9, 0, 7, Z0 - 16, Z0 - 0.4, 34, 0xf0f2f8); world.add(snow);
    snowIn = snowPoints(220, -2.4, 2.4, 0, 3.6, Z0, Z0 + 2.2, 26, 0xf0f2f8); snowIn.material.uniforms.uWind.value = 0.1; world.add(snowIn);

    // lys
    // fire lys (billigere shader): himmel/jord, kold hvid spot, natriumorange kantlys og orange underglød fra LED-ringen
    const hemi = new THREE.HemisphereLight(0x8394b8, 0x2a1d10, 0.75); world.add(hemi);
    const key = new THREE.SpotLight(0xdfe9ff, 1.55, 0, 0.66, 0.7, 1); key.position.set(0, 4.6, 1.4); key.target.position.set(0, 0.2, 0); world.add(key, key.target);
    const rim = new THREE.SpotLight(0xffa64a, 2.2, 0, 0.75, 0.75, 1); rim.position.set(-3.6, 4.7, -3.6); rim.target.position.set(0, 0.4, 0); world.add(rim, rim.target);
    underLight = new THREE.PointLight(0xff9a32, 0.55, 3.2, 2); underLight.position.set(0, 0.12, 0); world.add(underLight);
    st.lights = [hemi, key, rim, underLight];
    for (const l of st.lights) l.layers.enable(1);
    sign.layers.enable(1);
    if (RND.physicallyCorrectLights) { // samme udseende, hvis Agent B bruger fysisk korrekte lys
      for (const l of st.lights) {
        if (l.isSpotLight || l.isPointLight) { const d = l.position.length(); l.intensity *= Math.PI * Math.max(1, d * d) * (l.isPointLight ? 0.25 : 1); l.decay = 2; }
        else l.intensity *= Math.PI;
      }
    }
    scene.fog = new THREE.FogExp2(col(0x07090d).getHex(), 0.045);
  }
  // Gulvet viser spejlbilledet fra spejl-passet (halv opløsning). Teksturens alfa = tørt (1) eller vådt (0).
  const reflU = { tRefl: { value: null }, uRes: { value: null } };
  function reflective(mat, base, wet) {
    mat.onBeforeCompile = sh => {
      sh.uniforms.tRefl = reflU.tRefl; sh.uniforms.uRes = reflU.uRes; sh.uniforms.uRB = { value: base }; sh.uniforms.uRW = { value: wet };
      sh.fragmentShader = 'uniform sampler2D tRefl; uniform vec2 uRes; uniform float uRB, uRW;' + String.fromCharCode(10) + sh.fragmentShader
        .replace('#include <map_fragment>', '#include <map_fragment>' + String.fromCharCode(10) + ' float gWet = 1.0 - diffuseColor.a; diffuseColor.a = 1.0;')
        .replace('#include <output_fragment>', `#include <output_fragment>
          vec2 gUv = gl_FragCoord.xy / uRes; vec2 gPx = 1.5 / uRes;
          vec3 gR = texture2D(tRefl, gUv).rgb * 0.36 + (texture2D(tRefl, gUv + vec2(gPx.x, 0.0)).rgb + texture2D(tRefl, gUv - vec2(gPx.x, 0.0)).rgb
            + texture2D(tRefl, gUv + vec2(0.0, gPx.y)).rgb + texture2D(tRefl, gUv - vec2(0.0, gPx.y * 2.5)).rgb) * 0.16;
          float gF = 0.45 + 0.55 * pow(1.0 - clamp(dot(normalize(vViewPosition), -normal) , 0.0, 1.0), 3.0);
          gR = pow(gR, vec3(GAR_DEC));
          gl_FragColor.rgb += gR * (uRB + gWet * uRW) * gF;`);
      sh.fragmentShader = '#define GAR_DEC ' + (sRGB ? '2.2' : '1.0') + String.fromCharCode(10) + sh.fragmentShader;
    };
    mat.customProgramCacheKey = () => 'garRefl';
    return mat;
  }
  function glowSprite(x, y, z, s, hex, op) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: st.T.glow, color: hex, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    sp.position.set(x, y, z); sp.scale.set(s, s, 1); world.add(sp); glowSprites.push(sp); sp.layers.enable(1); return sp;
  }
  function buildEnv() {
    // falsk omgivelseskort: mørk hal med lysbånd. Bruges til glans på robot og gulv uden ekstra renderinger hvert billede.
    const es = new THREE.Scene();
    const box = new THREE.Mesh(new THREE.BoxGeometry(20, 8, 20), new THREE.MeshBasicMaterial({ color: 0x15181d, side: THREE.BackSide })); box.position.y = 3; es.add(box);
    const wm = new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 6.4, 7) }), om = new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 2.4, 0.6) });
    for (const x of [-3, 0, 3]) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.05, 9), wm); s.position.set(x, 6.8, 0); es.add(s); }
    for (const z of [-9.8, 9.8]) { const s = new THREE.Mesh(new THREE.BoxGeometry(16, 0.12, 0.05), om); s.position.set(0, 2.6, z); es.add(s); }
    for (const x of [-9.8, 9.8]) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 16), om); s.position.set(x, 2.6, 0); es.add(s); }
    const gate = new THREE.Mesh(new THREE.PlaneGeometry(5, 3.4), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.35, 0.42, 0.6) })); gate.position.set(0, 1.7, -9.9); es.add(gate);
    const flo = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshBasicMaterial({ color: 0x0a0b0d })); flo.rotation.x = -Math.PI / 2; flo.position.y = -0.9; es.add(flo);
    const pm = new THREE.PMREMGenerator(RND); const rt = pm.fromScene(es, 0.03); pm.dispose();
    es.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    return rt.texture;
  }

  // ---------------------------------------------------------------- robotten
  function findNode(name) {
    if (!name) return null;
    let n = robot.getObjectByName(name); if (n) return n;
    const s = String(name).replace(/\s/g, '_').replace(/[\[\]\.:\/]/g, '');
    n = robot.getObjectByName(s); if (n) return n;
    let hit = null; robot.traverse(o => { if (!hit && o.name && o.name.replace(/[\[\]\.:\/]/g, '').toLowerCase() === s.toLowerCase()) hit = o; });
    return hit;
  }
  const m3 = () => new THREE.Matrix3();
  function relMatrix(o) { const inv = new THREE.Matrix4().copy(robot.matrixWorld).invert(); return inv.multiply(o.matrixWorld); }
  function partRank(p) {
    const s = (p.id + ' ' + (p.gruppe || '') + ' ' + (p.navn || '')).toLowerCase();
    if (/kappe|cover|karross|skjold_top|laag|l\u00e5g|top/.test(s) && !/plov/.test(s)) return 0;
    if (/batter|elektron|styring|sensor|lidar|blink|kamera|n\u00f8d/.test(s)) return 1;
    if (/plov|salt|hydraul|cylind|ramme/.test(s)) return 2;
    if (/hjul|daek|d\u00e6k|wheel/.test(s)) return 3;
    if (/drivlinje|motor|gear|aksel|kob|leje|k\u00e6de|kaede|k\u00e6d/.test(s)) return 4;
    return 2;
  }
  function buildRobot() {
    robot = SNE.assets.robot.clone(true);
    robot.updateMatrixWorld(true);
    const P = SNE.assets.parts || { nodes: {}, parts: [] };
    st.P = P;
    // plovvinkel 0° i værkstedet
    const plov = findNode(P.nodes && P.nodes.plov); if (plov) { plov.rotation.y = 0; }
    robot.updateMatrixWorld(true);
    // egne materialer pr. mesh, så originalen aldrig ændres
    robot.traverse(o => {
      if (!o.isMesh) return;
      const conv = mt => {
        let m = mt;
        if (!m.isMeshStandardMaterial) { m = new THREE.MeshStandardMaterial({ color: mt.color ? mt.color.clone() : col(0x888888), map: mt.map || null, roughness: 0.6, metalness: 0.3 }); }
        else m = m.clone();
        m.userData.base = { color: m.color.clone(), emissive: m.emissive.clone(), ei: m.emissiveIntensity, rough: m.roughness, metal: m.metalness, op: m.opacity, tr: m.transparent, dw: m.depthWrite };
        return m;
      };
      o.material = Array.isArray(o.material) ? o.material.map(conv) : conv(o.material);
      o.castShadow = false; o.receiveShadow = false;
      allMeshes.push(o);
    });
    // dele
    const nodeOwner = new Map();
    parts = [];
    for (const raw of (P.parts || [])) {
      const p = Object.assign({}, raw); p.sim = p.sim || { slags: 'ingen' }; p.objs = [];
      for (const nm of (p.nodes || [])) { const n = findNode(nm); if (n) { p.objs.push(n); nodeOwner.set(n, p); } else console.warn('[Garage] node mangler i robot.glb:', nm); }
      if (!p.objs.length) continue;
      p.ex = new THREE.Vector3().fromArray(p.explode || [0, 0, 0]);
      p.rank = partRank(p);
      parts.push(p); partById[p.id] = p;
    }
    // hver node: hvilestilling, retning omregnet til forælderens lokale koordinater, og den nærmeste forfader-del
    for (const p of parts) {
      p.nodeInfo = p.objs.map(n => {
        const Mp = n.parent ? relMatrix(n.parent) : new THREE.Matrix4();
        const inv3 = m3().setFromMatrix4(new THREE.Matrix4().copy(Mp).invert());
        let a = n.parent, anc = null; while (a && a !== robot) { if (nodeOwner.has(a)) { anc = nodeOwner.get(a); break; } a = a.parent; }
        return { n, rest: n.position.clone(), inv3, anc };
      });
      const b = new THREE.Box3(); for (const n of p.objs) b.expandByObject(n);
      const inv = new THREE.Matrix4().copy(robot.matrixWorld).invert(); b.applyMatrix4(inv);
      p.box = b; p.c0 = b.getCenter(new THREE.Vector3()); p.size = b.getSize(new THREE.Vector3());
      p.cur = new THREE.Vector3(); p.prog = 0; p.anim = new THREE.Vector3();
    }
    // forskudt rækkefølge: kappe og batteri først, så drivlinjen i lag (største forskydning først)
    const drive = parts.filter(p => p.rank === 4).sort((a, b) => b.ex.length() - a.ex.length());
    drive.forEach((p, i) => { p.rank = 4 + Math.floor(3 * i / Math.max(1, drive.length)); });
    const maxR = Math.max(1, ...parts.map(p => p.rank));
    for (const p of parts) p.delay = 0.55 * p.rank / maxR;
    // mesh -> del
    for (const m of allMeshes) { let a = m, p = null; while (a && a !== robot.parent) { if (nodeOwner.has(a)) { p = nodeOwner.get(a); break; } a = a.parent; } m.userData.gPart = p; }
    for (const p of parts) p.meshes = allMeshes.filter(m => m.userData.gPart === p);
    // størrelse og placering på drejeskiven (centreret)
    const full = new THREE.Box3().setFromObject(robot); robotSize = full.getSize(new THREE.Vector3());
    const ctr = full.getCenter(new THREE.Vector3());
    robot.position.x -= ctr.x; robot.position.z -= ctr.z; robot.position.y -= full.min.y;
    // kroppen (uden ploven) til ballast og skygge
    bodyBox = new THREE.Box3();
    const plovN = findNode(P.nodes && (P.nodes.plovLoeft || P.nodes.plov));
    robot.updateMatrixWorld(true);
    robot.traverse(o => { if (!o.isMesh) return; let a = o; while (a) { if (a === plovN) return; a = a.parent; } o.geometry.computeBoundingBox(); const bb = o.geometry.boundingBox.clone().applyMatrix4(relMatrix(o)); bodyBox.union(bb); });
    if (bodyBox.isEmpty()) bodyBox.copy(full);
    robotRoot.add(robot);
    defDist = clamp(Math.max(robotSize.x, robotSize.z) * 2.6, 3.6, 7);
    defTarget = v3(0, Math.min(0.45, robotSize.y * 0.4), 0);
    st.shadow.scale.set(robotSize.x * 1.15, robotSize.z * 1.25, 1);
    // hjul
    const wn = (P.nodes && P.nodes.wheels) || [];
    for (const nm of wn) {
      const n = findNode(nm); if (!n) continue;
      const b = new THREE.Box3(), inv = new THREE.Matrix4().copy(n.matrixWorld).invert();
      n.traverse(o => { if (o.isMesh) { o.geometry.computeBoundingBox(); b.union(o.geometry.boundingBox.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld))); } });
      const rad = Math.max(Math.abs(b.min.x), Math.abs(b.max.x), Math.abs(b.min.y), Math.abs(b.max.y));
      wheelInfo.push({ n, r: rad, w: b.max.z - b.min.z, zc: (b.max.z + b.min.z) / 2, over: null });
    }
    // plovskjold (bøjes ved påkørsel)
    let pl = parts.filter(p => p.sim.slags === 'plov').flatMap(p => p.meshes);
    if (!pl.length && plov) plov.traverse(o => { if (o.isMesh) pl.push(o); });
    for (const m of pl) {
      m.geometry = m.geometry.clone();
      const pos = m.geometry.attributes.position; const M = relMatrix(m);
      plowMeshes.push({ m, orig: pos.array.slice(0), origN: m.geometry.attributes.normal ? m.geometry.attributes.normal.array.slice(0) : null, M, inv3: m3().setFromMatrix4(new THREE.Matrix4().copy(M).invert()) });
    }
    st.plowBox = new THREE.Box3(); for (const pm of plowMeshes) { pm.m.geometry.computeBoundingBox(); st.plowBox.union(pm.m.geometry.boundingBox.clone().applyMatrix4(pm.M)); }
    // ballast-plader (tilføjes, ikke en del af robot.glb)
    ballastGroup = new THREE.Group(); robot.add(ballastGroup);
    const bm = new THREE.MeshStandardMaterial({ color: col(0x3b3f45), roughness: 0.4, metalness: 0.85 });
    const strap = new THREE.MeshStandardMaterial({ color: col(0xe0a92a), roughness: 0.6, metalness: 0.1 });
    // pladerne spændes oven på kappens bageste del (ellers kroppens boks)
    const kp = parts.find(p => /kappe|cover/.test(p.id + ' ' + (p.gruppe || ''))), kb = kp ? kp.box : bodyBox; st.kappe = kp;
    const bw = Math.min(0.5, (kb.max.z - kb.min.z) * 0.6);
    for (let k = 0; k < 4; k++) {
      const g = new THREE.Group();
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.045, bw), bm); g.add(plate);
      const s1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, bw + 0.01), strap); s1.position.x = 0.07; g.add(s1);
      const s2 = s1.clone(); s2.position.x = -0.07; g.add(s2);
      g.position.set(kb.min.x + 0.2, kb.max.y + 0.025 + k * 0.05, (kb.min.z + kb.max.z) / 2);
      g.userData.y0 = g.position.y; g.visible = false; ballastGroup.add(g);
      g.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); o.material.userData.base = { color: o.material.color.clone(), emissive: o.material.emissive.clone(), ei: 1, rough: o.material.roughness, metal: o.material.metalness, op: 1, tr: false, dw: true }; o.userData.gBallast = true; allMeshes.push(o); } });
    }
    // hjælpelinjer for eksploderet visning
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(parts.length * 6), 3));
    guide = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: col(COL.sodium), transparent: true, opacity: 0, depthWrite: false }));
    guide.frustumCulled = false; robot.add(guide);
    const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(parts.length * 3), 3));
    st.dots = new THREE.Points(dg, new THREE.PointsMaterial({ color: col(COL.sodium), size: 5, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false }));
    st.dots.frustumCulled = false; robot.add(st.dots);
    for (let i = 0; i < parts.length; i++) parts[i].c0.toArray(dg.attributes.position.array, i * 3);
    // gnister ved udskiftning
    const sg = new THREE.BufferGeometry(); const N = 90;
    sg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    st.sparks = new THREE.Points(sg, new THREE.PointsMaterial({ color: new THREE.Color(3, 2, 0.8), size: 0.03, map: st.T.glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
    st.sparks.frustumCulled = false; st.sparkV = new Float32Array(N * 3); robot.add(st.sparks);
  }

  // ---------------------------------------------------------------- dæk, ballast og bøjet plov ud fra sim
  function tireOverlay(w, type) {
    if (w.over) { w.n.remove(w.over); w.over.traverse(o => { if (o.isMesh) { o.geometry.dispose(); const i = allMeshes.indexOf(o); if (i >= 0) allMeshes.splice(i, 1); } }); w.over = null; }
    if (type !== 'kaede' && type !== 'pig') return;
    const g = new THREE.Group(); g.position.z = w.zc;
    const part = w.n.userData.gPartRef || allMeshes.find(m => { let a = m; while (a) { if (a === w.n) return true; a = a.parent; } return false; });
    const p = part && part.userData ? part.userData.gPart : null;
    if (type === 'kaede') {
      const mat = new THREE.MeshStandardMaterial({ color: col(0xc9ced6), roughness: 0.25, metalness: 0.95 });
      const n = 16, bar = new THREE.BoxGeometry(0.018, 0.022, w.w * 1.08);
      const im = new THREE.InstancedMesh(bar, mat, n), o = new THREE.Object3D();
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; o.position.set(Math.cos(a) * (w.r + 0.006), Math.sin(a) * (w.r + 0.006), 0); o.rotation.set(0, 0, a); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }
      g.add(im);
      for (const s of [-1, 1]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(w.r * 0.86, 0.008, 6, 48), mat); ring.position.z = s * w.w * 0.53; g.add(ring); }
      // diagonale kædeled mellem tværstængerne
      const lnk = new THREE.BoxGeometry(0.01, 0.012, w.w * 0.62), im2 = new THREE.InstancedMesh(lnk, mat, n * 2);
      for (let i = 0; i < n; i++) for (let s = 0; s < 2; s++) { const a = (i + 0.5) / n * Math.PI * 2; o.position.set(Math.cos(a) * (w.r + 0.004), Math.sin(a) * (w.r + 0.004), (s ? 1 : -1) * w.w * 0.25); o.rotation.set(0, (s ? 1 : -1) * 0.5, a); o.updateMatrix(); im2.setMatrixAt(i * 2 + s, o.matrix); }
      g.add(im2);
    } else {
      const mat = new THREE.MeshStandardMaterial({ color: col(0xdfe3ea), roughness: 0.2, metalness: 1.0 });
      const n = 22 * 3, stud = new THREE.CylinderGeometry(0.006, 0.006, 0.02, 6), im = new THREE.InstancedMesh(stud, mat, n), o = new THREE.Object3D();
      for (let i = 0; i < n; i++) { const row = i % 3, a = (Math.floor(i / 3) + row * 0.33) / 22 * Math.PI * 2; o.position.set(Math.cos(a) * w.r, Math.sin(a) * w.r, (row - 1) * w.w * 0.3); o.rotation.set(0, 0, a - Math.PI / 2); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }
      g.add(im);
    }
    g.traverse(o => { if (o.isMesh) { o.material.userData.base = { color: o.material.color.clone(), emissive: o.material.emissive.clone(), ei: 1, rough: o.material.roughness, metal: o.material.metalness, op: 1, tr: false, dw: true }; o.userData.gPart = p; o.userData.noPick = false; allMeshes.push(o); if (p) p.meshes.push(o); } });
    w.n.add(g); w.over = g;
  }
  function reflectRobot() { robot.traverse(o => o.layers.enable(1)); }
  function syncRobot(force) {
    const sim = SNE.sim, R = sim.R;
    if (force || st.tireShown !== R.tire) {
      for (const p of parts) p.meshes = p.meshes.filter(m => allMeshes.includes(m));
      for (const w of wheelInfo) tireOverlay(w, R.tire);
      for (const p of parts) p.meshes = p.meshes.filter(m => allMeshes.includes(m));
      st.tireShown = R.tire;
    }
    const nb = Math.round((R.ballast || 0) / 25);
    if (force || st.ballastShown !== nb) { ballastGroup.children.forEach((g, k) => { g.visible = k < nb; g.position.y = g.userData.y0; }); st.ballastShown = nb; }
    setDent(1 - R.plovH, force);
    reflectRobot();
  }
  function setDent(d, force) {
    d = clamp(d, 0, 0.6);
    if (!force && Math.abs(d - st.dentShown) < 1e-4) return;
    st.dentShown = d;
    const b = st.plowBox; if (!plowMeshes.length || b.isEmpty()) return;
    // bøjning: højre ende (z > 0) er presset bagud og vredet, som efter et stød mod en kantsten
    const z0 = b.min.z + (b.max.z - b.min.z) * 0.38, H = Math.max(0.05, b.max.y - b.min.y);
    const amp = d / 0.6 * 0.26, p = new THREE.Vector3(), dv = new THREE.Vector3();
    for (const pm of plowMeshes) {
      const pos = pm.m.geometry.attributes.position, a = pos.array, o = pm.orig;
      if (d < 1e-4) { a.set(o); if (pm.origN) pm.m.geometry.attributes.normal.array.set(pm.origN); }
      else for (let i = 0; i < pos.count; i++) {
        p.set(o[i * 3], o[i * 3 + 1], o[i * 3 + 2]).applyMatrix4(pm.M);
        const u = clamp((p.z - z0) / (b.max.z - z0), 0, 1), g = u * u * (3 - 2 * u) * (0.7 + 0.3 * u), hh = clamp((p.y - b.min.y) / H, 0, 1);
        dv.set(-amp * g * (0.65 + 0.35 * hh), -amp * 0.22 * g * hh, -amp * 0.12 * g).applyMatrix3(pm.inv3);
        a[i * 3] = o[i * 3] + dv.x; a[i * 3 + 1] = o[i * 3 + 1] + dv.y; a[i * 3 + 2] = o[i * 3 + 2] + dv.z;
      }
      pos.needsUpdate = true;
      if (d >= 1e-4 && pm.origN) pm.m.geometry.computeVertexNormals();
      if (pm.m.geometry.attributes.normal) pm.m.geometry.attributes.normal.needsUpdate = true;
    }
  }

  // ---------------------------------------------------------------- tilstand pr. del
  function sideOf(p) { return p.side === 0 || p.side === 1 ? p.side : null; }
  function cond(p) {
    const sim = SNE.sim, R = sim.R, C = sim.C, s = p.sim || {}, sl = s.slags || 'ingen', f = s.felt;
    const si = sideOf(p);
    const sides = si === null ? [0, 1] : [si];
    const get = (S, k, worst) => S[k];
    let h = 1, txt = '', fail = false, na = false, unit = '';
    const pick = fn => { let best = null; for (const i of sides) { const r = fn(sim.S[i], i); if (!best || r.h < best.h) best = r; } return best; };
    let r;
    switch (sl) {
      case 'skade': r = pick(S => {
        const v = S[f] || 0;
        if (f === 'clutchWear') { const w = Math.min(1, v); return { h: 1 - w, fail: v >= 1, txt: v >= 1 ? 'Slidt op \u00b7 glider allerede ved ' + C.TglidSlidt + ' Nm' : (w < 0.005 ? 'Som ny' : 'Slidt ' + f0(w * 100) + ' %') + ' \u00b7 glider ved ' + C.Tglid + ' Nm' }; }
        if (f === 'shaftD') { const ok = S.shaftOK !== false; return { h: ok ? 1 - Math.min(1, v) : 0, fail: !ok, txt: ok ? f0(Math.min(1, v) * 100) + ' % af levetiden brugt (Miners regel)' : 'Kn\u00e6kket ved k\u00e6dehjulss\u00e6det' }; }
        return { h: 1 - clamp(v, 0, 1), fail: v >= 1, txt: f0(clamp(v, 0, 1) * 100) + ' % skade' };
      }); break;
      case 'levetid': r = pick(S => { const v = S[f || 'bearing']; return { h: clamp(v, 0, 1), fail: v <= 0, txt: v <= 0 ? 'Havareret \u00b7 farten er l\u00e5st til 0,3 m/s' : f0(clamp(v, 0, 1) * 100) + ' % levetid tilbage (L10)' }; }); break;
      case 'temp': r = pick(S => { const T = S[f || 'temp'], ok = S.motorOK !== false; return { h: ok ? clamp(1 - (T - 60) / 95, 0, 1) : 0, fail: !ok, txt: ok ? f0(T) + ' \u00b0C \u00b7 br\u00e6nder af ved 155 \u00b0C' : 'Br\u00e6ndt af (155 \u00b0C)' }; }); break;
      case 'laengning': r = pick(S => { const c = S[f || 'chain'], ok = S.chainOK !== false; return { h: ok ? clamp(1 - c / 3, 0, 1) : 0, fail: !ok, txt: ok ? 'L\u00e6nget ' + f1(c) + ' % \u00b7 springer af ved 3 %' : 'Sprunget af \u00b7 l\u00e6nget ' + f1(c) + ' %' }; }); break;
      case 'daek': { const D = sim.DAEK[R.tire], want = sim.AP.wantTire && sim.AP.wantTire !== R.tire; r = { h: want ? 0.45 : 1, txt: D.navn + ' \u00b7 \u03bc ' + D.mu.map(f2).join(' / ') + (want ? ' \u00b7 ' + sim.DAEK[sim.AP.wantTire].navn + ' anbefales' : '') }; break; }
      case 'plov': r = { h: clamp((R.plovH - 0.4) / 0.6, 0, 1), txt: R.plovH > 0.99 ? 'Lige skjold \u00b7 100 % kapacitet' : 'B\u00f8jet \u00b7 ' + f0(R.plovH * 100) + ' % kapacitet' }; break;
      case 'batteri': r = { h: clamp(R.soc, 0, 1), fail: R.dead, txt: R.dead ? 'Fladt' : f0(R.soc * 100) + ' % opladet \u00b7 ' + f2(C.Ebatt * R.soc * sim.kT()) + ' kWh brugbart' }; break;
      case 'salt': r = { h: clamp(R.saltKg / C.saltMax, 0, 1), txt: f0(R.saltKg) + ' af ' + C.saltMax + ' kg salt' }; break;
      default: r = { h: 1, txt: 'Ingen slitage m\u00e5les p\u00e5 denne del', na: true };
    }
    h = r.h; fail = !!r.fail; na = !!r.na;
    const lvl = na ? 'na' : fail || h <= 0.02 ? 'fail' : h < 0.25 ? 'crit' : h < 0.6 ? 'warn' : 'ok';
    const word = { na: 'Info', fail: 'Havari', crit: 'Kritisk', warn: sl === 'batteri' || sl === 'salt' ? 'Lav' : 'Slidt', ok: h > 0.97 ? 'Som ny' : 'God' }[lvl];
    return { h, txt: r.txt, fail, na, lvl, word };
  }
  function heatColor(h) {
    const a = new THREE.Color(COL.crit), b = new THREE.Color(COL.warn), c = new THREE.Color(COL.ok);
    const out = h < 0.5 ? a.lerp(b, h / 0.5) : b.lerp(c, (h - 0.5) / 0.5);
    if (sRGB) out.convertSRGBToLinear(); return out;
  }
  // værkstedshandlinger, der hører til en del (og omvendt)
  function actionsFor(p) {
    const L = SNE.sim.vaerkListe(), ids = new Set(), v = p.vaerk;
    (Array.isArray(v) ? v : v ? [v] : []).forEach(x => ids.add(x));
    const s = p.sim || {}, si = sideOf(p);
    const sideIds = (pre) => si === null ? [pre + '-0', pre + '-1'] : [pre + '-' + si];
    if (s.slags === 'daek' || [...ids].some(x => /^daek/.test(x))) L.filter(x => /^daek-/.test(x.id)).forEach(x => ids.add(x.id));
    if (s.slags === 'batteri' || ids.has('lad100') || ids.has('lad30')) { ids.add('lad100'); ids.add('lad30'); }
    if (s.slags === 'laengning' || [...ids].some(x => /^(kaede|stram)-/.test(x))) sideIds('stram').concat(sideIds('kaede')).forEach(x => ids.add(x));
    if (s.felt === 'clutchWear') sideIds('kob').forEach(x => ids.add(x));
    if (s.felt === 'shaftD') sideIds('aksel').forEach(x => ids.add(x));
    if (s.slags === 'levetid') sideIds('leje').forEach(x => ids.add(x));
    if (s.slags === 'temp') sideIds('motor').forEach(x => ids.add(x));
    if (s.slags === 'plov') ids.add('plov');
    if (s.slags === 'salt') ids.add('salt');
    if ([...ids].some(x => /^ballast/.test(x))) L.filter(x => /^ballast-/.test(x.id)).forEach(x => ids.add(x.id));
    return L.filter(x => ids.has(x.id));
  }
  function partsForAction(id) {
    const direct = parts.filter(p => { const v = p.vaerk; return Array.isArray(v) ? v.includes(id) : v === id; });
    const [a, b] = id.split('-'), i = b !== undefined ? +b : null;
    const bySim = (fn) => parts.filter(p => fn(p.sim || {}) && (i === null || isNaN(i) || sideOf(p) === null || sideOf(p) === i));
    let r = [];
    if (a === 'daek') r = parts.filter(p => (p.sim || {}).slags === 'daek' || /^daek/.test(String(p.vaerk || '')));
    else if (a === 'lad100' || a === 'lad30') r = parts.filter(p => (p.sim || {}).slags === 'batteri');
    else if (a === 'kob') r = bySim(s => s.felt === 'clutchWear');
    else if (a === 'aksel') r = bySim(s => s.felt === 'shaftD');
    else if (a === 'leje') r = bySim(s => s.slags === 'levetid');
    else if (a === 'stram' || a === 'kaede') r = bySim(s => s.slags === 'laengning');
    else if (a === 'motor') r = bySim(s => s.slags === 'temp');
    else if (a === 'plov') r = parts.filter(p => (p.sim || {}).slags === 'plov');
    else if (a === 'salt') r = parts.filter(p => (p.sim || {}).slags === 'salt');
    for (const p of direct) if (!r.includes(p)) r.push(p);
    if (a === 'daek' && !r.length) return [];
    return r;
  }
  function selGroup(p) { // dæk vælges samlet
    if (!p) return [];
    if ((p.sim || {}).slags === 'daek') return parts.filter(q => (q.sim || {}).slags === 'daek');
    return [p];
  }

  // ---------------------------------------------------------------- materialer: normal, belastning, valgt, dæmpet
  let orange = null;
  function applyLook() {
    orange.copy(col(COL.sodium));
    const sel = new Set(st.anim && st.anim.targets.length ? st.anim.targets : selGroup(st.sel)), hov = st.hover;
    const conds = new Map(); for (const p of parts) conds.set(p, cond(p));
    for (const m of allMeshes) {
      const p = m.userData.gPart, c = p ? conds.get(p) : null;
      if (!m.userData.disp) m.userData.disp = m.material;
      const ghost = !m.userData.gBallast && ((sel.size && !sel.has(p)) || (st.heat && (!c || c.na)));
      m.material = ghost ? ghostMat : m.userData.disp;
      if (ghost) continue;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      for (const mt of mats) {
        const b = mt.userData.base; if (!b) continue;
        mt.color.copy(b.color); mt.emissive.copy(b.emissive); mt.emissiveIntensity = b.ei; mt.roughness = b.rough; mt.metalness = b.metal;
        mt.opacity = b.op; mt.transparent = b.tr; mt.depthWrite = b.dw;
        if (st.heat) {
          if (c && !c.na) { const hc = heatColor(c.h); mt.color.copy(hc).multiplyScalar(0.4); mt.emissive.copy(hc); mt.emissiveIntensity = 0.5; mt.metalness = 0.1; mt.roughness = 0.6; }
          else if (m.userData.gBallast) { mt.color.setScalar(0.08); }
          else { mt.color.setRGB(0.07, 0.08, 0.1); mt.emissive.setRGB(0, 0, 0); mt.opacity = 0.2; mt.transparent = true; mt.depthWrite = false; mt.metalness = 0.2; }
        }
        if (sel.size) {
          if (sel.has(p)) { if (!st.heat) { mt.emissive.copy(orange); mt.emissiveIntensity = 0.16; } mt.opacity = 1; mt.transparent = false; mt.depthWrite = true; }
          else { mt.color.multiplyScalar(0.25); mt.emissiveIntensity *= 0.15; mt.opacity = Math.min(mt.opacity, 0.22); mt.transparent = true; mt.depthWrite = false; }
        } else if (hov && p === hov) { mt.emissive.lerp(orange, 0.5); mt.emissiveIntensity = Math.max(mt.emissiveIntensity, 0.25); }
      }
    }
    st.conds = conds;
    buildOutline();
  }
  // omrids om den valgte del: indvendigt vendt skal, skaleret om delens egen boks (ingen revner ved hårde kanter)
  let outlineMat = null, outlines = [], ghostMat = null;
  function makeGhost() {
    // røntgen-hologram til dæmpede dele og dele uden måling: kun kantlys, ingen lysberegning (billig)
    ghostMat = new THREE.ShaderMaterial({
      uniforms: { uC: { value: col(0x8cc6e6) }, uA: { value: 1 } },
      vertexShader: [
        'varying vec3 vN; varying vec3 vV;', '#include <common>', 'void main(){', '#include <beginnormal_vertex>', '#include <defaultnormal_vertex>',
        '#include <begin_vertex>', '#include <project_vertex>', 'vN = normalize(transformedNormal); vV = normalize(-mvPosition.xyz); }'].join(String.fromCharCode(10)),
      fragmentShader: [
        'uniform vec3 uC; uniform float uA; varying vec3 vN; varying vec3 vV;',
        'void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);',
        'gl_FragColor = vec4(uC * (0.12 + 0.9 * f), (0.07 + 0.5 * f) * uA); }'].join(String.fromCharCode(10)),
      transparent: true, depthWrite: false, side: THREE.FrontSide, fog: false,
    });
  }
  function buildOutline() {
    for (const o of outlines) o.parent && o.parent.remove(o); outlines = [];
    const sel = st.anim && st.anim.targets.length ? st.anim.targets : selGroup(st.sel); if (!sel.length) return;
    if (!outlineMat) outlineMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.5, 0.62, 0.08), side: THREE.BackSide, transparent: true, opacity: 0.9, depthWrite: false, fog: false });
    for (const p of sel) for (const m of p.meshes) {
      if (m.isInstancedMesh) continue;
      const g = m.geometry; if (!g.boundingBox) g.computeBoundingBox();
      const bb = g.boundingBox, c = bb.getCenter(new THREE.Vector3()), s = bb.getSize(new THREE.Vector3());
      const ws = new THREE.Vector3(); m.getWorldScale(ws);
      const t = 0.016, k = v3(1 + 2 * t / Math.max(1e-3, s.x * ws.x), 1 + 2 * t / Math.max(1e-3, s.y * ws.y), 1 + 2 * t / Math.max(1e-3, s.z * ws.z));
      const o = new THREE.Mesh(g, outlineMat); o.matrixAutoUpdate = false;
      o.matrix.makeTranslation(c.x, c.y, c.z).multiply(new THREE.Matrix4().makeScale(k.x, k.y, k.z)).multiply(new THREE.Matrix4().makeTranslation(-c.x, -c.y, -c.z));
      o.userData.noPick = true; o.renderOrder = 3; o.layers.enable(1); m.add(o); outlines.push(o);
    }
  }

  // ---------------------------------------------------------------- eksploderet visning
  let tv = null;
  function updateExplode() {
    for (const p of parts) { p.prog = eio(clamp((st.E - p.delay) / 0.45, 0, 1)); p.cur.copy(p.ex).multiplyScalar(p.prog).add(p.anim); }
    for (const p of parts) for (const ni of p.nodeInfo) {
      tv.copy(p.cur); if (ni.anc) tv.sub(ni.anc.cur);
      tv.applyMatrix3(ni.inv3); ni.n.position.copy(ni.rest).add(tv);
    }
    const a = guide.geometry.attributes.position.array;
    for (let i = 0; i < parts.length; i++) { const p = parts[i]; p.c0.toArray(a, i * 6); tv.copy(p.c0).add(p.cur); tv.toArray(a, i * 6 + 3); }
    guide.geometry.attributes.position.needsUpdate = true;
    if (st.kappe) ballastGroup.position.copy(st.kappe.cur); // ballasten sidder på kappen og følger den ud
    const vis = clamp(st.E * 2, 0, 1) * 0.55; guide.material.opacity = vis; st.dots.material.opacity = vis * 1.4; guide.visible = st.dots.visible = vis > 0.01;
  }

  // alle shader-varianter oversættes på forhånd, så første dækskift/valg/belastning ikke hakker
  function precompile() {
    const tmp = [];
    if (wheelInfo.length) {
      const w = wheelInfo[0], keep = w.over; w.over = null;
      for (const t of ['kaede', 'pig']) { tireOverlay(w, t); if (w.over) tmp.push(w.over); w.over = null; }
      w.over = keep;
    }
    if (!outlineMat) outlineMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.5, 0.62, 0.08), side: THREE.BackSide, transparent: true, opacity: 0.9, depthWrite: false, fog: false });
    const any = allMeshes.find(m => !m.isInstancedMesh);
    if (any) { for (const mt of [ghostMat, outlineMat]) { const g = new THREE.Mesh(any.geometry, mt); any.add(g); tmp.push(g); } }
    const inst = tmp.length ? tmp[0].children.find(x => x.isInstancedMesh) : null;
    if (inst) { const gi = new THREE.InstancedMesh(inst.geometry, ghostMat, 1); tmp[0].add(gi); }
    st.sparks.visible = true;
    camera.position.set(4, 2, 4); camera.lookAt(0, 0.4, 0); camera.updateMatrixWorld();
    try { RND.compile(scene, camera); } catch (e) { console.warn('[Garage] precompile', e); }
    for (const o of tmp) {
      o.traverse(x => { if (x.isMesh) { const i = allMeshes.indexOf(x); if (i >= 0) allMeshes.splice(i, 1); for (const p of parts) { const j = p.meshes.indexOf(x); if (j >= 0) p.meshes.splice(j, 1); } } });
      if (o.parent) o.parent.remove(o);
    }
    st.sparks.visible = false;
  }
  // ---------------------------------------------------------------- scene og init
  function init(sne) {
    if (inited) return;
    SNE = sne; THREE = sne.THREE || window.THREE; RND = sne.renderer;
    orange = new THREE.Color(); tv = new THREE.Vector3(); ray = new THREE.Raycaster(); ndc = new THREE.Vector2(); cc = new THREE.Color();
    sRGB = RND.outputEncoding === THREE.sRGBEncoding;
    scene = new THREE.Scene(); scene.background = null; scene.autoUpdate = false;
    world = new THREE.Group(); scene.add(world);
    floorGroup = new THREE.Group(); scene.add(floorGroup);
    robotRoot = new THREE.Group(); world.add(robotRoot);
    camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.05, 80);
    buildHall();
    scene.environment = buildEnv();
    floorMat.envMap = scene.environment;
    const gl2 = RND.capabilities.isWebGL2;
    reflRT = new THREE.WebGLRenderTarget(4, 4, { type: THREE.UnsignedByteType, depthBuffer: true, stencilBuffer: false });
    reflRT.texture.encoding = RND.outputEncoding; // samme program som på skærmen, så materialerne ikke skifter shader to gange pr. billede
    reflU.tRefl.value = reflRT.texture; reflU.uRes.value = new THREE.Vector2(1, 1);
    makeGhost();
    buildRobot();
    syncRobot(true);
    precompile();
    inited = true;
  }

  // ---------------------------------------------------------------- DOM
  function buildDom() {
    root = document.createElement('div'); root.className = 'gar-root gar-arrive';
    root.innerHTML = `
      <div class="gar-fade"></div>
      <header class="gar-top">
        <div class="gar-brand"><small>Ladestation \u00b7 v\u00e6rksted</small><b>V\u00e6rkstedet</b></div>
        <div class="gar-stats">
          <div class="gar-stat"><span class="gar-k">Klokken</span><span class="gar-v gar-num" data-r="clock">02:00</span><span class="gar-s" data-r="left"></span></div>
          <div class="gar-stat"><span class="gar-k">V\u00e6rkstedstid</span><span class="gar-v gar-num" data-r="min">0 min</span><span class="gar-s">i alt i nat</span></div>
          <div class="gar-stat"><span class="gar-k">Udgifter</span><span class="gar-v gar-num" data-r="kr">0 kr</span><span class="gar-s">i alt i nat</span></div>
          <div class="gar-stat gar-meter"><span class="gar-k">Batteri</span><span class="gar-v gar-num" data-r="soc">100 %</span><i class="gar-bar"><b data-r="socbar"></b></i></div>
          <div class="gar-stat gar-meter"><span class="gar-k">Salt</span><span class="gar-v gar-num" data-r="salt">60 kg</span><i class="gar-bar gar-bar-ice"><b data-r="saltbar"></b></i></div>
        </div>
        <button class="gar-exit" data-a="exit" type="button">K\u00f8r ud <kbd>Esc</kbd></button>
      </header>
      <aside class="gar-panel gar-shop" aria-label="V\u00e6rkstedsarbejde">
        <div class="gar-ph"><h2>V\u00e6rkstedsarbejde</h2><span class="gar-sub">Hver opgave koster tid, og sneen falder imens</span></div>
        <div class="gar-tabs" role="tablist"></div>
        <div class="gar-list" data-r="shop"></div>
      </aside>
      <aside class="gar-panel gar-side" aria-label="Dele">
        <section class="gar-card" data-r="card" hidden></section>
        <section class="gar-worst">
          <div class="gar-ph"><h2>Mest belastede dele</h2><span class="gar-sub">Sorteret efter tilstand \u00b7 klik for at se delen</span></div>
          <ol class="gar-wl" data-r="worst"></ol>
        </section>
      </aside>
      <div class="gar-dock">
        <div class="gar-dockrow">
          <button type="button" class="gar-btn" data-a="explode" aria-pressed="false"><span>Adskil</span><kbd>E</kbd></button>
          <label class="gar-slider"><span class="gar-k">Eksploderet</span><input type="range" min="0" max="100" value="0" data-r="slider" aria-label="Eksploderet visning i procent"><span class="gar-num" data-r="pct">0 %</span></label>
          <button type="button" class="gar-btn" data-a="heat" aria-pressed="false"><span>Belastning</span><kbd>L</kbd></button>
        </div>
        <div class="gar-legend" data-r="legend"><i style="--c:#5cc28d"></i>God<i style="--c:#f2c14e"></i>Slidt<i style="--c:#ee5a4b"></i>Kritisk<i class="gar-pulse" style="--c:#ee5a4b"></i>Havari<i style="--c:#3a4250"></i>M\u00e5les ikke</div>
        <div class="gar-dockrow gar-mob">
          <button type="button" class="gar-btn gar-tab2" data-a="sheet-shop">V\u00e6rksted <span class="gar-badge" data-r="needN"></span></button>
          <button type="button" class="gar-btn gar-tab2" data-a="sheet-side">Dele</button>
        </div>
      </div>
      <div class="gar-hint">Tr\u00e6k for at dreje \u00b7 rul for zoom \u00b7 klik p\u00e5 en del \u00b7 <kbd>\u2190</kbd><kbd>\u2192</kbd> drejer skiven</div>
      <div class="gar-tip" data-r="tip" hidden></div>
      <div class="gar-stamp" data-r="stamp" hidden></div>
      <div class="gar-charge" data-r="charge" hidden></div>
      <div class="gar-title"><small>Natteskift</small><b>V\u00e6rkstedet</b></div>`;
    document.body.appendChild(root);
    const q = s => root.querySelector(s);
    st.dom = {}; root.querySelectorAll('[data-r]').forEach(el => st.dom[el.dataset.r] = el);
    on(root, 'click', onUiClick);
    const sl = st.dom.slider;
    on(sl, 'input', () => { st.Et = sl.value / 100; st.drag = true; touch(); updDock(); });
    on(sl, 'change', () => { st.drag = false; });
    on(root, 'pointermove', e => { if (e.target.closest('.gar-panel,.gar-dock,.gar-top')) hideTip(); });
  }
  function onUiClick(e) {
    const b = e.target.closest('[data-a],[data-id],[data-part],[data-tab]'); if (!b || !root.contains(b)) return;
    touch();
    if (b.dataset.tab) { st.tab = b.dataset.tab; renderShop(); return; }
    if (b.dataset.part) { select(partById[b.dataset.part], true); return; }
    if (b.dataset.id) { if (!b.disabled) doAction(b.dataset.id); return; }
    const a = b.dataset.a;
    if (a === 'exit') exit();
    else if (a === 'explode') toggleExplode();
    else if (a === 'heat') toggleHeat();
    else if (a === 'desel') select(null);
    else if (a === 'sheet-shop' || a === 'sheet-side') { const s = a.slice(6); setSheet(st.sheet === s ? '' : s); }
  }
  function setSheet(s) { st.sheet = s; root.classList.toggle('gar-sheet-shop', s === 'shop'); root.classList.toggle('gar-sheet-side', s === 'side');
    root.querySelectorAll('.gar-tab2').forEach(b => b.classList.toggle('gar-on', b.dataset.a === 'sheet-' + s)); }
  function toggleExplode() { st.Et = st.Et > 0.5 ? 0 : 1; st.drag = false; updDock(); }
  function toggleHeat() { st.heat = !st.heat; applyLook(); updDock(); renderWorst(); }
  function updDock() {
    const d = st.dom; d.slider.value = Math.round(st.Et * 100); d.pct.textContent = Math.round(st.Et * 100) + ' %';
    const be = root.querySelector('[data-a=explode]'), bh = root.querySelector('[data-a=heat]');
    be.setAttribute('aria-pressed', st.Et > 0.5); be.querySelector('span').textContent = st.Et > 0.5 ? 'Saml' : 'Adskil';
    bh.setAttribute('aria-pressed', st.heat); root.classList.toggle('gar-heat', st.heat);
  }
  const CATS = [
    ['dv', 'Drivlinje V', it => it.grp === 'Drivlinje' && /-0$/.test(it.id)],
    ['dh', 'Drivlinje H', it => it.grp === 'Drivlinje' && /-1$/.test(it.id)],
    ['daek', 'D\u00e6k', it => it.grp === 'D\u00e6k'],
    ['plov', 'Plov og salt', it => it.grp === 'Plov og salt' && !/^ballast/.test(it.id)],
    ['bat', 'Batteri', it => it.grp === 'Batteri'],
    ['ball', 'Ballast', it => /^ballast/.test(it.id)],
  ];
  function itemHtml(it, compact) {
    const cls = it.need ? 'gar-need' : it.soon ? 'gar-soon' : '';
    const cost = it.min + ' min' + (it.kr ? ' \u00b7 ' + kr(it.kr) : '');
    return `<button type="button" class="gar-item ${cls}${it.cur ? ' gar-cur' : ''}" data-id="${esc(it.id)}" ${it.dis ? 'disabled' : ''}>
      <span class="gar-in">${esc(it.navn)}${it.cur ? ' <em>monteret</em>' : ''}${it.need ? ' <em class="gar-tag-need">skal laves</em>' : it.soon ? ' <em class="gar-tag-soon">snart</em>' : ''}</span>
      <span class="gar-is">${esc(it.st)}</span><span class="gar-ic gar-num">${cost}</span></button>`;
  }
  function renderShop() {
    const L = SNE.sim.vaerkListe();
    const cnt = CATS.map(([k, n, f]) => { const its = L.filter(f); return { k, n, its, need: its.filter(x => x.need && !x.dis).length, soon: its.filter(x => x.soon && !x.dis && !x.need).length }; });
    if (!st.tab) { const pri = cnt.slice().sort((a, b) => (b.need * 10 + b.soon) - (a.need * 10 + a.soon))[0]; st.tab = pri && (pri.need || pri.soon) ? pri.k : 'dv'; }
    root.querySelector('.gar-tabs').innerHTML = cnt.map(c => `<button type="button" role="tab" data-tab="${c.k}" class="gar-chip${st.tab === c.k ? ' gar-on' : ''}" aria-selected="${st.tab === c.k}">${c.n}${c.need ? '<i class="gar-dot gar-dot-need"></i>' : c.soon ? '<i class="gar-dot gar-dot-soon"></i>' : ''}</button>`).join('');
    const cur = cnt.find(c => c.k === st.tab) || cnt[0];
    st.dom.shop.innerHTML = cur.its.map(it => itemHtml(it)).join('') || '<p class="gar-empty">Intet at lave her.</p>';
    const needN = L.filter(x => x.need && !x.dis).length; st.dom.needN.textContent = needN || ''; st.dom.needN.hidden = !needN;
  }
  function renderWorst() {
    const seen = new Set(), rows = [];
    for (const p of parts) {
      const c = st.conds ? st.conds.get(p) : cond(p); if (c.na) continue;
      const key = (p.sim.slags === 'daek') ? 'daek' : p.id; if (seen.has(key)) continue; seen.add(key);
      rows.push({ p, c, navn: p.sim.slags === 'daek' ? 'D\u00e6k (alle fire)' : p.navn });
    }
    rows.sort((a, b) => a.c.h - b.c.h);
    st.dom.worst.innerHTML = rows.slice(0, 8).map(({ p, c, navn }) => `<li><button type="button" data-part="${esc(p.id)}" class="gar-wr gar-l-${c.lvl}${st.sel === p ? ' gar-on' : ''}">
        <span class="gar-wn">${esc(navn)}${sideOf(p) !== null ? ' <small>' + (sideOf(p) ? 'H' : 'V') + '</small>' : ''}</span>
        <span class="gar-wp gar-num">${c.fail ? 'HAVARI' : f0(c.h * 100) + ' %'}</span>
        <i class="gar-hb"><b style="width:${Math.max(3, c.h * 100)}%"></b></i><span class="gar-wt">${esc(c.txt)}</span></button></li>`).join('');
  }
  function liveRows(p) {
    const sim = SNE.sim, si = sideOf(p), sl = p.sim.slags, C = sim.C, rows = [];
    const bar = (k, v, max, unit, warnAt, dec) => rows.push({ k, v, max, unit, warnAt, dec });
    if (si !== null && ['skade', 'levetid', 'temp', 'laengning'].includes(sl)) {
      const S = sim.S[si];
      bar('Moment p\u00e5 mellemaksel', S.Tmel || 0, C.Tglid, 'Nm', C.Te, 0);
      bar('Motormoment', S.Tm || 0, C.Tpeak, 'Nm', C.Tkont, 2);
      bar('Tr\u00e6kkraft', Math.abs(S.F || 0), C.Tglid * C.iK * C.etaK / C.r, 'N', 1e9, 0);
      bar('Motortemperatur', S.temp, 155, '\u00b0C', 120, 0);
      const by = { trac: 'greb (hjulspin)', clutch: 'slipkoblingen', motor: 'motoren', dead: 'drivlinjen er ude' }[S.limBy];
      rows.note = S.limited && by ? 'Sidst begr\u00e6nset af ' + by : 'Ikke begr\u00e6nset ved sidste k\u00f8rsel';
    } else if (sl === 'plov') {
      const P = (sim.st.live || {}).P || {};
      bar('Plovkraft', P.F || 0, 1500, 'N', 900, 0); bar('Kile fyldt', (P.fill || 0) * 100, 100, '%', 90, 0);
      rows.note = 'Plovvinkel vises som 0\u00b0 i v\u00e6rkstedet';
    } else if (sl === 'batteri') {
      const live = sim.st.live || {}; bar('Effekt', live.Ptot || 0, 900, 'W', 600, 0); bar('Ladetilstand', sim.R.soc * 100, 100, '%', 1e9, 0);
      rows.note = 'Kulden tager ' + f0((1 - sim.kT()) * 100) + ' % af kapaciteten';
    } else if (sl === 'daek') {
      const S0 = sim.S[0], S1 = sim.S[1];
      bar('Greb venstre (\u03bc)', S0.mu || 0, 0.8, '', 1e9, 2); bar('Greb h\u00f8jre (\u03bc)', S1.mu || 0, 0.8, '', 1e9, 2);
      rows.note = 'Underlag ved sidste k\u00f8rsel: ' + ['t\u00f8r asfalt', 'sne', 'is'][Math.max(S0.surf || 0, S1.surf || 0)];
    } else if (sl === 'salt') {
      bar('Salt i spreder', sim.R.saltKg, C.saltMax, 'kg', 1e9, 0); rows.note = sim.R.saltOn ? 'Sprederen var t\u00e6ndt' : 'Sprederen var slukket';
    }
    return rows;
  }
  function renderCard() {
    const el = st.dom.card, p = st.sel;
    root.classList.toggle('gar-hassel', !!p);
    if (!p) { el.hidden = true; el.innerHTML = ''; return; }
    const c = cond(p), si = sideOf(p), acts = actionsFor(p), live = liveRows(p);
    const tyres = p.sim.slags === 'daek';
    el.hidden = false; if (st.cardFor !== p) { st.cardFor = p; el.scrollTop = 0; }
    el.innerHTML = `
      <div class="gar-ch"><div><small>${si !== null ? SIDE[si] : (tyres ? 'Alle fire hjul' : 'Midt p\u00e5 robotten')} \u00b7 ${esc(p.gruppe || '')}</small><h3>${esc(tyres ? 'D\u00e6k' : p.navn)}</h3></div>
        <button type="button" class="gar-x" data-a="desel" aria-label="Luk">\u00d7</button></div>
      <div class="gar-cond gar-l-${c.lvl}"><b>${c.word}</b><span>${esc(c.txt)}</span>${c.na ? '' : `<i class="gar-hb"><b style="width:${Math.max(3, c.h * 100)}%"></b></i>`}</div>
      ${live.length ? `<div class="gar-live"><h4>Seneste k\u00f8rsel</h4>${live.map(r => { const pct = clamp(r.v / r.max, 0, 1) * 100, hot = r.v >= r.warnAt;
        return `<div class="gar-lr${hot ? ' gar-hot' : ''}"><span>${r.k}</span><span class="gar-num">${r.dec ? f2(r.v) : f0(r.v)}${r.unit ? ' ' + r.unit : ''}</span><i class="gar-hb"><b style="width:${pct}%"></b></i></div>`; }).join('')}
        ${live.note ? `<p class="gar-note">${esc(live.note)}</p>` : ''}</div>` : ''}
      ${p.info ? `<p class="gar-info">${esc(p.info)}</p>` : ''}
      <div class="gar-acts">${acts.length ? acts.map(it => itemHtml(it).replace('class="gar-item', 'class="gar-item gar-act')).join('') : '<p class="gar-empty">Ingen v\u00e6rkstedsopgave til denne del.</p>'}</div>`;
    const first = acts.find(x => !x.dis);
    const btn = first && el.querySelector(`[data-id="${first.id}"]`); if (btn) btn.classList.add('gar-primary');
  }
  function renderTop(tDisp, krDisp, minDisp) {
    const sim = SNE.sim, d = st.dom, R = sim.R;
    const t = tDisp != null ? tDisp : sim.st.t;
    d.clock.textContent = clock(t); d.left.textContent = left(t);
    d.min.textContent = f0(minDisp != null ? minDisp : sim.st.vaerkMin) + ' min'; d.kr.textContent = kr(krDisp != null ? krDisp : sim.st.kr);
    const soc = st.socDisp != null ? st.socDisp : R.soc;
    d.soc.textContent = f0(soc * 100) + ' %'; d.socbar.style.width = (soc * 100) + '%'; d.socbar.parentNode.classList.toggle('gar-low', soc < 0.25);
    const salt = st.saltDisp != null ? st.saltDisp : R.saltKg;
    d.salt.textContent = f0(salt) + ' kg'; d.saltbar.style.width = (salt / sim.C.saltMax * 100) + '%';
  }
  function renderAll() { applyLook(); renderShop(); renderWorst(); renderCard(); renderTop(); updDock(); }
  function hideTip() { if (st.dom && st.dom.tip) st.dom.tip.hidden = true; }

  // ---------------------------------------------------------------- vælg del, kamera
  function partCenterWorld(ps, out) {
    const b = new THREE.Box3(); for (const p of ps) for (const n of p.objs) b.expandByObject(n);
    b.getCenter(out); return b.getSize(new THREE.Vector3()).length();
  }
  function select(p, fly) {
    if (!p && !st.sel) return;
    st.sel = p || null; st.hover = null;
    applyLook(); renderCard(); renderWorst();
    if (st.sel) {
      if (st.sheet !== 'side' && isPhone()) setSheet('side');
      const c = new THREE.Vector3(), s = partCenterWorld(selGroup(st.sel), c);
      flyTo(c, clamp(s * 2.0 + 1.4, 2.0, defDist), 0.9);
    } else flyTo(defTarget.clone(), st.fit || defDist, 0.9);
  }
  function isPhone() { return window.innerWidth <= 760; }
  function flyTo(target, dist, dur, sphOverride) {
    const sph = new THREE.Spherical().setFromVector3(tv.copy(camera.position).sub(controls.target));
    sph.radius = dist; sph.phi = clamp(sph.phi, 0.75, 1.28);
    if (sphOverride) Object.assign(sph, sphOverride);
    const toP = new THREE.Vector3().setFromSpherical(sph).add(target);
    st.camTween = { p0: camera.position.clone(), t0: controls.target.clone(), p1: toP, t1: target.clone(), t: 0, dur, sph0: new THREE.Spherical().setFromVector3(tv.copy(camera.position).sub(controls.target)), sph1: sph.clone() };
  }
  function stepCam(dt) {
    const c = st.camTween; if (!c) return;
    c.t += dt; const u = eio(clamp(c.t / c.dur, 0, 1));
    // følg en bue (sfæriske koordinater) i stedet for en ret linje
    controls.target.lerpVectors(c.t0, c.t1, u);
    let dth = c.sph1.theta - c.sph0.theta; while (dth > Math.PI) dth -= 2 * Math.PI; while (dth < -Math.PI) dth += 2 * Math.PI;
    const s = new THREE.Spherical(lerp(c.sph0.radius, c.sph1.radius, u), lerp(c.sph0.phi, c.sph1.phi, u), c.sph0.theta + dth * u);
    camera.position.setFromSpherical(s).add(controls.target);
    camera.lookAt(controls.target);
    if (c.t >= c.dur) { st.camTween = null; controls.update(); }
  }
  function touch() { st.idle = 0; }

  // ---------------------------------------------------------------- udskiftning
  function stampMsg(it) {
    const el = st.dom.stamp;
    el.innerHTML = `<small>${esc(it.navn)}</small><b class="gar-num">+${it.min} min${it.kr ? ' \u00b7 ' + kr(it.kr) : ''}</b><span>Sneen faldt imens</span>`;
    el.hidden = false; el.classList.remove('gar-go'); void el.offsetWidth; el.classList.add('gar-go');
    clearTimeout(st.stampTo); st.stampTo = setTimeout(() => { el.hidden = true; }, 3200);
  }
  function doAction(id) {
    if (st.anim) return;
    const sim = SNE.sim, R = sim.R;
    const before = sim.vaerkListe().find(x => x.id === id); if (!before || before.dis) return;
    const [a] = id.split('-');
    const kind = a === 'daek' ? 'tire' : a === 'stram' ? 'tighten' : (a === 'lad100' || a === 'lad30') ? 'charge' : a === 'salt' ? 'fill' : a === 'ballast' ? 'ballast' : a === 'plov' ? 'fix' : 'swap';
    const targets = kind === 'ballast' ? [] : partsForAction(id);
    const snap = { t: sim.st.t, kr: sim.st.kr, min: sim.st.vaerkMin, soc: R.soc, salt: R.saltKg, dent: 1 - R.plovH, ballast: R.ballast, tire: R.tire };
    const it = sim.vaerk(id); if (!it) return;
    const after = { t: sim.st.t, kr: sim.st.kr, min: sim.st.vaerkMin, soc: R.soc, salt: R.saltKg };
    // vis den gamle tilstand, indtil den nye del er monteret
    st.socDisp = snap.soc; st.saltDisp = snap.salt;
    const durs = { swap: 2.7, tire: 3.2, tighten: 1.8, charge: 3.0, fill: 2.2, ballast: 2.0, fix: 2.4 };
    st.anim = { id, it, kind, targets, t: 0, dur: durs[kind], snap, after, swapped: false, sparked: false };
    if (targets.length) { const c = new THREE.Vector3(), s = partCenterWorld(targets, c); flyTo(c, clamp(s * 2.0 + 1.5, 2.2, defDist), 0.7); }
    else if (kind === 'ballast') { const c = new THREE.Vector3(); ballastGroup.children[0].getWorldPosition(c); flyTo(c, 2.6, 0.7); }
    st.sel = targets.length ? targets[0] : null;
    applyLook(); renderCard();
    root.classList.add('gar-busy');
    stampMsg(it);
    if (kind === 'charge') showCharge('Batteri', snap.soc, after.soc, '%');
    if (kind === 'fill') showCharge('Salt', snap.salt / sim.C.saltMax, after.salt / sim.C.saltMax, 'kg');
  }
  function showCharge(label, a, b, unit) {
    const el = st.dom.charge;
    el.innerHTML = `<small>${label}</small><div class="gar-cells">${Array.from({ length: 12 }, () => '<i></i>').join('')}</div><b class="gar-num" data-v></b>`;
    el.hidden = false; st.charge = { a, b, unit, el, cells: [...el.querySelectorAll('i')], v: el.querySelector('[data-v]') };
  }
  function burst(center) {
    const a = st.sparks.geometry.attributes.position.array, v = st.sparkV, r = Math.random;
    for (let i = 0; i < a.length / 3; i++) { a[i * 3] = center.x; a[i * 3 + 1] = center.y; a[i * 3 + 2] = center.z; const th = r() * 6.283, sp = 0.6 + r() * 1.8; v[i * 3] = Math.cos(th) * sp; v[i * 3 + 1] = 0.8 + r() * 2.2; v[i * 3 + 2] = Math.sin(th) * sp; }
    st.sparks.geometry.attributes.position.needsUpdate = true; st.sparkLife = 1;
  }
  function stepSparks(dt) {
    if (!(st.sparkLife > 0)) { st.sparks.visible = false; return; }
    st.sparks.visible = true; st.sparkLife -= dt * 1.1;
    const a = st.sparks.geometry.attributes.position.array, v = st.sparkV;
    for (let i = 0; i < a.length / 3; i++) { v[i * 3 + 1] -= 6 * dt; a[i * 3] += v[i * 3] * dt; a[i * 3 + 1] = Math.max(0, a[i * 3 + 1] + v[i * 3 + 1] * dt); a[i * 3 + 2] += v[i * 3 + 2] * dt; }
    st.sparks.geometry.attributes.position.needsUpdate = true; st.sparks.material.opacity = clamp(st.sparkLife, 0, 1);
  }
  function setPartFx(ps, op, glow, white) {
    for (const p of ps) for (const m of p.meshes) for (const mt of (Array.isArray(m.material) ? m.material : [m.material])) {
      if (!mt.userData.base || mt === ghostMat) continue;
      mt.transparent = op < 0.999 || mt.userData.base.tr; mt.opacity = op; mt.depthWrite = op > 0.5;
      if (glow > 0) { mt.emissive.setRGB(white ? 1 : 1, white ? 0.95 : 0.6, white ? 0.85 : 0.2); mt.emissiveIntensity = glow; }
    }
  }
  function stepAnim(dt) {
    const A = st.anim; if (!A) return;
    A.t += dt; const t = A.t, sim = SNE.sim;
    // tiden går: uret tæller op, og sneen falder hurtigere udenfor
    const tu = eio(clamp((t - 0.15) / Math.min(1.9, A.dur * 0.7), 0, 1));
    st.snowMul = 1 + 9 * Math.sin(Math.PI * tu);
    renderTop(lerp(A.snap.t, A.after.t, tu), lerp(A.snap.kr, A.after.kr, tu), lerp(A.snap.min, A.after.min, tu));
    const ps = A.targets;
    const outDir = p => { const d = p.ex.lengthSq() > 1e-6 ? p.ex.clone().normalize() : v3(0, 1, 0); return d.multiplyScalar(0.9).add(v3(0, 0.35, 0)); };
    if (A.kind === 'swap' || A.kind === 'tire') {
      const stag = A.kind === 'tire' ? 0.18 : 0;
      ps.forEach((p, k) => {
        const tt = t - k * stag, o = outDir(p);
        if (A.kind === 'tire') { o.set(0, 0.15, (sideOf(p) === 0 || p.c0.z < 0) ? -1 : 1).multiplyScalar(0.9); }
        let op = 1, glow = 0;
        if (tt < 0.85) { const u = ein(clamp(tt / 0.85, 0, 1)); p.anim.copy(o).multiplyScalar(u * 1.3); op = 1 - u; }
        else if (tt < 1.75) { const u = clamp((tt - 0.85) / 0.9, 0, 1); p.anim.copy(o).multiplyScalar((1 - eback(u)) * 1.3).add(v3(0, (1 - eout(u)) * 0.5, 0)); op = clamp(u * 2, 0, 1); glow = 1.2; }
        else { p.anim.set(0, 0, 0); glow = Math.max(0, 1.2 * (1 - (tt - 1.75) / 0.9)); }
        p._op = op; p._glow = glow;
      });
      if (!A.swapped && t > 0.85) { A.swapped = true; syncRobot(); applyLook(); }
      if (!A.sparked && t > 1.6) { A.sparked = true; if (ps.length) { const c = new THREE.Vector3(); for (const p of ps) c.add(p.c0).add(p.ex.clone().multiplyScalar(p.prog)); c.divideScalar(ps.length); burst(c); } }
    } else if (A.kind === 'tighten') {
      for (const p of ps) { const w = Math.sin(t * 40) * 0.012 * (1 - clamp(t / 1.2, 0, 1)); p.anim.set(w, w * 0.5, 0); p._op = 1; p._glow = 0.9 * Math.max(0, Math.sin(clamp(t / 1.4, 0, 1) * Math.PI)); }
      if (!A.swapped && t > 0.9) { A.swapped = true; applyLook(); }
    } else if (A.kind === 'fix') {
      const u = eio(clamp((t - 0.3) / 1.4, 0, 1)); setDent(lerp(A.snap.dent, 0, u), true);
      const hit = Math.floor((t - 0.3) / 0.28); if (hit >= 0 && hit < 5 && hit !== A.lastHit) { A.lastHit = hit; const c = new THREE.Vector3(); st.plowBox.getCenter(c); c.x = st.plowBox.max.x; c.z += (Math.random() - 0.5) * 0.6; burst(c); }
      for (const p of ps) { p._op = 1; p._glow = 0.6 * Math.max(0, Math.sin(t * 22)) * (t < 1.8 ? 1 : 0); }
      if (!A.swapped && t > 1.8) { A.swapped = true; applyLook(); }
    } else if (A.kind === 'charge' || A.kind === 'fill') {
      const u = eio(clamp((t - 0.3) / (A.dur - 0.9), 0, 1)), C = st.charge;
      for (const p of ps) { p._op = 1; p._glow = 0.35 + 0.35 * Math.sin(t * 9); }
      if (C) {
        const v = lerp(C.a, C.b, u); C.cells.forEach((c, k) => c.classList.toggle('gar-full', (k + 0.5) / C.cells.length <= v));
        C.v.textContent = C.unit === '%' ? f0(v * 100) + ' %' : f0(v * sim.C.saltMax) + ' kg';
        if (A.kind === 'charge') st.socDisp = v; else st.saltDisp = v * sim.C.saltMax;
        // position over delen på skærmen
        if (ps.length) { const c = new THREE.Vector3(); partCenterWorld(ps, c); c.y += 0.35; c.project(camera); C.el.style.left = ((c.x + 1) / 2 * 100) + '%'; C.el.style.top = ((1 - c.y) / 2 * 100) + '%'; }
      }
      if (chargerLeds && A.kind === 'charge') chargerLeds.material.color.setRGB(0.4 + 2 * Math.abs(Math.sin(t * 6)), 2.0, 0.9);
      if (!A.swapped && u >= 1) { A.swapped = true; applyLook(); }
    } else if (A.kind === 'ballast') {
      const nb0 = Math.round((A.snap.ballast || 0) / 25), nb1 = Math.round((sim.R.ballast || 0) / 25);
      ballastGroup.children.forEach((g, k) => {
        const tt = clamp((t - 0.2 - k * 0.15) / 0.6, 0, 1);
        if (k < nb1 && k >= nb0) { g.visible = true; g.position.y = g.userData.y0 + (1 - eout(tt)) * 1.2; }
        else if (k >= nb1 && k < nb0) { g.visible = tt < 1; g.position.y = g.userData.y0 + ein(tt) * 1.2; }
      });
      if (!A.swapped && t > 1.6) { A.swapped = true; st.ballastShown = nb1; }
    }
    for (const p of ps) if (p._op !== undefined) setPartFx([p], p._op, p._glow || 0, true);
    if (t >= A.dur) finishAnim();
  }
  function finishAnim() {
    const A = st.anim; st.anim = null;
    for (const p of parts) { p.anim.set(0, 0, 0); delete p._op; delete p._glow; }
    st.socDisp = st.saltDisp = null; st.snowMul = 1;
    if (st.charge) { st.charge.el.hidden = true; st.charge = null; }
    if (chargerLeds) chargerLeds.material.color.setRGB(0.4, 2.0, 0.9);
    syncRobot(); root.classList.remove('gar-busy');
    renderAll();
    if (SNE.sim.st.ended) { setTimeout(() => { if (isOpen) exit(); }, 900); }
  }

  // ---------------------------------------------------------------- input
  let ray = null, ndc = null;
  function pick(e) {
    const rc = RND.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(allMeshes, false);
    for (const h of hits) {
      const m = h.object, p = m.userData.gPart; if (m.userData.noPick || !p) continue;
      if (m.material === ghostMat && st.heat && cond(p).na) continue;
      return p;
    }
    return null;
  }
  function onDown(e) { st.down = { x: e.clientX, y: e.clientY, t: performance.now() }; touch(); hideTip(); }
  function onUp(e) {
    const d = st.down; st.down = null; if (!d || st.anim) return;
    if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6 || performance.now() - d.t > 600) return;
    const p = pick(e); select(p, true);
  }
  function onMove(e) {
    if (e.pointerType !== 'mouse' || st.down) return;
    st.mouse = { x: e.clientX, y: e.clientY, e };
  }
  function hoverStep() {
    if (!st.mouse || st.anim || st.camTween) return;
    const e = st.mouse.e; st.mouse = null;
    const p = pick(e);
    if (p !== st.hover) { st.hover = p; if (!st.sel) applyLook(); RND.domElement.style.cursor = p ? 'pointer' : ''; }
    const tip = st.dom.tip;
    if (p) { const c = (st.conds && st.conds.get(p)) || cond(p);
      tip.innerHTML = `<b>${esc(p.sim.slags === 'daek' ? 'D\u00e6k' : p.navn)}${sideOf(p) !== null ? ' \u00b7 ' + (sideOf(p) ? 'h\u00f8jre' : 'venstre') : ''}</b><span class="gar-l-${c.lvl}">${esc(c.na ? 'Klik for info' : c.word + ' \u00b7 ' + c.txt)}</span>`;
      tip.hidden = false; tip.style.left = (e.clientX + 16) + 'px'; tip.style.top = (e.clientY + 14) + 'px'; }
    else tip.hidden = true;
  }
  function onKey(e) {
    if (!isOpen) return;
    const k = e.key, tag = (e.target && e.target.tagName) || '';
    const inRange = tag === 'INPUT';
    let handled = true;
    if (k === 'Escape') { if (st.sel) select(null); else exit(); }
    else if (k === 'v' || k === 'V') exit();
    else if (k === 'e' || k === 'E') toggleExplode();
    else if (k === 'l' || k === 'L') toggleHeat();
    else if (k.startsWith('Arrow') && !inRange) { st.keys[k] = true; touch(); }
    else handled = false;
    if (handled) { e.preventDefault(); e.stopPropagation(); }
  }
  function onKeyUp(e) { if (e.key && e.key.startsWith('Arrow')) { st.keys[e.key] = false; if (isOpen) e.stopPropagation(); } }

  // ---------------------------------------------------------------- open/close/frame
  function open(opt) {
    if (!inited) throw new Error('Garage.init(SNE) skal kaldes f\u00f8rst');
    if (isOpen) return;
    isOpen = true; onClose = (opt && opt.onClose) || null; st.exiting = false;
    st.sel = null; st.hover = null; st.anim = null; st.tab = null; st.E = st.Et = 0; st.heat = false; st.sheet = '';
    syncRobot(true);
    buildDom();
    const el = RND.domElement;
    st.saved = { touchAction: el.style.touchAction, cursor: el.style.cursor };
    controls = new THREE.OrbitControls(camera, el);
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.enablePan = false;
    controls.minDistance = 1.3; controls.maxDistance = 8.5; controls.minPolarAngle = 0.25; controls.maxPolarAngle = 1.5; controls.rotateSpeed = 0.6; controls.zoomSpeed = 0.8;
    controls.target.copy(defTarget);
    controls.addEventListener('start', touch);
    on(el, 'pointerdown', onDown); on(el, 'pointerup', onUp); on(el, 'pointermove', onMove);
    on(el, 'pointerleave', () => { st.mouse = null; hideTip(); if (st.hover) { st.hover = null; applyLook(); } });
    on(window, 'keydown', onKey, true); on(window, 'keyup', onKeyUp, true);
    const sz = RND.getSize(new THREE.Vector2()); resize(sz.x, sz.y);
    // ankomst: kameraet svinger ind fra porten
    const start = new THREE.Spherical(9.5, 1.08, -2.6);
    camera.position.setFromSpherical(start).add(defTarget); camera.lookAt(defTarget);
    flyTo(defTarget.clone(), st.fit || defDist, 2.6, { theta: 0.95, phi: 1.13 });
    st.camTween.sph0 = start;
    st.ttAng = -0.6; st.ttVel = 1.1; st.idle = 0;
    renderAll();
    setTimeout(() => root && root.classList.remove('gar-arrive'), 50);
  }
  function exit() {
    if (!isOpen || st.exiting) return; st.exiting = true;
    const cb = onClose; close(); if (cb) cb();
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    for (const [el, ev, fn, opt] of listeners) el.removeEventListener(ev, fn, opt); listeners.length = 0;
    if (controls) { controls.removeEventListener('start', touch); controls.dispose(); controls = null; }
    const el = RND.domElement; if (st.saved) { el.style.touchAction = st.saved.touchAction; el.style.cursor = st.saved.cursor; }
    clearTimeout(st.stampTo);
    if (st.anim) { st.anim = null; for (const p of parts) p.anim.set(0, 0, 0); }
    st.socDisp = st.saltDisp = null; st.charge = null; st.keys = {};
    if (root) { root.remove(); root = null; }
    st.dom = null; st.sel = null; st.hover = null; st.sheet = ''; st.off = 0;
    for (const o of outlines) o.parent && o.parent.remove(o); outlines = [];
    for (const m of allMeshes) if (m.userData.disp) m.material = m.userData.disp;
    if (camera.view && camera.view.enabled) camera.clearViewOffset();
  }
  function fitDist() {
    // robotten skal kunne ses i hele bredden, også på en smal telefon i portræt
    const r = Math.max(robotSize.x, robotSize.z) * 0.55, vf = camera.fov * D2R / 2, hf = Math.atan(Math.tan(vf) * camera.aspect);
    return clamp(Math.max(defDist, r / Math.tan(Math.min(vf, hf)) * 1.05), 3.6, 7.5);
  }
  function resize(w, h) {
    if (!camera) return; camera.aspect = w / Math.max(1, h);
    // smal skærm (telefon i portræt): større lodret synsvinkel, så den vandrette synsvinkel er mindst ca. 34°
    camera.fov = clamp(2 * Math.atan(Math.tan(17 * D2R) / camera.aspect) / D2R, 38, 68);
    camera.updateProjectionMatrix();
    if (robotSize) { st.fit = fitDist(); if (controls) controls.maxDistance = Math.max(8.5, st.fit + 1); }
  }
  let cc = null;
  function frame(dtReal) {
    if (!isOpen) return;
    const dt = clamp(dtReal || 0.016, 0, 0.1); st.t += dt; st.idle += dt; st.frameN++;
    st.fpsAcc += dtReal || 0; st.fpsN++; if (st.fpsAcc > 0.5) { st.fps = st.fpsN / st.fpsAcc; st.fpsAcc = 0; st.fpsN = 0; }
    // drejeskive: langsom automatisk rotation, når spilleren ikke gør noget
    let want = 0;
    if (st.keys.ArrowLeft) want = -1.3; else if (st.keys.ArrowRight) want = 1.3;
    else if (!st.sel && !st.anim && st.idle > 4) want = 0.16;
    st.ttVel += (want - st.ttVel) * Math.min(1, dt * (want === 0 ? 2.2 : 1.6));
    st.ttAng += st.ttVel * dt; robotRoot.rotation.y = st.ttAng; ttFloor.rotation.y = st.ttAng;
    if (controls && (st.keys.ArrowUp || st.keys.ArrowDown) && !st.camTween) {
      const s = new THREE.Spherical().setFromVector3(tv.copy(camera.position).sub(controls.target));
      s.phi = clamp(s.phi + (st.keys.ArrowUp ? -1 : 1) * dt * 0.9, controls.minPolarAngle, controls.maxPolarAngle);
      camera.position.setFromSpherical(s).add(controls.target);
    }
    // eksploderet visning
    const sp = st.drag ? 3.0 : 0.85;
    if (st.E !== st.Et) { const d = st.Et - st.E; st.E += Math.sign(d) * Math.min(Math.abs(d), dt * sp); }
    updateExplode();
    stepAnim(dt); stepSparks(dt);
    if (st.camTween) stepCam(dt);
    else if (controls) {
      // følg den valgte del, hvis den flytter sig (eksplosion/skive)
      if (st.sel && !st.anim) { const c = new THREE.Vector3(); partCenterWorld(selGroup(st.sel), c); controls.target.lerp(c, Math.min(1, dt * 3)); }
      controls.update();
    }
    if (st.frameN % 3 === 0) hoverStep();
    // pulserende rød ved havari i belastningsvisning
    if (st.heat && st.conds) { const k = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(st.t * 6)); for (const [p, c] of st.conds) if (c.lvl === 'fail' && !(st.anim && p._op !== undefined)) for (const m of p.meshes) { const mt = Array.isArray(m.material) ? m.material[0] : m.material; if (mt !== ghostMat) mt.emissiveIntensity = k * 1.4; } }
    if (outlineMat) outlineMat.opacity = 0.65 + 0.3 * Math.sin(st.t * 4);
    // telefon med åbent bundark: skub billedet op, så den valgte del ses over arket
    const wantOff = (st.sheet && isPhone()) ? 0.2 : 0;
    st.off = (st.off || 0) + (wantOff - (st.off || 0)) * Math.min(1, dt * 5);
    if (st.off > 0.002) { const W = RND.domElement.clientWidth || 1, Hh = RND.domElement.clientHeight || 1; camera.setViewOffset(W, Hh, 0, st.off * Hh, W, Hh); }
    else if (camera.view && camera.view.enabled) camera.clearViewOffset();
    for (const m of ledMats) { m.uniforms.uT.value = st.t; m.uniforms.uBoost.value = st.anim ? 0.6 : 0; }
    st.snowT += dt * st.snowMul; snow.material.uniforms.uT.value = st.snowT; snowIn.material.uniforms.uT.value = st.snowT * 0.8;
    underLight.intensity = (RND.physicallyCorrectLights ? 0.55 * Math.PI * 0.25 : 0.55) * (0.85 + 0.15 * Math.sin(st.t * 2.6));
    // to gennemløb: spejlet hal under gulvet, derefter den rigtige hal ovenpå med halvgennemsigtigt gulv
    const ac = RND.autoClear; RND.getClearColor(cc); const ca = RND.getClearAlpha();
    RND.autoClear = false;
    // spejl-pas: kun robot, lys og lyskilder, i halv opløsning, ind i et render target, som gulvets shader slår op i
    RND.getDrawingBufferSize(reflU.uRes.value);
    const rw = Math.max(2, Math.floor(reflU.uRes.value.x / 2)), rh = Math.max(2, Math.floor(reflU.uRes.value.y / 2));
    if (reflRT.width !== rw || reflRT.height !== rh) reflRT.setSize(rw, rh);
    RND.setRenderTarget(reflRT); RND.setClearColor(0x000000, 1); RND.clear(true, true, false);
    if (OPT.mirror) {
      world.scale.y = -1; floorGroup.visible = false; scene.updateMatrixWorld(); camera.layers.set(1);
      const hemi = st.lights[0], hi = hemi.intensity; hemi.intensity = hi * 2.6;
      RND.render(scene, camera);
      hemi.intensity = hi; camera.layers.set(0);
    }
    RND.setRenderTarget(null); RND.setClearColor(0x050608, 1); RND.clear(true, true, true);
    world.scale.y = 1; floorGroup.visible = true; scene.updateMatrixWorld();
    RND.render(scene, camera);
    RND.autoClear = ac; RND.setClearColor(cc, ca);
  }

  window.Garage = {
    init, open, close, frame, resize,
    isOpen: () => isOpen,
    // til test og fejlsøgning
    _debug: () => ({ hover: st.hover && st.hover.id, fps: st.fps, parts: parts.length, meshes: allMeshes.length, E: st.E, heat: st.heat, sel: st.sel && st.sel.id, anim: st.anim && st.anim.kind }),
    _select: id => select(partById[id] || null, true),
    _action: id => doAction(id),
    _explode: v => { st.Et = clamp(v, 0, 1); st.drag = true; if (root) updDock(); },
    _heat: v => { if (st.heat !== !!v) toggleHeat(); },
    _opt: o => Object.assign(OPT, o),
    _view: (theta, phi, dist) => { flyTo(defTarget.clone(), dist || defDist, 0.01, { theta, phi }); },
    _tt: a => { st.ttAng = a; st.ttVel = 0; st.idle = -1e9; },
    _rt: () => reflRT,
    _plow: () => plowMeshes.map(pm => { const a = pm.m.geometry.attributes.position; let mx = 0; for (let i = 0; i < pm.orig.length; i++) mx = Math.max(mx, Math.abs(a.array[i] - pm.orig[i])); return { name: pm.m.name, inter: !!a.isInterleavedBufferAttribute, n: a.count, mx, box: st.plowBox }; }),
    _dbgScene: () => ({ scene, world, floorGroup, robot, camera, parts, cones, glowSprites }),
    _skipIntro: () => { if (st.camTween) { st.camTween.t = st.camTween.dur; stepCam(0); } },
  };
})();
