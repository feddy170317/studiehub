// Natteskift 3D: køreverden. Three.js-scene med sneens højdefelt fra sim.grid, robotten, nattelys, sne og partikler,
// fire kameraer og spil-løkken. Fysikken er sim.js (uændret); HUD'en er hud.js; værkstedet er garage.js (Agent C).
// Koordinater: three.x = sim.x, three.y = op, three.z = −sim.y. Robotten: rotation.y = R.h, peger mod +X, venstre = −Z.
(() => {
'use strict';
const T = THREE, D2R = Math.PI / 180, TAU = Math.PI * 2;
const H = window.HUD, clamp = H.clamp;
const EXAG = 1.25;                 // sneens højde overdrives 25 %, så volde og kanter kan ses i natlyset
const LAMPS = [[26, 8.5], [54, 16.5], [10, -1.8], [40, -1.8], [70, -1.8], [25, 26.8], [55, 26.8], [-3, 6.2], [83, 12.5]];
const OER_C = [[26, 8.5], [54, 16.5]];
const DEFAULT_NODES = { wheels: ['hjul_VF', 'hjul_VB', 'hjul_HF', 'hjul_HB'], plov: 'plov_pivot', plovLoeft: 'plov_loeft_pivot', blink: 'advarselsblink', lidar: 'lidar', kamera: 'kamera_foerer' };
const srgb = h => new T.Color(h).convertSRGBToLinear();
const lin = c => Math.pow(c, 2.2);
const wrapA = a => { while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a; };
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ---------------------------------------------------------------- små teksturer
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return t; }
const TEX = {};
function makeTextures() {
  TEX.glow = canvasTex(128, 128, (x, w) => { const g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.18, 'rgba(255,255,255,.55)'); g.addColorStop(0.5, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, w); });
  TEX.dot = canvasTex(32, 32, (x, w) => { const g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.45, 'rgba(255,255,255,.8)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, w); });
  TEX.blob = canvasTex(64, 64, (x, w) => { const g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.75)'); g.addColorStop(0.6, 'rgba(0,0,0,.4)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, w, w); });
}
function signTex(text, sub) {
  return canvasTex(512, 192, (x, w, h) => {
    x.fillStyle = '#1d4f8f'; x.fillRect(0, 0, w, h); x.strokeStyle = '#e6edf6'; x.lineWidth = 10; x.strokeRect(10, 10, w - 20, h - 20);
    x.fillStyle = '#e6edf6'; x.textAlign = 'center'; x.font = '700 84px "Saira Condensed", Arial Narrow, sans-serif'; x.fillText(text, w / 2, sub ? 104 : 124);
    if (sub) { x.font = '600 38px "Saira Condensed", Arial Narrow, sans-serif'; x.fillText(sub, w / 2, 156); }
  });
}

// ---------------------------------------------------------------- materialer
const M = (hex, o = {}) => { const p = Object.assign({ color: srgb(hex), roughness: 0.7, metalness: 0 }, o); if (typeof p.emissive === 'number') p.emissive = srgb(p.emissive); return new T.MeshStandardMaterial(p); };
// robottens materialer får et ekstra "natrium-omgivelseslys" fra den nærmeste lygte (billigere end rigtige punktlys)
function lampInject(m, U) {
  if (!(m && (m.isMeshStandardMaterial || m.isMeshLambertMaterial || m.isMeshPhongMaterial))) return m;
  m.onBeforeCompile = sh => {
    sh.uniforms.uLampAmb = U;
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uLampAmb;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += diffuseColor.rgb * uLampAmb;');
  };
  m.customProgramCacheKey = () => 'lampAmb';
  return m;
}

// ---------------------------------------------------------------- pladsholder-robot (samme nodenavne og frame som kontrakten)
function cylZ(r1, r2, h, s = 20) { const g = new T.CylinderGeometry(r1, r2, h, s); g.rotateX(Math.PI / 2); return g; }
function makePlaceholderRobot() {
  const root = new T.Group(); root.name = 'robot_pladsholder';
  const orange = M(0xf0a43a, { roughness: 0.45 }), dark = M(0x1d2433, { roughness: 0.55, metalness: 0.25 }), steel = M(0x9aa6b4, { metalness: 0.75, roughness: 0.32 });
  const rubber = M(0x121417, { roughness: 0.92 }), black = M(0x0b0d11, { roughness: 0.5 }), blue = M(0x2c6e9e, { roughness: 0.5 });
  const add = (par, geo, mat, x, y, z, name) => { const o = new T.Mesh(geo, mat); o.position.set(x, y, z); if (name) o.name = name; par.add(o); return o; };
  const box = (w, h, d) => new T.BoxGeometry(w, h, d);
  const ch = new T.Group(); ch.name = 'chassis'; root.add(ch);
  add(ch, box(1.12, 0.2, 0.62), dark, 0, 0.32, 0, 'ramme');
  add(ch, box(0.96, 0.26, 0.66), orange, -0.05, 0.55, 0, 'kappe');
  add(ch, box(0.56, 0.05, 0.54), dark, -0.12, 0.705, 0, 'kappe_laag');
  add(ch, box(0.04, 0.12, 0.5), black, 0.43, 0.56, 0, 'front_grill');
  add(ch, box(0.40, 0.16, 0.38), blue, -0.14, 0.44, 0, 'batteri');
  for (const [S, z] of [['V', -1], ['H', 1]]) {
    add(ch, cylZ(0.06, 0.06, 0.15), steel, 0.12, 0.42, z * 0.17, 'motor_' + S);
    add(ch, cylZ(0.065, 0.065, 0.04), M(0x8a5a2a, { metalness: 0.4, roughness: 0.4 }), 0.12, 0.42, z * 0.27, 'kobling_' + S);
    add(ch, cylZ(0.011, 0.011, 0.11), steel, 0.12, 0.42, z * 0.335, 'mellemaksel_' + S);
    add(ch, cylZ(0.035, 0.035, 0.03), steel, 0.35, 0.2, z * 0.355, 'leje_' + S);
    add(ch, box(0.76, 0.035, 0.018), black, 0, 0.21, z * 0.34, 'kaede_' + S);
    add(ch, box(0.03, 0.05, 0.1), M(0xfff4dc, { emissive: 0xfff2d0, emissiveIntensity: 2 }), 0.435, 0.6, z * 0.24, 'lygte_' + S);
    add(ch, box(0.02, 0.04, 0.08), M(0x5a0b08, { emissive: 0xff2a18, emissiveIntensity: 1.2 }), -0.535, 0.6, z * 0.25, 'baglygte_' + S);
  }
  // hjul: origo i akslens midte, ruller om lokal Z
  for (const [n, x, z] of [['hjul_VF', 0.35, -0.45], ['hjul_VB', -0.35, -0.45], ['hjul_HF', 0.35, 0.45], ['hjul_HB', -0.35, 0.45]]) {
    const w = new T.Group(); w.name = n; w.position.set(x, 0.2, z); root.add(w);
    add(w, cylZ(0.2, 0.2, 0.15, 28), rubber, 0, 0, 0, n + '_daek');
    const s = z < 0 ? -1 : 1;
    add(w, cylZ(0.12, 0.12, 0.152, 20), dark, 0, 0, 0);
    add(w, box(0.22, 0.035, 0.012), orange, 0, 0, s * 0.077); add(w, box(0.035, 0.22, 0.012), orange, 0, 0, s * 0.077);
    add(w, cylZ(0.03, 0.03, 0.02, 12), steel, 0, 0, s * 0.082);
  }
  // plov: løftearm med drejetap; skjoldet ligger langs Z, den hule side vender frem (+X)
  const lift = new T.Group(); lift.name = 'plov_loeft_pivot'; lift.position.set(0.52, 0.3, 0); root.add(lift);
  for (const z of [-0.17, 0.17]) { const a = add(lift, box(0.46, 0.05, 0.045), dark, 0.21, -0.05, z); a.rotation.z = -0.22; }
  add(lift, cylZ(0.025, 0.025, 0.42), steel, 0, 0, 0);
  const piv = new T.Group(); piv.name = 'plov_pivot'; piv.position.set(0.43, -0.1, 0); lift.add(piv);
  add(piv, new T.CylinderGeometry(0.03, 0.03, 0.14, 12), steel, 0, 0, 0);
  const skjold = new T.Group(); skjold.name = 'plovskjold'; piv.add(skjold);
  const prof = new T.Shape(), cx = 0.30, cy = 0.05, r = 0.36, ph = 44 * D2R, N = 14;
  for (let k = 0; k <= N; k++) { const f = -ph + 2 * ph * k / N; const px = cx - r * Math.cos(f), py = cy + r * Math.sin(f); k ? prof.lineTo(px, py) : prof.moveTo(px, py); }
  for (let k = N; k >= 0; k--) { const f = -ph + 2 * ph * k / N; prof.lineTo(cx - (r + 0.025) * Math.cos(f), cy + (r + 0.025) * Math.sin(f)); }
  const mg = new T.ExtrudeGeometry(prof, { depth: 1.4, bevelEnabled: false, curveSegments: 1 }); mg.translate(0, 0, -0.7);
  add(skjold, mg, orange, 0, 0, 0, 'plov_plade');
  add(skjold, box(0.035, 0.045, 1.41), steel, 0.045, -0.185, 0, 'plov_skaer');
  for (const z of [-0.45, 0, 0.45]) add(skjold, box(0.05, 0.42, 0.04), dark, -0.07, 0.05, z);
  for (const z of [-0.69, 0.69]) { add(skjold, new T.CylinderGeometry(0.008, 0.008, 0.62, 6), black, -0.02, 0.6, z); add(skjold, new T.CylinderGeometry(0.014, 0.014, 0.1, 8), M(0xff6a2a, { emissive: 0xff5a20, emissiveIntensity: 0.6 }), -0.02, 0.88, z); }
  // advarselsblink, lidar, førerkamera og saltspreder
  const bl = new T.Group(); bl.name = 'advarselsblink'; bl.position.set(-0.3, 0.73, 0.18); root.add(bl);
  add(bl, new T.CylinderGeometry(0.05, 0.055, 0.03, 16), black, 0, 0.015, 0);
  add(bl, new T.CylinderGeometry(0.042, 0.046, 0.08, 16), M(0xffa020, { emissive: 0xff8a10, emissiveIntensity: 1, transparent: true, opacity: 0.9, roughness: 0.2 }), 0, 0.07, 0, 'blink_glas');
  const li = new T.Group(); li.name = 'lidar'; li.position.set(0.25, 0.73, 0); root.add(li);
  add(li, new T.CylinderGeometry(0.055, 0.06, 0.07, 20), black, 0, 0.035, 0);
  add(li, new T.CylinderGeometry(0.057, 0.057, 0.018, 20), M(0x3a8fd0, { emissive: 0x1a5f9a, emissiveIntensity: 0.6 }), 0, 0.045, 0);
  add(li, box(0.02, 0.012, 0.03), M(0xff3030, { emissive: 0xff2020, emissiveIntensity: 1 }), 0.058, 0.045, 0);
  const kam = new T.Object3D(); kam.name = 'kamera_foerer'; kam.position.set(0.28, 0.9, 0); root.add(kam);
  const sa = new T.Group(); sa.name = 'saltspreder'; sa.position.set(-0.64, 0.42, 0); root.add(sa);
  add(sa, new T.CylinderGeometry(0.15, 0.06, 0.2, 16), dark, 0, 0, 0, 'salt_tragt');
  const disc = new T.Group(); disc.name = 'salt_skive'; disc.position.set(0, -0.15, 0); sa.add(disc);
  add(disc, new T.CylinderGeometry(0.12, 0.12, 0.012, 20), steel, 0, 0, 0);
  for (let k = 0; k < 4; k++) { const f = add(disc, box(0.11, 0.025, 0.008), orange, 0, 0.015, 0); f.rotation.y = k * Math.PI / 4 * 2; f.position.set(Math.cos(k * Math.PI / 2) * 0.055, 0.015, -Math.sin(k * Math.PI / 2) * 0.055); }
  root.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return root;
}
const DEFAULT_PARTS = { version: 1, pladsholder: true, nodes: DEFAULT_NODES, parts: [].concat(...['V', 'H'].map((S, i) => [
  { id: 'motor_' + S, navn: 'Motor', side: i, gruppe: 'drivlinje', nodes: ['motor_' + S], sim: { felt: 'temp', slags: 'temp' }, vaerk: 'motor-' + i, explode: [0, 0.3, (i ? 1 : -1) * 0.3], info: 'Tåler 1,5 Nm kontinuerligt og 4 Nm kortvarigt.' },
  { id: 'kobling_' + S, navn: 'Slipkobling', side: i, gruppe: 'drivlinje', nodes: ['kobling_' + S], sim: { felt: 'clutchWear', slags: 'skade' }, vaerk: 'kob-' + i, explode: [0, 0.25, (i ? 1 : -1) * 0.45], info: 'Glider ved 36 Nm på mellemakslen.' },
  { id: 'mellemaksel_' + S, navn: 'Mellemaksel', side: i, gruppe: 'drivlinje', nodes: ['mellemaksel_' + S], sim: { felt: 'shaftD', slags: 'skade' }, vaerk: 'aksel-' + i, explode: [0, 0, (i ? 1 : -1) * 0.35], info: 'Ø22 kædehjulssæde er gruppens åbne udmattelsespunkt.' },
  { id: 'leje_' + S, navn: 'Lejer', side: i, gruppe: 'drivlinje', nodes: ['leje_' + S], sim: { felt: 'bearing', slags: 'levetid' }, vaerk: 'leje-' + i, explode: [0.1, 0, (i ? 1 : -1) * 0.4], info: 'Levetiden falder med lasten i tredje potens (L10).' },
  { id: 'kaede_' + S, navn: 'Kæde', side: i, gruppe: 'drivlinje', nodes: ['kaede_' + S], sim: { felt: 'chain', slags: 'laengning' }, vaerk: 'kaede-' + i, explode: [0, -0.1, (i ? 1 : -1) * 0.3], info: 'Springer af ved 3 % længning.' },
])).concat([
  { id: 'batteri', navn: 'Batteri', side: -1, gruppe: 'energi', nodes: ['batteri'], sim: { felt: 'soc', slags: 'batteri' }, vaerk: 'lad100', explode: [0, 0.55, 0], info: '2,56 kWh. Kulden tager op til 30 %.' },
  { id: 'plov', navn: 'Plovskjold', side: -1, gruppe: 'plov', nodes: ['plovskjold'], sim: { felt: 'plovH', slags: 'plov' }, vaerk: 'plov', explode: [0.4, 0, 0], info: 'B = 1,40 m, H = 0,50 m.' },
  { id: 'salt', navn: 'Saltspreder', side: -1, gruppe: 'plov', nodes: ['saltspreder'], sim: { felt: 'saltKg', slags: 'salt' }, vaerk: 'salt', explode: [-0.35, 0.1, 0], info: '60 kg salt, 15 g/m².' },
  { id: 'daek', navn: 'Dæk', side: -1, gruppe: 'hjul', nodes: DEFAULT_NODES.wheels, sim: { felt: 'tire', slags: 'daek' }, vaerk: null, explode: [0, 0, 0.25], info: 'Sommer, vinter, pig eller kæder.' },
]) };

