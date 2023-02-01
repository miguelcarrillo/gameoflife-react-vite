import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Game from "./components/Game";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <Game />
    </div>
  );
}

export default App;
