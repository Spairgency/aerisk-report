from engine.monte_carlo.monte_carlo_v1 import MonteCarloEngineV1
from engine.monte_carlo.output_v1 import MonteCarloOutputV1


def test_monte_carlo_output_structure():
    mc = MonteCarloEngineV1(n_simulations=5000, seed=42)

    result = mc.run(
        hazard_probability=0.2,
        loss_ratio_min=0.1,
        loss_ratio_mode=0.3,
        loss_ratio_max=0.6,
        exposure_value=10000.0,
        debug=False,
    )

    assert isinstance(result.output, MonteCarloOutputV1)

    output_dict = result.output.to_dict()

    assert "aal" in output_dict
    assert "var" in output_dict
    assert "pml" in output_dict

    assert output_dict["aal"] >= 0.0
    assert set(output_dict["var"].keys()) == {"p90", "p95", "p99"}
    assert set(output_dict["pml"].keys()) == {"p90", "p95", "p99"}
