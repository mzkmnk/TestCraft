from django.contrib import admin
from .models import *
# Register your models here.

class CustomUser(admin.ModelAdmin):
    list_display = ('username','id','email')
    search_fields=('id',)
admin.site.register(User,CustomUser)

admin.site.register(Company)

class CustomUserActivity(admin.ModelAdmin):
    list_display = ('user','date','problems_solved_count','problems_created_count')
    search_fields=('id',)
admin.site.register(UserActivity,CustomUserActivity)

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
    list_display = ('user','workbook','solved_count','created_at')
    search_fields=('id',)
admin.site.register(UserAnswer,CustomUserAnswer)

class CustomMessage(admin.ModelAdmin):
    list_display = ('sender','receiver','timestamp')
    search_fields=('id',)
admin.site.register(Message,CustomMessage)

class CustomUserCountAnswer(admin.ModelAdmin):
    list_display = ('user','workbook','count')
    search_fields=('id',)
admin.site.register(UserCountAnswer,CustomUserCountAnswer)

class CustomCertification(admin.ModelAdmin):
    list_display = ('username','key')
    search_fields = ('id',)
admin.site.register(Certification,CustomCertification)

class CustomFollow(admin.ModelAdmin):
    list_display = ('follower','following')
    search_fields = ('id',)
admin.site.register(Follow,CustomFollow)

class CustomAiComment(admin.ModelAdmin):
    list_display = ('user','workbook',)
    search_fields = ('id',)
admin.site.register(AiComment,CustomAiComment)

class CustomPost(admin.ModelAdmin):
    list_display = ('user','created_at')
    search_fields = ('id',)
admin.site.register(Post,CustomPost)

class CustomComment(admin.ModelAdmin):
    list_display = ('user','post','created_at')
    search_fields = ('id',)
admin.site.register(Comment,CustomComment)

class CustomGroup(admin.ModelAdmin):
    list_display = ('id','test_name','host')
    search_fields = ('id',)
admin.site.register(Group,CustomGroup)

class CustomGroupMember(admin.ModelAdmin):
    list_display = ('group_id','group','user')
    search_fields = ('id',)
admin.site.register(GroupMember,CustomGroupMember)