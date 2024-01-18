import Typography from "@mui/material/Typography";

export default function Result({ answers, questionTree, questionIds }) {
  // rootを除く
  questionIds = questionIds.slice(1);

  let questionCount = 0;
  const correctIds = [];
  // 正答判定
  const grade = (questionIds) => {
    for (const id of questionIds) {
      // nestedの場合は再帰
      if (questionTree[id].questionType === "nested") {
        grade(questionTree[id].childIds);
        continue;
      }
      questionCount++;

      const correctObjArray = questionTree[id].answers;
      console.log(questionTree[id]);
      const answer = answers[id];
      if (answer === undefined) {
        continue;
      }
      for (const correctObj of correctObjArray) {
        if (correctObj.value === answer) {
          correctIds.push(id);
          break;
        }
      }
    }
  };

  grade(questionIds);

  return (
    <>
      <Typography variant="h2">Result</Typography>
      <Typography>
        正答率：{correctIds.length} ／ {questionCount}
      </Typography>
    </>
  );
}
