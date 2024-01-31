import React, {  useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from "@mui/material/Button";

function EmailVerification() {
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState(null);

    const push_button = async () => {
        const certification = "true";
        try {
            const push_button_response = await fetch('http://localhost:8000/api/email_verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "certification": certification,
                }),
                credentials: 'include',
            });

            // レスポンスからデータを取得
            const responseData = await push_button_response.json();

            // 取得したデータに基づいて条件分岐
            if (responseData.success) {
                if (responseData.status === "1") {
                    setVerificationStatus("認証が成功しました");
                    navigate('/mypage')
                } else if (responseData.status === "2") {
                    setVerificationStatus("既に認証済みです");
                    navigate('/mypage')
                } else {
                    // 
                    setVerificationStatus("ユーザーが存在しません");
                    navigate('/login')

                }
            } else {
                // エラーが発生した場合の処理
                console.error('Error during email verification:', responseData.message);
            }
        } catch (error) {
            console.error('Error during signup:', error);
        };
    };

    return (
        <div style={{ textAlign: 'left', paddingLeft: '10px' }}>
        <h1>メールアドレス認証画面</h1>
        <h3>
            下記のボタンを押し、新規登録を完了してください。<br />
            登録完了またはすでに登録済みの場合はマイページに、ユーザ情報を送信していない場合はログイン画面に画面遷移します。
        </h3>
            <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 ,width:'300px'}}
            onClick={push_button}>
                メールアドレス認証を完了する
            </Button>
            
            {verificationStatus && <p>{verificationStatus}</p>}
        </div>
    );
}

export default EmailVerification;