import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';

interface MestreResponse {
  fala: string;
  emocao: string;
  acao_ui: string;
  alvo: string;
}

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  isThinking: boolean;
  isRewardActive: boolean;
  latestResponse: MestreResponse | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (texto: string) => void;
  resetAction: () => void;
  setRewardState: (state: boolean) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  isThinking: false,
  isRewardActive: false,
  latestResponse: null,

  connect: () => {
    if (get().socket) return;
    
    // Retrieve Auth Credentials dynamically
    const { alumno, sessaoId } = useAuthStore.getState();

    const newSocket = io('http://localhost:3006', {
      auth: { alumnoId: alumno?.id, sessaoId },
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      set({ isConnected: true, socket: newSocket });
    });

    newSocket.on('disconnect', () => {
      set({ isConnected: false });
    });

    newSocket.on('mestre:resposta', (data: MestreResponse) => {
      console.log("Recebido do Mestre:", data);
      set({ latestResponse: data, isThinking: false });
    });

    let audioContext: AudioContext;
    let audioQueue: ArrayBuffer[] = [];
    let isPlaying = false;
    let nextTime = 0;

    const playNextInQueue = async () => {
      if (audioQueue.length === 0 || !audioContext) {
        isPlaying = false;
        return;
      }

      isPlaying = true;
      const arrayBuffer = audioQueue.shift()!;
      
      try {
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);

        const currentTime = audioContext.currentTime;
        if (nextTime < currentTime) nextTime = currentTime;

        source.start(nextTime);
        nextTime += audioBuffer.duration;

        source.onended = () => {
          if (audioQueue.length === 0) {
             isPlaying = false;
             nextTime = 0;
          } else {
             playNextInQueue();
          }
        };
      } catch (err) {
        console.error("Audio decode error:", err);
        playNextInQueue();
      }
    };

    newSocket.on('mestre:resposta_audio', (arrayBuffer: ArrayBuffer) => {
      if (!audioContext) audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Push chunk into the queue
      audioQueue.push(arrayBuffer);
      if (!isPlaying) {
        playNextInQueue();
      }
    });

    set({ socket: newSocket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, isThinking: false });
    }
  },

  sendMessage: (texto: string) => {
    const { socket } = get();
    if (socket && socket.connected) {
      set({ isThinking: true, latestResponse: null });
      socket.emit('mestre:mensagem', { texto });
    }
  },

  resetAction: () => {
    // Allows clearing the animation trigger after it fired
    set((state) => ({
      latestResponse: state.latestResponse ? { ...state.latestResponse, acao_ui: 'nenhuma', alvo: '' } : null
    }));
  },

  setRewardState: (state: boolean) => {
    set({ isRewardActive: state });
  }
}));
