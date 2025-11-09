import { describe, it, expect } from "vitest"
import {
  hexToRgb,
  rgbToHex,
  hexToHsl,
  hslToHex,
  getColorBrightness,
  isLightColor,
  lighten,
  darken,
  emphasize,
  augmentColor,
  generateMUIColorVariations,
  calculateContrastRatio,
  getWCAGLevel,
  getBetterContrastColor,
  getContrastText,
} from "@/lib/color-utils"

describe("Color Conversion Functions", () => {
  describe("hexToRgb", () => {
    it("should convert hex to RGB correctly", () => {
      expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 })
      expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 })
      expect(hexToRgb("#1976d2")).toEqual({ r: 25, g: 118, b: 210 })
    })

    it("should handle hex without # prefix", () => {
      expect(hexToRgb("1976d2")).toEqual({ r: 25, g: 118, b: 210 })
    })

    it("should return null for invalid hex", () => {
      expect(hexToRgb("invalid")).toBeNull()
      expect(hexToRgb("#12")).toBeNull()
    })
  })

  describe("rgbToHex", () => {
    it("should convert RGB to hex correctly", () => {
      expect(rgbToHex(255, 255, 255)).toBe("#ffffff")
      expect(rgbToHex(0, 0, 0)).toBe("#000000")
      expect(rgbToHex(25, 118, 210)).toBe("#1976d2")
    })
  })

  describe("hexToHsl & hslToHex", () => {
    it("should convert hex to HSL and back", () => {
      const color = "#1976d2"
      const hsl = hexToHsl(color)
      expect(hsl).toBeTruthy()

      if (hsl) {
        const backToHex = hslToHex(hsl.h, hsl.s, hsl.l)
        // Allow small rounding differences
        expect(backToHex).toBe(color)
      }
    })

    it("should handle grayscale colors", () => {
      const white = hexToHsl("#ffffff")
      expect(white).toBeTruthy()
      if (white) {
        expect(white.l).toBeCloseTo(100, 0)
      }

      const black = hexToHsl("#000000")
      expect(black).toBeTruthy()
      if (black) {
        expect(black.l).toBeCloseTo(0, 0)
      }
    })
  })
})

describe("Color Brightness Functions", () => {
  describe("getColorBrightness", () => {
    it("should calculate brightness correctly", () => {
      expect(getColorBrightness("#ffffff")).toBeCloseTo(255, 0)
      expect(getColorBrightness("#000000")).toBeCloseTo(0, 0)
    })
  })

  describe("isLightColor", () => {
    it("should correctly identify light colors", () => {
      expect(isLightColor("#ffffff")).toBe(true)
      expect(isLightColor("#000000")).toBe(false)
      expect(isLightColor("#1976d2")).toBe(false) // MUI primary blue
      expect(isLightColor("#90caf9")).toBe(true) // Light blue
    })
  })
})

