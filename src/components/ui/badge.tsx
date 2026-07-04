import * as React from "react"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-500/20 text-secondary-foreground",
        accent: "bg-primary/15 text-primary",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        destructive: "bg-danger/15 text-danger",
        info: "bg-info/15 text-info",
        muted: "bg-gray-500/15 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * When provided, renders a trailing remove (×) button. The badge itself
   * stays non-interactive; only the × is a button.
   */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /**
   * Accessible label for the remove button. Defaults to "Remove".
   * Recommended: pass the badge's text content for clarity, e.g. "Remove In review".
   */
  removeLabel?: string
}

function Badge({
  className,
  variant,
  onRemove,
  removeLabel,
  children,
  ...props
}: BadgeProps) {
  const removable = typeof onRemove === "function"
  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        removable && "gap-1 pr-1",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {removable && (
        <button
          type="button"
          aria-label={removeLabel ?? "Remove"}
          onClick={onRemove}
          className={cn(
            "inline-flex size-[1.15em] items-center justify-center rounded-full",
            "opacity-70 hover:opacity-100 hover:bg-current/10",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-current",
            "transition-opacity"
          )}
        >
          <X className="size-[1em]" strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}

export { Badge, badgeVariants }
