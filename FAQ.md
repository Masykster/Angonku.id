# ❓ Frequently Asked Questions (FAQ) — TernaKuy (Angonku)

Dokumen ini berisi kumpulan pertanyaan umum dan jawaban teknis mengenai cara kerja fitur-fitur utama di aplikasi TernaKuy.

---

## 1. Prakiraan Cuaca & Geocoding Otomatis
### **Bagaimana cara aplikasi menampilkan cuaca di lokasi kandang saya?**
Aplikasi menggunakan koordinat Latitude & Longitude kandang Anda untuk mengambil ramalan cuaca real-time dari **OpenWeather API**.
* **Jika koordinat kosong**: Saat menyimpan alamat berupa teks (misal: "Jl. Raya Papar, Kediri"), sistem backend akan melakukan **auto-geocoding** menggunakan API **Nominatim** untuk mencari koordinat lokasi tersebut secara otomatis sebelum menyimpan data kandang.

### **Bagaimana format tampilan prakiraan cuaca?**
Prakiraan cuaca didesain mengikuti gaya BMKG:
* **Tampilan 14 Hari**: Kalender prakiraan cuaca 2 minggu yang realistis & akurat.
* **Detail Per Jam (Hourly)**: Di dalam modal detail cuaca, Anda dapat menggeser (horizontal scroll) detail cuaca per jam yang menampilkan waktu, ikon cuaca, suhu, kelembaban, kecepatan/arah angin, dan visibilitas untuk tanggal yang dipilih.

---

## 2. Golden Timeline & Penjadwalan Siklus
### **Apa itu Golden Timeline?**
Golden Timeline adalah fitur penjadwalan otomatis berisi kegiatan krusial pemeliharaan harian yang dihasilkan secara dinamis berdasarkan jenis komoditas/hewan ternak.
* **Ayam Broiler**: Fokus pada vaksinasi (ND, Gumboro), kontrol suhu brooding, dan target panen ~35 hari.
* **Bebek**: Target panen ~45 hari dengan penyesuaian pakan bebek.
* **Lele**: Target panen ~90 hari dengan fokus penyortiran ukuran dan grading.
* **Nila**: Target panen ~120 hari dengan fokus kontrol kualitas air.

### **Apakah saya bisa menyesuaikan jadwal ini?**
Ya. Anda dapat mengubah target hari siklus langsung saat membuat kandang atau menekan tombol pensil (edit) di detail kandang. Selain itu, Anda juga dapat **menambah, mengedit, mencentang, atau menghapus kegiatan kustom** Anda sendiri langsung melalui tab **Timeline**.

---

## 3. Asisten Virtual Angon AI (Chatbot)
### **Bagaimana cara kerja Chatbot Angon AI?**
Tombol chatbot melayang (FAB) berada di pojok kanan bawah Dashboard. Chatbot ini ditenagai oleh **Groq API** menggunakan model visual **`meta-llama/llama-4-scout`** yang hemat token dan berkinerja tinggi.
* **Konsultasi Interaktif**: Anda bisa menanyakan gejala penyakit ternak, cara mencampur pakan, atau tips sanitasi kandang.
* **Analisis Multi-Moda (Visual)**: Mendukung pengunggahan foto/gambar (misal: foto kondisi kotoran atau gejala fisik hewan) untuk dianalisis langsung oleh AI secara real-time.

---

## 4. Keamanan Pangan & Masa Henti Obat (Withdrawal Period)
### **Mengapa tombol panen di kandang saya dinonaktifkan?**
Aplikasi memiliki sistem pengaman pangan yang ketat. Jika Anda mencatat pemberian obat/vaksin yang memiliki **Masa Henti Obat (Withdrawal Period)** di menu **Kesehatan**, sistem akan menghitung mundur sisa hari masa henti obat tersebut.
* Selama masa henti obat masih aktif (misal: Enrofloksasin sisa 10 hari), tombol panen akan dikunci dan sistem akan memunculkan banner peringatan **"Ada Withdrawal Aktif! Jangan dipanen dulu!"** untuk mencegah residu kimia obat masuk ke rantai konsumsi manusia.

---

## 5. Laporan Keuangan & Evaluasi Performa
### **Bagaimana cara aplikasi menghitung HPP dan ROI?**
Saat siklus panen selesai, sistem finansial di backend (`CalculationService`) akan menghitung:
* **Biaya Produksi (Expenses)**:
  * **Biaya Bibit (DOC)**: Jumlah Bibit × Harga per Ekor.
  * **Biaya Pakan**: Total Pakan Terpakai (kg) × Rp 8.500/kg.
  * **Biaya Obat/Vaksin**: Jumlah Bibit × Rp 1.500/ekor.
  * **Biaya Operasional**: Jumlah Bibit × Rp 1.000/ekor.
* **Keuntungan Bersih**: Pendapatan Panen − Total Pengeluaran.
* **HPP (Harga Pokok Produksi)**: Dihitung per kilogram berat panen dan per ekor ternak.
* **ROI (Return on Investment)**: Persentase efisiensi pengembalian modal.

### **Di mana saya bisa melihat evaluasi siklus saya?**
Di halaman Laporan Siklus Selesai, terdapat analisis otomatis terhadap FCR (Feed Conversion Ratio), tingkat kematian (mortality rate), dan ROI. Aplikasi akan memberikan rekomendasi taktis secara otomatis (misal: cara menekan FCR atau meningkatkan biosecurity) sebagai bahan evaluasi untuk siklus pemeliharaan berikutnya.

---

## 6. Laporan Panen Bankable PDF (Pengajuan KUR)
### **Apa itu Laporan Bankable PDF?**
Laporan Panen Bankable adalah berkas PDF resmi berformat premium yang dapat diunduh setelah siklus dipanen. 
* Dokumen ini menyajikan profil peternak, data teknis performa kandang (skor IP, FCR final, Survival Rate), rincian keuangan terstruktur, hingga riwayat kesehatan ternak. 
* Laporan ini dirancang memenuhi kriteria dokumen pendukung usaha yang kredibel untuk diajukan ke perbankan sebagai syarat pengajuan **Kredit Usaha Rakyat (KUR)** sektor peternakan.
* Tombol **"Unduh PDF"** dapat ditemukan di halaman detail laporan siklus yang sudah selesai di menu **Riwayat Siklus**.
