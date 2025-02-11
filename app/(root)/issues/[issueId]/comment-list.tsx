'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getAllBugComments } from "@/app/actions/commentActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/data/navbar";

type Comment = {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    bugId: string;
    userId: string;
    user: {
        name: string | null;
        image: string | null;
    };
};

function getTimeAgo(date: Date): string {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMilliseconds = now.getTime() - commentDate.getTime();
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
        return `${diffInMinutes}m`;
    }
    if (diffInHours < 24) {
        return `${diffInHours}h`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
}

export default function CommentList() {
    const params = useParams();
    const bugId = params?.issueId as string;
    
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchComments() {
            try {
                const response = await getAllBugComments(bugId);
                if (response.success && response.data) {
                    setComments(response.data);
                } else {
                    setError(response.error || 'Failed to load comments');
                }
            } catch (err) {
                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        }

        if (bugId) {
            fetchComments();
        }
    }, [bugId]);

    if (loading) return <div>Loading comments...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
        <div className={cn(
            "w-full max-w-xl mx-auto",
            "bg-zinc-900",
            "border border-zinc-800",
            "rounded-2xl shadow-xs overflow-hidden"
        )}>
            <div className="divide-y divide-zinc-800">
                {comments.map((comment) => (
                    <div key={comment.id} className="p-4">
                        <div className="flex gap-3">
                            <Avatar className="w-7 h-7 rounded-full ring-1 ring-zinc-800 flex-none">
                                <AvatarImage src={comment.user.image ?? ''}/>
                                <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-medium text-zinc-100">
                                        {comment.user.name || 'Anonymous User'}
                                    </span>
                                    <span className="text-xs text-zinc-500">·</span>
                                    <span className="text-xs text-zinc-500">
                                        {getTimeAgo(comment.createdAt)}
                                    </span>
                                </div>
                                
                                <p className="text-sm text-zinc-300">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}