import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import ReactFileReader from "react-file-reader";
import * as ExcelJS from 'exceljs';
import UserHeader from './UserHeader'; 

function AddUser() {
    const navigate = useNavigate();
    const [CsvData, setFileData] = useState(null);
    const [upload_fin, setUploadFin] = useState(null);

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
        if (CsvData) {
            // ExcelJSを使用してExcelファイルを作成
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sheet 1');

            // CSVデータをExcelファイルに書き込む
            //const csvFile = data ? data.csv_data : undefined;
            console.log(typeof CsvData)
            if(typeof CsvData=='string'){
                const csvFile = CsvData.replace(/^"(.*)"$/, '$1');;
                const csvRows = csvFile.split('\\r\\n');
                console.log(csvRows)
                csvRows.forEach((row) => {
                    const columns = row.split(',');
                    worksheet.addRow(columns);
                });
            }
            

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
            const CsvData = JSON.stringify(data.csv_data)
            if (data.success) {
                console.log("success")

                console.log(CsvData);
                setFileData(CsvData);
                setUploadFin(e.target.result);  // 何かしらのstateにデータをセットするなど適切な処理を行う
            } else {
                console.log("error")
                console.log("Error:", data.error);
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
            <div>
                <h1>File Upload Page</h1>
                {/* <input type="file" id="fileInput" /> */}
                <ReactFileReader handleFiles = {uploadFile} fileTypes={".csv"}>
                    <button>データベースに登録</button>
                    {/* <button onClick={handleFileUpload}>データベースに登録</button> */}
                </ReactFileReader>
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