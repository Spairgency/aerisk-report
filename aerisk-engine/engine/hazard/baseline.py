from typing import Any
import numpy as np

from engine.hazard.base import HazardModel


class BaselineHazardModel(HazardModel):
    """
    Model hazard baseline.
    Estimează probabilitatea ca frecvență istorică.
    """

    def __init__(self, version: str = "hazard-baseline-v1.0.0"):
        self._version = version
        self._fitted = False
        self._base_probability: float | None = None

    @property
    def version(self) -> str:
        return self._version

    def fit(self, X: Any, y: Any) -> None:
        """
        y: vector binar (0/1) – apariția hazardului
        """
        y_array = np.asarray(y, dtype=float)

        if y_array.size == 0:
            raise ValueError("Empty target vector")

        self._base_probability = float(y_array.mean())
        self._fitted = True

    def predict_proba(self, X: Any) -> float:
        if not self._fitted or self._base_probability is None:
            raise RuntimeError("Model is not fitted")

        return self._base_probability