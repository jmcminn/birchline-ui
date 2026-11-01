import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// deliberate type error to prove the required check blocks merging
export const proveRequiredCheck: number = "not a number"
