from typing import Dict, Any, List
from pydantic import BaseModel, Field
import numpy as np

from app.schemas.output import MonteCarloMetrics


class MonteCarloEngine:
    """
    Stub implementation for Monte Carlo financial simulation.
    This version validates contracts and pipeline flow only.
    """

    def _validate_output(self, model: MonteCarloMetrics) -> MonteCarloMetrics:
        """
        Global schema guard – prevents silent contract drift.
        """
        return MonteCarloMetrics.model_validate(model.model_dump())

    def run(self, payload: Dict[str, Any]) -> MonteCarloMetrics:
        """
        Stub determinist Monte Carlo.
        FĂRĂ randomness real (seed fix).
        """

        np.random.seed(42)

        total_value = payload["total_insured_value"]
        loss_ratio = payload.get("loss_ratio_estimate", 0.3)

        # --- calibrated deterministic dispersion ---
        # volatility proportional to loss_ratio (no randomness drift)
        sigma_ratio = max(loss_ratio * 0.25, 0.02)

        samples = np.random.normal(
            loc=loss_ratio * total_value,
            scale=sigma_ratio * total_value,
            size=payload.get("simulations", 5000),
        )

        samples = np.clip(samples, 0, total_value)

        samples_sorted = np.sort(samples)

        aal = float(np.mean(samples_sorted))
        pml_95 = float(np.percentile(samples_sorted, 95))
        var_99 = float(np.percentile(samples_sorted, 99))

        result = MonteCarloMetrics(
            total_insured_value=total_value,
            currency=payload.get("currency", "EUR"),
            aal=round(aal, 2),
            pml_95=round(pml_95, 2),
            var_99=round(var_99, 2),
            simulations=len(samples_sorted),
            loss_distribution_sample=[float(x) for x in samples_sorted[:100]],
            metadata={
                "engine": "monte_carlo_stub_v1.0",
                "seed": "42",
                "note": "STUB – deterministic Monte Carlo",
            },
        )

        return self._validate_output(result)

    def simulate(
        self,
        hazard_result,
        vulnerability_result,
        financial_context,
        simulations: int = 5000,
    ) -> MonteCarloMetrics:
        """
        Adapter pentru RiskPipeline.
        """

        payload = {
            "total_insured_value": financial_context.total_insured_value
            if hasattr(financial_context, "total_insured_value")
            else financial_context["total_insured_value"],
            "currency": getattr(financial_context, "currency", "EUR"),
            "loss_ratio_estimate": vulnerability_result.loss_ratio_estimate,
            "simulations": simulations,
        }

        return self.run(payload)