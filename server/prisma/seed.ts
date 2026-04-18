import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma Database Seed...');

  // Reset Alumnos (Cascades into everything else)
  await prisma.alumno.deleteMany();

  const alumnosData = [
    { nome: 'Leo', idade: 5, codigo_vinculo: '1111' },
    { nome: 'Sofia', idade: 6, codigo_vinculo: '2222' },
    { nome: 'Miguel', idade: 7, codigo_vinculo: '3333' }
  ];

  for (const a of alumnosData) {
    const alumno = await prisma.alumno.create({ data: a });
    console.log(`✅ Criado Alumno Simulado: ${alumno.nome} (PIN: ${alumno.codigo_vinculo})`);
  }

  console.log('🌲 Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
