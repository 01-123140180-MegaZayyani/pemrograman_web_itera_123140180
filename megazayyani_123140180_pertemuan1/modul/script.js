/* ============ LATIHAN 1 ============ */
(function () {
  // $("x") mengambil elemen dengan id "l1-x"
  const $ = (id) => document.getElementById("l1-" + id);

// 1. Data diri: const untuk nilai tetap, let untuk nilai yang bisa berubah
const namaLengkap = "Mega Zayyani";
const kotaAsal = "Jakarta";
let umurSaya = 21;
$("data-diri").textContent = `Nama: ${namaLengkap}\nUmur: ${umurSaya}\nKota asal: ${kotaAsal}`;

// 2. Kelulusan (nilai >= 70)
function cekKelulusan(nilai) {
  if (nilai >= 70) {
    return "Lulus";
  }
  return "Tidak Lulus";
}

// 3. Kategori umur: anak <12, remaja 12-17, dewasa 18-59, lansia >=60
function kategoriUmur(umur) {
  if (umur < 12) return "Anak";
  if (umur <= 17) return "Remaja";
  if (umur <= 59) return "Dewasa";
  return "Lansia";
}

// 4. Switch-case: angka hari (1-7) -> nama hari bahasa Inggris
function namaHariInggris(angka) {
  switch (angka) {
    case 1: return "Monday";
    case 2: return "Tuesday";
    case 3: return "Wednesday";
    case 4: return "Thursday";
    case 5: return "Friday";
    case 6: return "Saturday";
    case 7: return "Sunday";
    default: return "Hari tidak valid (isi 1-7)";
  }
}

// 5. Grade dengan ternary operator bertingkat
const hitungGrade = (nilai) =>
  nilai >= 90 ? "A" : nilai >= 80 ? "B" : nilai >= 70 ? "C" : nilai >= 60 ? "D" : "E";

$("btn-proses").addEventListener("click", function () {
  const nilai = parseFloat($("nilai").value);
  const umur = parseInt($("umur").value, 10);
  const hari = parseInt($("hari").value, 10);
  const baris = [];

  if (!isNaN(nilai)) {
    baris.push(`Nilai ${nilai}: ${cekKelulusan(nilai)}, Grade ${hitungGrade(nilai)}`);
  }
  if (!isNaN(umur)) {
    baris.push(`Umur ${umur}: ${kategoriUmur(umur)}`);
  }
  if (!isNaN(hari)) {
    baris.push(`Hari ke-${hari}: ${namaHariInggris(hari)}`);
  }
  $("hasil").textContent = baris.length ? baris.join("\n") : "Isi minimal satu kolom.";
});

})();

