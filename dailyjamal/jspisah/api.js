// api.js

export async function ambilKutipan() {
  const kutipanArea = document.getElementById("kutipan-harian");
  
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    if (!res.ok) throw new Error("Gagal mengambil kutipan");
    const data = await res.json();
    
    if (kutipanArea) {
      kutipanArea.innerHTML = `"${data.quote}" — <strong>${data.author}</strong>`;
    }
  } catch (error) {
    if (kutipanArea) {
      kutipanArea.textContent = "Gagal memuat kutipan harian.";
    }
    console.error(error);
  }
}

export async function ambilCuaca(kota) {
  const infoCuaca = document.getElementById("info-cuaca");
  const apiKey = "787226a476ddc70f3f42b3d777f2458c";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${kota}&units=metric&appid=${apiKey}&lang=id`;

  if (infoCuaca) {
    infoCuaca.textContent = "Memuat data cuaca...";
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Kota tidak ditemukan");
    const data = await res.json();
    
    if (infoCuaca) {
      infoCuaca.innerHTML = `<p><strong>${data.name}:</strong> ${Math.round(data.main.temp)}°C, ${data.weather[0].description}</p>`;
    }
  } catch (error) {
    if (infoCuaca) {
      infoCuaca.textContent = error.message;
    }
  }
}