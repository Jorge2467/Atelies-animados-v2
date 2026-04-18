import React, { useState } from 'react';
import { motion } from 'framer-motion';

const INSTRUMENTOS = [
  { id: 'timbales', nombre: 'Timbales', color: 'border-neon-blue/50 group-hover:border-neon-blue' },
  { id: 'adufe-folk', nombre: 'Adufe', color: 'border-neon-fuchsia/50 group-hover:border-neon-fuchsia' },
  { id: 'caixa', nombre: 'Caixa Clássica', color: 'border-neon-yellow/50 group-hover:border-neon-yellow' }
];

export function InstrumentGrid() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10">
      {INSTRUMENTOS.map((inst) => (
        <motion.div
          key={inst.id}
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
