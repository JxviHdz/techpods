import { mountHeader } from "../components/header.js";
import { productCard } from "../components/productCard.js";
import { getPublicProducts } from "../services/productsService.js";
import { qs, skeletonCards } from "../utils/dom.js";

mountHeader();

async function renderHome() {
  const featured = qs("#featured-products");
  const recent = qs("#recent-products");
  featured.innerHTML = skeletonCards(4);
  recent.innerHTML = skeletonCards(4);

  try {
    const [featuredProducts, recentProducts] = await Promise.all([
      getPublicProducts({ featured: true, limit: 4 }),
      getPublicProducts({ limit: 4 })
    ]);

    featured.innerHTML = featuredProducts.length
      ? featuredProducts.map(productCard).join("")
      : `<div class="empty-state">Aun no hay productos destacados.</div>`;
    recent.innerHTML = recentProducts.length
      ? recentProducts.map(productCard).join("")
      : `<div class="empty-state">Aun no hay productos publicados.</div>`;
  } catch (error) {
    featured.innerHTML = `<div class="empty-state">No fue posible cargar los productos.</div>`;
    recent.innerHTML = "";
    console.error(error);
  }
}

renderHome();

