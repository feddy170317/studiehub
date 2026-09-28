/* Delte helpers for MAT2 interaktive widgets: pil-tegning, pause-styret animationsloop + 2x2-matrix/gitter-transformation */
var Widget = (function () {
  // pts: [{x,y}, ...] polyline (lukket loop hvis sidste punkt == første). Returnerer {x,y,angle,length}
  function pathBuild(pts) {
    var segLen = [], total = 0;
    for (var i = 0; i < pts.length - 1; i++) {
      var d = Math.hypot(pts[i+1].x-pts[i].x, pts[i+1].y-pts[i].y);
      segLen.push(d);
      total += d;
    }
    return { pts: pts, segLen: segLen, length: total };
  }
  function pathAt(path, s) {
    var L = path.length;
    if (L <= 0) return { x: path.pts[0].x, y: path.pts[0].y, angle: 0 };
    s = ((s % L) + L) % L;
    var acc = 0;
    for (var i = 0; i < path.segLen.length; i++) {
      var d = path.segLen[i];
      if (s <= acc + d || i === path.segLen.length - 1) {
        var f = d > 0 ? (s - acc) / d : 0;
        var p0 = path.pts[i], p1 = path.pts[i+1];
        return { x: p0.x + (p1.x-p0.x)*f, y: p0.y + (p1.y-p0.y)*f, angle: Math.atan2(p1.y-p0.y, p1.x-p0.x) };
      }
      acc += d;
    }
    var last = path.pts[path.pts.length-1];
    return { x: last.x, y: last.y, angle: 0 };
  }
  function drawPath(ctx, pts, color, width) {
    ctx.strokeStyle = color; ctx.lineWidth = width || 3;
    ctx.beginPath();
    pts.forEach(function(p,i){ if (i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y); });
    ctx.stroke();
  }
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

  // ---- 2x2-matrix helpers (M = [a,b,c,d] rækkevis: [[a,b],[c,d]]) ----
  function apply(M,x,y){ return { x: M[0]*x+M[1]*y, y: M[2]*x+M[3]*y }; }
  function det(M){ return M[0]*M[3]-M[1]*M[2]; }
  function inv(M){
    var d = det(M);
    if (Math.abs(d)<1e-9) return null;
    return [M[3]/d, -M[1]/d, -M[2]/d, M[0]/d];
  }
  function lerpM(M0,M1,t){
    var out=[];
    for (var i=0;i<4;i++) out.push(M0[i]+(M1[i]-M0[i])*t);
    return out;
  }
  // Egenværdier/-vektorer for reel 2x2-matrix. Returnerer {real:false} ved komplekse rødder.
  function eig(M){
    var a=M[0],b=M[1],c=M[2],d=M[3];
    var tr=a+d, dt=a*d-b*c;
    var disc = tr*tr-4*dt;
    if (disc<0) return { real:false, tr:tr, det:dt, disc:disc };
    var sq=Math.sqrt(disc);
    var l1=(tr+sq)/2, l2=(tr-sq)/2;
    function vecFor(l){
      var vx=b, vy=l-a;
      if (Math.hypot(vx,vy)<1e-6) { vx=l-d; vy=c; }
      if (Math.hypot(vx,vy)<1e-6) { vx=1; vy=0; }
      var len=Math.hypot(vx,vy);
      return { x:vx/len, y:vy/len };
    }
    return { real:true, tr:tr, det:dt, disc:disc, l1:l1, l2:l2, v1:vecFor(l1), v2:vecFor(l2) };
  }

  // Tegner et koordinatgitter transformeret af M, med origo ved (cx,cy) i px og `scale` px pr. enhed.
  function drawGridTransform(ctx, cx, cy, scale, M, opts){
    opts = opts || {};
    var range = opts.range || 6;
    ctx.lineWidth = 1;
    ctx.strokeStyle = opts.gridColor || 'rgba(94,200,255,0.22)';
    for (var i=-range;i<=range;i++){
      ctx.beginPath();
      for (var s=-range;s<=range;s+=0.2){
        var p = apply(M,i,s);
        var px=cx+p.x*scale, py=cy-p.y*scale;
        if (s===-range) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.stroke();
      ctx.beginPath();
      for (var s2=-range;s2<=range;s2+=0.2){
        var p2 = apply(M,s2,i);
        var px2=cx+p2.x*scale, py2=cy-p2.y*scale;
        if (s2===-range) ctx.moveTo(px2,py2); else ctx.lineTo(px2,py2);
      }
      ctx.stroke();
    }
    if (opts.showSquare){
      var corners=[[0,0],[1,0],[1,1],[0,1]];
      ctx.beginPath();
      corners.forEach(function(c,idx){
        var p=apply(M,c[0],c[1]);
        var px=cx+p.x*scale, py=cy-p.y*scale;
        if (idx===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      });
      ctx.closePath();
      var d = det(M);
      ctx.fillStyle = d>=0 ? (opts.squareColorPos||'rgba(0,217,132,0.28)') : (opts.squareColorNeg||'rgba(255,94,94,0.28)');
      ctx.fill();
      ctx.strokeStyle = d>=0 ? '#00d984' : '#ff5e5e';
      ctx.lineWidth=2; ctx.stroke();
    }
    if (opts.showBasis!==false){
      var e1=apply(M,1,0), e2=apply(M,0,1);
      arrow(ctx, cx,cy, cx+e1.x*scale, cy-e1.y*scale, opts.e1Color||'#5ec8ff', 3);
      arrow(ctx, cx,cy, cx+e2.x*scale, cy-e2.y*scale, opts.e2Color||'#ffa500', 3);
    }
  }

  return {
    arrow: arrow, grid: grid, setupPause: setupPause, loop: loop,
    pathBuild: pathBuild, pathAt: pathAt, drawPath: drawPath,
    mat: { apply: apply, det: det, inv: inv, lerp: lerpM, eig: eig },
    drawGridTransform: drawGridTransform
  };
})();
