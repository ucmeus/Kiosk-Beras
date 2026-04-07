# Demo Kiosk Beras - H.Encang

Aplikasi sistem kasir beras modern dengan dukungan multi-platform (Google Apps Script) untuk manajemen penjualan beras, inventori, dan laporan bisnis.

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Penggunaan](#-penggunaan)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Keamanan](#-keamanan)
- [Pengembangan](#-pengembangan)
- [Troubleshooting](#-troubleshooting)
- [Lisensi](#-lisensi)

## 🚀 Fitur Utama

### 🎯 **Manajemen Penjualan**
- Kasir real-time dengan kalkulasi otomatis
- Dukungan satuan liter dan kg
- Diskon loyalitas pelanggan
- Tracking profit per transaksi
- Print struk otomatis

### 📊 **Dashboard & Laporan**
- Dashboard interaktif dengan grafik profit
- Laporan harian, mingguan, bulanan
- Export laporan ke PDF
- Monitoring target penjualan harian
- Alert stok rendah

### 👥 **Manajemen User & Role**
- Role-based access control (Admin, Supervisor, Kasir, Guest)
- Permission granular per user
- Manajemen user lengkap (CRUD)
- Login dengan CAPTCHA dan Google OAuth
- Idle timeout 5 menit

### 📦 **Inventori & Supplier**
- Manajemen kategori beras (liter/kg pricing)
- Tracking stok real-time
- Manajemen supplier
- Purchase order tracking
- Reorder point alerts

### 💰 **Keuangan**
- Cash flow tracking (IN/OUT)
- Balance sheet harian
- Profit margin analysis
- Financial reporting

### 🔄 **Backup & Restore**
- Auto backup tahunan
- Manual backup/restore
- Backup history tracking
- Cloud storage integration

## 🏗️ Arsitektur Sistem

### **Versi Google Apps Script (kiosk-gs/)**
- **Frontend**: HTML5 + Tailwind CSS + JavaScript ES6+
- **Backend**: Google Apps Script (GAS)
- **Database**: Google Sheets API
- **Storage**: Google Drive
- **Charts**: Google Charts API
- **Authentication**: Google OAuth + Custom

## 💻 Persyaratan Sistem

### **Google Apps Script**
- Google Account dengan Apps Script enabled
- Google Sheets untuk database
- Google Drive untuk file storage
- Modern web browser

## 📦 Instalasi

### **1. Google Apps Script Version**

```bash
# Clone repository
git clone <repository-url>
cd kiosk-gs

# Buat Google Apps Script project baru
# 1. Buka https://script.google.com
# 2. New Project
# 3. Copy isi Code.gs ke editor
# 4. Copy isi Index.html ke HTML file
# 5. Bind ke Google Spreadsheet
# 6. Deploy sebagai Web App
```


## ⚙️ Konfigurasi

### **Google Apps Script Config**

```json
{
  "timeZone": "Asia/Jakarta",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.scriptapp"
  ]
}
```

## 🎮 Penggunaan

### **Login**
- Username: `admin` (default)
- Password: `admin123` (default)
- Atau gunakan Google OAuth

### **Role & Permissions**
- **Admin**: Full access semua fitur
- **Supervisor**: Manajemen + laporan + approval
- **Kasir**: Transaksi + pelanggan
- **Guest**: View-only dashboard

### **Workflow Utama**

1. **Setup Master Data**
   - Tambah supplier
   - Setup kategori beras
   - Input pelanggan

2. **Manajemen Inventori**
   - Input pembelian beras
   - Monitor stok
   - Setup harga jual

3. **Transaksi Kasir**
   - Pilih pelanggan
   - Input item penjualan
   - Proses pembayaran
   - Print struk

4. **Monitoring & Laporan**
   - Cek dashboard harian
   - Generate laporan
   - Backup data

## 🔌 API Reference

### **Google Apps Script Endpoints**

```javascript
// Authentication
POST /login
POST /logout
POST /googleLogin

// Master Data
GET/POST /suppliers
GET/POST /categories
GET/POST /customers
GET/POST /users

// Transactions
POST /saveTransaction
GET /getTransactions

// Reports
GET /getDailyReport
GET /getWeeklyReport
GET /getMonthlyReport

// Backup
POST /createBackup
GET /getBackupHistory
POST /restoreBackup
```


## 🗄️ Database Schema

### **Google Sheets Structure**
- **Setting**: Konfigurasi aplikasi
- **Users**: Data user dan permissions
- **Supplier**: Data supplier beras
- **KategoriBeras**: Kategori dan harga beras
- **Pelanggan**: Data pelanggan
- **Saldo**: Balance harian
- **CashFlow**: Arus kas IN/OUT
- **Pembelian**: History pembelian
- **Transaksi**: History penjualan

## 🔒 Keamanan

### **Authentication**
- Password hashing dengan bcrypt
- CAPTCHA protection
- Google OAuth integration
- Session management
- Idle timeout (5 menit)

### **Authorization**
- Role-based access control
- Permission per user
- API rate limiting
- Input validation
- XSS protection

### **Data Protection**
- Encrypted password storage
- Secure API endpoints
- HTTPS enforcement
- Backup encryption

## 🛠️ Pengembangan

### **Project Structure**

```
kiosk-gs/           # Google Apps Script version
├── Code.gs         # Backend logic
├── Index.html      # Main UI
├── appsscript.json # Project config
├── assets/         # All assets such as images, etc
├── database/       # Schema files
└── README-EMBED.md
```

### **Development Setup**

```
# Google Apps Script
# Use clasp for local development
npm install -g @google/clasp
clasp login
clasp clone <script-id>

```

### **Testing**

```
# Manual Testing
# Use browser dev tools
# Test all CRUD operations
# Test role permissions
```

## 🔧 Troubleshooting

### **Common Issues**

- "Script timeout": Increase timeout in appsscript.json
- "Quota exceeded": Check Google Apps Script quotas
- "CORS error": Configure OAuth scopes properly

### **Debug Mode**

```javascript
// Enable debug in browser console
localStorage.setItem('debug', 'true');
```

### **Logs**

- **GAS**: View in Apps Script editor → Executions
- **Browser**: Use developer tools console

## 📄 Lisensi

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**u.c.m.e | a simple wrok**
- Contact: yoe.c.me.us@gmail.com

## 🙏 Acknowledgments

- Google Apps Script Team
- Tailwind CSS
- Google Charts API

---

**Versi**: 2.0.0
**Terakhir Update**: April 2026
**Dokumentasi**: README.md
