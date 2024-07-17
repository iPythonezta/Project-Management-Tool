from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    ###################################################
    path('auth/obtain-auth-token/', obtain_auth_token),
    path('auth/delete-auth-token/', views.logout),
    path('auth/register/',views.UserRegistrationView.as_view()),
    path('auth/me/',views.get_user),
    ###################################################
    path('projects/',views.ProjectsListCreateView.as_view()),
    path('projects/<int:pk>/',views.ProjectDeleteUpdateView.as_view()),
    path('projects/invite/',views.invite_to_project),
    path('projects/remove/',views.remove_user_from_project),
    path('projects/confirm-invite/<str:token>/',views.confirm_invitation, name="confirm-invitation"),
    ####################################################
    path('tasks/',views.TasksListCreateView.as_view()),
    path('tasks/<int:pk>/',views.TasksUpdateDeleteView.as_view()),
    ####################################################
    path('instructions/',views.InstructionListCreateView.as_view()),    
]