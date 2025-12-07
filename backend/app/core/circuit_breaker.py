from datetime import timedelta
from typing import Callable, Any

import aiobreaker
from app.core.logging import log

# Create a generic circuit breaker
# Fails after 5 errors, resets after 60 seconds
circuit_breaker = aiobreaker.CircuitBreaker(
    fail_max=5,
    reset_timeout=timedelta(seconds=60),
    listeners=[aiobreaker.CircuitBreakerListener()] # Can add custom listeners for logging
)

def breaker(func):
    """
    Decorator to wrap a function with the circuit breaker.
    """
    return circuit_breaker(func)
