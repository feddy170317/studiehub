// Fletter agent-forfattede spørgsmålstilføjelser (tools/quiz_pool_additions/<course>/KapitelNN.json)
// ind i den tilsvarende quiz-fils QUIZ_POOL-array. Validerer skema før og efter.
const fs = require('fs');
const path = require('path');

const additionsRoot = path.join(__dirname, 'quiz_pool_additions');
const quizRoot = path.join(__dirname, '..', 'quiz');
const courses = ['dyn2', 'ele1', 'mem1'];
const VALID_D = new Set(['let', 'mid', 'svaer']);

function validateItem(item, ctx) {
  if (typeof item.d !== 'string' || !VALID_D.has(item.d)) throw new Error(`${ctx}: invalid "d" ${JSON.stringify(item.d)}`);
  if (typeof item.q !== 'string' || !item.q.trim()) throw new Error(`${ctx}: invalid "q"`);
  if (!Array.isArray(item.o) || item.o.length !== 4 || item.o.some(o => typeof o !== 'string' || !o.trim())) {
    throw new Error(`${ctx}: "o" must be an array of exactly 4 non-empty strings`);
  }
  if (item.a !== 0) throw new Error(`${ctx}: "a" must be 0 (correct answer must be listed first), got ${item.a}`);
  if (typeof item.e !== 'string' || !item.e.trim()) throw new Error(`${ctx}: invalid "e"`);
}

let totalAdded = 0;
const report = [];

for (const course of courses) {
  const dir = path.join(additionsRoot, course);
  if (!fs.existsSync(dir)) { report.push(`${course}: no additions directory, skipped`); continue; }
  const files = fs.readdirSync(dir).filter(f => /^Kapitel\d+\.json$/.test(f)).sort();

  for (const file of files) {
    const chapNum = file.match(/^Kapitel(\d+)\.json$/)[1];
    const additionsPath = path.join(dir, file);
    const quizPath = path.join(quizRoot, course, `Kapitel${chapNum}_Quiz.html`);

    if (!fs.existsSync(quizPath)) throw new Error(`No matching quiz file for ${additionsPath} (expected ${quizPath})`);

    let additions;
    try {
      additions = JSON.parse(fs.readFileSync(additionsPath, 'utf8'));
    } catch (e) {
      throw new Error(`Failed to parse ${additionsPath}: ${e.message}`);
    }
    if (!Array.isArray(additions) || additions.length === 0) {
      throw new Error(`${additionsPath}: expected a non-empty JSON array`);
    }
    additions.forEach((item, i) => validateItem(item, `${additionsPath}[${i}]`));

    let html = fs.readFileSync(quizPath, 'utf8');
    // Nogle filer har en kommentarlinje mellem arrayet og shuffle()-funktionen, andre ikke.
    const re = /const QUIZ_POOL = (\[[\s\S]*?\]);(\r?\n(?:\/\/[^\r\n]*\r?\n)?)function shuffle\(a\)/;
    const m = html.match(re);
    if (!m) throw new Error(`Could not locate QUIZ_POOL declaration in ${quizPath}`);

    let existing;
    try {
      existing = JSON.parse(m[1]);
    } catch (e) {
      throw new Error(`Failed to parse existing QUIZ_POOL in ${quizPath}: ${e.message}`);
    }
    if (existing.length !== 10) {
      throw new Error(`${quizPath}: expected existing QUIZ_POOL to have 10 items (looks already integrated?), found ${existing.length}`);
    }

    const before = existing.length;
    const combined = existing.concat(additions);
    const separator = m[2];
    html = html.replace(re, () => `const QUIZ_POOL = ${JSON.stringify(combined)};${separator}function shuffle(a)`);
    fs.writeFileSync(quizPath, html, 'utf8');

    totalAdded += additions.length;
    report.push(`${course}/Kapitel${chapNum}: ${before} -> ${combined.length} questions`);
  }
}

console.log(report.join('\n'));
console.log(`\nTotal new questions integrated: ${totalAdded}`);
