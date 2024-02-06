import React, { useEffect } from 'react';
import { useParams,useLocation } from 'react-router-dom';
import { FaHeart } from "react-icons/fa";
import Button from '@mui/material/Button';
import Pagination from "@mui/material/Pagination";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
} from 'mdb-react-ui-kit';

import UserHeader from "./UserHeader";
import { useAPI } from "./hooks/useAPI";
import CustomTabs from "./components/CustomTabs";


export default function ProfilePage() {
    const [username, setUsername] = React.useState('');
    const [userSchool, setUserSchool] = React.useState('');
    const [isFollow , setIsFollow] = React.useState(Boolean);
    const [solvedWorkbook, setSolvedWorkbook] = React.useState([]);
    const [createdWorkbook, setCreatedWorkbook] = React.useState([]);
    const [followCount, setFollowCount] = React.useState(0);
    const [followerCount, setFollowerCount] = React.useState(0);
    const { userId } = useParams();
    const location = useLocation();

    const tabsData = [
        {label:'投稿',content:'今後対応予定です'},
        {label:'作成履歴',content: <Wookbooks workbooks={createdWorkbook} />},
        {label:'解答履歴',content: <Wookbooks workbooks={solvedWorkbook} />},
    ];

    const getProfileAPI = useAPI(
        {
            APIName:'profile',
            params: userId,
            isLoginRequired: true,
            loadOnStart: true,
        }
    );

    const handleQuestionClick = (workbookId) => {
        window.open(`/solve/${workbookId}`,"_blank",'noopener,noreferrer');
        // navigate(`/solve/${workbookId}`);
    }

    const followAPI = useAPI(
        {
            APIName:'follow',
            isLoginRequired: true,
        }
    );

    useEffect(() => {
        if(getProfileAPI.isSuccess){
            const data = getProfileAPI.data;
            console.log(data);
            if(data.success){
                setUsername(data.username);
                setIsFollow(data.isFollow);
                setSolvedWorkbook(data.solved_workbook);
                setCreatedWorkbook(data.created_workbook);
                setFollowCount(data.followCount);
                setFollowerCount(data.followerCount);
                if(data.school === null){
                    setUserSchool("未設定");
                }
                else{
                    setUserSchool(data.school);
                }
            }else{
                console.error(data.error);
            }
        }else{
            console.error("useAPI error");
        }
    },[getProfileAPI.isSuccess]);

    const styles = {
        questionsContainer: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridGap: "20px",
            maxHeight: "calc(100vh - 70px)",
            overflowY: "auto",
            padding: "20px",
        },
        question: {
            flex: "1 0 calc(50% - 20px)",
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
            cursor: "pointer",
            color: "#333",
            backgroundColor: "#fff",
        },
        questionHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
        },
        createdBy: {
            fontSize: "0.8em",
            color: "#666",
            marginLeft: "10px",
        },
    };
    
    const likeStyle = {
        display: "flex",
        alignItems: "center",
        marginTop: "10px",
        color: "#1DA1F2",
        cursor: "pointer",
    };
    

    const likeIconStyle = {
        marginRight: "5px",
    };

    function Wookbooks({ workbooks }){
        const [currentPage, setCurrentPage] = React.useState(1);
        const questionsPerPage = 6;
        const indexOfLastQuestion = currentPage * questionsPerPage;
        const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
        const currentQuestions = workbooks.slice(
            indexOfFirstQuestion,
            indexOfLastQuestion
        );
        const handleChangePage = (event,value) => {
            setCurrentPage(value);
          };
        console.log(workbooks);
        return (
            <>
                <div style={styles.questionsContainer}>
                    {currentQuestions.map((workbook,index) => (
                        <div
                            style={styles.question}
                            key={index}
                            onClick={() => handleQuestionClick(workbook.id)}
                        >
                            <div style={styles.questionHeader}>
                                <h3>{ workbook.workbook_name }</h3>
                                <span style={styles.createdBy}>
                                    created by {workbook.create_id__username} ({workbook.created_at})
                                </span>
                            </div>
                            <p>{workbook.description}</p>
                            <div style={likeStyle}>
                                <FaHeart style={likeIconStyle} />
                                <span>{workbook.like_count}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <Pagination 
                    count={Math.ceil(workbooks.length / questionsPerPage)}
                    page={currentPage}
                    onChange={handleChangePage}
                />
            </>
        )
    };

    const buttonStyles = {
        backgroundColor: isFollow ? "#1565C0" : "#64B5F6",
        color: "#fff",
    }

    const followFollowerStyle = {
        display: "flex",
        justifyContent: "space-around",
        padding: "0 20px",
        width: "100%",
    };

    useEffect(() => {
        if(followAPI.isSuccess){
            if(followAPI.data.success){
                if(!isFollow){
                    setFollowerCount(followerCount+1);
                }else{
                    setFollowerCount(followerCount-1);
                }
                setIsFollow(!isFollow);
            }else{
                console.error(followAPI.data.error);
            }
        }
        // else{
        //     console.error("useAPI error");
        //     profile.tsx:69 useAPI error 
        //     at ProfilePage (http://localhost:3000/static/js/bundle.js:8508:80)
        //     at RenderedRoute (http://localhost:3000/static/js/bundle.js:174646:5)
        //     at Routes (http://localhost:3000/static/js/bundle.js:175337:5)
        //     at Router (http://localhost:3000/static/js/bundle.js:175271:15)
        //     at BrowserRouter (http://localhost:3000/static/js/bundle.js:173243:5)
        //     at App
        //     このようなエラーが出てるから後で確認
        // }
    },[followAPI.isSuccess,followAPI.data.isFollow]);

    const handleFollow = () => {
        followAPI.sendAPI({
            body: JSON.stringify(
                {
                    isFollow:isFollow,
                    userId: userId,
                }
            )
        });
    };

    const follow = (event) => {
        event.preventDefault();
        handleFollow();
    };


    return (
        <>
        <UserHeader />
        <section style={{ backgroundColor: '#eee' }}>
            <MDBContainer className="py-5">
                <MDBRow>
                    <MDBCol lg="4">
                        <MDBCard className="mb-4">
                            <MDBCardBody className="text-center">
                                <MDBCardImage
                                    alt="avatar"
                                    className="rounded-circle"
                                    style={{ width: '150px' }}
                                    fluid 
                                />
                                <p className="text-muted mb-1">今後対応予定です。</p>
                                <p className="text-muted mb-4">今後対応予定です。</p>
                                <div style={followFollowerStyle}>
                                    <div className="d-flex flex-column align-items-center">
                                        <p className="font-weight-bold mb-0">follow</p>
                                        <p className="font-weight-bold">{followCount}</p>
                                    </div>
                                    <div className="d-flex flex-column align-items-center">
                                        <p className="font-weight-bold mb-0">follower</p>
                                        <p className="font-weight-bold">{followerCount}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="contained"
                                    style={buttonStyles}
                                    onClick={follow}
                                >
                                    {isFollow ? "フォロー解除":"フォローする"}
                                </Button>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol lg="8">
                        <MDBCard className="mb-4">
                        <MDBCardBody>
                            <MDBRow>
                            <MDBCol sm="3">
                                <MDBCardText>Name</MDBCardText>
                            </MDBCol>
                            <MDBCol sm="9">
                                <MDBCardText className="text-muted">{ username }</MDBCardText>
                            </MDBCol>
                            </MDBRow>
                            <hr />
                            <MDBRow>
                                <MDBCol sm="3">
                                    <MDBCardText>School</MDBCardText>
                                </MDBCol>
                                <MDBCol sm="9">
                                    <MDBCardText className="text-muted">{ userSchool }</MDBCardText>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
        <div>
            <CustomTabs defaultValue={0} tabsData={tabsData} />
        </div>
    </>
  );
}