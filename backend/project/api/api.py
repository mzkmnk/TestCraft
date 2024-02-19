from django.contrib.auth.hashers import make_password
from ninja import NinjaAPI,Schema
from ninja.files import UploadedFile

from django.conf import settings
from urllib.parse import urljoin

from django.contrib.auth import authenticate
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout

from django.shortcuts import get_object_or_404

from django.db.models import Sum

from .models import *

from django.http import JsonResponse

from pydantic import BaseModel,ValidationError,HttpUrl
from typing import Dict,List,Optional,Union

from datetime import date


from django.db import transaction
import tempfile
# from django.core.files.uploadedfile import UploadedFile
import pandas as pd
from io import StringIO

import numpy as np

from django.core.mail import send_mail

from django.core.exceptions import ObjectDoesNotExist

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
    useAIScoring: bool


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
    isEdit:bool

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
    correctIds:List[str]
    answers:str
    
class MessageSchema(Schema):
    message:str
    to:str
    workbooks:str
    
class UserChangeSchema(Schema):
    password : str
    school : str
    
class EmailVerificationSchema(Schema):
    username : str
    
class PassChangeSchema(Schema):
    url:str
    email:str
    username:str

class AiScore(BaseModel):
    question_tree:Dict[str,Question]
    answers:Dict[str,Union[str,int]]
    workbookId:str
    target_answer:List[str]

class FollowSchema(Schema):
    isFollow:bool
    userId:str

class PostLikeSchema(Schema):
    postId:int

class PostCommentSchema(Schema):
    postId:str
    content:str

class DeleteWorkBookSchema(Schema):
    workbookId:int

# API
    
#ログイン中のユーザー情報を取得するAPI

# ユーザー登録するAPI
@api.post("/signup")
def signup(request, payload: SignUpSchema):
    try:
        is_username_exist = User.objects.filter(username = payload.username).exists()
        if(is_username_exist):
            return JsonResponse(
                {
                    "message":"ユーザー名が既に存在しています。",
                },
                status = 422,
            )
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
    if(request.user.is_authenticated):
        return JsonResponse({
            "success":True,
            "authenticated": True
            },
            status=200
        )
    else:
        return JsonResponse(
            {
                "success":False,
                "authenticated": False
            }
        )
    
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
    
#認証用メールを送信をするAPI
@api.post("/send_email")
def send_email(request,payload:PassChangeSchema):
    verification_url = payload.url
    send_email = payload.email
    try:
        rand_key = [random.choice(string.ascii_letters + string.digits) for i in range(10)]
        rand_key=str(rand_key)
        user_object = User.objects.get(username=payload.username)
        user_object.key=rand_key
        user_object.save()
        certification = Certification.objects.create(
            key = rand_key,
            username = payload.username,
        )
        certification.save()
        subject = "メールアドレス認証"
        message = f"このメールは問題作成アプリ新規登録用です。\n新規登録をお済でない場合下記のURLをクリックしてメールアドレスを認証してください。\nこのメールに心当たりがない場合メールの削除をお願いいたします。\n{verification_url}"
        from_email = "testcrarts.official@gmail.com"
        send_mail(
            subject,
            message,
            from_email,
            [
                send_email,
            ],
            fail_silently=False
        )
    except Exception as e:
        return JsonResponse({"success":False, "message" : str(e) },status = 400)

#メールアドレス認証を完了するAPI
@api.post("/email_verification")
def email_verification(request,payload:EmailVerificationSchema):
    try :
        status=""
        certification_instance = Certification.objects.get(username=payload.username)
        certification_key = certification_instance.key
        user_object = User.objects.get(username=payload.username)
        
        user_key = user_object.key

        if(certification_key == user_key):
            if user_object.is_email_certification == False :
                user_object.is_email_certification = True
                user_object.save()
                status="1"
            else:
                status="2"
        else :
                status="3"
        certification_instance.delete()
        return JsonResponse(
            {
                "success":True,
                "status":status,
                "error":None,
            },
            status = 200,
        )
    except Exception as e:
        return JsonResponse({"success":False, "message" : str(e) },status = 400)
        
