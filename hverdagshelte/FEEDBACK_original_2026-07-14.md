# HeroQuest: Product and Architecture Feedback (ORIGINAL, uredigeret)

*Modtaget 14/7-2026 fra Frederiks bror. Bevaret ordret som reference.
Destilleret version m. status-kort og beslutninger: se PLATFORM_VISION.md.*

---

You have a strong core idea: HeroQuest should not just be a task tracker, but a **multi-tenant family learning and motivation platform**. The key is to separate:

1. **Platform-level content and administration** - controlled by you, the creator.
2. **Family/group-level content** - controlled by parents, scout leaders, teachers, etc.
3. **Hero-level progress** - owned by the child/student, but visible to the relevant adults.

The biggest risk is trying to build every advanced feature at once. The right goal is not "flawless at launch" - that is unrealistic for any software product - but a **safe, focused MVP** that is easy to test, observe, and improve before charging users.

## 1. Reframe the roles

Avoid the word "admin" in the user interface. Parents are not necessarily technical administrators; they are the people managing a family or group.

| Role | Scope | What they can do |
|---|---|---|
| **Platform Super Admin** | Entire HeroQuest platform | Manage support cases, investigate accounts, manage global modules, subscriptions, moderation, platform settings |
| **Organisation Owner** | One family, scout group, school group, etc. | Owns subscription, manages members, creates shops, quests, modules, and rewards |
| **Organisation Manager** | One organisation | Can create and manage content, but cannot alter billing or transfer ownership |
| **Hero / Student** | Their own profile | View and complete quests, see skills, badges, XP, and organisation-specific wallets |
| **Guardian Viewer** | Linked child only | Can view progress without editing content, useful for a second parent |

A "family" should technically be treated as an **organisation** or **realm**: a family is one organisation, a scout troop another, a school class another. The UX may say "Family" / "Scout Group" / "Class" — internally the data model uses one universal concept: `organisation`.

## 2. The most important design decision: multi-tenancy

Every family or group has its own isolated workspace. A parent in Family A must never be able to see, edit, reward, or affect Family B — enforced in the backend, not just visually.

**The golden rule:** every record that belongs to a family or group must contain an `organisation_id`, and the backend must validate that the logged-in user belongs to the organisation before returning or changing that record. Do not rely on frontend filtering — the server must enforce permissions on every request.

## 3. Super Admin: what you should and should not be able to do

**Should:** search organisations/accounts, see subscription status, disable/suspend/restore accounts, help parents regain access, initiate password-reset emails, investigate support issues, view audit logs, moderate shared templates, manage official modules/badges, handle deletion/export requests.

**Should NOT (by default):** view or set a parent's password, read children's private information unless necessary and logged, casually edit a family's rewards/quests/wallets, log in as a parent without a controlled support-impersonation process.

**Password recovery:** never store readable passwords (hash securely). Normal flow: "Forgot password?" → one-time reset link to verified email → link expires → parent sets new password → audit-logged. Lost email access → controlled support process where Super Admin verifies ownership and sends a recovery link without ever learning the password.

## 4. Family accounts, child limits, and subscriptions

| Plan | Intended user | Hero limit | Position |
|---|---|---:|---|
| **Free Beta** | Friends and family testers | 1-3 | No payment, limited functionality |
| **Family** | Standard household | Up to 5 | ~10 DKK/month |
| **Family Plus** | Large households | 8-10 | Higher monthly price |
| **Group / Club** | Scouts, sports clubs, tutors | 20-100+ | Organisation plan |
| **School** | Schools/institutions | Custom | Quote-based / per active student |

First paid version: one Family subscription = up to five heroes, one shop, custom quests, custom rewards, standard learning modules, parent management tools. No complex per-user billing or school contracts in version one.

**Rule:** the subscription belongs to the **organisation**, not a child. The parent owns billing; other guardians are invited as managers/viewers; heroes never pay.

## 5. A child can belong to multiple organisations

A hero can be member of family + scouts + football club + school class. Critical rule: **currencies must never be shared by default.**

- **A. Personal XP and skills** — the hero's overall development, combinable across approved organisations (Reading XP from home AND school).
- **B. Organisation-specific currencies** — `Jensen Family Coins`, `Scout Tokens` — earnable and spendable ONLY within that organisation's shop.

