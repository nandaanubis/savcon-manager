import os
import threading
import time
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, PlainTextResponse

from .config import BACKGROUND_DIR
from .auth import (
    create_token,
    get_current_user,
    hash_password,
    require_admin,
    verify_password,
)
from .db import db, get_settings, log_action, save_settings
from .schemas import (
    BackupRunIn,
    DeviceIn,
    GroupIn,
    LoginIn,
    PasswordChangeIn,
    SettingsIn,
    UserIn,
)
from .services.backup import backup_all_enabled, backup_device, refresh_all_status
from .services.connector import check_tcp, fetch_config
from .services.scheduler import reload_jobs
from .services.storage_backends import send_email, send_gdrive, send_sftp

router = APIRouter(prefix="/api")

_login_lock = threading.Lock()
_login_attempts: dict[str, tuple[int, float]] = {}
LOGIN_LIMIT = 5
LOGIN_WINDOW = 300  # seconds


# ---------- Public (login background) ----------
@router.get("/public/background")
def public_background():
    s = get_settings()
    return {
        "background": s.get("login_background", "aurora"),
        "opacity": s.get("login_opacity", "72"),
    }


@router.put("/settings/background")
def set_background(data: dict, user: dict = Depends(require_admin)):
    save_settings({"login_background": str(data.get("value", "aurora"))})
    return {"message": "ok"}


async def _save_background_file(file: UploadFile):
    import time

    upload_dir = BACKGROUND_DIR
    upload_dir.mkdir(parents=True, exist_ok=True)
    ext = Path(file.filename or "").suffix.lower()
    if ext not in (".png", ".jpg", ".jpeg", ".webp", ".gif"):
        raise HTTPException(status_code=400, detail="Format gambar tidak didukung")
    # Unique name per upload so the browser never serves a cached old image.
    name = f"login-bg-{int(time.time() * 1000)}{ext}"
    dest = upload_dir / name
    content = await file.read()
    if len(content) > 8 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Ukuran maksimal 8MB")
    dest.write_bytes(content)
    for old in upload_dir.glob("login-bg*"):
        if old != dest and old.is_file():
            try:
                old.unlink()
            except Exception:
                pass
    url = f"/media/backgrounds/{name}"
    save_settings({"login_background": url})
    return {"url": url}


@router.post("/settings/background/upload")
async def admin_upload_background(file: UploadFile = File(...), user: dict = Depends(require_admin)):
    return await _save_background_file(file)


