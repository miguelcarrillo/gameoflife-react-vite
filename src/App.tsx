import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Game from './components/Game'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <Game />
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