#パスワード変更用メールを送信をするAPI
@api.post("/change_pass_send")
def change_pass_send(request,payload:PassChangeSchema):
    send_email = payload.email
    verification_url = payload.url
    try:
        rand_key = [random.choice(string.ascii_letters + string.digits) for i in range(10)]
        rand_key=str(rand_key)
        
        user_object = User.objects.get(username=payload.username)
        
        user_object.key=rand_key
        user_object.save()
        if(Certification.objects.filter(username=payload.username).exists()):
            certification_instance = Certification.objects.get(username=payload.username)
            certification_instance.key = rand_key
            certification_instance.save()
        else:
            certification = Certification.objects.create(
                key = rand_key,
                username = payload.username,
            )
            certification.save()
        
        subject = "パスワード変更画面"
        message = f"このメールは問題作成アプリのパスワード変更用メールです。\nパスワードを忘れた場合下記のURLをクリックしてメールアドレスを認証してください。\nこのメールに心当たりがない場合メールの削除をお願いいたします。\n{verification_url}"
        from_email = "testcrarts.official@gmail.com"
        send_mail(
            subject,
            message,
            from_email,
            [
                send_email,
            ],
            fail_silently=False
        )
        return JsonResponse(
            {
                "success":True,
                "error":None,
            }
        )
    except Exception as e:
        return JsonResponse(
            {
                "success":False,
                "error" : str(e)
            },
            status = 400
        )

#パスワードを変更するAPI
@api.post("/change_pass")
def change_pass(request,payload :LoginSchema):
    try:
        certification_instance = Certification.objects.get(username=payload.username)
        certification_key = certification_instance.key
        user_object = User.objects.get(username=payload.username)
        user_key = user_object.key
        if(certification_key == user_key):
            user_object.set_password(payload.password)
            user_object.save()
        else:
            return JsonResponse(
                {
                    "success":False,
                    "error":None,
                    "message" : "認証キーが一致しません。",
                },
                status = 400
            )
        certification_instance.delete()
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
                "success": False,
                "message": "ユーザーが見つかりませんでした。",
                "error": str(e)
            }, 
            status=400
        )

