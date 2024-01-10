from django.db import models

from django.contrib.auth.models import AbstractUser,Group,Permission
from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.

class Company(models.Model):
    name =  models.CharField(max_length=100)
    
    def __str__(self):
        return self.name 
    
class User(AbstractUser):
    user_public_id = models.CharField(max_length = 255, unique = True)
    user_public_name = models.CharField(max_length = 48, null = True, blank = True)
    is_company_user = models.BooleanField(default = False)
    company = models.ForeignKey(Company, on_delete = models.CASCADE, null = True, blank = True)
    company_user_id = models.CharField(max_length = 255, null = True, blank = True)
    
    problem_create_cnt = models.IntegerField(default = 0)
    problem_slv_cnt = models.IntegerField(default = 0)
    
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