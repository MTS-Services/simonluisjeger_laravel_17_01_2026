import { cn } from "@/lib/utils"
export default function Text({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("block text-center text-3xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-bold leading-10 sm:leading-14 md:leading-20 lg:leading-16 xl:leading-20 text-white", className)}>{children}</div>
    )
}
