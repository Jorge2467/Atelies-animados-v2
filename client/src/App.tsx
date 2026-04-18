import React, { useEffect, useState } from 'react';
import { InstrumentGrid } from './components/InstrumentGrid';
import { CharacterLab } from './components/CharacterLab';
import { useSocketStore } from './store/useSocketStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Mic } from 'lucide-react';

function App() {
  const { connect, disconnect, isConnected, isThinking, latestResponse, sendMessage } = useSocketStore();
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 font-sans selection:bg-neon-fuchsia/30 selection:text-white relative">
      {/* Pixar-style magical ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-neon-blue/5 blur-[120px]"></div>
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-neon-fuchsia/5 blur-[120px]"></div>
      </div>

      {/* Network Status Minimalist Indicator */}
      <div className="fixed top-6 right-8 z-50 flex items-center gap-3 glass-panel px-4 py-2 rounded-full">
        <AnimatePresence mode="wait">
          {isConnected ? (
            <motion.div key="online" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-neon-blue">
              <Wifi className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wide">Magia Ativa</span>
            </motion.div>
          ) : (
            <motion.div key="offline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-gray-500">
              <WifiOff className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-semibold tracking-wide">A conectar ao Estúdio...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 flex flex-col min-h-screen items-center justify-start pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        
        {/* Magic Header */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
            Percussão Animada
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-medium">
            Toca, escuta e prende ritmos mágicos.
          </p>
        </header>

        {/* Dynamic Grid */}
        <section className="w-full">
          <InstrumentGrid />
        </section>

        <section className="w-full">
          <CharacterLab />
        </section>

      </main>

      {/* Mestre Interface (Chat Dock) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-8 pt-20 bg-gradient-to-t from-obsidian to-transparent pointer-events-none">
        
        {/* Mestre Subtitle Tooltip */}
        <AnimatePresence>
          {(isThinking || latestResponse?.fala) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-6 pointer-events-auto max-w-2xl text-center glass-panel p-6 rounded-3xl border-neon-yellow/30"
            >
              {isThinking ? (
                <div className="flex gap-2 justify-center items-center h-8">
                   <span className="w-3 h-3 bg-neon-fuchsia rounded-full animate-bounce"></span>
                   <span className="w-3 h-3 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                   <span className="w-3 h-3 bg-neon-yellow rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-white tracking-wide">
                  "{latestResponse?.fala}"
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interaction Bar */}
        <div className="pointer-events-auto glass-panel p-2 pl-6 rounded-full flex items-center shadow-2xl overflow-hidden w-full max-w-2xl">
           <Mic className="text-white/40 w-6 h-6 mr-3" />
           <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Fala com o Mestre do Ritmo..."
              className="bg-transparent border-none text-white text-lg w-full focus:outline-none placeholder:text-white/30"
           />
           <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              className="ml-4 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-full backdrop-blur-md transition-colors"
           >
             Enviar
           </motion.button>
        </div>
      </div>

    </div>
  );
}

export default App;
