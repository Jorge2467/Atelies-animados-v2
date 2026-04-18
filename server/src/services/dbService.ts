import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fired in background to prevent blocking the socket tunnel
export const logInteracao = async (alumnoId: string, sessaoId: string, acao_ui: string, alvo: string) => {
  // Validate basic data to prevent Prisma exceptions for empty strings if required
  if (!alumnoId || !sessaoId || !acao_ui) {
     throw new Error("Missing required Interaction parameters");
  }

  await prisma.interacao.create({
    data: {
      alumnoId,
      sessaoId,
      acao_ui,
      alvo: alvo || "genérico",
    }
  });

  console.log(`[PRISMA] Interacción guardada silenciosamente: [${acao_ui}] -> ${alvo}`);
};
