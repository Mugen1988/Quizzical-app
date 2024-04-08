import React from "react"

export function Start({startGame}){
    return (
        <div className="start-screen">
            <h1 className="start-title">Quizzical</h1>
            <h2 className="start-subtitle">
                Stretch Your Brain - Trivia that Spans from Shakespeare to Sharknado!
            </h2>
            <button className="start-button" onClick={startGame}>
                Start Quiz
            </button>
        </div>
    )
}