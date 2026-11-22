"""Device connector: SSH / Telnet with per-vendor command profiles."""
import re
import socket
import telnetlib
import time

import paramiko

ANSI_RE = re.compile(r"\x1b\[[0-9;?]*[ -\/]*[@-~]|\x1b\][^\x07]*(?:\x07|\x1b\\)")

COMMAND_PROFILES = {
    "mikrotik": "/export",
    "cisco": "show running-config",
    "dell_ftos": "show running-config",
    # OmniSwitch (AOS) does not support "show running-config"
    "alcatel": "show configuration snapshot",
}
PAGING_COMMANDS = {
    "cisco": ["terminal length 0"],
    "dell_ftos": ["terminal length 0"],
    # "show configuration snapshot" already prints the full, unpaged config
    "alcatel": [],
}
VERSION_COMMANDS = {
    "mikrotik": "/system resource print",
    "cisco": "show version",
    "dell_ftos": "show version",
    "alcatel": "show version",
}
# RouterOS: only the standard `export` command is used. The `show-sensitive`
# flag includes secrets (e.g. PPP passwords) when the account allows it.
ERROR_MARKERS = [
    "insufficient permissions",
    "not enough permissions",
    "permission denied",
    "failure:",
    "bad command name",
    "no such command",
    "invalid command name",
    "authentication failed",
    "login failure",
    "login incorrect",
    "access denied",
    "invalid password",
    "invalid entry",
]
LOGIN_ERROR_MARKERS = [
    "authentication failed",
    "login failure",
    "login incorrect",
    "access denied",
    "invalid password",
    "invalid credentials",
]

VERSION_PATTERNS = [
    r"version\s*:\s*([0-9][^\s\r\n]*)",
    r"\bVersion\s+([0-9][^\s,;\r\n]*)",
    r"software\s+version\s*[:\-]?\s*([0-9][^\s\r\n]*)",
    r"RouterOS\s+([0-9][^\s\r\n]*)",
    r"\bOS\s+([0-9][^\s\r\n]*)",
]


def clean(text: str) -> str:
    text = ANSI_RE.sub("", text)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text


def parse_version(text: str) -> str:
    for pattern in VERSION_PATTERNS:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            return m.group(1).strip(" ,;:")
    return ""


def _read_chan_idle(chan, timeout=20, quiet=0.7):
    data = b""
    start = time.time()
    last = time.time()
    while time.time() - start < timeout:
        if chan.recv_ready():
            chunk = chan.recv(65536)
            if not chunk:
                break
            data += chunk
            last = time.time()
        elif time.time() - last > quiet:
            break
        time.sleep(0.1)
    return data.decode("utf-8", errors="ignore")


def _read_tn_idle(tn, timeout=20, quiet=0.7):
    data = b""
    start = time.time()
    last = time.time()
    while time.time() - start < timeout:
        try:
            chunk = tn.read_very_eager()
        except EOFError:
            break
        if chunk:
            data += chunk
            last = time.time()
        elif time.time() - last > quiet:
            break
        time.sleep(0.1)
    return data.decode("utf-8", errors="ignore")


def _ssh_exec(host, port, username, password, commands, timeout):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        hostname=host, port=port, username=username, password=password,
        timeout=timeout, auth_timeout=timeout, banner_timeout=timeout,
        allow_agent=False, look_for_keys=False,
    )
    results = []
    try:
        for cmd in commands:
            _in, out, err = client.exec_command(cmd, timeout=timeout)
            data = out.read().decode("utf-8", errors="ignore")
            error = err.read().decode("utf-8", errors="ignore")
            results.append(data if data.strip() else error)
    finally:
        client.close()
    return results


def _ssh_shell(host, port, username, password, commands, timeout):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        hostname=host, port=port, username=username, password=password,
        timeout=timeout, auth_timeout=timeout, banner_timeout=timeout,
        allow_agent=False, look_for_keys=False,
    )
    results = []
    try:
        chan = client.invoke_shell(term="vt100", width=240, height=2000)
        time.sleep(0.6)
        _read_chan_idle(chan, timeout=6, quiet=0.5)
        for cmd in commands:
            chan.send(cmd + "\n")
            time.sleep(0.3)
            results.append(_read_chan_idle(chan, timeout=timeout))
        chan.close()
    finally:
        client.close()
    return results


def _telnet(host, port, username, password, commands, timeout):
    tn = telnetlib.Telnet(host, port, timeout=timeout)
    try:
        tn.expect([rb"[Ll]ogin\s*[:>]", rb"[Uu]sername\s*[:>]", rb"[Uu]ser\s*[:>]"], timeout)
        tn.write(username.encode() + b"\n")
        tn.expect([rb"[Pp]assword\s*[:>]", rb"[Pp]assphrase\s*[:>]"], timeout)
        tn.write(password.encode() + b"\r\n")
        post_login = _read_tn_idle(tn, timeout=6, quiet=0.5)
        if _looks_like_login_error(post_login):
            raise RuntimeError(
                "Telnet login ditolak device - periksa username/password "
                "atau status akun (mungkin terkunci)"
            )
        results = []
        for cmd in commands:
            tn.write(cmd.encode() + b"\n")
            time.sleep(0.3)
            results.append(_read_tn_idle(tn, timeout=timeout))
        return results
    finally:
        tn.close()


