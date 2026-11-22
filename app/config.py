import os
import secrets
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = Path(os.getenv("DATA_DIR", str(BASE_DIR / "data")))
BACKUP_DIR = DATA_DIR / "backups"
BACKGROUND_DIR = DATA_DIR / "backgrounds"
DB_PATH = DATA_DIR / "savcon.db"

for _p in (DATA_DIR, BACKUP_DIR, BACKGROUND_DIR):
    _p.mkdir(parents=True, exist_ok=True)


def _load_secret_key():
    """Never ship a predictable JWT secret. Generate and persist one if unset."""
    key = os.getenv("SECRET_KEY", "").strip()
    placeholder = "change-this-secret-in-production"
    if key and key != placeholder:
        return key
    path = DATA_DIR / "secret.key"
    if path.exists():
        saved = path.read_text(encoding="utf-8").strip()
        if saved:
            return saved
    key = secrets.token_hex(32)
    path.write_text(key, encoding="utf-8")
    try:
        path.chmod(0o600)
    except Exception:
        pass
    return key


SECRET_KEY = _load_secret_key()
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", "24"))
DEFAULT_ADMIN_USER = os.getenv("DEFAULT_ADMIN_USER", "admin")
DEFAULT_ADMIN_PASSWORD = os.getenv("DEFAULT_ADMIN_PASSWORD", "admin123")
APP_NAME = os.getenv("APP_NAME", "Savcon Manager")
TIMEZONE = os.getenv("TZ", "Asia/Jakarta")
VERSION = "1.0.1"
RELEASE = "2026.11.23"
AUTHOR = "Nanda Anubis"
