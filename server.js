// server.js — lance json-server avec persistance GitHub
// Utilise l'API interne de json-server (pas Express)

import { existsSync, readFileSync, writeFileSync, createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSONFile } from 'lowdb/node';
import { Low } from 'lowdb';
import { createApp } from 'json-server/lib/app.js';
import { NormalizedAdapter } from 'json-server/lib/adapters/normalized-adapter.js';
import { Observer } from 'json-server/lib/adapters/observer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH   = path.join(__dirname, 'db.json');
const PORT      = parseInt(process.env.PORT ?? '3000');

// ── GitHub persistence ────────────────────────────────────────────────────────
const GITHUB_TOKEN     = process.env.GITHUB_TOKEN;
const GITHUB_REPO      = process.env.GITHUB_REPO;
const GITHUB_BRANCH    = process.env.GITHUB_BRANCH    || 'main';
const GITHUB_FILE_PATH = process.env.GITHUB_FILE_PATH || 'db.json';

let saving = false;
async function saveToGitHub() {
  if (!GITHUB_TOKEN || !GITHUB_REPO) return;
  if (saving) return;
  saving = true;
  try {
    const content = readFileSync(DB_PATH, 'utf-8');
    const encoded = Buffer.from(content).toString('base64');
    const getRes  = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}?ref=${GITHUB_BRANCH}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'trendywear' } }
    );
    const { sha } = await getRes.json();
    await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
      {
        method: 'PUT',
        headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': 'trendywear' },
        body: JSON.stringify({ message: 'chore: auto-save db.json', content: encoded, sha, branch: GITHUB_BRANCH })
      }
    );
    console.log('[GitHub] db.json sauvegardé ✓');
  } catch (err) {
    console.error('[GitHub] Erreur:', err.message);
  } finally {
    saving = false;
  }
}

// ── Lancer json-server ────────────────────────────────────────────────────────
const adapter  = new JSONFile(DB_PATH);
const observer = new Observer(new NormalizedAdapter(adapter));
const db       = new Low(observer, {});
await db.read();

// Sauvegarde GitHub à chaque écriture du db
observer.onWriteEnd = () => setTimeout(saveToGitHub, 500);

const app = createApp(db, { logger: false, static: ['.'] });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TrendyWear démarré sur le port ${PORT} ✓`);
});