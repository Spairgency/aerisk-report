from engine.risk_aggregation.risk_scoring_v1 import RiskScoringV1
from engine.config.settings import RiskProfile
from types import SimpleNamespace


def test_risk_scoring_low():
    profile = RiskProfile(low_threshold=1000.0, medium_threshold=5000.0)
    scorer = RiskScoringV1(profile=profile)

    mc_result = SimpleNamespace(aal=500.0)

    result = scorer.score(mc_result)

    assert result.risk_level == "LOW"
    assert result.risk_score == 500.0


def test_risk_scoring_medium():
    profile = RiskProfile(low_threshold=1000.0, medium_threshold=5000.0)
    scorer = RiskScoringV1(profile=profile)

    mc_result = SimpleNamespace(aal=3000.0)

    result = scorer.score(mc_result)

    assert result.risk_level == "MEDIUM"
    assert result.risk_score == 3000.0


def test_risk_scoring_high():
    profile = RiskProfile(low_threshold=1000.0, medium_threshold=5000.0)
    scorer = RiskScoringV1(profile=profile)

    mc_result = SimpleNamespace(aal=8000.0)

    result = scorer.score(mc_result)

    assert result.risk_level == "HIGH"
    assert result.risk_score == 8000.0

from engine.config.settings import (
    DEFAULT_RISK_PROFILE,
    CONSERVATIVE_RISK_PROFILE,
    AGGRESSIVE_RISK_PROFILE,
)


def test_risk_scoring_conservative_profile():
    scorer = RiskScoringV1(profile=CONSERVATIVE_RISK_PROFILE)

    mc_result = SimpleNamespace(aal=1500.0)
    result = scorer.score(mc_result)

    assert result.risk_level == "MEDIUM"


def test_risk_scoring_aggressive_profile():
    scorer = RiskScoringV1(profile=AGGRESSIVE_RISK_PROFILE)

    mc_result = SimpleNamespace(aal=1500.0)
    result = scorer.score(mc_result)

    assert result.risk_level == "LOW"
