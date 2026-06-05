export const APP_CONFIG = {
  storeName: "TechPods MTR",
  whatsappNumber: "573216948882",
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
