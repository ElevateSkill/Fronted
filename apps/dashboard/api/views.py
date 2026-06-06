from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from apps.dashboard.services import DashboardService
from apps.dashboard.permissions import IsAdmin
from apps.dashboard.api.serializers import DashboardSerializer


@extend_schema(tags=["Dashboard"])
class AdminDashboardView(APIView):
    """GET /api/v1/admin/dashboard/"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        metrics = DashboardService.get_dashboard_metrics()
        serializer = DashboardSerializer(metrics)
        return Response(serializer.data)
