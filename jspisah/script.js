import { muatDariStorage, muatCatatanDariStorage, simpanKeStorage } from "./storage.js";
import { ambilCuaca , ambilKutipan } from "./api.js";
import { editTugas , tambahTugas , hapusTugas ,toggleSelesai } from "./tugas.js";
import { tambahCatatan , hapusCatatan  } from "./catatan.js";

const btnrefresh = document.createElement("button");
btnrefresh.textContent = "Refresh";
btnrefresh.addEventListener("click", () => {
  kutipanArea.textContent = "Memuat Kutipan..."
  ambilKutipan();
});

// MINGGU 1 & 2: Seleksi Root DOM & Pembuatan 3 Section Dinamis
const app = document.getElementById("app");

const judul = document.createElement("h2");
judul.textContent = "Selamat datang di DailyBoard!";
judul.style.color = "#2563eb";
app.appendChild(judul);

// MINGGU 2: Membuat 3 Section Kosong (Tugas, Catatan, Cuaca) via JavaScript
const tugasSection = document.createElement("section");
tugasSection.id = "tugas-section";

const catatanSection = document.createElement("section");
catatanSection.id = "catatan-section";

const cuacaSection = document.createElement("section");
cuacaSection.id = "cuaca-section";

app.append(tugasSection, catatanSection, cuacaSection);

// UI Seksi Tugas
const titleTugas = document.createElement("h3");
titleTugas.textContent = "Daftar Tugas";

// MINGGU 14: Input Pencarian Real-Time
const inputCari = document.createElement("input");
inputCari.type = "text";
inputCari.id = "cari-tugas";
inputCari.placeholder = "Cari tugas...";

// MINGGU 3: Form Input Nama Tugas & Tombol Tambah
const inputTugas = document.createElement("input");
inputTugas.type = "text";
inputTugas.placeholder = "Masukkan nama tugas Baru";

const tombolTambah = document.createElement("button");
tombolTambah.textContent = "Tambah Tugas";

// MINGGU 6: Tombol Filter (Semua, Selesai, Belum Selesai)
const filterContainer = document.createElement("div");
filterContainer.id = "filter-container";

const btnSemua = document.createElement("button");
btnSemua.textContent = "Semua";

const btnSelesai = document.createElement("button");
btnSelesai.textContent = "Selesai";

const btnBelum = document.createElement("button");
btnBelum.textContent = "Belum Selesai";

filterContainer.append(btnSemua, btnSelesai, btnBelum);

// MINGGU 4: Container Elemen List Tugas (<ul>)
const daftar_tugas = document.createElement("ul");
daftar_tugas.id = "daftar-tugas";

tugasSection.append(titleTugas, inputCari, inputTugas, tombolTambah, filterContainer, daftar_tugas);


// =========================================================================
// FASE 2 & FASE 3: TO-DO LIST, LOCALSTORAGE & EDIT (Minggu 4 - 9)
// =========================================================================

let daftarTugas = [];
let nextId = 1;
let filterAktif = "semua";
let kataKunciCari = "";

// MINGGU 9: Fungsi Validasi Input
function validasiInput(nilai) {
  if (nilai.trim() === "") {
    alert("Input tidak boleh kosong!");
    return false;
  }
  if (nilai.length > 100) {
    alert("Input maksimal 100 karakter!");
    return false;
  }
  return true;
}

// MINGGU 4, 6, 13 & 14: Render Utama Daftar Tugas + Drag-Drop + Search
function renderTugas(filter = filterAktif) {
  filterAktif = filter;
  daftar_tugas.innerHTML = "";

  // MINGGU 6 & 14: Menyaring berdasarkan Filter Status dan Kata Kunci Pencarian
  const tugasTersaring = daftarTugas.filter((t) => {
    const cocokFilter =
      filter === "selesai" ? t.selesai : filter === "belum" ? !t.selesai : true;
    const cocokCari = t.nama.toLowerCase().includes(kataKunciCari.toLowerCase());
    return cocokFilter && cocokCari;
  });

  tugasTersaring.forEach((tugas, index) => {
    const li = document.createElement("li");
    li.dataset.id = tugas.id;

    // MINGGU 13: Pengaturan Drag and Drop HTML5
    li.setAttribute("draggable", true);

    li.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", index);
      li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
    });

    li.addEventListener("dragover", (e) => e.preventDefault());

    li.addEventListener("drop", (e) => {
      e.preventDefault();
      const originIndex = e.dataTransfer.getData("text/plain");
      const targetIndex = index;

      if (originIndex !== "" && originIndex !== targetIndex) {
        // MINGGU 13: Ubah urutan array & Simpan ke localStorage
        const movedItem = daftarTugas.splice(originIndex, 1)[0];
        daftarTugas.splice(targetIndex, 0, movedItem);
        simpanKeStorage();
        renderTugas();
      }
    });

    // Elemen Teks
    const spanTeks = document.createElement("span");
    spanTeks.textContent = tugas.nama;
    spanTeks.style.textDecoration = tugas.selesai ? "line-through" : "none";
    spanTeks.style.cursor = "pointer";

    // MINGGU 6: Klik 1x untuk Tandai Selesai
    spanTeks.addEventListener("click", () => {
    daftarTugas = toggleSelesai(daftarTugas, tugas.id);
    renderTugas(); 
    });

    // MINGGU 9: Klik 2x (dblclick) untuk Edit Tugas
    spanTeks.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    const namaBaru = prompt("Edit Nama Tugas:", tugas.nama);
    if (namaBaru !== null && validasiInput(namaBaru)) {
      daftarTugas = editTugas(daftarTugas, tugas.id, namaBaru.trim());
      renderTugas();
    }
  });

    // MINGGU 5: Tombol Hapus Tugas
    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.addEventListener("click", (e) => {
    e.stopPropagation();
    daftarTugas = hapusTugas(daftarTugas, tugas.id);
    renderTugas();
  });

    li.append(spanTeks, tombolHapus);
    daftar_tugas.appendChild(li);
  });
}

