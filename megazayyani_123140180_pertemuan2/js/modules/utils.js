// js/modules/utils.js — fungsi pembantu (arrow functions)
const pad = (n) => String(n).padStart(2, "0");

export const uid = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const toDateKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const formatDate = (dateStr) =>
  new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    .format(new Date(`${dateStr}T00:00`));

export const formatShortDate = (iso) =>
  iso
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${iso.slice(0, 10)}T00:00`))
    : "Tanpa tenggat";

export const daysUntil = (dateStr) =>
  Math.round((new Date(`${dateStr}T00:00`) - new Date(`${toDateKey()}T00:00`)) / 86400000);

// Cegah XSS saat data pengguna dirender lewat template literal
export const escapeHtml = (text = "") =>
  String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);