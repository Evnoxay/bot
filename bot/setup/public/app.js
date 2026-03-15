async function refresh() {
  const preview = await fetch('/api/preview').then((r) => r.json());
  document.getElementById('preview').textContent = JSON.stringify(preview, null, 2);

  const logs = await fetch('/api/logs').then((r) => r.json());
  document.getElementById('logs').textContent = logs.map((l) => `[${l.ts}] ${l.message}`).join('\n');
}

document.getElementById('setup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = Object.fromEntries(fd.entries());
  payload.DEBUG = e.target.DEBUG.checked ? 'true' : 'false';
  const res = await fetch('/api/setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  alert(json.ok ? 'Configuration enregistrée.' : `Erreur: ${(json.errors || [json.error]).join(', ')}`);
  refresh();
});

setInterval(refresh, 2000);
refresh();
