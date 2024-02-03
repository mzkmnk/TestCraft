import Ract, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AnswerForms } from "../components/AnswerForms";
import { useQuestions } from "../context/QuestionsContext";
import { useAnswers } from "../context/AnswersContext";
import { useAPI } from "../../hooks/useAPI";
import { useGrade } from "../../hooks/useGrade";

export default function Result({ exitFunc }) {
  const { questionTree, rootId } = useQuestions();
  const { answers } = useAnswers();
  const questionIds = questionTree[rootId].childIds;
  const saveAPI = useAPI({ APIName: "save_answer" });

  const { workbookId } = useParams();
  const { correctIds, questionCount, isFinished } = useGrade({
    questionTree,
    questionIds,
    answers,
  });

  useEffect(() => {
    if (isFinished && saveAPI.isSuccess === null) {
      const reqData = {
        workbook_id: Number(workbookId),
        answers: JSON.stringify(answers),
        correctIds: correctIds,
      };
      saveAPI.sendAPI({
        body: JSON.stringify(reqData),
      });
    }
  }, [answers, correctIds, isFinished, saveAPI, workbookId]);

  return (
    <>
      {saveAPI.isSuccess ? (
        <AnswerForms
          exitFunc={exitFunc}
          resultMode={true}
          correctIds={correctIds}
          questionCount={questionCount}
        />
      ) : (
        <div style={{ marginTop: 100, fontSize: 30 }}>採点中</div>
      )}
    </>
  );
}
