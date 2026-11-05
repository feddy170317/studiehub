// Fysikmotor til Natteskift 3D. Samme kode som 2D-spillets SIM-blok (Simulering/Snerydderspil/index.html).
// Ren simulering uden DOM. Globale navne: DAEK, UNDERLAG, SCENARIER, createSim.
// SIM-START
const DAEK = {
  sommer: { navn: 'Sommerdæk', mu: [0.80, 0.15, 0.05] },
  vinter: { navn: 'Vinterdæk', mu: [0.70, 0.25, 0.10] },
  pig:    { navn: 'Pigdæk',    mu: [0.70, 0.30, 0.20] },
  kaede:  { navn: 'Snekæder',  mu: [0.60, 0.40, 0.25] },
};
const UNDERLAG = ['Tør asfalt', 'Sne', 'Is'];
const SCENARIER = {
  let: { navn: 'Let snefald', kf: 'Øvelsesnat', kort: '3 cm sne og 1 cm i timen. Godt til at lære robotten at kende.',
    start: 0.03, startIs: 0, faser: [{ t0: 0, T: -3, sne: 1.0, is: 0, vind: 3, navn: 'Let snefald' }] },
  storm: { navn: 'Snestorm', kf: 'KF4 · dimensionerende', kort: '4 cm i timen i fire timer, våd og tung sne. Gruppens design-tilfælde.',
    start: 0.02, startIs: 0, faser: [{ t0: 0, T: -1, sne: 4.0, is: 0, vind: 9, navn: 'Snestorm' }] },
  isslag: { navn: 'Isslag', kf: 'KF20', kort: 'Underafkølet regn fryser på asfalten, derefter sne ovenpå isen. Kræver salt og greb.',
    start: 0.005, startIs: 0.3, faser: [{ t0: 0, T: 0.5, sne: 0, is: 0.8, vind: 4, navn: 'Underafkølet regn' }, { t0: 1.5, T: -2, sne: 0.8, is: 0, vind: 3, navn: 'Sne på is' }] },
  frost: { navn: 'Frostnat', kf: 'KF5-B', kort: '−14 °C og 2,5 cm hård, gammel sne. Kulden tager 30 % af batteriet.',
    start: 0.025, startIs: 0, rho: 380, komp: 1.2, faser: [{ t0: 0, T: -14, sne: 0, is: 0, vind: 2, navn: 'Klar frost' }] },
  blandet: { navn: 'Skiftende vinternat', kf: 'Alt på én nat', kort: 'Tæt sne, så isslag, så faldende temperatur. Udstyret skal skiftes undervejs.',
    start: 0.02, startIs: 0, faser: [{ t0: 0, T: -1, sne: 2.0, is: 0, vind: 6, navn: 'Tæt snefald' }, { t0: 1, T: 0.3, sne: 0, is: 0.6, vind: 5, navn: 'Isslag' },
      { t0: 2, T: -7, sne: 1.5, is: 0, vind: 7, navn: 'Sne og frost' }, { t0: 3, T: -12, sne: 0, is: 0, vind: 2, navn: 'Klart og koldt' }] },
};

