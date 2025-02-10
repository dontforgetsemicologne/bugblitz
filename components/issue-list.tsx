'use client'

import React, { useState, useEffect } from 'react';
import { BugIcon } from "lucide-react";
import { Bug } from '@/types/fspecific';
import getAllBugs from '@/app/actions/bugActions';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/data/navbar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export default function IssueList() {
    const [bugs, setBugs] = useState<Bug[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadIssues() {
            try {
                const result = await getAllBugs();
                if (result.success && result.bugs) {
                    setBugs(result.bugs);
                }
            } catch (error) {
                console.error("Failed to load projects:", error);
            } finally {
                setLoading(false);
            }
        }

        loadIssues();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-8">Loading issues...</div>;
    }
    
    return (
        <div className="w-full mx-auto">
            <div className='overflow-hidden bg-transparent rounded-2xl transition-all duration-200 border border-zinc-800 hover:border-zinc-700'>
                {/* Header */}
                <div className="p-5 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className='p-2.5 rounded-xl bg-zinc-800'>
                            <BugIcon className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-zinc-100">Bugs List</h3>
                            <p className="text-sm text-zinc-400">Recent Bugs</p>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-zinc-800">
                    {bugs.map((bug) => (
                        <div
                            key={bug.id}
                            className="p-3 flex items-center gap-3 group"
                        >
                            <div className="flex-1 min-w-0">
                                <div className='flex items-center gap-2'>
                                    <Link href={`/issues/${bug.id}`}>
                                        <p className="text-lg text-zinc-100 hover:underline">{bug.title}</p>
                                    </Link>
                                    <span className={`text-xs px-1.5 py-0.5 rounded-xl ${bug.status === 'OPEN' ? 'bg-blue-500/20 text-blue-400' : bug.status === 'IN_PROGRESS' ? 'bg-yellow-500/20 text-yellow-400' : bug.status === 'RESOLVED' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-500'}`}>
                                        {bug.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 mb-2">
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-zinc-500">{bug.description}</span>
                                    </div>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className="text-xs px-1.5 py-0.5 rounded-xl bg-amber-500/20 text-amber-400 font-medium">
                                        {bug.priority}
                                    </span>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Avatar className='h-6 w-6 rounded-full'>
                                                    <AvatarImage src={bug.assignee?.image ?? ''}/>
                                                    <AvatarFallback>{getInitials(bug.assignee?.name ?? '')}</AvatarFallback>
                                                </Avatar>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{bug.assignee?.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
