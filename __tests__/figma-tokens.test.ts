import { describe, it, expect } from "vitest"
import { paletteToFigmaTokens, figmaTokensToPalette, validateFigmaTokens } from "@/lib/figma-tokens"
import type { PaletteType } from "@/types/palette"

describe("Figma Design Tokens", () => {
  const samplePalette: PaletteType = {
    mode: "light",
    colors: [
      {
        id: "primary",
        name: "Primary",
        type: "theme",
        main: "#1976d2",
        light: "#42a5f5",
        lighter: "#64b5f6",
        dark: "#1565c0",
        contrastText: "#ffffff",
        isDefault: true,
      },
      {
        id: "secondary",
        name: "Secondary",
        type: "theme",
        main: "#9c27b0",
        light: "#ba68c8",
        lighter: "#ce93d8",
        dark: "#7b1fa2",
        contrastText: "#ffffff",
        isDefault: true,
      },
    ],
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
      disabled: "rgba(0, 0, 0, 0.38)",
    },
    background: {
      default: "#fff",
      paper: "#fff",
    },
    action: {
      active: "rgba(0, 0, 0, 0.54)",
      hover: "rgba(0, 0, 0, 0.04)",
      hoverOpacity: 0.04,
      selected: "rgba(0, 0, 0, 0.08)",
      selectedOpacity: 0.08,
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
      disabledOpacity: 0.38,
      focus: "rgba(0, 0, 0, 0.12)",
      focusOpacity: 0.12,
      activatedOpacity: 0.12,
    },
    divider: "rgba(0, 0, 0, 0.12)",
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
    common: {
      black: "#000",
      white: "#fff",
    },
    tonalOffset: 0.2,
  }

  describe("validateFigmaTokens", () => {
    it("should validate valid Figma tokens", () => {
      const tokens = {
        color: {
          primary: {
            main: {
              $value: "#1976d2",
              $type: "color",
            },
          },
        },
      }
      expect(validateFigmaTokens(tokens)).toBe(true)
    })

    it("should reject tokens without color property", () => {
      const tokens = {
        spacing: {
          small: { $value: "8px", $type: "dimension" },
        },
      }
      expect(validateFigmaTokens(tokens)).toBe(false)
    })

    it("should reject null or undefined", () => {
      expect(validateFigmaTokens(null)).toBe(false)
      expect(validateFigmaTokens(undefined)).toBe(false)
    })

    it("should reject non-object types", () => {
      expect(validateFigmaTokens("string")).toBe(false)
      expect(validateFigmaTokens(123)).toBe(false)
      expect(validateFigmaTokens([])).toBe(false)
    })
  })

  describe("paletteToFigmaTokens", () => {
    it("should convert palette to Figma tokens format", () => {
      const tokens = paletteToFigmaTokens(samplePalette)

      expect(tokens).toHaveProperty("color")
      expect(tokens.color).toHaveProperty("primary")
      expect(tokens.color).toHaveProperty("secondary")
    })

    it("should include all color variations", () => {
      const tokens = paletteToFigmaTokens(samplePalette)

      const primary = tokens.color.primary
      expect(primary).toHaveProperty("main")
      expect(primary).toHaveProperty("light")
      expect(primary).toHaveProperty("lighter")
      expect(primary).toHaveProperty("dark")
      expect(primary).toHaveProperty("contrastText")
    })

    it("should format colors with $value and $type", () => {
      const tokens = paletteToFigmaTokens(samplePalette)

      const primaryMain = tokens.color.primary.main as any
      expect(primaryMain).toHaveProperty("$value")
      expect(primaryMain).toHaveProperty("$type")
      expect(primaryMain.$value).toBe("#1976d2")
      expect(primaryMain.$type).toBe("color")
    })

    it("should include text colors", () => {
      const tokens = paletteToFigmaTokens(samplePalette)

      expect(tokens.color).toHaveProperty("text")
      expect(tokens.color.text).toHaveProperty("primary")
      expect(tokens.color.text).toHaveProperty("secondary")
      expect(tokens.color.text).toHaveProperty("disabled")
    })

    it("should include background colors", () => {
      const tokens = paletteToFigmaTokens(samplePalette)

      expect(tokens.color).toHaveProperty("background")
      expect(tokens.color.background).toHaveProperty("default")
      expect(tokens.color.background).toHaveProperty("paper")
    })

    it("should include action colors", () => {
      const tokens = paletteToFigmaTokens(samplePalette)

      expect(tokens.color).toHaveProperty("action")
      expect(tokens.color.action).toHaveProperty("active")
      expect(tokens.color.action).toHaveProperty("hover")
      expect(tokens.color.action).toHaveProperty("selected")
    })

    it("should include action opacities as number type", () => {
      const tokens = paletteToFigmaTokens(samplePalette)

      const hoverOpacity = tokens.color.action.hoverOpacity as any
      expect(hoverOpacity).toHaveProperty("$type")
      expect(hoverOpacity.$type).toBe("number")
      expect(hoverOpacity.$value).toBe(0.04)
    })

    it("should include divider", () => {
      const tokens = paletteToFigmaTokens(samplePalette)

      expect(tokens.color).toHaveProperty("divider")
      const divider = tokens.color.divider as any
      expect(divider.$value).toBe("rgba(0, 0, 0, 0.12)")
    })

    it("should include grey palette", () => {
      const tokens = paletteToFigmaTokens(samplePalette)

      expect(tokens.color).toHaveProperty("grey")
      expect(tokens.color.grey).toHaveProperty("50")
      expect(tokens.color.grey).toHaveProperty("500")
      expect(tokens.color.grey).toHaveProperty("900")
    })

    it("should include common colors", () => {
      const tokens = paletteToFigmaTokens(samplePalette)

      expect(tokens.color).toHaveProperty("common")
      expect(tokens.color.common).toHaveProperty("black")
      expect(tokens.color.common).toHaveProperty("white")
    })
  })

  describe("figmaTokensToPalette", () => {
    it("should convert Figma tokens back to palette", () => {
      const tokens = paletteToFigmaTokens(samplePalette)
      const palette = figmaTokensToPalette(tokens)

      expect(palette).toHaveProperty("colors")
      expect(palette.colors).toBeInstanceOf(Array)
      expect(palette.colors!.length).toBeGreaterThan(0)
    })

    it("should preserve color values", () => {
      const tokens = paletteToFigmaTokens(samplePalette)
      const palette = figmaTokensToPalette(tokens)

      const primary = palette.colors!.find((c) => c.id === "primary")
      expect(primary).toBeTruthy()
      expect(primary!.main).toBe("#1976d2")
    })

    it("should convert text colors", () => {
      const tokens = paletteToFigmaTokens(samplePalette)
      const palette = figmaTokensToPalette(tokens)

      expect(palette.text).toBeTruthy()
      expect(palette.text!.primary).toBe("rgba(0, 0, 0, 0.87)")
    })

    it("should convert background colors", () => {
      const tokens = paletteToFigmaTokens(samplePalette)
      const palette = figmaTokensToPalette(tokens)

      expect(palette.background).toBeTruthy()
      expect(palette.background!.default).toBe("#fff")
    })

    it("should convert action colors", () => {
      const tokens = paletteToFigmaTokens(samplePalette)
      const palette = figmaTokensToPalette(tokens)

      expect(palette.action).toBeTruthy()
      expect(palette.action!.active).toBe("rgba(0, 0, 0, 0.54)")
      expect(palette.action!.hoverOpacity).toBe(0.04)
    })

    it("should convert divider", () => {
      const tokens = paletteToFigmaTokens(samplePalette)
      const palette = figmaTokensToPalette(tokens)

      expect(palette.divider).toBe("rgba(0, 0, 0, 0.12)")
    })

    it("should convert grey palette", () => {
      const tokens = paletteToFigmaTokens(samplePalette)
      const palette = figmaTokensToPalette(tokens)

      expect(palette.grey).toBeTruthy()
      expect(palette.grey!["50"]).toBe("#fafafa")
      expect(palette.grey!["900"]).toBe("#212121")
    })

    it("should convert common colors", () => {
      const tokens = paletteToFigmaTokens(samplePalette)
      const palette = figmaTokensToPalette(tokens)

      expect(palette.common).toBeTruthy()
      expect(palette.common!.black).toBe("#000")
      expect(palette.common!.white).toBe("#fff")
    })

    it("should handle theme colors correctly", () => {
      const tokens = paletteToFigmaTokens(samplePalette)
      const palette = figmaTokensToPalette(tokens)

      const primary = palette.colors!.find((c) => c.id === "primary")
      expect(primary).toBeTruthy()
      expect(primary!.type).toBe("theme")
      expect(primary!.isDefault).toBe(true)
    })

    it("should throw error for invalid tokens", () => {
      const invalidTokens = { invalid: "structure" }
      expect(() => figmaTokensToPalette(invalidTokens as any)).toThrow()
    })
  })

  describe("Round-trip conversion", () => {
    it("should maintain data integrity through conversion cycle", () => {
      const tokens = paletteToFigmaTokens(samplePalette)
      const palette = figmaTokensToPalette(tokens)

      // Check primary color
      const originalPrimary = samplePalette.colors.find((c) => c.id === "primary")
      const convertedPrimary = palette.colors!.find((c) => c.id === "primary")

      expect(convertedPrimary).toBeTruthy()
      expect(convertedPrimary!.main).toBe(originalPrimary!.main)
      expect(convertedPrimary!.light).toBe(originalPrimary!.light)
      expect(convertedPrimary!.dark).toBe(originalPrimary!.dark)

      // Check text colors
      expect(palette.text!.primary).toBe(samplePalette.text!.primary)
      expect(palette.text!.secondary).toBe(samplePalette.text!.secondary)

      // Check background colors
      expect(palette.background!.default).toBe(samplePalette.background!.default)

      // Check action colors
      expect(palette.action!.active).toBe(samplePalette.action!.active)
      expect(palette.action!.hoverOpacity).toBe(samplePalette.action!.hoverOpacity)
    })
  })

  describe("Custom colors", () => {
    it("should handle custom colors", () => {
      const paletteWithCustom: PaletteType = {
        colors: [
          {
            id: "custom-123-brandRed",
            name: "Brand Red",
            type: "simple",
            main: "#e53935",
            contrastText: "#ffffff",
            isDefault: false,
          },
        ],
      }

      const tokens = paletteToFigmaTokens(paletteWithCustom)
      expect(tokens.color).toHaveProperty("brandred")

      const palette = figmaTokensToPalette(tokens)
      expect(palette.colors).toBeTruthy()
      expect(palette.colors!.length).toBeGreaterThan(0)
    })
  })
})
