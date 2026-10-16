// js/modules/models.js — model data berbasis class
import { uid } from "./utils.js";

class Item {
  constructor({ id }) {
    this.id = id ?? uid();
  }
}

export class TaskItem extends Item {
  constructor({ id, title, deadline = "", priority = "sedang", done = false }) {
    super({ id });
    Object.assign(this, { title, deadline: deadline.slice(0, 10), priority, done: done === true || done === "true" });
  }
  get isOverdue() {
    // terlambat jika tanggal tenggat sudah lewat (tenggat hari ini belum terlambat)
    return !this.done && Boolean(this.deadline) && new Date(`${this.deadline}T23:59:59`) < new Date();
  }
}

export class TimeBlock extends Item {
  constructor({ id, title, date, start, end, category = "kuliah" }) {
    super({ id });
    Object.assign(this, { title, date, start, end, category });
  }
}

export class Reminder extends Item {
  constructor({ id, title, date }) {
    super({ id });
    Object.assign(this, { title, date });
  }
}

export class Note extends Item {
  constructor({ id, title, body = "", tag = "kuliah" }) {
    super({ id });
    Object.assign(this, { title, body, tag });
  }
}
