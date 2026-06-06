/* MMT2 Quiz — Emne T-4: Plast og sprøjtestøbning. Kilde: T_Q4_Plast_Sprojtestoebning.tex
   12 spørgsmål · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['T_Q4'] = {
  intro: 'Sprøjtestøbning er plastens svar på metalstøbning: smeltet <b>termoplast</b> sprøjtes under højt tryk ind i et lukket præcisionsværktøj og størkner til emnet. <b>Ekstrudering</b> er derimod kontinuerlig — som at presse tandpasta ud — og giver et profil med konstant tværsnit (rør, plader, film).',
  analogi: '⚒ Analogi: sprøjtestøbning = en tandlæges aftryksmasse der presses ind i en form, størkner og holder formen præcist (bare ved meget højere tryk, 100–200 MPa). Ekstrudering = tandpasta ud af tuben → endeløst profil.',
  examQs: [
    'Hvad er sprøjtestøbning, og hvilke emner bruges det til?',
    'Beskriv ekstrudering — forskel fra sprøjtestøbning i proces og anvendelse.',
    'Hovedkomponenterne i et sprøjtestøbningssystem (maskine + værktøj).',
    'Økonomiske fordele/ulemper ved sprøjtestøbning ift. batchstørrelse.',
    'Unfilled vs. fiberfyldt polymer (ABS vs. 40 % glas-ABS).'
  ],
  svgCap: 'Sprøjtestøbemaskine: granulat fra hopper → opvarmes/transporteres af skruen i tønden → presses gennem nozzle og sprue/runner/gate ind i den lukkede form, hvor emnet størkner og udstødes.',
  svg: imSVG(),
  mc: [
    { level:'let', q:'Hvad er <b>sprøjtestøbning</b>?',
      options:['Kontinuerlig udpresning af et profil','Smeltet termoplast sprøjtes under tryk ind i et lukket værktøj og størkner til emnet','Pulver presses og sintres','Plade bøjes til form'],
      correct:1,
      why:'Sprøjtestøbning er en cyklisk proces: plastgranulat smeltes, sprøjtes under højt tryk ind i en lukket form, størkner og udstødes. Bruges til komplekse 3D-emner i store mængder.' },
    { level:'let', q:'Hvad er funktionen af <b>hopper</b>?',
      options:['At køle emnet','At opbevare og tilføre granuleret plast til tønden','At skubbe emnet ud','At forbinde maskine og form'],
      correct:1,
      why:'Hopperen er tragten der opbevarer plastgranulatet og fører det ned i tønden, hvor skruen smelter og transporterer det.' },
    { level:'let', q:'Hvad er det typiske output fra <b>ekstrudering</b>?',
      options:['Komplekse 3D-emner i en lukket form','Et kontinuerligt profil med konstant tværsnit (rør, plade, film)','Sintrede metaldele','Bøjede plader'],
      correct:1,
      why:'Ekstrudering presser smelten kontinuerligt gennem en die → endeløst profil med konstant tværsnit: rør, vinduesrammer, film, ledningsisolering.' },
    { level:'let', q:'Hvilke emner laver man typisk med sprøjtestøbning?',
      options:['Rør og plader i endeløse længder','Komplekse 3D-emner i store mængder (legoklodser, kabinetter, covers)','Store svejste konstruktioner','Håndlaminerede bådskrog'],
      correct:1,
      why:'Sprøjtestøbning passer til komplekse 3D-emner i høje styktal: legoklodser, lampehuse, mobilcovers, gear og brackets — pga. korte cyklustider og præcis form.' },
    { level:'middel', q:'Hvad er skruens (screw) dobbeltrolle i en sprøjtestøbemaskine?',
      options:['Kun at opvarme','Den transporterer, komprimerer og blander smelten — OG fungerer som stempel under selve injektionen','Kun at køle emnet','At skubbe emnet ud af formen'],
      correct:1,
      why:'Skruen roterer for at transportere/smelte/blande plasten fremad, og skubbes derefter frem som et stempel for at injicere doseringen ind i formen.' },
    { level:'middel', q:'Sprøjtestøbning vs. ekstrudering — hvad gælder for processen?',
      options:['Begge er kontinuerlige','Sprøjtestøbning er diskontinuerlig (cyklus); ekstrudering er kontinuerlig','Begge er cykliske','Sprøjtestøbning er kontinuerlig'],
      correct:1,
      why:'Sprøjtestøbning kører i cyklusser (luk form → injicér → køl → udstød), mens ekstrudering kører kontinuerligt. Sprøjtestøbning bruger også meget højere tryk (100–200 MPa).' },
    { level:'middel', q:'Hvad gælder for sprøjtestøbningens økonomi vs. batchstørrelse?',
      options:['Lav tooling-pris, høj stykpris','Høj tooling-pris (form), men lav per-styk-pris → break-even typisk ved >5.000–10.000 stk.','Altid billigst, uanset antal','Egnet til 1-10 stk.'],
      correct:1,
      why:'En form koster typisk 50.000–1.000.000 kr, men stykprisen er meget lav (sekunders cyklus, billigt materiale). Det betaler sig først ved store serier; til <100 stk. er fx 3D-print/CNC billigere.' },
    { level:'middel', q:'Hvordan påvirker 40 % glasfiber ABS sammenlignet med ufyldt ABS?',
      options:['Lavere styrke og stivhed','Højere styrke, stivhed og varmeformstabilitet — men anisotrop krympning og abrasivt slid på værktøj','Ingen ændring','Bedre overfladefinish'],
      correct:1,
      why:'Glasfiber hæver trækstyrke (~45 → ~130 MPa) og stivhed (2 → 8–12 GPa) samt varmebestandighed. Men fibrene gør krympningen anisotrop (warpage-risiko) og er abrasive på skrue/form.' },
    { level:'middel', q:'Hvad er funktionen af <b>nozzle</b>?',
      options:['Opbevare granulat','Forbinde maskinen og formen og kanalisere smelten ind i sprue','Køle emnet','Skubbe emnet ud'],
      correct:1,
      why:'Nozzlen er overgangen mellem tøndens forende og formen. Den leder smelten ind i formens sprue → runner → gate → kavitet.' },
    { level:'svaer', q:'Et glasfiberforstærket emne (PA6 + 30 % GF) warper (vrider sig) efter udstødning. Hvad er hovedårsagen?',
      options:['For lav smeltetemperatur','Glasfibrene orienteres i flowretningen → lavere krympning i flowretning end på tværs → differentiel (uensartet) krympning → vridning','For meget køletid','Forkert farvepigment'],
      correct:1,
      why:'Fibrene lægger sig efter flowet. Krympningen bliver derfor retningsafhængig (mindre langs fibrene, mere på tværs). Den ubalancerede krympning trækker emnet skævt = warpage.' },
    { level:'svaer', q:'Hvilken procesimplikation har glasfiberens <b>abrasivitet</b>?',
      options:['Den smører værktøjet','Den slider hurtigt på skrue og form → kræver hærdede stålforme og evt. wolframcarbid-skruer','Den sænker smeltetemperaturen','Den fjerner behovet for køling'],
      correct:1,
      why:'Glasfibre er hårde og slibende. Over tid eroderer de skrue, cylinder og form → man bruger hærdet/coated værktøjsstål og slidstærke (WC) skrueelementer for at holde levetiden oppe.' },
    { level:'svaer', q:'Hvilke procesoptimeringer reducerer warpage i et fiberfyldt sprøjtestøbt emne?',
      options:['Øg blot indsprøjtningstrykket','Balanceret gate-placering, ensartet vægtykkelse, optimeret køleforløb og symmetrisk emnegeometri','Tilsæt mere glasfiber','Sænk formtemperaturen drastisk ét sted'],
      correct:1,
      why:'Warpage skyldes ubalanceret/retningsafhængig krympning. Modvirkes ved balanceret fyldning (gate-placering), ensartet vægtykkelse (jævn afkøling), styret køleforløb og symmetrisk geometri.' }
  ],
  cards: [
    { q:'Sprøjtestøbning vs. ekstrudering?', a:'Sprøjtestøbning: diskontinuerlig cyklus, 3D-emner i lukket form, højt tryk (100–200 MPa), dyr form (kabinetter, gear). Ekstrudering: kontinuerlig, profiler med konstant tværsnit (rør, film), moderat tryk.' },
    { q:'Hovedkomponenter i et sprøjtestøbesystem?', a:'Hopper (granulat), tønde (opvarmer), skrue (transporterer + stempel), nozzle (overgang), form (cavity+core), sprue/runner/gate (kanaler), udkasterpinde, og temperering (vandkanaler).' },
    { q:'Økonomi vs. batchstørrelse?', a:'Høj formomkostning (50k–1 mio. kr), men meget lav stykpris (sek. cyklus). Break-even ~5.000–10.000 stk. Under ~100 stk.: vælg 3D-print/CNC i stedet.' },
    { q:'Ufyldt vs. glasfiberfyldt (ABS vs. 40 % GF)?', a:'GF hæver styrke (~45→130 MPa), stivhed (2→8–12 GPa) og varmestabilitet. Men: anisotrop krympning (warpage), abrasivt slid (kræver hærdet værktøj), mere mat overflade.' }
  ]
};

function imSVG(){ return '\
<svg viewBox="0 0 520 220" width="520" height="220" role="img" aria-label="Sproejtestoebemaskine">\
<style>.b{font:700 10px Nunito,sans-serif;fill:#ece0cd} .s{font:600 9px Nunito,sans-serif;fill:#9aa1ab}</style>\
<polygon points="60,40 110,40 100,95 70,95" fill="#5a3a18" stroke="#ff6a00" stroke-width="1.5"/>\
<text x="85" y="34" text-anchor="middle" class="b" fill="#ffb627">Hopper</text>\
<rect x="60" y="95" width="250" height="48" rx="4" fill="#566069" stroke="#cdd3da" stroke-width="2"/>\
<text x="150" y="86" class="b">Tønde (barrel)</text>\
<g stroke="#2c3038" stroke-width="3">\
<line x1="75" y1="105" x2="90" y2="133"/><line x1="95" y1="105" x2="110" y2="133"/><line x1="115" y1="105" x2="130" y2="133"/><line x1="135" y1="105" x2="150" y2="133"/><line x1="155" y1="105" x2="170" y2="133"/><line x1="175" y1="105" x2="190" y2="133"/><line x1="195" y1="105" x2="210" y2="133"/><line x1="215" y1="105" x2="230" y2="133"/><line x1="235" y1="105" x2="250" y2="133"/><line x1="255" y1="105" x2="270" y2="133"/></g>\
<text x="180" y="160" class="s">skrue (transport + stempel)</text>\
<g stroke="#ff5a4d" stroke-width="3"><line x1="120" y1="150" x2="150" y2="150"/><line x1="180" y1="150" x2="210" y2="150"/><line x1="240" y1="150" x2="270" y2="150"/></g>\
<text x="195" y="176" text-anchor="middle" class="s" fill="#ff8a80">varmeelementer</text>\
<polygon points="310,108 340,114 340,124 310,130" fill="#7a6a2a" stroke="#cdd3da" stroke-width="1.5"/>\
<text x="325" y="104" class="s" fill="#ffd27a">nozzle</text>\
<rect x="340" y="55" width="150" height="115" rx="4" fill="#1a2b3a" stroke="#62b0e0" stroke-width="2"/>\
<rect x="370" y="85" width="90" height="55" rx="3" fill="#0f1115" stroke="#9ad0f0" stroke-width="1.5"/>\
<text x="415" y="117" text-anchor="middle" class="b" fill="#9ad0f0">Emne</text>\
<text x="415" y="186" text-anchor="middle" class="b" fill="#62b0e0">Støbeform (mold)</text>\
<line x1="340" y1="119" x2="370" y2="113" stroke="#ff8a3d" stroke-width="2.5"/>\
<text x="338" y="74" class="s" fill="#ff8a3d">sprue/gate</text>\
<line x1="40" y1="119" x2="58" y2="119" stroke="#ff6a00" stroke-width="3" marker-end="url(#im)"/>\
<defs><marker id="im" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><polygon points="0,0 8,3 0,6" fill="#ff6a00"/></marker></defs>\
<text x="20" y="135" class="s" fill="#ff8a3d">tryk</text>\
</svg>'; }
