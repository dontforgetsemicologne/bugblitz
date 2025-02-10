'use client'

import Link from "next/link";
import { useState } from "react";
import { 
    BugPlay,
    LucideIcon, 
    Menu, 
    Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { navigation } from "@/data/navbar";

export default function Sidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    function handleNavigation() {
        setIsMobileMenuOpen(false);
    }

    function NavItem({ href, icon: Icon, children }: {
        href: string;
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
        children: React.ReactNode;
    }) {
        return (
            <Link 
                href={href}
                onClick={handleNavigation}
                className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-300 hover:text-white hover:bg-[#1F1F23] hover:rounded-xl"
            >
                <Icon className="h-4 w-4 mr-3 flex-shrink-0"/>
                { children }
            </Link>
        )
    }

    return(
        <>
            <button
                type="button"
                className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-[#0F0F12] shadow-md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <Menu className="h-5 w-5 text-gray-300" />
            </button>
            <nav
                className={cn(
                "fixed inset-y-0 left-0 z-[70] w-64 bg-transparent transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-64 border-r border-[#1F1F23]/90 backdrop-blur-3xl",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="h-full flex flex-col">
                    <Link
                        href={'/'}
                        className="h-16 px-6 flex items-center border-b border-[#1F1F23]"
                    >
                        <div className="flex items-center gap-3">
                            <BugPlay className="flex-shrink-0" height={32} width={32} color="white"/>
                            <span className="text-lg font-semibold hover:cursor-pointer text-white">
                                BugBlitz
                            </span>
                        </div>
                    </Link>
                
                    <div className="flex-1 overflow-y-auto py-4 px-4">
                        <div className="space-y-6">
                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Overview
                                </div>
                                <div className="space-y-1">
                                    { navigation.map((navItem, index) => (
                                        <NavItem
                                            key={index}
                                            href={navItem.href}
                                            icon={navItem.icon}
                                        >
                                            {navItem.title}
                                        </NavItem>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-4 border-t border-[#1F1F23]">
                        <div className="space-y-1">
                            <NavItem href="/profile-settings" icon={Settings}>
                                Settings
                            </NavItem>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
} 