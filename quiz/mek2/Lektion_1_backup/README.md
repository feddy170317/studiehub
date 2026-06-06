# MEK2 Lektion 1 Quiz — Spænding og Tøjning

**Status:** Færdig til brug (vendor-filer kræves)

## Hvad er det?

En interaktiv eksamens-quiz til **MEK2 Lektion 1: Spænding og Tøjning** (GG 1.4, 1.7, 1.8).

- **12 multiple-choice spørgsmål** struktureret efter sværhedsgrad:
  - 4 let (1pt hver)
  - 5 middel (2pt hver)
  - 3 svær (3pt hver)
- **Arcade-scoring** med combo-system (rigtige svar i træk = højere point)
- **Flip-kort** til videre træning efter hver quiz-køring
- **Blueprint-tema** — mørkeblå tegningsbund, cyan stregfarver, gitter
- **Fuldstændig offline** — ingen internet nødvendig

## Filer

```
Lektion 1/2_Quiz/
├── index.html                          # Main entry point
├── assets/
│   ├── quiz.js                         # Quiz-motor (arcade-scoring)
│   ├── quiz.css                        # Blueprint-tema styling
│   ├── topics/
│   │   ├── lektion_1.js                # 12 spørgsmål + flip-kort
│   │   └── manifest.js                 # Emne-manifest
│   └── vendor/
│       ├── fonts/
│       │   ├── fonts.css
│       │   ├── anton-400.woff2
│       │   ├── nunito-400.woff2 (+ 700, 800)
│       │   └── bangers-400.woff2
│       ├── katex/                      # KaTeX Math renderer
│       └── gsap/                       # GSAP animation (valgfrit)
├── copy_vendor.ps1                     # PowerShell script til at kopiere vendor
├── copy_vendor.sh                      # Bash script til at kopiere vendor
└── README.md                           # This file
```

## Hurtig start

### 1. Kopier vendor-filer

Vælg ét:

**PowerShell (Windows):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\copy_vendor.ps1
```

**Bash (Linux/Mac/WSL):**
```bash
bash copy_vendor.sh
```

**Manuelt (alle platforme):**
1. Åbn `C:\Users\pif-m\OneDrive\Desktop\AI\Studiehub\quiz\mek2\Laering_MEK2_Quiz\assets\vendor`
2. Kopier `fonts/`, `katex/`, og `gsap/` mapper
3. Indsæt i `2_Quiz/assets/vendor/`

### 2. Åbn quizzen

1. Dobbeltklik på `index.html`
2. Eller åbn i browser: `file:///c:/Users/pif-m/OneDrive/Desktop/AI/Kurser/Mek/MEK%202%20opagver/Lektion%201/2_Quiz/index.html`

### 3. Start quizzen

- Klik på "Spænding & Tøjning"-kortet
- Svar på 12 spørgsmål
- Se dit resultat med grade, combo-stats og flip-kort til videre træning

## Indhold

### Spørgsmål

**Lette (4 stk, 1pt):**
- Definition af normal spænding σ
- Definition af normal tøjning ε
- Hookes lov σ = E·ε
- Centroide-betingelse for aksial last

**Middel (5 stk, 2pt):**
- Lateral tøjning og Poissons forhold ν
- Double shear i bolte
- Lejespænding (bearing stress)
- Forskydningsmodul G = E/(2(1+ν))
- Moment-ligevægt på element (τ₁ = τ₂)

**Svær (3 stk, 3pt):**
- Beregn lateral tøjning fra aksial
- G-modul fra E og ν
- Normalspænding på skråt snit (45°)

### Flip-kort (5 stk)

Revisionskort til konceptuelle spørgsmål:
- σ, ε, E, ν, τ, γ definitioner
- Hookes lov (normal + forskydning)
- Centroide-betingelse
- Single vs. double shear
- Lejespænding

## Scoring

- **Let:** 100 point basale, × combo-faktor
- **Middel:** 200 point basalt, × combo-faktor
- **Svær:** 300 point basalt, × combo-faktor
- **Combo:** +1× multiplier for hver rigtigt svar i træk
  - Brister du, nulstilles combo til 0

### Graderinger

| Procent | Grade | Stjerner |
|---------|-------|----------|
| 90+     | STÅLMESTER | ★★★★★ |
| 75+     | KONSTRUKTØR | ★★★★☆ |
| 60+     | TEGNER | ★★★☆☆ |
| 40+     | LÆRLING | ★★☆☆☆ |
| 0–40    | SKITSE | ★☆☆☆☆ |

## Kilder

- **Slides:** `Lektion_1 Spænding og tøjning slides.pdf`
- **Lærebog:** Mechanics of Materials, SI Edition, Enhanced 9th ed. (Goodno & Gere)
- **Tema:** Blueprint-quiz format fra MEK2 Eksamen-samlet quiz

## Teknisk

- **Browser:** Chrome, Firefox, Safari, Edge (moderne versioner)
- **Offline:** Ja (lokal fil:// protocol)
- **LocalStorage:** Gemmer dit bedste resultat pr. emne
- **Math rendering:** KaTeX (valgfrit, fallback til plain HTML)
- **Animations:** GSAP (valgfrit)

## Sådan redigeres spørgsmål

Redigér `assets/topics/lektion_1.js`:

```javascript
window.MEK2_L1['L1_spaending_toejning'] = {
  intro: '...',
  analogi: '...',
  examQs: ['Q1', 'Q2', ...],
  svg: L1svg(),
  mc: [
    { level:'let', q:'Question?', options:['A','B','C','D'], correct:1, why:'...' },
    ...
  ],
  cards: [
    { q:'Recall prompt', a:'Answer' },
    ...
  ]
};
```

- `level`: 'let', 'middel', eller 'svaer'
- `q`: HTML tilladt
- `options`: 4-element array
- `correct`: Index (0–3) af korrekt svar
- `why`: Detaljeret forklaring (HTML tilladt)

## Troubleshooting

**Problem:** "KaTeX is not defined"
- **Løsning:** Ignorer — fallback til plain HTML. KaTeX er valgfrit.

**Problem:** Flip-kort virker ikke
- **Løsning:** Åbn browser-console (F12) og tjek for fejl.

**Problem:** Vendor-filer mangler
- **Løsning:** Køre `copy_vendor.ps1` eller `copy_vendor.sh`.

**Problem:** Quiz-motor vises ikke
- **Løsning:** Tjek at `assets/quiz.js` og `assets/quiz.css` findes.

## Fremtidigt

- [ ] Ekstra emner (bøjning, torsion, statisk moment)
- [ ] Spørgsmål-bank-system til random quiz
- [ ] Dansk grammatik-tjek på alle spørgsmål
- [ ] Multilingual support

---

**Genereret:** 2026-06-06 med `/quiz-da` skill  
**Tema:** Blueprint-arcade (Studiehub-kompatibel)  
**Parat til:** Offline eksamens-træning
