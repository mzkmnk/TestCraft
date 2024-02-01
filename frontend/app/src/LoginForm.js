import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAPI } from "./hooks/useAPI";

import UserHeader from "./UserHeader";

const theme = createTheme();

function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // はじめに、ログインしているかどうかの確認を行う。
  const checkAuthAPI = useAPI({ APIName: "check_auth", loadOnStart: true });
  const loginAPI = useAPI({ APIName: "login" });

  // checkAuthAPIの終了に反応するuseEffect。
  useEffect(() => {
    if (checkAuthAPI.isSuccess && checkAuthAPI.data.authenticated === true) {
      navigate("/mypage", {
        state: {
          message: "ログインしています。",
        },
      });
    }
  }, [checkAuthAPI.data, navigate]);
  // loginAPIの終了に反応するuseEffect。
  useEffect(() => {
    if (loginAPI.isSuccess === true) {
      localStorage.setItem("username", username);
      localStorage.setItem("is_own_company", loginAPI.data.is_own_company);
      navigate("/mypage", {
        state: {
          message: "ログインに成功しました。",
          severity: "success",
        },
      });
    } else if (loginAPI.isSuccess === false) {
      setError("ログイン失敗しました。ユーザネームかパスワードが違います。");
    }
  }, [loginAPI.isSuccess, navigate, username]);

  const handleLogin = async () => {
    setError("");
    loginAPI.sendAPI({
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin();
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
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
                <Alert severity="error" sx={{ width: "100%" }}>
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default LoginForm;
