// js/main.js — pengendali DOM (render + event)
import { DashboardApp } from "./app.js";
import { weatherLabel } from "./modules/api.js";
import { escapeHtml, formatDate, formatShortDate, daysUntil, toDateKey, toMinutes } from "./modules/utils.js";

const app = new DashboardApp();
const $ = (selector) => document.querySelector(selector);
const FORMS = { tasks: "#task-form", blocks: "#block-form", reminders: "#reminder-form", notes: "#note-form" };
const HOUR_PX = 48, DAY_START = 6, DAY_END = 22;

let selectedDate = toDateKey();
let taskFilter = "all";

const actions = (key, id) => `
  <span class="acts">
    <button data-action="edit" data-key="${key}" data-id="${id}">Ubah</button>
    <button data-action="delete" data-key="${key}" data-id="${id}">Hapus</button>
  </span>`;

// ---------- Tugas ----------
const taskHTML = ({ id, title, deadline, priority, done, isOverdue }) => `
  <li class="task ${done ? "is-done" : ""} ${isOverdue ? "is-late" : ""}" data-prio="${priority}">
    <input type="checkbox" data-action="toggle" data-key="tasks" data-id="${id}" ${done ? "checked" : ""} aria-label="Tandai selesai">
    <div><p class="item-title">${escapeHtml(title)}</p>
      <p class="meta">${isOverdue ? "Terlambat · " : ""}${formatShortDate(deadline)} · prioritas ${priority}</p></div>
    ${actions("tasks", id)}
  </li>`;

const renderTasks = () => {
  const { tasks } = app.state;
  const shown = app.sortedTasks.filter(({ done }) => taskFilter === "all" || (taskFilter === "done" ? done : !done));
  $("#task-list").innerHTML = shown.length
    ? shown.map(taskHTML).join("")
    : `<li class="empty">Belum ada tugas di sini. Tambahkan lewat formulir di atas.</li>`;
  const late = tasks.filter((t) => t.isOverdue).length;
  $("#summary").textContent = `${tasks.filter((t) => !t.done).length} tugas aktif${late ? `, ${late} terlambat` : ""}`;
};

// ---------- Jadwal (time block) ----------
const renderTimeline = () => {
  $("#day-label").textContent = formatDate(selectedDate);
  const hours = Array.from({ length: DAY_END - DAY_START }, (_, i) => DAY_START + i);
  const lanes = [];
  const blocks = app.blocksOn(selectedDate).map((b) => {
    const s = toMinutes(b.start), e = toMinutes(b.end);
    let lane = lanes.findIndex((end) => end <= s);
    if (lane === -1) lane = lanes.length;
    lanes[lane] = e;
    return { ...b, s, e, lane };
  });
  const width = 100 / Math.max(lanes.length, 1);
  const px = (min) => ((min - DAY_START * 60) / 60) * HOUR_PX;

  const grid = hours.map((h) => `<div class="hour" style="top:${px(h * 60)}px"><span>${String(h).padStart(2, "0")}.00</span></div>`).join("");
  const items = blocks.map(({ id, title, category, start, end, s, e, lane }) => `
    <article class="block" data-cat="${category}" style="top:${px(s)}px;height:${Math.max(px(e) - px(s), 24)}px;left:${lane * width}%;width:${width}%">
      <button class="block-main" data-action="edit" data-key="blocks" data-id="${id}"><strong>${escapeHtml(title)}</strong><span>${start}–${end}</span></button>
      <button class="x" data-action="delete" data-key="blocks" data-id="${id}" aria-label="Hapus ${escapeHtml(title)}">×</button>
    </article>`).join("");

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const showNow = selectedDate === toDateKey() && nowMin >= DAY_START * 60 && nowMin <= DAY_END * 60;
  $("#timeline").style.height = `${hours.length * HOUR_PX}px`;
  $("#timeline").innerHTML = `${grid}<div class="track">${items}${showNow ? `<div class="now" style="top:${px(nowMin)}px"></div>` : ""}</div>`;
};

