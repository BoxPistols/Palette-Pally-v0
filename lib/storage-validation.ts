/**
 * Storage validation utilities for Palette Pally
 * Validates and sanitizes localStorage data to prevent runtime errors
 */

import type {
  PaletteType,
  MUIColorData,
  TextColors,
  BackgroundColors,
  ActionColors,
  CommonColors,
  GreyPalette,
  PaletteMode,
} from "@/types/palette"

/**
 * Validates a single MUIColorData object
 */
function isValidMUIColorData(color: any): color is MUIColorData {
  if (!color || typeof color !== "object") return false

  // Required fields
  if (typeof color.id !== "string" || !color.id) return false
  if (typeof color.name !== "string" || !color.name) return false
  if (typeof color.main !== "string" || !/^#[0-9A-F]{6}$/i.test(color.main)) return false
  if (!color.type || (color.type !== "theme" && color.type !== "simple")) return false

  // Optional fields - validate only if present
  if (color.light !== undefined && (typeof color.light !== "string" || !/^#[0-9A-F]{6}$/i.test(color.light))) {
    return false
  }
  if (color.lighter !== undefined && (typeof color.lighter !== "string" || !/^#[0-9A-F]{6}$/i.test(color.lighter))) {
    return false
  }
  if (color.dark !== undefined && (typeof color.dark !== "string" || !/^#[0-9A-F]{6}$/i.test(color.dark))) {
    return false
  }
  if (
    color.contrastText !== undefined &&
    (typeof color.contrastText !== "string" || !/^#[0-9A-F]{6}$/i.test(color.contrastText))
  ) {
    return false
  }
  if (color.isDefault !== undefined && typeof color.isDefault !== "boolean") {
    return false
  }

  return true
}

/**
 * Validates TextColors object
 */
function isValidTextColors(text: any): text is TextColors {
  if (!text || typeof text !== "object") return false
  return typeof text.primary === "string" && typeof text.secondary === "string" && typeof text.disabled === "string"
}

/**
 * Validates BackgroundColors object
 */
function isValidBackgroundColors(background: any): background is BackgroundColors {
  if (!background || typeof background !== "object") return false
  return typeof background.default === "string" && typeof background.paper === "string"
}

/**
 * Validates ActionColors object
 */
function isValidActionColors(action: any): action is ActionColors {
  if (!action || typeof action !== "object") return false

  const requiredStringFields = ["active", "hover", "selected", "disabled", "disabledBackground", "focus"]
  const requiredNumberFields = [
    "hoverOpacity",
    "selectedOpacity",
    "disabledOpacity",
    "focusOpacity",
    "activatedOpacity",
  ]

  for (const field of requiredStringFields) {
    if (typeof action[field] !== "string") return false
  }

  for (const field of requiredNumberFields) {
    if (typeof action[field] !== "number" || action[field] < 0 || action[field] > 1) return false
  }

  return true
}

/**
 * Validates CommonColors object
 */
function isValidCommonColors(common: any): common is CommonColors {
  if (!common || typeof common !== "object") return false
  return typeof common.black === "string" && typeof common.white === "string"
}

/**
 * Validates GreyPalette object
 */
function isValidGreyPalette(grey: any): grey is GreyPalette {
  if (!grey || typeof grey !== "object") return false

  const requiredKeys = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "A100", "A200", "A400", "A700"]

  for (const key of requiredKeys) {
    if (typeof grey[key] !== "string") return false
  }

  return true
}

/**
 * Validates PaletteMode
 */
function isValidPaletteMode(mode: any): mode is PaletteMode {
  return mode === "light" || mode === "dark"
}

/**
 * Validates a complete PaletteType object
 * Returns an object with validation result and error messages
 */
export function validatePaletteData(data: any): {
  isValid: boolean
  errors: string[]
  sanitizedData: PaletteType | null
} {
  const errors: string[] = []

  if (!data || typeof data !== "object") {
    return {
      isValid: false,
      errors: ["Data is not a valid object"],
      sanitizedData: null,
    }
  }

  // Validate colors array (required field)
  if (!data.colors || !Array.isArray(data.colors)) {
    errors.push("Missing or invalid 'colors' array")
    return { isValid: false, errors, sanitizedData: null }
  }

  // Validate each color in the array
  const validColors = data.colors.filter((color: any) => {
    const isValid = isValidMUIColorData(color)
    if (!isValid) {
      errors.push(`Invalid color data: ${JSON.stringify(color).substring(0, 100)}`)
    }
    return isValid
  })

  if (validColors.length === 0) {
    errors.push("No valid colors found in the array")
    return { isValid: false, errors, sanitizedData: null }
  }

  // Build sanitized data object
  const sanitizedData: PaletteType = {
    colors: validColors,
  }

  // Validate and add optional fields
  if (data.mode !== undefined) {
    if (isValidPaletteMode(data.mode)) {
      sanitizedData.mode = data.mode
    } else {
      errors.push(`Invalid mode: ${data.mode}`)
    }
  }

  if (data.text !== undefined) {
    if (isValidTextColors(data.text)) {
      sanitizedData.text = data.text
    } else {
      errors.push("Invalid text colors")
    }
  }

  if (data.background !== undefined) {
    if (isValidBackgroundColors(data.background)) {
      sanitizedData.background = data.background
    } else {
      errors.push("Invalid background colors")
    }
  }

  if (data.action !== undefined) {
    if (isValidActionColors(data.action)) {
      sanitizedData.action = data.action
    } else {
      errors.push("Invalid action colors")
    }
  }

  if (data.divider !== undefined) {
    if (typeof data.divider === "string") {
      sanitizedData.divider = data.divider
    } else {
      errors.push("Invalid divider color")
    }
  }

  if (data.grey !== undefined) {
    if (isValidGreyPalette(data.grey)) {
      sanitizedData.grey = data.grey
    } else {
      errors.push("Invalid grey palette")
    }
  }

  if (data.common !== undefined) {
    if (isValidCommonColors(data.common)) {
      sanitizedData.common = data.common
    } else {
      errors.push("Invalid common colors")
    }
  }

  if (data.tonalOffset !== undefined) {
    if (typeof data.tonalOffset === "number" && data.tonalOffset >= 0 && data.tonalOffset <= 1) {
      sanitizedData.tonalOffset = data.tonalOffset
    } else {
      errors.push("Invalid tonalOffset (must be a number between 0 and 1)")
    }
  }

  if (data.contrastThreshold !== undefined) {
    if (typeof data.contrastThreshold === "number" && data.contrastThreshold > 0) {
      sanitizedData.contrastThreshold = data.contrastThreshold
    } else {
      errors.push("Invalid contrastThreshold (must be a positive number)")
    }
  }

  // If we have valid colors, consider the data salvageable even with some errors
  const isValid = validColors.length > 0

  return {
    isValid,
    errors: errors.length > 0 ? errors : [],
    sanitizedData: isValid ? sanitizedData : null,
  }
}

/**
 * Detects if the data is in an old/incompatible format
 */
export function isLegacyDataFormat(data: any): boolean {
  if (!data || typeof data !== "object") return false

  // Check for old format patterns
  // Old format had: colors with "value" instead of "main", variations object, textColorSettings, etc.
  const hasLegacyStructure =
    (data.colors &&
      Array.isArray(data.colors) &&
      data.colors.length > 0 &&
      data.colors.some((c: any) => c && typeof c === "object" && "value" in c && !("main" in c))) ||
    "variations" in data ||
    "textColorSettings" in data ||
    "variationSettings" in data ||
    "greyScale" in data

  return hasLegacyStructure
}
