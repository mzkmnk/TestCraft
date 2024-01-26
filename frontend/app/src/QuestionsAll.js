import React, { useEffect, useState } from "react";
import UserHeader from "./UserHeader";

import { useAPI } from "./hooks/useAPI";
import Error from "./Error";
import { DisplayWorkbookList } from "./components/DisplayWorkbookList";
import Loading from "./Loading";

function QuestionsAll() {
  const [workbooks, setWorkbooks] = useState(null);
  const API = useAPI({
    APIName: "questionsall",
    isLoginRequired: true,
    loadOnStart: true,
  });

  useEffect(() => {
    if (!API.data) return;
    setWorkbooks(
      API.data.workbooks.map((workbooks) => ({
        ...workbooks,
        liked: workbooks.liked_by_user,
      }))
    );
  }, [API.data]);

  if (API.isLoading === true || workbooks === null) {
    return <Loading />;
  } else if (API.error || API.data.success === false) {
    return <Error />;
  }

  return (
    <>
      <UserHeader />
      {workbooks ? (
        <DisplayWorkbookList
          workbooks={workbooks}
          setWorkbooks={setWorkbooks}
        />
      ) : null}
    </>
  );
}

export default QuestionsAll;
