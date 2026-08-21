// storage.js

// --- SIMPAN & MUAT TUGAS ---
export function simpanKeStorage(daftarTugas) {
  localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

export function muatDariStorage() {
  const data = localStorage.getItem("daftarTugas");
  if (data) {
    const daftar = JSON.parse(data);
    const maxId = daftar.length > 0 ? Math.max(...daftar.map((t) => t.id)) : 0;
    return { daftarTugas: daftar, nextId: maxId + 1 };
  }
  
  // Data Bawaan / Default jika LocalStorage masih kosong
  return {
    daftarTugas: [
      { id: 1, nama: "Belajar JavaScript DOM", selesai: false },
      { id: 2, nama: "Mencoba Drag and Drop", selesai: false }
    ],
    nextId: 3
  };
}

// --- SIMPAN & MUAT CATATAN ---
export function simpanCatatanKeStorage(daftarCatatan) {
  localStorage.setItem("daftarCatatan", JSON.stringify(daftarCatatan));
}

export function muatCatatanDariStorage() {
  const data = localStorage.getItem("daftarCatatan");
  return data ? JSON.parse(data) : [];
}