import { Folder } from "lucide-react";
import ProjectList from "@/components/project-list";
import ProjectForm from "@/components/project-form";

export default function ProjectsPage() {
    return (
        <div className="bg-transparent rounded-xl p-6 flex flex-col items-start justify-start border border-[#1F1F23]">
            <div className="w-full flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white text-left flex items-center gap-2">
                    <Folder className="w-3.5 h-3.5 text-zinc-50" />
                    Projects
                </h2>
                <ProjectForm/>
            </div>
            <ProjectList/>
        </div>
    )
}
