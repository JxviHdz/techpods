import { signIn, getCurrentUserProfile, signOut } from "../services/authService.js";
import { qs, toast } from "../utils/dom.js";

const form = qs("#login-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submit = form.querySelector("button");
  submit.disabled = true;
  submit.textContent = "Ingresando...";

  try {
    const data = new FormData(form);
    await signIn(data.get("email"), data.get("password"));
    const profile = await getCurrentUserProfile();

    if (profile?.role !== "administrador") {
      await signOut();
      toast("Tu usuario no tiene permisos de administrador.", "error");
      return;
    }

    window.location.replace("/admin/dashboard.html");
  } catch (error) {
    toast(error.message, "error");
  } finally {
    submit.disabled = false;
    submit.textContent = "Iniciar sesion";
  }
});

