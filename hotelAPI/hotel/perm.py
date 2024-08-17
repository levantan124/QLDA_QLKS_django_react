from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 1


class IsLeTan(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 2


class IsKhachHang(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 3
