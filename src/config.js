// json-server gère uniquement l'API (db.json). Le front (index.html, src/, public/)
// continue d'être servi à part : Live Server en local (port 5501 déjà configuré
// dans .vscode/settings.json), un hébergeur statique (Vercel, Netlify...) en ligne.
// json-server active CORS par défaut, donc les appels cross-origin fonctionnent.
//
// En local  : npm run dev  -> json-server écoute sur http://localhost:3000
// En ligne  : npm start    -> json-server écoute sur le PORT donné par l'hébergeur (ex. Render)
//             Remplace l'URL ci-dessous par celle de ton service une fois déployé.



// En local  : npm run dev  -> json-server sur http://localhost:3000
// En ligne  : npm start    -> json-server sur Render (sert aussi le front via --static .)
//
// Sur Render, le front ET l'API sont sur la même URL → pas de CORS.
// Le middleware.js sauvegarde db.json sur GitHub après chaque modification.

export const API_BASE =
    (window.location.hostname === 'localhost' ||
     window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3000'
        : '';  // même origine sur Render → URL relative