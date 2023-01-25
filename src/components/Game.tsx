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
    console.log(cells);
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

  useEffect(() => {
    setBoard(makeEmptyBoard());
  }, []);

  useEffect(() => {
    if (board.length) {
      setCells(makeCells());
    }
  }, [board]);

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
        ref={boardRef}
      >
        {cells.map((cell) => (
          <Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} />
        ))}
      </div>
    </div>
  );
};

export default Game;
