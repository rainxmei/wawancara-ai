# Ruang Wawancara — Simulasi Interaktif (tanpa AI)

Prototipe simulasi untuk proposal PLAY IT! PLUS 2026 (Polinema). Seluruh alur pelamar & HRD bisa dicoba;
AI/STT/TTS belum disambungkan — jawaban, skor, dan data adalah contoh.

## Jalankan lokal
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # hasil di dist/
```

## Deploy ke Vercel
1. Push folder ini ke GitHub, lalu di vercel.com → **Add New Project** → pilih repo.
2. Framework otomatis terdeteksi **Vite** (Build: `npm run build`, Output: `dist`). Tidak perlu env variable.
3. `vercel.json` sudah berisi rewrite SPA, jadi tautan langsung seperti `/hrd/lamaran` tetap berfungsi.
Alternatif tanpa GitHub: `npx vercel` di folder ini.

## Catatan untuk juri
- Mulai dari halaman awal → "Coba sebagai Pelamar". Tombol **Panduan demo** (kanan bawah) memuat urutan langkah & skenario khusus
  (slot penuh, koneksi putus, periode berakhir) serta tombol atur ulang.
- Wawancara yang dijalani muncul sebagai laporan nyata di dashboard HRD (data tersimpan di localStorage browser).
- Avatar berbicara memakai suara bawaan browser (Web Speech API). Jika tidak ada suara Indonesia, teks tetap tampil.
- Jawaban: contoh (dua tingkat kualitas), ketik sendiri, atau mikrofon sungguhan (Chrome/Edge). Penilaian memakai aturan kata kunci sederhana, bukan AI.
- Skor ditandai **"Skor simulasi"** karena metode skoring final belum ditetapkan.

## Buka tanpa server
`npm run build` menghasilkan satu file `dist/index.html` yang bisa langsung dibuka dengan klik dua kali
(routing memakai `#`, semua JS/CSS sudah tertanam). `index.html` di root folder hanyalah kerangka untuk Vite; jangan dibuka langsung.