Wallet model: `Wallet(id, hero_id, organisation_id, currency_id, balance)`; `Currency(id, organisation_id, name, symbol, decimals, active)`. A quest reward always specifies which wallet receives currency. This prevents a parent from inflating the scout economy. **No currency conversion between organisations in the first version.**

## 6. Standard modules versus private custom modules

| Content level | Created by | Visible to |
|---|---|---|
| **HeroQuest Standard Module** | Platform team | All eligible organisations |
| **Organisation Custom Module** | Parent or group manager | Only that organisation |
| **Hero-specific assignment** | Parent or manager | One selected hero |

Parents can enable/disable a global module, select topics, change difficulty, add custom quests, create private modules. **Parents never edit official modules directly — they create a copy** ("Mathematics Grade 3 — Jensen Family Version"), so the standard can be updated without breaking customisations.

## 7. Danish curriculum: a content system, not hard-coded screens

Standard modules for the folkeskole subjects (dansk, matematik, engelsk, natur/teknologi, fysik/kemi, biologi, geografi, historie, samfundsfag, kristendom, idræt, musik, billedkunst, håndværk/design, madkundskab, teknologiforståelse + hverdagsansvar og trivsel) — but the curriculum changes over time, so use a versioned content model:

`Curriculum Framework(country, school type, curriculum version, subject, grade range, learning goals, suggested quests, skill tags)` + hero profile (school level, grade, year, preferences) → the app **recommends** modules by grade ("Recommended for Grade 3" — never "must complete").

## 8. Badges, ranks, and continuous progression

Badge families with ranks, e.g. Bookworm: Bronze 300 min read / Silver 1,200 / Gold 3,000 / Platinum 7,500. Tapping a badge shows: what it measures, current progress, next threshold, reward for next rank ("Bookworm Bronze achieved — 540/1,200 minutes, 660 remaining").

Recommendations: show locked badges without overwhelming young children; distinguish badge vs rank; small reward per rank (XP, decoration, title, small currency); don't reward everything with coins; make long-term badges hard but achievable; use progression bars.

Categories: Learning (Bookworm, Maths Explorer, Science Detective) · Home (Household Hero, Organiser, Helping Hand) · Fitness (Runner, Movement Master, Team Player) · Personal (Habit Builder, Focus Champion, Kindness Hero) · Creativity (Maker, Musician, Storyteller).

## 9. The shop and reward system

Examples: choose Friday dinner, extra screen time, family film pick, stay up 30 min later, invite a friend, weekend activity, football accessory, pocket money, scout event privilege.

Each shop item belongs to one organisation (`organisation_id, currency_id, title, cost, availability, stock, approval_required`). A redemption creates a **request**: hero buys → "Pending approval" → parent approves/declines/fulfils → recorded. Avoids "I bought it, so I get it immediately" disputes.

## 10. Security and child privacy must be a launch priority

Minimum: secure password hashing, verified parent emails, expiring reset links, MFA for Super Admin, RBAC, organisation-level isolation, TLS, encryption at rest, rate limiting, session expiry/secure tokens, audit logs, tested backups/restore, account deletion, data export, privacy policy + ToS, parent-managed consent flow, no ad-profiling of children, minimal child data.

Audit log events: account created, password reset, child profile created/deleted, quest created/edited, currency awarded, purchase requested/approved, subscription changed, hero added/removed, Super Admin access used. Example: `2026-07-13 14:22 · Jensen Family · Parent · Awarded 25 Family Coins · Child A · Quest: Cleaned bedroom` — essential when "my child's coins disappeared".

Do not store: home addresses, school names, full birth dates, photos of children, sensitive assessments, open messaging between children. Use nickname/first name. Obtain professional GDPR/child-data legal advice before public launch (DK/EU).

## 11. Payments and App Store strategy

