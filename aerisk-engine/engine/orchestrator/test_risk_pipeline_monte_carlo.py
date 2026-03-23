from engine.orchestrator.risk_pipeline_core import (
    RiskPipelineCore,
    HazardCoreResult,
    VulnerabilityCoreResult,
)


def test_risk_pipeline_core_monte_carlo():
    pipeline = RiskPipelineCore(n_simulations=5000, seed=42)

    hazard = HazardCoreResult(
        overall_probability=0.25,
    )

    vulnerability = VulnerabilityCoreResult(
        loss_ratio_min=0.1,
        loss_ratio_mode=0.3,
        loss_ratio_max=0.6,
    )

    result = pipeline.run(
        hazard=hazard,
        vulnerability=vulnerability,
        exposure_value=10000.0,
    )

    assert result.aal >= 0.0
    assert 0.0 <= result.var_90 <= result.var_95 <= result.var_99
    assert 0.0 <= result.pml_90 <= result.pml_95 <= result.pml_99
