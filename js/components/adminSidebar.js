import { signOut } from "../services/authService.js";
import { setActiveNav, toast } from "../utils/dom.js";

export function mountAdminSidebar(profile) {
  const sidebar = document.querySelector("#admin-sidebar");
  if (!sidebar) return;

  sidebar.innerHTML = `
    <a class="brand" href="/admin/dashboard">
      <img class="brand-logo" src="/assets/images/techpods-logo-cropped.jpeg" alt="TechPods MTR">
    </a>
    <p class="muted">${profile.email}</p>
    <nav class="admin-nav">
      <a data-nav href="/admin/dashboard">Dashboard</a>
      <a data-nav href="/admin/productos">Productos</a>
      <a href="/" target="_blank" rel="noopener">Ver tienda</a>
      <button id="logout" type="button">Cerrar sesion</button>
    </nav>
  `;

  setActiveNav();
  sidebar.querySelector("#logout").addEventListener("click", async () => {
    try {
      await signOut();
      window.location.replace("/admin/login.html");
    } catch (error) {
      toast(error.message, "error");
    }
  });
}
