'use client'

import { BugIcon, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";
import AddComment from "./add-comment";
import CommentList from "./comment-list";
import BugsInfo from "./bug-info";

export default function ProjectPage() {
    const params = useParams();
    const issueId = params?.issueId as string;

    return(
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-transparent rounded-xl p-6 flex flex-col border border-[#1F1F23]">
                    <h2 className="text-lg font-bold text-white mb-4 text-left flex items-center gap-2 ">
                        <BugIcon className="w-4 h-4 text-zinc-50" />
                        Issues
                    </h2>
                    <div className="flex-1">
                        <BugsInfo id={issueId}/>
                    </div>
                </div>
                <div className="bg-transparent rounded-xl p-6 flex flex-col border border-[#1F1F23]">
                    <div className="text-lg font-bold text-white mb-4 text-left flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-zinc-50" />
                        Comments
                    </div>
                    <div className="flex-1">
                        <CommentList/>
                    </div>
                    <AddComment/>
                </div>
            </div>
        </div>
    )
}