"""
ETAPA 0.5 — Contract Integration Test
Scop: verifică faptul că toate contractele Pydantic sunt compatibile între ele
și pot construi un ComputeRiskResponse complet fără logică reală.
"""

import pytest
from datetime import datetime

from app.schemas.output import (
    ComputeRiskResponse,
    RiskSummary,
    HazardAssessment,
    HazardItem,
    VulnerabilityAssessment,
    MonteCarloMetrics,
    EngineMetadata,
)


def test_contracts_integration_build_full_response():
    """
    Test critic: dacă acest test eșuează,
    contractele NU sunt compatibile.
    """

    summary = RiskSummary(
        risk_score=0.0,
        risk_level="LOW",
        main_driver=None,
    )

    hazard = HazardAssessment(
        overall_probability=0.0,
        hazards=[
            HazardItem(
                hazard_type="FROST",
                probability=0.2,
                severity_level="LOW",
                severity_distribution={"mean": 0.2},
            )
        ],
        metadata={"source": "test"},
    )

    vulnerability = VulnerabilityAssessment(
        loss_ratio_estimate=0.1,
        loss_ratio_distribution={"mean": 0.1},
        uncertainty={"ci_95": 0.02},
        metadata={"model": "stub"},
    )

    monte_carlo = MonteCarloMetrics(
        total_insured_value=10000.0,
        currency="EUR",
        aal=500.0,
        pml_95=1500.0,
        var_99=3000.0,
        simulations=5000,
        loss_distribution_sample=[100.0, 200.0, 300.0],
        metadata={"seed": "42"},
    )

    metadata = EngineMetadata(
        api_version="v1",
        model_version="stub",
        timestamp=datetime.utcnow(),
        computation_time_ms=1,
    )

    response = ComputeRiskResponse(
        summary=summary,
        hazard=hazard,
        vulnerability=vulnerability,
        monte_carlo=monte_carlo,
        metadata=metadata,
    )

    # FORȚEAZĂ re-validarea completă
    validated = ComputeRiskResponse.model_validate(response.model_dump())

    assert validated is not None
