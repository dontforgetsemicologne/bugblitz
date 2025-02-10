'use client'

import { useParams } from "next/navigation";
import ProjectDetail from "./project-details";
import { BugIcon, Folder } from "lucide-react";
import ProjectBugs from "./project-bugs-list";
import ProjectUsers from "./project-users-list";
import AddUser from "./add-user";

export default function ProjectPage() {
    const params = useParams();
    const projectId = params?.projectId as string;

    return(
        <div className="space-y-4">
            <div className="rounded-xl p-6 flex flex-col items-start justify-start border border-[#1F1F23]">
                <h2 className="text-lg font-bold text-white mb-4 text-left flex items-center justify-between gap-1">
                    <Folder className="w-4 h-4 text-zinc-50" />
                    Project Details
                </h2>
                <ProjectDetail id={projectId}/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-transparent rounded-xl p-6 flex flex-col border border-[#1F1F23]">
                    <h2 className="text-lg font-bold text-white mb-4 text-left flex items-center gap-2 ">
                        <BugIcon className="w-4 h-4 text-zinc-50" />
                        Issues
                    </h2>
                    <div className="flex-1">
                    <ProjectBugs id={projectId}/>
                    </div>
                </div>
                <div className="bg-transparent rounded-xl p-6 flex flex-col border border-[#1F1F23]">
                    <div className="text-lg font-bold text-white mb-4 text-left flex items-center justify-between gap-2">
                        Users
                        <AddUser/>
                    </div>
                    <div className="flex-1">
                        <ProjectUsers id={projectId}/>
                    </div>
                </div>
            </div>
        </div>
    )
}