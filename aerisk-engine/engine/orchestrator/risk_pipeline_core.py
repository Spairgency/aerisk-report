from dataclasses import dataclass
from engine.monte_carlo.monte_carlo_v1 import MonteCarloEngineV1
from engine.monte_carlo.monte_carlo_v1 import MonteCarloResultV1


@dataclass(frozen=True)
class HazardCoreResult:
    overall_probability: float


@dataclass(frozen=True)
class VulnerabilityCoreResult:
    loss_ratio_min: float
    loss_ratio_mode: float
    loss_ratio_max: float


class RiskPipelineCore:
    def __init__(self, n_simulations: int = 10000, seed: int = 42) -> None:
        self.monte_carlo = MonteCarloEngineV1(
            n_simulations=n_simulations,
            seed=seed,
        )

    def run(
        self,
        hazard: HazardCoreResult,
        vulnerability: VulnerabilityCoreResult,
        exposure_value: float,
    ) -> MonteCarloResultV1:
        """
        Core deterministic + stochastic execution.
        Returns MonteCarloResultV1.
        """
        return self.monte_carlo.run(
            hazard_probability=hazard.overall_probability,
            loss_ratio_min=vulnerability.loss_ratio_min,
            loss_ratio_mode=vulnerability.loss_ratio_mode,
            loss_ratio_max=vulnerability.loss_ratio_max,
            exposure_value=exposure_value,
        )
