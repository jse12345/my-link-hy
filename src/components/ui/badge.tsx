import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center font-black transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "bg-black text-white border border-black",
        hot:
          "bg-[#F43F5E] text-white border border-black shadow-[1px_1px_0px_#000]",
        new:
          "bg-[#22C55E] text-white border border-black shadow-[1px_1px_0px_#000]",
        gold:
          "bg-black text-[#FEF08A] border border-black",
        outline:
          "bg-white text-black border-[2px] border-black shadow-[2px_2px_0px_#000]",
        counter:
          "bg-white/90 text-neutral-800 border border-black/40",
      },
      size: {
        default: "px-2 py-0.5 text-[10px] rounded-[4px] uppercase tracking-wider",
        sm: "px-1.5 py-0.2 text-[9px] rounded-[3px]",
        lg: "px-2.5 py-1 text-xs rounded-[6px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
