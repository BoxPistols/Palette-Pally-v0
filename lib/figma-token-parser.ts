"use client"

import type { Typography } from "@/types/palette"
import type { ColorData } from "@/types/palette"

interface FigmaTokenValue {
  $value: string | Record<string, any>
  $type: string
  $description?: string
}

interface FigmaToken {
  [key: string]: FigmaTokenValue | FigmaToken
}

/**
 * Figmaトークンからカラーデータを抽出する
 */
export function extractColorsFromFigmaTokens(tokens: any): Record<string, any> {
  // デフォルトのカラーパレット
  const colorPalette: Record<string, any> = {
    primary: { main: "#3b82f6", light: "#60a5fa", dark: "#2563eb", contrastText: "#ffffff" },
    secondary: { main: "#6b7280", light: "#9ca3af", dark: "#4b5563", contrastText: "#ffffff" },
    error: { main: "#ef4444", light: "#f87171", dark: "#dc2626", contrastText: "#ffffff" },
    warning: { main: "#f59e0b", light: "#fbbf24", dark: "#d97706", contrastText: "#000000" },
    info: { main: "#3b82f6", light: "#60a5fa", dark: "#2563eb", contrastText: "#ffffff" },
    success: { main: "#10b981", light: "#34d399", dark: "#059669", contrastText: "#ffffff" },
  }

  try {
    // トークンがnullまたはundefinedの場合
    if (!tokens) {
      return colorPalette
    }

    // 新しいFigmaトークン形式（palette.light構造）をチェック
    if (tokens.palette && tokens.palette.light) {
      const lightPalette = tokens.palette.light

      // 主要なカラーカテゴリを処理
      ;["primary", "secondary", "error", "warning", "info", "success"].forEach((category) => {
        if (lightPalette[category]) {
          colorPalette[category] = {
            main: lightPalette[category].main?.$value || colorPalette[category].main,
            light: lightPalette[category].light?.$value || colorPalette[category].light,
            dark: lightPalette[category].dark?.$value || colorPalette[category].dark,
            contrastText: lightPalette[category].contrastText?.$value || colorPalette[category].contrastText,
          }
        }
      })

      // 背景色とテキスト色も抽出
      if (lightPalette.background && lightPalette.background.default) {
        colorPalette.background = lightPalette.background.default.$value || "#ffffff"
      }

      if (lightPalette.text && lightPalette.text.primary) {
        colorPalette.text = lightPalette.text.primary.$value || "#000000"
      }
    }

    // figma名前空間のトークンもサポート
    if (tokens.figma) {
      // figma.primary
      if (tokens.figma.primary && tokens.figma.primary.$type === "color") {
        colorPalette.figmaPrimary = tokens.figma.primary.$value
      }

      // figma.text
      if (tokens.figma.text && tokens.figma.text.primary && tokens.figma.text.primary.$type === "color") {
        colorPalette.figmaText = tokens.figma.text.primary.$value
      }

      // figma.bg
      if (tokens.figma.bg && tokens.figma.bg.default && tokens.figma.bg.default.$type === "color") {
        colorPalette.figmaBackground = tokens.figma.bg.default.$value
      }
    }

    return colorPalette
  } catch (error) {
    console.error("Figmaトークンからカラーデータの抽出に失敗しました:", error)
    return colorPalette
  }
}

/**
 * 抽出したカラーパレットをColorData[]形式に変換
 */
export function convertPaletteToColorData(palette: Record<string, any>): ColorData[] {
  const colorData: ColorData[] = []

  try {
    Object.entries(palette).forEach(([name, value]) => {
      // valueがオブジェクトの場合（primary, secondaryなど）
      if (typeof value === "object" && value.main) {
        colorData.push({
          name,
          value: value.main,
          role: name === "primary" ? "primary" : name === "secondary" ? "secondary" : undefined,
        })
      }
      // valueが文字列の場合（単色）
      else if (typeof value === "string") {
        colorData.push({
          name,
          value,
        })
      }
    })

    return colorData
  } catch (error) {
    console.error("カラーパレットの変換に失敗しました:", error)
    return []
  }
}

