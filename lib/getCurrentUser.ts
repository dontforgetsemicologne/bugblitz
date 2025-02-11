import { auth } from "@/auth";
import { getUserById } from "@/data/user";
import { headers } from 'next/headers'

export async function getCurrentUser() {
    try {
        headers();

        const session = await auth();
        if(!session?.user.id) {
            return null;
        }

        const currentUser = await getUserById(session.user.id);
        if(!currentUser) {
            return null;
        }

        return {
            ...currentUser,
            createdAt: currentUser.createdAt.toISOString(),
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified: currentUser.emailVerified?.toISOString() || null,
        }
    } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
    }
}