import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import DiceGame from '@/components/DiceGame';
import CoinFlipGame from '@/components/CoinFlipGame';
import NumberGuessGame from '@/components/NumberGuessGame';
import CoinShop from '@/components/CoinShop';
import { Wallet, Gamepad2, ShoppingCart } from 'lucide-react';

function App() {
  const [activeGame, setActiveGame] = useState('dice');
  const [walletConnected, setWalletConnected] = useState(false);
  const [balance, setBalance] = useState(0);

  const connectWallet = () => {
    toast({
      title: "🔗 Connecting Wallet...",
      description: "Please wait while we connect to your wallet.",
    });
    setTimeout(() => {
      setWalletConnected(true);
      const initialBalance = parseFloat((Math.random() * 10).toFixed(4));
      setBalance(initialBalance);
      toast({
        title: "✅ Wallet Connected!",
        description: `Your balance is ${initialBalance} ETH.`,
      });
    }, 2000);
  };

  const handleWin = (amount) => {
    setBalance(prev => parseFloat((prev + amount).toFixed(4)));
    toast({
      title: "🎉 You Won!",
      description: `+${amount} added to your balance.`,
      className: 'bg-green-500 border-green-700 text-white',
    });
  };

  const handleLoss = (amount) => {
    setBalance(prev => Math.max(0, parseFloat((prev - amount).toFixed(4))));
    toast({
      title: "😥 You Lost!",
      description: `-${amount} deducted from your balance.`,
      variant: 'destructive',
    });
  };
  
  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  return (
    <>
      <Helmet>
        <title>Crypto Arcade - Play, Buy, and Sell!</title>
        <meta name="description" content="Play exciting crypto games, and trade your coins in the shop. Connect your wallet and start winning!" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 font-sans text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          <motion.header 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-between items-center gap-4 mb-6 p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20"
          >
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 text-cyan-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                Crypto Arcade
              </h1>
            </div>
            {walletConnected ? (
              <div className="bg-green-500/20 border border-green-400 text-green-300 px-4 py-2 rounded-xl font-mono text-lg">
                Balance: {balance.toFixed(4)} ETH
              </div>
            ) : (
              <Button onClick={connectWallet} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-bold">
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </Button>
            )}
          </motion.header>

          <div className="flex justify-center mb-8">
            <div className="bg-white/10 p-1.5 rounded-full flex flex-wrap gap-2">
              <Button
                onClick={() => setActiveGame('dice')}
                className={`rounded-full px-6 py-3 text-base font-semibold transition-colors duration-300 ${activeGame === 'dice' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg' : 'bg-transparent text-white/70 hover:bg-white/10'}`}
              >
                🎲 Dice Roll
              </Button>
              <Button
                onClick={() => setActiveGame('coin')}
                className={`rounded-full px-6 py-3 text-base font-semibold transition-colors duration-300 ${activeGame === 'coin' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg' : 'bg-transparent text-white/70 hover:bg-white/10'}`}
              >
                🪙 Coin Flip
              </Button>
              <Button
                onClick={() => setActiveGame('numberGuess')}
                className={`rounded-full px-6 py-3 text-base font-semibold transition-colors duration-300 ${activeGame === 'numberGuess' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg' : 'bg-transparent text-white/70 hover:bg-white/10'}`}
              >
                🎯 Guess & Win
              </Button>
               <Button
                onClick={() => setActiveGame('shop')}
                className={`rounded-full px-6 py-3 text-base font-semibold transition-colors duration-300 ${activeGame === 'shop' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg' : 'bg-transparent text-white/70 hover:bg-white/10'}`}
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Coin Shop
              </Button>
            </div>
          </div>

          <main>
            <AnimatePresence mode="wait">
              {activeGame === 'dice' && <DiceGame key="dice" />}
              {activeGame === 'coin' && (
                <CoinFlipGame 
                  key="coin" 
                  walletConnected={walletConnected}
                  balance={balance}
                  onWin={handleWin}
                  onLoss={handleLoss}
                  onConnectWallet={connectWallet}
                />
              )}
              {activeGame === 'numberGuess' && (
                <NumberGuessGame 
                  key="numberGuess"
                  walletConnected={walletConnected}
                  balance={balance}
                  onWin={handleWin}
                  onLoss={handleLoss}
                  onConnectWallet={connectWallet}
                />
              )}
              {activeGame === 'shop' && (
                <CoinShop
                  key="shop"
                  walletConnected={walletConnected}
                  balance={balance}
                  onConnectWallet={connectWallet}
                  updateBalance={updateBalance}
                />
              )}
            </AnimatePresence>
          </main>
        </div>
        
        <Toaster />
      </div>
    </>
  );
}

export default App;