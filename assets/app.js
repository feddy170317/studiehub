// Studiehub — PWA katalog over undervisningsmateriale
// Hash-routing, vanilla JS, offline-first

let content = null;
let isOnline = navigator.onLine;

// Toast notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Offline detection
function setupOfflineDetection() {
  window.addEventListener('online', () => {
    isOnline = true;
    document.body.classList.remove('offline');
    showToast('Du er online igen ✓', 'success');
  });

  window.addEventListener('offline', () => {
    isOnline = false;
    document.body.classList.add('offline');
    showOfflineBanner();
  });

  if (!isOnline) {
    document.body.classList.add('offline');
    showOfflineBanner();
  }
}

function showOfflineBanner() {
  let banner = document.querySelector('.offline-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.className = 'offline-banner';
    banner.textContent = '⚠ Offline — nogle funktioner er ikke tilgængelige';
    document.body.insertBefore(banner, document.body.firstChild);
  }
}

async function loadContent() {
  try {
    const res = await fetch('content.json');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Kunne ikke hente materialekataloget`);
    }
    content = await res.json();
  } catch (err) {
    console.error('Error loading content:', err);
    showToast(`Fejl: ${err.message}`, 'error');

    // Try cache as fallback
    const cached = await caches.match('content.json');
    if (cached) {
      content = await cached.json();
      showToast('Bruger offline-version', 'info');
    } else {
      renderError(err.message);
    }
  }
}

function getHash() {
  return window.location.hash.slice(1) || 'home';
}

function navigate(hash) {
  window.location.hash = hash;
}

function renderError(message) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="view">
      <div class="empty-state">
        <span class="icon">⚠️</span>
        <p><strong>Fejl ved indlæsning</strong></p>
        <p>${message}</p>
        <p style="margin-top: 1.5rem; font-size: 0.85rem;">
          <button class="btn-back" onclick="location.reload()" style="background: var(--primary); color: white; padding: 0.75rem; width: 100%;">
            Prøv igen
          </button>
        </p>
      </div>
    </div>
  `;
}

function renderHome() {
  const app = document.getElementById('app');
  if (!content || !content.educations || content.educations.length === 0) {
    renderError('Ingen uddannelser fundet');
    return;
  }

  const edu = content.educations[0];
  app.innerHTML = `
    <div class="view">
      <h1>${edu.name}</h1>
      <p class="meta">${edu.institution}</p>
      <nav class="courses">
        ${edu.semesters.length > 0 ? edu.semesters.map(sem => `
          <button class="btn-semester" onclick="navigate('edu/${edu.id}/sem${sem.number}')">
            Semester ${sem.number}
          </button>
        `).join('') : '<div class="empty-state"><p>Ingen semestre fundet</p></div>'}
      </nav>
      <h2 style="margin-top:2rem">Andre værktøjer</h2>
      <nav class="courses">
        <a class="btn-course" style="display:block;text-decoration:none" href="klinisk-dansk/index.html">
          🫀 Klinisk Dansk — Sygeplejesprog (DA/EN)
        </a>
      </nav>
    </div>
  `;
}

function renderSemester(eduId, semNum) {
  const app = document.getElementById('app');
  const edu = content.educations.find(e => e.id === eduId);
  if (!edu) {
    renderError('Uddannelse ikke fundet');
    return;
  }

  const sem = edu.semesters.find(s => s.number === semNum);
  if (!sem) {
    renderError(`Semester ${semNum} ikke fundet`);
    return;
  }

  app.innerHTML = `
    <div class="view">
      <button class="btn-back" onclick="navigate('home')">← Tilbage</button>
      <h1>Semester ${sem.number}</h1>
      <nav class="courses">
        ${sem.courses && sem.courses.length > 0 ? sem.courses.map(c => `
          <button class="btn-course" onclick="navigate('edu/${eduId}/sem${semNum}/${c.id}')">
            ${c.code}: ${c.name}
          </button>
        `).join('') : '<div class="empty-state"><p>📚 Ingen fag i dette semester endnu</p></div>'}
      </nav>
    </div>
  `;
}

function renderCourse(eduId, semNum, courseId) {
  const app = document.getElementById('app');
  const edu = content.educations.find(e => e.id === eduId);
  const sem = edu && edu.semesters.find(s => s.number === semNum);
  const course = sem && sem.courses.find(c => c.id === courseId);

  if (!course) {
    renderError('Fag ikke fundet');
    return;
  }

  app.innerHTML = `
    <div class="view">
      <button class="btn-back" onclick="navigate('edu/${eduId}/sem${semNum}')">← Tilbage</button>
      <h1>${course.code}: ${course.name}</h1>
      <p class="meta">${course.description || 'Intet beskrivelse'}</p>
      <nav class="lessons">
        ${course.lessons && course.lessons.length > 0 ? course.lessons.map(l => `
          <button class="btn-lesson" onclick="navigate('edu/${eduId}/sem${semNum}/${courseId}/${l.id}')">
            Lektion ${l.number}: ${l.title}
          </button>
        `).join('') : '<div class="empty-state"><p>📖 Ingen lektioner endnu</p></div>'}
      </nav>
    </div>
  `;
}

function renderLesson(eduId, semNum, courseId, lessonId) {
  const app = document.getElementById('app');
  const edu = content.educations.find(e => e.id === eduId);
  const sem = edu && edu.semesters.find(s => s.number === semNum);
  const course = sem && sem.courses.find(c => c.id === courseId);
  const lesson = course && course.lessons.find(l => l.id === lessonId);

  if (!lesson) {
    renderError('Lektion ikke fundet');
    return;
  }

  app.innerHTML = `
    <div class="view">
      <button class="btn-back" onclick="navigate('edu/${eduId}/sem${semNum}/${courseId}')">← Tilbage</button>
      <h1>Lektion ${lesson.number}: ${lesson.title}</h1>
      <p class="meta">${lesson.summary || ''}</p>
      <section class="materials">
        <h2>Materiale</h2>
        ${lesson.materials && lesson.materials.length > 0
          ? lesson.materials.map(m => renderMaterial(m)).join('')
          : '<div class="empty-state" style="padding: 2rem 0;"><p>📚 Ingen materialer endnu</p></div>'}
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

// Listen for Service Worker updates (silent, no toast)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data.type === 'CONTENT_UPDATED') {
      // Reload content silently in background (no notification)
      loadContent().catch(err => console.log('Silent update failed:', err));
    }
  });

  navigator.serviceWorker.ready.then(registration => {
    // Check for updates every 60 seconds
    setInterval(() => {
      registration.update();
    }, 60000);
  });
}

window.addEventListener('hashchange', router);
window.addEventListener('load', async () => {
  setupOfflineDetection();
  await loadContent();
  router();

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.warn('Service Worker registration failed:', err);
    });
  }
});
