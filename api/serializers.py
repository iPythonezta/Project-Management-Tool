from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import CustomUser, Projects, Tasks, Instruction

class UserSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = CustomUser
        fields = '__all__'

class ProjectsSerializer(serializers.ModelSerializer):
    manager = serializers.EmailField()
    manager_details = UserSerializer(read_only=True, source='manager')
    members = serializers.SlugRelatedField(slug_field='email', queryset=CustomUser.objects.all(), many=True)
    class Meta:
        model = Projects
        fields = '__all__'

    def create(self, validated_data):
        manager_email = validated_data.pop('manager')
        members = validated_data.pop('members')
        manager = CustomUser.objects.get(email=manager_email)
        project = Projects.objects.create(manager=manager, **validated_data)
        for member in members:
            member = CustomUser.objects.filter(email=member).first()
            project.members.add(member)
        return project
    
class TasksSerializer(serializers.ModelSerializer):
    project = ProjectsSerializer(read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(queryset=Projects.objects.all(), source='project')
    assigned_to = serializers.SlugRelatedField(slug_field='email', queryset=CustomUser.objects.all(), many=True, required=False)
    class Meta:
        model = Tasks
        fields = '__all__'
    def create(self, validated_data):
        assigned_to = validated_data.pop('assigned_to')
        task = Tasks.objects.create(**validated_data)
        for user in assigned_to:
            user = CustomUser.objects.get(email=user)
            task.assigned_to.add(user)
        return task

class InstructionSerializer(serializers.ModelSerializer):
    task = TasksSerializer(read_only=True)
    task_id = serializers.PrimaryKeyRelatedField(queryset=Tasks.objects.all(), source='task')
    user = serializers.EmailField(write_only=True)
    user_details = UserSerializer(read_only=True, source='user')
    attachment = serializers.FileField(required=False)
    class Meta:
        model = Instruction
        fields = ['id', 'user', 'user_details', 'task', 'task_id', 'message', 'attachment', 'created_at']
    def create(self, validated_data):
        user_email = validated_data.pop('user')
        user = CustomUser.objects.get(email=user_email)
        instuction = Instruction.objects.create(user=user, **validated_data)
        return instuction