import { Plus } from "lucide-react";

import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";

import AddIssueForm from "@/components/add-issue-form";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { getAllUsers } from "@/app/actions/userActions";
import getUserProjects from "@/app/actions/projectAction";

export default async function IssueForm() {
    const currentUser = await getCurrentUser();
    const { users: allUsers } = await getAllUsers();

    const userProjects = await getUserProjects();

    if(!currentUser) {
        return <div>Not logged in</div>;
    }

    if(!allUsers) {
        return <div>Failed to load users!</div>;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button 
                    className="flex items-center gap-1 text-sm text-white px-3 py-1.5 bg-transparent rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all duration-200 shadow-sm backdrop-blur-xl"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Issues
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Issues</DialogTitle>
                    <DialogDescription>
                        
                    </DialogDescription>
                </DialogHeader>
                <AddIssueForm currentUser={currentUser} allUsers={allUsers} userProjects={userProjects}/>
            </DialogContent>
        </Dialog>
    )
}

