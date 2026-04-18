import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CharacterLab() {
  const [ideia, setIdeia] = useState('');
  const [imagemUrl, setImagemUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const criarPersonagem = async () => {
    if (!ideia) return;
    setCarregando(true);
    setImagemUrl(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://vapi.v2.aulasonlinepercussao.com';
      const response = await fetch(`${API_URL}/api/laboratorio/gerar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideia })
      });
      const data = await response.json();
      setImagemUrl(data.url);
    } catch (error) {
      console.error("Error al generar", error);
    } finally {
      setCarregando(false);
    }
  };
  
  return (
    <div className="p-8 bg-[#0A0A0C] flex flex-col items-center rounded-[2rem] w-full max-w-4xl mx-auto mt-10 shadow-2xl border border-white/5">
      <h1 className="text-4xl text-white font-bold mb-8">Ateliê de Invenções ✨</h1>
      
      <div className="flex gap-4 w-full max-w-2xl mb-12 flex-col md:flex-row">
        <input 
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xl backdrop-blur-md focus:border-[#00F0FF] outline-none transition-all"
          placeholder="Ex: Um bombo com pernas de aranha..."
          value={ideia}
          onChange={(e) => setIdeia(e.target.value)}
        />
        <button 
          onClick={criarPersonagem}
          className="bg-gradient-to-r from-[#00F0FF] to-[#0055FF] text-white font-bold text-xl px-8 py-4 rounded-2xl hover:scale-105 transition-transform"
        >
          Criar! 🪄
        </button>
      </div>

      <AnimatePresence>
        {carregando && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-[#00F0FF] text-2xl font-bold animate-pulse text-center w-full my-10"
          >
            A misturar tintas mágicas... 🎨
          </motion.div>
        )}

        {imagemUrl && !carregando && (
          <motion.img 
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            src={imagemUrl} 
            alt="Personagem Gerado" 
            className="w-full max-w-2xl rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.3)] border border-white/10"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
