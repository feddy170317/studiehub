# QuizLive — Opsætningsvejledning

Følg disse trin for at få QuizLive til at virke med Firebase Realtime Database.

---

## Trin 1: Opret Firebase-projekt

1. Gå til [console.firebase.google.com](https://console.firebase.google.com)
2. Klik **"Tilføj projekt"**
3. Giv projektet et navn, f.eks. `quizlive`
4. **Slå Google Analytics fra** (ikke nødvendigt)
5. Klik **"Opret projekt"**

---

## Trin 2: Opret Realtime Database

1. I venstre sidepanel: klik **"Byg"** → **"Realtime Database"**
2. Klik **"Opret database"**
3. Vælg lokation: **`europe-west1 (Belgien)`**
4. Vælg **"Start i testtilstand"** → Klik **"Aktivér"**

> **Sikkerhedsnote:** Testtilstand giver åben adgang i 30 dage.  
> Se "Anbefalede sikkerhedsregler" nedenfor for at beskytte din database.

---

## Trin 3: Registrér en web-app

1. I projektoversigten: klik på **"</>"** (Web-ikonet)
2. Giv appen et kaldenavn, f.eks. `quizlive-web`
3. **Sæt ikke Firebase Hosting op** (ikke nødvendigt til lokal brug)
4. Klik **"Registrér app"**
5. Du får nu vist et `firebaseConfig`-objekt — **kopiér det**

---

## Trin 4: Indsæt config i QuizLive

Åbn filen `assets/firebase-config.js` og erstat indholdet med dit eget:

```js
window.FIREBASE_CONFIG = {
  apiKey: "din-api-nøgle-her",
  authDomain: "dit-projekt.firebaseapp.com",
  databaseURL: "https://dit-projekt-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dit-projekt",
  storageBucket: "dit-projekt.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

> **Vigtigt:** `databaseURL` skal pege på din Realtime Database. Du finder den i  
> Firebase Console → Realtime Database → øverst i siden (begynder med `https://`).

---

## Trin 5: Kør spillet

### Lokalt (fil://)
- Åbn `host.html` i Chrome/Edge på din computer (projektorbrowser)
- Del `index.html`-URLen med spillerne (eller brug GitHub Pages nedenfor)

> **Bemærk:** Firebase kræver internet-forbindelse uanset om du kører lokalt eller online.

### GitHub Pages (anbefalet til spillere på mobil)
1. Upload hele `QuizLive/`-mappen til et GitHub-repository
2. Aktivér GitHub Pages: **Settings** → **Pages** → **Branch: main**, **/(root)**
3. Spillerne åbner: `https://dit-brugernavn.github.io/dit-repo/?pin=XXXXXX`
4. Host åbner: `https://dit-brugernavn.github.io/dit-repo/host.html`

---

## Anbefalede sikkerhedsregler

Når du er færdig med at teste, bør du sætte følgende regler i Firebase Console  
→ Realtime Database → **Regler**:

```json
{
  "rules": {
    "games": {
      ".read": true,
      ".write": true
    },
    "$other": {
      ".read": false,
      ".write": false
    }
  }
}
```

Dette begrænser adgang til kun `/games`-noden.

---

## Tilføj egne quizzer

1. Opret en ny fil i `quizzes/`, f.eks. `quizzes/geografi.js`
2. Brug samme format som `quizzes/demo.js`:

```js
window.QUIZZES = window.QUIZZES || {};
window.QUIZZES['geografi'] = {
  title: 'Dansk geografi',
  questions: [
    {
      level: 'let',      // 'let' = 100 pt, 'middel' = 150 pt, 'svaer' = 200 pt
      q: 'Hvad er...?',
      options: ['A', 'B', 'C', 'D'],
      correct: 0,        // 0 = første svar (A)
      why: 'Forklaring til det korrekte svar.'
    }
  ]
};
```

3. Tilføj en `<script src="quizzes/geografi.js">` i `host.html` (i bunden, efter `demo.js`)
4. Tilføj quizzen til `quizzes/manifest.js`:

```js
window.QUIZ_MANIFEST = [
  { id: 'demo',     title: 'Demo: Blandet paratviden', file: 'quizzes/demo.js',     count: 8 },
  { id: 'geografi', title: 'Dansk geografi',           file: 'quizzes/geografi.js', count: 10 }
];
```

---

## QR-kode

QuizLive bruger et lokalt vendoret QR-kode-bibliotek (`assets/vendor/qrcode.min.js`).  
Hvis filen ikke er til stede, vises join-URL og PIN i stedet.

---

## Fejlfinding

| Problem | Løsning |
|---|---|
| "Firebase er ikke sat op endnu" | Tjek at `apiKey` i `firebase-config.js` ikke indeholder `INDSAET` |
| Database-fejl i konsollen | Tjek at `databaseURL` er korrekt (skal slutte med `.firebasedatabase.app`) |
| Spillet kan ikke findes | Tjek at PIN er 6 cifre og at spillet stadig er aktivt |
| QR-kode vises ikke | Tjek at `assets/vendor/qrcode.min.js` eksisterer |