describe("MUI Color Manipulation Functions", () => {
  describe("lighten", () => {
    it("should lighten a color", () => {
      const original = "#1976d2"
      const lightened = lighten(original, 0.2)

      const originalHsl = hexToHsl(original)
      const lightenedHsl = hexToHsl(lightened)

      expect(originalHsl).toBeTruthy()
      expect(lightenedHsl).toBeTruthy()

      if (originalHsl && lightenedHsl) {
        expect(lightenedHsl.l).toBeGreaterThan(originalHsl.l)
      }
    })

    it("should not exceed 100% lightness", () => {
      const lightened = lighten("#ffffff", 0.5)
      const hsl = hexToHsl(lightened)
      expect(hsl).toBeTruthy()
      if (hsl) {
        expect(hsl.l).toBeLessThanOrEqual(100)
      }
    })
  })

  describe("darken", () => {
    it("should darken a color", () => {
      const original = "#1976d2"
      const darkened = darken(original, 0.2)

      const originalHsl = hexToHsl(original)
      const darkenedHsl = hexToHsl(darkened)

      expect(originalHsl).toBeTruthy()
      expect(darkenedHsl).toBeTruthy()

      if (originalHsl && darkenedHsl) {
        expect(darkenedHsl.l).toBeLessThan(originalHsl.l)
      }
    })

    it("should not go below 0% lightness", () => {
      const darkened = darken("#000000", 0.5)
      const hsl = hexToHsl(darkened)
      expect(hsl).toBeTruthy()
      if (hsl) {
        expect(hsl.l).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe("emphasize", () => {
    it("should darken light colors", () => {
      const original = "#ffffff"
      const emphasized = emphasize(original, 0.15)

      const originalBrightness = getColorBrightness(original)
      const emphasizedBrightness = getColorBrightness(emphasized)

      expect(emphasizedBrightness).toBeLessThan(originalBrightness)
    })

    it("should lighten dark colors", () => {
      const original = "#000000"
      const emphasized = emphasize(original, 0.15)

      const originalBrightness = getColorBrightness(original)
      const emphasizedBrightness = getColorBrightness(emphasized)

      expect(emphasizedBrightness).toBeGreaterThan(originalBrightness)
    })
  })
})

describe("MUI augmentColor", () => {
  it("should generate light, main, dark, and contrastText", () => {
    const result = augmentColor("#1976d2", 0.2)

    expect(result).toHaveProperty("main")
    expect(result).toHaveProperty("light")
    expect(result).toHaveProperty("dark")
    expect(result).toHaveProperty("contrastText")

    expect(result.main).toBe("#1976d2")
    expect(result.contrastText).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })

  it("should make light lighter than main", () => {
    const result = augmentColor("#1976d2")

    const mainHsl = hexToHsl(result.main)
    const lightHsl = hexToHsl(result.light)

    expect(mainHsl).toBeTruthy()
    expect(lightHsl).toBeTruthy()

    if (mainHsl && lightHsl) {
      expect(lightHsl.l).toBeGreaterThan(mainHsl.l)
    }
  })

  it("should make dark darker than main", () => {
    const result = augmentColor("#1976d2")

    const mainHsl = hexToHsl(result.main)
    const darkHsl = hexToHsl(result.dark)

    expect(mainHsl).toBeTruthy()
    expect(darkHsl).toBeTruthy()

    if (mainHsl && darkHsl) {
      expect(darkHsl.l).toBeLessThan(mainHsl.l)
    }
  })

  it("should respect custom contrastThreshold", () => {
    // Medium gray where different thresholds produce different results
    const mediumGray = "#888888"

    const resultLowThreshold = augmentColor(mediumGray, 0.2, 3)
    const resultHighThreshold = augmentColor(mediumGray, 0.2, 8)

    // Low threshold should prefer white, high threshold should use black
    expect(resultLowThreshold.contrastText).toBe("#FFFFFF")
    expect(resultHighThreshold.contrastText).toBe("#000000")
  })
})

describe("generateMUIColorVariations", () => {
  it("should generate all required variations", () => {
    const result = generateMUIColorVariations("#1976d2")

    expect(result).toHaveProperty("main")
    expect(result).toHaveProperty("light")
    expect(result).toHaveProperty("lighter")
    expect(result).toHaveProperty("dark")
    expect(result).toHaveProperty("contrastText")
  })

  it("should respect custom tonalOffset", () => {
    const defaultResult = generateMUIColorVariations("#1976d2", 0.2)
    const customResult = generateMUIColorVariations("#1976d2", 0.4)

    const defaultLightHsl = hexToHsl(defaultResult.light)
    const customLightHsl = hexToHsl(customResult.light)

    expect(defaultLightHsl).toBeTruthy()
    expect(customLightHsl).toBeTruthy()

    if (defaultLightHsl && customLightHsl) {
      expect(customLightHsl.l).toBeGreaterThan(defaultLightHsl.l)
    }
  })

  it("should make lighter even lighter than light", () => {
    const result = generateMUIColorVariations("#1976d2")

    const lightHsl = hexToHsl(result.light)
    const lighterHsl = hexToHsl(result.lighter)

    expect(lightHsl).toBeTruthy()
    expect(lighterHsl).toBeTruthy()

    if (lightHsl && lighterHsl) {
      expect(lighterHsl.l).toBeGreaterThan(lightHsl.l)
    }
  })

  it("should respect custom contrastThreshold", () => {
    // Medium gray where different thresholds produce different results
    const mediumGray = "#888888"

    const resultLowThreshold = generateMUIColorVariations(mediumGray, 0.2, 3)
    const resultHighThreshold = generateMUIColorVariations(mediumGray, 0.2, 8)

    // Low threshold should prefer white, high threshold should use black
    expect(resultLowThreshold.contrastText).toBe("#FFFFFF")
    expect(resultHighThreshold.contrastText).toBe("#000000")
  })
})

describe("Contrast and Accessibility Functions", () => {
  describe("calculateContrastRatio", () => {
    it("should return 21:1 for black on white", () => {
      const ratio = calculateContrastRatio("#000000", "#ffffff")
      expect(ratio).toBeCloseTo(21, 0)
    })

    it("should return 1:1 for same colors", () => {
      const ratio = calculateContrastRatio("#1976d2", "#1976d2")
      expect(ratio).toBeCloseTo(1, 1)
    })

    it("should be symmetric", () => {
      const ratio1 = calculateContrastRatio("#000000", "#ffffff")
      const ratio2 = calculateContrastRatio("#ffffff", "#000000")
      expect(ratio1).toBeCloseTo(ratio2, 5)
    })
  })

  describe("getWCAGLevel", () => {
    it("should identify AAA level for high contrast", () => {
      const ratio = 7.5
      const result = getWCAGLevel(ratio)
      expect(result.level).toBe("AAA")
      expect(result.normalText).toBe(true)
      expect(result.largeText).toBe(true)
    })

    it("should identify AA level for medium contrast", () => {
      const ratio = 5.0
      const result = getWCAGLevel(ratio)
      expect(result.level).toBe("AA")
      expect(result.normalText).toBe(true)
    })

    it("should identify Fail for low contrast", () => {
      const ratio = 2.0
      const result = getWCAGLevel(ratio)
      expect(result.level).toBe("Fail")
      expect(result.normalText).toBe(false)
    })
  })

  describe("getBetterContrastColor", () => {
    it("should return white for dark backgrounds", () => {
      const result = getBetterContrastColor("#000000")
      expect(result).toBe("#FFFFFF")
    })

    it("should return black for light backgrounds", () => {
      const result = getBetterContrastColor("#ffffff")
      expect(result).toBe("#000000")
    })

    it("should return white for MUI primary blue", () => {
      const result = getBetterContrastColor("#1976d2")
      expect(result).toBe("#FFFFFF")
    })
  })

  describe("getContrastText", () => {
    it("should use default threshold of 3", () => {
      // For black background, white contrast is 21
      const result = getContrastText("#000000")
      expect(result).toBe("#FFFFFF")
    })

    it("should respect custom threshold", () => {
      // Gray background where white has contrast ~7.5, black has ~2.8
      const gray = "#777777"

      // With threshold 3 (default), should use white (7.5 >= 3)
      expect(getContrastText(gray, 3)).toBe("#FFFFFF")

      // With threshold 8, should use black (7.5 < 8, falls back to black)
      expect(getContrastText(gray, 8)).toBe("#000000")
    })

    it("should return white for dark backgrounds", () => {
      const result = getContrastText("#000000", 3)
      expect(result).toBe("#FFFFFF")
    })

    it("should return black for light backgrounds", () => {
      const result = getContrastText("#ffffff", 3)
      expect(result).toBe("#000000")
    })

    it("should match getBetterContrastColor with default threshold", () => {
      const testColors = ["#1976d2", "#f44336", "#4caf50", "#ff9800", "#9c27b0"]
      testColors.forEach((color) => {
        expect(getContrastText(color)).toBe(getBetterContrastColor(color))
      })
    })

    it("should work with higher thresholds", () => {
      // Very light gray
      const lightGray = "#f0f0f0"
      // With low threshold, might choose white, but with higher threshold, should use black
      expect(getContrastText(lightGray, 3)).toBe("#000000")
      expect(getContrastText(lightGray, 4.5)).toBe("#000000")
    })
  })
})

describe("Edge Cases", () => {
  it("should handle invalid hex gracefully", () => {
    expect(hexToRgb("invalid")).toBeNull()
    expect(hexToHsl("invalid")).toBeNull()
  })

  it("should handle extreme lightness values", () => {
    const veryLight = lighten("#ffffff", 1.0)
    expect(veryLight).toMatch(/^#[0-9A-Fa-f]{6}$/)

    const veryDark = darken("#000000", 1.0)
    expect(veryDark).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })
})
