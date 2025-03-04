
import React from 'react';
import { LetterState } from '../utils/wordUtils';

interface GameBoardProps {
  guesses: string[];
  currentGuess: string;
  solution: string;
  letterStates: LetterState[][];
  currentRow: number;
  animateRow: number | null;
}

const GameBoard: React.FC<GameBoardProps> = ({
  guesses,
  currentGuess,
  solution,
  letterStates,
  currentRow,
  animateRow,
}) => {
  // Create the game board with 6 rows (attempts) and 5 columns (letters)
  const board = [];

  for (let row = 0; row < 6; row++) {
    const rowTiles = [];
    
    for (let col = 0; col < 5; col++) {
      // Calculate content and state for this tile
      let content = '';
      let tileClass = 'letter-tile';
      const delay = `${col * 150}ms`;

      // Handle filled rows (submitted guesses)
      if (row < guesses.length) {
        content = guesses[row][col];
        if (letterStates[row]) {
          const state = letterStates[row][col];
          tileClass += ` letter-flip-${state}`;
        }
      } 
      // Handle current row (in-progress guess)
      else if (row === currentRow) {
        content = currentGuess[col] || '';
        if (content) {
          tileClass += ' letter-tile-filled';
        }
      }

      // Handle row animation for invalid words
      const shouldShake = row === animateRow;
      if (shouldShake) {
        tileClass += ' animate-shake';
      }

      rowTiles.push(
        <div 
          key={`tile-${row}-${col}`} 
          className={tileClass}
          style={{ '--delay': delay } as React.CSSProperties}
        >
          {content.toUpperCase()}
        </div>
      );
    }

    board.push(
      <div key={`row-${row}`} className="flex gap-2 mb-2 justify-center">
        {rowTiles}
      </div>
    );
  }

  return (
    <div className="game-board mb-6 px-2 animate-fade-in">
      {board}
    </div>
  );
};

export default GameBoard;
