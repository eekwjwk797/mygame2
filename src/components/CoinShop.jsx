import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Wallet, Upload, Copy, ShoppingCart, ArrowRightLeft } from 'lucide-react';

const ETH_WALLET_ADDRESS = "0x3FBCF6fcd5566818398f01Bb29Dc8f3da8dC256D";

const BuyCard = ({ onBuy }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(ETH_WALLET_ADDRESS);
    toast({
      title: "✅ Copied to Clipboard",
      description: "ETH wallet address has been copied.",
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    onBuy(file);
    setFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center w-full max-w-md">
      <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent mb-2">Buy Coins</h3>
      <p className="text-2xl font-semibold text-white mb-4">1000 Coins = 10 ETH</p>
      <div className="bg-black/20 p-4 rounded-xl mb-4">
        <p className="text-sm text-white/70 mb-1">Our ETH Wallet Address:</p>
        <div className="flex items-center justify-center gap-2 bg-black/30 p-2 rounded-lg">
          <p className="font-mono text-sm text-cyan-300 truncate">{ETH_WALLET_ADDRESS}</p>
          <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 text-white/70 hover:text-white">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-white/80 mb-4">Send ETH to the address above, then upload a screenshot of the transaction for verification.</p>
      <Button onClick={() => fileInputRef.current?.click()} className="w-full bg-white/20 hover:bg-white/30 mb-4">
        <Upload className="w-5 h-5 mr-2" />
        {file ? `Selected: ${file.name}` : 'Choose Screenshot'}
      </Button>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
      <Button onClick={handleSubmit} disabled={!file} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-bold text-lg py-3">
        Submit for Verification
      </Button>
    </div>
  );
};

const SellCard = ({ onSell, balance }) => {
    const amountToSell = 1000;
    const receiveAmount = 5;

    const handleSellClick = () => {
        onSell(amountToSell);
    }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center w-full max-w-md">
       <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">Sell Coins</h3>
       <p className="text-2xl font-semibold text-white mb-6">Sell {amountToSell} Coins for {receiveAmount} ETH</p>
       <p className="text-white/80 mb-4">We will transfer {receiveAmount} ETH to your connected wallet address upon confirmation.</p>
       <Button onClick={handleSellClick} disabled={balance < amountToSell} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 font-bold text-lg py-3 disabled:opacity-50">
        Sell {amountToSell} Coins
       </Button>
       {balance < amountToSell && (
        <p className="text-red-400 mt-2 text-sm">Not enough coins to sell.</p>
       )}
    </div>
  );
};

function CoinShop({ walletConnected, balance, onConnectWallet, updateBalance }) {
  
  const handleBuy = (file) => {
    if (!file) {
      toast({ title: '⚠️ No Screenshot', description: 'Please upload a screenshot of your transaction.', variant: 'destructive' });
      return;
    }
    toast({
      title: '✅ Submission Received',
      description: 'Your purchase is under review. Coins will be added to your balance within 24 hours after verification.',
    });
    // In a real app, this would trigger a backend process.
    // Here we can simulate it after a delay.
    setTimeout(() => {
        toast({
            title: "🎉 Purchase Verified!",
            description: "We've added 1000 Coins to your wallet!",
            className: 'bg-green-500 border-green-700 text-white',
        });
        updateBalance(balance + 1000);
    }, 10000);
  };

  const handleSell = (amount) => {
    if (balance < amount) {
        toast({ title: 'Insufficient Funds', description: `You need at least ${amount} coins to sell.`, variant: 'destructive' });
        return;
    }
    toast({
        title: '✅ Sell Order Placed',
        description: `We are processing your sale of ${amount} coins. You will receive 5 ETH in your wallet shortly.`,
    });
    updateBalance(balance - amount);
    // Simulate receiving ETH
     setTimeout(() => {
        toast({
            title: "💸 Transfer Complete!",
            description: "5 ETH has been sent to your connected wallet.",
            className: 'bg-blue-500 border-blue-700 text-white',
        });
    }, 5000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="text-center">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            <ShoppingCart className="inline-block w-10 h-10 mr-2 -mt-1" />
            Coin Shop
        </h2>
        <p className="text-white/80 mb-8 max-w-2xl mx-auto">Buy coins to power up your game, or sell your winnings for ETH. All transactions are manually verified for security.</p>
        
        {!walletConnected ? (
          <div className="mt-8 flex flex-col items-center gap-4 bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
             <p className="text-2xl text-yellow-300 font-bold">Connect Your Wallet to Access the Shop!</p>
             <Button onClick={onConnectWallet} size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-bold py-4 px-8 rounded-2xl text-lg mt-4">
                <Wallet className="w-6 h-6 mr-3" />
                Connect Wallet
              </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            <BuyCard onBuy={handleBuy} />
            <ArrowRightLeft className="w-8 h-8 text-cyan-300 my-4 lg:my-0" />
            <SellCard onSell={handleSell} balance={balance} />
          </div>
        )}
    </motion.div>
  );
}

export default CoinShop;