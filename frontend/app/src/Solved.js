import React, { useEffect, useState,useMemo } from "react";
import UserHeader from "./UserHeader";
import { useNavigate, useParams } from "react-router-dom";
import { useAPI } from "./hooks/useAPI";
import Error from "./Error";
import Loading from "./Loading";
import { AnswerForms } from "./AnswerApp/components/AnswerForms";
import { grade } from "./grade";

function Solved() {
  const [workbook, setWorkbook] = useState(undefined);
  const [answers, setAnswers] = useState(undefined);
  const navigate = useNavigate();
  const { workbookId,solved_count } = useParams();
  const params = useMemo(() => [workbookId, solved_count], [workbookId, solved_count]);
  const API = useAPI({
    APIName: "solve_detail",
    params: params,
    isLoginRequired: true,
    loadOnStart: true,
  });

  useEffect(() => {
    if (API.isSuccess === false) {
      navigate("/error");
    } else if (API.isSuccess === true && API.data.success === true) {
      const data = API.data;
      setAnswers(data.user_answer);
      setWorkbook(JSON.parse(data.workbook));
    }
  }, [API.data, API.isSuccess, navigate]);

  if (API.isSuccess === false) {
    return <Error />;
  }
  if (workbook === undefined && answers === undefined) {
    return <Loading />;
  }

  const info = workbook.info;
  const questionTree = workbook.questions;

  console.log(questionTree);
  const rootId = Object.keys(questionTree).find(
    (key) => questionTree[key].questionType === "root"
  );
  const questionIds = questionTree[rootId].childIds;

  const { correctIds, questionCount } = grade({
    questionTree,
    questionIds,
    answers,
  });

  console.log(answers);

  return (
    <>
      <UserHeader />
      <AnswerForms
        exitFunc={() => {}}
        resultMode={true}
        correctIds={correctIds}
        questionCount={questionCount}
        info={info}
        questionTree={questionTree}
        rootId={rootId}
        answers={answers}
      />
    </>
  );
}

export default Solved;