# ユーザ詳細画面
@api.get("/profile/{userId}")
def profile(request,userId:int):
    try:
        user = User.objects.get(id=userId)
        isFollow = Follow.objects.filter(follower=request.user,following=user).exists()
        user_answers = UserAnswer.objects.filter(user = user).values(
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
        solved_workbook = [
            {
                "id":user_answer['workbook__id'],
                "workbook_name":user_answer['workbook__workbook_name'],
                "description":user_answer['workbook__description'],
                "create_id__username":user_answer['workbook__create_id__username'],
                "created_at":user_answer['workbook__created_at'],
                "updated_at":user_answer['workbook__updated_at'],
                "like_count":user_answer['workbook__like_count'],
                "answer_json":user_answer['answer_json'],
                "solved_count":user_answer['solved_count'],
            }
            for user_answer in user_answers
        ]

        workbooks = Workbook.objects.filter(create_id__id = user.id).order_by('-created_at').values(
            'id',
            'workbook_name',
            'description',
            'create_id__username',
            'created_at',
            'updated_at',
            'like_count',   
        )
        created_workbook = []
        for workbook in workbooks:
            categories = WorkbookCategory.objects.filter(id=workbook['id']).values_list('category__category_name', flat=True)
            created_workbook.append({
                **workbook,
                'categories': list(categories)
            })
        posts_data = Post.objects.filter(user = user).order_by('-created_at').values(
            'id',
            'content',
            'created_at',
        )
        posts = [
            {
                "id":post['id'],
                "content":post['content'],
                "created_at":post['created_at'],
            }
            for post in posts_data
        ]
        return JsonResponse(
            {
                "success":True,
                "username":user.username,
                "icon":user.icon.url if user.icon else None,
                "email":user.email,
                "school":user.school,
                "isFollow":isFollow,
                "post":posts,
                "solved_workbook":solved_workbook,
                "created_workbook":created_workbook,
                "followCount":user.count_following(),
                "followerCount":user.count_followers(),
                "error":None,
            },
            status = 200,
        )
    except Exception as e:
        return JsonResponse(
            {
                "success":False,
                "user":None,
                "email":None,
                "error":str(e),
            },
            status = 400,
        )

#フォロー、アンフォローするAPI
@api.post("/follow")
def follow(request,payload:FollowSchema):
    try:
        isFollow = payload.isFollow
        userId = int(payload.userId)
        if isFollow==False:#フォローする
            Follow.objects.get_or_create(follower=request.user,following=User.objects.get(id=userId))
            isFollow = True
        else:#アンフォローする
            Follow.objects.filter(follower=request.user, following=User.objects.get(id=userId)).delete()
            isFollow = False
        print(f"{isFollow=}")
        return JsonResponse(
            {
                "success":True,
                "isFollow":isFollow,
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

#　ログインユーザ情報取得API
@api.get("/get_user_info_change")
def get_user_info(request):
    try:
        user = request.user
        icon_url = urljoin(f'https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/media/', user.icon.name)
        return JsonResponse(
            {
                "success":True,
                "user_id":user.id,
                "username":user.username,
                "email":user.email,
                "school":user.school,
                "icon":icon_url,
                "icon_init":user.icon.name if user.icon else None,
                "followCount":user.count_following(),
                "followerCount":user.count_followers(),
                "error":None,
            },
            status = 200,
        )
    except Exception as e:
        return JsonResponse(
            {
                "success":False,
                "user":None,
                "email":None,
                "error":str(e),
            },
            status = 400,
        )

#ユーザのアイコンを変更するAPI
@api.post("/change_icon")
def change_icon(request,icon:UploadedFile):
    try:
        user = request.user
        user.icon = icon
        user.save()
        return JsonResponse(
            {
                "success":True,
                "icon":user.icon.url if user.icon else None,
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

    
#登録情報を変更するAPI
@api.post("/user_change")
def user_change(request,payload: UserChangeSchema):
    try:
        print(payload)
        user = User.objects.get(
            pk=request.user.id,
        )
        print(payload)
        password = payload.password
        if(password != ""):
            user.set_password(payload.password)
        user.school = payload.school
        user.save()
        django_login(request,user)
        return JsonResponse({
            "success":True,
            "username":user.username,
            },
                status = 200
        )
    except Exception as e:
        return JsonResponse(
            {
                "success":False,
                "message" : str(e)
            },
            status = 400
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
        workbooks = Workbook.objects.filter(is_public = True,is_edit = False).order_by('-created_at').values(
            'id',
            'workbook_name',
            'description',
            'create_id__username',
            'create_id',
            'created_at',
            'updated_at',
            'like_count',
        )
        workbooks_with_likes = []
        for workbook in workbooks:       
            liked_by_user = Like.objects.filter(user=request.user, workbook_id=workbook['id']).exists()
            workbook['liked_by_user'] = liked_by_user
            workbooks_with_likes.append(workbook)
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
        print(workbooks_with_categories)
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
        print(f"{data_str = }")
        df = pd.read_csv(StringIO(data_str))
        df["ユーザー名"]=""
        print(f"{df.head() = }")
        for index, row in df.iterrows():
            user_name=f"{row['社員名']}_{str(request.user.id).zfill(5)}_{str(row['社員番号']).zfill(5)}"
            if(User.objects.filter(username=user_name).exists()):
                df.at[index, 'ユーザー名'] = f"{user_name}は既に登録されています。"
                continue
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
        is_edit = data.isEdit
        if(data.info.get('workbook_id') is not None):
            workbook_id = data.info['workbook_id']
        if(Workbook.objects.filter(id = workbook_id).exists()):
            workbook = Workbook.objects.get(id = workbook_id)
            workbook.workbook_name = data.info['title']
            workbook.is_edit = is_edit
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
            is_edit = is_edit,
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
                "id":workbook.id,
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

#問題を削除するAPI
@api.post("/delete_workbook")
def delete_workbook(request,payload:DeleteWorkBookSchema):
    try:
        workbook_id = payload.workbookId
        workbook = Workbook.objects.get(id = workbook_id)
        workbook.delete()
        return JsonResponse(
            {
                'success':True,
                'error':None,
            },
            status = 200
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
            correctIds = payload.correctIds,
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
        user_answers = UserAnswer.objects.filter(user = request.user).order_by('-created_at').values(
            'workbook__id',
            'workbook__workbook_name',
            'workbook__description',
            'workbook__create_id__username',
            'workbook__create_id',
            'workbook__created_at',
            'workbook__updated_at',
            'workbook__like_count',
            'answer_json',
            'solved_count',
            'created_at'
        )
        user_answers_with_categories = []
        for user_answer in user_answers:
            categories = WorkbookCategory.objects.filter(id=user_answer['workbook__id']).values_list('category__category_name', flat=True)
            user_answers_with_categories.append({
                **user_answer,
                'categories': list(categories)
            })
        print(user_answers_with_categories)
        workbook = [
            {
                "id":user_answer['workbook__id'],
                "workbook_name":user_answer['workbook__workbook_name'],
                "description":user_answer['workbook__description'],
                "create_id__username":user_answer['workbook__create_id__username'],
                "create_id":user_answer['workbook__create_id'],
                "created_at":user_answer['workbook__created_at'],
                "updated_at":user_answer['workbook__updated_at'],
                "like_count":user_answer['workbook__like_count'],
                "answer_json":user_answer['answer_json'],
                "solved_count":user_answer['solved_count'],
                "solved_created_at":user_answer['created_at'],
            }
            for user_answer in user_answers
        ]
        print(workbook)
        return JsonResponse(
            {
                'success' : True,
                'workbook' : workbook,
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
        workbook = Workbook.objects.get(id = workbookId)
        user_answer = UserAnswer.objects.get(user = request.user, workbook = workbook, solved_count = solved_count)
        problem = Problem.objects.get(workbook_id = workbookId).problem_json
        print("Ok2")
        ai_comment = AiComment.objects.get(
            workbook = workbook,
            user = request.user,
            solved_count = solved_count,
        )
        print("Ok3")
        return JsonResponse(
            {
                "success":True,
                "workbook":problem,
                "correctIds":user_answer.correctIds,
                "user_answer":user_answer.answer_json,
                "ai_comment":ai_comment.comment_json,
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

# 会社のユーザかどうかを確認するAPI
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

# メッセージを送信するAPI 
@api.post("/send_message")
def send_messsage(request,payload:MessageSchema):
    try:
        message = payload.message
        users = payload.to.split(',')
        workbooks = payload.workbooks.split(',')
        workbook_dict = {}
        for workbook in workbooks:
            if(workbook == ""):
                break
            workbook_id,workbook_name = workbook.split(':')
            workbook_dict[workbook_id] = workbook_name
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

# 会社のユーザかどうかを確認するAPI
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

# 会社のユーザーを取得するAPI
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

# AI採点を行うAPI
# わかりにくいからここでai.pyをimportしている。
from .ai import check_answer
@api.post("/ai_scoring")
def ai_score(request,payload:AiScore):
    try:

        question_trees = payload.question_tree
        target_answers = payload.target_answer
        answers = payload.answers
        workbook_id = int(payload.workbookId)
        question_keys = list(question_trees.keys())

        debug = False#ここ変更するとデバックデータを返す。

        workbook = Workbook.objects.get(id = workbook_id)
        user = request.user
        user_count_answer,_created = UserCountAnswer.objects.get_or_create(
            workbook = workbook,
            user = user,
        )
        comment = []
        if(debug):
            from random import choice
            debug_results = []
            for target_answer in target_answers:
                is_correct = choice([True,False])
                debug_results.append(
                    {
                        "id":target_answer,
                        "is_correct":is_correct,
                        "confidence":100,
                        "explanation":f"{'正解' if is_correct else '不正解'}です。(デバックデータです。)",
                    }
                )
            print(debug_results)
            ai_comment = AiComment.objects.create(
                workbook = workbook,
                user = user,
                solved_count = user_count_answer.count,
                comment_json = [
                    {
                        data["id"]:data["explanation"]
                    }
                    for data in debug_results
                ],
            )
            return JsonResponse(
                {
                    "success":True,
                    "results":debug_results,
                    "error":None,
                },
                status = 200,
            )
        results = []
        print("question_trees",question_trees[question_keys[0]])
        if(hasattr(question_trees[question_keys[0]],"childIds")):
            for childIds_parent in question_trees[question_keys[0]].childIds:
                print("childIds_parent",childIds_parent)
                print("question_trees[childIds_parent]",question_trees[childIds_parent])
                if(hasattr(question_trees[childIds_parent],"childIds")):
                    child_keys = list(question_trees[childIds_parent].childIds)
                    if(any( child_key in target_answers for child_key in child_keys )):
                        print(question_trees[childIds_parent])
                        print("questions : ",question_trees[child_keys[0]])
                        question_text : str = question_trees[childIds_parent].question
                        questions : list[str] = [ question_trees[child_key].question for child_key in child_keys ]
                        user_answers : list[str] = [ answers.get(child_key,'ユーザは解答していません。') for child_key in child_keys ]#ユーザが解答してない場合、空文字を返す。
                        """
                        現状正解データがstr型であるので構文解析っぽい感じで正解データを取得する必要がある。
                        形式 : [Answer(id='<id>', value='<正解データ>')]
                        そのため、value='を区切り文字として正解データを取得する。
                        """
                        correct_answers : list[str] = []
                        for child_key in child_keys:
                            bef_answer = str(question_trees[child_key].answers[0])
                            start = bef_answer.find("value='") + len("value='")
                            end = bef_answer.find("'",start)
                            correct_answers.append(bef_answer[start:end])
                        check_answer_data = check_answer(question_text,questions,user_answers,correct_answers) 

                        for i,data in enumerate(check_answer_data):
                            results.append(
                                {
                                    "id":child_keys[i],
                                    "is_correct":data["is_correct"],
                                    "confidence":data["confidence"],
                                    "explanation":data["explanation"],
                                }
                            )
                    else:
                        print("No")
                    print("*"*30)
                else:
                    print("No childIds child")
                    if(hasattr(question_trees[childIds_parent],"useAIScoring")):
                        if(question_trees[childIds_parent].useAIScoring):
                            question_text : str = question_trees[childIds_parent].question
                            questions : list[str] = [ question_trees[childIds_parent].question ]
                            user_answers : list[str] = [ answers.get(childIds_parent,'ユーザは解答していません。') ]
                            
                            # print("question_text",question_text)
                            # print("questions",questions)
                            # print("user_answers",user_answers)

                            check_answer_data = check_answer(question_text,questions,user_answers,[target_answers[0]])

                            for i,data in enumerate(check_answer_data):
                                results.append(
                                    {
                                        "id":childIds_parent,
                                        "is_correct":data["is_correct"],
                                        "confidence":data["confidence"],
                                        "explanation":data["explanation"],
                                    }
                                )
                    else:
                        print("No useAIScoring")
        else:
            print("No childIds parent")
        
        aicomment = AiComment.objects.create(
            workbook = Workbook.objects.get(id = workbook_id),
            user = request.user,
            solved_count = user_count_answer.count,
            comment_json = [
                {
                    data["id"]:data["explanation"]
                }
                for data in results
            ]
        )
        aicomment.save()
        return JsonResponse(
            {
                "success":True,
                "results":results,
                "error":None,
            },
            status = 200,
        )
    except Exception as e:
        print("error:",e)
        return JsonResponse(
            {
                "success":False,
                "error":str(e),
            },
            status = 400,
        )

#投稿内容を10件取得するAPI
#これ使わないかも、というか多分使わないappsyncのクエリでやると思う
@api.get("/get_post")
def get_post(request):
    try:
        posts = Post.objects.all().order_by('-created_at')[:10]

        data = [
            {
                "id":post.id,
                "user":{
                    "id":post.user.id,
                    "username":post.user.username,
                    "email":post.user.email,
                    "isCompanyUser":post.user.is_company_user,
                    "isOwnCompany":post.user.is_own_company,
                    "createdAt":post.user.created_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
                    "problemCreateCnt":post.user.problem_create_cnt,
                    "problemSlvCnt":post.user.problem_slv_cnt,
                    "isEmailCertification":post.user.is_email_certification,
                },
                "content":post.content,
                "createdAt":post.created_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
                "updatedAt":post.updated_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
                "comments":[
                    {
                        "id":comment.id,
                        "user":{
                            "id":comment.user.id,
                        },
                        "post":{
                            "id":comment.post.id,
                        },
                        "content":comment.content,
                        "createdAt":comment.created_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
                    }
                    for comment in post.comments.all()
                ],
                "likes":[
                    {
                        "id":like.id,
                        "user":{
                            "id":like.user.id,
                        },
                        "createdAt":like.created_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
                    }
                    for like in post.likes.all()
                ]
            }
            for post in posts
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

@api.post("/post_like")
def post_like(request,payload:PostLikeSchema):
    try:
        user = request.user
        post = Post.objects.get(id = payload.postId)
        is_like_post = postLike.objects.filter(user = user,post = post).exists()
        if(is_like_post):
            postLike.objects.filter(user = user,post = post).delete()
            data = None
        else:
            post_like = postLike.objects.create(user = user,post = post)
            data = {
                "id":post_like.id,
                "user":{
                    "id":post_like.user.id,
                    "username":post_like.user.username,
                },
                "createdAt":post_like.created_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
            }
        return JsonResponse(
            {
                "success":True,
                "data":data,
                "postId":payload.postId,
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

@api.get("/get_post_detail/{postId}")
def get_post_detail(request,postId:int):
    try:
        post = Post.objects.get(id = postId)
        user = post.user
        comments = [
            {
                "id":comment.id,
                "content":comment.content,
                "createdAt":comment.created_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
                "user":{
                    "id":comment.user.id,
                    "username":comment.user.username,
                    "icon":comment.user.icon.url if comment.user.icon else None,
                },
            }
            for comment in Comment.objects.filter(post = post).order_by('-created_at')
        ]
        likes = [
            {
                "id":like.id,
                "user":{
                    "id":like.user.id,
                    "username":like.user.username,
                    "icon":like.user.icon.url if like.user.icon else None,
                },
            }
            for like in postLike.objects.filter(post = post)
        ]
        data = {
            "post":{
                "id":post.id,
                "content":post.content,
                "createdAt":post.created_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
                "updatedAt":post.updated_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
                "user":{
                    "id":user.id,
                    "username":user.username,
                    "icon":user.icon.url if user.icon else None,
                },
            },
            "comments":comments,
            "likes":likes,
            "is_request_user_like":postLike.objects.filter(user=request.user,post = post).exists(),
        }
        print(data)
        return JsonResponse(
            {
                "success":True,
                "data":data,
                "error":None,
            },
            status = 200
        )
    except Exception as e:
        return JsonResponse(
            {
                "success":False,
                "error":str(e),
            },
            status = 400
        )

@api.post("/post_comment")
def post_comment(request,payload:PostCommentSchema):
    try:
        user = request.user

        post = Post.objects.get(id = payload.postId)
        comment = Comment.objects.create(
            user = user,
            post = post,
            content = payload.content,
        )
        return JsonResponse(
            {
                "success":True,
                "comment":{
                    "id":comment.id,
                    "content":comment.content,
                    "createdAt":comment.created_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
                    "user":{
                        "id":comment.user.id,
                        "username":comment.user.username,
                        "icon":comment.user.icon.url if comment.user.icon else None,
                    },
                    "post":{
                        "id":comment.post.id,
                    }
                },
                "error":None,
            },
            status = 200
        )
    except Exception as e:
        return JsonResponse(
            {
                "success":False,
                "error":str(e),
            },
            status = 400
        )