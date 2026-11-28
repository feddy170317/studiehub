/* los_4.js · Pædagogiske løsninger tema 7 (kompleks effekt) og 8 (trefase). Se los_1.js for format. */
(function () {
'use strict';
var r = String.raw;
window.LOS = window.LOS || {};

/* ======================= 7 · Kompleks effekt ======================= */
LOS[7] = [
/* 1 */ [
  { h: 'Tilsyneladende effekt', f: 'S',
    hv: r`Størrelsen af $\mathbf S=\mathbf V\mathbf I^*$ er længden af V gange længden af I. Konjugeringen ændrer kun vinklen, ikke længden.`,
    s: r`$$|S|=V_{rms}\,I_{rms}=230\cdot10=«S»\ \text{VA}$$`,
    n: 'Enheden er VA, ikke W. Ikke alt bliver til nyttig effekt: det afhænger af vinklen.' }],
/* 2 */ [
  { h: 'Effekttrekanten', f: ['SPQ', 'REKPOL'],
    hv: r`$\mathbf S=P+jQ$ er et komplekst tal. P er den vandrette side, Q den lodrette, og |S| er hypotenusen.`,
    s: r`$$|S|=\sqrt{800^2+600^2}=\sqrt{1\,000\,000}=«S»\ \text{VA}$$`, r: 'Pythagoras.' },
  { h: 'Effektfaktor', f: ['SPQ', 'PF'],
    hv: r`Fra (6.25) er $P=|S|\cos\theta$. Isolér $\cos\theta$ ved at dividere med $|S|$.`,
    s: r`$$PF=\cos\theta=\frac{P}{|S|}=\frac{800}{1000}=«PF»$$` }],
/* 3 */ [
  { h: 'Aktiv effekt', f: 'SPQ',
    s: r`$$P=|S|\cos\theta=|S|\cdot PF=5\cdot0{,}6=«P|kW»\ \text{kW}$$` },
  { h: 'Reaktiv effekt med Pythagoras', f: 'SPQ',
    s: r`$$|S|^2=P^2+Q^2\ \Rightarrow\ Q=\sqrt{|S|^2-P^2}=\sqrt{5^2-3^2}=\sqrt{16}=«Q|kvar»\ \text{kvar}$$`,
    r: ['Flyt P² over på den anden side: det bliver −P².', 'Tag kvadratroden på begge sider.'],
    n: r`Q er positiv, fordi belastningen er induktiv ($\theta>0$, så $\sin\theta>0$).` }],
/* 4 */ [
  { h: 'Hvorfor den konjugerede strøm?', f: ['S', 'CONJ'],
    hv: r`Med $\mathbf I^*$ bliver vinklen i $\mathbf S$ lig med $\theta_V-\theta_I=\theta_Z$ (6.8). Så kommer P og Q ud med det rigtige fortegn. Konjugering vender fortegnet på vinklen.`,
    s: r`$$\mathbf I=5\angle{-30^\circ}\ \Rightarrow\ \mathbf I^*=5\angle{+30^\circ}$$` },
  { h: 'Gang på polær form', f: 'MUL',
    s: r`$$\mathbf S=120\angle0^\circ\cdot5\angle30^\circ=(120\cdot5)\angle(0^\circ+30^\circ)=«m»\angle30^\circ$$`, r: 'Gang længderne, læg vinklerne sammen.' },
  { h: 'Del op i P og Q', f: ['POLREK', 'SPQ'],
    s: r`$$P=«m»\cos30^\circ=«P»\ \text{W},\qquad Q=«m»\sin30^\circ=«Q»\ \text{var}$$` }],
/* 5 */ [
  { h: 'Strømmen', f: ['REKPOL', 'THZ'],
    s: r`$$|Z|=\sqrt{8^2+6^2}=10\ \Omega,\qquad I=\frac{V}{|Z|}=\frac{100}{10}=«I»\ \text{A}$$` },
  { h: 'P og Q fra strømmen', f: 'SI2Z',
    hv: r`Når strømmen er kendt, giver (6.27) direkte $P=I^2R$ og $Q=I^2X$. R bruger effekten, og X låner den ud og tilbage.`,
    s: r`$$P=10^2\cdot8=«P»\ \text{W},\qquad Q=10^2\cdot6=«Q»\ \text{var}$$` }],
/* 6 */ [
  { h: 'Strømmen', f: ['REKPOL', 'THZ'], s: r`$$|Z|=\sqrt{12^2+16^2}=20\ \Omega,\qquad I=\frac{200}{20}=«I»\ \text{A}$$` },
  { h: 'P og Q', f: 'SI2Z',
    s: r`$$P=10^2\cdot12=«P»\ \text{W},\qquad Q=10^2\cdot(-16)=«Q»\ \text{var}$$`, n: 'Negativ X giver negativ Q: kapacitiv.' },
  { h: 'Effektfaktor', f: ['RXZ', 'PF'], s: r`$$PF=\frac{R}{|Z|}=\frac{12}{20}=«PF»$$`, n: 'Foranløbende (kapacitiv).' }],
/* 7 */ [
  { h: 'Amplitude eller RMS?', f: 'RMS',
    hv: r`311 er amplituden (tallet foran sin). Effektformler som $P=V^2/R$ er udledt for RMS-værdier.`,
    s: r`$$V_{rms}=\frac{311}{\sqrt2}=«V»\ \text{V}$$` },
  { h: 'Effekten i modstanden', f: 'P17',
    s: r`$$P=\frac{V_{rms}^2}{R}=\frac{«V»^2}{50}=«P»\ \text{W}$$`, n: 'Bruger du 311 direkte, får du det dobbelte. Den fejl er klassisk.' }],
/* 8 */ { x: function (R) { R.zt = Math.sqrt(136); },
  los: [
  { h: 'Den samlede impedans', f: 'ZCOMB',
    hv: r`Kildens indre modstand og belastningen har samme strøm: serie, så de lægges sammen.`,
    s: r`$$Z_{tot}=R_S+Z_L=2+8+j6=10+j6\ \Omega,\qquad|Z_{tot}|=\sqrt{10^2+6^2}=«zt»\ \Omega$$` },
  { h: 'Strømmen', f: 'THZ',
    hv: 'Strømmen bestemmes af HELE kredsløbet, fordi kilden skal drive den gennem både R_S og belastningen.',
    s: r`$$I=\frac{100}{«zt»}=«I»\ \text{A}$$` },
  { h: 'Effekten i belastningen alene', f: 'SI2Z',
    hv: r`Vi vil kun have belastningens effekt. Derfor bruges belastningens egen R og X (8 og 6), ikke $R_S$.`,
    s: r`$$P_L=I^2\cdot8=«P»\ \text{W},\qquad Q_L=I^2\cdot6=«Q»\ \text{var},\qquad|S_L|=I^2|Z_L|=I^2\cdot10=«S»\ \text{VA}$$` }] },
/* 9 */ [
  { h: 'Hvor meget Q trækker fabrikken?', f: 'SPQ',
    hv: r`Fra (6.25): $P=|S|\cos\theta$ og $Q=|S|\sin\theta$. Divider de to: $\frac QP=\frac{\sin\theta}{\cos\theta}=\tan\theta$.`,
    s: r`$$\theta=\arccos0{,}8=36{,}87^\circ,\qquad Q=P\tan\theta=10\cdot0{,}75=«Q|kvar»\ \text{kvar}$$`, r: r`Isolér $Q$: gang begge sider af $\frac QP=\tan\theta$ med $P$.` },
  { h: 'Hvor meget Q leverer en kondensator?', f: ['SI2Z', 'ZC'],
    hv: r`For kondensatoren er $I=V/X_C$, så (6.27) giver $|Q_C|=I^2X_C=\frac{V^2}{X_C}$. Med $X_C=\frac1{\omega C}$ fra (3.61) bliver det $|Q_C|=V^2\omega C$.`,
    r: 'At dividere med en brøk er at gange med den omvendte: V² / (1/(ωC)) = V²·ωC.' },
  { h: 'Isolér C', s: r`For $PF=1$ skal kondensatoren levere hele $Q$: $$C=\frac{Q}{\omega V^2}=\frac{7500}{314{,}16\cdot400^2}=«C|µF»\ \mu\text{F}$$`, r: 'Del begge sider af Q = V²ωC med ωV².',
    n: 'Kondensatoren leverer nu "skummet" lokalt. Ledningen skal kun bære P, og strømmen falder 20 %.' }],
/* 10 */ [
  { h: 'Fra amplitude til RMS', f: 'RMS',
    hv: 'Effektformlerne for S, P og Q bruger RMS-visere.',
    s: r`$$V_{rms}=\frac{325}{\sqrt2}=«V»\ \text{V}$$` },
  { h: 'Kondensatorens impedans', f: 'ZC', s: r`$$Z_C=\frac{-j}{2\pi\cdot50\cdot200\cdot10^{-6}}=-j«xc»\ \Omega$$` },
  { h: 'Samlet impedans og strøm', f: ['ZCOMB', 'REKPOL', 'THZ'],
    hv: r`$R_S$, $R_L$ og $C$ har samme strøm: serie.`,
    s: r`$$Z_{tot}=4+30-j«xc»,\qquad|Z_{tot}|=\sqrt{34^2+«xc»^2}=«zt»\ \Omega,\qquad I=\frac{«V»}{«zt»}=«I»\ \text{A}$$` },
  { h: 'P og Q for belastningen', f: 'SI2Z',
    hv: r`Kun belastningens R ($R_L=30$) og X ($-X_C$), ikke $R_S$.`,
    s: r`$$P=I^2\cdot30=«P»\ \text{W},\qquad Q=-I^2\cdot«xc»=«Q»\ \text{var}$$` },
  { h: '|S| og effektfaktor', f: ['SPQ', 'PF'],
    s: r`$$|S|=\sqrt{P^2+Q^2}=«S»\ \text{VA},\qquad PF=\frac{P}{|S|}=«PF»\ \text{(foranløbende, kapacitiv)}$$` },
  { h: 'Kontrol', f: 'S', s: r`$|\mathbf V_L|=I\,|Z_L|=«VL»$ V, og $|S|=V_L\,I$ ✓` }]
];

/* ======================= 8 · Trefase ======================= */
LOS[8] = [
/* 1 */ [
  { h: 'Linjespænding = forskellen mellem to faser', f: ['V3', 'VLINE'],
    hv: r`Mellem to faser måler man forskellen mellem to visere, der er 120° fra hinanden. Den forskel er $\sqrt3$ gange så lang som hver af dem.`,
    s: r`$$V_L=\sqrt3\cdot230=«V»\ \text{V}$$`, n: 'Det er "400 V" i en dansk trefase-stikkontakt.' }],
/* 2 */ [
  { h: 'Fasestrømmen', f: 'OHM',
    hv: 'Med ideel nulleder har hver modstand præcis fasespændingen over sig (fra fasen til nulpunktet). Hver fase kan regnes for sig.',
    s: r`$$I_f=\frac{230}{46}=«I»\ \text{A}$$` },
  { h: 'Strømmen i nullederen', f: ['IN', 'POLREK'],
    hv: 'Nullederen samler alle tre strømme (KCL i stjernepunktet). De er lige store og 120° fra hinanden.',
    s: r`$$5\angle{-120^\circ}=-2{,}5-j4{,}33,\qquad 5\angle120^\circ=-2{,}5+j4{,}33$$ $$\mathbf I_N=5+(-2{,}5-j4{,}33)+(-2{,}5+j4{,}33)=«IN»$$`,
    n: 'Derfor kan nullederen være tynd, når lasten er balanceret.' }],
/* 3 */ [
  { h: 'Polær → rektangulær', f: 'POLREK',
    s: r`$$\mathbf V_2=230\cos(-120^\circ)+j\,230\sin(-120^\circ)=230\cdot(-0{,}5)+j\,230\cdot(-0{,}866)=«re»+j(«im»)\ \text{V}$$`,
    r: '−120° ligger i 3. kvadrant (venstre og ned): både cos og sin er negative.' }],
/* 4 */ [
  { h: 'Effekten i én fase', f: 'P17',
    hv: 'Hver modstand har fasespændingen (RMS) over sig.',
    s: r`$$P_1=\frac{V^2}{R}=\frac{230^2}{23}=«P1»\ \text{W}$$` },
  { h: 'Alle tre faser', f: 'ST', hv: 'Balanceret: alle tre faser er ens, så den samlede effekt er 3 gange én fase.',
    s: r`$$P_{3f}=3\cdot«P1»=«P»\ \text{W}$$` }],
/* 5 */ [
  { h: 'Fasestrømmen', f: ['REKPOL', 'THZ'], s: r`$$|Z|=\sqrt{30^2+40^2}=50\ \Omega,\qquad I_f=\frac{230}{50}=«I»\ \text{A}$$` },
  { h: 'P og Q for alle tre faser', f: ['SI2Z', 'ST'],
    s: r`$$P=3\,I^2R=3\cdot«I»^2\cdot30=«P»\ \text{W},\qquad Q=3\,I^2X=3\cdot«I»^2\cdot40=«Q»\ \text{var}$$` },
  { h: 'Effektfaktor', f: ['RXZ', 'PF'], s: r`$$PF=\frac{R}{|Z|}=\frac{30}{50}=«PF»\ \text{(induktiv)}$$` }],
/* 6 */ [
  { h: 'Fasestrømmene', f: ['OHMAC', 'DIV'],
    hv: 'Med ideel nulleder har hver modstand sin fasespænding over sig. At dividere med en ren modstand (vinkel 0°) ændrer ikke vinklen.',
    s: r`$$\mathbf I_1=\frac{230\angle0^\circ}{23}=10\angle0^\circ,\quad\mathbf I_2=\frac{230\angle{-120^\circ}}{46}=5\angle{-120^\circ},\quad\mathbf I_3=5\angle120^\circ$$` },
  { h: 'Fase 2 + fase 3', f: ['POLREK', 'ADD'],
    s: r`$$(-2{,}5-j4{,}33)+(-2{,}5+j4{,}33)=-5$$`, n: 'Imaginærdelene ophæver hinanden.' },
  { h: 'Nullederen', f: 'IN', s: r`$$\mathbf I_N=10+(-5)=«IN»\angle0^\circ\ \text{A}$$`, n: 'Kun "overskuddet" i fase 1 skal tilbage gennem nullederen.' }],
/* 7 */ [
  { h: 'Fra fasestørrelser til linjestørrelser', f: ['ST', 'VLINE'],
    hv: r`(6.57): $|S_T|=3\,V_fI$. Fasespændingen er $V_f=V_L/\sqrt3$ (6.50).`,
    s: r`$$|S_T|=3\cdot\frac{V_L}{\sqrt3}\cdot I=\sqrt3\,V_L\,I$$`, r: '3/√3 = √3, fordi √3·√3 = 3.' },
  { h: 'Aktiv effekt', f: 'PT3', s: r`$$P=\sqrt3\cdot400\cdot10\cdot0{,}85=«P»\ \text{W}$$` }],
/* 8 */ [
  { h: 'Hver fasestrøm: divider på polær form', f: ['OHMAC', 'DIV'],
    hv: 'Divider længderne, og træk vinklerne fra hinanden. Spolen har vinklen +90°, og kondensatoren har −90°.',
    s: r`$$\mathbf I_1=\frac{230\angle0^\circ}{20\angle0^\circ}=11{,}5\angle0^\circ$$ $$\mathbf I_2=\frac{230\angle{-120^\circ}}{20\angle90^\circ}=11{,}5\angle{-210^\circ}=11{,}5\angle«a2»^\circ,\qquad\mathbf I_3=\frac{230\angle120^\circ}{20\angle{-90^\circ}}=11{,}5\angle«a3»^\circ$$`,
    r: '−210° og +150° er samme retning: læg 360° til.' },
  { h: 'Læg I₂ og I₃ sammen', f: ['POLREK', 'ADD'],
    s: r`Realdelene: $2\cdot11{,}5\cos150^\circ=-19{,}92$. Imaginærdelene: $11{,}5\sin150^\circ+11{,}5\sin(-150^\circ)=0$.` },
  { h: 'Nullederen', f: ['IN', 'REKPOL'],
    s: r`$$\mathbf I_N=11{,}5-19{,}92=«re»\ \Rightarrow\ «IN»\angle«aN»^\circ\ \text{A}$$`,
    n: 'Strømmen er lige stor i alle faser, men nulleder-strømmen er alligevel stor. Spolen og kondensatoren har drejet vinklerne, så strømmene ikke længere er 120° fra hinanden.' }],
/* 9 */ [
  { h: 'Hvor kommer Millmans formel fra?', f: ['KCL', 'NODE'],
    hv: r`Stjernepunktet N′ er en knude. KCL: summen af strømmene ud af N′ er 0. Strømmen fra N′ gennem $Z_k$ til fase k er $(V_{N'}-V_k)/Z_k$ (2.5), og strømmen gennem nullederen er $V_{N'}/R_N$.`,
    s: r`$$\sum_k\frac{V_{N'}-V_k}{Z_k}+\frac{V_{N'}}{R_N}=0\ \Rightarrow\ V_{N'}=\frac{\sum V_k/Z_k}{\sum1/Z_k+1/R_N}$$`,
    r: [r`Del hver brøk op: $\frac{V_{N'}-V_k}{Z_k}=\frac{V_{N'}}{Z_k}-\frac{V_k}{Z_k}$.`, r`Saml $V_{N'}$-leddene og sæt $V_{N'}$ uden for parentes. Flyt $\sum V_k/Z_k$ over, og del med parentesen.`] },
  { h: 'Tælleren', f: ['DIV', 'ADD'],
    s: r`$$\frac{230}{10}+\frac{230\angle{-120^\circ}}{20}+\frac{230\angle120^\circ}{20}=23+11{,}5\angle{-120^\circ}+11{,}5\angle120^\circ=23-11{,}5=«nr»\ \text{A}$$`,
    n: 'De to sidste ophæver hinandens imaginærdele, og realdelene er hver −5,75.' },
  { h: 'Nævneren og V_N′',
    s: r`$$\frac1{10}+\frac1{20}+\frac1{20}+\frac15=0{,}4\ \text{S},\qquad V_{N'}=\frac{«nr»}{0{,}4}=«VN»\ \text{V}$$` },
  { h: 'Strømmene', f: ['OHM', 'NODE'],
    hv: r`Nullederen har $V_{N'}$ over sig (fra N′ til jord). Over $R_1$ ligger forskellen $V_1-V_{N'}$.`,
    s: r`$$I_N=\frac{V_{N'}}{R_N}=«IN»\ \text{A},\qquad I_1=\frac{230-«VN»}{10}=«I1»\ \text{A}$$`,
    n: 'Stjernepunktet "flyder" væk fra 0 V, fordi nullederen ikke er ideel. Det giver skæve fasespændinger på lasten.' }],
/* 10 */ [
  { h: 'Fasernes impedanser', f: ['ZC', 'ZL', 'ZCOMB'],
    s: r`$$Z_1=50-j\frac1{314{,}16\cdot10^{-4}}=50-j«x1»\ \Omega,\quad Z_2=100\ \Omega,\quad Z_3=30+j\,314{,}16\cdot0{,}1=30+j«x3»\ \Omega$$` },
  { h: 'Stjernepunktets spænding (Millman)', f: ['KCL', 'NODE'],
    hv: 'Se opgave 9 for udledningen: KCL i stjernepunktet, med 1/R_N i nævneren.',
    s: r`$$\mathbf V_{N'}=\frac{\sum\mathbf V_k/Z_k}{\sum1/Z_k+1/R_N}=«VN»\angle«aVN»^\circ\ \text{V}$$`,
    r: 'Regn hver brøk V_k/Z_k på polær form (divider længder, træk vinkler fra), læg dem sammen på rektangulær form, og divider til sidst.' },
  { h: 'Fasestrømmene', f: 'NODE',
    hv: r`Over hver $Z_k$ ligger forskellen $\mathbf V_k-\mathbf V_{N'}$.`,
    s: r`$$\mathbf I_k=\frac{\mathbf V_k-\mathbf V_{N'}}{Z_k}:\quad\mathbf I_1=«I1»\angle«a1»^\circ,\ \mathbf I_2=«I2»\angle«a2»^\circ,\ \mathbf I_3=«I3»\angle«a3»^\circ\ \text{A}$$` },
  { h: 'Nullederen', f: ['OHM', 'IN'],
    s: r`$$\mathbf I_N=\frac{\mathbf V_{N'}}{R_N}=«IN»\angle«aN»^\circ\ \text{A}$$`, n: r`Tjek: det skal være lig $\mathbf I_1+\mathbf I_2+\mathbf I_3$ (KCL i stjernepunktet).` },
  { h: 'Samlet effekt', f: 'S',
    hv: 'Effekten i hver fase er V_k·I_k*, og den samlede effekt er summen af de tre faser.',
    s: r`$$\mathbf S=\sum\mathbf V_k\mathbf I_k^*=«P»+j«Q»\ \text{VA},\qquad|S|=«S»\ \text{VA},\qquad PF=\frac{P}{|S|}=«PF»$$` }]
];
})();
