'use server'

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

import { BugStatus, Priority } from "@prisma/client";

export async function createBug(projectId: string, data: {
    title: string;
    description: string;
    priority?: Priority;
    assigneeId: string;
}) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { members: true }
    });
    if (!project) throw new Error("Project not found");

    const isMember = project.members.some(m => m.userId === user.id);
    if (!isMember) throw new Error("Not a project member");
    try {
        const bugs = await prisma.bug.create({
            data: {
                title: data.title,
                description: data.description,
                priority: data.priority,
                project: { connect: { id: projectId } },
                reporter: { connect: { id: user.id } },
                ...(data.assigneeId && {
                    assignee: { connect: { id: data.assigneeId } }
                })
            }
        });
    
        revalidatePath('/issues');
        return {
            success: true,
            message: 'Project added successfully',
            bug: bugs
        }
    } catch(error) {
        console.log(error);
        return {
            success: false,
            message: `Project wasn't added successfully`,
        }
    }
}

export async function updateBug(bugId: string, data: {
    title?: string;
    description?: string;
    status?: BugStatus;
    priority?: Priority;
    assigneeId?: string | null;
}) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const bug = await prisma.bug.findUnique({
        where: { id: bugId },
        include: { project: { include: { members: true } } }
    });
    if (!bug) throw new Error("Bug not found");

    const isMember = bug.project.members.some(m => m.userId === user.id);
    if (!isMember) throw new Error("Not authorized to update bug");

    const updatedBug = await prisma.bug.update({
        where: { id: bugId },
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          ...(data.assigneeId && {
            assignee: { connect: { id: data.assigneeId } }
          })
        }
    });
    
    revalidatePath(`/issues/${bugId}`);
    return updatedBug;
}

export async function deleteBug(bugId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");
    try {
        const bug = await prisma.bug.findUnique({
            where: { id: bugId },
            include: { project: { include: { members: true } } }
        });
    
        if (!bug) throw new Error("Bug not found");
    
        const isMember = bug.project.members.some(m => m.userId === user.id);
        if (!isMember) throw new Error("Not authorized to update bug");
    
        await prisma.bug.delete({
            where: { id: bugId }
        });
        revalidatePath('/issues');

        return {
            message: "Bug deleted successfully",
        }
    } catch(error) {
        console.log(error);
    }
}

export async function getBugById(id: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    try {
        const bugs = await prisma.bug.findUnique({
            where:{ id },
            include: {
                reporter: { select: { name: true, email: true, image: true } },
                assignee: { select: { name: true, email: true, image: true } },
            },
        });

        return {
            success: true,
            bugs: bugs
        };
    } catch (error) {
        console.error('Error fetching bugs:', error);
        return {
            success: false,
            message: 'Failed to fetch bugs'
        };
    }
}

export default async function getAllBugs() {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    try {
        const bugs = await prisma.bug.findMany({
            include: {
                project: true,
                reporter: { select: { name: true, email: true } },
                assignee: { select: { name: true, email: true,image: true } },
                comments: true,
                labels: { include: { label: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return {
            success: true,
            bugs: bugs
        };
    } catch (error) {
        console.error('Error fetching bugs:', error);
        return {
            success: false,
            message: 'Failed to fetch bugs'
        };
    }
}

export async function getUserBugs() {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    try {
        const bugs = await prisma.bug.findMany({
            where: {
                OR: [
                    { reporterId: user.id },
                    { assigneeId: user.id }
                ]
            },
            include: {
                project: true,
                reporter: { select: { name: true, email: true } },
                assignee: { select: { name: true, email: true } },
                comments: true,
                labels: { include: { label: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        
        return {
            success: true,
            bugs: bugs
        };
    } catch (error) {
        console.error('Error fetching user bugs:', error);
        return {
            success: false,
            message: 'Failed to fetch user bugs'
        };
    }
}