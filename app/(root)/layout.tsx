import Sidebar from "@/components/sidebar";
import TopNavbar from "@/components/top-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
    return(
        <main className="w-screen h-screen overflow-hidden flex flex-col items-center relative">
            <div className="absolute top-0 z-[0] h-screen w-screen bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <div className="w-full text-gray-600 transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] flex h-screen bg-transparent">
                <Sidebar/>
                <div className="w-full flex flex-1 flex-col">
                    <header className="h-16 border-b border-[#1F1F23]">
                        <TopNavbar />
                    </header>
                    <main className="flex-1 overflow-auto p-6">{children}</main>
                </div>
            </div>
        </main>
    )
}