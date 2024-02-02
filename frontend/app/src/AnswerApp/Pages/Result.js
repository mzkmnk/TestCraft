import Ract, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AnswerForms } from "../components/AnswerForms";
import { useQuestions } from "../context/QuestionsContext";
import { useAnswers } from "../context/AnswersContext";
import { useAPI } from "../../hooks/useAPI";
import { grade } from "../../grade";

export default function Result({ exitFunc }) {
  const { questionTree, rootId } = useQuestions();
  const { answers } = useAnswers();
  const questionIds = questionTree[rootId].childIds;
  // すべての問題数。questionIdsの長さではnestedに対応できない。

  const { workbookId } = useParams();
  const { correctIds, questionCount } = grade({
    questionTree,
    questionIds,
    answers,
  });

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
        exitFunc={exitFunc}
        resultMode={true}
        correctIds={correctIds}
        questionCount={questionCount}
      />
    </>
  );
}
