# Bordfodbold — Trophy Tracker

Live table-football scoreboard for Stefan, Frederick, and Leeny. Shares the `via-quiz`
Firebase project used by QuizLive/HverdagsHelte, under a new `/bordfodbold` node.

## How it works

- Every logged match is a trophy challenge. Winner takes (or keeps) the gold trophy 🏆,
  loser gets the bronze/runner-up badge 🥉. The player not in the most recent match shows
  neither badge.
- Season standings (total wins, matches, goals, goal diff) are tracked separately and
  accumulate continuously under the current year's label — this is what decides who
  actually "wins the season" regardless of who happens to hold the trophy right now.
- Anyone with the link can view live. Logging or deleting a match requires the shared PIN.

## One-time setup step (required)

Firebase RTDB rules only allow specific top-level paths. Add this key in
**Firebase Console → via-quiz project → Realtime Database → Rules**, alongside the
existing `games`/`quizzes`/`hq`/`liferpg` keys, then **Publish**:

```json
"bordfodbold": { ".read": true, ".write": true }
```

## Changing the shared PIN

Default PIN is `2026`. To change it: Firebase Console → Realtime Database → Data →
navigate to `bordfodbold/config/pin` → edit the value directly. No redeploy needed —
every open tab picks up the new PIN on next page load.

## Deploying

Copy this folder into the Studiehub repo and push:

```
cp -r Bordfodbold/* ../Studiehub/bordfodbold/
cd ../Studiehub
git add bordfodbold
git commit -m "Add Bordfodbold trophy tracker"
git push
```

Live URL (after push, GitHub Pages): `https://feddy170317.github.io/studiehub/bordfodbold/`

## Editing players

Player names/colors are set in `assets/app.js` at the top (`PLAYERS`, `PLAYER_COLOR`).
Renaming a player there does not rewrite historical match records — old matches keep
whatever name was used when they were logged.
