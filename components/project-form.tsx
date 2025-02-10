import { Plus } from "lucide-react";

import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";

import AddProjectForm from "@/components/add-project-form";

import { getCurrentUser } from "@/lib/getCurrentUser";
import { getAllUsers } from "@/app/actions/userActions";

export default async function ProjectForm() {
    const currentUser = await getCurrentUser();
    const { users: allUsers } = await getAllUsers();

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
                    Add Project
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Project</DialogTitle>
                    <DialogDescription>
                        
                    </DialogDescription>
                </DialogHeader>
                <AddProjectForm currentUser={currentUser} allUsers={allUsers}/>
            </DialogContent>
        </Dialog>
    )
}
