import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-clay text-white hover:bg-clay-hover",
        secondary: "bg-white text-ink border border-gray-300 hover:bg-gray-100",
        ghost: "text-gray-700 hover:bg-gray-100",
        destructive: "bg-danger text-white hover:bg-danger-hover",
        link: "text-clay underline-offset-4 hover:underline",
        outline: "border border-gray-300 bg-ivory hover:bg-gray-100 text-ink",
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
