"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from "@/lib/utils";
import { signUpSchema } from "@/lib/zod";

import { handleCredentialsSignIn, handleSignUp } from "@/app/actions/authActions";

import { Input } from "@/components/ui/input";

import { 
    Card, 
    CardContent, 
    CardHeader 
} from "@/components/ui/card";

import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel 
} from "@/components/ui/form";

import LoadingButton from "@/components/loading-button";
import ErrorMessage from "@/components/error-message";

export default function SignUp() {
    const [reset, setReset] = useState(false);
    const [globalError, setGlobalError] = useState<string>('');

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
        try {
            const result: ServerActionResponse = await handleSignUp(values);
            if(result.success) {
                console.log('Account created successfully');
                const valuesForSignIn = {
                    email: values.email,
                    password: values.password
                };

                await handleCredentialsSignIn(valuesForSignIn);
            } else{
                setGlobalError(result.message);
            }
        } catch(error) {
            setGlobalError('An unexpected error occurred. Please try again!');
        }
    }
    return (
        <main className="w-screen h-screen overflow-hidden flex flex-col items-center justify-center sm:px-4 relative">
            <div className="absolute top-0 z-[0] h-screen w-screen bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <Card className="w-full space-y-6 text-gray-600 sm:max-w-md md:max-w-lg lg:max-w-lg px-5 py-6 rounded-2xl  transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset]">
                <CardHeader className="text-center -mb-4">
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-200 text-2xl font-normal sm:text-3xl tracking-tighter font-geist">
                            Create an account
                        </h3>
                        <p className="text-gray-400">
                            Already have an account?{" "}
                            <a
                                href="/auth/signin"
                                className="font-medium text-purple-600 hover:text-purple-500"
                            >
                                Sign in
                            </a>
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="bg-transparent shadow p-4 py-6 space-y-2 sm:p-6 sm:rounded-lg grid grid-cols-1">
                    { globalError && <ErrorMessage error={ globalError }/> }
                    <Form {...form}>
                        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium text-gray-100/50">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                required
                                                className="w-full mt-2 px-3 py-6 text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl"
                                                { ...field }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium text-gray-100/50">Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                required
                                                className="w-full mt-2 px-3 py-6 text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl"
                                                { ...field }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium text-gray-100/50">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                required
                                                className="w-full mt-2 px-3 py-6 text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl"
                                                { ...field }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium text-gray-100/50">Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                required
                                                className="w-full mt-2 px-3 py-6 text-gray-500 bg-transparent outline-none border focus:border-purple-600 shadow-sm rounded-xl"
                                                { ...field }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <LoadingButton pending={form.formState.isSubmitting}>Sign Up</LoadingButton>
                            <div className="text-center">
                                <a href="javascript:void(0)" className="hover:text-purple-600">
                                    Forgot password?
                                </a>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
}