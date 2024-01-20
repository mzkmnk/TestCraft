import React from "react";
import { useNavigate, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";

const UserHeader = ({ position = "static" }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const isLoggedIn = !!username;
  const isOwnCompany = localStorage.getItem("is_own_company") === "true";

  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null);
  const [questionsMenuAnchorEl, setQuestionsMenuAnchorEl] = React.useState(null);
  const [companyMenuAnchorEl, setCompanyMenuAnchorEl] = React.useState(null);

  const handleUserMenuClick = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleQuestionsMenuClick = (event) => {
    setQuestionsMenuAnchorEl(event.currentTarget);
  };

  const handleCompanyMenuClick = (event) => {
    setCompanyMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setUserMenuAnchorEl(null);
    setQuestionsMenuAnchorEl(null);
    setCompanyMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        console.log("Logout succeeded");
        localStorage.removeItem("username");
        localStorage.removeItem("is_own_company");
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position={position}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            TestCraft
          </Typography>
          {isLoggedIn ? (
            <>
              <Button
                color="inherit"
                aria-controls="user-menu-appbar"
                aria-haspopup="true"
                onClick={handleUserMenuClick}
                style={{ cursor: "pointer" }}
              >
                {username}
              </Button>
              <Menu
                id="user-menu-appbar"
                anchorEl={userMenuAnchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(userMenuAnchorEl)}
                onClose={handleMenuClose}
                TransitionComponent={Fade}
              >
                <MenuItem
                  component={Link}
                  to="/mypage"
                  onClick={handleMenuClose}
                >
                  マイステータス
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/mypage/message"
                  onClick={handleMenuClose}
                >
                  お知らせ
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/mypage/mycreate"
                  onClick={handleMenuClose}
                >
                  作成履歴
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/mypage/mysolve"
                  onClick={handleMenuClose}
                >
                  解答履歴
                </MenuItem>
                <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
              </Menu>
              <Button
                color="inherit"
                aria-controls="questions-menu-appbar"
                aria-haspopup="true"
                onClick={handleQuestionsMenuClick}
                style={{ cursor: "pointer" }}
              >
                問題
              </Button>
              <Menu
                id="questions-menu-appbar"
                anchorEl={questionsMenuAnchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(questionsMenuAnchorEl)}
                onClose={handleMenuClose}
                TransitionComponent={Fade}
              >
                <MenuItem
                  component={Link}
                  to="/questionsAll"
                  onClick={handleMenuClose}
                >
                  問題一覧
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/editor"
                  onClick={handleMenuClose}
                >
                  問題作成
                </MenuItem>
              </Menu>
              {isOwnCompany && (
                <>
                  <Button
                    color="inherit"
                    aria-controls="company-menu-appbar"
                    aria-haspopup="true"
                    onClick={handleCompanyMenuClick}
                    style={{ cursor: "pointer" }}
                  >
                    企業用
                  </Button> 
                  <Menu
                    id="company-menu-appbar"
                    anchorEl={companyMenuAnchorEl}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    open={Boolean(companyMenuAnchorEl)}
                    onClose={handleMenuClose}
                    TransitionComponent={Fade}
                  >
                    <MenuItem
                      component={Link}
                      to="/add_user"
                      onClick={handleMenuClose}
                    >
                      ユーザ追加
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/send_message"
                      onClick={handleMenuClose}
                    >
                      お知らせ送信
                    </MenuItem>
                  </Menu>
                </>
              )}
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                style={{ cursor: "pointer" }}
              >
                ログイン
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/signup"
                style={{ cursor: "pointer" }}
              >
                登録
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default UserHeader;
