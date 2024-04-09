import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import he from "he";
import Question from "../components/Question";

export function Quiz({ playAgain, difficulty }) {
  
  const [data, setData] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [shuffledAnswers, setShuffledAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [newQuestionsEnabled, setNewQuestionsEnabled] = useState(false); // State to enable/disable the button

  const fetchQuestions = React.useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(`https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=multiple`)
      .then(res => res.json())
      .then(apiData => {
        const decodedData = apiData.results.map(question => ({
          ...question,
          question: he.decode(question.question),
          correct_answer: he.decode(question.correct_answer),
          incorrect_answers: question.incorrect_answers.map(answer => he.decode(answer))
        }));
        setData(decodedData);

        const correctAnswersObj = {};
        const shuffledAnswersObj = {};
        decodedData.forEach((question, index) => {
          correctAnswersObj[index] = question.correct_answer;
          const answers = [...question.incorrect_answers];
          const correctAnswer = question.correct_answer;
          const randomIndex = Math.floor(Math.random() * (answers.length + 1));
          answers.splice(randomIndex, 0, correctAnswer);
          shuffledAnswersObj[index] = answers;
        });
        setCorrectAnswers(correctAnswersObj);
        setShuffledAnswers(shuffledAnswersObj);
        setLoading(false);
        setNewQuestionsEnabled(true);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
        setNewQuestionsEnabled(true);
        console.error('Error fetching data:', error);
      });
  }, [difficulty]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions])

  

  //conditions for error/loading
  if (error) {
    return <p className="error">Error fetching data: {error.message}</p>;
  }

  if (loading) {
    return <p className="loading">Loading, please wait...</p>;
  }

  //answer selection handler (+additions so we can conditionaly render styles for selected and correct answers)
  const handleAnswerSelection = (questionIndex, answerIndex, answerText) => {
    setSelectedAnswers(prevSelectedAnswers => ({
      ...prevSelectedAnswers,
      [questionIndex]: {
        index: answerIndex,
        text: answerText
      }
    }));
  };

  //handler for checking the number of correct answers
  const checkAnswers = () => {
    let correctCount = 0;
    Object.keys(selectedAnswers).forEach((questionIndex) => {
      const selectedAnswer = selectedAnswers[questionIndex];
      const correctAnswer = correctAnswers[questionIndex];
      if (selectedAnswer.text === correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

  const handleNewQuestions = () => {
    // Reset state for selected answers and correct answers
    setSelectedAnswers({});
    setScore(null);
    // Fetch new questions
    fetchQuestions();
  };

  return (
    <div className="questions-holder">
      {data.map((question, index) => (
        <Question
          key={nanoid()}
          data={{
            question: question.question,
            shuffledAnswers: shuffledAnswers[index],
            correctAnswer: correctAnswers[index],
            showAnswers: score !== null, // Show answers only when score is not null
            selectedAnswer: selectedAnswers[index]
          }}
          onAnswerSelection={(answerIndex, answerText) =>
            handleAnswerSelection(index, answerIndex, answerText)
          }
        />
      ))}
      <div className="score-button-holder">
        {score !== null && (
          <h3 className="score">
            Your Score: {score} out of {data.length}
          </h3>
        )}
        <button onClick={checkAnswers} className="check-answers-btn">
          Check Answers
        </button>
        <button onClick={handleNewQuestions} disabled={!score} className="new-questions-btn">
          New Questions
        </button>
      </div>
    </div>
  );
}
