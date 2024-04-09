import "./App.css";
import { useState } from "react";
import { Start } from "./pages/Start";
import { Quiz } from "./pages/Quiz";
import { BlobLeft, BlobRight } from "./components/Blobs";

function App() {
  const [startGame, setStartGame] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  // Callback for starting the game
  const startGameHandler = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setStartGame(true);
  };

  // Callback for playing the game again
  const playAgainHandler = () => {
    setStartGame(false);
  };

  return (
    <main>
      <BlobLeft />
      <BlobRight />
      {!startGame && <Start startGame={startGameHandler} />}
      {startGame && <Quiz playAgain={playAgainHandler} difficulty={selectedDifficulty} />}
    </main>
  );
}

export default App;
