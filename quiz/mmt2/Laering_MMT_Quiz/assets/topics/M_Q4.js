/* MMT2 Quiz — Emne M-4: Korrosion. Kilde: M_Q4_Korrosion.tex
   12 spørgsmål · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['M_Q4'] = {
  intro: 'Korrosion er metal der "goes back to nature" — det vender tilbage til en lavere energitilstand (oxid/hydroxid), som det også havde i ertsform. <b>Tør korrosion</b>: direkte reaktion med gas ved høj temp. (kan give beskyttende oxidfilm, fx Al₂O₃). <b>Våd korrosion</b> (elektrokemisk): kræver en elektrolyt og kører som et batteri med en anode (metallet opløses) og en katode.',
  analogi: '⚒ Analogi: en rusten søm i havet er som et batteri — anoden (den aktive del) "ofrer sig", elektroner strømmer til katoden (det ædle sted), og metallet opløses langsomt.',
  examQs: [
    'Definér tør og våd korrosion + de elektrokemiske mekanismer ved våd korrosion.',
    'Den galvaniske spændingsrække og dens praktiske anvendelse.',
    'Mindst tre former for korrosion og deres årsager.',
    'Hvordan materialevalg, overfladebehandling og konstruktion reducerer korrosion.',
    'Forskellen på almindeligt stål og rustfrit stål mht. korrosionsbestandighed.'
  ],
  svgCap: 'Elektrokemisk korrosionscelle: anoden oxideres (Fe → Fe²⁺ + 2e⁻, metallet opløses), katoden reduceres (O₂ + H₂O + e⁻). Elektroner løber gennem metallet, ioner gennem elektrolytten.',
  svg: corrSVG(),
  mc: [
    { level:'let', q:'Hvad sker der på <b>anoden</b> i en korrosionscelle?',
      options:['Reduktion — metallet beskyttes','Oxidation — metallet opløses (fx Fe → Fe²⁺ + 2e⁻)','Intet, anoden er inaktiv','Ilt forbruges'],
      correct:1,
      why:'Anoden er stedet for oxidation: metallet afgiver elektroner og opløses (Fe → Fe²⁺ + 2e⁻). Katoden er stedet for reduktion (O₂ + 2H₂O + 4e⁻ → 4OH⁻).' },
    { level:'let', q:'Hvad kræver <b>våd</b> (elektrokemisk) korrosion?',
      options:['Høj temperatur og ingen væske','En elektrolyt (vand + ioner)','Et vakuum','Kun ren ilt'],
      correct:1,
      why:'Våd korrosion kræver en ionledende elektrolyt, en anode, en katode og en elektrisk forbindelse — præcis som et batteri. Tør korrosion sker derimod direkte med gas ved høj temp. uden væske.' },
    { level:'let', q:'Hvad gør et metal mere <b>ædelt</b> i den galvaniske spændingsrække?',
      options:['Det korroderer hurtigere','Det er mere modstandsdygtigt mod korrosion','Det er lettere','Det leder ikke strøm'],
      correct:1,
      why:'Ædle metaller (Cu, Pt, Au, passiveret rustfrit) korroderer langsomt. Aktive metaller (Mg, Zn, Al) oxideres let. I galvanisk kontakt bliver det mindre ædle metal anode og opløses.' },
    { level:'let', q:'Hvorfor ruster aluminium ikke synligt i de fleste miljøer?',
      options:['Det er et ædelmetal som guld','Det danner spontant en tynd, selvhelende Al₂O₃-film der beskytter','Det indeholder krom','Det er for hårdt til at korrodere'],
      correct:1,
      why:'Aluminium er faktisk meget reaktivt, men danner straks et tæt, selvhelende Al₂O₃-lag (~4 nm) der standser videre angreb — en beskyttende "tør" oxidfilm.' },
    { level:'middel', q:'To uens metaller i elektrisk kontakt i en elektrolyt — hvad sker der?',
      options:['Begge beskyttes','Galvanisk korrosion: det mindre ædle metal korroderer accelereret','Det ædle metal opløses','Ingenting uden opvarmning'],
      correct:1,
      why:'Galvanisk korrosion: fx en stålbolt i et aluminiumsprofil i havmiljø. Det mindre ædle metal (her Al/Fe afhængigt af parret) bliver anode og ofres. Undgås med isolationsskiver / ens metaller.' },
    { level:'middel', q:'Hvad er <b>pittingkorrosion</b>?',
      options:['Jævnt angreb over hele overfladen','Lokal nedbrydning af passivfilmen (typisk af chloridioner) → punktvise huller, svær at opdage','Korrosion kun ved svejsninger','Revner fra mekanisk last'],
      correct:1,
      why:'Pitting er punktvist gennembrud af oxid-/passivfilmen, ofte pga. chlorid. Det er farligt fordi det er lokalt og svært at se — typisk problem for rustfrit stål i klorholdigt vand.' },
    { level:'middel', q:'Hvad er princippet i <b>katodisk beskyttelse</b> med offeranode?',
      options:['Man maler konstruktionen','Et mindre ædelt metal (Zn/Mg) fastgøres og korroderer i stedet for konstruktionen','Man opvarmer stålet','Man tilsætter chlorid'],
      correct:1,
      why:'En offeranode af Zn eller Mg er mindre ædel end stålet og bliver derfor anode — den ofrer sig, mens stålet gøres katodisk og beskyttes. Bruges på skibsskrog, rørledninger og havplatforme.' },
    { level:'middel', q:'Hvorfor beskytter rusten på almindeligt stål IKKE mod videre korrosion?',
      options:['Rust er et ædelmetal','Fe₂O₃-rust er løs og porøs → ilt/vand når fortsat ind, og laget vokser igennem materialet','Rust danner en tæt film som på aluminium','Rust leder ikke strøm'],
      correct:1,
      why:'Modsat den tætte Cr₂O₃/Al₂O₃-film er jernrust (Fe₂O₃·xH₂O) løs og porøs. Den hindrer ikke adgang for ilt og vand, så korrosionen fortsætter indad.' },
    { level:'middel', q:'Hvad er <b>spaltekorrosion</b> (crevice corrosion)?',
      options:['Korrosion på en fri, åben overflade','I smalle spalter udtømmes ilten → lokalt anodisk miljø → metallet opløses i spalten','Korrosion kun ved høj temperatur','Korrosion forårsaget af UV-lys'],
      correct:1,
      why:'I trange spalter (under pakninger, i overlap) bruges ilten op og kan ikke fornyes → spalten bliver anode i forhold til den iltede flade udenfor → lokalt angreb.' },
    { level:'svaer', q:'Den samlede rust-reaktion for jern i aereret vand er:',
      options:['Fe + H₂ → FeH₂','4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃ → 2Fe₂O₃·3H₂O (rust)','Fe + Cl₂ → FeCl₂','Fe → Fe³⁺ + 3e⁻ (slut)'],
      correct:1,
      why:'Anode- og katodereaktionerne kombineres til: 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃, som dehydrerer til hydratiseret Fe₂O₃ (rust). Det kræver både ilt og vand.' },
    { level:'svaer', q:'Hvad gør rustfrit stål korrosionsbestandigt, og hvad er minimumskravet?',
      options:['Et tykt malingslag','>10,5 % Cr danner en tynd, selvhelende Cr₂O₃-passivfilm','Et højt kulstofindhold','Tilsætning af bly'],
      correct:1,
      why:'Mindst 10,5 % krom danner en sammenhængende, selvhelende Cr₂O₃-film (få nm) der passiverer overfladen. Mo (fx i 316) øger desuden modstanden mod pitting (højere PREN-tal).' },
    { level:'svaer', q:'Austenitisk rustfrit stål under trækspænding i klorholdigt miljø er særligt udsat for:',
      options:['Jævn (uniform) korrosion','Spændingskorrosion (SCC) — revner vokser ved kombinationen af trækspænding + korrosivt klormiljø','Tør oxidation','Galvanisk beskyttelse'],
      correct:1,
      why:'Spændingskorrosion (Stress Corrosion Cracking) opstår når trækspænding + et specifikt korrosivt miljø virker sammen. Austenitisk rustfrit stål i klorider er et klassisk, farligt SCC-par.' }
  ],
  cards: [
    { q:'Anode vs. katode (reaktioner)?', a:'Anode = oxidation, metallet opløses: Fe → Fe²⁺ + 2e⁻. Katode = reduktion: O₂ + 2H₂O + 4e⁻ → 4OH⁻. Elektroner løber gennem metallet, ioner gennem elektrolytten.' },
    { q:'Fem korrosionsformer?', a:'Galvanisk (uens metaller), pitting (lokal, chlorid), spalte (iltudtømning), spændingskorrosion SCC (spænding + miljø), erosionskorrosion (strømmende væske fjerner oxidlag).' },
    { q:'Fire forebyggelsesstrategier?', a:'Materialevalg (rustfrit/Ti/coating), overfladebehandling (galvanisering/maling/anodisering), katodisk beskyttelse (offeranode), og konstruktion (undgå spalter & uens metalkontakt, god afvanding).' },
    { q:'Galvanisering — hvordan virker den?', a:'Zink-belægning på stål virker dobbelt: barriere + offeranode. Zink er mindre ædel end jern, så selv ved en ridse ofrer zinken sig og beskytter jernet katodisk.' }
  ]
};

function corrSVG(){ return '\
<svg viewBox="0 0 520 300" width="520" height="300" role="img" aria-label="Elektrokemisk korrosionscelle">\
<style>.lb{font:600 11px Nunito,sans-serif} .lbb{font:700 12px Nunito,sans-serif} .eq{font:600 11px Nunito,sans-serif}</style>\
<rect x="60" y="110" width="400" height="150" rx="4" fill="#13344d" opacity="0.5" stroke="#2a4a63" stroke-width="1.5"/>\
<text x="260" y="135" text-anchor="middle" class="lb" fill="#9ad0f0">Elektrolyt (vand + ioner)</text>\
<rect x="100" y="90" width="50" height="170" fill="#566069" stroke="#cdd3da" stroke-width="2"/>\
<text x="125" y="80" text-anchor="middle" class="lbb" fill="#ff8a80">ANODE (Fe)</text>\
<text x="125" y="185" text-anchor="middle" class="eq" fill="#ff8a80">Fe→Fe²⁺</text>\
<text x="125" y="200" text-anchor="middle" class="eq" fill="#ff8a80">+2e⁻</text>\
<rect x="370" y="90" width="50" height="170" fill="#7a6a2a" stroke="#cdd3da" stroke-width="2"/>\
<text x="395" y="80" text-anchor="middle" class="lbb" fill="#ffd27a">KATODE (Cu)</text>\
<text x="395" y="185" text-anchor="middle" class="eq" fill="#ffd27a">O₂+H₂O</text>\
<text x="395" y="200" text-anchor="middle" class="eq" fill="#ffd27a">+e⁻</text>\
<line x1="125" y1="90" x2="125" y2="55" stroke="#ff6a00" stroke-width="3"/>\
<line x1="395" y1="90" x2="395" y2="55" stroke="#ff6a00" stroke-width="3"/>\
<line x1="125" y1="55" x2="395" y2="55" stroke="#ff6a00" stroke-width="3" marker-end="url(#ae)"/>\
<text x="260" y="48" text-anchor="middle" class="lbb" fill="#ff8a3d">Elektroner (e⁻) →</text>\
<line x1="155" y1="225" x2="365" y2="225" stroke="#9ad0f0" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ai)"/>\
<text x="260" y="245" text-anchor="middle" class="lb" fill="#9ad0f0">Ioner i elektrolytten →</text>\
<defs>\
<marker id="ae" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto"><polygon points="0,0 9,3.5 0,7" fill="#ff6a00"/></marker>\
<marker id="ai" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><polygon points="0,0 7,3 0,6" fill="#9ad0f0"/></marker>\
</defs>\
</svg>'; }
