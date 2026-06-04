import { requireAdmin } from "../services/authService.js";
import { createProduct, getProductById, updateProduct, uploadProductImage } from "../services/productsService.js";
import { mountAdminSidebar } from "../components/adminSidebar.js";
import { renderProductForm } from "../components/productForm.js";
import { getRouteId, qs, toast } from "../utils/dom.js";
import { productFormToPayload, validateProduct } from "../utils/validators.js";

const profile = await requireAdmin();
const form = qs("#product-form");
const mode = form.dataset.mode;
let productId = null;

if (profile) {
  mountAdminSidebar(profile);
  boot();
}

async function boot() {
  try {
    if (mode === "edit") {
      productId = getRouteId();
      const product = await getProductById(productId, true);
      form.innerHTML = renderProductForm(product);
    } else {
      form.innerHTML = renderProductForm();
    }
  } catch (error) {
    form.innerHTML = `<div class="empty-state">No fue posible cargar el formulario.</div>`;
    toast(error.message, "error");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button[type='submit']");
  const file = form.imagen.files[0];
  button.disabled = true;
  button.textContent = "Guardando...";

  try {
    const payload = productFormToPayload(form);
    if (file) payload.imagen = await uploadProductImage(file);

    const errors = validateProduct(payload);
    if (errors.length) {
      errors.forEach((error) => toast(error, "error"));
      return;
    }

    if (mode === "edit") {
      await updateProduct(productId, payload);
      toast("Producto actualizado.", "success");
    } else {
      await createProduct(payload);
      toast("Producto creado.", "success");
    }

    window.location.href = "/admin/productos";
  } catch (error) {
    toast(error.message, "error");
  } finally {
    button.disabled = false;
    button.textContent = "Guardar producto";
  }
});

