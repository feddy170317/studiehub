/* MEK2 Quiz — Emne K2: Bjælkeudbøjning. Kilde: Besvarelse_MEK2_S26 (opg6, opg8).
   12 Q · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['MK_Q6'] = {
  intro: 'Udbøjningen v(x) af en bjælke findes af <b>EI·v″ = M(x)</b>: opstil momentkurven og integrér to gange. De to integrationskonstanter bestemmes af <b>randbetingelser</b> (understøtninger kan ikke flytte sig). Alternativt bruges <b>superposition</b> med tabelværdier for standardtilfælde.',
  analogi: '⚒ Tip: et ubelastet, stift overhæng "vipper" bare om sin støtte. Så udbøjningen i enden af overhænget er v_E ≈ θ_B · L — kun hældningen ved støtten tæller, ikke noget lokalt moment.',
  examQs: [
    'Opstil M(x) og integrér EI·v″ = M to gange.',
    'Bestem konstanterne af rand- og kontinuitetsbetingelser.',
    'Brug superposition med tabeltilfælde til at finde udbøjning/hældning.'
  ],
  svgCap: 'Simpelt understøttet bjælke under last: udbøjningskurven v(x) findes af EI·v″ = M(x). Ved understøtningerne er v = 0 (randbetingelser), og kurven er størst et sted inde i spændet.',
  svg: deflSVG(),
  mc: [
    { level:'let', q:'Hvad er differentialligningen for bjælkeudbøjning?',
      options:['EI·v = M','EI·v″ = M(x)','EI·v′ = V','v = M/EI'],
      correct:1,
      why:'EI·v″ = M(x): den anden afledte af udbøjningen gange bøjestivheden EI er lig bøjemomentet. Integreres to gange for at få v(x).' },
    { level:'let', q:'Hvor mange gange skal M(x) integreres for at få udbøjningen v(x)?',
      options:['Én gang','To gange','Tre gange','Den differentieres'],
      correct:1,
      why:'EI·v″ = M → integrér én gang for hældningen v′ (θ), én gang til for udbøjningen v. Hver integration giver en konstant, der bestemmes af randbetingelser.' },
    { level:'let', q:'Hvilken randbetingelse gælder ved en simpel understøtning (led/rulle)?',
      options:['v = 0 og v′ = 0','v = 0 (kan ikke flytte sig, men må gerne dreje)','v′ = 0 kun','Ingen betingelser'],
      correct:1,
      why:'En simpel understøtning forhindrer lodret flytning (v = 0), men tillader rotation (v′ ≠ 0). Derfor giver hver simpel støtte én betingelse.' },
    { level:'let', q:'Hvilke randbetingelser gælder ved en fast indspænding?',
      options:['Kun v = 0','v = 0 OG v′ = 0 (kan hverken flytte sig eller dreje)','Kun v′ = 0','v″ = 0'],
      correct:1,
      why:'En indspænding låser både flytning og rotation: v = 0 og v′ = 0. Den giver derfor to betingelser.' },
    { level:'middel', q:'Hvad er princippet i superposition for udbøjning?',
      options:['Man ganger lasterne sammen','Man lægger udbøjnings-/hældningsbidragene fra hver enkelt last sammen','Man bruger kun den største last','Man tager gennemsnittet'],
      correct:1,
      why:'Da systemet er lineært, kan man slå hvert lasttilfælde op i en tabel og lægge bidragene sammen (med fortegn) til den samlede udbøjning/hældning.' },
    { level:'middel', q:'Hvilken kontinuitetsbetingelse gælder, hvor en punktlast "knækker" momentkurven?',
      options:['v og v′ må gerne springe','v og v′ skal være kontinuerte (bjælken hænger sammen og har ét tangenthældning)','Kun v skal være kontinuert','M skal være nul'],
      correct:1,
      why:'Bjælken er fysisk sammenhængende: hverken udbøjningen v eller hældningen v′ kan springe ved segmentgrænsen. Det giver de ekstra ligninger til at bestemme konstanterne.' },
    { level:'middel', q:'En udkraget bjælke med en punktlast P i den frie ende — hvad er tip-udbøjningen?',
      options:['PL³/(48EI)','PL³/(3EI)','PL³/(8EI)','PL⁴/(8EI)'],
      correct:1,
      why:'For en udkraget bjælke med tiplast: δ = PL³/(3EI). (Med en jævnt fordelt last w er tip-udbøjningen wL⁴/(8EI).)' },
    { level:'middel', q:'En simpelt understøttet bjælke med en punktlast P på midten — hvad er midt-udbøjningen?',
      options:['PL³/(3EI)','PL³/(48EI)','PL³/(8EI)','5wL⁴/(384EI)'],
      correct:1,
      why:'For en simpelt understøttet bjælke med midterlast: δ = PL³/(48EI). (5wL⁴/384EI gælder for jævnt fordelt last.)' },
    { level:'middel', q:'Hvordan findes udbøjningen i enden E af et ubelastet, stift overhæng?',
      options:['Den er nul','v_E ≈ θ_B · L (overhænget vipper om støtten B med hældningen θ_B)','v_E = M·L/EI','v_E = P·L³/3EI'],
      correct:1,
      why:'Det ubelastede overhæng er snorlige og roterer bare om støtten B. Derfor er endepunktets udbøjning hældningen ved B gange overhængets længde: v_E ≈ θ_B·L.' },
    { level:'svaer', q:'En bjælke deles i 2 segmenter pga. en punktlast. Hvor mange integrationskonstanter er der, og hvordan findes de?',
      options:['2 — kun af randbetingelser','4 (2 pr. segment) — af 2 rand- + 2 kontinuitetsbetingelser','1 — af symmetri','6 — kun af ligevægt'],
      correct:1,
      why:'Hvert segment integreres for sig → 2 konstanter pr. segment = 4 i alt. De findes af randbetingelserne (ved understøtningerne) plus kontinuitet i v og v′ ved segmentgrænsen.' },
    { level:'svaer', q:'Hvorfor bliver en bjælke statisk ubestemt, når man tilføjer en fast indspænding?',
      options:['Den bliver lettere at løse','Indspændingen tilføjer et reaktionsmoment → flere ubekendte end ligevægtsligninger → man henter en ekstra ligning fra geometrien (kompatibilitet)','Den kan ikke bære last','Ligevægt alene er nok'],
      correct:1,
      why:'Med en ekstra reaktion (fx M_A) er der flere ubekendte end de 2–3 ligevægtsligninger. Den manglende ligning hentes fra en geometrisk betingelse (fx v = 0 ved en understøtning) — det er kompatibilitetsmetoden.' },
    { level:'svaer', q:'Hvad gør Macaulay-metoden (klammeparenteser) smart ved udbøjningsberegning?',
      options:['Den fjerner behovet for randbetingelser','Den håndterer ALLE laster i ét samlet M(x)-udtryk → kun 2 konstanter i alt, uanset antal laster','Den ignorerer forskydning','Den kræver flere segmenter'],
      correct:1,
      why:'Macaulay-klammer ⟨x−a⟩ "tænder" først ved x = a, så hele bjælken beskrives af ét M(x). Så slipper man for at dele i mange segmenter og har kun 2 integrationskonstanter til hele bjælken.' }
  ],
  cards: [
    { q:'Grundligning og betingelser?', a:'EI·v″ = M(x), integrér 2 gange. Simpel støtte: v = 0. Indspænding: v = 0 og v′ = 0. Segmentgrænse: v og v′ kontinuerte. 2 konstanter pr. segment.' },
    { q:'Standard-udbøjninger (huskeværdier)?', a:'Udkraget + tiplast: PL³/3EI. Udkraget + UDL: wL⁴/8EI. Simpelt + midterlast: PL³/48EI. Simpelt + UDL: 5wL⁴/384EI.' },
    { q:'Superposition vs. integration?', a:'Integration: opstil M(x), integrér 2× med rand/kontinuitet (kan altid bruges). Superposition: slå hvert lasttilfælde op i tabel og læg sammen — hurtigt for standardtilfælde.' },
    { q:'Ubelastet overhæng?', a:'Det vipper stift om støtten: v_E ≈ θ_B·L. Kun hældningen ved støtten tæller. Punkter inde i spændet aflæses derimod direkte på udbøjningskurven.' }
  ]
};

function deflSVG(){ return '\
<svg viewBox="0 0 520 210" width="520" height="210" role="img" aria-label="Bjaelkeudboejning">\
<style>.ax{font:600 11px Nunito,sans-serif;fill:#cfe3f5} .lb{font:700 11px Nunito,sans-serif}</style>\
<line x1="80" y1="80" x2="440" y2="80" stroke="#3d6188" stroke-width="2" stroke-dasharray="4 4"/>\
<path d="M80 80 Q260 160 440 80" fill="none" stroke="#5ec8ff" stroke-width="3"/>\
<polygon points="80,82 70,102 90,102" fill="none" stroke="#9bd4ff" stroke-width="2"/>\
<polygon points="440,82 430,102 450,102" fill="none" stroke="#9bd4ff" stroke-width="2"/>\
<circle cx="440" cy="82" r="3" fill="#9bd4ff"/>\
<g stroke="#ff6b6b" stroke-width="2.5" fill="#ff6b6b"><line x1="260" y1="40" x2="260" y2="74"/><polygon points="260,82 253,66 267,66"/></g>\
<text x="260" y="34" text-anchor="middle" class="lb" fill="#ff9b9b">last</text>\
<line x1="260" y1="80" x2="260" y2="132" stroke="#ffd24a" stroke-width="1.4" stroke-dasharray="3 3"/>\
<text x="268" y="120" class="ax" fill="#ffd24a">v(x)</text>\
<text x="60" y="120" class="ax" fill="#9bd4ff">v=0</text>\
<text x="430" y="120" class="ax" fill="#9bd4ff">v=0</text>\
<text x="260" y="180" text-anchor="middle" class="ax">EI·v″ = M(x)</text>\
</svg>'; }
