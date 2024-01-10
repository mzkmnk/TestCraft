import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";

const UserHeader = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [questionsMenuAnchorEl, setQuestionsMenuAnchorEl] = useState(null);


  const handleUserMenuClick = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleQuestionsMenuClick = (event) => {
    setQuestionsMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setUserMenuAnchorEl(null);
    setQuestionsMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (response.ok) {
        console.log('Logout succeeded');
        localStorage.removeItem('username');
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };  

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {/* アプリ名 */}
          </Typography>
          <Button
            color="inherit"
            aria-controls="user-menu-appbar"
            aria-haspopup="true"
            onClick={handleUserMenuClick}
            style={{ cursor: 'pointer' }}
          >
            {username}
          </Button>
          <Menu
            id="user-menu-appbar"
            anchorEl={userMenuAnchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(userMenuAnchorEl)}
            onClose={handleMenuClose}
            TransitionComponent={Fade}
          >
            <MenuItem 
              component={Link} 
              to="/mypage" 
              onClick={handleMenuClose} 
              sx={{ '&:hover': { backgroundColor: 'primary.light', color: 'white' } }}
            >
              マイステータス
            </MenuItem>
            <MenuItem 
              component={Link} 
              to="/mypage/myCreate"
              onClick={handleMenuClose} 
              sx={{ '&:hover': { backgroundColor: 'primary.light', color: 'white' } }}
            >
              作成履歴
            </MenuItem>
            <MenuItem 
              component={Link} 
              to="/mypage/mySolve" 
              onClick={handleMenuClose} 
              sx={{ '&:hover': { backgroundColor: 'primary.light', color: 'white' } }}
            >
              解答履歴
            </MenuItem>
            <MenuItem
              color="inherit"
              onClick={handleLogout}
              sx={{ '&:hover': { backgroundColor: 'primary.light', color: 'white' } }}
            >
              ログアウト
            </MenuItem>
            <MenuItem
              color="inherit"
              component={Link}
              to="/cancel"
              style={{ cursor: 'pointer' }}
            >
              退会
            </MenuItem>
          </Menu>
          <Button
            color="inherit"
            aria-controls="questions-menu-appbar"
            aria-haspopup="true"
            onClick={handleQuestionsMenuClick}
            style={{ cursor: 'pointer' }}
          >
            問題
          </Button>
          <Menu
            id="questions-menu-appbar"
            anchorEl={questionsMenuAnchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(questionsMenuAnchorEl)}
            onClose={handleMenuClose}
            TransitionComponent={Fade}
          >
            <MenuItem 
              component={Link} 
              to="/questionsAll" 
              onClick={handleMenuClose} 
              sx={{ '&:hover': { backgroundColor: 'primary.light', color: 'white' } }}
            >
              問題一覧画面
            </MenuItem>
            <MenuItem 
              component={Link} 
              to="/questionsCreate" 
              onClick={handleMenuClose} 
              sx={{ '&:hover': { backgroundColor: 'primary.light', color: 'white' } }}
            >
              問題制作画面
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default UserHeader;

