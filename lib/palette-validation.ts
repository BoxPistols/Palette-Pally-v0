/**
 * Storage validation utilities for general Palette Pally
 * Validates and sanitizes localStorage data to prevent runtime errors
 */

import type { ColorData, TextColorSettings as TextColorSettingsType } from "@/types/palette"
import type { ColorMode } from "@/lib/color-systems"

interface StoredPaletteData {
  colors?: ColorData[]
  variations?: Record<string, Record<string, string>>
  textColorSettings?: TextColorSettingsType
  primaryColorIndex?: number
  colorMode?: ColorMode
  showTailwindClasses?: boolean
  showMaterialNames?: boolean
  typographyTokens?: Record<string, any>
  isFigmaImportMode?: boolean
  isTypographyOnly?: boolean
  activeTab?: "colors" | "typography"
}

/**
 * Validates a single ColorData object
 */
function isValidColorData(color: any): color is ColorData {
  if (!color || typeof color !== "object") return false

  // Required fields
  if (typeof color.name !== "string" || !color.name) return false
  if (typeof color.value !== "string" || !/^#[0-9A-F]{6}$/i.test(color.value)) return false

  // Optional fields - validate only if present
  if (color.role !== undefined && typeof color.role !== "string") return false
  if (color.group !== undefined && typeof color.group !== "string") return false

  if (color.variations !== undefined) {
    if (typeof color.variations !== "object" || color.variations === null) return false
  }

  return true
}

/**
 * Validates TextColorSettings object
 */
function isValidTextColorSettings(settings: any): settings is TextColorSettingsType {
  if (!settings || typeof settings !== "object") return false

  const validValues = ["default", "light", "dark"]

  if (settings.main && !validValues.includes(settings.main)) return false
  if (settings.dark && !validValues.includes(settings.dark)) return false
  if (settings.light && !validValues.includes(settings.light)) return false
  if (settings.lighter && !validValues.includes(settings.lighter)) return false

  return true
}

/**
 * Validates ColorMode
 */
function isValidColorMode(mode: any): mode is ColorMode {
  return mode === "standard" || mode === "material" || mode === "tailwind"
}

/**
 * Checks if the data structure is from a very old/incompatible version
 */
export function isLegacyPaletteFormat(data: any): boolean {
  if (!data || typeof data !== "object") return false

  // Check for very old format patterns that are incompatible
  // Old format had variations with different structure, or missing critical fields
  if (data.colors && Array.isArray(data.colors)) {
    // If colors array exists but all items are invalid, it's likely legacy data
    const hasValidColor = data.colors.some((c: any) =>
      c && typeof c === "object" && "name" in c && "value" in c
    )

    // If no valid colors found and the array is not empty, it's legacy
    if (data.colors.length > 0 && !hasValidColor) {
      return true
    }
  }

  // Check for fields that should never exist in current version
  const invalidFields = ["variationSettings", "greyScale"]
  if (invalidFields.some(field => field in data)) {
    return true
  }

  return false
}

/**
 * Validates complete palette data from localStorage
 */
export function validatePaletteData(data: any): {
  isValid: boolean
  errors: string[]
  sanitizedData: StoredPaletteData | null
} {
  const errors: string[] = []

  if (!data || typeof data !== "object") {
    return {
      isValid: false,
      errors: ["Data is not a valid object"],
      sanitizedData: null,
    }
  }

  const sanitizedData: StoredPaletteData = {}

  // Validate colors array if present
  if (data.colors !== undefined) {
    if (!Array.isArray(data.colors)) {
      errors.push("colors field must be an array")
    } else {
      const validColors = data.colors.filter((color: any) => {
        const isValid = isValidColorData(color)
        if (!isValid && color) {
          errors.push(`Invalid color data: ${JSON.stringify(color).substring(0, 100)}`)
        }
        return isValid
      })

      if (validColors.length > 0) {
        sanitizedData.colors = validColors
      } else if (data.colors.length > 0) {
        errors.push("No valid colors found in the array")
      }
    }
  }

  // Validate variations
  if (data.variations !== undefined) {
    if (typeof data.variations === "object" && data.variations !== null) {
      sanitizedData.variations = data.variations
    } else {
      errors.push("Invalid variations structure")
    }
  }

  // Validate textColorSettings
  if (data.textColorSettings !== undefined) {
    if (isValidTextColorSettings(data.textColorSettings)) {
      sanitizedData.textColorSettings = data.textColorSettings
    } else {
      errors.push("Invalid textColorSettings")
    }
  }

  // Validate primaryColorIndex
  if (data.primaryColorIndex !== undefined) {
    if (typeof data.primaryColorIndex === "number" && data.primaryColorIndex >= 0) {
      sanitizedData.primaryColorIndex = data.primaryColorIndex
    } else {
      errors.push("Invalid primaryColorIndex")
    }
  }

  // Validate colorMode
  if (data.colorMode !== undefined) {
    if (isValidColorMode(data.colorMode)) {
      sanitizedData.colorMode = data.colorMode
    } else {
      errors.push(`Invalid colorMode: ${data.colorMode}`)
    }
  }

  // Validate boolean fields
  if (typeof data.showTailwindClasses === "boolean") {
    sanitizedData.showTailwindClasses = data.showTailwindClasses
  }

  if (typeof data.showMaterialNames === "boolean") {
    sanitizedData.showMaterialNames = data.showMaterialNames
  }

  if (typeof data.isFigmaImportMode === "boolean") {
    sanitizedData.isFigmaImportMode = data.isFigmaImportMode
  }

  if (typeof data.isTypographyOnly === "boolean") {
    sanitizedData.isTypographyOnly = data.isTypographyOnly
  }

  // Validate typographyTokens
  if (data.typographyTokens !== undefined) {
    if (typeof data.typographyTokens === "object" && data.typographyTokens !== null) {
      sanitizedData.typographyTokens = data.typographyTokens
    } else {
      errors.push("Invalid typographyTokens")
    }
  }

  // Validate activeTab
  if (data.activeTab !== undefined) {
    if (data.activeTab === "colors" || data.activeTab === "typography") {
      sanitizedData.activeTab = data.activeTab
    } else {
      errors.push("Invalid activeTab")
    }
  }

  // Data is considered valid if we have at least colors or typography tokens
  const hasValidData =
    (sanitizedData.colors && sanitizedData.colors.length > 0) ||
    (sanitizedData.typographyTokens && Object.keys(sanitizedData.typographyTokens).length > 0)

  return {
    isValid: hasValidData,
    errors,
    sanitizedData: hasValidData ? sanitizedData : null,
  }
}
