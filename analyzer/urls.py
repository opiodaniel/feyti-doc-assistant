from django.urls import path
from .views import DocumentAnalyzeView

urlpatterns = [
    path('analyze/', DocumentAnalyzeView.as_view(), name='analyze-doc'),
]