from django.contrib.auth.models import AnonymousUser
from django.shortcuts import render
from rest_framework import generics, status, viewsets, parsers, permissions, exceptions
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from . import serializers, perm
from .models import *
from .serializers import (
    AccountSerializer,
    RoomTypeSerializer,
    RoomSerializer,
    ReservationSerializer,
    ServiceSerializer,
    RefundSerializer,
    BillSerializer, ReservationServiceSerializer,
)


class AccountViewSet(viewsets.ViewSet, generics.CreateAPIView,
                     # generics.DestroyAPIView,
                     generics.ListAPIView):
    queryset = Account.objects.filter(is_active=True).all()
    serializer_class = AccountSerializer
    parser_classes = [parsers.MultiPartParser, parsers.JSONParser]  # upload được hình ảnh và làm việc với json
    permission_classes = [permissions.AllowAny()]  # role nào vô cùng đc

    def get_permissions(self):
        if self.action in ['list', 'get_current_user', 'partial_update']:
            return [permissions.IsAuthenticated()]
        elif self.action in ['create', 'account_is_valid']:
            if isinstance(self.request.user, AnonymousUser):
                if self.request.data and (self.request.data.get('role') == str(Account.Roles.KhachHang)):
                    return [permissions.AllowAny()]
                else:
                    return [permissions.IsAuthenticated()]
            elif self.request.data and self.request.data.get('role') == str(Account.Roles.LeTan):
                if self.request.user.role in [Account.Roles.ADMIN.value]:
                    return [permissions.IsAuthenticated()]
                else:
                    raise exceptions.PermissionDenied()
            elif self.request.data and self.request.data.get('role') in [str(Account.Roles.ADMIN)]:
                if self.request.user.role == Account.Roles.ADMIN.value:
                    return [permissions.IsAuthenticated()]
                else:
                    raise exceptions.PermissionDenied()
        elif self.action in ['delete_staff']:
            permission_classes = [perm.IsAdmin()]

    # API xem chi tiết tài khoản hiện (chỉ xem được của mình) + cập nhật tài khoản (của mình)
    # /users/current-user/
    # @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    # def get_current_user(self, request):
    #     # Đã được chứng thực rồi thì không cần truy vấn nữa => Xác định đây là người dùng luôn
    #     # user = user hiện đang đăng nhập
    #     user = request.user
    #     if request.method.__eq__('PATCH'):
    #
    #         for k, v in request.data.items():
    #             # Thay vì viết user.first_name = v
    #             setattr(user, k, v)
    #         user.save()
    #
    #     return Response(serializers.AccountSerializer(user).data)

    @action(methods=['get'], detail=False, url_path='current_user')
    def get_current_user(self, request):
        # Xác định người dùng đã đăng nhập
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Not authenticated.'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.get_serializer(user)
        return Response(serializer.data)

    # API cập nhật một phần cho User
    @action(methods=['patch'], url_path='patch-current-user', detail=False)
    def patch_current_user(self, request):
        # Đã được chứng thực rồi thì không cần truy vấn nữa => Xác định đây là người dùng luôn
        # user = user hiện đang đăng nhập
        user = request.user
        # Khi so sánh thì viết hoa hết
        if request.method.__eq__('PATCH'):

            for k, v in request.data.items():
                # Thay vì viết user.first_name = v
                setattr(user, k, v)
            user.save()

        return Response(serializers.AccountSerializer(user).data)

    # API vô hiệu hoá tài khoản nhân viên
    # /users/<user_id>/delete-account/
    @action(detail=True, methods=['patch'], url_path='delete-staff')
    def delete_staff(self, request, pk=None):
        user = Account.objects.get(pk=pk)
        user.is_active = False
        user.save()
        return Response({"Thông báo": "Vô hiệu hoá tài khoản thành công."}, status=status.HTTP_204_NO_CONTENT)

    @action(methods=['get'], url_path='is_valid', detail=False)
    def account_is_valid(self, request):
        email = self.request.query_params.get('email')
        username = self.request.query_params.get('username')

        if email:
            tk = Account.objects.filter(email=email)
            if tk.exists():
                return Response(data={'is_valid': "True", 'message': 'Email đã tồn tại'}, status=status.HTTP_200_OK)

        if username:
            tk = Account.objects.filter(username=username)
            if tk.exists():
                return Response(data={'is_valid': "True", 'message': 'Username đã tồn tại'},
                                status=status.HTTP_200_OK)

        return Response(data={'is_valid': "False"}, status=status.HTTP_200_OK)

class RoomTypeViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = RoomType.objects.all()
    serializer_class = RoomTypeSerializer


    def get_permissions(self):
        if self.action in ['list', 'create', 'update', 'partial_update', 'destroy', 'retrieve']:
            return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = self.queryset
        q = self.request.query_params.get('nameRoomType')
        if q:
            queryset = queryset.filter(nameRoomType__icontains=q)

        return queryset


    def partial_update(self, request, pk=None):
        try:
            roomType = RoomType.objects.get(pk=pk)
        except Room.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(roomType, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoomViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Room.objects.filter(active=True)
    serializer_class = RoomSerializer

    def get_permissions(self):
        if self.action in ['list', 'create', 'update', 'partial_update', 'destroy', 'delete_room', 'retrieve']:
            return [permissions.AllowAny()]

    def create(self, request, *args, **kwargs):
        try:
            # Lấy dữ liệu từ request
            room_type_id = request.data.get("roomType")
            name_room = request.data.get("nameRoom")

            # Kiểm tra dữ liệu đầu vào
            if not room_type_id or not name_room:
                return Response(
                    {"detail": "RoomType and nameRoom are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Lấy RoomType từ cơ sở dữ liệu
            room_type = RoomType.objects.get(id=room_type_id)

            # Tạo phòng mới
            new_room = Room.objects.create(nameRoom=name_room, roomType=room_type)

            # Serialize dữ liệu của phòng mới
            # serializer = self.get_serializer(new_room)

            # Trả về phản hồi thành công
            return Response(
                serializers.RoomSerializer(new_room).data,
                status=status.HTTP_201_CREATED
            )
        except RoomType.DoesNotExist:
            return Response(
                {"detail": "RoomType not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(active=True)
        serializer = RoomSerializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        return self.queryset

    def partial_update(self, request, pk=None):
        try:
            room = self.get_object()
        except Room.DoesNotExist:
            return Response({"detail": "Room not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(room, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], url_path='delete-room')
    def delete_room(self, request, pk=None):
        try:
            room = self.get_object()
            # Debugging: Kiểm tra giá trị của `room`
            print(f"Room: {room}")
            if room is None:
                return Response({"detail": "Room not found."}, status=status.HTTP_404_NOT_FOUND)

            # Thực hiện vô hiệu hóa (disable) room
            room.active = False
            room.save()

            return Response({"detail": "Room has been deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)



# Create your views here.
