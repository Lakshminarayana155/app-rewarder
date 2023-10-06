from django.urls import path
from . import views

urlpatterns = [
    path('',views.api_overview, name='api_overview'),
    #User
    path('users/', views.Users.as_view(), name='api_allusers'),
    path('user-register/', views.registerUser, name='api_user_registration'),
    path('user-login/',views.user_login,name="api_user_login"),
    path('user-profile/',views.user_profile, name='api_user_profile'),
    #admin
    path('admin-login/',views.admin_login,name="api_admin_login"),
    # Apps
    path('apps-list/',views.apps_list,name='api_apps_list'),
    path('app-detail/<int:id>/',views.app_detail,name='api_app_detail'),
    path('add-app/', views.Apps.as_view(),name='api_add_app'),
    path('delete-app/<int:id>/',views.app_delete,name='api_app_delete'),

    path('apps-installed/',views.apps_related_to_tasks, name='api_installed_apps'),
    path('apps-to-install/',views.apps_not_related_to_tasks, name='api_apps_to_install'),
    
    #category and sub category
    path('app-category/',views.AppCategory.as_view(),name='api_app_category'),
    path('app-sub-category/<int:cat>/',views.AppSubcategory.as_view(),name='api_app_subcategory'),

    #Task
    path('tasks/',views.tasks,name='api_mark_task'),


]