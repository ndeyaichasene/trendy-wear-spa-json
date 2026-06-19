// middleware.js
// Après chaque POST / PUT / PATCH / DELETE,
// on pousse le db.json mis à jour sur GitHub → persistance garantie.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'db.json');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO  = process.env.GITHUB_REPO;   // ex: "aicha/trendywear-spa"
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const GITHUB_FILE_PATH = process.env.GITHUB_FILE_PATH || 'db.json';

let saving = false;

async function saveToGitHub() {
  if (!GITHUB_TOKEN || !GITHUB_REPO) return; // en local, on ne fait rien

  if (saving) return; // évite les appels simultanés
  saving = true;

  try {
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    const encoded = Buffer.from(content).toString('base64');

    // 1. Récupère le SHA actuel du fichier (nécessaire pour le PUT)
    const getRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}?ref=${GITHUB_BRANCH}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'trendywear' } }
    );
    const getJson = await getRes.json();
    const sha = getJson.sha;

    // 2. Push le nouveau contenu
    await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'trendywear'
        },
        body: JSON.stringify({
          message: 'chore: auto-save db.json',
          content: encoded,
          sha,
          branch: GITHUB_BRANCH
        })
      }
    );

    console.log('[GitHub] db.json sauvegardé ✓');
  } catch (err) {
    console.error('[GitHub] Erreur sauvegarde:', err.message);
  } finally {
    saving = false;
  }
}

// Middleware json-server : intercepte les requêtes qui modifient les données
export default (req, res, next) => {
  const method = req.method;
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    // On laisse json-server traiter la requête, puis on sauvegarde
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      originalJson(data);
      // Petit délai pour que json-server finisse d'écrire le fichier
      setTimeout(saveToGitHub, 500);
    };
  }
  next();
};