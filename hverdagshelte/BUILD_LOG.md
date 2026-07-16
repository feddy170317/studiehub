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

## Udestående (fra godkendt plan — byg i næste session)

- **FASE D — Opslagstavlen**: jobs-node (open→taken→submitted→done/failed), poster =
  fritekst ("Farfar", admin opretter på andres vegne), løn = guld OG/ELLER rigtige-penge-
  fritekst, først-til-mølle via transaction, godkendelse i admin. Plan-filens §D.
- Derefter (manglelisten): badge-fremskridts-visning (tryk på badge → progress), månedlig
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
