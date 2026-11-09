import { Toaster as Sonner } from "sonner"
import { IconAlertCircle, IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconLoader4 } from "@tabler/icons-react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <IconCircleCheck className="size-5" />,
        info: <IconInfoCircle className="size-5" />,
        warning: <IconAlertTriangle className="size-5" />,
        error: <IconAlertCircle className="size-5" />,
        loading: <IconLoader4 className="size-5 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-popover group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-md group-[.toaster]:rounded-md",
          title: "group-[.toast]:text-base group-[.toast]:leading-[1.55] group-[.toast]:font-semibold",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:leading-[1.5] group-[.toast]:font-normal",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-accent group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
