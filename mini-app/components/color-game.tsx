"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "black",
];

const ROWS = 7;
const COLS = 5;
const TOTAL = ROWS * COLS;

export default function ColorGame() {
  const [grid, setGrid] = useState<string[][]>([]);
  const [target, setTarget] = useState<string>("");
  const [timer, setTimer] = useState<number>(10);
  const [round, setRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean[][]>([]);

  // Generate a new round
  const startRound = (duration: number) => {
    setTimer(duration);
    setTarget(COLORS[Math.floor(Math.random() * COLORS.length)]);
    const newGrid: string[][] = [];
    const newSelected: boolean[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: string[] = [];
      const selRow: boolean[] = [];
      for (let c = 0; c < COLS; c++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        row.push(color);
        selRow.push(false);
      }
      newGrid.push(row);
      newSelected.push(selRow);
    }
    setGrid(newGrid);
    setSelected(newSelected);
  };

  // Timer effect
  useEffect(() => {
    if (gameOver) return;
    if (timer <= 0) {
      setGameOver(true);
      return;
    }
    const id = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(id);
  }, [timer, gameOver]);

  // Start first round
  useEffect(() => {
    startRound(10);
  }, []);

  const handleClick = (r: number, c: number) => {
    if (gameOver) return;
    if (grid[r][c] !== target) return;
    if (selected[r][c]) return;
    const newSelected = selected.map((row, i) =>
      row.map((sel, j) => (i === r && j === c ? true : sel))
    );
    setSelected(newSelected);

    // Check if all target squares are selected
    const allSelected = grid.flatMap((row, i) =>
      row.map((color, j) => (color === target ? newSelected[i][j] : true))
    ).every(Boolean);

    if (allSelected) {
      setScore(score + 1);
      const nextDuration = Math.max(1, timer - 1);
      setRound(round + 1);
      startRound(nextDuration);
    }
  };

  const playAgain = () => {
    setScore(0);
    setRound(1);
    setGameOver(false);
    startRound(10);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded"
          style={{ backgroundColor: target }}
        />
        <span className="text-xl font-semibold">Timer: {timer}s</span>
      </div>
      <div className="text-lg">Round: {round}</div>
      <div className="grid grid-cols-5 gap-2">
        {grid.map((row, r) =>
          row.map((color, c) => (
            <div
              key={`${r}-${c}`}
              className="w-12 h-12 rounded cursor-pointer"
              style={{
                backgroundColor: color,
                opacity: selected[r][c] ? 0.5 : 1,
              }}
              onClick={() => handleClick(r, c)}
            />
          ))
        )}
      </div>
      {gameOver && (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold">Game Over</h2>
          <p className="text-lg">Final Score: {score}</p>
          <Button onClick={playAgain}>Play Again</Button>
        </div>
      )}
    </div>
  );
}
