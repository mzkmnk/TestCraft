import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputAnswer from "./InputAnswer";
import ResultQuestion from "./ResultQuestion";

export default function Result({ answers, questionTree, questionIds }) {
  // rootを除く
  questionIds = questionIds.slice(1);

  // すべての問題数。questionIdsの長さではnestedに対応できない。
  let questionCount = 0;
  const correctIds = [];

  // 正答判定
  const grade = (questionIds, parentId = undefined) => {
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

  console.log(correctIds);
  grade(questionIds);

  return (
    <>
      <Typography variant="h2">Result</Typography>
      <Typography>
        正答率：{correctIds.length} ／ {questionCount}
      </Typography>
      <Typography>間違えた問題</Typography>
      <ResultQuestion
        questionIds={questionIds}
        questionTree={questionTree}
        correctIds={correctIds}
        answers={answers}
      />
    </>
  );
}
