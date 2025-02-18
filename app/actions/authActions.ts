'use server'

import { signIn, signOut } from "@/auth";
import { signUpSchema } from "@/lib/zod";
import { AuthError } from "next-auth";
import bcryptjs from 'bcryptjs'
import prisma from "@/lib/prisma";

export async function handleCredentialsSignIn({ email, password } : {
    email: string;
    password: string;
}) {
    try {
        await signIn("credentials", { email, password, redirectTo: '/'});
    } catch(error) {
        if(error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin': 
                    return { 
                        message: 'Invalid credentials!' 
                    }
                default: 
                    return { 
                        message: 'Something went wrong' 
                    }
            }
        }
        throw error;
    }
}

export async function handleGithubSignIn() {
    await signIn('github', { redirectTo: '/'});
}

export async function handleSignUp({ name, email, password, confirmPassword }: {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}) {
    try {
        const parsedCredentials = signUpSchema.safeParse({ name, email, password, confirmPassword });
        if(!parsedCredentials.success) {
            return { success: false, message: 'Invalid data' };
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            }
        });

        if(existingUser) {
            return { success: false, message: "Email already exists. Login to continue." };
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return { success: true, message: "Account created successfully" };
    } catch (error) {
        console.error('Error creating account:', error);
        return { success: false, message: 'An unexpected error occured. Please try again.'};
    }
}

export async function handleSignOut() {
    await signOut();
}