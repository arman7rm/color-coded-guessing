
import React from 'react';
import { LetterState } from '../utils/wordUtils';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStates: Record<string, LetterState>;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, letterStates }) => {
  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace']
  ];

  // Get the appropriate class based on the letter state
  const getKeyClass = (key: string) => {
    const baseClass = 'key';
    
    // Special keys
    if (key === 'Enter') {
      return `${baseClass} bg-primary text-white px-2`;
    }
    if (key === 'Backspace') {
      return `${baseClass} bg-muted-foreground text-white px-1`;
    }
    
    // Regular keys with states
    const letterState = letterStates[key];
    if (letterState === 'correct') {
      return `${baseClass} key-correct`;
    }
    if (letterState === 'present') {
      return `${baseClass} key-present`;
    }
    if (letterState === 'absent') {
      return `${baseClass} key-absent`;
    }
    
    return `${baseClass} bg-secondary text-foreground`;
  };

  return (
    <div className="keyboard px-1 mx-auto max-w-2xl animate-fade-in">
      {rows.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex justify-center mb-2 gap-1 sm:gap-1.5 px-1 w-full">
          {row.map((key) => (
            <button
              key={key}
              className={getKeyClass(key)}
              style={{ 
                width: key === 'Enter' || key === 'Backspace' 
                  ? 'auto' 
                  : 'min(8vw, 42px)',
                flexGrow: key === 'Enter' || key === 'Backspace' ? 1.5 : 1
              }}
              onClick={() => onKeyPress(key)}
            >
              {key === 'Backspace' ? '←' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
