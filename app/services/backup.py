"""Backup engine: fetch config, store locally, deliver, enforce retention."""
import re
from datetime import datetime
from pathlib import Path

from ..config import BACKUP_DIR
from ..db import db, get_settings
from .connector import fetch_config
from .storage_backends import send_email, send_gdrive, send_sftp

SAFE = re.compile(r"[^A-Za-z0-9_.-]+")


def _safe_name(name: str) -> str:
    return SAFE.sub("_", name).strip("_") or "device"


def enforce_retention(conn, device_id: int, device_name: str, retention: int):
    retention = max(1, min(10, int(retention or 5)))
    rows = conn.execute(
        "SELECT id, filepath FROM backups WHERE device_id=? ORDER BY created_at DESC, id DESC",
        (device_id,),
    ).fetchall()
    for row in rows[retention:]:
        try:
            p = Path(row["filepath"])
            if p.exists():
                p.unlink()
        except Exception:
            pass
        conn.execute("DELETE FROM backups WHERE id=?", (row["id"],))


def deliver(device: dict, settings: dict, filepath: Path, filename: str) -> str:
    mode = device.get("storage_mode", "local")
    messages = []
    if mode in ("all", "email"):
        messages.append(send_email(settings, filepath, filename, device))
    if mode in ("all", "sftp"):
        messages.append(send_sftp(settings, filepath, filename, device))
    if mode in ("all", "gdrive"):
        messages.append(send_gdrive(settings, filepath, filename, device))
    return " | ".join(messages) if messages else "local"


def backup_device(device_id: int, triggered_by: str = "manual") -> dict:
    with db() as conn:
        dev = conn.execute("SELECT * FROM devices WHERE id=?", (device_id,)).fetchone()
        if not dev:
            return {"success": False, "error": "Device not found"}
        device = dict(dev)
        settings = get_settings(conn)

    result = fetch_config(device)
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    if not result.get("success"):
        with db() as conn:
            conn.execute(
                "UPDATE devices SET status='offline', version=COALESCE(NULLIF(?,''),version) WHERE id=?",
                (result.get("version", ""), device_id),
            )
            conn.execute(
                "INSERT INTO backups(device_id, device_name, filename, filepath, size, status, message) "
                "VALUES(?,?,?,?,0,'failed',?)",
                (device_id, device["name"], "-", "-", result.get("error", "unknown error")),
            )
        return {"success": False, "error": result.get("error")}

    folder = BACKUP_DIR / _safe_name(device["name"])
    folder.mkdir(parents=True, exist_ok=True)
    filename = f"{_safe_name(device['name'])}_{stamp}.txt"
    filepath = folder / filename
    filepath.write_text(result["config"], encoding="utf-8")
    size = filepath.stat().st_size

    delivery = deliver(device, settings, filepath, filename)
    with db() as conn:
        conn.execute(
            "INSERT INTO backups(device_id, device_name, filename, filepath, size, storage, status, message) "
            "VALUES(?,?,?,?,?,?, 'success', ?)",
            (
                device_id,
                device["name"],
                filename,
                str(filepath),
                size,
                device.get("storage_mode", "local"),
                delivery,
            ),
        )
        conn.execute(
            "UPDATE devices SET status='online', version=?, last_backup_at=? WHERE id=?",
            (result.get("version") or "Unknown", now, device_id),
        )
        enforce_retention(conn, device_id, device["name"], device.get("retention", 5))

    return {
        "success": True,
        "version": result.get("version"),
        "filename": filename,
        "size": size,
        "delivery": delivery,
        "at": now,
    }


def backup_all_enabled(triggered_by: str = "scheduler", group_ids=None) -> dict:
    with db() as conn:
        sql = "SELECT id FROM devices WHERE enabled=1"
        params = []
        if group_ids:
            marks = ",".join("?" for _ in group_ids)
            sql += f" AND group_id IN ({marks})"
            params.extend(group_ids)
        ids = [r["id"] for r in conn.execute(sql, params).fetchall()]

    ok = fail = 0
    for device_id in ids:
        res = backup_device(device_id, triggered_by)
        if res.get("success"):
            ok += 1
        else:
            fail += 1
    return {"total": len(ids), "success": ok, "failed": fail}


def refresh_all_status():
    from concurrent.futures import ThreadPoolExecutor

    from .connector import check_tcp

    with db() as conn:
        devices = [dict(r) for r in conn.execute("SELECT id, host, port FROM devices").fetchall()]

    def check(dev):
        online = check_tcp(dev["host"], dev.get("port") or 22, timeout=3)
        return dev["id"], "online" if online else "offline"

    with ThreadPoolExecutor(max_workers=10) as pool:
        updates = list(pool.map(check, devices))

    with db() as conn:
        for device_id, status in updates:
            conn.execute("UPDATE devices SET status=? WHERE id=?", (status, device_id))
