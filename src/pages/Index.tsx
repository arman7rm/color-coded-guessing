
import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from '../components/GameBoard';
import Keyboard from '../components/Keyboard';
import GameOver from '../components/GameOver';
import { 
  getRandomWord, 
  checkGuess, 
  isValidWord, 
  updateLetterStates,
  LetterState
} from '../utils/wordUtils';
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>({});
  const [boardStates, setBoardStates] = useState<LetterState[][]>([]);
  const [animateRow, setAnimateRow] = useState<number | null>(null);

  // Start a new game
  const startNewGame = useCallback(() => {
    const newSolution = getRandomWord();
    setSolution(newSolution);
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWin(false);
    setLetterStates({});
    setBoardStates([]);
    setAnimateRow(null);
    
    console.log(`New game started. Solution: ${newSolution}`); // For debugging
  }, []);

  // Initialize game on component mount
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Process keyboard input
  const handleKeyPress = useCallback((key: string) => {
    if (gameOver) return;
    
    // Handle enter key
    if (key === 'Enter') {
      if (currentGuess.length !== 5) {
        toast({
          description: "Word must be 5 letters long",
          variant: "destructive",
        });
        return;
      }
      
      if (!isValidWord(currentGuess)) {
        // Show animation for invalid word
        setAnimateRow(guesses.length);
        setTimeout(() => setAnimateRow(null), 600);
        
        toast({
          description: "Not a valid word",
          variant: "destructive",
        });
        return;
      }
      
      // Process valid guess
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      
      // Check letter states for this guess
      const states = checkGuess(currentGuess, solution);
      const newBoardStates = [...boardStates, states];
      setBoardStates(newBoardStates);
      
      // Update keyboard letter states
      const newLetterStates = updateLetterStates(
        currentGuess, 
        states, 
        letterStates
      );
      setLetterStates(newLetterStates);
      
      // Check win/lose condition
      if (currentGuess === solution) {
        setWin(true);
        setGameOver(true);
        toast({
          description: "Excellent! You found the word!",
          variant: "default",
        });
      } else if (newGuesses.length >= 6) {
        setGameOver(true);
        toast({
          description: `Game over! The word was ${solution.toUpperCase()}`,
          variant: "default",
        });
      }
      
      setCurrentGuess('');
      return;
    }
    
    // Handle backspace key
    if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }
    
    // Handle letter keys
    if (/^[a-z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, gameOver, guesses, letterStates, solution, boardStates]);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (key === 'enter' || key === 'backspace' || /^[a-z]$/.test(key)) {
        handleKeyPress(key === 'enter' ? 'Enter' : key === 'backspace' ? 'Backspace' : key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b py-4">
        <h1 className="text-3xl font-bold text-center">Wordle</h1>
      </header>
      
      <main className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full pt-6 pb-4">
        <GameBoard 
          guesses={guesses}
          currentGuess={currentGuess}
          solution={solution}
          letterStates={boardStates}
          currentRow={guesses.length}
          animateRow={animateRow}
        />
        
        <Keyboard 
          onKeyPress={handleKeyPress}
          letterStates={letterStates}
        />
      </main>
      
      {gameOver && (
        <GameOver 
          win={win}
          solution={solution}
          numGuesses={guesses.length}
          onPlayAgain={startNewGame}
        />
      )}
    </div>
  );
};

export default Index;
