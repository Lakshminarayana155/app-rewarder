from rest_framework import serializers
from .models import CustomUser, AndroidApp, Category, Subcategory, Task
from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        # fields = '__all__'
        exclude = ['password']


class CUserRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=20, validators=[UniqueValidator(queryset=CustomUser.objects.all())])
    password1 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        password1 = data.get('password1')
        password2 = data.get('password2')

        if password1 != password2:
            raise serializers.ValidationError("Passwords do not match.")

        return data

    def create(self, validated_data):
        username = validated_data['username']
        password = validated_data['password1']

        # Create and return the user
        user = CustomUser(username=username)
        user.set_password(password)
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        #Django's built-in authentication to verify the credentials
        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid username or password.")

        # If authentication is successful, store the authenticated user in the serializer's context
        self.context['user'] = user

        return data

class AdminLoginSerializer(UserLoginSerializer):
    def validate(self, data):
        data = super().validate(data)  # Call the parent class's validate method
        
        # Check if the user has is_staff set to True
        user = self.context.get('user')  # Get the user from the context
        if not user.is_staff:
            raise serializers.ValidationError("Invalid username or password.")

        return data
    

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        fields = '__all__'


class AndroidAppReadSerializer(serializers.ModelSerializer):
    # Use CategorySerializer and SubcategorySerializer for app_category and app_subcategory
    app_category = CategorySerializer(read_only=True)
    app_subcategory = SubcategorySerializer(read_only=True)

    class Meta:
        model = AndroidApp
        fields = '__all__'

class AndroidAppWriteSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = AndroidApp
        fields = '__all__'

        
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class AddTaskSerializer(serializers.Serializer):
    app_id = serializers.IntegerField()
    screenshot = serializers.ImageField()