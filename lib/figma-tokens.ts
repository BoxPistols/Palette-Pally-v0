/**
 * Figma Design Tokens utilities
 * W3C Design Tokens Community Group format
 * @see https://design-tokens.github.io/community-group/format/
 * @see https://www.figma.com/community/plugin/1263743870981744253/design-tokens-manager
 */

import type { PaletteType, MUIColorData } from "@/types/palette"

// W3C Design Token format
interface DesignToken {
  $value: string | number
  $type: string
  $description?: string
}

interface DesignTokenGroup {
  [key: string]: DesignToken | DesignTokenGroup
}

export interface FigmaTokens {
  [key: string]: DesignTokenGroup
}

/**
 * Convert MUI palette to Figma Design Tokens format
 */
export function paletteToFigmaTokens(palette: PaletteType): FigmaTokens {
  const tokens: FigmaTokens = {
    color: {},
  }

  // Convert theme colors
  palette.colors.forEach((color: MUIColorData) => {
    const colorId = color.name.replace(/\s+/g, "").toLowerCase()

    tokens.color[colorId] = {
      main: {
        $value: color.main,
        $type: "color",
        $description: `${color.name} main color`,
      },
    }

    if (color.light) {
      tokens.color[colorId].light = {
        $value: color.light,
        $type: "color",
        $description: `${color.name} light variant`,
      }
    }

    if (color.lighter) {
      tokens.color[colorId].lighter = {
        $value: color.lighter,
        $type: "color",
        $description: `${color.name} lighter variant`,
      }
    }

    if (color.dark) {
      tokens.color[colorId].dark = {
        $value: color.dark,
        $type: "color",
        $description: `${color.name} dark variant`,
      }
    }

    if (color.contrastText) {
      tokens.color[colorId].contrastText = {
        $value: color.contrastText,
        $type: "color",
        $description: `${color.name} contrast text color`,
      }
    }
  })

  // Convert text colors
  if (palette.text) {
    tokens.color.text = {
      primary: {
        $value: palette.text.primary,
        $type: "color",
        $description: "Primary text color",
      },
      secondary: {
        $value: palette.text.secondary,
        $type: "color",
        $description: "Secondary text color",
      },
      disabled: {
        $value: palette.text.disabled,
        $type: "color",
        $description: "Disabled text color",
      },
    }
  }

  // Convert background colors
  if (palette.background) {
    tokens.color.background = {
      default: {
        $value: palette.background.default,
        $type: "color",
        $description: "Default background color",
      },
      paper: {
        $value: palette.background.paper,
        $type: "color",
        $description: "Paper background color",
      },
    }
  }

  // Convert action colors
  if (palette.action) {
    tokens.color.action = {
      active: {
        $value: palette.action.active,
        $type: "color",
        $description: "Active action color",
      },
      hover: {
        $value: palette.action.hover,
        $type: "color",
        $description: "Hover action color",
      },
      selected: {
        $value: palette.action.selected,
        $type: "color",
        $description: "Selected action color",
      },
      disabled: {
        $value: palette.action.disabled,
        $type: "color",
        $description: "Disabled action color",
      },
      disabledBackground: {
        $value: palette.action.disabledBackground,
        $type: "color",
        $description: "Disabled background action color",
      },
      focus: {
        $value: palette.action.focus,
        $type: "color",
        $description: "Focus action color",
      },
    }

    // Add opacity values as number tokens
    tokens.color.action.hoverOpacity = {
      $value: palette.action.hoverOpacity,
      $type: "number",
      $description: "Hover opacity",
    }
    tokens.color.action.selectedOpacity = {
      $value: palette.action.selectedOpacity,
      $type: "number",
      $description: "Selected opacity",
    }
    tokens.color.action.disabledOpacity = {
      $value: palette.action.disabledOpacity,
      $type: "number",
      $description: "Disabled opacity",
    }
    tokens.color.action.focusOpacity = {
      $value: palette.action.focusOpacity,
      $type: "number",
      $description: "Focus opacity",
    }
    tokens.color.action.activatedOpacity = {
      $value: palette.action.activatedOpacity,
      $type: "number",
      $description: "Activated opacity",
    }
  }

  // Convert divider
  if (palette.divider) {
    tokens.color.divider = {
      $value: palette.divider,
      $type: "color",
      $description: "Divider color",
    }
  }

  // Convert grey palette
  if (palette.grey) {
    tokens.color.grey = {}
    Object.entries(palette.grey).forEach(([shade, value]) => {
      tokens.color.grey[shade] = {
        $value: value,
        $type: "color",
        $description: `Grey ${shade}`,
      }
    })
  }

  // Convert common colors
  if (palette.common) {
    tokens.color.common = {
      black: {
        $value: palette.common.black,
        $type: "color",
        $description: "Common black",
      },
      white: {
        $value: palette.common.white,
        $type: "color",
        $description: "Common white",
      },
    }
  }

  return tokens
}

/**
 * Convert Figma Design Tokens to MUI palette format
 */
