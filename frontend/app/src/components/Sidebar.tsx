import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import 'antd/dist/reset.css';
import moment from 'moment';

//MUI
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CardHeader,
  Avatar,
} from '@mui/material';

import Timeline from '@mui/lab/Timeline';
import TimelineItem,{ timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red } from '@mui/material/colors';


//aws設定
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { listPosts } from '../graphql/queries';
import { createPost } from '../graphql/mutations';
import { postCreated } from '../graphql/subscriptions';
import config from '../aws-exports.js';

import { useAPI } from '../hooks/useAPI';
import LoadingScreen from '../LoadingScreen.tsx';
import { set } from 'date-fns';

Amplify.configure(config);

const client = generateClient();

interface MenuItem {
  label: string;
  key: string;
};

interface User {
  id: string;
  username: string;
  icon: string;
  email: string;
  isCompanyUser: boolean;
  isOwnCompany: boolean;
  createdAt: string;
  problemCreateCnt: number;
  problemSlvCnt: number;
  isEmailCertification: boolean;
}

interface Comment {
  id: string;
  user: User;
  content: string;
  createdAt: string;
}

interface Like {
  id: string;
  user: User;
  createdAt: string;
}

interface Post {
  id: string;
  user: User;
  content: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  likes: Like[];
}

