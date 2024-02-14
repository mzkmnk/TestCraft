import React, { useEffect, useState, useRef } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";

const theme = createTheme();

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [user_email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [is_company_user, setIsCompanyUser] = useState(false);
  const [is_own_company, setIsOwnCompany] = useState(false);
  const [error, setError] = useState("");
  const [send_email, setSendEmail] = useState("");
  // バリデーション用のRef
  const userNameRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [isUserNameError, setUserNameError] = useState(false);
  const [isEmailError, setEmailError] = useState(false);
  const [isPasswordError, setPasswordError] = useState(false);
  const [userNameHelperText, setUserNameHelperText] = useState("");
  const [emailHelperText, setEmailHelperText] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");

  const url = 'https://www.testcrafts.net/email_verification';//随時変更

  // はじめに、ログインしているかどうかの確認を行う。
  const checkAuthAPI = useAPI({ APIName: "check_auth", loadOnStart: true });
  // sign Upボタンが押されたら、signupAPIを送信する。
  const signupAPI = useAPI({ APIName: "singup" });
  // signupAPIが成功したら、loginAPIを送信する。
  const loginAPI = useAPI({ APIName: "login" });
  // signupAPIが成功したら、メールを送信する。
  const sendEmailAPI = useAPI({ APIName: "send_email" });

  // checkAuthAPIの終了に反応するuseEffect。
  useEffect(() => {
    if (checkAuthAPI.isSuccess && checkAuthAPI.data.authenticated === true) {
      navigate("/mypage", {
        state: {
          message: "ログインしています。",
          severity: "success",
        },
      });
    }
  }, [checkAuthAPI.data.authenticated, checkAuthAPI.isSuccess, navigate]);

  // signupAPIの終了に反応するuseEffect。
  // usernameとpasswordが変更されるたびに呼び出されてしまう。
  useEffect(() => {
    if (signupAPI.isSuccess === true && loginAPI.isLoading === null) {
      loginAPI.sendAPI({
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
    } else if (signupAPI.isSuccess === false && signupAPI.status === 422) {
      setError("ユーザー名またはメールアドレスが既に登録されています。");
      signupAPI.statusInit();
    } else if (signupAPI.isSuccess === false) {
      navigate("/error");
    }
  }, [loginAPI, navigate, password, signupAPI, username]);

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
      sendEmailAPI.sendAPI({
        body: JSON.stringify({
          username: username,
          url: url,
          email: user_email,
        }),
      });
    } else if (loginAPI.isSuccess === false) {
      navigate("/error");
    }
  }, [
    is_own_company,
    loginAPI.isSuccess,
    navigate,
    sendEmailAPI,
    user_email,
    username,
  ]);

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
  /*
    const handleChange = () => {
    if (inputRef.current) {
      const ref = inputRef.current;
      if (!ref.validity.valid) {
        setInputError(true);
      } else {
        setInputError(false);
      }
    }
  };
  */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (is_company_user && is_own_company) {
      setError(
        "企業の代表者と企業のメンバーの両方にチェックすることはできません。"
      );
      return;
    }
    if (!username || !user_email || !password) {
      setError(
        "ユーザネーム、メールアドレス、パスワードを全て入力してください。"
      );
      return;
    }
    let isError = false;
    if (userNameRef.current) {
      const ref = userNameRef.current;
      if (!ref.validity.valid) {
        setUserNameError(true);
        setUserNameHelperText("4文字以上20文字以下で入力してください。");
        isError = true;
      } else {
        setUserNameError(false);
        setUserNameHelperText("");
      }
    }
    if (emailInputRef.current) {
      const ref = emailInputRef.current;
      if (!ref.validity.valid) {
        setEmailError(true);
        setEmailHelperText("不正なメールアドレスです。");
        isError = true;
      } else {
        setEmailError(false);
        setEmailHelperText("");
      }
    }
    if (passwordInputRef.current) {
      const ref = passwordInputRef.current;
      if (!ref.validity.valid) {
        setPasswordError(true);
        setPasswordHelperText("8文字以上で入力してください。");
        isError = true;
      } else {
        setPasswordError(false);
        setPasswordHelperText("");
      }
    }
    if (isError) {
      return;
    } else {
      handleSignup();
    }
  };

  return (
    <>
      <UserHeader />
      <ThemeProvider theme={theme}>
        <Container
          component="main"
          maxWidth="xs"
          sx={{ height: "calc(100vh - 90px)" }}
        >
          <CssBaseline />
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "0 auto",
              justifyContent: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            {send_email && <p>{send_email}</p>}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                inputRef={userNameRef}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username（4文字以上20文字以内）"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                error={isUserNameError}
                onChange={(e) => {
                  if (isUserNameError) {
                    setUserNameError(false);
                    setUserNameHelperText("");
                  }
                  setUsername(e.target.value);
                }}
                inputProps={{ maxLength: 20, minLength: 4 }}
                helperText={userNameHelperText}
              />
              <TextField
                type="email"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={user_email}
                onChange={(e) => {
                  if (isEmailError) {
                    setEmailError(false);
                    setEmailHelperText("");
                  }
                  setEmail(e.target.value);
                }}
                inputRef={emailInputRef}
                error={isEmailError}
                inputProps={{
                  maxLength: 254,
                }}
                helperText={emailHelperText}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password（8文字以上）"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                error={isPasswordError}
                onChange={(e) => {
                  if (isPasswordError) {
                    setPasswordError(false);
                    setPasswordHelperText("");
                  }
                  setPassword(e.target.value);
                }}
                inputProps={{ maxLength: 100, minLength: 8 }}
                inputRef={passwordInputRef}
                helperText={passwordHelperText}
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
                    onChange={(e) => {
                      if (e.target.checked) {
                        setIsCompanyUser(false);
                      }
                      setIsOwnCompany(e.target.checked);
                    }}
                    color="primary"
                  />
                }
                label="企業の代表の方"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={is_company_user}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setIsOwnCompany(false);
                      }
                      setIsCompanyUser(e.target.checked);
                    }}
                    color="primary"
                  />
                }
                label="企業のメンバーの方"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={signupAPI.isLoading || loginAPI.isLoading}
              >
                {signupAPI.isLoading || loginAPI.isLoading ? (
                  <CircularProgress />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default Signup;
