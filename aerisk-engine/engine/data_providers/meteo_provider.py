from typing import Dict, Any
from datetime import datetime, timezone


class MeteoProvider:
    """
    Meteo data provider – STUB (ETAPA 5.1)

    Purpose:
    - Single responsibility: return normalized weather features
    - No external API calls yet
    - Deterministic output for testing & pipeline stability
    """

    def get_features(self, location: Dict[str, float]) -> Dict[str, Any]:
        """
        Returns normalized meteorological features for hazard logic.
        This is a deterministic stub.

        Args:
            location: {"lat": float, "lon": float}

        Returns:
            Dict with weather features
        """

        lat = location.get("lat", 0.0)

        # --- deterministic seasonal proxy ---
        month = datetime.now(timezone.utc).month

        if month in [3, 4]:
            frost_risk_index = 0.7
        elif month in [10, 11]:
            frost_risk_index = 0.4
        else:
            frost_risk_index = 0.1

        # latitude adjustment
        if lat >= 48:
            frost_risk_index += 0.1
        elif lat >= 45:
            frost_risk_index += 0.05

        frost_risk_index = min(round(frost_risk_index, 2), 1.0)

        return {
            "provider": "meteo_stub_v1",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "features": {
                "frost_risk_index": frost_risk_index,
                "mean_temp_proxy": -2.5 if frost_risk_index < 0.3 else -4.0,
            },
        }