def strip_echo(text: str, command: str) -> str:
    lines = text.split("\n")
    out = []
    skipped = False
    for line in lines:
        stripped = line.strip()
        if not skipped and command.lower() in stripped.lower() and not stripped.startswith("#"):
            skipped = True
            continue
        out.append(line)
    return "\n".join(out).strip("\n")


def _looks_like_error(text: str) -> bool:
    low = text.lower()
    return any(marker in low for marker in ERROR_MARKERS)


def _looks_like_login_error(text: str) -> bool:
    low = text.lower()
    return any(marker in low for marker in LOGIN_ERROR_MARKERS)


def _score_config(text: str) -> int:
    """Count meaningful (non-comment) config lines; 0 means unusable."""
    if _looks_like_error(text):
        return 0
    count = 0
    for line in text.split("\n"):
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        if s.startswith("[") and s.endswith("]"):  # CLI prompt only
            continue
        count += 1
    return count


def _transport(device, commands, timeout, force_shell=False):
    connection = device.get("connection", "ssh")
    dtype = device.get("device_type", "mikrotik")
    args = (device["host"], int(device.get("port") or (23 if connection == "telnet" else 22)),
            device.get("username", ""), device.get("password", ""), commands, timeout)
    if connection == "telnet":
        return _telnet(*args)
    if force_shell or dtype != "mikrotik":
        return _ssh_shell(*args)
    return _ssh_exec(*args)


def fetch_config(device: dict, timeout: int = 25, version_only: bool = False) -> dict:
    """Connect to a device and return its version + configuration."""
    dtype = device.get("device_type", "mikrotik")
    version_cmd = VERSION_COMMANDS.get(dtype, VERSION_COMMANDS["cisco"])
    config_cmd = COMMAND_PROFILES.get(dtype, COMMAND_PROFILES["cisco"])

    try:
        ver_raw = _transport(device, [version_cmd], timeout)
        version_text = clean(ver_raw[0]) if ver_raw else ""
        version = parse_version(version_text)
        if version_only:
            return {"success": True, "version": version}

        if dtype == "mikrotik":
            sensitive = int(device.get("export_sensitive", 1) or 0) == 1
            variants = ["/export show-sensitive", "/export"] if sensitive else ["/export"]
            best = ""
            error = ""
            for variant in variants:
                try:
                    raw = _transport(device, [variant], timeout)
                    candidate = strip_echo(clean(raw[0]), variant)
                    if _looks_like_error(candidate):
                        error = candidate.strip()[:200]
                        continue
                    if _score_config(candidate) > _score_config(best):
                        best = candidate
                    if _score_config(best) >= 1:
                        break
                except Exception as exc:
                    error = str(exc)
                    continue
            config_text = best
            if _score_config(config_text) < 1:
                # Last resort: interactive SSH shell captures streamed output.
                try:
                    raw = _ssh_shell(
                        device["host"],
                        int(device.get("port") or 22),
                        device.get("username", ""), device.get("password", ""),
                        variants, timeout,
                    )
                    for chunk, variant in zip(raw, variants):
                        candidate = strip_echo(clean(chunk), variant)
                        if _score_config(candidate) > _score_config(config_text):
                            config_text = candidate
                except Exception:
                    pass
            version = version or parse_version(config_text)
            if _score_config(config_text) < 1:
                detail = error or (
                    "Export kosong. Berikan policy 'read' + 'write' + 'sensitive' "
                    "pada user MikroTik (System → Users → Groups), atau gunakan "
                    "user dengan policy 'full'."
                )
                return {"success": False, "error": detail, "version": version}
            return {"success": True, "version": version, "config": config_text}

        # Cisco / Dell FTOS / Alcatel: disable paging where needed, then read version + config.
        paging = PAGING_COMMANDS.get(dtype, ["terminal length 0"])
        raw = _transport(
            device,
            paging + [version_cmd, config_cmd],
            timeout,
            force_shell=(device.get("connection", "ssh") == "ssh"),
        )
        config_text = strip_echo(clean(raw[-1]), config_cmd)
        # some read-only accounts cannot run "show version"; fall back to the
        # version line inside running-config (e.g. NX-OS: version 5.0(3)U5(1f))
        version = version or parse_version(clean(raw[-2])) or parse_version(config_text)
        if _score_config(config_text) < 1:
            return {
                "success": False,
                "version": version,
                "error": "Output 'show running-config' kosong atau ditolak. Periksa hak akses user.",
            }
        return {"success": True, "version": version, "config": config_text}

    except Exception as exc:
        return {"success": False, "error": str(exc)}


def check_tcp(host: str, port: int, timeout: int = 3) -> bool:
    try:
        with socket.create_connection((host, int(port)), timeout=timeout):
            return True
    except Exception:
        return False
