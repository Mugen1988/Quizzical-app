import React from "react"

export function Start({ startGame }) {
    const [selectedDifficulty, setSelectedDifficulty] = React.useState("easy");
  
    const handleChange = (event) => {
      setSelectedDifficulty(event.target.value);
    };
  
    const handleClick = () => {
      startGame(selectedDifficulty);
    };
  
    return (
        <div className="start-screen">
          <h1 className="start-title">Quizzical</h1>
          <h2 className="start-subtitle">
            Stretch Your Brain - Trivia that Spans from Shakespeare to Sharknado!
          </h2>
          <div className="radio-container">
            <input
              type="radio"
              id="easy"
              value="easy"
              checked={selectedDifficulty === "easy"}
              onChange={handleChange}
              className="radio-input"
            />
            <label htmlFor="easy" className="radio-button">
              Easy
            </label>
            <input
              type="radio"
              id="medium"
              value="medium"
              checked={selectedDifficulty === "medium"}
              onChange={handleChange}
              className="radio-input"
            />
            <label htmlFor="medium" className="radio-button">
              Medium
            </label>
            <input
              type="radio"
              id="hard"
              value="hard"
              checked={selectedDifficulty === "hard"}
              onChange={handleChange}
              className="radio-input"
            />
            <label htmlFor="hard" className="radio-button">
              Hard
            </label>
          </div>
          <button className="start-button" onClick={handleClick}>
            Start Quiz
          </button>
        </div>
      );
}