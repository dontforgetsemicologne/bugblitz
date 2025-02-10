import { LogOut, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Link from "next/link"
import { handleSignOut } from "@/app/actions/authActions"
import { getInitials } from "@/data/navbar";

interface ProfileProps {
    name: string;
    role: string;
    image: string;
}

export default function Profile({ name, role, image }: ProfileProps) {
    return (
        <div className="w-full max-w-xs mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-zinc-800 border border-zinc-800">
                <div className="relative px-6 pt-12 pb-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative shrink-0">
                            <Avatar className="rounded-full ring-4 ring-zinc-900 object-cover">
                                <AvatarImage src={image ?? ''} alt={name ?? ''} height={72} width={72}/>
                                <AvatarFallback>{getInitials(name)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-zinc-900" />
                        </div>
                        {/* Profile Info */}
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-zinc-100">{name}</h2>
                            <p className="text-zinc-400">{role}</p>
                        </div>
                    </div>
                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-6" />
                    <div className="space-y-2">
                        <Link
                            href={'/profile-settings'}
                            className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded-lg transition-colors duration-200"
                        >
                            <div className="flex items-center gap-2">
                                <Settings className="w-4 h-4"/>
                                <span className="text-sm font-medium text-zinc-100">Profile Settings</span>
                            </div>
                        </Link>
                        <button
                            type="button"
                            className="w-full flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded-lg transition-colors duration-200"
                            onClick={handleSignOut}
                        >
                            <div className="flex items-center gap-2">
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium text-zinc-100">Logout</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
