// Engangs-patch: gør quiz-motoren pool-baseret. QUIZ-arrayet omdøbes til QUIZ_POOL,
// og der trækkes tilfældigt 10 spørgsmål fra puljen ved hvert forsøg — så "Prøv igen"
// ikke længere giver præcis de samme spørgsmål i samme rækkefølge. Virker uændret
// selv med en pulje på præcis 10 (no-op), så puljer kan udvides i egen omgang.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'quiz');
const courses = ['dyn2', 'ele1', 'mem1'];
const PICK = 10;
let patched = 0, skipped = 0;

for (const course of courses) {
  const dir = path.join(root, course);
  const files = fs.readdirSync(dir).filter(f => /^Kapitel\d+_Quiz\.html$/.test(f));
  for (const file of files) {
    const fp = path.join(dir, file);
    let html = fs.readFileSync(fp, 'utf8');

    if (html.includes('QUIZ_POOL')) { skipped++; continue; }

    const declMarker = 'const QUIZ = [';
    const count = html.split(declMarker).length - 1;
    if (count !== 1) throw new Error(`Expected exactly one QUIZ declaration in ${fp}, found ${count}`);
    html = html.replace(declMarker, 'const QUIZ_POOL = [');

    const shuffleFnMarker = "function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}";
    if (!html.includes(shuffleFnMarker)) throw new Error(`shuffle() fn not found in ${fp}`);
    html = html.replace(
      shuffleFnMarker,
      shuffleFnMarker + `\nconst QUIZ = shuffle(QUIZ_POOL.slice()).slice(0, Math.min(${PICK}, QUIZ_POOL.length));`
    );

    fs.writeFileSync(fp, html, 'utf8');
    patched++;
  }
}

console.log(`Patched ${patched} files, skipped ${skipped}.`);
