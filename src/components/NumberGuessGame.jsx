import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Wallet, HelpCircle } from 'lucide-react';

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const Dice = ({ isRolling, result }) => {
  const Icon = diceIcons[result - 1];
  return (
    <div className="w-48 h-48 flex items-center justify-center">
      <motion.div
        className="bg-white rounded-3xl p-6 shadow-2xl"
        animate={isRolling ? { rotate: [0, 360, 720, 1080], scale: [1, 1.2, 0.8, 1] } : {}}
        transition={{ duration: 1.5, ease: 'circInOut' }}
      >
        <Icon className="w-24 h-24 text-purple-600" />
      </motion.div>
    </div>
  );
};

function NumberGuessGame({ walletConnected, balance, onWin, onLoss, onConnectWallet }) {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState(1);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [gameResult, setGameResult] = useState(null); // 'win', 'loss', or null
  const betAmount = 0.05;

  const handleRoll = () => {
    if (isRolling) return;
    if (selectedNumber === null) {
      toast({ title: '🤔 Select a Number', description: 'Please pick a number from 1 to 6 before rolling.' });
      return;
    }
    if (!walletConnected) {
      toast({ title: '⚠️ Wallet Not Connected', description: 'Please connect your wallet to play.', variant: 'destructive' });
      return;
    }
    if (balance < betAmount) {
      toast({ title: 'Insufficient Funds', description: `You need at least ${betAmount} ETH to play.`, variant: 'destructive' });
      return;
    }

    setIsRolling(true);
    setGameResult(null);

    const rollInterval = setInterval(() => {
        setResult(Math.floor(Math.random() * 6) + 1);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      const outcome = Math.floor(Math.random() * 6) + 1;
      setResult(outcome);
      setIsRolling(false);

      if (selectedNumber === outcome) {
        onWin(betAmount); // Double the bet means winning the bet amount
        setGameResult('win');
      } else {
        onLoss(betAmount);
        setGameResult('loss');
      }
      setSelectedNumber(null);
    }, 1500);
  };
  
  const getResultMessage = () => {
    if (gameResult === 'win') {
      return (
        <motion.p 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-3xl font-bold mt-2 text-green-400"
        >
          🎉 You Won! 🎉
        </motion.p>
      );
    }
    if (gameResult === 'loss') {
      return (
        <motion.p 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-3xl font-bold mt-2 text-red-400"
        >
          😥 Unlucky! Try Again! 😥
        </motion.p>
      );
    }
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="text-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-600 bg-clip-text text-transparent">
          Guess & Win
        </h2>
        <p className="text-white/80 mb-6">Pick a number. If it matches the dice, you win {betAmount} ETH!</p>

        <div className="flex justify-center items-center mb-6 h-48">
          <Dice isRolling={isRolling} result={result} />
        </div>
        
        <div className="mb-6 h-10">
            {getResultMessage()}
        </div>

        {!walletConnected ? (
          <div className="mt-8 flex flex-col items-center gap-4">
             <p className="text-xl text-yellow-300">Connect your wallet to start playing!</p>
             <Button onClick={onConnectWallet} size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-bold py-4 px-8 rounded-2xl text-lg">
                <Wallet className="w-6 h-6 mr-3" />
                Connect Wallet
              </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-lg mb-4">Choose your lucky number:</p>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <Button
                    key={num}
                    onClick={() => setSelectedNumber(num)}
                    variant="outline"
                    size="icon"
                    disabled={isRolling}
                    className={`w-14 h-14 text-2xl font-bold rounded-xl border-2 transition-all duration-200 ${selectedNumber === num ? 'bg-cyan-500 border-cyan-300 text-white scale-110' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={handleRoll} disabled={isRolling || selectedNumber === null} size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
              {isRolling ? 'Rolling...' : `Bet ${betAmount} ETH`}
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default NumberGuessGame;