'use client'

import { useState, useEffect } from "react";

import { getProjectBugs } from "@/app/actions/projectAction"
import { Bug } from "@/types";
import { BugIcon, ChevronRight } from "lucide-react";
import Link from "next/link";

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
                                <div className="flex-none p-2 rounded-lg bg-blue-500/10">
                                    <BugIcon className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-zinc-100">{bugs.title}</p>
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