/* MMT2 Quiz — manifest over alle 12 emner.
   Et emne bliver "aktivt" (spilbart) når der findes en datafil i
   window.MMT_TOPICS[id]. Emner uden data vises som "Kommer snart". */
window.MMT_MANIFEST = [
  // ── Materialevidenskab ──────────────────────────────
  { id:'M_Q1', no:'M-1', cat:'mat', emoji:'🔩', title:'Jern-kulstof-diagrammet', sub:'Faser, eutektoid transformation & mikrostrukturer i stål.' },
  { id:'M_Q2', no:'M-2', cat:'mat', emoji:'🌡️', title:'TTT- & CCT-diagrammer', sub:'Perlit, bainit, martensit & kølehastighedens betydning.' },
  { id:'M_Q3', no:'M-3', cat:'mat', emoji:'🔥', title:'Varmebehandling', sub:'Hærdning, anløbning, udglødning & normalisering.' },
  { id:'M_Q4', no:'M-4', cat:'mat', emoji:'🧪', title:'Korrosion', sub:'Galvanisk korrosion, mekanismer & beskyttelse.' },
  { id:'M_Q5', no:'M-5', cat:'mat', emoji:'🪙', title:'Stål, støbejern & aluminium', sub:'Legeringer, betegnelser & egenskaber.' },
  { id:'M_Q6', no:'M-6', cat:'mat', emoji:'🧬', title:'Polymerer & kompositter', sub:'Termoplast, hærdeplast, fibre & matrix.' },
  // ── Fremstillingsteknologi ──────────────────────────
  { id:'T_Q1', no:'T-1', cat:'tek', emoji:'🪣', title:'Støbning', sub:'Former, stigere, chills, gates & krympning.' },
  { id:'T_Q2', no:'T-2', cat:'tek', emoji:'⚙️', title:'Pulvermetallurgi', sub:'Presning, sintring & porøsitet.' },
  { id:'T_Q3', no:'T-3', cat:'tek', emoji:'📐', title:'Plademetalsformning', sub:'Bukning, dybtrækning & tilbagefjedring.' },
  { id:'T_Q4', no:'T-4', cat:'tek', emoji:'🧴', title:'Plast & sprøjtestøbning', sub:'Cyklus, krympning & typiske defekter.' },
  { id:'T_Q5', no:'T-5', cat:'tek', emoji:'🧵', title:'Kompositter (produktion)', sub:'Layup, RTM & filament winding.' },
  { id:'T_Q6', no:'T-6', cat:'tek', emoji:'✨', title:'Slibning & overfladebehandling', sub:'Abrasion, finish & coatings.' }
];
