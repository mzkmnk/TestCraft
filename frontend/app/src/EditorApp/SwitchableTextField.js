import { useState } from "react";
import TextField from "@mui/material/TextField";
import { MathJax } from "better-react-mathjax";
import Box from "@mui/material/Box";
import SyntaxHighlighter from "react-syntax-highlighter";
import hlStyle from "react-syntax-highlighter/dist/esm/styles/hljs/docco";

// Typographyのラップ
function Paragraph({ children }) {
  return (
    <span
      style={{
        fontSize: "1.1rem",
        whiteSpace: "pre-line",
        wordWrap: "break-word",
      }}
    >
      {children}
    </span>
  );
}

/*
function InsertMathJax(text, JSX) {
  const re = /\(.+?\)/;
  if (text.match(re)) {
    return <MathJax>{JSX}</MathJax>;
  } else {
    return <>{JSX}</>;
  }
}

function InsertCode(text) {
  const re = /```(.*)\n([\s\S]*?)\n```/;
  let returnJSX = <></>;
  let result;

  while ((result = text.match(re))) {
    if (result !== null) {
      returnJSX = (
        <>
          {returnJSX}
          <Paragraph>{text.slice(0, result.index)}</Paragraph>
          <SyntaxHighlighter language={result[1]} style={hlStyle}>
            {result[2]}
          </SyntaxHighlighter>
        </>
      );
      text = text.slice(result.index + result[0].length);
    } else {
      break;
    }
  }

  returnJSX = (
    <>
      {returnJSX}
      <Paragraph style={{ whiteSpace: "pre-line" }}>{text}</Paragraph>
    </>
  );
  return returnJSX;
}
*/

function parse(text) {
  let returnJSX = <></>;
  let nextStart = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "`") {
      // コードブロックならば
      if (text.slice(i, i + 3) === "```") {
        // 閉じタグを探す
        let codeEnd = text.indexOf("```", i + 3);
        if (codeEnd !== -1) {
          const languageEnd = text.indexOf("\n", i + 3);
          const language = text.slice(i + 3, languageEnd + 1);
          console.log(language);
          returnJSX = (
            <>
              {returnJSX}
              <Paragraph>{text.slice(nextStart, i)}</Paragraph>
              <SyntaxHighlighter language={language} style={hlStyle}>
                {text.slice(i + 3 + language.length, codeEnd)}
              </SyntaxHighlighter>
            </>
          );
          // 閉じタグの後ろまで飛ばす。末尾が改行なら、それも飛ばす。
          nextStart = text[codeEnd + 3] === "\n" ? codeEnd + 4 : codeEnd + 3;
          // forでi++するので-1
          i = text[codeEnd + 3] === "\n" ? codeEnd + 3 : codeEnd + 2;
        }
        // 閉じタグが見つからない場合は何もしない。
      } else {
        //インラインコードならば\
        let codeEnd = text.indexOf("`", i + 1);
        if (codeEnd !== -1) {
          returnJSX = (
            <>
              {returnJSX}
              <Paragraph>{text.slice(nextStart, i)}</Paragraph>
              <code>{text.slice(i + 1, codeEnd)}</code>
            </>
          );
          nextStart = codeEnd + 1;
          i = codeEnd;
        }
      }
    } else if (text[i] === "$") {
      if (text.slice(i, i + 2) === "$$") {
        let mathEnd = text.indexOf("$$", i + 2);
        if (mathEnd !== -1) {
          returnJSX = (
            <>
              {returnJSX}
              <Paragraph>{text.slice(nextStart, i)}</Paragraph>
              <MathJax>\({text.slice(i + 2, mathEnd)}\)</MathJax>
            </>
          );
          nextStart = test[mathEnd + 2] === "\n" ? mathEnd + 3 : mathEnd + 2;
          i = test[mathEnd + 2] === "\n" ? mathEnd + 2 : mathEnd + 1;
        }
      } else {
        let mathEnd = text.indexOf("$", i + 1);
        if (mathEnd !== -1) {
          returnJSX = (
            <>
              {returnJSX}
              <Paragraph>{text.slice(nextStart, i)}</Paragraph>
              <MathJax inline={true}>\({text.slice(i + 1, mathEnd)}\)</MathJax>
            </>
          );
          nextStart = mathEnd + 1;
          i = mathEnd;
        }
      }
    }
  }
  if (text.slice(nextStart) !== "") {
    returnJSX = (
      <>
        {returnJSX}
        <Paragraph>{text.slice(nextStart)}</Paragraph>
      </>
    );
  }
  return returnJSX;
}
export function format(text) {
  let returnJSX = parse(text);
  return returnJSX;
}

// クリックでフィールドを有効、無効にできるテキストフィールド
export function SwitchableTextField({ value, setValue, args = [] }) {
  let defaultState;
  let defaultValue;
  if (value) {
    defaultState = false;
    defaultValue = format(value);
  } else {
    defaultState = true;
    defaultValue = value;
  }

  const [canInput, setCanInput] = useState(defaultState);
  const [displayValue, setDisplayValue] = useState(<>{defaultValue}</>);

  const toggleState = () => {
    setCanInput(!canInput);
  };

  const onBlur = (e) => {
    const value = e.target.value;
    setValue(e.target.value, ...args);
    if (value === "") {
      return;
    }
    setDisplayValue(format(e.target.value));
    toggleState();
  };

  return (
    <>
      {canInput ? (
        <TextField
          defaultValue={value}
          onBlur={(e) => onBlur(e)}
          autoFocus
          multiline
          onKeyDown={(e) => {
            // tabを押したときの動作
            if (e.key === "Tab") {
              e.preventDefault();

              const start = e.target.selectionStart;
              const end = e.target.selectionEnd;
              const tab = "  ";
              e.target.value =
                e.target.value.substring(0, start) +
                tab +
                e.target.value.substring(end);
              e.target.selectionStart = e.target.selectionEnd =
                start + tab.length;
            }
          }}
          sx={{ marginLeft: 1, width: "85%" }}
        />
      ) : (
        <Box
          sx={{
            marginLeft: 1,
            padding: 1,
            border: 1.5,
            borderRadius: 2,
            borderColor: "#D2D2D2",
            width: "85%",
          }}
          onClick={toggleState}
        >
          <button
            style={{
              padding: 0,
              margin: "0 auto",
              border: "none",
              outline: "none",
              font: "inherit",
              color: "inherit",
              background: "none",
              width: "100%",
              textAlign: "left",
            }}
          >
            {displayValue}
          </button>
        </Box>
      )}
    </>
  );
}