iOS beta: **TestFlight** (up to 10,000 external testers, no card required). [Apple: TestFlight](https://developer.apple.com/news?id=sw8ldfjk)

Launch sequence: **Phase 1** closed beta (free, "Beta"-labelled, feedback button everywhere, crash reporting, onboarding survey; test with family, parents of different ages, kids of different grades, a scout leader/coach, technical and non-technical adults) → **Phase 2** public free MVP (1-2 heroes, standard modules, basic quests/badges, limited shop) → **Phase 3** paid Family subscription once retention is proven.

Payments: Apple in-app subscriptions (submitted via App Store Connect — [source](https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-in-app-purchase)), Google Play subscriptions, optionally RevenueCat. Note: apps uploaded from April 28, 2026 must use the iOS 26 SDK+ ([source](https://developer.apple.com/news?id=6lxhtioi)). Backend unlocks paid features only after verifying store purchase state — never trust a local `is_premium` flag.

## 12. Suggested technical architecture

App (iOS/Android) → Authentication Service + Backend API → PostgreSQL; services: Roles/Permissions, Quest & Module, Wallet & Transaction Ledger, Badge & XP Engine, Subscription Entitlement (↔ App Store/Play), Audit Log. Super Admin portal + Parent/Manager portal both talk to the same API.

Components: 1) Authentication (login, verification, reset, sessions) · 2) Authorisation (role+membership check on every action) · 3) Organisation service · 4) Curriculum & module service · 5) Quest service (daily/weekly/monthly/one-off/recurring) · 6) Gamification service (XP, skills, badges, ranks) · 7) Wallet ledger (immutable transactions) · 8) Shop service · 9) Subscription service · 10) Super Admin portal.

## 13. Use a ledger, not a simple coin balance

Do not only store `family_coin_balance = 275`. Record transactions: `WalletTransaction(id, wallet_id, type: earn/spend/correction/refund, amount, resulting_balance, source_type: quest/shop/admin, source_id, created_at, created_by)`. Example: `+25 Family Coins · Reason: Completed "Take out rubbish" · Source: Quest #482 · Created by: Parent`. If anything goes wrong you can reconstruct and explain the balance — the same principle as proper accounting systems.

## 14. Recommended MVP scope

**Build first:** parent sign-up/login · family organisation creation · max five heroes · hero profiles with age/grade · standard starter modules · parent-created quests · completion+approval · organisation currency wallet · parent-created shop rewards · XP, a few skills, a few badges · basic Super Admin portal · TestFlight beta · privacy policy, terms, basic audit logging.

**Build later:** multiple organisations per hero · scouts/clubs/schools · multiple wallets · cross-org XP · advanced curriculum mapping · deep badge trees & seasonal events · family co-owner roles · reward marketplace · social features · AI-generated quests · school analytics · parental reports. (Plan multi-organisation in the database now; ship the UX later.)

## 15. Practical roadmap

**Sprint 1 Foundation:** roles, organisation/hero ownership, DB schema, authentication, org-level permissions, Super Admin with audit logging.
**Sprint 2 Family MVP:** create family, up to five heroes, grade selection + module recommendations, standard modules, quest lifecycle.
**Sprint 3 Motivation:** XP/skills, family wallet, shop + redemption approval, first badge families (Bookworm, Household Hero, Movement Hero).
**Sprint 4 Beta readiness:** error reporting, feedback collection, privacy/deletion workflows, backup/restore testing, TestFlight, structured feedback from 10-30 families.
**Sprint 5 Monetisation:** App Store subscriptions, plan limits, entitlement validation, billing/cancellation UX, free→paid upgrade path.
**Sprint 6 Groups:** scout/group organisation type, hero in multiple organisations, separate wallets, shared personal XP, group manager roles.

## 16. Questions to answer before development continues

1. Can a child mark a quest complete, or must a parent always approve it?
2. Can a parent award coins manually without a quest?
3. Are XP rewards permanent if a quest is later rejected?
4. Can a hero have more than one parent/guardian?
5. Can divorced parents belong to the same family organisation?
6. What happens when a subscription expires?
7. What happens if a hero is removed from an organisation?
8. Can a parent delete a child profile, and what happens to its data?
9. Are custom modules private forever, or can parents share them later?
10. Can users create inappropriate reward names or content, and how will it be moderated?
11. How are curriculum modules updated without breaking parent customisations?
12. Which features are free, and which are paid?

*(Svar pr. 14/7-2026: se PLATFORM_VISION.md §3.)*

## Final recommendation

> **A hero can develop across many areas of life, but rewards, permissions, and data always belong to a clearly defined organisation.**

That gives: private family customisation · safe separation between families · a future path into scouts, clubs, and schools · separate currencies that cannot inflate each other · a scalable subscription model · a clean architecture for Super Admin support.

**Trainee insight:** This is similar to designing a machine with interchangeable modules. If you define clear interfaces early — organisations, permissions, wallets, content ownership — you can add functionality later without rebuilding the product. If those interfaces are vague, every new feature creates unexpected failures elsewhere.
