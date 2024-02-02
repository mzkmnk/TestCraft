from django.contrib.auth.hashers import make_password
from ninja import NinjaAPI,Schema
from ninja.files import UploadedFile

from django.contrib.auth import authenticate
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout

from django.shortcuts import get_object_or_404

from django.db.models import Sum

from .models import *

from django.http import JsonResponse

from pydantic import BaseModel,ValidationError
from typing import Dict,List,Optional,Union

from datetime import date


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

class EditorSchema(Schema):
    workbook_id:int
    
class likeAddSchema(Schema):
    workbook_id:int

class likeDeleteSchema(Schema):
    workbook_id:int

class CsvUploadSchema(Schema):
    csv_data:str
    
class SaveAnswerSchema(Schema):
    workbook_id:int
    answers:str
    
class MessageSchema(Schema):
    message:str
    to:str
    workbooks:str
    
class UserChangeSchema(Schema):
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
        return JsonResponse({"authenticated": False})
    
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

#登録情報を変更するAPI
@api.post("/user_change")
def user_change(request,payload: UserChangeSchema):
    try:
        user = User.objects.get(
            pk=request.user.id,
        )
        print("*"*20)
        user.username = payload.username
        user.set_password(payload.password)
        user.save()
        django_login(request,user)
        return JsonResponse({
            "success":True,
            "id" : user.id,
            "username":user.username,
            },
                status = 200
        )
    except Exception as e:
        return JsonResponse({"success":False, "message" : str(e) },status = 400)
        
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
        workbooks = Workbook.objects.filter(is_public = True).order_by('-created_at').values(
            'id',
            'workbook_name',
            'description',
            'create_id__username',
            'created_at',
            'updated_at',
            'like_count',
        )
        workbooks_with_likes = []
        for workbook in workbooks:
            liked_by_user = Like.objects.filter(user=request.user, workbook_id=workbook['id']).exists()
            workbook['liked_by_user'] = liked_by_user
            workbooks_with_likes.append(workbook)
        print(workbooks_with_likes)
        return JsonResponse(
            {
                'success':True,
                'workbooks':workbooks_with_likes,
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
        workbooks = Workbook.objects.filter(create_id__id = request.user.id).order_by('-created_at').values(
            'id',
            'workbook_name',
            'description',
            'create_id__username',
            'created_at',
            'updated_at',
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
            
            user = User.objects.create_user(
                username=user_name,
                email=request.user.email,
                company=request.user.company,
                is_company_user=True,
            )
            user.password = request.user.password
            user.save()
            
            df.at[index, 'ユーザー名'] = user_name
        user_csv=df.to_csv(index=False)
        print(user_csv)
        
        return JsonResponse(
            {
                "success":True,
                "csv_data":user_csv,
                "error":None,
            }
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

#グラフを修正するAPI(beta)       
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

#問題を保存するAPI
@api.post("/save_data")
def save_data(request,data:JsonFormat):
    try:
        workbook_id = None
        if(data.info.get('workbook_id') is not None):
            workbook_id = data.info['workbook_id']
        if(Workbook.objects.filter(id = workbook_id).exists()):
            workbook = Workbook.objects.get(id = workbook_id)
            workbook.workbook_name = data.info['title']
            workbook.save()
            problem = Problem.objects.get(workbook_id = workbook_id)
            problem.problem_json = data.json()
            problem.save()
            return JsonResponse(
                {
                    'success':True,
                    'error':None,
                },
                status = 200
            )
        workbook = Workbook.objects.create(
            workbook_name = data.info['title'],
            create_id = request.user,
            is_edit = True,
        )
        Problem.objects.create(
            workbook_id = Workbook.objects.get(id = workbook.id),
            problem_json = data.json(),
        )
        if(UserActivity.objects.filter(user_id = request.user.id, date = date.today()).exists()):
            activity = UserActivity.objects.get(user_id = request.user.id, date = date.today())
            activity.problems_created_count += 1
            activity.save()
        else:
            UserActivity.objects.create(
                user_id = request.user.id,
                date = date.today(),
                problems_created_count = 1,
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

#問題編集画面を表示する。
import json
@api.get("/edit_workbook/{workbookId}")
def edit_workbook(request,workbookId:int):
    try:
        json_data = Problem.objects.get(workbook_id = workbookId).problem_json
        return JsonResponse(
            {
                'success': True,
                'data' : json.loads(json_data),
                'error' : None,
            },
            status = 200
        )
    except Exception as e:
        return JsonResponse(
            {
                'success': False,
                'data' : None,
                'error' : str(e),
            },
            status = 400
        )

#like機能
@api.post("/questionsall/{workbookId}/like")
def add_like(request,workbookId:int):
    try:
        user = request.user
        workbook = get_object_or_404(Workbook,id=workbookId)
        like = Like.objects.filter(user=user,workbook=workbook)
        if like.exists():
            like.delete()
            workbook.like_count = max(0,workbook.like_count - 1)
            workbook.save()
            return JsonResponse(
                {
                    "success":True,
                    "error":None,
                    "like_count":workbook.like_count,
                },
                status = 200,
            )
        Like.objects.create(
            user = user,
            workbook = workbook,
        )
        Message.objects.create(
            sender = user,
            receiver = workbook.create_id,
            message = f"{user.username}さんがあなたの問題「{workbook.workbook_name}」をいいねしました。",
        )
        workbook.like_count += 1
        workbook.save()
        
        return JsonResponse(
            {
                "success":True,
                "error":None,
                "like_count":workbook.like_count,
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

#ユーザが解答した情報を保存するAPI
@api.post("/save_answer")
def save_answer(request,payload:SaveAnswerSchema):
    try:
        workbook_id = payload.workbook_id
        is_user_count_answer = UserCountAnswer.objects.filter(user = request.user, workbook = Workbook.objects.get(id = workbook_id))
        solved_count = 0
        if(is_user_count_answer):
            user_count_answer = UserCountAnswer.objects.get(user = request.user, workbook = Workbook.objects.get(id = workbook_id))
            solved_count = user_count_answer.count
            user_count_answer.count += 1
        else:
            user_count_answer = UserCountAnswer.objects.create(
                user = request.user,
                workbook = Workbook.objects.get(id = workbook_id),
                count = 1,
            )
        user_count_answer.save()
        if(UserActivity.objects.filter(user_id = request.user.id, date = date.today()).exists()):
            activity = UserActivity.objects.get(user_id = request.user.id, date = date.today())
            activity.problems_solved_count += 1
            activity.save()
        else:
            UserActivity.objects.create(
                user_id = request.user.id,
                date = date.today(),
                problems_solved_count = 1,
            )
        answers = json.loads(payload.answers)
        UserAnswer.objects.create(
            user = request.user,
            workbook = Workbook.objects.get(id = workbook_id),
            answer_json = answers,
            solved_count = solved_count,
        )
        JsonResponse(
            {
                "success":True,
                "error":None,
            },
            status = 200,
        )
    except Exception as e:
        return JsonResponse(
            {
                "success":False,
                "error":str(e),
            },
            status = 400,
        )

#ユーザが解答した問題を取得するAPI
@api.get("/solve_workbook")
def solve_workbook(request):
    try:
        user_answers = UserAnswer.objects.filter(user = request.user).values(
            'workbook__id',
            'workbook__workbook_name',
            'workbook__description',
            'workbook__create_id__username',
            'workbook__created_at',
            'workbook__updated_at',
            'workbook__like_count',
            'answer_json',
            'solved_count',
        )
        user_answers_with_categories = []
        for user_answer in user_answers:
            categories = WorkbookCategory.objects.filter(id=user_answer['workbook__id']).values_list('category__category_name', flat=True)
            user_answers_with_categories.append({
                **user_answer,
                'categories': list(categories)
            })
        print(user_answers_with_categories)
        return JsonResponse(
            {
                'success' : True,
                'workbook' : user_answers_with_categories,
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
#ユーザが解いた問題の情報を取得するAPI
@api.get("/solve_detail/{workbookId}/{solved_count}")
def solve_detail(request,workbookId:int,solved_count:int):
    try:
        print(workbookId,solved_count)
        workbook = Workbook.objects.get(id = workbookId)
        user_answer = UserAnswer.objects.get(user = request.user, workbook = workbook, solved_count = solved_count)
        print("ok")
        problem = Problem.objects.get(workbook_id = workbookId).problem_json
        return JsonResponse(
            {
                "success":True,
                "workbook":problem,
                "user_answer":user_answer.answer_json,
                "error":None,
            },
            status = 200,
        )
    except Exception as e:
        return JsonResponse(
            {
                "success":False,
                "error":str(e),
            },
            status = 400,
        )

@api.get("/message")
def message(request):
    try:
        message_all = [
            {"id":i,
             "message":data.message,
             "timestamp":data.timestamp,
             "is_company_send":data.is_company_send,
             "workbooks":data.is_slv_workbooks,
            }
            for i,data in enumerate(Message.objects.filter(receiver = request.user).order_by('-timestamp'))
        ]
        print(f"{request.user.is_company_user = }")
        return JsonResponse(
            {
                "success":True,
                "message": message_all,
                "is_company_user":request.user.is_company_user,
                "error":None,
            },
            status = 200,
        )
    except Exception as e:
        return JsonResponse(
            {
                "success":False,
                "message":None,
                "error":str(e),
            },
            status = 400,
        )

@api.get("/get_company_user")
def get_company_user(request):
    try:
        company = request.user.company
        company_user = [
            {
                "id":user.id,
                "username":user.username,
            }
            for _i,user in enumerate(User.objects.filter(company = company))
        ]
        workbooks = [
            {
                "id":workbook.id,
                "name":workbook.workbook_name,
            }
            for _i,workbook in enumerate(Workbook.objects.filter(create_id = request.user))
        ]
        print(workbooks)
        print(company_user)
        return JsonResponse(
            {
                "success":True,
                "data":company_user,
                "workbooks":workbooks,
                "error":None,
            },
            status = 200,
        )
    except Exception as e:
        return JsonResponse(
            {
                "success":False,
                "data":None,
                "workbooks":None,
                "error":str(e),
            },
            status = 400,
        )
    
@api.post("/send_message")
def send_messsage(request,payload:MessageSchema):
    try:
        message = payload.message
        users = payload.to.split(',')
        workbooks = payload.workbooks.split(',')
        workbook_dict = {}
        for workbook in workbooks:
            workbook_id,workbook_name = workbook.split(':')
            workbook_dict[workbook_id] = workbook_name
        print(workbook_dict)
        for user in users:
            user_id,_username = user.split(':')
            Message.objects.create(
                sender = request.user,
                receiver = User.objects.get(id = user_id),
                message = message,
                is_company_send = True,
                is_slv_workbooks = workbook_dict,
            )
        return JsonResponse(
            {
                "success":True,
                "error":None,
            },
            status = 200,
        )
    except Exception as e:
        return JsonResponse(
            {
                "success":False,
                "error":str(e),
            },
            status = 400,
        )

@api.get("is_company_user")
def is_company_user(request):
    try:
        if(request.user.is_anonymous):
            return JsonResponse(
                {
                    "success":True,
                    "is_own_company":False,
                    "is_company_user":False,
                    "error":None,
                    
                },
                status = 201,
            )
        return JsonResponse(
            {
                "success":True,
                "is_own_company":request.user.is_own_company,
                "is_company_user":request.user.is_company_user,
                "error":None,
            },
            status = 200,
        )
    except Exception as e:
        return JsonResponse(
            {
                "success":False,
                "error":str(e),
            },
            status = 400,
        )

@api.get("/all_company_users")
def all_users(request):
    try:
        data = [
            {
                "id":user.id,
                "name":user.username, 
                "created_at":user.created_at,
            }
            for user in User.objects.filter(company=request.user.company)
        ]
        print(data)
        return JsonResponse(
            {
                "success":True,
                "data":data,
                "error":None,
            },
            status = 200,
        )
    except Exception as e:
        return JsonResponse(
            {
                "success":False,
                "data":None,
                "error":str(e),
            },
            status = 400,
        )