'use server'

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { Bugs } from "@/types/bug";
import { projectStatus } from "@/types";

export async function createProject(data: {
    name: string;
    description: string;
    members?: string[];
}) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const project = await prisma.project.create({
        data: {
            name: data.name,
            description: data.description,
            creator: { connect: { id: user.id } },
            members: {
                create: {
                    userId: user.id,
                    role: 'admin'
                }
            }
        }
    });

    if (data.members && data.members.length > 0) {
        const additionalMembers = data.members.filter(id => id !== user.id);
        
        if (additionalMembers.length > 0) {
            await prisma.projectMember.createMany({
                data: additionalMembers.map(memberId => ({
                    projectId: project.id,
                    userId: memberId,
                }))
            });
        }
    }

    revalidatePath('/projects');
    return {
        success: true,
        message: 'Project added successfully',
        project: project
    }
}

export async function updateProject(projectId: string, data: {
    name?: string;
    description?: string;
}) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { members: true }
    });

    if (!project) throw new Error("Project not found");

    const userIsMember = project.members.find(m => m.userId === user.id);
    if (!userIsMember) {
        throw new Error("Not authorized to update project!");
    }

    const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: {
            name: data.name,
            description: data.description
        }
    });

    revalidatePath(`/projects/${projectId}`);
    return updatedProject;
}

export async function deleteProject(projectId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { members: true }
    });

    if (!project) throw new Error("Project not found");

    const userIsMember = project.members.find(m => m.userId === user.id);
    if (!userIsMember || userIsMember.role !== 'admin') {
        throw new Error("Not authorized to delete project!");
    }

    await prisma.project.delete({
        where: { id: projectId }
    });
    revalidatePath("/projects");
}

export async function getAllProjects() {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        const projects = await prisma.project.findMany({
            include: {
                creator: true,
                members: { include: { user: true } },
                bugs: true,
                _count: { select: { bugs: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return projects.map(project => {
            const openBugs = project.bugs.filter(bug => bug.status === 'OPEN').length;
            const totalBugs = project._count.bugs;
            const progress = totalBugs > 0 ? Math.round(((totalBugs - openBugs) / totalBugs) * 100) 
            : 0;

            return {
                id: project.id,
                title: project.name,
                subtitle: project.description || 'No description provided',
                status: getProjectStatus(project.bugs),
                progress,
                date: project.createdAt.toLocaleDateString(),
                membersCount: project.members.length,
                bugsCount: totalBugs,
                bugs: project.bugs
            }
        })
        
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}

function getProjectStatus(bugs: Bugs[]): projectStatus {
    if (bugs.length === 0) return "inactive";
    if (bugs.some(bug => bug.status === "OPEN")) return "active";
    if (bugs.every(bug => bug.status === "CLOSED")) return "completed";
    return "in_progress";
}

export default async function getUserProjects() {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        const projects = await prisma.project.findMany({
            where: {
                OR: [
                    { creatorId: user.id }, 
                    { members: { some: { userId: user.id } } },
                ],
            },
            include: {
                creator: true,
                members: { include: { user: true } },
                bugs: true,
                _count: { select: { bugs: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return projects.map(project => {
            const openBugs = project.bugs.filter(bug => bug.status === 'OPEN').length;
            const totalBugs = project._count.bugs;
            const progress = totalBugs > 0 ? Math.round(((totalBugs - openBugs) / totalBugs) * 100) : 0;

            return {
                id: project.id,
                title: project.name,
                subtitle: project.description || 'No description provided',
                status: getProjectStatus(project.bugs),
                progress,
                date: project.createdAt.toLocaleDateString(),
                membersCount: project.members.length,
                bugsCount: totalBugs,
                bugs: project.bugs
            }
        });

    } catch (error) {
        console.error("Error fetching user projects:", error);
        return [];
    }
}

export async function getProjectById(id: string) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        const project = await prisma.project.findUnique({
            where: {
                id: id
            },
            include: {
                creator: true,
                members: { include: { user: true } },
                bugs: true
            }
        });

        return {
            data: {
                id: project?.id,
                title: project?.name,
                subtitle: project?.description || 'No description provided',
                creator: {
                    name: project?.creator.name,
                    image: project?.creator.image
                },
                createdAt: project?.createdAt.toLocaleDateString(),
                membersCount: project?.members.length,
            },
            success: true,
            message: 'Retrieved project info successfully'
        };

    } catch (error) {
        console.error("Error fetching user projects:", error);
        return {
            success: false,
            message: 'Cannot retrieve project info'
        };
    }
}

export async function getProjectBugs(id: string) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        const project = await prisma.project.findUnique({
            where: {
                id: id
            },
            include: {
                bugs: true
            }
        });

        return {
            data: {
                bugs: project?.bugs
            },
            success: true,
            message: 'Retrieved project bugs successfully'
        };

    } catch (error) {
        console.error("Error fetching user projects:", error);
        return {
            success: false,
            message: 'Cannot retrieve project bugs'
        };
    }
}

export async function getProjectUsers(projectId: string) {
    try {
        const users = await prisma.projectMember.findMany({
            where: {
                projectId: projectId
            },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true, 
                        image: true
                    }
                }
            }
        });
   
      return { success: true, data: users.map(member => member.user) };
    } catch (error) {
      return { success: false, error: 'Failed to fetch project users' };
    }
}

export async function deleteUserFromProject(id: string, userId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        const project = await prisma.project.findUnique({
            where: { id },
            include: { members: true }
        });

        const userIsMember = project?.members.find(m => m.userId === user.id);

        if (!userIsMember || userIsMember.role !== 'admin') {
            throw new Error("Not authorized to delete user!");
        }

        await prisma.projectMember.delete({
            where: { 
                userId_projectId: {
                    userId: userId,
                    projectId: id
                }    
            }
        });
        return { success: true };
    } catch(error) {
        console.log(error);
        return { success: false, error: 'Failed to remove user from project' };
    }
}

export async function addMemberToProject(id: string, userId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        const isAdmin = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId: user.id, projectId: id } },
        });

        if(isAdmin?.role !== 'admin') {
            throw new Error("Not authorized to add member!");
        }

        const projectMember = await prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId: userId,
                    projectId: id
                }
            }
        });

        if (projectMember) {
            return { success: false, error: 'User is already a member' };
        }

        const newMember = await prisma.projectMember.create({
            data: { 
                userId: userId,
                projectId: id,
                role: 'member'
            }
        });
        return { success: true };
    } catch(error) {
        console.log(error);
        return { success: false, error: 'Failed to remove user from project' };
    }
}