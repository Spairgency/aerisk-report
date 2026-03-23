"""
ETAPA 15 – Engine Versioning (FROZEN)
Single source of truth for engine identity and version.
DO NOT MODIFY AFTER v1.0.0 TAG
"""

ENGINE_NAME = "AERISK_ENGINE"
ENGINE_VERSION = "1.0.0"
ENGINE_STAGE = "production"


def get_engine_version() -> str:
    return ENGINE_VERSION