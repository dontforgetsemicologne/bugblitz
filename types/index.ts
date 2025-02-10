import { BugStatus, Priority } from "@prisma/client";

export interface Bug {
    id: string;
    title: string;
    description: string;
    status: BugStatus;
    priority: Priority;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
    reporterId: string;
}
export type projectStatus = 'active' | 'completed' | 'in_progress' | 'inactive';

export interface Project {
    id: string;
    title: string;
    subtitle: string;
    status: projectStatus;
    progress: number;
    date: string;
    membersCount: number;
    bugsCount: number;
    bugs: Bug[];
}

export interface projectUser {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
}

export interface addUser {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    password: string | null;
    role: string;
    isEmailVerified: boolean;
}

export interface userAdd {
    image: string | null;
    id: string;
    name: string | null;
}