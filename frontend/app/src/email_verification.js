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
import { set } from 'date-fns';


const theme = createTheme();

function ChangePass() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const is_check_API = useAPI({
        APIName: 'email_verification',
        isLoginRequired: false, 
    });

    useEffect(() => {
        if (is_check_API.isSuccess === true && is_check_API.data.success === true) {
            navigate('/mypage',{
                state: {
                    message: 'メールアドレス認証が完了しました。',
                    severity: 'success',
                },
            });
        }else if(is_check_API.isSuccess === false){
            setError('変更に失敗しました。ユーザネームが違います。');
        }
    },[is_check_API.isSuccess, navigate]);

    const handleChangePassword = async () => {
        is_check_API.sendAPI({
            body: JSON.stringify({
                'username': username,
            }),
        });
    };
    // const handleChangePassword = async () => {
    //     setError(' ');
    //     is_check_API.sendAPI({
    //         body: JSON.stringify({
    //             'username': username,
    //         }),
    //     });
    //     if (is_check_API.isSuccess) {
    //         navigate('/mypage',{
    //             state: {
    //                 message: 'メールアドレス認証が完了しました。',
    //                 severity: 'success',
    //             },
    //         });
    //     } else {
    //         setError('変更に失敗しました。ユーザネームが違います。');
    //         console.error('Send failed');
    //     }
    // };

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
                            メールアドレス認証画面
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
                                メールアドレス認証を完了する
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </>
    );
}

export default ChangePass;

