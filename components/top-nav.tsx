import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import Profile from "@/components/profile";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/data/user";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar";
import { getInitials } from "@/data/navbar";

export default async function TopNavbar() {
    const session = await auth();
    
    if(!session?.user) {
        redirect('/auth/login');
    }

    const loggedEmail = session.user.email;

    const user = loggedEmail ? await getUserByEmail(loggedEmail) : null;
    
    if(!user) {
        return <div>User not found</div>
    }

    return (
        <nav className="px-3 sm:px-6 flex items-center justify-end bg-transparent border-[#1F1F23] h-full">
            <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
                <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                        <Avatar className="rounded-full ring-2 ring-[#2B2B30] sm:w-8 sm:h-8 cursor-pointer">
                            <AvatarImage src={user.image ?? ''} height={28} width={28}/>
                            <AvatarFallback className="bg-transparent text-white text-sm">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        sideOffset={10}
                        className="w-60 sm:w-80 bg-trackparent border-border rounded-lg shadow-lg"
                    >
                        <Profile 
                            name={user.name ?? ''}
                            image={user.image ?? ''}
                            role={user.role ?? ''}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}
