import {
  RGB_MAX_VALUE,
  RGB_MIN_VALUE,
  HUE_MAX_DEGREES,
  SATURATION_MAX_PERCENT,
  LIGHTNESS_MAX_PERCENT,
  BRIGHTNESS_THRESHOLD,
  BRIGHTNESS_WEIGHT_RED,
  BRIGHTNESS_WEIGHT_GREEN,
  BRIGHTNESS_WEIGHT_BLUE,
  BRIGHTNESS_WEIGHT_DIVISOR,
  MUI_LIGHTEN_COEFFICIENT,
  MUI_DARKEN_COEFFICIENT,
  MUI_DEFAULT_TONAL_OFFSET,
  MUI_LIGHTER_MULTIPLIER,
  MUI_DEFAULT_CONTRAST_THRESHOLD,
  SRGB_GAMMA_THRESHOLD,
  SRGB_GAMMA_DIVISOR,
  SRGB_GAMMA_OFFSET,
  SRGB_GAMMA_MULTIPLIER,
  SRGB_GAMMA_EXPONENT,
  LINEAR_RGB_THRESHOLD,
  WCAG_LUMINANCE_OFFSET,
  WCAG_AAA_NORMAL_TEXT,
  WCAG_AA_NORMAL_TEXT,
  WCAG_AAA_LARGE_TEXT,
  WCAG_AA_LARGE_TEXT,
  LUMINANCE_RED_COEFFICIENT,
  LUMINANCE_GREEN_COEFFICIENT,
  LUMINANCE_BLUE_COEFFICIENT,
  OKLAB_SRGB_TO_LMS_L,
  OKLAB_SRGB_TO_LMS_M,
  OKLAB_SRGB_TO_LMS_S,
  OKLAB_LMS_TO_LAB_L,
  OKLAB_LMS_TO_LAB_A,
  OKLAB_LMS_TO_LAB_B,
  OKLAB_LAB_TO_LMS_L,
  OKLAB_LAB_TO_LMS_M,
  OKLAB_LAB_TO_LMS_S,
  OKLAB_LMS_TO_SRGB_R,
  OKLAB_LMS_TO_SRGB_G,
  OKLAB_LMS_TO_SRGB_B,
  CONTRAST_COLOR_WHITE,
  CONTRAST_COLOR_BLACK,
  LEGACY_LIGHT_ADJUSTMENT,
  LEGACY_LIGHTER_ADJUSTMENT,
  LEGACY_DARK_ADJUSTMENT,
} from "./color-constants"

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
  return (
    (rgb.r * BRIGHTNESS_WEIGHT_RED + rgb.g * BRIGHTNESS_WEIGHT_GREEN + rgb.b * BRIGHTNESS_WEIGHT_BLUE) /
    BRIGHTNESS_WEIGHT_DIVISOR
  )
}

// Determine if a color is light (should use dark text) or dark (should use light text)
export function isLightColor(hex: string): boolean {
  const brightness = getColorBrightness(hex)
  return brightness > BRIGHTNESS_THRESHOLD
}

// HSL functions
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null

  const r = rgb.r / RGB_MAX_VALUE
  const g = rgb.g / RGB_MAX_VALUE
  const b = rgb.b / RGB_MAX_VALUE

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
    h: h * HUE_MAX_DEGREES,
    s: s * SATURATION_MAX_PERCENT,
    l: l * LIGHTNESS_MAX_PERCENT,
  }
}

export function hslToHex(h: number, s: number, l: number): string {
  h /= HUE_MAX_DEGREES
  s /= SATURATION_MAX_PERCENT
  l /= LIGHTNESS_MAX_PERCENT

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

  return rgbToHex(
    Math.round(r * RGB_MAX_VALUE),
    Math.round(g * RGB_MAX_VALUE),
    Math.round(b * RGB_MAX_VALUE),
  )
}

