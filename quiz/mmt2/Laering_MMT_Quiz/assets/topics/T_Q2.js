/* MMT2 Quiz — Emne T-2: Pulvermetallurgi. Kilde: T_Q2_Pulvermetallurgi.tex
   12 spørgsmål · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['T_Q2'] = {
  intro: 'Pulvermetallurgi (PM) er en proces hvor <b>metalpulver presses til form og opvarmes (sintres)</b> for at binde partiklerne sammen — uden at smelte metallet fuldt ud. Det giver præcise "net-shape"-emner med minimalt spild, ideelt til store serier.',
  analogi: '⚒ Ler-analogi: forestil dig vådt ler (metalpulver + bindemiddel). Du former det (presning → "grøn kompakt"), lader det tørre/binde (sintring ved høj temp.) og får et stærkt emne. Metalpulver fungerer på samme måde.',
  examQs: [
    'Definér en "green compact" og dens rolle i PM-processen.',
    'Hvordan påvirker kompaktionstæthed de mekaniske egenskaber? (2 eksempler)',
    'Sammenlign PM (pulvermetallurgi) og PF (pulverforgning).',
    'Forklar net-shape og near-net-shape og deres økonomiske betydning.'
  ],
  svgCap: 'PM-procesforløb: pulver → blanding med bindemiddel → presning → grøn kompakt (porøs, skrøbelig) → sintring i ovn → færdigt, tæt emne. Sintringen er det kritiske trin hvor egenskaberne defineres.',
  svg: pmSVG(),
  mc: [
    { level:'let', q:'Hvad er en <b>grøn kompakt</b> (green compact)?',
      options:['Det færdige, sintrede emne','Det sammenpressede pulver INDEN sintring — formfast, men porøst og svagt','Det smeltede metal i formen','Et bindemiddel'],
      correct:1,
      why:'Den grønne kompakt er pulveret efter presning, men før sintring. Den holder formen (mekanisk sammenfiltring + bindemiddel), men er porøs (10–20 %) og kan smuldre. Den er "formgivende mellemtrin".' },
    { level:'let', q:'Hvad er <b>sintring</b>?',
      options:['Fuld opsmeltning af metallet','Opvarmning UNDER smeltepunktet så atomer diffunderer og binder partiklerne sammen','Presning af pulveret','Afkøling i vand'],
      correct:1,
      why:'Sintring opvarmer den grønne kompakt under smeltepunktet. Atomdiffusion danner metalliske bindinger ved partikelkontakterne → porositeten falder, styrken stiger. Metallet smeltes IKKE helt.' },
    { level:'let', q:'Hvad betyder <b>net-shape</b>?',
      options:['Emnet kræver omfattende efterbearbejdning','Emnet er færdigt uden (eller næsten uden) yderligere bearbejdning','Emnet skal smeltes om','Emnet har et net-mønster'],
      correct:1,
      why:'Net-shape = emnet kommer ud i (næsten) færdig geometri direkte fra processen → nul/minimalt materialespild og korte cyklustider. PM egner sig godt hertil pga. præcis form fra presseværktøjet.' },
    { level:'let', q:'Hvilke produkter er PM typisk velegnet til?',
      options:['Store enkeltstykker som skibsskrog','Gear, lejer og filtre i store serier','Svejste rørkonstruktioner','Håndlavede prototyper i ét stk.'],
      correct:1,
      why:'PM er ideelt til små, præcise dele i store serier (gear, selvsmørende lejer, metalfiltre), hvor den høje tooling-pris amortiseres over mange ens emner.' },
    { level:'middel', q:'Hvordan påvirker højere <b>kompaktionstryk</b> det færdige emne?',
      options:['Mere porøsitet, svagere emne','Højere grøn densitet → mindre porositet efter sintring → bedre mekaniske egenskaber','Ingen effekt på egenskaberne','Lavere trækstyrke'],
      correct:1,
      why:'Mere tryk → tættere pakning → højere grøn densitet → færre porer efter sintring → højere trækstyrke, hårdhed, udmattelsesliv og ledningsevne. Fx kan trækstyrken gå fra ~200 til ~700 MPa.' },
    { level:'middel', q:'Hvorfor reducerer porer de mekaniske egenskaber i et sintret emne?',
      options:['Porer øger styrken','Porer fungerer som indre spændingskoncentratorer og reducerer det bærende tværsnitsareal','Porer leder varme bedre','Porer fjerner restspændinger'],
      correct:1,
      why:'Hver pore er en lille kærv (spændingskoncentrator) og fjerner bærende areal. Især udmattelseslivet rammes hårdt, fordi revner starter ved porer.' },
    { level:'middel', q:'PM vs. pulverforgning (PF) — hvad gælder for densitet?',
      options:['PM >99 %, PF 80 %','PM 80–95 % (5–20 % porer); PF >99 % (næsten massiv, <1 % porer)','Begge er præcis 100 %','PF er altid mere porøs end PM'],
      correct:1,
      why:'Standard-PM lander på 80–95 % af teoretisk densitet. PF tilføjer et varmt smedetrin på en sintret præform → >99 % densitet og styrke som smedet massivt stål (til dynamisk belastede bildele).' },
    { level:'middel', q:'Hvornår er PM økonomisk fordelagtigt?',
      options:['Ved få, store emner','Ved store serier — høj tooling-pris, men meget lav per-styk-pris (typisk >10.000 stk.)','Kun ved prototyper','Når materialespild er ligegyldigt'],
      correct:1,
      why:'Presseværktøjet er dyrt, men per-styk-prisen er meget lav (minimalt spild, hurtig cyklus). Det betaler sig først ved store volumener; ved små serier eller store emner er støbning/smedning billigere.' },
    { level:'middel', q:'Hvad er forskellen på net-shape og <b>near-net-shape</b>?',
      options:['De er det samme','Near-net-shape kræver minimale efterbehandlinger (kalibrering, slibning) for tolerance/finish; net-shape er helt færdigt','Near-net-shape kræver omsmeltning','Net-shape kræver mere efterarbejde'],
      correct:1,
      why:'Net-shape = ingen efterbearbejdning. Near-net-shape = få, små operationer (kalibrering, let slibning) for at ramme tolerance eller overfladekvalitet — stadig med lavt spild. Mere praktisk for komplekse geometrier.' },
    { level:'svaer', q:'Hvad er den typiske <b>grønne densitet</b> for en kompakt før sintring?',
      options:['30–40 % af teoretisk','75–85 % af teoretisk','Præcis 100 %','Under 50 %'],
      correct:1,
      why:'Grøn densitet ligger typisk på 75–85 % af den teoretiske massive tæthed. Sintringen reducerer derefter den resterende porositet yderligere.' },
    { level:'svaer', q:'Et PM-tandhjul fejler ved udmattelsesbrud i tandroden; analyse viser 12 % porositet. Hvilke procesændringer hjælper?',
      options:['Sænk kompaktionstrykket','Øg kompaktionstryk / brug pulverforgning (PF) / shot peening / optimér sintring — alt der sænker porositet eller indfører trykrestspændinger','Tilsæt mere bindemiddel','Skift til større pulverkorn'],
      correct:1,
      why:'Porerne er spændingskoncentratorer. Løsninger: højere tryk (lavere porositet), PF (nær-fuld tæthed), shot peening (trykrestspændinger i overfladen forsinker revnestart) og bedre sintringstid/-temperatur.' },
    { level:'svaer', q:'Hvilken kornstruktur har et PF-emne sammenlignet med et standard-PM-emne?',
      options:['Begge er ens og isotrope','PM: isotrop, findelt; PF: orienteret kornstruktur i smedningsretningen (som smedet stål)','PF er altid mere porøst','PM har orienterede korn'],
      correct:1,
      why:'Standard-PM giver en isotrop, findelt struktur. PF\'s varme smedetrin deformerer og orienterer kornene i smedningsretningen → retningsbestemte, smedede egenskaber og næsten fuld tæthed.' }
  ],
  cards: [
    { q:'PM-processen trin for trin?', a:'Pulverproduktion → blanding (m. bindemiddel) → presning (compaction) → grøn kompakt (porøs) → sintring i ovn → færdigt, tæt emne. Sintringen definerer egenskaberne.' },
    { q:'Hvordan påvirker densitet egenskaberne? (2 eks.)', a:'Lav densitet/høj porositet → lav trækstyrke (~200 MPa) og kort udmattelsesliv. Høj densitet → høj styrke (~700 MPa) og næsten massiv el./termisk ledningsevne.' },
    { q:'PM vs. PF?', a:'PM: presning+sintring, 80–95 % densitet, isotrop, net-shape, lav stykpris (gear/lejer). PF: sintret præform + varm smedning, >99 % densitet, orienteret struktur, høj styrke (dynamiske bildele).' },
    { q:'Net-shape vs. near-net-shape økonomi?', a:'Net-shape: nul efterbehandling, lavest spild. Near-net-shape: få efterbehandlinger for tolerance/finish. Begge holder spild lavt — afgørende fordel ved dyre materialer og store serier.' }
  ]
};

function pmSVG(){ return '\
<svg viewBox="0 0 520 170" width="520" height="170" role="img" aria-label="Pulvermetallurgi procesforloeb">\
<style>.b{font:700 10px Nunito,sans-serif;fill:#ece0cd} .s{font:600 9px Nunito,sans-serif}</style>\
<defs><marker id="pa" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><polygon points="0,0 8,3 0,6" fill="#ff8a3d"/></marker></defs>\
<g>\
<rect x="12" y="55" width="68" height="52" rx="6" fill="#262a32" stroke="#566069" stroke-width="1.5"/>\
<text x="46" y="78" text-anchor="middle" class="b">Pulver-</text><text x="46" y="92" text-anchor="middle" class="b">produktion</text>\
</g>\
<line x1="80" y1="81" x2="98" y2="81" stroke="#ff8a3d" stroke-width="2.5" marker-end="url(#pa)"/>\
<g>\
<rect x="100" y="55" width="68" height="52" rx="6" fill="#262a32" stroke="#566069" stroke-width="1.5"/>\
<text x="134" y="78" text-anchor="middle" class="b">Blanding</text><text x="134" y="92" text-anchor="middle" class="b">(binder)</text>\
</g>\
<line x1="168" y1="81" x2="186" y2="81" stroke="#ff8a3d" stroke-width="2.5" marker-end="url(#pa)"/>\
<g>\
<rect x="188" y="55" width="68" height="52" rx="6" fill="#262a32" stroke="#566069" stroke-width="1.5"/>\
<text x="222" y="78" text-anchor="middle" class="b">Presning</text><text x="222" y="92" text-anchor="middle" class="b">(tryk)</text>\
</g>\
<line x1="256" y1="81" x2="274" y2="81" stroke="#ff8a3d" stroke-width="2.5" marker-end="url(#pa)"/>\
<g>\
<rect x="276" y="55" width="68" height="52" rx="6" fill="#3a2a14" stroke="#ff6a00" stroke-width="1.5"/>\
<text x="310" y="78" text-anchor="middle" class="b">Grøn</text><text x="310" y="92" text-anchor="middle" class="b">kompakt</text>\
<text x="310" y="124" text-anchor="middle" class="s" fill="#9aa1ab">porøs, skrøbelig</text>\
</g>\
<line x1="344" y1="81" x2="362" y2="81" stroke="#ff8a3d" stroke-width="2.5" marker-end="url(#pa)"/>\
<g>\
<rect x="364" y="55" width="68" height="52" rx="6" fill="#5a3a18" stroke="#ff6a00" stroke-width="1.5"/>\
<text x="398" y="78" text-anchor="middle" class="b">Sintring</text><text x="398" y="92" text-anchor="middle" class="b">(ovn)</text>\
</g>\
<line x1="432" y1="81" x2="450" y2="81" stroke="#ff8a3d" stroke-width="2.5" marker-end="url(#pa)"/>\
<g>\
<rect x="452" y="55" width="60" height="52" rx="6" fill="#16344a" stroke="#62b0e0" stroke-width="1.5"/>\
<text x="482" y="78" text-anchor="middle" class="b">Færdigt</text><text x="482" y="92" text-anchor="middle" class="b">emne</text>\
<text x="482" y="124" text-anchor="middle" class="s" fill="#9ad0f0">stærkt, tæt</text>\
</g>\
<text x="260" y="28" text-anchor="middle" class="b" fill="#ffb627" font-size="12">Pulvermetallurgi — sintring definerer egenskaberne</text>\
</svg>'; }
