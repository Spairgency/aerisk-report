"""
ETAPA 15.2 – Audit Logger V1
Responsible for persisting audit events.
STABLE – DO NOT MODIFY LOGIC
"""

import json
from pathlib import Path
from engine.audit.event_v1 import AuditEventV1


class AuditLoggerV1:
    """
    Simple file-based audit logger (V1).
    Each event is stored as a JSON line.
    """

    def __init__(self, storage_path: str = "audit_logs") -> None:
        self.storage: Path = Path(storage_path)
        self.storage.mkdir(parents=True, exist_ok=True)

    def log(self, event: AuditEventV1) -> None:
        file_path: Path = self.storage / "events.log"

        def _json_safe(value):
            if hasattr(value, "isoformat"):
                return value.isoformat()
            return value

        payload: dict = {
            "event_id": event.event_id,
            "engine_version": event.engine_version,
            "timestamp": event.timestamp.isoformat(),
            "request": event.request,
            "response": event.response,
            "profile": event.profile,
            "debug": event.debug,
            "metadata": (
                {k: _json_safe(v) for k, v in event.metadata.items()}
                if event.metadata
                else None
            ),
        }

        with file_path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(payload) + "\n")
