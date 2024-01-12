from django.contrib.auth.hashers import make_password
from ninja import NinjaAPI,Schema

from django.contrib.auth import authenticate
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout

from .models import *

from django.http import JsonResponse


from django.db import transaction
import tempfile
from django.core.files.uploadedfile import UploadedFile
import pandas as pd

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
    csv_file: UploadedFile
    class Config:
        arbitrary_types_allowed = True


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
@api.post("/file_upload")
def file_upload(request ,payload:CsvUploadSchema):
    company_id = request.user.company.company_id
    print(company_id)
    try:
        with transaction.atomic():
            csv_file=payload.csv_file
            #csv_file = request.data.get('file')
            #company_id = request.company_id,
            
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                for chunk in csv_file.chunks():
                    temp_file.write(chunk)
            csv_pandas= pd.read_csv(temp_file.name, encoding='utf-8')
            # デバッグ用
            # print(df)
            # print("Before conversion:", company_id)
            user_address = ""
            company_instance = Company.objects.get(company_id=company_id)
            if csv_pandas is None:
                raise ValueError("DataFrame is None. Check CSV file format.")
            csv_pandas[user_address] = ""
            for index, row in csv_pandas.iterrows():
                # 列の名前を使用して値を取得
                company_user_id = row['company_user_id']
                username = row['username']
                user_public_id = company_id + str(company_user_id)
                user_public_name = username + str(user_public_id).zfill(6)
                # ここでデータベースに書き込み
                User.objects.create_user(username=username, password="password", company_user_id=company_user_id, user_public_name=user_public_name, company=company_instance, user_public_id=user_public_id, is_company_user=True)
                csv_pandas.at[index, 'user_address'] = user_public_name
            print("-" * 20)
            #serializer.is_valid()
            csv_data = csv_pandas.to_csv(index=False)
            print(type(csv_data))

                #response = self.make_url(csv_data)
            return JsonResponse({"csv_data": csv_data})
    except Exception as e:
        # logger.error(f"ファイル処理中にエラーが発生しました: {e}")
        return JsonResponse({"message": "ファイルの処理に失敗しました。", "errors": str(e)})

# @transaction.atomic
# def process_csv_pandas(self, csv_file):
#         try:
#             # InMemoryUploadedFileを一時ファイルに保存
#             with tempfile.NamedTemporaryFile(delete=False) as temp_file:
#                 for chunk in csv_file.chunks():
#                     temp_file.write(chunk)
#             df = pd.read_csv(temp_file.name, encoding='utf-8')
#             return df
#         except Exception as e:
#             logger.error(f"ファイルの処理に失敗: {e}")
#             return None
#         finally:
#             # 一時ファイルを削除
#             os.remove(temp_file.name)