# Studiehub — elevlogin (opsætning)

Status: **kode bygget, IKKE deployet endnu.** Tre ting skal gøres i Firebase-konsollen
(samme projekt `via-quiz` som Bordfodbold/HverdagsHelte/QuizLive), derefter virker det.

## 1. Tilføj database-regler

[Firebase Console](https://console.firebase.google.com) → projekt **via-quiz** →
Realtime Database → fanen **Rules**.

Regelfilen er ét stort JSON-træ delt af alle apps i projektet. **Rør ikke ved de
eksisterende nøgler** (`liferpg`, `hq`, `games`, `quizzes`) — indsæt kun en ny
`"studiehub"`-nøgle som søskende til dem, lige før `"$other"`:

```json
"studiehub": {
  "superadmins": {
    ".read": "auth != null && root.child('studiehub/superadmins').child(auth.uid).val() === true",
    "$uid": {
      ".read": "auth != null && auth.uid === $uid"
    }
  },
  "students": { ".read": true, ".write": true },
  "scores": { ".read": true, ".write": true },
  "audit": { ".read": true, ".write": true }
}
```

Tryk **Publish**.

*(Bemærk: `students`/`scores`/`audit` er bevidst helt åbne — samme niveau som
`games`/`quizzes` allerede har. PIN-koden er en høflig lås, ikke en reel spærre;
det er OK her, fordi linket kun deles med holdet, og du kender alle PIN'er i
forvejen. `superadmins` er den eneste knude med reel beskyttelse — ingen klient
kan nogensinde skrive til den.)*

## 2. Aktivér Email/Password login (hvis ikke allerede gjort til HverdagsHelte)

Authentication → Sign-in method → **Email/Password** → Enable.

Du kan bruge **samme konto** som du evt. allerede har til HverdagsHelte/QuizLive —
det er samme Firebase-projekt, så login virker på tværs.

## 3. Gør din konto til super admin for Studiehub

1. Åbn `superadmin.html` på Studiehub, log ind med din e-mail/kodeord (opret kontoen
   via "Glemt kodeord"-flowet eller Authentication → Users → Add user, hvis du ikke
   har en endnu).
2. Du bliver mødt af "Ingen adgang" med dit UID vist i et felt — kopiér det.
3. Realtime Database → Data → find/opret knuden `studiehub` → tilføj barn
   `superadmins` → tilføj barn `<dit UID>` med værdien `true` (boolean).
4. Genindlæs `superadmin.html` — du er nu inde.

## 4. Opret klassens login

I panelet: tryk **🌱 Opret klasse-liste** — opretter alle 10 (Alexandre, Frederik,
Jacob H, Jacob Ø, Jimmy, Jonas, Lukas, Nicolai, Simon, Thomas) med tilfældige
4-cifrede PIN-koder på én gang, og viser dem i en boks du kan skrive ned/dele.
PIN'er kan altid ses/nulstilles igen i panelet.

## Hvad der IKKE er lavet endnu

- Login-gaten (`assets/sh-auth.js` + `assets/sh-auth.css`) er kun koblet på
  `index.html` som test. De ~140 andre sider (quiz/, html/, flash/, klinisk-dansk/
  osv.) mangler stadig at få gaten injiceret.
- Quiz-motorerne skriver stadig kun resultater til `localStorage`, ikke til
  `studiehub/scores/{elevId}/...` — det kobles på i næste fase.
