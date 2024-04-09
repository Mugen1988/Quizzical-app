import React from "react";
import { nanoid } from "nanoid";

export default function Question({ data, onAnswerSelection }) {
    const { question, shuffledAnswers, correctAnswer, showAnswers, selectedAnswer } = data;
  
    const handleAnswerClick = (answerIndex, answerText) => {
      onAnswerSelection(answerIndex, answerText);
    };
  
    console.log(selectedAnswer);
  
    return (
      <div>
        <h3 className="question">{question}</h3>
        <div className="answers-holder">
          {shuffledAnswers.map((answer, answerIndex) => (
            <p
              key={nanoid()}
              className={`answer ${
                showAnswers && answerIndex === shuffledAnswers.indexOf(correctAnswer)
                  ? "correct"
                  : ""
              } ${
                selectedAnswer && answerIndex === selectedAnswer.index
                  ? "selected"
                  : ""}`}
              onClick={() => handleAnswerClick(answerIndex, answer)}
            >
              {answer}
            </p>
          ))}
        </div>
      </div>
    );
}