/* ============ LATIHAN 2 ============ */
(function () {
  // $("x") mengambil elemen dengan id "l2-x"
  const $ = (id) => document.getElementById("l2-" + id);

// 1. Tabel perkalian 1-10 dengan for loop
function tabelPerkalian(n) {
  let teks = "";
  for (let i = 1; i <= 10; i++) {
    teks += `${n} x ${i} = ${n * i}\n`;
  }
  return teks;
}

// 2. Faktorial: n! = 1 x 2 x ... x n
function faktorial(n) {
  if (n < 0 || !Number.isInteger(n)) return null; // tidak terdefinisi
  let hasil = 1;
  for (let i = 2; i <= n; i++) {
    hasil *= i;
  }
  return hasil;
}

// 3. Bilangan prima: cukup cek pembagi sampai akar n
function adalahPrima(n) {
  if (n < 2 || !Number.isInteger(n)) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

// 4. BMI = berat / (tinggi dalam meter)^2
function hitungBMI(beratKg, tinggiCm) {
  const tinggiM = tinggiCm / 100;
  const bmi = beratKg / (tinggiM * tinggiM);
  let kategori = "Obesitas";
  if (bmi < 18.5) kategori = "Kurus";
  else if (bmi < 25) kategori = "Normal";
  else if (bmi < 30) kategori = "Gemuk";
  return { bmi: bmi.toFixed(1), kategori };
}

// 5. FizzBuzz: cek kelipatan 15 lebih dulu agar tidak tertutup 3 dan 5
function fizzBuzz() {
  const hasil = [];
  for (let i = 1; i <= 100; i++) {
    if (i % 15 === 0) hasil.push("FizzBuzz");
    else if (i % 3 === 0) hasil.push("Fizz");
    else if (i % 5 === 0) hasil.push("Buzz");
    else hasil.push(i);
  }
  return hasil.join(", ");
}

function ambilAngka() {
  const n = parseInt($("angka").value, 10);
  if (isNaN(n)) {
    $("hasil-angka").textContent = "Masukkan angka yang valid.";
    return null;
  }
  return n;
}

$("btn-kali").addEventListener("click", () => {
  const n = ambilAngka();
  if (n !== null) $("hasil-angka").textContent = tabelPerkalian(n);
});

$("btn-faktorial").addEventListener("click", () => {
  const n = ambilAngka();
  if (n === null) return;
  const hasil = faktorial(n);
  $("hasil-angka").textContent = hasil === null ? "Faktorial hanya untuk bilangan bulat >= 0." : `${n}! = ${hasil}`;
});

$("btn-prima").addEventListener("click", () => {
  const n = ambilAngka();
  if (n !== null) $("hasil-angka").textContent = `${n} ${adalahPrima(n) ? "adalah" : "bukan"} bilangan prima.`;
});

$("btn-bmi").addEventListener("click", () => {
  const berat = parseFloat($("berat").value);
  const tinggi = parseFloat($("tinggi").value);
  if (isNaN(berat) || isNaN(tinggi) || berat <= 0 || tinggi <= 0) {
    $("hasil-bmi").textContent = "Isi berat dan tinggi dengan angka lebih dari 0.";
    return;
  }
  const { bmi, kategori } = hitungBMI(berat, tinggi);
  $("hasil-bmi").textContent = `BMI: ${bmi} (${kategori})`;
});

$("btn-fizz").addEventListener("click", () => {
  $("hasil-fizz").textContent = fizzBuzz();
});

})();

/* ============ LATIHAN 3 ============ */
(function () {
  // $("x") mengambil elemen dengan id "l3-x"
  const $ = (id) => document.getElementById("l3-" + id);

// Array berisi objek mahasiswa
const mahasiswa = [
  { nama: "Budi Santoso", nim: "123140001", jurusan: "Teknik Informatika", nilai: 85 },
  { nama: "Citra Lestari", nim: "123140002", jurusan: "Teknik Informatika", nilai: 92 },
  { nama: "Andi Pratama", nim: "123140003", jurusan: "Teknik Biomedis", nilai: 78 },
  { nama: "Dewi Anggraini", nim: "123140004", jurusan: "Teknik Informatika", nilai: 88 },
  { nama: "Eko Wijaya", nim: "123140005", jurusan: "Teknik Elektro", nilai: 70 },
];

let modeFilter = "semua"; // "semua" | "atas"
let modeUrut = null;      // null | "asc" | "desc"
let editIndex = -1;       // -1 = mode tambah

const hitungRataRata = () => mahasiswa.reduce((sum, m) => sum + m.nilai, 0) / mahasiswa.length;

// Cari nilai tertinggi dengan reduce
const cariTertinggi = () => mahasiswa.reduce((maks, m) => (m.nilai > maks.nilai ? m : maks), mahasiswa[0]);

function render() {
  const rata = hitungRataRata();
  // simpan indeks asli agar Edit/Hapus tetap menunjuk data yang benar setelah filter/sort
  let tampil = mahasiswa.map((m, i) => ({ ...m, i }));

  if (modeFilter === "atas") tampil = tampil.filter((m) => m.nilai > rata);
  if (modeUrut) {
    tampil.sort((a, b) => (modeUrut === "asc" ? a.nama.localeCompare(b.nama) : b.nama.localeCompare(a.nama)));
  }

  const tbody = $("tabel");
  tbody.innerHTML = "";
  tampil.forEach((m, no) => {
    const tr = document.createElement("tr");
    [no + 1, m.nama, m.nim, m.jurusan, m.nilai].forEach((v) => {
      const td = document.createElement("td");
      td.textContent = v;
      tr.appendChild(td);
    });
    const aksi = document.createElement("td");
    aksi.innerHTML = `<button class="sec" data-aksi="edit" data-i="${m.i}">Edit</button> <button class="sec" data-aksi="hapus" data-i="${m.i}">Hapus</button>`;
    tr.appendChild(aksi);
    tbody.appendChild(tr);
  });

  $("info").textContent = mahasiswa.length
    ? `Rata-rata nilai: ${rata.toFixed(2)} | Tampil ${tampil.length} dari ${mahasiswa.length} mahasiswa`
    : "Belum ada data.";
}

// Filter & sort
$("btn-semua").addEventListener("click", () => { modeFilter = "semua"; modeUrut = null; render(); });
$("btn-atas").addEventListener("click", () => { modeFilter = "atas"; render(); });
$("btn-asc").addEventListener("click", () => { modeUrut = "asc"; render(); });
$("btn-desc").addEventListener("click", () => { modeUrut = "desc"; render(); });
$("btn-tertinggi").addEventListener("click", () => {
  const t = cariTertinggi();
  $("info").textContent = `Nilai tertinggi: ${t.nama} (${t.nilai})`;
});

// CRUD: Edit & Hapus lewat event delegation
$("tabel").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-aksi]");
  if (!btn) return;
  const i = Number(btn.dataset.i);

  if (btn.dataset.aksi === "hapus") {
    mahasiswa.splice(i, 1); // Delete
    if (editIndex === i) batalEdit();
    render();
  } else {
    const m = mahasiswa[i]; // isi form dengan data lama (Update)
    editIndex = i;
    $("nama").value = m.nama;
    $("nim").value = m.nim;
    $("jurusan").value = m.jurusan;
    $("nilai").value = m.nilai;
    $("judul-form").textContent = "Ubah mahasiswa (Update)";
    $("btn-simpan").textContent = "Simpan perubahan";
    $("btn-batal").hidden = false;
  }
});

