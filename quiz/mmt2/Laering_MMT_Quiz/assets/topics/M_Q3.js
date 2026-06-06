/* MMT2 Quiz — Emne M-3: Varmebehandling. Kilde: M_Q3_Varmebehandling.tex
   12 spørgsmål · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['M_Q3'] = {
  intro: 'Varmebehandling er kunsten at "gennembage" et stål ved bestemte temperaturer og køleforløb for at få de ønskede egenskaber. Tre overordnede grupper: <b>ingen faseændring</b> (fx rekrystallisation under austenit-temp.), <b>faseændring</b> (normalisering = luftafkøling, blødglødning = ovnafkøling), og <b>hærdning</b> (hurtig afkøling → martensit, efterfulgt af anløbning).',
  analogi: '⚒ Kølemedie-analogi: som at tage en varm kartoffel ud — luft = langsom (normalisering), olie = hurtigere, vand = meget hurtig (martensit), saltvand = hurtigst muligt.',
  examQs: [
    'Redegør for de tre hovedgrupper: ingen faseændring, faseændring, hærdning.',
    'Rekrystallisation, normalisering, blødglødning og hærdning via Fe-C/TTT-diagram.',
    'Formål, mikrostruktur-effekt og tekniske anvendelser for hver proces.',
    'Betydningen af kølemedie og emnegeometri.',
    'Begrebet hærdeevne og dets praktiske betydning.'
  ],
  svgCap: 'Skematisk varmebehandling: normalisering (luft) og blødglødning (ovn) starter i austenitregionen; hærdning kræver afkøling hurtigere end kritisk kølehastighed → martensit. Anløbning genopvarmer martensitten.',
  svg: htSVG(),
  mc: [
    { level:'let', q:'Hvad er de tre hovedgrupper af varmebehandling?',
      options:['Smeltning, støbning, valsning','Ingen faseændring, faseændring, hærdning','Boring, fræsning, slibning','Anode, katode, elektrolyt'],
      correct:1,
      why:'Ingen faseændring (fx rekrystallisation, uden austenitisering), faseændring (normalisering/blødglødning via austenit), og hærdning (martensit + anløbning).' },
    { level:'let', q:'Hvilket kølemedie giver den hurtigste afkøling (og dermed martensit)?',
      options:['Stille luft','Olie','Vand / saltvand','I ovnen'],
      correct:2,
      why:'Kølehastighed: saltvand > vand > olie > luft > ovn. Kun de hurtigste medier kommer forbi TTT-næsen og danner martensit. Ovnafkøling er langsomst (blødglødning).' },
    { level:'let', q:'Hvad er formålet med <b>rekrystallisation</b>?',
      options:['At danne martensit','At gendanne formbarhed/duktilitet efter koldformning','At øge kulstofindholdet','At skabe et cementit-netværk'],
      correct:1,
      why:'Koldformning fylder stålet med dislokationer (hårdt/sprødt). Opvarmning til rekrystallisationstemperaturen lader nye, defektfrie korn vokse → blødt, duktilt stål igen. Ingen faseændring.' },
    { level:'let', q:'Ved <b>normalisering</b> afkøles emnet i:',
      options:['Vand','Stille luft','Olie','Ovnen (meget langsomt)'],
      correct:1,
      why:'Normalisering = austenitisering 50–60 °C over A₃, derefter luftafkøling → fin, ensartet perlit med jævn kornstørrelse.' },
    { level:'middel', q:'Hvad kendetegner <b>blødglødning</b> (full annealing) — afkøling og formål?',
      options:['Vandafkøling; maksimal hårdhed','Langsom ovnafkøling; blødeste tilstand, optimal til maskinering/koldformning','Luftafkøling; finkornet perlit','Hurtig afkøling; martensit'],
      correct:1,
      why:'Blødglødning austenitiserer og afkøler meget langsomt i ovnen (10–20 °C/h) → grov perlit/sfæroidisering, lav hårdhed (HB 150–200), høj duktilitet — ideel før intensiv maskinering.' },
    { level:'middel', q:'Hærdning kræver, at stålet afkøles …',
      options:['langsommere end den kritiske kølehastighed','hurtigere end den kritiske kølehastighed (forbi TTT-næsen) → martensit','til præcis 727 °C og holdes der','i ovnen over flere timer'],
      correct:1,
      why:'For at undgå perlit/bainit (diffusion) skal afkølingen passere TTT-"næsen" hurtigere end den kritiske kølehastighed → diffusionsløs martensit.' },
    { level:'middel', q:'Hvad sker der under <b>anløbning</b> (tempering) af hærdet stål?',
      options:['Hårdheden stiger, sejheden falder','Kulstof diffunderer delvist ud af BCT-gitteret → hårdhed falder, sejhed stiger (jo højere temp., jo blødere/sejere)','Stålet omdannes til austenit','Der dannes nyt cementit-netværk'],
      correct:1,
      why:'Anløbning (150–650 °C, 1–2 t) lader kulstof udfælde som fine carbider → indre spændinger og hårdhed reduceres, sejheden genvindes. Højere anløbningstemp. = blødere og sejere.' },
    { level:'middel', q:'Rekrystallisationstemperaturen ligger typisk ved (T i Kelvin):',
      options:['0,1 · T_smelt','0,3–0,5 · T_smelt','0,8–0,9 · T_smelt','Over T_smelt'],
      correct:1,
      why:'Rekrystallisation kræver tilstrækkelig atombevægelighed; det sker typisk ved 0,3–0,5 gange den absolutte smeltetemperatur (Kelvin).' },
    { level:'middel', q:'Hvorfor giver normalisering finere perlit end blødglødning?',
      options:['Fordi den bruger højere austenitiseringstemp.','Fordi luftafkøling er hurtigere end ovnafkøling — kortere tid til diffusion → finere lameller','Fordi der tilsættes mere kulstof','Fordi den danner martensit'],
      correct:1,
      why:'Begge austenitiserer, men normalisering køler hurtigere (luft) end blødglødning (ovn). Mindre diffusionstid → finere perlit (højere styrke). Langsom ovnkøling → grov perlit (blødere).' },
    { level:'svaer', q:'Hvad beskriver begrebet <b>hærdeevne</b> (hardenability)?',
      options:['Den maksimale hårdhed et stål kan opnå','HVOR DYBT ind i tværsnittet der dannes martensit; måles med Jominy-endeafkølingstesten','Hvor hurtigt stålet ruster','Hvor meget kulstof stålet indeholder'],
      correct:1,
      why:'Hærdeevne = martensit-dybden i et tværsnit (ikke topværdien af hårdhed). Den måles med Jominy-testen, hvor en austenitiseret stang vandkøles i den ene ende og hårdheden måles langs aksen.' },
    { level:'svaer', q:'Hvordan øger legeringselementer (Cr, Ni, Mo, Mn) hærdeevnen?',
      options:['De sænker smeltepunktet','De forskyder TTT-kurverne til HØJRE → mere tid før perlit/bainit → større dybde når martensit','De tilfører kulstof','De danner et beskyttende oxidlag'],
      correct:1,
      why:'Legeringselementer bremser diffusionen og skubber TTT-næsen mod højre (længere inkubationstid). Så kan en langsommere (= dybere) køling stadig nå martensit → større hærdedybde.' },
    { level:'svaer', q:'Et TYKT emne af stål med LAV hærdeevne hærdes. Hvad bliver mikrostrukturen fra overflade til kerne?',
      options:['Martensit hele vejen igennem','Hård martensit ved overfladen, men blød/sej kerne (bainit/perlit) pga. lavere kølehastighed i centrum','Ren ferrit i hele tværsnittet','Austenit i kernen ved stuetemperatur'],
      correct:1,
      why:'Overfladen køler hurtigt (over kritisk hastighed) → martensit. Centrum køler langsomt → bainit/perlit. Resultatet er hård skal/sej kerne. Kompenseres med legeret stål (højere hærdeevne), tyndere sektion, eller case-hardening.' }
  ],
  cards: [
    { q:'Normalisering vs. blødglødning?', a:'Begge austenitiserer. Normalisering: luftafkøling → fin perlit, ensartet kornstruktur (konstruktionsdele). Blødglødning: langsom ovnafkøling → grov perlit, blødest (til maskinering).' },
    { q:'De tre trin i hærdning?', a:'1) Austenitisering (50–100 °C over A₃). 2) Afkøling hurtigere end kritisk kølehastighed → martensit. 3) Anløbning (150–650 °C) → genvinder sejhed.' },
    { q:'Hvad er Jominy-testen?', a:'En austenitiseret stang vandkøles i den ene ende; hårdheden måles langs aksen. Hårdhedsfaldet fra den kølede ende viser stålets hærdeevne (martensit-dybde).' },
    { q:'Hvad bestemmer kølehastigheden i praksis?', a:'Kølemedie (vand > olie > luft) og emnegeometri (tynde emner køler hurtigere end tykke). Derfor får tykke emner hård overflade men blødere kerne.' }
  ]
};

function htSVG(){ return '\
<svg viewBox="0 0 520 320" width="520" height="320" role="img" aria-label="Varmebehandlings-koeleforloeb">\
<style>.ax{font:600 11px Nunito,sans-serif;fill:#cdd3da} .zn{font:700 11px Nunito,sans-serif}</style>\
<rect x="60" y="30" width="410" height="250" fill="#12151a"/>\
<rect x="60" y="30" width="410" height="60" fill="#ffb627" opacity="0.08"/>\
<rect x="60" y="235" width="410" height="45" fill="#ff5a4d" opacity="0.08"/>\
<line x1="60" y1="95" x2="470" y2="95" stroke="#ff9b3d" stroke-width="2" stroke-dasharray="7 4"/>\
<text x="474" y="99" fill="#ff9b3d" class="ax">A₃</text>\
<line x1="60" y1="118" x2="470" y2="118" stroke="#ff9b3d" stroke-width="1.6" stroke-dasharray="5 4"/>\
<text x="474" y="122" fill="#ff9b3d" class="ax">A₁ 727</text>\
<line x1="60" y1="235" x2="470" y2="235" stroke="#ff5a4d" stroke-width="2" stroke-dasharray="7 4"/>\
<text x="474" y="239" fill="#ff5a4d" class="ax">M_s</text>\
<text x="300" y="55" fill="#ffd27a" class="zn">Austenitregion</text>\
<text x="360" y="262" fill="#ff8a80" class="zn">Martensit</text>\
<line x1="95" y1="60" x2="135" y2="248" stroke="#ff5a4d" stroke-width="3" marker-end="url(#a1)"/>\
<text x="100" y="205" fill="#ff5a4d" class="ax">Hærdning (vand)</text>\
<path d="M95 60 Q150 120 250 248" fill="none" stroke="#5fd17a" stroke-width="3" marker-end="url(#a2)"/>\
<text x="190" y="180" fill="#5fd17a" class="ax">Normalisering (luft)</text>\
<path d="M95 60 Q220 130 420 248" fill="none" stroke="#62b0e0" stroke-width="3" marker-end="url(#a3)"/>\
<text x="330" y="210" fill="#62b0e0" class="ax">Blødglødning (ovn)</text>\
<path d="M150 250 L150 175 L430 175" fill="none" stroke="#b08cf0" stroke-width="2.5" stroke-dasharray="5 4" marker-end="url(#a4)"/>\
<text x="300" y="170" fill="#b08cf0" class="ax">Anløbning (tempering)</text>\
<defs>\
<marker id="a1" markerWidth="9" markerHeight="9" refX="4" refY="7" orient="auto"><polygon points="0,0 8,0 4,8" fill="#ff5a4d"/></marker>\
<marker id="a2" markerWidth="9" markerHeight="9" refX="4" refY="7" orient="auto"><polygon points="0,0 8,0 4,8" fill="#5fd17a"/></marker>\
<marker id="a3" markerWidth="9" markerHeight="9" refX="4" refY="7" orient="auto"><polygon points="0,0 8,0 4,8" fill="#62b0e0"/></marker>\
<marker id="a4" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><polygon points="0,0 7,3 0,6" fill="#b08cf0"/></marker>\
</defs>\
<line x1="60" y1="280" x2="470" y2="280" stroke="#cdd3da" stroke-width="2"/>\
<line x1="60" y1="280" x2="60" y2="30" stroke="#cdd3da" stroke-width="2"/>\
<text x="265" y="306" class="ax" text-anchor="middle">Tid →</text>\
<text x="20" y="155" class="ax" text-anchor="middle" transform="rotate(-90 20,155)">Temperatur (°C)</text>\
</svg>'; }
