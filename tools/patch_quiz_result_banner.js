// Engangs-patch: tilføjer bestået/ikke-bestået-banner (quiz-result-ceremony.js) til
// alle kapitel-quizzer, så resultatet af stiens beståelseskrav er tydeligt.
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

    if (html.includes('quiz-result-ceremony.js')) { skipped++; continue; }

    const scriptMarker = '<script src="../../assets/path-report.js"></script>';
    if (!html.includes(scriptMarker)) {
      throw new Error(`path-report.js script tag not found in ${fp} — run patch_quiz_path_report.js first`);
    }
    html = html.replace(scriptMarker, scriptMarker + '<script src="../../assets/quiz-result-ceremony.js"></script>');

    const stageMarker = /(\$\('stage'\)\.innerHTML=`<div class="card end">.*?<\/div>`;)/s;
    if (!stageMarker.test(html)) {
      throw new Error(`end-screen innerHTML line not found in ${fp}`);
    }
    html = html.replace(stageMarker, "$1if(window.renderPathResultBanner)document.getElementById('stage').insertAdjacentHTML('beforeend',renderPathResultBanner(ratio));");

    fs.writeFileSync(fp, html, 'utf8');
    patched++;
  }
}

console.log(`Patched ${patched} files, skipped ${skipped}.`);
