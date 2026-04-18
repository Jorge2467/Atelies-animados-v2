import { Socket } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';

// A high energy voice suitable for animation/gaming ("Callum", "Charlie", or an energetic custom profile. We use a known standard one: 'pNInz6obbfdqIeCQzv0m' or 'JBFqnCBcs6QImihOSt97' but since the exact ID isn't mandated, we pick one of the core lively voices: Adam 'pNInz6obbfdqIeCQzv0m' or standard lively male like Charlie 'IKne3meq5aSn9XLyUdCD'). Let's use Charlie.
const MESTRE_VOICE_ID = 'IKne3meq5aSn9XLyUdCD'; 

export const streamAudioToSocket = async (text: string, socket: Socket) => {
  if (!ELEVENLABS_API_KEY) {
    console.error("No ElevenLabs API key found!");
    return;
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${MESTRE_VOICE_ID}/stream?optimize_streaming_latency=3`;

  try {
    console.log(`[ElevenLabs] Iniciando conexión de stream para fala...`);
    const t0 = Date.now();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.35, // Bajo para emociones fluctuantes
          similarity_boost: 0.5,
          style: 0.70, // Alta exageración de estilo (Pixar/Disney)
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[ElevenLabs] Error en la petición:", err);
      return;
    }

    if (response.body) {
      const reader = response.body.getReader();
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        
        if (firstChunk && value) {
           console.log(`[ElevenLabs] ⏳ TTFB (Time To First Byte de Audio): ${Date.now() - t0}ms`);
           firstChunk = false;
        }

        if (done) {
          // Emitir un evento de fin de audio si es necesario para el frontend
          socket.emit('mestre:audio_end');
          console.log(`[ElevenLabs] ✅ Stream completado exitosamente.`);
          break;
        }

        // Enviamos el chunk crudo (Uint8Array) mediante WebSocket (Socket.io lo maneja bien y llega como ArrayBuffer)
        socket.emit('mestre:resposta_audio', value);
      }
    }
  } catch (error) {
    console.error("[ElevenLabs] Ha ocurrido un error en el streaming de audio:", error);
  }
};
