import { useEffect, useState } from "react";

export function useGrade({ questionTree, questionIds, answers }) {
  const [correctIds, setCorrectIds] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
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
          console.log(getAllQuestion(questionTree, id));
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
    setCorrectIds(newCorrectIds);
    setIsFinished(true);
  }, [questionTree, questionIds, answers, questionCount]);

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
