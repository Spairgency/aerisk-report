from dataclasses import dataclass
from typing import List, Optional

import numpy as np


@dataclass(frozen=True)
class MonteCarloResultV1:
    """
    Rezultatul complet al simulării Monte Carlo (V1).
    """
    aal: float
    var_90: float
    var_95: float
    var_99: float
    pml_90: float
    pml_95: float
    pml_99: float
    losses: Optional[List[float]] = None


class MonteCarloEngineV1:
    """
    Monte Carlo Engine V1 (REAL, STABLE).
    Uses explicit probabilistic hazard + triangular vulnerability.
    """

    def __init__(self, n_simulations: int = 10_000, seed: int = 42):
        if n_simulations <= 0:
            raise ValueError("n_simulations must be > 0")

        self.n_simulations = n_simulations
        self.seed = seed

    def run(
        self,
        hazard_probability: float,
        loss_ratio_min: float,
        loss_ratio_mode: float,
        loss_ratio_max: float,
        exposure_value: float,
        debug: bool = False,
    ) -> MonteCarloResultV1:
        """
        Runs Monte Carlo simulation.

        hazard_probability: calibrated probability (0–1)
        loss_ratio_*: Triangular distribution parameters
        exposure_value: exposed value (EUR)
        """

        if not 0.0 <= hazard_probability <= 1.0:
            raise ValueError("hazard_probability must be in [0, 1]")

        if not (0.0 <= loss_ratio_min <= loss_ratio_mode <= loss_ratio_max <= 1.0):
            raise ValueError("Invalid loss ratio bounds")

        if exposure_value <= 0:
            raise ValueError("exposure_value must be > 0")

        rng = np.random.default_rng(self.seed)

        # 1. Sample hazard occurrence (Bernoulli)
        hazard_occurs = rng.random(self.n_simulations) < hazard_probability

        # 2. Sample vulnerability loss ratios (Triangular)
        loss_ratios = rng.triangular(
            loss_ratio_min,
            loss_ratio_mode,
            loss_ratio_max,
            size=self.n_simulations,
        )

        # 3. Compute losses
        losses = np.where(
            hazard_occurs,
            loss_ratios * exposure_value,
            0.0,
        )

        # 4. Financial indicators
        aal = float(np.mean(losses))

        var_90 = float(np.quantile(losses, 0.90))
        var_95 = float(np.quantile(losses, 0.95))
        var_99 = float(np.quantile(losses, 0.99))

        # PML = same quantiles for V1
        pml_90 = var_90
        pml_95 = var_95
        pml_99 = var_99

        return MonteCarloResultV1(
            aal=aal,
            var_90=var_90,
            var_95=var_95,
            var_99=var_99,
            pml_90=pml_90,
            pml_95=pml_95,
            pml_99=pml_99,
            losses=losses.tolist() if debug else None,
        )