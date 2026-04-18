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
        console.log(`⏱️  Latencia Total Backend+API: ${latency}ms (${(latency/1000).toFixed(2)} segundos)`);
        console.log(`📦 JSON Recibido (Parseado nativamente):`);
        console.log(JSON.stringify(data, null, 2));
        
        if (data.acao_ui && data.alvo) {
             console.log(`\n✨ Magia de UI activada! Componente '${data.alvo}' recibirá comando de '${data.acao_ui}' enviando trigger a Zustard y Framer Motion.`);
        }
        
        process.exit(0);
    });
});

socket.on("connect_error", (err) => {
    console.error("❌ Error conectando localmente:", err.message);
    process.exit(1);
});
