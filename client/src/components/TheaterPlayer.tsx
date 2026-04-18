import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocketStore } from '../store/useSocketStore';
import { Sparkles, X } from 'lucide-react';

export function TheaterPlayer() {
  const { latestResponse, resetAction, isRewardActive, setRewardState } = useSocketStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Trigger theater player if the socket sends a "recompensa_video" UI action
  useEffect(() => {
    if (latestResponse?.acao_ui === 'recompensa_video') {
      setRewardState(true);
    }
  }, [latestResponse, setRewardState]);

  // When reward becomes active, automatically play the preloaded video
  useEffect(() => {
    if (isRewardActive && videoRef.current) {
      videoRef.current.currentTime = 0; // Reset video to start
      videoRef.current.play().catch(e => console.warn("Autoplay was blocked:", e));
    }
  }, [isRewardActive]);

  const handleClose = () => {
    setRewardState(false);
    resetAction();
  };

  const handleVideoEnded = () => {
    handleClose();
  };

  return (
    <AnimatePresence>
      {isRewardActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backdropFilter: 'brightness(0.3) blur(10px)' }}
          exit={{ opacity: 0, backdropFilter: 'brightness(1) blur(0px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Overlay Click Catcher */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={handleClose} />

          {/* Central Dopamine Frame */}
          <motion.div
            initial={{ scale: 0.85, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative bg-black/60 border border-white/20 p-2 md:p-4 rounded-3xl md:rounded-[2.5rem] shadow-[0_0_80px_rgba(255,230,0,0.2)] max-w-5xl w-full aspect-video overflow-hidden z-10 glass-panel"
          >
            {/* Control Header */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20 pointer-events-none">
               <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full border border-white/10 backdrop-blur-md">
                 <Sparkles className="w-5 h-5 text-neon-yellow" />
                 <span className="text-white/90 font-bold uppercase tracking-wider text-sm">Prémio Mágico</span>
               </div>
               
               <button 
                 onClick={handleClose}
                 className="pointer-events-auto p-2 bg-black/40 hover:bg-white/20 text-white rounded-full border border-white/10 backdrop-blur-md transition-all"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>

            {/* AI Generated Video (Placeholder paths assuming generated Sora/Veo outputs) */}
            <div className="w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden relative bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                controls={false}
                onEnded={handleVideoEnded}
                playsInline
                preload="auto"
              >
                {/* Fallback to standard MP4 if webm is totally unsupported, but heavily preferring optimized formats */}
                <source src="/videos/reward.webm" type="video/webm" />
                <source src="/videos/reward.mp4" type="video/mp4" />
                <p className="text-white/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   Vídeo mágico a carregar...
                </p>
              </video>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
