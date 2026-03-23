from dataclasses import dataclass
from typing import Dict


@dataclass(frozen=True)
class FrostFeatures:
    """
    Feature set standardizat pentru Hazard FROST.
    Toate valorile sunt deja preprocesate și normalizate upstream.
    """

    min_temperature_c: float          # temperatura minimă absolută (°C)
    hours_below_zero: float           # număr ore < 0°C
    frost_degree_hours: float         # sum(|temp|) pentru temp < 0
    soil_temperature_c: float         # temperatura solului (°C)
    wind_speed_ms: float              # vânt mediu (m/s)
    relative_humidity: float          # umiditate relativă (%)
    phenological_stage: float         # stadiu fenologic (0–1 normalizat)

    def to_vector(self) -> Dict[str, float]:
        """
        Conversie explicită în vector de features (ordine stabilă).
        """
        return {
            "min_temperature_c": self.min_temperature_c,
            "hours_below_zero": self.hours_below_zero,
            "frost_degree_hours": self.frost_degree_hours,
            "soil_temperature_c": self.soil_temperature_c,
            "wind_speed_ms": self.wind_speed_ms,
            "relative_humidity": self.relative_humidity,
            "phenological_stage": self.phenological_stage,
        }
