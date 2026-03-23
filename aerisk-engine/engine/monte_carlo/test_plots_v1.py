import numpy as np

from engine.monte_carlo.plots_v1 import compute_quantiles


def test_compute_quantiles_basic():
    losses = np.array([0.0, 10.0, 20.0, 30.0, 40.0])

    result = compute_quantiles(losses, [0.5, 0.9])

    assert result[0.5] == 20.0
    assert result[0.9] == 36.0


def test_compute_quantiles_zero_losses():
    losses = np.zeros(100)

    result = compute_quantiles(losses, [0.5, 0.95])

    assert result[0.5] == 0.0
    assert result[0.95] == 0.0
