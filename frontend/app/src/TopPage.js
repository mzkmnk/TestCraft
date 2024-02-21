import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import UserHeader from "./UserHeader";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import createImage from "./img/createImage.webp";
import answerImage from "./img/answerImage.webp";
import SNSImage from "./img/SNSImage.webp";
import "./topPage.css";

function TopPage() {
  const [firstImage, setFirstImage] = useState("createImage");
  const [secondImage, setSecondImage] = useState("answerImage");
  const [thirdImage, setThirdImage] = useState("SNSImage");
  const imageSeq = [firstImage, secondImage, thirdImage];

  const handleClick = (image) => {
    if (image === firstImage) {
      return;
    } else if (image === secondImage) {
      setFirstImage(secondImage);
      setSecondImage(thirdImage);
      setThirdImage(firstImage);
    } else if (image === thirdImage) {
      setFirstImage(thirdImage);
      setSecondImage(firstImage);
      setThirdImage(secondImage);
    }
  };
  return (
    <>
      <UserHeader />
      <Box className="container">
        <Box className="explanation">
          <Typography variant="h3">
            Test Craftsで
            <br />
            快適なテスト作成・解答
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => window.open("/signup", "_blank", "noreferrer")}
            sx={{ marginTop: 2, maxWidth: "30rem" }}
          >
            はじめる
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => window.open("/login", "_blank", "noreferrer")}
            sx={{ marginTop: 2, maxWidth: "30rem" }}
          >
            ログイン
          </Button>
        </Box>

        <Box className="image-container">
          {/* 画像サイズを取得するための隠し画像 他にいい方法があるかも? */}
          <Box
            component="img"
            className={`image`}
            style={{ visibility: "hidden", position: "relative" }}
            src={createImage}
            alt="createImage"
            onClick={() => handleClick("createImage")}
          />
          <Box
            component="img"
            className={`image image${imageSeq.findIndex(
              (image) => image === "createImage"
            )}`}
            src={createImage}
            alt="createImage"
            onClick={() => handleClick("createImage")}
          />
          <Box
            component="img"
            className={`image image${imageSeq.findIndex(
              (image) => image === "answerImage"
            )}`}
            src={answerImage}
            alt="answerImage"
            onClick={() => handleClick("answerImage")}
          />
          <Box
            component="img"
            className={`image image${imageSeq.findIndex(
              (image) => image === "SNSImage"
            )}`}
            src={SNSImage}
            alt="SNSImage"
            onClick={() => handleClick("SNSImage")}
          />
        </Box>
      </Box>
    </>
  );
}

export default TopPage;
