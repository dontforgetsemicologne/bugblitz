import { ChevronRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function LoadingButton({ pending, children }: { pending: boolean, children: React.ReactNode }) {
  const buttonClasses = `w-full group px-4 py-4 font-geist tracking-tighter text-xl text-white font-medium bg-purple-200/10 transform-gpu rounded-lg duration-150 dark:[border:1px_solid_rgba(255,255,255,.1)] rounded-xl dark:box-shadow:0_-20px_80px_-20px_#8686f01f_inset] hover:bg-transparent/10 active:bg-purple-600`;

  return (
    <button className={buttonClasses} disabled={pending}>
      {pending ? (
        <div className="inline-flex items-center">
          <Spinner variant="bars" />
        </div>
      ) : (
        <>
          {children}
          <ChevronRight className="inline-flex items-center w-4 h-4 ml-2 group-hover:translate-x-1 duration-300" />
        </>
      )}
    </button>
  );
}