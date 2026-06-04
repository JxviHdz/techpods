import { whatsappUrl } from "../config/app.js";
import { mountHeader } from "../components/header.js";
import { getProductById } from "../services/productsService.js";
import { formatMoney, compactText } from "../utils/formatters.js";
import { getRouteId, qs } from "../utils/dom.js";
import { escapeHtml, safeUrl } from "../utils/sanitize.js";

mountHeader();

const target = qs("#product-detail");
const fallback = "/assets/images/product-placeholder.svg";

function spec(label, value) {
  return `<div class="spec"><span>${escapeHtml(label)}</span><strong>${escapeHtml(compactText(value))}</strong></div>`;
}

async function renderProduct() {
  target.innerHTML = `
    <div class="detail-layout">
      <div class="detail-media skeleton"></div>
      <section>
        <div class="skeleton" style="height:24px;width:30%;margin-bottom:12px"></div>
        <div class="skeleton" style="height:54px;width:80%;margin-bottom:16px"></div>
        <div class="skeleton" style="height:20px;width:60%"></div>
      </section>
    </div>
  `;

  try {
    const product = await getProductById(getRouteId());
    const message = `Hola TechPods Mtr, me interesa el producto ${product.nombre} ${product.marca} ${product.modelo}.`;
    document.title = `${product.nombre} | TechPods Mtr`;
    const image = safeUrl(product.imagen, fallback);
    target.innerHTML = `
      <div class="detail-layout">
        <div class="detail-media">
          <img src="${image}" alt="${escapeHtml(product.nombre)}" loading="eager">
        </div>
        <section>
          <span class="eyebrow">${escapeHtml(product.categoria)}</span>
          <h1>${escapeHtml(product.nombre)}</h1>
          <p class="muted">${escapeHtml(product.descripcion)}</p>
          <div class="price-row">
            <span class="price">${formatMoney(product.precio)}</span>
            ${product.precio_anterior ? `<span class="old-price">${formatMoney(product.precio_anterior)}</span>` : ""}
          </div>
          <div class="spec-grid">
            ${spec("Marca", product.marca)}
            ${spec("Modelo", product.modelo)}
            ${spec("Almacenamiento", product.almacenamiento)}
            ${spec("RAM", product.ram)}
            ${spec("Color", product.color)}
            ${spec("Bateria", product.porcentaje_bateria ? `${product.porcentaje_bateria}%` : null)}
          </div>
          <div class="hero-actions">
            <a class="btn btn-primary" href="${whatsappUrl(message)}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
            <a class="btn btn-secondary" href="/productos">Volver al catalogo</a>
          </div>
        </section>
      </div>
    `;
  } catch (error) {
    target.innerHTML = `<div class="empty-state">No encontramos este producto o ya no esta disponible.</div>`;
    console.error(error);
  }
}

renderProduct();
