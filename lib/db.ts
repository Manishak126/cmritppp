import { PrismaClient } from "@prisma/client";

// // Declare global `prisma` with `let` instead of `var`
// declare global {
//   var prisma: PrismaClient | undefined;
// }

// export const db = globalThis.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   globalThis.prisma = db;
// }

const globalForPrisma = global as unknown as {prisma: PrismaClient}

export const db= globalForPrisma.prisma || new PrismaClient({
    log: ['query']
})

if (process.env.NODE_ENV!=='production'){
    globalForPrisma.prisma=db;
}