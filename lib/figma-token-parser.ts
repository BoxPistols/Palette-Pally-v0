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

      // プライマリカラー
      if (lightPalette.primary && lightPalette.primary.main) {
        extractedColors.push({
          name: "primary",
          value: lightPalette.primary.main.$value || lightPalette.primary.main,
          role: "primary",
        })
      }

      // セカンダリカラー
      if (lightPalette.secondary && lightPalette.secondary.main) {
        extractedColors.push({
          name: "secondary",
          value: lightPalette.secondary.main.$value || lightPalette.secondary.main,
          role: "secondary",
        })
      }

      // その他のカラーロール
      const colorRoles = ["success", "warning", "error", "info"]
      colorRoles.forEach((role) => {
        if (lightPalette[role] && lightPalette[role].main) {
          extractedColors.push({
            name: role,
            value: lightPalette[role].main.$value || lightPalette[role].main,
            role: role,
          })
        }
      })

      // テキストカラー
      if (lightPalette.text && lightPalette.text.primary) {
        extractedColors.push({
          name: "text-primary",
          value: lightPalette.text.primary.$value || lightPalette.text.primary,
          role: "text",
        })
      }

      // バックグラウンドカラー
      if (lightPalette.background && lightPalette.background.default) {
        extractedColors.push({
          name: "background",
          value: lightPalette.background.default.$value || lightPalette.background.default,
          role: "background",
        })
      }
    }

    // Figma形式（figma.primary など）
    if (data.figma) {
      // カラートークンを探す
      Object.entries(data.figma).forEach(([key, value]: [string, any]) => {
        if (value && value.$type === "color" && value.$value) {
          extractedColors.push({
            name: `figma-${key}`,
            value: value.$value,
            role: key === "primary" ? "primary" : undefined,
          })
        }
      })

      // ネストされたカラートークンを探す
      if (data.figma.colors) {
        Object.entries(data.figma.colors).forEach(([key, value]: [string, any]) => {
          if (value && value.$type === "color" && value.$value) {
            extractedColors.push({
              name: key,
              value: value.$value,
              role: key === "primary" ? "primary" : undefined,
            })
          }
        })
      }
    }

    // グローバル形式（global.colors など）
    if (data.global && data.global.colors) {
      Object.entries(data.global.colors).forEach(([category, tokens]: [string, any]) => {
        if (category === "common") return // common.white/blackはスキップ

        Object.entries(tokens).forEach(([tokenName, token]: [string, any]) => {
          // バリエーション（例：primary-light）はスキップ
          if (tokenName.includes("-")) return

          if (token.$type === "color" && token.$value) {
            extractedColors.push({
              name: tokenName,
              value: token.$value,
              role: tokenName === "primary" ? "primary" : undefined,
            })
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
