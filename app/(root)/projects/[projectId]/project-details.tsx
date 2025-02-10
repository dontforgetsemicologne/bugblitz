'use client'

import { useState, useEffect } from "react";

import { deleteProject, getProjectById } from "@/app/actions/projectAction"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/data/navbar";
import { ProjectDetails } from "@/types/fspecific";
import { Trash2, User } from "lucide-react";
import UpdateProjectForm from "./update-project-form";

export default function ProjectDetail({ id }: { id: string }) {
    const [projectData, setProjectData] = useState<ProjectDetails>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProjectDetails() {
            try {
                const result = await getProjectById(id);
                setProjectData(result.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch project details', error);
                setIsLoading(false);
            }
        }

        fetchProjectDetails();
    }, [id]);

    if (isLoading) return <div>Loading...</div>;
    if (!projectData) return <div>No project found</div>;

    return (
        <div className='w-full mx-auto border border-zinc-800 rounded-2xl shadow-xs overflow-hidden'>
            <div className="p-4 border-zinc-800">
                <div className="flex items-center justify-between">
                    <div className="flex-col">
                        <h3 className="text-lg text-zinc-200 leading-normal font-bold">{projectData.title}</h3>
                        <p className="text-sm text-zinc-300 leading-normal">{projectData.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <UpdateProjectForm 
                            id={id} 
                            currentTitle={projectData.title ?? ''} 
                            currentDescription={projectData.subtitle} 
                        />
                        <button 
                            className="p-2 hover:text-red-600 hover:bg-red-800/20 rounded-xl transition-colors flex items-center gap-1"
                            onClick={() => deleteProject(id)}
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-6 mb-2.5">
                    <div className="flex items-center gap-2">
                        <Avatar className='w-8 h-8 rounded-full ring-1 ring-zinc-800'>
                            <AvatarImage src={projectData?.creator.image ?? ''}/>
                            <AvatarFallback>{getInitials(projectData?.creator.name ?? '')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h3 className="text-sm font-medium text-zinc-100">{projectData?.creator.name}</h3>
                                <span className="text-xs text-zinc-500">·</span>
                                <span className="text-xs text-zinc-500">{projectData.createdAt}</span>
                                <span className="text-xs text-zinc-500">·</span>
                                <span className="text-xs text-zinc-500 flex items-center"><User size={16}/>{projectData.membersCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
