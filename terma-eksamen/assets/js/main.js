/* ============================================================
   main.js — Eksamenspræsentation (deck-motor)
   - Reveal-animationer på scroll (GSAP ScrollTrigger)
   - Dot-nav: aktiv markør + klik-til-jump
   - Keyboard: pil-op/ned, Space, F (fullscreen), Home/End
   - Hero-parallax, kbd-hint, wheel-snap
   Mønster genbrugt fra ../Praesentation/assets/js/main.js
   ============================================================ */

(function () {
  'use strict';

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ---- 1. REVEAL ANIMATIONS (IntersectionObserver) ----
  // VIGTIGT: <body> er scroll-containeren (scroll-snap), så GSAP ScrollTrigger
  // — der lytter på window-scroll — fyrede IKKE på slide 2+ → indholdet forblev
  // usynligt (opacity:0) indtil et resize (F11) tvang en refresh. IntersectionObserver
  // observerer faktisk synlighed i viewporten og virker uanset hvilken container der scroller.
  function showReveal(section) {
    const items = section.querySelectorAll('.reveal');
    if (!items.length) return;
    if (window.gsap) {
      gsap.to(items, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', overwrite: 'auto' });
    } else {
      items.forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
    }
  }
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { showReveal(e.target); revealIO.unobserve(e.target); } });
  }, { threshold: 0.2 });
  document.querySelectorAll('.snap-section').forEach((s) => revealIO.observe(s));

  // ---- 1b. COUNTUP — animerede tal på [data-count] ----
  function initCountUp(el) {
    if (el.dataset.counted === '1') return;
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (window.countUp && window.countUp.CountUp) {
      const cu = new window.countUp.CountUp(el, target, {
        duration: 2.0, decimalPlaces: decimals, prefix, suffix,
        useGrouping: false, separator: '.', decimal: ',',
      });
      if (!cu.error) { cu.start(); el.dataset.counted = '1'; return; }
    }
    el.textContent = prefix + target.toFixed(decimals).replace('.', ',') + suffix;
    el.dataset.counted = '1';
  }
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { initCountUp(e.target); countIO.unobserve(e.target); } });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el));

  // ---- 2. DOT NAV ----
  const dots = document.querySelectorAll('#dot-nav .dot');
  const sections = document.querySelectorAll('.snap-section');

  function setActiveDot(idx) {
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const idx = Array.from(sections).indexOf(entry.target);
          if (idx >= 0) setActiveDot(idx);
        }
      });
    },
    { threshold: [0.5, 0.75] }
  );
  sections.forEach((s) => io.observe(s));

  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(dot.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ---- 3. KEYBOARD NAV ----
  function currentSectionIdx() {
    let best = 0, bestDist = Infinity;
    sections.forEach((s, i) => {
      const d = Math.abs(s.getBoundingClientRect().top);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }
  function goTo(idx) {
    if (idx < 0 || idx >= sections.length) return;
    sections[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  }

  document.addEventListener('keydown', (e) => {
    // Lad slider-input styre pile-taster når man justerer finans-modellen
    if (e.target && e.target.tagName === 'INPUT') return;
    // Frys deck-navigation når CAD-modal er åben
    const mm = document.getElementById('model-modal');
    if (mm && !mm.hidden) return;
    switch (e.key) {
      case 'ArrowDown': case 'PageDown': case ' ':
        e.preventDefault(); goTo(currentSectionIdx() + 1); break;
      case 'ArrowUp': case 'PageUp':
        e.preventDefault(); goTo(currentSectionIdx() - 1); break;
      case 'Home': e.preventDefault(); goTo(0); break;
      case 'End': e.preventDefault(); goTo(sections.length - 1); break;
      case 'f': case 'F': e.preventDefault(); toggleFullscreen(); break;
    }
  });

  // ---- 3b. INTERAKTIV 3D-MODEL FULDSKÆRM (iframe → microscope-arm.html) ----
  const modelModal = document.getElementById('model-modal');
  const modelBackdrop = document.getElementById('model-backdrop');
  const modelFrame = document.getElementById('model-frame');
  const closeModelBtn = document.getElementById('close-model');

  function openModel(src) {
    if (!modelModal || !src) return;
    if (modelFrame) modelFrame.setAttribute('src', src);   // sæt mode (#arm / #floor) pr. knap
    modelModal.hidden = false;
    if (modelBackdrop) modelBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModel() {
    if (!modelModal) return;
    modelModal.hidden = true;
    if (modelBackdrop) modelBackdrop.hidden = true;
    if (modelFrame) modelFrame.removeAttribute('src');     // stop iframe-render når lukket
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-model-src]').forEach((btn) => {
    btn.addEventListener('click', () => openModel(btn.getAttribute('data-model-src')));
  });
  if (closeModelBtn) closeModelBtn.addEventListener('click', closeModel);
  if (modelBackdrop) modelBackdrop.addEventListener('click', closeModel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modelModal && !modelModal.hidden) closeModel();
  });

  // ---- 4. HERO PARALLAX (body er scroll-containeren, ikke window) ----
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    document.body.addEventListener('scroll', () => {
      heroBg.style.transform = 'translateY(' + (document.body.scrollTop * 0.25) + 'px) scale(1.05)';
    }, { passive: true });
  }

  // ---- 5. KBD-HINT fade ----
  const kbdHint = document.getElementById('kbd-hint');
  if (kbdHint) {
    setTimeout(() => kbdHint.classList.add('hide'), 6000);
    document.addEventListener('mousemove', () => {
      kbdHint.classList.remove('hide');
      clearTimeout(kbdHint._hideTimer);
      kbdHint._hideTimer = setTimeout(() => kbdHint.classList.add('hide'), 3500);
    });
  }

  // ---- 6. WHEEL-SNAP (én sektion ad gangen ved store deltas) ----
  let wheelLock = false;
  document.addEventListener('wheel', (e) => {
    if (wheelLock) { e.preventDefault(); return; }
    if (Math.abs(e.deltaY) < 30) return;
    wheelLock = true;
    setTimeout(() => { wheelLock = false; }, 700);
    e.preventDefault();
    goTo(currentSectionIdx() + (e.deltaY > 0 ? 1 : -1));
  }, { passive: false });

})();
