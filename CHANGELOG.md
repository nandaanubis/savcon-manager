# 📝 Changelog

All notable changes to **Savcon Manager** are documented here.

---

## [Unreleased]

### ✨ Added
- 📋 **Duplicate device** action — clone an existing device with the same credentials, port and type; the name gets a `-Copy` suffix and can be edited before saving.

---

## [1.0.1] - 2026-11-23 — 🔒 Security Release

### 🔴 Fixed — Critical
- **Database exposure**: `/media` was mounting the whole `data/` directory, allowing anyone to download `savcon.db` (device passwords, user password hashes, SMTP/SFTP/GDrive credentials) without authentication. Now only `data/backgrounds` is served, and unknown `/media/*` paths return `404`.
- **Predictable JWT secret**: the default `SECRET_KEY` was public in Git, allowing forged admin tokens. A random 64-character key is now generated on first run and persisted to `data/secret.key` with `0600` permissions.

### 🟠 Fixed — Moderate
- **Background changes required no auth**: `POST /api/public/background` and its upload endpoint are replaced with admin-only endpoints.
- **Credential leak to non-admin users**: `GET /api/settings` now returns only non-sensitive keys for regular users.
- **No login throttling**: added rate limiting — 5 failed attempts / 5 minutes per IP (HTTP `429`).
- **Outdated build tooling**: upgraded `pip` → 26.3 and `setuptools` → 84.2.1, clearing 16 dependency advisories.
- **Missing security headers**: added `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`.

### 📄 Documentation
- Added a **Security Notes** section to the README, including the accepted Paramiko SHA-1 tradeoff.

### ⚠️ Known issue (accepted)
- `paramiko 3.5.0` — [CVE-2026-44405](https://nvd.nist.gov/vuln/detail/CVE-2026-44405) (SHA-1 host key, CVSS low / adjacent-network). Pinned intentionally so legacy Cisco NX-OS devices offering only `ssh-rsa` remain backup-able. Migrate device host keys to RSA-SHA2/Ed25519 before upgrading to Paramiko 5.x.

### ✅ Verification
```
/media/savcon.db        -> 404
background change noauth -> 401
admin login              -> 200
settings (admin)         -> 23 keys
settings (user)          -> 6 keys (no credentials)
pip audit                -> 1 accepted advisory (paramiko)
container                -> healthy
```

---

## [1.0.0] - 2026-11-22 — 🎉 Initial Release

- Backup MikroTik RouterOS v6/v7 (`/export`, optional `show-sensitive` for PPP secrets)
- Backup Cisco IOS/NX-OS, Dell FTOS and Alcatel OmniSwitch
- SSH & Telnet with custom ports and credentials
- Retention 1–10 files per device
- Storage: Local, Email (SMTP), Google Drive, SFTP or all
- Device groups, manual & cron backups
- Online/offline status, OS version detection, activity log
- Modern dark Web UI with customizable login background & opacity
- 5 languages: Indonesian, English, Español, 中文, Português
- About page with release info and author quote
