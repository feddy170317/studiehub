// Webafspiller: tegner en Ballpoint-video live på et lærred, synkront med stemmesporet (audio.currentTime styrer t).
// Brug: BP.live(VO, { audio: 'id.mp3', id: 'id' }) efter at harness.js, motor.js og videoens scene.js er indlæst.
(function () {
'use strict';
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

// undertekster: samme opdeling som video.py (≤ 8 ord / 3,4 s, brudt ved sætningsslut)
function cues(vo) {
  const ren = (s) => s.toLowerCase().replace(/^[»«"(]+|[.,:;?!»«")]+$/g, '');
  const out = [];
  for (const id of vo.order) {
    const L = vo.lines[id], tokens = L.text.split(/\s+/); let j = 0, cur = [];
    for (const w0 of L.words) {
      let w = w0[0];
      for (let i = j; i < Math.min(j + 4, tokens.length); i++) if (ren(tokens[i]) === ren(w)) { w = tokens[i]; j = i + 1; break; }
      cur.push([w, w0[1], w0[2]]);
      const last = cur[cur.length - 1];
      if ((/[.?!]$/.test(w) && !/^(pr|ca|bl\.a)\.$/i.test(w)) || (/[,:;]$/.test(w) && cur.length >= 4) || cur.length >= 8 || last[2] - cur[0][1] > 3.4) { out.push(cur); cur = []; }
    }
    if (cur.length) out.push(cur);
  }
  return out.map((c, i) => ({ a: c[0][1], b: Math.min(c[c.length - 1][2] + 0.25, out[i + 1] ? out[i + 1][0][1] : 1e9), s: c.map((w) => w[0]).join(' ') }));
}

BP.live = function (vo, o) {
  o = o || {};
  BP.OPT.finish = 'baked'; // vignet + korn bagt i ét lag: samme udseende, ~3× hurtigere på telefoner
  const cv = $('cv'), P = BP.prepare(vo, cv), D = P.DURATION, CUES = cues(vo);
  window.seek = P.render; window.DURATION = D;
  const key = 'bpv:' + (o.id || location.pathname);
  const store = { get() { try { return parseFloat(localStorage.getItem(key)) || 0; } catch (e) { return 0; } }, set(v) { try { localStorage.setItem(key, String(v)); } catch (e) { /* privat tilstand */ } } };
  let audio = null, audioOk = false, playing = false, t = 0, clock0 = 0, t0 = 0, rate = 1, ready = false, lastSave = 0, poster = false;

  const now = () => (audioOk ? audio.currentTime : playing ? t0 + (performance.now() - clock0) / 1000 * rate : t);
  const ui = () => {
    $('play').textContent = playing ? '❚❚' : '▶'; $('play').setAttribute('aria-label', playing ? 'Pause' : 'Afspil');
    $('big').hidden = playing || !ready; $('big').textContent = t >= D - 0.1 ? '↻' : '▶';
  };
  const draw = () => {
    P.render(t);
    const c = CUES.find((q) => t >= q.a && t < q.b); const s = c ? c.s : '';
    if ($('cap').textContent !== s) $('cap').textContent = s;
    $('scrub').value = Math.round(t / D * 1000); $('time').textContent = fmt(t) + ' / ' + fmt(D);
  };
  const seekTo = (x) => { poster = false; t = clamp(x, 0, D); if (audioOk) audio.currentTime = t; t0 = t; clock0 = performance.now(); draw(); };
  const play = () => {
    if (!ready || playing) return;
    if (t >= D - 0.1 || poster) seekTo(0);
    poster = false; playing = true;
    if (audioOk) { audio.currentTime = t; audio.playbackRate = rate; const p = audio.play(); if (p && p.catch) p.catch(() => { audioOk = false; t0 = t; clock0 = performance.now(); }); }
    else { t0 = t; clock0 = performance.now(); }
    ui();
  };
  const pause = () => { if (!playing) return; t = now(); playing = false; if (audioOk) audio.pause(); store.set(t); ui(); draw(); };
  const toggle = () => (playing ? pause() : play());

  const tick = () => {
    if (playing) {
      t = now();
      if (t >= D) { t = D; playing = false; if (audioOk) audio.pause(); store.set(0); ui(); }
      draw();
      if (performance.now() - lastSave > 3000) { lastSave = performance.now(); store.set(t); }
    }
    requestAnimationFrame(tick);
  };

  $('play').onclick = toggle; $('big').onclick = (e) => { e.stopPropagation(); play(); };
  $('scr').onclick = toggle;
  $('scrub').oninput = (e) => seekTo(e.target.value / 1000 * D);
  $('back').onclick = () => seekTo(now() - 10);
  $('rate').onchange = (e) => { const tt = now(); rate = parseFloat(e.target.value); if (audioOk) audio.playbackRate = rate; t = tt; t0 = tt; clock0 = performance.now(); };
  const setCap = (on) => { document.body.classList.toggle('nocap', !on); $('cc').classList.toggle('on', on); try { localStorage.setItem('bpv:cc', on ? '1' : '0'); } catch (e) { /* */ } };
  let ccOn = true; try { ccOn = localStorage.getItem('bpv:cc') !== '0'; } catch (e) { /* */ }
  setCap(ccOn); $('cc').onclick = () => { ccOn = !ccOn; setCap(ccOn); };
  $('fs').onclick = () => { const v = $('vid'); if (document.fullscreenElement) document.exitFullscreen(); else if (v.requestFullscreen) v.requestFullscreen().catch(() => {}); else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen(); };
  addEventListener('keydown', (e) => {
    if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName) && e.code !== 'Space') return;
    if (e.code === 'Space' || e.key === 'k') { e.preventDefault(); toggle(); }
    else if (e.key === 'ArrowLeft') seekTo(now() - 5); else if (e.key === 'ArrowRight') seekTo(now() + 5);
    else if (e.key === 'c') $('cc').click(); else if (e.key === 'f') $('fs').click();
  });
  addEventListener('pagehide', () => store.set(now()));

  // lyd: afspilningen følger audio.currentTime; mangler lyden, kører et ur i stedet (uden stemme)
  audio = new Audio(); audio.preload = 'auto'; audio.src = o.audio || vo.audio;
  audio.addEventListener('loadedmetadata', () => { audioOk = true; audio.currentTime = t; }, { once: true });
  audio.addEventListener('error', () => { audioOk = false; $('load').hidden = false; $('load').textContent = 'Lyden kunne ikke hentes. Videoen kører uden stemme.'; });
  audio.addEventListener('waiting', () => { if (playing) $('load').hidden = false; });
  audio.addEventListener('playing', () => { $('load').hidden = true; });

  P.ready.then(() => {
    ready = true; $('load').hidden = true;
    const resume = store.get();
    const res = resume > 2 && resume < D - 3;
    t = res ? resume : Math.min(D, (vo.lines[vo.order[0]].end || 2) + 0.6); poster = !res; // plakat: titelkortet færdigtegnet, men afspil starter fra 0
    if (resume > 2 && resume < D - 3) { $('load').hidden = false; $('load').textContent = 'Fortsætter fra ' + fmt(resume) + ' · træk i bjælken for at starte forfra'; setTimeout(() => { $('load').hidden = true; }, 3500); }
    draw(); ui(); requestAnimationFrame(tick);
  });
};
})();
