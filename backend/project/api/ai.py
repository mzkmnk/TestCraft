import openai
import json

openai.api_key = "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"#あとで修正

def check_answer(
        question_text:str,
        questions:list[str],
        user_answers:list[str],
        correct_answers:list[str],
    ) -> list[bool]:
    
    results = []

    for q, user_answer, correct_answer in zip(questions, user_answers, correct_answers):
        prompt = f"""
        問題文: {question_text}
        問題: {q}
        ユーザーの解答: {user_answer}
        この解答は正しいですか？
        正解の確率を0~100%の範囲で答えてください。
        なぜ間違ってるかを説明してください。
        また返答はjson形式だけでお願いします。
        例:
            {{
            "is_correct": true,
            "confidence": 100,
            "explanation": "東京は正解です。"
            }}
        """

        response = openai.ChatCompletion.create(
            # model="gpt-3.5-turbo-",
            model="gpt-3.5-turbo-0125",
            # model="gpt-4-0125-preview",
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
question_text = """次の文章を読み、正しい都道府県名を答えてください。"""
question = ["日本の首都は(1)です。","また(1)を英語で書くと(2)です。"]
user_answer = ["東京", "Tkyo"]
correct_answer = ["東京", "Tokyo"]


# is_correct = check_answer(question_text,question, user_answer, correct_answer)
# for j in is_correct:
#     print(j["is_correct"])