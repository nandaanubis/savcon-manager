import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = Path(os.getenv("DATA_DIR", str(BASE_DIR / "data")))
BACKUP_DIR = DATA_DIR / "backups"
DB_PATH = DATA_DIR / "savcon.db"

SECRET_KEY = os.getenv("SECRET_KEY", "savcon-manager-secret-change-me")
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", "24"))
DEFAULT_ADMIN_USER = os.getenv("DEFAULT_ADMIN_USER", "admin")
DEFAULT_ADMIN_PASSWORD = os.getenv("DEFAULT_ADMIN_PASSWORD", "admin123")
APP_NAME = os.getenv("APP_NAME", "Savcon Manager")
TIMEZONE = os.getenv("TZ", "Asia/Jakarta")
VERSION = "1.0.0"
RELEASE = "2026.11.22"
AUTHOR = "Nanda Anubis"

for _p in (DATA_DIR, BACKUP_DIR):
    _p.mkdir(parents=True, exist_ok=True)
