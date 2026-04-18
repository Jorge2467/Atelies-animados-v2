const { io } = require("socket.io-client");

console.log("Iniciando prueba de fuego E2E de latencia...");

const socket = io("http://localhost:3006");

socket.on("connect", () => {
    console.log("✅ Conectado al Túnel Mágico en puerto 3006");
    
    const startTime = Date.now();
    const testMessage = "Professor, como é que se toca uma caixa de clássica? Toca aí!";
    
    console.log(`📤 Enviando: "${testMessage}"`);
    socket.emit("mestre:mensagem", { texto: testMessage });

    socket.on("mestre:resposta", (data) => {
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        console.log("\n📥 [RESPUESTA DEL AI - ZERO LATENCY TEST]");
        console.log(`⏱️  Latencia Total Backend+API (JSON): ${latency}ms (${(latency/1000).toFixed(2)} segundos)`);
        console.log(`📦 JSON Recibido (Parseado nativamente):`);
        console.log(JSON.stringify(data, null, 2));
        
        if (data.acao_ui && data.alvo) {
             console.log(`\n✨ Magia de UI activada! Componente '${data.alvo}' recibirá comando de '${data.acao_ui}' enviando trigger a Zustard y Framer Motion.`);
        }
    });

    let firstAudioChunk = true;
    socket.on("mestre:resposta_audio", (chunk) => {
        if (firstAudioChunk) {
            const endTime = Date.now();
            const latency = endTime - startTime;
            console.log("\n🔊 [AUDIO STREAM - TIME TO FIRST BYTE]");
            console.log(`⚡ TTFB (Desde Enter hasta que suena la voz en React): ${latency}ms (${(latency/1000).toFixed(2)} segundos)`);
            console.log(`📏 Tamaño del primer chunk: ${chunk.byteLength || chunk.length} bytes`);
            firstAudioChunk = false;
        }
    });

    socket.on("mestre:audio_end", () => {
         console.log("\n✅ [AUDIO STREAM COMPLETADO]");
         process.exit(0);
    });
});

socket.on("connect_error", (err) => {
    console.error("❌ Error conectando localmente:", err.message);
    process.exit(1);
});
