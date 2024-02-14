import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import UserHeader from "./UserHeader";
import { useAPI } from "./hooks/useAPI";

export default function ChangeProfilePage() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [userSchool, setUserSchool] = React.useState('');
    const [followCount, setFollowCount] = React.useState(0);
    const [followerCount, setFollowerCount] = React.useState(0);

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
                                    <img
                                        src="#" // 画像のパスを指定
                                        alt="avatar"
                                        className="rounded-circle"
                                        style={{ width: '150px' }}
                                    />
                                    <p className="text-muted mb-1">今後対応予定です。</p>
                                    <p className="text-muted mb-4">今後対応予定です。</p>
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
