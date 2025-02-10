import { BugStatus, Priority } from "@prisma/client";

export interface Bugs{
    title: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: BugStatus;
    description: string;
    projectId: string;
    priority: Priority;
    reporterId: string;
    assigneeId: string | null;
}