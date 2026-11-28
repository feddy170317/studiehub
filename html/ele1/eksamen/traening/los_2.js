/* los_2.js · Pædagogiske løsninger tema 3 (kondensator) og 4 (visere). Se los_1.js for format. */
(function () {
'use strict';
var r = String.raw;
window.LOS = window.LOS || {};

var SERIE_HVORFOR = 'Serie: den samme strøm løber ind i begge kondensatorer i den samme tid, så de får den samme ladning Q. Spændingerne lægges sammen: v = Q/C₁ + Q/C₂. Derfor er 1/C = 1/C₁ + 1/C₂, og det skrives om til "produkt over sum" ligesom parallelle modstande.';
var PAR_HVORFOR = 'Parallel: begge kondensatorer har den samme spænding v. Hver får ladningen Q = Cv, og ladningerne lægges sammen: Q = C₁v + C₂v = (C₁ + C₂)v. Derfor lægges kapaciteterne sammen.';

/* ======================= 3 · Kondensatoren ======================= */
LOS[3] = [
/* 1 */ [
  { h: 'Sammenhængen mellem ladning og spænding', f: 'QCV',
    hv: 'Vi kender kapaciteten C og spændingen v og skal finde ladningen Q. (3.2) er præcis den sammenhæng.',
    s: r`$$Q=C\,v=100\cdot10^{-6}\ \text{F}\cdot12\ \text{V}=1{,}2\cdot10^{-3}\ \text{C}=«Q|mC»\ \text{mC}$$`,
    r: 'µ (mikro) betyder 10⁻⁶, og m (milli) betyder 10⁻³. 100·10⁻⁶·12 = 1200·10⁻⁶ = 1,2·10⁻³.' }],
/* 2 */ [
  { h: 'Parallel: læg sammen', f: 'CEQ', hv: PAR_HVORFOR,
    s: r`$$C_{eq}=C_1+C_2=10+22=«C|µF»\ \mu\text{F}$$`,
    n: 'Bemærk: det er MODSAT modstande. Parallelle modstande giver mindre, men parallelle kondensatorer giver mere (større plade-areal).' }],
/* 3 */ [
  { h: 'Serie: produkt over sum', f: 'CEQ', hv: SERIE_HVORFOR,
    s: r`$$C_{eq}=\frac{C_1C_2}{C_1+C_2}=\frac{10\cdot40}{10+40}=\frac{400}{50}=«C|µF»\ \mu\text{F}$$`,
    r: 'Man må blive i µF hele vejen: µF·µF/µF = µF.',
    n: 'Tjek: resultatet er mindre end den mindste (10 µF). I serie bliver det "tyndere".' }],
/* 4 */ [
  { h: 'Energien i det elektriske felt', f: 'WC',
    hv: 'Vi kender C og v, og (3.9) giver den lagrede energi direkte.',
    s: r`$$W=\tfrac12\cdot470\cdot10^{-6}\cdot25^2=\tfrac12\cdot470\cdot10^{-6}\cdot625=«W|mJ»\ \text{mJ}$$`,
    r: ['Regnearternes hierarki: potens før gange. Regn 25² = 625 først.', '0,1469 J = 146,9 mJ (gang med 1000).'],
    n: 'Spændingen tæller i anden potens: dobbelt spænding giver fire gange så meget energi.' }],
/* 5 */ [
  { h: 'Hvor meget ladning er sendt ind?', f: 'IQ',
    hv: 'Strøm er ladning pr. tid (1.3). Ved konstant strøm er ladningen derfor strøm gange tid.',
    s: r`$$\Delta q=I\cdot\Delta t=0{,}002\ \text{A}\cdot0{,}5\ \text{s}=«Q|mC»\ \text{mC}$$`,
    r: r`Isolér $\Delta q$ i $i=\Delta q/\Delta t$: gang begge sider med $\Delta t$.` },
  { h: 'Fra ladning til spænding', f: 'QCV',
    hv: 'Kondensatoren startede afladet, så hele ladningen ligger nu på den.',
    s: r`$$v=\frac{Q}{C}=\frac{0{,}001}{100\cdot10^{-6}}=\frac{10^{-3}}{10^{-4}}=«V»\ \text{V}$$`,
    r: [r`Isolér $v$ i $Q=Cv$: del begge sider med $C$.`, 'Potensregel: 10⁻³ / 10⁻⁴ = 10⁻³⁻⁽⁻⁴⁾ = 10¹ = 10.'],
    n: 'Konstant strøm giver en spænding, der stiger som en ret linje.' }],
/* 6 */ [
  { h: 'Start længst væk fra klemmerne: C₂ og C₃', f: 'CEQ',
    hv: 'C₂ og C₃ sidder mellem de samme to punkter, så de er parallelle. ' + PAR_HVORFOR,
    s: r`$$C_{23}=4+8=«C23|µF»\ \mu\text{F}$$` },
  { h: 'Saml med C₁', f: 'CEQ',
    hv: 'Al ladning, der går ind i parallel-blokken, skal først gennem C₁. De er i serie. ' + SERIE_HVORFOR,
    s: r`$$C_{eq}=\frac{6\cdot12}{6+12}=\frac{72}{18}=«C|µF»\ \mu\text{F}$$` }],
/* 7 */ [
  { h: 'Hældningen på spændingskurven',
    hv: r`"Stiger jævnt" betyder en ret linje. Hældningen $dv/dt$ er så den samme hele vejen og kan findes som stigning divideret med tid.`,
    s: r`$$\frac{dv}{dt}=\frac{\Delta v}{\Delta t}=\frac{10\ \text{V}}{0{,}002\ \text{s}}=«dvdt»\ \text{V/s}$$`, r: '2 ms = 2/1000 s = 0,002 s.' },
  { h: 'Strømmen gennem kondensatoren', f: 'ICV',
    hv: 'En kondensator trækker kun strøm, mens spændingen ændrer sig, og strømmen er proportional med hvor hurtigt (3.4).',
    s: r`$$i=C\,\frac{dv}{dt}=47\cdot10^{-6}\cdot5000=«i|mA»\ \text{mA}$$` }],
/* 8 */ [
  { h: 'Samlet kapacitet', f: 'CEQ', hv: SERIE_HVORFOR,
    s: r`$$C_{eq}=\frac{20\cdot30}{20+30}=\frac{600}{50}=«C|µF»\ \mu\text{F}$$` },
  { h: 'Ladningen', f: 'QCV',
    hv: 'Hele serieforbindelsen har 50 V over sig, og den opfører sig som én kondensator på 12 µF.',
    s: r`$$Q=C_{eq}\cdot v=12\ \mu\text{F}\cdot50\ \text{V}=«Q|µC»\ \mu\text{C}$$`, r: 'µF·V = µC.' },
  { h: 'Spændingen over hver', f: 'QCV',
    hv: 'I serie har begge kondensatorer den SAMME ladning, fordi samme strøm har løbet ind i dem i samme tid. Spændingen findes så for hver med v = Q/C.',
    s: r`$$V_{C1}=\frac{Q}{C_1}=\frac{600}{20}=«V1»\ \text{V},\qquad V_{C2}=\frac{600}{30}=«V2»\ \text{V}$$`,
    r: 'µC/µF = C/F = V. Mikro går ud med mikro.',
    n: r`Tjek med KVL: $«V1»+«V2»=50$ V ✓ Den mindste kondensator får den største spænding.` }],
/* 9 */ [
  { h: 'Hver gren er to i serie', f: 'CEQ', hv: SERIE_HVORFOR,
    s: r`Venstre: $\frac{12\cdot6}{12+6}=\frac{72}{18}=«a|µF»\ \mu\text{F}$. Højre: $\frac{30\cdot20}{30+20}=\frac{600}{50}=«b|µF»\ \mu\text{F}$.` },
  { h: 'De to grene står parallelt', f: 'CEQ', hv: 'Begge grene går mellem de samme to punkter. ' + PAR_HVORFOR,
    s: r`$$C_{eq}=«a|µF»+«b|µF»=«C|µF»\ \mu\text{F}$$` },
  { h: 'Ladning fra strømpulsen', f: 'IQ',
    s: r`$$Q=I\cdot\Delta t=8\ \text{mA}\cdot4\ \text{ms}=«Q|µC»\ \mu\text{C}$$`, r: 'mA·ms = 10⁻³·10⁻³ = 10⁻⁶, altså µC.' },
  { h: 'Spændingen', f: 'QCV',
    s: r`$$V=\frac{Q}{C_{eq}}=\frac{32\ \mu\text{C}}{16\ \mu\text{F}}=«V»\ \text{V}$$` }],
/* 10 */ [
  { h: 'Start længst til højre: C₂ og C₄', f: 'CEQ',
    hv: 'C₂ og C₄ ligger efter hinanden på samme vej: serie. ' + SERIE_HVORFOR,
    s: r`$$C_{24}=\frac{20\cdot30}{20+30}=«c24|µF»\ \mu\text{F}$$` },
  { h: 'Parallelt med C₃', f: 'CEQ', hv: 'C₂₄-vejen og C₃ går mellem de samme to punkter: parallel, så de lægges sammen.',
    s: r`$$C_p=50+«c24|µF»=«cp|µF»\ \mu\text{F}$$` },
  { h: 'I serie med C₁', f: 'CEQ', hv: 'Al ladning til resten af netværket skal gennem C₁ først: serie.',
    s: r`$$C_{eq}=\frac{30\cdot«cp|µF»}{30+«cp|µF»}=«C|µF»\ \mu\text{F}$$` },
  { h: 'Hvorfor betyder R₁ intet?',
    hv: 'En ideel strømkilde leverer sin strøm uanset, hvad der sidder efter den. R₁ ændrer derfor ikke, hvor meget ladning der kommer ind i kondensatorerne.' },
  { h: 'Ladning og spænding', f: ['IQ', 'QCV'],
    s: r`$$Q=I\,\Delta t=0{,}05\cdot0{,}004=«Q|µC»\ \mu\text{C},\qquad V_1=\frac{Q}{C_{eq}}=«V»\ \text{V}$$` },
  { h: 'Spændingen over C₁', f: 'QCV',
    hv: 'C₁ sidder i serie med resten af netværket, så den får hele ladningen Q.',
    s: r`$$V_{C1}=\frac{Q}{C_1}=\frac{200\ \mu\text{C}}{30\ \mu\text{F}}=«VC1»\ \text{V}$$`,
    n: 'Efter pulsen bliver spændingen stående. Den ideelle kondensator holder på ladningen.' }]
];

/* ======================= 4 · Visere ======================= */
LOS[4] = [
/* 1 */ [
  { h: 'Aflæs ω', f: 'COS',
    hv: r`Bogens standardform er $A\cos(\omega t+\phi)$. Tallet, der står foran $t$ inde i cosinus, er altid $\omega$.`,
    s: r`$\omega=314{,}16$ rad/s.` },
  { h: 'Fra ω til f og T', f: 'OMEGA',
    s: r`$$f=\frac{\omega}{2\pi}=\frac{314{,}16}{2\pi}=«f»\ \text{Hz},\qquad T=\frac1f=«T|ms»\ \text{ms}$$`,
    r: [r`Isolér $f$ i $\omega=2\pi f$: del begge sider med $2\pi$.`, '1/50 s = 0,02 s = 20 ms.'],
    n: 'Det er netfrekvensen i Danmark.' }],
/* 2 */ [
  { h: 'Fra tidsfunktion til viser', f: 'PHASOR',
    hv: 'Funktionen står allerede på cos-form. Viseren gemmer kun amplitude og fasevinkel, fordi frekvensen er den samme for alle signaler i kredsløbet.',
    s: r`$$\mathbf V=20\angle{-60^\circ}$$` },
  { h: 'Polær → rektangulær', f: 'POLREK',
    hv: 'Viseren er en pil med længde 20 og vinkel −60°. Realdelen er pilens skygge på den vandrette akse, og imaginærdelen er skyggen på den lodrette.',
    s: r`$$\mathbf V=20\cos(-60^\circ)+j\,20\sin(-60^\circ)=20\cdot0{,}5+j\,20\cdot(-0{,}866)=«re»+j(«im»)$$`,
    r: 'cos(−x) = cos x, men sin(−x) = −sin x. cos 60° = 0,5 og sin 60° = 0,866.' }],
/* 3 */ [
  { h: 'Længden med Pythagoras', f: 'REKPOL',
    hv: '3 + j4 er en pil, der går 3 til højre og 4 op. Pilen er hypotenusen i en retvinklet trekant med kateterne 3 og 4.',
    s: r`$$|z|=\sqrt{3^2+4^2}=\sqrt{9+16}=\sqrt{25}=«m»$$`, r: 'Pythagoras: a² + b² = c².' },
  { h: 'Vinklen med arctan', f: 'REKPOL',
    hv: 'I den retvinklede trekant er tan(vinkel) = modstående / hosliggende = imaginærdel / realdel.',
    s: r`$$\angle z=\tan^{-1}\frac43=«a»^\circ$$`,
    n: 'Pas på kvadranten: realdelen er positiv, så arctan giver direkte den rigtige vinkel. Er realdelen negativ, skal der lægges 180° til.' }],
/* 4 */ [
  { h: 'Hvorfor skal sin skrives om?', f: 'PHASOR',
    hv: 'Bogens visere er defineret ud fra cosinus (3.39). En sin-funktion skal derfor skrives om til cos, før vinklen kan aflæses.' },
  { h: 'Skriv sin som cos', f: 'SINCOS',
    hv: 'Sinuskurven er den samme kurve som cosinus, bare forskudt 90° bagud.',
    s: r`$$10\sin(\omega t+20^\circ)=10\cos(\omega t+20^\circ-90^\circ)=10\cos(\omega t-70^\circ)$$`,
    r: r`(3.20) gælder for ethvert argument: $\sin(x)=\cos(x-90^\circ)$ med $x=\omega t+20^\circ$.` },
  { h: 'Aflæs viseren', s: r`$$\mathbf V=10\angle{«a»^\circ}$$`, n: 'Det er den fejl, der oftest koster point: at aflæse +20° direkte fra sin.' }],
/* 5 */ [
  { h: 'Hvorfor ikke bare lægge 5 og 5 sammen?',
    hv: 'Visere er pile. Peger de i forskellige retninger, kan man ikke lægge længderne sammen. De skal på rektangulær form, hvor man lægger vandret til vandret og lodret til lodret.' },
  { h: 'Skriv begge på rektangulær form', f: 'POLREK',
    s: r`$$5\angle0^\circ=5\cos0^\circ+j5\sin0^\circ=5,\qquad 5\angle90^\circ=5\cos90^\circ+j5\sin90^\circ=j5$$`, r: 'cos 0° = 1, sin 0° = 0, cos 90° = 0, sin 90° = 1.' },
  { h: 'Læg sammen', f: 'ADD', s: r`$$5+j5$$` },
  { h: 'Tilbage til polær form', f: 'REKPOL',
    s: r`$$|z|=\sqrt{5^2+5^2}=\sqrt{50}=«m»,\qquad\angle z=\tan^{-1}\frac55=«a»^\circ$$`,
    n: r`$5+5=10$, men summen er kun $7{,}07$. Pilene peger ikke samme vej.` }],
/* 6 */ [
  { h: 'Rektangulær form', f: 'POLREK',
    s: r`$$10\angle30^\circ=10\cos30^\circ+j10\sin30^\circ=«re1»+j5$$ $$10\angle{-30^\circ}=«re1»-j5$$`, r: 'sin(−30°) = −sin 30° = −0,5.' },
  { h: 'Læg sammen', f: 'ADD',
    hv: 'Realdel med realdel, imaginærdel med imaginærdel.',
    s: r`$$(«re1»+«re1»)+j(5-5)=«m»+j0=«m»\angle0^\circ$$`,
    n: 'De lodrette dele ophæver hinanden, fordi pilene er spejlbilleder om den vandrette akse.' }],
/* 7 */ [
  { h: 'Periodens længde', f: 'OMEGA', s: r`$$T=\frac1{50}=0{,}02\ \text{s}=20\ \text{ms}$$` },
  { h: 'Faseforskel som brøkdel af en periode', f: 'PHI',
    hv: '360° er én hel periode. 90° er derfor 90/360 = en fjerdedel af en periode.',
    s: r`$$\Delta t=\frac{90^\circ}{360^\circ}\cdot20\ \text{ms}=«dt|ms»\ \text{ms}$$`,
    r: r`Isolér $\Delta t$ i (3.19): $\phi=2\pi\Delta t/T\Rightarrow\Delta t=\frac{\phi}{2\pi}T$. Med grader i stedet for radianer er $2\pi$ det samme som 360°.` }],
/* 8 */ [
  { h: 'Skriv begge som visere', f: ['PHASOR', 'POLREK'],
    s: r`$$\mathbf V_1=10\angle0^\circ=10,\qquad\mathbf V_2=10\angle120^\circ=10\cos120^\circ+j10\sin120^\circ=-5+j8{,}66$$`, r: 'cos 120° = −0,5 og sin 120° = 0,866 (120° ligger i 2. kvadrant: venstre og op).' },
  { h: 'Serie: spændingerne lægges sammen', f: ['KVL', 'ADD'],
    hv: 'Kilderne sidder i serie, så den samlede spænding er summen (KVL). Med visere lægges realdel og imaginærdel sammen hver for sig.',
    s: r`$$\mathbf V_s=(10-5)+j(0+8{,}66)=«re»+j«im»$$` },
  { h: 'Tilbage til polær form og til tid', f: ['REKPOL', 'PHASOR'],
    s: r`$$|\mathbf V_s|=\sqrt{«re»^2+«im»^2}=«m»,\qquad\phi=\tan^{-1}\frac{«im»}{«re»}=«a»^\circ$$ $$v_s(t)=«m»\cos(\omega t+«a»^\circ)\ \text{V}$$` }],
/* 9 */ [
  { h: 'Isolér den ukendte viser', f: 'KVL',
    s: r`$$\mathbf V_s=\mathbf V_1+\mathbf V_2\ \Rightarrow\ \mathbf V_2=\mathbf V_s-\mathbf V_1$$`, r: r`Flyt $\mathbf V_1$ over på den anden side: den skifter fortegn.` },
  { h: 'V₁ på rektangulær form', f: 'POLREK',
    s: r`$$\mathbf V_1=12\cos(-30^\circ)+j12\sin(-30^\circ)=«r1»+j(«i1»)$$` },
  { h: 'Træk fra', f: 'ADD',
    s: r`$$\mathbf V_2=20-(«r1»+j(«i1»))=(20-«r1»)+j(0-(«i1»))=«re»+j«im»$$`, r: 'Et minus foran en parentes skifter fortegn på ALLE led inde i den.' },
  { h: 'Polær form', f: 'REKPOL',
    s: r`$$|\mathbf V_2|=\sqrt{«re»^2+«im»^2}=«m»\ \text{V},\qquad\angle\mathbf V_2=\tan^{-1}\frac{«im»}{«re»}=«a»^\circ$$` }],
/* 10 */ [
  { h: 'Hvorfor er R₁ ligegyldig?', f: 'OHM',
    hv: r`$R_1=100\ \text{M}\Omega$ er så stor, at der næsten ingen strøm løber. Spændingsfaldet $i\cdot R$ i resten af kredsløbet er derfor ≈ 0, og $V_s$ er bare summen af de to kilder (KVL).` },
  { h: 'Skriv kilderne som visere', f: ['PHASOR', 'POLREK'],
    hv: r`$V_2$ har fasen $-\pi/2=-90^\circ$.`,
    s: r`$$\mathbf V_1=15\angle0^\circ=15,\qquad\mathbf V_2=8\angle{-90^\circ}=8\cos(-90^\circ)+j8\sin(-90^\circ)=-j8$$`, r: 'cos(−90°) = 0 og sin(−90°) = −1.' },
  { h: 'Læg sammen (serie)', f: ['KVL', 'ADD'], s: r`$$\mathbf V_s=15+(-j8)=15-j8$$` },
  { h: 'Polær form', f: 'REKPOL',
    s: r`$$|\mathbf V_s|=\sqrt{15^2+8^2}=\sqrt{289}=«m»\ \text{V},\qquad\phi=\tan^{-1}\frac{-8}{15}=«a»^\circ$$`, n: 'Realdelen er positiv, så arctan giver direkte den rigtige kvadrant.' },
  { h: 'Tilbage til tid', f: ['PHASOR', 'OMEGA'],
    s: r`$\omega=2\pi\cdot50=«w|:5»$ rad/s. $$V_s(t)=«m»\cos(«w|:5»\,t«a»^\circ)\ \text{V}$$` },
  { h: 'Værdien til t = 5 ms',
    s: r`$\omega t=314{,}16\cdot0{,}005=1{,}571\ \text{rad}=90^\circ$. $$V_s=«m»\cos(90^\circ«a»^\circ)=«v5»\ \text{V}$$`,
    r: 'Fra radianer til grader: gang med 180/π. 1,571·180/π = 90°.',
    n: r`Tjek: $V_1(5\,\text{ms})=15\cos90^\circ=0$ og $V_2(5\,\text{ms})=8\cos(90^\circ-90^\circ)=8$. Summen er 8 ✓` }]
];
})();
