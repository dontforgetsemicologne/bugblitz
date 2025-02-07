import { handleSignOut } from "./actions/authActions";

export default function HomePage() {
  return (
    <main className="w-screen h-screen overflow-hidden flex flex-col items-center justify-center sm:px-4 relative">
      <div className="absolute top-0 z-[0] h-screen w-screen bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md md:max-w-lg lg:max-w-lg px-5 py-6 rounded-2xl transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset]">
        <button onClick={handleSignOut} className="px-4 border border-black">hey there</button>
      </div>
    </main>
  );
}
