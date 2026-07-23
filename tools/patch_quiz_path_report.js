// Engangs-patch: injicerer path-report.js + reportPathQuiz-kald i alle kapitel-quizzer
// (dyn2/ele1/mem1), så Duolingo-stien (path/) kan læse quiz-resultater fra localStorage.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'quiz');
const courses = ['dyn2', 'ele1', 'mem1'];
let patched = 0, skipped = 0;

for (const course of courses) {
  const dir = path.join(root, course);
  const files = fs.readdirSync(dir).filter(f => /^Kapitel\d+_Quiz\.html$/.test(f));
  for (const file of files) {
    const fp = path.join(dir, file);
    let html = fs.readFileSync(fp, 'utf8');
    const before = html;

    if (html.includes('path-report.js')) { skipped++; continue; }

    const headMarker = '</head><body><div class="wrap">';
    if (!html.includes(headMarker)) {
      throw new Error(`Head marker not found in ${fp}`);
    }
    html = html.replace(headMarker, '</head><body><script src="../../assets/path-report.js"></script><div class="wrap">');

    const ratioMarker = 'const ratio=score/maxS;';
    const count = html.split(ratioMarker).length - 1;
    if (count !== 1) {
      throw new Error(`Expected exactly one ratio marker in ${fp}, found ${count}`);
    }
    html = html.replace(ratioMarker, ratioMarker + 'if(window.reportPathQuiz)reportPathQuiz(ratio,score);');

    if (html === before) { skipped++; continue; }
    fs.writeFileSync(fp, html, 'utf8');
    patched++;
  }
}

console.log(`Patched ${patched} files, skipped ${skipped}.`);
