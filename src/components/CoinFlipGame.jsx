import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Coins, Wallet } from 'lucide-react';

const Coin = ({ isFlipping, result }) => {
  return (
    <div style={{ perspective: '1000px' }} className="w-48 h-48">
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isFlipping ? 1800 : (result === 'Heads' ? 0 : 180) }}
        transition={{ duration: 3, ease: 'easeInOut' }}
      >
        <div className="absolute w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full shadow-2xl border-4 border-yellow-200" style={{ backfaceVisibility: 'hidden' }}>
          <span className="text-4xl font-bold text-white text-shadow">H</span>
        </div>
        <div className="absolute w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600 rounded-full shadow-2xl border-4 border-gray-200" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <span className="text-4xl font-bold text-white text-shadow">T</span>
        </div>
      </motion.div>
    </div>
  );
};

function CoinFlipGame({ walletConnected, balance, onWin, onLoss, onConnectWallet }) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState('Heads');
  const [choice, setChoice] = useState(null);
  const betAmount = 0.01;
  const historyRef = useRef([]);

  const getOutcome = () => {
    const lastThree = historyRef.current.slice(-3);
    if (lastThree.length === 3 && lastThree.every(res => res === lastThree[0])) {
      // If the last 3 results were the same, heavily favor the opposite.
      const lastResult = lastThree[0];
      return Math.random() < 0.75 ? (lastResult === 'Heads' ? 'Tails' : 'Heads') : lastResult;
    }
    // Default 50/50 chance
    return Math.random() < 0.5 ? 'Heads' : 'Tails';
  };

  const handleFlip = (playerChoice) => {
    if (isFlipping) return;
    if (!walletConnected) {
      toast({ title: '⚠️ Wallet Not Connected', description: 'Please connect your wallet to play.', variant: 'destructive' });
      return;
    }
    if (balance < betAmount) {
      toast({ title: 'Insufficient Funds', description: `You need at least ${betAmount} ETH to play.`, variant: 'destructive' });
      return;
    }

    setChoice(playerChoice);
    setIsFlipping(true);

    setTimeout(() => {
      const outcome = getOutcome();
      historyRef.current.push(outcome);
      if (historyRef.current.length > 10) {
        historyRef.current.shift(); // Keep history size manageable
      }

      setResult(outcome);
      setIsFlipping(false);

      if (playerChoice === outcome) {
        onWin(betAmount);
      } else {
        onLoss(betAmount);
      }
    }, 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="text-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Coin Flip Challenge
        </h2>
        <p className="text-white/80 mb-8">Choose Heads or Tails. Bet {betAmount} ETH to win double!</p>
        
        <div className="flex justify-center items-center mb-8 h-48">
          <Coin isFlipping={isFlipping} result={result} />
        </div>

        {!isFlipping && result && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-8 h-20">
            <p className="text-2xl font-semibold">The result is: <span className="font-bold text-yellow-400">{result}</span></p>
            {choice && (
              <p className={`text-3xl font-bold mt-2 ${choice === result ? 'text-green-400' : 'text-red-400'}`}>
                {choice === result ? '🎉 You Won! 🎉' : '😥 You Lost! 😥'}
              </p>
            )}
          </motion.div>
        )}

        {isFlipping && (
           <div className="mb-8 h-20 flex items-center justify-center text-2xl font-semibold text-cyan-300 animate-pulse">Flipping...</div>
        )}

        {!walletConnected ? (
          <div className="mt-8 flex flex-col items-center gap-4">
             <p className="text-xl text-yellow-300">Connect your wallet to start playing!</p>
             <Button onClick={onConnectWallet} size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-bold py-4 px-8 rounded-2xl text-lg">
                <Wallet className="w-6 h-6 mr-3" />
                Connect Wallet
              </Button>
          </div>
        ) : (
          <div className="flex justify-center gap-6">
            <Button onClick={() => handleFlip('Heads')} disabled={isFlipping} size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50">
              Heads
            </Button>
            <Button onClick={() => handleFlip('Tails')} disabled={isFlipping} size="lg" className="bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50">
              Tails
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default CoinFlipGame;