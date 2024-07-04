from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path('auth/obtain-auth-token/', obtain_auth_token),
    path('auth/delete-auth-token/', views.logout),
    path('auth/register/',views.UserRegistrationView.as_view()),
    path('auth/me/',views.get_user),
]