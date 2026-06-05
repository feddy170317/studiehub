// Contribution form modal/component
// Integrates into lesson-detail view, submits to POST /api/submit

const MATERIAL_TYPES = [
  { value: 'video', label: '📹 Video' },
  { value: 'podcast', label: '🎙️ Podcast' },
  { value: 'reading', label: '📖 Læsning' },
  { value: 'quiz', label: '🧪 Quiz' },
  { value: 'slides', label: '📊 Slides' },
  { value: 'exercise', label: '✏️ Opgave' },
  { value: 'link', label: '🔗 Link' },
  { value: 'note', label: '📝 Note' },
];

export function createContribForm(lessonContext) {
  // lessonContext = { education_id, semester_id, course_id, lesson_id }
  const form = document.createElement('div');
  form.className = 'contrib-form-wrapper';
  form.innerHTML = `
    <div class="contrib-modal">
      <div class="contrib-header">
        <h2>Bidrag materiale</h2>
        <button class="contrib-close">&times;</button>
      </div>
      <form class="contrib-form" id="contrib-form">
        <div class="form-group">
          <label for="cf-type">Type materiale *</label>
          <select id="cf-type" name="type" required>
            <option value="">Vælg type...</option>
            ${MATERIAL_TYPES.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label for="cf-title">Titel *</label>
          <input type="text" id="cf-title" name="title" required minlength="3" placeholder="f.eks. 'Korrosion i praksis'">
        </div>

        <div class="form-group">
          <label>Link eller Reference *</label>
          <div class="form-group-pair">
            <div>
              <label for="cf-url">URL (hvis online)</label>
              <input type="url" id="cf-url" name="url" placeholder="https://...">
            </div>
            <div>
              <label for="cf-ref">Reference (hvis bog/slide)</label>
              <input type="text" id="cf-ref" name="ref" placeholder="Callister kap. 16">
            </div>
          </div>
          <small>Brug URL hvis materiale er online, Reference hvis det er bog-kapitel, slide-ref etc.</small>
        </div>

        <div class="form-group">
          <label for="cf-note">Noter (valgfrit)</label>
          <textarea id="cf-note" name="note" rows="3" placeholder="Kort beskrivelse eller hvorfor dette materiale er brugbart..."></textarea>
        </div>

        <div class="form-group">
          <label for="cf-author">Dit navn *</label>
          <input type="text" id="cf-author" name="author" required minlength="2" placeholder="Fornavn Efternavn">
        </div>

        <div class="form-status" id="form-status"></div>

        <button type="submit" class="btn-primary">Indsend materiale</button>
      </form>
    </div>
  `;

  const closeBtn = form.querySelector('.contrib-close');
  const formEl = form.querySelector('#contrib-form');
  const statusEl = form.querySelector('#form-status');
  const urlInput = form.querySelector('#cf-url');
  const refInput = form.querySelector('#cf-ref');

  closeBtn.addEventListener('click', () => {
    form.remove();
  });

  // URL/Ref mutual exclusivity
  urlInput.addEventListener('change', () => {
    if (urlInput.value?.trim()) refInput.disabled = true;
    else refInput.disabled = false;
  });
  refInput.addEventListener('change', () => {
    if (refInput.value?.trim()) urlInput.disabled = true;
    else urlInput.disabled = false;
  });

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';

    const formData = {
      education_id: lessonContext.education_id,
      semester_id: lessonContext.semester_id,
      course_id: lessonContext.course_id,
      lesson_id: lessonContext.lesson_id,
      type: form.querySelector('#cf-type').value,
      title: form.querySelector('#cf-title').value,
      url: form.querySelector('#cf-url').value || undefined,
      ref: form.querySelector('#cf-ref').value || undefined,
      note: form.querySelector('#cf-note').value || undefined,
      author: form.querySelector('#cf-author').value,
    };

    try {
      const resp = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error?.join(', ') || 'Fejl ved indsendelse');
      }

      statusEl.innerHTML = '<div class="status-success">✓ Tak! Dit materiale er indsendt og venter på godkendelse.</div>';
      formEl.reset();
      setTimeout(() => {
        form.remove();
      }, 2000);
    } catch (err) {
      statusEl.innerHTML = `<div class="status-error">✗ Fejl: ${err.message}</div>`;
    }
  });

  return form;
}
