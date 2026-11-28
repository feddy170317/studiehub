/* los_3.js · Pædagogiske løsninger tema 5 (impedans) og 6 (effekt). Se los_1.js for format. */
(function () {
'use strict';
var r = String.raw, PI = Math.PI;
window.LOS = window.LOS || {};

var KONJ = r`Gang tæller og nævner med nævnerens konjugerede (samme tal med modsat fortegn på j). Det er at gange med 1, så værdien ændres ikke, men nævneren bliver et reelt tal: $(a+jb)(a-jb)=a^2-(jb)^2=a^2+b^2$, fordi $j^2=-1$.`;

/* ======================= 5 · Impedans ======================= */
LOS[5] = [
/* 1 */ [
  { h: 'Vinkelfrekvensen', f: 'OMEGA', s: r`$$\omega=2\pi\cdot50=314{,}16\ \text{rad/s}$$` },
  { h: 'Spolens impedans', f: 'ZL',
    hv: r`Spolens "modstand" mod vekselstrøm vokser med frekvensen: jo hurtigere strømmen skal skifte, jo mere spænding laver spolen ($v=L\,di/dt$). Faktoren $j$ betyder, at spændingen ligger 90° foran strømmen.`,
    s: r`$$X_L=\omega L=314{,}16\cdot0{,}2=«X»\ \Omega,\qquad Z_L=j«X»\ \Omega$$` }],
/* 2 */ [
  { h: 'Kondensatorens impedans', f: 'ZC',
    hv: 'Jo højere frekvens, jo lettere slipper vekselstrømmen igennem kondensatoren. Derfor står ω i nævneren.',
    s: r`$$|Z_C|=\frac1{\omega C}=\frac1{2\pi\cdot1000\cdot10\cdot10^{-6}}=\frac1{0{,}06283}=«X»\ \Omega,\qquad Z_C=-j«X»\ \Omega$$`,
    r: r`$\frac1j=-j$: gang tæller og nævner med $j$, så $\frac{1\cdot j}{j\cdot j}=\frac{j}{-1}=-j$ (fordi $j^2=-1$, (A.9)).` }],
/* 3 */ [
  { h: 'Serie: læg impedanserne sammen', f: ['ZCOMB', 'ZRX'],
    hv: 'R og L har samme strøm, så de er i serie. Impedanser i serie lægges sammen som modstande. R er realdelen, og X er imaginærdelen.',
    s: r`$$Z=30+j40\ \Omega$$` },
  { h: 'Polær form', f: 'REKPOL',
    s: r`$$|Z|=\sqrt{30^2+40^2}=\sqrt{2500}=«m»\ \Omega,\qquad\angle Z=\tan^{-1}\frac{40}{30}=«a»^\circ$$`,
    n: 'Positiv vinkel betyder induktiv (spændingen ligger foran strømmen). 30-40-50 er 3-4-5-trekanten ganget med 10.' }],
/* 4 */ [
  { h: 'Kondensatorens reaktans', f: 'ZC',
    s: r`$$X_C=\frac1{\omega C}=\frac1{2\pi\cdot100\cdot10\cdot10^{-6}}=«X»\ \Omega,\qquad Z_C=-j«X»\ \Omega$$` },
  { h: 'Serie: læg sammen', f: ['ZCOMB', 'ZRX'], hv: 'Samme strøm gennem R og C: serie.', s: r`$$Z=100-j«X»\ \Omega$$` },
  { h: 'Polær form', f: 'REKPOL',
    s: r`$$|Z|=\sqrt{100^2+«X»^2}=«m»\ \Omega,\qquad\angle Z=\tan^{-1}\frac{-«X»}{100}=«a»^\circ$$`,
    n: 'Negativ vinkel betyder kapacitiv.' }],
/* 5 */ [
  { h: 'Reaktanserne hver for sig', f: ['ZL', 'ZC'],
    s: r`$$X_L=2\pi\cdot50\cdot0{,}05=«XL»\ \Omega,\qquad X_C=\frac1{2\pi\cdot50\cdot100\cdot10^{-6}}=«XC»\ \Omega$$` },
  { h: 'Serie: imaginærdelene lægges sammen', f: ['ZCOMB', 'ADD'],
    hv: r`$Z=R+jX_L-jX_C=R+j(X_L-X_C)$. Spolen trækker vinklen op, og kondensatoren trækker den ned.`,
    s: r`$$X=X_L-X_C=«XL»-«XC»=«X»\ \Omega$$`, n: 'X er negativ, så kondensatoren "vinder": kredsløbet er kapacitivt.' },
  { h: 'Størrelse og vinkel', f: 'REKPOL',
    s: r`$$|Z|=\sqrt{10^2+(«X»)^2}=«m»\ \Omega,\qquad\angle Z=«a»^\circ$$`, r: 'Et negativt tal i anden giver et positivt tal.' }],
/* 6 */ [
  { h: 'Parallel: produkt over sum', f: 'ZCOMB',
    hv: r`R og L sidder mellem de samme to punkter: parallel. Formlen er den samme som for modstande, men med komplekse tal. $Z_R=100$ og $Z_L=j100$.`,
    s: r`$$Z=\frac{100\cdot j100}{100+j100}=\frac{j10\,000}{100+j100}$$` },
  { h: 'Fjern j fra nævneren', f: 'CONJ', r: KONJ,
    s: r`$$Z=\frac{j10\,000\,(100-j100)}{(100+j100)(100-j100)}=\frac{j1\,000\,000-j^2\,1\,000\,000}{100^2+100^2}$$` },
  { h: 'Ryd op', f: 'JJ',
    s: r`$$Z=\frac{1\,000\,000+j1\,000\,000}{20\,000}=«re»+j«im»\ \Omega\ \ (=«m»\angle45^\circ)$$`,
    r: r`$-j^2=-(-1)=+1$. Del hvert led i tælleren med 20 000.` }],
/* 7 */ [
  { h: 'Impedansens størrelse og vinkel', f: 'REKPOL',
    s: r`$$|Z|=\sqrt{4^2+3^2}=5\ \Omega,\qquad\angle Z=\tan^{-1}\frac{-3}{4}=-36{,}87^\circ$$` },
  { h: 'Ohms lov med visere', f: ['OHMAC', 'DIV'],
    hv: r`$\mathbf I=\mathbf V/\mathbf Z$. Når man dividerer på polær form, divideres længderne, og vinklerne trækkes fra hinanden.`,
    s: r`$$I_m=\frac{V_m}{|Z|}=\frac{10}{5}=«Im»\ \text{A},\qquad\theta_i=\theta_v-\angle Z=\theta_v-(-36{,}87^\circ)=\theta_v+«a»^\circ$$`,
    r: 'Minus et negativt tal giver plus.' },
  { h: 'Fortolkning', n: r`Strømmen ligger $«a»^\circ$ FØR spændingen. Sådan opfører en kapacitiv belastning sig. At spændingen er en sin, flytter både $\theta_v$ og $\theta_i$ lige meget, så forskydningen er den samme.` }],
/* 8 */ [
  { h: 'Betingelsen X_L = X_C', f: ['ZL', 'ZC'],
    hv: 'Ved resonans er spolens og kondensatorens reaktans lige store, så de ophæver hinanden.',
    s: r`$$\omega L=\frac1{\omega C}\ \Rightarrow\ \omega^2=\frac1{LC}\ \Rightarrow\ \omega_0=\frac1{\sqrt{LC}}$$`,
    r: ['Gang begge sider med ω: ω²L = 1/C.', 'Del begge sider med L: ω² = 1/(LC).', 'Tag kvadratroden på begge sider.'] },
  { h: 'Sæt tal ind', f: 'OMEGA',
    s: r`$$f_0=\frac{\omega_0}{2\pi}=\frac1{2\pi\sqrt{0{,}01\cdot10^{-6}}}=\frac1{2\pi\cdot10^{-4}}=«f»\ \text{Hz}$$`,
    r: '√(10⁻⁸) = 10⁻⁴ (halvér eksponenten).',
    n: r`Under $f_0$ er serie-LC kapacitiv, og over $f_0$ er den induktiv.` }],
/* 9 */ [
  { h: 'Reaktanserne', f: ['ZL', 'ZC'],
    s: r`$$Z_L=j\,2\pi\cdot1000\cdot0{,}01=j«xl»\ \Omega,\qquad Z_C=-j\frac1{2\pi\cdot1000\cdot10^{-5}}=-j«xc»\ \Omega$$` },
  { h: 'L ∥ C: produkt over sum', f: ['ZCOMB', 'JJ'],
    hv: 'L og C sidder mellem de samme to punkter: parallel.',
    s: r`$$Z_L\parallel Z_C=\frac{(j«xl»)(-j«xc»)}{j«xl»-j«xc»}=\frac{-j^2\cdot«xl»\cdot«xc»}{j(«xl»-«xc»)}=\frac{1000}{j\,46{,}92}=j(«xp»)\ \Omega$$`,
    r: [r`$j\cdot(-j)=-j^2=+1$.`, r`Sæt $j$ uden for parentes i nævneren.`, r`$\frac{1}{j}=-j$, så $\frac{1000}{j\,46{,}92}=-j\,21{,}3$.`],
    n: r`$X_L\cdot X_C=\omega L\cdot\frac1{\omega C}=\frac LC=1000$: ω går ud.` },
  { h: 'Serie med R', f: ['ZCOMB', 'REKPOL'],
    s: r`$$Z=20+j(«xp»)\ \Omega,\qquad|Z|=\sqrt{20^2+(«xp»)^2}=«m»\ \Omega,\qquad\angle Z=«a»^\circ$$`,
    n: 'Kapacitiv: ved 1 kHz "vinder" kondensatoren i parallellen (den mindste reaktans tager mest strøm).' }],
/* 10 */ { x: function (R) { R.den = 1e4 + R.xl * R.xl; },
  los: [
  { h: 'Vinkelfrekvens og reaktanser', f: ['OMEGA', 'ZL', 'ZC'],
    s: r`$$\omega=2\pi\cdot2000=«w»\ \text{rad/s},\quad Z_L=j\omega L=j«xl»\ \Omega,\quad Z_C=\frac{-j}{\omega C}=-j«xc»\ \Omega$$` },
  { h: 'L ∥ R: produkt over sum', f: 'ZCOMB',
    hv: 'L og R sidder mellem de samme to punkter: parallel.',
    s: r`$$Z_L\parallel R=\frac{jX\cdot R}{R+jX}\qquad\text{med } X=«xl»,\ R=100$$` },
  { h: 'Gang med den konjugerede', f: ['CONJ', 'JJ'], r: KONJ,
    s: r`$$\frac{jXR\,(R-jX)}{R^2+X^2}=\frac{X^2R}{R^2+X^2}+j\,\frac{XR^2}{R^2+X^2}$$ Nævneren: $$R^2+X^2=100^2+«xl»^2=«den»$$ Realdel og imaginærdel hver for sig: $$\frac{«xl»^2\cdot100}{«den»}=«pr»,\qquad\frac{«xl»\cdot100^2}{«den»}=«pi»$$ $$Z_L\parallel R=«pr»+j«pi»\ \Omega$$`,
    r: r`Gang ud: $jXR\cdot R=jXR^2$ og $jXR\cdot(-jX)=-j^2X^2R=+X^2R$.` },
  { h: 'Serie med C', f: ['ZCOMB', 'ADD'],
    hv: 'Al strøm går gennem parallel-blokken og derefter gennem C: serie, så imaginærdelene lægges sammen.',
    s: r`$$Z_{EQ}=«pr»+j«pi»-j«xc»=«re»+j(«im»)\ \Omega$$` },
  { h: 'Størrelse, vinkel og type', f: 'REKPOL',
    s: r`$$|Z_{EQ}|=\sqrt{«re»^2+(«im»)^2}=«m»\ \Omega,\qquad\angle Z_{EQ}=«a»^\circ\ \Rightarrow\ \text{kapacitiv}$$` },
  { h: 'Strømmens amplitude', f: ['OHMAC', 'THZ'],
    s: r`$$I_m=\frac{V_m}{|Z_{EQ}|}=\frac{100}{«m»}=«Im»\ \text{A}$$`, n: 'Impedansens vinkel er negativ, så strømmen ligger FØR spændingen (kapacitiv).' }] }
];

/* ======================= 6 · Effekt ======================= */
LOS[6] = [
/* 1 */ [
  { h: 'Strømmens amplitude', f: ['ZR', 'OHM'],
    hv: 'En modstand har en reel impedans (vinkel 0°). Strøm og spænding er i fase, og Ohms lov gælder direkte for amplituderne.',
    s: r`$$I_m=\frac{10}{5}=«Im»\ \text{A}$$` },
  { h: 'Middeleffekt', f: 'PAVG',
    hv: r`I (6.4) er $p(t)$ et konstant led plus et led, der svinger med $2\omega t$. Middelværdien af svingningen over en periode er 0 (3.23). Tilbage bliver $\frac{V_mI_m}{2}\cos\theta_Z$. For en modstand er $\theta_Z=0$.`,
    s: r`$$P_{avg}=\tfrac12\cdot10\cdot2\cdot\cos0^\circ=«P»\ \text{W}$$`, r: 'cos 0° = 1.' }],
/* 2 */ [
  { h: 'Fra amplitude til RMS', f: 'RMS',
    hv: 'RMS-værdien er den DC-spænding, der giver samme varme i en modstand. For en sinus er den amplituden divideret med √2.',
    s: r`$$V_{rms}=\frac{325}{\sqrt2}=\frac{325}{1{,}4142}=«V»\ \text{V}$$`, n: 'Det er de "230 V", der står på alt.' }],
/* 3 */ [
  { h: 'Middeleffekt med RMS og effektfaktor', f: 'PF',
    hv: 'Begge værdier er RMS, og effektfaktoren er givet. Så kan (6.21) bruges direkte.',
    s: r`$$P_{avg}=V_{rms}\,I_{rms}\,pf=230\cdot5\cdot0{,}8=«P»\ \text{W}$$` }],
/* 4 */ [
  { h: 'Strømmen', f: ['ZL', 'THZ'],
    hv: r`For en ren spole er $|Z|=X_L$, og $\theta_Z=+90^\circ$ (3.56).`,
    s: r`$$I_m=\frac{V_m}{|Z|}=\frac{100}{50}=«Im»\ \text{A}$$ Strømmen ligger 90° efter spændingen.` },
  { h: 'Middeleffekten', f: ['PAVG', 'PFL'],
    s: r`$$P_{avg}=\tfrac12\cdot100\cdot2\cdot\cos90^\circ=0$$`, r: 'cos 90° = 0.' },
  { h: 'Den største øjebliksværdi', f: 'P64',
    hv: r`Med $\cos\theta_Z=0$ er der kun det svingende led tilbage. Cosinus svinger mellem −1 og +1.`,
    s: r`$$p(t)=\frac{V_mI_m}{2}\cos(2\omega t+\dots)=100\cos(2\omega t+\dots)$$ Den svinger mellem $\pm«pm»$ W.`,
    n: 'Energien lånes ud og leveres tilbage igen, to gange pr. periode.' }],
/* 5 */ [
  { h: 'Gang de to kurver sammen', f: 'PT',
    s: r`$$p=v\,i=10\cos(\omega t)\cdot2\cos(\omega t)=20\cos^2(\omega t)$$` },
  { h: 'Skriv cos² om', f: 'COS2',
    hv: r`Med $x=y=\omega t$ siger (6.3): $2\cos^2(\omega t)=1+\cos(2\omega t)$.`,
    s: r`$$p=10\cdot2\cos^2(\omega t)=10\,(1+\cos2\omega t)=10+10\cos(2\omega t)$$`, r: 'Skriv 20 som 10·2, og brug (6.3) på 2cos².' },
  { h: 'Aflæs', s: r`$2\omega$ betyder dobbelt frekvens: $f_p=2\cdot50=«f»$ Hz. Størst når $\cos=1$: $p_{max}=10+10=«pm»$ W. Middelværdien er $«P»$ W.` }],
/* 6 */ [
  { h: 'Impedans og strøm', f: ['REKPOL', 'THZ'],
    s: r`$$|Z|=\sqrt{30^2+40^2}=50\ \Omega,\qquad I_m=\frac{100}{50}=«Im»\ \text{A}$$` },
  { h: 'Middeleffekt', f: ['PAVG', 'RXZ'],
    hv: r`(6.7) giver $P=\tfrac12I_m^2|Z|\cos\theta_Z$. Fra (6.15) er $|Z|\cos\theta=R$. Altså bruger kun modstanden effekt.`,
    s: r`$$P_{avg}=\tfrac12I_m^2R=\tfrac12\cdot2^2\cdot30=«P»\ \text{W}$$` },
  { h: 'Effektfaktor', f: ['PF', 'RXZ'],
    s: r`$$PF=\cos\theta_Z=\frac{R}{|Z|}=\frac{30}{50}=«PF»$$`,
    r: r`Isolér $\cos\theta$ i $R=|Z|\cos\theta$: del begge sider med $|Z|$.`,
    n: r`$\theta_Z>0$: induktiv, og strømmen er bagudrettet.` }],
/* 7 */ [
  { h: 'Vinklen mellem spænding og strøm', f: 'THZ',
    hv: 'Begge er sin-funktioner. Omskrivningen til cos (3.20) flytter begge vinkler 90°, så forskellen er den samme.',
    s: r`$$\theta=\theta_v-\theta_i=0^\circ-(-30^\circ)=30^\circ$$`, r: 'Minus et negativt tal giver plus.' },
  { h: 'Middeleffekt og effektfaktor', f: ['PAVG', 'PF'],
    s: r`$$P_{avg}=\tfrac12\cdot170\cdot5\cdot\cos30^\circ=«P»\ \text{W},\qquad PF=\cos30^\circ=«PF»$$` }],
/* 8 */ [
  { h: 'Middeleffekten', f: 'PAVG',
    s: r`$$\tfrac12V_mI_m=\tfrac12\cdot100\cdot4=«A»\ \text{W},\qquad P_{avg}=«A»\cdot\cos60^\circ=«P»\ \text{W}$$` },
  { h: 'Største og mindste øjebliksværdi', f: 'P64',
    hv: r`$p(t)$ er middelværdien plus et led med amplituden $\tfrac12V_mI_m$, der svinger mellem −1 og +1 gange.`,
    s: r`$$p_{max}=«P»+«A»=«pmax»\ \text{W},\qquad p_{min}=«P»-«A»=«pmin»\ \text{W}$$`,
    n: 'Negativ p betyder, at belastningen i et kort øjeblik sender energi TILBAGE til nettet.' }],
/* 9 */ { x: function (R) { R.XC = 1 / (314.16 * 20e-6); },
  los: [
  { h: 'Parallel: samme spænding over begge',
    hv: r`R og C sidder direkte over kilden, så begge har $230\sin(\omega t)$ over sig. Vi kan regne strømmen i hver gren for sig.` },
  { h: 'Strømmen i R', f: ['ZR', 'OHM'], s: r`$$I_R=\frac{230}{100}=«IR»\ \text{A}\quad\text{(i fase med spændingen)}$$` },
  { h: 'Strømmen i C', f: ['ZC', 'OHMAC'],
    s: r`$$|Z_C|=\frac1{\omega C}=\frac1{314{,}16\cdot20\cdot10^{-6}}=«XC»\ \Omega,\qquad I_C=\frac{230}{«XC»}=«IC»\ \text{A}$$`,
    hv: r`$Z_C$ har vinklen −90°. Ved division trækkes vinklen fra (A.18), så strømmen får +90°: den ligger 90° FØR spændingen.` },
  { h: 'Den samlede strøm (KCL med visere)', f: ['PHSUM', 'REKPOL'],
    hv: 'De to grenstrømme mødes i en knude, så de lægges sammen. De står vinkelret på hinanden (0° og 90°), så længden findes med Pythagoras.',
    s: r`$$\mathbf I=«IR»+j«IC»,\qquad I_m=\sqrt{«IR»^2+«IC»^2}=«Im»\ \text{A}$$` },
  { h: 'Middeleffekt og effektfaktor', f: ['PRX', 'PF'],
    hv: 'Kun modstanden bruger middeleffekt, så vi kan regne P på R alene.',
    s: r`$$P_{avg}=\tfrac12\cdot230\cdot«IR»=«P»\ \text{W},\qquad PF=\frac{P}{\tfrac12V_mI_m}=\frac{I_R}{I_m}=«PF»$$`,
    r: r`Forkort $\tfrac12\cdot230$ i tæller og nævner.`, n: 'Kapacitiv og foranløbende.' }] },
/* 10 */ { x: function (R) { var C = window.Cx, z1 = C(40, R.x1), z2 = C(0, -R.x2), n = C.mul(z1, z2), d = C.add(z1, z2);
    R.nr = n.re; R.ni = n.im; R.dr = d.re; R.di = d.im; R.nm = C.abs(n); R.na = C.arg(n); R.dm = C.abs(d); R.da = C.arg(d); },
  los: [
  { h: 'Impedanserne i de to grene', f: ['OMEGA', 'ZL', 'ZC', 'ZCOMB'],
    hv: r`Motorgrenen er $R_m$ og $L_m$ i serie (samme strøm), så de lægges sammen. Kondensatoren er den anden gren.`,
    s: r`$\omega=2\pi\cdot50=314{,}16$ rad/s. $$Z_1=40+j\,314{,}16\cdot0{,}08=40+j«x1»\ \Omega,\qquad Z_2=\frac{-j}{314{,}16\cdot50\cdot10^{-6}}=-j«x2»\ \Omega$$` },
  { h: 'Tæller: Z₁·Z₂', f: ['ZCOMB', 'JJ'],
    hv: 'De to grene sidder mellem de samme punkter: parallel, så vi bruger produkt over sum.',
    s: r`$$Z_1Z_2=(40+j«x1»)(-j«x2»)=«nr»+j(«ni»)$$`,
    r: r`Gang hvert led i parentesen med $-j«x2»$: $40\cdot(-j«x2»)$ giver imaginærdelen, og $j«x1»\cdot(-j«x2»)=-j^2(\dots)=+(\dots)$ giver realdelen.` },
  { h: 'Nævner: Z₁ + Z₂', f: 'ADD', s: r`$$Z_1+Z_2=40+j(«x1»-«x2»)=«dr»+j(«di»)$$` },
  { h: 'Divider på polær form', f: ['REKPOL', 'DIV'],
    hv: 'Division er lettest på polær form: divider længderne og træk vinklerne fra hinanden.',
    s: r`$$Z_1Z_2=«nm»\angle«na»^\circ,\qquad Z_1+Z_2=«dm»\angle«da»^\circ$$ $$Z=\frac{«nm»}{«dm»}\angle(«na»^\circ-(«da»^\circ))=«m»\angle«a»^\circ\ \Omega$$` },
  { h: 'Strømmens amplitude', f: 'THZ', s: r`$$I_m=\frac{325}{«m»}=«Im»\ \text{A}$$` },
  { h: 'Middeleffekt og effektfaktor', f: ['PAVG', 'PF'],
    s: r`$$P_{avg}=\tfrac12\cdot325\cdot«Im»\cdot\cos(«a»^\circ)=«P»\ \text{W},\qquad PF=\cos(«a»^\circ)=«PF»$$` },
  { h: 'Kontrol: kun R_m bruger effekt', f: ['PRX', 'PAVG'],
    s: r`Strømmen i motorgrenen: $325/|Z_1|=«i1»$ A, så $$\tfrac12\cdot«i1»^2\cdot40=«PR»\ \text{W}\ ✓$$` }] }
];
})();
