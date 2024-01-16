import React, { useEffect, useState } from "react";
import * as ExcelJS from 'exceljs';
import UserHeader from './UserHeader'; 

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

function AddUser() {
    const [csrftoken, setCsrfToken] = useState(null);
    const [csvData, setFileData] = useState(null); // fileUrl を格納するステートを追加
    const [upload_fin, setUploadFin] = useState(null);


    useEffect(() => {
        const token = getCookie("csrftoken");
        setCsrfToken(token);
    }, []);


    //取得したデータをサーバへ送る処理
    const submitForm = async (cvs_data) => {
        const formData = new FormData();
        formData.append('cvs_data', cvs_data);
        try {
            const response = await fetch('http://localhost:8000/api/add_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cvs_data }),
                // mode: 'cors'
            });
    
            if (!response.ok) {
                const data = await response.json();
                console.error('サーバーエラー:', response.status, response.statusText, data);
                
                setUploadFin('入力エラーが発生しました。正しい情報を入力してください。');
                return;
            }
    
            console.log('サーバーレスポンス:', response.status, response.statusText);
            const responseData = await response.json();
            console.log('ファイルが正常に処理されました', responseData);
            
             // ここで fileUrl をセットしていることを確認
            const csvData = responseData["csv_data"];
            setFileData(csvData);
            if(csvData){
                setUploadFin('データの登録が完了しました！ファイルをダウンロードする場合はダウンロードボタンを押してください。');
            }
    
        } catch (error) {
            setUploadFin('登録に失敗しました。');
            console.error('ファイルの処理中にエラーが発生しました', error);
        }
    };

    const handleFileUpload = () => {//データを取得し型を整える処理
        const inputElement = document.getElementById("fileInput");
        if (inputElement) {
            const file = inputElement.files[0];
            if (file) {
                // FileReaderを使用してCSVファイルを読み込む
                const reader = new FileReader();
    
                reader.onload = (event) => {
                    const csvData = event.target.result;
                    // CSVデータを文字列に変換し、サーバに送信
                    submitForm(csvData);
                };
    
                reader.readAsText(file);
            } else {
                console.error('入力されていません');
                setUploadFin('入力されていません');

            }
        }
        //ステートから fileUrl を利用
    };
    //返ってきたcsvのデータをExcelファイルに変換し、ダウンロードさせる処理
    const handleFileDownload = () => {
        if (csvData) {
            // ExcelJSを使用してExcelファイルを作成
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sheet 1');

            // CSVデータをExcelファイルに書き込む
            const csvFile = csvData; // ここを実際のCSVデータに置き換える
            const csvRows = csvFile.split('\n');
            csvRows.forEach((row) => {
                const columns = row.split(',');
                worksheet.addRow(columns);
            });

            // ExcelファイルをBlobとして生成
            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);

                // ファイルをダウンロード
                const a = document.createElement('a');
                a.href = url;
                a.download = 'company_user.xlsx';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                // 画面遷移
                //navigate('/file_upload_finish');
            });
        }else{
            setUploadFin('ファイルがアップロードされていません');
        }
    };

    return (
        <>
        <UserHeader />
            <div>
                <h1>File Upload Page</h1>
                <input type="file" id="fileInput" />
                <button onClick={handleFileUpload}>データベースに登録</button>
                <button onClick={handleFileDownload}>ファイルをダウンロード</button>
                {upload_fin && (
                <div>
                    <pre>{JSON.stringify(upload_fin, null, 2)}</pre>
                </div>
            )}
            </div>
        </>
    );
}

export default AddUser;