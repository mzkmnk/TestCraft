import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, CardActionArea } from "@mui/material";

import UserHeader from "./UserHeader";
import { useAPI } from "./hooks/useAPI";

export function GroupTestALL() {
  const [userId, setUserId] = useState("");
  const [groupTests, setGroupTests] = useState([]);

  const navigate = useNavigate();

  const groupList = useAPI({
    APIName: "group_list",
    loadOnStart: true,
    isLoginRequired: true,
  });

  const getUserInfo = useAPI({
    APIName: "get_user_info_change",
    loadOnStart: true,
    isLoginRequired: true,
  });

  useEffect(() => {
    if(groupList.isSuccess){
      const data = groupList.data.data;
      setGroupTests(data.groups);
    }
    else{console.log("error");}
  }, [groupList.isSuccess, groupList.data]);

  useEffect(() => {
    if(getUserInfo.isSuccess){
      const data = getUserInfo.data;
      setUserId(data.user_id);
    }
    else{console.log("error");}
  }, [getUserInfo.isSuccess, getUserInfo.data]);

  const handleItemClick = (groupId, workbookId) => {
    console.log("userId", userId);
    navigate(`/group_test/${groupId}/${workbookId}/${userId}`);
  };

  return (
    <>
      <UserHeader />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px' }}>
        {groupTests.map((group) => (
          <Card key={group.id} sx={{ maxWidth: 345 }}>
            <CardActionArea onClick={() => handleItemClick(group.id, group.workbook_id)}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {group.test_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  主催者: {group.host}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  開始時刻: {new Date(group.start_time).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  終了時刻: {group.end_time ? new Date(group.end_time).toLocaleString() : '未定'}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </div>
    </>
  );
}
