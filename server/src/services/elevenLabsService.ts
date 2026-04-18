import { Socket } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';

// Using 'Rachel' (21m00Tcm4TlvDq8ikWAM) - a highly popular female voice that adapts beautifully to strict European Portuguese in multilingual_v2 without the heavy Brazilian twang
const MESTRE_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; 

export const streamAudioToSocket = async (text: string, socket: Socket) => {
  if (!ELEVENLABS_API_KEY) {
    console.error("No ElevenLabs API key found!");
    return;
  }

  try {
    console.log(`[ElevenLabs] Iniciando petición de audio al servidor TTS...`);
    const t0 = Date.now();
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${MESTRE_VOICE_ID}?optimize_streaming_latency=0`;
    
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
          stability: 0.35,
          similarity_boost: 0.5,
          style: 0.70,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[ElevenLabs] Error en la petición:", err);
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log(`[ElevenLabs] ✅ Audio generado completo en ${Date.now() - t0}ms. Tamaño: ${arrayBuffer.byteLength} bytes.`);
    
    // Emit the complete pristine buffer to guarantee ZERO UI stutters
    socket.emit('mestre:resposta_audio', Buffer.from(arrayBuffer));
    socket.emit('mestre:audio_end');
  } catch (error) {
    console.error("[ElevenLabs] Ha ocurrido un error en el streaming de audio:", error);
  }
};
