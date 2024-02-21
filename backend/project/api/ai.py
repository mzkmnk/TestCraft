import openai
import json
from dotenv import load_dotenv
from pathlib import Path
import os

dotenv_path = "/home/ec2-user/key.env"
load_dotenv(dotenv_path=dotenv_path)

print(os.getenv("KEY"))


openai.api_key = os.getenv("KEY")

def check_answer(
        question_text:str,
        questions:list[str],
        user_answers:list[str],
        correct_answers:list[str],
    ) -> list[bool]:
    
    results = []
    print(f"{question_text=}")
    print(f"{questions=}")
    print(f"{user_answers=}")
    print(f"{correct_answers=}")
    for q, user_answer, correct_answer in zip(questions, user_answers, correct_answers):
        print(f"{q=}")
        print(f"{user_answer=}")
        print(f"{correct_answer=}")
        prompt = f"""
        あなたは先生です。問題文、問題、ユーザの解答、正解を比べて正解かどうかを判断してください。
        問題文: {question_text}
        問題: {q}
        ユーザの解答: {user_answer}
        正解: {correct_answer}
        この'ユーザの解答'は'正解'と同じですか？
        正解の確率を0~100%の範囲で答えてください。
        ユーザーの解答が、ユーザは解答していません。という場合はユーザは解答していません。
        また記述式のため、ニュアンスや表現の違いがある場合でも、同じような意味であれば正解としてください。
        なぜ間違ってるかを説明してください。
        また返答はjson形式だけでお願いします。
        is_correctはtrueかfalseで、confidenceは0~100の間で、explanationは説明を書いてください。
        またあなたは先生なので、explanationでは生徒に教えるように丁寧に優しい説明を書いてください。
        例:
            {{
            "is_correct": true,
            "confidence": 100,
            "explanation": "正解です。"
            }}
        """

        response = openai.ChatCompletion.create(
            # model="gpt-3.5-turbo-",
            # model="gpt-3.5-turbo-0125",
            model="gpt-4-0125-preview",
            messages=[
                {"role": "system", "content": "以下の質問に答えてください。"},
                {"role": "user", "content": prompt},
            ]
        )

        answer_text = response.choices[0].message['content'].strip()
        answer_text = answer_text.replace("```json", "")
        answer_text = answer_text.replace("```", "")
        print(f"{answer_text}")
        results.append(json.loads(answer_text))
    return results


# 使用例
question_text = """次の文章を読み、問題に答えてください。"""
question = ["エジプトの首都は(1)です。","また(1)を英語で書くと(2)です。"]
user_answer = ["かいろ", "Kairo"]
correct_answer = ["カイロ", "Cairo"]


# is_correct = check_answer(question_text,question, user_answer, correct_answer)
# for j in is_correct:
#     print(j["is_correct"])