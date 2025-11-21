
import { prisma } from "../../utils/prisma";



export async function findUserByEmail(email: string) {
    const existingUser = await prisma.users.findFirst({
        where: {
            email,
        },
    });
    return existingUser;
}

