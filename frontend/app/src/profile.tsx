import React, { useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
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


export default function ProfilePage() {
    const [username, setUsername] = React.useState('');
    const [userSchool, setUserSchool] = React.useState('');
    const [isFollow , setIsFollow] = React.useState(false);
    const { userId } = useParams();

    const getProfileAPI = useAPI(
        {
            APIName:'profile',
            params: userId,
            isLoginRequired: true,
            loadOnStart: true,
        }
    );

    const followAPI = useAPI(
        {
            APIName:'follow',
            isLoginRequired: true,
        }
    );

    useEffect(() => {
        if(getProfileAPI.isSuccess){
            const data = getProfileAPI.data;
            if(data.success){
                console.log(data);
                setUsername(data.username);
                setIsFollow(data.isFollow);
                if(data.school === null){
                    setUserSchool("未設定");
                }
                else{
                    setUserSchool(data.school);
                    followAPI.sendAPI({
                        body: JSON.stringify(
                            {
                                follow:isFollow,
                                userId: userId,
                            }
                        )
                    });
                }
            }else{
                console.log("api error")
            }
        }else{
            console.log("useAPI error");
        }
    },[getProfileAPI.isSuccess, getProfileAPI.data,userId]);

    useEffect(() => {
        if(followAPI.isSuccess && followAPI.data.success){
            console.log(followAPI.data);
            setIsFollow(!isFollow);
        }else{
            console.log(followAPI.error);
        }
    },[followAPI.isSuccess, followAPI.data, followAPI.error]);

    const handleFollow = async () => {
        followAPI.sendAPI({
            body: JSON.stringify(
                {
                    follow:isFollow,
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
        <section style={{ backgroundColor: '#eee' }}>
        <UserHeader />
        <MDBContainer className="py-5">
            <MDBRow>
                <MDBCol lg="4">
                    <MDBCard className="mb-4">
                        <MDBCardBody className="text-center">
                            <MDBCardImage
                            // src="~/Users/mizuki/programming/TestCraft/frontend/app/src/icon/test.png"
                            // srcなぜかうまくいかないのでパス
                            alt="avatar"
                            className="rounded-circle"
                            style={{ width: '150px' }}
                            fluid />
                            <p className="text-muted mb-1">今後対応予定です。</p>
                            <p className="text-muted mb-4">今後対応予定です。</p>
                            <div className="d-flex justify-content-center mb-2">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={follow}
                                >
                                    {isFollow ? "フォロー解除":"フォローする"}
                                </Button>
                            </div>
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
    </>
  );
}