// ---------------------------------------------------------------- pladsholder-rekvisitter (samme navne som props.glb)
function makePlaceholderProps() {
  const root = new T.Group(); root.name = 'props_pladsholder';
  const add = (par, geo, mat, x, y, z, name) => { const o = new T.Mesh(geo, mat); o.position.set(x, y, z); if (name) o.name = name; par.add(o); return o; };
  const box = (w, h, d) => new T.BoxGeometry(w, h, d);
  const grey = M(0x4a525c, { metalness: 0.5, roughness: 0.45 }), darkg = M(0x23282f, { roughness: 0.8 }), conc = M(0x8a8d90, { roughness: 0.9 });
  const snow = M(0xe6edf6, { roughness: 0.85 });
  // lygtepæl: mast 6 m, arm mod +X
  { const g = new T.Group(); g.name = 'lygtepael'; root.add(g);
    add(g, new T.CylinderGeometry(0.05, 0.08, 6.1, 10), grey, 0, 3.05, 0);
    add(g, new T.CylinderGeometry(0.16, 0.2, 0.5, 10), conc, 0, 0.25, 0);
    const arm = add(g, box(1.15, 0.06, 0.06), grey, 0.55, 6.0, 0);
    add(g, box(0.62, 0.12, 0.26), darkg, 1.1, 5.98, 0);
    add(g, box(0.5, 0.025, 0.2), M(0xffd28a, { emissive: 0xffb050, emissiveIntensity: 3 }), 1.1, 5.91, 0);
    add(g, box(0.62, 0.03, 0.27), snow, 1.1, 6.055, 0); arm.name = 'arm';
    const lys = new T.Object3D(); lys.name = 'lys'; lys.position.set(1.1, 5.88, 0); g.add(lys); }
  // ladestation: skab med skærm og LED, front mod +X
  { const g = new T.Group(); g.name = 'ladestation'; root.add(g);
    add(g, box(0.4, 1.35, 0.6), M(0x2a3242, { roughness: 0.5, metalness: 0.3 }), 0, 0.675, 0);
    add(g, box(0.02, 0.3, 0.42), M(0x10202c, { emissive: 0x2a7fb0, emissiveIntensity: 0.9 }), 0.205, 1.0, 0, 'skaerm');
    add(g, box(0.03, 0.06, 0.3), M(0xf0a43a, { emissive: 0xf0a43a, emissiveIntensity: 2 }), 0.21, 1.25, 0, 'led');
    add(g, box(0.45, 0.04, 0.65), snow, 0, 1.37, 0);
    add(g, new T.TorusGeometry(0.12, 0.02, 6, 16), M(0x0d0f12), 0.24, 0.55, 0); }
  // værkstedshal 10 × 8 m med port mod +X
  { const g = new T.Group(); g.name = 'hal_vaerksted'; root.add(g);
    const wall = M(0x3b4a5e, { roughness: 0.75 }), roof = M(0x252c36, { roughness: 0.6, metalness: 0.3 });
    add(g, box(10, 4.2, 8), wall, 0, 2.1, 0);
    const rg = new T.CylinderGeometry(0.01, 5.6, 1.6, 4, 1); rg.rotateY(Math.PI / 4); rg.scale(1.3, 1, 1);
    const r = add(g, new T.BoxGeometry(10.4, 0.25, 8.6), roof, 0, 4.3, 0);
    add(g, new T.BoxGeometry(10.5, 0.22, 8.7), snow, 0, 4.45, 0);
    add(g, box(0.05, 3.2, 4.2), M(0x0c0f14, { roughness: 0.9 }), 5.0, 1.6, 0, 'port');
    add(g, box(0.04, 3.0, 4.0), M(0x3b2a12, { emissive: 0xffb86a, emissiveIntensity: 0.55 }), 4.99, 1.5, 0, 'port_lys');
    for (const z of [-3.1, 3.1]) add(g, box(0.05, 0.8, 1.2), M(0x1c2a3a, { emissive: 0xffc27a, emissiveIntensity: 0.8 }), 5.01, 2.6, z);
    add(g, box(0.06, 0.6, 3.4), M(0xf0a43a, { emissive: 0xf0a43a, emissiveIntensity: 0.6 }), 5.03, 3.65, 0, 'skilt'); r.name = 'tag'; }
  // lagerhal 16 × 10 m, port mod +X
  { const g = new T.Group(); g.name = 'hal_lager'; root.add(g);
    add(g, box(10, 6, 16), M(0x4c5257, { roughness: 0.8, metalness: 0.2 }), 0, 3, 0);
    add(g, box(10.4, 0.25, 16.4), M(0x262b31, { metalness: 0.3 }), 0, 6.1, 0);
    add(g, box(10.5, 0.25, 16.5), snow, 0, 6.3, 0);
    add(g, box(0.05, 4.5, 5), M(0x14181e), 5.0, 2.25, -3);
    for (const z of [3, 6]) add(g, box(0.05, 0.9, 1.6), M(0x1c2a3a, { emissive: 0xffc27a, emissiveIntensity: 0.6 }), 5.02, 4.2, z);
    add(g, new T.SphereGeometry(0.12, 8, 6), M(0xfff0d0, { emissive: 0xffd9a0, emissiveIntensity: 3 }), 5.2, 5, -3, 'lys'); }
  // gran med sne
  { const g = new T.Group(); g.name = 'gran'; root.add(g);
    const nal = M(0x1a2f24, { roughness: 0.9 });
    add(g, new T.CylinderGeometry(0.12, 0.16, 1.2, 6), M(0x2b1d14), 0, 0.6, 0);
    for (let k = 0; k < 4; k++) { const rr = 1.9 - k * 0.42, y = 1.1 + k * 1.15; add(g, new T.ConeGeometry(rr, 1.9, 8), nal, 0, y + 0.95, 0); add(g, new T.ConeGeometry(rr * 0.82, 0.5, 8), snow, 0, y + 1.25, 0); } }
  // hegnssektion 2 m langs +X fra x = 0
  { const g = new T.Group(); g.name = 'hegn_sektion'; root.add(g);
    add(g, new T.CylinderGeometry(0.03, 0.03, 1.8, 6), grey, 0, 0.9, 0);
    for (const y of [0.08, 1.75]) add(g, box(2, 0.035, 0.035), grey, 1, y, 0);
    add(g, box(2, 1.66, 0.01), M(0x5d6670, { transparent: true, opacity: 0.32, roughness: 0.6, metalness: 0.4, depthWrite: false }), 1, 0.91, 0);
    add(g, box(2, 0.05, 0.05), snow, 1, 1.8, 0); }
  // kantsten om øen (r = 0,9 m)
  { const g = new T.Group(); g.name = 'kantsten_oe'; root.add(g);
    const ring = new T.Shape(); ring.absarc(0, 0, 0.93, 0, TAU, false); const hole = new T.Path(); hole.absarc(0, 0, 0.75, 0, TAU, true); ring.holes.push(hole);
    const kg = new T.ExtrudeGeometry(ring, { depth: 0.2, bevelEnabled: false, curveSegments: 28 }); kg.rotateX(-Math.PI / 2);
    add(g, kg, conc, 0, 0, 0); }
  // skilt ved snedepotet
  { const g = new T.Group(); g.name = 'skilt_depot'; root.add(g);
    for (const z of [-0.7, 0.7]) add(g, new T.CylinderGeometry(0.04, 0.04, 2.2, 8), grey, 0, 1.1, z);
    const plate = add(g, box(0.04, 0.7, 1.8), new T.MeshStandardMaterial({ map: signTex('SNEDEPOT', 'kør sneen herind'), roughness: 0.5, emissive: srgb(0x223a5a), emissiveIntensity: 0.4 }), 0.04, 1.85, 0);
    plate.material.map.center.set(0.5, 0.5); }
  // pladsholderne er bygget med forsiden mod +X; props.glb har forsiden mod +Z, så hallerne og skiltet drejes
  for (const n of ['hal_vaerksted', 'hal_lager', 'skilt_depot']) {
    const g = root.getObjectByName(n), inner = new T.Group();
    while (g.children.length) inner.add(g.children[0]);
    inner.rotation.y = -Math.PI / 2; g.add(inner);
  }
  return root;
}

