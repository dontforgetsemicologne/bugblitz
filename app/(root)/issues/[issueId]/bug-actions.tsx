'use client'

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, PencilLine, Trash2 } from "lucide-react";
import { updateBug, deleteBug } from "@/app/actions/bugActions";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const updateBugSchema = z.object({
    title: z.string().min(1, "Bug title is required"),
    description: z.string().optional(),
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    assigneeId: z.string().optional().nullable()
});

export default function BugActions({ 
    id, 
    currentTitle, 
    currentDescription, 
    currentStatus, 
    currentPriority,
    currentAssigneeId 
}: { 
    id: string;
    currentTitle: string;
    currentDescription: string;
    currentStatus: string;
    currentPriority: string;
    currentAssigneeId?: string | null;
}) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof updateBugSchema>>({
        resolver: zodResolver(updateBugSchema),
        defaultValues: {
            title: currentTitle,
            description: currentDescription,
            status: currentStatus as any,
            priority: currentPriority as any,
            assigneeId: currentAssigneeId
        }
    });

    const onSubmit = async (values: z.infer<typeof updateBugSchema>) => {
        try {
            await updateBug(id, values);

            toast({
                description: (
                    <div className="relative w-full overflow-hidden rounded-xl border bg-emerald-950/20 border-emerald-800/30 p-4 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-emerald-200 dark:bg-emerald-900/50 p-1">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            </div>
                            <p className="text-sm font-medium text-emerald-200">Bug updated successfully</p>
                        </div>
                    </div>
                )
            });
            
            setOpen(false);
            router.refresh();
        } catch (error) {
            toast({
                description: (
                    <div className="relative overflow-hidden rounded-lg border bg-red-950/20 border-red-800/30 p-4 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-red-900/50 p-1">
                                <CheckCircle2 className="h-4 w-4 text-red-400" />
                            </div>
                            <p className="text-sm font-medium text-red-200">Failed to update bug</p>
                        </div>
                    </div>
                )
            });
        }
    };

    const handleDelete = async () => {
        try {
            await deleteBug(id);
            
            toast({
                description: (
                    <div className="relative w-full overflow-hidden rounded-xl border bg-emerald-950/20 border-emerald-800/30 p-4 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-emerald-200 dark:bg-emerald-900/50 p-1">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            </div>
                            <p className="text-sm font-medium text-emerald-200">Bug deleted successfully</p>
                        </div>
                    </div>
                )
            });
            
            router.push('/issues');
        } catch (error) {
            toast({
                description: (
                    <div className="relative overflow-hidden rounded-lg border bg-red-950/20 border-red-800/30 p-4 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-red-900/50 p-1">
                                <CheckCircle2 className="h-4 w-4 text-red-400" />
                            </div>
                            <p className="text-sm font-medium text-red-200">Failed to delete bug</p>
                        </div>
                    </div>
                )
            });
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button className="p-2 hover:text-yellow-600 hover:bg-yellow-800/20 rounded-xl transition-colors flex items-center gap-1">
                        <PencilLine size={16} /> Update
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-zinc-200">Update Bug</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="grid gap-2">
                                        <FormLabel className="font-medium text-gray-100/50">Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-full text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl border-zinc-800/80 focus:ring-1 focus:ring-zinc-800 placeholder:text-zinc-600"
                                                {...field}
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
                                        <FormLabel className="font-medium text-gray-100/50">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="w-full text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl border-zinc-800/80 focus:ring-1 focus:ring-zinc-800 placeholder:text-zinc-600"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="grid gap-2">
                                        <FormLabel className="font-medium text-gray-100/50">Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl border-zinc-800/80">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-zinc-950 border-zinc-800">
                                                <SelectItem value="OPEN">Open</SelectItem>
                                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem className="grid gap-2">
                                        <FormLabel className="font-medium text-gray-100/50">Priority</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl border-zinc-800/80">
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-zinc-950 border-zinc-800">
                                                <SelectItem value="LOW">Low</SelectItem>
                                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                                <SelectItem value="HIGH">High</SelectItem>
                                                <SelectItem value="CRITICAL">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            
                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-zinc-800/80 hover:bg-zinc-900/50 rounded-xl"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 rounded-xl"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <button 
                onClick={handleDelete}
                className="p-2 hover:text-red-600 hover:bg-red-800/20 rounded-xl transition-colors flex items-center gap-1"
            >
                <Trash2 size={16} /> Delete
            </button>
        </div>
    );
}