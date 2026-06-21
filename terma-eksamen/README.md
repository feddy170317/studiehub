# Terma Procesventilation — Eksamenspræsentation (interaktiv)

Hybrid eksamens-deck: procesrygrad + pitch-polish. **Terma-brandet** (navy + Terma-blå, jf. terma.com).
Bygget som selvstændig HTML med **interaktive 3D-scener** (Three.js) og **finans-charts** (Chart.js).

> **Status: 1. iteration.** Slides 1, 2, 4 og 7 er fuldt bygget. Slides 3, 5, 6, 8 er
> markerede pladsholdere der færdiggøres efter din feedback.

## Kør den
Åbn `index.html` i **Chrome/Edge**. Naviger: `↑ ↓ Space PageUp/Dn`, `Home/End`, klik på dots, `F` = fuldskærm.

| # | Slide | Status |
|---|---|---|
| 1 | Forside (hero) | ✅ |
| 2 | Problemet — **3D-scene: røg stiger op → indåndes** | ✅ |
| 3 | Krav & koncepter | pladsholder |
| 4 | Løsningen — **3D-scene: røg suges ind** + før/efter-toggle | ✅ |
| 5 | Teknisk validering (CFD/FEA/test) | pladsholder |
| 6 | Materiale & enhedspris | pladsholder |
| 7 | Business case — **interaktive finans-charts + sliders** | ✅ |
| 8 | Tak / Q&A | pladsholder |

## ⚠ Før eksamen — checkliste

### 1. CAD → `.glb` (gør 3D-scenerne "ægte")
3D-scenerne kører lige nu på en **stiliseret fallback-tube**. For din rigtige CAD:
1. Eksportér armrøret fra SolidWorks/Inventor til **STEP**.
2. Konvertér til glTF: Blender (File → Import STEP → Export glTF 2.0 `.glb`) eller
   online (fx aspose 3D — bemærk: filen uploades til en cloud-tjeneste; tjek med Terma).
3. Gem som `assets/models/armroer.glb`. Scenen finder den automatisk.

### 2. Offline & file:// — allerede klaret ✅
Alle biblioteker ligger LOKALT i `assets/vendor/` (Three.js UMD, Chart.js, GSAP, CountUp).
Three.js bruges som **global klassisk build** (ikke ES-modul), så scenerne virker både
**offline** OG ved at **dobbeltklikke `index.html`** (file://) uden en webserver.
Anbefaling: test alligevel offline på eksamens-maskinen dagen før.

### 3. Finans-tal = ESTIMATER
Sliderne på slide 7 bruger modelantagelser markeret **"ESTIMAT — verificér med Terma"**.
Indsæt rigtige tal (antal operatører, sygedage, dagsomkostning) hvis du har dem.

### 4. Projektor + PDF-backup
Test på projektor dagen før. PDF-backup: Chrome → Print → Gem som PDF (A3, liggende).
Bemærk: 3D/charts bliver statiske i PDF.

## Tids-disponering (~20 min delt på gruppen)
8 slides, sektions-opdelt så I kan dele dem mellem jer. Forslag: ~2–2½ min pr. fuld slide;
3D-scenerne (2 + 4) og business casen (7) er de naturlige "talк-tunge" højdepunkter.

## Filer
```
Praesentation_Eksamen/
├── index.html
└── assets/
    ├── css/styles.css      Terma navy/blå tema + scene/finans-komponenter
    ├── js/main.js          deck-nav, reveals, keyboard
    ├── js/scene.js         Three.js: delt rig, problem/løsning-modes, glb+fallback
    ├── js/finans.js        Chart.js + estimat-model + sliders
    ├── images/             renders/koncepter/figurer/test (kopieret fra Praesentation/)
    └── models/             læg armroer.glb her
```