/**
 * Figmaトークンからタイポグラフィを抽出する
 */
export function extractTypographyFromFigmaTokens(tokens: any): Typography {
  const defaultTypography: Typography = {
    h1: {
      fontFamily: "Inter",
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h2: {
      fontFamily: "Inter",
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontFamily: "Inter",
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontFamily: "Inter",
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h5: {
      fontFamily: "Inter",
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontFamily: "Inter",
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    body1: {
      fontFamily: "Inter",
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0em",
    },
    body2: {
      fontFamily: "Inter",
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0em",
    },
    button: {
      fontFamily: "Inter",
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: "0.02em",
      textTransform: "uppercase",
    },
    caption: {
      fontFamily: "Inter",
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: "0.03em",
    },
    overline: {
      fontFamily: "Inter",
      fontSize: "0.625rem",
      fontWeight: 400,
      lineHeight: 2.66,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
  }

  try {
    // typography名前空間のトークンを処理
    if (tokens.typography) {
      // 見出し（h1-h6）を処理
      if (tokens.typography.heading) {
        Object.keys(tokens.typography.heading).forEach((key) => {
          if (defaultTypography[key] && tokens.typography.heading[key]?.$value) {
            const value = tokens.typography.heading[key].$value
            defaultTypography[key] = {
              fontFamily: value.fontFamily || defaultTypography[key].fontFamily,
              fontSize: value.fontSize || defaultTypography[key].fontSize,
              fontWeight: Number.parseInt(value.fontWeight) || defaultTypography[key].fontWeight,
              lineHeight: parseLineHeight(value.lineHeight) || defaultTypography[key].lineHeight,
              letterSpacing: parseLetterSpacing(value.letterSpacing) || defaultTypography[key].letterSpacing,
              textTransform: value.textTransform || defaultTypography[key].textTransform,
            }
          }
        })
      }
      // 本文スタイルを処理
      ;["body1", "body2", "caption", "overline", "subtitle1", "subtitle2"].forEach((key) => {
        if (tokens.typography[key] && tokens.typography[key].$value) {
          const value = tokens.typography[key].$value
          defaultTypography[key] = {
            fontFamily: value.fontFamily || defaultTypography[key]?.fontFamily || "Inter",
            fontSize: value.fontSize || defaultTypography[key]?.fontSize || "1rem",
            fontWeight: Number.parseInt(value.fontWeight) || defaultTypography[key]?.fontWeight || 400,
            lineHeight: parseLineHeight(value.lineHeight) || defaultTypography[key]?.lineHeight || 1.5,
            letterSpacing: parseLetterSpacing(value.letterSpacing) || defaultTypography[key]?.letterSpacing || "0em",
            textTransform: value.textTransform || defaultTypography[key]?.textTransform || "none",
          }
        }
      })
    }

    // figma名前空間のトークンも処理
    if (tokens.figma) {
      // 見出し（head-1, head-2, ...）を処理
      Object.keys(tokens.figma).forEach((key) => {
        if (key.startsWith("head-") && tokens.figma[key]?.$value) {
          const headingNum = key.replace("head-", "")
          const h = `h${headingNum}` as keyof Typography

          if (defaultTypography[h]) {
            const value = tokens.figma[key].$value
            defaultTypography[h] = {
              fontFamily: value.fontFamily || defaultTypography[h].fontFamily,
              fontSize: value.fontSize || defaultTypography[h].fontSize,
              fontWeight: Number.parseInt(value.fontWeight) || defaultTypography[h].fontWeight,
              lineHeight: parseLineHeight(value.lineHeight) || defaultTypography[h].lineHeight,
              letterSpacing: parseLetterSpacing(value.letterSpacing) || defaultTypography[h].letterSpacing,
              textTransform: value.textTransform || defaultTypography[h].textTransform,
            }
          }
        }
      })

      // figma.header.head-1などの階層構造も処理
      if (tokens.figma.header) {
        Object.keys(tokens.figma.header).forEach((key) => {
          if (key.startsWith("head-") && tokens.figma.header[key]?.$value) {
            const headingNum = key.replace("head-", "")
            const h = `h${headingNum}` as keyof Typography

            if (defaultTypography[h]) {
              const value = tokens.figma.header[key].$value
              defaultTypography[h] = {
                fontFamily: value.fontFamily || defaultTypography[h].fontFamily,
                fontSize: value.fontSize || defaultTypography[h].fontSize,
                fontWeight: Number.parseInt(value.fontWeight) || defaultTypography[h].fontWeight,
                lineHeight: parseLineHeight(value.lineHeight) || defaultTypography[h].lineHeight,
                letterSpacing: parseLetterSpacing(value.letterSpacing) || defaultTypography[h].letterSpacing,
                textTransform: value.textTransform || defaultTypography[h].textTransform,
              }
            }
          }
        })
      }

      // figma.body.small, normal, largeなどの本文スタイルを処理
      if (tokens.figma.body) {
        const bodySizeMap = {
          small: "body2",
          normal: "body1",
          large: "subtitle1",
        }

        Object.keys(tokens.figma.body).forEach((size) => {
          const targetKey = bodySizeMap[size] as keyof Typography
          if (targetKey && tokens.figma.body[size]?.$value) {
            const value = tokens.figma.body[size].$value
            defaultTypography[targetKey] = {
              fontFamily: value.fontFamily || defaultTypography[targetKey]?.fontFamily || "Inter",
              fontSize: value.fontSize || defaultTypography[targetKey]?.fontSize || "1rem",
              fontWeight: Number.parseInt(value.fontWeight) || defaultTypography[targetKey]?.fontWeight || 400,
              lineHeight: parseLineHeight(value.lineHeight) || defaultTypography[targetKey]?.lineHeight || 1.5,
              letterSpacing:
                parseLetterSpacing(value.letterSpacing) || defaultTypography[targetKey]?.letterSpacing || "0em",
              textTransform: value.textTransform || defaultTypography[targetKey]?.textTransform || "none",
            }
          }
        })
      }
    }

    return defaultTypography
  } catch (error) {
    console.error("Figmaトークンからタイポグラフィの抽出に失敗しました:", error)
    return defaultTypography
  }
}

// トークンを再帰的に処理するヘルパー関数
function traverseTokens(obj: FigmaToken, path: string, callback: (path: string, token: FigmaTokenValue) => void) {
  Object.keys(obj).forEach((key) => {
    const newPath = path ? `${path}.${key}` : key
    const value = obj[key]

    if (value && typeof value === "object" && "$type" in value && "$value" in value) {
      callback(newPath, value as FigmaTokenValue)
    } else if (value && typeof value === "object") {
      traverseTokens(value as FigmaToken, newPath, callback)
    }
  })
}

// lineHeightを数値に変換するヘルパー関数
function parseLineHeight(lineHeight: string | number | undefined): number | undefined {
  if (lineHeight === undefined) return undefined

  if (typeof lineHeight === "number") return lineHeight

  if (lineHeight === "normal") return 1.2

  // 160%のような形式を処理
  if (lineHeight.endsWith("%")) {
    return Number.parseFloat(lineHeight) / 100
  }

  // 1.5emのような形式を処理
  if (lineHeight.endsWith("em")) {
    return Number.parseFloat(lineHeight)
  }

  // 24pxのような形式を処理（フォントサイズに対する比率として扱う）
  if (lineHeight.endsWith("px")) {
    // 実際のフォントサイズがわからないので、一般的な値として1.5を返す
    return 1.5
  }

  return Number.parseFloat(lineHeight) || 1.5
}

// letterSpacingを変換するヘルパー関数
function parseLetterSpacing(letterSpacing: string | undefined): string | undefined {
  if (letterSpacing === undefined) return undefined

  // 0%のような形式を処理
  if (letterSpacing.endsWith("%")) {
    return "0em" // 簡略化のため0emとして扱う
  }

  return letterSpacing
}
