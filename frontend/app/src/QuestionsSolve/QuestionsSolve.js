import { useState } from "react";
import SettingsModal from "./SettingsModal";
import useTimer from "./hooks/useTimer";
import InputAnswer from "./InputAnswer";
import Result from "./Result";
import Watch from "./Watch";
import Button from "@mui/material/Button";

// eslint-disable-next-line no-irregular-whitespace
const testJson = `{"1hjr8afu40.9jqf3o0t9io":{"questionType":"root","title":"新規ドキュメント","childIds":["1hjr8ahjp0.vdusbp5c3ng","1hjr8fo5q0.993gpbv22j"]},"1hjr8ahjp0.vdusbp5c3ng":{"questionType":"radio","parentId":"1hjr8afu40.9jqf3o0t9io","question":"以下の問題の穴埋めをしなさい。\n\nメロスは []した","options":[{"id":"1hjr8el2v0.jbgc0mmjbt","value":"憤怒"},{"id":"1hjr8epl80.ltvlj7e4r68","value":"激怒"},{"id":"1hjr8ett10.tcre7faio4o","value":"憤慨"},{"id":"1hjr8f3m40.j30ofe8g7s","value":"激昂"}],"canMultiple":false,"answers":[{"id":"1hjr8fb5m0.afk68g1ueco","value":"激怒"}]},"1hjr8fo5q0.993gpbv22j":{"questionType":"nested","parentId":"1hjr8afu40.9jqf3o0t9io","question":"以下の文章を読み、問題に答えなさい。\n\n　こんな夢を見た。\n　腕組をして枕元に坐すわっていると、仰向あおむきに寝た女が、静かな声でもう死にますと云う。女は長い髪を枕に敷いて、輪郭の柔らかな瓜実顔をその中に横たえている。真白な頬の底に温かい血の色がほどよく差して、唇の色は無論赤い。とうてい死にそうには見えない。しかし女は静かな声で、もう死にますと判然云った。自分も確かにこれは死ぬなと思った。そこで、そうかね、もう死ぬのかね、と上から覗き込むようにして聞いて見た。死にますとも、と云いながら、女はぱっちりと眼を開けた。大きな潤いのある眼で、長い睫に包まれた中は、ただ一面に真黒であった。その真黒な眸の奥に、自分の姿が鮮に浮かんでいる。\n　自分は透き徹るほど深く見えるこの黒眼の色沢を眺めて、これでも死ぬのかと思った。それで、ねんごろに枕の傍へ口を付けて、死ぬんじゃなかろうね、大丈夫だろうね、とまた聞き返した。すると女は黒い眼を眠そうにみはったまま、やっぱり静かな声で、でも、死ぬんですもの、仕方がないわと云った。\n　じゃ、私の顔が見えるかいと一心に聞くと、見えるかいって、そら、そこに、写ってるじゃありませんかと、にこりと笑って見せた。自分は黙って、顔を枕から離した。腕組をしながら、どうしても死ぬのかなと思った。\n　しばらくして、女がまたこう云った。\n「死んだら、埋めて下さい。大きな真珠貝で穴を掘って。そうして天から落ちて来る星の破片を墓標に置いて下さい。そうして墓の傍に待っていて下さい。また逢いに来ますから」\n　自分は、いつ逢いに来るかねと聞いた。\n「日が出るでしょう。それから日が沈むでしょう。それからまた出るでしょう、そうしてまた沈むでしょう。――赤い日が東から西へ、東から西へと落ちて行くうちに、――あなた、待っていられますか」\n　自分は黙って首肯いた。女は静かな調子を一段張り上げて、\n「百年待っていて下さい」と思い切った声で云った。\n「百年、私の墓の傍に坐って待っていて下さい。きっと逢いに来ますから」\n　自分はただ待っていると答えた。すると、黒い眸のなかに鮮に見えた自分の姿が、ぼうっと崩れて来た。静かな水が動いて写る影を乱したように、流れ出したと思ったら、女の眼がぱちりと閉じた。長い睫まつげの間から涙が頬へ垂れた。――もう死んでいた。\n　自分はそれから庭へ下りて、真珠貝で穴を掘った。真珠貝は大きな滑かな縁の鋭い貝であった。土をすくうたびに、貝の裏に月の光が差してきらきらした。湿った土の匂いもした。穴はしばらくして掘れた。女をその中に入れた。そうして柔らかい土を、上からそっと掛けた。掛けるたびに真珠貝の裏に月の光が差した。\n　それから星の破片の落ちたのを拾って来て、かろく土の上へ乗せた。星の破片は丸かった。長い間大空を落ちている間に、角が取れて滑かになったんだろうと思った。抱き上あげて土の上へ置くうちに、自分の胸と手が少し暖くなった。\n　自分は苔こけの上に坐った。これから百年の間こうして待っているんだなと考えながら、腕組をして、丸い墓石を眺めていた。そのうちに、女の云った通り日が東から出た。大きな赤い日であった。それがまた女の云った通り、やがて西へ落ちた。赤いまんまでのっと落ちて行った。一つと自分は勘定した。\n　しばらくするとまた唐紅の天道がのそりと上のぼって来た。そうして黙って沈んでしまった。二つとまた勘定した。\n　自分はこう云う風に一つ二つと勘定して行くうちに、赤い日をいくつ見たか分らない。勘定しても、勘定しても、しつくせないほど赤い日が頭の上を通り越して行った。それでも百年がまだ来ない。しまいには、苔こけの生はえた丸い石を眺めて、自分は女に欺されたのではなかろうかと思い出した。\n　すると石の下から斜に自分の方へ向いて青い茎が伸びて来た。見る間に長くなってちょうど自分の胸のあたりまで来て留まった。と思うと、すらりと揺ぐ茎くきの頂きに、心持首を傾けていた細長い一輪の蕾が、ふっくらと弁を開いた。真白な百合が鼻の先で骨に徹えるほど匂った。そこへ遥かの上から、ぽたりと露が落ちたので、花は自分の重みでふらふらと動いた。自分は首を前へ出して冷たい露の滴る、白い花弁に接吻した。自分が百合から顔を離す拍子に思わず、遠い空を見たら、暁の星がたった一つ瞬いていた。\n「百年はもう来ていたんだな」とこの時始めて気がついた。","childIds":["1hjr8gc1j0.9o3kn282i2"]},"1hjr8gc1j0.9o3kn282i2":{"questionType":"textarea","parentId":"1hjr8fo5q0.993gpbv22j","question":"この作品のタイトルを答えなさい。","maxlength":"60","answers":[{"id":"1hjr8gn6i0.fm9kbpla0o8","value":"夢十夜"},{"id":"1hjr8i8nn0.9k1plv9f3a","value":"第一夜"},{"id":"1hjr8iisc0.1riikv7br9o","value":"夢十夜　第一夜"}]}}`;

