'use client'

import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Calendar, ArrowRight, Layout, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { getAllProjects } from '@/app/actions/projectAction';
import { Project } from '@/types';

const iconStyles = {
    blue: "bg-blue-950 text-blue-300",
    green: "bg-green-950 text-green-300",
    red: "bg-red-950 text-red-300",
    yellow: "bg-yellow-950 text-yellow-300",
} as const;

const statusConfig = {
    active: {
        icon: AlertCircle,
        bg: "bg-yellow-950",
        class: "text-yellow-400",
    },
    completed: {
        icon: CheckCircle2,
        bg: "bg-green-950",
        class: "text-green-400",
    },
    in_progress: {
        icon: Clock,
        bg: "bg-blue-950",
        class: "text-blue-400",
    },
    inactive: {
        icon: Clock,
        bg: "bg-zinc-900",
        class: "text-zinc-400",
    },
} as const;

export default function ProjectList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProjects() {
            try {
                const data = await getAllProjects();
                setProjects(data);
            } catch (error) {
                console.error("Failed to load projects:", error);
            } finally {
                setLoading(false);
            }
        }

        loadProjects();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-8">Loading projects...</div>;
    }

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center w-full">
                <Layout className="w-12 h-12 text-zinc-300 mb-4" />
                <h3 className="text-lg font-medium text-zinc-100 mb-1">
                No projects yet
                </h3>
                <p className="text-sm text-zinc-400">
                Create your first project to get started
                </p>
            </div>
        );
    }
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {projects.map((project) => (
            <div
            key={project.id}
            className='flex flex-col bg-zinc-900/70 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all duration-200 shadow-sm backdrop-blur-xl'
            >
            <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                <div className={cn("p-2 rounded-lg", iconStyles.blue)}>
                    <Layout className="w-4 h-4" />
                </div>
                <div
                    className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
                    statusConfig[project.status].bg,
                    statusConfig[project.status].class,
                    )}
                >
                    {React.createElement(statusConfig[project.status].icon, { className: "w-3.5 h-3.5" })}
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </div>
                </div>

                <div>
                <h3 className="text-sm font-medium text-zinc-100 mb-1">
                    {project.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2">
                    {project.subtitle}
                </p>
                </div>

                <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Progress</span>
                    <span className="text-zinc-100">{project.progress}%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                    className="h-full bg-zinc-100 rounded-full"
                    style={{
                        width: `${project.progress}%`,
                    }}
                    />
                </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    <span>{project.date}</span>
                </div>
                <span>{project.bugsCount} bugs</span>
                </div>
            </div>

            <div className="mt-auto border-t border-zinc-800">
                <button
                className='w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors duration-200'
                onClick={() => window.location.href = `/projects/${project.id}`}
                >
                View Details
                <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
            </div>
        ))}
        </div>
    )
}
