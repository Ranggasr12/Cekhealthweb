export default function Hasil({ searchParams }) {
  const skor = parseInt(searchParams.skor);

  let kategori = "";
  let saran = "";

  if (skor <= 3) {
    kategori = "Sehat ✅";
    saran = "Pertahankan pola hidup sehat dan tetap aktif!";
  } else if (skor <= 7) {
    kategori = "Rentan ⚠️";
    saran = "Mulai perbaiki pola makan dan tidur, serta kurangi stres.";
  } else {
    kategori = "Berisiko Tinggi ❗";
    saran = "Segera konsultasi dengan tenaga medis atau ahli kesehatan.";
  }

  return (
    <div>
      <h1>Hasil Kesehatan Anda</h1>
      <h2>Skor: {skor}</h2>
      <h3>Status: {kategori}</h3>
      <p>{saran}</p>
    </div>
  );
}
