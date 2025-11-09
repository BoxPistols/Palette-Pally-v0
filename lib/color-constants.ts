/**
 * Color calculation constants
 * Centralized constants to avoid magic numbers and improve maintainability
 */

// RGB color space constants
export const RGB_MAX_VALUE = 255
export const RGB_MIN_VALUE = 0

// HSL color space constants
export const HUE_MAX_DEGREES = 360
export const SATURATION_MAX_PERCENT = 100
export const LIGHTNESS_MAX_PERCENT = 100

// Color brightness thresholds
export const BRIGHTNESS_THRESHOLD = 128 // Threshold to determine if color is light (0-255 scale)
export const BRIGHTNESS_MAX = 255
export const BRIGHTNESS_MIN = 0

// Perceived brightness weights (based on human vision sensitivity)
// Formula: (R * 299 + G * 587 + B * 114) / 1000
export const BRIGHTNESS_WEIGHT_RED = 299
export const BRIGHTNESS_WEIGHT_GREEN = 587
export const BRIGHTNESS_WEIGHT_BLUE = 114
export const BRIGHTNESS_WEIGHT_DIVISOR = 1000

// MUI color variation defaults
export const MUI_DEFAULT_TONAL_OFFSET = 0.2
export const MUI_LIGHTEN_COEFFICIENT = 0.15
export const MUI_DARKEN_COEFFICIENT = 0.15
export const MUI_EMPHASIZE_COEFFICIENT = 0.15
export const MUI_LIGHTER_MULTIPLIER = 1.5 // For "lighter" variant (tonalOffset * 1.5)
export const MUI_DEFAULT_CONTRAST_THRESHOLD = 3 // Minimum contrast ratio for determining light/dark text

// Legacy RGB adjustment values (for backward compatibility)
export const LEGACY_LIGHT_ADJUSTMENT = 60
export const LEGACY_LIGHTER_ADJUSTMENT = 90
export const LEGACY_DARK_ADJUSTMENT = -40

// sRGB to linear RGB conversion constants
export const SRGB_GAMMA_THRESHOLD = 0.04045
export const SRGB_GAMMA_DIVISOR = 12.92
export const SRGB_GAMMA_OFFSET = 0.055
export const SRGB_GAMMA_MULTIPLIER = 1.055
export const SRGB_GAMMA_EXPONENT = 2.4

// Linear RGB to sRGB conversion constants
export const LINEAR_RGB_THRESHOLD = 0.0031308

// WCAG 2.0 contrast ratio constants
export const WCAG_LUMINANCE_OFFSET = 0.05
export const WCAG_AAA_NORMAL_TEXT = 7.0
export const WCAG_AA_NORMAL_TEXT = 4.5
export const WCAG_AAA_LARGE_TEXT = 4.5
export const WCAG_AA_LARGE_TEXT = 3.0
export const WCAG_CONTRAST_MAX_RATIO = 21 // Black on white

// Relative luminance coefficients (WCAG 2.0)
export const LUMINANCE_RED_COEFFICIENT = 0.2126
export const LUMINANCE_GREEN_COEFFICIENT = 0.7152
export const LUMINANCE_BLUE_COEFFICIENT = 0.0722

// Oklab color space conversion matrices
// sRGB to LMS (cone response)
export const OKLAB_SRGB_TO_LMS_L = {
  r: 0.4122214708,
  g: 0.5363325363,
  b: 0.0514459929,
}

export const OKLAB_SRGB_TO_LMS_M = {
  r: 0.2119034982,
  g: 0.6806995451,
  b: 0.1073969566,
}

export const OKLAB_SRGB_TO_LMS_S = {
  r: 0.0883024619,
  g: 0.2817188376,
  b: 0.6299787005,
}

// LMS to Oklab
export const OKLAB_LMS_TO_LAB_L = {
  l: 0.2104542553,
  m: 0.793617785,
  s: -0.0040720468,
}

export const OKLAB_LMS_TO_LAB_A = {
  l: 1.9779984951,
  m: -2.428592205,
  s: 0.4505937099,
}

export const OKLAB_LMS_TO_LAB_B = {
  l: 0.0259040371,
  m: 0.7827717662,
  s: -0.808675766,
}

// Oklab to LMS (inverse)
export const OKLAB_LAB_TO_LMS_L = {
  l: 0.3963377774,
  a: 0.2158037573,
}

export const OKLAB_LAB_TO_LMS_M = {
  l: -0.1055613458,
  a: -0.0638541728,
}

export const OKLAB_LAB_TO_LMS_S = {
  l: -0.0894841775,
  a: -1.291485548,
}

// LMS to sRGB (inverse)
export const OKLAB_LMS_TO_SRGB_R = {
  l: 4.0767416621,
  m: -3.3077115913,
  s: 0.2309699292,
}

export const OKLAB_LMS_TO_SRGB_G = {
  l: -1.2684380046,
  m: 2.6097574011,
  s: -0.3413193965,
}

export const OKLAB_LMS_TO_SRGB_B = {
  l: -0.0041960863,
  m: -0.7034186147,
  s: 1.707614701,
}

// Common contrast colors
export const CONTRAST_COLOR_WHITE = "#FFFFFF"
export const CONTRAST_COLOR_BLACK = "#000000"

// Default contrast text colors
export const DEFAULT_CONTRAST_TEXT_LIGHT = "#fff"
export const DEFAULT_CONTRAST_TEXT_DARK = "#000"
