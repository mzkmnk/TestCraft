import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
} from 'mdb-react-ui-kit';

import UserHeader from "./UserHeader";
import { useAPI } from "./hooks/useAPI";


export default function ChangeProfilePage() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [userSchool, setUserSchool] = React.useState('');
    const [followCount, setFollowCount] = React.useState(0);
    const [followerCount, setFollowerCount] = React.useState(0);

    const navigate = useNavigate();

    const getInfoAPI = useAPI(
        {
            APIName:'get_user_info_change',
            isLoginRequired: true,
            loadOnStart: true,
        }
    );
    const saveInfoAPI = useAPI(
        {
            APIName:'user_change',
            isLoginRequired: true,
        }
    );
    useEffect(() => {
        if(getInfoAPI.isSuccess){
            setUsername(getInfoAPI.data.username);
            setFollowCount(getInfoAPI.data.followCount);
            setFollowerCount(getInfoAPI.data.followerCount);
            if(getInfoAPI.data.school === null || getInfoAPI.data.school === ''){setUserSchool('まだ情報がありません。')}
            else{setUserSchool(getInfoAPI.data.school)}
        }else{
            console.error("ユーザ情報の取得に失敗しました。");
        }
    },[getInfoAPI.isSuccess]);

    const handleSaveUserInfo = () => {
        saveInfoAPI.sendAPI(
            {
                body:JSON.stringify(
                    {
                        password: password,
                        school: userSchool,
                    }
                )
            }
        )
    };

    useEffect(() => {
        if(saveInfoAPI.isSuccess){
            const data = saveInfoAPI.data;
            if(data.success){
                navigate('/mypage',
                {
                    state:
                    {
                        message: "ユーザ情報を変更しました。",
                        severity: "success",
                    }
                });
            }else{
                console.error(data.error);
            }
        }
        else{
            console.log("保存されてないか、まだapiが使用されていません。");
        }
    },[saveInfoAPI.isSuccess,navigate]);

    const saveUserInfo = (event) => {
        event.preventDefault();
        handleSaveUserInfo();
    };

    const followFollowerStyle = {
        display: "flex",
        justifyContent: "space-around",
        padding: "0 20px",
        width: "100%",
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
                                <MDBCardText>Password</MDBCardText>
                            </MDBCol>
                            <MDBCol sm="9">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="パスワード変更する場合はこちら"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </MDBCol>
                        </MDBRow>
                        <hr />
                        <MDBRow>
                            <MDBCol sm="3">
                                <MDBCardText>School</MDBCardText>
                            </MDBCol>
                            <MDBCol sm="9">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="school"
                                    placeholder={userSchool}
                                    value={userSchool === 'まだ情報がありません。' ?  '' : userSchool}
                                    onChange={(e) => setUserSchool(e.target.value)}
                                />
                            </MDBCol>
                        </MDBRow>
                    </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol lg="12" className='d-flex justify-content-center'>
                    <MDBBtn
                        outline
                        size="sm"
                        style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.875rem',
                            width:'100px',
                        }}
                        className="ms-1"
                        onClick={handleSaveUserInfo}
                    >
                        Save
                    </MDBBtn>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
        </section>
    </>
  );
}