import { useState, useEffect, React } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "./Editor.tsx";

export default function ReadWorkbook() {
  let [workBook, setWorkbook] = useState(undefined);
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
  }, [navigate]);
  console.log(workBook);
  // workbook が undefined の場合は、loading を表示し、そうでない場合は、Editor を表示する
  return workBook ? <Editor workBook={workBook} /> : <div>Loading...</div>;
}
