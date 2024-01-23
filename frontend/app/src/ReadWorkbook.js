import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "./Editor.tsx";
import AnswerApp from "./AnswerApp/AnswerApp.js";

/**
 * APIにアクセスし、workbookが取得できたら、次のアプリに遷移する。
 * @param {string} nextApp "Editor" or "AnswerApp"
 */
export default function ReadWorkbook({ nextApp }) {
  let [workbook, setWorkbook] = useState(undefined);
  const { workbookId } = useParams();

  const navigate = useNavigate();
  // APIにアクセスし、workbookを取得する。
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
  }, [navigate]);

  if (nextApp === "Editor") {
    return workbook ? <Editor workBook={workbook} /> : <div>Loading...</div>;
  } else if (nextApp === "AnswerApp") {
    return workbook ? <AnswerApp workbook={workbook} /> : <div>Loading...</div>;
  }
}
