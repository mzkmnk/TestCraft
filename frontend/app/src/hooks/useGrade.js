import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useAPI } from "./useAPI";

export function useGrade({ questionTree, questionIds, answers }) {
  const [correctIds, setCorrectIds] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const { workbookId } = useParams();

  const [isAIScoringFinished, setIsAIScoringFinished] = useState(null);

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
    console.log("workbookId", workbookId);
    console.log(typeof workbookId);
    if (AIAPI.isLoading === null) {
      AIAPI.sendAPI({
        body: JSON.stringify({
          question_tree: questionTree,
          answers: answers,
          workbookId: workbookId,
          target_answer: aIScoringQuestionIds,
        }),
      });
    }
  }, [AIAPI, aIScoringQuestionIds, answers, questionTree]);

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
          for (const correctObj of correctObjArray) {
            if (correctObj.value === answer) {
              newCorrectIds.push(id);
              break;
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
