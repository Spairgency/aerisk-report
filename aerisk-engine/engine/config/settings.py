from dataclasses import dataclass
from typing import Dict
import os
import yaml


@dataclass(frozen=True)
class RiskProfile:
    low_threshold: float
    medium_threshold: float


# -------------------------
# Default SAFE FALLBACKS
# Thresholds sunt RELATIVE la TIV (% din valoarea asigurata)
# LOW:    AAL < 5%  din TIV
# MEDIUM: AAL < 20% din TIV
# HIGH:   AAL >= 20% din TIV
# -------------------------
DEFAULT_RISK_PROFILE = RiskProfile(
    low_threshold=0.05,     # 5% din TIV
    medium_threshold=0.20,  # 20% din TIV
)

CONSERVATIVE_RISK_PROFILE = RiskProfile(
    low_threshold=0.03,     # 3% din TIV
    medium_threshold=0.12,  # 12% din TIV
)

AGGRESSIVE_RISK_PROFILE = RiskProfile(
    low_threshold=0.08,     # 8% din TIV
    medium_threshold=0.30,  # 30% din TIV
)


# -------------------------
# CONFIG LOADING
# -------------------------
def load_risk_profiles() -> Dict[str, RiskProfile]:
    """
    Loads risk profiles from YAML if provided.
    Falls back to static defaults.
    """

    config_path = os.getenv("AERISK_RISK_CONFIG")

    if not config_path:
        return _default_profiles()

    if not os.path.exists(config_path):
        return _default_profiles()

    try:
        with open(config_path, "r") as f:
            raw = yaml.safe_load(f) or {}

        profiles = {}
        for name, values in raw.get("profiles", {}).items():
            profiles[name] = RiskProfile(
                low_threshold=float(values["low_threshold"]),
                medium_threshold=float(values["medium_threshold"]),
            )

        return profiles if profiles else _default_profiles()

    except Exception:
        return _default_profiles()


def _default_profiles() -> Dict[str, RiskProfile]:
    return {
        "default": DEFAULT_RISK_PROFILE,
        "conservative": CONSERVATIVE_RISK_PROFILE,
        "aggressive": AGGRESSIVE_RISK_PROFILE,
    }
def validate_profiles(profiles: Dict[str, RiskProfile]) -> None:
    """
    Hard validation at startup.
    Engine must NOT start if config is invalid.
    """
    if not profiles:
        raise RuntimeError("No risk profiles loaded")

    for name, profile in profiles.items():
        if profile.low_threshold <= 0:
            raise RuntimeError(f"Invalid low_threshold for profile '{name}'")

        if profile.medium_threshold <= profile.low_threshold:
            raise RuntimeError(
                f"medium_threshold must be > low_threshold for profile '{name}'"
            )