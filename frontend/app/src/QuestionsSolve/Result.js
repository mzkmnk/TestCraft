export default function Result({ answers, questionTree, questionIds }) {
  const correctIds = [];
  // rootを除く
  questionIds = questionIds.slice(1);

  // 正答判定
  const grade = (questionIds) => {
    for (const id of questionIds) {
      // nestedの場合は再帰
      if (questionTree[id].questionType === "nested") {
        grade(questionTree[id].childIds);
        continue;
      }

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
      <h1>Result</h1>
      <p>
        正答率：{correctIds.length} ／ {questionIds.length}
      </p>
    </>
  );
}
