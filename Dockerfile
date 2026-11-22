FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    TZ=Asia/Jakarta

WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates tzdata \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Cisco IOS/NX-OS legacy SSH hosts only offer ssh-rsa (SHA-1).
# Paramiko 4+ removed it, so pin to 3.x for legacy device compatibility.
RUN pip install --no-cache-dir "paramiko==3.5.0"

COPY app/ ./app/
RUN mkdir -p /app/data/backups /app/data/backgrounds

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -fsS http://127.0.0.1:8000/api/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
