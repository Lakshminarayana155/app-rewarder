from django.urls import path
from . import views

urlpatterns = [
    path("",views.home,name='home'),
    path("user/reg/",views.user_reg,name='frontend_user_reg'),
    path("admin-login",views.admin_login,name='frontend_admin_login'),
    path('user_page/',views.user_page, name="frontend_user_page"),
    path('admin_page/',views.admin_page, name="frontend_admin_page")

]
