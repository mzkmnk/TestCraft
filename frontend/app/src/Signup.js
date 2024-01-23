import React, { useEffect, useState } from 'react';
import { json, useNavigate } from 'react-router-dom';
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
import UserHeader from './UserHeader';

const theme = createTheme();

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [user_email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [is_company_user,setIsCompanyUser] = useState(false);
  const [is_own_company, setIsOwnCompany] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/check_auth', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (data.authenticated === true) {
          navigate('/mypage');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [navigate]);

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
        {
            "username" : username,
            "email" : user_email,
            "password" : password,
            "is_company_user" : is_company_user,
            "is_own_company" : is_own_company,
        }
        ),
      }
      );
      if (response.ok) {
        localStorage.setItem('username', username);
        const is_login_response = await fetch('http://localhost:8000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
              {
              "username" : username,
              "password" : password,
          }
          ),
          credentials: 'include',
        });
        if(is_login_response.ok){
          localStorage.setItem('is_own_company', is_own_company);
          navigate('/mypage',{
            state:{
              message:'ユーザー登録に成功しました。',
              severity:'success',
            }
          });
        }
        else{
          console.error('Login failed');
        }
      } else {
        console.error('Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
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
              <FormControlLabel
                control={<Checkbox value={is_own_company} onChange={(e) => setIsOwnCompany(e.target.checked)} color="primary" />}
                label="企業の代表の方はチェックを入れてください"
              />
              <FormControlLabel 
                control={<Checkbox value={is_company_user} onChange={(e) => setIsCompanyUser(e.target.checked)} color="primary" />}
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