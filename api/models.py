from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, primary_key=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    def __str__(self):
        return self.email

class Projects(models.Model):
    manager = models.ForeignKey(CustomUser, on_delete=models.CASCADE, to_field='email')
    title = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.title
    
class Tasks(models.Model):
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=100)
    def __str__(self):
        return self.title

class Instruction(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, to_field='email')
    task = models.ForeignKey(Tasks, on_delete=models.CASCADE)
    message = models.TextField()
    attachment = models.FileField(null=True, blank=True, upload_to='attachments/')
    created_at = models.DateTimeField(auto_now_add=True)