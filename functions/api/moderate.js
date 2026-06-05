// POST /api/moderate — Admin moderation (approve/reject) — protected by ADMIN_SECRET

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { admin_secret, contribution_id, action, rejection_reason } = body;

    // Auth
    if (!admin_secret || admin_secret !== env.ADMIN_SECRET) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate action
    if (!['approve', 'reject'].includes(action)) {
      return new Response(JSON.stringify({ error: 'action must be "approve" or "reject"' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If reject, reason required
    if (action === 'reject' && !rejection_reason?.trim()) {
      return new Response(JSON.stringify({ error: 'rejection_reason required for reject' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update status
    let updateStmt;
    if (action === 'approve') {
      updateStmt = env.DB.prepare(`
        UPDATE contributions
        SET status = 'approved', updated_at = datetime('now')
        WHERE id = ?
      `);
      await updateStmt.bind(contribution_id).run();
    } else {
      updateStmt = env.DB.prepare(`
        UPDATE contributions
        SET status = 'rejected', rejection_reason = ?, updated_at = datetime('now')
        WHERE id = ?
      `);
      await updateStmt.bind(rejection_reason, contribution_id).run();
    }

    // Fetch updated record
    const getStmt = env.DB.prepare('SELECT * FROM contributions WHERE id = ?');
    const result = await getStmt.bind(contribution_id).first();

    if (!result) {
      return new Response(JSON.stringify({ error: 'Contribution not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('POST /api/moderate error:', err);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