// JSONはroot が先頭であることを保証しないとする。
const questionTree = JSON.parse(testJson.replace(/\n/g, "\\n"));
const rootId = Object.keys(questionTree).find(
  (key) => questionTree[key].questionType === "root"
);
// 表示順に並べる
const questionIds = [rootId, ...questionTree[rootId].childIds];

export default function App() {
  // settingsModal
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [answerSettings, setAnswerSettings] = useState({
    time_min: 0,
    time_sec: 0,
  });
  // 解答。{questionId: answer}
  const [answers, setAnswers] = useState({});
  // Result
  const [isResultOpen, setIsResultOpen] = useState(false);

  // Timer
  // 解答画面の表示条件を0にするので、初期値を0にしない。
  const Timer = useTimer(10);
  const startAnswer = () => {
    setIsSettingsOpen(false);
    // 0分0秒の場合でタイマーを開始するとエラーになるので、その場合は動かさず結果画面を表示する。
    if (answerSettings.time_min === 0 && answerSettings.time_sec === 0) {
      console.log(Timer.seconds);
      setIsResultOpen(true);
      return;
    }
    Timer.reset(answerSettings.time_min * 60 + answerSettings.time_sec);
    Timer.toggleActive();
  };

  const finishAnswer = () => {
    setIsResultOpen(true);
    Timer.reset();
    Timer.toggleActive();
  };

  if (Timer.seconds === 0) {
    finishAnswer();
  }

  return (
    <>
      {!isSettingsOpen && !isResultOpen ? <Watch time={Timer.seconds} /> : null}
      <SettingsModal
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        answerSettings={answerSettings}
        setAnswerSettings={setAnswerSettings}
        startAnswer={startAnswer}
      />
      {!isResultOpen ? (
        <>
          <InputAnswer
            answers={answers}
            setAnswers={setAnswers}
            questionTree={questionTree}
            questionIds={questionIds}
          />
          <Button onClick={() => finishAnswer()}>終了</Button>
        </>
      ) : null}

      {isResultOpen ? (
        <Result
          answers={answers}
          questionTree={questionTree}
          questionIds={questionIds}
        />
      ) : null}
    </>
  );
}
