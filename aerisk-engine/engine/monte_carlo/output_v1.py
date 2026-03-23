"""
DEPRECATED – DO NOT USE

Monte Carlo output is no longer exposed as a standalone contract.
All Monte Carlo results are embedded in RiskResultV1:
engine/contracts/output_v1.py
"""

from typing import NoReturn


def _deprecated() -> NoReturn:
    raise RuntimeError(
        "MonteCarloOutputV1 is deprecated. "
        "Use RiskResultV1.monte_carlo instead."
    )
