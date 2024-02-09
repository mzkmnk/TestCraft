import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Box from "@mui/material/Box";
import SyntaxHighlighter from "react-syntax-highlighter";
import hlStyle from "react-syntax-highlighter/dist/esm/styles/hljs/docco";

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

export function format(text) {
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
          sx={{ marginLeft: 1 }}
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
