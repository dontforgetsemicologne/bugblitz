"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from "@/lib/utils";
import { signInSchema } from "@/lib/zod";

import { handleCredentialsSignIn, handleGithubSignIn } from "@/app/actions/authActions";

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

function SignInPage() {
    const params = useSearchParams();
    const error = params.get("error");
    const router = useRouter();

    const [reset, setReset] = useState(false);
    const [globalError, setGlobalError] = useState<string>('');

    useEffect(() => {
        if(error) {
            switch(error) {
                case "OAuthAccountNotLinked":
                    setGlobalError('Please use your email and password to sign in.');
                    break;
                default: 
                    setGlobalError('An unexpected error occured. Please try again.');
            }
        }
        router.replace('/auth/signin');
    }, [error, router]);

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (values: z.infer<typeof signInSchema>) => {
        try {
            const result = await handleCredentialsSignIn(values);
            if (result?.message) {
                setGlobalError(result.message);
            }
        } catch(error) {
            console.log('An unexpected error occurred. Please try again!', error);
            setGlobalError('An unexpected error occurred. Please try again!');
        }
    }

    return (
        <Card className="w-full space-y-6 text-gray-600 sm:max-w-md md:max-w-lg lg:max-w-lg px-5 py-6 rounded-2xl transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset]">
            <CardHeader className="text-center">
                <div className="mt-5 space-y-2">
                    <h3 className="text-gray-200 text-2xl font-normal sm:text-3xl tracking-tighter font-geist">
                        Log in to your account
                    </h3>
                    <p className="text-gray-400">
                        Don&apos;t have an account?{" "}
                        <a
                            href="/auth/signup"
                            className="font-medium text-purple-600 hover:text-purple-500"
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </CardHeader>
            <CardContent className="bg-transparent shadow p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg grid grid-cols-1">
                { globalError && <ErrorMessage error={ globalError }/> }
                <form action={handleGithubSignIn} className="group flex gap-2 transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] border-white/10  items-center justify-center py-3 border rounded-xl hover:bg-transparent/50 duration-150 active:bg-transparent/50">
                    <button
                        onMouseEnter={() => setReset(false)}
                        onMouseLeave={() => setReset(true)}
                        className="flex gap-2"
                        type="submit"
                    >
                        <svg
                            className={cn(
                            "w-5 h-5 group-hover:-translate-y-1 duration-300 transition-all ",
                            reset ? "translate-y-0" : "tranistion-transform"
                            )}
                            viewBox="0 0 48 48"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_910_21)">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M24.0005 1C18.303 1.00296 12.7923 3.02092 8.45374 6.69305C4.11521 10.3652 1.23181 15.452 0.319089 21.044C-0.593628 26.636 0.523853 32.3684 3.47174 37.2164C6.41963 42.0643 11.0057 45.7115 16.4099 47.5059C17.6021 47.7272 18.0512 46.9883 18.0512 46.36C18.0512 45.7317 18.0273 43.91 18.0194 41.9184C11.3428 43.3608 9.93197 39.101 9.93197 39.101C8.84305 36.3349 7.26927 35.6078 7.26927 35.6078C5.09143 34.1299 7.43223 34.1576 7.43223 34.1576C9.84455 34.3275 11.1123 36.6194 11.1123 36.6194C13.2504 40.2667 16.7278 39.2116 18.0949 38.5952C18.3095 37.0501 18.9335 35.999 19.621 35.4023C14.2877 34.8017 8.68408 32.7548 8.68408 23.6108C8.65102 21.2394 9.53605 18.9461 11.156 17.2054C10.9096 16.6047 10.087 14.1785 11.3905 10.8829C11.3905 10.8829 13.4054 10.2427 17.9916 13.3289C21.9253 12.2592 26.0757 12.2592 30.0095 13.3289C34.5917 10.2427 36.6026 10.8829 36.6026 10.8829C37.9101 14.1706 37.0875 16.5968 36.8411 17.2054C38.4662 18.9464 39.353 21.2437 39.317 23.6187C39.317 32.7824 33.7015 34.8017 28.3602 35.3905C29.2186 36.1334 29.9856 37.5836 29.9856 39.8122C29.9856 43.0051 29.9578 45.5736 29.9578 46.36C29.9578 46.9962 30.391 47.7391 31.6071 47.5059C37.0119 45.7113 41.5984 42.0634 44.5462 37.2147C47.4941 32.3659 48.611 26.6326 47.6972 21.0401C46.7835 15.4476 43.8986 10.3607 39.5587 6.68921C35.2187 3.01771 29.7067 1.00108 24.0085 1H24.0005Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M9.08887 35.264C9.03721 35.3826 8.84645 35.4181 8.69146 35.3351C8.53646 35.2522 8.42122 35.098 8.47686 34.9755C8.5325 34.853 8.71928 34.8214 8.87428 34.9044C9.02927 34.9874 9.14848 35.1455 9.08887 35.264Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M10.0626 36.3428C9.98028 36.384 9.88612 36.3955 9.79622 36.3753C9.70632 36.3551 9.62629 36.3045 9.56979 36.2321C9.41479 36.0662 9.38298 35.837 9.50221 35.7342C9.62143 35.6315 9.83606 35.6789 9.99105 35.8449C10.146 36.0108 10.1818 36.24 10.0626 36.3428Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M11.0085 37.714C10.8614 37.8167 10.6111 37.714 10.472 37.5085C10.4335 37.4716 10.4029 37.4274 10.382 37.3785C10.3611 37.3297 10.3503 37.2771 10.3503 37.224C10.3503 37.1709 10.3611 37.1183 10.382 37.0694C10.4029 37.0205 10.4335 36.9763 10.472 36.9395C10.619 36.8407 10.8694 36.9395 11.0085 37.141C11.1476 37.3425 11.1516 37.6112 11.0085 37.714Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M12.2921 39.0417C12.161 39.1879 11.8947 39.1484 11.6761 38.9508C11.4575 38.7532 11.4059 38.4845 11.537 38.3423C11.6682 38.2 11.9344 38.2395 12.161 38.4331C12.3875 38.6268 12.4312 38.8994 12.2921 39.0417Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M14.0923 39.8162C14.0327 40.0019 13.7625 40.0849 13.4922 40.0059C13.222 39.9268 13.0432 39.7055 13.0948 39.5159C13.1465 39.3262 13.4207 39.2393 13.6949 39.3262C13.9691 39.4131 14.144 39.6226 14.0923 39.8162Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M16.0557 39.9505C16.0557 40.1442 15.8331 40.3101 15.547 40.3141C15.2608 40.318 15.0264 40.16 15.0264 39.9663C15.0264 39.7727 15.2489 39.6067 15.535 39.6028C15.8212 39.5988 16.0557 39.753 16.0557 39.9505Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M17.8838 39.6463C17.9196 39.8399 17.7208 40.0414 17.4347 40.0888C17.1486 40.1363 16.8982 40.0217 16.8624 39.832C16.8267 39.6423 17.0333 39.4368 17.3115 39.3855C17.5897 39.3341 17.848 39.4526 17.8838 39.6463Z"
                                    fill="currentColor"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_910_21">
                                    <rect width="48" height="48" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <span className={cn("group-hover:-translate-y-1 duration-300 transition-all ", reset ? "translate-y-0" : "tranistion-transform")}>Login with Github</span>
                    </button>{" "}
                </form>
                <div className="relative">
                    <span className="block w-full h-px bg-transparent"></span>
                    <p className="inline-block w-fit text-md text-gray-200 px-2 absolute -top-4 inset-x-0 mx-auto">
                        Or continue with
                    </p>
                </div>
                <Form {...form}>
                    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium text-gray-100/50">Email</FormLabel>
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
                        <LoadingButton pending={form.formState.isSubmitting}>Sign In</LoadingButton>
                        <div className="text-center">
                            <a href="javascript:void(0)" className="hover:text-purple-600">
                                Forgot password?
                            </a>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default function SignIn() {
    return (
        <main className="w-screen h-screen overflow-hidden flex flex-col items-center justify-center sm:px-4 relative">
            <div className="absolute top-0 z-[0] h-screen w-screen bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <Suspense 
                fallback={
                    <div className="w-screen h-screen flex flex-col items-center justify-center">
                        Loading...
                    </div>
                }
            >
                <SignInPage/>
            </Suspense>
        </main>
    );
}




            