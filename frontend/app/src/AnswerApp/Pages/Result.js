import Ract, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AnswerForms } from "../components/AnswerForms";
import { useQuestions } from "../context/QuestionsContext";
import { useAnswers } from "../context/AnswersContext";
import { useAPI } from "../../hooks/useAPI";

export default function Result({ exitFunc }) {
  const { questionTree, rootId } = useQuestions();
  const { answers } = useAnswers();
  const questionIds = questionTree[rootId].childIds;
  // すべての問題数。questionIdsの長さではnestedに対応できない。
  let questionCount = 0;
  const correctIds = [];
  const { workbookId } = useParams();

  // 正答判定
  const grade = (questionIds) => {
    for (const id of questionIds) {
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

  const reqData = {
    workbook_id: Number(workbookId),
    answers: JSON.stringify(answers),
  };

  useAPI({
    APIName: "save_answer",
    body: JSON.stringify(reqData),
    loadOnStart: true,
  });

  return (
    <>
      <AnswerForms
        resultMode={true}
        correctIds={correctIds}
        questionCount={questionCount}
      />
    </>
  );
}
