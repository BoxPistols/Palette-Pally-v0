// RGB functions
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

// Calculate color brightness (0-255)
export function getColorBrightness(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0

  // Calculate perceived brightness using the formula:
  // (R * 299 + G * 587 + B * 114) / 1000
  // This formula gives more weight to green as human eyes are more sensitive to it
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
}

// Determine if a color is light (should use dark text) or dark (should use light text)
export function isLightColor(hex: string): boolean {
  const brightness = getColorBrightness(hex)
  // Threshold of 128 is commonly used (0-255 scale)
  return brightness > 128
}

// HSL functions
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null

  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  }
}

export function hslToHex(h: number, s: number, l: number): string {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255))
}

// Oklab functions
export function hexToOklab(hex: string): { l: number; a: number; b: number } | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null

  // Convert sRGB to linear RGB
  let r = rgb.r / 255
  let g = rgb.g / 255
  let b = rgb.b / 255

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

  // Convert linear RGB to Oklab
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  return {
    l: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  }
}

export function oklabToHex(l: number, a: number, b: number): string {
  // Convert Oklab to linear RGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b

  const l_cubed = l_ * l_ * l_
  const m_cubed = m_ * m_ * m_
  const s_cubed = s_ * s_ * s_

  const r = 4.0767416621 * l_cubed - 3.3077115913 * m_cubed + 0.2309699292 * s_cubed
  const g = -1.2684380046 * l_cubed + 2.6097574011 * m_cubed - 0.3413193965 * s_cubed
  const b_val = -0.0041960863 * l_cubed - 0.7034186147 * m_cubed + 1.707614701 * s_cubed

  // Convert linear RGB to sRGB
  const r_srgb = r <= 0.0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055
  const g_srgb = g <= 0.0031308 ? 12.92 * g : 1.055 * Math.pow(g, 1 / 2.4) - 0.055
  const b_srgb = b_val <= 0.0031308 ? 12.92 * b_val : 1.055 * Math.pow(b_val, 1 / 2.4) - 0.055

  // Clamp and convert to 8-bit values
  const r8 = Math.max(0, Math.min(255, Math.round(r_srgb * 255)))
  const g8 = Math.max(0, Math.min(255, Math.round(g_srgb * 255)))
  const b8 = Math.max(0, Math.min(255, Math.round(b_srgb * 255)))

  return rgbToHex(r8, g8, b8)
}

// Function to lighten or darken a color (legacy RGB-based method)
function adjustColor(color: string, amount: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color

  const { r, g, b } = rgb

  // Lighten: add amount to each channel (capped at 255)
  // Darken: subtract amount from each channel (minimum 0)
  const newR = Math.min(255, Math.max(0, amount > 0 ? r + amount : r + amount))
  const newG = Math.min(255, Math.max(0, amount > 0 ? g + amount : g + amount))
  const newB = Math.min(255, Math.max(0, amount > 0 ? b + amount : b + amount))

  return rgbToHex(Math.round(newR), Math.round(newG), Math.round(newB))
}

// MUI-compatible color adjustment using HSL color space
// This provides more perceptually accurate color variations
export function adjustColorHSL(color: string, lightnessDelta: number, saturationDelta: number = 0): string {
  const hsl = hexToHsl(color)
  if (!hsl) return color

  // Adjust lightness (0-100 scale)
  let newL = hsl.l + lightnessDelta
  newL = Math.max(0, Math.min(100, newL))

  // Adjust saturation (0-100 scale)
  let newS = hsl.s + saturationDelta
  newS = Math.max(0, Math.min(100, newS))

  return hslToHex(hsl.h, newS, newL)
}

// Lighten a color by increasing lightness in HSL space
export function lighten(color: string, coefficient: number = 0.15): string {
  const hsl = hexToHsl(color)
  if (!hsl) return color

  // MUI-style lightening: increase lightness by coefficient
  const newL = hsl.l + (100 - hsl.l) * coefficient
  return hslToHex(hsl.h, hsl.s, newL)
}

