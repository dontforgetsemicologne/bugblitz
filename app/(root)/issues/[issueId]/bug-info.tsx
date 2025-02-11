'use client'

import { useState, useEffect } from "react";
import { getBugById } from "@/app/actions/bugActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BugIcon, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import BugActions from "./bug-actions";

export default function BugsInfo({ id }: { id: string }) {
    const [bugInfo, setBugInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchBugDetails() {
            try {
                const result = await getBugById(id);
                setBugInfo(result.bugs);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch bug details', error);
                setIsLoading(false);
            }
        }

        fetchBugDetails();
    }, [id]);

    if (isLoading) return <div>Loading...</div>;
    if (!bugInfo) return <div>Bug not found</div>;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6 p-4">
            <Card className="p-8 space-y-6">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                            "p-2 rounded-lg",
                            {
                                'bg-red-500/10': bugInfo.priority === 'CRITICAL',
                                'bg-yellow-500/10': bugInfo.priority === 'HIGH',
                                'bg-blue-500/10': bugInfo.priority === 'MEDIUM',
                                'bg-green-500/10': bugInfo.priority === 'LOW',
                                'bg-zinc-500/10': !bugInfo.priority
                            }
                        )}>
                            <BugIcon className={cn(
                                "w-5 h-5",
                                {
                                    'text-red-400': bugInfo.priority === 'CRITICAL',
                                    'text-yellow-400': bugInfo.priority === 'HIGH',
                                    'text-blue-400': bugInfo.priority === 'MEDIUM',
                                    'text-green-400': bugInfo.priority === 'LOW',
                                    'text-zinc-400': !bugInfo.priority
                                }
                            )}/>
                        </div>
                        <CardTitle className="text-xl">{bugInfo.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "text-sm px-2.5 py-0.5 rounded-full font-medium",
                            {
                                'bg-blue-500/20 text-blue-400': bugInfo.status === 'OPEN',
                                'bg-yellow-500/20 text-yellow-400': bugInfo.status === 'IN_PROGRESS',
                                'bg-green-500/20 text-green-400': bugInfo.status === 'RESOLVED'
                            }
                        )}>
                            {bugInfo.status}
                        </span>
                        <span className="text-sm text-zinc-400">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {formatDate(bugInfo.createdAt)}
                        </span>
                    </div>
                    <BugActions 
                        id={bugInfo.id}
                        currentTitle={bugInfo.title}
                        currentDescription={bugInfo.description}
                        currentStatus={bugInfo.status}
                        currentPriority={bugInfo.priority}
                        currentAssigneeId={bugInfo.assignee?.id}
                    />
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-zinc-300">{bugInfo.description}</p>
                    
                    <div className="flex flex-col gap-4 mt-6">
                        <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-zinc-400" />
                            <span className="text-sm text-zinc-400">Reporter:</span>
                            <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src={bugInfo.reporter.image || ''} />
                                    <AvatarFallback>{bugInfo.reporter.name?.[0] || '?'}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{bugInfo.reporter.name}</span>
                            </div>
                        </div>

                        {bugInfo.assignee && (
                            <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-zinc-400" />
                                <span className="text-sm text-zinc-400">Assignee:</span>
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={bugInfo.assignee.image || ''} />
                                        <AvatarFallback>{bugInfo.assignee.name?.[0] || '?'}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{bugInfo.assignee.name}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}