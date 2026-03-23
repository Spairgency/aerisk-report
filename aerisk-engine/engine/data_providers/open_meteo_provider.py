

import requests
from typing import Dict
from datetime import datetime, UTC


class OpenMeteoProvider:
    """
    Real weather data provider using Open-Meteo API.
    Read-only. No caching. No ML.
    Produces normalized feature vector for HazardService.
    """

    BASE_URL = "https://api.open-meteo.com/v1/forecast"

    def get_features(self, lat: float, lon: float) -> Dict[str, float]:
        params = {
            "latitude": lat,
            "longitude": lon,
            "daily": [
                "temperature_2m_min",
                "temperature_2m_max",
                "precipitation_sum",
            ],
            "timezone": "UTC",
            "forecast_days": 7,
        }

        response = requests.get(self.BASE_URL, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()
        daily = data.get("daily", {})

        tmin = min(daily.get("temperature_2m_min", [0.0]))
        tmax = max(daily.get("temperature_2m_max", [0.0]))
        precip = sum(daily.get("precipitation_sum", [0.0]))

        frost_risk_index = max(0.0, min(1.0, abs(tmin) / 10.0))

        return {
            "tmin_7d": float(tmin),
            "tmax_7d": float(tmax),
            "precip_7d": float(precip),
            "frost_risk_index": float(frost_risk_index),
            "source": "open-meteo",
            "generated_at": datetime.now(UTC).isoformat(),
        }