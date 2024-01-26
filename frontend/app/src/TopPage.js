import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import UserHeader from "./UserHeader";


/* UIライブラリ
https://mui.com/material-ui/getting-started/installation/ 
*/

function TopPage() {
  return (
    <>
      <UserHeader />
      <Container component="main" maxWidth="md" sx={{ p: 4 }}>
        <Toolbar />
        <Typography variant="h2">学習用テキスト作成webアプリへようこそ!</Typography>
        <Typography>
          <br />
          雨ニモマケズ
          <br />
          風ニモマケズ
          <br />
          雪ニモ夏ノ暑サニモマケヌ
          <br />
          丈夫ナカラダヲモチ
          <br />
          慾ハナク
          <br />
          決シテ瞋ラズ
          <br />
          イツモシヅカニワラッテヰル
          <br />
          一日ニ玄米四合ト
          <br />
          味噌ト少シノ野菜ヲタベ
          <br />
          アラユルコトヲ
          <br />
          ジブンヲカンジョウニ入レズニ
          <br />
          ヨクミキキシワカリ
          <br />
          ソシテワスレズ
          <br />
          野原ノ松ノ林ノ䕃ノ
          <br />
          小サナ萓ブキノ小屋ニヰテ
          <br />
          東ニ病気ノコドモアレバ
          <br />
          行ッテ看病シテヤリ
          <br />
          西ニツカレタ母アレバ
          <br />
          行ッテソノ稲ノ朿ヲ負ヒ
          <br />
          南ニ死ニサウナ人アレバ
          <br />
          行ッテコハガラナクテモイヽトイヒ
          <br />
          北ニケンクヮヤソショウガアレバ
          <br />
          ツマラナイカラヤメロトイヒ
          <br />
          ヒドリノトキハナミダヲナガシ
          <br />
          サムサノナツハオロオロアルキ
          <br />
          ミンナニデクノボートヨバレ
          <br />
          ホメラレモセズ
          <br />
          クニモサレズ
          <br />
          サウイフモノニ
          <br />
          ワタシハナリタイ
          <br />
          <br />
          南無無辺行菩薩
          <br />
          南無上行菩薩
          <br />
          南無多宝如来
          <br />
          南無妙法蓮華経
          <br />
          南無釈迦牟尼仏
          <br />
          南無浄行菩薩
          <br />
          南無安立行菩薩
          <br />
        </Typography>
      </Container>
    </>
  );
}

export default TopPage;
