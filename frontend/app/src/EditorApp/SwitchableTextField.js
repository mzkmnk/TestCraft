import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Box from "@mui/material/Box";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/github.css";

// Typographyのラップ
function Paragraph({ children }) {
  return (
    <Typography style={{ fontSize: "1.1rem", whiteSpace: "pre-line" }}>
      {children}
    </Typography>
  );
}

function InsertMathJax(text, JSX) {
  const re = /\(.+?\)/;
  if (text.match(re)) {
    return (
      <MathJaxContext>
        <MathJax>{JSX}</MathJax>
      </MathJaxContext>
    );
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
      console.log("text.slice(result.index)", text.slice(0, result.index));
      returnJSX = (
        <>
          {returnJSX}
          <Paragraph>{text.slice(0, result.index)}</Paragraph>
          <pre>
            <code className={result[1]}>{result[2]}</code>
          </pre>
        </>
      );
      console.log("result.index", result.index);
      console.log();
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

function format(text) {
  let returnJSX = InsertCode(text);
  returnJSX = InsertMathJax(text, returnJSX);
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

  useEffect(() => {
    hljs.initHighlighting();
    hljs.initHighlighting.called = false;
    console.log("useE");
  });

  const toggleState = () => {
    setCanInput(!canInput);
  };

  const onBlur = (e) => {
    const value = e.target.value;
    if (value === "") {
      return;
    }
    setDisplayValue(format(e.target.value));
    setValue(e.target.value, ...args);
    toggleState();
  };

  return (
    <>
      {canInput ? (
        <TextField
          defaultValue={value}
          onBlur={(e) => onBlur(e)}
          autoFocus
          fullWidth
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
        />
      ) : (
        <Box
          sx={{
            marginLeft: 1,
            padding: 1,
            border: 1.5,
            borderRadius: 2,
            borderColor: "#D2D2D2",
          }}
          onClick={toggleState}
        >
          {displayValue}
        </Box>
      )}
    </>
  );
}
