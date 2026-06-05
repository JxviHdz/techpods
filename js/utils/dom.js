export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function qsa(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

export function setActiveNav() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  qsa("[data-nav]").forEach((link) => {
    const href = link.getAttribute("href")?.replace(/\/$/, "") || "/";
    if (href === path) link.setAttribute("aria-current", "page");
  });
}

export function toast(message, type = "info") {
  let host = qs(".toast-host");
  if (!host) {
    host = document.createElement("div");
    host.className = "toast-host";
    document.body.append(host);
  }

  const item = document.createElement("div");
  item.className = "toast";
  item.style.borderLeftColor = type === "error" ? "var(--danger)" : type === "success" ? "var(--success)" : "var(--primary)";
  item.textContent = message;
  host.append(item);
  setTimeout(() => item.remove(), 3800);
}

export function skeletonCards(count = 8) {
  return Array.from({ length: count }, () => `
    <article class="product-card">
      <div class="product-media skeleton"></div>
      <div class="product-body">
        <div class="skeleton" style="height:18px;width:68%"></div>
        <div class="skeleton" style="height:14px;width:42%"></div>
        <div class="skeleton" style="height:22px;width:56%"></div>
      </div>
    </article>
  `).join("");
}

export function getRouteId() {
  const queryId = new URLSearchParams(window.location.search).get("id");
  if (queryId) return queryId;

  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts.at(-1);
}