function batalEdit() {
  editIndex = -1;
  $("form").reset();
  $("error").textContent = "";
  $("judul-form").textContent = "Tambah mahasiswa (Create)";
  $("btn-simpan").textContent = "Tambah";
  $("btn-batal").hidden = true;
}
$("btn-batal").addEventListener("click", batalEdit);

$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    nama: $("nama").value.trim(),
    nim: $("nim").value.trim(),
    jurusan: $("jurusan").value.trim(),
    nilai: $("nilai").valueAsNumber,
  };
  if (data.nama.length < 3 || !data.nim || !data.jurusan || isNaN(data.nilai) || data.nilai < 0 || data.nilai > 100) {
    $("error").textContent = "Lengkapi semua kolom: nama min. 3 karakter, nilai 0-100.";
    return;
  }
  if (editIndex === -1) mahasiswa.push(data); // Create
  else mahasiswa[editIndex] = data;           // Update
  batalEdit();
  render();
});

render(); // Read

})();

/* ============ LATIHAN 4 ============ */
(function () {
  // $("x") mengambil elemen dengan id "l4-x"
  const $ = (id) => document.getElementById("l4-" + id);

// Helper localStorage yang aman dari data rusak
function muat(kunci) {
  try { return JSON.parse(localStorage.getItem(kunci)) || []; } catch (e) { return []; }
}
const simpan = (kunci, data) => localStorage.setItem(kunci, JSON.stringify(data));

/* ===== 4. Dark mode: toggle class "dark" pada body ===== */
function terapkanTema(gelap) {
  document.body.classList.toggle("dark", gelap);
  $("btn-tema").textContent = gelap ? "Light mode" : "Dark mode";
}
terapkanTema(localStorage.getItem("tema") === "dark");
$("btn-tema").addEventListener("click", () => {
  const gelap = !document.body.classList.contains("dark");
  terapkanTema(gelap);
  localStorage.setItem("tema", gelap ? "dark" : "light");
});

/* ===== 1 & 2. Form mahasiswa dengan validasi + localStorage ===== */
let daftarMhs = muat("latihanMahasiswa");

function renderMhs() {
  const ul = $("mhs-list");
  ul.innerHTML = "";
  daftarMhs.forEach((m, i) => {
    const li = document.createElement("li");
    const teks = document.createElement("span");
    teks.textContent = `${m.nama} - ${m.nim} - ${m.jurusan}`;
    const btn = document.createElement("button");
    btn.className = "sec";
    btn.textContent = "Hapus";
    btn.addEventListener("click", () => {
      daftarMhs.splice(i, 1);
      simpan("latihanMahasiswa", daftarMhs);
      renderMhs();
    });
    li.append(teks, btn);
    ul.appendChild(li);
  });
}

$("form-mhs").addEventListener("submit", (e) => {
  e.preventDefault();
  const nama = $("mhs-nama").value.trim();
  const nim = $("mhs-nim").value.trim();
  const jurusan = $("mhs-jurusan").value.trim();

  if (nama.length < 3) return ($("mhs-error").textContent = "Nama minimal 3 karakter.");
  if (!/^\d{9}$/.test(nim)) return ($("mhs-error").textContent = "NIM harus 9 digit angka.");
  if (!jurusan) return ($("mhs-error").textContent = "Jurusan wajib diisi.");
  if (daftarMhs.some((m) => m.nim === nim)) return ($("mhs-error").textContent = "NIM sudah terdaftar.");

  $("mhs-error").textContent = "";
  daftarMhs.push({ nama, nim, jurusan });
  simpan("latihanMahasiswa", daftarMhs);
  e.target.reset();
  renderMhs();
});
renderMhs();

/* ===== 3 & 5. Fetch post, search by title, pagination ===== */
const PER_HALAMAN = 10;
let semuaPost = [];
let kataCari = "";
let halaman = 1;

function renderPost() {
  const hasil = semuaPost.filter((p) => p.title.toLowerCase().includes(kataCari)); // filter dulu
  const totalHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN));
  halaman = Math.min(halaman, totalHalaman);

  const awal = (halaman - 1) * PER_HALAMAN;
  const potongan = hasil.slice(awal, awal + PER_HALAMAN); // lalu potong per halaman

  const box = $("post-list");
  box.innerHTML = "";
  if (potongan.length === 0) box.textContent = "Tidak ada post yang cocok.";
  potongan.forEach((p) => {
    const div = document.createElement("div");
    div.style.cssText = "padding:6px 0;border-bottom:1px solid var(--line)";
    div.textContent = `${p.id}. ${p.title}`;
    box.appendChild(div);
  });

  $("halaman").textContent = `Halaman ${halaman} / ${totalHalaman}`;
  $("btn-prev").disabled = halaman <= 1;
  $("btn-next").disabled = halaman >= totalHalaman;
}