// Oklab functions
export function hexToOklab(hex: string): { l: number; a: number; b: number } | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null

  // Convert sRGB to linear RGB
  let r = rgb.r / RGB_MAX_VALUE
  let g = rgb.g / RGB_MAX_VALUE
  let b = rgb.b / RGB_MAX_VALUE

  r =
    r > SRGB_GAMMA_THRESHOLD
      ? Math.pow((r + SRGB_GAMMA_OFFSET) / SRGB_GAMMA_MULTIPLIER, SRGB_GAMMA_EXPONENT)
      : r / SRGB_GAMMA_DIVISOR
  g =
    g > SRGB_GAMMA_THRESHOLD
      ? Math.pow((g + SRGB_GAMMA_OFFSET) / SRGB_GAMMA_MULTIPLIER, SRGB_GAMMA_EXPONENT)
      : g / SRGB_GAMMA_DIVISOR
  b =
    b > SRGB_GAMMA_THRESHOLD
      ? Math.pow((b + SRGB_GAMMA_OFFSET) / SRGB_GAMMA_MULTIPLIER, SRGB_GAMMA_EXPONENT)
      : b / SRGB_GAMMA_DIVISOR

  // Convert linear RGB to Oklab (LMS cone response)
  const l = OKLAB_SRGB_TO_LMS_L.r * r + OKLAB_SRGB_TO_LMS_L.g * g + OKLAB_SRGB_TO_LMS_L.b * b
  const m = OKLAB_SRGB_TO_LMS_M.r * r + OKLAB_SRGB_TO_LMS_M.g * g + OKLAB_SRGB_TO_LMS_M.b * b
  const s = OKLAB_SRGB_TO_LMS_S.r * r + OKLAB_SRGB_TO_LMS_S.g * g + OKLAB_SRGB_TO_LMS_S.b * b

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  return {
    l: OKLAB_LMS_TO_LAB_L.l * l_ + OKLAB_LMS_TO_LAB_L.m * m_ + OKLAB_LMS_TO_LAB_L.s * s_,
    a: OKLAB_LMS_TO_LAB_A.l * l_ + OKLAB_LMS_TO_LAB_A.m * m_ + OKLAB_LMS_TO_LAB_A.s * s_,
    b: OKLAB_LMS_TO_LAB_B.l * l_ + OKLAB_LMS_TO_LAB_B.m * m_ + OKLAB_LMS_TO_LAB_B.s * s_,
  }
}

export function oklabToHex(l: number, a: number, b: number): string {
  // Convert Oklab to LMS
  const l_ = l + OKLAB_LAB_TO_LMS_L.l * a + OKLAB_LAB_TO_LMS_L.a * b
  const m_ = l + OKLAB_LAB_TO_LMS_M.l * a + OKLAB_LAB_TO_LMS_M.a * b
  const s_ = l + OKLAB_LAB_TO_LMS_S.l * a + OKLAB_LAB_TO_LMS_S.a * b

  const l_cubed = l_ * l_ * l_
  const m_cubed = m_ * m_ * m_
  const s_cubed = s_ * s_ * s_

  // Convert LMS to linear RGB
  const r = OKLAB_LMS_TO_SRGB_R.l * l_cubed + OKLAB_LMS_TO_SRGB_R.m * m_cubed + OKLAB_LMS_TO_SRGB_R.s * s_cubed
  const g = OKLAB_LMS_TO_SRGB_G.l * l_cubed + OKLAB_LMS_TO_SRGB_G.m * m_cubed + OKLAB_LMS_TO_SRGB_G.s * s_cubed
  const b_val = OKLAB_LMS_TO_SRGB_B.l * l_cubed + OKLAB_LMS_TO_SRGB_B.m * m_cubed + OKLAB_LMS_TO_SRGB_B.s * s_cubed

  // Convert linear RGB to sRGB
  const r_srgb =
    r <= LINEAR_RGB_THRESHOLD
      ? SRGB_GAMMA_DIVISOR * r
      : SRGB_GAMMA_MULTIPLIER * Math.pow(r, 1 / SRGB_GAMMA_EXPONENT) - SRGB_GAMMA_OFFSET
  const g_srgb =
    g <= LINEAR_RGB_THRESHOLD
      ? SRGB_GAMMA_DIVISOR * g
      : SRGB_GAMMA_MULTIPLIER * Math.pow(g, 1 / SRGB_GAMMA_EXPONENT) - SRGB_GAMMA_OFFSET
  const b_srgb =
    b_val <= LINEAR_RGB_THRESHOLD
      ? SRGB_GAMMA_DIVISOR * b_val
      : SRGB_GAMMA_MULTIPLIER * Math.pow(b_val, 1 / SRGB_GAMMA_EXPONENT) - SRGB_GAMMA_OFFSET

  // Clamp and convert to 8-bit values
  const r8 = Math.max(RGB_MIN_VALUE, Math.min(RGB_MAX_VALUE, Math.round(r_srgb * RGB_MAX_VALUE)))
  const g8 = Math.max(RGB_MIN_VALUE, Math.min(RGB_MAX_VALUE, Math.round(g_srgb * RGB_MAX_VALUE)))
  const b8 = Math.max(RGB_MIN_VALUE, Math.min(RGB_MAX_VALUE, Math.round(b_srgb * RGB_MAX_VALUE)))

  return rgbToHex(r8, g8, b8)
}

