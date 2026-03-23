"""
ETAPA 1.5 — Service Integration Test

Scop:
- validează că HazardService, VulnerabilityService și MonteCarloEngine
  pot lucra împreună FĂRĂ orchestrator
- prinde erori de compatibilitate între servicii
"""

from datetime import datetime

from app.schemas.input import RiskComputationRequest, Location, Asset, FinancialContext
from engine.services.hazard_service import HazardService
from engine.services.vulnerability_service import VulnerabilityService
from engine.services.monte_carlo_engine import MonteCarloEngine


def test_services_integration_flow():
    # --- build mock request ---
    request = RiskComputationRequest(
        location=Location(lat=47.0, lon=28.8),
        asset=Asset(type="agriculture", crop="apple", area_ha=10.0),
        financial=FinancialContext(
            total_insured_value=10000.0,
            currency="EUR",
        ),
        context={"country": "MD", "use_case": "frost_risk"},
    )

    # --- init services ---
    hazard_service = HazardService()
    vulnerability_service = VulnerabilityService()
    monte_carlo_engine = MonteCarloEngine()

    # --- run flow ---
    hazard = hazard_service.evaluate(request)
    vulnerability = vulnerability_service.estimate(
        hazard_result=hazard,
        asset=request.asset,
    )
    monte_carlo = monte_carlo_engine.simulate(
        hazard_result=hazard,
        vulnerability_result=vulnerability,
        financial_context=request.financial,
    )

    # --- assertions (contract sanity) ---
    assert hazard is not None
    assert vulnerability is not None
    assert monte_carlo is not None

    assert monte_carlo.total_insured_value == 10000.0
    assert monte_carlo.aal >= 0
    assert monte_carlo.pml_95 >= 0
    assert monte_carlo.var_99 >= 0
