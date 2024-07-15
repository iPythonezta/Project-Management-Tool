from django.shortcuts import render
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer, ProjectsSerializer, TasksSerializer, InstructionSerializer
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from .models import Projects, Tasks, Instruction

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
        return Projects.objects.filter(manager=self.request.user)
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['manager'] = request.user.email
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProjectDeleteUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Projects.objects.filter(manager=self.request.user)

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
            return Tasks.objects.filter(project=project_id)
        else:
            return []
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
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
        return Tasks.objects.filter(project__manager=self.request.user)
    
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
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)