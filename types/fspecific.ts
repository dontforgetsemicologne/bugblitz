import { BugStatus, Priority } from "@prisma/client";

export interface Bug {
    id: string;
    title: string;
    description: string;
    status: BugStatus;
    priority: Priority;
    createdAt: Date;
    updatedAt: Date;
    project: {
        id: string;
        name: string;
        description: string | null;
    };
    reporter: {
        name: string | null;
        email: string;
    };
    assignee: {
        name: string | null;
        email: string;
        image: string | null;
    } | null;
    comments: any[];
    labels: any[];
}