const Sidebar: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentCurrentPostId, setCommentCurrentPostId] = useState('');
  const [commentCurrentPost, setCommentCurrentPost] = useState<Post>();
  const [message, setMessage] = useState('');
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState('');
  const [icon, setIcon] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isPostLike, setIsPostLike] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');
  
  const baseS3Url = "https://user-profile-icon.s3.ap-northeast-1.amazonaws.com/media/";

  const init_icon = "https://user-profile-icon.s3.ap-northeast-1.amazonaws.com/media/icon/init_user.jpg";
  // const init_icon = "icon/init_user.jpg"

  const navigate = useNavigate();

  const loginInfoAPI  = useAPI({
    APIName: 'get_user_info_change',
    loadOnStart: true,
  });

  useEffect(() => {
    if(loginInfoAPI.isSuccess){
      const data = loginInfoAPI.data;
      console.log("loginInfoAPI,data",data);
      if(data.success){
        setUserId(data.user_id);
        setIcon(data.icon_init);
        localStorage.setItem("user_id",data.user_id);
        localStorage.setItem("icon_path",data.icon_init);
      }else{
        console.log(data.error);
      }
    }else{
      console.log("useAPI loginInfoAPI error");
    }
  },[loginInfoAPI.isSuccess,loginInfoAPI.data]);
  
  useEffect(() => {
    console.log("userId:", userId);
  }, [userId]);

  useEffect(() => {
    console.log("icon:", icon);
  },[icon]);

  useEffect(() => {
    const fetchPosts = async () => {
      try{
        setLoading(true);
        const postData = await client.graphql({
          query: listPosts,
        });
        console.log("postData",postData);
        const firstPosts = postData.data.listPosts as Post[];
        const reversedFirstPosts = [...firstPosts].reverse();
        console.log("firstPosts",firstPosts);
        setPosts(reversedFirstPosts);
        setLoading(false);
      }catch(error){
        console.log("listposts",error);
        setLoading(false);
        navigate('/mypage',{
          state:{
            message: '投稿の取得に失敗しました',
            severity: 'error',
          }
        })
      }
    };
    fetchPosts();
  },[]);

  const postCommentAPI = useAPI({
    APIName: 'post_comment',
  });

  useEffect(() => {
    if(postCommentAPI.isSuccess){
      const data = postCommentAPI.data;
      if(data.success){
        const newComment = data.comment;
        setPosts((prevPosts) => {
          return prevPosts.map((post) => {
            if(post.id === newComment.post.id.toString()){
              return {
                ...post,
                comments: [...post.comments, newComment]
              };
            }
            return post;
          })
        });
      }else{
        console.log(data.error);
      }
    }
  },[postCommentAPI.isSuccess,postCommentAPI.data]);

  const handleMenuClick = (path) => {navigate(path);}

  const handleOpenModal = () => {setIsModalOpen(true);};

  const handleCloseModal = () => {setIsModalOpen(false);};

  const handleCommentClick = (postId: string) => {
    setCommentCurrentPostId(postId);
    setCommentCurrentPost(posts.find((post) => post.id === postId));
    setIsCommentModalOpen(true);
  };

  const handleSendComment = async (postId,comment) => {
    postCommentAPI.sendAPI({
      body:JSON.stringify({
        postId: postId,
        content: comment,
      })
    });
    setSnackbarContent('コメントしました');
    handleOpenSnackbar();
    setComment('');
    setIsCommentModalOpen(false);
  }

  const postLikeAPI = useAPI({
    APIName: 'post_like',
  });

  const handlePostLikeClick = async (postId: string) => {
    postLikeAPI.sendAPI({
      body:JSON.stringify({
        postId: postId,
      })
    })
  };

  useEffect(() => {
    if(postLikeAPI.isSuccess){
      const data = postLikeAPI.data;
      if(data.success){
        setSnackbarContent('いいねを取り消しました');
        if(data.data === null){
          setSnackbarContent('いいねを取り消しました');
          const newPostLike = data.data;
          setPosts((prevPosts) => {
            return prevPosts.map((post) => {
              if(post.id === data.postId.toString()){
                const updatedLikes = post.likes.filter((like) => like.user.id != userId);
                return {
                  ...post,
                  likes: updatedLikes
                };
              }
              return post;
            })
          });
        }else{
          setSnackbarContent('いいねしました');
          const newPostLike = data.data;
          setPosts((prevPosts) => {
            return prevPosts.map((post) => {
              if(post.id === data.postId.toString()){
                return {
                  ...post,
                  likes: [...post.likes, newPostLike]
                };
              }
              return post;
            })
          });
        }
        handleOpenSnackbar();
      }else{
        console.log(data.error);
      }
    }
  },[postLikeAPI.isSuccess,postLikeAPI.data]);

  const userProfileClick = (userId:string) => {navigate(`/profile/${userId}`)};

  const handleSendMessage =  async (message: string) => {
    try{
      console.log("userId",userId);
      console.log("message",message);
      const newPost = await client.graphql({
        query: createPost,
        variables: {
          input: {
            userId: userId,
            content: message,
          }
        }
      });
      console.log("newPost",newPost);
      setIsModalOpen(false);
      setMessage('');
      setSnackbarContent('投稿しました');
      handleOpenSnackbar();
    } catch (error) {
      console.error("handleSendMessage error",error);
    }
  }

  useEffect(() => {
    const sub = client.graphql({
      query : postCreated,
    }).subscribe({
      next: (value) => {
        if(value.data &&  value.data.postCreated){
          const newPost = value.data.postCreated as Post;
          console.log("icon",icon);
          console.log("userId",userId);
          console.log("newPost",newPost);
          console.log("typeof", typeof localStorage.getItem("icon_path"));
          newPost.user.icon = localStorage.getItem("icon_path") === 'null' ? "icon/init_user.jpg" : localStorage.getItem("icon_path");
          // if(localStorage.getItem("icon_path") === null){
          //   newPost.user.icon = "icon/init_user.jpg";
          // }else{
          //   newPost.user.icon = localStorage.getItem("icon_path");
          // }
          console.log("newPost",newPost);
          setPosts(prevPosts => [newPost, ...prevPosts]);
        }
      }
    })
    return () => sub.unsubscribe();
  },[]);

  const handleOpenSnackbar = () => {setOpenSnackbar(true);};

  const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenSnackbar(false);
  };

  const { Content, Sider } = Layout;

  const menuItems: MenuItem[] = [
    { label: 'マイプロフィール', key: '/profile/'+ userId,onClick: () => handleMenuClick('/profile/'+ userId) },
    // { label: 'いいねした投稿', key: '/like_post',onClick: () => handleMenuClick('/like_post') },
  ];

  if(loading){return <LoadingScreen />;}

  return (
    <>
      <Layout style={layoutStyle}>
        <Sider style={siderStyle}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
          <Box textAlign="center" p={2} style={{ position: 'absolute', bottom: 0, width: '100%' }}>
            <Button
              style={buttonStyle}
              variant="contained" 
              color="primary"
              onClick={handleOpenModal}
            >
              投稿
            </Button>
          </Box>
        </Sider>
        <Content style={contentStyle}>
          <Timeline
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              }
            }}
          >
            {posts.map((post) => (
              <TimelineItem key={post.id}>
                <TimelineSeparator>
                  <TimelineDot color="primary" variant="outlined" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  {moment(post.createdAt).fromNow()}
                  <Card
                    sx={cardStyle}
                    key={post.id}
                    onClick = {() => navigate(`/post_detail/${post.id}`)}
                  >
                    <CardHeader
                      sx = {cardHeaderStyle}
                      avatar={
                        <Avatar
                          sx={ avatarStyle }
                          src={ post.user.icon === '' ? init_icon : baseS3Url+post.user.icon}
                          aria-label="recipe"
                          onClick={(e) => { e.stopPropagation(); userProfileClick(post.user.id); }}
                        >
                          {post.user?.username[0]}
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label="settings">
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={
                        <Typography
                          variant="h6"
                          onClick={(e) => { e.stopPropagation(); userProfileClick(post.user.id); }}
                          style={{ cursor:'Pointer' }}
                        >
                          {post.user?.username}
                          </Typography>}
                    />
                    <CardContent sx={cardContentStyle}>
                      <Typography variant="body1" color="text.secondary">
                        {post.content}
                      </Typography>
                    </CardContent>
                    <CardActions sx = {cardActionsStyle}>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          aria-label="postlike"
                          sx={{
                            '&:hover': { color: '#1876D1' }
                          }}
                          onClick={(e) => { e.stopPropagation(); handlePostLikeClick(post.id);}}
                        >
                          {post.likes.some((like) => {
                            return Number(like.user.id) === Number(userId);
                            }) ? <FavoriteIcon sx={{color : "#1876D1"}} /> : <FavoriteBorderIcon />}
                        </IconButton>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: '8px' }}>
                          {post.likes.length}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          aria-label="comment"
                          sx={{ '&:hover': { color: 'primary.main' } }}
                          onClick={(e) => { e.stopPropagation(); handleCommentClick(post.id); }}
                        >
                          <CommentIcon />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: '8px' }}>
                          {post.comments.length}
                        </Typography>
                      </Box>
                    </CardActions>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Content>
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Box display="flex" flexDirection="column">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                新しい投稿
              </Typography>
                <TextField
                  autoFocus
                  margin='dense'
                  id="message"
                  label="何を投稿する？"
                  type='text'
                  fullWidth
                  multiline
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  variant="outlined"
                />
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!message.trim()}
                    onClick={() => handleSendMessage(message)}
                    sx={{
                      opacity: !message.trim() ? 0.5 : 1,
                    }}
                  >
                    投稿する
                  </Button>
                </Box>
              </Box>
          </Box>
        </Modal>
        <Modal
          open={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Box display="flex" flexDirection="column">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                投稿
              </Typography>
              {commentCurrentPost && (
                <Box mb={2} p={2} sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                  <Typography variant="h6" component="h2">
                    {`投稿者: ${commentCurrentPost.user.username}`}
                  </Typography>
                  <Typography variant="body1" sx={{ my: 1 }}>
                    {commentCurrentPost.content}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    {`投稿日時: ${moment(commentCurrentPost.createdAt).fromNow()}`}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box display="flex" flexDirection="column">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                コメント
              </Typography>
              <TextField
                autoFocus
                margin='dense'
                id="message"
                label="コメントしよう!!"
                type='text'
                fullWidth
                multiline
                rows={6}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                variant="outlined"
              />
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSendComment(commentCurrentPostId,comment)}
                >
                  コメントする
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Layout>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarContent}
        </Alert>
      </Snackbar>
    </>
  );
};
const layoutStyle = {
  display: 'flex',
  minHeight: '100vh',
};

