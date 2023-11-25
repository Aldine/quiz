import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  IconButton,
  Grid,
  Button,
  Modal,
  Box,
  Container,
} from "@mui/material";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import EditQuiz from "./EditQuiz";
import AddQuiz from "./AddQuiz";
import { updateAnswerId, updateScore } from "../features/quiz/quizSlice";

const QuizList = () => {
  const dispatch = useDispatch();
  const quizzes = useSelector((state) => state.quiz.quizzes);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);

  const handleOpenModal = () => {
    setShowAddQuizModal(true);
  };

  const handleCloseModal = () => {
    setShowAddQuizModal(false);
  };

  const handleAnswerChange = (questionId, answerId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId,
    });

    dispatch(updateAnswerId({ questionId, answerId }));
  };

  const handleEditClick = (quizId) => {
    console.log("Editing quiz with ID:", quizId);
    setEditingQuizId(quizId);
  };

  const updateScoreInStore = () => {
    const score = calculateScore();
    dispatch(updateScore({ score }));
  };

  const calculateScore = () => {
    let score = 0;
    quizzes.questions_answers.forEach((question) => {
      const correctAnswer = question.answers.find((answer) => answer.is_true);
      if (
        correctAnswer &&
        selectedAnswers[question.id] === correctAnswer.id.toString()
      ) {
        score += 1;
      }
    });
    const formattedScore = parseFloat(
      ((score / quizzes.questions_answers.length) * 100).toFixed(1)
    );

    return formattedScore;
  };

  const allAnswered = quizzes.questions_answers.every(
    (question) => selectedAnswers[question.id] != null
  );

  useEffect(() => {
    if (allAnswered) {
      updateScoreInStore();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnswers, allAnswered]);

  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h3" padding={2}>
        {quizzes.title}
      </Typography>
      <Grid
        container
        justifyContent="flex-end"
        alignItems="flex-end"
        padding={2}
      >
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add a New Quiz
        </Button>
      </Grid>
      <Modal
        open={showAddQuizModal}
        onClose={handleCloseModal}
        aria-labelledby="add-quiz-modal"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <AddQuiz onClose={handleCloseModal} />
        </Box>
      </Modal>
      {quizzes.questions_answers.map((question) => (
        <Card
          sx={{
            width: { xs: 275, md: 600 },
            background: "#272D3B",
            color: "#B0C4DE",
            padding: "15px",
            marginBottom: "15px",
            borderColor: "#4C526B",
            borderWidth: "2px",
            borderStyle: "solid",
            boxShadow:
              "0px 10px 15px -3px rgba(0, 0, 0, 0.4), 0px 4px 6px -2px rgba(0, 0, 0, 0.25)",
          }}
          key={question.id}
        >
          <Grid container alignItems="center">
            <Grid item xs={11}>
              {editingQuizId === question.id ? (
                <EditQuiz
                  key={question.id}
                  quiz={question}
                  onClose={() => setEditingQuizId(null)}
                />
              ) : (
                <CardContent>
                  <Typography variant="h5" marginBottom={2}>
                    {question.text}
                  </Typography>
                  <RadioGroup
                    value={selectedAnswers[question.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                  >
                    {question.answers.map((answer) => (
                      <FormControlLabel
                        key={answer.id}
                        value={answer.id.toString()}
                        label={answer.text}
                        sx={{ color: "#B0C4DE" }}
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
                      />
                    ))}
                  </RadioGroup>
                  {selectedAnswers[question.id] && (
                    <Typography
                      variant="body1"
                      style={{
                        marginLeft: 16,
                        color: question.answers.find(
                          (a) =>
                            a.id.toString() === selectedAnswers[question.id]
                        )?.is_true
                          ? "green"
                          : "red",
                      }}
                    >
                      {question.answers.find(
                        (a) => a.id.toString() === selectedAnswers[question.id]
                      )?.is_true
                        ? question.feedback_true
                        : question.feedback_false}
                    </Typography>
                  )}
                </CardContent>
              )}
            </Grid>
            {editingQuizId !== question.id && (
              <Grid item xs={1}>
                <IconButton onClick={() => handleEditClick(question.id)}>
                  <ModeEditOutlineOutlinedIcon color="primary" />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Card>
      ))}
      {allAnswered && (
        <Typography
          variant="h4"
          style={{ color: "green", marginTop: 20, marginBottom: 40 }}
        >
          Your Score: {calculateScore()}
        </Typography>
      )}
    </Container>
  );
};
export default QuizList;
