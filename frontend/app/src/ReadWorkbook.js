import React from "react";
import { useParams } from "react-router-dom";
import useAPI from "./hooks/useAPI";
import Editor from "./Editor.tsx";
import AnswerApp from "./AnswerApp/AnswerApp.js";
import Error from "./Error.js";
import Loading from "./Loading";

/**
 * APIにアクセスし、workbookが取得できたら、次のアプリに遷移する。
 * @param {string} nextApp "Editor" or "AnswerApp"
 */
export default function ReadWorkbook({ nextAppName }) {
  const { workbookId } = useParams();

  const url = `http://localhost:8000/api/edit_workbook/${workbookId}`;
  const { data, isLoading, isSuccess } = useAPI({ url });

  // ロード
  if (isLoading) {
    return <Loading />;
  } else {
    // APIに接続失敗 or データ取得失敗（DBにworkbookが存在しないなど。）
    if (isSuccess === false || data.success === false) {
      return <Error />;
    }
  }

  let nextApp = <></>;
  if (nextAppName === "Editor") {
    nextApp = <Editor workBook={data.data} workbookId={workbookId} />;
  } else if (nextAppName === "AnswerApp") {
    nextApp = <AnswerApp workbook={data.data} workbookId={workbookId} />;
  }
  return <>{nextApp}</>;
}
