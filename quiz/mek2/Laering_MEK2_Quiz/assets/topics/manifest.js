/* MEK2 Blueprint-Quiz — manifest (8 koncept-emner, 2 kategorier).
   Et emne bliver spilbart når der findes en datafil i MMT_TOPICS[id]. */

window.QUIZ_TITLE = 'MEK2 <span class="heat-text">BLUEPRINT</span>-QUIZ';
window.QUIZ_INTRO = 'Tegn dig skarp i styrkelære. Vælg et emne, vælg den rigtige metode, byg combo — og slå din egen topscore.';
window.QUIZ_CAT1  = 'Spændinger & snit';
window.QUIZ_CAT2  = 'Kombineret last & stabilitet';
window.QUIZ_RESULT_ICON = '📐';
window.QUIZ_GRADES = [
  { min:90, t:'CHEFKONSTRUKTØR', s:'★★★★★', d:'Tegningen er stemplet og godkendt — du ejer faget.' },
  { min:75, t:'KONSTRUKTØR',     s:'★★★★☆', d:'Solid styrkelære. Klar til tavlen.' },
  { min:60, t:'TEGNER',          s:'★★★☆☆', d:'God streg — finpuds de sidste metoder.' },
  { min:40, t:'LÆRLING',         s:'★★☆☆☆', d:'Grundlinjerne er der. Tegn en runde til.' },
  { min:0,  t:'SKITSE',          s:'★☆☆☆☆', d:'Stadig kun en kladde — viskelæderet frem og kør igen!' }
];

window.MMT_MANIFEST = [
  // ── Spændinger & snit ───────────────────────────────
  { id:'MK_Q1', no:'S1', cat:'mat', emoji:'⭕', title:'Spændingstransformation & Mohr', sub:'σ₁, σ₂, τ_max, hovedretninger og Mohrs cirkel.' },
  { id:'MK_Q2', no:'S2', cat:'mat', emoji:'🌀', title:'Torsion', sub:'τ = Tρ/I_p, vridningsvinkel og ren forskydning.' },
  { id:'MK_Q3', no:'S3', cat:'mat', emoji:'〰️', title:'Bøjning & bøjespændinger', sub:'σ = My/I, neutralakse og inertimoment.' },
  { id:'MK_Q4', no:'S4', cat:'mat', emoji:'✂️', title:'Tværkraft & forskydning', sub:'τ = VQ/It og den parabolske fordeling.' },
  { id:'MK_Q8', no:'S5', cat:'mat', emoji:'🛢️', title:'Tyndvæggede trykbeholdere', sub:'Ring- og længdespænding σ_h = pr/t.' },
  // ── Kombineret last & stabilitet ────────────────────
  { id:'MK_Q5', no:'K1', cat:'tek', emoji:'🎯', title:'Kombineret last & flydekriterier', sub:'Von Mises, Tresca og sikkerhedsfaktor.' },
  { id:'MK_Q6', no:'K2', cat:'tek', emoji:'⤵️', title:'Bjælkeudbøjning', sub:'EI·v″ = M, integration og superposition.' },
  { id:'MK_Q7', no:'K3', cat:'tek', emoji:'🏛️', title:'Søjleknækning (Euler)', sub:'P_cr = π²EI/(KL)², slankhed og K-faktorer.' }
];
