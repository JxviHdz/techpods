export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function safeUrl(value, fallback = "/assets/images/product-placeholder.svg") {
  const text = String(value || "");
  if (!text) return fallback;
  try {
    const url = new URL(text, window.location.origin);
    if (["http:", "https:"].includes(url.protocol) || url.origin === window.location.origin) return text;
  } catch {
    if (text.startsWith("/")) return text;
  }
  return fallback;
}