function createSim(opt) {
  const g = 9.80665, D2R = Math.PI / 180, TAU = Math.PI * 2;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const wrap = a => { while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a; };
  const sc = SCENARIER[opt.scen] || SCENARIER.let;
  const C = {
    m0: 351.3, r: 0.20, iK: 2, itot: 40, etaK: 0.96, etaMek: 0.94 * 0.97 * 0.96, etaEl: 0.85,
    crr: 0.035, muG: 0.5, muB: 0.15, komp: sc.komp || 1.5, B: 1.40, H: 0.50, Rs: 0.40, phi: 40,
    spor: 0.90, L: 0.70, plovX: 0.95, Tglid: 36, TglidSlidt: 18, Tkont: 1.5, Tpeak: 4.0, Te: 32,
    Ebatt: 2.56, Phj: 60, Plad: 1500, vMax: 1.5, vKaede: 0.8, saltMax: 60, RES: 0.002,
  };
  const bb = 2 * Math.asin(C.H / (2 * C.Rs));
  C.Akile = C.H * C.H / (2 * Math.tan(C.phi * D2R)) + C.Rs * C.Rs / 2 * (bb - Math.sin(bb));
  const DIFF = opt.svaer === 'oevelse' ? { cap: 2, slid: 0.35, batt: 1.4 } : { cap: 1, slid: 1, batt: 1 };

  // ---------- gitter: 0,2 m celler, x −6..86 m, y −3..28 m
  const cell = 0.2, X0 = -6, Y0 = -3, NX = 460, NY = 155, NC = NX * NY, cellA = cell * cell;
  const depth = new Float32Array(NC), ice = new Float32Array(NC), salt = new Float32Array(NC);
  const zone = new Uint8Array(NC), fallMul = new Float32Array(NC), mark = new Int32Array(NC);
  let stamp = 1;
  const OER = [{ x: 26, y: 8.5, r: 0.9 }, { x: 54, y: 16.5, r: 0.9 }];
  const STATION = { x0: -5.5, x1: -0.5, y0: 0.5, y1: 5.0, cx: -2.8, cy: 2.75 };
  function hash(i, j) { let h = (i * 374761393 + j * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }
  function vnoise(x, y) {
    const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, s = t => t * t * (3 - 2 * t);
    const a = hash(i, j), b = hash(i + 1, j), c = hash(i, j + 1), d = hash(i + 1, j + 1);
    const u = s(fx), v = s(fy); return (a + (b - a) * u) * (1 - v) + (c + (d - c) * u) * v;
  }
  let nArea = 0;
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    const id = j * NX + i, x = X0 + (i + 0.5) * cell, y = Y0 + (j + 0.5) * cell;
    let z;
    if (x >= 0 && x < 80 && y >= 0 && y < 25) z = 0;
    else if (x >= 80) z = 2;
    else if (x >= STATION.x0 && x < STATION.x1 && y >= STATION.y0 && y < STATION.y1) z = 3;
    else z = 1;
    for (const o of OER) if ((x - o.x) ** 2 + (y - o.y) ** 2 < o.r * o.r) z = 5;
    zone[id] = z; if (z === 0) nArea++;
    const n1 = vnoise(x / 6, y / 6), n2 = vnoise(x / 2 + 40, y / 2 + 9);
    fallMul[id] = 0.88 + 0.24 * vnoise(x / 9 + 50, y / 9);
    depth[id] = z === 3 ? 0 : sc.start * (0.8 + 0.3 * n1 + 0.1 * n2);
    ice[id] = (z === 0 || z === 1) ? (sc.startIs || 0) * (0.7 + 0.6 * n2) : 0;
  }
  const cellAt = (x, y) => { const i = Math.floor((x - X0) / cell), j = Math.floor((y - Y0) / cell); return (i < 0 || j < 0 || i >= NX || j >= NY) ? -1 : j * NX + i; };

  // ---------- tilstand
  const st = { t: 0, slut: 4 * 3600, ended: false, ryddet: 0, w: null, fase: -1, events: [], hist: [], kr: 0, repairs: [], vaerkMin: 0,
    stats: { spin: 0, slip: 0, over: 0, kWh: 0, dist: 0, maxTemp: 0, runder: 0, vold: 0, stoed: 0, bjaerg: 0, saltKg: 0 }, live: {} };
  const R = { x: STATION.cx, y: STATION.cy, h: 0, v: [0, 0], ballast: opt.ballast || 0, tire: opt.tire || 'vinter',
    ang: 40, angTarget: 40, angMag: 40, down: false, W: 0, plovH: 1, saltOn: false, saltKg: C.saltMax, soc: 1, dead: false, vSet: 0.8, hLock: 0 };
  const mkSide = () => ({ temp: -5, motorOK: true, clutchWear: 0, shaftD: 0, shaftOK: true, bearing: 1, chain: 0, chainOK: true,
    F: 0, Tmel: 0, Tm: 0, lim: 0, limBy: '', limited: false, mu: 0.7, surf: 0, Pel: 0, need: 0, warned: {} });
  const S = [mkSide(), mkSide()];
  const cool = {};
  function emit(key, sev, title, msg, cd = 90) {
    if (cool[key] !== undefined && st.t - cool[key] < cd) return;
    cool[key] = st.t; st.events.push({ key, sev, title, msg, t: st.t });
  }
  const f1 = x => x.toFixed(1).replace('.', ','), f2 = x => x.toFixed(2).replace('.', ','), f0 = x => Math.round(x).toString();
  const SIDE = ['venstre', 'højre'];

  function weather(tH) {
    const F = sc.faser; let k = 0; for (let i = 0; i < F.length; i++) if (F[i].t0 <= tH) k = i;
    const p = F[k], nx = F[k + 1]; let T = p.T;
    if (nx && tH > nx.t0 - 0.25) T = p.T + (nx.T - p.T) * (tH - (nx.t0 - 0.25)) / 0.25;
    return { T, sne: p.sne, is: p.is, vind: p.vind, navn: p.navn, k };
  }
  const rho = () => sc.rho || clamp(250 + 25 * (st.w.T + 3), 120, 340);
  const kT = () => clamp(0.7 + 0.3 * (st.w.T + 15) / 20, 0.65, 1.0);
  st.w = weather(0);
  for (const s of S) s.temp = st.w.T + 8;

  // ---------- sne flyttes
  function addSnow(id, vol) { depth[id] += vol / cellA; }
  function spreadAt(x, y, vol) {
    const id = cellAt(x, y); if (id < 0) return false;
    const i = id % NX, j = (id / NX) | 0, parts = [[0, 0, 0.4], [1, 0, 0.15], [-1, 0, 0.15], [0, 1, 0.15], [0, -1, 0.15]];
    let rest = 0;
    for (const [di, dj, w] of parts) {
      const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= NX || jj >= NY) { rest += w; continue; }
      const k = jj * NX + ii; if (zone[k] === 5) { rest += w; continue; } addSnow(k, vol * w);
    }
    if (rest > 0) addSnow(id, vol * rest);
    return true;
  }
  // kast sne ud til siden; en vold over 1 m tager ikke mere, så sneen lægges længere ude eller falder tilbage
  function kast(px, py, ox, oy, vol) {
    for (let k = 0; k <= 12; k++) {
      const x = px + ox * k * 0.2, y = py + oy * k * 0.2, id = cellAt(x, y);
      if (id < 0) break;
      if (zone[id] === 5) continue;
      if (depth[id] < 1.0) { spreadAt(x, y, vol); return true; }
    }
    return false;
  }

  function plov(dt, v) {
    const out = { F: 0, Fkile: 0, Fimp: 0, Fbank: 0, My: 0, ind: 0, hInd: 0, shed: 0, fill: 0, over: 0, hkap: 0, Wmax: 0, tail: null, s: 1 };
    const a = Math.abs(R.ang) * D2R, s = R.ang >= 0 ? 1 : -1;
    const fx = Math.cos(R.h), fy = Math.sin(R.h), nx = -fy, ny = fx;
    const Beff = C.B * Math.cos(a), glid = Math.sin(a) - C.muB * Math.cos(a);
    // øvelsesniveauet giver skjoldet større gennemstrømning (DIFF.cap), men kilens største volumen er stadig skjoldets
    // geometri. Ellers ville en fuld kile på øvelse veje dobbelt så meget og være sværere at skubbe.
    const Aeff = C.Akile * R.plovH * DIFF.cap;
    let Wmax = C.komp * C.Akile * R.plovH * Beff; if (glid <= 0.02) Wmax *= 2.0;
    out.Wmax = Wmax; out.s = s;
    out.hkap = glid > 0 ? C.komp * Aeff * glid / Beff : 0;
    if (!R.down) return out;
    const cx = R.x + fx * C.plovX, cy = R.y + fy * C.plovX;
    const ux = s * nx * Math.cos(a) - fx * Math.sin(a), uy = s * ny * Math.cos(a) - fy * Math.sin(a);
    const ox = s * nx, oy = s * ny;
    out.tail = { x: cx + ux * C.B / 2, y: cy + uy * C.B / 2, ox, oy };
    const r = rho();
    if (v < -0.03) {
      if (R.W > 0) { for (let k = 0; k < 8; k++) { const t = -0.5 + k / 7; spreadAt(cx + ux * C.B * t + fx * 0.2, cy + uy * C.B * t + fy * 0.2, R.W / 8); } R.W = 0; }
      return out;
    }
    stamp++;
    let intake = 0, sumD = 0, cnt = 0;
    for (let k = 0; k <= 14; k++) {
      const t = -0.5 + k / 14, px = cx + ux * C.B * t, py = cy + uy * C.B * t, id = cellAt(px, py);
      if (id < 0 || mark[id] === stamp || zone[id] === 5) continue;
      mark[id] = stamp; const d = depth[id]; sumD += d; cnt++;
      if (d > C.RES) { intake += (d - C.RES) * cellA; depth[id] = C.RES; }
    }
    out.hInd = cnt ? sumD / cnt : 0;
    R.W += intake; out.ind = intake / dt;
    if (glid > 0.02 && R.W > 0 && Math.abs(v) > 0.005) {
      const cap = C.komp * Aeff * glid * Math.abs(v);
      const shed = Math.min(R.W, cap * dt * Math.min(1, R.W / Wmax) * 1.15);
      if (shed > 0) {
        const throwD = 0.3 + 0.35 * v * v;
        const ok = kast(out.tail.x + ox * throwD, out.tail.y + oy * throwD, ox, oy, shed);
        if (!ok) { spreadAt(out.tail.x - ox * 0.1 - fx * 0.3, out.tail.y - oy * 0.1 - fy * 0.3, shed); st.stats.vold += dt; out.vold = true; }
        R.W -= shed; out.shed = shed / dt;
      }
    }
    if (R.W > Wmax) {
      const ex = R.W - Wmax; R.W = Wmax; out.over = ex / dt;
      if (glid > 0.02) {
        for (let k = 0; k < 7; k++) { const t = -0.45 + 0.9 * k / 6; spreadAt(cx + ux * C.B * t - fx * 0.35, cy + uy * C.B * t - fy * 0.35, ex / 7); }
      } else {
        spreadAt(cx + ux * (C.B / 2 + 0.3), cy + uy * (C.B / 2 + 0.3), ex / 2);
        spreadAt(cx - ux * (C.B / 2 + 0.3), cy - uy * (C.B / 2 + 0.3), ex / 2);
      }
    }
    out.fill = R.W / Wmax;
    out.Fkile = C.muG * r * R.W * g;
    out.Fimp = Math.min(300, r * (intake / dt) * Math.abs(v));
    out.Fbank = out.hInd > 0.45 ? 4000 * (out.hInd - 0.45) * Beff : 0;
    out.F = out.Fkile + out.Fimp + out.Fbank;
    out.My = -s * out.Fkile * Math.sin(a) * Math.cos(a) * C.plovX;
    return out;
  }

  // salt (NaCl) smelter næsten ikke is under −10 °C, så saltet is er stadig is i den kulde
  const saltVirker = () => st.w.T > -10;
  const isGlat = id => ice[id] > 0.3 && (salt[id] < 4 || !saltVirker());
  function underlag(x, y) {
    const id = cellAt(x, y); if (id < 0) return { u: 0, d: 0 };
    const d = depth[id];
    if (isGlat(id)) return { u: 2, d };
    if (d > 0.012) return { u: 1, d };
    return { u: 0, d };
  }

  // ---------- autopilot
  // Baner langs x fra midten og ud; plovsiden kaster altid udad mod kanten. Snevolden vokser bane for bane, og når den
  // er større end skjoldets kapacitet pr. meter (k·A·(sinθ − μ_B·cosθ)), løber skjoldet over og efterlader sne i banen.
  // Efter hver bane måler autopiloten banen. Er der sne tilbage, kører den banen igen den modsatte vej med spejlet
  // plovvinkel, så sneen stadig kastes udad. En ny runde starter kun i de halvdele, hvor der er noget at rydde.
  const MAXPASS = 4, DIRTY_LANE = 0.04, DIRTY_ROUND = 0.02;
  const AP = { on: false, mode: 'ryd', lanes: [], seq: [], si: 0, lane: 0, dir: 1, pass: 0, plan: [], k: 0, q: [], anchor: null, laneStart: [],
    sp: 0.95, mag: 40, vf: 1, stuck: 0, back: 0, stuckN: 0, stuckP: null, koel: false, vent: 0, skip: false,
    wantTire: null, wantSalt: false, tireAsked: -1e9, spinIs: 0, saltOdo: 0, why: '', half: 0, f: 12.5, y: undefined, bid: false, sweep: 0 };
  const nearOer = new Uint8Array(NC);
  for (let id = 0; id < NC; id++) { const x = X0 + (id % NX + 0.5) * cell, y = Y0 + ((id / NX | 0) + 0.5) * cell; for (const o of OER) if (Math.hypot(x - o.x, y - o.y) < o.r + 1.6) nearOer[id] = 1; }
  function routeTo(ax, ay, bx, by) {
    const pts = [];
    if (ax < -1.2) { pts.push({ x: 0.6, y: clamp(ay, 0.6, 24.4) }); ax = 0.6; ay = clamp(ay, 0.6, 24.4); }
    for (const o of OER) {
      const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1;
      const t = clamp(((o.x - ax) * dx + (o.y - ay) * dy) / L2, 0, 1);
      const qx = ax + dx * t, qy = ay + dy * t, dd = Math.hypot(qx - o.x, qy - o.y);
      if (dd < o.r + 1.2 && t > 0 && t < 1) {
        let px = -dy, py = dx; const L = Math.hypot(px, py) || 1; px /= L; py /= L;
        if ((qx - o.x) * px + (qy - o.y) * py < 0) { px = -px; py = -py; }
        pts.push({ x: o.x + px * (o.r + 1.7), y: o.y + py * (o.r + 1.7) });
      }
    }
    pts.push({ x: bx, y: by });
    return pts.map(p => ({ ...p, blade: false }));
  }
  // Banerne lægges ud fra en måling af sneen. Før hver bane måler autopiloten snevoldens tværsnit (m³ pr. meter bane,
  // middel langs x) og regner et kraftbudget: Hvor meget sne må skjoldet få ind pr. meter, før kilekraften plus
  // rullemodstanden i den sne, der løber over skjoldet og lander foran forhjulene, er større end slipkoblingen kan give?
  // Er volden større, lægges banen tættere på den forrige (mindre bid), så resten af volden ligger uden for hjulsporet.
  // Løber skjoldet over, tages banen kun om med det samme, hvis den samlede vold stadig kan skubbes. Ellers samles
  // resterne op på en ekstra tur fra midten, når halvdelen er kørt færdig.
  const J0 = Math.round((0 - Y0) / cell), J1 = Math.round((25 - Y0) / cell);
  const pv = new Float32Array(NY);
  const Bh = () => C.B * Math.cos(AP.mag * D2R) / 2;
  const rowY = j => Y0 + (j + 0.5) * cell;
  function capM() { const a = AP.mag * D2R; return C.komp * C.Akile * R.plovH * DIFF.cap * Math.max(0.02, Math.sin(a) - C.muB * Math.cos(a)); }
  function maxInd() {
    const bh = Bh(), Ns = (C.m0 + R.ballast) * g / 2, c = capM() * 1.15;
    const clT = Math.min(...S.map(s => s.clutchWear >= 1 ? C.TglidSlidt : C.Tglid));
    // på is regnes med isens μ; kun 80 % af grebet bruges til trækkraft, resten skal holde plovens drejemoment (friktionscirklen)
    const mu = (st.isAndel || 0) > 0.05 ? Math.min(DAEK[R.tire].mu[1], DAEK[R.tire].mu[2]) : DAEK[R.tire].mu[1];
    const Fside = Math.min(clT * C.iK * C.etaK / C.r, 0.8 * mu * Ns) - 45 - C.crr * Ns;
    const Fk2 = C.muG * rho() * C.komp * C.Akile * R.plovH * 2 * bh * g / 2;
    return (Fside >= Fk2 ? c + (Fside - Fk2) / (0.5 * Ns) * 2 * bh : c * Math.max(0.3, Fside / Fk2));
  }
  function profil() {
    for (let j = J0; j < J1; j++) {
      let s = 0, n = 0;
      for (let id = j * NX + 30, e = j * NX + 430; id < e; id++) { if (zone[id] !== 0) continue; n++; const d = depth[id]; if (d > C.RES) s += d - C.RES; }
      pv[j] = n ? s / n * cell : 0;
    }
  }
  function volPath(y, bh) {
    let v = 0;
    for (let j = Math.max(J0, Math.floor((y - bh - Y0) / cell)); j <= Math.min(J1 - 1, Math.floor((y + bh - Y0) / cell)); j++) {
      const a = Math.max(y - bh, rowY(j) - cell / 2), b = Math.min(y + bh, rowY(j) + cell / 2);
      if (b > a) v += pv[j] * (b - a) / cell;
    }
    return v;
  }
  function rowDirty(j, thr, medIs) {
    const isTael = medIs && saltVirker() && R.saltKg > 0.5;
    let n = 0, bad = 0;
    for (let id = j * NX + 30, e = j * NX + 430; id < e; id++) { if (zone[id] !== 0 || nearOer[id]) continue; n++; if (depth[id] > thr || (isTael && isGlat(id))) bad++; }
    return n ? bad / n : 0;
  }
  function stripDirty(ya, yb, thr) {
    let n = 0, s = 0;
    for (let j = Math.max(J0, Math.ceil((ya - Y0) / cell - 0.5)); j <= Math.min(J1 - 1, Math.floor((yb - Y0) / cell - 0.5)); j++) { s += rowDirty(j, thr, false); n++; }
    return n ? s / n : 0;
  }
  function pickY() {
    const s = AP.half === 0 ? 1 : -1, bh = Bh(), f = AP.f;
    const yHi = s > 0 ? Math.min(24.6, f + bh - 0.03) : Math.max(0.4, f - bh + 0.03);
    const yMin = f + s * (0.3 - bh);
    profil();
    const VT = maxInd();
    let y = yHi;
    while ((y - yMin) * s > 0.05 && volPath(y, bh) > VT) y -= s * 0.05;
    AP.bid = y !== yHi;
    // lavere fart i tunge volde: sneen skal accelereres op til robottens fart, F_imp = ρ·V·v², holdes under 30 N
    AP.vLane = Math.sqrt(30 / (rho() * Math.max(0.02, Math.min(volPath(y, bh), VT))));
    return y;
  }
  function lanePlan(y, disch, d) {
    const ang = disch * d * AP.mag, xa = d > 0 ? 0.4 : 79.6, xb = d > 0 ? 79.6 : 0.4, xe = xb + d * 1.4;
    const w = [{ x: xa, y, blade: true, ang, start: true }];
    const os = OER.filter(o => Math.abs(o.y - y) < o.r + 0.95).sort((p, q) => (p.x - q.x) * d);
    for (const o of os) {
      const sideY = (o.y - y) === 0 ? -disch : -Math.sign(o.y - y);
      const yn = clamp(o.y + sideY * (o.r + 1.05), 0.4, 24.6);
      w.push({ x: o.x - d * 2.6, y, blade: true, ang }, { x: o.x - d * 1.2, y: yn, blade: true, ang },
        { x: o.x + d * 1.2, y: yn, blade: true, ang }, { x: o.x + d * 2.6, y, blade: true, ang });
    }
    // fortsæt 1,4 m ud over kanten med ploven nede, og løft den så, så kilen lægges uden for arealet
    w.push({ x: xb, y, blade: true, ang }, { x: xe, y, blade: true, ang, end: true }, { x: xe, y, blade: false });
    return w;
  }
  function goLane(y) {
    AP.y = y; AP.lane++;
    AP.plan = lanePlan(y, AP.half === 0 ? 1 : -1, AP.dir); AP.k = 0;
    AP.q = routeTo(R.x, R.y, AP.dir > 0 ? -1.0 : 81.0, y); AP.anchor = { x: R.x, y: R.y };
  }
  // frontlinjen AP.f: alt mellem midten og AP.f er ryddet i den halvdel, der arbejdes på
  function startHalvdel(thr, frac, medIs) {
    if (AP.half === 0) { for (let j = Math.ceil((12.5 - Y0) / cell); j < J1; j++) if (rowDirty(j, thr, medIs) > frac) { AP.f = Math.max(12.45, rowY(j) - 0.15); return true; } }
    else if (AP.half === 1) { for (let j = Math.floor((12.5 - Y0) / cell) - 1; j >= J0; j--) if (rowDirty(j, thr, medIs) > frac) { AP.f = Math.min(12.55, rowY(j) + 0.15); return true; } }
    return false;
  }
  function nyRunde() {
    AP.mag = R.angMag; AP.half = 0; AP.pass = 0; AP.sweep = 0; AP.skip = false; AP.lane = 0;
    AP.plan = []; AP.k = 0; AP.q = []; AP.anchor = null; AP.seq = [1];
    while (AP.half < 2 && !startHalvdel(0.009, DIRTY_ROUND, true)) AP.half++;
    if (AP.half > 1) { AP.seq = []; AP.vent = 90; emit('ap-vent', 'ok', 'Arealet er ryddet', 'Autopiloten venter med hævet plov og måler igen om lidt.', 1800); return; }
    AP.dir = R.x < 40 ? 1 : -1; goLane(pickY());
  }
  function laneDone() {
    const s = AP.half === 0 ? 1 : -1, bh = Bh(), y = AP.y;
    AP.dir = -AP.dir;
    if (!AP.skip && AP.pass < MAXPASS - 1) {
      const rest = s > 0 ? stripDirty(y - bh + 0.1, y + bh - 0.2, 0.012) : stripDirty(y - bh + 0.2, y + bh - 0.1, 0.012);
      if (rest > DIRTY_LANE) {
        profil();
        const vRest = volPath(y, bh);
        if (vRest > 0.3 * capM() && vRest + volPath(y + s * AP.sp, bh) <= maxInd()) {
          AP.pass++; st.stats.gentag = (st.stats.gentag || 0) + 1;
          AP.plan = lanePlan(y, s, AP.dir); AP.k = 0; AP.q = []; AP.anchor = { x: R.x, y: R.y };
          emit('ap-gentag', 'info', 'Banen tages én gang til', 'Skjoldet løb over, og ' + f0(rest * 100) + ' % af banen har stadig over 1,2 cm sne. Robotten kører banen igen den modsatte vej med spejlet plovvinkel.', 300);
          return;
        }
      }
    }
    AP.pass = 0; AP.skip = false;
    AP.f = y + s * (bh - 0.1);
    if (s > 0 ? y >= 24.59 : y <= 0.41) {
      // halvdelen er kørt ud til kanten: saml rester op fra midten, ellers videre til næste halvdel
      if (AP.sweep < 2 && startHalvdel(0.025, DIRTY_LANE, false)) {
        AP.sweep++;
        emit('ap-rest', 'info', 'Opsamlingstur', 'Snevolden var større, end skjoldet kunne tage på én gang, så der ligger rester i nogle baner. Robotten kører dem igen fra midten og ud.', 300);
      } else {
        AP.half++; AP.sweep = 0;
        while (AP.half < 2 && !startHalvdel(0.009, DIRTY_ROUND, true)) AP.half++;
        if (AP.half > 1) {
          AP.seq = []; st.stats.runder++;
          emit('runde', 'ok', 'Runde ' + st.stats.runder + ' færdig', 'Autopiloten måler arealet og starter forfra, hvor der er sne.', 5);
          if (R.soc < 0.3) { apService('Batteriet er på ' + f0(R.soc * 100) + ' %. Det er bedre at lade nu end midt i næste runde.'); return; }
          nyRunde(); return;
        }
      }
    }
    goLane(pickY());
    if (AP.bid) emit('ap-bid', 'info', 'Mindre bid i snevolden', 'Volden er større, end drivlinjen kan skubbe, når skjoldet løber over. Banen lægges tættere på den forrige, så resten af volden ligger uden for hjulsporet.', 300);
  }
  function apStart(resume) {
    AP.on = true; AP.mode = 'ryd'; AP.koel = false; AP.back = 0; AP.stuck = 0; AP.stuckN = 0; AP.vf = 1; AP.vent = 0;
    if (!resume || !AP.seq.length || AP.y === undefined) { nyRunde(); return; }
    AP.pass = 0; AP.dir = R.x < 40 ? 1 : -1; AP.lane--; goLane(AP.y); // genoptag banen, den var i gang med
  }
  function apService(why) {
    AP.mode = 'service'; AP.why = why; AP.vent = 0; AP.koel = false;
    const iSt = R.x > STATION.x0 && R.x < STATION.x1 && R.y > STATION.y0 && R.y < STATION.y1;
    const legs = iSt ? [] : routeTo(R.x, R.y, 0.6, STATION.cy);
    legs.push({ x: STATION.cx, y: STATION.cy, blade: false });
    AP.q = legs; AP.anchor = { x: R.x, y: R.y };
    emit('ap-svc', 'info', 'Autopilot kører til værkstedet', why, 30);
  }
  const STOP = { v: 0, w: 0, blade: false };
  function apControl() {
    let wp, prev;
    if (AP.mode === 'station') return STOP;
    if (AP.back > 0) return { v: -0.3, w: 0, blade: false };
    if (AP.koel) return { v: 0, w: 0 };
    if (AP.q.length) { wp = AP.q[0]; prev = AP.anchor || { x: R.x, y: R.y }; }
    else {
      if (AP.mode === 'service') { AP.mode = 'station'; emit('ap-ank', 'info', 'Robotten holder på ladestationen', 'Åbn værkstedet med V eller knappen øverst.', 5); return STOP; }
      if (AP.vent > 0) return STOP;
      if (!AP.plan.length) { nyRunde(); return STOP; }
      if (AP.k >= AP.plan.length) { laneDone(); return STOP; }
      wp = AP.plan[AP.k]; prev = AP.k > 0 && !AP.anchor ? AP.plan[AP.k - 1] : (AP.anchor || { x: R.x, y: R.y });
    }
    const dx = wp.x - prev.x, dy = wp.y - prev.y, L = Math.hypot(dx, dy) || 1e-6, ex = dx / L, ey = dy / L;
    const t = clamp((R.x - prev.x) * ex + (R.y - prev.y) * ey, 0, L);
    const look = Math.min(L, t + 1.1), tx = prev.x + ex * look, ty = prev.y + ey * look;
    const dist = Math.hypot(wp.x - R.x, wp.y - R.y);
    if (dist < 0.3 || (t >= L - 0.05 && dist < 0.7)) {
      if (AP.q.length) { AP.q.shift(); AP.anchor = { x: wp.x, y: wp.y }; if (!AP.q.length && AP.mode !== 'ryd') AP.anchor = null; }
      else { AP.k++; AP.anchor = null; }
      return { v: 0, w: 0, blade: AP.q.length ? false : wp.blade !== false && R.down, ang: wp.ang };
    }
    const e = wrap(Math.atan2(ty - R.y, tx - R.x) - R.h);
    const w = clamp(2.4 * e, -0.9, 0.9);
    const fart = AP.q.length || !R.down ? Math.max(R.vSet, 1.0) : Math.min(R.vSet, Math.max(0.3, AP.vLane || 9)) * AP.vf;
    // med last på skjoldet kan robotten ikke dreje på stedet (kilen og skrubbet), så den kører en bue fremad i stedet
    const lastet = R.down && R.W > 0.25 * C.komp * C.Akile * R.plovH * 2 * Bh();
    let v = Math.abs(e) > (lastet ? 0.7 : 0.45) ? 0 : fart * Math.max(lastet ? 0.35 : 0.12, Math.cos(e) ** 6);
    if (dist < 1.2) v = Math.min(v, 0.25 + dist * 0.5);
    // med lastet skjold styres der kun så meget, at begge sider stadig kører fremad
    let wOut = w;
    if (lastet && v > 0) wOut = clamp(w, -1.6 * Math.max(v, 0.12), 1.6 * Math.max(v, 0.12));
    // ploven sænkes først, når robotten peger langs banen, og løftes ved skarpe drejninger, så kilen ikke slæbes rundt
    let blade = AP.q.length ? false : wp.blade !== false;
    if (blade && !R.down && Math.abs(e) > 0.3) blade = false;
    if (blade && R.down && Math.abs(e) > (lastet ? 0.55 : 0.9)) blade = false; // løft og læg kilen, så robotten kan rette op
    return { v, w: wOut, blade, ang: AP.q.length ? null : (wp.ang !== undefined ? wp.ang : null) };
  }

  // ---------- et fysik-skridt
  function step(dt, inp) {
    const m = C.m0 + R.ballast, Nn = m * g, Ns = Nn / 2;
    let vc = 0, wc = 0;
    if (AP.on && !R.dead) {
      if (AP.vent > 0) { AP.vent -= dt; if (AP.vent <= 0 && AP.mode === 'ryd') nyRunde(); }
      const c = apControl(); vc = c.v; wc = c.w;
      if (AP.back > 0) { AP.back -= dt; if (AP.back <= 0) { AP.stuck = 0; AP.anchor = { x: R.x, y: R.y }; } }
      else if ((Math.abs(vc) > 0.05 || Math.abs(wc) > 0.1) && Math.abs(R.v[0]) + Math.abs(R.v[1]) < 0.04) {
        AP.stuck += dt;
        if (AP.stuck > 8) {
          AP.stuck = 0; st.stats.fast = (st.stats.fast || 0) + 1;
          const sammeSted = AP.stuckP && Math.hypot(R.x - AP.stuckP.x, R.y - AP.stuckP.y) < 2.5;
          AP.stuckN = sammeSted ? AP.stuckN + 1 : 1; AP.stuckP = { x: R.x, y: R.y };
          if (AP.stuckN >= 5 || (AP.stuckN >= 3 && (AP.mode !== 'ryd' || !R.down))) {
            // kommer ikke fri med hævet plov: rullemodstanden i den dybe sne er større end drivlinjen kan give
            AP.on = false; AP.hjaelp = true; setBlade(false);
            emit('ap-hjaelp', 'crit', 'Robotten kan ikke komme fri', 'Den har siddet fast det samme sted ' + AP.stuckN + ' gange, også med hævet plov. Sneen under hjulene er ' + f0(Math.max(S[0].dd, S[1].dd) * 100) + ' cm dyb, og hver side kan højst trække ' + f0(Math.min(S[0].lim, S[1].lim)) + ' N. Tilkald bjærgning (B).', 1e9);
          } else if (AP.stuckN >= 3 && AP.mode === 'ryd' && AP.plan.length) {
            // samme sted tre gange: opgiv resten af banen med hævet plov og tag den igen i næste runde
            AP.stuckN = 0; AP.skip = true; setBlade(false); AP.k = AP.plan.length; AP.q = [];
            emit('ap-opgiv', 'warn', 'Autopiloten springer resten af banen over', 'Robotten har siddet fast det samme sted tre gange. Den kører videre til næste bane og tager stedet igen i næste runde.', 120);
          } else {
            AP.back = 2.5;
            emit('ap-fast', 'warn', 'Autopiloten sidder fast', 'Drivlinjen kan ikke levere kraften til manøvren. Den løfter ploven, bakker ud og prøver igen langsommere.', 60);
          }
          AP.vf = 0.4;
        }
      } else AP.stuck = Math.max(0, AP.stuck - dt);
      if (c.blade !== undefined && c.blade !== R.down) setBlade(c.blade);
      if (c.ang != null) R.angTarget = c.ang;
    } else if (!R.dead) {
      const wMax = inp.wMax || 0.9;
      vc = inp.fwd ? (inp.boost ? C.vMax : R.vSet) : inp.back ? -0.4 : 0;
      if (inp.turn) { wc = inp.turn * wMax; R.hLock = R.h; }
      else if (Math.abs(vc) > 0.01) wc = clamp(3 * wrap(R.hLock - R.h), -wMax, wMax);
      else R.hLock = R.h;
    }
    if (R.tire === 'kaede') vc = Math.min(vc, C.vKaede);
    if (S.some(s => s.bearing <= 0)) vc = clamp(vc, -0.3, 0.3);
    R.ang += clamp(R.angTarget - R.ang, -20 * dt, 20 * dt);

    const v = (R.v[0] + R.v[1]) / 2, om = (R.v[1] - R.v[0]) / C.spor;
    const P = plov(dt, v);
    const fx = Math.cos(R.h), fy = Math.sin(R.h), nx = -fy, ny = fx;
    let muSum = 0;
    for (let i = 0; i < 2; i++) {
      const sl = i === 0 ? 1 : -1; let mu = 0, dd = 0, worst = 0;
      for (const a of [1, -1]) {
        const u = underlag(R.x + fx * a * C.L / 2 + nx * sl * C.spor / 2, R.y + fy * a * C.L / 2 + ny * sl * C.spor / 2);
        mu += DAEK[R.tire].mu[u.u] / 2; dd += u.d / 2; worst = Math.max(worst, u.u);
      }
      S[i].mu = mu; S[i].surf = worst; S[i].dd = dd; muSum += mu / 2;
    }
    const Mturn = 0.4 * muSum * Nn * C.L / 4, Fturn = Mturn / C.spor; // skrub ved skid-steer: M = μ_t · N · L / 4
    const tw = Math.abs(om) > 0.004 ? Math.tanh(om / 0.25) : Math.tanh(wc / 0.25); // dækkenes sideslip bygger kraften op gradvist
    // Plovens drejemoment skal holdes af dækkenes sidegreb. Kører robotten ligeud, glider dækkene ikke sidelæns, så de
    // kan give statisk sidekraft: 4 hjul i ±L/2 giver højst μ·N·L/2, reduceret af den del af friktionscirklen,
    // som trækkraften bruger. Under drejning glider de, og så gælder skrub-modstanden Mturn.
    const uLong = clamp((Math.abs(S[0].F) + Math.abs(S[1].F)) / (muSum * Nn + 1e-6), 0, 1);
    const Mhold = muSum * Nn * C.L / 2 * Math.sqrt(1 - uLong * uLong);
    const Mres = Mhold + (Mturn - Mhold) * Math.min(1, Math.abs(tw));
    const MyEff = P.My * clamp(v / 0.05, 0, 1); // kilen giver kun moment, når robotten skubber den
    let Ptot = C.Phj + (R.saltOn ? 40 : 0), spinNow = false, slipNow = false;
    for (let i = 0; i < 2; i++) {
      const s = S[i], sg = i === 0 ? -1 : 1;
      const roll = (C.crr + 0.5 * Math.min(s.dd, 0.3)) * Ns + (s.bearing <= 0 ? 150 : s.bearing < 0.4 ? (0.4 - s.bearing) * 250 : 0);
      const Pi = roll + (v >= -0.02 ? P.F / 2 : 0);
      const Rt = sg * Fturn * tw, Ry = -sg * Math.sign(MyEff) * Math.max(0, Math.abs(MyEff) - Mres) / C.spor; // plovens drejemoment tages først af dækkenes sidegreb
      const vci = vc + sg * wc * C.spor / 2;
      const dirRef = Math.abs(R.v[i]) > 0.01 ? Math.sign(R.v[i]) : Math.sign(vci);
      const need = Pi * dirRef + Rt + Ry + clamp((m / 2) * (vci - R.v[i]) / 0.8, -150, 150);
      const clT = s.clutchWear >= 1 ? C.TglidSlidt : C.Tglid;
      const alive = s.motorOK && s.chainOK && s.shaftOK && R.soc > 0;
      const Fmot = alive ? C.Tpeak * C.itot * C.etaMek / C.r : 0;
      const Fcl = alive ? clT * C.iK * C.etaK / C.r : 0;
      const Ftr = s.mu * Ns;
      let lim = Math.min(Fmot, Fcl, Ftr), by = !alive ? 'dead' : lim === Ftr ? 'trac' : lim === Fcl ? 'clutch' : 'motor';
      let Fd = clamp(need, -lim, lim); const limited = Math.abs(need) > lim + 0.5 && Math.abs(vci) > 0.01;
      if (limited && by === 'trac') Fd = Math.sign(need) * s.mu * 0.85 * Ns;
      const Fo = Fd - Rt - Ry; let vn;
      if (Math.abs(R.v[i]) < 0.01 && Math.abs(Fo) <= Pi) vn = 0;
      else {
        const dir = Math.abs(R.v[i]) > 0.01 ? Math.sign(R.v[i]) : Math.sign(Fo);
        vn = R.v[i] + (Fo - Pi * dir) / (m / 2) * dt;
        if (Math.abs(R.v[i]) > 0.01 && Math.sign(vn) !== Math.sign(R.v[i]) && Math.abs(Fo) <= Pi) vn = 0;
      }
      vn = clamp(vn, -C.vMax, C.vMax);
      R.v[i] = vn;
      s.F = Fd; s.need = need; s.lim = lim; s.limBy = by; s.limited = limited;
      const Tmel = Math.abs(Fd) * C.r / (C.iK * C.etaK), Tm = Math.abs(Fd) * C.r / (C.itot * C.etaMek);
      s.Tmel = Tmel; s.Tm = Tm;
      const slipping = limited && (by === 'clutch' || by === 'trac');
      const wm = (slipping ? Math.max(Math.abs(vci), Math.abs(vn)) : Math.abs(vn)) / C.r * C.itot;
      s.Pel = alive ? Tm * wm / C.etaEl : 0; Ptot += s.Pel;
      // motorens temperatur: kobbertab ~ moment², dårligere køling ved lav fart
      if (s.motorOK) {
        const coolF = 1 + 0.6 * Math.max(0, 1 - wm / 120);
        const rise = 80 * (Tm / C.Tkont) ** 2 * coolF;
        s.temp += (st.w.T + rise - s.temp) * dt / 480;
        st.stats.maxTemp = Math.max(st.stats.maxTemp, s.temp);
        if (s.temp > 155) { s.motorOK = false; emit('motor-ud' + i, 'crit', 'Motoren i ' + SIDE[i] + ' side er brændt af',
          'Viklingerne nåede 155 °C. Den har leveret ' + f2(Tm) + ' Nm mod 1,5 Nm kontinuerligt i for lang tid. Robotten kan kun trække i den anden side. Kør til værkstedet, eller tilkald bjærgning (B).', 1e9); }
        else if (s.temp > 140) emit('motor-k' + i, 'crit', 'Motor ' + SIDE[i] + ': ' + f0(s.temp) + ' °C', 'Viklingerne brænder af ved 155 °C. Sænk lasten nu: mindre plovvinkel, smallere bid eller stop og lad den køle.', 60);
        else if (s.temp > 120) emit('motor-w' + i, 'warn', 'Motor ' + SIDE[i] + ' bliver varm', f0(s.temp) + ' °C. Den kører ' + f2(Tm) + ' Nm, og den tåler 1,5 Nm kontinuerligt. Varmen stiger med momentet i anden potens.', 120);
      } else s.temp += (st.w.T - s.temp) * dt / 900;
      if (limited && by === 'clutch') {
        slipNow = true;
        const dw = Math.max(0, Math.abs(vci) - Math.abs(vn)) / C.r * C.iK;
        s.clutchWear += clT * Math.max(dw, 0.4) * dt / 150000 * DIFF.slid;
        if (s.clutchWear >= 1 && !s.warned.cl) { s.warned.cl = true; emit('kob' + i, 'crit', 'Slipkoblingen i ' + SIDE[i] + ' side er slidt op',
          'Lamellerne er brændt. Den glider nu allerede ved 18 Nm i stedet for 36 Nm, så siden kan kun trække det halve. Udskift lamellerne på værkstedet.', 1e9); }
        else emit('slip' + i, 'warn', 'Slipkoblingen glider', SIDE[i][0].toUpperCase() + SIDE[i].slice(1) + ' side skal bruge ' + f0(Math.abs(need)) + ' N, men koblingen glider ved ' + f0(Fcl) + ' N (' + clT + ' Nm på mellemakslen). Plovkraften er ' + f0(P.F) + ' N. Bak ud og tag en mindre bid.', 90);
      }
      if (limited && by === 'trac') {
        spinNow = true;
        const name = UNDERLAG[s.surf].toLowerCase();
        emit('spin' + i, 'warn', 'Hjulspin i ' + SIDE[i] + ' side', 'Siden skal bruge ' + f0(Math.abs(need)) + ' N, men friktionen giver højst μ · N = ' + f2(s.mu) + ' · ' + f0(Ns) + ' N = ' + f0(Ftr) + ' N på ' + name + '. ' +
          (s.surf === 2 ? 'Pigdæk (0,20) eller kæder (0,25) giver mere greb på is. Salt fjerner isen.' : 'Mindre plovvinkel, lavere fart eller mere ballast hjælper.'), 90);
      }
      const revs = Math.abs(vn) * dt / (TAU * C.r) * C.iK;
      if (Tmel > 0.6 * C.Te && s.shaftOK) {
        s.shaftD += Math.pow(Tmel / C.Te, 12) * revs * 150e-6 * DIFF.slid;
      }
      if (s.shaftOK && s.shaftD >= 1) { s.shaftOK = false; emit('aksel' + i, 'crit', 'Mellemakslen i ' + SIDE[i] + ' side er knækket',
        'Udmattelsesbrud ved kædehjulssædet (Ø22). Langvarig drift tæt på glidemomentet har brugt levetiden op, selvom hver enkelt belastning var under brudgrænsen. Siden trækker ikke mere.', 1e9); }
      else if (s.shaftD > 0.7 && !s.warned.ax) { s.warned.ax = true; emit('akselw' + i, 'warn', 'Mellemaksel ' + SIDE[i] + ': 70 % af levetiden brugt', 'Miners regel: skaden summeres for hver omdrejning over udmattelsesgrænsen. Kør med mindre last, eller udskift akslen.', 1e9); }
      const Prel = (m / 351.3) * (1 + 0.5 * Tmel / 27);
      if (s.bearing > 0) { s.bearing -= 3.24e-6 * Prel ** 3 * revs * DIFF.slid;
        if (s.bearing <= 0) emit('leje' + i, 'crit', 'Lejehavari i ' + SIDE[i] + ' side', 'Lejet er kørt i stykker. Rullemodstanden er steget kraftigt, og farten er begrænset til 0,3 m/s. Udskift lejerne.', 1e9);
        else if (s.bearing < 0.3 && !s.warned.lj) { s.warned.lj = true; emit('lejew' + i, 'warn', 'Lejerne i ' + SIDE[i] + ' side larmer', 'Under 30 % levetid tilbage. Levetiden falder med lasten i tredje potens (L10).', 1e9); } }
      if (s.chainOK) { s.chain += 7.3e-5 * (Tmel / 27) ** 2 * revs * DIFF.slid;
        if (s.chain >= 3) { s.chainOK = false; emit('kaede' + i, 'crit', 'Kæden er sprunget af i ' + SIDE[i] + ' side', 'Kæden er længet 3 % og springer over tænderne. Stram eller udskift den på værkstedet.', 1e9); }
        else if (s.chain > 2.2 && !s.warned.kd) { s.warned.kd = true; emit('kaedew' + i, 'warn', 'Kæden i ' + SIDE[i] + ' side er længet ' + f1(s.chain) + ' %', 'Ved 3 % springer den over tænderne.', 1e9); } }
    }
    if (spinNow) st.stats.spin += dt; if (slipNow) st.stats.slip += dt; if (P.over > 0) st.stats.over += dt;
    if (AP.on) {
      // overlast-regulator: glider koblingen, eller er motoren på maks., sænkes farten, så slip og varme falder
      const ov = R.down && S.some(s => s.limited && s.limBy !== 'dead');
      AP.vf = ov ? Math.max(0.35, AP.vf - 0.5 * dt) : Math.min(1, AP.vf + 0.04 * dt);
      // termisk beskyttelse: stop og lad viklingerne køle, før de når 155 °C
      const Tmax = Math.max(S[0].temp, S[1].temp);
      if (!AP.koel && Tmax > 135 && AP.mode !== 'station') { AP.koel = true; emit('ap-koel', 'warn', 'Autopiloten holder pause', 'Motoren er ' + f0(Tmax) + ' °C. Robotten står stille, til viklingerne er under 100 °C.', 300); }
      else if (AP.koel && Tmax < 100) AP.koel = false;
      if (spinNow && S.some(s => s.limBy === 'trac' && s.surf === 2)) AP.spinIs += dt; else AP.spinIs = Math.max(0, AP.spinIs - dt * 0.2);
    }
    if (P.over > 0.001 && P.Wmax > 0) emit('over', 'info', 'Skjoldet løber over', 'Sneen kommer ind hurtigere, end den glider af skjoldet. Kapaciteten er ' + f1(P.hkap * 100) + ' cm ved ' + f0(Math.abs(R.ang)) + '°, og der kommer ' + f1(P.hInd * 100) + ' cm ind. Øg vinklen, eller kør igen bagefter.', 120);
    if (P.vold) emit('vold', 'warn', 'Snevolden er fuld', 'Kanten er over 1 m høj, så ploven kan ikke kaste mere derover. Sneen falder tilbage i banen. Skub den mod depotet i enden af arealet.', 150);
    if (S.some(s => s.surf === 2) && DAEK[R.tire].mu[2] < 0.2) emit('is', 'warn', 'Hjulene står på is', DAEK[R.tire].navn + ' giver kun μ = ' + f2(DAEK[R.tire].mu[2]) + ' på is. Robotten kan højst trække ' + f0(DAEK[R.tire].mu[2] * Nn) + ' N i alt. Skift dæk, eller salt først.', 240);

    // batteri
    const E = Ptot * dt; st.stats.kWh += E / 3.6e6;
    R.soc -= E / (C.Ebatt * 3.6e6 * kT() * DIFF.batt);
    if (R.soc <= 0 && !R.dead) { R.soc = 0; R.dead = true; emit('flad', 'crit', 'Batteriet er fladt', 'Robotten står stille. Tilkald bjærgning (B) for at komme til ladestationen.', 1e9); }
    else if (R.soc < 0.12) emit('bat12', 'crit', 'Batteriet er under 12 %', 'Kør til ladestationen nu.', 600);
    else if (R.soc < 0.25) emit('bat25', 'warn', 'Batteriet er under 25 %', 'Kulden tager ' + f0((1 - kT()) * 100) + ' % af kapaciteten. Planlæg turen til ladestationen.', 900);

    // bevægelse
    const vN = (R.v[0] + R.v[1]) / 2, omN = (R.v[1] - R.v[0]) / C.spor;
    R.h = wrap(R.h + omN * dt); R.x += Math.cos(R.h) * vN * dt; R.y += Math.sin(R.h) * vN * dt;
    st.stats.dist += Math.abs(vN) * dt;
    kollision(vN);

    // autopilotens saltstyring: spred kun på arealet, hvor der er is eller underafkølet regn og for lidt salt i forvejen
    if (AP.on && !R.dead) {
      AP.saltOdo += Math.abs(vN) * dt;
      if (AP.saltOdo > 1 || AP.mode !== 'ryd') {
        AP.saltOdo = 0;
        const id = cellAt(R.x, R.y);
        R.saltOn = AP.mode === 'ryd' && AP.wantSalt && R.saltKg > 0 && id >= 0 && zone[id] === 0 && (st.w.is > 0 || ice[id] > 0.1) && salt[id] < 8;
      }
    }
    // salt
    if (R.saltOn && R.saltKg > 0 && vN > 0.05) {
      const bx = R.x - Math.cos(R.h) * 0.75, by = R.y - Math.sin(R.h) * 0.75, nxs = -Math.sin(R.h), nys = Math.cos(R.h);
      stamp++;
      for (let k = 0; k <= 10; k++) { const t = -1 + k / 5, id = cellAt(bx + nxs * t, by + nys * t); if (id < 0 || mark[id] === stamp) continue; mark[id] = stamp; salt[id] += 15 * vN * dt / cell; }
      const kg = 15 * 2 * vN * dt / 1000; R.saltKg = Math.max(0, R.saltKg - kg); st.stats.saltKg += kg;
      if (R.saltKg <= 0) emit('salttom', 'warn', 'Saltet er brugt op', 'Fyld på værkstedet.', 1e9);
    }
    if (st.w.T < -10 && R.saltOn) emit('saltkold', 'info', 'Salt virker dårligt under −10 °C', 'Natriumklorid smelter næsten ikke is ved den temperatur.', 600);

    // autopilot: hvornår skal den til værkstedet
    if (AP.on && AP.mode === 'ryd' && !R.dead) {
      const dSt = Math.hypot(R.x - STATION.cx, R.y - STATION.cy);
      const broken = S.some(s => s.bearing < 0.05 || s.clutchWear >= 1 || s.chain > 2.6 || s.shaftD > 0.85);
      // is: salt virker over −10 °C; dæk med μ under 0,20 på is kan ikke trække plovkraften
      // sne: dæk med μ under 0,25 på sne kan ikke trække en fuld kile (μ·N < kilekraft/2 + rullemodstand)
      const isNu = st.w.is > 0, isAndel = st.isAndel || 0, mu = DAEK[R.tire].mu;
      const isKrav = isNu || isAndel > 0.05 || AP.spinIs > 6, sneKrav = st.w.sne > 0 || st.ryddet < 0.8;
      AP.wantSalt = saltVirker() && (isNu || isAndel > 0.01);
      AP.wantTire = isKrav && mu[2] < 0.2 ? 'pig' : sneKrav && mu[1] < 0.25 ? 'vinter' : null;
      if (R.soc < 0.10 + dSt * 0.0012) apService('Batteriet er ved at være fladt (' + f0(R.soc * 100) + ' %).');
      else if (broken) apService('Drivlinjen skal på værkstedet.');
      else if (AP.wantTire && st.t - AP.tireAsked > 3600) { AP.tireAsked = st.t;
        const u = AP.wantTire === 'pig' ? 2 : 1;
        apService((u === 2 ? 'Der er is på arealet. ' : 'Der er sne på arealet. ') + DAEK[R.tire].navn + ' giver kun μ = ' + f2(DAEK[R.tire].mu[u]) + ' på ' + UNDERLAG[u].toLowerCase() + ', så hver side kan højst trække ' + f0(DAEK[R.tire].mu[u] * Ns) + ' N. ' + DAEK[AP.wantTire].navn + ' giver μ = ' + f2(DAEK[AP.wantTire].mu[u]) + '.'); }
      else if (AP.wantSalt && R.saltKg <= 0.5) apService('Saltet er brugt op, og der er stadig is på arealet.');
    }
    if (AP.on && S.some(s => !s.motorOK || !s.shaftOK || !s.chainOK) && AP.mode !== 'station') {
      AP.on = false; emit('ap-stop', 'crit', 'Autopiloten er slået fra', 'Den ene side trækker ikke, så robotten kan ikke holde kursen. Kør selv langsomt til værkstedet, eller tilkald bjærgning (B).', 1e9);
    }
    st.live = { P, Fturn: Fturn * Math.abs(tw), v: vN, om: omN, Nn, m, Ptot };
  }

  function kollision(vN) {
    const fx = Math.cos(R.h), fy = Math.sin(R.h), nx = -fy, ny = fx;
    const a = Math.abs(R.ang) * D2R, s = R.ang >= 0 ? 1 : -1;
    const ux = s * nx * Math.cos(a) - fx * Math.sin(a), uy = s * ny * Math.cos(a) - fy * Math.sin(a);
    const cx = R.x + fx * C.plovX, cy = R.y + fy * C.plovX;
    const pts = [[R.x + fx * 0.6 + nx * 0.53, R.y + fy * 0.6 + ny * 0.53], [R.x + fx * 0.6 - nx * 0.53, R.y + fy * 0.6 - ny * 0.53],
      [R.x - fx * 0.6 + nx * 0.53, R.y - fy * 0.6 + ny * 0.53], [R.x - fx * 0.6 - nx * 0.53, R.y - fy * 0.6 - ny * 0.53],
      [cx + ux * 0.7, cy + uy * 0.7, 1], [cx - ux * 0.7, cy - uy * 0.7, 1], [cx, cy, 1]];
    let pushX = 0, pushY = 0, hitPlov = false, hit = false, kant = false;
    for (const p of pts) {
      let px = 0, py = 0;
      if (p[0] < X0) px = X0 - p[0]; if (p[0] > X0 + NX * cell) px = X0 + NX * cell - p[0];
      if (p[1] < Y0) py = Y0 - p[1]; if (p[1] > Y0 + NY * cell) py = Y0 + NY * cell - p[1];
      for (const o of OER) {
        const dx = p[0] - o.x, dy = p[1] - o.y, d = Math.hypot(dx, dy);
        if (d < o.r) { const pen = o.r - d; px += dx / (d || 1) * pen; py += dy / (d || 1) * pen; kant = true; }
      }
      if (px || py) { hit = true; if (p[2]) hitPlov = true; if (Math.abs(px) > Math.abs(pushX)) pushX = px; if (Math.abs(py) > Math.abs(pushY)) pushY = py; }
    }
    if (!hit) return;
    R.x += pushX * 1.05; R.y += pushY * 1.05;
    const vi = Math.abs(vN); R.v[0] = R.v[1] = 0;
    if (vi > 0.3) {
      st.stats.stoed++;
      const worn = S.some(s => s.clutchWear >= 1);
      for (const s of S) s.shaftD += (worn ? 0.3 : 0.02) * vi * vi * DIFF.slid;
      if (hitPlov && vi > 0.5) R.plovH = Math.max(0.4, R.plovH - (vi - 0.5) * 0.5);
      const F = Math.min(6100, (C.m0 + R.ballast) * vi / 0.05);
      emit('stoed', worn ? 'crit' : 'warn', kant ? 'Stød mod kantsten' : 'Stød mod hegnet', 'Robotten ramte ved ' + f1(vi) + ' m/s. Stødkraften var op til ca. ' + f1(F / 1000) + ' kN. ' +
        (worn ? 'Slipkoblingen er slidt, så stødet gik direkte ind i mellemakslen.' : 'Slipkoblingen gled og tog toppen af stødet.') + (hitPlov && vi > 0.5 ? ' Plovskjoldet er bøjet, så det kaster dårligere.' : ''), 20);
    }
  }

  function setBlade(down) {
    if (!down && R.down && R.W > 0) {
      const fx = Math.cos(R.h), fy = Math.sin(R.h);
      for (let k = 0; k < 8; k++) { const t = -0.5 + k / 7; spreadAt(R.x + fx * (C.plovX + 0.15) - fy * C.B * t, R.y + fy * (C.plovX + 0.15) + fx * C.B * t, R.W / 8); }
      R.W = 0;
    }
    R.down = down;
  }

  function vejrSkridt(dt) {
    const w = weather(st.t / 3600); st.w = w;
    if (w.k !== st.fase) {
      if (st.fase >= 0) emit('fase' + w.k, w.is > 0 ? 'warn' : 'info', 'Vejret skifter: ' + w.navn.toLowerCase(),
        (w.is > 0 ? 'Regnen fryser på asfalten. Salt den, og overvej pigdæk eller kæder.' : w.sne > 0 ? 'Der falder ' + f1(w.sne) + ' cm i timen ved ' + f0(w.T) + ' °C.' : 'Det klarer op. Temperaturen falder mod ' + f0(sc.faser[w.k].T) + ' °C.'), 1e9);
      st.fase = w.k;
    }
    const dtH = dt / 3600, sne = w.sne / 100 * dtH, isR = w.is * dtH, T = w.T, virker = T > -10;
    const smelt = T > 0.5 ? 0.003 * (T - 0.5) * dtH : 0;
    let ryd = 0, nGlat = 0;
    for (let id = 0; id < NC; id++) {
      const z = zone[id];
      if (z === 3) { depth[id] = Math.max(0, depth[id] - 0.3 * dtH); ice[id] = 0; continue; }
      let d = depth[id] + sne * fallMul[id], s = salt[id], c = ice[id];
      if (smelt > 0 && d > 0) d = Math.max(0, d - smelt);
      if (isR > 0) { if (s > 4 && virker) s -= isR * 6; else c += isR * fallMul[id]; }
      if (s > 4 && virker) {
        if (c > 0) { const q = Math.min(c, 1.2 * dtH * s / 15); c -= q; s -= q * 6; }
        if (d > 0) { const q = Math.min(d, 0.004 * dtH * s / 15); d -= q; s -= q * 300; }
      }
      s -= s * dtH / 4; if (s < 0) s = 0;
      depth[id] = d; ice[id] = c; salt[id] = s;
      if (z === 0) { const glat = c > 0.3 && (s < 4 || !virker); if (glat) nGlat++; if (d < 0.015 && !glat) ryd++; }
    }
    st.ryddet = ryd / nArea; st.isAndel = nGlat / nArea;
    if (!st.hist.length || st.t - st.hist[st.hist.length - 1].t >= 300) st.hist.push({ t: st.t, r: st.ryddet });
  }

  // vejret på hele gitteret (71.300 celler) er den dyre del, så det samles op og køres højst hvert 2. spilsekund
  let wAcc = 0;
  const flushVejr = () => { if (wAcc > 0) { const a = wAcc; wAcc = 0; vejrSkridt(a); } };
  function advance(dtG, inp) {
    if (st.ended) return;
    dtG = Math.min(dtG, st.slut - st.t);
    const n = Math.max(1, Math.ceil(dtG / 0.05)), h = dtG / n;
    for (let k = 0; k < n; k++) { step(h, inp); st.t += h; }
    wAcc += dtG;
    if (wAcc >= 2 || st.t >= st.slut - 1e-6) flushVejr();
    if (st.t >= st.slut - 1e-6) { st.ended = true; st.hist.push({ t: st.t, r: st.ryddet }); }
  }
  function idle(sec) {
    flushVejr();
    let rest = Math.min(sec, st.slut - st.t);
    while (rest > 0) {
      const c = Math.min(60, rest); st.t += c; vejrSkridt(c); rest -= c;
      for (const s of S) s.temp += (st.w.T - s.temp) * Math.min(1, c / 480);
    }
    if (st.t >= st.slut - 1e-6) { st.ended = true; st.hist.push({ t: st.t, r: st.ryddet }); }
  }
  const inStation = () => R.x > STATION.x0 && R.x < STATION.x1 && R.y > STATION.y0 && R.y < STATION.y1 && Math.abs((R.v[0] + R.v[1]) / 2) < 0.15;

  // ---------- værksted
  function vaerkListe() {
    const L = [];
    const kwhMangler = (1 - R.soc) * C.Ebatt * kT() * DIFF.batt;
    const min100 = Math.ceil(kwhMangler / (C.Plad / 1000) * 60);
    L.push({ id: 'lad100', grp: 'Batteri', navn: 'Oplad til 100 %', min: min100, kr: 0, st: f0(R.soc * 100) + ' % nu', dis: R.soc > 0.995, need: R.soc < 0.35, soon: R.soc < 0.6 });
    L.push({ id: 'lad30', grp: 'Batteri', navn: 'Oplad i 30 min', min: 30, kr: 0, st: '+' + f0(Math.min(1 - R.soc, 0.75 / (C.Ebatt * kT() * DIFF.batt)) * 100) + ' %', dis: R.soc > 0.995 });
    for (const k of Object.keys(DAEK)) L.push({ id: 'daek-' + k, grp: 'Dæk', navn: DAEK[k].navn, min: 12, kr: 0, st: 'μ ' + DAEK[k].mu.map(f2).join(' / ') + (AP.wantTire === k && R.tire !== k ? ' · anbefalet: is på arealet' : ''), dis: R.tire === k, cur: R.tire === k, need: AP.wantTire === k && R.tire !== k });
    for (let i = 0; i < 2; i++) {
      const s = S[i], Sd = i ? 'H' : 'V';
      L.push({ id: 'motor-' + i, grp: 'Drivlinje', navn: 'Ny motor ' + Sd, min: 35, kr: 3200, st: s.motorOK ? f0(s.temp) + ' °C, virker' : 'brændt af', need: !s.motorOK });
      L.push({ id: 'kob-' + i, grp: 'Drivlinje', navn: 'Nye lameller i slipkobling ' + Sd, min: 20, kr: 450, st: f0(Math.min(1, s.clutchWear) * 100) + ' % slidt', need: s.clutchWear >= 1, soon: s.clutchWear > 0.6 });
      L.push({ id: 'aksel-' + i, grp: 'Drivlinje', navn: 'Ny mellemaksel ' + Sd, min: 45, kr: 900, st: s.shaftOK ? f0(Math.min(1, s.shaftD) * 100) + ' % af levetiden brugt' : 'knækket', need: !s.shaftOK || s.shaftD > 0.85, soon: s.shaftD > 0.6 });
      L.push({ id: 'leje-' + i, grp: 'Drivlinje', navn: 'Nye lejer ' + Sd, min: 25, kr: 360, st: f0(Math.max(0, s.bearing) * 100) + ' % levetid tilbage', need: s.bearing < 0.05, soon: s.bearing < 0.35 });
      L.push({ id: 'stram-' + i, grp: 'Drivlinje', navn: 'Stram kæde ' + Sd, min: 6, kr: 0, st: 'længet ' + f1(s.chain) + ' %', need: !s.chainOK || s.chain > 2.6, soon: s.chain > 2, dis: s.chain < 0.3 });
      L.push({ id: 'kaede-' + i, grp: 'Drivlinje', navn: 'Ny kæde ' + Sd, min: 15, kr: 320, st: 'længet ' + f1(s.chain) + ' %', need: !s.chainOK && s.chain > 3.5 });
    }
    L.push({ id: 'plov', grp: 'Plov og salt', navn: 'Ret plovskjoldet ud', min: 15, kr: 0, st: f0(R.plovH * 100) + ' % kapacitet', dis: R.plovH > 0.99, soon: R.plovH < 0.9 });
    L.push({ id: 'salt', grp: 'Plov og salt', navn: 'Fyld salt', min: 5, kr: Math.round((C.saltMax - R.saltKg) * 4), st: f0(R.saltKg) + ' af ' + C.saltMax + ' kg' + (AP.wantSalt ? ' · der er is på arealet' : ''), dis: R.saltKg > C.saltMax - 0.5, need: AP.wantSalt && R.saltKg < C.saltMax / 2, soon: R.saltKg < 20 });
    for (const b of [0, 50, 100]) L.push({ id: 'ballast-' + b, grp: 'Plov og salt', navn: b ? 'Ballast +' + b + ' kg' : 'Ingen ballast', min: 8, kr: 0, st: b ? 'mere greb, mere slid' : 'let og sparsom', dis: R.ballast === b, cur: R.ballast === b });
    return L;
  }
  function vaerk(id) {
    const it = vaerkListe().find(x => x.id === id); if (!it || it.dis) return null;
    const [a, b] = id.split('-'), i = +b;
    if (a === 'lad100') { idle(it.min * 60); R.soc = 1; R.dead = false; }
    else if (a === 'lad30') { idle(1800); R.soc = Math.min(1, R.soc + 0.75 / (C.Ebatt * kT() * DIFF.batt)); R.dead = false; }
    else {
      idle(it.min * 60);
      if (a === 'daek') R.tire = b;
      else if (a === 'motor') { S[i].motorOK = true; S[i].temp = st.w.T + 5; }
      else if (a === 'kob') { S[i].clutchWear = 0; S[i].warned.cl = false; }
      else if (a === 'aksel') { S[i].shaftD = 0; S[i].shaftOK = true; S[i].warned.ax = false; }
      else if (a === 'leje') { S[i].bearing = 1; S[i].warned.lj = false; }
      else if (a === 'stram') { S[i].chain = Math.max(0, S[i].chain - 1.5); S[i].chainOK = S[i].chain < 3; S[i].warned.kd = false; }
      else if (a === 'kaede') { S[i].chain = 0; S[i].chainOK = true; S[i].warned.kd = false; }
      else if (a === 'plov') R.plovH = 1;
      else if (a === 'salt') R.saltKg = C.saltMax;
      else if (a === 'ballast') R.ballast = i;
    }
    for (const k of Object.keys(cool)) if (/^(motor|kob|aksel|leje|kaede|flad|bat|salttom)/.test(k)) delete cool[k];
    st.kr += it.kr; st.vaerkMin += it.min; st.repairs.push({ navn: it.navn, min: it.min, kr: it.kr, t: st.t });
    return it;
  }
  function bjaerg() {
    if (inStation()) return null;
    const d = Math.hypot(R.x - STATION.cx, R.y - STATION.cy), min = Math.round(15 + d / 8);
    setBlade(false); idle(min * 60);
    R.x = STATION.cx; R.y = STATION.cy; R.h = 0; R.v = [0, 0]; R.hLock = 0;
    st.kr += 1200; st.vaerkMin += min; st.stats.bjaerg++; st.repairs.push({ navn: 'Bjærgning', min, kr: 1200, t: st.t });
    if (AP.on) { AP.mode = 'station'; AP.q = []; }
    return { min, kr: 1200 };
  }
  function setAuto(on) {
    if (!on) { AP.on = false; R.hLock = R.h; return; }
    AP.hjaelp = false; AP.stuckN = 0; AP.stuckP = null; delete cool['ap-hjaelp'];
    if (S.some(s => !s.motorOK || !s.shaftOK || !s.chainOK) || R.dead) { emit('ap-nej', 'warn', 'Autopiloten kan ikke starte', 'Drivlinjen eller batteriet skal på værkstedet først.', 3); return; }
    apStart(AP.plan.length > 0);
  }
  return { C, st, R, S, AP, OER, STATION, DAEK, grid: { depth, ice, salt, zone, NX, NY, X0, Y0, cell, nArea }, advance, idle, vaerkListe, vaerk, bjaerg, setAuto, setBlade, inStation,
    rho, kT, sc };
}
// SIM-END
