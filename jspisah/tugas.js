// tugas.js
import { simpanKeStorage } from "./storage.js";

export function validasiInput(nilai) {
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

export function tambahTugas(daftar, nama, nextId) {
  const tugasBaru = { id: nextId, nama, selesai: false };
  const daftarBaru = [...daftar, tugasBaru];
  simpanKeStorage(daftarBaru);
  return { daftarBaru, nextId: nextId + 1 };
}

export function hapusTugas(daftar, id) {
  const daftarBaru = daftar.filter((t) => t.id !== id);
  simpanKeStorage(daftarBaru);
  return daftarBaru;
}

export function toggleSelesai(daftar, id) {
  const daftarBaru = daftar.map((t) =>
    t.id === id ? { ...t, selesai: !t.selesai } : t
  );
  simpanKeStorage(daftarBaru);
  return daftarBaru;
}

export function editTugas(daftar, id, namaBaru) {
  const daftarBaru = daftar.map((t) =>
    t.id === id ? { ...t, nama: namaBaru } : t
  );
  simpanKeStorage(daftarBaru);
  return daftarBaru;
}