import { APP_CONFIG } from "../config/app.js";
import { mountHeader } from "../components/header.js";
import { productCard } from "../components/productCard.js";
import { getPublicProducts } from "../services/productsService.js";
import { qs, skeletonCards } from "../utils/dom.js";

mountHeader();

const grid = qs("#products-grid");
const search = qs("#search");
const category = qs("#category");
const count = qs("#result-count");
const clear = qs("#clear-filters");
let debounce;

category.innerHTML = `<option value="">Todas las categorias</option>${APP_CONFIG.categories
  .map((item) => `<option value="${item}">${item}</option>`)
  .join("")}`;

async function loadProducts() {
  grid.innerHTML = skeletonCards(8);
  count.textContent = "Cargando productos...";

  try {
    const products = await getPublicProducts({
      search: search.value,
      category: category.value
    });
    count.textContent = `${products.length} producto${products.length === 1 ? "" : "s"} encontrado${products.length === 1 ? "" : "s"}`;
    grid.innerHTML = products.length
      ? products.map(productCard).join("")
      : `<div class="empty-state">No hay productos que coincidan con la busqueda.</div>`;
  } catch (error) {
    grid.innerHTML = `<div class="empty-state">No fue posible cargar el catalogo.</div>`;
    count.textContent = "Error de carga";
    console.error(error);
  }
}

search.addEventListener("input", () => {
  window.clearTimeout(debounce);
  debounce = window.setTimeout(loadProducts, 250);
});
category.addEventListener("change", loadProducts);
clear.addEventListener("click", () => {
  search.value = "";
  category.value = "";
  loadProducts();
});

loadProducts();

