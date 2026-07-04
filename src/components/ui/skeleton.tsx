import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bl-skeleton rounded-sm", className)}
      {...props}
    />
  )
}

export { Skeleton }
