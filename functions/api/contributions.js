// GET /api/contributions?lesson=<lesson_id> — Fetch approved contributions (frontend)

export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const lessonId = url.searchParams.get('lesson');

    if (!lessonId?.trim()) {
      return new Response(JSON.stringify({ error: 'lesson query param required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stmt = env.DB.prepare(`
      SELECT id, type, title, url, ref, note, author, created_at
      FROM contributions
      WHERE lesson_id = ? AND status = 'approved'
      ORDER BY created_at DESC
    `);

    const results = await stmt.bind(lessonId).all();

    return new Response(JSON.stringify(results.results || []), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=300', // Cache 5 min
      },
    });
  } catch (err) {
    console.error('GET /api/contributions error:', err);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
