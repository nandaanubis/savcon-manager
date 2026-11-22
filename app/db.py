import sqlite3
from contextlib import contextmanager
from .config import DB_PATH

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  host TEXT NOT NULL,
  port INTEGER NOT NULL DEFAULT 22,
  device_type TEXT NOT NULL DEFAULT 'mikrotik',
  connection TEXT NOT NULL DEFAULT 'ssh',
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  group_id INTEGER,
  retention INTEGER NOT NULL DEFAULT 5,
  storage_mode TEXT NOT NULL DEFAULT 'local',
  version TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'unknown',
  last_backup_at TEXT,
  enabled INTEGER NOT NULL DEFAULT 1,
  export_sensitive INTEGER NOT NULL DEFAULT 1,
  notes TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(group_id) REFERENCES groups(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS backups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id INTEGER NOT NULL,
  device_name TEXT NOT NULL,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  size INTEGER DEFAULT 0,
  storage TEXT DEFAULT 'local',
  status TEXT DEFAULT 'success',
  message TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(device_id) REFERENCES devices(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT DEFAULT '',
  action TEXT NOT NULL,
  detail TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_backups_device ON backups(device_id);
CREATE INDEX IF NOT EXISTS idx_devices_group ON devices(group_id);
"""

DEFAULT_SETTINGS = {
    "smtp_enabled": "0", "smtp_host": "", "smtp_port": "587", "smtp_user": "",
    "smtp_password": "", "smtp_from": "", "smtp_to": "", "smtp_tls": "1",
    "sftp_enabled": "0", "sftp_host": "", "sftp_port": "22", "sftp_user": "",
    "sftp_password": "", "sftp_path": "/backups",
    "gdrive_enabled": "0", "gdrive_credentials": "", "gdrive_folder_id": "",
    "auto_enabled": "0", "auto_cron": "0 2 * * *", "auto_groups": "",
    "login_background": "aurora", "login_opacity": "72", "app_name": "Savcon Manager",
}


def connect():
    conn = sqlite3.connect(str(DB_PATH), timeout=30, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


@contextmanager
def db():
    conn = connect()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    with db() as conn:
        conn.executescript(SCHEMA)
        # migrate existing databases
        cols = {r["name"] for r in conn.execute("PRAGMA table_info(devices)").fetchall()}
        if "export_sensitive" not in cols:
            conn.execute("ALTER TABLE devices ADD COLUMN export_sensitive INTEGER NOT NULL DEFAULT 1")
        for k, v in DEFAULT_SETTINGS.items():
            conn.execute(
                "INSERT OR IGNORE INTO settings(key, value) VALUES(?, ?)", (k, v)
            )


def get_settings(conn=None):
    own = conn is None
    if own:
        conn = connect()
    try:
        rows = conn.execute("SELECT key, value FROM settings").fetchall()
        result = dict(DEFAULT_SETTINGS)
        for r in rows:
            result[r["key"]] = r["value"]
        return result
    finally:
        if own:
            conn.close()


def save_settings(values: dict, conn=None):
    own = conn is None
    if own:
        conn = connect()
    try:
        for k, v in values.items():
            conn.execute(
                "INSERT INTO settings(key,value) VALUES(?,?) "
                "ON CONFLICT(key) DO UPDATE SET value=excluded.value",
                (k, str(v)),
            )
        conn.commit()
    finally:
        if own:
            conn.close()


def log_action(username, action, detail=""):
    with db() as conn:
        conn.execute(
            "INSERT INTO activity_logs(username, action, detail) VALUES(?,?,?)",
            (username, action, detail),
        )
