import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import UserHeader from "./UserHeader";
import { useAPI } from "./hooks/useAPI";

function AllCompanyUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const API = useAPI({
    APIName: "all_company_users",
    isLoginRequired: "true",
    loadOnStart: true,
  });

  useEffect(() => {
    if (API.isSuccess === false) {
      navigate("/error");
    } else if (API.isSuccess === true && API.data.success === true) {
      setUsers(API.data.data);
    }
  }, [API.data.success, API.data.workbook, API.isSuccess, navigate]);

  const columns = [
    { field: "name", headerName: "Name", width: 350 },
    { field: "created_at", headerName: "Date Created", width: 150 },
    //今後解く必要がある問題数を表示できたらいいな
  ];

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <UserHeader />
      </div>
      <div style={{ height: "100% ", width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          checkboxSelection
        />
      </div>
    </>
  );
}

export default AllCompanyUsers;
