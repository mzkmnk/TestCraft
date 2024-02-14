import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import PersonIcon from '@mui/icons-material/Person'; 

import UserHeader from "./UserHeader";
import LoadingScreen from './LoadingScreen.tsx';
import { useAPI } from "./hooks/useAPI";

export default function ChangeProfilePage() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [userSchool, setUserSchool] = React.useState('');
    const [followCount, setFollowCount] = React.useState(0);
    const [followerCount, setFollowerCount] = React.useState(0);
    const [icon, setIcon] = React.useState();
    const [preview, setPreview] = React.useState();
    const [loading, setLoading] = React.useState(true);

    const init_icon = "https://user-profile-icon.s3.ap-northeast-1.amazonaws.com/media/icon/init_user.jpg";

    const navigate = useNavigate();

    const getInfoAPI = useAPI({
        APIName: 'get_user_info_change',
        isLoginRequired: true,
        loadOnStart: true,
    });
    const saveInfoAPI = useAPI({
        APIName: 'user_change',
        isLoginRequired: true,
    });

    useEffect(() => {
        if (getInfoAPI.isSuccess) {
            setUsername(getInfoAPI.data.username);
            setFollowCount(getInfoAPI.data.followCount);
            setFollowerCount(getInfoAPI.data.followerCount);
            if(getInfoAPI.data.icon === "https://user-profile-icon.s3.ap-northeast-1.amazonaws.com/media/") {
                setIcon(undefined);
                setPreview(undefined);
            }else{
                setIcon(getInfoAPI.data.icon);
            }
            if (getInfoAPI.data.school === null || getInfoAPI.data.school === '') {
                setUserSchool('まだ情報がありません。');
            } else {
                setUserSchool(getInfoAPI.data.school);
            }
        } else {
            console.error("ユーザ情報の取得に失敗しました。");
        }
    }, [getInfoAPI.isSuccess]);

    const handleSaveUserInfo = () => {
        saveInfoAPI.sendAPI({
            body: JSON.stringify({
                password: password,
                school: userSchool,
            }),
        });
    };

    useEffect(() => {
        if (saveInfoAPI.isSuccess) {
            const data = saveInfoAPI.data;
            if (data.success) {
                navigate('/mypage', {
                    state: {
                        message: "ユーザ情報を変更しました。",
                        severity: "success",
                    },
                });
            } else {
                console.error(data.error);
            }
        } else {
            console.log("保存されてないか、まだapiが使用されていません。");
        }
    }, [saveInfoAPI.isSuccess, navigate]);

    const changeIcon = useAPI({
        APIName: 'change_icon',
        isLoginRequired: true,
    });

    const handleIconChange = (event) => {
        const formData = new FormData();
        formData.append('icon', event.target.files[0]);
        changeIcon.sendAPI({
            body:formData
        });
    };

    useEffect(() => {
        if(changeIcon.isSuccess) {
            const data = changeIcon.data;
            if(data.success) {
                setIcon(data.icon);
            } else {
                console.error(data.error);
            }
        }
    },[changeIcon.isSuccess, changeIcon.data]);

    const saveUserInfo = (event) => {
        event.preventDefault();
        handleSaveUserInfo();
    };


    return (
        <>
            <section style={{ backgroundColor: '#eee' }}>
                <UserHeader />
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card mb-4">
                                <div className="card-body text-center">
                                    <input
                                        type="file"
                                        accept='image/*'
                                        style={{ display: 'none' }}
                                        id="icon-upload"
                                        onChange={handleIconChange}
                                    />
                                    <label
                                        htmlFor = "icon-upload"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src={preview || icon || init_icon}
                                            alt="avatar"
                                            className="rounded-circle"
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                                transition: 'opacity 0.3s',
                                            }}
                                            onMouseOver={(e) => e.target.style.opacity = 0.7}
                                            onMouseOut={(e) => e.target.style.opacity = 1}
                                        />
                                    </label>
                                    {/* <p className="text-muted mb-1">今後対応予定です。</p>
                                    <p className="text-muted mb-4">今後対応予定です。</p> */}
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                        padding: "0 20px",
                                        width: "100%",
                                    }}>
                                        <div className="d-flex flex-column align-items-center">
                                            <p className="font-weight-bold mb-0">follow</p>
                                            <p className="font-weight-bold">{followCount}</p>
                                        </div>
                                        <div className="d-flex flex-column align-items-center">
                                            <p className="font-weight-bold mb-0">follower</p>
                                            <p className="font-weight-bold">{followerCount}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Name</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted">{username}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p>Password</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                placeholder="パスワード変更する場合はこちら"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p>School</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="school"
                                                placeholder={userSchool}
                                                value={userSchool === 'まだ情報がありません。' ? '' : userSchool}
                                                onChange={(e) => setUserSchool(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 d-flex justify-content-center">
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                style={{
                                    padding: '0.25rem 0.5rem',
                                    fontSize: '0.875rem',
                                    width: '100px',
                                }}
                                onClick={handleSaveUserInfo}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}