/* ============================================================
   scene.js — Interaktive 3D-scener (Three.js — KLASSISK script)
   Delt rig brugt af slide 2 (SCENARIE A) og slide 4 (SCENARIE B).

   SCENARIE A (problem):  Operatøren sidder bøjet over mikroskopet.
     En LØS udsugningsslange ligger på bordet og fanger KUN en del
     af dampen (forkert placeret / for langt væk). Resten stiger op
     i ansigtet → hovedet lyser advarsels-rødt. Lav indfangning.

   SCENARIE B (løsning):  Udsugningen er INDBYGGET i mikroskoparmen
     lige ved kilden. Dampen suges op gennem armen og ud i en ekstern
     udsugningskanal. Op til 95% indfanges → ansigtet forbliver frit.

   ROBUST: global THREE fra assets/vendor/three.min.js (UMD), så det
   virker offline OG via file:// (dobbeltklik). Ingen ES-moduler/CDN.
   ============================================================ */
(function () {
'use strict';
if (!window.THREE) { console.error('three.min.js ikke loaded'); return; }
const THREE = window.THREE;

const PARTICLE_COUNT = 900;
const MISS_RATE = 0.05;          // andel der slipper forbi det indbyggede indsug (scenarie B)
const TABLE_CATCH_RATE = 0.27;   // andel den løse bordslange faktisk fanger (scenarie A) — resten stiger op

const COL = {
  accent: new THREE.Color('#2f8fe0'),
  danger: new THREE.Color('#ff5a4d'),
  safe:   new THREE.Color('#28d6a0'),
  smoke:  new THREE.Color('#aebccf'),
};

// Nøglepunkter (meter-agtige enheder). Operatøren sidder bøjet ind mod okularet.
const SOURCE = new THREE.Vector3(0.05, 0.05, 0.16);   // loddested på PCB under objektivet
const HEAD   = new THREE.Vector3(0.05, 0.60, 0.60);   // ansigt ved okularet (bøjet ind)
const ARM_INTAKE = new THREE.Vector3(0.05, 0.26, 0.17); // indbygget indsug ved objektivet (B)
const ARM_EXIT   = new THREE.Vector3(-0.55, 0.40, -0.48); // internt udløb nede i posten (B)

// orientér en cylinders/kegles lokale +Y-akse langs en retning (til kegle-mund)
function alignYTo(mesh, dir) {
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
}

// byg et arm-segment (cylinder) mellem to punkter
function makeSegment(a, b, r, mat) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 18), mat);
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return m;
}

// VALGFRI ægte CAD: læg din Autodesk-eksport her → den erstatter den procedurelle arm.
// Prøver .glb (med farver) først, ellers .stl (nemt fra Fusion: ét mesh).
// Finjustér scale/pos/rot hvis modellen ikke flugter med røg-kilden.
const MODEL = {
  glb: 'assets/models/microscope_arm.glb',
  stl: 'assets/models/microscope_arm.stl',
  scale: 1.7,                       // største dimension i scene-enheder
  pos: new THREE.Vector3(0.0, 0.45, 0.10),
  rotXglb: 0,
  rotXstl: -Math.PI / 2,            // Fusion-STL er typisk Z-up → drej til Y-up
};
const TABLE_INTAKE = new THREE.Vector3(-0.32, 0.06, 0.34); // løs slange på bordet (A) — offset

function makeSpriteTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
const SPRITE = makeSpriteTexture();

class VentScene {
  constructor(stage) {
    this.stage = stage;
    this.canvas = stage.querySelector('[data-canvas]');
    this.loadingEl = stage.querySelector('[data-loading]');
    this.mode = stage.dataset.scene === 'solution' ? 'solution' : 'problem';
    this.badge = stage.querySelector('.scene-badge');
    this.active = false;
    this.headPulse = 0;
    this.target = new THREE.Vector3(0.0, 0.42, 0.12);
    this.radius = 2.9; this.theta = 0.72; this.phi = 1.1;
    this.autoRotate = true; this.dragging = false;

    this._initRenderer();
    this._initLights();
    this._buildDesk();
    this._buildMicroscope();
    this._buildOperator();
    this._buildExtraction();
    this._initParticles();
    this._loadModel();
    this._bindControls();
    this._observe();
    this._bindResize();
    this.setMode(this.mode);
    this._updateCamera();
    this._hideLoading();
  }

