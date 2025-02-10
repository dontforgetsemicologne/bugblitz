import { 
    BarChart2, 
    Folder, 
    Home, 
    LucideIcon, 
    Wrench 
} from "lucide-react";

interface NavItemProps {
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
    href: string;
}

export const navigation: NavItemProps[] = [
    { title: 'Home', icon: Home, href: '/' },
    { title: 'Projects', icon: Folder, href: '/projects' },
    { title: 'Issues', icon: Wrench, href: '/issues' },
]

export const getInitials = (name: string | null): string => {
    if(!name) {
        return 'NA'
    }

    const words = name.trim().split(' ');
    if(words.length > 1) {
        return (words[0][0] + words[1][0]).toUpperCase();
    } else {
        return (name.slice(0,1).toUpperCase() + name.slice(1,1));
    }
}