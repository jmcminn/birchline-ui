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
        default: "h-9 px-4 rounded-sm",
        sm: "h-8 px-3 text-xs rounded-sm",
        lg: "h-10 px-6 rounded-sm",
        icon: "h-9 w-9 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
