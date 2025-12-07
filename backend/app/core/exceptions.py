from typing import Any, Dict, Optional

class AppError(Exception):
    """Base application error with logging context"""
    def __init__(self, message: str, status_code: int = 400, context: Dict[str, Any] = None):
        self.message = message
        self.status_code = status_code
        self.context = context or {}
        super().__init__(message)

class ResourceNotFound(AppError):
    def __init__(self, message: str = "Resource not found", context: Dict[str, Any] = None):
        super().__init__(message, status_code=404, context=context)

class AuthenticationError(AppError):
    def __init__(self, message: str = "Authentication failed", context: Dict[str, Any] = None):
        super().__init__(message, status_code=401, context=context)

class PermissionDenied(AppError):
    def __init__(self, message: str = "Permission denied", context: Dict[str, Any] = None):
        super().__init__(message, status_code=403, context=context)

class RateLimitExceeded(AppError):
    def __init__(self, message: str = "Rate limit exceeded", context: Dict[str, Any] = None):
        super().__init__(message, status_code=429, context=context)
