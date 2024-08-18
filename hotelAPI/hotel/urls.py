from rest_framework import routers
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import ReservationServiceListView

r = routers.DefaultRouter()
r.register('accounts', views.AccountViewSet, basename='accounts')
r.register(r'roomtypes', views.RoomTypeViewSet, basename='roomtype')
r.register(r'rooms', views.RoomViewSet, basename='room')


urlpatterns = [
    path('', include(r.urls)),

    # path('o/', include('oauth2_provider.urls', namespace='oauth2_provider'))
]
