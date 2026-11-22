from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from . import routes
from .auth import hash_password
from .config import (
    AUTHOR,
    BACKGROUND_DIR,
    DATA_DIR,
    DEFAULT_ADMIN_PASSWORD,
    DEFAULT_ADMIN_USER,
    RELEASE,
    VERSION,
)
from .db import db, init_db
from .services.scheduler import start_scheduler, stop_scheduler

STATIC_DIR = Path(__file__).parent / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    with db() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO users(username, password_hash, role) VALUES(?,?, 'admin')",
            (DEFAULT_ADMIN_USER, hash_password(DEFAULT_ADMIN_PASSWORD)),
        )
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(title="Savcon Manager", version="1.0.0", lifespan=lifespan)

app.include_router(routes.router)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
# Only expose the backgrounds folder. Mounting DATA_DIR here would leak savcon.db
# (device credentials, password hashes, SMTP/SFTP/GDrive secrets) without auth.
app.mount("/media/backgrounds", StaticFiles(directory=str(BACKGROUND_DIR)), name="backgrounds")


@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    return response


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "app": "Savcon Manager",
        "version": VERSION,
        "release": RELEASE,
        "author": AUTHOR,
    }


@app.get("/api/about")
def about():
    return {
        "app": "Savcon Manager",
        "version": VERSION,
        "release": RELEASE,
        "author": AUTHOR,
        "description": "Network configuration backup manager",
    }


@app.get("/media/{rest:path}")
def media_not_found(rest: str):
    raise HTTPException(status_code=404, detail="Not found")


@app.get("/{full_path:path}")
def spa(full_path: str):
    return FileResponse(str(STATIC_DIR / "index.html"))
