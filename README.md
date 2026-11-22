# Savcon Manager

**Release v1.0.0 (2026.11.22) · Author: Nanda Anubis**

Aplikasi backup konfigurasi perangkat jaringan berbasis web, dijalankan dengan Docker.

## Fitur
- Backup **MikroTik RouterOS v6/v7** via `/export` (SSH/Telnet)
- Backup **Cisco, Dell FTOS, Alcatel** via `show running-config`
- Deteksi versi OS otomatis (`show version` / `/system resource print`)
- Retention 1–10 file per device (file lama otomatis dihapus)
- Penyimpanan: **Local**, **Email (SMTP)**, **Google Drive (Service Account)**, **SFTP**, atau semua sekaligus
- Web UI modern (dark glassmorphism), background login bisa diganti / di-upload
- Koneksi SSH atau Telnet, custom port, username & password
- Group backup buatan sendiri (mis. Mikrotik Client, Mikrotik Core)
- Daftar device lengkap: status online/offline, versi OS, backup terakhir
- Manajemen user + ganti password
- Backup manual (per device / terpilih / semua) dan otomatis via cron (APScheduler)

## Deploy
```bash
docker compose up -d --build
```
Akses: `http://172.20.20.43:8111`

Login default: **admin / admin123** (segera ganti).

## Konfigurasi
Semua pengaturan (SMTP, SFTP, GDrive, cron, background) melalui menu **Settings** di UI.
Data tersimpan di folder `./data` (SQLite + file backup + background).

## Cron
Format standar 5 field: `menit jam hari bulan hari-minggu`
- `0 2 * * *` → tiap jam 02.00
- `*/15 * * * *` → tiap 15 menit

## Endpoint API
Dokumentasi interaktif: `http://172.20.20.43:8111/docs`
