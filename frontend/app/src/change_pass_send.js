import React, { useState, useEffect } from 'react';
import { json, useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";

import { useAPI } from './hooks/useAPI';
import UserHeader from './UserHeader';

const theme = createTheme();

function ChangePassSend() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const url = 'https://www.testcrafts.net/change_pass';//随時変更

    const sendEmailAPI = useAPI({
        APIName: 'change_pass_send',
        isLoginRequired: false, 
    });

    useEffect(() => {
        console.log(sendEmailAPI);
        if(sendEmailAPI.isSuccess === true && sendEmailAPI.data.success === true){
            navigate('/login',{
                state: {
                    message: 'メールを送信しました。メールを確認してください。',
                    severity: 'success',
                }
            });
        }else if(sendEmailAPI.isSuccess === false){
            setError("メール送信に失敗しました。ユーザ名かメールアドレスが違います。");
            console.error('Send failed');
        }
    },[sendEmailAPI.isSuccess,navigate]);

    const handleSendEmail = async () => {
        sendEmailAPI.sendAPI({
            body: JSON.stringify({
                'username': username,
                'email': email,
                'url': url,
            }),
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleSendEmail();
    };

    return (
        <>
            <UserHeader />
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 20,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            パスワードを変更する
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="email"
                                label="Email"
                                type="email"
                                id="email"
                                autoComplete="current-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {error && (
                                <Alert severity="error" sx={{ width: '100%' }}>
                                    {error}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                メールアドレスを送信する
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </>
    );
}

export default ChangePassSend;

