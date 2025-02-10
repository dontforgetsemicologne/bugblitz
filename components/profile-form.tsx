'use client'

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'

import { updateProfileSchema } from "@/lib/zod";

import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel 
} from "@/components/ui/form";

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { getInitials } from "@/data/navbar";
import { Button } from "./ui/button";
import { handleProfileUpdate } from "@/app/actions/userActions";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileFormValues {
    name: string;
    email: string;
    role: string;
    image: string;
}

interface ProfileFormProps {
    initialData: ProfileFormValues;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: initialData.name,
            role: initialData.role
        }
    });

    const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
        startTransition(async () => {
            try {
                const result = await handleProfileUpdate({
                    name: values.name ?? initialData.name,
                    email: initialData.email,
                    role: values.role ?? initialData.role
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
                    console.log('');
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
        <div className="w-full max-w-xl mx-auto space-y-8 p-6 bg-transparent backdrop-blur-xs rounded-xl border border-zinc-800/80 shadow-xs">
            <div className="flex items-center justify-center gap-6">
                <Avatar className="h-24 w-24 rounded-full border-2 border-zinc-800/80 shadow-xs">
                    <AvatarImage src={initialData.image} className="rounded-full object-cover" />
                    <AvatarFallback className="bg-zinc-800/80">{getInitials(initialData.name)}</AvatarFallback>
                </Avatar>
            </div>
            <div className="grid gap-6">
                <Form {...form}>
                    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel className="font-medium text-gray-100/50">Display Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl border-zinc-800/80 focus:ring-1 focus:ring-zinc-800 placeholder:text-zinc-600"
                                            { ...field }
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-zinc-700 dark:text-zinc-300">
                                Email
                            </Label>
                            <Input
                                defaultValue={initialData.email}
                                disabled
                                className="w-full text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl border-zinc-800/80 focus:ring-1 focus:ring-zinc-800 placeholder:text-zinc-600"
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel className="font-medium text-gray-100/50">Role</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl border-zinc-800/80 focus:ring-1 focus:ring-zinc-800 placeholder:text-zinc-600"
                                            { ...field }
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
            </div>
        </div>
    );
}