  _loadModel() {
    // .glb (med materialer) → ellers .stl (nemt fra Fusion) → ellers procedural
    if (window.THREE && THREE.GLTFLoader) {
      new THREE.GLTFLoader().load(MODEL.glb,
        (gltf) => this._placeModel(gltf.scene, MODEL.rotXglb),
        undefined,
        () => this._trySTL());
    } else {
      this._trySTL();
    }
  }

  _trySTL() {
    if (!(window.THREE && THREE.STLLoader)) return;
    new THREE.STLLoader().load(MODEL.stl,
      (geo) => {
        geo.computeVertexNormals();
        const mat = new THREE.MeshStandardMaterial({ color: 0x223044, roughness: 0.5, metalness: 0.55 });
        this._placeModel(new THREE.Mesh(geo, mat), MODEL.rotXstl);
      },
      undefined,
      () => { /* ingen model → behold procedural */ });
  }

  _placeModel(obj, rotX) {
    obj.rotation.x = rotX || 0;
    obj.updateMatrixWorld(true);
    let box = new THREE.Box3().setFromObject(obj);
    const maxDim = Math.max(...box.getSize(new THREE.Vector3()).toArray()) || 1;
    obj.scale.setScalar(MODEL.scale / maxDim);
    obj.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    obj.position.set(MODEL.pos.x - center.x, MODEL.pos.y - center.y, MODEL.pos.z - center.z);
    this.scene.add(obj);
    // skjul procedural arm + hvid elbow, så KUN din CAD vises
    if (this.scopeRig) this.scopeRig.visible = false;
    if (this.elbowGroup) this.elbowGroup.visible = false;
    this._model = obj;
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, this._aspect(), 0.1, 100);
    this._resize();
  }

  _initLights() {
    const s = this.scene;
    s.add(new THREE.AmbientLight(0x9fb2c9, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.15); key.position.set(2.4, 3.2, 2.2); s.add(key);
    const rim = new THREE.PointLight(0x2f8fe0, 1.1, 16); rim.position.set(-2.2, 1.6, 1.8); s.add(rim);
    const fill = new THREE.DirectionalLight(0x6fa8d6, 0.35); fill.position.set(-1, 1, -2); s.add(fill);
  }

  _buildDesk() {
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x123150, roughness: 0.92, metalness: 0.08 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 1.7), deskMat);
    desk.position.set(0, -0.04, 0.25); this.scene.add(desk);
    // PCB / arbejdsemne under objektivet
    const pcb = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.02, 0.24),
      new THREE.MeshStandardMaterial({ color: 0x1c5e3a, roughness: 0.6 })
    );
    pcb.position.set(SOURCE.x, 0.02, SOURCE.z); this.scene.add(pcb);
    // glødende loddested
    const src = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffbb66, emissive: 0xff7722, emissiveIntensity: 2.0 })
    );
    src.position.copy(SOURCE); this.scene.add(src);
  }

  _buildMicroscope() {
    // Leica-scope på en SORT LEDDELT BOM-ARM med internt udsugningskanal,
    // hvidt cradle-beslag, stål-bordbeslag bagved. (Jf. brugerens Autodesk-render.)
    const g = new THREE.Group();
    const black = new THREE.MeshStandardMaterial({ color: 0x16191d, roughness: 0.5, metalness: 0.55 });
    const steel = new THREE.MeshStandardMaterial({ color: 0xc2c8cf, roughness: 0.3, metalness: 0.9 });
    const white = new THREE.MeshStandardMaterial({ color: 0xe9edf1, roughness: 0.55, metalness: 0.12 });

    const postBase = new THREE.Vector3(-0.55, 0.10, -0.48);
    const postTop  = new THREE.Vector3(-0.55, 0.56, -0.48);
    const j2       = new THREE.Vector3(-0.05, 0.56, -0.10);
    const scopeTop = new THREE.Vector3(0.05, 0.50, 0.12);

    // bordbeslag + stålplade bagved
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.12, 0.24), black);
    base.position.set(-0.55, 0.06, -0.48); g.add(base);
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.28, 0.02), steel);
    plate.position.set(-0.55, 0.22, -0.36); g.add(plate);

    // leddelt arm (sorte segmenter + drejeled)
    g.add(makeSegment(postBase, postTop, 0.05, black));
    const jA = new THREE.Mesh(new THREE.SphereGeometry(0.07, 18, 14), black); jA.position.copy(postTop); g.add(jA);
    g.add(makeSegment(postTop, j2, 0.05, black));
    const jB = new THREE.Mesh(new THREE.SphereGeometry(0.07, 18, 14), black); jB.position.copy(j2); g.add(jB);
    g.add(makeSegment(j2, scopeTop, 0.05, black));

    // hvidt cradle-beslag + sort optik-hoved
    const cradle = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.12, 0.25), white);
    cradle.position.set(0.05, 0.40, 0.12); g.add(cradle);
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.23, 0.25), black);
    body.position.set(0.05, 0.53, 0.12); g.add(body);
    // objektiv ned mod emnet
    const obj = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.066, 0.14, 22), black);
    obj.position.set(0.05, 0.32, 0.15); g.add(obj);
    // okular skråt op mod operatørens ansigt
    const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.24, 20), black);
    eye.rotation.x = -0.8; eye.position.set(0.05, 0.66, 0.31); g.add(eye);

    this.scopeRig = g;
    this.scene.add(g);

    // solder-station ved siden (kontekst, altid synlig)
    const station = new THREE.Group();
    const unit = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.13, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x1d6b52, roughness: 0.5, metalness: 0.4 }));
    unit.position.set(0.62, 0.075, 0.34); station.add(unit);
    const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.18, 12),
      new THREE.MeshStandardMaterial({ color: 0x9aa6b2, roughness: 0.4, metalness: 0.7 }));
    holder.position.set(0.46, 0.12, 0.30); holder.rotation.z = 0.5; station.add(holder);
    this.scene.add(station);
  }

  _buildOperator() {
    const skin = new THREE.MeshStandardMaterial({ color: 0x2f4f6e, roughness: 0.6, metalness: 0.1 });
    this.headMat = new THREE.MeshStandardMaterial({
      color: 0x2f4f6e, roughness: 0.6, metalness: 0.1, emissive: COL.safe.clone(), emissiveIntensity: 0.25,
    });
    const shirt = new THREE.MeshStandardMaterial({ color: 0x16324c, roughness: 0.85 });

    // hoved ved okularet (bøjet fremad/ned)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.135, 32, 24), this.headMat);
    head.position.copy(HEAD); this.scene.add(head);
    // hals
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.12, 16), skin);
    neck.position.set(HEAD.x, HEAD.y - 0.15, HEAD.z - 0.06); neck.rotation.x = 0.5; this.scene.add(neck);
    // torso — bøjet fremad (hunched) mod mikroskopet
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.24, 0.5, 24), shirt);
    torso.position.set(HEAD.x, HEAD.y - 0.42, HEAD.z + 0.18); torso.rotation.x = 0.55; this.scene.add(torso);
    // skuldre
    const shoulderGeo = THREE.CapsuleGeometry
      ? new THREE.CapsuleGeometry(0.07, 0.34, 6, 12)
      : new THREE.CylinderGeometry(0.07, 0.07, 0.46, 16);
    const shoulders = new THREE.Mesh(shoulderGeo, shirt);
    shoulders.rotation.z = Math.PI / 2; shoulders.position.set(HEAD.x, HEAD.y - 0.18, HEAD.z + 0.12); this.scene.add(shoulders);
    // overarme frem mod bordet
    [-1, 1].forEach((sgn) => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.42, 14), shirt);
      arm.position.set(HEAD.x + sgn * 0.20, HEAD.y - 0.34, HEAD.z + 0.02);
      arm.rotation.x = 1.0; this.scene.add(arm);
    });
  }

  _buildExtraction() {
    // materialer matchet til den rigtige prototype: sort 3D-printet kanal + sølv flex-slange
    const printed = new THREE.MeshStandardMaterial({ color: 0x20262e, roughness: 0.55, metalness: 0.35 });
    const flex = new THREE.MeshStandardMaterial({ color: 0x9aa6b2, roughness: 0.5, metalness: 0.5 });
    const intakeMat = new THREE.MeshStandardMaterial({ color: 0x14181e, roughness: 0.5, metalness: 0.4, side: THREE.DoubleSide });

    /* ---- SCENARIE A: LØS sølv-flexslange på bordet (offset, dårlig dækning) ---- */
    this.tableSystem = new THREE.Group();
    const tCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.15, 0.07, 0.30),
      new THREE.Vector3(-0.85, 0.07, 0.36),
      new THREE.Vector3(-0.58, 0.06, 0.36),
      TABLE_INTAKE.clone(),
    ]);
    const tTube = new THREE.Mesh(new THREE.TubeGeometry(tCurve, 36, 0.055, 14, false), flex);
    this.tableSystem.add(tTube);
    // mund: bred ende (radiusBottom) vender mod kilden
    const tMouth = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.11, 0.10, 24, 1, true), intakeMat);
    tMouth.position.copy(TABLE_INTAKE);
    alignYTo(tMouth, new THREE.Vector3().subVectors(TABLE_INTAKE, SOURCE));
    this.tableSystem.add(tMouth);
    this.tableRing = new THREE.Mesh(
      new THREE.RingGeometry(0.08, 0.10, 28),
      new THREE.MeshBasicMaterial({ color: 0xffb020, transparent: true, opacity: 0.0, side: THREE.DoubleSide })
    );
    this.tableRing.position.copy(TABLE_INTAKE); this.tableRing.lookAt(SOURCE); this.tableSystem.add(this.tableRing);
    this.scene.add(this.tableSystem);

    /* ---- SCENARIE B: HVIDT elbow-mundstykke under scopet + INTERNT kanal-forløb gennem armen ---- */
    const whiteDuct = new THREE.MeshStandardMaterial({ color: 0xeceff2, roughness: 0.5, metalness: 0.15 });
    this.armSystem = new THREE.Group();
    this.elbowGroup = new THREE.Group();   // den synlige hvide elbow (skjules hvis CAD-model loades)

    // hvidt elbow: fra under cradle/objektiv, buer ned til mundstykket over emnet
    const elbowCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.05, 0.40, 0.07),
      new THREE.Vector3(0.05, 0.34, 0.12),
      new THREE.Vector3(0.05, 0.30, 0.16),
      ARM_INTAKE.clone(),
    ]);
    const elbow = new THREE.Mesh(new THREE.TubeGeometry(elbowCurve, 28, 0.05, 16, false), whiteDuct);
    this.elbowGroup.add(elbow);
    // mundstykke: bred ende vender LIGE NED mod kilden
    const aMouth = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.12, 0.12, 28, 1, true), whiteDuct);
    aMouth.position.copy(ARM_INTAKE);
    alignYTo(aMouth, new THREE.Vector3().subVectors(ARM_INTAKE, SOURCE));
    this.elbowGroup.add(aMouth);
    this.armSystem.add(this.elbowGroup);

    // INTERNT kanal-forløb (usynligt): røgen følger denne sti op gennem den sorte arm
    this.armCurve = new THREE.CatmullRomCurve3([
      ARM_INTAKE.clone(),
      new THREE.Vector3(0.05, 0.45, 0.12),
      new THREE.Vector3(-0.05, 0.56, -0.10),   // to-arms-leddet
      new THREE.Vector3(-0.55, 0.56, -0.48),   // posttoppen
      ARM_EXIT.clone(),                         // ned i posten (internt udløb)
    ]);
    this.armRing = new THREE.Mesh(
      new THREE.RingGeometry(0.09, 0.115, 28),
      new THREE.MeshBasicMaterial({ color: 0x28d6a0, transparent: true, opacity: 0.0, side: THREE.DoubleSide })
    );
    this.armRing.position.copy(ARM_INTAKE); this.armRing.lookAt(SOURCE); this.armSystem.add(this.armRing);
    this.scene.add(this.armSystem);
  }

  _initParticles() {
    const n = PARTICLE_COUNT;
    this.pPos = new Float32Array(n * 3);
    this.pCol = new Float32Array(n * 3);
    this.vel = new Float32Array(n * 3);
    this.age = new Float32Array(n);
    this.life = new Float32Array(n);
    this.state = new Uint8Array(n);   // 0 = stiger/aktiv, 1 = fanget→ruter gennem kanalen (B)
    this.miss = new Uint8Array(n);    // 1 = slipper forbi i scenarie B
    this.tableCatch = new Uint8Array(n); // 1 = fanges af den løse bordslange i scenarie A
    this.u = new Float32Array(n);     // 0..1 progress langs armCurve når fanget
    for (let i = 0; i < n; i++) {
      this.miss[i] = Math.random() < MISS_RATE ? 1 : 0;
      this.tableCatch[i] = Math.random() < TABLE_CATCH_RATE ? 1 : 0;
      this._spawn(i, Math.random());
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pPos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(this.pCol, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.10, map: SPRITE, vertexColors: true, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.95,
    });
    this.points = new THREE.Points(geo, mat); this.scene.add(this.points);
  }

  _spawn(i, ageFrac) {
    const i3 = i * 3;
    const r = 0.015 + Math.random() * 0.025, a = Math.random() * Math.PI * 2;
    this.pPos[i3]     = SOURCE.x + Math.cos(a) * r;
    this.pPos[i3 + 1] = SOURCE.y + Math.random() * 0.02;
    this.pPos[i3 + 2] = SOURCE.z + Math.sin(a) * r;
    this.vel[i3]     = (Math.random() - 0.5) * 0.10;
    this.vel[i3 + 1] = 0.32 + Math.random() * 0.28;
    this.vel[i3 + 2] = (Math.random() - 0.5) * 0.10;
    this.life[i] = 2.4 + Math.random() * 1.8;
    this.age[i] = ageFrac * this.life[i];
    this.state[i] = 0;
    this.u[i] = 0;
  }

  _updateParticles(dt) {
    const n = PARTICLE_COUNT, tmp = new THREE.Vector3(), solution = this.mode === 'solution';
    for (let i = 0; i < n; i++) {
      const i3 = i * 3; this.age[i] += dt;
      const px = this.pPos[i3], py = this.pPos[i3 + 1], pz = this.pPos[i3 + 2];

      if (solution && this.state[i] === 1) {
        // fanget → følger SELVE kanal-kurven op gennem armen (røgen løber inde i røret)
        this.u[i] += dt * 0.5;
        const cp = this.armCurve.getPoint(Math.min(this.u[i], 1));
        this.pPos[i3]     = cp.x + (Math.random() - 0.5) * 0.012;
        this.pPos[i3 + 1] = cp.y + (Math.random() - 0.5) * 0.012;
        this.pPos[i3 + 2] = cp.z + (Math.random() - 0.5) * 0.012;
        this.pCol[i3] = COL.safe.r * 0.8; this.pCol[i3 + 1] = COL.safe.g * 0.8; this.pCol[i3 + 2] = COL.safe.b * 0.8;
        if (this.u[i] >= 1) this._spawn(i, 0);
        continue;
      } else if (solution && !this.miss[i]) {
        // stærkt indsug ved keglens mund
        tmp.set(ARM_INTAKE.x - px, ARM_INTAKE.y - py, ARM_INTAKE.z - pz);
        const d = tmp.length() + 1e-4; tmp.multiplyScalar((5.6 / (d + 0.16)) / d);
        this.vel[i3] += tmp.x * dt; this.vel[i3 + 1] += (0.15 + tmp.y) * dt; this.vel[i3 + 2] += tmp.z * dt;
        if (d < 0.13) { this.state[i] = 1; this.u[i] = 0; }
      } else {
        // scenarie A: en DEL af røgen bøjer ned i den løse bordslange og fanges,
        // resten stiger op mod operatørens åndedrætszone. (B-miss = fri opdrift.)
        if (!solution && this.tableCatch[i]) {
          tmp.set(TABLE_INTAKE.x - px, TABLE_INTAKE.y - py, TABLE_INTAKE.z - pz);
          const d = tmp.length() + 1e-4; tmp.multiplyScalar((2.0 / (d + 0.2)) / d);
          this.vel[i3] += tmp.x * dt; this.vel[i3 + 1] += tmp.y * dt; this.vel[i3 + 2] += tmp.z * dt;
          if (d < 0.12) { this._spawn(i, 0); continue; }   // fanget af slangen
        } else {
          this.vel[i3]     += (Math.random() - 0.5) * 0.04 * dt;
          this.vel[i3 + 2] += (Math.random() - 0.5) * 0.04 * dt;
          this.vel[i3 + 1] += 0.16 * dt;   // opdrift mod ansigtet
        }
      }

      this.pPos[i3] += this.vel[i3] * dt;
      this.pPos[i3 + 1] += this.vel[i3 + 1] * dt;
      this.pPos[i3 + 2] += this.vel[i3 + 2] * dt;

      // farve hen over levetid: røg → fare-rød (eksponering) / grøn (fanget)
      const t = Math.min(this.age[i] / this.life[i], 1);
      const captured = solution && this.state[i] === 1;
      const tgt = captured ? COL.safe : (solution ? COL.smoke : COL.danger);
      const cr = COL.smoke.r + (tgt.r - COL.smoke.r) * t;
      const cg = COL.smoke.g + (tgt.g - COL.smoke.g) * t;
      const cb = COL.smoke.b + (tgt.b - COL.smoke.b) * t;
      const fade = 0.45 + 0.55 * (1 - t);
      this.pCol[i3] = cr * fade; this.pCol[i3 + 1] = cg * fade; this.pCol[i3 + 2] = cb * fade;

      if (this.age[i] >= this.life[i] || this.pPos[i3 + 1] > 1.5) { this._spawn(i, 0); }
    }
    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.geometry.attributes.color.needsUpdate = true;

    // hoved-reaktion: rødt i scenarie A (eksponering), roligt i B
    const danger = !solution; this.headPulse += dt * 3;
    this.headMat.emissive.lerp(danger ? COL.danger : COL.safe, 0.06);
    this.headMat.emissiveIntensity = danger ? (0.5 + 0.25 * Math.sin(this.headPulse)) : 0.22;
  }

  setMode(mode) {
    this.mode = mode === 'solution' ? 'solution' : 'problem';
    const sol = this.mode === 'solution';
    if (this.armSystem) this.armSystem.visible = sol;
    if (this.tableSystem) this.tableSystem.visible = !sol;
    if (this.badge) {
      this.badge.textContent = sol ? 'Integreret i mikroskoparm' : 'Løs slange på bordet';
      this.badge.classList.toggle('is-solution', sol);
      this.badge.classList.toggle('is-problem', !sol);
    }
    for (let i = 0; i < PARTICLE_COUNT; i++) this.state[i] = 0;
  }

  _bindControls() {
    const el = this.canvas; let lastX = 0, lastY = 0;
    const down = (e) => { this.dragging = true; this.autoRotate = false;
      const p = e.touches ? e.touches[0] : e; lastX = p.clientX; lastY = p.clientY; };
    const move = (e) => { if (!this.dragging) return;
      const p = e.touches ? e.touches[0] : e;
      this.theta -= (p.clientX - lastX) * 0.006; this.phi -= (p.clientY - lastY) * 0.006;
      this.phi = Math.max(0.45, Math.min(1.5, this.phi)); lastX = p.clientX; lastY = p.clientY; this._updateCamera(); };
    const up = () => { this.dragging = false; clearTimeout(this._resumeT);
      this._resumeT = setTimeout(() => { this.autoRotate = true; }, 2500); };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  _updateCamera() {
    const sp = Math.sin(this.phi);
    this.camera.position.set(
      this.target.x + this.radius * sp * Math.sin(this.theta),
      this.target.y + this.radius * Math.cos(this.phi),
      this.target.z + this.radius * sp * Math.cos(this.theta)
    );
    this.camera.lookAt(this.target);
  }

  _hideLoading() { if (this.loadingEl) this.loadingEl.style.opacity = 0; }
  _aspect() { const r = this.stage.getBoundingClientRect(); return (r.width || 16) / (r.height || 11); }
  _resize() { const r = this.stage.getBoundingClientRect();
    if (r.width && r.height) this.renderer.setSize(r.width, r.height, false);
    this.camera.aspect = this._aspect(); this.camera.updateProjectionMatrix(); }
  _bindResize() { this._ro = new ResizeObserver(() => this._resize()); this._ro.observe(this.stage); }
  _observe() { new IntersectionObserver(
      (es) => es.forEach((e) => { this.active = e.isIntersecting; }), { threshold: 0.12 }
    ).observe(this.stage); }

  render(dt) {
    if (!this.active) return;
    this._updateParticles(dt);
    if (this.autoRotate) { this.theta += dt * 0.16; this._updateCamera(); }
    const ring = this.mode === 'solution' ? this.armRing : this.tableRing;
    if (ring) ring.material.opacity = 0.3 + 0.2 * Math.sin(performance.now() * 0.004);
    this.renderer.render(this.scene, this.camera);
  }
}

/* ---------- Bootstrap ---------- */
function showError(stage, msg) {
  const l = stage.querySelector('[data-loading]');
  if (l) { l.textContent = msg; l.style.opacity = 1; }
}
const scenes = [];
document.querySelectorAll('[data-scene]').forEach((stage) => {
  try { scenes.push(new VentScene(stage)); }
  catch (err) { console.error('3D-scene fejlede:', err);
    showError(stage, '3D kunne ikke starte: ' + (err && err.message ? err.message : err)); }
});
document.querySelectorAll('[data-scene-toggle]').forEach((wrap) => {
  const stage = wrap.closest('.snap-section').querySelector('[data-toggle="1"]');
  const inst = scenes.find((s) => s.stage === stage);
  wrap.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      wrap.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (inst) inst.setMode(btn.dataset.mode);
    });
  });
});
if (scenes.length) {
  const clock = new THREE.Clock();
  (function loop() {
    const dt = Math.min(clock.getDelta(), 0.05);
    for (const s of scenes) s.render(dt);
    requestAnimationFrame(loop);
  })();
}

})();
