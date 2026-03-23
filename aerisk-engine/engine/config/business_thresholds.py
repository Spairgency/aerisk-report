"""
Business calibration thresholds for AERISK.

This file defines how technical outputs are translated
into business-level risk decisions.
NO ML. Deterministic. Explicit.
"""

from typing import Dict


# -------------------------------------------------
# Risk score thresholds (0–100 scale)
# -------------------------------------------------

RISK_SCORE_THRESHOLDS: Dict[str, float] = {
    "LOW_MAX": 20.0,
    "MEDIUM_MAX": 50.0,
    # HIGH is anything > MEDIUM_MAX
}


# -------------------------------------------------
# Loss ratio interpretation (used for sanity checks)
# -------------------------------------------------

LOSS_RATIO_THRESHOLDS: Dict[str, float] = {
    "LOW_MAX": 0.10,     # <=10% expected loss
    "MEDIUM_MAX": 0.30,  # <=30% expected loss
    # HIGH > 30%
}


# -------------------------------------------------
# AAL (Annual Average Loss) as % of insured value
# -------------------------------------------------

AAL_PERCENT_THRESHOLDS: Dict[str, float] = {
    "LOW_MAX": 0.05,     # <=5% of TIV
    "MEDIUM_MAX": 0.20,  # <=20% of TIV
}


# -------------------------------------------------
# Helper functions
# -------------------------------------------------

def classify_risk_level(risk_score: float) -> str:
    """
    Convert numeric risk_score into business label.
    """
    if risk_score <= RISK_SCORE_THRESHOLDS["LOW_MAX"]:
        return "LOW"
    if risk_score <= RISK_SCORE_THRESHOLDS["MEDIUM_MAX"]:
        return "MEDIUM"
    return "HIGH"


def classify_loss_ratio(loss_ratio: float) -> str:
    """
    Classify loss ratio into business buckets.
    """
    if loss_ratio <= LOSS_RATIO_THRESHOLDS["LOW_MAX"]:
        return "LOW"
    if loss_ratio <= LOSS_RATIO_THRESHOLDS["MEDIUM_MAX"]:
        return "MEDIUM"
    return "HIGH"


# Backward-compatible alias used by orchestrator
def get_risk_level(risk_score: float) -> str:
    return classify_risk_level(risk_score)
