

from dataclasses import dataclass
from typing import Iterable, List

import numpy as np
from sklearn.isotonic import IsotonicRegression


@dataclass(frozen=True)
class CalibrationResult:
    """
    Rezultat calibrare probabilități.
    """
    method: str
    fitted: bool


class FrostProbabilityCalibrator:
    """
    Calibrator pentru probabilități FROST.
    Folosește Isotonic Regression (monotonic, robust pentru date reale).
    """

    def __init__(self):
        self._iso = IsotonicRegression(out_of_bounds="clip")
        self._fitted = False

    @property
    def fitted(self) -> bool:
        return self._fitted

    def fit(self, y_proba: Iterable[float], y_true: Iterable[int]) -> CalibrationResult:
        """
        y_proba: probabilități brute ML
        y_true: eveniment real (0/1)
        """
        p = np.asarray(list(y_proba), dtype=float)
        y = np.asarray(list(y_true), dtype=int)

        if p.size == 0 or y.size == 0:
            raise ValueError("Empty calibration data")

        if p.shape[0] != y.shape[0]:
            raise ValueError("Probability/label length mismatch")

        self._iso.fit(p, y)
        self._fitted = True

        return CalibrationResult(method="isotonic", fitted=True)

    def calibrate(self, y_proba: Iterable[float]) -> List[float]:
        if not self._fitted:
            raise RuntimeError("Calibrator not fitted")

        p = np.asarray(list(y_proba), dtype=float)
        calibrated = self._iso.predict(p)
        return calibrated.tolist()