// Function to lighten or darken a color (legacy RGB-based method)
function adjustColor(color: string, amount: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color

  const { r, g, b } = rgb

  // Lighten: add amount to each channel (capped at RGB_MAX_VALUE)
  // Darken: subtract amount from each channel (minimum RGB_MIN_VALUE)
  const newR = Math.min(RGB_MAX_VALUE, Math.max(RGB_MIN_VALUE, amount > 0 ? r + amount : r + amount))
  const newG = Math.min(RGB_MAX_VALUE, Math.max(RGB_MIN_VALUE, amount > 0 ? g + amount : g + amount))
  const newB = Math.min(RGB_MAX_VALUE, Math.max(RGB_MIN_VALUE, amount > 0 ? b + amount : b + amount))

  return rgbToHex(Math.round(newR), Math.round(newG), Math.round(newB))
}

// MUI-compatible color adjustment using HSL color space
// This provides more perceptually accurate color variations
export function adjustColorHSL(color: string, lightnessDelta: number, saturationDelta: number = 0): string {
  const hsl = hexToHsl(color)
  if (!hsl) return color

  // Adjust lightness (0-100 scale)
  let newL = hsl.l + lightnessDelta
  newL = Math.max(0, Math.min(LIGHTNESS_MAX_PERCENT, newL))

  // Adjust saturation (0-100 scale)
  let newS = hsl.s + saturationDelta
  newS = Math.max(0, Math.min(SATURATION_MAX_PERCENT, newS))

  return hslToHex(hsl.h, newS, newL)
}

// Lighten a color by increasing lightness in HSL space
export function lighten(color: string, coefficient: number = MUI_LIGHTEN_COEFFICIENT): string {
  const hsl = hexToHsl(color)
  if (!hsl) return color

  // MUI-style lightening: increase lightness by coefficient
  const newL = hsl.l + (LIGHTNESS_MAX_PERCENT - hsl.l) * coefficient
  return hslToHex(hsl.h, hsl.s, newL)
}

// Darken a color by decreasing lightness in HSL space
export function darken(color: string, coefficient: number = MUI_DARKEN_COEFFICIENT): string {
  const hsl = hexToHsl(color)
  if (!hsl) return color

  // MUI-style darkening: decrease lightness by coefficient
  const newL = hsl.l * (1 - coefficient)
  return hslToHex(hsl.h, hsl.s, newL)
}

// Emphasize a color (used for hover states, etc.)
export function emphasize(color: string, coefficient: number = MUI_LIGHTEN_COEFFICIENT): string {
  const brightness = getColorBrightness(color)
  // For dark colors, lighten; for light colors, darken
  return brightness > BRIGHTNESS_THRESHOLD ? darken(color, coefficient) : lighten(color, coefficient)
}

