import { initRouter } from './router.js';
import { header, initHeader } from './components/Header.js';
import './auth.js';

// Injecte le header une seule fois
document.getElementById('header-root').innerHTML = header;
initHeader();

initRouter();