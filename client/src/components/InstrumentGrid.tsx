import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useSocketStore } from '../store/useSocketStore';

const INSTRUMENTOS = [
  { id: 'timbales', nombre: 'Timbales', color: 'border-neon-blue/50 group-hover:border-neon-blue' },
  { id: 'adufe', nombre: 'Adufe', color: 'border-neon-fuchsia/50 group-hover:border-neon-fuchsia' },
  { id: 'caixa', nombre: 'Caixa Clássica', color: 'border-neon-yellow/50 group-hover:border-neon-yellow' },
];

export function InstrumentGrid() {
  const { latestResponse, resetAction } = useSocketStore();
  const [active, setActive] = useState<string | null>(null);

  // Controls for programmatic animation triggered by Gemini
  const controlsTimbales = useAnimation();
  const controlsAdufe = useAnimation();
  const controlsCaixa = useAnimation();

  const getControls = (id: string) => {
    if (id === 'timbales') return controlsTimbales;
    if (id === 'adufe') return controlsAdufe;
    return controlsCaixa;
  };

  useEffect(() => {
    if (latestResponse?.acao_ui === 'mostrar_instrumento' || latestResponse?.acao_ui === 'tocar_som') {
      const alvoId = latestResponse.alvo.toLowerCase();
      
      const targetControl = getControls(alvoId);
      
      if (targetControl && alvoId) {
        // Ejecutar Animación Física Mágica solicitada por Katie
        targetControl.start({
          scale: [1, 1.2, 1],
          y: [0, -30, 0],
          rotate: [0, -10, 10, 0],
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 15
          }
        }).then(() => {
          resetAction(); // Limpiar la accion tras terminar
        });
      }
    }
  }, [latestResponse, controlsTimbales, controlsAdufe, controlsCaixa, resetAction]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10">
      {INSTRUMENTOS.map((inst) => (
        <motion.div
          key={inst.id}
          animate={getControls(inst.id)}
          whileHover={{ scale: 1.05, y: -10 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActive(inst.id)}
          className={`group glass-panel rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${active === inst.id ? 'ring-2 shadow-[0_0_20px_rgba(0,240,255,0.5)]' : ''} ${inst.color}`}
        >
          <div className="w-32 h-32 rounded-full mb-6 bg-white/10 flex items-center justify-center overflow-hidden">
             <img src={`/images/${inst.id}.png`} alt={inst.nombre} className="opacity-80 group-hover:opacity-100 transition-opacity" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <h3 className="text-2xl font-bold font-sans text-white mb-4 group-hover:text-white/90">{inst.nombre}</h3>
          
          <button className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors border border-white/10 backdrop-blur-md text-white font-semibold">
            Tocar Ritmo
          </button>
        </motion.div>
      ))}
    </div>
  );
}
