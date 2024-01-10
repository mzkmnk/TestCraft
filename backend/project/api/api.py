from django.contrib.auth.hashers import make_password
from ninja import NinjaAPI,Schema

from django.contrib.auth import authenticate
from django.contrib.auth import logout as django_logout

from .models import *

from django.http import JsonResponse



api = NinjaAPI()

# ここではスキーマとAPIを同時に設計する。

# スキーマ
class SignUpSchema(Schema):
    username : str
    email : str
    password : str
    is_company_user : bool = False
    
class LoginSchema(Schema):
    username : str
    password : str


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
        return JsonResponse({
            "success" : True,
            "username" : user.username,
            },
            status = 200,)
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
    return JsonResponse({"success": True}, status=200)