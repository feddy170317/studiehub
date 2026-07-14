# HverdagsHelte ⚔️ — Opsætning og drift

---

## ⚠️ V3-OPGRADERING (rigtige konti + familier) — Frederiks checkliste

V3-koden (Sprint 1: auth + organisationer) er bygget men IKKE deployet endnu.
Før den kan testes og gå live, skal du gøre 3 ting i
[Firebase Console](https://console.firebase.google.com) → projekt **via-quiz**:

1. **Aktivér Authentication:** venstre menu → *Build* → *Authentication* → **Get started**
   → fanen *Sign-in method* → vælg **Email/Password** → slå **Enable** til → *Save*.
2. **Indsæt nye database-regler:** *Build* → *Realtime Database* → fanen *Rules* →
   erstat alt med indholdet af `firebase-rules.json` (ligger i denne mappe) → *Publish*.
   Reglerne lukker den åbne database: kun familiens medlemmer kan se familiens data.
   (QuizLive's `/games` og `/quizzes` forbliver åbne, så quizzerne stadig virker.)
3. **Sig til Claude** at det er gjort → fuld E2E-test køres → migrering af jeres
   eksisterende data (helte, XP, badges) sker automatisk første gang du opretter din
   konto og familie i den nye admin — intet går tabt. Derefter deploy.

**OBS:** Indtil deploy kører den gamle version uændret på GitHub Pages — jeres daglige
brug påvirkes ikke af noget i denne checkliste.

---

RPG-app til børn: dagens/ugens quests → forældre-godkendelse → XP + guld → levels og rigtige belønninger fra butikken.

| Fil | Hvem | Hvad |
|---|---|---|
| `index.html` | Barnet | Quests, skills, butik, eventyr-log |
| `admin.html` | Voksen | Godkendelser, quest-/butiks-redigering, helte, aktivitetslog |

---

## Kom i gang (2 minutter)

1. Åbn **`admin.html`** (dobbeltklik — kræver internet, Firebase er allerede sat op)
2. Setup-wizarden vises automatisk første gang:
   - Vælg en **voksen-PIN** (4 cifre) — den låser admin-siden
   - Opret dit barn med navn, avatar-emoji og **barne-PIN** (4 cifre)
3. Vælg start-moduler (Dansk 📖, Matematik 🔢, Hjemmet 🏠 er valgt på forhånd) og klik
   **"Opret eventyret"** — der oprettes også en lille butik (skærmtid, vælg aftensmad, biograftur)
4. Barnet åbner **`index.html`** på sin egen enhed, vælger sin profil og taster sin PIN

Alt kan redigeres bagefter i admin — quests, priser, streak-mål, PIN-koder.

## Moduler (v2)

Alt indhold — færdigheder, quests, badges, streaks — kommer fra **moduler** (JSON-datapakker,
format: `hverdagshelte-module@1`, se ARKITEKTUR.md §4). I admin → **Moduler** kan du:
- Folde et modul ud og redigere quests (XP/guld/dage/aktiv), skill-navne og streak-mål
- Slå quests fra/til efter klassetrin (fx brøker og ligninger ligger klar som inaktive)
- **📤 Eksportere** et modul som JSON-fil (del den på GitHub) og **📥 importere** andres
- Afinstallere et modul — barnets XP, badges og fremgang BEVARES (kontobogen husker alt)

Al XP/guld bogføres i en **kontobog** (`/ledger`) — saldi beregnes, intet overskrives.
Belønninger lander i en **skattekiste** hos barnet, der åbnes med konfetti og lyd.

## Sådan fungerer flowet

1. Barnet trykker **"Færdig!"** på en quest → den lander som *afventer* hos dig
2. Du trykker **Godkend** (eller **Afvis** med en besked, fx "sengen er ikke redt 😉")
3. Ved godkendelse falder XP + guld hos barnet — med konfetti og level-up-animation live
4. Barnet køber belønninger i butikken for guld → du markerer **Leveret** når det er indfriet
   (Annullér giver guldet tilbage)

**Quest-typer:** *Daglig* (nulstilles hver dag, kan begrænses til bestemte ugedage),
*Ugentlig* (én gang pr. ISO-uge), *Særlig* (engangs — forsvinder når godkendt).

**Spilmatematik:** Skill-level kræver 100 XP + 25 pr. level. Heltelevel (samlet XP) kræver
250 + 75 pr. level. Rammer: 🥉 Bronze (1–4), 🥈 Sølv (5–9), 🏆 Guld (10–19), 💎 Diamant (20+).

## Firebase

Appen genbruger **samme Firebase-projekt som QuizLive** (`via-quiz`) og gemmer alt under
noden `/liferpg`. Der skal ikke oprettes noget nyt.

Hvis du på et tidspunkt strammer database-reglerne (Firebase Console → Realtime Database →
Regler), skal `liferpg`-noden med:

```json
{
  "rules": {
    "games":   { ".read": true, ".write": true },
    "quizzes": { ".read": true, ".write": true },
    "liferpg": { ".read": true, ".write": true },
    "$other":  { ".read": false, ".write": false }
  }
}
```

> PIN-koderne er børnesikring, ikke rigtig sikkerhed — alle med linket og teknisk snilde kan
> læse databasen. Det er fint til en familie-app, men læg ikke følsomme ting i den.

## GitHub Pages (anbefalet til barnets telefon/tablet)

1. Upload `HverdagsHelte/`-mappen til et GitHub-repo (eller som undermappe i et eksisterende Pages-repo)
2. Barnet åbner `https://<brugernavn>.github.io/<repo>/` og tilføjer den til hjemmeskærmen
3. Du åbner `.../admin.html` på din telefon

## Nulstilling

Slet noden `/liferpg` i Firebase Console (Realtime Database → tre prikker ved `liferpg` → Fjern),
så starter setup-wizarden forfra.