// ---------------------------------------------------------------- hentning af assets
function loadGLB(url) {
  return new Promise(res => {
    if (!T.GLTFLoader) return res(null);
    const to = setTimeout(() => res(null), 20000);
    try { new T.GLTFLoader().load(url, g => { clearTimeout(to); res(g); }, undefined, () => { clearTimeout(to); res(null); }); } catch (e) { clearTimeout(to); res(null); }
  });
}
const loadJSON = url => fetch(url, { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null);

// ---------------------------------------------------------------- tilstand
let renderer, scene, camera, controls, envTex = null;
let sim = null, started = false, paused = true, scale = 20, endShown = false, garageOpen = false, garageReady = false, lastHint = 0;
let terrain = null, robot = null, fx = null, flakes = null, lampHeads = [], stationLED = null, stationG = null;
const stationLedMats = [];
const keys = {};
const assets = { robot: null, parts: null, props: null, robotGLB: false, propsGLB: false };
const stats = { fps: 60, ft: 16, pr: 1, frames: 0, tSim: 0, tTer: 0, tRen: 0, tHud: 0 };
const COL_OK = srgb(0x5cc28d), COL_SOD = srgb(0xf0a43a), LAMP_COL = srgb(0xffa149);
const ema = (k, v) => { stats[k] += (v - stats[k]) * 0.05; };

// ---------------------------------------------------------------- sneens højdefelt
function buildTerrain(G) {
  const { NX, NY, X0, Y0, cell, zone } = G, N = NX * NY;
  const pos = new Float32Array(N * 3), hA = new Float32Array(N), nrm = new Int8Array(N * 3), col = new Float32Array(N * 3), rough = new Uint8Array(N), lamp = new Float32Array(N);
  const baseC = new Float32Array(N * 3), baseR = new Float32Array(N), baseH = new Float32Array(N), rawH = new Float32Array(N);
  const hash = (i, j) => { let h = (i * 374761393 + j * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    const id = j * NX + i, x = X0 + (i + 0.5) * cell, y = Y0 + (j + 0.5) * cell, z = zone[id];
    pos[id * 3] = x; pos[id * 3 + 2] = -y; nrm[id * 3 + 1] = 127;
    const n = hash(i, j) * 0.06 - 0.03;
    let r, g, b, ro = 0.92;
    if (z === 0) { r = 0.23 + n; g = 0.24 + n; b = 0.26 + n;
      const bay = (y < 5 || y > 20) && Math.abs(((x % 2.5) + 2.5) % 2.5) < 0.12 && x > 1 && x < 79;
      const edge = (Math.abs(y - 5) < 0.09 || Math.abs(y - 20) < 0.09) && x > 1 && x < 79;
      const mid = Math.abs(y - 12.5) < 0.11 && ((x % 3) + 3) % 3 < 1.6 && x > 2 && x < 78;
      if (bay || edge) { r = 0.80; g = 0.80; b = 0.80; ro = 0.7; }
      if (mid) { r = 0.88; g = 0.68; b = 0.22; ro = 0.7; } }
    else if (z === 2) { r = 0.21 + n; g = 0.18 + n; b = 0.15 + n; }
    else if (z === 3) { r = 0.46 + n; g = 0.47 + n; b = 0.49 + n; ro = 0.8;
      if (x > -5.3 && x < -0.7 && (Math.abs(y - 0.7) < 0.09 || Math.abs(y - 4.8) < 0.09)) { r = 0.94; g = 0.64; b = 0.23; ro = 0.6; }
      if (Math.abs(x - y * 0 - (-0.6)) < 0.1) { r = 0.94; g = 0.64; b = 0.23; } }
    else if (z === 5) { r = 0.22; g = 0.26; b = 0.19; baseH[id] = 0.11; }
    else { r = 0.17 + n; g = 0.20 + n; b = 0.15 + n; }
    baseC[id * 3] = lin(r); baseC[id * 3 + 1] = lin(g); baseC[id * 3 + 2] = lin(b); baseR[id] = ro;
  }
  const idx = new Uint32Array((NX - 1) * (NY - 1) * 6); let k = 0;
  for (let j = 0; j < NY - 1; j++) for (let i = 0; i < NX - 1; i++) {
    const a = j * NX + i, b = a + 1, c = a + NX, d = c + 1;
    idx[k++] = a; idx[k++] = b; idx[k++] = c; idx[k++] = b; idx[k++] = d; idx[k++] = c;
  }
  const geo = new T.BufferGeometry();
  geo.setAttribute('position', new T.BufferAttribute(pos, 3));
  const aN = new T.BufferAttribute(nrm, 3, true), aC = new T.BufferAttribute(col, 3), aH = new T.BufferAttribute(hA, 1), aR = new T.BufferAttribute(rough, 1, true), aL = new T.BufferAttribute(lamp, 1);
  for (const a of [aN, aC, aH, aR]) a.setUsage(T.DynamicDrawUsage);
  geo.setAttribute('normal', aN); geo.setAttribute('color', aC); geo.setAttribute('aH', aH); geo.setAttribute('aRough', aR); geo.setAttribute('aLamp', aL);
  geo.setIndex(new T.BufferAttribute(idx, 1));
  const sodium = { value: srgb(0xffa149).multiplyScalar(0.5) };
  const mat = new T.MeshLambertMaterial({ vertexColors: true });
  // Lambert: lyset regnes pr. hjørne (0,2 m net), hvilket er rigeligt til sne og meget billigere end pr. pixel på en bærbar.
  // Glansen på is og saltet, våd asfalt laves som en Fresnel-refleks af natriumlyset (blanke punkter har lav "ruhed").
  mat.onBeforeCompile = sh => {
    sh.uniforms.uSodium = sodium;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aH; attribute float aRough; attribute float aLamp; varying float vGloss; varying float vLamp;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n transformed.y += aH; vLamp = aLamp * (0.3 + 0.7 * max(normal.y, 0.0));')
      .replace('#include <project_vertex>', '#include <project_vertex>\n { vec3 nV = normalize(normalMatrix * objectNormal); float fr = pow(1.0 - clamp(dot(nV, normalize(-mvPosition.xyz)), 0.0, 1.0), 3.0); vGloss = (1.0 - aRough) * (0.15 + 1.4 * fr); }');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uSodium; varying float vGloss; varying float vLamp;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += diffuseColor.rgb * uSodium * vLamp + uSodium * (0.12 + vLamp) * vGloss;');
  };
  mat.customProgramCacheKey = () => 'terrainSne';
  const mesh = new T.Mesh(geo, mat); mesh.frustumCulled = false; mesh.receiveShadow = true; mesh.name = 'sne';
  // statisk natriumlys fra lygtepælene, bagt ind pr. punkt (kun to rigtige lyskilder bevæger sig: forlygter og blink)
  function bakeLamps(heads) {
    for (let id = 0; id < N; id++) {
      const x = pos[id * 3], z = pos[id * 3 + 2]; let s = 0;
      for (const L of heads) { const dx = x - L.x, dz = z - L.z, h2 = L.y * L.y, d2 = dx * dx + dz * dz; if (d2 < 900) s += h2 * L.y / Math.pow(h2 + d2, 1.5) * (1 - d2 / 900); }
      lamp[id] = Math.min(1.5, s * 1.25);
    }
    aL.needsUpdate = true;
  }
  const SNOW = [lin(0.91), lin(0.94), lin(0.98)], DEEP = [lin(0.80), lin(0.86), lin(0.96)], ICE = [lin(0.50), lin(0.72), lin(0.88)], WET = [lin(0.08), lin(0.12), lin(0.14)];
  // Opdaterer rækkerne j0..j1 og sender kun dem til grafikkortet (updateRange). Hele feltet på én gang er ca. 2 MB,
  // og det var flaskehalsen på en bærbar med indbygget grafik; spil-løkken skifter mellem rækkerne om robotten
  // og et rullende bånd hen over resten af arealet (sneen, der falder overalt).
  function update(Gs, j0 = 0, j1 = NY - 1) {
    j0 = Math.max(0, j0 | 0); j1 = Math.min(NY - 1, j1 | 0); if (j1 < j0) return;
    const D = Gs.depth, I = Gs.ice, Sa = Gs.salt;
    const h0 = Math.max(0, j0 - 1), h1 = Math.min(NY - 1, j1 + 1), r0 = Math.max(0, j0 - 2), r1 = Math.min(NY - 1, j1 + 2);
    for (let id = r0 * NX, e = (r1 + 1) * NX; id < e; id++) { const d = D[id]; rawH[id] = baseH[id] + (d > 0.002 ? d * EXAG : 0); }
    // visningen udglattes med en lille kerne (4·midte + 4 naboer) / 8, så voldene ikke står som savtakker af 0,2 m-celler
    for (let j = h0; j <= h1; j++) {
      const up = j < NY - 1 ? NX : 0, dn = j > 0 ? -NX : 0;
      for (let i = 1; i < NX - 1; i++) { const id = j * NX + i; hA[id] = (4 * rawH[id] + rawH[id - 1] + rawH[id + 1] + rawH[id + up] + rawH[id + dn]) * 0.125; }
    }
    if (h0 === 0) for (let i = 0; i < NX; i++) hA[i] = 0;
    if (h1 === NY - 1) for (let i = 0; i < NX; i++) hA[(NY - 1) * NX + i] = 0;
    for (let j = h0; j <= h1; j++) { hA[j * NX] = 0; hA[j * NX + NX - 1] = 0; }
    const inv2c = 1 / (2 * cell);
    for (let j = j0; j <= j1; j++) {
      const jm = j > 0 ? -NX : 0, jp = j < NY - 1 ? NX : 0;
      for (let i = 0; i < NX; i++) {
        const id = j * NX + i, o = id * 3;
        const hx = (hA[id + (i < NX - 1 ? 1 : 0)] - hA[id - (i > 0 ? 1 : 0)]) * inv2c;
        const hz = (hA[id + jm] - hA[id + jp]) * inv2c; // z = −y
        const L = 127 / Math.sqrt(hx * hx + 1 + hz * hz);
        nrm[o] = -hx * L; nrm[o + 1] = L; nrm[o + 2] = -hz * L;
        let r = baseC[o], g = baseC[o + 1], b = baseC[o + 2], ro = baseR[id];
        const s = Sa[id], c = I[id], d = D[id];
        if (s > 3) { const q = Math.min(0.8, s / 30); r += (WET[0] - r) * q; g += (WET[1] - g) * q; b += (WET[2] - b) * q; ro += (0.2 - ro) * q; }
        if (c > 0.08) { const q = Math.min(0.75, c / 1.2); r += (ICE[0] - r) * q; g += (ICE[1] - g) * q; b += (ICE[2] - b) * q; ro += (0.05 - ro) * q * 1.3; }
        if (d > 0.003) {
          const t = d / 0.03, a = t >= 1 ? 1 : Math.sqrt(t) * Math.sqrt(Math.sqrt(t)), deep = d > 0.6 ? 1 : d / 0.6;
          const sr = SNOW[0] + (DEEP[0] - SNOW[0]) * deep, sg = SNOW[1] + (DEEP[1] - SNOW[1]) * deep, sb = SNOW[2] + (DEEP[2] - SNOW[2]) * deep;
          r += (sr - r) * a; g += (sg - g) * a; b += (sb - b) * a; ro += (0.82 - ro) * a;
        }
        col[o] = r; col[o + 1] = g; col[o + 2] = b; rough[id] = ro < 0.03 ? 8 : ro * 255;
      }
    }
    const rows = j1 - j0 + 1;
    for (const [a, k] of [[aN, 3], [aC, 3], [aH, 1], [aR, 1]]) { a.updateRange.offset = j0 * NX * k; a.updateRange.count = rows * NX * k; a.needsUpdate = true; }
  }
  const heightAt = (Gs, x, y) => { const i = Math.floor((x - X0) / cell), j = Math.floor((y - Y0) / cell); if (i < 0 || j < 0 || i >= NX || j >= NY) return 0; const id = j * NX + i; return baseH[id] + Gs.depth[id] * EXAG; };
  return { mesh, update, bakeLamps, heightAt };
}

// ---------------------------------------------------------------- instancing af rekvisitter
function placeM(x, y, h, yaw, s = 1, sy) { const m = new T.Matrix4(); m.compose(new T.Vector3(x, h, -y), new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), yaw), new T.Vector3(s, sy || s, s)); return m; }
function relMats(node) {
  node.updateWorldMatrix(true, true);
  const inv = new T.Matrix4().copy(node.matrixWorld).invert(), out = [];
  node.traverse(o => { if (o.isMesh) out.push({ mesh: o, rel: new T.Matrix4().multiplyMatrices(inv, o.matrixWorld) }); });
  return { inv, list: out };
}
function localBox(node) {
  const { list } = relMats(node), b = new T.Box3();
  for (const { mesh, rel } of list) { mesh.geometry.computeBoundingBox(); b.union(mesh.geometry.boundingBox.clone().applyMatrix4(rel)); }
  return b;
}
function instanceProp(node, mats, opt = {}) {
  const g = new T.Group(); if (!node || !mats.length) return g;
  const { list } = relMats(node);
  for (const { mesh, rel } of list) {
    const mm = opt.cloneMat ? (Array.isArray(mesh.material) ? mesh.material.map(m => m.clone()) : mesh.material.clone()) : mesh.material;
    const im = new T.InstancedMesh(mesh.geometry, mm, mats.length);
    mats.forEach((m, k) => im.setMatrixAt(k, new T.Matrix4().multiplyMatrices(m, rel)));
    im.instanceMatrix.needsUpdate = true; im.frustumCulled = false; im.castShadow = !!opt.cast; im.receiveShadow = false;
    g.add(im);
  }
  return g;
}
function findIn(node, re) { let f = null; node.traverse(o => { if (!f && o !== node && re.test(o.name || '')) f = o; }); return f; }
function nodePosIn(node, sub) { node.updateWorldMatrix(true, true); const inv = new T.Matrix4().copy(node.matrixWorld).invert(); return sub.getWorldPosition(new T.Vector3()).applyMatrix4(inv); }

