// POST /api/submit — Submit a new contribution (user-facing)

const VALID_TYPES = ['quiz', 'video', 'podcast', 'reading', 'slides', 'exercise', 'link', 'note'];

function generateId() {
  return Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 14);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const {
      education_id, semester_id, course_id, lesson_id,
      type, title, url, ref, note, author,
    } = body;

    // Validation
    const errors = [];
    if (!education_id?.trim()) errors.push('education_id required');
    if (!semester_id?.trim()) errors.push('semester_id required');
    if (!course_id?.trim()) errors.push('course_id required');
    if (!lesson_id?.trim()) errors.push('lesson_id required');
    if (!type?.trim() || !VALID_TYPES.includes(type)) {
      errors.push(`type must be one of: ${VALID_TYPES.join(', ')}`);
    }
    if (!title?.trim() || title.length < 3) errors.push('title required (min 3 chars)');
    if (!author?.trim() || author.length < 2) errors.push('author required (min 2 chars)');

    const hasUrl = url?.trim();
    const hasRef = ref?.trim();
    if (!hasUrl && !hasRef) errors.push('url or ref required (at least one)');
    if (hasUrl && hasRef) errors.push('url and ref mutually exclusive (pick one)');

    if (errors.length > 0) {
      return new Response(JSON.stringify({ error: errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert into D1
    const id = generateId();
    const stmt = env.DB.prepare(`
      INSERT INTO contributions (
        id, education_id, semester_id, course_id, lesson_id,
        type, title, url, ref, note, author, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'), datetime('now'))
    `);

    await stmt.bind(
      id, education_id, semester_id, course_id, lesson_id,
      type, title, hasUrl ? url : null, hasRef ? ref : null,
      note || null, author
    ).run();

    return new Response(JSON.stringify({
      id,
      status: 'pending',
      message: 'Tak! Dit materiale venter på godkendelse. Du får besked når det er godkendt.',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('POST /api/submit error:', err);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
