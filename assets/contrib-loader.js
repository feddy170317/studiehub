// Load and display approved contributions in lesson detail view

export async function loadApprovedContributions(lessonId) {
  try {
    const resp = await fetch(`/api/contributions?lesson=${lessonId}`);
    if (!resp.ok) return [];
    return await resp.json();
  } catch (err) {
    console.error('Failed to load contributions:', err);
    return [];
  }
}

export function renderContributionsSection(contributions) {
  if (!contributions || contributions.length === 0) {
    return null;
  }

  const section = document.createElement('div');
  section.className = 'approved-contributions';
  section.innerHTML = `<h3>📚 Fra studiet (bidrag)</h3>`;

  contributions.forEach(c => {
    const item = document.createElement('div');
    item.className = 'contrib-item';

    const typeEmoji = {
      quiz: '🧪',
      video: '📹',
      podcast: '🎙️',
      reading: '📖',
      slides: '📊',
      exercise: '✏️',
      link: '🔗',
      note: '📝',
    }[c.type] || '📄';

    item.innerHTML = `
      <span class="contrib-item-type">${typeEmoji} ${c.type}</span>
      <div class="contrib-item-title">${c.title}</div>
      ${c.note ? `<div class="contrib-item-note">${c.note}</div>` : ''}
      <div class="contrib-item-meta">— ${c.author}</div>
      ${c.url ? `<div class="contrib-item-link"><a href="${c.url}" target="_blank">Åbn →</a></div>` : ''}
      ${c.ref ? `<div class="contrib-item-ref"><small>${c.ref}</small></div>` : ''}
    `;

    section.appendChild(item);
  });

  return section;
}

export async function appendContributionsToLesson(lessonElement, lessonId) {
  const contributions = await loadApprovedContributions(lessonId);
  const section = renderContributionsSection(contributions);
  if (section) {
    lessonElement.appendChild(section);
  }
}