// ---------------------------------------------------------------- statisk verden
function buildWorld(G) {
  const P = assets.props, get = n => P.getObjectByName(n) || null;
  // himmel med lysforurening i horisonten
  const sky = new T.Mesh(new T.SphereGeometry(400, 32, 16), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'varying vec3 vP; void main(){ float h = normalize(vP).y; vec3 top = vec3(0.012,0.018,0.036), hor = vec3(0.07,0.06,0.07); vec3 c = mix(hor, top, smoothstep(-0.02, 0.45, h)); c += vec3(0.10,0.05,0.012) * exp(-max(h,0.0) * 9.0) * 0.6; gl_FragColor = vec4(pow(c, vec3(0.4545)), 1.0); }' }));
  sky.renderOrder = -10; scene.add(sky);
  // jord uden for gitteret
  const ground = new T.Mesh(new T.PlaneGeometry(600, 600), M(0xa9b4c4, { roughness: 0.9 }));
  ground.rotation.x = -Math.PI / 2; ground.position.set(40, -0.03, -12.5); ground.receiveShadow = false; scene.add(ground);
  terrain = buildTerrain(G); scene.add(terrain.mesh);

  // lygtepæle: armen peger ind mod arealet
  const lp = get('lygtepael');
  if (lp) {
    const lb = localBox(lp), head = findIn(lp, /(^|_)(lys|hoved|lampe|head|light)$/i);
    const hLocal = head ? nodePosIn(lp, head) : new T.Vector3((lb.min.x + lb.max.x) / 2, lb.max.y - 0.15, (lb.min.z + lb.max.z) / 2);
    const mats = LAMPS.map(([x, y]) => {
      const isO = OER_C.some(o => o[0] === x && o[1] === y);
      const yaw = isO ? (x < 40 ? 0 : Math.PI) : Math.atan2(clamp(12.5, 0, 25) - y, clamp(x, 2, 78) - x || 0.0001) ;
      const m = placeM(x, y, isO ? 0.17 : 0, yaw); lampHeads.push(hLocal.clone().applyMatrix4(m)); return m;
    });
    scene.add(instanceProp(lp, mats));
  }
  // glød, lyskegle og bagt natriumlys
  const glowMat = new T.SpriteMaterial({ map: TEX.glow, color: srgb(0xffb35a), blending: T.AdditiveBlending, depthWrite: false, transparent: true, fog: true });
  const coneMat = new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
    uniforms: { uC: { value: srgb(0xffa040) }, uK: { value: 0.07 } },
    vertexShader: 'varying float vH; varying vec3 vN; varying vec3 vV; void main(){ vH = uv.y; vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'uniform vec3 uC; uniform float uK; varying float vH; varying vec3 vN; varying vec3 vV; void main(){ float e = pow(abs(dot(vN, vV)), 1.5); float a = uK * pow(vH, 1.6) * e; gl_FragColor = vec4(uC * a, a); }' });
  for (const L of lampHeads) {
    const s = new T.Sprite(glowMat); s.position.copy(L); s.scale.set(2.6, 2.6, 1); scene.add(s);
    const s2 = new T.Sprite(glowMat); s2.position.copy(L); s2.scale.set(0.7, 0.7, 1); scene.add(s2);
    const hgt = L.y - 0.1, cg = new T.CylinderGeometry(0.25, 3.6, hgt, 24, 1, true);
    const cone = new T.Mesh(cg, coneMat); cone.position.set(L.x, hgt / 2, L.z); cone.renderOrder = 5; scene.add(cone);
  }
  terrain.bakeLamps(lampHeads);

  // hegn rundt om arealet (x −6..86, y −3..28)
  const hs = get('hegn_sektion');
  if (hs) {
    const b = localBox(hs), alongX = (b.max.x - b.min.x) >= (b.max.z - b.min.z);
    const len = alongX ? b.max.x - b.min.x : b.max.z - b.min.z, off = alongX ? b.min.x : b.min.z;
    const mats = [], edges = [[-6, -3, 86, -3], [86, -3, 86, 28], [86, 28, -6, 28], [-6, 28, -6, -3]];
    for (const [ax, ay, bx, by] of edges) {
      const L = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(L / len)), sx = L / (n * len), dx = (bx - ax) / L, dy = (by - ay) / L;
      const yaw = Math.atan2(dy, dx) + (alongX ? 0 : Math.PI / 2);
      for (let k = 0; k < n; k++) {
        const t = (k * len - off) * sx, m = new T.Matrix4();
        const mx = ax + dx * (k + 0.5) * len * sx, my = ay + dy * (k + 0.5) * len * sx;
        if (Math.abs(mx + 6) < 0.1 && my > 0.2 && my < 5.4) continue; // port i hegnet ud for ladestationen og hallen
        m.compose(new T.Vector3(ax + dx * t, 0, -(ay + dy * t)), new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), yaw), alongX ? new T.Vector3(sx, 1, 1) : new T.Vector3(1, 1, sx));
        mats.push(m);
      }
    }
    scene.add(instanceProp(hs, mats));
  }
  // øer med kantsten
  const ks = get('kantsten_oe'); if (ks) scene.add(instanceProp(ks, OER_C.map(([x, y]) => placeM(x, y, 0, 0))));
  // ladestation: kontakterne vender mod +X, robotten holder i lokal x ≈ 0,9 (bag robotten, der starter med næsen mod øst)
  const ls = get('ladestation');
  if (ls) {
    const m = placeM(-2.8 - 0.9, 2.75, 0, 0), g = instanceProp(ls, [m], { cast: true, cloneMat: true });
    scene.add(g); stationG = g;
    g.traverse(o => { if (o.isMesh) for (const mm of [].concat(o.material)) if (/led/i.test(mm.name || '')) stationLedMats.push(mm); });
    const lyn = findIn(ls, /(^|_)lys$/i), lb = localBox(ls);
    const p = (lyn ? nodePosIn(ls, lyn) : new T.Vector3(0.8, lb.max.y - 0.2, 0)).applyMatrix4(m);
    stationLED = new T.Sprite(new T.SpriteMaterial({ map: TEX.glow, color: srgb(0xf0a43a), blending: T.AdditiveBlending, depthWrite: false, transparent: true }));
    stationLED.position.copy(p); stationLED.scale.set(1.3, 1.3, 1); scene.add(stationLED);
  }
  // haller uden for hegnet: front (+X lokalt) mod arealet
  const halls = [];
  // rekvisitternes forside vender mod +Z (glTF); yaw er den retning i sim, forsiden skal vende
  const placeHall = (name, fx, fy, yaw) => {
    const n = get(name); if (!n) return; const b = localBox(n);
    const dx = Math.cos(yaw), dy = Math.sin(yaw), cx = fx - dx * b.max.z, cy = fy - dy * b.max.z;
    scene.add(instanceProp(n, [placeM(cx, cy, 0, yaw + Math.PI / 2)]));
    halls.push({ x: cx, y: cy, r: Math.hypot(b.max.x - b.min.x, b.max.z - b.min.z) / 2 + 2 });
  };
  placeHall('hal_vaerksted', -7.2, 2.75, 0);
  placeHall('hal_lager', 22, 30.5, -Math.PI / 2);
  placeHall('hal_lager', 62, 30.5, -Math.PI / 2);
  placeHall('hal_lager', 89.5, 6, Math.PI);
  // skilt ved depotet
  const sd = get('skilt_depot'); if (sd) scene.add(instanceProp(sd, [placeM(85.2, 21.5, 0, Math.PI + Math.PI / 2)]));
  // graner uden for hegnet
  const gr = get('gran');
  if (gr) {
    const R = rng(7), mats = [];
    for (let k = 0; k < 400 && mats.length < 90; k++) {
      const x = -45 + R() * 175, y = -30 + R() * 85;
      if (x > -9 && x < 89 && y > -6 && y < 31) continue;
      if (halls.some(h => Math.hypot(x - h.x, y - h.y) < h.r)) continue;
      if (Math.hypot(x - 40, y - 12.5) > 85) continue;
      const s = 0.75 + R() * 0.7; mats.push(placeM(x, y, 0, R() * TAU, s, s * (0.9 + R() * 0.3)));
    }
    scene.add(instanceProp(gr, mats));
  }
}

