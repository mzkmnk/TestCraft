import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Grid
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
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

    const cardStyle = {
        maxWidth: 400,
        margin: 'auto',
        borderRadius: '10px',
        border: '2px solid #1876D1',
    };

    const mediaStyle = {
        height: 140,
    };

    const styles = {
        styleheader: {
            marginBottom: '20px',
        },
    }
    return (
        <>
            <div style={styles.styleheader}>
                <UserHeader />
            </div>
            <Grid container spacing={0}>
                {users.map(user => (
                    <Grid item xs={12} sm={6} md={4} key={user.id}>
                        <Card style={cardStyle}>
                            <CardActionArea>
                                <CardMedia
                                    style={mediaStyle}
                                    // image="sumple.jpg"
                                    // title="user image"
                                    //　ここで画像表示できるけど迷い中
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {user.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default AllCompanyUsers;