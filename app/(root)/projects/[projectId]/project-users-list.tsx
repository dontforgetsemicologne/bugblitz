'use client'

import { useState, useEffect } from "react";

import { deleteUserFromProject, getProjectUsers } from "@/app/actions/projectAction"
import { projectUser } from "@/types";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/data/navbar";

export default function ProjectUsers({ id }: { id: string }) {
    const [projectUsers, setProjectUsers] = useState<projectUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProjectUser() {
            try {
                const result = await getProjectUsers(id);
                setProjectUsers(result.data || []);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch project details', error);
                setIsLoading(false);
            }
        }

        fetchProjectUser();
    }, [id]);

    if (isLoading) return <div>Loading...</div>;
    if (!projectUsers) return <div>No project bugs found</div>;

    return (
        <div className="p-2">
            { projectUsers.map((user) => {
                return (
                    <div className="space-y-2" key={user.id}>
                        <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors duration-200 cursor-pointer">
                            <div className="flex-none p-2 rounded-full bg-blue-500/10">
                                <Avatar className="w-7 h-7">
                                    <AvatarImage src={ user.image ?? ''}/>
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-100">{user.name}</p>
                                <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
                            </div>
                            <button onClick={() => deleteUserFromProject(id,user.id)}>
                                <Trash2 className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors"/>
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}