// ---------------------------------------------------------------- robotten i verden
function makeRobot() {
  const parts = assets.parts || DEFAULT_PARTS, N = Object.assign({}, DEFAULT_NODES, parts.nodes || {});
  const obj = assets.robot.clone(true); obj.name = 'robot_verden';
  obj.position.set(0, 0, 0); obj.rotation.set(0, 0, 0); obj.scale.set(1, 1, 1);
  const lampU = { value: new T.Color(0, 0, 0) };
  // uden omgivelseskort bliver blankt metal sort, så metallerne gøres halvmatte i køreverdenen (garagen har sin egen kopi)
  const cloneM = m => { const c = m.clone(); if (c.metalness > 0.45) { c.metalness = 0.45; c.roughness = Math.max(c.roughness, 0.38); } return lampInject(c, lampU); };
  obj.traverse(o => {
    if (!o.isMesh) return;
    o.material = Array.isArray(o.material) ? o.material.map(cloneM) : cloneM(o.material);
    o.geometry.computeBoundingBox(); const sz = o.geometry.boundingBox.getSize(new T.Vector3());
    o.castShadow = Math.max(sz.x, sz.y, sz.z) > 0.24 && Math.min(sz.x, sz.y, sz.z) > 0.035; o.receiveShadow = false;
  });
  obj.updateMatrixWorld(true);
  const byName = n => n ? obj.getObjectByName(n) : null;
  // drivlinjen inde under kappen kan ikke ses udefra; i køreverdenen skjules den (ca. 60.000 trekanter og 50 tegnekald).
  // Garagen bruger sin egen, komplette kopi.
  { const rootN = byName(N.root || 'robot') || obj, KEEP = /^(chassis|kappe|noedstop|saltspreder|salt|lidar|advarselsblink|kamera|hjul_|plov|a_ramme|drejeramme|vinkelcylinder|loeftecylinder|hydraulik|ventilblok|flangeroer|hjulaksel|lygte|baglygte|front)/i;
    if (rootN.children.length > 12) for (const c of rootN.children) if (!KEEP.test(c.name || '')) c.visible = false; }
  const lift = byName(N.plovLoeft), piv = byName(N.plov), blink = byName(N.blink), lidar = byName(N.lidar), kam = byName(N.kamera);
  const salt = byName('salt_skive') || findIn(obj, /salt.*(skive|disc|spin)/i);
  const isUnder = (o, p) => { while (o) { if (o === p) return true; o = o.parent; } return false; };
  // kroppens kasse uden plov
  const body = new T.Box3();
  obj.traverse(o => { if (o.isMesh && !(lift && isUnder(o, lift)) && !(piv && isUnder(o, piv))) { o.geometry.computeBoundingBox(); body.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld)); } });
  if (body.isEmpty()) body.set(new T.Vector3(-0.55, 0, -0.5), new T.Vector3(0.55, 0.75, 0.5));
  // hjul
  const wheels = (N.wheels || []).map(n => byName(n)).filter(Boolean).map(w => {
    const p = w.getWorldPosition(new T.Vector3()), b = localBox(w), r = Math.max(b.max.x - b.min.x, b.max.y - b.min.y) / 2 || 0.2;
    return { node: w, side: p.z < 0 ? 0 : 1, base: w.rotation.z, ang: 0, r, w: (b.max.z - b.min.z) || 0.15, cz: (b.min.z + b.max.z) / 2, cx: (b.min.x + b.max.x) / 2, cy: (b.min.y + b.max.y) / 2 };
  });
  // dækoverlag: kæder (mørke tværbånd og sideringe) og pigge (blanke knopper)
  const chainM = lampInject(M(0x6f7884, { metalness: 0.9, roughness: 0.3 }), lampU), studM = lampInject(M(0xdfe7f0, { metalness: 1, roughness: 0.12, emissive: 0x334455, emissiveIntensity: 0.4 }), lampU);
  for (const W of wheels) {
    const ch = new T.Group(); ch.name = 'daek_kaeder'; ch.visible = false;
    for (let k = 0; k < 14; k++) { const a = k / 14 * TAU, m = new T.Mesh(new T.BoxGeometry(0.03, 0.016, W.w * 1.04), chainM); m.position.set(W.cx + Math.cos(a) * (W.r + 0.006), W.cy + Math.sin(a) * (W.r + 0.006), W.cz); m.rotation.z = a; ch.add(m); }
    for (const s of [-1, 1]) { const t = new T.Mesh(new T.TorusGeometry(W.r * 0.86, 0.008, 4, 28), chainM); t.position.set(W.cx, W.cy, W.cz + s * W.w * 0.5); ch.add(t); }
    const st = new T.InstancedMesh(new T.SphereGeometry(0.009, 6, 4), studM, 48); st.name = 'daek_pigge'; st.visible = false;
    for (let k = 0; k < 48; k++) { const a = (k % 16) / 16 * TAU + (k >> 4) * 0.13, z = W.cz + ((k >> 4) - 1) * W.w * 0.3, m = new T.Matrix4(); m.setPosition(W.cx + Math.cos(a) * (W.r + 0.002), W.cy + Math.sin(a) * (W.r + 0.002), z); st.setMatrixAt(k, m); }
    W.node.add(ch); W.node.add(st); W.chains = ch; W.studs = st;
  }
  // ballastklodser på bagdækket (glb-noder med "ballast" i navnet bruges, hvis de findes)
  const ballNodes = []; obj.traverse(o => { if (/ballast/i.test(o.name || '') && o !== obj) ballNodes.push(o); });
  const blocks = [];
  const hoodN = byName('kappe'), hood = hoodN ? new T.Box3().setFromObject(hoodN) : body.clone();
  const hoodTop = hood.max.y;
  const obst = ['lidar', 'advarselsblink', 'noedstop', N.lidar, N.blink].map(byName).filter(Boolean).map(o => new T.Box3().setFromObject(o)).filter(b => !b.isEmpty());
  let ballX = hood.min.x + 0.16;
  for (let x = hood.min.x + 0.16; x < hood.max.x - 0.14; x += 0.02) {
    const fp = new T.Box3(new T.Vector3(x - 0.14, hoodTop - 0.02, -0.24), new T.Vector3(x + 0.14, hoodTop + 0.2, 0.24));
    if (!obst.some(b => b.intersectsBox(fp))) { ballX = x; break; }
  }
  if (!ballNodes.length) {
    const bm = lampInject(M(0x3b3f45, { metalness: 0.6, roughness: 0.5 }), lampU), stripe = lampInject(M(0xf2c14e, { roughness: 0.5 }), lampU);
    for (let k = 0; k < 4; k++) {
      const g = new T.Group(); g.visible = false;
      const m = new T.Mesh(new T.BoxGeometry(0.26, 0.085, 0.2), bm); m.castShadow = true; g.add(m);
      const s = new T.Mesh(new T.BoxGeometry(0.262, 0.02, 0.05), stripe); s.position.y = 0.01; g.add(s);
      g.position.set(ballX, hoodTop + 0.045 + (k >> 1) * 0.09, (k % 2 ? 1 : -1) * 0.115);
      obj.add(g); blocks.push(g);
    }
  }
  // plov: skjoldet pakkes ind i en gruppe, så det kan bøjes uden at røre drejetappen
  let bend = null, bendBase = null, wedge = null;
  const pivBase = piv ? piv.rotation.y : 0, liftBase = lift ? { z: lift.rotation.z, y: lift.position.y } : null;
  if (piv) {
    // kun skjoldet bøjes; findes noden ikke, pakkes alt under drejetappen ind i en gruppe
    bend = piv.getObjectByName('plovskjold');
    if (!bend) { bend = new T.Group(); bend.name = 'plov_boejning'; while (piv.children.length) bend.add(piv.children[0]); piv.add(bend); }
    bendBase = { r: bend.rotation.clone(), p: bend.position.clone() };
    const pb = new T.Box3(); piv.updateWorldMatrix(true, true);
    { const inv = new T.Matrix4().copy(piv.matrixWorld).invert(); bend.traverse(o => { if (o.isMesh) { o.geometry.computeBoundingBox(); pb.union(o.geometry.boundingBox.clone().applyMatrix4(new T.Matrix4().multiplyMatrices(inv, o.matrixWorld))); } }); }
    const zH = Math.max(0.5, Math.max(Math.abs(pb.min.z), Math.abs(pb.max.z)) - 0.06);
    const sh = new T.Shape(); sh.moveTo(0, 0); sh.lineTo(0.42, 0); sh.quadraticCurveTo(0.14, 0.08, 0, 0.36); sh.lineTo(0, 0);
    const wg = new T.ExtrudeGeometry(sh, { depth: zH * 2, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 2, curveSegments: 6 }); wg.translate(0, 0, -zH);
    wedge = new T.Mesh(wg, lampInject(M(0xd4dce8, { roughness: 1, emissive: 0x141b28, emissiveIntensity: 0.5 }), lampU));
    wedge.position.set(Math.max(0, pb.max.x - 0.14), pb.min.y + 0.005, 0); wedge.visible = false; wedge.castShadow = true;
    piv.add(wedge);
  }
  // forlygter (SpotLight med lille skyggekort) og glød
  const fx0 = body.max.x, hy = body.min.y + (body.max.y - body.min.y) * 0.75;
  const spot = new T.SpotLight(srgb(0xfff1dc), 7, 26, 0.62, 0.55, 1.4);
  spot.position.set(fx0 - 0.05, hy + 0.15, 0); spot.castShadow = true; spot.shadow.mapSize.set(512, 512); spot.shadow.bias = -0.0008; spot.shadow.camera.near = 0.2; spot.shadow.camera.far = 26;
  const tgt = new T.Object3D(); tgt.position.set(fx0 + 7, -1.2, 0); obj.add(tgt); spot.target = tgt; obj.add(spot);
  const hgMat = new T.SpriteMaterial({ map: TEX.glow, color: srgb(0xfff0d8), blending: T.AdditiveBlending, depthWrite: false, transparent: true });
  const headGlows = [-1, 1].map(s => { const g = new T.Sprite(hgMat); g.position.set(fx0 + 0.02, hy - 0.06, s * 0.24); g.scale.set(0.45, 0.45, 1); obj.add(g); return g; });
  // advarselsblink: lys og glød
  const bPos = blink ? blink.getWorldPosition(new T.Vector3()) : new T.Vector3(-0.3, body.max.y + 0.06, 0.18);
  const bLight = new T.PointLight(srgb(0xff9a2a), 0, 7, 2); bLight.position.copy(bPos).add(new T.Vector3(0, 0.08, 0)); obj.add(bLight);
  const bGlow = new T.Sprite(new T.SpriteMaterial({ map: TEX.glow, color: srgb(0xffa030), blending: T.AdditiveBlending, depthWrite: false, transparent: true }));
  bGlow.position.copy(bLight.position); bGlow.scale.set(0.9, 0.9, 1); obj.add(bGlow);
  const blinkMats = []; if (blink) blink.traverse(o => { if (o.isMesh) for (const m of [].concat(o.material)) if (m.emissive) { m.emissive = srgb(0xff8a10); blinkMats.push(m); } });
  // blød skygge under robotten
  const blob = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: TEX.blob, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
  blob.rotation.x = -Math.PI / 2; blob.scale.set(body.max.x - body.min.x + 0.6, body.max.z - body.min.z + 0.5, 1); blob.renderOrder = 2;
  scene.add(obj); scene.add(blob);

  // hydraulikcylindrene (hus på den ene del, stang på den anden) rettes ind efter plovvinkel og løft (robot_parts.json → nodes.cylindre)
  const cyls = ((parts.nodes && parts.nodes.cylindre) || []).map(c => ({ hus: byName(c.hus), st: byName(c.stang) })).filter(c => c.hus && c.st);
  const AX = new T.Vector3(1, 0, 0), ANX = new T.Vector3(-1, 0, 0), ca = new T.Vector3(), cbv = new T.Vector3();
  let cylKey = '';
  function aimCylinders() {
    if (!cyls.length) return;
    const key = (piv ? piv.rotation.y.toFixed(3) : '') + '|' + (lift ? lift.rotation.z.toFixed(3) : '');
    if (key === cylKey) return; cylKey = key;
    obj.updateMatrixWorld(true);
    for (const c of cyls) {
      c.hus.getWorldPosition(ca); c.st.getWorldPosition(cbv);
      c.hus.quaternion.setFromUnitVectors(AX, c.hus.parent.worldToLocal(cbv.clone()).sub(c.hus.position).normalize());
      c.st.quaternion.setFromUnitVectors(ANX, c.st.parent.worldToLocal(ca.clone()).sub(c.st.position).normalize());
    }
  }
  const cur = { tire: null, ballast: -1 };
  let liftCur = 0, saltA = 0, lidarA = 0;
  function looks(R, force) {
    if (force || R.tire !== cur.tire) { cur.tire = R.tire; for (const W of wheels) { W.chains.visible = R.tire === 'kaede'; W.studs.visible = R.tire === 'pig'; } }
    if (force || R.ballast !== cur.ballast) {
      cur.ballast = R.ballast; const n = R.ballast >= 100 ? 4 : R.ballast > 0 ? 2 : 0;
      blocks.forEach((b, k) => b.visible = k < n);
      if (ballNodes.length) ballNodes.forEach((b, k) => b.visible = R.ballast > 0 && (ballNodes.length < 2 || k < Math.ceil(ballNodes.length * R.ballast / 100)));
    }
  }
  function update(dtR, dtG, s, tReal) {
    const R = s.R, L = s.st.live || {}, P = L.P || {};
    obj.position.set(R.x, 0, -R.y); obj.rotation.y = R.h;
    for (const W of wheels) { const da = clamp(R.v[W.side] * dtG / W.r, -0.7, 0.7); W.ang -= da; W.node.rotation.z = W.base + W.ang; }
    if (piv) piv.rotation.y = pivBase + R.ang * D2R;
    liftCur += clamp((R.down ? 0 : 1) - liftCur, -dtR * 3, dtR * 3);
    if (lift) { lift.rotation.z = liftBase.z + liftCur * 0.13; }
    if (bend) { const b = clamp((1 - R.plovH) / 0.6, 0, 1); bend.rotation.set(bendBase.r.x + b * 0.32, bendBase.r.y + b * 0.16, bendBase.r.z - b * 0.1); bend.position.y = bendBase.p.y + b * 0.02; }
    aimCylinders();
    if (wedge) { const f = clamp(P.fill || 0, 0, 1.1); wedge.visible = R.down && f > 0.03; if (wedge.visible) wedge.scale.set(0.35 + 0.65 * Math.sqrt(f), 0.25 + 0.75 * f, 1); }
    const ph = (tReal * 1.4) % 1, on = !R.dead && (ph < 0.07 || (ph > 0.14 && ph < 0.21));
    bLight.intensity = on ? 2.4 : 0; bGlow.material.opacity = on ? 1 : 0.05;
    for (const m of blinkMats) m.emissiveIntensity = on ? 3 : 0.15;
    if (blink) blink.rotation.y += dtR * 6;
    if (salt && R.saltOn && R.saltKg > 0) { saltA += dtR * 18; salt.rotation.y = saltA; }
    if (lidar) { lidarA += dtR * 3.5; lidar.rotation.y = lidarA; }
    const lit = !R.dead && R.soc > 0;
    const fpv = started && cam.mode === 'fp' && !cam.over;
    spot.intensity = lit ? 7 : 0; for (const g of headGlows) g.visible = lit && !fpv; bGlow.visible = !fpv;
    // natriumlys fra lygterne på robotten
    let a = 0; for (const H0 of lampHeads) { const dx = R.x - H0.x, dz = -R.y - H0.z, h2 = H0.y * H0.y, d2 = dx * dx + dz * dz; if (d2 < 900) a += h2 * H0.y / Math.pow(h2 + d2, 1.5); }
    lampU.value.copy(LAMP_COL).multiplyScalar(0.1 + Math.min(1.4, a) * 0.7);
    blob.position.set(R.x, terrain.heightAt(s.grid, R.x, R.y) + 0.02, -R.y); blob.rotation.z = R.h;
    looks(R, false);
  }
  return { obj, update, looks, kam, wheels, body, lift, piv, get spot() { return spot; } };
}

