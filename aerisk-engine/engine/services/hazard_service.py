"""
Hazard Service (STUB)
--------------------
Responsabilitate:
- Primește datele de intrare deja validate (location, temporal, asset)
- Returnează probabilitate + distribuție de severitate pentru fiecare hazard
- FĂRĂ logică reală (stub) – valori hardcoded
- Respectă contractele AERISK v1.x
"""

from datetime import datetime
from typing import Optional, Dict, Any
from app.schemas.input import RiskComputationRequest
from app.schemas.output import HazardAssessment, HazardItem


class HazardService:
    """
    HazardService este responsabil exclusiv de evaluarea HAZARDULUI fizic.
    NU știe nimic despre pierderi financiare.
    NU știe nimic despre Monte Carlo.
    """

    def _validate_output(self, model: HazardAssessment) -> HazardAssessment:
        """
        Global output guard — re-validates schema deterministically.
        """
        return HazardAssessment.model_validate(model.model_dump())

    def evaluate(
        self,
        payload: RiskComputationRequest,
        meteo: Optional[Dict[str, Any]] = None,
    ) -> HazardAssessment:
        """
        Deterministic hazard logic (ETAPA 4.1)
        Rules:
        - FROST risk based on month + latitude
        - No ML, no external APIs
        """

        lat = payload.location.lat
        target_date = payload.context.get("target_date")
        if isinstance(target_date, str):
            target_date = datetime.fromisoformat(target_date)
        month = target_date.month if target_date else datetime.utcnow().month

        # --- base probability by season ---
        if month in [3, 4]:        # early spring (bloom risk)
            base_prob = 0.30
        elif month in [10, 11]:    # late autumn
            base_prob = 0.15
        else:
            base_prob = 0.05

        # --- latitude adjustment ---
        if lat >= 48:
            base_prob += 0.10
        elif lat >= 45:
            base_prob += 0.05

        probability = min(round(base_prob, 2), 0.95)

        # --- ETAPA 5.3: controlled meteo influence ---
        # Meteo features may adjust probability, never override it
        if meteo and "features" in meteo:
            frost_index = meteo["features"].get("frost_risk_index")
            if isinstance(frost_index, (int, float)):
                # soft adjustment: ±20% max
                probability = min(
                    round(probability * (0.8 + 0.4 * frost_index), 2),
                    0.95,
                )

        # --- severity rules (ETAPA 4.3 – refined thresholds) ---
        # Severity derived deterministically from probability bands
        if probability >= 0.40:
            severity_level = "HIGH"
            mean_temp = -5.0
            std_temp = 1.3
        elif probability >= 0.20:
            severity_level = "MEDIUM"
            mean_temp = -3.5
            std_temp = 1.0
        else:
            severity_level = "LOW"
            mean_temp = -2.0
            std_temp = 0.8

        hazard = HazardAssessment(
            overall_probability=probability,
            hazards=[
                HazardItem(
                    hazard_type="FROST",
                    probability=probability,
                    severity_level=severity_level,
                    severity_distribution={
                        "mean": mean_temp,
                        "std": std_temp,
                    },
                )
            ],
            metadata={
                "model_version": "hazard_rules_v1.0",
                "generated_at": (target_date or datetime.utcnow()).isoformat() + "Z",
                "note": "Deterministic frost hazard rules (season + latitude)",
            },
        )

        return self._validate_output(hazard)