from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .permissions import IsStaffOrReadOnly
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from .models import AndroidApp, CustomUser, Category, Subcategory, Task
from .serializers import CustomUserSerializer, CUserRegisterSerializer, UserLoginSerializer, AdminLoginSerializer, CategorySerializer, AndroidAppReadSerializer ,AndroidAppWriteSerializer , SubcategorySerializer, TaskSerializer, AddTaskSerializer
from rest_framework import status

@api_view(['GET'])
def api_overview(request):
    api_urls = {
		'api_user_registration':'/user-register/',
		'api_user_login':'/user-login/',
        'api_user_profile/':'user-profile/',
		'api_admin_login':'/admin-login/',
        'api_apps_list':'/apps-list/',
        'add_app':'/add-app/',
        'api_app_detail':'app-detail/<int:id>/',
        'api_add_app':'add-app/',
        'api_app_delete':'delete-app/<int:id>/',
        'api_installed_apps':'apps-installed/',
        'api_apps_to_install':'apps-to-install/',
        'api_app_category':'app-category/',
        'api_app_subcategory':'app-sub-category/<int:cat>/',
        'api_mark_task':'tasks/',
		}
    return Response(api_urls)


class Users(APIView):
    def get(self, request):
        all_users = CustomUser.objects.all()
        user_dic = CustomUserSerializer(all_users, many= True)
        print(user_dic.data)
        return Response(user_dic.data)
    

@api_view(['POST'])
def registerUser(request):
    if request.method == 'POST':
        try:
            user_data = CUserRegisterSerializer(data=request.data)
            if user_data.is_valid():
                user_data.save()
                return Response("User Registered successfully", status=status.HTTP_201_CREATED)
            else:
                errors = user_data.errors
                for key in errors:
                    print(key)
                    if key == 'username':
                        return Response("Username already taken, Try some other username", status=status.HTTP_400_BAD_REQUEST)
                    elif key == 'non_field_errors':
                        # Check if the 'non_field_errors' key contains the "Passwords do not match." error message
                        if "Passwords do not match." in errors[key]:
                            return Response("Passwords do not match. Please ensure both passwords are the same.", status=status.HTTP_400_BAD_REQUEST)
                return Response("Invalid details", status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response("Invalid Operation", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    if request.method == "POST":
        try:
            serializer = UserLoginSerializer(data=request.data)
            if serializer.is_valid():
                username = serializer.validated_data.get('username')
                user = CustomUser.objects.get(username=username)  # Retrieve the user by username
                token, created = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=status.HTTP_200_OK)
            else:
                errors = serializer.errors
                for key in errors:
                    if key == 'non_field_errors':
                        return Response("Invalid username or password.", status=status.HTTP_400_BAD_REQUEST)
                return Response("Invalid data", status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response("Invalid Operation", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Retrieve the user's profile data.
    """
    user = request.user 
    user_data = {
        'username': user.username,
        'points': user.points_earned,
    }
    return Response(user_data, status=status.HTTP_200_OK)



@api_view(['POST'])
def admin_login(request):
    if request.method == "POST":
        try:
            serializer = AdminLoginSerializer(data=request.data)
            if serializer.is_valid():
                username = serializer.validated_data.get('username')
                user = CustomUser.objects.get(username=username)  # Retrieve the user by username
                token, created = Token.objects.get_or_create(user=user)
                return Response({'a_token': token.key}, status=status.HTTP_200_OK)
            else:
                errors = serializer.errors
                for key in errors:
                    if key == 'non_field_errors':
                        return Response("Invalid username or password.", status=status.HTTP_400_BAD_REQUEST)
                return Response("Invalid data", status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response("Invalid Operation", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def apps_list(request):
    if request.method == "GET":
        apps = AndroidApp.objects.all()
        serializer = AndroidAppReadSerializer(data=apps, many= True)
        serializer.is_valid()  # Validate the serializer

        return Response(serializer.data, status=status.HTTP_200_OK)
    

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])    
def app_detail(request, id):
    if request.method == 'GET':
        try:
            app = AndroidApp.objects.get(id=id)
            serializer = AndroidAppReadSerializer(app)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except AndroidApp.DoesNotExist:
            return Response({'detail': 'App not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated, IsStaffOrReadOnly]) 
def app_delete(request,id):
    if request.method=='DELETE':
        try:
            app = AndroidApp.objects.get(id=id)
            app.delete()
            return Response({'detail': 'App deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except AndroidApp.DoesNotExist:
            return Response({'detail': 'App not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Apps(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsStaffOrReadOnly] 
    def post(self, request):
        try:
            print(request.data)
            appAddData = AndroidAppWriteSerializer(data=request.data)
            
            if appAddData.is_valid():
                appAddData.save()
                return Response("App Added successfully", status=status.HTTP_201_CREATED)
            else:
                errors = appAddData.errors
                print(errors)
                # for key in errors:
                    # print(key)
                return Response("Invalid details", status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response("Invalid Operation", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
class AppCategory(APIView):
    def get(self, request):
        cat = Category.objects.all()
        serializer = CategorySerializer(data=cat, many= True)
        serializer.is_valid()  # Validate the serializer

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class AppSubcategory(APIView):
    def get(self, request, cat):
        subcategories = Subcategory.objects.filter(category=cat)
        
        serializer = SubcategorySerializer(subcategories, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def tasks(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'POST':
        print(request.data)
        serializer = AddTaskSerializer(data=request.data)
        if serializer.is_valid():
        # Create a new Task object with the validated data
            app_id = serializer.validated_data['app_id']
            screenshot = serializer.validated_data['screenshot']
            user = request.user
            print(app_id, screenshot, user)

            android_app = AndroidApp.objects.get(pk=app_id)

            # Use the custom create_task method
            task = Task.create_task(user, android_app, screenshot)
            print(task)
            if task:
                return Response({"message": "Task uploaded successfully."}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Task already exists."}, status=status.HTTP_400_BAD_REQUEST)
        


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def apps_related_to_tasks(request):
    user = request.user

    # Get Android apps related to tasks for the user
    apps = AndroidApp.objects.filter(task__user=user).distinct()
    serializer = AndroidAppReadSerializer(apps, many=True)

    return Response(serializer.data)



@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def apps_not_related_to_tasks(request):
    user = request.user

    # Get Android apps that are not related to tasks for the user
    apps = AndroidApp.objects.exclude(task__user=user).distinct()
    serializer = AndroidAppReadSerializer(apps, many=True)

    return Response(serializer.data)