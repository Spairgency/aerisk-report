class EngineError(Exception):
    """Base class for all engine errors."""
    code = "ENGINE_ERROR"


class EngineValidationError(EngineError):
    """Raised when engine input or configuration is invalid."""
    code = "ENGINE_VALIDATION_ERROR"


class EngineContractError(EngineError):
    """Raised when an internal engine contract is violated."""
    code = "ENGINE_CONTRACT_ERROR"


class EngineInternalError(EngineError):
    """Raised for unexpected internal engine failures."""
    code = "ENGINE_INTERNAL_ERROR"