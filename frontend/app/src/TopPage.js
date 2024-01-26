import React from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import UserHeader from "./UserHeader";

function TopPage() {
  return (
    <>
      <UserHeader />
      <Container component="main" maxWidth="md" sx={{ p: 4 }}>
        <Toolbar />
        <Typography variant="h2" gutterBottom>
          TestCraftへようこそ!
        </Typography>
        <Typography paragraph>
          このアプリは、あなたの学習を効果的にサポートするために設計されています。文字入力から始まるあなたの学習旅行で、私たちは最高のパートナーになりたいと思っています。以下の機能を通じて、あなたの学習体験を豊かにすることを目指しています。
        </Typography>
        <Typography variant="h5" gutterBottom>
          特徴
        </Typography>
        <Typography paragraph>
          カスタマイズ可能なテキスト作成: あなたのニーズに合わせてテキストをカスタマイズ。
        </Typography>
        <Typography paragraph>
          リアルタイムのフィードバック: 文章の構成や文法について、リアルタイムでフィードバック。
        </Typography>
        <Typography paragraph>
          ユーザーフレンドリーなインターフェース: 直感的で使いやすいデザイン。
        </Typography>
        <Typography paragraph>
          このアプリを通じて、あなたの学習がより楽しく、より有意義なものになることを願っています。さあ、今すぐ始めましょう！
        </Typography>
      </Container>
    </>
  );
}

export default TopPage;
