import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-ink group-[.toaster]:border-gray-300 group-[.toaster]:shadow-md group-[.toaster]:rounded-md",
          title: "group-[.toast]:text-base group-[.toast]:leading-[1.55] group-[.toast]:font-semibold",
          description: "group-[.toast]:text-gray-500 group-[.toast]:text-sm group-[.toast]:leading-[1.5] group-[.toast]:font-normal",
          actionButton:
            "group-[.toast]:bg-clay group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
