// catatan.js
import { simpanCatatanKeStorage } from "./storage.js";

export function tambahCatatan(daftar, isi) {
  const catatanBaru = {
    id: Date.now(),
    isi,
    tanggal: new Date().toLocaleDateString("id-ID")
  };
  const daftarBaru = [...daftar, catatanBaru];
  simpanCatatanKeStorage(daftarBaru);
  return daftarBaru;
}

export function hapusCatatan(daftar, id) {
  const daftarBaru = daftar.filter((c) => c.id !== id);
  simpanCatatanKeStorage(daftarBaru);
  return daftarBaru;
}