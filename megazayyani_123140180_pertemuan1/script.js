// Konstanta & state
const STORAGE_KEY = "miniPosKeranjang";
const MIN_HARGA = 500;
const MIN_BELANJA_DISKON = 50000;
const PERSEN_DISKON = 0.1;

let keranjang = []; // array of { nama, harga, qty }

// Helper
const $ = (id) => document.getElementById(id);
const formatRupiah = (angka) => "Rp " + angka.toLocaleString("id-ID");

// LocalStorage
function simpanKeranjang() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keranjang)); // objek -> string
}

function muatKeranjang() {
  try {
    keranjang = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; // string -> objek
  } catch (error) {
    keranjang = []; // data rusak: mulai dari kosong
  }
}

// Validasi
function validasiBarang(nama, harga, qty) {
  const errors = {};
  if (nama.trim().length < 3) {
    errors.nama = "Nama barang wajib diisi, minimal 3 karakter.";
  }
  if (Number.isNaN(harga) || harga < MIN_HARGA) {
    errors.harga = "Harga wajib angka dan minimal Rp 500.";
  }
  if (Number.isNaN(qty) || !Number.isInteger(qty) || qty < 1) {
    errors.qty = "Jumlah wajib bilangan bulat minimal 1.";
  }
  return errors;
}

function tampilkanError(errors) {
  ["nama", "harga", "qty"].forEach((field) => {
    $("error-" + field).textContent = errors[field] || "";
    $(field).classList.toggle("invalid", Boolean(errors[field]));
  });
}

// Perhitungan
function hitungRingkasan() {
  const total = keranjang.reduce((sum, item) => sum + item.harga * item.qty, 0);
  const dapatDiskonBelanja = total >= MIN_BELANJA_DISKON;
  const diskon = dapatDiskonBelanja ? Math.round(total * PERSEN_DISKON) : 0;

  let infoDiskon = "";
  if (dapatDiskonBelanja) infoDiskon = "Diskon 10% aktif karena belanja minimal Rp 50.000.";

  return { total, diskon, totalAkhir: total - diskon, infoDiskon };
}

// Render
function render() {
  const tbody = $("isi-keranjang");
  tbody.innerHTML = "";

  keranjang.forEach((item, index) => {
    const tr = document.createElement("tr");
    const kolom = [
      index + 1,
      item.nama,
      formatRupiah(item.harga),
      item.qty,
      formatRupiah(item.harga * item.qty), // subtotal = harga x qty
    ];
    kolom.forEach((nilai, i) => {
      const td = document.createElement("td");
      td.textContent = nilai;
      if (i >= 2) td.classList.add("angka");
      tr.appendChild(td);
    });

    const tdAksi = document.createElement("td");
    const btn = document.createElement("button");
    btn.className = "btn small";
    btn.textContent = "Hapus";
    btn.dataset.index = index;
    tdAksi.appendChild(btn);
    tr.appendChild(tdAksi);
    tbody.appendChild(tr);
  });

  $("keranjang-kosong").hidden = keranjang.length > 0;

  const { total, diskon, totalAkhir, infoDiskon } = hitungRingkasan();
  $("total").textContent = formatRupiah(total);
  $("diskon").textContent = "- " + formatRupiah(diskon);
  $("total-akhir").textContent = formatRupiah(totalAkhir);

  const infoEl = $("info-diskon");
  infoEl.textContent = infoDiskon;
  infoEl.className = "info" + (diskon > 0 ? " ok" : infoDiskon ? " bad" : "");

  renderPembayaran(totalAkhir);
}

function renderPembayaran(totalAkhir) {
  const bayar = $("bayar").valueAsNumber;
  const el = $("info-bayar");

  if (keranjang.length === 0 || Number.isNaN(bayar)) {
    el.textContent = "";
    el.className = "info";
  } else if (bayar < totalAkhir) {
    el.textContent = "Uang belum mencukupi, kurang " + formatRupiah(totalAkhir - bayar) + ".";
    el.className = "info bad";
  } else {
    el.textContent = "Kembalian: " + formatRupiah(bayar - totalAkhir);
    el.className = "info ok";
  }
}

// Event handler
$("form-barang").addEventListener("submit", function (event) {
  event.preventDefault(); // cegah halaman reload

  const nama = $("nama").value;
  const harga = $("harga").valueAsNumber;
  const qty = $("qty").valueAsNumber;

  const errors = validasiBarang(nama, harga, qty);
  tampilkanError(errors);
  if (Object.keys(errors).length > 0) return; // barang tidak masuk keranjang

  keranjang.push({ nama: nama.trim(), harga, qty });
  simpanKeranjang();
  this.reset(); // form otomatis dikosongkan
  render();
  $("nama").focus();
});

$("isi-keranjang").addEventListener("click", function (event) {
  if (!event.target.matches("button[data-index]")) return;
  keranjang.splice(Number(event.target.dataset.index), 1);
  simpanKeranjang();
  render(); // total & diskon dihitung ulang
});

$("bayar").addEventListener("input", render);

$("btn-reset").addEventListener("click", function () {
  keranjang = [];
  localStorage.removeItem(STORAGE_KEY);
  $("bayar").value = "";
  tampilkanError({});
  render();
});

// Mulai aplikasi
muatKeranjang();
render();