import { Priority } from "@prisma/client";
import { z } from "zod";

export const signInSchema = z.object({
    email: z.string({ required_error: 'Email is required' })
        .min(1, 'Email is required')
        .email('Invalid email'),
    
    password: z.string({ required_error: 'Password is required'})
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
});

export const updateProfileSchema = z.object({
    name: z.string().optional(),
    role: z.string().optional()
})

export const signUpSchema = z.object({
    name: z.string({ required_error: 'Name is required'})
        .min(1, 'Name is required')
        .max(50, 'Name must be less than 50 characters'),

    email: z.string({ required_error: 'Email is required' })
        .min(1, 'Email is required')
        .email('Invalid email'),
    
    password: z.string({ required_error: 'Password is required'})
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
    
    confirmPassword: z.string({ required_error: 'Confirm password is required'})
        .min(1, 'Confirm password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don&apos;t  match',
    path: ['confirmPassword']
});

export const projectFormSchema = z.object({
    name: z.string({ required_error: 'Name is required'})
        .min(1, 'Name is required')
        .max(50, 'Name must be less than 50 characters'),

    description: z.string().optional(),

    members: z.array(z.string()).optional()
});

export const issueFormSchema = z.object({
    projectId: z.string({ required_error: 'Project ID is required'})
        .min(1, 'Project ID is required'),
    title: z.string({ required_error: 'Project ID is required'})
        .min(1, 'Title is required'),
    description: z.string().optional(),
    priority: z.nativeEnum(Priority).optional(),
    assigneeId: z.string(),
});