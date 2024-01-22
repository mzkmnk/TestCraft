from django.contrib import admin
from .models import *
# Register your models here.

class CustomUser(admin.ModelAdmin):
    list_display = ('username','id','email')
    search_fields=('id',)
admin.site.register(User,CustomUser)

admin.site.register(Company)
admin.site.register(UserActivity)

class CustomWorkbook(admin.ModelAdmin):
    list_display = ('workbook_name','id','create_id','is_public')
    search_fields=('id',)
admin.site.register(Workbook,CustomWorkbook)

class CustomProblem(admin.ModelAdmin):
    list_display = ('id','workbook_id')
    search_fields=('id',)
admin.site.register(Problem,CustomProblem)

admin.site.register(Category)
admin.site.register(WorkbookCategory)

class CustomLike(admin.ModelAdmin):
    list_display = ('user','workbook')
    search_fields=('id',)
admin.site.register(Like,CustomLike)

class CustomUserAnswer(admin.ModelAdmin):
    list_display = ('user','workbook')
    search_fields=('id',)
admin.site.register(UserAnswer,CustomUserAnswer)