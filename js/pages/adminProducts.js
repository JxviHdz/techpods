import { requireAdmin } from "../services/authService.js";
import { deleteProduct, getAdminProducts } from "../services/productsService.js";
import { mountAdminSidebar } from "../components/adminSidebar.js";
import { formatMoney } from "../utils/formatters.js";
import { qs, toast } from "../utils/dom.js";
import { escapeHtml, safeUrl } from "../utils/sanitize.js";

const profile = await requireAdmin();
let products = [];

if (profile) {
  mountAdminSidebar(profile);
  loadProducts();
}

function row(product) {
  return `
    <tr>
      <td><img class="thumb" src="${safeUrl(product.imagen)}" alt="${escapeHtml(product.nombre)}"></td>
      <td>
        <strong>${escapeHtml(product.nombre)}</strong>
        <div class="muted">${escapeHtml(product.marca)} ${escapeHtml(product.modelo)}</div>
        ${product.destacado ? `<span class="badge">Destacado</span>` : ""}
      </td>
      <td>${escapeHtml(product.categoria)}</td>
      <td>${formatMoney(product.precio)}</td>
      <td>${product.stock}</td>
      <td>${escapeHtml(product.estado)}</td>
      <td>
        <div class="admin-actions">
          <a class="btn btn-secondary" href="/admin/productos/editar/${product.id}">Editar</a>
          <button class="btn btn-danger" data-delete="${product.id}" type="button">Eliminar</button>
        </div>
      </td>
    </tr>
  `;
}

function render(list = products) {
  qs("#products-table").innerHTML = list.length
    ? list.map(row).join("")
    : `<tr><td colspan="7" class="muted">No hay productos.</td></tr>`;
}

async function loadProducts() {
  try {
    products = await getAdminProducts();
    render();
  } catch (error) {
    toast(error.message, "error");
  }
}

qs("#admin-search").addEventListener("input", (event) => {
  const term = event.target.value.toLowerCase();
  render(products.filter((item) => `${item.nombre} ${item.marca} ${item.modelo}`.toLowerCase().includes(term)));
});

qs("#products-table").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  const product = products.find((item) => item.id === button.dataset.delete);
  const ok = window.confirm(`Eliminar ${product?.nombre || "este producto"}? Esta accion no se puede deshacer.`);
  if (!ok) return;

  try {
    await deleteProduct(button.dataset.delete);
    toast("Producto eliminado.", "success");
    await loadProducts();
  } catch (error) {
    toast(error.message, "error");
  }
});
