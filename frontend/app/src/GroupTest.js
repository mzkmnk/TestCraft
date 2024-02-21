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
        //ここでグループの開始時間と終了時間を取得して、現在時刻と比較する。
        const nowDate = new Date();
        const startTime = new Date(data.data.group.start_time);
        const endTime = new Date(data.data.group.end_time);
        if(nowDate < startTime || nowDate > endTime){
          navigate('/group_test_all');
          // navigate('group_test_all',{
          //   state: { message: "アクセスできません。", severity: "error" },
          // })
        }
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
