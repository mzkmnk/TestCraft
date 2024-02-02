import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

import UserHeader from "./UserHeader";
import { useAPI } from "./hooks/useAPI";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const theme = createTheme();
function UserChange() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const API = useAPI({
    APIName: "user_change",
    isLoginRequired: true,
  });

  useEffect(() => {
    if (API.isSuccess === false) {
      navigate("/error");
    } else if (API.isSuccess === true) {
      navigate("/mypage", {
        state: {
          message: `ユーザ情報を変更しました`,
          severity: "success",
        },
      });
    }
  }, [API.data.username, API.isSuccess, navigate]);

  const handleChange = async () => {
    API.sendAPI({
      body: JSON.stringify({ password: password }),
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleChange();
  };

  const styles = {
    icon: {
      marginRight: "5px",
      color: "#1876D2",
    },
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
            <Avatar sx={{ m: 1, bgcolor: "white" }}>
              <ManageAccountsIcon style={styles.icon} fontSize="large"/>
            </Avatar>
            <Typography component="h1" variant="h5">
              ユーザ変更画面
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
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                登録情報を変更する
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default UserChange;
