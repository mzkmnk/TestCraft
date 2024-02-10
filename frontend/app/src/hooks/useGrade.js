import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useAPI } from "./useAPI";

export function useGrade({ questionTree, questionIds, answers }) {
  const [correctIds, setCorrectIds] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const { workbookId } = useParams();

  const [AiComments, setAiComments] = useState(null);

  const AIAPI = useAPI({
    APIName: "ai_scoring",
  });

  // AI採点を行う問題のIDを取得する。
  const aIScoringQuestionIds = useMemo(() => {
    const ids = [];
    Object.keys(questionTree).forEach((id) => {
      if (questionTree[id].useAIScoring === true) {
        ids.push(id);
      }
    });
    return ids;
  }, [questionTree]);

  // ここでAI採点を行う。
  useEffect(() => {
    if (AIAPI.isLoading === null) {
      for (const keys of Object.keys(answers)) {
        if (typeof answers[keys] === "object") {
          answers[keys] = answers[keys].join(",,,");
        }
      }
      AIAPI.sendAPI({
        body: JSON.stringify({
          question_tree: questionTree,
          answers: answers,
          workbookId: workbookId,
          target_answer: aIScoringQuestionIds,
        }),
      });
    }
  }, [AIAPI, aIScoringQuestionIds, answers, questionTree, workbookId]);

  useEffect(() => {
    if (
      AIAPI.isSuccess === true &&
      isFinished === false &&
      AIAPI.data.success
    ) {
      const AIResults = AIAPI.data.results;
      let AIcorrectIds = [];
      let newAIComments = {};
      for (const result of AIResults) {
        if (result.is_correct) {
          AIcorrectIds.push(result.id);
        }
        newAIComments[result.id] = result.explanation;
      }
      console.log("AIcorrectIds", AIcorrectIds);
      console.log("newAIComments", newAIComments);

      let newQuestionCount = 0;
      let newCorrectIds = [];

      const grade = (questionIds) => {
        for (const id of questionIds) {
          if (questionTree[id].questionType === "nested") {
            grade(questionTree[id].childIds, id);
            continue;
          }

          newQuestionCount += 1;

          const answer = answers[id];
          if (answer === undefined) {
            continue;
          }

          // AI採点の場合
          if (questionTree[id].useAIScoring === true) {
            continue;
          }

          const correctObjArray = questionTree[id].answers;
          if (
            questionTree[id].questionType === "radio" &&
            questionTree[id].canMultiple === true
          ) {
            let answerArray = answer.split(",,,");
            // 正解の数と解答の数が同じかつ、すべての解答が正解に含まれている場合正解
            if (answerArray.length === correctObjArray.length) {
              let isCorrect = true;
              for (const correctObj of correctObjArray) {
                let index = answerArray.indexOf(correctObj.value);
                if (index === -1) {
                  isCorrect = false;
                  break;
                }
              }
              if (isCorrect) {
                newCorrectIds.push(id);
              }
            }
          } else {
            for (const correctObj of correctObjArray) {
              if (correctObj.value === answer) {
                newCorrectIds.push(id);
                break;
              }
            }
          }
        }
      };

      grade(questionIds);

      setQuestionCount(newQuestionCount);
      setCorrectIds([...AIcorrectIds, ...newCorrectIds]);
      setAiComments(newAIComments);
      setIsFinished(true);
    }
  }, [
    AIAPI.data.results,
    AIAPI.data.success,
    AIAPI.isSuccess,
    answers,
    isFinished,
    questionIds,
    questionTree,
  ]);

  return { isFinished, correctIds, questionCount, AiComments };
}