// ---------------------------------------------------------------- partikler: sneplov-kast, hjulspin, salt
function makeFX() {
  const NMAX = 1800;
  const pos = new Float32Array(NMAX * 3), col = new Float32Array(NMAX * 3), vel = new Float32Array(NMAX * 3), life = new Float32Array(NMAX);
  const geo = new T.BufferGeometry();
  const aP = new T.BufferAttribute(pos, 3).setUsage(T.DynamicDrawUsage), aC = new T.BufferAttribute(col, 3).setUsage(T.DynamicDrawUsage);
  geo.setAttribute('position', aP); geo.setAttribute('color', aC); geo.setDrawRange(0, 0);
  const pts = new T.Points(geo, new T.PointsMaterial({ size: 0.085, map: TEX.dot, vertexColors: true, transparent: true, depthWrite: false, sizeAttenuation: true, alphaTest: 0.02 }));
  pts.frustumCulled = false; scene.add(pts);
  let n = 0;
  function spawn(x, y, z, vx, vy, vz, l, r, g, b) {
    if (n >= NMAX) return; const o = n * 3;
    pos[o] = x; pos[o + 1] = y; pos[o + 2] = z; vel[o] = vx; vel[o + 1] = vy; vel[o + 2] = vz; col[o] = r; col[o + 1] = g; col[o + 2] = b; life[n] = l; n++;
  }
  const rnd = Math.random;
  function emit(s, dtR, sc) {
    if (H.RM) return;
    const R = s.R, L = s.st.live || {}, P = L.P || {}, fx = Math.cos(R.h), fy = Math.sin(R.h);
    if (R.down && P.tail && P.shed > 0.0004) {
      const k = Math.min(34, Math.ceil(P.shed * 14000 * dtR * Math.min(2, Math.sqrt(sc / 5))));
      for (let i = 0; i < k; i++) {
        const sp = 1.4 + rnd() * 2.6, up = 1.2 + rnd() * 2.4;
        spawn(P.tail.x + (rnd() - 0.5) * 0.2, 0.25 + rnd() * 0.3, -(P.tail.y + (rnd() - 0.5) * 0.2), P.tail.ox * sp + fx * (rnd() - 0.3), up, -(P.tail.oy * sp + fy * (rnd() - 0.3)), 0.7 + rnd() * 0.6, 0.9, 0.93, 0.97);
      }
    }
    if (R.down && (P.ind || 0) > 0.002 && (L.v || 0) > 0.05) {
      const cx = R.x + fx * 1.05, cy = R.y + fy * 1.05;
      for (let i = 0; i < 3; i++) { const t = (rnd() - 0.5) * 1.2; spawn(cx - fy * t, 0.35 + rnd() * 0.15, -(cy + fx * t), fx * 0.8 + (rnd() - 0.5) * 0.4, 0.4 + rnd() * 0.6, -(fy * 0.8 + (rnd() - 0.5) * 0.4), 0.4, 0.92, 0.95, 1); }
    }
    if (R.down && (P.over || 0) > 0.001) {
      for (let i = 0; i < 4; i++) { const t = (rnd() - 0.5) * 1.3, cx = R.x + fx * 1.0 - fy * t, cy = R.y + fy * 1.0 + fx * t; spawn(cx, 0.55, -cy, (rnd() - 0.5) * 0.6, 0.6 + rnd(), (rnd() - 0.5) * 0.6, 0.6, 0.95, 0.97, 1); }
    }
    for (let i = 0; i < 2; i++) {
      const S = s.S[i]; if (!(S.limited && S.limBy === 'trac')) continue;
      const sl = i === 0 ? 1 : -1, ice = S.surf === 2;
      for (let k = 0; k < 5; k++) {
        const a = rnd() < 0.5 ? 1 : -1, x = R.x + fx * a * 0.35 - fy * sl * 0.45 - fx * 0.2, y = R.y + fy * a * 0.35 + fx * sl * 0.45 - fy * 0.2;
        spawn(x, 0.05, -y, -fx * (1.5 + rnd() * 2) + (rnd() - 0.5), 0.6 + rnd() * 1.4, fy * (1.5 + rnd() * 2) + (rnd() - 0.5), 0.45 + rnd() * 0.3, ice ? 0.6 : 0.92, ice ? 0.8 : 0.94, ice ? 0.95 : 0.98);
      }
    }
    if (R.saltOn && R.saltKg > 0 && Math.abs(L.v || 0) > 0.05) {
      const bx = R.x - fx * 0.68, by = R.y - fy * 0.68;
      for (let k = 0; k < 6; k++) { const a = R.h + Math.PI + (rnd() - 0.5) * 2.4, sp = 1.5 + rnd() * 1.5; spawn(bx, 0.28, -by, Math.cos(a) * sp, 0.3 + rnd() * 0.4, -Math.sin(a) * sp, 0.5, 0.62, 0.6, 0.55); }
    }
  }
  function step(dt) {
    for (let i = 0; i < n; i++) {
      life[i] -= dt;
      if (life[i] <= 0) { n--; if (i < n) { const o = i * 3, e = n * 3; for (let q = 0; q < 3; q++) { pos[o + q] = pos[e + q]; vel[o + q] = vel[e + q]; col[o + q] = col[e + q]; } life[i] = life[n]; } i--; continue; }
      const o = i * 3; vel[o + 1] -= 7.5 * dt; const dr = Math.max(0, 1 - 1.2 * dt); vel[o] *= dr; vel[o + 2] *= dr;
      pos[o] += vel[o] * dt; pos[o + 1] += vel[o + 1] * dt; pos[o + 2] += vel[o + 2] * dt;
      if (pos[o + 1] < 0.02) { pos[o + 1] = 0.02; vel[o] *= 0.4; vel[o + 1] = 0; vel[o + 2] *= 0.4; life[i] = Math.min(life[i], 0.25); }
    }
    geo.setDrawRange(0, n); aP.needsUpdate = aC.needsUpdate = true;
  }
  function clear() { n = 0; geo.setDrawRange(0, 0); }
  return { emit, step, clear, get n() { return n; } };
}

