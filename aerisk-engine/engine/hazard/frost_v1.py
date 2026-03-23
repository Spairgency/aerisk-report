from typing import Any

from engine.hazard.base import HazardModel
from engine.hazard.features_frost import FrostFeatures
import numpy as np
from sklearn.linear_model import LogisticRegression
from engine.hazard.calibration_frost import FrostProbabilityCalibrator


class FrostHazardModelV1(HazardModel):
    """
    Hazard Model ML V1 pentru FROST.
    Versiune inițială: schelet + contract.
    ML real și calibrare vor fi adăugate ulterior.
    """

    def __init__(self, version: str = "hazard-frost-v1.0.0"):
        self._version = version
        self._fitted = False
        self._model = LogisticRegression(solver="liblinear")
        self._calibrator = FrostProbabilityCalibrator()

    @property
    def version(self) -> str:
        return self._version

    def fit(self, X: list[FrostFeatures], y: list[int]) -> None:
        if not X or not y:
            raise ValueError("Empty training data")

        if len(X) != len(y):
            raise ValueError("X and y length mismatch")

        for features in X:
            if not isinstance(features, FrostFeatures):
                raise TypeError("Expected FrostFeatures instances")

        X_mat = np.array([list(f.to_vector().values()) for f in X], dtype=float)
        y_vec = np.array(y, dtype=int)

        self._model.fit(X_mat, y_vec)
        self._fitted = True

    def fit_calibrator(self, y_proba: list[float], y_true: list[int]) -> None:
        self._calibrator.fit(y_proba, y_true)

    def predict_proba(self, X: FrostFeatures) -> float:
        if not self._fitted:
            raise RuntimeError("FrostHazardModelV1 is not fitted")

        if not isinstance(X, FrostFeatures):
            raise TypeError("Expected FrostFeatures instance")

        X_mat = np.array([list(X.to_vector().values())], dtype=float)
        proba = self._model.predict_proba(X_mat)[0, 1]

        proba = float(proba)

        if self._calibrator.fitted:
            return self._calibrator.calibrate([proba])[0]

        return proba
