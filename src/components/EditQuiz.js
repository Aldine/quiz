import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { updateQuiz } from "../features/quiz/quizSlice";

const EditQuiz = ({ quiz, onClose }) => {
  const [editedQuestion, setEditedQuestion] = useState(quiz);
  const dispatch = useDispatch();

  const handleQuestionChange = (e) => {
    setEditedQuestion({ ...editedQuestion, text: e.target.value });
  };

  const handleFeedbackChange = (type, value) => {
    setEditedQuestion({ ...editedQuestion, [type]: value });
  };

  const handleAnswerChange = (answerId, newText) => {
    const updatedAnswers = editedQuestion.answers.map((answer) =>
      answer.id === answerId ? { ...answer, text: newText } : answer
    );
    setEditedQuestion({ ...editedQuestion, answers: updatedAnswers });
  };

  const handleCorrectAnswerChange = (answerId) => {
    const updatedAnswers = editedQuestion.answers.map((answer) => ({
      ...answer,
      is_true: answer.id === parseInt(answerId),
    }));
    setEditedQuestion({ ...editedQuestion, answers: updatedAnswers });
  };

  const handleSave = () => {
    dispatch(
      updateQuiz({ quizId: editedQuestion.id, updatedQuiz: editedQuestion })
    );
    onClose();
  };

  return (
    <div>
      <TextField
        label="Question"
        value={editedQuestion.text}
        onChange={handleQuestionChange}
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
      {editedQuestion.answers.map((answer, index) => (
        <div key={answer.id}>
          <TextField
            label={`Answer ${index + 1}`}
            value={answer.text}
            onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
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
        </div>
      ))}
      <RadioGroup
        value={editedQuestion.answers
          .find((answer) => answer.is_true)
          ?.id.toString()}
        onChange={(e) => handleCorrectAnswerChange(e.target.value)}
      >
        {editedQuestion.answers.map((answer, index) => (
          <FormControlLabel
            key={answer.id}
            value={answer.id.toString()}
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
            label={`Answer ${index + 1}`}
            sx={{ color: "#B0C4DE" }}
          />
        ))}
      </RadioGroup>
      <TextField
        label="Feedback for Correct Answer"
        value={editedQuestion.feedback_true}
        onChange={(e) => handleFeedbackChange("feedback_true", e.target.value)}
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
        value={editedQuestion.feedback_false}
        onChange={(e) => handleFeedbackChange("feedback_false", e.target.value)}
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
      <div style={{ marginTop: 10 }}>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          sx={{ marginRight: 2 }}
        >
          Save
        </Button>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditQuiz;
