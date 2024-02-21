import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { format } from "./SwitchableTextField";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  height: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  overflowY: "auto",
  boxShadow: 24,
  padding: 5,
  borderRadius: 2,
  margin: "0, auto",
  maxWidth: "50rem",
};

export function AnswerSelectionModal({
  open,
  setOpen,
  options,
  canMultiple,
  questionId,
  handleReplaceAnswers,
}) {
  const [selectedValues, setSelectedValues] = useState([]);
  let initCheckboxState = {};
  if (canMultiple) {
    for (const option of options) {
      initCheckboxState[option.value] = false;
    }
  }
  const [CheckboxState, setCheckboxState] = useState(initCheckboxState);

  const handleCheckBoxAnswers = (event) => {
    console.log(CheckboxState);
    console.log(CheckboxState[event.target.value]);
    console.log("event.target.checked", event.target.checked);
    setCheckboxState({
      ...CheckboxState,
      [event.target.value]: !CheckboxState[event.target.value],
    });
  };

  // checkBoxはまとめて配列にする。
  const handleClose = () => {
    if (canMultiple) {
      let selectedValues = [];
      for (const [key, value] of Object.entries(CheckboxState)) {
        if (value) {
          selectedValues.push(key);
        }
      }
      handleReplaceAnswers(questionId, selectedValues);
    } else {
      handleReplaceAnswers(questionId, selectedValues);
    }
    setOpen(false);
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography align="center" variant="h3" fontSize={"1.5rem"}>
          解答を選択
        </Typography>
        <IconButton
          sx={{ position: "absolute", top: 0, right: 0 }}
          onClick={() => setOpen(false)}
        >
          <ClearOutlinedIcon />
        </IconButton>
        <Box sx={{ margin: 1.5 }}>
          {canMultiple ? (
            <FormGroup>
              {options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.value}
                  control={<Checkbox />}
                  label={option.value === "" ? "未記入" : format(option.value)}
                  checked={
                    CheckboxState[option.value] !== undefined &&
                    CheckboxState[option.value]
                  }
                  onChange={(e) => {
                    handleCheckBoxAnswers(e);
                  }}
                />
              ))}
            </FormGroup>
          ) : (
            <RadioGroup
              onChange={(event) => setSelectedValues([event.target.value])}
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.value}
                  control={<Radio />}
                  label={option.value === "" ? "未記入" : format(option.value)}
                />
              ))}
            </RadioGroup>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
