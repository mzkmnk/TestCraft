import React, { useEffect, useState, useMemo } from "react";
import UserHeader from "./UserHeader";
import { useNavigate, useParams } from "react-router-dom";
import { useAPI } from "./hooks/useAPI";
import Error from "./Error";
import Loading from "./Loading";
import { AnswerForms } from "./AnswerApp/components/AnswerForms";

function Solved() {
  const [workbook, setWorkbook] = useState(undefined);
  const [answers, setAnswers] = useState(undefined);
  const [correctIds, setCorrectIds] = useState([]);
  const navigate = useNavigate();
  const { workbookId, solved_count } = useParams();
  const [aiComment, setAiComment] = useState("");
  const params = useMemo(
    () => [workbookId, solved_count],
    [workbookId, solved_count]
  );
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
      let aiComments = {};
      for (const aiComment of data.ai_comment) {
        for (const key of Object.keys(aiComment)) {
          aiComments[key] = aiComment[key];
        }
      }
      const workbook = JSON.parse(data.workbook);
      const questions = workbook.questions;
      const answers = data.user_answer;
      for (const keys of Object.keys(questions)) {
        if (
          questions[keys].questionType === "radio" &&
          questions[keys].canMultiple === true &&
          answers[keys] !== undefined
        ) {
          answers[keys] = answers[keys].split(",,,");
        }
      }
      console.log(answers);

      setAiComment(aiComments);
      setAnswers(answers);
      setWorkbook(workbook);
      setCorrectIds(data.correctIds);
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

  const rootId = Object.keys(questionTree).find(
    (key) => questionTree[key].questionType === "root"
  );

  const questionCount = Object.keys(questionTree).filter(
    (key) =>
      questionTree[key].questionType !== "root" &&
      questionTree[key].questionType !== "nested"
  ).length;

  return (
    <>
      <UserHeader />
      <AnswerForms
        exitFunc={() => {
          navigate("/mypage");
        }}
        resultMode={true}
        correctIds={correctIds}
        questionCount={questionCount}
        info={info}
        questionTree={questionTree}
        rootId={rootId}
        answers={answers}
        AiComments={aiComment}
      />
    </>
  );
}

export default Solved;