// Darken a color by decreasing lightness in HSL space
export function darken(color: string, coefficient: number = 0.15): string {
  const hsl = hexToHsl(color)
  if (!hsl) return color

  // MUI-style darkening: decrease lightness by coefficient
  const newL = hsl.l * (1 - coefficient)
  return hslToHex(hsl.h, hsl.s, newL)
}

// Emphasize a color (used for hover states, etc.)
export function emphasize(color: string, coefficient: number = 0.15): string {
  const brightness = getColorBrightness(color)
  // For dark colors, lighten; for light colors, darken
  return brightness > 128 ? darken(color, coefficient) : lighten(color, coefficient)
}

// MUI augmentColor implementation
// Generates light and dark variations based on the main color
export function augmentColor(mainColor: string, tonalOffset: number = 0.2): {
  light: string
  main: string
  dark: string
  contrastText: string
} {
  return {
    light: lighten(mainColor, tonalOffset),
    main: mainColor,
    dark: darken(mainColor, tonalOffset),
    contrastText: getBetterContrastColor(mainColor),
  }
}

// Generate MUI color variations with additional "lighter" shade
// This function provides compatibility with the existing codebase
export function generateMUIColorVariations(mainColor: string, tonalOffset: number = 0.2): {
  main: string
  light: string
  lighter: string
  dark: string
  contrastText: string
} {
  const baseVariations = augmentColor(mainColor, tonalOffset)

  return {
    main: mainColor,
    light: baseVariations.light,
    lighter: lighten(mainColor, tonalOffset * 1.5), // Extra light variation
    dark: baseVariations.dark,
    contrastText: baseVariations.contrastText,
  }
}

// Keep the old function for backward compatibility
export function generateColorVariations(baseColor: string): Record<string, string> {
  return {
    main: baseColor,
    dark: adjustColor(baseColor, -40),
    light: adjustColor(baseColor, 40),
    lighter: adjustColor(baseColor, 80),
  }
}

// コントラスト比の計算
export function calculateContrastRatio(color1: string, color2: string): number {
  // 相対輝度を計算
  const luminance1 = calculateRelativeLuminance(color1)
  const luminance2 = calculateRelativeLuminance(color2)

  // コントラスト比の計算: (L1 + 0.05) / (L2 + 0.05) ただしL1 >= L2
  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)

  return (lighter + 0.05) / (darker + 0.05)
}

// 相対輝度の計算 (WCAG 2.0)
function calculateRelativeLuminance(hexColor: string): number {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return 0

  // sRGBからリニアRGBへの変換
  const r = normalizeChannel(rgb.r)
  const g = normalizeChannel(rgb.g)
  const b = normalizeChannel(rgb.b)

  // 相対輝度の計算
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// チャンネル値の正規化
function normalizeChannel(channel: number): number {
  const sRGB = channel / 255
  return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
}

// WCAGレベルの判定
export function getWCAGLevel(contrastRatio: number): {
  level: "AAA" | "AA" | "A" | "Fail"
  normalText: boolean
  largeText: boolean
} {
  // 大きいテキスト（18pt以上または14pt以上の太字）と通常テキストの判定
  const largeTextAAA = contrastRatio >= 4.5
  const largeTextAA = contrastRatio >= 3.0
  const normalTextAAA = contrastRatio >= 7.0
  const normalTextAA = contrastRatio >= 4.5

  let level: "AAA" | "AA" | "A" | "Fail" = "Fail"

  if (normalTextAAA && largeTextAAA) {
    level = "AAA"
  } else if (normalTextAA && largeTextAAA) {
    level = "AA"
  } else if (largeTextAA) {
    level = "A"
  }

  return {
    level,
    normalText: normalTextAA,
    largeText: largeTextAA,
  }
}

// 白と黒のどちらがより良いコントラストを持つか判定
export function getBetterContrastColor(bgColor: string): string {
  const whiteContrast = calculateContrastRatio(bgColor, "#FFFFFF")
  const blackContrast = calculateContrastRatio(bgColor, "#000000")

  return whiteContrast > blackContrast ? "#FFFFFF" : "#000000"
}
