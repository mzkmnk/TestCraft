import React from 'react';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import 'antd/dist/reset.css';
import moment from 'moment';

//MUI
import { Button, Modal, Box, TextField, Typography,Snackbar,Alert } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';


//aws設定
import { Amplify } from 'aws-amplify';
import { generateClient, post } from 'aws-amplify/api';
import { listPosts } from '../graphql/queries';
import { createPost } from '../graphql/mutations';
import { postCreated } from '../graphql/subscriptions';
import config from '../aws-exports.js';

import { useAPI } from '../hooks/useAPI';
import LoadingScreen from '../LoadingScreen.tsx';

Amplify.configure(config);

const client = generateClient();

interface MenuItem {
  label: string;
  key: string;
};

interface User {
  id: string;
  username: string;
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
  const [message, setMessage] = useState('');
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');

   const navigate = useNavigate();

  const loginInfoAPI  = useAPI({
    APIName: 'get_user_info_change',
    loadOnStart: true,
  });

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

  

  useEffect(() => {
    if(loginInfoAPI.isSuccess){
      const data = loginInfoAPI.data;
      if(data.success){
        setUserId(data.user_id);
      }else{
        console.log(data.error);
      }
    }else{
      console.log("useAPI loginInfoAPI error");
    }
  },[loginInfoAPI.isSuccess]);
  
  useEffect(() => {console.log("userId:", userId);}, [userId]);


  const handleMenuClick = (path) => {navigate(path);}

  const handleOpenModal = () => {setIsModalOpen(true);};

  const handleCloseModal = () => {setIsModalOpen(false);};

  const handleCommentClick = (postId: string) => {
    setCommentCurrentPostId(postId);
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
      console.error("error",error);
    }
  }

  useEffect(() => {
    const sub = client.graphql({
      query : postCreated,
    }).subscribe({
      next: (value) => {
        console.log("value",value);
        if(value.data &&  value.data.postCreated){
          const newPost = value.data.postCreated as Post;
          setPosts(prevPosts => [newPost, ...prevPosts]);
        }
      }
    })
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
    { label: 'いいねした投稿', key: '/like_post',onClick: () => handleMenuClick('/like_post') },
  ];

  if(loading){return <LoadingScreen />;}

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider style={
          { position: 'fixed', top: '64px', height: 'calc(100vh - 64px)', overflowY: 'auto' }
          }
          width={250}
          className="site-layout-background"
        >
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
        <Layout style={{ flex: 1 }}>
          <Content
            style={{ marginTop: '2rem',marginLeft: 250, padding: '64px 50px' }}
          >
            {posts.map((post) => (
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
                  subheader={<Typography variant="caption" color="textSecondary">{moment(post.createdAt).fromNow()}</Typography>}
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
                      onClick={(e) => { e.stopPropagation();}}//いいね機能後日追加
                    >
                      <FavoriteIcon />
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
            ))}
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
                      onClick={() => handleSendMessage(message)}
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
  maxWidth: '90%', 
  mb: 2,
  padding: '16px',
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
  backgroundColor: red[500],
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