# Panduan Implementasi: Portal Absensi Siswa Interaktif

Selamat! Anda telah mendapatkan tiga komponen utama aplikasi absensi ("Frontend UI", "Backend Apps Script", dan Panduan ini). Mengikuti prinsip tanpa-server (serverless), Anda akan menggunakan _Google Sheets_ sebagai database dan _Google Apps Script (GAS)_ sebagai jembatan penghubungnya.

Bahkan jika Anda masih awam (pemula), silakan ikuti petunjuk langkah demi langkah ini dengan teliti.

---

## TAHAP 1: Menyiapkan Google Sheets & Apps Script
Tahap ini bertujuan untuk menyiapkan "rumah" bagi data base absensi Anda.

1. Buka browser Anda dan pergi ke [Google Sheets](https://sheets.google.com).
2. Buat spreadsheet baru (Blank spreadsheet).
3. Beri nama file Google Sheets tersebut sesuai keinginan Anda (Misal: `Database Absensi Sekolah`).
4. Pada menu bar di atas, klik **Extensions** (Ekstensi) > **Apps Script**. Tab baru akan terbuka menuju editor kode.

---

## TAHAP 2: Memasukkan Kode Backend & Menyiapkan Database
Di editor Apps Script, kita akan memasukkan kode agar dapat menerima data.

1. Di sebelah kiri (di bagian **Files**), Anda akan melihat file `Code.gs`.
2. Hapus seluruh isi kode bawaan (`function myFunction() { ... }`).
3. Buka file `Code.gs` yang baru saja dihasilkan oleh AI ini, **salin (copy)** seluruh isinya, dan **tempelkan (paste)** ke editor Apps Script Anda.
4. Klik tombol ikon **Simpan (Save)** berlogo disket, atau tekan `Ctrl + S`.
5. **PENTING: Otomasi Penyiapan Tabel Database**
   - Di bagian atas layar (tepat di samping tombol Run/Jalankan), terdapat sebuah _dropdown_ (menu tarik-turun) yang sedang menampilkan `doGet`.
   - Ubah dropdown tersebut menjadi **`setupDatabase`**.
   - Klik tombol **Run** (Jalankan).
   - *Catatan:* Saat pertama kali dijalankan, Google akan meminta izin keamanan ("Authorization required"). Klik **Review permissions**, pilih akun Google Anda. Jika muncul peringatan "Google hasn't verified this app", klik **Advanced** (Lanjutan) lalu klik **Go to Untitled project (unsafe)** / Lanjutkan, dan akhirnya klik **Allow** (Izinkan).
6. Kembali ke tab Google Sheets Anda. Anda akan melihat sebuah sheet baru bernama **DataAbsensi** yang sudah memiliki tampilan header biru, rapi, dengan baris yang terkunci (freeze)! Database sudah siap!

---

## TAHAP 3: Menyebarkan (Deploy) Web App
Langkah ini untuk mengaktifkan URL akses yang dapat dihubungi dari internet oleh halaman frontend kita.

1. Kembali ke tab editor **Apps Script**.
2. Di pojok kanan atas, klik tombol biru **Deploy**, kemudian pilih **New deployment** (Penyebaran baru).
3. Pada jendela yang muncul, klik ikon "Roda Gigi" (⚙️ Select type) di sebelah pilihan "Select type", dan centang kotak **Web app**.
4. Isi konfigurasi sebagai berikut:
   - **Description:** "Versi 1 Absensi" (bebas).
   - **Execute as:** Pilih `Me (emailanda@gmail.com)` --> *Sangat Penting!*
   - **Who has access:** Ubah menjadi `Anyone` (Siapa saja) --> *Wajib agar API bisa ditangkap browser publik tanpa login GMAIL.*
5. Klik tombol **Deploy** (Sebarkan).
6. Muncul pemberitahuan berhasil, dan ada **Web app URL** yang panjang (dimulai dari `https://script.google.com/macros/s/..../exec`).
7. **Salin (Copy)** URL tersebut. Anda akan membutuhkannya di Tahap 4.

---

## TAHAP 4: Menghidupkan Frontend HTML
Agar aplikasi Frontend berfungsi utuh dan menyimpan ke tabel Anda, kita harus menyematkan link (URL) dari Tahap 3 ke dalam kodenya.

1. Buka file `index.html` yang telah dibuat untuk Anda, baik memakai program Notepad, Visual Studio Code, atau Editor Teks lainnya.
2. Gulir ke arah paling bawah hingga menemukan blok `<script>` javascript utama.
3. Anda akan melihat dua variabel di baris paling atas skrip:
   ```javascript
   const IS_PREVIEW = true;
   const GAS_URL = "URL_DEPLOY_GAS_ANDA_DISINI";
   ```
4. Ubah nilainya menjadi seperti ini:
   - Ubah `true` menjadi `false`.
   - Ganti `URL_DEPLOY_GAS_ANDA_DISINI` dengan URL yang Anda salin di **Tahap 3**, dan HARUS tetap menggunakan tanda kutip.
   Contoh hasil akhirnya:
   ```javascript
   const IS_PREVIEW = false;
   const GAS_URL = "https://script.google.com/macros/s/AKfycby...ContohUrl.../exec";
   ```
5. Simpan file `index.html`.

---

## TAHAP 5: Cara Publikasi / Penggunaan
Terdapat 2 opsi luar biasa tentang cara mempublikasikannya ke siswa Anda.

### Opsi A (Langsung menggunakan Platform Blogger / WordPress)
Ini adalah opsi terbaik jika Anda sudah punya web CMS sekolah atau blog biasa.
1. Buka dashboard Blogger Anda dan Buat Post/Halaman (Page) baru.
2. Di editor teks, ubah tampilan dari *Compose View* menjadi **HTML View** (biasanya tombol "<>" di kiri atas).
3. Salin (Copy) SEMUA isi kode `index.html` yang sudah Anda edit dari *Tahap 4*.
4. Tempel (Paste) mentah-mentah ke editor HTML Blogger.
5. Klik "Publish". Halaman Blogger Anda kini berubah menjadi Portal Aplikasi Mandiri. Karena kita menggunakan metode `no-cors` pada `fetch` API-nya, maka tidak ada masalah meskipun domainnya ada di Blogger!

### Opsi B (Host via GitHub Pages / Link Langsung)
Opsi lain, jika file `index.html` tersebut diklik dua kali saja di komputer (membuka di browser via lokal), aplikasi akan langsung berfungsi dan data tetap terkirim ke Google Sheets! Namun untuk internet, Anda dapat meng-upload file `index.html` tersebut ke GitHub Pages atau Vercel agar mendapat domain publik.

---

## INFO: Mode Simulasi
Jika pada tahap 4 `IS_PREVIEW = true;` tidak Anda ubah:
- Aplikasi akan memunculkan spanduk peringatan kuning "Mode Simulasi".
- Tersedia tombol "Isi Data Otomatis" untuk ujicoba UX secara cepat.
- Tidak akan ada data yang terkirim ke Google Sheets Anda (Menekan Submit hanya memunculkan animasi centang hijau visual buatan).

**Selamat Menggunakan Aplikasi Absensi!**
