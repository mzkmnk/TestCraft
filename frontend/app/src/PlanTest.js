import { useAPI } from "./hooks/useAPI";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import UserHeader from "./UserHeader";
import Loading from "./Loading";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

function toISOStringWithTimezone(date) {
  const pad = function (str) {
    return ("0" + str).slice(-2);
  };
  const year = date.getFullYear().toString();
  const month = pad((date.getMonth() + 1).toString());
  const day = pad(date.getDate().toString());
  const hour = pad(date.getHours().toString());
  const min = pad(date.getMinutes().toString());
  const sec = pad(date.getSeconds().toString());
  const tz = -date.getTimezoneOffset();
  const sign = tz >= 0 ? "+" : "-";
  const tzHour = pad((tz / 60).toString());
  const tzMin = pad((tz % 60).toString());

  return `${year}-${month}-${day}T${hour}:${min}:${sec}${sign}${tzHour}:${tzMin}`;
}

export function PlanTest() {
  // 取得するもの
  const [allCompanyUsers, setAllCompanyUsers] = useState([]);
  const [workbooks, setWorkbooks] = useState([]);
  // 送信するもの
  const [testName, setTestName] = useState("");
  const [workbookId, setWorkbookId] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  // groupUsers
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const navigate = useNavigate();

  const allCompanyUsersAPI = useAPI({
    APIName: "all_company_users",
    isLoginRequired: true,
    loadOnStart: true,
  });

  const questionsAllAPI = useAPI({
    APIName: "questionsall",
    loadOnStart: true,
  });

  const create_groupAPI = useAPI({
    APIName: "create_group",
    loadOnStart: false,
  });

  const save = () => {
    let isError = false;
    let errorMessage = "";
    if (testName === "") {
      isError = true;
      errorMessage = "テスト名が入力されていません\n";
    }
    if (workbookId === "") {
      isError = true;
      errorMessage += "問題が選択されていません\n";
    }
    if (startTime === "") {
      isError = true;
      errorMessage += "開始時間が入力されていません\n";
    }
    if (endTime === "") {
      isError = true;
      errorMessage += "終了時間が入力されていません\n";
    }
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    if (startTimeDate > endTimeDate) {
      isError = true;
      errorMessage += "開始時間が終了時間より後になっています\n";
    }
    if (isError) {
      alert(errorMessage);
      return;
    }

    const body = JSON.stringify({
      testName,
      workbookId,
      isPublic,
      groupUsers: isPublic ? [] : selectedUserIds,
      startTime: toISOStringWithTimezone(startTimeDate),
      endTime: toISOStringWithTimezone(endTimeDate),
    });
    console.log(body);
    create_groupAPI.sendAPI({ body });
  };

  useEffect(() => {
    if (create_groupAPI.isSuccess === false) {
      alert("作成に失敗しました");
      create_groupAPI.statusInit();
    } else if (create_groupAPI.isSuccess && create_groupAPI.data.success) {
      navigate("/mypage", {
        state: {
          message: `${testName}を作成しました`,
          severity: "success",
        },
      });
    }
  }, [create_groupAPI.data, create_groupAPI.isSuccess, navigate]);

  useEffect(() => {
    if (allCompanyUsersAPI.isSuccess === false) {
      navigate("/error");
    } else if (
      allCompanyUsersAPI.isSuccess &&
      allCompanyUsersAPI.data.success === true
    ) {
      setAllCompanyUsers(allCompanyUsersAPI.data.data);
    } else if (
      allCompanyUsersAPI.isSuccess &&
      allCompanyUsersAPI.data.success === false
    ) {
      navigate("/error");
    }
  }, [allCompanyUsersAPI.data, allCompanyUsersAPI.isSuccess, navigate]);

  useEffect(() => {
    if (questionsAllAPI.isSuccess === false) {
      navigate("/error");
    } else if (
      questionsAllAPI.isSuccess &&
      questionsAllAPI.data.success === true
    ) {
      setWorkbooks(questionsAllAPI.data.workbooks);
    } else if (
      questionsAllAPI.isSuccess &&
      questionsAllAPI.data.success === false
    ) {
      navigate("/error");
    }
  }, [questionsAllAPI.data, questionsAllAPI.isSuccess, navigate]);

  if (workbooks.length === 0 || allCompanyUsers.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <UserHeader />
      <Box
        sx={{
          margin: "0 auto",
          width: "80%",
          maxWidth: "80rem",
          display: "flex",
          flexDirection: "column",
          padding: "2rem",
        }}
      >
        <Typography variant="h4">テスト開催</Typography>
        <Typography>テスト名</Typography>
        <TextField
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
        />

        <Typography>問題集</Typography>
        <FormControl>
          <Select
            value={workbookId}
            onChange={(e) => setWorkbookId(e.target.value)}
          >
            {workbooks.map((workbook) => (
              <MenuItem key={workbook.id} value={workbook.id}>
                {workbook.workbook_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          }
          label="公開する"
        />
        {!isPublic && (
          <>
            <Typography>受験するユーザー</Typography>
            <FormControl>
              {allCompanyUsers.map((user) => (
                <FormControlLabel
                  key={user.id}
                  control={
                    <Checkbox
                      checked={selectedUserIds.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUserIds([...selectedUserIds, user.id]);
                        } else {
                          setSelectedUserIds(
                            selectedUserIds.filter((id) => id !== user.id)
                          );
                        }
                      }}
                    />
                  }
                  label={user.name}
                />
              ))}
            </FormControl>
          </>
        )}
        <Typography>開始時間</Typography>
        <TextField
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Typography>終了時間</Typography>
        <TextField
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <Box
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={save}>作成</Button>
        </Box>
      </Box>
    </>
  );
}
