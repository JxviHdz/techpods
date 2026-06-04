import { APP_CONFIG } from "../config/app.js";

export function formatMoney(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat(APP_CONFIG.locale, {
    style: "currency",
    currency: APP_CONFIG.currency,
    maximumFractionDigits: 0
  }).format(number);
}

export function formatDate(value) {
  return new Intl.DateTimeFormat(APP_CONFIG.locale, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function compactText(value, fallback = "No especificado") {
  return value === null || value === undefined || value === "" ? fallback : value;
}

