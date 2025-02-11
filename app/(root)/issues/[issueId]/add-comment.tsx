'use client'

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
    PopoverForm,
    PopoverFormButton,
    PopoverFormCutOutLeftIcon,
    PopoverFormCutOutRightIcon,
    PopoverFormSeparator,
    PopoverFormSuccess,
} from "@/components/ui/popover-form"

import { useParams, useRouter } from "next/navigation";
import { createComment } from "@/app/actions/commentActions";

import { toast } from "@/hooks/use-toast";

type FormState = "idle" | "loading" | "success"

export default function AddComment() {
    const [formState, setFormState] = useState<FormState>("idle")
    const [open, setOpen] = useState(false);
    const [comment, setComment] = useState("");

    const router = useRouter();
    const params = useParams();
    const bugId = params?.issueId as string;

    const handleSubmit = async () => {
        if (!comment) return;
        
        setFormState("loading");
        try {
            const result = await createComment(bugId, {
                content: comment
            });

            if (!result.success) {
                throw new Error(result.error);
            }

            toast({
                description: (
                    <div className="relative w-full overflow-hidden rounded-xl border bg-emerald-950/20 border-emerald-800/30 p-4 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-emerald-200 dark:bg-emerald-900/50 p-1">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            </div>
                            <p className="text-sm font-medium text-emerald-200">Comment added successfully</p>
                        </div>
                    </div>
                )
            });
            
            setFormState("success");
            setComment("");
            setOpen(false);
            router.refresh();
        } catch (error) {
            setFormState("idle");
            toast({
                description: (
                    <div className="relative overflow-hidden rounded-lg border bg-red-950/20 border-red-800/30 p-4 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-red-900/50 p-1">
                                <CheckCircle2 className="h-4 w-4 text-red-400" />
                            </div>
                            <p className="text-sm font-medium text-red-200">
                                {error instanceof Error ? error.message : "Failed to add comment"}
                            </p>
                        </div>
                    </div>
                )
            });
        }
    };

    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            if (event.key === "Escape") { 
                setOpen(false);
            }
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && open && formState === "idle") {
                await handleSubmit();
            }
        };
      
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, formState, handleSubmit]);
    
    return (
        <div className="flex w-full items-center justify-center">
            <PopoverForm
                title="Comment"
                open={open}
                setOpen={setOpen}
                width="364px"
                height="192px"
                showCloseButton={formState !== "success"}
                showSuccess={formState === "success"}
                openChild={
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await handleSubmit();
                        }}
                        className=""
                    >
                        <div className="relative">
                            <textarea
                                autoFocus
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="h-32 w-full resize-none rounded-t-lg p-3 text-sm outline-none text-black"
                                required
                            />
                        </div>
                        <div className="relative flex h-12 items-center px-[10px]">
                            <PopoverFormSeparator />
                            <div className="absolute left-0 top-0 -translate-x-[1.5px] -translate-y-1/2">
                                <PopoverFormCutOutLeftIcon />
                            </div>
                            <div className="absolute right-0 top-0 translate-x-[1.5px] -translate-y-1/2 rotate-180">
                                <PopoverFormCutOutRightIcon />
                            </div>
                            <PopoverFormButton
                                loading={formState === "loading"}
                                text="Submit"
                            />
                        </div>
                    </form>
                }
                successChild={
                    <PopoverFormSuccess
                        title="Comment Added"
                        description="Your comment has been added successfully!"
                    />
                }
            />
        </div>
    );
}