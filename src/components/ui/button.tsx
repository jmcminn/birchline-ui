import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-[color,background-color,border-color,filter] focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover hover:brightness-90",
        secondary: "bg-card text-foreground border border-border hover:bg-accent hover:border-gray-500 hover:brightness-90 dark:hover:brightness-125",
        ghost: "text-secondary-foreground hover:bg-accent hover:brightness-90 dark:hover:brightness-125",
        destructive: "bg-danger text-primary-foreground hover:bg-danger-hover hover:brightness-90",
        link: "text-primary underline-offset-4 hover:underline",
        outline: "border border-border bg-background hover:bg-accent hover:border-gray-500 hover:brightness-90 dark:hover:brightness-125 text-foreground",
      },
      size: {
        // Large/Medium match Input/Select at 38/32px. `default` is an alias of `lg`.
        lg: "h-[38px] px-4 text-sm rounded-sm",
        default: "h-[38px] px-4 text-sm rounded-sm",
        md: "h-8 px-3 text-[13px] leading-[18px] rounded-sm",
        sm: "h-7 px-2.5 text-xs leading-4 rounded-sm",
        icon: "h-[38px] w-[38px] rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        data-slot="button"
        data-variant={variant ?? "default"}
        data-size={size ?? "lg"}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
