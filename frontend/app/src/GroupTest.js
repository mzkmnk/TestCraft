import { useState, useMemo,useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";

import UserHeader from "./UserHeader";
import { useAPI } from "./hooks/useAPI";

export function GroupTest() {

  const navigate = useNavigate();
  const { groupId, workbookId, userId } = useParams();
  const params = useMemo(
    () => [groupId,workbookId,userId],
    [groupId,workbookId,userId]
  );

  const groupJoinAPI = useAPI({
    APIName: "group_join",
    params: params,
    isLoginRequired: true,
    loadOnStart: true,
  });

  useEffect(() => {
    if(groupJoinAPI.isSuccess){
      const data = groupJoinAPI.data;
      console.log(data);
      if(data.success){
        console.log("success");
        console.log(data);
      }else{
        navigate("/mypage",{
          state: { message: "グループに参加できませんでした。", severity: "error" },
        });
      }
    }else{console.log("error");}
  },[groupJoinAPI.isSuccess, groupJoinAPI.data]);

  return (
    <>
      <UserHeader />
    </>
  );
}
