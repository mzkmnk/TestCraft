import Ract, { useState,useEffect } from "react";
import ResultQuestion from "./ResultQuestion";

export default function Result({ answers, questionTree, questionIds,workbookId }) {
  // すべての問題数。questionIdsの長さではnestedに対応できない。
  let questionCount = 0;
  const correctIds = [];
  const [controller, setController] = useState(null);

  console.log("answers", answers);
  console.log("workbookId", workbookId);
  // 正答判定
  const grade = (questionIds) => {
    for (const id of questionIds) {
      if (questionTree[id].questionType === "root") continue;

      // nestedの場合は再帰
      if (questionTree[id].questionType === "nested") {
        grade(questionTree[id].childIds, id);
        continue;
      }

      questionCount++;

      const answer = answers[id];
      if (answer === undefined) {
        continue;
      }

      const correctObjArray = questionTree[id].answers;
      for (const correctObj of correctObjArray) {
        if (correctObj.value === answer) {
          correctIds.push(id);
          break;
        }
      }
    }
  };

  grade(questionIds);

  useEffect(() => {
    const data = {
      workbook_id: workbookId,
      answers: JSON.stringify(answers),
    }
    console.log(data);
    fetch("http://localhost:8000/api/save_answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  },[answers, workbookId]);

  return (
    <>
      <ResultQuestion
        questionIds={questionIds}
        questionTree={questionTree}
        correctIds={correctIds}
        answers={answers}
        questionCount={questionCount}
      />
    </>
  );
}
