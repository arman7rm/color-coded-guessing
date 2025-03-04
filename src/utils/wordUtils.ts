
// List of 5-letter words for the game
const WORD_LIST = [
  "apple", "beach", "chart", "dance", "earth", "flame", "grape", "heart",
  "joust", "knife", "lemon", "music", "night", "ocean", "piano", "quilt",
  "river", "solar", "tiger", "ultra", "vivid", "witch", "xerox", "yacht",
  "zebra", "blend", "crest", "dream", "fiery", "ghost", "hound", "igloo",
  "jumbo", "knack", "lunar", "mango", "noble", "oasis", "proud", "quick",
  "ridge", "shake", "tense", "unity", "vapor", "water", "youth", "zesty"
];

export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface GameState {
  guesses: string[];
  currentGuess: string;
  solution: string;
  gameOver: boolean;
  win: boolean;
  currentRow: number;
  letterStates: Record<string, LetterState>;
}

export const getRandomWord = (): string => {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
};

export const isValidWord = (word: string): boolean => {
  // In a real game, you'd check against a dictionary
  // For this demo, we'll just ensure it's 5 letters
  return word.length === 5;
};

export const checkGuess = (guess: string, solution: string): LetterState[] => {
  const result: LetterState[] = Array(5).fill('absent');
  const solutionArray = solution.split('');
  const guessArray = guess.split('');
  
  // First pass: check for correct letters
  for (let i = 0; i < 5; i++) {
    if (guessArray[i] === solutionArray[i]) {
      result[i] = 'correct';
      solutionArray[i] = '#'; // Mark as used
    }
  }
  
  // Second pass: check for misplaced letters
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'absent') {
      const index = solutionArray.indexOf(guessArray[i]);
      if (index !== -1) {
        result[i] = 'present';
        solutionArray[index] = '#'; // Mark as used
      }
    }
  }
  
  return result;
};

export const updateLetterStates = (
  guess: string, 
  states: LetterState[], 
  currentStates: Record<string, LetterState>
): Record<string, LetterState> => {
  const newStates = { ...currentStates };
  
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i];
    const state = states[i];
    
    // Only upgrade state (empty -> absent -> present -> correct)
    if (!newStates[letter] || 
        (newStates[letter] === 'absent' && state !== 'absent') || 
        (newStates[letter] === 'present' && state === 'correct')) {
      newStates[letter] = state;
    }
  }
  
  return newStates;
};
