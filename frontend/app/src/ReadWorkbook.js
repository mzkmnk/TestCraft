import { useParams } from "react-router-dom";
import { useAPI } from "./hooks/useAPI";
import Editor from "./EditorApp/EditorApp.tsx";
import AnswerApp from "./AnswerApp/AnswerApp.js";
import Error from "./Error.js";
import Loading from "./Loading";

/**
 * APIにアクセスし、workbookが取得できたら、次のアプリに遷移する。
 * @param {string} nextApp "Editor" or "AnswerApp"
 */
export default function ReadWorkbook({ nextAppName }) {
  const { workbookId } = useParams();
  const API = useAPI({
    APIName: "edit_workbook",
    params: workbookId,
    loadOnStart: true,
  });

  if (API.isLoading === true) {
    return <Loading />;
  }
  if (API.error || API.data.success === false) {
    return <Error />;
  }

  let nextApp = <></>;
  if (nextAppName === "Editor") {
    nextApp = <Editor workBook={API.data.data} workbookId={workbookId} />;
  } else if (nextAppName === "AnswerApp") {
    nextApp = <AnswerApp workbook={API.data.data} workbookId={workbookId} />;
  }
  return <>{nextApp}</>;
}
