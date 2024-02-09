import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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


const theme = createTheme();

function ChangePass() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const changeAPI = useAPI({
        APIName: 'change_pass',
        isLoginRequired: false,
    });

    useEffect(() => {
        if(changeAPI.isSuccess && changeAPI.data.success){
            console.log('Send succeeded');
            navigate('/login',{
                state: {
                    message: 'パスワードを変更しました。ログインしてください。',
                    severity: 'success',
                }
            })
            
        }else if(changeAPI.isSuccess === false){
            setError(changeAPI.data.message);
            console.error('Send failed');
        }
    },[changeAPI.isSuccess,navigate]);

    const handleChangePassword = async () => {
        changeAPI.sendAPI({
            body:JSON.stringify(
            {
            username: username,
            password: password,
            }
        )
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleChangePassword();
    };
    return (
        <>
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
                            パスワード変更画面
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
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                パスワードを変更する
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </>
    );
}

export default ChangePass;