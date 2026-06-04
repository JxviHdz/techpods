import { whatsappUrl } from "../config/app.js";
import { mountHeader } from "../components/header.js";

mountHeader();
document.querySelector("#whatsapp-contact").href = whatsappUrl("Hola TechPods Mtr, quiero recibir asesoria sobre sus productos.");

