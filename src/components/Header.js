export const header = `
<header class="header aicha">
    <div class="logo">
        <img src="/public/images/logo.png" alt="logo">
    </div>

    <div class="search">
        <input type="text" id="searchInput" placeholder="Rechercher...">
        <i class="fa fa-search"></i>
    </div>

    <nav class="navbar" id="navbar">
        <a href="#/" id="logoHome">Home</a>
        <a href="#/Catalogue/Nouveautes">Nouveautés</a>
        <a href="#/Catalogue/Collections">Collections</a>
        <a href="#/Catalogue/VenteFlash">Vente flash</a>
        <a href="#/Catalogue/Femmes">Femmes</a>
        <a href="#/Catalogue/Hommes">Hommes</a>
    </nav>

    <div class="icons">
        <i class="fa fa-heart" id="iconFavoris"></i>
        <span class="icon-cart-wrapper" id="iconPanier">
            <i class="fa fa-shopping-cart"></i>
            <span class="badge-panier hidden" id="badgePanier">0</span>
        </span>
        <i class="fa fa-user" id="iconUser"></i>
    </div>

    <!-- Bouton hamburger (mobile) -->
    <button class="burger" id="burgerBtn" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
    </button>
</header>
`;

export function initHeader() {
    const burger = document.getElementById('burgerBtn');
    const navbar = document.getElementById('navbar');

    burger?.addEventListener('click', () => {
        navbar.classList.toggle('open');
        burger.classList.toggle('active');
    });

    // Ferme le menu quand on clique sur un lien
    navbar?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('open');
            burger.classList.remove('active');
        });
    });
}

export default header;