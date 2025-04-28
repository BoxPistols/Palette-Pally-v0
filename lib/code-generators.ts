import type { ColorData } from "@/types/palette"
import { findClosestTailwindColor } from "@/lib/color-systems"

// CSS変数の生成
export function generateCSSVariables(colors: ColorData[], variations: Record<string, Record<string, string>>): string {
  let cssOutput = `:root {\n`

  // メインカラー変数
  colors.forEach((color) => {
    cssOutput += `  --color-${color.name}: ${color.value};\n`
  })

  // バリエーション変数
  Object.entries(variations).forEach(([colorName, colorVariations]) => {
    Object.entries(colorVariations).forEach(([variationName, hexValue]) => {
      cssOutput += `  --color-${colorName}-${variationName}: ${hexValue};\n`
    })
  })

  cssOutput += `}\n`
  return cssOutput
}

// SCSS変数の生成
export function generateSCSSVariables(colors: ColorData[], variations: Record<string, Record<string, string>>): string {
  let scssOutput = ``

  // メインカラー変数
  colors.forEach((color) => {
    scssOutput += `$color-${color.name}: ${color.value};\n`
  })

  scssOutput += `\n`

  // バリエーション変数
  Object.entries(variations).forEach(([colorName, colorVariations]) => {
    Object.entries(colorVariations).forEach(([variationName, hexValue]) => {
      scssOutput += `$color-${colorName}-${variationName}: ${hexValue};\n`
    })
  })

  return scssOutput
}

// Tailwind設定の生成
export function generateTailwindConfig(
  colors: ColorData[],
  variations: Record<string, Record<string, string>>,
): string {
  let tailwindOutput = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
`

  // カラーオブジェクトの生成
  colors.forEach((color) => {
    const colorName = color.name.replace(/[^a-zA-Z0-9]/g, "")
    tailwindOutput += `        ${colorName}: {\n`

    // メインカラー（500として設定）
    tailwindOutput += `          500: '${color.value}',\n`

    // バリエーションがある場合
    if (variations[color.name]) {
      const colorVars = variations[color.name]
      if (colorVars.dark) tailwindOutput += `          700: '${colorVars.dark}',\n`
      if (colorVars.light) tailwindOutput += `          300: '${colorVars.light}',\n`
      if (colorVars.lighter) tailwindOutput += `          100: '${colorVars.lighter}',\n`
    }

    tailwindOutput += `        },\n`
  })

  tailwindOutput += `      },
    },
  },
  plugins: [],
}
`
  return tailwindOutput
}

// Material UI Theme設定の生成
export function generateMaterialUITheme(
  colors: ColorData[],
  variations: Record<string, Record<string, string>>,
  primaryColorIndex: number,
): string {
  const primaryColor = colors[primaryColorIndex]
  const secondaryColorIndex = primaryColorIndex === 0 ? 1 : 0
  const secondaryColor = colors.length > secondaryColorIndex ? colors[secondaryColorIndex] : null

  let themeOutput = `// Material UI Theme
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '${primaryColor.value}',
`

  // プライマリカラーのバリエーション
  if (variations[primaryColor.name]) {
    const primaryVars = variations[primaryColor.name]
    if (primaryVars.dark) themeOutput += `      dark: '${primaryVars.dark}',\n`
    if (primaryVars.light) themeOutput += `      light: '${primaryVars.light}',\n`
  }

  themeOutput += `    },\n`

  // セカンダリカラー
  if (secondaryColor) {
    themeOutput += `    secondary: {
      main: '${secondaryColor.value}',\n`

    // セカンダリカラーのバリエーション
    if (variations[secondaryColor.name]) {
      const secondaryVars = variations[secondaryColor.name]
      if (secondaryVars.dark) themeOutput += `      dark: '${secondaryVars.dark}',\n`
      if (secondaryVars.light) themeOutput += `      light: '${secondaryVars.light}',\n`
    }

    themeOutput += `    },\n`
  }

  // エラーカラー（3番目のカラーがあれば使用）
  const errorColorIndex =
    primaryColorIndex !== 2 && secondaryColorIndex !== 2
      ? 2
      : primaryColorIndex !== 3 && secondaryColorIndex !== 3
        ? 3
        : -1
  if (errorColorIndex >= 0 && errorColorIndex < colors.length) {
    const errorColor = colors[errorColorIndex]
    themeOutput += `    error: {
      main: '${errorColor.value}',\n`

    // エラーカラーのバリエーション
    if (variations[errorColor.name]) {
      const errorVars = variations[errorColor.name]
      if (errorVars.dark) themeOutput += `      dark: '${errorVars.dark}',\n`
      if (errorVars.light) themeOutput += `      light: '${errorVars.light}',\n`
    }

    themeOutput += `    },\n`
  }

  themeOutput += `  },
});

export default theme;
`
  return themeOutput
}

// Tailwind CSS クラス名のマッピングを生成
export function generateTailwindClassMapping(
  colors: ColorData[],
  variations: Record<string, Record<string, string>>,
): string {
  let output = `// Tailwind CSS Class Mapping\n\n`
  output += `/*\n`
  output += ` * このマッピングは、カスタムカラーとTailwind CSSクラスの対応を示しています。\n`
  output += ` * 各カラーに最も近いTailwindのカラークラスを表示しています。\n`
  output += ` */\n\n`

  // メインカラーのマッピング
  output += `// メインカラー\n`
  colors.forEach((color) => {
    const closest = findClosestTailwindColor(color.value)
    output += `${color.name}: ${color.value} → bg-${closest.color}-${closest.shade}\n`
  })

  output += `\n// カラーバリエーション\n`
  // バリエーションのマッピング
  Object.entries(variations).forEach(([colorName, colorVariations]) => {
    output += `${colorName}:\n`
    Object.entries(colorVariations).forEach(([variationName, hexValue]) => {
      const closest = findClosestTailwindColor(hexValue)
      output += `  - ${variationName}: ${hexValue} → bg-${closest.color}-${closest.shade}\n`
    })
    output += `\n`
  })

  return output
}
