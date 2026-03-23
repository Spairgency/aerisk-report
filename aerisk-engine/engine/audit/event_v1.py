"""
ETAPA 15.1 – Audit Event Contract V1
Defines the immutable structure for audit logging and replay.
STABLE – DO NOT MODIFY
"""

from dataclasses import dataclass
from typing import Dict, Any, Optional
from datetime import datetime


@dataclass(frozen=True)
class AuditEventV1:
    """
    Stable audit event – V1 (IMMUTABLE)
    """
    event_id: str
    engine_version: str
    timestamp: datetime

    request: Dict[str, Any]
    response: Dict[str, Any]

    profile: str
    debug: bool

    metadata: Optional[Dict[str, Any]] = None
