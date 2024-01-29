// 採点
export function grade({ questionTree, questionIds, answers }) {
  let questionCount = 0;
  let correctIds = [];

  const grade = (questionIds) => {
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
  grade(questionIds);

  return { correctIds, questionCount };
}
