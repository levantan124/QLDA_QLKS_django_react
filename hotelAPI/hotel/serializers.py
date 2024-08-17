from rest_framework import serializers, status
from rest_framework.response import Response

from .models import Account, RoomType, Room, Reservation, Service, Refund, Bill, ReservationService


class BaseModelSerializer(serializers.ModelSerializer):
    class Meta:
        abstract = True


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'username', 'password', 'name', 'avatar', 'DOB', 'Address', 'phone', 'email', 'sex', 'role',
                  'is_active']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = Account(
            username=validated_data['username'],
            name=validated_data['name'],
            avatar=validated_data.get('avatar'),
            DOB=validated_data.get('DOB'),
            Address=validated_data.get('Address'),
            phone=validated_data.get('phone'),
            email=validated_data.get('email'),
            sex=validated_data.get('sex'),
            role=validated_data.get('role'),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def to_representation(self, instance):
        req = super().to_representation(instance)
        req['avatar'] = instance.avatar.url
        return req


class RoomTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomType
        fields = ['id', 'nameRoomType', 'price', 'quantity', 'image', 'active']


class RoomSerializer(serializers.ModelSerializer):
    roomType = serializers.SlugRelatedField(slug_field='nameRoomType', queryset=RoomType.objects.all())

    class Meta:
        model = Room
        fields = ['id', 'nameRoom', 'roomType', 'status', 'active']


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'nameService', 'price']


class ReservationServiceSerializer(serializers.ModelSerializer):
    service = serializers.SlugRelatedField(slug_field='id', queryset=Service.objects.all())
    price = serializers.CharField(source='service.price', read_only=True)
    guest_name = serializers.CharField(source='reservation.guest.username', read_only=True)
    room_names = serializers.SerializerMethodField()
    nameService = serializers.CharField(source='service.name', read_only=True)

    class Meta:
        model = ReservationService
        fields = ['service', 'price', 'quantity', 'guest_name', 'room_names', 'total_price', 'nameService', 'active', 'id']

    def get_room_names(self, obj):
        return ", ".join(obj.reservation.room.values_list('nameRoom', flat=True))


class ReservationSerializer(serializers.ModelSerializer):
    guest = serializers.SlugRelatedField(slug_field='username', queryset=Account.objects.all())
    room = RoomSerializer(many=True)
    services = ReservationServiceSerializer(source='reservationservice_set', many=True, read_only=True)
    # services = ReservationServiceSerializer(many=True)
    # them dòng này để create bill, nếu ảnh hưởng các chức năng khác thì bỏ

    class Meta:
        model = Reservation
        fields = ['id', 'guest', 'services', 'room', 'bookDate', 'checkin', 'checkout', 'statusCheckin']

    def update(self, instance, validated_data):
        room_data = validated_data.pop('room', None)
        if room_data:
            for room in room_data:
                room_id = room.get('id')  # Lấy id từ room
                if not room_id:
                    continue  # Nếu không có id, bỏ qua
                try:
                    room_instance = instance.room.get(id=room_id)  # Lấy phòng theo id
                except Room.DoesNotExist:
                    continue  # Nếu phòng không tồn tại, bỏ qua
                room_instance.nameRoom = room.get('nameRoom', room_instance.nameRoom)
                room_instance.save()
        # Cập nhật các trường khác
        instance.statusCheckin = validated_data.get('statusCheckin', instance.statusCheckin)
        instance.save()
        return instance

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

    def create(self, validated_data):
        guest = validated_data.pop('guest')
        rooms_data = validated_data.pop('room')
        reservation = Reservation.objects.create(guest=guest, **validated_data)

        for room_data in rooms_data:
            Room.objects.create(reservation=reservation, **room_data)

        return reservation

# class ReservationDetailSerializer(serializers.ModelSerializer):
#     # guest = AccountSerializer()
#     guest = serializers.SlugRelatedField(slug_field='username', queryset=Account.objects.all())
#     room = RoomSerializer(many=True)
#     services = ReservationServiceSerializer(source='reservationservice_set', many=True, read_only=True)
#
#     class Meta:
#         model = ReservationSerializer.Meta.model
#         fields = ReservationSerializer.Meta.fields + ['services', 'created_date', 'updated_date', 'active']


#Chat
class BillSerializer(serializers.ModelSerializer):
    reservation = ReservationSerializer()
    # totalAmount = serializers.FloatField(read_only=True)

    class Meta:
        model = Bill
        fields = ['id', 'reservation', 'totalAmount', 'active']

    # def create(self, validated_data):
    #     reservation_data = validated_data.pop('reservation')
    #     room_data = reservation_data.pop('room')
    #     services_data = reservation_data.pop('services')
    #
    #     reservation = Reservation.objects.create(**reservation_data)
    #
    #     for room in room_data:
    #         room_instance, created = Room.objects.get_or_create(**room)
    #         reservation.room.add(room_instance)
    #
    #     for service_data in services_data:
    #         ReservationService.objects.create(reservation=reservation, **service_data)
    #
    #     bill = Bill.objects.create(reservation=reservation, **validated_data)
    #     return bill

    # def calculate_total_amount(self, reservation):
    #     # Calculate total service costs
    #     total_services_cost = sum(rs.total_price for rs in reservation.reservationservice_set.all())
    #
    #     # Calculate the number of days
    #     total_days = (reservation.checkout - reservation.checkin).days
    #     if total_days < 1:
    #         total_days = 1  # Ensure at least one day is charged
    #
    #     # Calculate total room cost
    #     room_price = sum(float(room.roomType.price) for room in reservation.room.all())
    #     total_room_cost = total_days * room_price
    #
    #     # Calculate total amount
    #     total_amount = total_services_cost + total_room_cost
    #     return total_amount


class RefundSerializer(serializers.ModelSerializer):
    guest = AccountSerializer()
    reservation = ReservationSerializer()

    class Meta:
        model = Refund
        fields = ['id', 'guest', 'reservation', 'LyDo']
