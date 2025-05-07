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
`

  // すべてのカラーを処理
  colors.forEach((color) => {
    const colorName = color.name

    // color.nameがMaterial UIの標準カラー名（primary, secondary, error, warning, info, success）に一致するか確認
    if (["primary", "secondary", "error", "warning", "info", "success"].includes(colorName)) {
      themeOutput += `    ${colorName}: {
      main: '${color.value}',\n`

      // カラーのバリエーション
      if (variations[colorName]) {
        const colorVars = variations[colorName]
        if (colorVars.dark) themeOutput += `      dark: '${colorVars.dark}',\n`
        if (colorVars.light) themeOutput += `      light: '${colorVars.light}',\n`
        if (colorVars.lighter) themeOutput += `      contrastText: '${colorVars.contrastText || "#ffffff"}',\n`
      }

      themeOutput += `    },\n`
    }
  })

  // グレーも追加
  themeOutput += `    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
`

  // 背景色とテキスト色
  themeOutput += `    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
`

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
