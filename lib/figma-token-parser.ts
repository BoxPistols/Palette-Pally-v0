import type { ColorData } from "@/types/palette"

// Figmaトークンからカラーデータを抽出する関数
export function extractColorsFromFigmaTokens(data: any): ColorData[] {
  // デフォルトのカラーデータ
  const defaultColors: ColorData[] = [
    { name: "primary", value: "#3b82f6", role: "primary" },
    { name: "secondary", value: "#8b5cf6", role: "secondary" },
    { name: "success", value: "#22c55e", role: "success" },
    { name: "danger", value: "#ef4444", role: "danger" },
    { name: "warning", value: "#f59e0b", role: "warning" },
    { name: "info", value: "#06b6d4", role: "info" },
  ]

  // 抽出したカラーデータを格納する配列
  const extractedColors: ColorData[] = []

  try {
    // データがnullまたはundefinedの場合はデフォルト値を返す
    if (!data) {
      return defaultColors
    }

    // バリアブルコレクション形式（palette.light.primary.main など）
    if (data.palette && data.palette.light) {
      const lightPalette = data.palette.light

      // 主要なカラーロールを処理（primary, secondary, success, warning, error, info）
      const colorRoles = ["primary", "secondary", "success", "warning", "error", "info"]
      colorRoles.forEach((role) => {
        if (lightPalette[role]) {
          // main, dark, light, lighter, contrastTextの構造を持つカラー
          if (lightPalette[role].main) {
            const colorValue = lightPalette[role].main.$value || lightPalette[role].main
            // 有効なHEXカラーコードかチェック
            if (typeof colorValue === "string" && /^#[0-9A-F]{6}$/i.test(colorValue)) {
              extractedColors.push({
                name: role,
                value: colorValue,
                role: role === "error" ? "danger" : role,
                variations: {
                  main: colorValue,
                  dark: lightPalette[role].dark?.$value || lightPalette[role].dark,
                  light: lightPalette[role].light?.$value || lightPalette[role].light,
                  lighter: lightPalette[role].lighter?.$value || lightPalette[role].lighter,
                  contrastText: lightPalette[role].contrastText?.$value || lightPalette[role].contrastText,
                },
              })
            }
          } else {
            // 単一のカラー値
            const colorValue = lightPalette[role].$value || lightPalette[role]
            if (typeof colorValue === "string" && /^#[0-9A-F]{6}$/i.test(colorValue)) {
              extractedColors.push({
                name: role,
                value: colorValue,
                role: role === "error" ? "danger" : role,
              })
            }
          }
        }
      })

      // テキストカラー
      if (lightPalette.text) {
        Object.entries(lightPalette.text).forEach(([key, value]: [string, any]) => {
          const colorValue = value.$value || value
          if (typeof colorValue === "string" && /^#[0-9A-F]{6}$/i.test(colorValue)) {
            extractedColors.push({
              name: `text-${key}`,
              value: colorValue,
              role: key === "primary" ? "text" : undefined,
              group: "text",
            })
          }
        })
      }

      // バックグラウンドカラー
      if (lightPalette.background) {
        Object.entries(lightPalette.background).forEach(([key, value]: [string, any]) => {
          const colorValue = value.$value || value
          if (typeof colorValue === "string" && /^#[0-9A-F]{6}$/i.test(colorValue)) {
            extractedColors.push({
              name: `background-${key}`,
              value: colorValue,
              role: key === "default" ? "background" : undefined,
              group: "background",
            })
          }
        })
      }

      // 共通カラー
      if (lightPalette.common) {
        Object.entries(lightPalette.common).forEach(([key, value]: [string, any]) => {
          const colorValue = value.$value || value
          if (typeof colorValue === "string" && /^#[0-9A-F]{6}$/i.test(colorValue)) {
            extractedColors.push({
              name: `common-${key}`,
              value: colorValue,
              group: "common",
            })
          }
        })
      }
    }

    // グレースケール
    if (data.palette && data.palette.grey) {
      Object.entries(data.palette.grey).forEach(([shade, value]: [string, any]) => {
        const colorValue = value.$value || value
        if (typeof colorValue === "string" && /^#[0-9A-F]{6}$/i.test(colorValue)) {
          extractedColors.push({
            name: `grey-${shade}`,
            value: colorValue,
            group: "grey",
          })
        }
      })
    }

    // Figma形式（figma.primary など）
    if (data.figma) {
      // カラートークンを探す
      Object.entries(data.figma).forEach(([key, value]: [string, any]) => {
        if (value && typeof value === "object") {
          if (value.$type === "color" && value.$value) {
            // 単一のカラー値
            if (typeof value.$value === "string" && /^#[0-9A-F]{6}$/i.test(value.$value)) {
              extractedColors.push({
                name: `figma-${key}`,
                value: value.$value,
                role: key === "primary" ? "primary" : undefined,
                group: "figma",
              })
            }
          } else {
            // ネストされたオブジェクト（figma.text.primary など）
            Object.entries(value).forEach(([subKey, subValue]: [string, any]) => {
              if (subValue && subValue.$type === "color" && subValue.$value) {
                if (typeof subValue.$value === "string" && /^#[0-9A-F]{6}$/i.test(subValue.$value)) {
                  extractedColors.push({
                    name: `figma-${key}-${subKey}`,
                    value: subValue.$value,
                    role: key === "text" && subKey === "primary" ? "text" : undefined,
                    group: `figma-${key}`,
                  })
                }
              }
            })
          }
        }
      })
    }

    // グローバル形式（global.colors など）
    if (data.global && data.global.colors) {
      Object.entries(data.global.colors).forEach(([category, tokens]: [string, any]) => {
        Object.entries(tokens).forEach(([tokenName, token]: [string, any]) => {
          if (token.$type === "color" && token.$value) {
            if (typeof token.$value === "string" && /^#[0-9A-F]{6}$/i.test(token.$value)) {
              extractedColors.push({
                name: `${category}-${tokenName}`,
                value: token.$value,
                role: category === "primary" && tokenName === "main" ? "primary" : undefined,
                group: category,
              })
            }
          }
        })
      })
    }

    // カラーデータが見つからなかった場合はデフォルト値を返す
    if (extractedColors.length === 0) {
      // タイポグラフィデータのみの場合は、デフォルトのカラーデータを返す
      if (hasTypographyData(data)) {
        return defaultColors
      }
      return []
    }

    return extractedColors
  } catch (error) {
    console.error("Error extracting colors from Figma tokens:", error)
    return []
  }
}

