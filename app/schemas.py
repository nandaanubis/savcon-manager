from typing import Optional

from pydantic import BaseModel, Field


class LoginIn(BaseModel):
    username: str
    password: str


class PasswordChangeIn(BaseModel):
    old_password: str
    new_password: str = Field(min_length=4)


class UserIn(BaseModel):
    username: str
    password: str = Field(min_length=4)
    role: str = "user"


class GroupIn(BaseModel):
    name: str
    description: str = ""


class DeviceIn(BaseModel):
    name: str
    host: str
    port: int = 22
    device_type: str = "mikrotik"
    connection: str = "ssh"
    username: str
    password: str = ""
    group_id: Optional[int] = None
    retention: int = Field(default=5, ge=1, le=10)
    storage_mode: str = "local"
    enabled: int = 1
    export_sensitive: int = 1
    notes: str = ""


class SettingsIn(BaseModel):
    values: dict[str, str]


class BackupRunIn(BaseModel):
    device_ids: Optional[list[int]] = None
    group_id: Optional[int] = None
