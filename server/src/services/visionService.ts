import { fal } from "@fal-ai/client";

export async function gerarPersonagemPixar(ideiaCrianca: string) {
  try {
    // 1. INYECCIÓN DEL ESTÁNDAR VISUAL (El secreto del lujo)
    const promptMagico = `A 3D animated character of ${ideiaCrianca}. Pixar and Disney animation movie style, vibrant neon colors, glowing magical background, unreal engine 5 render, highly detailed, cute, masterpiece, 8k resolution.`;

    // 2. LLAMADA ULTRA-RÁPIDA A FAL.AI (Modelo Flux/SDXL)
    const result = await fal.subscribe("fal-ai/flux-schnell", {
      input: {
        prompt: promptMagico,
        image_size: "landscape_4_3",
        num_inference_steps: 4 // Velocidad extrema
      },
    }) as any;

    return result.data.images[0].url; // Devuelve la URL real de la imagen generada
  } catch (error) {
    console.error("Erro no Laboratório de Imagens:", error);
    throw new Error("O forno mágico quebrou!");
  }
}
