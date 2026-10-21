/* Regnetjek af lastmodellen i index.html.
   Kør efter ændringer i blokken mellem <fysik> og </fysik>:   node regnetjek.js
   Tjekker håndregning af standardtilfældet, ligevægt i alle fritlegemer og skærets kapacitet. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const blok = html.match(/\/\* <fysik>[^\n]*\n([\s\S]*?)\/\* <\/fysik> \*\//);
if (!blok) { console.error('Fandt ikke fysik-blokken i index.html'); process.exit(1); }
const ctx = vm.createContext({});
vm.runInContext(blok[1], ctx);
const { C, compute, chainLen } = ctx.SR;

/* standardtilfældet følger snerydningssimulatoren: 0,6 m/s, sat sne 250 kg/m3, pakket sne mu = 0,25, plant */
const std = { ang: 30, lift: false, h: 0.05, rho: 250, mu: 0.25, slope: 0, v: 0.6, m: 300, lc: 'ryd' };
const med = (o) => Object.assign({}, std, o);
let ok = 0, fejl = 0;
function tjek(navn, v, forventet, tol) {
  if (Math.abs(v - forventet) <= tol) { ok++; return; }
  fejl++; console.log('FEJL  ' + navn + ': ' + v.toFixed(4) + ' (forventet ' + forventet.toFixed(4) + ')');
}
const ja = (b) => (b ? 1 : 0), grad = Math.PI / 180;
const o = compute(std);

/* geometri */
tjek('kædehjul z = 15, delecirkelradius [mm]', C.Rk1 * 1000, 30.54, 0.02);
tjek('kædehjul z = 30, delecirkelradius [mm]', C.Rk2 * 1000, 60.75, 0.02);
tjek('kædelængde er 80 led', chainLen(C.a, C.Rk1, C.Rk2) / C.pitch, 80, 1e-6);
tjek('vinkelcylinderen kan bygges (lukket længde >= slag + 100 mm)', ja(C.plow.cylMin - C.plow.stroke >= 0.10), 1, 0);

/* håndregning af standardtilfældet */
tjek('glidefaktor sin - mu*cos', o.snow.slide, 0.5 - 0.15 * Math.cos(30 * grad), 1e-9);
tjek('sne foran skæret [kg]', o.snow.mPrism, 28.665, 0.01);
tjek('snekraft [N]', o.snow.R, 145.38, 0.05);
tjek('skærets udnyttelse', o.snow.util, 0.8661, 0.0005);
tjek('største snedybde ved 30 grader [cm]', o.snow.hMax * 100, 5.773, 0.005);
tjek('2.000 m2 med 24 % overkøringstab [min]', o.cap.tPass / 60, 2000 / (1.4 * Math.cos(30 * grad) * 0.6) * 1.24 / 60, 1e-6);
tjek('sne pr. overkørsel ved 2,5 cm/t [cm]', o.cap.dPass * 100, 2.367, 0.005);
tjek('hjul o/min ved 0,6 m/s', o.drv.nw, 0.6 / (2 * Math.PI * 0.2) * 60, 1e-9);
tjek('motor o/min (udveksling 40)', o.drv.nm, o.drv.nw * 40, 1e-6);
tjek('simulatorens 0,8 m ved 0,6 m/s giver ca. 1 t 30 min [min]', 2000 / (0.8 * 0.6) * C.veh.overrun / 60, 86.1, 0.1);

/* ligevægt */
tjek('lodret ligevægt', o.veh.Nf + o.veh.Nr + o.plow.Ns, (300 + 48) * 9.81, 1e-6);
tjek('ligevægt på tværs', o.veh.Sf + o.veh.Sr + o.snow.Fz, 0, 1e-9);
tjek('moment om drejetappen', o.hyd.ryd.F * o.hyd.ryd.cyl.arm + o.hyd.ryd.Msign, 0, 1e-9);
const m = o.mid, sum = (k) => m.loads.reduce((a, l) => a + l[k], 0);
tjek('mellemaksel, kræfter x', m.RAx + m.RBx + sum('x'), 0, 1e-9);
tjek('mellemaksel, kræfter y', m.RAy + m.RBy + sum('y'), 0, 1e-9);
tjek('mellemaksel, moment', m.RAy * C.zs.plateA + m.RBy * C.zs.plateB + m.loads.reduce((a, l) => a + l.y * l.z, 0), 0, 1e-9);
tjek('hjulaksel, kræfter y', o.axle.Riy + o.axle.Roy + o.axle.N + o.axle.Fk * Math.sin(C.gamma), 0, 1e-9);
tjek('samlet virkningsgrad', o.drv.Pw / o.drv.Pm, 0.94 * 0.97 * 0.96, 1e-9);
tjek('tandkraft gange radius = moment', o.drv.Ft * 0.072, o.drv.T2, 1e-9);
tjek('trækkraft = plov + rulning + stigning', o.veh.Fdrv, o.veh.Fplow + o.veh.Frr + o.veh.Fgrade, 1e-9);

/* spejling: kast til venstre giver samme tal med modsat fortegn */
const v = compute(med({ ang: -30 }));
tjek('spejling, sidekraft', v.snow.Fz, -o.snow.Fz, 1e-9);
tjek('spejling, cylinderkraft', v.hyd.ryd.F, o.hyd.ryd.F, 1e-9);
tjek('spejling, modsat cylinder arbejder', v.hyd.ryd.side, -o.hyd.ryd.side, 0);
tjek('cylinderen trykker', ja(o.hyd.ryd.F > 0), 1, 0);

/* skærets kapacitet og kravene */
tjek('KF4, 15 cm sat sne: skæret er overfyldt', ja(compute(med({ h: 0.15, mu: 0.55 })).snow.util > 1), 1, 0);
tjek('40 grader giver større kapacitet [cm]', compute(med({ ang: 40 })).snow.hMax * 100, 9.309, 0.005);
tjek('lige plov kaster ikke til siden', ja(!isFinite(compute(med({ ang: 0 })).snow.util)), 1, 0);
tjek('løftet plov: ingen snekraft', compute(med({ lift: true })).snow.R, 0, 0);
tjek('KF1 + KF2, 8 grader på isslag (mu = 0,10): hjulene spinner', ja(compute(med({ mu: 0.10, slope: Math.tan(8 * grad), h: 0 })).veh.util > 1), 1, 0);

console.log(fejl ? ('FEJL i ' + fejl + ' af ' + (ok + fejl) + ' tjek') : ('Alle ' + ok + ' tjek OK'));
process.exitCode = fejl ? 1 : 0;
