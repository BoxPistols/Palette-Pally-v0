/**
 * UI utility functions for styling and presentation
 */

import type { WCAGLevel } from "@/types/palette"

/**
 * Returns Tailwind CSS classes for WCAG level badge styling
 * @param level - WCAG accessibility level (AAA, AA, A, or Fail)
 * @returns Tailwind CSS classes for background and text color
 */
export function getWCAGLevelBadgeClass(level: WCAGLevel): string {
  switch (level) {
    case "AAA":
      return "bg-green-100 text-green-800"
    case "AA":
      return "bg-blue-100 text-blue-800"
    case "A":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-red-100 text-red-800"
  }
}