const siderStyle = {
  position: 'fixed',
  top: '64px',
  left: 0,
  height: 'calc(100vh - 64px)',
  width: '250px',
  overflowY: 'auto',
};

const contentStyle = {
  flexGrow: 1,
  marginLeft: '250px',
  paddingTop: '64px',
  transition: 'margin-left .2s',
  zIndex: 0,
};


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: 'none'
};


const cardStyle = {
  maxWidth: '85%', 
  mb: 1,
  padding: '12px',
  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
  borderRadius: 3,
  '&:hover': {
    boxShadow: '0 6px 12px 0 rgba(0,0,0,0.2)',
  },
  border: '1px solid #e0e0e0',
  margin: 'auto',
  marginBottom: 5,
  height: 'auto',
  cursor: 'pointer',
};

const cardHeaderStyle = {
  backgroundColor: "#f5f5f5",
  borderBottom: "1px solid #e0e0e0",
};

const cardContentStyle = {
  padding: "16px",
  "&:last-child": {
    paddingBottom: "16px",
  },
};

const cardActionsStyle = {
  justifyContent: "space-between",
  padding: "0 16px 16px",
};

const avatarStyle = {
  color: "#ffffff",
  cursor:'Pointer',
};

const buttonStyle = {
  width: '100%',
  margin: '0.5rem 0',
  borderRadius: '20px',
};

const fromNow = (date) => {
  return moment(date).fromNow();
};

export default Sidebar;