// ---------------------------------------------------------------- snefald (Points i en kasse om det, kameraet ser på)
function makeFlakes() {
  const NF = 3600, BX = 64, BY = 20, BZ = 64;
  const pos = new Float32Array(NF * 3), sp = new Float32Array(NF);
  for (let i = 0; i < NF; i++) { pos[i * 3] = (Math.random() - 0.5) * BX; pos[i * 3 + 1] = Math.random() * BY; pos[i * 3 + 2] = (Math.random() - 0.5) * BZ; sp[i] = 0.6 + Math.random() * 0.8; }
  const geo = new T.BufferGeometry(); const aP = new T.BufferAttribute(pos, 3).setUsage(T.DynamicDrawUsage); geo.setAttribute('position', aP);
  const mat = new T.PointsMaterial({ size: 0.075, map: TEX.dot, color: srgb(0xdfe7f2), transparent: true, opacity: 0.85, depthWrite: false, sizeAttenuation: true });
  const pts = new T.Points(geo, mat); pts.frustumCulled = false; scene.add(pts);
  let t = 0;
  function update(dt, w, c) {
    const inten = Math.min(1, (w.sne || 0) / 4 + (w.is > 0 ? 0.6 : 0)), rain = w.is > 0;
    const count = inten > 0 && !H.RM ? Math.round(NF * Math.min(1, 0.12 + inten * 0.88)) : 0;
    geo.setDrawRange(0, count); if (!count) return;
    mat.size = rain ? 0.035 : 0.075; mat.color.copy(rain ? srgb(0xa9cbe4) : srgb(0xdfe7f2));
    const fall = rain ? 7 : 1.1, wx = (w.vind || 0) * 0.55, wz = (w.vind || 0) * 0.18; t += dt;
    for (let i = 0; i < count; i++) {
      const o = i * 3, s = sp[i];
      let x = pos[o] + (wx * s + Math.sin(t * 1.3 + i) * 0.25) * dt, y = pos[o + 1] - fall * s * dt, z = pos[o + 2] + wz * s * dt;
      x = ((x - c.x + BX / 2) % BX + BX) % BX - BX / 2 + c.x;
      z = ((z - c.z + BZ / 2) % BZ + BZ) % BZ - BZ / 2 + c.z;
      if (y < 0) y += BY;
      pos[o] = x; pos[o + 1] = y; pos[o + 2] = z;
    }
    aP.needsUpdate = true;
  }
  return { update };
}

// ---------------------------------------------------------------- kameraer
const UP = new T.Vector3(0, 1, 0), NORTH = new T.Vector3(0, 0, -1), EAST = new T.Vector3(1, 0, 0);
const cam = { mode: 'chase', over: false, zoom: { chase: 1, fp: 1, top: 1, over: 1 }, pos: new T.Vector3(30, 18, 25), look: new T.Vector3(40, 0, -12.5), h: 0, fov: 55, snap: true, lastP: new T.Vector3(), attractA: 0 };
const CAM_NAVN = { chase: 'Jagtkamera', fp: 'Førerkamera', top: 'Ovenfra', orbit: 'Kran (træk med musen)', overview: 'Oversigt' };
function camUi() { return cam.over ? 'overview' : cam.mode; }
function setCam(m, quiet) {
  if (m === 'overview') cam.over = !cam.over;
  else { cam.over = false; cam.mode = m; }
  controls.enabled = cam.mode === 'orbit' && !cam.over;
  if (controls.enabled) { controls.target.copy(robot.obj.position).add(new T.Vector3(0, 0.4, 0)); cam.lastP.copy(robot.obj.position); }
  cam.snap = cam.mode === 'fp' && !cam.over;
  if (!quiet && started) H.toast({ sev: 'info', title: CAM_NAVN[camUi()], msg: cam.over ? 'Hele arealet set oppefra. Tryk M igen for at vende tilbage.' : 'C skifter kamera. Musehjulet zoomer.' });
}
function cycleCam() { const order = ['chase', 'fp', 'top', 'orbit']; setCam(order[(order.indexOf(cam.mode) + 1) % order.length]); }
const _v = new T.Vector3(), _w = new T.Vector3(), _u = new T.Vector3();
function updateCamera(dt) {
  const R = sim.R, p = robot.obj.position;
  let up = UP, fov = 55, tp = _v, tl = _w, k = 1 - Math.exp(-dt * 6), direct = false;
  if (!started) {
    cam.attractA += dt * 0.05;
    tp.set(40 + Math.cos(cam.attractA) * 52, 19, -12.5 + Math.sin(cam.attractA) * 34); tl.set(40, 0, -12.5); k = 1 - Math.exp(-dt * 2);
  } else if (cam.over) {
    const asp = camera.aspect, port = asp < 0.95, t = Math.tan(25 * D2R);
    const halfW = port ? 17 : 47, halfH = port ? 47 : 17;
    const hgt = Math.max(halfH / t, halfW / (t * asp)) * cam.zoom.over;
    tp.set(40, hgt, -12.5 + 0.01); tl.set(40, 0, -12.5); up = port ? EAST : NORTH; fov = 50;
  } else if (cam.mode === 'orbit') {
    _v.copy(p).sub(cam.lastP); camera.position.add(_v); controls.target.add(_v); cam.lastP.copy(p);
    controls.update(); cam.pos.copy(camera.position); cam.look.copy(controls.target); camera.up.copy(UP);
    if (Math.abs(camera.fov - 55) > 0.1) { camera.fov = 55; camera.updateProjectionMatrix(); }
    return;
  } else if (cam.mode === 'chase') {
    cam.h += wrapA(R.h - cam.h) * (1 - Math.exp(-dt * 3.5));
    const z = cam.zoom.chase, fx = Math.cos(cam.h), fz = -Math.sin(cam.h);
    tp.set(p.x - fx * 4.4 * z, 1.3 + 1.6 * z, p.z - fz * 4.4 * z); tl.set(p.x + fx * 1.8, 0.35, p.z + fz * 1.8); k = 1 - Math.exp(-dt * 8);
  } else if (cam.mode === 'fp') {
    const kn = robot.kam; if (kn) { _u.set(0.24, 0.16, 0); kn.localToWorld(_u); tp.copy(_u); } else tp.copy(p).add(new T.Vector3(0.3, 0.95, 0).applyAxisAngle(UP, R.h));
    const pitch = 15 * D2R, fx = Math.cos(R.h), fz = -Math.sin(R.h);
    tl.set(tp.x + fx * Math.cos(pitch), tp.y - Math.sin(pitch), tp.z + fz * Math.cos(pitch)); fov = 74 / cam.zoom.fp; direct = true;
  } else if (cam.mode === 'top') {
    tp.set(p.x, 21 * cam.zoom.top, p.z + 0.01); tl.copy(p); up = NORTH; fov = 50;
  }
  if (direct || cam.snap) { cam.pos.copy(tp); cam.look.copy(tl); cam.snap = false; }
  else { cam.pos.lerp(tp, k); cam.look.lerp(tl, k); }
  if (cam.pos.y < 0.4) cam.pos.y = 0.4;
  camera.position.copy(cam.pos); camera.up.copy(up); camera.lookAt(cam.look);
  if (Math.abs(camera.fov - fov) > 0.05) { camera.fov += (fov - camera.fov) * (direct ? 1 : Math.min(1, k * 2)); camera.updateProjectionMatrix(); }
}
function camInfo() { const d = new T.Vector3(); camera.getWorldDirection(d); return { x: camera.position.x, y: -camera.position.z, h: Math.atan2(-d.z, d.x) }; }

// ---------------------------------------------------------------- spil
function setScale(s) { scale = s; }
function setPaused(on) { paused = !!on; }
function toggleAuto() { if (!sim || !started) return; sim.setAuto(!sim.AP.on); }
function startGame(valg) {
  sim = createSim(valg); started = true; paused = false; endShown = false; garageOpen = false;
  document.getElementById('hud').hidden = false;
  fx.clear(); H.reset(); cam.snap = true; cam.h = sim.R.h;
  if (cam.mode === 'orbit') setCam('orbit', true);
  robot.looks(sim.R, true); terrain.update(sim.grid);
  H.toast({ sev: 'info', title: sim.sc.navn, msg: 'Kl. 02:00. Tryk P for autopilot, eller kør selv med W A S D. Ploven sænkes med mellemrum. C skifter kamera.' });
}
function bjaerg() {
  if (!sim || !started) return; const r = sim.bjaerg();
  if (r) { H.toast({ sev: 'warn', title: 'Bjærgning', msg: 'Robotten blev slæbt til værkstedet. Det tog ' + r.min + ' min og kostede 1.200 kr.' }); cam.snap = true; terrainDirty = true; }
  else H.toast({ sev: 'info', title: 'Ingen bjærgning', msg: 'Robotten holder allerede på ladestationen.' });
}
function setAng(a) { const R = sim.R; a = clamp(a, -40, 40); R.angTarget = a; if (Math.abs(a) >= 10) R.angMag = Math.abs(a); }
function takeOver() { if (sim && sim.AP.on) { sim.setAuto(false); H.toast({ sev: 'info', title: 'Du har overtaget styringen', msg: 'Autopiloten er slået fra. Tryk P for at slå den til igen.' }); } }

// ---------- værksted
function openShop() {
  if (!sim || !started || garageOpen || !document.getElementById('mShop').hidden) return;
  if (!sim.inStation()) { H.toast({ sev: 'info', title: 'Ikke på ladestationen', msg: 'Kør robotten ind på den lyse plads ved hallen i vestenden, og hold stille.' }); return; }
  for (const k in keys) keys[k] = false;
  if (garageReady && window.Garage) {
    setPaused(true); garageOpen = true; document.body.classList.add('gar-aaben');
    try { window.Garage.open({ onClose: garageClosed }); return; }
    catch (e) { console.error('Garage.open fejlede, bruger værkstedslisten', e); garageOpen = false; document.body.classList.remove('gar-aaben'); setPaused(false); }
  }
  H.openShopFallback(sim);
}
function restoreRenderer() {
  renderer.setRenderTarget(null); renderer.setScissorTest(false); renderer.autoClear = true;
  renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05; renderer.outputEncoding = T.sRGBEncoding;
  renderer.shadowMap.enabled = true; renderer.setClearColor(0x05080e, 1);
  renderer.setPixelRatio(stats.pr); onResize();
}
function garageClosed() {
  if (!garageOpen) return;
  garageOpen = false; document.body.classList.remove('gar-aaben'); restoreRenderer();
  setPaused(false); lastHint = performance.now() + 4000;
  if (sim.AP.on && sim.AP.mode === 'station') sim.setAuto(true);
  robot.looks(sim.R, true); terrainDirty = true;
}
function shopClosed() { if (sim && sim.AP.on && sim.AP.mode === 'station') sim.setAuto(true); robot.looks(sim.R, true); terrainDirty = true; lastHint = performance.now() + 4000; }

// ---------- taster
const KEYMAP = { KeyW: 'fwd', ArrowUp: 'fwd', KeyS: 'back', ArrowDown: 'back', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right' };
function onKey(e) {
  if (garageOpen) return;
  if (e.target && e.target.closest && e.target.closest('input,select,textarea')) return;
  const $ = H.$;
  if (e.code === 'Escape') { if (!$('mHelp').hidden) H.showModal('mHelp', false); else if (!$('mShop').hidden) $('btnShopClose').click(); else if (started && $('mStart').hidden && $('mEnd').hidden) setPaused(!paused); return; }
  if (!started || H.anyModal()) { if (e.code === 'KeyH') H.showModal('mHelp', $('mHelp').hidden); return; }
  if (KEYMAP[e.code]) { keys[KEYMAP[e.code]] = true; takeOver(); e.preventDefault(); return; }
  const R = sim.R;
  switch (e.code) {
    case 'ShiftLeft': case 'ShiftRight': keys.boost = true; break;
    case 'Space': e.preventDefault(); sim.setBlade(!R.down); break;
    case 'KeyQ': setAng(R.angTarget + 10); break;
    case 'KeyE': setAng(R.angTarget - 10); break;
    case 'KeyZ': R.vSet = clamp(Math.round((R.vSet - 0.1) * 10) / 10, 0.2, 1.5); break;
    case 'KeyX': R.vSet = clamp(Math.round((R.vSet + 0.1) * 10) / 10, 0.2, 1.5); break;
    case 'KeyF': R.saltOn = !R.saltOn; break;
    case 'KeyP': toggleAuto(); break;
    case 'KeyV': openShop(); break;
    case 'KeyB': bjaerg(); break;
    case 'KeyC': cycleCam(); break;
    case 'KeyM': setCam('overview'); break;
    case 'KeyT': H.setTele(!H.teleOpen); break;
    case 'KeyH': H.showModal('mHelp', true); break;
    case 'Digit1': setScale(1); break; case 'Digit2': setScale(5); break; case 'Digit3': setScale(10); break; case 'Digit4': setScale(20); break; case 'Digit5': setScale(40); break;
  }
}
function onKeyUp(e) { if (KEYMAP[e.code]) keys[KEYMAP[e.code]] = false; if (e.code.startsWith('Shift')) keys.boost = false; }

// ---------- størrelse og billedfrekvens
function onResize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h); camera.aspect = w / Math.max(1, h); camera.updateProjectionMatrix();
  if (garageOpen && window.Garage && Garage.resize) try { Garage.resize(w, h); } catch (e) { console.error(e); }
}
let prMax = 1, frAcc = 0, frN = 0, frT = 0;
function trackFps(dt, now) {
  frAcc += dt; frN++;
  if (now - frT > 1000) {
    stats.fps = frN / Math.max(1e-3, frAcc); stats.ft = 1000 * frAcc / Math.max(1, frN); frAcc = 0; frN = 0; frT = now;
    if (!garageOpen && started && !stats.lock) {
      // dynamisk opløsning: hold mindst ~45 billeder pr. sekund
      if (stats.fps < 44 && stats.pr > 0.6) { stats.pr = Math.max(0.6, stats.pr - 0.15); renderer.setPixelRatio(stats.pr); onResize(); }
      else if (stats.fps > 57 && stats.pr < prMax - 0.01) { stats.pr = Math.min(prMax, stats.pr + 0.1); renderer.setPixelRatio(stats.pr); onResize(); }
    }
  }
}

