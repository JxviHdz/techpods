export function validateProduct(payload) {
  const errors = [];
  const required = ["nombre", "marca", "modelo", "categoria", "descripcion", "precio", "stock", "estado"];

  required.forEach((field) => {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      errors.push(`El campo ${field} es obligatorio.`);
    }
  });

  if (Number(payload.precio) <= 0) errors.push("El precio debe ser mayor a cero.");
  if (payload.precio_anterior && Number(payload.precio_anterior) < Number(payload.precio)) {
    errors.push("El precio anterior debe ser mayor o igual al precio actual.");
  }
  if (Number(payload.stock) < 0) errors.push("El stock no puede ser negativo.");
  if (payload.porcentaje_bateria && (Number(payload.porcentaje_bateria) < 0 || Number(payload.porcentaje_bateria) > 100)) {
    errors.push("El porcentaje de bateria debe estar entre 0 y 100.");
  }

  return errors;
}

export function productFormToPayload(form) {
  const data = new FormData(form);
  return {
    nombre: data.get("nombre")?.trim(),
    marca: data.get("marca")?.trim(),
    modelo: data.get("modelo")?.trim(),
    categoria: data.get("categoria"),
    descripcion: data.get("descripcion")?.trim(),
    almacenamiento: data.get("almacenamiento")?.trim() || null,
    ram: data.get("ram")?.trim() || null,
    color: data.get("color")?.trim() || null,
    porcentaje_bateria: data.get("porcentaje_bateria") ? Number(data.get("porcentaje_bateria")) : null,
    precio: Number(data.get("precio")),
    precio_anterior: data.get("precio_anterior") ? Number(data.get("precio_anterior")) : null,
    stock: Number(data.get("stock")),
    destacado: data.get("destacado") === "on",
    imagen: data.get("imagen_url")?.trim() || null,
    estado: data.get("estado")
  };
}

