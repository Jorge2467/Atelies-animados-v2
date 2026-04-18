import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles } from 'lucide-react';

export function LoginKidView() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleKeyPress = async (num: number) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        const success = await login(newPin);
        if (!success) {
          setError(true);
          setTimeout(() => setPin(''), 1000); // Reset after 1 second if wrong
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-black to-[#0A0A0C]">
      {/* Background Magic Particles */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.05)_0%,transparent_50%)] pointer-events-none" 
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl shadow-[0_0_50px_rgba(0,240,255,0.1)] text-center max-w-sm w-full"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-neon-blue to-neon-fuchsia rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,0,85,0.4)]">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Ateliê Mágico</h1>
        <p className="text-white/60 mb-8 font-medium">Toca no teu código secreto!</p>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-4 mb-10 h-6">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={error ? { x: [-10, 10, -10, 10, 0], backgroundColor: '#FF0055' } : {}}
              transition={{ duration: 0.4 }}
              className={`w-6 h-6 rounded-full transition-all duration-300 ${
                pin.length > i 
                  ? 'bg-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.8)] scale-110' 
                  : 'bg-white/10 border border-white/20'
              }`}
            />
          ))}
        </div>

        {/* Giant Numpad */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.95, backgroundColor: 'rgba(0,240,255,0.3)' }}
              onClick={() => handleKeyPress(num)}
              className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl font-bold text-white transition-colors"
            >
              {num}
            </motion.button>
          ))}
          <div /> {/* Empty space bottom left */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.95, backgroundColor: 'rgba(0,240,255,0.3)' }}
            onClick={() => handleKeyPress(0)}
            className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl font-bold text-white transition-colors"
          >
            0
          </motion.button>
          <motion.button
             whileTap={{ scale: 0.9 }}
             onClick={handleDelete}
             className="aspect-square rounded-2xl flex items-center justify-center text-white/50 hover:text-white/90 transition-colors"
          >
            Apagar
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
