from django.contrib import admin
from .models import Task, CustomUser, AndroidApp, Category, Subcategory

# Register your models here.

admin.site.register(Task)
admin.site.register(CustomUser)
admin.site.register(AndroidApp)
# admin.site.register(Category)
# admin.site.register(Subcategory)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')