/* MMT2 Quiz — Emne T-5: Kompositter (produktion). Kilde: T_Q5_Kompositter_Produktion.tex
   12 spørgsmål · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['T_Q5'] = {
  intro: 'Kompositter fremstilles helt anderledes end metaller: <b>du opbygger materialet og emnet samtidig</b>. Der er ingen smeltefase — fibrene lægges ud i det ønskede mønster og bindes af matrix under hærdning. Tre niveauer: <b>hand lay-up</b> (billig, manuel, lav volumen), <b>RTM</b> (lukket form, harpiks injiceres) og <b>autoclave/prepreg</b> (højeste kvalitet, luftfart/F1).',
  analogi: '⚒ Hand lay-up er som at tapetsere — lag for lag med rulle og børste. Autoclave er som at vakuumpakke og bage under tryk for at presse al luft ud og få maksimal styrke.',
  examQs: [
    'Beskriv tre produktionsmetoder for glas-/kulfiberkompositter.',
    'Forskel på bulk-materialer og fiberforstærkede materialer.',
    'Sammenlign laminater vs. kortfiber-fyldte kompositter (mekanisk/fysisk/termisk).',
    'Økonomiske overvejelser for høj- vs. lav-volumen produktion.'
  ],
  svgCap: 'Kontinuert fiberlaminat (venstre): ordnede lag i 0/±45/90° → høj, designbar (anisotrop) styrke. Kortfiber-komposit (højre): tilfældigt orienterede korte fibre → næsten isotrop, men lavere egenskaber, billig masseproduktion.',
  svg: compSVG(),
  mc: [
    { level:'let', q:'Hvad er <b>hand lay-up</b> (manuel laminering)?',
      options:['Fibre presses i en lukket form under højt tryk','Fiberlag lægges manuelt i en åben form og påføres harpiks lag for lag','Pulver sintres til en komposit','Smeltet komposit sprøjtes i en form'],
      correct:1,
      why:'Hand lay-up er den simpleste metode: tørt fiberstof/prepreg lægges manuelt i en åben form, harpiks påføres med rulle/børste, og det hærder ved stuetemp./ovn. Billigt, fleksibelt, store emner — men manuelle kvalitetsvariationer.' },
    { level:'let', q:'Hvad er <b>prepreg</b>?',
      options:['Et færdigt støbeemne','Forimprægnerede fiberlag med en kontrolleret, præcis harpiksmængde','En type metalpulver','En slibeskive'],
      correct:1,
      why:'Prepreg = fibre der på forhånd er imprægneret med den rette mængde (delvist hærdet) harpiks. Det giver præcis fiber/harpiks-forhold og bruges i autoclave-laminering. Kræver kold opbevaring.' },
    { level:'let', q:'Hvilket har klart højest styrke?',
      options:['Bulk-epoxy (40–80 MPa)','Fiberforstærket komposit, UD (300–2000 MPa)','De er ens','Ren polyester'],
      correct:1,
      why:'Bulk-matrixmateriale (epoxy/polyester) ligger på 40–80 MPa. Med kontinuerlige fibre (UD) når man 300–2000 MPa — fibrene bærer lasten, matrixen overfører den.' },
    { level:'let', q:'Hvad bruges <b>autoclave</b>-processen typisk til?',
      options:['Billige masseproducerede dele','Højeste kvalitet/styrke — luftfartskonstruktioner, F1-monocoque, raketter','Rør og profiler','Sintrede metaldele'],
      correct:1,
      why:'Autoclave (vakuumpose + tryk + varme) giver højeste fibervolumenfraktion (>60 %) og lavest porositet (<1 %) → bedste egenskaber. Det er dyrt og langsomt, så det bruges til høj-performance (A350-vinge, F1).' },
    { level:'middel', q:'Hvad kendetegner <b>RTM</b> (Resin Transfer Moulding)?',
      options:['Åben form, manuel påføring','Tør fiberpræform i en lukket todelt form; harpiks injiceres under tryk/vakuum → glat overflade begge sider, sundhedssikker','Pulver presses og sintres','Kontinuerlig udpresning'],
      correct:1,
      why:'RTM lægger en tør præform i en lukket form og injicerer harpiks. Fordele: glat overflade på begge sider, høj Vf (50–60 %), god reproducerbarhed og lukket (sundhedssikker) proces. Ulempe: dyre forme, mellemstore emner.' },
    { level:'middel', q:'Hvilke egenskaber giver autoclave-laminering?',
      options:['Lav Vf og høj porositet','Meget høj fibervolumenfraktion (>60 %), lav porositet (<1 %) og fremragende mekaniske egenskaber','Billig og hurtig','Isotrope egenskaber'],
      correct:1,
      why:'Tryk + vakuum presser luft ud og konsoliderer laminatet → Vf >60 %, porositet <1 % og topkvalitet. Prisen er dyr autoclave + prepreg, lang procestid og kold opbevaring.' },
    { level:'middel', q:'Laminat vs. kortfiber-komposit — hvad gælder?',
      options:['Laminat er svagest og isotropt','Laminat: meget høj/designbar (anisotrop) styrke, men langsom/manuel. Kortfiber: moderat styrke, næsten isotrop, billig automatiseret produktion','De er ens','Kortfiber er stærkest'],
      correct:1,
      why:'Kontinuerlige laminater giver høj, retningsstyret styrke (luftfart/sport), men er dyre/langsomme. Kortfiber-kompositter er næsten isotrope, svagere, men kan sprøjtestøbes billigt i store serier.' },
    { level:'middel', q:'Hvad er det omtrentlige prisforhold mellem glasfiber (GFRP) og kulfiber (CFRP)?',
      options:['De koster det samme','GFRP ~5–15 kr/kg; CFRP ~150–500 kr/kg (10–50× dyrere)','CFRP er billigst','GFRP er dyrest'],
      correct:1,
      why:'Glasfiber er billigt (5–15 kr/kg) og dominerer priselastiske markeder. Kulfiber er meget dyrere (150–500 kr/kg) og bruges hvor lav vægt/høj stivhed retfærdiggør prisen (luftfart, F1).' },
    { level:'middel', q:'Hvad er primært afgørende for en kompositens endelige egenskaber?',
      options:['Farven på matrixen','Fibervolumenfraktionen (Vf) og fiberorienteringen','Formens størrelse','Hærdetemperaturen alene'],
      correct:1,
      why:'Fibrene bærer lasten, så hvor meget fiber (Vf) og hvilken retning de ligger i bestemmer styrke/stivhed. Matrixen overfører last og beskytter, men styrken kommer fra fibrene.' },
    { level:'svaer', q:'Hvad er de vigtigste ULEMPER ved hand lay-up?',
      options:['For dyrt udstyr','Manuelle kvalitetsvariationer, lav fibervolumenfraktion (40–50 %) og sundhedsrisiko (styrendampe i åben proces)','Kan ikke lave store emner','Kræver autoclave'],
      correct:1,
      why:'Den manuelle, åbne proces giver variabel kvalitet og relativt lav Vf (40–50 % → svagere end RTM/autoclave). Den åbne harpiks afgiver desuden styrendampe (arbejdsmiljø). Til gengæld billigt udstyr og store emner.' },
    { level:'svaer', q:'Hvilken produktionsstrategi passer til henholdsvis høj og lav volumen?',
      options:['Hand lay-up til begge','Høj volumen: RTM/prepreg-presning/vakuuminfusion med automatisering (amortiserer formen). Lav volumen: hand lay-up/vakuumpose med billige forme (høj arbejdskraft pr. emne)','Autoclave til alt','Sprøjtestøbning til kontinuerlige fibre'],
      correct:1,
      why:'Høj volumen (>10.000/år) retfærdiggør dyre forme + automatisering, hvor cyklustid er kritisk. Lav volumen (<500/år) bruger billige GRP-forme og manuelle/infusion-metoder, hvor fleksibilitet vægter højere end stykpris.' },
    { level:'svaer', q:'En 70 m vindmøllevinge i GFRP overvejes skiftet til CFRP. Hvor giver CFRP størst fordel?',
      options:['Overalt, fordi det er billigst','I spids-/spar-området: CFRP er 3–5× dyrere, men 30–40 % lettere og ~5× stivere → reducerer defleksion og centrifugalkræfter; hybrid GFRP-krop + CFRP-spar er standard','Kun i overfladelaget','Ingen steder — GFRP er altid bedst'],
      correct:1,
      why:'CFRP\'s lave vægt + høje stivhed betaler sig mest, hvor det reducerer tip-defleksion og masse-relaterede kræfter (spar/spids). Derfor er hybridvinger (GFRP-skal + CFRP-bjælke) den gængse økonomiske løsning.' }
  ],
  cards: [
    { q:'Tre produktionsmetoder?', a:'Hand lay-up (åben form, manuel, billig, lav Vf). RTM (lukket form, harpiks injiceres, glat 2-sidet, sundhedssikker). Autoclave/prepreg (vakuum+tryk+varme, Vf>60 %, top-kvalitet, dyr — luftfart/F1).' },
    { q:'Bulk vs. fiberforstærket?', a:'Bulk (epoxy/polyester): 40–80 MPa, isotrop, sprødt. Fiberforstærket (GFRP/CFRP): 300–2000 MPa (UD), anisotrop/designbar. Vf og orientering bestemmer egenskaberne.' },
    { q:'Laminat vs. kortfiber-komposit?', a:'Laminat: høj/anisotrop styrke, kompleks/langsom, dyr (luftfart, vindenergi). Kortfiber: moderat, næsten isotrop, let at sprøjtestøbe, billig (bilkomponenter, housings).' },
    { q:'GFRP vs. CFRP økonomi?', a:'GFRP: 5–15 kr/kg, priselastiske markeder. CFRP: 150–500 kr/kg, 30–40 % lettere + ~5× stivere → høj-performance. Hybrid bruges hvor kun dele kræver CFRP.' }
  ]
};

function compSVG(){ return '\
<svg viewBox="0 0 520 230" width="520" height="230" role="img" aria-label="Laminat vs kortfiber-komposit">\
<style>.t{font:700 12px Nunito,sans-serif} .s{font:600 10px Nunito,sans-serif;fill:#9aa1ab}</style>\
<text x="135" y="26" text-anchor="middle" class="t" fill="#9ad0f0">Kontinuert laminat</text>\
<rect x="20" y="36" width="230" height="150" fill="#0f1115" stroke="#566069" stroke-width="1.5"/>\
<g stroke="#62b0e0" stroke-width="2" stroke-linecap="round">\
<g><line x1="30" y1="48" x2="50" y2="48"/><line x1="60" y1="48" x2="80" y2="48"/><line x1="90" y1="48" x2="110" y2="48"/><line x1="120" y1="48" x2="140" y2="48"/><line x1="150" y1="48" x2="170" y2="48"/><line x1="180" y1="48" x2="200" y2="48"/><line x1="210" y1="48" x2="230" y2="48"/></g>\
<g><line x1="34" y1="70" x2="52" y2="82"/><line x1="64" y1="70" x2="82" y2="82"/><line x1="94" y1="70" x2="112" y2="82"/><line x1="124" y1="70" x2="142" y2="82"/><line x1="154" y1="70" x2="172" y2="82"/><line x1="184" y1="70" x2="202" y2="82"/><line x1="214" y1="70" x2="232" y2="82"/></g>\
<g><line x1="40" y1="98" x2="40" y2="118"/><line x1="70" y1="98" x2="70" y2="118"/><line x1="100" y1="98" x2="100" y2="118"/><line x1="130" y1="98" x2="130" y2="118"/><line x1="160" y1="98" x2="160" y2="118"/><line x1="190" y1="98" x2="190" y2="118"/><line x1="220" y1="98" x2="220" y2="118"/></g>\
<g><line x1="52" y1="130" x2="34" y2="142"/><line x1="82" y1="130" x2="64" y2="142"/><line x1="112" y1="130" x2="94" y2="142"/><line x1="142" y1="130" x2="124" y2="142"/><line x1="172" y1="130" x2="154" y2="142"/><line x1="202" y1="130" x2="184" y2="142"/><line x1="232" y1="130" x2="214" y2="142"/></g>\
<g><line x1="30" y1="160" x2="50" y2="160"/><line x1="60" y1="160" x2="80" y2="160"/><line x1="90" y1="160" x2="110" y2="160"/><line x1="120" y1="160" x2="140" y2="160"/><line x1="150" y1="160" x2="170" y2="160"/><line x1="180" y1="160" x2="200" y2="160"/><line x1="210" y1="160" x2="230" y2="160"/></g></g>\
<text x="135" y="204" text-anchor="middle" class="s">ordnede lag 0/±45/90° · anisotrop</text>\
<text x="385" y="26" text-anchor="middle" class="t" fill="#7fe39a">Kortfiber-komposit</text>\
<rect x="270" y="36" width="230" height="150" fill="#0f1115" stroke="#566069" stroke-width="1.5"/>\
<g stroke="#5fd17a" stroke-width="2" stroke-linecap="round">\
<line x1="290" y1="60" x2="312" y2="68"/><line x1="330" y1="55" x2="345" y2="78"/><line x1="370" y1="62" x2="395" y2="58"/><line x1="420" y1="55" x2="438" y2="72"/><line x1="460" y1="64" x2="478" y2="50"/>\
<line x1="295" y1="95" x2="318" y2="100"/><line x1="345" y1="92" x2="360" y2="112"/><line x1="385" y1="100" x2="408" y2="92"/><line x1="430" y1="98" x2="445" y2="118"/><line x1="465" y1="105" x2="485" y2="98"/>\
<line x1="288" y1="135" x2="310" y2="128"/><line x1="332" y1="132" x2="350" y2="150"/><line x1="378" y1="140" x2="400" y2="135"/><line x1="425" y1="138" x2="440" y2="158"/><line x1="460" y1="148" x2="482" y2="140"/>\
<line x1="300" y1="165" x2="322" y2="170"/><line x1="350" y1="168" x2="368" y2="155"/><line x1="395" y1="170" x2="415" y2="162"/><line x1="440" y1="172" x2="460" y2="166"/></g>\
<text x="385" y="204" text-anchor="middle" class="s">tilfældige korte fibre · næsten isotrop</text>\
</svg>'; }
