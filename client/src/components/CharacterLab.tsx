import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';

export function CharacterLab() {
  const [loading, setLoading] = useState(false);
  const [character, setCharacter] = useState<string | null>(null);

  const generateMagic = () => {
    setLoading(true);
    // Simulate generation latency
    setTimeout(() => {
      setCharacter('https://image.pollinations.ai/prompt/cute%20pixar%20style%20musical%20instrument%20character%20timbales%20dark%20background?nologo=true');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="glass-panel p-10 rounded-[2rem] w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-10 mt-10">
      
      {/* Visualizer Area */}
      <div className="flex-1 border border-white/5 bg-black/20 rounded-[1.5rem] overflow-hidden relative aspect-square flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              {/* Brilliant Skeleton Loader */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="w-32 h-32 rounded-full border-4 border-t-neon-fuchsia border-r-neon-blue border-b-neon-yellow border-l-transparent"
              />
              <p className="mt-6 text-white/70 font-semibold tracking-wider uppercase text-sm animate-pulse">
                Criando Magia...
              </p>
            </motion.div>
          ) : character ? (
            <motion.img 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              src={character} 
              alt="Personagem Criado" 
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.div 
              key="empty"
              className="text-center text-white/30 p-10"
            >
              <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">O estúdio está vazio</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Area */}
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-2">Laboratório</h2>
          <p className="text-white/60 text-lg leading-relaxed">
            Escreve a tua ideia e a inteligência irá desenhar um novo amigo musical estilo Pixar.
          </p>
        </div>
        
        <textarea 
          placeholder="Ex: Um tambor de lata muito animado..."
          className="w-full bg-black/30 border border-white/10 rounded-2xl p-6 text-white text-lg focus:outline-none focus:ring-2 focus:ring-neon-fuchsia/50 focus:border-neon-fuchsia/50 transition-all resize-none h-32 placeholder:text-white/20"
        />

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateMagic}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-neon-fuchsia to-neon-blue text-white font-bold text-xl shadow-[0_0_30px_rgba(255,0,85,0.4)] flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <Sparkles className="w-6 h-6" />
          <span>Criar Personagem</span>
        </motion.button>
      </div>

    </div>
  );
}
