import time
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from django.http import HttpResponse


http_request_total = Counter(
    "django_http_requests_total",
    "Total HTTP requests",
    ["method", "path", "status"],
)

http_request_duration_seconds = Histogram(
    "django_http_request_duration_seconds",
    "HTTP request latency in seconds",
    ["method", "path"],
)


class PrometheusMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.perf_counter()
        response = self.get_response(request)
        duration = time.perf_counter() - start

        path = request.path
        method = request.method
        status = getattr(response, "status_code", 500)

        http_request_duration_seconds.labels(method, path).observe(duration)
        http_request_total.labels(method, path, status).inc()

        return response


def metrics_view(request):
    data = generate_latest()
    return HttpResponse(data, content_type=CONTENT_TYPE_LATEST)