# HverdagsHelte v2 — Arkitektur: Core Engine + Moduler

*Besluttet 11. juli 2026 gennem interview med Frederik (3 runder). Dette dokument er byggeplanen —
ændringer her skal besluttes, ikke bare ske.*

---

## 1. Vision og principper

**HverdagsHelte er en tom motor.** Al indhold — skills, quests, badges, streak-regler, kosmetik —
leveres af **moduler** (åbne JSON-datapakker). Selv familiens eget grundindhold ("Ryd op på
værelset") er bare et modul, som admin bygger i den indbyggede editor.

| Princip | Betydning |
|---|---|
| **Moduler er data, ikke kode** | Et modul kan aldrig køre logik eller vise egen UI. Det beskriver indhold i et fast JSON-format. Sikkert at dele, nemt at bygge. |
| **Kontobogen er sandheden** | Al XP/guld/badge-tildeling er posteringer i en ledger. Saldi *beregnes*. Fremgang overlever at moduler fjernes; fejl rettes med modposteringer. |
| **Beløn, straf aldrig** | Streaks giver noget for at blive holdt — de tager aldrig noget ved pause (Garmin-modellen, ikke tidlig-Snapchat). |
| **Ikke pay-to-win** | XP kan aldrig købes. Tre adskilte valutaer (se §6). |
| **Åbent format** | Modul-formatet dokumenteres offentligt (GitHub), så alle — familier, skoler, forlag — kan bygge moduler i hånden eller med editoren. |

**V1-afgrænsning:** Én familie. Far = admin og eneste modul-forfatter. PIN-login beholdes.
Rigtig auth (e-mail/password), skoler/klasser, venner på tværs af familier, revenue: **parkeret**
(se §9) — men datastrukturen må ikke blokere for dem.

---

## 2. Begreber

```
Modul ─┬─ Skills (2 lag: hovedskill → subskills)
       ├─ Quests (daglig / ugentlig / særlig)
       ├─ Badges (regler: tæller, streak, milepæl, event, manuel)
       ├─ Streak-regler (admin-justerbare mål pr. periode)
       ├─ Kosmetik (avatar-udstyr, kun-her-tilgængeligt)
       └─ Meta (navn, version, forfatter, evt. tidsvindue = event-modul)
```

- **Event-modul** = et almindeligt modul med et tidsvindue (`window`). Måneds-challenges er
  bare event-moduler. Én mekanisme, ikke to.
- **Heltelevel** = level beregnet af barnets samlede XP på tværs af alt. Kronen på toppen.

---

## 3. Skill-hierarki og roll-up

- XP tjenes **altid i en subskill** (eller i en hovedskill uden børn). Hovedskillens XP er
  summen af dens subskills — én sandhed, ingen dobbelt-bogføring.
- **Skalering ("pensum-effekten"):** hovedskillens level-krav ganges med antallet af aktive
  subskills. Så +30 XP flytter algebra-baren mærkbart, men matematik-baren lidt — præcis
  Frederiks intuition om at hovedfaget er "større".
  - Subskill: level L→L+1 kræver `100 + 25·(L−1)` XP
  - Hovedskill: `(100 + 25·(L−1)) · max(1, antal subskills)`
  - Heltelevel: `250 + 75·(L−1)` på total-XP (uændret fra v1)
- **Maks 2 lag.** Matematik → Geometri. Ikke Matematik → Geometri → Trekanter.
- **Skill-id'er er globale slugs** (`matematik`, `matematik.algebra`). Det er en *feature*:
  et event-modul kan tilføje subskillen `sodhed.nabo` under den eksisterende hovedskill
  `sodhed` fra et andet modul. Samme id fra to moduler = samme skill (første definition
  vinder visningsnavnet).
- Skills fra udløbne event-moduler **bliver stående på profilen for evigt** (trofæ-princip).

---

## 4. Modul-formatet (JSON)

Ét modul = én JSON-fil. Eksempel der viser alle dele:

```json
{
  "format": "hverdagshelte-module@1",
  "id": "sodhed-august",
  "name": "August: Sødhedsmåneden 💖",
  "version": 1,
  "author": "Frederik",
  "description": "Hele august handler om at være god ved andre.",
  "window": { "from": "2026-08-01", "to": "2026-08-31", "teaserDays": 3 },

  "skills": [
    { "id": "sodhed", "name": "Sødhed", "icon": "💖", "color": "#f06292" },
    { "id": "sodhed.nabo",    "name": "Nabo-sødhed",    "icon": "🏡", "parent": "sodhed" },
    { "id": "sodhed.familie", "name": "Familie-sødhed", "icon": "👨‍👩‍👧", "parent": "sodhed" }
  ],

  "quests": [
    { "id": "skrald", "title": "Hjælp naboen med skraldespandene", "icon": "🗑️",
      "type": "daily", "days": [1,2,3,4,5], "rewards": [{ "skill": "sodhed.nabo", "xp": 20 }] },
    { "id": "sur-dag", "title": "Gør noget godt for én der har en dårlig dag", "icon": "🌤️",
      "type": "weekly",
      "rewards": [{ "skill": "sodhed.familie", "xp": 30 }, { "gold": 10 }, { "eventCoin": 5 }] }
  ],

  "badges": [
    { "id": "nabo-helt", "name": "Nabolagets Helt", "icon": "🏘️", "rarity": "legendary",
      "rule": { "type": "milestone", "skill": "sodhed", "level": 5 },
      "exclusive": true, "secret": false },
    { "id": "sodhed-10", "name": "10 gode gerninger", "icon": "✨", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "sodhed-august" }, "count": 10 } }
  ],

  "streaks": [
    { "id": "sodhed-uge", "name": "Sødheds-streak", "icon": "🔥",
      "period": "week", "target": 3, "scope": { "skill": "sodhed" },
      "milestones": [4, 10, 25, 50] }
  ],

  "cosmetics": [
    { "id": "sodhed-tshirt", "name": "Sødheds-T-shirt", "icon": "👕", "slot": "outfit",
      "price": { "eventCoin": 20 } }
  ]
}
```

**Regler for formatet:**
- `rewards` er en liste → én quest kan give XP til flere skills + guld + event-mønter
  (10 km løb → udholdenhed *og* viljestyrke).
- **Klassetrin & kategori (fase C, valgfrie felter — gamle moduler virker uændret):**
  `category: "skole" | "hjem" | "fritid"` grupperer modulet i setup-wizard og
  anbefalings-dialog. `grades: [min, max]` (klassetrin 0–9) på **modulet** styrer hvornår
  det anbefales; på en **quest** styrer det om questen installeres aktiv eller inaktiv
  for barnets klassetrin (kun ved installation — admin kan altid slå til/fra bagefter).
  Mangler feltet = passer alle. Anbefaling er ALDRIG tvang (jf. PLATFORM_VISION §1.8).
  Ved KLASSESKIFT tilbydes re-tilpasning af installerede moduler; deles et modul af flere
  helte bruges unionen af deres klassetrin (quest aktiv hvis den passer bare ét barn).
- **Quiz-quests (fase E2, valgfrit felt):** `"quiz": { "draw": 10, "pass": 8, "questions":
  [{ "q": "7 × 8 = ?", "answers": ["56", "54", "64", "48"] }] }` — **answers[0] er ALTID det
  rigtige svar i data**; positionerne shuffles ved runtime så pladsen aldrig afslører svaret
  (og svarlængder skal holdes balancerede). `draw` = antal spørgsmål der trækkes tilfældigt
  fra banken, `pass` = antal rigtige for at bestå (default 70 %). Barnet tager quizzen i
  appen; bestået → gennemførelse indsendes m. `quizScore {correct, total}` som forælderen
  ser ved godkendelse ("🧠 Quiz: 10/12") — godkend-før-XP-princippet bevares. Ikke bestået →
  prøv igen frit (mestring, aldrig straf). Indholdet forankres i Fælles Måls TRINFORLØB
  (engelsk: efter 4./7./9. kl., matematik: 1.-3./4.-6./7.-9.) — aldrig 10 separate niveauer.
- Badge-`rule`-typer: `counter` (N quests i et scope), `streak` (streak-regel når milepæl),
  `milestone` (skill når level), `event` (fuldført event-modulets mål), `manual` (admin tildeler).
  `secret: true` = vises først når den opnås. `exclusive: true` = kan kun fås i vinduet.
- Streak-regler: `period` = `day`/`week`/`month`, `target` = antal godkendte quests i perioden,
  `scope` = skill, modul eller `any`. **Admin kan overstyre `target` lokalt** ("matematik 3×
  om ugen") uden at ændre modulet.
- Ingen XP-caps i formatet i v1 — admin balancerer økonomien selv (bevidst fravalg).
- Import/eksport: admin-portalen eksporterer JSON-fil; import med samme `id` overskriver
  indholdet, fremgang bevares automatisk via kontobogen. Ingen kladde/udgiv i v1 — admin
  redigerer live (han er eneste forfatter). Stor testfase kommer senere.

---

## 5. Datastruktur (Firebase RTDB under `/liferpg`)

```
config                       adminPin, familieNavn, lydIndstilling
kids/{kidId}                 navn, avatar, pin, cache: {gold, eventCoin, xpPrSkill}  ← KUN cache
modules/{moduleId}           installerede moduler (hele JSON-indholdet + installedAt, enabled)
overrides/{moduleId}/...     admins lokale justeringer (fx streak-target, quest-XP) oven på modulet
completions/{kidId}/{periode}/{questKey}   workflow: pending → approved/rejected (som i v1)
ledger/{kidId}/{entryId}     ★ SANDHEDEN: { ts, type: xp|gold|eventCoin|badge|cosmetic,
                               amount?, skill?, badge?, item?, quest?, module?,
                               source: quest|purchase|adjust|undo, by, unseen: true }
streaks/{kidId}/{streakId}   cache: { current, best, periodeStatus }  ← genberegnes fra ledger
purchases/{id}               guld-køb af rigtige belønninger (som i v1)
shop/{itemId}                admins rigtige belønninger (guld-butikken, som i v1)
```

**Nøgle-mekanismer:**
- **Godkendelse** skriver ledger-posteringer (ikke direkte saldo-ændringer) og opdaterer cachen.
- **Streak-tid regnes fra indsendelses-tidspunktet**, ikke godkendelses-tidspunktet — fars
  langsomme godkendelse må aldrig knække et barns streak.
- **Fortryd** = modpostering (`source: "undo"`, negativt beløb). Fuld historik, intet forsvinder.
- **Modul slettes/deaktiveres** → quests og butik forsvinder fremadrettet; XP, badges, skills
  og kosmetik på profilen består (læses fra ledger).
- **Skattekisten:** alle ledger-posteringer fødes `unseen: true`. Spiller-appen viser en
  dirrende kiste når der er usete posteringer; åbning afspiller belønningerne én ad gangen
  (konfetti + lyd + level-up-tjek) og markerer dem sete. Er appen åben i godkendelses-
  øjeblikket, afspilles det med det samme i stedet. Lyd: små syntetiserede klemt/fanfarer
  (WebAudio, ingen filer) med slå-fra-knap.

---

## 6. Økonomien — tre adskilte valutaer

| Valuta | Tjenes ved | Bruges til | Kan købes? |
|---|---|---|---|
| **XP** | Alle quests | Levels, badges, streaks — ren fremgang | ALDRIG |
| **Guld 🪙** | Særlige/ugentlige quests | Rigtige belønninger (fars butik: skærmtid, bio…) | Nej |
| **Event-mønter 💠** | Event-moduler + særlige quests | Avatar-kosmetik | Nej |

Daglige/obligatoriske quests giver **kun XP**. Kosmetik i v1 holdes simpel: emoji-baserede
genstande i slots (`outfit`, `ramme`, `baggrund`, `titel`) + en trofæ-hylde på profilen.
Profilen skal kunne fremvises ("se mine badges") — i v1 internt i familien, senere venner.

---

## 7. Streak-motoren

- En streak-regel evalueres pr. periode (dag/uge/måned): `target` godkendte quests i scope
  → perioden er "holdt" → streak +1. Ikke holdt → streaken **fryser bare** (tæller ikke op,
  nulstilles IKKE synligt med drama — den står som "bedste: 12, nuværende: 0" uden skam-UI).
- Milepæle (4, 10, 25, 50, 100…) udløser badges automatisk — kan bygges uendeligt (streak 500).
- Admin kan justere `target` pr. regel i admin-portalen (overrides).
- Vises som flammer 🔥 med nuværende/bedste + "hvad mangler du i denne periode" (fx "1 mate-
  quest mere før ugen er i hus").

---

## 8. Byggeplan (faser)

Genbrug fra v1: hele UI-fundamentet (tema, PIN-pad, faner, godkendelses-flow, butik,
konfetti) består. Databasen er tom lige nu, så omstruktureringen er gratis — **ingen migrering**.

| Fase | Indhold | Status |
|---|---|---|
| **1. Ledger + modul-motor** | Ledger-skrivning ved godkendelse, saldi fra ledger, modul-format v1, import/eksport af JSON, 3 start-moduler (Dansk, Matematik, Hjemmet) | ✅ 13/7-2026 |
| **2. Modul-editor** | Editor-lite i admin: quests (opret/redigér/slet m. XP/guld/mønt/dage, multi-skill-rewards), skills (opret/redigér), streak-mål, nyt-modul-fra-bunden — direkte i modulets DB-kopi; eksport indeholder rettelserne. Badge-editor mangler | 🟡 delvist |
| **3. Badges + streaks + kiste** | Badge-evaluering (counter/milestone/streak-milepæle, secret, rarity), streak-motor m. admin-justerbart mål, skattekiste m. WebAudio-lyd, trofæ-væg m. låste previews | ✅ 13/7-2026 |
| **4. Event-moduler + kosmetik** | Tidsvinduer + teaser-banner + event-mønter (💠) virker; kosmetik-slots og -butik mangler | 🟡 delvist |
| **5. Poler + testfase** | Frederiks store test med rigtige brugere; feedback → beslut næste skridt (auth, skoler, venner) | |
| **C. Klassetrin + bibliotek** | `grade` på helten, `category`/`grades` i modul-formatet, anbefalings-dialog ved helte-oprettelse/trin-skift, alders-tags på quests, 6 nye moduler (Engelsk, Natur & Teknologi, Fitness, Økonomi, Kreativitet, Digital dannelse) → 9 bundlede i alt | ✅ 16/7-2026 |
| **D. Opslagstavlen** | `jobs/{id}` (title/desc/icon/poster-fritekst/reward {gold?, realNote?}/status open→taken→submitted→done); spiller: "Tag jobbet!" via transaction (først-til-mølle), meld færdig / giv tilbage; admin: opret på andres vegne (fx farfar), godkend (ledger→kiste, realNote-påmindelse), afvis m. besked, genåbn; audit på alt | ✅ 16/7-2026 |
| **E1. Folder-overblik** | Quest-siden grupperet pr. modul i sammenklappelige foldere m. fremdrift i hovedet + "kun det jeg mangler"-filter | ✅ 16/7-2026 |
| **E2. Curriculum + quiz-motor** | Quest-type `quiz` (MC i modul-JSON, runtime-shuffle, score → godkendelse), quest-banker pr. trinforløb (matematik: plus/minus 0.-3., tabeller 2.-6., brøk/procent 4.-6.; engelsk: gloser basis 3.-4./øvet 5.-7., grammatik 5.-9.), re-tilpasning af installerede moduler ved klasseskift (union af tildelte heltes trin), editor bevarer quiz/grades-felter | ✅ 16/7-2026 |

**Afvigelse fra §4/§5:** `overrides/`-noden er droppet i v2.0 — admin redigerer modulets DB-kopi
direkte (han er eneste forfatter), og eksporten indeholder dermed rettelserne. Genindføres
hvis/når fremmede moduler skal kunne opdateres uden at overskrive lokale justeringer.

---

## 9. Parkeret (bevidst — ikke glemt)

> **Se PLATFORM_VISION.md** (14/7-2026) for den fulde v3-plan: organisations-model
> (multi-tenant), roller, org-valutaer/wallets, abonnementer, sikkerhed/GDPR og svarene
> på de 12 produktspørgsmål. Punkterne herunder er dækket dér i større detalje.

- **Rigtig auth** (e-mail/password, roller) — kræves før fremmede familier. PIN rækker til v1.
- **Sikkerhed/anti-snyd:** databasen er åben; fint til familie, uholdbart til fremmede.
- **Skoler/klasser:** lærer-admin, hold, GDPR, godkendelse i skala (25 elever).
- **Venner/socialt** på tværs af familier (profil-fremvisning er forberedt via trofæ-væggen).
- **Revenue:** ikke aktuelt. Rammen når den kommer: aldrig pay-to-win, aldrig købbar valuta,
  aldrig loot-boxes for penge. Kandidater: skole-licenser, professionelle premium-moduler
  (rev-share), donation.
- **Marketplace med review** — v1 er manuel JSON-deling på GitHub.
