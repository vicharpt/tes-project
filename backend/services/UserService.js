import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const getAll = async () => {
    return await prisma.users.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            gender: true,
            role: true
        }
    })
}
