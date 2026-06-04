import { APP_CONFIG } from "../config/app.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderProductForm(product = {}) {
  const option = (value, selected) => `<option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(value)}</option>`;
  const field = (key) => escapeHtml(product[key] || "");

  return `
    <div class="form-grid">
      <div class="field">
        <label for="nombre">Nombre</label>
        <input class="input" id="nombre" name="nombre" value="${field("nombre")}" required>
      </div>
      <div class="field">
        <label for="marca">Marca</label>
        <input class="input" id="marca" name="marca" value="${field("marca")}" required>
      </div>
      <div class="field">
        <label for="modelo">Modelo</label>
        <input class="input" id="modelo" name="modelo" value="${field("modelo")}" required>
      </div>
      <div class="field">
        <label for="categoria">Categoria</label>
        <select class="select" id="categoria" name="categoria" required>
          <option value="">Seleccionar</option>
          ${APP_CONFIG.categories.map((item) => option(item, product.categoria)).join("")}
        </select>
      </div>
      <div class="field full">
        <label for="descripcion">Descripcion</label>
        <textarea class="textarea" id="descripcion" name="descripcion" required>${field("descripcion")}</textarea>
      </div>
      <div class="field">
        <label for="almacenamiento">Almacenamiento</label>
        <input class="input" id="almacenamiento" name="almacenamiento" value="${field("almacenamiento")}">
      </div>
      <div class="field">
        <label for="ram">RAM</label>
        <input class="input" id="ram" name="ram" value="${field("ram")}">
      </div>
      <div class="field">
        <label for="color">Color</label>
        <input class="input" id="color" name="color" value="${field("color")}">
      </div>
      <div class="field">
        <label for="porcentaje_bateria">Bateria %</label>
        <input class="input" id="porcentaje_bateria" name="porcentaje_bateria" type="number" min="0" max="100" value="${product.porcentaje_bateria || ""}">
      </div>
      <div class="field">
        <label for="precio">Precio</label>
        <input class="input" id="precio" name="precio" type="number" min="1" value="${product.precio || ""}" required>
      </div>
      <div class="field">
        <label for="precio_anterior">Precio anterior</label>
        <input class="input" id="precio_anterior" name="precio_anterior" type="number" min="0" value="${product.precio_anterior || ""}">
      </div>
      <div class="field">
        <label for="stock">Stock</label>
        <input class="input" id="stock" name="stock" type="number" min="0" value="${product.stock ?? 0}" required>
      </div>
      <div class="field">
        <label for="estado">Estado</label>
        <select class="select" id="estado" name="estado" required>
          ${APP_CONFIG.productStates.map((item) => option(item, product.estado || "activo")).join("")}
        </select>
      </div>
      <div class="field">
        <label for="imagen">Subir imagen</label>
        <input class="input" id="imagen" name="imagen" type="file" accept="image/*">
      </div>
      <div class="field">
        <label for="imagen_url">URL de imagen</label>
        <input class="input" id="imagen_url" name="imagen_url" value="${field("imagen")}">
      </div>
      <label class="field full" style="display:flex;align-items:center;gap:10px">
        <input type="checkbox" name="destacado" ${product.destacado ? "checked" : ""}>
        Marcar como destacado
      </label>
    </div>
    <div class="form-actions">
      <button class="btn btn-primary" type="submit">Guardar producto</button>
      <a class="btn btn-secondary" href="/admin/productos">Cancelar</a>
    </div>
  `;
}