// Event Listeners Input & Filter Tugas
tombolTambah.addEventListener("click", () => {
  const teks = inputTugas.value;
  if (validasiInput(teks)) {
    const hasil = tambahTugas(daftarTugas, teks.trim(), nextId);
    daftarTugas = hasil.daftarBaru;
    nextId = hasil.nextId;
    inputTugas.value = "";
    renderTugas(); 
  }
});
btnSemua.addEventListener("click", () => renderTugas("semua"));
btnSelesai.addEventListener("click", () => renderTugas("selesai"));
btnBelum.addEventListener("click", () => renderTugas("belum"));

// MINGGU 14: Event Input Pencarian Real-Time
inputCari.addEventListener("input", (e) => {
  kataKunciCari = e.target.value;
  renderTugas();
});


// =========================================================================
// FASE 3: FITUR CATATAN CEPAT / NOTES (Minggu 8 - 9)
// =========================================================================

const titleCatatan = document.createElement("h3");
titleCatatan.textContent = "Catatan Cepat";

const inputCatatan = document.createElement("textarea");
inputCatatan.placeholder = "Tulis catatan di sini...";

const tombolTambahCatatan = document.createElement("button");
tombolTambahCatatan.textContent = "Tambah Catatan";

const containerCatatan = document.createElement("div");
containerCatatan.className = "catatan-container";
containerCatatan.id = "daftar-catatan";

catatanSection.append(titleCatatan, inputCatatan, tombolTambahCatatan, containerCatatan);

let daftarCatatan = [];

function renderCatatan() {
  containerCatatan.innerHTML = "";

  daftarCatatan.forEach((catatan) => {
    const div = document.createElement("div");
    div.className = "catatan-item";
    div.innerHTML = `
      <p>${catatan.isi}</p>
      <small>${catatan.tanggal}</small>
    `;

    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "×";
    tombolHapus.addEventListener("click", () => {
      daftarCatatan = hapusCatatan(daftarCatatan, catatan.id);
      renderCatatan();
  });
    div.appendChild(tombolHapus);
    containerCatatan.appendChild(div);
  });
}



tombolTambahCatatan.addEventListener("click", () => {
  const isi = inputCatatan.value;
  if (validasiInput(isi)) {
    daftarCatatan = tambahCatatan(daftarCatatan, isi.trim());
    inputCatatan.value = "";
    renderCatatan(); //
  }
});


// =========================================================================
// FASE 4: INTEGRASI API & WIDGET (Minggu 10 - 12)
// =========================================================================

const titleCuaca = document.createElement("h3");
titleCuaca.textContent = "Widget Info & Cuaca";

// MINGGU 12: Indikator Status Loading Global Widget
const statusWidget = document.createElement("p");
statusWidget.id = "status";
statusWidget.style.fontStyle = "italic";

const kutipanArea = document.createElement("blockquote");
kutipanArea.id = "kutipan-harian";

// MINGGU 11: Form Input Nama Kota
const inputKota = document.createElement("input");
inputKota.type = "text";
inputKota.placeholder = "Masukkan nama kota...";

const tombolCariCuaca = document.createElement("button");
tombolCariCuaca.textContent = "Cari Cuaca";

const infoCuaca = document.createElement("div");
infoCuaca.id = "info-cuaca";

cuacaSection.append(titleCuaca, statusWidget, kutipanArea ,btnrefresh, inputKota, tombolCariCuaca, infoCuaca);

tombolCariCuaca.addEventListener("click", () => {
  const kota = inputKota.value.trim();
  if (kota !== "") {
    ambilCuaca(kota);
  } else {
    alert("Masukkan nama kota!");
  }
});

// MINGGU 12: Promise.all untuk Memuat Seluruh Widget Saat Halaman Dibuka
async function muatSemuaWidget() {
  statusWidget.textContent = "Memuat data widget...";
  await Promise.all([ambilKutipan(), ambilCuaca("Jakarta")]);
  statusWidget.textContent = "Data widget berhasil dimuat!";
}
  

// =========================================================================
// FASE 5: DARK MODE & INISIALISASI (Minggu 14)
// =========================================================================

// MINGGU 14: Dark Mode Toggle dengan LocalStorage
const toggleTema = document.getElementById("toggle-tema");

toggleTema.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const modeGelap = document.body.classList.contains("dark-mode");
  localStorage.setItem("tema", modeGelap ? "gelap" : "terang");
  toggleTema.textContent = modeGelap ? "Mode Terang" : "Mode Gelap";
});

// Inisialisasi Aplikasi Saat DOM Selesai Dimuat
window.addEventListener("DOMContentLoaded", () => {
  // Cek Tema Tersimpan
  if (localStorage.getItem("tema") === "gelap") {
    document.body.classList.add("dark-mode");
    if (toggleTema) toggleTema.textContent = "Mode Terang";
  }

  const dataTugas = muatDariStorage();
  daftarTugas = dataTugas.daftarTugas;
  nextId = dataTugas.nextId;
  renderTugas();

  daftarCatatan = muatCatatanDariStorage();
  renderCatatan();

  muatSemuaWidget();
  });