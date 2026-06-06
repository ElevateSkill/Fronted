from django_ratelimit.core import is_ratelimited
from django_ratelimit.exceptions import Ratelimited
from rest_framework.response import Response
from rest_framework import status
from functools import wraps


def api_ratelimit(key='ip', rate='60/m', method='ALL'):
    """Reusable rate limit decorator for DRF views."""
    def decorator(func):
        @wraps(func)
        def wrapped(self, request, *args, **kwargs):
            limited = is_ratelimited(
                request=request,
                group=None,
                fn=func,
                key=key,
                rate=rate,
                method=method,
                increment=True
            )
            if limited:
                return Response(
                    {'detail': 'Too many requests. Please slow down.'},
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
            return func(self, request, *args, **kwargs)
        return wrapped
    return decorator


def ratelimit_exception_handler(exc, context):
    if isinstance(exc, Ratelimited):
        return Response(
            {'detail': 'Too many requests. Please slow down.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )
    from rest_framework.views import exception_handler
    return exception_handler(exc, context)
