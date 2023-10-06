from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import IntegrityError
from django.db.models import F


class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=128)
    points_earned = models.IntegerField(default=0)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username



class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Subcategory(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class AndroidApp(models.Model):
    app_name = models.CharField(max_length=255)
    app_link = models.URLField(max_length=255)
    app_logo = models.ImageField(upload_to='app_logos/', default='app_logos/default_app_logo.png')
    app_category = models.ForeignKey(Category, on_delete=models.CASCADE)
    app_subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE)
    points = models.IntegerField()

    def __str__(self):
        return self.app_name



class Task(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    android_app = models.ForeignKey(AndroidApp, on_delete=models.CASCADE)
    screenshot = models.ImageField(upload_to='task_screenshots/', blank=False, null=False)

    def __str__(self):
        return f"{self.user.username}'s Task for {self.android_app.app_name} completed"
    
    class Meta:
        unique_together = ('user', 'android_app')

    @classmethod
    def create_task(cls, user, android_app, screenshot):
        try:
            #Try create a new Task object
            task = cls.objects.create(user=user, android_app=android_app, screenshot=screenshot)
            
            # Add the points from the app to the user's points_earned
            user.points_earned += android_app.points
            user.save()

            return task
        except IntegrityError:
            # If a duplicate entry is detected, handle it as needed
            return None
        except Exception:
            return None
        
    def delete(self, *args, **kwargs):
        # Delete the associated screenshot file
        self.screenshot.delete()

        super().delete(*args, **kwargs)


