import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputAnswer from "./InputAnswer";
import ResultQuestion from "./ResultQuestion";

export default function Result({ answers, questionTree, questionIds }) {
  // すべての問題数。questionIdsの長さではnestedに対応できない。
  let questionCount = 0;
  const correctIds = [];

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

  console.log(correctIds);
  grade(questionIds);

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
