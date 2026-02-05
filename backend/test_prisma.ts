
import { PrismaClient } from '@prisma/client';

async function main() {
  console.log('Testing PrismaClient...');
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: "file:./dev.db"
        }
      }
    });
    console.log('Client created with datasources');
    await prisma.$connect();
    console.log('Connected');
    await prisma.$disconnect();
  } catch (e) {
    console.error('Error with datasources:', e.message);
  }

  try {
    const prisma2 = new PrismaClient({
       datasourceUrl: "file:./dev.db"
    } as any);
    console.log('Client created with datasourceUrl');
    await prisma2.$connect();
    console.log('Connected 2');
    await prisma2.$disconnect();
  } catch (e) {
    console.error('Error with datasourceUrl:', e.message);
  }
}

main();
