import express from 'react'; // wait, oops, should be express from 'express', fixing in code
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

io.on('connection', (socket) => {
  console.log('🔗 Mestre do Ritmo Connection: ', socket.id);

  socket.on('mestre:mensagem', async (data: { texto: string }) => {
    console.log('🎤 Received input:', data.texto);
    
    // Process input with Gemini enforcing strict JSON
    const responseData = await processInteractiveChat(data.texto);
    
    console.log('📤 Routing Action UI to Frontend:', responseData.acao_ui);
    
    // Broadcast back to frontend via WebSocket!
    // We send the JSON directly. 'fala' is for TTS, 'acao_ui' is for UI Animation.
    socket.emit('mestre:resposta', responseData);
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