// MUI augmentColor implementation
// Generates light and dark variations based on the main color
export function augmentColor(
  mainColor: string,
  tonalOffset: number = MUI_DEFAULT_TONAL_OFFSET,
  contrastThreshold: number = MUI_DEFAULT_CONTRAST_THRESHOLD,
): {
  light: string
  main: string
  dark: string
  contrastText: string
} {
  return {
    light: lighten(mainColor, tonalOffset),
    main: mainColor,
    dark: darken(mainColor, tonalOffset),
    contrastText: getContrastText(mainColor, contrastThreshold),
  }
}

// Generate MUI color variations with additional "lighter" shade
// This function provides compatibility with the existing codebase
export function generateMUIColorVariations(
  mainColor: string,
  tonalOffset: number = MUI_DEFAULT_TONAL_OFFSET,
  contrastThreshold: number = MUI_DEFAULT_CONTRAST_THRESHOLD,
): {
  main: string
  light: string
  lighter: string
  dark: string
  contrastText: string
} {
  const baseVariations = augmentColor(mainColor, tonalOffset, contrastThreshold)

  return {
    main: mainColor,
    light: baseVariations.light,
    lighter: lighten(mainColor, tonalOffset * MUI_LIGHTER_MULTIPLIER),
    dark: baseVariations.dark,
    contrastText: baseVariations.contrastText,
  }
}

// Keep the old function for backward compatibility
export function generateColorVariations(baseColor: string): Record<string, string> {
  return {
    main: baseColor,
    dark: adjustColor(baseColor, LEGACY_DARK_ADJUSTMENT),
    light: adjustColor(baseColor, LEGACY_LIGHT_ADJUSTMENT),
    lighter: adjustColor(baseColor, LEGACY_LIGHTER_ADJUSTMENT),
  }
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
  return LUMINANCE_RED_COEFFICIENT * r + LUMINANCE_GREEN_COEFFICIENT * g + LUMINANCE_BLUE_COEFFICIENT * b
}

// チャンネル値の正規化
function normalizeChannel(channel: number): number {
  const sRGB = channel / RGB_MAX_VALUE
  return sRGB <= SRGB_GAMMA_THRESHOLD
    ? sRGB / SRGB_GAMMA_DIVISOR
    : Math.pow((sRGB + SRGB_GAMMA_OFFSET) / SRGB_GAMMA_MULTIPLIER, SRGB_GAMMA_EXPONENT)
}

// コントラスト比の計算
export function calculateContrastRatio(color1: string, color2: string): number {
  // 相対輝度を計算
  const luminance1 = calculateRelativeLuminance(color1)
  const luminance2 = calculateRelativeLuminance(color2)

  // コントラスト比の計算: (L1 + 0.05) / (L2 + 0.05) ただしL1 >= L2
  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)

  return (lighter + WCAG_LUMINANCE_OFFSET) / (darker + WCAG_LUMINANCE_OFFSET)
}

// WCAGレベルの判定
export function getWCAGLevel(contrastRatio: number): {
  level: "AAA" | "AA" | "A" | "Fail"
  normalText: boolean
  largeText: boolean
} {
  // 大きいテキスト（18pt以上または14pt以上の太字）と通常テキストの判定
  const largeTextAAA = contrastRatio >= WCAG_AAA_LARGE_TEXT
  const largeTextAA = contrastRatio >= WCAG_AA_LARGE_TEXT
  const normalTextAAA = contrastRatio >= WCAG_AAA_NORMAL_TEXT
  const normalTextAA = contrastRatio >= WCAG_AA_NORMAL_TEXT

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

// MUI-compatible getContrastText function
// Returns white or black text color based on background color and contrast threshold
export function getContrastText(
  bgColor: string,
  contrastThreshold: number = MUI_DEFAULT_CONTRAST_THRESHOLD,
): string {
  const whiteContrast = calculateContrastRatio(bgColor, CONTRAST_COLOR_WHITE)

  // If white text meets the threshold, use white; otherwise use black
  return whiteContrast >= contrastThreshold ? CONTRAST_COLOR_WHITE : CONTRAST_COLOR_BLACK
}

// Legacy function for backward compatibility
// 白と黒のどちらがより良いコントラストを持つか判定
export function getBetterContrastColor(bgColor: string): string {
  return getContrastText(bgColor, MUI_DEFAULT_CONTRAST_THRESHOLD)
}
