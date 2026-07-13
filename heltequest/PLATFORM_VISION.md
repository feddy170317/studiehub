# HelteQuest — Platform-vision (v3+)

*Destilleret fra arkitektur-feedback modtaget 14/7-2026 (Frederiks bror). Dette er IKKE
byggeplanen for nu — det er kortet over hvor vi skal hen, og de beslutninger der skal
respekteres allerede i dag, så vejen derhen ikke blokeres. Byggeplanen for nu er
ARKITEKTUR.md §8: testfasen kommer før alt her.*

---

## 1. De bærende idéer (accepteret som retning)

1. **Organisation som universalbegreb.** En familie, en spejdergruppe, en skoleklasse og en
   sportsklub er alle en `organisation`. UI'et må gerne sige "familie" — datamodellen skal
   sige organisation. Al data der tilhører en gruppe, bærer et `organisation_id`, og
   serveren (ikke klienten!) håndhæver at man kun ser sin egen organisation.
2. **XP er personlig, valuta tilhører organisationen.** Et barn kan være med i familie +
   spejder + fodbold. Læse-XP og udholdenheds-XP følger BARNET på tværs; guld/tokens
   tilhører den enkelte organisation og kan kun bruges i dennes butik. Ingen veksling
   mellem organisationers valutaer (nogensinde i v1 af det system).
   → Wallet-model: `wallet(hero, organisation, currency, balance-af-ledger)`.
3. **Tre indholds-niveauer:** platform-standardmoduler (vores) → organisationens egne
   moduler → tildelinger til det enkelte barn. Forældre redigerer ALDRIG standardmoduler
   direkte — de får en kopi ("Matematik 3. kl. — Jensen-udgaven"), så vi kan opdatere
   standarden uden at smadre deres tilpasninger (copy-on-write).
4. **Roller:** Platform-superadmin (os; MFA, audit-logget, kan IKKE se passwords eller
   frit læse børns data) · Organisations-ejer (abonnement + medlemmer) · Manager (indhold,
   ikke betaling) · Helt (barnet) · Værge-læser (fx den anden forælder, read-only).
   Ordet "admin" udgår af UI'et til den tid.
5. **Abonnement tilhører organisationen**, aldrig barnet. Simpel start: Familie-plan
   (op til 5 helte) — free beta → gratis MVP → betalt. Server-valideret entitlement
   (aldrig en lokal `is_premium`-flag). RevenueCat/App Store/Play ved native.
6. **Ledger, ikke saldo.** (= præcis hvad v2 allerede gør — bekræftet af feedbacken.)
7. **Sikkerhed som launch-krav ved fremmede brugere:** hashede passwords, e-mail-verifikation,
   reset-links m. udløb, RBAC, org-isolation i backend, rate limiting, audit-log
   (hvem gav hvilke coins hvornår — "min søns coins forsvandt"-sagen), backups,
   sletning/eksport af data (GDPR), minimal dataindsamling om børn (kælenavn, ikke
   fødselsdato/skole/adresse/fotos), professionel GDPR-rådgivning FØR offentlig launch.
8. **Læreplans-katalog, ikke hardkodede fag:** versioneret `curriculum framework`
   (land, skoletype, fag, klassetrin, læringsmål) → anbefalinger pr. klassetrin, altid
   "Anbefalet til 3. klasse", aldrig "skal". (Vores modul-format er allerede skridt 1.)
9. **Badge-transparens:** tryk på en badge → se hvad den måler, nuværende fremskridt,
   næste tærskel ("Bogorm sølv: 660 minutter tilbage"). God idé — kan bygges FØR v3.

## 2. Status-kort: feedback vs. hvad der allerede findes

