# Bordfodbold — Trophy Tracker

Live table-football scoreboard for Frederik, Steffan, Line, and Mads. Shares the
`via-quiz` Firebase project used by QuizLive/HverdagsHelte, under a new `/bordfodbold` node.

## How it works

- The trophy 🏆 only changes hands via a successful **challenge** against its current
  holder: beat the holder and you take it; the holder beats you and they keep it; if
  neither player in a match holds the trophy, nothing happens to it no matter who wins.
  Beating some other, non-holding player never earns you the trophy — you can only take
  it off the person who has it. The very first match ever logged bootstraps the trophy
  onto its winner.
- The poo 💩 mirrors that shape, inverted: it only moves when its current holder plays
  and loses (passing to whoever beat them). It bootstraps onto the first match's loser.
- **Trophy/poo state is computed in chronological order by the match's played `date`,
  not by when it was typed into the app.** That means a forgotten match can be logged
  late — e.g. entering yesterday's game after today's is already in — and it still
  slots into its true place in the timeline instead of scrambling who holds the trophy
  today. Matches logged for the same date fall back to entry order as a tiebreak.
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
