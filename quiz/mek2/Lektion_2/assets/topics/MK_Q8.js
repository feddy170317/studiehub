/* MEK2 Quiz — Emne S5: Tyndvæggede trykbeholdere. Kilde: Besvarelse_MEK2_S26 (opg3).
   12 Q · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['MK_Q8'] = {
  intro: 'En tyndvægget cylindrisk trykbeholder har to spændinger: <b>ringspænding (hoop)</b> σ_h = pr/t rundt om, og <b>længdespænding</b> σ_l = pr/2t langs aksen. Pointen at huske: <b>ringspændingen er dobbelt så stor</b> som længdespændingen — derfor revner trykbeholdere på langs.',
  analogi: '⚒ Tip: tænk på en pølse på grillen — den sprækker altid på LANGS, ikke på tværs. Det er fordi ringspændingen (der trækker pølsen fra hinanden på langs) er dobbelt så stor som længdespændingen.',
  examQs: [
    'Beregn ring- og længdespænding og tjek tyndvægskravet (r/t).',
    'Læg en torsionsforskydning oven på og opstil (σ_x, σ_y, τ_xy).',
    'Transformér til en spiralsøm og find spændingerne på sømmen.'
  ],
  svgCap: 'Tyndvægget cylinder under indre tryk p: ringspændingen σ_h = pr/t virker rundt om (størst), længdespændingen σ_l = pr/2t virker langs aksen (halvt så stor). Derfor revner beholdere på langs.',
  svg: vesselSVG(),
  mc: [
    { level:'let', q:'Hvad er ringspændingen (hoop stress) i en tyndvægget cylinder?',
      options:['σ_h = pr/2t','σ_h = pr/t','σ_h = 2pr/t','σ_h = pt/r'],
      correct:1,
      why:'Ringspændingen er σ_h = pr/t, hvor p er det indre tryk, r radius og t vægtykkelsen. Den virker tangentielt (rundt om cylinderen).' },
    { level:'let', q:'Hvad er længdespændingen (longitudinal) i en tyndvægget cylinder?',
      options:['σ_l = pr/t','σ_l = pr/2t','σ_l = 2pr/t','σ_l = pr²/t'],
      correct:1,
      why:'Længdespændingen σ_l = pr/2t virker langs aksen. Den er præcis halvdelen af ringspændingen.' },
    { level:'let', q:'Hvad er forholdet mellem ring- og længdespænding?',
      options:['1:1','2:1 (hoop er dobbelt så stor)','1:2','3:1'],
      correct:1,
      why:'σ_h : σ_l = pr/t : pr/2t = 2 : 1. Ringspændingen er altid dobbelt så stor som længdespændingen — et godt tjek-punkt.' },
    { level:'let', q:'Hvornår gælder de tyndvæggede formler?',
      options:['Når r/t er lille (under 2)','Når r/t er stor (typisk ≥ 10)','Altid','Kun for kugler'],
      correct:1,
      why:'Tyndvægsantagelsen kræver r/t ≥ ~10, så spændingen kan antages jævnt fordelt over væggen og radialspændingen er forsvindende.' },
    { level:'middel', q:'I hvilken retning revner en cylindrisk trykbeholder typisk, og hvorfor?',
      options:['På tværs, fordi længdespændingen er størst','På langs, fordi ringspændingen (størst) trækker væggen fra hinanden','Tilfældigt','Den revner ikke'],
      correct:1,
      why:'Ringspændingen σ_h = pr/t er den største spænding og virker tangentielt — den trækker materialet fra hinanden langs en længdelinje. Derfor opstår en langsgående revne.' },
    { level:'middel', q:'Hvad er spændingen i en tyndvægget KUGLEformet trykbeholder?',
      options:['σ = pr/t i én retning, nul i den anden','σ = pr/2t i alle retninger','σ = pr/t i alle retninger','σ = 2pr/t'],
      correct:1,
      why:'En kugle har σ = pr/2t ens i alle retninger (symmetri). Derfor er en kugle den mest effektive trykbeholderform — laveste maksimalspænding for samme p, r, t.' },
    { level:'middel', q:'Er σ_h og σ_l hovedspændinger?',
      options:['Nej, der mangler en forskydning','Ja — de virker vinkelret på hinanden, og radialspændingen ≈ 0 ved tyndvæg','Kun σ_h','Kun ved kugler'],
      correct:1,
      why:'Uden andre laster er σ_h (tangentiel) og σ_l (aksial) hovedspændinger. Radialspændingen er ~0 (tyndvæg) og udgør den tredje (σ₃ ≈ 0) → plan spænding.' },
    { level:'middel', q:'Hvis det indre tryk p fordobles, hvad sker der med spændingerne?',
      options:['De firdobles','De fordobles (lineært med p)','De er uændrede','De halveres'],
      correct:1,
      why:'Både σ_h = pr/t og σ_l = pr/2t er lineære i p. Fordobles trykket, fordobles begge spændinger.' },
    { level:'middel', q:'Hvis radius r fordobles (samme t og p), hvad sker der med ringspændingen?',
      options:['Uændret','Fordobles (σ_h ∝ r)','Halveres','Firdobles'],
      correct:1,
      why:'σ_h = pr/t er proportional med radius. En større beholder med samme vægtykkelse har derfor højere spænding — store tanke kræver tykkere vægge.' },
    { level:'svaer', q:'Hvad er radialspændingen (den tredje hovedspænding) i en tyndvægget beholder?',
      options:['Lig ringspændingen','≈ 0 — lille i forhold til σ_h og σ_l, så vi regner plan spænding (σ₃ = 0)','Lig længdespændingen','Negativ og stor'],
      correct:1,
      why:'Radialspændingen varierer fra −p (inderside) til 0 (yderside), men er forsvindende lille sammenlignet med σ_h ≈ pr/t (faktor ~r/t større). Derfor sættes σ₃ ≈ 0 → plan spænding.' },
    { level:'svaer', q:'Hvad er den ABSOLUT maksimale forskydningsspænding i cylindervæggen (kun tryk)?',
      options:['(σ_h − σ_l)/2','σ_h/2 — fra spændet σ_h til σ₃ = 0 (ude af planen)','Nul','σ_l/2'],
      correct:1,
      why:'In-plane giver (σ_h − σ_l)/2 = pr/4t. Men med σ₃ = 0 er det største spænd σ_h − 0, så absolut τ_max = σ_h/2 = pr/2t — større end in-plane. Tag altid σ₃ med.' },
    { level:'svaer', q:'En tank har en spiralsøm i en vinkel. Hvordan finder man spændingerne PÅ sømmen?',
      options:['Brug bare σ_h direkte','Transformér spændingstilstanden (σ_l, σ_h, evt. τ) til sømmens vinkel med spændingstransformation/Mohr','Sømmen har ingen spænding','Brug kun længdespændingen'],
      correct:1,
      why:'Sømmen er en svaghedslinje i en bestemt retning. Man sætter sømvinklen ind i transformationsligningerne (eller bruger Mohr) for at finde normal- og forskydningsspændingen vinkelret på og langs sømmen.' }
  ],
  cards: [
    { q:'De to cylinderspændinger?', a:'Ringspænding (hoop): σ_h = pr/t (størst, tangentiel). Længdespænding: σ_l = pr/2t (aksial, halvt så stor). Forhold 2:1. Gælder for r/t ≥ ~10.' },
    { q:'Cylinder vs. kugle?', a:'Cylinder: σ_h = pr/t, σ_l = pr/2t (revner på langs). Kugle: σ = pr/2t i alle retninger — mest effektive form, laveste maksimalspænding.' },
    { q:'Hvorfor revner trykbeholdere på langs?', a:'Ringspændingen σ_h = pr/t er den største og trækker væggen fra hinanden langs en længdelinje → langsgående revne. "Pølse-reglen".' },
    { q:'Hovedspændinger og absolut τ_max?', a:'σ_h, σ_l er hovedspændinger; radial ≈ 0 → σ₃ = 0 (plan spænding). Absolut τ_max = σ_h/2 = pr/2t (ude-af-plan med σ₃ = 0), større end in-plane (σ_h−σ_l)/2.' }
  ]
};

function vesselSVG(){ return '\
<svg viewBox="0 0 520 230" width="520" height="230" role="img" aria-label="Tyndvaegget trykbeholder">\
<style>.ax{font:600 11px Nunito,sans-serif;fill:#cfe3f5} .lb{font:700 12px Nunito,sans-serif}</style>\
<rect x="120" y="80" width="240" height="80" rx="0" fill="rgba(94,200,255,0.07)" stroke="#5ec8ff" stroke-width="2.5"/>\
<ellipse cx="120" cy="120" rx="26" ry="40" fill="rgba(94,200,255,0.10)" stroke="#5ec8ff" stroke-width="2.5"/>\
<ellipse cx="360" cy="120" rx="26" ry="40" fill="rgba(10,26,43,1)" stroke="#5ec8ff" stroke-width="2.5"/>\
<g stroke="#ff6b6b" stroke-width="2.5" fill="#ff6b6b">\
<line x1="240" y1="80" x2="240" y2="52"/><polygon points="240,44 233,60 247,60"/>\
<line x1="240" y1="160" x2="240" y2="188"/><polygon points="240,196 233,180 247,180"/></g>\
<text x="252" y="46" class="lb" fill="#ff9b9b">σ_h = pr/t (ring)</text>\
<g stroke="#ffd24a" stroke-width="2.5" fill="#ffd24a">\
<line x1="360" y1="120" x2="408" y2="120"/><polygon points="416,120 400,113 400,127"/></g>\
<text x="300" y="214" class="lb" fill="#ffd24a">σ_l = pr/2t (længde)</text>\
<g stroke="#9bd4ff" stroke-width="1.6"><line x1="150" y1="120" x2="175" y2="120" marker-end="url(#vp)"/><line x1="200" y1="105" x2="220" y2="105" marker-end="url(#vp)"/><line x1="200" y1="135" x2="220" y2="135" marker-end="url(#vp)"/></g>\
<text x="150" y="135" class="ax" font-size="10" fill="#9bd4ff">tryk p</text>\
<defs><marker id="vp" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><polygon points="0,0 7,3 0,6" fill="#9bd4ff"/></marker></defs>\
<text x="240" y="20" class="lb" fill="#cfe3f5" text-anchor="middle">σ_h : σ_l = 2 : 1</text>\
</svg>'; }
