export const APP_CONFIG = {
  storeName: "TechPods Mtr",
  whatsappNumber: "573001234567",
  currency: "COP",
  locale: "es-CO",
  categories: [
    "Celulares",
    "Auriculares",
    "Smartwatch",
    "Tablets",
    "Parlantes",
    "Cargadores",
    "Accesorios"
  ],
  productStates: ["activo", "inactivo", "agotado"]
};

export function whatsappUrl(message) {
  return `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

