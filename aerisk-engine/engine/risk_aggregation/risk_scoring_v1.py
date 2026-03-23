from dataclasses import dataclass
from engine.config.settings import RiskProfile, DEFAULT_RISK_PROFILE


@dataclass(frozen=True)
class RiskScoreResult:
    risk_score: float
    risk_level: str


class RiskScoringV1:
    """
    ETAPA 11 – Financial Risk Scoring (STABLE)
    Converts Monte Carlo financial outputs into business risk levels.
    """

    def __init__(self, profile: RiskProfile = DEFAULT_RISK_PROFILE) -> None:
        self.profile = profile

    def score(self, monte_carlo_result, exposure_value: float = 0.0) -> RiskScoreResult:
        """
        Scoring based on AAL as a ratio of TIV (Total Insured Value).
        Thresholds are relative (%) so they scale with any exposure size.

        aal_ratio = AAL / exposure_value
        LOW:    aal_ratio < low_threshold    (ex: < 5% din TIV)
        MEDIUM: aal_ratio < medium_threshold (ex: < 20% din TIV)
        HIGH:   aal_ratio >= medium_threshold
        """

        aal = monte_carlo_result.aal
        low = self.profile.low_threshold
        medium = self.profile.medium_threshold

        # Compute relative ratio; fallback to absolute if no exposure given
        if exposure_value > 0:
            aal_ratio = aal / exposure_value
        else:
            # Fallback conservativ: nu putem relativiza, tratam ca HIGH
            aal_ratio = 1.0

        if aal_ratio < low:
            risk_level = "LOW"
        elif aal_ratio < medium:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"

        # risk_score exprimat ca % din TIV (0-100), mai lizibil in UI
        risk_score = round(aal_ratio * 100, 2)

        return RiskScoreResult(
            risk_score=risk_score,
            risk_level=risk_level,
        )