// ---------- Tanggal penting ----------
const reminderHTML = ({ id, title, date }) => {
  const d = daysUntil(date);
  const label = d === 0 ? "Hari ini" : d > 0 ? `H-${d}` : `${Math.abs(d)} hari lalu`;
  return `<li class="rem ${d < 0 ? "is-past" : ""} ${d >= 0 && d <= 3 ? "is-soon" : ""}">
    <span class="count">${label}</span>
    <div><p class="item-title">${escapeHtml(title)}</p><p class="meta">${formatDate(date)}</p></div>
    ${actions("reminders", id)}</li>`;
};
const renderReminders = () => {
  const list = app.sortedReminders;
  $("#reminder-list").innerHTML = list.length ? list.map(reminderHTML).join("") : `<li class="empty">Belum ada tanggal penting.</li>`;
};

// ---------- Catatan ----------
const noteHTML = ({ id, title, body, tag }) => `
  <article class="note" data-tag="${tag}">
    <p class="item-title">${escapeHtml(title)}</p>
    <p>${escapeHtml(body).replace(/\n/g, "<br>")}</p>
    <p class="meta">${tag}</p>${actions("notes", id)}
  </article>`;
const renderNotes = () => {
  const { notes } = app.state;
  $("#note-list").innerHTML = notes.length ? [...notes].reverse().map(noteHTML).join("") : `<p class="empty">Belum ada catatan.</p>`;
};

const renderAll = () => { renderTasks(); renderTimeline(); renderReminders(); renderNotes(); };

// ---------- Header: jam & widget API ----------
const tick = () => {
  const now = new Date();
  $("#today").textContent = formatDate(toDateKey(now));
  $("#clock").textContent = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(now);
};

const renderWidgets = async () => {
  const { weather, quote } = await app.loadWidgets();
  if (weather.status === "fulfilled") {
    const { temperature, windspeed, weathercode } = weather.value;
    $("#weather").innerHTML = `<strong>${temperature}°C</strong> ${weatherLabel(weathercode)}<br><small>Angin ${windspeed} km/j · Kampus ITERA</small>`;
  } else {
    $("#weather").textContent = "Cuaca tidak tersedia. Periksa koneksi internet.";
  }
  if (quote.status === "fulfilled") {
    const { quote: text, author } = quote.value;
    $("#quote").innerHTML = `<blockquote>${escapeHtml(text)}</blockquote><figcaption>${escapeHtml(author)}</figcaption>`;
  } else {
    $("#quote").textContent = "Kutipan tidak tersedia.";
  }
};

// ---------- Event ----------
const startEdit = (key, item) => {
  const form = $(FORMS[key]);
  Object.entries(item).forEach(([name, value]) => {
    if (form.elements[name]) form.elements[name].value = value;
  });
  const btn = form.querySelector("[type=submit]");
  btn.dataset.label ??= btn.textContent;
  btn.textContent = "Simpan perubahan";
  form.elements.title.focus();
};

Object.entries(FORMS).forEach(([key, selector]) => {
  const form = $(selector);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const { id, ...fields } = Object.fromEntries(new FormData(form));
    if (key === "blocks") {
      if (fields.end <= fields.start) return alert("Jam selesai harus setelah jam mulai.");
      fields.date = selectedDate;
    }
    id ? app.update(key, id, fields) : app.add(key, fields);
    const btn = form.querySelector("[type=submit]");
    btn.textContent = btn.dataset.label ?? btn.textContent;
    form.reset();
    form.elements.id.value = "";
    renderAll();
  });
});

document.addEventListener("click", ({ target }) => {
  const { filter } = target.dataset;
  if (filter) {
    taskFilter = filter;
    document.querySelectorAll("#task-filter button").forEach((b) => b.setAttribute("aria-pressed", String(b === target)));
    return renderTasks();
  }
  const btn = target.closest("[data-action]");
  if (!btn) return;
  const { action, key, id } = btn.dataset;
  if (action === "toggle") app.update(key, id, { done: !app.find(key, id).done });
  if (action === "edit") return startEdit(key, app.find(key, id));
  if (action === "delete" && confirm("Hapus item ini?")) app.remove(key, id);
  renderAll();
});

$("#day-nav").addEventListener("click", ({ target }) => {
  const { step } = target.dataset;
  if (step === undefined) return;
  if (step === "0") {
    selectedDate = toDateKey();
  } else {
    const d = new Date(`${selectedDate}T00:00`);
    d.setDate(d.getDate() + Number(step));
    selectedDate = toDateKey(d);
  }
  renderTimeline();
});

const init = async () => {
  tick();
  setInterval(tick, 1000);
  setInterval(renderAll, 60000);
  renderAll();
  renderWidgets();
  await app.seedIfEmpty();
  renderAll();
};
window.__dashboardLoaded = true;
init();
