/* ============================================================
   photosmoke.js — Animeret røg oven på DE RIGTIGE fotos
   2D-partikellag tegnet på et <canvas> over fotoet.

   mode="rise"    (scenarie A): røgen stiger op fra kilden mod ansigtet.
   mode="extract" (scenarie B): røgen suges op i kanalens indsug (target).

   Placering styres med normaliserede koordinater (0..1 af foto-boksen):
     data-emit="x,y"   = hvor røgen starter
     data-target="x,y" = ansigt-retning (rise) / indsug (extract)
   → nemt at finjustere når de rigtige fotos er lagt ind.
   ============================================================ */
(function () {
'use strict';

function parsePair(str, def) {
  if (!str) return def;
  const p = str.split(',').map((s) => parseFloat(s.trim()));
  return (p.length === 2 && !isNaN(p[0]) && !isNaN(p[1])) ? p : def;
}

function makeSprite() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(225,235,245,0.9)');
  g.addColorStop(0.4, 'rgba(190,205,222,0.4)');
  g.addColorStop(1, 'rgba(190,205,222,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  return c;
}
const SPRITE = makeSprite();

class PhotoSmoke {
  constructor(fig) {
    this.fig = fig;
    this.img = fig.querySelector('img');
    this.canvas = fig.querySelector('.ps-canvas');
    if (!this.img || !this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.mode = fig.dataset.mode === 'extract' ? 'extract' : 'rise';
    this.emit = parsePair(fig.dataset.emit, [0.5, 0.85]);
    this.target = parsePair(fig.dataset.target, [0.5, 0.4]);
    this.N = this.mode === 'extract' ? 150 : 130;
    this.parts = [];
    this.active = false; this.ready = false;
    this.w = 0; this.h = 0;
    for (let i = 0; i < this.N; i++) this.parts.push(this._spawn(Math.random()));

    const onload = () => { this.ready = true; this._resize(); };
    if (this.img.complete && this.img.naturalWidth > 0) onload();
    else this.img.addEventListener('load', onload);
    this.img.addEventListener('error', () => { this.ready = false; });

    new ResizeObserver(() => this._resize()).observe(this.fig);
    new IntersectionObserver(
      (es) => es.forEach((e) => { this.active = e.isIntersecting; }), { threshold: 0.1 }
    ).observe(this.fig);
  }

  _resize() {
    const r = this.img.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.w = r.width; this.h = r.height;
    this.canvas.width = r.width * dpr; this.canvas.height = r.height * dpr;
    this.canvas.style.width = r.width + 'px'; this.canvas.style.height = r.height + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  _spawn(age) {
    return {
      x: this.emit[0] + (Math.random() - 0.5) * 0.05,
      y: this.emit[1] + (Math.random() - 0.5) * 0.02,
      vx: (Math.random() - 0.5) * 0.02,
      vy: -(0.05 + Math.random() * 0.05),
      life: 1.6 + Math.random() * 1.4,
      age: age * 2.0,
      r: 0.05 + Math.random() * 0.05,
    };
  }

  _update(dt) {
    const driftX = (this.target[0] - this.emit[0]);
    for (const p of this.parts) {
      p.age += dt;
      if (this.mode === 'extract') {
        const dx = this.target[0] - p.x, dy = this.target[1] - p.y;
        const d = Math.hypot(dx, dy) + 1e-3;
        const pull = 1.1 / (d + 0.15);
        p.vx += (dx / d) * pull * dt;
        p.vy += (dy / d) * pull * dt - 0.02 * dt;
        if (d < 0.05) { Object.assign(p, this._spawn(0)); continue; }
      } else {
        p.vx += (driftX * 0.05 + (Math.random() - 0.5) * 0.03) * dt;
        p.vy -= 0.04 * dt; // opdrift
      }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.age >= p.life || p.y < -0.06) Object.assign(p, this._spawn(0));
    }
  }

  _draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of this.parts) {
      const t = Math.min(p.age / p.life, 1);
      const fadeIn = t < 0.18 ? t / 0.18 : 1;
      const alpha = 0.16 * (1 - t) * fadeIn;
      if (alpha <= 0) continue;
      const pr = p.r * this.h * (0.6 + t * 1.0);
      ctx.globalAlpha = alpha;
      ctx.drawImage(SPRITE, p.x * this.w - pr, p.y * this.h - pr, pr * 2, pr * 2);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  tick(dt) { if (!this.active || !this.ready) return; this._update(dt); this._draw(); }
}

const widgets = [];
document.querySelectorAll('.photo-smoke').forEach((fig) => {
  const w = new PhotoSmoke(fig);
  if (w.ctx) widgets.push(w);
});

if (widgets.length) {
  let last = performance.now();
  (function loop(now) {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    for (const w of widgets) w.tick(dt);
    requestAnimationFrame(loop);
  })(last);
}

})();
