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
from .models import Account, RoomType, Room, ReservationService, Service, Bill, Reservation
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


class ReservationViewSet(viewsets.ViewSet,
                         generics.ListCreateAPIView,
                         generics.ListAPIView,
                         generics.UpdateAPIView
                         ):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    # Chat gpt
    def get_permissions(self):
        if self.action in ['list']:  # Allow 'list' and 'create' for receptionists
            if self.request.user.is_authenticated and self.request.user.role == Account.Roles.LeTan:
                return [permissions.IsAuthenticated()]
            else:
                raise PermissionDenied("Only receptionists can access this endpoint.")
        elif self.action in ['partial_update', 'update']:
            if self.request.user.is_authenticated and self.request.user.role in [Account.Roles.KhachHang,
                                                                                 Account.Roles.LeTan]:
                return [permissions.IsAuthenticated()]
            else:
                raise PermissionDenied("Only the customer or receptionists can partially update this reservation.")
        elif self.action == 'get_reservation_guest':
            return [permissions.IsAuthenticated(), perm.IsKhachHang()]
        elif self.action == 'cancel_reservation':
            if self.request.user.is_authenticated and self.request.user.role in [Account.Roles.LeTan]:
                return [permissions.IsAuthenticated()]
            else:
                raise PermissionDenied("Only receptionists can cancel reservations.")
        return [permissions.IsAuthenticated()]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(active=True)
        serializer = ReservationSerializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        return self.queryset

    def create(self, request, *args, **kwargs):
        guest_name = request.data.get('guest')
        guest = Account.objects.get(username=guest_name)
        room_type_name = request.data.get('room')
        room_data = room_type_name[0]
        roomType = RoomType.objects.get(nameRoomType=room_data.get('roomType'))

        if not guest_name or not room_type_name:
            return Response({'detail': 'Customer ID and Room Type ID are required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        rooms = Room.objects.filter(roomType=roomType, status=0)

        if not rooms.exists():
            return Response({'detail': 'No available rooms for the selected room type.'},
                            status=status.HTTP_400_BAD_REQUEST)

        room = rooms.first()  # Chọn phòng đầu tiên có sẵn

        reservation = Reservation.objects.create(
            guest=guest,
            bookDate=request.data.get('bookDate'),  # Cung cấp giá trị cho bookDate
            checkin=request.data.get('checkin'),
            checkout=request.data.get('checkout'),
            active=True  # hoặc các giá trị khác từ request.data
        )
        reservation.room.add(room)
        reservation.save()

        room.status = 1  # Cập nhật trạng thái phòng không còn sẵn sàng
        room.save()

        return Response(ReservationSerializer(reservation).data, status=status.HTTP_201_CREATED)

    # chat
    def partial_update(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            reservation = self.queryset.get(pk=pk)
        except Reservation.DoesNotExist:
            return Response({'detail': 'Reservation not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role not in [Account.Roles.KhachHang, Account.Roles.LeTan]:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(reservation, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=True, methods=['patch'], url_path='deactivate')
    def deactivate_reservation(self, request, pk=None):
        try:
            reservation = self.get_object()
            if request.user.is_authenticated and request.user.role in [Account.Roles.LeTan]:
                reservation.active = False
                reservation.save()
                return Response({'status': 'reservation deactivated'}, status=status.HTTP_200_OK)
            else:
                raise PermissionDenied("Only receptionists can deactivate reservations.")
        except Reservation.DoesNotExist:
            return Response({'error': 'Reservation not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='customer-reservations')
    def get_customer_reservations(self, request):
        if request.user.is_authenticated and request.user.role == Account.Roles.KhachHang:
            reservations = self.queryset.filter(guest=request.user)
            serializer = self.get_serializer(reservations, many=True)
            return Response(serializer.data)
        else:
            raise PermissionDenied("Chỉ khách hàng mới có quyền truy cập endpoint này.")
        
    @action(detail=True, methods=['patch'], url_path='update-checkin')
    def update_checkin(self, request, pk=None):
        try:
            reservation = self.get_object()  # Lấy bản ghi Reservation từ ID (pk)
        except Reservation.DoesNotExist:
            return Response({'detail': 'Reservation not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Kiểm tra quyền: chỉ receptionist hoặc khách hàng mới có thể cập nhật checkin
        if request.user.role not in [Account.Roles.KhachHang, Account.Roles.LeTan]:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        # Lấy giá trị mới cho checkin từ request
        new_checkin = request.data.get('checkin')
        if not new_checkin:
            return Response({'detail': 'Checkin date is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Cập nhật giá trị mới cho checkin
        reservation.checkin = new_checkin
        reservation.save()

        return Response({'status': 'Checkin date updated successfully.', 'checkin': reservation.checkin}, 
                        status=status.HTTP_200_OK)


class ServiceViewSet(viewsets.ViewSet,
                    generics.ListCreateAPIView):
   queryset = Service.objects.all()
   serializer_class = ServiceSerializer
   permission_classes = [IsAuthenticated]


   def get_permissions(self):
       if self.action == 'list':
           if not (self.request.user.is_authenticated and
                   self.request.user.role == Account.Roles.LeTan):
               raise PermissionDenied("Only Receptionists can perform this action.")
           return [permissions.IsAuthenticated()]




# class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Service.objects.all()
#     serializer_class = ServiceSerializer
#     permission_classes = [IsAuthenticated]




class ReservationServiceViewSet(viewsets.ViewSet,
                               generics.ListCreateAPIView,
                               generics.UpdateAPIView):
   queryset = ReservationService.objects.all()
   serializer_class = ReservationServiceSerializer
   permission_classes = [IsAuthenticated]


   def get_permissions(self):
       if self.action in ['create', 'list', 'update_active']:
           # Chỉ cho phép người dùng có vai trò 'Lễ tân' sử dụng phương thức 'create'
           if not (self.request.user.is_authenticated and
                   self.request.user.role == Account.Roles.LeTan):
               raise PermissionDenied("Only Receptionists can perform this action.")
           return [permissions.IsAuthenticated()]
       elif self.action in ['update', 'destroy']:
           # Cũng có thể đặt quyền cho các hành động khác nếu cần
           if not (self.request.user.is_authenticated and
                   self.request.user.role == Account.Roles.Admin):
               raise PermissionDenied("Only Admins can perform this action.")
           return [permissions.IsAuthenticated()]
       return [permissions.AllowAny()]


   def create(self, request, *args, **kwargs):
       reservation_id = request.data.get('reservationId')
       service_id = request.data.get('service')
       quantity = int(request.data.get('quantity', 1))


       try:
           reservation = Reservation.objects.get(id=reservation_id)
           service = Service.objects.get(id=service_id)
       except (Reservation.DoesNotExist, Service.DoesNotExist):
           return Response({"detail": "Reservation or Service not found."}, status=status.HTTP_404_NOT_FOUND)


       if not reservation.active:
           return Response({"detail": "Reservation is not active."}, status=status.HTTP_400_BAD_REQUEST)


       total_price = service.price * quantity


       reservation_service = ReservationService.objects.create(
           reservation=reservation,
           service=service,
           quantity=quantity,
           total_price=total_price
       )


       serializer = self.get_serializer(reservation_service)
       return Response(serializer.data, status=status.HTTP_201_CREATED)


   def list(self, request, *args, **kwargs):
       # Lọc các reservation đang active
       active_reservations = Reservation.objects.filter(active=True)
       active_services = Service.objects.filter(active=True)
       # Lọc reservation services thuộc các reservation đang active
       queryset = ReservationService.objects.filter(
           active=True,
           reservation__in=active_reservations,
           service__in=active_services
       )


       # Serialize dữ liệu
       serializer = self.get_serializer(queryset, many=True)


       # Trả về phản hồi với dữ liệu đã được serialize
       return Response(serializer.data, status=status.HTTP_200_OK)


   def partial_update(self, request, *args, **kwargs):
       try:
           # Lấy đối tượng ReservationService theo id
           instance = self.get_object()
       except ReservationService.DoesNotExist:
           return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)


       # Cập nhật trường active
       active = request.data.get('active', None)


       if active is not None:
           instance.active = active
           instance.save()
           serializer = self.get_serializer(instance)
           return Response(serializer.data, status=status.HTTP_200_OK)


       return Response({'detail': 'Field "active" is required.'}, status=status.HTTP_400_BAD_REQUEST)




class ReservationServiceListView(
                                generics.ListAPIView,
):
   serializer_class = ReservationServiceSerializer
   permission_classes = [IsAuthenticated]


   def get_queryset(self):
       reservation_id = self.kwargs['reservation_id']
       return ReservationService.objects.filter(reservation_id=reservation_id)




class BillViewSet(viewsets.ViewSet,
                 generics.ListCreateAPIView):
   queryset = Bill.objects.all()
   serializer_class = BillSerializer
   permission_classes = [IsAuthenticated]


   def get_permissions(self):
       if self.action in ['list', 'create']:  # Allow 'list' and 'create' for receptionists
           if self.request.user.is_authenticated and self.request.user.role == Account.Roles.LeTan:
               return [permissions.IsAuthenticated()]
           else:
               raise PermissionDenied("Only receptionists can access this endpoint.")


       # Add other actions and permission checks here if needed
       return [permissions.AllowAny()]


   def list(self, request):
       queryset = self.get_queryset()
       serializer = BillSerializer(queryset, many=True)
       return Response(serializer.data)


   def create(self, request, *args, **kwargs):
       data = request.data
       total_amount = data.get('totalAmount')
       reservation_id = data.get('reservation')


       try:
           reservation = Reservation.objects.get(id=reservation_id)
       except Reservation.DoesNotExist:
           return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)


       bill = Bill.objects.create(
           totalAmount=total_amount,
           reservation=reservation
       )


       serializer = BillSerializer(bill)
       return Response(serializer.data, status=status.HTTP_201_CREATED)


class BillViewSet(viewsets.ViewSet,
                  generics.ListCreateAPIView):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'create']:  # Allow 'list' and 'create' for receptionists
            if self.request.user.is_authenticated and self.request.user.role == Account.Roles.LeTan:
                return [permissions.IsAuthenticated()]
            else:
                raise PermissionDenied("Only receptionists can access this endpoint.")
        # Add other actions and permission checks here if needed
        return [permissions.AllowAny()]

    def list(self, request):
        queryset = self.get_queryset()
        serializer = BillSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        data = request.data
        total_amount = data.get('totalAmount')
        reservation_id = data.get('reservation')

        try:
            reservation = Reservation.objects.get(id=reservation_id)
        except Reservation.DoesNotExist:
            return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)

        bill = Bill.objects.create(
            totalAmount=total_amount,
            reservation=reservation
        )

        serializer = BillSerializer(bill)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# Create your views here.