// タイポグラフィデータが存在するかチェックする関数
export function hasTypographyData(data: any): boolean {
  // figma.head-* または figma.body.* のタイポグラフィデータをチェック
  if (data.figma) {
    for (const key in data.figma) {
      if (
        (key.startsWith("head-") && data.figma[key]?.$type === "typography") ||
        (data.figma.body && Object.keys(data.figma.body).length > 0) ||
        (data.figma.header && Object.keys(data.figma.header).length > 0)
      ) {
        return true
      }
    }
  }

  // typography.* のタイポグラフィデータをチェック
  if (data.typography) {
    return Object.keys(data.typography).length > 0
  }

  return false
}

// Figmaトークンからタイポグラフィデータを抽出する関数
export function extractTypographyFromFigmaTokens(data: any): any {
  const extractedTypography: any = {}

  try {
    // データがnullまたはundefinedの場合は空のオブジェクトを返す
    if (!data) {
      return {}
    }

    // タイポグラフィトークンの抽出（typography.heading.h1 など）
    if (data.typography) {
      extractedTypography.typography = data.typography
    }

    // Figma形式のタイポグラフィ（figma.head-1 など）
    if (data.figma) {
      // ヘッダー
      if (data.figma.header) {
        extractedTypography.header = data.figma.header
      }

      // 見出し
      const headings = ["head-1", "head-2", "head-3", "head-4", "head-5"]
      headings.forEach((heading) => {
        if (data.figma[heading]) {
          if (!extractedTypography.headings) extractedTypography.headings = {}
          extractedTypography.headings[heading] = data.figma[heading]
        }
      })

      // 本文
      if (data.figma.body) {
        extractedTypography.body = data.figma.body
      }
    }

    return extractedTypography
  } catch (error) {
    console.error("Error extracting typography from Figma tokens:", error)
    return {}
  }
}

// タイポグラフィデータをフラット化する関数
export function flattenTypographyData(data: any): Record<string, any> {
  const flatData: Record<string, any> = {}

  try {
    // typography名前空間のデータを処理
    if (data.typography) {
      // 見出し
      if (data.typography.heading) {
        Object.entries(data.typography.heading).forEach(([key, value]) => {
          flatData[`heading.${key}`] = value
        })
      }

      // その他のタイポグラフィ
      Object.entries(data.typography).forEach(([key, value]) => {
        if (key !== "heading" && key !== "variant") {
          flatData[`typography.${key}`] = value
        }
      })

      // バリアント
      if (data.typography.variant) {
        Object.entries(data.typography.variant).forEach(([key, value]) => {
          flatData[`variant.${key}`] = value
        })
      }
    }

    // figma名前空間のデータを処理
    if (data.headings) {
      Object.entries(data.headings).forEach(([key, value]) => {
        flatData[`figma.${key}`] = value
      })
    }

    // figma.header名前空間のデータを処理
    if (data.header) {
      Object.entries(data.header).forEach(([key, value]) => {
        flatData[`figma.header.${key}`] = value
      })
    }

    // figma.body名前空間のデータを処理
    if (data.body) {
      Object.entries(data.body).forEach(([key, value]) => {
        flatData[`figma.body.${key}`] = value
      })
    }

    return flatData
  } catch (error) {
    console.error("Error flattening typography data:", error)
    return {}
  }
}
