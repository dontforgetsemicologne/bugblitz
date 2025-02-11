'use client'

import { useState, useEffect } from "react";

import { getProjectBugs } from "@/app/actions/projectAction"
import { Bug } from "@/types";
import { BugIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProjectBugs({ id }: { id: string }) {
    const [projectBugs, setProjectBugs] = useState<Bug[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProjectDetails() {
            try {
                const result = await getProjectBugs(id);
                setProjectBugs(result.data?.bugs || []);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch project details', error);
                setIsLoading(false);
            }
        }

        fetchProjectDetails();
    }, [id]);

    if (isLoading) return <div>Loading...</div>;
    if (!projectBugs) return <div>No project bugs found</div>;

    return (
        <div className="p-2">
            { projectBugs.map((bugs) => {
                return (
                    <div className="space-y-2" key={bugs.id}>
                        <Link href={`/issues/${bugs.id}`}>
                            <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors duration-200 cursor-pointer">
                                <div className={cn(
                                    "flex-none p-2 rounded-lg",
                                    {
                                        'bg-red-500/10': bugs.priority === 'CRITICAL',
                                        'bg-yellow-500/10': bugs.priority === 'HIGH',
                                        'bg-blue-500/10': bugs.priority === 'MEDIUM',
                                        'bg-green-500/10': bugs.priority === 'LOW',
                                        'bg-zinc-500/10': !bugs.priority
                                    }
                                )}>
                                    <BugIcon className={cn(
                                        "w-5 h-5",
                                        {
                                        'text-red-400': bugs.priority === 'CRITICAL',
                                        'text-yellow-400': bugs.priority === 'HIGH',
                                        'text-blue-400': bugs.priority === 'MEDIUM',
                                        'text-green-400': bugs.priority === 'LOW',
                                        'text-zinc-400': !bugs.priority
                                        }
                                    )}/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-zinc-100 flex items-center gap-3">{bugs.title}
                                        <span className={`text-xs px-1.5 py-0.5 rounded-xl ${bugs.status === 'OPEN' ? 'bg-blue-500/20 text-blue-400' : bugs.status === 'IN_PROGRESS' ? 'bg-yellow-500/20 text-yellow-400' : bugs.status === 'RESOLVED' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-500'}`}>
                                            {bugs.status}
                                        </span>
                                    </p>
                                    <p className="text-xs text-zinc-400 mt-0.5">{bugs.description}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors"/>
                            </div>
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}