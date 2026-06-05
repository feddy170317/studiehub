// GET /api/admin/pending — Fetch pending contributions for moderation (admin-only)

export async function onRequestGet(context) {
  const { request, env } = context;

  // Simple header-based auth
  const adminSecret = request.headers.get('X-Admin-Secret');
  if (!adminSecret || adminSecret !== env.ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const stmt = env.DB.prepare(`
      SELECT *
      FROM contributions
      WHERE status = 'pending'
      ORDER BY created_at ASC
    `);

    const results = await stmt.all();

    return new Response(JSON.stringify(results.results || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('GET /api/admin/pending error:', err);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
