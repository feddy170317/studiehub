/* MMT2 Quiz — Emne T-1: Støbning (Casting). Kilde: T_Q1_Stoebning.tex
   12 spørgsmål · spredning: 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['T_Q1'] = {
  intro: 'Støbning er at hælde smeltet metal i en form og lade det størkne. For at det lykkes skal formen sikre tre ting: at metallet <b>fyldes jævnt uden turbulens</b>, at der er <b>ekstra metal til at kompensere krympningen</b> under størkning, og at det størkner i den <b>rigtige rækkefølge</b> (direktionel størkning).',
  analogi: '⚒ Analogi: En <b>chill</b> er som en isterning i formen — den tvinger størkningen til at ske hurtigere lokalt. En <b>stiger</b> er som et reservoir, der efterfylder formen, mens metallet trækker sig sammen.',
  examQs: [
    'Forklar funktionen af: chills, stigere, løbere, gates, brønde (wells), cups og bobs.',
    'Sammenlign (a) permanent mønster/engangsform vs. (b) engangsmønster/engangsform.',
    'Skel mellem størkningskrympning og termisk kontraktion.',
    'Beskriv to metoder til at styre krympefejl i støbeemner.'
  ],
  svgCap: 'Tværsnit af en typisk sandstøbeform med alle hovedelementer. Metal løber: cup → sprue → brønd → løber → gate → kavitet. Stiger + chill styrer størkningen.',
  svg: castingSVG(),
  mc: [
    { level:'let', q:'Hvad er funktionen af en <b>cup</b> (tragt) øverst i formen?',
      options:['Den feeder krympning under størkning','Den modtager flydende metal og mindsker turbulens ved hældning','Den køler emnet lokalt','Den er indgangen til selve kaviteten'],
      correct:1,
      why:'Cup\'en er det øverste indløb der modtager metallet fra ovnen/sken og leder det roligt videre ned i sprue — den dæmper turbulens fra selve hældningen.' },
    { level:'let', q:'Hvad gør en <b>gate</b>?',
      options:['Lodret kanal ned fra cup','Indgangskanalen til selve emne-kaviteten, der styrer flowhastighed og -retning','Reservoir der efterfylder krympning','Køleindsats for direktionel størkning'],
      correct:1,
      why:'Gaten er det sidste led før kaviteten. Den styrer, hvor hurtigt og i hvilken retning metallet kommer ind i emnet.' },
    { level:'let', q:'I hvilken rækkefølge løber metallet gennem formen?',
      options:['Gate → løber → sprue → cup','Cup → sprue → løber → gate → kavitet','Stiger → chill → kavitet','Sprue → cup → gate → løber'],
      correct:1,
      why:'Metallet hældes i cup\'en, falder ned gennem den lodrette sprue, fordeles vandret af løberen og kommer ind i kaviteten gennem gaten. Brønden sidder i bunden af sprue.' },
    { level:'let', q:'Sandstøbning er et eksempel på …',
      options:['Engangsmønster / engangsform','Permanent mønster / engangsform','Permanent mønster / permanent form','Engangsmønster / permanent form'],
      correct:1,
      why:'Sandstøbning bruger et genanvendeligt mønster (træ/metal/plast) til at lave en form i sand, som knuses efter hver støbning. Altså permanent mønster, men engangsform.' },
    { level:'middel', q:'Hvad er hovedfunktionen af en <b>stiger</b> (riser)?',
      options:['Lede metal ned fra cup til løber-systemet','Reservoir der efterfylder flydende metal under størkning og kompenserer krympning','Køle emnet hurtigere lokalt','Reducere turbulens ved hældning'],
      correct:1,
      why:'Stigeren er et reservoir af flydende metal, der trækkes ind i emnet, mens det størkner og krymper — det forhindrer lunker.' },
    { level:'middel', q:'Hvad er funktionen af en <b>brønd</b> (well) i bunden af sprue?',
      options:['Indgang til selve kaviteten','Forlænger stigeren over formoverfladen','Dæmper metallets kinetiske energi og reducerer turbulens/luftindblanding','Øger den lokale kølehastighed'],
      correct:2,
      why:'Brønden sidder i bunden af den lodrette sprue og dæmper metallets fart, så strømmen ind i løberen bliver rolig — mindre turbulens og indblandet luft.' },
    { level:'middel', q:'En <b>chill</b> bruges til at …',
      options:['øge det hydrostatiske tryk i stigeren','afkøle lokalt hurtigere og fremme direktionel størkning mod stigeren','modtage metal fra ovnen','opløse mønsteret efter støbning'],
      correct:1,
      why:'En chill er en metalindsats der trækker varme hurtigt ud lokalt. Det får den tynde/kritiske sektion til at størkne først, så størkningen vandrer retningsbestemt mod stigeren.' },
    { level:'middel', q:'Hvad er funktionen af en <b>bob</b>?',
      options:['Den styrer flowretningen ind i kaviteten','En forlængelse af stigeren over formoverfladen, der øger det hydrostatiske tryk for bedre tilstrømning','En intern køleindsats','Et filter der fjerner slagger'],
      correct:1,
      why:'Bob\'en er en forhøjning oven på stigeren. Den ekstra metalsøjle øger trykket, så stigeren bedre kan presse metal ind i emnet under størkning.' },
    { level:'middel', q:'Investeringsstøbning (lost-wax) hører til kategorien …',
      options:['Permanent mønster / permanent form','Permanent mønster / engangsform','Engangsmønster / engangsform','Permanent form der genbruges mange gange'],
      correct:2,
      why:'Voksmønsteret smeltes ud (bruges én gang) og keramikformen knuses bagefter — begge er engangs. Det giver høj nøjagtighed (±0,1–0,3 mm) og bruges til fx turbineblade.' },
    { level:'svaer', q:'Hvad er forskellen på <b>størkningskrympning</b> og <b>termisk kontraktion</b>?',
      options:['Det er to navne for det samme','Størkningskrympning sker ved faseskiftet væske→fast (tættere atompakning); termisk kontraktion er yderligere sammentrækning af det FASTE metal under videre afkøling','Termisk kontraktion sker kun i aluminium','Størkningskrympning sker først ved stuetemperatur'],
      correct:1,
      why:'Størkningskrympning sker når metallet bliver fast (atomer pakkes tættere — Al ~6 %, stål ~3 %) og kan give lunker. Termisk kontraktion er den efterfølgende sammentrækning af det faste metal ned til stuetemperatur.' },
    { level:'svaer', q:'Et støbegods viser <b>lunker i den tykkeste sektion</b>. Hvorfor netop der?',
      options:['Gasporøsitet fra fugt i formen','Fordi den tykke sektion størkner SIDST og bliver afskåret fra tilgang til flydende metal','Kolde samlinger fra for lav temperatur','Varmrevner fra for hurtig køling'],
      correct:1,
      why:'Tyk sektion = stort modul (V/A) = længst størkningstid. Når den størkner til sidst, kan intet flydende metal nå ind og efterfylde krympningen → lunke. Løsning: stiger over de tykke sektioner + chills.' },
    { level:'svaer', q:'Hvad beskriver <b>Chvorinovs regel</b> t<sub>s</sub> = C·(V/A)², og hvorfor er den vigtig for stigere?',
      options:['Krympning ∝ temperatur; bruges til trækallowancer','Størkningstiden ∝ kvadratet på modulet (V/A); stigeren skal have STØRRE modul end emnet, så den størkner sidst og kan efterfylde','Trykfaldet gennem løber-systemet; bestemmer gate-størrelse','Gassens opløselighed; bestemmer udluftning'],
      correct:1,
      why:'Størkningstiden vokser med (V/A)². For at stigeren kan efterfylde emnet, skal den størkne EFTER emnet — derfor dimensioneres den med et større modul (V/A) end den tykkeste emnesektion.' }
  ],
  cards: [
    { q:'Cup → sprue → løber → gate: hvad gør hver?', a:'Cup: modtager metal, mindsker turbulens. Sprue: lodret kanal ned. Løber (runner): vandret fordeling. Gate: indgang til kaviteten, styrer flowhastighed og -retning.' },
    { q:'Åben vs. blind stiger?', a:'Åben stiger går op til formoverfladen (synlig). Blind stiger er lukket inde i formen. Begge feeder krympning; en bob øger trykket.' },
    { q:'To metoder mod krympefejl?', a:'(1) Stigere placeret over tykke sektioner, dimensioneret med Chvorinov. (2) Chills der fremmer direktionel størkning fra tynd sektion mod stiger.' },
    { q:'Hvorfor krymper Al mere end stål ved størkning?', a:'Størkningskrympning: Al ~6 %, stål ~3 %, pga. tættere atompakning i fast fase. Al kræver derfor mere efterfyldning fra stigere.' }
  ]
};

function castingSVG(){ return '\
<svg viewBox="0 0 520 330" width="520" height="330" role="img" aria-label="Tvaersnit af stoebeform">\
<style>.lbl{font:600 11px Nunito,sans-serif} .lblb{font:700 11px Nunito,sans-serif}</style>\
<rect x="40" y="40" width="440" height="250" rx="6" fill="#2c3038" stroke="#4b5360" stroke-width="2"/>\
<rect x="200" y="120" width="150" height="120" rx="4" fill="#0f1115" stroke="#62b0e0" stroke-width="2"/>\
<text x="275" y="185" text-anchor="middle" class="lblb" fill="#cdd3da">Emne (kavitet)</text>\
<polygon points="70,55 120,55 110,85 80,85" fill="#5a3a18" stroke="#ff6a00" stroke-width="1.5"/>\
<text x="95" y="50" text-anchor="middle" class="lblb" fill="#ffb627">Cup</text>\
<rect x="80" y="85" width="30" height="120" fill="#3a2a14" stroke="#ff6a00" stroke-width="1.5"/>\
<text x="118" y="150" class="lbl" fill="#ece0cd">Sprue</text>\
<rect x="65" y="205" width="60" height="28" fill="#5a3a18" stroke="#ff6a00" stroke-width="1.5"/>\
<text x="95" y="252" text-anchor="middle" class="lblb" fill="#ffb627">Brønd</text>\
<rect x="125" y="210" width="75" height="16" fill="#3a2a14" stroke="#ff6a00" stroke-width="1.5"/>\
<text x="150" y="248" class="lbl" fill="#ece0cd">Løber</text>\
<rect x="200" y="206" width="14" height="22" fill="#7a2418" stroke="#ff3a1d" stroke-width="1.5"/>\
<text x="172" y="200" class="lblb" fill="#ff5a4d">Gate</text>\
<rect x="350" y="95" width="40" height="145" fill="#16344a" stroke="#62b0e0" stroke-width="1.5"/>\
<text x="396" y="170" class="lblb" fill="#62b0e0">Stiger</text>\
<rect x="344" y="78" width="52" height="22" fill="#1d4763" stroke="#62b0e0" stroke-width="1.5"/>\
<text x="370" y="72" text-anchor="middle" class="lblb" fill="#9ad0f0">Bob</text>\
<rect x="255" y="240" width="45" height="22" fill="#155e63" stroke="#3fd0d6" stroke-width="1.5"/>\
<text x="277" y="278" text-anchor="middle" class="lblb" fill="#3fd0d6">Chill</text>\
<path d="M95 85 L95 78" stroke="#ffb627" stroke-width="2" marker-end="url(#ar)"/>\
<path d="M125 218 L195 218" stroke="#ffb627" stroke-width="2" marker-end="url(#ar)"/>\
<defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><polygon points="0,0 7,3 0,6" fill="#ffb627"/></marker></defs>\
</svg>'; }
