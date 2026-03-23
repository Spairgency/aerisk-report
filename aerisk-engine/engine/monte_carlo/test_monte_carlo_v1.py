import numpy as np

from engine.monte_carlo.monte_carlo_v1 import MonteCarloEngineV1


def test_monte_carlo_basic_sanity():
    mc = MonteCarloEngineV1(n_simulations=10_000, seed=42)

    result = mc.run(
        hazard_probability=0.2,
        loss_ratio_min=0.1,
        loss_ratio_mode=0.3,
        loss_ratio_max=0.6,
        exposure_value=10000.0,
        debug=False,
    )

    # basic structure
    assert result.aal >= 0.0
    assert 0.0 <= result.var_90 <= result.var_95 <= result.var_99
    assert 0.0 <= result.pml_90 <= result.pml_95 <= result.pml_99


def test_monte_carlo_zero_hazard():
    mc = MonteCarloEngineV1(n_simulations=5000, seed=1)

    result = mc.run(
        hazard_probability=0.0,
        loss_ratio_min=0.1,
        loss_ratio_mode=0.3,
        loss_ratio_max=0.6,
        exposure_value=5000.0,
        debug=False,
    )

    # no hazard -> no loss
    assert result.aal == 0.0
    assert result.var_90 == 0.0
    assert result.var_95 == 0.0
    assert result.var_99 == 0.0


def test_monte_carlo_reproducibility():
    mc1 = MonteCarloEngineV1(n_simulations=8000, seed=123)
    mc2 = MonteCarloEngineV1(n_simulations=8000, seed=123)

    r1 = mc1.run(
        hazard_probability=0.3,
        loss_ratio_min=0.2,
        loss_ratio_mode=0.4,
        loss_ratio_max=0.7,
        exposure_value=20000.0,
        debug=False,
    )

    r2 = mc2.run(
        hazard_probability=0.3,
        loss_ratio_min=0.2,
        loss_ratio_mode=0.4,
        loss_ratio_max=0.7,
        exposure_value=20000.0,
        debug=False,
    )

    assert np.isclose(r1.aal, r2.aal)
    assert np.isclose(r1.var_95, r2.var_95)
    assert np.isclose(r1.pml_99, r2.pml_99)
