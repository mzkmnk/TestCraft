import { useEffect, useMemo, useState } from "react";

import { useAPI } from "./useAPI";

export function useGrade({ questionTree, questionIds, answers }) {
  const [correctIds, setCorrectIds] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const [isAIScoringFinished, setIsAIScoringFinished] = useState(null);
  const [correctIdsByAI, setCorrectIdsByAI] = useState([]);

  const AIAPI = useAPI(
    {
      APIName: "ai_scoring",
    }
  );

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
    console.log("aIScoringQuestionIds", aIScoringQuestionIds);
    console.log("questionTree", questionTree);
    console.log("questionTree type",typeof questionTree);
    AIAPI.sendAPI({
      body: JSON.stringify(
        {
          question_tree : questionTree,
          target_answer : aIScoringQuestionIds,
        }
      )
    })
    setCorrectIdsByAI([]);
    setIsAIScoringFinished(true);
  }, [aIScoringQuestionIds]);

  useEffect(() => {
    if (isAIScoringFinished === true && isFinished === false) {
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
      setCorrectIds(...correctIdsByAI, newCorrectIds);
      setIsFinished(true);
    }
  }, [
    questionTree,
    questionIds,
    answers,
    questionCount,
    isAIScoringFinished,
    isFinished,
    correctIdsByAI,
  ]);

  return { isFinished, correctIds, questionCount };
}

// ネスト問題のすべての問題文を取得。
function getAllQuestion(questionTree, id) {
  let questions = [questionTree[id].question];
  let currentId = questionTree[id].parentId;
  while (true) {
    if (questionTree[currentId].questionType === "nested") {
      questions.push(questionTree[currentId].question);
      currentId = questionTree[currentId].parentId;
    } else {
      break;
    }
  }
  return questions.reverse().join(" ");
}
