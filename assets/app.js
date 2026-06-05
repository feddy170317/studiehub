// Studiehub — PWA katalog over undervisningsmateriale
// Hash-routing, vanilla JS

let content = null;

async function loadContent() {
  const res = await fetch('content.json');
  content = await res.json();
}

function getHash() {
  return window.location.hash.slice(1) || 'home';
}

function navigate(hash) {
  window.location.hash = hash;
}

function renderHome() {
  const app = document.getElementById('app');
  const edu = content.educations[0];
  app.innerHTML = `
    <div class="view">
      <h1>${edu.name}</h1>
      <p class="meta">${edu.institution}</p>
      <nav class="courses">
        ${edu.semesters.map(sem => `
          <button class="btn-semester" onclick="navigate('edu/${edu.id}/sem${sem.number}')">
            Semester ${sem.number}
          </button>
        `).join('')}
      </nav>
    </div>
  `;
}

function renderSemester(eduId, semNum) {
  const app = document.getElementById('app');
  const edu = content.educations.find(e => e.id === eduId);
  const sem = edu.semesters.find(s => s.number === semNum);

  app.innerHTML = `
    <div class="view">
      <button class="btn-back" onclick="navigate('home')">← Tilbage</button>
      <h1>Semester ${sem.number}</h1>
      <nav class="courses">
        ${sem.courses.map(c => `
          <button class="btn-course" onclick="navigate('edu/${eduId}/sem${semNum}/${c.id}')">
            ${c.code}: ${c.name}
          </button>
        `).join('')}
      </nav>
    </div>
  `;
}

function renderCourse(eduId, semNum, courseId) {
  const app = document.getElementById('app');
  const edu = content.educations.find(e => e.id === eduId);
  const sem = edu.semesters.find(s => s.number === semNum);
  const course = sem.courses.find(c => c.id === courseId);

  app.innerHTML = `
    <div class="view">
      <button class="btn-back" onclick="navigate('edu/${eduId}/sem${semNum}')">← Tilbage</button>
      <h1>${course.code}: ${course.name}</h1>
      <p class="meta">${course.description}</p>
      <nav class="lessons">
        ${course.lessons.map(l => `
          <button class="btn-lesson" onclick="navigate('edu/${eduId}/sem${semNum}/${courseId}/${l.id}')">
            Lektion ${l.number}: ${l.title}
          </button>
        `).join('')}
      </nav>
    </div>
  `;
}

function renderLesson(eduId, semNum, courseId, lessonId) {
  const app = document.getElementById('app');
  const edu = content.educations.find(e => e.id === eduId);
  const sem = edu.semesters.find(s => s.number === semNum);
  const course = sem.courses.find(c => c.id === courseId);
  const lesson = course.lessons.find(l => l.id === lessonId);

  app.innerHTML = `
    <div class="view">
      <button class="btn-back" onclick="navigate('edu/${eduId}/sem${semNum}/${courseId}')">← Tilbage</button>
      <h1>Lektion ${lesson.number}: ${lesson.title}</h1>
      <p class="meta">${lesson.summary}</p>
      <section class="materials">
        <h2>Materiale</h2>
        ${lesson.materials.map(m => renderMaterial(m)).join('')}
      </section>
    </div>
  `;
}

function renderMaterial(material) {
  const iconMap = {
    quiz: '📝',
    video: '▶',
    podcast: '🎙',
    reading: '📖',
    slides: '📊',
    exercise: '✏',
    link: '🔗',
    note: '📝'
  };
  const icon = iconMap[material.type] || '📌';

  if (material.url) {
    return `
      <a href="${material.url}" target="_blank" class="material-card">
        <span class="icon">${icon}</span>
        <span class="title">${material.title}</span>
      </a>
    `;
  } else {
    return `
      <div class="material-card ref">
        <span class="icon">${icon}</span>
        <div>
          <span class="title">${material.title}</span>
          <p class="ref-text">${material.ref}</p>
        </div>
      </div>
    `;
  }
}

function router() {
  const hash = getHash();

  if (hash === 'home') {
    renderHome();
  } else if (hash.startsWith('edu/')) {
    const parts = hash.split('/');
    if (parts.length === 2) {
      // edu/:id
      renderSemester(parts[1], 2); // default semester 2 for now
    } else if (parts.length === 3) {
      // edu/:id/sem:n
      const semNum = parseInt(parts[2].replace('sem', ''));
      renderSemester(parts[1], semNum);
    } else if (parts.length === 4) {
      // edu/:id/sem:n/:courseId
      const semNum = parseInt(parts[2].replace('sem', ''));
      renderCourse(parts[1], semNum, parts[3]);
    } else if (parts.length === 5) {
      // edu/:id/sem:n/:courseId/:lessonId
      const semNum = parseInt(parts[2].replace('sem', ''));
      renderLesson(parts[1], semNum, parts[3], parts[4]);
    }
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', async () => {
  await loadContent();
  router();
});