export function figmaTokensToPalette(tokens: FigmaTokens): Partial<PaletteType> {
  const palette: Partial<PaletteType> = {
    colors: [],
  }

  if (!tokens.color) {
    throw new Error("Invalid Figma tokens: missing 'color' property")
  }

  const colorTokens = tokens.color

  // Helper to extract color value
  const getValue = (token: any): string => {
    if (typeof token === "object" && "$value" in token) {
      return token.$value
    }
    return token
  }

  // Extract theme colors
  const themeColorIds = ["primary", "secondary", "error", "warning", "info", "success"]

  themeColorIds.forEach((id) => {
    if (colorTokens[id]) {
      const colorGroup = colorTokens[id] as DesignTokenGroup
      const colorData: MUIColorData = {
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        type: "theme",
        main: getValue(colorGroup.main),
        light: colorGroup.light ? getValue(colorGroup.light) : undefined,
        lighter: colorGroup.lighter ? getValue(colorGroup.lighter) : undefined,
        dark: colorGroup.dark ? getValue(colorGroup.dark) : undefined,
        contrastText: colorGroup.contrastText ? getValue(colorGroup.contrastText) : undefined,
        isDefault: true,
      }
      palette.colors!.push(colorData)
    }
  })

  // Extract custom colors (non-theme colors)
  Object.keys(colorTokens).forEach((key) => {
    if (
      !themeColorIds.includes(key) &&
      key !== "text" &&
      key !== "background" &&
      key !== "action" &&
      key !== "divider" &&
      key !== "grey" &&
      key !== "common"
    ) {
      const colorGroup = colorTokens[key] as DesignTokenGroup
      if (colorGroup.main) {
        const colorData: MUIColorData = {
          id: `custom-${Date.now()}-${key}`,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          type: "simple",
          main: getValue(colorGroup.main),
          light: colorGroup.light ? getValue(colorGroup.light) : undefined,
          lighter: colorGroup.lighter ? getValue(colorGroup.lighter) : undefined,
          dark: colorGroup.dark ? getValue(colorGroup.dark) : undefined,
          contrastText: colorGroup.contrastText ? getValue(colorGroup.contrastText) : undefined,
          isDefault: false,
        }
        palette.colors!.push(colorData)
      }
    }
  })

  // Extract text colors
  if (colorTokens.text) {
    const textGroup = colorTokens.text as DesignTokenGroup
    palette.text = {
      primary: getValue(textGroup.primary),
      secondary: getValue(textGroup.secondary),
      disabled: getValue(textGroup.disabled),
    }
  }

  // Extract background colors
  if (colorTokens.background) {
    const bgGroup = colorTokens.background as DesignTokenGroup
    palette.background = {
      default: getValue(bgGroup.default),
      paper: getValue(bgGroup.paper),
    }
  }

  // Extract action colors
  if (colorTokens.action) {
    const actionGroup = colorTokens.action as DesignTokenGroup
    palette.action = {
      active: getValue(actionGroup.active),
      hover: getValue(actionGroup.hover),
      hoverOpacity: actionGroup.hoverOpacity ? getValue(actionGroup.hoverOpacity) : 0.04,
      selected: getValue(actionGroup.selected),
      selectedOpacity: actionGroup.selectedOpacity ? getValue(actionGroup.selectedOpacity) : 0.08,
      disabled: getValue(actionGroup.disabled),
      disabledBackground: getValue(actionGroup.disabledBackground),
      disabledOpacity: actionGroup.disabledOpacity ? getValue(actionGroup.disabledOpacity) : 0.38,
      focus: getValue(actionGroup.focus),
      focusOpacity: actionGroup.focusOpacity ? getValue(actionGroup.focusOpacity) : 0.12,
      activatedOpacity: actionGroup.activatedOpacity ? getValue(actionGroup.activatedOpacity) : 0.12,
    }
  }

  // Extract divider
  if (colorTokens.divider) {
    palette.divider = getValue(colorTokens.divider)
  }

  // Extract grey palette
  if (colorTokens.grey) {
    const greyGroup = colorTokens.grey as DesignTokenGroup
    palette.grey = {
      50: getValue(greyGroup["50"]),
      100: getValue(greyGroup["100"]),
      200: getValue(greyGroup["200"]),
      300: getValue(greyGroup["300"]),
      400: getValue(greyGroup["400"]),
      500: getValue(greyGroup["500"]),
      600: getValue(greyGroup["600"]),
      700: getValue(greyGroup["700"]),
      800: getValue(greyGroup["800"]),
      900: getValue(greyGroup["900"]),
    }
  }

  // Extract common colors
  if (colorTokens.common) {
    const commonGroup = colorTokens.common as DesignTokenGroup
    palette.common = {
      black: getValue(commonGroup.black),
      white: getValue(commonGroup.white),
    }
  }

  return palette
}

/**
 * Validate Figma Design Tokens format
 */
export function validateFigmaTokens(tokens: any): boolean {
  if (!tokens || typeof tokens !== "object") {
    return false
  }

  if (!tokens.color || typeof tokens.color !== "object") {
    return false
  }

  return true
}
