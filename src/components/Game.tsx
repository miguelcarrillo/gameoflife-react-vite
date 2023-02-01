import React, { useState, useEffect, useRef } from "react";

const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

interface CellType {
  x: number;
  y: number;
}

const Cell = ({ x, y }: CellType) => {
  return (
    <div
      className="Cell"
      style={{
        left: `${CELL_SIZE * x + 1}px`,
        top: `${CELL_SIZE * y + 1}px`,
        width: `${CELL_SIZE - 1}px`,
        height: `${CELL_SIZE - 1}px`,
      }}
    />
  );
};

const Game = () => {
  const [cells, setCells] = useState<CellType[]>([]);
  const [board, setBoard] = useState<boolean[][]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [interval, setInterval] = useState<number>(100);
  const [timeout, setTimeout] = useState<number | null>(null);
  let rows = HEIGHT / CELL_SIZE,
    cols = WIDTH / CELL_SIZE;
  const boardRef = useRef<HTMLDivElement | null>(null);
  const current = boardRef.current || null;

  const makeEmptyBoard = () => {
    let board: boolean[][] = [[]];
    for (let y = 0; y < rows; y++) {
      board[y] = [];
      for (let x = 0; x < cols; x++) {
        board[y][x] = false;
      }
    }
    return board;
  };

  const makeCells = () => {
    let cells: CellType[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (board[y][x]) {
          cells.push({ x, y });
        }
      }
    }
    return cells;
  };

  const getElementOffset = () => {
    let rect = { left: 0, top: 0 };
    const doc = document.documentElement;

    if (current) {
      rect = current.getBoundingClientRect();
    }

    return {
      x: rect.left + window.scrollX - doc.clientLeft,
      y: rect.top + window.scrollY - doc.clientTop,
    };
  };

  const handleClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    let clicked = true;
    const elemOffset = getElementOffset();

    const offsetX = evt.clientX - elemOffset.x;
    const offsetY = evt.clientY - elemOffset.y;

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    setBoard((board) => {
      const arr = [...board];
      if (x >= 0 && x <= cols && y >= 0 && y <= rows && clicked) {
        arr[y][x] = !arr[y][x];
      }
      clicked = false;
      return arr;
    });
  };

  const runGame = () => {
    setIsRunning(true);
  };

  const stopGame = () => {
    setIsRunning(false);
  };

  const runIteration = () => {
    let newBoard = makeEmptyBoard();

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let neighbors = calculateNeighbors(x, y);
        if (board[y][x]) {
          if (neighbors === 2 || neighbors === 3) {
            newBoard[y][x] = true;
          } else {
            newBoard[y][x] = false;
          }
        } else {
          if (!board[y][x] && neighbors === 3) {
            newBoard[y][x] = true;
          }
        }
      }
    }
    setBoard(newBoard);
  };

  /**
   * Calculate the number of neighbors at point (x, y)
   * @param {Array} board
   * @param {int} x
   * @param {int} y
   */
  const calculateNeighbors = (x: number, y: number) => {
    let neighbors = 0;
    const dirs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
    ];
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      let y1 = y + dir[0];
      let x1 = x + dir[1];

      if (x1 >= 0 && x1 < cols && y1 >= 0 && y1 < rows && board[y1][x1]) {
        neighbors++;
      }
    }

    return neighbors;
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterval(parseInt(e.target.value));
  };

  const handleClear = () => {
    setBoard(makeEmptyBoard());
  };

  const handleRandom = () => {
    let board: boolean[][] = [[]];
    for (let y = 0; y < rows; y++) {
      board[y] = [];
      for (let x = 0; x < cols; x++) {
        board[y][x] = Math.random() >= 0.5;
      }
    }
    setBoard(board);
  };

  useEffect(() => {
    setBoard(makeEmptyBoard());
  }, []);

  useEffect(() => {
    if (board.length) {
      setCells(makeCells());
      if (isRunning) {
        setTimeout(
          window.setTimeout(() => {
            runIteration();
          }, interval)
        );
      }
    }
  }, [board]);

  useEffect(() => {
    if (isRunning) {
      runIteration();
    } else if (timeout) {
      window.clearTimeout(timeout);
      setTimeout(null);
    }
  }, [isRunning]);

  return (
    <div>
      <div
        className="Board"
        style={{
          width: WIDTH,
          height: HEIGHT,
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
        }}
        onClick={handleClick}
        ref={boardRef}>
        {cells.map((cell) => (
          <Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} />
        ))}
      </div>
      <div className="controls">
        Update every <input value={interval} onChange={handleIntervalChange} />{" "}
        msec
        {isRunning ? (
          <button className="button" onClick={stopGame}>
            Stop
          </button>
        ) : (
          <button className="button" onClick={runGame}>
            Run
          </button>
        )}{" "}
        <button disabled={isRunning} className="button" onClick={handleRandom}>
          Random
        </button>
        <button disabled={isRunning} className="button" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default Game;
