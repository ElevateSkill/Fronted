from drf_spectacular.utils import extend_schema
from rest_framework import generics, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from utils.ratelimit import api_ratelimit

from utils.pagination import SmallPagination
from apps.payments.api.serializers import PaymentListSerializer, PaymentSubmitSerializer
from apps.payments.permissions import IsAdmin, IsStudent
from apps.payments.services import PaymentService


@extend_schema(tags=["Payments"])
class StudentPaymentView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated, IsStudent]

    @api_ratelimit(key='user', rate='20/h')
    @extend_schema(request=PaymentSubmitSerializer, responses={201: PaymentSubmitSerializer}, tags=["Payments"])
    def post(self, request):
        serializer = PaymentSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payment = PaymentService.submit_payment(
            student=request.user,
            data=serializer.validated_data,
            proof_file=serializer.validated_data.get("proof_file"),
        )
        response_serializer = PaymentSubmitSerializer(payment)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(responses={200: PaymentListSerializer}, tags=["Payments"])
    def get(self, request):
        payments = PaymentService.get_student_payments(request.user)
        serializer = PaymentListSerializer(payments, many=True)
        return Response(serializer.data)


@extend_schema(tags=["Payments"])
class AdminPaymentListView(generics.ListAPIView):
    serializer_class = PaymentListSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    pagination_class = SmallPagination

    def get_queryset(self):
        return PaymentService.get_all_payments()


@extend_schema(tags=["Payments"])
class AdminApprovePaymentView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    @extend_schema(responses={200: PaymentListSerializer}, tags=["Payments"])
    def put(self, request, pk):
        payment = PaymentService.approve_payment(pk)
        serializer = PaymentListSerializer(payment)
        return Response(serializer.data)


@extend_schema(tags=["Payments"])
class AdminRejectPaymentView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    @extend_schema(responses={200: PaymentListSerializer}, tags=["Payments"])
    def put(self, request, pk):
        payment = PaymentService.reject_payment(pk)
        serializer = PaymentListSerializer(payment)
        return Response(serializer.data)
