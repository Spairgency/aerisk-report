"""
AERISK ENGINE – Dummy Implementation
Purpose:
- First runnable version of the engine
- No real calculations
- Returns deterministic, hardcoded output
- Used to validate full API → Engine → Output flow
"""

from datetime import datetime
from typing import Dict, Any

from app.schemas.output import (
    ComputeRiskResponse,
    RiskSummary,
    HazardRisk,
    MonteCarloMetrics,
    EngineMetadata,
)


def compute_risk_dummy(payload: Dict[str, Any]) -> ComputeRiskResponse:
    return ComputeRiskResponse(
        summary=RiskSummary(
            risk_score=0.73,
            risk_level="HIGH",
            confidence_interval_95=[0.68, 0.79],
        ),
        hazards={
            "frost": HazardRisk(
                probability=0.2,
                severity_score=0.5,
                severity_level="MEDIUM",
                return_period_years=5,
            ),
            "drought": HazardRisk(
                probability=0.2,
                severity_score=0.5,
                severity_level="MEDIUM",
                return_period_years=5,
            ),
            "excess_rain": HazardRisk(
                probability=0.2,
                severity_score=0.5,
                severity_level="MEDIUM",
                return_period_years=5,
            ),
        },
        monte_carlo=MonteCarloMetrics(
            AAL=12000.0,
            PML_95=45000.0,
            VaR_99=78000.0,
            currency="EUR",
            simulations=10000,
            AAL_by_hazard={
                "frost": 4000.0,
                "drought": 5000.0,
                "excess_rain": 3000.0,
            },
        ),
        metadata=EngineMetadata(
            model_version="dummy-0.1",
            api_version="v1",
            computation_time_ms=12,
            timestamp=datetime.utcnow(),
        ),
        warnings=[
            "Dummy engine – placeholder values only",
        ],
    )