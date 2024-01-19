import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import ReactFileReader from "react-file-reader";
import * as ExcelJS from 'exceljs';
import UserHeader from './UserHeader'; 

import Button from "@mui/material/Button";

function AddUser() {
    const navigate = useNavigate();
    const [csvData, setFileData] = useState(null);
    const [upload_fin, setUploadFin] = useState(null);
    const [upload_data, setUploadData] = useState(null);
    useEffect(() => {
        fetch('http://localhost:8000/api/check_auth', {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            }
        )
        .then(response => response.json())
        .then(data => {
            if (data.authenticated === false) {
                navigate('/login');
                }
            }
        )
        .catch(error => {
            console.error('Error:', error);
        });
    }, [navigate]);
     //返ってきたcsvのデータをExcelファイルに変換し、ダウンロードさせる処理
    const handleFileDownload = () => {
        if (csvData) {
            // ExcelJSを使用してExcelファイルを作成
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sheet 1');

            // CSVデータをExcelファイルに書き込む
            console.log(typeof csvData)
                // const csvFile = csvData.replace(/^"(.*)"$/, '$1');;
                // const csvRows = csvFile.split('\\r\\n');
            const csvFile = csvData.replace(/^"(.*)"$/, '$1');;
            const csvRows = csvFile.split('\\r\\n');
            console.log(csvRows)
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

            });
        }else{
            setUploadFin('ファイルがアップロードされていません。');
        }
    };

    const uploadFile = (files) => {
        var read = new FileReader();
        const file = files[0]; 
        const formData = new FormData();
        // formData.append('file',file);
        read.onload =  async function(e) {
            // formData.append('file',read.result);
            console.log(e.target.result);
            const response= await fetch('http://localhost:8000/api/add_user',{
                method: "POST",
                headers:{
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'multipart/form-data',
                },
                credentials: 'include',
                body: JSON.stringify(
                    {
                        csv_data:e.target.result,
                    }
                )
                
            });
            const data = await response.json()
            const csvData = JSON.stringify(data.csv_data)
            const csvFile = csvData.replace(/^"(.*)"$/, '$1',);;
            const csvRows = csvFile.split('\\r\\n');

            if (data.success) {
                console.log("success")

                console.log(csvData);
                setFileData(csvData);
                setUploadFin("データの登録が完了しました。"); 
                setUploadData(csvRows)
            } else {
                console.log("Error:", data.error);
                setUploadFin("データの登録に失敗しました。");
            }
            // .then(response => response.json())
            // .then(data => {
            //     if(data.success){
                    
            //         console.log(data);

            //     }
            //     else{
            //         console.log("error",read.result);
            //     }
            // })
        };
        read.readAsText(files[0]);
    };

    return (
        <>
        <UserHeader />
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>File Upload Page</h1>
                {/* <input type="file" id="fileInput" /> */}
                <ReactFileReader handleFiles = {uploadFile} fileTypes={".csv"}>
                <Button
                type="submit"
                
                variant="contained"
                sx={{ mt: 3, mb: 2 ,width:'200px'}}
                >
                データベースに登録
                </Button>
                    {/* <button onClick={handleFileUpload}>データベースに登録</button> */}
                </ReactFileReader>
                <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 ,width:'200px'}}
                onClick={handleFileDownload}
                >
                ファイルのダウンロード
                </Button>
                {upload_fin && (
                <div 
                    style={{ 
                    fontFamily: 'Verdana', 
                    fontSize: '16px' 
                    }}
                >
                    <pre>{JSON.stringify(upload_fin, null, 2).replace(/(^"|"$|\[|\])/g, '')}</pre>
                </div>
                )}
                {upload_data && (
                <div style={{ fontFamily: 'Verdana', fontSize: '16px' }}>
                    <pre>{JSON.stringify(upload_data, null, 2).replace(/(^"|"$|\[|\])/g, '')}</pre>
                </div>
                )}
            </div>
        </>
    );
}

export default AddUser;