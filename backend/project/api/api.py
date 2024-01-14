from django.contrib.auth.hashers import make_password
from ninja import NinjaAPI,Schema

from django.contrib.auth import authenticate
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout

from django.db.models import Sum

from .models import *

from django.http import JsonResponse

from pydantic import BaseModel,ValidationError
from typing import Dict,List,Optional,Union

from datetime import date



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
    name : str
class Answer(BaseModel):
    id: str
    value: str

class CommonQuestionFields(BaseModel):
    parentId: Optional[str]
    question: Optional[str]

class RadioQuestion(CommonQuestionFields):
    questionType: str = "radio"
    options: List[Answer]
    canMultiple: bool
    answers: List[Answer]

class TextareaQuestion(CommonQuestionFields):
    questionType: str = "textarea"
    maxlength: str
    answers: List[Answer]

class NestedQuestion(CommonQuestionFields):
    questionType: str = "nested"
    childIds: List[str]

class Root(BaseModel):
    questionType: str = "root"
    title: str
    childIds: List[str]

Question = Union[Root, NestedQuestion, RadioQuestion, TextareaQuestion]

class JsonFormat(BaseModel):
    info: Dict
    questions: Dict[str, Question]

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
        if payload.is_own_company:
            company = Company.objects.create(
                name = payload.username,
                )
            company.save()
            user.company = company
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
        workbooks = Workbook.objects.filter(is_public = True).order_by('-create_at').values(
            'id',
            'workbook_name',
            'description',
            'create_id__username',
            'create_at',
            'update_at',
            'like_count',
        )
        workbooks_with_categories = []
        for workbook in workbooks:
            categories = WorkbookCategory.objects.filter(id=workbook['id']).values_list('category__category_name', flat=True)
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
                'workbook' : None,
                'error' : str(e)
            },
            status = 400
            )

# ユーザが作成した問題を取得するAPI
@api.get("/create_user_workbook")
def get_create_user_workbook(request):
    try:
        workbooks = Workbook.objects.filter(create_id__id = request.user.id).order_by('-create_at').values(
            'id',
            'workbook_name',
            'description',
            'create_id__username',
            'create_at',
            'update_at',
            'like_count',   
        )
        workbooks_with_categories = []
        for workbook in workbooks:
            categories = WorkbookCategory.objects.filter(id=workbook['id']).values_list('category__category_name', flat=True)
            workbooks_with_categories.append({
                **workbook,
                'categories': list(categories)
            })
        User = request.user
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

@api.get("/get_graph_data")
def get_graph_data(request):
    try:
        activities = UserActivity.objects.filter(user_id = request.user.id).values('date').annotate(
            solve_cnt = Sum('problems_solved_count'),
            create_cnt = Sum('problems_created_count')
        ).order_by('date')
        data = [{
            'date': activity['date'].strftime('%Y-%m-%d'),
            'solve_cnt': activity['solve_cnt'],
            'create_cnt': activity['create_cnt']}
            for activity in activities]
        
        return JsonResponse({'success':True,'data': data},status = 200)
    except Exception as e:
        return JsonResponse({'success':False,'data': None},status = 400)
    
@api.post("/save_data")
def save_data(request,data:JsonFormat):
    try:
        workbook = Workbook.objects.create(
            workbook_name = data.info['title'],
            create_id = request.user,
            create_at = date.today(),
            update_at = date.today(),
        ) 
        return JsonResponse(
            {
                'success':True,
                'error':None,
            },
            status = 200
        )
    except ValidationError as e:
        return JsonResponse(
            {
                'success':False,
                'error':e.errors()
            },
            status = 400
        )
    except Exception as e:
        return JsonResponse(
            {
                'success':False,
                'error':str(e)
            },
            status = 400
        )