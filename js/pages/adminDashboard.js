import { requireAdmin } from "../services/authService.js";
import { getAdminProducts } from "../services/productsService.js";
import { mountAdminSidebar } from "../components/adminSidebar.js";
import { formatMoney } from "../utils/formatters.js";
import { qs, toast } from "../utils/dom.js";

const profile = await requireAdmin();
if (profile) {
  mountAdminSidebar(profile);
  loadMetrics();
}

async function loadMetrics() {
  try {
    const products = await getAdminProducts();
    const active = products.filter((item) => item.estado === "activo").length;
    const featured = products.filter((item) => item.destacado).length;
    const lowStock = products.filter((item) => Number(item.stock) <= 2).length;
    const inventoryValue = products.reduce((total, item) => total + Number(item.precio || 0) * Number(item.stock || 0), 0);

    qs("#metrics").innerHTML = `
      <article class="metric"><span>Total productos</span><strong>${products.length}</strong></article>
      <article class="metric"><span>Activos</span><strong>${active}</strong></article>
      <article class="metric"><span>Destacados</span><strong>${featured}</strong></article>
      <article class="metric"><span>Stock bajo</span><strong>${lowStock}</strong></article>
      <article class="metric" style="grid-column:1/-1"><span>Valor estimado de inventario</span><strong>${formatMoney(inventoryValue)}</strong></article>
    `;
  } catch (error) {
    toast(error.message, "error");
  }
}

