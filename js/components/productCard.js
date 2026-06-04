import { formatMoney } from "../utils/formatters.js";
import { escapeHtml, safeUrl } from "../utils/sanitize.js";

const FALLBACK_IMAGE = "/assets/images/product-placeholder.svg";

export function productCard(product) {
  const oldPrice = product.precio_anterior
    ? `<span class="old-price">${formatMoney(product.precio_anterior)}</span>`
    : "";
  const badge = product.destacado ? `<span class="badge">Destacado</span>` : "";
  const image = safeUrl(product.imagen, FALLBACK_IMAGE);
  const name = escapeHtml(product.nombre);
  const brand = escapeHtml(product.marca);
  const model = escapeHtml(product.modelo);

  return `
    <article class="product-card">
      <a class="product-media" href="/producto/${product.id}" aria-label="Ver ${name}">
        <img src="${image}" alt="${name}" loading="lazy">
      </a>
      <div class="product-body">
        ${badge}
        <p class="product-meta">${brand} ${model}</p>
        <h3 class="product-title">${name}</h3>
        <div class="price-row">
          <span class="price">${formatMoney(product.precio)}</span>
          ${oldPrice}
        </div>
        <a class="btn btn-secondary" href="/producto/${product.id}">Ver detalle</a>
      </div>
    </article>
  `;
}
