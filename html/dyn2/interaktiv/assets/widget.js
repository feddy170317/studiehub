/* Delte helpers for DYN2 interaktive widgets: pil-tegning + pause-styret animationsloop */
var Widget = (function () {
  function arrow(ctx, x0, y0, x1, y1, color, width) {
    var headlen = 10;
    var dx = x1 - x0, dy = y1 - y0;
    var len = Math.hypot(dx, dy);
    if (len < 1) return;
    var angle = Math.atan2(dy, dx);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width || 3;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - headlen * Math.cos(angle - Math.PI / 6), y1 - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x1 - headlen * Math.cos(angle + Math.PI / 6), y1 - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  function grid(ctx, W, H, step) {
    step = step || 40;
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (var gx = 0; gx < W; gx += step) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
    for (var gy = 0; gy < H; gy += step) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
  }

  // Wire an existing #pauseBtn + #pausedFlag (if present) and return {isPaused}
  function setupPause() {
    var paused = false;
    var btn = document.getElementById('pauseBtn');
    var flag = document.getElementById('pausedFlag');
    function apply() {
      if (btn) {
        btn.textContent = paused ? '▶ Afspil' : '⏸ Pause';
        btn.classList.toggle('is-paused', paused);
      }
      if (flag) flag.classList.toggle('show', paused);
    }
    function toggle() { paused = !paused; apply(); }
    if (btn) btn.addEventListener('click', toggle);
    window.addEventListener('keydown', function (e) {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') { e.preventDefault(); toggle(); }
    });
    apply();
    return { isPaused: function () { return paused; }, toggle: toggle };
  }

  // renderFn(dt, t) is called every frame; dt is 0 while paused (so motion freezes,
  // but slider-driven values still redraw live).
  function loop(renderFn) {
    var lastT = null;
    var pauseCtl = setupPause();
    function frame(t) {
      if (lastT === null) lastT = t;
      var rawDt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;
      var dt = pauseCtl.isPaused() ? 0 : rawDt;
      renderFn(dt, t, pauseCtl.isPaused());
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return pauseCtl;
  }

  return { arrow: arrow, grid: grid, setupPause: setupPause, loop: loop };
})();
