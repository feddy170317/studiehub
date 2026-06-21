/* ============================================================
   finans.js — Interaktiv business case (slide 7)
   Transparent estimat-model: sliders → live Chart.js-grafer.
   ALLE defaults er ESTIMATER markeret i UI'et — verificér med Terma.
   ============================================================ */

(function () {
  'use strict';

  const UNIT_COMMERCIAL = 3000;   // kr. — kommerciel sugearm (estimat)
  const UNIT_PRINTED = 19.54;     // kr. — 3D-printet armrør (fra projektets økonomi)
  const YEARS = 5;

  const $ = (id) => document.getElementById(id);
  const sliders = {
    operators: $('f-operators'),
    sickdays:  $('f-sickdays'),
    share:     $('f-share'),
    reduction: $('f-reduction'),
    daycost:   $('f-daycost'),
  };
  if (!sliders.operators) return; // slide ikke til stede

  /* ---------- Dansk talformat ---------- */
  const kr = (v) => Math.round(v).toLocaleString('da-DK');
  const dec1 = (v) => v.toLocaleString('da-DK', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  /* ---------- Modellen ---------- */
  function compute() {
    const n   = +sliders.operators.value;
    const sd  = +sliders.sickdays.value;
    const sh  = +sliders.share.value / 100;
    const red = +sliders.reduction.value / 100;
    const dc  = +sliders.daycost.value;

    const totalNow   = n * sd;            // sygedage/år i alt
    const fumeNow     = totalNow * sh;     // damp-/luftvejsrelaterede dage
    const avoided     = fumeNow * red;     // undgåede dage med armrør
    const totalArm    = totalNow - avoided;

    const healthPerYear = avoided * dc;                    // kr./år
    const unitOnce      = (UNIT_COMMERCIAL - UNIT_PRINTED) * n; // engangs
    const firstYear     = unitOnce + healthPerYear;

    const cumulative = [];
    for (let y = 1; y <= YEARS; y++) cumulative.push(unitOnce + healthPerYear * y);

    return { n, sd, sh, red, dc, totalNow, totalArm, avoided, healthPerYear, unitOnce, firstYear, cumulative };
  }

  /* ---------- Slider-labels ---------- */
  function updateLabels() {
    document.querySelector('[data-out="operators"]').textContent = sliders.operators.value;
    document.querySelector('[data-out="sickdays"]').textContent  = dec1(+sliders.sickdays.value);
    document.querySelector('[data-out="share"]').textContent     = sliders.share.value + ' %';
    document.querySelector('[data-out="reduction"]').textContent = sliders.reduction.value + ' %';
    document.querySelector('[data-out="daycost"]').textContent   = kr(+sliders.daycost.value) + ' kr.';
  }

  /* ---------- Chart.js setup ---------- */
  let sickChart, cumChart;
  const GRID = 'rgba(255,255,255,0.06)';
  const TICK = '#8ba0b8';
  const FONT = "'Inter','Segoe UI',sans-serif";

  function initCharts() {
    if (!window.Chart) return;
    Chart.defaults.color = TICK;
    Chart.defaults.font.family = FONT;

    const m = compute();

    sickChart = new Chart($('chart-sick'), {
      type: 'bar',
      data: {
        labels: ['Uden armrør', 'Med armrør'],
        datasets: [{
          data: [m.totalNow, m.totalArm],
          backgroundColor: ['#ff5a4d', '#28d6a0'],
          borderRadius: 6, barThickness: 80,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false },
          tooltip: { callbacks: { label: (c) => dec1(c.parsed.y) + ' dage/år' } } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: GRID }, title: { display: true, text: 'Sygedage / år' } },
        },
      },
    });

    cumChart = new Chart($('chart-cum'), {
      type: 'line',
      data: {
        labels: Array.from({ length: YEARS }, (_, i) => 'År ' + (i + 1)),
        datasets: [{
          data: m.cumulative,
          borderColor: '#2f8fe0', backgroundColor: 'rgba(47,143,224,0.18)',
          fill: true, tension: 0.3, pointRadius: 4, pointBackgroundColor: '#2f8fe0',
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false },
          tooltip: { callbacks: { label: (c) => kr(c.parsed.y) + ' kr.' } } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: GRID },
            ticks: { callback: (v) => kr(v) + ' kr.' } },
        },
      },
    });
  }

  /* ---------- Opdatér alt ---------- */
  function refresh() {
    updateLabels();
    const m = compute();
    $('save-unit').innerHTML   = kr(m.unitOnce)      + ' <span class="unit">kr.</span>';
    $('save-health').innerHTML = kr(m.healthPerYear) + ' <span class="unit">kr./år</span>';
    $('save-total').innerHTML  = kr(m.firstYear)     + ' <span class="unit">kr.</span>';
    if (sickChart) {
      sickChart.data.datasets[0].data = [m.totalNow, m.totalArm];
      sickChart.update('none');
    }
    if (cumChart) {
      cumChart.data.datasets[0].data = m.cumulative;
      cumChart.update('none');
    }
  }

  Object.values(sliders).forEach((s) => s.addEventListener('input', refresh));

  // Init når Chart.js er klar
  function boot() { initCharts(); refresh(); }
  if (document.readyState === 'complete' || document.readyState === 'interactive') boot();
  else window.addEventListener('DOMContentLoaded', boot);

})();
