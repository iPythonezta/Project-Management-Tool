from django.shortcuts import render, redirect
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer, ProjectsSerializer, TasksSerializer, InstructionSerializer
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from .models import Projects, Tasks, Instruction, CustomUser
from django.core.mail import EmailMessage
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
from django.conf import settings
from django.urls import reverse
from rest_framework.decorators import authentication_classes, permission_classes
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
# Create your views here.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        token = request.data['token']
        user = request.user
        print(user)
        print(token)
        token = Token.objects.get(user=user,key=token)
        token.delete()
        return Response({'message':'Logout Successful'}, status=status.HTTP_202_ACCEPTED)
    except Exception as e:
        return Response({'error':str(e)},status=status.HTTP_400_BAD_REQUEST)

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

class ProjectsListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Projects.objects.filter(members__in=[self.request.user])
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['manager'] = request.user.email
        data['members'] = [request.user.email]
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProjectDeleteUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Projects.objects.filter(members__in=[self.request.user])

    def update(self, request, *args, **kwargs):
        data = request.data.copy()
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.manager == request.user:
            self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
        
class TasksListCreateView(generics.ListCreateAPIView):
    serializer_class = TasksSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        project_id = self.request.query_params.get('project_id')
        if project_id:
            return Tasks.objects.filter(project=project_id, project__members__in=[self.request.user])
        else:
            return []
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['assigned_to'] = []
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TasksUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TasksSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tasks.objects.filter(project__members__in=[self.request.user])
    
class InstructionListCreateView(generics.ListCreateAPIView):
    serializer_class = InstructionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        task_id = self.request.query_params.get('task_id')
        if task_id:
            return Instruction.objects.filter(task=task_id)
        else:
            return []
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                'chat_{}'.format(serializer.data['task_id']),
                {
                    'type': 'chat.message',
                    'message': serializer.data
                }
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def invite_to_project(request):
    proejct_id = request.data.get('project_id')
    project = Projects.objects.filter(id=proejct_id, manager=request.user).first()
    if not project:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
    email = request.data.get('email')
    user = CustomUser.objects.filter(email=email).first()
    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    if request.user != project.manager:
        return Response({"error": "You are not the project manager"}, status=status.HTTP_400_BAD_REQUEST)
    
    token_serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
    token = token_serializer.dumps(f"{email} {proejct_id}", salt='invite-to-project')
    message  = f"""
        Hey there, \n
        {user.first_name} has invited you to join the project '{project.title}'. \n
        Pleask click on the link below to join the project. \n
        {"http://127.0.0.1:8000"+reverse('confirm-invitation', args=[token])}\n
    """
    msg = EmailMessage(subject=f"Invitation to join {project.title}", body=message, from_email=settings.EMAIL_HOST_USER, to=[user.email])
    msg.send()
    return Response({"message": "Invitation sent"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([])
@authentication_classes([])
def confirm_invitation(request, token):
    token_serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
    try:
        email, project_id = token_serializer.loads(token, salt='invite-to-project', max_age=24*60*60).split(' ')
    except SignatureExpired:
        return Response({"error": "The invitation link has expired"}, status=status.HTTP_400_BAD_REQUEST)
    project = Projects.objects.filter(id=project_id).first()
    if not project:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
    user = CustomUser.objects.filter(email=email).first()
    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    if user not in project.members.all():
        project.members.add(user)
    return redirect(f"http://localhost:3000/project/{project_id}")


@api_view(['POST'])
def remove_user_from_project(request):
    project_id = request.data['project_id']
    project = Projects.objects.filter(id=project_id, manager=request.user).first()
    if not project:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
    email = request.data['email']
    user = CustomUser.objects.filter(email=email).first()
    if request.user != project.manager:
        return Response({"error": "You are not the project manager"}, status=status.HTTP_400_BAD_REQUEST)
    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    if request.user == user:
        return Response({"error": "You can't remove yourself from the project"}, status=status.HTTP_400_BAD_REQUEST)
    project.members.remove(user)
    return Response({"message": "User removed from the project"}, status=status.HTTP_200_OK)


