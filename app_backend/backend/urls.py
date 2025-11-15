"""
URL configuration for backend project.
"""
from django.urls import path, include
from django.http import JsonResponse
from .metrics import metrics_view

def healthz(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('healthz', healthz),
    path('metrics', metrics_view),
    path('', include('board.urls')),
]
