from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import CustomUser, Projects, Tasks

class UserSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = CustomUser
        fields = '__all__'

class ProjectsSerializer(serializers.ModelSerializer):
    manager = serializers.EmailField()
    class Meta:
        model = Projects
        fields = '__all__'

    def create(self, validated_data):
        manager_email = validated_data.pop('manager')
        manager = CustomUser.objects.get(email=manager_email)
        project = Projects.objects.create(manager=manager, **validated_data)
        return project
    
class TasksSerializer(serializers.ModelSerializer):
    project = ProjectsSerializer(read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(queryset=Projects.objects.all(), source='project')
    class Meta:
        model = Tasks
        fields = '__all__'