"""
URL configuration for backend project.
"""
from django.urls import path, include
from django.http import JsonResponse

def healthz(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('healthz', healthz),
    path('', include('board.urls')),
]
