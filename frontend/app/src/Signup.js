import React, { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import UserHeader from "./UserHeader";
import { useAPI } from "./hooks/useAPI";

const theme = createTheme();

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [user_email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [is_company_user, setIsCompanyUser] = useState(false);
  const [is_own_company, setIsOwnCompany] = useState(false);
  const [error, setError] = useState("");

  // はじめに、ログインしているかどうかの確認を行う。
  const checkAuthAPI = useAPI({ APIName: "check_auth", loadOnStart: true });
  // sign Upボタンが押されたら、signupAPIを送信する。
  const signupAPI = useAPI({ APIName: "singup" });
  // signupAPIが成功したら、loginAPIを送信する。
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

  // signupAPIの終了に反応するuseEffect。
  useEffect(() => {
    if (signupAPI.isSuccess === true) {
      loginAPI.sendAPI({
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
    } else if (signupAPI.isSuccess === false) {
      navigate("/error");
    }
  }, [loginAPI, navigate, password, signupAPI.isSuccess, username]);

  // loginAPIの終了に反応するuseEffect。
  useEffect(() => {
    if (loginAPI.isSuccess === true) {
      localStorage.setItem("username", username);
      localStorage.setItem("is_own_company", is_own_company);
      navigate("/mypage", {
        state: {
          message: "ユーザー登録に成功しました。",
          severity: "success",
        },
      });
    } else if (loginAPI.isSuccess === false) {
      navigate("/error");
    }
  }, [is_own_company, loginAPI.isSuccess, navigate, username]);

  const handleSignup = async () => {
    signupAPI.sendAPI({
      body: JSON.stringify({
        username: username,
        email: user_email,
        password: password,
        is_company_user: is_company_user,
        is_own_company: is_own_company,
      }),
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!username || !user_email || !password) {
      setError(
        "ユーザネーム、メールアドレス、パスワードを全て入力してください。"
      );
      return;
    }
    if (is_company_user && is_own_company) {
      setError(
        "企業の代表者と企業のメンバーの両方にチェックすることはできません。"
      );
      return;
    }
    handleSignup();
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
              Sign Up
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={user_email}
                onChange={(e) => setEmail(e.target.value)}
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
                <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
                  {error}
                </Alert>
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={is_own_company}
                    onChange={(e) => setIsOwnCompany(e.target.checked)}
                    color="primary"
                  />
                }
                label="企業の代表の方はチェックを入れてください"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={is_company_user}
                    onChange={(e) => setIsCompanyUser(e.target.checked)}
                    color="primary"
                  />
                }
                label="企業の代表ではないが、企業のメンバーの方はチェックを入れてください"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default Signup;