| Feedback-punkt | Status i v2.1 |
|---|---|
| Ledger m. transaktioner, ikke saldi (§13) | ✅ Bygget præcis sådan |
| Indløsning = anmodning → forælder godkender (§9) | ✅ Bygget (pending → Leveret/Annullér m. refusion) |
| XP adskilt fra valuta (§5) | ✅ XP/guld/💠 er tre adskilte spor |
| Moduler som indholdssystem, ikke hardkodede skærme (§7) | ✅ Kernen i v2 |
| Manuelle tildelinger m. spor (§16.2) | ✅ "Justér" skriver ledger-posteringer m. note |
| Fremgang overlever fjernelse fra modul/org (§16.7) | ✅ Ledger-princippet |
| Delbare moduler (§16.9) | ✅ JSON-eksport/-import |
| Copy-on-write på standardmoduler (§6) | 🟡 Bevidst afvigelse: far redigerer DB-kopien direkte, fordi han er ENESTE forfatter. Genindføres når moduler kommer udefra |
| Organisation_id på al data (§2) | 🔜 Hele `/liferpg`-noden ER én organisation; multi-tenant kræver rigtig backend + auth |
| Rigtig auth, roller, superadmin-portal (§1,3,10) | 🔜 v3 — PIN'er rækker til familien |
| Abonnement/TestFlight/native apps (§11) | 🔜 v3 — OBS: HelteQuest er webapp/PWA i dag; TestFlight er kun relevant hvis vi går native/wrapper. PWA-på-hjemmeskærm dækker beta-behovet gratis og uden Apples 15-30 % |
| Org-specifikke valutaer/wallets (§5) | 🔜 v3 — datamodellen (ledger m. currency-felt) gør det let at eftermontere |

## 3. De 12 produktspørgsmål (§16) — svar pr. 14/7-2026

1. **Kan barnet selv markere færdig?** Markere ja, belønning NEJ — forælder godkender før XP falder. *Besluttet 11/7.*
2. **Manuel coin-tildeling uden quest?** Ja — "Justér" i admin, bogføres m. note i ledger.
3. **Er XP permanent hvis quest senere fortrydes?** Godkendelse står ved magt; rettelse sker som synlig modpostering — aldrig sletning.
4. **Flere forældre/værger pr. barn?** Ikke i v2 (én voksen-PIN deles). Værge-læser-rollen er accepteret som v3-krav.
5. **Skilte forældre i samme organisation?** Uafklaret — reelt produktspørgsmål til v3 (evt. to organisationer med samme helt — modellen i §1.2 understøtter det).
6. **Abonnement udløber?** N/A endnu. Princip til den tid: læse-adgang bevares, redigering låses — barnets fremgang holdes aldrig som gidsel.
7. **Helt fjernes fra organisation?** Fremgang (XP/badges) følger barnet; organisationens valuta og butik mister han/hun adgang til.
8. **Slette en helte-profil?** Muligt manuelt nu (DB). Formaliseret slette-flow m. eksport = GDPR-krav før fremmede brugere.
9. **Private moduler delbare?** Ja, frivilligt via JSON-eksport — det er hele pointen med formatet.
10. **Upassende indhold/moderation?** Ikke relevant i familie-drift. Krav den dag der findes en marketplace — indtil da er delingskanalen manuel (GitHub), og importøren bærer ansvaret.
11. **Standardmoduler opdateres uden at smadre tilpasninger?** Nu: samme id overskriver, fremgang bevares. V3: copy-on-write (§1.3).
12. **Gratis vs. betalt?** Parkeret. Ufravigelige rammer: aldrig pay-to-win, aldrig købbar valuta, aldrig loot-boxes for penge, aldrig reklamer/profilering af børn.

## 4. Rækkefølgen (fastholdt mod feedbackens sprint-plan)

Feedbackens sprint 1 ("byg auth, roller, superadmin først") er den rigtige plan for en
SaaS-lancering — men den forkerte NÆSTE handling for os. Vi har et fungerende produkt med
én meget tilfreds bruger. Planen er stadig: **testfase i familien → feedback → derefter**
beslutte om v3-rejsen (backend, auth, multi-tenant) skal betales. Det dette dokument
sikrer, er at intet vi bygger i mellemtiden, gør v3 dyrere end nødvendigt — deraf
ledgeren, modul-formatet, org-tænkningen og XP/valuta-adskillelsen.
