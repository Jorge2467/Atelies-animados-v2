import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { processInteractiveChat } from './services/geminiService';

dotenv.config();

const app = require('express')(); // explicit require for commonjs/express typings workaround
app.use(cors());

const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // allow frontend access locally or deployed
    methods: ["GET", "POST"]
  }
});

import { streamAudioToSocket } from './services/elevenLabsService';
import { logInteracao } from './services/dbService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Habilitar parseo de JSON para Express REST API
app.use(express.json());

// Auth Route para el login tipo Netflix Kids
app.post('/api/auth/kid', async (req: Request, res: Response): Promise<any> => {
  try {
    const { codigo_vinculo } = req.body;
    
    if (!codigo_vinculo) {
      return res.status(400).json({ error: "PIN (codigo_vinculo) ausente." });
    }

    const alumno = await prisma.alumno.findFirst({
      where: { codigo_vinculo }
    });

    if (!alumno) {
      return res.status(401).json({ error: "Código PIN incorrecto ou Aluno não encontrado." });
    }

    // Login exitoso: Creamos una nueva sesión
    const sessao = await prisma.sessao.create({
      data: {
        alumnoId: alumno.id,
      }
    });

    res.json({
      alumno: {
        id: alumno.id,
        nome: alumno.nome,
        idade: alumno.idade
      },
      sessaoId: sessao.id
    });
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

import { gerarPersonagemPixar } from './services/visionService';

app.post('/api/laboratorio/gerar', async (req: Request, res: Response): Promise<any> => {
  try {
    const { ideia } = req.body;
    if (!ideia) {
      return res.status(400).json({ error: "A ideia é obrigatória!" });
    }
    const url = await gerarPersonagemPixar(ideia);
    res.json({ url });
  } catch (err) {
    console.error("Erro na API geradora:", err);
    res.status(500).json({ error: "Falha na geração mágica" });
  }
});

// Remove simulated IDs as we will now receive them from the socket auth proxy
// We will intercept the real IDs connecting to the tunnel

io.on('connection', (socket) => {
  // Extract identity from socket handshake
  const alumnoId = socket.handshake.auth?.alumnoId as string;
  const sessaoId = socket.handshake.auth?.sessaoId as string;

  if (!alumnoId || !sessaoId) {
    console.warn(`⚠️ Intento de conexión anónima o defectuosa rechazada: ${socket.id}`);
    socket.disconnect(true);
    return;
  }

  console.log(`🔗 Mestre do Ritmo Connection: ${socket.id} | Alumno: ${alumnoId} | Sessao: ${sessaoId}`);

  socket.on('mestre:mensagem', async (data: { texto: string }) => {
    console.log('🎤 Received input:', data.texto);
    
    // Process input with Gemini enforcing strict JSON
    const responseData = await processInteractiveChat(data.texto);
    
    console.log('📤 Routing Action UI to Frontend:', responseData.acao_ui);
    
    // Fire-and-forget Data Logging for the Business Metrics
    if (responseData.acao_ui) {
      logInteracao(alumnoId, sessaoId, responseData.acao_ui, responseData.alvo)
        .catch((err) => console.error("[PRISMA ERROR] Fallo al guardar interacción silenciosa:", err.message));
    }

    // Broadcast back to frontend via WebSocket!
    // We send the JSON directly. 'fala' is for TTS, 'acao_ui' is for UI Animation.
    socket.emit('mestre:resposta', responseData);
    
    // Initiate Real-Time ElevenLabs Streaming back to the client directly via websockets
    if (responseData.fala) {
       streamAudioToSocket(responseData.fala, socket).catch(e => console.error("ElevenLabs streaming error:", e));
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnect:', socket.id);
  });
});

const PORT = 3006;
server.listen(PORT, () => {
  console.log(`🥁 Servidor Percussão Animada 2.0 en línea [Puerto: ${PORT}]`);
  console.log(`🔌 WebSocket Tunnel Activo.`);
});
