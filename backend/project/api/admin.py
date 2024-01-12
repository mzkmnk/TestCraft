from django.contrib import admin
from .models import *
# Register your models here.

class CustomUser(admin.ModelAdmin):
    list_display = ('username','id','email')
    search_fields=('id',)
admin.site.register(User,CustomUser)

admin.site.register(Company)
admin.site.register(UserActivity)
admin.site.register(Workbook)
admin.site.register(Category)
admin.site.register(WorkbookCategory)