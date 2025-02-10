'use client'

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, PencilLine } from "lucide-react";

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
    FormLabel 
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProject } from "@/app/actions/projectAction";

const updateProjectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional()
});

export default function UpdateProjectForm({ id, currentTitle, currentDescription }: { 
    id: string;
    currentTitle: string;
    currentDescription: string;
}) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof updateProjectSchema>>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            name: currentTitle,
            description: currentDescription
        }
    });

    const onSubmit = async (values: z.infer<typeof updateProjectSchema>) => {
        try {
            await updateProject(id, {
                name: values.name,
                description: values.description
            });

            toast({
                description: (
                    <div className="relative w-full overflow-hidden rounded-xl border bg-emerald-950/20 border-emerald-800/30 p-4 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-emerald-200 dark:bg-emerald-900/50 p-1">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            </div>
                            <p className="text-sm font-medium text-emerald-200">Project updated successfully</p>
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
                            <p className="text-sm font-medium text-red-200">Failed to update project</p>
                        </div>
                    </div>
                )
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="p-2 hover:text-yellow-600 hover:bg-yellow-800/20 rounded-xl transition-colors flex items-center gap-1">
                    <PencilLine size={16} /> Update
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-zinc-200">Update Project</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel className="font-medium text-gray-100/50">Project Name</FormLabel>
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
                                        <Input
                                            className="w-full text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl border-zinc-800/80 focus:ring-1 focus:ring-zinc-800 placeholder:text-zinc-600"
                                            {...field}
                                        />
                                    </FormControl>
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
    );
}