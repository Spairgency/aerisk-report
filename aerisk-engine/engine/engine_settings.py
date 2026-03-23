

"""
AERISK ENGINE – Core Settings
Version: 1.0.0
Purpose: Centralized configuration for the AERISK risk engine.
NOTE: This file contains ONLY constants and configuration.
No business logic, no computations.
"""

from typing import List, Dict

# =========================
# Engine metadata
# =========================

ENGINE_NAME: str = "AERISK_ENGINE"
ENGINE_VERSION: str = "1.0.0"
ENGINE_MODE: str = "DUMMY"  # DUMMY | REAL (future)

# =========================
# Supported hazards
# =========================

SUPPORTED_HAZARDS: List[str] = [
    "frost",
    "drought",
    "excess_rain",
]

# =========================
# Risk level thresholds
# =========================
# Used to map numeric risk_score -> categorical risk_level

RISK_LEVEL_THRESHOLDS: Dict[str, float] = {
    "LOW": 0.30,
    "MEDIUM": 0.60,
    "HIGH": 0.80,
    "EXTREME": 1.00,
}

# =========================
# Monte Carlo defaults
# =========================

MONTE_CARLO_DEFAULTS: Dict[str, int] = {
    "simulations": 5000,
    "confidence_level": 95,
}

# =========================
# Spatial defaults
# =========================

DEFAULT_SPATIAL_RESOLUTION_KM: int = 5

# =========================
# Temporal defaults
# =========================

DEFAULT_FORECAST_HORIZON_DAYS: int = 30

# =========================
# Safety limits (hard caps)
# =========================

MAX_MONTE_CARLO_SIMULATIONS: int = 20000
MIN_MONTE_CARLO_SIMULATIONS: int = 1000