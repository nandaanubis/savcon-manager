"""APScheduler wrapper: configurable cron auto-backup + periodic status refresh."""
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from ..db import db, get_settings

scheduler = BackgroundScheduler(timezone="Asia/Jakarta")


def _auto_backup_job():
    from .backup import backup_all_enabled

    with db() as conn:
        settings = get_settings(conn)
    groups = [int(x) for x in settings.get("auto_groups", "").split(",") if x.strip().isdigit()]
    backup_all_enabled(triggered_by="scheduler", group_ids=groups or None)


def _status_job():
    from .backup import refresh_all_status

    refresh_all_status()


def reload_jobs():
    scheduler.remove_all_jobs()
    with db() as conn:
        settings = get_settings(conn)
    if settings.get("auto_enabled") == "1":
        cron = settings.get("auto_cron") or "0 2 * * *"
        try:
            scheduler.add_job(
                _auto_backup_job,
                CronTrigger.from_crontab(cron),
                id="auto_backup",
                replace_existing=True,
                max_instances=1,
                coalesce=True,
            )
        except Exception:
            pass
    scheduler.add_job(
        _status_job,
        "interval",
        minutes=5,
        id="status_refresh",
        replace_existing=True,
        max_instances=1,
    )


def start_scheduler():
    if not scheduler.running:
        scheduler.start()
    reload_jobs()


def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown(wait=False)
