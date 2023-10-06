from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
def home(request):
    # return HttpResponse("<h2>Welcome to the AppRewarder Home Page</h2>")
    return render(request,'frontend/home.html')

def user_reg(request):

    return render(request,'frontend/u_reg.html')

def admin_login(request):

    return render(request,'frontend/admin_login.html')

def user_page(request):

    return render(request, 'frontend/user/user_page.html')

def admin_page(request):
    return render(request, 'frontend/admin/admin_page.html')