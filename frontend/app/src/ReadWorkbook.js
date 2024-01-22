import { useState, useEffect, React } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "./Editor.tsx";
import QuestionsSolve from "./QuestionsSolve/QuestionsSolve";

export default function ReadWorkbook({ next }) {
  let [workbook, setWorkbook] = useState(undefined);

  const { workbookId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/check_auth", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.authenticated === false) {
          navigate("/login");
        } else {
          fetch(`http://localhost:8000/api/edit_workbook/${workbookId}`, {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success === true) {
                setWorkbook(data.data);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [navigate, workbookId]);

  if (next === "Editor") {
    return workbook ? <Editor workBook={workbook} workbookId={workbookId} /> : <div>Loading...</div>;
  } else if (next === "QuestionsSolve") {
    return workbook ? (
      <QuestionsSolve workbook={workbook} workbookId={workbookId} />
    ) : (
      <div>Loading...</div>
    );
  }
}