// ---------- løkke
let last = performance.now(), frame = 0, lastPanel = 0, lastMini = -1e9, terrainDirty = true, rollRow = 0;
function loop(now) {
  requestAnimationFrame(loop);
  const dtR = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; frame++;
  trackFps(dtR, now);
  if (garageOpen && window.Garage && typeof Garage.isOpen === 'function' && !Garage.isOpen()) garageClosed();
  if (garageOpen) {
    try { window.Garage.frame(dtR); } catch (e) { console.error('Garage.frame fejlede', e); try { window.Garage.close(); } catch (e2) {} garageClosed(); }
    return;
  }
  const $ = H.$;
  let dtG = 0;
  if (sim && started && !paused && !H.anyModal() && !sim.st.ended) {
    const inp = { fwd: !!keys.fwd, back: !!keys.back, turn: (keys.left ? 1 : 0) - (keys.right ? 1 : 0), boost: !!keys.boost, wMax: Math.min(0.9, 2.4 / scale) };
    const t0 = sim.st.t, p0 = performance.now(); sim.advance(dtR * scale, inp); dtG = sim.st.t - t0; ema('tSim', performance.now() - p0);
    fx.emit(sim, dtR, scale); H.pumpEvents(sim);
    if (sim.AP.on && sim.AP.mode === 'station' && sim.inStation() && now - lastHint > 1500) { lastHint = now; openShop(); if (garageOpen) return; }
  }
  if (started && sim.st.ended && !endShown && $('mShop').hidden && !garageOpen) { endShown = true; H.showEnd(sim); }
  robot.update(dtR, dtG, sim, now / 1000);
  fx.step(dtR);
  flakes.update(dtR, sim.st.w, cam.look);
  { // sneen: rækkerne om robotten hvert andet billede, et rullende bånd over resten imellem
    const p0 = performance.now(), G = sim.grid;
    if (terrainDirty) { terrain.update(G); terrainDirty = false; }
    else if (dtG > 0) {
      if (frame % 2 === 0) { const j = (sim.R.y - G.Y0) / G.cell; terrain.update(G, j - 22, j + 22); }
      else { terrain.update(G, rollRow, rollRow + 15); rollRow = rollRow + 16 >= G.NY ? 0 : rollRow + 16; }
    }
    ema('tTer', performance.now() - p0);
  }
  { // ladestationens LED: grøn, når robotten holder på pladsen; halvtaget bliver gennemsigtigt set ovenfra
    const inSt = sim.inStation(), c = inSt ? COL_OK : COL_SOD;
    if (stationLED) { stationLED.material.color.copy(c); const s = 1.1 + 0.2 * Math.sin(now / 300); stationLED.scale.set(s, s, 1); }
    for (const m of stationLedMats) { if (m.emissive) m.emissive.copy(c); if (m.color) m.color.copy(c); }
    const see = started && (cam.over || (cam.mode !== 'fp' && Math.hypot(sim.R.x + 2.8, sim.R.y - 2.75) < 7.5));
    if (stationG && see !== stationG.userData.see) {
      stationG.userData.see = see;
      stationG.traverse(o => { if (o.isMesh) for (const m of [].concat(o.material)) { m.transparent = see || !!m.userData.wasT; m.opacity = see ? 0.28 : (m.userData.op0 !== undefined ? m.userData.op0 : m.opacity); if (m.userData.op0 === undefined) { m.userData.op0 = 1; m.userData.wasT = false; } m.depthWrite = !see; m.needsUpdate = true; } });
    }
  }
  updateCamera(dtR);
  // tågen tyndes ud, når kameraet er højt oppe (top og oversigt), ellers ville arealet forsvinde i sne-diset
  scene.fog.density = (0.011 + 0.0045 * Math.min(4, sim.st.w.sne || 0) + (sim.st.w.is > 0 ? 0.006 : 0)) * Math.min(1, 9 / Math.max(9, camera.position.y));
  { const p0 = performance.now(); renderer.render(scene, camera); ema('tRen', performance.now() - p0); }
  if (started) {
    const p0 = performance.now();
    if (now - lastPanel > 120) { lastPanel = now; H.update(sim, { paused, scale, cam: camUi(), garage: garageOpen }); }
    if (frame % 2 === 1) H.drawInst(sim);
    if (now - lastMini > 300) { lastMini = now; H.updateMiniGround(sim); H.drawMini(sim, camInfo()); }
    ema('tHud', performance.now() - p0);
  }
}

// ---------------------------------------------------------------- opstart
async function boot() {
  makeTextures();
  const host = document.getElementById('game');
  renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  prMax = Math.min(1.5, devicePixelRatio || 1); stats.pr = prMax;
  renderer.setPixelRatio(stats.pr); renderer.domElement.className = 'gl'; renderer.domElement.tabIndex = 0;
  renderer.outputEncoding = T.sRGBEncoding; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFShadowMap;
  host.prepend(renderer.domElement);
  scene = new T.Scene(); scene.fog = new T.FogExp2(srgb(0x0d1320), 0.012); scene.background = srgb(0x05080e);
  camera = new T.PerspectiveCamera(55, innerWidth / innerHeight, 0.05, 900);
  onResize();
  scene.add(new T.HemisphereLight(srgb(0x46597f), srgb(0x17140f), 0.42));
  const moon = new T.DirectionalLight(srgb(0x9fb4e0), 0.3); moon.position.set(-30, 50, 25); scene.add(moon);
  controls = new T.OrbitControls(camera, renderer.domElement);
  controls.enabled = false; controls.enableDamping = true; controls.dampingFactor = 0.12; controls.maxPolarAngle = Math.PI * 0.48; controls.minDistance = 1.5; controls.maxDistance = 60;

  H.init({
    start: startGame, togglePause: () => { if (started) setPaused(!paused); }, toggleAuto, setScale, setCam: m => { if (started) setCam(m); }, openShop, shopClosed,
    repaired: () => { terrainDirty = true; robot.looks(sim.R, true); },
    hold: (k, on) => { keys[k] = on; if (on && k !== 'boost') takeOver(); },
    action: a => { if (!started) return; const R = sim.R; if (a === 'angL') setAng(R.angTarget + 10); else if (a === 'angR') setAng(R.angTarget - 10); else if (a === 'lift') sim.setBlade(!R.down); else if (a === 'salt') R.saltOn = !R.saltOn; else if (a === 'cam') cycleCam(); },
    modalChanged: () => {},
  });
  addEventListener('keydown', onKey); addEventListener('keyup', onKeyUp);
  addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
  addEventListener('resize', onResize);
  renderer.domElement.addEventListener('wheel', e => {
    if (!started || garageOpen) return;
    if (cam.mode === 'orbit' && !cam.over) return; // OrbitControls zoomer selv
    e.preventDefault(); const f = e.deltaY > 0 ? 1.1 : 1 / 1.1;
    if (cam.over) cam.zoom.over = clamp(cam.zoom.over * f, 0.45, 1.6);
    else if (cam.mode === 'chase') cam.zoom.chase = clamp(cam.zoom.chase * f, 0.4, 3.2);
    else if (cam.mode === 'fp') cam.zoom.fp = clamp(cam.zoom.fp / f, 0.7, 2.2);
    else if (cam.mode === 'top') cam.zoom.top = clamp(cam.zoom.top * f, 0.25, 3);
  }, { passive: false });

  // assets: rigtige glb-filer, hvis de findes, ellers pladsholdere
  const [gR, parts, gP] = await Promise.all([loadGLB('assets/robot.gltf.json'), loadJSON('assets/robot_parts.json'), loadGLB('assets/props.gltf.json')]);
  assets.robotGLB = !!gR; assets.propsGLB = !!gP;
  assets.robot = gR ? gR.scene : makePlaceholderRobot();
  assets.parts = parts || DEFAULT_PARTS;
  assets.props = gP ? gP.scene : makePlaceholderProps();
  if (gP) { // manglende rekvisitter i props.glb suppleres med pladsholdere
    const ph = makePlaceholderProps();
    for (const n of ['lygtepael', 'ladestation', 'hal_vaerksted', 'hal_lager', 'gran', 'hegn_sektion', 'kantsten_oe', 'skilt_depot']) if (!assets.props.getObjectByName(n)) { const o = ph.getObjectByName(n); if (o) { const holder = new T.Group(); holder.add(o); assets.props.add(holder); } }
  }
  sim = createSim(H.valg ? H.valg() : { scen: 'let', tire: 'vinter', ballast: 0, svaer: 'ing' });
  buildWorld(sim.grid);
  robot = makeRobot(); fx = makeFX(); flakes = makeFlakes();
  robot.looks(sim.R, true); terrain.update(sim.grid);
  window.SNE = { THREE: T, renderer, get sim() { return sim; }, assets: { robot: assets.robot, parts: assets.parts, props: assets.props }, toast: H.toast, setPaused };
  if (window.Garage && typeof window.Garage.init === 'function') {
    try { window.Garage.init(window.SNE); garageReady = true; } catch (e) { console.error('Garage.init fejlede, bruger værkstedslisten', e); garageReady = false; }
  }
  // fortæl, hvad der blev hentet
  console.info('Natteskift 3D: robot ' + (assets.robotGLB ? 'robot.glb' : 'pladsholder') + ', rekvisitter ' + (assets.propsGLB ? 'props.glb' : 'pladsholdere') + ', værksted ' + (garageReady ? 'garage.js' : 'liste'));
  document.getElementById('loadNote').remove();
  H.ready(true);
  requestAnimationFrame(t => { last = t; loop(t); });
  if (/debug/.test(location.hash)) {
    window.__ns3d = { get sim() { return sim; }, stats, cam, setCam: m => setCam(m, true), assets, get garageOpen() { return garageOpen; }, get garageReady() { return garageReady; }, openShop, keys, scene, renderer, camera, robot: () => robot, setPaused, startGame, terrain: () => terrain, fx: () => fx };
  }
}
window.Natteskift3D = { boot };
})();
