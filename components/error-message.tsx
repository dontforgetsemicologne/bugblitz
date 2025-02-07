import { TriangleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ErrorMessage({ error }: { error: string }) {
  return (
    <div
      className={cn(
        "flex w-full items-center p-2 gap-2 text-sm rounded-xl duration-150 justify-center",
        "bg-red-50 dark:bg-red-700/20 text-red-500 dark:text-red-500/80 border border-red-500/30 dark:border-red-700/50",  // Error-specific styles
        "transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset]"
      )}
      role="alert"
    >
      <TriangleIcon className="h-4 w-4 text-red-500 dark:text-red-500" />
      <span className="sr-only">Error</span>
      <div>{error}</div>
    </div>
  );
}