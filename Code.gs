function doGet(e) {
  // Mengembalikan file HTML saat URL Web App diakses di browser
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Sistem Absensi Kehadiran Siswa')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function doPost(e) {
  // Try-Catch block untuk menangani error agar skrip tidak crash
  try {
    // Membaca payload yang dikirim dari Frontend HTML
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    
    // Membuka file spreadsheet yang bertaut dengan script ini
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("DataAbsensi");
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        "status": "error",
        "message": "Sheet 'DataAbsensi' tidak ditemukan. Jalankan fungsi setupDatabase() terlebih dahulu!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Mempersiapkan data untuk di-insert ke Baris baru
    var timestamp = new Date();
    var nis = data.nis || "-";
    var nama = data.nama || "-";
    var kelas = data.kelas || "-";
    var tipe = data.tipe || "-";

    // Menyisipkan / Append baris baru di posisi paling bawah
    sheet.appendRow([timestamp, nis, nama, kelas, tipe]);

    // Mengembalikan status sukses ke klien (Frontend)
    var result = { "status": "success", "message": "Data berhasil disimpan" };
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Menangkap kesalahan dan mengembalikannya ke klien
    var errResult = { "status": "error", "message": error.toString() };
    return ContentService.createTextOutput(JSON.stringify(errResult))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * =========================================================================
 * FUNGSI SETUP MANDIRI - HARUS DIJALANKAN SEKALI SEBELUM WEBAPP DIPAKAI
 * =========================================================================
 * Cara Pakai:
 * 1. Di editor Apps Script, pilih fungsi "setupDatabase" di dropdown atas.
 * 2. Klik tombol "Run" (Jalankan).
 * 3. Beri izin akses jika diminta (Authorize).
 */
function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "DataAbsensi";
  var sheet = ss.getSheetByName(sheetName);

  // Buat sheet baru jika belum ada
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    // Hapus sheet yang lama dan buat yang baru agar bersih (Opsional)
    // ss.deleteSheet(sheet);
    // sheet = ss.insertSheet(sheetName);
    
    // Atau hanya membersihkan isi sel agar tidak hilang sheet-nya:
    sheet.clear(); 
  }

  // Nama-nama kolom Header
  var headers = ["Timestamp", "NIS", "Nama Lengkap", "Kelas", "Tipe Absensi"];
  
  // Mengambil rentang sel baris pertama sesuai jumlah header
  var range = sheet.getRange(1, 1, 1, headers.length);

  // Mengatur nilai header
  range.setValues([headers]);
  
  // *** STYLING HEADER OTOMATIS ***
  range.setBackground("#0ea5e9"); // Warna Biru Brand Frontend
  range.setFontColor("#FFFFFF");  // Font Putih
  range.setFontWeight("bold");
  range.setHorizontalAlignment("center");
  
  // Membekukan/Freeze baris pertama agar selalu terlihat saat discroll
  sheet.setFrozenRows(1);

  // Menyesuaikan lebar kolom secara otomatis (Auto-resize)
  for (var i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  // Hanya log informasi bahwa operasional berjalan sukses
  Logger.log("Database 'DataAbsensi' Berhasil Dibuat dan Disiapkan!");
}
