import { useMemo } from "react"
import { calculateContrastRatio, getWCAGLevel } from "@/lib/color-utils"
import { getWCAGLevelBadgeClass } from "@/lib/ui-utils"

/**
 * Custom hook to calculate contrast information for a background/text color pair
 * @param bgColor - Background color in hex format
 * @param textColor - Text color in hex format (optional, defaults to "#FFFFFF")
 * @returns Contrast ratio, WCAG level info, badge CSS class, and text color used
 */
export function useContrastInfo(bgColor: string, textColor?: string) {
  return useMemo(() => {
    const text = textColor || "#FFFFFF"
    const contrast = calculateContrastRatio(bgColor, text)
    const wcagLevel = getWCAGLevel(contrast)
    const levelColor = getWCAGLevelBadgeClass(wcagLevel.level)

    return {
      contrast,
      wcagLevel,
      levelColor,
      textColor: text,
    }
  }, [bgColor, textColor])
}
