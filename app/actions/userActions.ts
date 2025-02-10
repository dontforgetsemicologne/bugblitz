'use server'

import { getUserByEmail } from "@/data/user";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function handleProfileUpdate({ name, email, role }: {
    name: string;
    email: string;
    role: string;
}) {
    try {
        const existingUser  = getUserByEmail(email);
        if(!existingUser ) {
            throw new Error('User not found');
        }

        const updateData = {
            name,
            role,
            updatedAt: new Date(),
        };

        const updatedUser = await prisma.user.update({
            where: {
                email: email,
            },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                updatedAt: true,
            },
        });
        revalidatePath('/profile-settings');
        return {
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser,
        };
    } catch (error) {
        console.error('Profile update error:', error);
        
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            };
        }
        
        return {
            success: false,
            message: 'Failed to update profile',
        };
    }
}

export async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, image: true }
        });

        return { success: true, users: users }
    } catch (error) {
        console.error('Error fetching users:', error);
        return { success: false, message: 'Failed to fetch users' }
    }
    
}