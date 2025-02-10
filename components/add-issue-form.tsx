'use client'

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel 
} from "@/components/ui/form";

import { issueFormSchema } from "@/lib/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { User } from "@/types/user";
import { createBug } from "@/app/actions/bugActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { priority } from "@/data/priority";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/data/navbar";
import { Project } from "@/types";

export default function AddIssueForm({ currentUser, allUsers, userProjects }: {
    currentUser: User;
    allUsers: User[];
    userProjects: Project[];
}) {

    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { toast } = useToast();

    const assigneeList: User[] = allUsers.filter((user) => user.id !== currentUser.id);

    const form = useForm<z.infer<typeof issueFormSchema>>({
        resolver: zodResolver(issueFormSchema),
        defaultValues: {
            title: "",
            description: "",
            assigneeId: '',
            priority: 'MEDIUM',
            projectId: ''
        }
    });

    const onSubmit = async (values: z.infer<typeof issueFormSchema>) => {
        startTransition(async () => {
            try {
                const result = await createBug(values.projectId, {
                    title: values.title,
                    description: values.description ?? 'No description provided',
                    assigneeId: values.assigneeId,
                    priority: values.priority
                });

                if(result.success) {
                    toast({
                        duration: 3000,
                        className: "w-full",
                        description: (
                            <div className="relative w-full overflow-hidden rounded-xl border bg-emerald-950/20 border-emerald-800/30 p-4 shadow-xs">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-emerald-200 dark:bg-emerald-900/50 p-1">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <p className="text-sm font-medium text-emerald-200">
                                        Saved to database
                                    </p>
                                </div>
                            </div>
                        )
                    });
                    form.reset();
                    router.push('/issues');
                    router.refresh();
                } else {
                    toast({
                        duration: 3000,
                        className: "w-full mx-auto",
                        description: (
                            <div className="relative overflow-hidden rounded-lg border bg-red-950/20 border-red-800/30 p-4 shadow-xs">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-red-900/50 p-1">
                                        <CheckCircle2 className="h-4 w-4 text-red-400" />
                                    </div>
                                    <p className="text-sm font-medium text-red-200">
                                        {result.message || 'Failed to update profile'}
                                    </p>
                                </div>
                            </div>
                        )
                    });
                    router.refresh();
                }
            } catch (error) {
                console.error('Submission error:', error);
            }
        });
    }
    return(
        <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel className="font-medium text-gray-100/50">Project</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0">
                                        <SelectValue>
                                        {(() => {
                                            const project = userProjects.find(p => p.id === field.value);
                                            if (project) {
                                                return (
                                                    <span className="flex items-center gap-2">
                                                        {field.value}
                                                    </span>
                                                );
                                            }
                                            return "Select priority";
                                        })()}
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                                    {
                                        userProjects.map((project, idx) => {
                                            return (
                                                <SelectItem key={idx} value={project.id}>
                                                    <span className="flex items-center gap-2">
                                                        <span className="truncate">{project.title}</span>
                                                    </span>
                                                </SelectItem>
                                            );
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel className="font-medium text-gray-100/50">Issue Title</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    className="w-full text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl border-zinc-800/80 focus:ring-1 focus:ring-zinc-800 placeholder:text-zinc-600"
                                    { ...field }
                                    placeholder="Enter the issue title"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel className="font-medium text-gray-100/50">Issue Description</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    className="w-full text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl border-zinc-800/80 focus:ring-1 focus:ring-zinc-800 placeholder:text-zinc-600"
                                    { ...field }
                                    placeholder="Enter the issue description"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel className="font-medium text-gray-100/50">Issue Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0">
                                        <SelectValue>
                                        {(() => {
                                            const selectedPriority = priority.find(p => p.value === field.value);
                                            if (selectedPriority) {
                                                const Icon = selectedPriority.icon;
                                                return (
                                                    <span className="flex items-center gap-2">
                                                        <Icon color={selectedPriority.color} size={16} />
                                                        {field.value}
                                                    </span>
                                                );
                                            }
                                            return "Select priority";
                                        })()}
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                                    {
                                        priority.map((priority, idx) => {
                                            const Icon = priority.icon;
                                            return (
                                                <SelectItem key={idx} value={priority.value}>
                                                    <span className="flex items-center gap-2">
                                                        <Icon color={priority.color} size={16}/>
                                                        <span className="truncate">{priority.value}</span>
                                                    </span>
                                                </SelectItem>
                                            );
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="assigneeId"
                    render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel className="font-medium text-gray-100/50">Issue Assignee</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0">
                                        <SelectValue>
                                        {(() => {
                                            const selectedUser = assigneeList.find(p => p.id === field.value);
                                            if (selectedUser) {
                                                return (
                                                    <span className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={selectedUser.image ?? ''} alt={selectedUser.name ?? ''}/>
                                                            <AvatarFallback>
                                                                {getInitials(selectedUser.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="truncate">{selectedUser.name}</span>
                                                    </span>
                                                );
                                            }
                                            return "Select priority";
                                        })()}
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                                    {
                                        assigneeList.map((assignee, idx) => {
                                            return (
                                                <SelectItem key={idx} value={assignee.id}>
                                                    <span className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={assignee.image ?? ''} alt={assignee.name ?? ''}/>
                                                            <AvatarFallback>
                                                                {getInitials(assignee.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="truncate">{assignee.name}</span>
                                                    </span>
                                                </SelectItem>
                                            );
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
                <div className="mt-8 flex justify-end gap-4">
                    <Button
                        variant="outline"
                        className="border-zinc-800/80 hover:bg-zinc-900/50 rounded-xl"
                        type="reset"
                        onClick={() => form.reset()}
                    >
                        Cancel
                    </Button>
                    <Button 
                        className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 rounded-xl"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}