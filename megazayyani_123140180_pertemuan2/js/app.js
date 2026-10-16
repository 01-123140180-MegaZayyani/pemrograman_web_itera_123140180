// js/app.js — logika aplikasi: state, localStorage, fetch data eksternal
import { TaskItem, TimeBlock, Reminder, Note } from "./modules/models.js";
import { toDateKey, toMinutes } from "./modules/utils.js";
import * as api from "./modules/api.js";

const STORAGE_KEY = "personal-dashboard-v1";
const MODELS = { tasks: TaskItem, blocks: TimeBlock, reminders: Reminder, notes: Note };

export class DashboardApp {
  constructor() {
    this.state = this.#load();
  }

  #load() {
    let raw = {};
    try {
      raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
      raw = {};
    }
    const state = { seeded: Boolean(raw.seeded) };
    for (const [key, Model] of Object.entries(MODELS)) {
      state[key] = (raw[key] ?? []).map((item) => new Model(item));
    }
    return state;
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  // --- CRUD: array state selalu dibuat baru (immutable) dengan spread ---
  add(key, data) {
    const item = new MODELS[key](data);
    this.state = { ...this.state, [key]: [...this.state[key], item] };
    this.save();
    return item;
  }

  update(key, id, changes) {
    const list = this.state[key].map((item) => (item.id === id ? new MODELS[key]({ ...item, ...changes }) : item));
    this.state = { ...this.state, [key]: list };
    this.save();
  }

  remove(key, id) {
    this.state = { ...this.state, [key]: this.state[key].filter((item) => item.id !== id) };
    this.save();
  }

  find(key, id) {
    return this.state[key].find((item) => item.id === id);
  }

  // --- data turunan ---
  get sortedTasks() {
    const time = ({ deadline }) => new Date(deadline || "9999-12-31").getTime();
    return [...this.state.tasks].sort((a, b) => a.done - b.done || time(a) - time(b));
  }

  blocksOn(date) {
    return this.state.blocks.filter((b) => b.date === date).sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
  }

  get sortedReminders() {
    return [...this.state.reminders].sort((a, b) => a.date.localeCompare(b.date));
  }

  // --- async: ambil data API publik ---
  async seedIfEmpty() {
    if (this.state.seeded) return;
    try {
      const seeds = await api.fetchSeedTodos();
      seeds.forEach(({ title, done }, i) => {
        const deadline = toDateKey(new Date(Date.now() + (i + 1) * 86400000));
        this.add("tasks", { title, done, deadline });
      });
      this.state = { ...this.state, seeded: true };
      this.save();
    } catch (err) {
      console.warn("Seed tugas gagal, coba lagi saat dimuat ulang:", err.message);
    }
  }

  async loadWidgets() {
    const [weather, quote] = await Promise.allSettled([api.fetchWeather(), api.fetchQuote()]);
    return { weather, quote };
  }
}
