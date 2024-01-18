from django.contrib.auth.hashers import make_password
from ninja import NinjaAPI,Schema
from ninja.files import UploadedFile

from django.contrib.auth import authenticate
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout

from .models import *

from django.http import JsonResponse


from django.db import transaction
import tempfile
# from django.core.files.uploadedfile import UploadedFile
import pandas as pd
from io import StringIO

import numpy as np

api = NinjaAPI()

# ここではスキーマとAPIを同時に設計する。

# スキーマ
class SignUpSchema(Schema):
    username : str
    email : str
    password : str
    is_company_user : bool = False
    is_own_company : bool = False
    
class LoginSchema(Schema):
    username : str
    password : str

class CompanySignUpSchema(Schema):
    company_id : str
    name : str

class CsvUploadSchema(Schema):
    csv_data:str

# API
# ユーザー登録するAPI
@api.post("/signup")
def signup(request, payload: SignUpSchema):
    try:
        user = User.objects.create_user(
            username = payload.username,
            email = payload.email,
            password = payload.password,
            is_company_user = payload.is_company_user,
            is_own_company = payload.is_own_company,
            )
        user.set_password(payload.password)
        user.save()
        return JsonResponse({"success":True, "id" : user.id },status = 200)
    except Exception as e:
        return JsonResponse({"success":False, "message" : str(e) },status = 400)

# ログインするAPI
@api.post("/login")
def login(request, payload: LoginSchema):
    user = authenticate(username = payload.username, password = payload.password)
    if user:
        django_login(request,user)
        return JsonResponse(
            {
                "success" : True,
                "username" : user.username,
                "is_own_company" : user.is_own_company,
            },
            status = 200
            )
    else:
        return JsonResponse({ "success" : False },status = 400)

# ログインしているかどうかを確認するAPI
@api.get("/check_auth")
def check_auth(request):
    if request.user.is_authenticated:
        return JsonResponse({"authenticated": True}, status=200)
    else:
        return JsonResponse({"authenticated": False}, status=401)
    
# ログアウトするAPI
@api.post("/logout")
def logout_user(request):
    django_logout(request)
    return JsonResponse(
        {
            "success": True
        },
        status=200
    )

# 会社登録するAPI
@api.post("/company_signup")
def company_signup(request,payload: CompanySignUpSchema):
    try:
        company = Company.objects.create(
            company_id = payload.company_id,
            name = payload.name,
            )
        company.save()
        return JsonResponse({"success":True, "id" : company.company_id },status = 200)
    except Exception as e:
        return JsonResponse({"success":False, "message" : str(e) },status = 400)

# 問題を取得するAPI
@api.get("/questionsall")
def questionsall(request):
    try:
        workbooks = Workbook.objects.filter(is_public = True).order_by('-create_date').values(
            'workbook_id',
            'workbook_name',
            'description',
            'json_data',
            'create_id__username',
            'create_date',
            'update_date'
        )
        workbooks_with_categories = []
        for workbook in workbooks:
            categories = WorkbookCategory.objects.filter(workbook_id=workbook['workbook_id']).values_list('category__category_name', flat=True)
            workbooks_with_categories.append({
                **workbook,
                'categories': list(categories)
            })
        return JsonResponse(
            {
                'success' : True,
                'workbook' : workbooks_with_categories
            },
            status = 200
            )
    except Exception as e:
        return JsonResponse(
            {
                'success' : False,
                'workbook' : None
            },
            status = 400
            )

# ユーザが作成した問題を取得するAPI
@api.get("/create_user_workbook")
def get_create_user_workbook(request):
    print("session",request.session)
    print('user',request.user)
    try:
        workbooks = Workbook.objects.filter(create_id__id = request.user.id).order_by('-create_date').values(
            'workbook_id',
            'workbook_name',
            'description',
            'json_data',
            'create_id__username',
            'create_date',
            'update_date'
        )
        workbooks_with_categories = []
        for workbook in workbooks:
            categories = WorkbookCategory.objects.filter(workbook_id=workbook['workbook_id']).values_list('category__category_name', flat=True)
            workbooks_with_categories.append({
                **workbook,
                'categories': list(categories)
            })
        User = request.user
        print(workbooks_with_categories,User.id)
        return JsonResponse(
            {
                'success' : True,
                'workbook' : workbooks_with_categories,
            },
            status = 200
        )
    except Exception as e:
        return JsonResponse(
            {
                'success' : False,
                'workbook' : None
            },
            status = 400
            )

#社員ユーザをcvsファイルを用いて一斉に登録するAPI
@api.post("/add_user")
def add_user(request ,payload:CsvUploadSchema):
    try:
        
        data_str = payload.csv_data
        
        
        df = pd.read_csv(StringIO(data_str))
        df["ユーザー名"]=""
        for index, row in df.iterrows():
            #data_str3=r.split(",")
            
            user_name=row["社員名"]+str(row["社員番号"])
            
            # user = User.objects.create_user(
            #     username=user_name,
            #     password=request.user.password, 
            #     email=request.user.email,
            #     company=request.user.company,
            #     is_company_user=True,
            # )
            # user.save()
            
            df.at[index, 'ユーザー名'] = user_name
        user_csv=df.to_csv(index=False)
        print(user_csv)
        
        return JsonResponse(
            {
                "success":True,
                "csv_data":user_csv,
                "error":None,
            },
            status = 200,
        )
    except Exception as e:
        return JsonResponse(
            {
                "success":False,
                "csv_data":None,
                "error":str(e),
            },
            status = 400,
        )