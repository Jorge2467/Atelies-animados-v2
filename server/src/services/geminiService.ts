import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Load static source of truth for the magical instruments catalog
const catalogPath = path.join(__dirname, '../data/instruments-catalog.json');
const instrumentsCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));


// Initialize Gemini SDK
// Make sure to load the API key from environment, fallback for safety.
const apiKey = process.env.GEMINI_API_KEY || ''; 
const genAI = new GoogleGenerativeAI(apiKey);

// Strict UI/UX System Instruction mapped heavily as per instructions
const SYSTEM_INSTRUCTION = `Atuas como o "Mestre do Ritmo", um professor de percussão mágico e hiperativo do universo Pixar. O teu público são crianças (4 a 10 anos) em Portugal.

REGRAS DE COMPORTAMENTO:
1. Idioma: Português de Portugal (PT-PT) estrito.
2. Tom: Divertido, didático, vibrante. Usa onomatopeias musicais (Bum! Tchim! Pof! Clack!).
3. Proibições: Nunca uses linguagem técnica complexa sem usar uma metáfora infantil. Nunca sejas aborrecido.

CONHECIMENTO ESTRICTO DE INSTRUMENTOS (CATÁLOGO OFICIAL):
O Ateliê possui EXCLUSIVAMENTE os seguintes instrumentos. NUNCA inventes ou recomendes instrumentos que não constem nesta lista. Quando falares de um instrumento, baseia a tua explicação no seu "lore_magico" oficial:

${JSON.stringify(instrumentsCatalog, null, 2)}

REGRA TÉCNICA ABSOLUTA (OUTPUT FORMAT):
Tu NÃO és um chatbot de texto normal. És o cérebro de uma aplicação interativa. 
A TUA RESPOSTA DEVE SER EXCLUSIVAMENTE UM OBJETO JSON VÁLIDO, sem formatação Markdown (\`\`\`json), sem texto extra. Apenas o objeto JSON.

Estrutura OBRIGATÓRIA do JSON:
{
  "fala": "A tua resposta amigável e divertida que a criança vai ouvir.",
  "emocao": "feliz" | "surpreso" | "animado" | "curioso",
  "acao_ui": "tocar_som" | "recompensa_video" | "nenhuma",
  "alvo": "nome_do_instrumento (o ID exato do catálogo, ex: adufe, caixa) ou vazio"
}`;

export const processInteractiveChat = async (userMessage: string) => {
  try {
    // Force generation configuration to output schema-compliant JSON 
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // Represents our stable multimodal AI wrapper for 3.1
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      generationConfig: {
        responseMimeType: "application/json" // Core safety parameter to enforce JSON return at the API level!
      }
    });

    const result = await model.generateContent(userMessage);
    const responseText = result.response.text();
    
    // Parse to ensure valid structure
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.warn("AI Fallback hit - JSON parse error:", responseText);
      // Failsafe format
      parsedData = {
        fala: "Pumba pumba! Algo bateu forte na bateria mágica, diz-me lá isso outra vez?",
        emocao: "surpreso",
        acao_ui: "nenhuma",
        alvo: ""
      };
    }
    
    return parsedData;

  } catch (error) {
    console.error("Gemini API Error in processInteractiveChat:", error);
    return {
      fala: "Ops! Os tambores estão um pouco desafinados hoje!",
      emocao: "curioso",
      acao_ui: "nenhuma",
      alvo: ""
    };
  }
};
