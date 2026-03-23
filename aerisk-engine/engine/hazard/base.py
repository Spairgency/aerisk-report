from abc import ABC, abstractmethod
from typing import Any, Dict


class HazardModel(ABC):
    """
    Contract abstract pentru Hazard Models (ML / statistical).
    Responsabil exclusiv de estimarea probabilității unui hazard.
    """

    @property
    @abstractmethod
    def version(self) -> str:
        """
        Versiunea modelului (ex: 'hazard-frost-v1.0.0')
        """
        raise NotImplementedError

    @abstractmethod
    def fit(self, X: Any, y: Any) -> None:
        """
        Antrenează modelul pe date istorice.
        """
        raise NotImplementedError

    @abstractmethod
    def predict_proba(self, X: Any) -> float:
        """
        Returnează probabilitatea hazardului (0.0 – 1.0).
        """
        raise NotImplementedError

    def metadata(self) -> Dict[str, Any]:
        """
        Metadata opțional (features, calibrare, regiune etc.).
        """
        return {}