import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RotateCcw, Trophy, Target } from 'lucide-react';

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

function DiceGame() {
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [score, setScore] = useState(0);
  const [rolls, setRolls] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('diceGameBestScore') || '0');
  });

  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    const rollInterval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      const finalDice1 = Math.floor(Math.random() * 6) + 1;
      const finalDice2 = Math.floor(Math.random() * 6) + 1;
      
      setDice1(finalDice1);
      setDice2(finalDice2);
      setIsRolling(false);
      
      const rollSum = finalDice1 + finalDice2;
      const newScore = score + rollSum;
      const newRolls = rolls + 1;
      
      setScore(newScore);
      setRolls(newRolls);
      
      const newRoll = {
        id: Date.now(),
        dice1: finalDice1,
        dice2: finalDice2,
        sum: rollSum,
        roll: newRolls
      };
      setGameHistory(prev => [newRoll, ...prev.slice(0, 9)]);
      
      if (finalDice1 === finalDice2) {
        if (finalDice1 === 6) {
          toast({ title: "🎉 DOUBLE SIXES!", description: "Amazing roll! You got the jackpot!" });
        } else {
          toast({ title: `🎲 Double ${finalDice1}s!`, description: "Nice matching pair!" });
        }
      } else if (rollSum === 7) {
        toast({ title: "🍀 Lucky Seven!", description: "The classic lucky number!" });
      }
      
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('diceGameBestScore', newScore.toString());
        toast({ title: "🏆 NEW RECORD!", description: `You beat your best score of ${bestScore}!` });
      }
    }, 1000);
  };

  const resetGame = () => {
    setScore(0);
    setRolls(0);
    setGameHistory([]);
    setDice1(1);
    setDice2(1);
    toast({ title: "🔄 Game Reset", description: "Ready for a fresh start!" });
  };

  const Dice1Icon = diceIcons[dice1 - 1];
  const Dice2Icon = diceIcons[dice2 - 1];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-4">
                <Trophy className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{score}</div>
                <div className="text-sm text-white/80">Total Score</div>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-cyan-600 rounded-2xl p-4">
                <Target className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{rolls}</div>
                <div className="text-sm text-white/80">Rolls</div>
              </div>
              <div className="bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl p-4">
                <Trophy className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{bestScore}</div>
                <div className="text-sm text-white/80">Best Score</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center"
          >
            <div className="flex justify-center items-center gap-8 mb-8">
              <motion.div
                animate={isRolling ? { rotateY: 360 * 2, rotateX: 360 * 2, scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="bg-white rounded-2xl p-6 shadow-2xl"
              >
                <Dice1Icon className="w-16 h-16 text-red-500" />
              </motion.div>
              <motion.div
                animate={isRolling ? { rotateY: -360 * 2, rotateX: -360 * 2, scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="bg-white rounded-2xl p-6 shadow-2xl"
              >
                <Dice2Icon className="w-16 h-16 text-blue-500" />
              </motion.div>
            </div>
            {dice1 + dice2 > 0 && !isRolling && (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-3xl font-bold text-white mb-6">
                Sum: <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">{dice1 + dice2}</span>
              </motion.div>
            )}
            <div className="flex gap-4 justify-center">
              <Button onClick={rollDice} disabled={isRolling} size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50">
                {isRolling ? 'Rolling...' : 'Roll Dice'}
              </Button>
              <Button onClick={resetGame} variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 font-bold py-4 px-6 rounded-2xl text-lg">
                <RotateCcw className="w-5 h-5 mr-2" /> Reset
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Roll History</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {gameHistory.length > 0 ? gameHistory.map((roll, i) => (
                  <motion.div
                    key={roll.id}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/5 rounded-xl p-3 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/60">#{roll.roll}</span>
                      {React.createElement(diceIcons[roll.dice1 - 1], { className: "w-4 h-4 text-red-400" })}
                      {React.createElement(diceIcons[roll.dice2 - 1], { className: "w-4 h-4 text-blue-400" })}
                    </div>
                    <div className="text-white font-bold">{roll.sum}</div>
                  </motion.div>
                )) : (
                  <div className="text-center text-white/60 py-8">
                    <div className="text-4xl mb-2">🎲</div>
                    <p>Start rolling to see history!</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default DiceGame;