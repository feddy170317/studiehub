# HverdagsHelte — Byggelog

*Kronologisk log over hele forløbet. Ny session: læs denne + ARKITEKTUR.md + plan-filen
(`~/.claude/plans/hey-this-is-awesome-goofy-globe.md`) — så er du oppe i fart.*

| Dato | Milepæl |
|---|---|
| 11/7 | **v1**: Basis-app (PIN-login, quests, forældre-godkendelse, guld-butik) bygget + E2E-testet på én dag |
| 11/7 | **v2-interview**: 3 runder voice-interview (Frederik + bror) → ARKITEKTUR.md: moduler er DATA, ledger er sandheden, beløn-aldrig-straf |
| 12-13/7 | **v2**: Modul-motor, ledger, badges, streaks, skattekiste + 3 moduler (Dansk/Matematik/Hjemmet). Deployet til GitHub Pages |
| 13/7 | **v2.1**: Research (Habitica/Duolingo/Finch/Joon → INSPIRATION.md) → style-butik, klistermærke-album, bonus-drops (25 %, max 1/dag), evolve-fejring |
| 14/7 | **Platform-vision**: Brorens SaaS-arkitektur-feedback → PLATFORM_VISION.md (org-model, roller, wallets, GDPR — v3+-kortet) + FEEDBACK_original bevaret ordret |
| 14/7 | **v3 bygget**: Firebase Auth (email/password), organisations-model (`hq/orgs/{orgId}`), server-håndhævede rules, migrering, audit-log. + Kæledyrs-mekanik (æg→klækning→evolution) |
| 15/7 | **v3 LIVE**: Frederik aktiverede Auth + rules → fuld E2E grøn (inkl. org-isolations-indbrudstest) → deploy. **Omdøbt HelteQuest → HverdagsHelte** (Hasbro HeroQuest™-afstand); redirects fra gammelt path |
| 16/7 | **Udbygningsplan godkendt** (plan-fil): A korrektion → B personlige moduler → C klassetrin+bibliotek → D opslagstavle |
| 16/7 | **Fase A LIVE**: Fortryd godkendelse (quest genåbnes), kontobogs-modal m. fortryd/bulk, deaktivér/gendan/slet-helt, emoji-ikonvælger, audit i loggen |
| 16/7 | **Fase B LIVE**: Modul-tildeling pr. helt (assignedTo), "＋ Nyt modul" + "＋ Ny færdighed" i UI, multi-skill-rewards i quest-editor |
| 16/7 | **Fase C LIVE**: Klassetrin (grade 0-9) på helte, modul-meta `category`/`grades`, anbefalings-dialog ved ny helt/trin-skift, grade-filtreret installation (quests udenfor trinnet = inaktive), 6 nye moduler (Engelsk, Natur & Teknologi, Fitness m. 10-km multi-skill-quest, Økonomi, Kreativitet, Digital dannelse) → 9 bundlede i alt, wizard grupperet pr. kategori. E2E: e2e_faseC.py grøn + faseB-regression grøn |
| 16/7 | **Fase D LIVE**: Opslagstavlen — `jobs/{id}` m. poster-fritekst (admin opretter på fx farfars vegne), løn = guld OG/ELLER rigtige penge (realNote, afregnes udenfor appen); spiller tager job via transaction (først-til-mølle — race-testet), meld færdig/giv tilbage; admin godkender (ledger→kiste; kun-realNote → 'job'-posteringstype), afviser m. besked, genåbner; audit på alt. E2E: e2e_faseD.py grøn (9 trin) — **HELE DEN GODKENDTE 4-FASE-PLAN ER FÆRDIG** |
| 16/7 | **Fase E1 LIVE**: Folder-overblik på quest-siden — quests grupperes pr. modul i sammenklappelige foldere (lukkede som standard, husket i localStorage `hq_folders`), fremdrift i hovedet ("2/6 i dag · 0/4 i ugen") + rød mangler-badge/grøn ✔, "🎯 Kun det jeg mangler"-filter (`hq_only_missing`), indsendte quests regnes som klarede og nedtones. ALLE gamle E2E-suiter opdateret til folder-selektorer (aabn folder → #quest-folders). E2E: e2e_faseE1.py grøn + faseB/C-regression grøn |

## Udestående (besluttet 16/7 — næste fase)

- **FASE E2 — Curriculum-indhold + quiz-motor** (Frederiks valg via 2 spørgsmål: quiz-quests
  i appen ✓, folder-UX først ✓): (1) quest-banker pr. TRINFORLØB — IKKE pr. klassetrin;
  Fælles Mål arbejder i bånd (engelsk: efter 4./7./9. kl., dansk: 1-2/3-4/5-6/7-9,
  matematik: 1-3/4-6/7-9) og skills skal bestå på tværs af trin så XP aldrig nulstilles.
  Eksisterende quest-`grades`-mekanik genbruges — det er INDHOLD der mangler (~10 quests
  pr. bånd pr. fag, forankret i Fælles Måls kompetencemål; kilder: emu.dk faghæfter,
  uvm.dk PDF'er, retsinformation.dk/eli/lta/2020/1217). (2) Re-tilpasning ved klasseskift:
  grade-filtrering sker i dag KUN ved installation — tilføj "Opdatér til N. klasse" på
  installerede moduler når heltens grade ændres (kendt hul). (3) Ny quest-type `quiz`:
  MC-spørgsmål som data i modul-JSON (runtime-shuffle af svar-positioner!); barnet tager
  quizzen i appen, score følger med completion ("Quiz: 10/12"), forældre-godkendelse
  bevares. Start: engelsk + matematik bånd 1.-3. + 4.-6.
- Frederiks 3. emne fra 16/7-beskeden blev KLIPPET AF ("the next thing we need to do is…")
  — spørg ham hvad det var.
- Derefter: badge-fremskridts-visning (tryk på badge → progress), månedlig
  quest-type, event-modul "Sødheds-august" + event-motor-huller (nedtælling, event-badge-regel,
  modul-kosmetik), PWA-manifest, streak-skjold, dobbelt-XP-weekend, boss-quests.

## Drift-opskrifter

- **Deploy**: `Remove-Item Studiehub\hverdagshelte -Recurse -Force; Copy-Item -Recurse -Force
  HverdagsHelte Studiehub\hverdagshelte; Remove-Item Studiehub\hverdagshelte\tests -Recurse -Force;`
  git add/commit/push i Studiehub → verificér med curl på Pages-URL (~30-60 s).
- **Test**: `python HverdagsHelte\tests\e2e_<fase>.py` — opretter/sletter egne konti+orgs.
  Regler: fravælg ALTID migrerings-checkboxen; PIN-klik m. 150 ms pauser; kiste-klik force=True;
  prompts håndteres m. dialog-handler; INGEN emoji i print (cp1252).
- **Faldgruber**: RTDB-nøgler tåler ikke `.` (HQ.safeKey); Firebase affyrer lyttere SYNKRONT
  ved lokal skrivning (sæt UI-state FØR set()); RTDB stripper tomme arrays; org-scoped
  HQ.ref() kaster før setOrg().

## Live

- Spiller: https://feddy170317.github.io/studiehub/hverdagshelte/
- Admin: https://feddy170317.github.io/studiehub/hverdagshelte/admin.html
- Firebase-projekt: via-quiz (RTDB europe-west1; QuizLive deler projektet — /games+/quizzes SKAL forblive åbne i rules)
