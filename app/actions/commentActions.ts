'use server'

import { getCurrentUser } from "@/lib/getCurrentUser";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createComment(bugId: string, data: {
    content: string;
}){
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        const bug = await prisma.bug.findUnique({
            where: { id: bugId },
            include: { project: { include: { members: true } } }
        });

        if (!bug) throw new Error("Bug not found");
    
        const isMember = bug.project.members.some(m => m.userId === user.id);
        if (!isMember) throw new Error("Not authorized to comment");

        const comment = await prisma.comment.create({
            data: {
                content: data.content,
                bug: { connect: { id: bugId } },
                user: { connect: { id: user.id } }
            }
        });
        
        revalidatePath(`/issues/${bugId}`);
        return {
            data: comment,
            success: true
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: 'Unable to add comment at the moment'
        }
    }
}

export async function updateComment(commentId: string, data: {
    content: string;
}) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");
  
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: { bug: true }
    });
  
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== user.id) throw new Error("Not authorized to update comment");
  
    const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: { content: data.content }
    });
  
    revalidatePath(`/issues/${comment.bugId}`);
    return updatedComment;
}

export async function deleteComment(commentId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: { bug: true }
    });

    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== user.id) throw new Error("Not authorized to update comment");

    await prisma.comment.delete({
        where: { id: commentId }
    });

    revalidatePath(`/issues/${comment.bugId}`);

}

export async function getAllBugComments(id: string) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        const comment = await prisma.comment.findMany({
            where: { bugId: id },
            include: { 
                user: {
                    select: {
                        image: true,
                        name: true
                    }
                } 
            }
        });

        if (!comment) throw new Error("No comments found");

        return {
            data: comment,
            success: true
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: 'Failed to fetch comments from server'
        }
    }
}
