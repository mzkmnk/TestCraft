import React from 'react';
import { useEffect,useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';

import {
    Card,
    CardContent,
    Typography,
    Avatar,
    IconButton,
    Stack,
    List,
    ListItem,
    Divider,
    useTheme,
    TextField,
    Button,
    useMediaQuery,
    Snackbar,
    Alert,
    CardActions,
    Box,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person'; 

import UserHeader from './UserHeader';
import { useAPI } from './hooks/useAPI';
import LoadingScreen from './LoadingScreen.tsx';

function PostDetail() {
    const [postData,setPostData] = useState(null);
    const [comments,setComments] = useState([]);
    const [likes,setLikes] = useState([]);
    const [likesCount,setLikesCount] = useState([]);
    const [newComment,setNewComment] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isPostLike, setIsPostLike] = useState(false);
    const [snackbarContent, setSnackbarContent] = useState('');
    const [loading,setLoading] = useState(true);

    const { postId } = useParams();
    const navigate = useNavigate();

    const theme = useTheme(
    );
    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));


    const getPostDetailAPI = useAPI({
        APIName: 'get_post_detail',
        params: postId,
        isLoginRequired: true,
        loadOnStart: true,
    });

    const postLikeAPI = useAPI({
        APIName: 'post_like',
    });

    const postCommentAPI = useAPI({
        APIName: 'post_comment',
    });

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    const handlePostComment = async (comment) => {
        postCommentAPI.sendAPI({
            body:JSON.stringify({
                postId:postId,
                content:comment,
            })
        });
        setSnackbarContent('コメントを投稿しました');
        handleOpenSnackbar();
    };

    const handlePostLikeClick = (postId) => {
        if(isPostLike){
            setLikesCount(likesCount-1);
            setSnackbarContent('いいねを取り消しました');
        }else{
            setLikesCount(likesCount+1);
            setSnackbarContent('いいねしました');
        }
        postLikeAPI.sendAPI({
            body:JSON.stringify({
                postId:postId,
            })
        });
        handleOpenSnackbar();
        setIsPostLike(!isPostLike);
    };

    const handleOpenSnackbar = () => {setOpenSnackbar(true);};

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnackbar(false);
    };

    useEffect(() => {
        if(postLikeAPI.isSuccess){
            if(!postLikeAPI.data.success){
                console.error(postLikeAPI.data.error);
            }
        }else{
            console.log("postLikeAPI.error");
        }
    },[postLikeAPI.isSuccess,postLikeAPI.data]);

    useEffect(() => {
        if(postCommentAPI.isSuccess){
            const data = postCommentAPI.data;
            if(data.success){
                setComments([data.comment,...comments]);
            }else{
                console.log(data.error);
            }
        }else{
            console.log("postCommentAPI.error");
        }
        setNewComment('');
    },[postCommentAPI.isSuccess,postCommentAPI.data]);

    useEffect(() => {
        setLoading(true);
        if(getPostDetailAPI.isSuccess){
            const data = getPostDetailAPI.data;
            if(data.success){
                setPostData(data.data.post);
                setComments(data.data.comments);
                setLikes(data.data.likes);
                setLikesCount(data.data.likes.length);
                setIsPostLike(data.data.is_request_user_like);
            }else{
                console.log(data.error);
            }
        }
        setLoading(false);
    },[getPostDetailAPI.isSuccess,getPostDetailAPI.data]);

    if(loading){return <LoadingScreen />;};
    return (
        <>
            <UserHeader />
            <Card
                sx={{ maxWidth: '60%', margin: 'auto', mt: 4, mb: 4, boxShadow: theme.shadows[3], borderRadius: theme.shape.borderRadius }}
            >
                <CardContent>
                    <Typography variant='h5' component='div' gutterBottom>
                        {postData?.content}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center" mt={1} mb={2}>
                        <Avatar>
                            <PersonIcon />
                        </Avatar>
                        <Typography color="text.secondary" variant="body2">
                            {postData?.user.username} · {formatDate(postData?.createdAt)}
                        </Typography>
                    </Stack>
                    <Divider variant="fullWidth" sx={{ mb: 2 }} />
                    <CardActions sx={cardActionsStyle}>
                    <Box display="flex" alignItems="center">
                        <IconButton
                            aria-label="postlike"
                            sx={{
                            '&:hover': { color: '#1876D1' }
                            }}
                            onClick={() => {handlePostLikeClick(postData?.id)}}
                        >
                            {isPostLike ? <FavoriteIcon sx={{color : "#1876D1"}} /> : <FavoriteBorderIcon />}
                        </IconButton>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: '8px' }}>
                            {likesCount}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <IconButton
                            aria-label="comment"
                            sx={{ '&:hover': { color: 'primary.main' } }}
                        >
                            <CommentIcon />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: '8px' }}>
                            {comments.length}
                        </Typography>
                    </Box>
                    </CardActions>
                </CardContent>
            </Card>
            <List sx={{ maxWidth: '60%', margin: 'auto' }}>
                <ListItem>
                    <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="コメントを入力..."
                            multiline
                            rows={4}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            onClick={() => handlePostComment(newComment)}
                        >
                            コメントを投稿する
                        </Button>
                    </Stack>
                </ListItem>
            </List>
            <List sx={{ maxWidth: '60%', margin: 'auto' }}>
                {comments.map((comment, index) => (
                    <React.Fragment key={index}>
                        <ListItem
                            alignItems='flex-start'
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}
                        >
                            <CardContent>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar>
                                        <PersonIcon />
                                    </Avatar>
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                    >
                                        {comment.user.username} · {formatDate(comment.createdAt)}
                                    </Typography>
                                </Stack>
                                <Typography variant='body1' sx={{ mt: 1 }}>
                                    {comment.content}
                                </Typography>
                            </CardContent>
                        </ListItem>
                        <Divider
                            variant="fullWidth"
                            sx={{
                                mb: 2,
                                bgcolor: theme.palette.main,
                            }} 
                        />
                    </React.Fragment>
                ))}
            </List>
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
}

const cardActionsStyle = {
    justifyContent: "space-between",
    padding: "0 16px 16px",
  };

export default PostDetail;