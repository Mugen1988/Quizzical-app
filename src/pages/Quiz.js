import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import "../App.css";
import he from "he";

export function Quiz() {
    const [data, setData] = React.useState([]);
    const [selectedAnswers, setSelectedAnswers] = React.useState({});
    const [correctAnswers, setCorrectAnswers] = React.useState({});
    const [shuffledAnswers, setShuffledAnswers] = React.useState({});
    const [score, setScore] = React.useState(null);
    const [loading, setLoading] = useState(true);
  
    React.useEffect(() => {
      fetch('https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple')
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
            decodedData.forEach((question, index) => {
            correctAnswersObj[index] = question.correct_answer;
          });
          setCorrectAnswers(correctAnswersObj);
          setLoading(false);
  
          // Shuffle answers and store them
          const shuffledAnswersObj = {};
          decodedData.forEach((question, index) => {
            const answers = [...question.incorrect_answers];
            const correctAnswer = question.correct_answer;
            const randomIndex = Math.floor(Math.random() * (answers.length + 1));
            answers.splice(randomIndex, 0, correctAnswer);
            shuffledAnswersObj[index] = answers;
          });
          setShuffledAnswers(shuffledAnswersObj);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    if (loading) {
        return <p className="loading">Loading, please wait...</p>;
      }
  
    const handleAnswerSelection = (questionIndex, answerIndex, answerText) => {
        setSelectedAnswers((prevSelectedAnswers) => ({
          ...prevSelectedAnswers,
          [questionIndex]: {
            index: answerIndex,
            text: answerText
          }
        }));
      };
      
    const checkAnswers = () => {
    let correctCount = 0;
    Object.keys(selectedAnswers).forEach((questionIndex) => {
        const selectedAnswer = selectedAnswers[questionIndex];
        const correctAnswer = correctAnswers[questionIndex];
        if (selectedAnswer.text === correctAnswer) {
        correctCount++;
        const correctAnswerIndex = shuffledAnswers[questionIndex].indexOf(correctAnswer);
        setSelectedAnswers((prevSelectedAnswers) => ({
            ...prevSelectedAnswers,
            [questionIndex]: {
            ...prevSelectedAnswers[questionIndex],
            correct: correctAnswerIndex
            }
        }));
        }
    });
        setScore(correctCount);
    };
  
    const questions = data.map((question, questionIndex) => {
        const answers = shuffledAnswers[questionIndex];
      
        return (
          <div key={nanoid()}>
            <h3 key={nanoid()} className="question">{question.question}</h3>
            <div className="answers-holder">
              {answers.map((answer, answerIndex) => (
                <p
                  key={nanoid()}
                  className={`answer ${
                    selectedAnswers[questionIndex]?.index === answerIndex ? "selected" : ""
                  } ${
                    selectedAnswers[questionIndex]?.correct === answerIndex ? "correct" : ""
                  }`}
                  onClick={() => handleAnswerSelection(questionIndex, answerIndex, answer)}
                >
                  {answer}
                </p>
              ))}
            </div>
          </div>
        );
      });
  
    return (
      <div className="questions-holder">
        {questions}
        <div className="score-button-holder">
            {score !== null && (
            <h3 className="score">
                Your Score: {score} out of {data.length}
            </h3>
            )}
            <button onClick={checkAnswers} className="check-answers-btn">Check Answers</button>
        </div>
      </div>
    );
  }