# ---------- Auth ----------
@router.post("/auth/login")
def login(data: LoginIn, request: Request):
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    with _login_lock:
        count, reset_at = _login_attempts.get(ip, (0, now + LOGIN_WINDOW))
        if now > reset_at:
            count, reset_at = 0, now + LOGIN_WINDOW
        if count >= LOGIN_LIMIT:
            raise HTTPException(status_code=429, detail="Terlalu banyak percobaan login. Coba lagi nanti.")
        _login_attempts[ip] = (count + 1, reset_at)

    with db() as conn:
        row = conn.execute("SELECT * FROM users WHERE username=?", (data.username,)).fetchone()
    if not row or not verify_password(data.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Username atau password salah")
    with _login_lock:
        _login_attempts.pop(ip, None)
    token = create_token(row["username"], row["role"])
    log_action(row["username"], "login", "Successful login")
    return {
        "token": token,
        "user": {"id": row["id"], "username": row["username"], "role": row["role"]},
    }


@router.get("/auth/me")
def me(user: dict = Depends(get_current_user)):
    return user


@router.post("/auth/change-password")
def change_password(data: PasswordChangeIn, user: dict = Depends(get_current_user)):
    with db() as conn:
        row = conn.execute("SELECT * FROM users WHERE id=?", (user["id"],)).fetchone()
        if not row or not verify_password(data.old_password, row["password_hash"]):
            raise HTTPException(status_code=400, detail="Password lama salah")
        conn.execute(
            "UPDATE users SET password_hash=? WHERE id=?",
            (hash_password(data.new_password), user["id"]),
        )
    log_action(user["username"], "change_password", "Password updated")
    return {"message": "Password berhasil diubah"}


# ---------- Users ----------
@router.get("/users")
def list_users(user: dict = Depends(require_admin)):
    with db() as conn:
        rows = conn.execute(
            "SELECT id, username, role, created_at FROM users ORDER BY id"
        ).fetchall()
    return [dict(r) for r in rows]


@router.post("/users", status_code=201)
def add_user(data: UserIn, user: dict = Depends(require_admin)):
    try:
        with db() as conn:
            cur = conn.execute(
                "INSERT INTO users(username, password_hash, role) VALUES(?,?,?)",
                (data.username, hash_password(data.password), data.role),
            )
            uid = cur.lastrowid
    except Exception:
        raise HTTPException(status_code=400, detail="Username sudah digunakan")
    log_action(user["username"], "add_user", f"Created user {data.username}")
    return {"id": uid, "username": data.username, "role": data.role}


@router.delete("/users/{uid}")
def delete_user(uid: int, user: dict = Depends(require_admin)):
    if uid == user["id"]:
        raise HTTPException(status_code=400, detail="Tidak bisa menghapus akun sendiri")
    with db() as conn:
        row = conn.execute("SELECT username FROM users WHERE id=?", (uid,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User tidak ditemukan")
        conn.execute("DELETE FROM users WHERE id=?", (uid,))
    log_action(user["username"], "delete_user", f"Deleted user {row['username']}")
    return {"message": "User dihapus"}


# ---------- Groups ----------
@router.get("/groups")
def list_groups(user: dict = Depends(get_current_user)):
    with db() as conn:
        rows = conn.execute(
            "SELECT g.*, (SELECT COUNT(*) FROM devices d WHERE d.group_id=g.id) AS device_count "
            "FROM groups g ORDER BY g.id"
        ).fetchall()
    return [dict(r) for r in rows]


@router.post("/groups", status_code=201)
def add_group(data: GroupIn, user: dict = Depends(get_current_user)):
    try:
        with db() as conn:
            cur = conn.execute(
                "INSERT INTO groups(name, description) VALUES(?,?)",
                (data.name, data.description),
            )
            gid = cur.lastrowid
    except Exception:
        raise HTTPException(status_code=400, detail="Nama group sudah digunakan")
    log_action(user["username"], "add_group", data.name)
    return {"id": gid, "name": data.name, "description": data.description}


@router.put("/groups/{gid}")
def update_group(gid: int, data: GroupIn, user: dict = Depends(get_current_user)):
    with db() as conn:
        conn.execute(
            "UPDATE groups SET name=?, description=? WHERE id=?",
            (data.name, data.description, gid),
        )
    log_action(user["username"], "update_group", data.name)
    return {"message": "Group diperbarui"}


@router.delete("/groups/{gid}")
def delete_group(gid: int, user: dict = Depends(get_current_user)):
    with db() as conn:
        conn.execute("DELETE FROM groups WHERE id=?", (gid,))
    log_action(user["username"], "delete_group", str(gid))
    return {"message": "Group dihapus"}


# ---------- Devices ----------
def _device_rows(where="", params=()):
    with db() as conn:
        rows = conn.execute(
            "SELECT d.*, g.name AS group_name FROM devices d "
            "LEFT JOIN groups g ON d.group_id=g.id " + where + " ORDER BY d.id",
            params,
        ).fetchall()
    return [dict(r) for r in rows]


@router.get("/devices")
def list_devices(
    group_id: int | None = None,
    search: str = "",
    user: dict = Depends(get_current_user),
):
    where, params = [], []
    if group_id:
        where.append("d.group_id=?")
        params.append(group_id)
    if search:
        where.append("(d.name LIKE ? OR d.host LIKE ?)")
        params.extend([f"%{search}%", f"%{search}%"])
    clause = "WHERE " + " AND ".join(where) if where else ""
    return _device_rows(clause, params)


@router.get("/devices/{did}")
def get_device(did: int, user: dict = Depends(get_current_user)):
    rows = _device_rows("WHERE d.id=?", (did,))
    if not rows:
        raise HTTPException(status_code=404, detail="Device tidak ditemukan")
    return rows[0]


@router.post("/devices", status_code=201)
def add_device(data: DeviceIn, user: dict = Depends(get_current_user)):
    with db() as conn:
        cur = conn.execute(
            "INSERT INTO devices(name, host, port, device_type, connection, username, password, "
            "group_id, retention, storage_mode, enabled, export_sensitive, notes) "
            "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (
                data.name, data.host, data.port, data.device_type, data.connection,
                data.username, data.password, data.group_id, data.retention,
                data.storage_mode, data.enabled, data.export_sensitive, data.notes,
            ),
        )
        did = cur.lastrowid
    log_action(user["username"], "add_device", data.name)
    return {"id": did, "message": "Device ditambahkan"}


@router.put("/devices/{did}")
def update_device(did: int, data: DeviceIn, user: dict = Depends(get_current_user)):
    with db() as conn:
        row = conn.execute("SELECT id, password FROM devices WHERE id=?", (did,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Device tidak ditemukan")
        password = data.password or row["password"]
        conn.execute(
            "UPDATE devices SET name=?, host=?, port=?, device_type=?, connection=?, username=?, "
            "password=?, group_id=?, retention=?, storage_mode=?, enabled=?, export_sensitive=?, "
            "notes=? WHERE id=?",
            (
                data.name, data.host, data.port, data.device_type, data.connection,
                data.username, password, data.group_id, data.retention,
                data.storage_mode, data.enabled, data.export_sensitive, data.notes, did,
            ),
        )
    log_action(user["username"], "update_device", data.name)
    return {"message": "Device diperbarui"}


@router.delete("/devices/{did}")
def delete_device(did: int, user: dict = Depends(get_current_user)):
    with db() as conn:
        files = [r["filepath"] for r in conn.execute(
            "SELECT filepath FROM backups WHERE device_id=?", (did,)
        ).fetchall()]
        conn.execute("DELETE FROM devices WHERE id=?", (did,))
        conn.execute("DELETE FROM backups WHERE device_id=?", (did,))
    for f in files:
        try:
            p = Path(f)
            if p.exists():
                p.unlink()
        except Exception:
            pass
    log_action(user["username"], "delete_device", str(did))
    return {"message": "Device dihapus"}


@router.post("/devices/{did}/test")
def test_device(did: int, user: dict = Depends(get_current_user)):
    rows = _device_rows("WHERE d.id=?", (did,))
    if not rows:
        raise HTTPException(status_code=404, detail="Device tidak ditemukan")
    result = fetch_config(rows[0], timeout=15, version_only=True)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Gagal terhubung"))
    with db() as conn:
        conn.execute(
            "UPDATE devices SET version=?, status='online' WHERE id=?",
            (result.get("version") or "Unknown", did),
        )
    return {"success": True, "version": result.get("version") or "Unknown"}


@router.post("/devices/{did}/status")
def device_status(did: int, user: dict = Depends(get_current_user)):
    rows = _device_rows("WHERE d.id=?", (did,))
    if not rows:
        raise HTTPException(status_code=404, detail="Device tidak ditemukan")
    dev = rows[0]
    online = check_tcp(dev["host"], dev.get("port") or 22)
    with db() as conn:
        conn.execute("UPDATE devices SET status=? WHERE id=?", ("online" if online else "offline", did))
    return {"online": online}


@router.post("/devices/refresh-status")
def refresh_status(user: dict = Depends(get_current_user)):
    refresh_all_status()
    return {"message": "Status diperbarui"}


@router.post("/devices/{did}/backup")
def backup_single(did: int, user: dict = Depends(get_current_user)):
    result = backup_device(did, triggered_by=user["username"])
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Backup gagal"))
    log_action(user["username"], "backup", f"Device #{did} {result.get('filename','')}")
    return result


# ---------- Backups ----------
@router.get("/backups")
def list_backups(
    device_id: int | None = None,
    limit: int = 200,
    user: dict = Depends(get_current_user),
):
    with db() as conn:
        if device_id:
            rows = conn.execute(
                "SELECT * FROM backups WHERE device_id=? ORDER BY id DESC LIMIT ?",
                (device_id, limit),
            ).fetchall()
        else:
            rows = conn.execute("SELECT * FROM backups ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
    return [dict(r) for r in rows]


@router.get("/backups/{bid}/view")
def view_backup(bid: int, user: dict = Depends(get_current_user)):
    with db() as conn:
        row = conn.execute("SELECT * FROM backups WHERE id=?", (bid,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Backup tidak ditemukan")
    p = Path(row["filepath"])
    if not p.exists():
        raise HTTPException(status_code=404, detail="File tidak ditemukan di storage")
    return PlainTextResponse(p.read_text(encoding="utf-8", errors="replace"), media_type="text/plain")


@router.get("/backups/{bid}/download")
def download_backup(bid: int, user: dict = Depends(get_current_user)):
    with db() as conn:
        row = conn.execute("SELECT * FROM backups WHERE id=?", (bid,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Backup tidak ditemukan")
    p = Path(row["filepath"])
    if not p.exists():
        raise HTTPException(status_code=404, detail="File tidak ditemukan di storage")
    return FileResponse(str(p), filename=row["filename"], media_type="text/plain")


@router.delete("/backups/{bid}")
def delete_backup(bid: int, user: dict = Depends(get_current_user)):
    with db() as conn:
        row = conn.execute("SELECT filepath FROM backups WHERE id=?", (bid,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Backup tidak ditemukan")
        try:
            p = Path(row["filepath"])
            if p.exists():
                p.unlink()
        except Exception:
            pass
        conn.execute("DELETE FROM backups WHERE id=?", (bid,))
    return {"message": "Backup dihapus"}


@router.post("/backups/run")
def run_backup(data: BackupRunIn, user: dict = Depends(get_current_user)):
    if data.device_ids:
        result = {"total": len(data.device_ids), "success": 0, "failed": 0}
        for did in data.device_ids:
            res = backup_device(did, triggered_by=user["username"])
            result["success" if res.get("success") else "failed"] += 1
    elif data.group_id:
        result = backup_all_enabled(triggered_by=user["username"], group_ids=[data.group_id])
    else:
        result = backup_all_enabled(triggered_by=user["username"])
    log_action(user["username"], "run_backup", str(result))
    return result


# ---------- Settings ----------
@router.get("/settings")
def get_all_settings(user: dict = Depends(get_current_user)):
    settings = get_settings()
    if user.get("role") != "admin":
        # Non-admin users must never see SMTP / SFTP / GDrive credentials.
        allowed = {
            "app_name", "login_background", "login_opacity",
            "auto_enabled", "auto_cron", "auto_groups",
        }
        settings = {k: v for k, v in settings.items() if k in allowed}
    return settings


@router.put("/settings")
def update_settings(data: SettingsIn, user: dict = Depends(require_admin)):
    if "login_opacity" in data.values:
        try:
            data.values["login_opacity"] = str(
                max(0, min(100, int(float(data.values["login_opacity"]))))
            )
        except (TypeError, ValueError):
            data.values["login_opacity"] = "72"
    save_settings(data.values)
    reload_jobs()
    log_action(user["username"], "update_settings", ",".join(data.values.keys()))
    return {"message": "Pengaturan disimpan"}


@router.post("/settings/test/{backend}")
def test_backend(backend: str, user: dict = Depends(require_admin)):
    settings = get_settings()
    device = {"name": "connection-test", "host": settings.get("sftp_host", "")}
    dummy = Path(__file__).parent / "__init__.py"
    if backend == "email":
        msg = send_email(settings, dummy, "savcon-test.txt", device)
    elif backend == "sftp":
        msg = send_sftp(settings, dummy, "savcon-test.txt", device)
    elif backend == "gdrive":
        msg = send_gdrive(settings, dummy, "savcon-test.txt", device)
    else:
        raise HTTPException(status_code=400, detail="Backend tidak dikenal")
    return {"result": msg}


# ---------- Dashboard & logs ----------
@router.get("/dashboard")
def dashboard(user: dict = Depends(get_current_user)):
    with db() as conn:
        total_devices = conn.execute("SELECT COUNT(*) c FROM devices").fetchone()["c"]
        online = conn.execute("SELECT COUNT(*) c FROM devices WHERE status='online'").fetchone()["c"]
        offline = conn.execute("SELECT COUNT(*) c FROM devices WHERE status='offline'").fetchone()["c"]
        total_backups = conn.execute("SELECT COUNT(*) c FROM backups").fetchone()["c"]
        failed = conn.execute("SELECT COUNT(*) c FROM backups WHERE status='failed'").fetchone()["c"]
        recent = conn.execute("SELECT * FROM backups ORDER BY id DESC LIMIT 8").fetchall()
        by_type = conn.execute(
            "SELECT device_type, COUNT(*) c FROM devices GROUP BY device_type"
        ).fetchall()
        groups = conn.execute("SELECT COUNT(*) c FROM groups").fetchone()["c"]
    return {
        "devices": total_devices,
        "online": online,
        "offline": offline,
        "backups": total_backups,
        "failed": failed,
        "groups": groups,
        "recent": [dict(r) for r in recent],
        "by_type": [dict(r) for r in by_type],
    }


@router.get("/activity")
def activity(limit: int = 100, user: dict = Depends(get_current_user)):
    with db() as conn:
        rows = conn.execute(
            "SELECT * FROM activity_logs ORDER BY id DESC LIMIT ?", (limit,)
        ).fetchall()
    return [dict(r) for r in rows]
