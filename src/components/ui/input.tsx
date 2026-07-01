import * as React from "react"
import { useState, useRef, useCallback } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, type, value: controlledValue, defaultValue, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(
      defaultValue !== undefined ? String(defaultValue) : ""
    )
    const inputRef = useRef<HTMLInputElement | null>(null)

    const isControlled = controlledValue !== undefined
    const displayValue = isControlled ? controlledValue : internalValue
    const hasValue = String(displayValue).length > 0

    const setRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
      },
      [ref]
    )

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (!isControlled) setInternalValue(e.target.value)
      onChange?.(e)
    }

    function handleClear() {
      const input = inputRef.current
      if (!input) return
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, "value"
      )?.set
      nativeInputValueSetter?.call(input, "")
      input.dispatchEvent(new Event("input", { bubbles: true }))
      if (!isControlled) setInternalValue("")
      input.focus()
    }

    return (
      <div className={cn("relative w-full", wrapperClassName)}>
        <input
          type={type}
          className={cn(
            "flex h-[38px] w-full rounded-sm border border-border bg-card px-3 text-sm text-foreground transition-colors",
            "placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            hasValue && "pr-8",
            className
          )}
          ref={setRef}
          value={isControlled ? controlledValue : internalValue}
          onChange={handleChange}
          {...props}
        />
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            tabIndex={-1}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
