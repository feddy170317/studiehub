// Admin moderation dashboard (/admin)
// Password-protected by ADMIN_SECRET

let adminSecret = null;
let contributions = [];

document.addEventListener('DOMContentLoaded', async () => {
  const app = document.getElementById('admin-app');

  // Check if already logged in (session storage)
  const stored = sessionStorage.getItem('admin-secret');
  if (stored) {
    adminSecret = stored;
    await loadPendingContributions();
  } else {
    showLoginScreen();
  }

  function showLoginScreen() {
    app.innerHTML = `
      <div class="admin-login">
        <h1>📋 Administrationspanel</h1>
        <form id="login-form">
          <div class="form-group">
            <label for="secret">Admin-adgangskode</label>
            <input type="password" id="secret" required>
          </div>
          <button type="submit" class="btn-primary">Login</button>
        </form>
        <p class="admin-info">Adgangskoden er din ADMIN_SECRET fra Cloudflare-miljøvariablerne.</p>
      </div>
    `;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      adminSecret = document.getElementById('secret').value;
      sessionStorage.setItem('admin-secret', adminSecret);
      await loadPendingContributions();
    });
  }

  async function loadPendingContributions() {
    // Note: This is a simplified view — in reality you'd need a /api/pending endpoint
    // For now, we'll fetch from a custom admin endpoint
    try {
      const resp = await fetch('/api/admin/pending', {
        headers: { 'X-Admin-Secret': adminSecret },
      });

      if (resp.status === 401) {
        sessionStorage.removeItem('admin-secret');
        adminSecret = null;
        showLoginScreen();
        return;
      }

      if (!resp.ok) throw new Error('Failed to load contributions');

      contributions = await resp.json();
      renderContributions();
    } catch (err) {
      app.innerHTML = `<div class="admin-error">Fejl: ${err.message}</div>`;
    }
  }

  function renderContributions() {
    if (contributions.length === 0) {
      app.innerHTML = `
        <div class="admin-panel">
          <h1>📋 Godkendelser</h1>
          <p>Ingen igangværende bidrag.</p>
          <button onclick="location.reload()" class="btn-secondary">Genindlæs</button>
          <button onclick="sessionStorage.removeItem('admin-secret'); location.reload();" class="btn-secondary">Log ud</button>
        </div>
      `;
      return;
    }

    app.innerHTML = `
      <div class="admin-panel">
        <div class="admin-header">
          <h1>📋 Godkendelser (${contributions.length})</h1>
          <button onclick="sessionStorage.removeItem('admin-secret'); location.reload();" class="btn-secondary">Log ud</button>
        </div>
        <table class="contrib-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Titel</th>
              <th>Forfatter</th>
              <th>Fag</th>
              <th>Link/Ref</th>
              <th>Handling</th>
            </tr>
          </thead>
          <tbody id="contrib-body">
          </tbody>
        </table>
      </div>
    `;

    const tbody = document.getElementById('contrib-body');
    contributions.forEach(c => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${c.type}</td>
        <td>${c.title}</td>
        <td>${c.author}</td>
        <td>${c.course_id}</td>
        <td>${c.url ? `<a href="${c.url}" target="_blank">URL</a>` : c.ref}</td>
        <td>
          <button class="btn-approve" onclick="approveContrib('${c.id}')">✓ Godkend</button>
          <button class="btn-reject" onclick="rejectContrib('${c.id}')">✗ Afvis</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Make functions global
    window.approveContrib = approveContrib;
    window.rejectContrib = rejectContrib;
  }

  async function approveContrib(id) {
    try {
      const resp = await fetch('/api/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_secret: adminSecret,
          contribution_id: id,
          action: 'approve',
        }),
      });

      if (!resp.ok) throw new Error('Failed to approve');
      contributions = contributions.filter(c => c.id !== id);
      renderContributions();
    } catch (err) {
      alert(`Fejl: ${err.message}`);
    }
  }

  async function rejectContrib(id) {
    const reason = prompt('Afvisningsgrund:');
    if (!reason) return;

    try {
      const resp = await fetch('/api/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_secret: adminSecret,
          contribution_id: id,
          action: 'reject',
          rejection_reason: reason,
        }),
      });

      if (!resp.ok) throw new Error('Failed to reject');
      contributions = contributions.filter(c => c.id !== id);
      renderContributions();
    } catch (err) {
      alert(`Fejl: ${err.message}`);
    }
  }
});
