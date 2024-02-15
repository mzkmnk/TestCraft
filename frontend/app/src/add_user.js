import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactFileReader from "react-file-reader";
import * as ExcelJS from "exceljs";
import UserHeader from "./UserHeader";

import Button from "@mui/material/Button";
import { useAPI } from "./hooks/useAPI";

function AddUser() {
  const navigate = useNavigate();
  const [csvData, setFileData] = useState(null);
  const [upload_fin, setUploadFin] = useState(null);
  const [upload_data, setUploadData] = useState(null);

  const checkAuthAPI = useAPI({
    APIName: "check_auth",
    loadOnStart: true,
  });
  const addUserAPI = useAPI({
    APIName: "add_user",
  });

  useEffect(() => {
    if (checkAuthAPI.isSuccess === false) {
      navigate("/error");
    }
  }, [checkAuthAPI.isSuccess, navigate]);

  useEffect(() => {
    if (addUserAPI.isSuccess === false) {
      setUploadFin("データの登録に失敗しました。");
    } else if (
      addUserAPI.isSuccess === true &&
      addUserAPI.data.success === true
    ) {
      const data = addUserAPI.data;
      const csvData = JSON.stringify(data.csv_data).replace(/^"|"$/g, '');
      const unescapedCsvData = csvData.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");
      const csvRows = unescapedCsvData.split("\n");

      setFileData(unescapedCsvData);
      setUploadFin("データの登録が完了しました。");
      setUploadData(csvRows);
    }
  }, [addUserAPI.data, addUserAPI.isSuccess, navigate]);

  //返ってきたcsvのデータをExcelファイルに変換し、ダウンロードさせる処理
  const handleFileDownload = () => {
    if (csvData) {
      // ExcelJSを使用してExcelファイルを作成
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet 1");
      const csvRows = csvData.split("\n");
      csvRows.forEach((row) => {
        const columns = row.split(",");
        worksheet.addRow(columns);
      });

      // ExcelファイルをBlobとして生成
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);

        // ファイルをダウンロード
        const a = document.createElement("a");
        a.href = url;
        a.download = "company_user.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    } else {
      setUploadFin("ファイルがアップロードされていません。");
    }
  };

  const uploadFile = (files) => {
    var read = new FileReader();
    read.onload = async function (e) {
      console.log(e.target.result);
      addUserAPI.sendAPI({
        body: JSON.stringify({
          csv_data: e.target.result,
        }),
      });
    };
    read.readAsText(files[0]);
  };

  return (
    <>
      <UserHeader />
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>File Upload Page</h1>
        <ReactFileReader handleFiles={uploadFile} fileTypes={".csv"}>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2, width: "200px" }}
          >
            データベースに登録
          </Button>
        </ReactFileReader>
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2, width: "200px" }}
          onClick={handleFileDownload}
        >
          ファイルのダウンロード
        </Button>
        {upload_fin && (
          <div
            style={{
              fontFamily: "Verdana",
              fontSize: "16px",
            }}
          >
            <pre>
              {JSON.stringify(upload_fin, null, 2).replace(
                /(^"|"$|\[|\])/g,
                ""
              )}
            </pre>
          </div>
        )}
        {upload_data && (
          <table style={tableStyle}>
            <tbody>
              {upload_data.map((row, index) => (
                <tr key={index}>
                  {row.split(",").map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

const tableStyle = {
  margin: "auto",
  fontFamily: "Verdana",
  fontSize: "16px"
};

export default AddUser;
