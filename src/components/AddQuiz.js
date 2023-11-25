import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { addQuiz } from "../features/quiz/quizSlice";

const initialQuestionState = {
  text: "",
  answers: [
    { id: 1, text: "", is_true: false },
    { id: 2, text: "", is_true: false },
  ],
  feedback_true: "",
  feedback_false: "",
};

const AddQuiz = ({ onClose }) => {
  const [newQuestion, setNewQuestion] = useState(initialQuestionState);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith("answer")) {
      const updatedAnswers = [...newQuestion.answers];
      updatedAnswers[index].text = value;
      setNewQuestion({ ...newQuestion, answers: updatedAnswers });
    } else {
      setNewQuestion({ ...newQuestion, [name]: value });
    }
  };

  const handleRadioChange = (index) => {
    const updatedAnswers = newQuestion.answers.map((answer, i) => ({
      ...answer,
      is_true: i === index,
    }));
    setNewQuestion({ ...newQuestion, answers: updatedAnswers });
  };

  const handleDeleteAnswer = (index) => {
    const updatedAnswers = newQuestion.answers.filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, answers: updatedAnswers });
  };

  const handleAddAnswer = () => {
    const newAnswer = {
      id: newQuestion.answers.length + 1,
      text: "",
      is_true: false,
    };
    setNewQuestion({
      ...newQuestion,
      answers: [...newQuestion.answers, newAnswer],
    });
  };

  const validateFields = () => {
    if (!newQuestion.text.trim()) return "Question text cannot be empty.";
    if (newQuestion.answers.some((answer) => !answer.text.trim()))
      return "All answer fields must be filled.";
    if (!newQuestion.feedback_true.trim() || !newQuestion.feedback_false.trim())
      return "Feedback cannot be empty.";
    return "";
  };

  const handleAdd = () => {
    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      return;
    }
    dispatch(addQuiz(newQuestion));
    onClose();
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "#272D3B",
        boxShadow: 24,
        p: 4,
      }}
    >
      <TextField
        label="Question"
        name="text"
        value={newQuestion.text}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ style: { color: "#B0C4DE" } }}
        InputProps={{
          style: { color: "#B0C4DE" },
          sx: {
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          },
        }}
      />
      {newQuestion.answers.map((answer, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <TextField
            label={`Answer ${index + 1}`}
            name={`answer${index}`}
            value={answer.text}
            onChange={(e) => handleInputChange(e, index)}
            fullWidth
            InputLabelProps={{ style: { color: "#B0C4DE" } }}
            InputProps={{
              style: { color: "#B0C4DE" },
              sx: {
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              },
            }}
          />
          <IconButton onClick={() => handleDeleteAnswer(index)}>
            <CloseIcon color="primary" />
          </IconButton>
          {index === newQuestion.answers.length - 1 && (
            <IconButton onClick={handleAddAnswer}>
              <AddIcon color="primary" />
            </IconButton>
          )}
        </Box>
      ))}
      <RadioGroup
        value={newQuestion.answers.findIndex((answer) => answer.is_true)}
        onChange={(e) => handleRadioChange(parseInt(e.target.value))}
      >
        {newQuestion.answers.map((answer, index) => (
          <FormControlLabel
            key={index}
            value={index}
            control={
              <Radio
                sx={{
                  color: "white",
                  "&.Mui-checked": {
                    color: "white",
                  },
                }}
              />
            }
            label={`Correct Answer ${index + 1}`}
            sx={{ color: "#B0C4DE" }}
          />
        ))}
      </RadioGroup>
      <TextField
        label="Feedback for Correct Answer"
        name="feedback_true"
        value={newQuestion.feedback_true}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ style: { color: "#B0C4DE" } }}
        InputProps={{
          style: { color: "#B0C4DE" },
          sx: {
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          },
        }}
      />
      <TextField
        label="Feedback for Incorrect Answer"
        name="feedback_false"
        value={newQuestion.feedback_false}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ style: { color: "#B0C4DE" } }}
        InputProps={{
          style: { color: "#B0C4DE" },
          sx: {
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          },
        }}
      />
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <Button
        onClick={handleAdd}
        variant="contained"
        color="primary"
        sx={{ marginRight: 2 }}
      >
        Add
      </Button>
      <Button onClick={onClose} variant="outlined" color="secondary">
        Cancel
      </Button>
    </Box>
  );
};

export default AddQuiz;
