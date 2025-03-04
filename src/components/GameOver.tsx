
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface GameOverProps {
  win: boolean;
  solution: string;
  numGuesses: number;
  onPlayAgain: () => void;
}

const GameOver: React.FC<GameOverProps> = ({
  win,
  solution,
  numGuesses,
  onPlayAgain
}) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="glass rounded-xl p-8 max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-bold mb-2">
          {win ? 'Congratulations!' : 'Game Over'}
        </h2>
        
        <p className="text-xl mb-6">
          {win 
            ? `You found the word in ${numGuesses} ${numGuesses === 1 ? 'guess' : 'guesses'}!` 
            : 'Better luck next time!'
          }
        </p>
        
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">The word was:</p>
          <p className="text-3xl font-bold">{solution.toUpperCase()}</p>
        </div>
        
        <Button 
          onClick={onPlayAgain}
          size="lg"
          className="w-full"
        >
          Play Again
        </Button>
      </motion.div>
    </div>
  );
};

export default GameOver;
