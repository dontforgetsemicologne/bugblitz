'use client'

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'

import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel 
} from "@/components/ui/form";

import { projectFormSchema } from "@/lib/zod";

import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createProject } from "@/app/actions/projectAction";
import { CheckCircle2 } from "lucide-react";

import { User } from "@/types/user";
import MultiSelect from "./multi-select";

export default function AddProjectForm({ currentUser, allUsers }: {
    currentUser: User;
    allUsers: User[];
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof projectFormSchema>>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            name: '',
            description: '',
            members: []
        }
    });

    const onSubmit = async (values: z.infer<typeof projectFormSchema>) => {
        startTransition(async () => {
            try {
                const result = await createProject({
                    name: values.name,
                    description: values.description ?? '',
                    members: values.members
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
                    router.push('/projects');
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
        })
    }
    return (
        <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel className="font-medium text-gray-100/50">Project Name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    className="w-full text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl border-zinc-800/80 focus:ring-1 focus:ring-zinc-800 placeholder:text-zinc-600"
                                    { ...field }
                                    placeholder="Enter the project name"
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
                            <FormLabel className="font-medium text-gray-100/50">Project Description</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    className="w-full text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl border-zinc-800/80 focus:ring-1 focus:ring-zinc-800 placeholder:text-zinc-600"
                                    { ...field }
                                    placeholder="Enter the project description"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="members"
                    render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel className="font-medium text-gray-100/50">Team Members</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    currentUser={currentUser}
                                    allUsers={allUsers}
                                    value={field.value}
                                    onChange={(selectedUsers) => {
                                        field.onChange(selectedUsers);
                                    }}
                                />
                            </FormControl>
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
