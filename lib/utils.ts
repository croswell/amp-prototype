import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Build a query string preserving persona and view params. */
export function buildPersonaParams(
  persona: string,
  view: string | null,
  role: string
): string {
  const params = new URLSearchParams()
  if (persona !== "publisher") params.set("role", persona)
  if (view && role === "both") params.set("view", view)
  return params.toString() ? `?${params.toString()}` : ""
}

/** Strip protocol prefix from a URL for display. */
export function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "")
}
