import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";

// アイコンimport
import BorderColorIcon from "@mui/icons-material/BorderColor";
import BookIcon from "@mui/icons-material/Book";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import GroupIcon from "@mui/icons-material/Group";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useAPI } from "./hooks/useAPI";

const UserHeader = ({ position = "static" }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const isLoggedIn = !!username;
  // const isOwnCompany = localStorage.getItem("is_own_company") === "true";
  const [isOwnCompanyUser, setIsOwnCompanyUser] = React.useState(false);
  const [isCompanyUser, setIsCompanyUser] = React.useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null);
  const [questionsMenuAnchorEl, setQuestionsMenuAnchorEl] =
    React.useState(null);
  const [companyMenuAnchorEl, setCompanyMenuAnchorEl] = React.useState(null);

  const isCompanyUserAPI = useAPI({
    APIName: "is_company_user",
    loadOnStart: true,
  });

  const logoutAPI = useAPI({
    APIName: "logout",
  });

  useEffect(() => {
    if (isCompanyUserAPI.isSuccess === false) {
      navigate("/error");
    } else if (
      isCompanyUserAPI.isSuccess === true &&
      isCompanyUserAPI.data.success === true
    ) {
      const data = isCompanyUserAPI.data;
      setIsOwnCompanyUser(data.is_own_company);
      setIsCompanyUser(data.is_company_user);
    }
  }, [isCompanyUserAPI.data, isCompanyUserAPI.isSuccess, navigate]);

  useEffect(() => {
    if (logoutAPI.isSuccess === false) {
      navigate("/error");
    } else if (
      logoutAPI.isSuccess === true &&
      logoutAPI.data.success === true
    ) {
      localStorage.removeItem("username");
      localStorage.removeItem("is_own_company");
      navigate("/login");
    }
  }, [logoutAPI.data.success, logoutAPI.isSuccess, navigate]);

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
    logoutAPI.sendAPI({ body: {} });
  };

  const styles = {
    icon: {
      marginRight: "10px",
      color: "#1876D2",
    },
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
                  <EqualizerIcon style={styles.icon} />
                  アクティビティ
                </MenuItem>
                {(isOwnCompanyUser || isCompanyUser) && (
                  <MenuItem
                    component={Link}
                    to="/mypage/company_message"
                    onClick={handleMenuClose}
                  >
                    <NotificationsActiveIcon style={styles.icon} />
                    企業からのお知らせ
                  </MenuItem>
                )}
                <MenuItem
                  component={Link}
                  to="/user_change"
                  onClick={handleMenuClose}
                >
                  <ManageAccountsIcon style={styles.icon} />
                  登録情報変更
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/mypage/message"
                  onClick={handleMenuClose}
                >
                  <NotificationsActiveIcon style={styles.icon} />
                  お知らせ
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/mypage/mycreate"
                  onClick={handleMenuClose}
                >
                  <HistoryIcon style={styles.icon} />
                  作成履歴
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/mypage/mysolve"
                  onClick={handleMenuClose}
                >
                  <HistoryIcon style={styles.icon} />
                  解答履歴
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon style={styles.icon} />
                  ログアウト
                </MenuItem>
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
                  <BorderColorIcon style={styles.icon} />
                  問題一覧
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/editor"
                  onClick={handleMenuClose}
                >
                  <BookIcon style={styles.icon} />
                  問題作成
                </MenuItem>
              </Menu>
              {isOwnCompanyUser && (
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
                      <AddIcon style={styles.icon} />
                      ユーザ追加
                    </MenuItem>
                    {isOwnCompanyUser && (
                      <MenuItem
                        component={Link}
                        to="/all_company_users"
                        onClick={handleMenuClose}
                      >
                        <GroupIcon style={styles.icon} />
                        社員一覧
                      </MenuItem>
                    )}
                    <MenuItem
                      component={Link}
                      to="/send_message"
                      onClick={handleMenuClose}
                    >
                      <SendIcon style={styles.icon} />
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