async function ambilPost() {
  $("post-list").textContent = "Memuat data...";
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) throw new Error("Status " + response.status);
    semuaPost = await response.json();
    renderPost();
  } catch (error) {
    $("post-list").textContent = "Gagal mengambil data: " + error.message;
  }
}

$("cari").addEventListener("input", (e) => {
  kataCari = e.target.value.trim().toLowerCase();
  halaman = 1; // kembali ke halaman pertama tiap pencarian baru
  renderPost();
});
$("btn-prev").addEventListener("click", () => { halaman--; renderPost(); });
$("btn-next").addEventListener("click", () => { halaman++; renderPost(); });
ambilPost();

/* ===== 6. Todo list: tambah, hapus, tandai selesai ===== */
let todos = muat("latihanTodos");

function renderTodo() {
  const ul = $("todo-list");
  ul.innerHTML = "";
  todos.forEach((t, i) => {
    const li = document.createElement("li");
    const cek = document.createElement("input");
    cek.type = "checkbox";
    cek.checked = t.selesai;
    cek.addEventListener("change", () => {
      todos[i].selesai = cek.checked;
      simpan("latihanTodos", todos);
      renderTodo();
    });
    const teks = document.createElement("span");
    teks.textContent = t.teks;
    if (t.selesai) teks.className = "done";
    const hapus = document.createElement("button");
    hapus.className = "sec";
    hapus.textContent = "Hapus";
    hapus.addEventListener("click", () => {
      todos.splice(i, 1);
      simpan("latihanTodos", todos);
      renderTodo();
    });
    li.append(cek, teks, hapus);
    ul.appendChild(li);
  });
}

$("form-todo").addEventListener("submit", (e) => {
  e.preventDefault();
  const teks = $("todo-input").value.trim();
  if (!teks) return;
  todos.push({ teks, selesai: false });
  simpan("latihanTodos", todos);
  e.target.reset();
  renderTodo();
});
renderTodo();

})();