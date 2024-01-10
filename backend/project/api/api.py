from django.contrib.auth.hashers import make_password
from ninja import NinjaAPI,Schema

from django.contrib.auth import authenticate

from .models import *

api = NinjaAPI()

# ここではスキーマとAPIを同時に設計する。

# スキーマ
class SignUpSchema(Schema):
    username : str
    email : str
    password : str
    
class LoginSchema(Schema):
    username : str
    password : str

# API
@api.post("/signup")
def signup(request, payload: SignUpSchema):
    payload.password = make_password(payload.password) # ここでパスワードハッシュ化
    user = User.objects.create(**payload.dict())
    return { "id" : user.id }

@api.post("/login")
def login(request, payload: LoginSchema):
    user = authenticate(username = payload.username, password = payload.password)
    if user:
        return { "message" : "Success" }
    else:
        return { "message" : "Invalid credentials" },401