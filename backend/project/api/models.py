from django.db import models

from django.contrib.auth.models import AbstractUser,Group,Permission
from django.contrib.auth.base_user import AbstractBaseUser,BaseUserManager
from django.core.mail import send_mail
from django.db import models
from django.db.models import JSONField
from django.utils.translation import gettext_lazy as _
import random, string
# Create your models here.

class Company(models.Model):
    name =  models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name
    
class User(AbstractUser):
    user_public_name = models.CharField(max_length = 48, null = True, blank = True)
    email = models.EmailField(_('email address'))
    school = models.CharField(max_length = 255, null = True, blank = True)
    company = models.ForeignKey(Company, on_delete = models.CASCADE, null = True, blank = True)
    company_user_id = models.CharField(max_length = 255, null = True, blank = True) # いる？
    is_company_user = models.BooleanField(default = False)
    is_own_company = models.BooleanField(default = False)
    created_at = models.DateField(auto_now_add = True)
    problem_create_cnt = models.IntegerField(default = 0)
    problem_slv_cnt = models.IntegerField(default = 0)
    is_email_certification= models.BooleanField(default = False)
    key = models.CharField(max_length = 48, null = True, blank = True)
    following = models.ManyToManyField('self', through='Follow', symmetrical=False, related_name='followers')
    icon = models.ImageField(upload_to='icon/', null=True, blank=True)
    
    def count_following(self):return self.following.count()
    def count_followers(self):return self.followers.count()
    USERNAME_FIELD = 'username'
    
    groups = models.ManyToManyField(
        Group,
        verbose_name = _('groups'),
        blank = True,
        related_name = "custom_user_permissions",
        related_query_name = "custom_user",
    )
    
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name = _('user permissions'),
        blank = True,
        related_name = "custom_user_permissions",
        related_query_name = "custom_user",
    )
    class Meta:
        unique_together = (('company','company_user_id'),)
    
    def __str__(self):
        return self.username

class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following_user')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers_user')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('follower', 'following'),)

    def __str__(self):
        return f"{self.follower.username} - {self.following.username}"

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='posts')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.content[:30]}" 
    
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE,related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.content[:30]}"

class postLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('user', 'post'),)

    def __str__(self):
        return f"{self.user.username} likes {self.post.id}"

class Certification(models.Model):
    username=models.CharField(max_length = 48, primary_key=True, default='')
    key=models.CharField(max_length = 48,default='')
    

class UserActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    problems_solved_count = models.IntegerField(default=0)
    problems_created_count = models.IntegerField(default=0)

    class Meta:
        unique_together = (('user', 'date'),)

    def __str__(self):
        return f"{self.user.username} - {self.date}"

class Workbook(models.Model):
    workbook_name = models.CharField(max_length=48)
    description = models.TextField(blank=True, null=True)
    create_id = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=True)
    like_count = models.IntegerField(default=0)
    categories = models.ManyToManyField('Category', through='WorkbookCategory')
    is_edit = models.BooleanField(default=False)
    def __str__(self):
        return str(self.id)

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workbook = models.ForeignKey(Workbook, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = (('user', 'workbook'),)
        
    def __str__(self):
        return f"{self.user.username} - {self.workbook.workbook_name}"

class Problem(models.Model):
    workbook_id = models.ForeignKey(Workbook, on_delete=models.CASCADE)
    problem_json = JSONField()
    
    def __str__(self):
        return self.workbook_id.workbook_name

class UserCountAnswer(models.Model):
    workbook = models.ForeignKey(Workbook, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    count = models.IntegerField(default=0)

class UserAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workbook = models.ForeignKey(Workbook, on_delete=models.CASCADE)
    solved_count = models.IntegerField(default=0)
    correctIds = JSONField(default=list)
    answer_json = JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

class AiComment(models.Model):
    workbook = models.ForeignKey(Workbook, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    solved_count = models.IntegerField(default=0)
    comment_json = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.workbook.workbook_name}"
    

class Category(models.Model):
    category_id = models.AutoField(primary_key=True, unique=True)
    category_name = models.CharField(max_length=25)

    def __str__(self):
        return self.category_name


class WorkbookCategory(models.Model):
    workbook = models.ForeignKey(Workbook, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.workbook} - {self.category}'


class Contract(models.Model):
    contract_id = models.IntegerField(primary_key=True, unique=True)
    company_id = models.CharField(max_length=4, null=True, blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    def __str__(self):
        return str(self.contract_id)

class Csv(models.Model):
    company_user_id = models.IntegerField(primary_key=True, unique=True)
    company_user_name = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.company_user_id} - {self.company_user_name}"


# message機能のためのモデル
class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    is_company_send = models.BooleanField(default=False)
    is_slv_workbooks = models.JSONField(null=True,blank=True)
    def __str__(self):
        return f"{self.sender.username} - {self.receiver.username}"

    class Meta:
        ordering = ('timestamp',)