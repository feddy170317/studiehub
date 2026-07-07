# Klinisk Dansk — Sygeplejesprog (B2–C1)

Et tosproget (dansk/engelsk) lærings-værktøj til klinisk fagsprog. To leverancer fra
samme indhold:

1. **Interaktiv web-app** — `index.html` (dobbeltklik, virker 100 % offline, ingen server).
2. **PDF-referenceværk** — `PDF/Klinisk_Dansk.pdf` (glossar + regler + øvelser til print).

## Sådan bruges det
- Åbn `index.html` i en browser → vælg en dag.
- Hver dag er en lektion på ~15–20 min med 4 trin:
  1. **Ordforråd** — flip-kort (dansk → engelsk + kollokation + eksempel), grupperet i substantiver/verber/adjektiver.
  2. **Dokumentation** — grundregler + dårlig-vs-god formulering med "hvorfor".
  3. **Patientnotat** — et realistisk notat + øvelser (omskriv objektivt, udfyld verbet, find vurderingen) med facit.
  4. **Quiz** — scoret (point, combo, sværhedsgrader, topscore gemmes lokalt) + flip-kort til genkaldelse.

## Filstruktur
```
Klinisk_Dansk/
├── index.html                  hub — vælg dag
├── dag1.html                   lektion (samme skabelon for alle dage)
├── assets/
│   ├── css/styles.css          klinisk tema
│   ├── js/app.js               trin 1–3 + navigation
│   ├── js/quiz.js              trin 4 (quiz-motor)
│   ├── data/dag1_kredsloeb.js  ALT indhold for dag 1 (én global: window.KD_DAYS['dag1'])
│   └── images/                 valgfrie diagrammer (se PROMPTS.md; skjules automatisk hvis fraværende)
├── PDF/
│   ├── main.tex                referenceværk (kompilér med pdflatex, 2 gange)
│   └── Klinisk_Dansk.pdf        kompileret output
└── README.md
```

## Tilføj en ny dag (fx Dag 2 — Respiration & saturation)
1. **Data:** kopiér `assets/data/dag1_kredsloeb.js` → `assets/data/dag2_respiration.js`,
   ret `window.KD_DAYS['dag2'] = {…}` og udfyld `ordforraad`, `dokumentation`, `notat`, `quiz`.
2. **Lektion:** kopiér `dag1.html` → `dag2.html`; ret titler + `window.KD_START('dag2')` +
   `<script src="assets/data/dag2_respiration.js">`.
3. **Hub:** i `index.html` sæt `file:'dag2.html'` for dag2 i `MANIFEST` og tilføj
   `<script src="assets/data/dag2_respiration.js"></script>`.
4. **PDF:** tilføj et nyt kapitel i `PDF/main.tex` med samme fire sektioner; kompilér 2×.

## Kompilér PDF
```
cd PDF
pdflatex main.tex     (kør 2 gange for indholdsfortegnelse)
```
Fuld sti på denne PC:
`C:\Users\pif-m\AppData\Local\Programs\MiKTeX\miktex\bin\x64\pdflatex.exe`

## Dage (alle 4 bygget)
- Dag 1 — Kredsløb & blodtryk ✅
- Dag 2 — Respiration & saturation ✅
- Dag 3 — Smerte & neuro ✅
- Dag 4 — Medicin & ordination ✅

> Niveau B2–C1. Indholdet er lærings-materiale, ikke en klinisk retningslinje.
