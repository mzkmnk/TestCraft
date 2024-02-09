import React from 'react';
import { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import 'antd/dist/reset.css';

//MUI
import { Button, Modal, Box, TextField, Typography, makeStyles,Drawer,Toolbar } from '@mui/material';
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
import { styled } from '@mui/system';


//aws設定
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { createPost } from '../graphql/mutations';
import { postCreated } from '../graphql/subscriptions';
import config from './aws-exports.js';

import { useAPI } from '../hooks/useAPI';

Amplify.configure(config);

const client = generateClient();

const { Content, Sider } = Layout;

interface MenuItem {
  label: string;
  key: string;
};

const menuItems: MenuItem[] = [
  { label: 'option1', key: '1' },
  { label: 'option2', key: '2' },
  { label: 'option3', key: '3' },
  { label: 'option4', key: '4' },
];

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
  const [userId, setUserId] = useState('');

  const loginInfoAPI  = useAPI({
    APIName: 'get_user_info_change',
    loadOnStart: true,
  })

  useEffect(() => {
    if(loginInfoAPI.isSuccess){
      const data = loginInfoAPI.data;
      if(data.success){
        setUserId(data.user_id);
      }else{
        console.log(data.error);
      }
    }else{
      console.log("useAPI error");
    }
  })

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSendMessage = async (message: string) => {
    console.log(message);
  const newPost = await client.graphql({
      query: createPost,
      variables: {
        input: {
          userId: userId,
          content: message,
        }
      }
    })
    setIsModalOpen(false);
  }

  useEffect(() => {
    console.log('useEffect start');
    const sub = client.graphql({
      query : postCreated,
    }).subscribe({
      next: (value) => {
        console.log("value",value);
        if(value.data &&  value.data.postCreated){
          const newPost = value.data.postCreated as Post;
          setPosts(prevPosts => [...prevPosts, newPost]);
        }
      }
    })
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider style={{ position: 'fixed', top: '64px', height: 'calc(100vh - 64px)', overflowY: 'auto' }} width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ flex: 1 }}>
        <Content style={{ padding: '64px 50px' }}>
            {posts.map((post) => (
              <Card sx={{ maxWidth: 345, mb: 2 }} key={post.id}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                      {post.user?.username[0]}
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={post.user?.username}
                  subheader={post.createdAt}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {post.content}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="comment">
                    <CommentIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Content>
        <Box textAlign="center" m={2}>
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            投稿
          </Button>
        </Box>
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              投稿
            </Typography>
            <TextField
              autoFocus
              margin='dense'
              id="message"
              label="メッセージ"
              type='text'
              fullWidth
              variant="standard"
            />
            <Box textAlign="right" mt={2}>
              <Button variant="contained" color="primary" onClick={() => handleSendMessage('message')}>
                送信
              </Button>
            </Box>
          </Box>
        </Modal>
      </Layout>
    </Layout>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const siderStyle: React.CSSProperties = {
  position: 'fixed',
  top: '64px',
  height: 'calc(100vh - 64px)',
  overflowY: 'auto'
};

export default Sidebar;