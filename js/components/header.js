import { setActiveNav } from "../utils/dom.js";

export function mountHeader(target = "#site-header") {
  const node = document.querySelector(target);
  if (!node) return;

  node.innerHTML = `
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="/" aria-label="TechPods Mtr inicio">
          <span class="brand-mark">T</span>
          <span>TechPods Mtr</span>
        </a>
        <nav class="nav-links" aria-label="Navegacion principal">
          <a data-nav href="/">Inicio</a>
          <a data-nav href="/productos">Productos</a>
          <a data-nav href="/contacto">Contacto</a>
          <a data-nav href="/admin/login">Admin</a>
        </nav>
      </div>
    </header>
  `;

  setActiveNav();
}

