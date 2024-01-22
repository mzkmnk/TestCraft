import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import UserHeader from './UserHeader';

function AllCompanyUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/check_auth", {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.authenticated === false){
                navigate("/login");
            }else{
                fetch("http://localhost:8000/api/all_company_users", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                })
                .then((response) => response.json())
                .then((data) => {
                    if(data.success){
                        setUsers(data.data);
                    }else{
                        console.error(data.error);
                    }
                })
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }, [navigate]);


    const columns = [
        { field: 'name', headerName: 'Name', width: 350 },
        { field: 'created_at', headerName: 'Date Created', width: 150 },
        //今後解く必要がある問題数を表示できたらいいな
    ];

    return (
        <>
            <div style={{ marginBottom: '20px' }}>
                <UserHeader />
            </div>
            <div style={{ height: '100% ', width: '100%' }}>
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