import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  // Aks holda `pg` localhost:5432 ga ulanishga urinadi va chalg'ituvchi
  // "ECONNREFUSED" xatosi chiqadi — sabab esa aslida yo'q .env bo'ladi.
  if (!connectionString) {
    throw new Error("DATABASE_URL o'rnatilmagan — .env faylini tekshiring.");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
