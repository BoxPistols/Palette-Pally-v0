import type { ColorData } from "@/types/palette"

// CSS変数形式でコードを生成
export function generateCSSVariables(
  colors: ColorData[],
  variations: Record<string, Record<string, string>>,
  primaryColorIndex: number,
): string {
  let css = `:root {\n`

  // 各カラーの変数を生成
  colors.forEach((color) => {
    const colorVariations = variations[color.name] || {}
    const mainColor = colorVariations.main || color.value

    // メインカラー
    css += `  --color-${color.name}: ${mainColor};\n`

    // バリエーション
    Object.entries(colorVariations).forEach(([variant, value]) => {
      if (variant !== "main") {
        css += `  --color-${color.name}-${variant}: ${value};\n`
      }
    })
  })

  css += `}\n`

  // ダークモード用の変数
  css += `\n@media (prefers-color-scheme: dark) {\n  :root {\n`
  colors.forEach((color) => {
    const colorVariations = variations[color.name] || {}
    const darkColor = colorVariations.dark || colorVariations.main || color.value

    // ダークモード用のメインカラー
    css += `    --color-${color.name}: ${darkColor};\n`
  })
  css += `  }\n}\n`

  return css
}

// SCSS変数形式でコードを生成
export function generateSCSSVariables(
  colors: ColorData[],
  variations: Record<string, Record<string, string>>,
  primaryColorIndex: number,
): string {
  let scss = `// Color Variables\n`

  // 各カラーの変数を生成
  colors.forEach((color) => {
    const colorVariations = variations[color.name] || {}
    const mainColor = colorVariations.main || color.value

    // メインカラー
    scss += `$${color.name}: ${mainColor};\n`

    // バリエーション
    Object.entries(colorVariations).forEach(([variant, value]) => {
      if (variant !== "main") {
        scss += `$${color.name}-${variant}: ${value};\n`
      }
    })
  })

  // カラーマップ
  scss += `\n// Color Map\n$colors: (\n`
  colors.forEach((color, index) => {
    const colorVariations = variations[color.name] || {}
    scss += `  "${color.name}": (\n`
    scss += `    "base": ${colorVariations.main || color.value},\n`

    // バリエーション
    Object.entries(colorVariations).forEach(([variant, value]) => {
      if (variant !== "main") {
        scss += `    "${variant}": ${value},\n`
      }
    })

    scss += `  )${index < colors.length - 1 ? "," : ""}\n`
  })
  scss += `);\n`

  // 使用例
  scss += `\n// Usage Example\n`
  scss += `@function color($color-name, $variant: "base") {\n`
  scss += `  @return map-get(map-get($colors, $color-name), $variant);\n`
  scss += `}\n`

  return scss
}

// Tailwind設定形式でコードを生成
export function generateTailwindConfig(
  colors: ColorData[],
  variations: Record<string, Record<string, string>>,
  primaryColorIndex: number,
): string {
  let config = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n`

  // 各カラーの設定を生成
  colors.forEach((color, index) => {
    const colorVariations = variations[color.name] || {}
    config += `        ${color.name}: {\n`

    // デフォルト値（500に相当）
    config += `          DEFAULT: "${colorVariations.main || color.value}",\n`

    // バリエーション
    if (colorVariations.lighter) {
      config += `          100: "${colorVariations.lighter}",\n`
    }
    if (colorVariations.light) {
      config += `          300: "${colorVariations.light}",\n`
    }
    if (colorVariations.main) {
      config += `          500: "${colorVariations.main}",\n`
    }
    if (colorVariations.dark) {
      config += `          700: "${colorVariations.dark}",\n`
    }
    if (colorVariations.contrastText) {
      config += `          contrastText: "${colorVariations.contrastText}",\n`
    }

    config += `        }${index < colors.length - 1 ? "," : ""}\n`
  })

  config += `      },\n    },\n  },\n};\n`

  return config
}

// Material UI Theme形式でコードを生成
export function generateMaterialTheme(
  colors: ColorData[],
  variations: Record<string, Record<string, string>>,
  primaryColorIndex: number,
): string {
  // プライマリカラーとセカンダリカラーを特定
  const primaryColor = colors[primaryColorIndex]
  const secondaryColorIndex = colors.findIndex((color) => color.role === "secondary")
  const secondaryColor =
    secondaryColorIndex !== -1 ? colors[secondaryColorIndex] : colors[primaryColorIndex === 0 ? 1 : 0]

  // エラーカラーを特定
  const errorColorIndex = colors.findIndex((color) => color.role === "danger" || color.role === "error")
  const errorColor = errorColorIndex !== -1 ? colors[errorColorIndex] : null

  // 警告カラーを特定
  const warningColorIndex = colors.findIndex((color) => color.role === "warning")
  const warningColor = warningColorIndex !== -1 ? colors[warningColorIndex] : null

  // 情報カラーを特定
  const infoColorIndex = colors.findIndex((color) => color.role === "info")
  const infoColor = infoColorIndex !== -1 ? colors[infoColorIndex] : null

  // 成功カラーを特定
  const successColorIndex = colors.findIndex((color) => color.role === "success")
  const successColor = successColorIndex !== -1 ? colors[successColorIndex] : null

  const primaryVariations = variations[primaryColor.name] || {}
  const secondaryVariations = variations[secondaryColor.name] || {}

  let theme = `// Material UI Theme\nimport { createTheme } from '@mui/material/styles';\n\nconst theme = createTheme({\n  palette: {\n`

  // プライマリカラー
  theme += `    primary: {\n`
  theme += `      main: "${primaryVariations.main || primaryColor.value}",\n`
  if (primaryVariations.light) {
    theme += `      light: "${primaryVariations.light}",\n`
  }
  if (primaryVariations.dark) {
    theme += `      dark: "${primaryVariations.dark}",\n`
  }
  if (primaryVariations.contrastText) {
    theme += `      contrastText: "${primaryVariations.contrastText}",\n`
  }
  theme += `    },\n`

  // セカンダリカラー
  theme += `    secondary: {\n`
  theme += `      main: "${secondaryVariations.main || secondaryColor.value}",\n`
  if (secondaryVariations.light) {
    theme += `      light: "${secondaryVariations.light}",\n`
  }
  if (secondaryVariations.dark) {
    theme += `      dark: "${secondaryVariations.dark}",\n`
  }
  if (secondaryVariations.contrastText) {
    theme += `      contrastText: "${secondaryVariations.contrastText}",\n`
  }
  theme += `    },\n`

  // エラーカラー
  if (errorColor) {
    const errorVariations = variations[errorColor.name] || {}
    theme += `    error: {\n`
    theme += `      main: "${errorVariations.main || errorColor.value}",\n`
    if (errorVariations.light) {
      theme += `      light: "${errorVariations.light}",\n`
    }
    if (errorVariations.dark) {
      theme += `      dark: "${errorVariations.dark}",\n`
    }
    theme += `    },\n`
  }

  // 警告カラー
  if (warningColor) {
    const warningVariations = variations[warningColor.name] || {}
    theme += `    warning: {\n`
    theme += `      main: "${warningVariations.main || warningColor.value}",\n`
    if (warningVariations.light) {
      theme += `      light: "${warningVariations.light}",\n`
    }
    if (warningVariations.dark) {
      theme += `      dark: "${warningVariations.dark}",\n`
    }
    theme += `    },\n`
  }

  // 情報カラー
  if (infoColor) {
    const infoVariations = variations[infoColor.name] || {}
    theme += `    info: {\n`
    theme += `      main: "${infoVariations.main || infoColor.value}",\n`
    if (infoVariations.light) {
      theme += `      light: "${infoVariations.light}",\n`
    }
    if (infoVariations.dark) {
      theme += `      dark: "${infoVariations.dark}",\n`
    }
    theme += `    },\n`
  }

  // 成功カラー
  if (successColor) {
    const successVariations = variations[successColor.name] || {}
    theme += `    success: {\n`
    theme += `      main: "${successVariations.main || successColor.value}",\n`
    if (successVariations.light) {
      theme += `      light: "${successVariations.light}",\n`
    }
    if (successVariations.dark) {
      theme += `      dark: "${successVariations.dark}",\n`
    }
    theme += `    },\n`
  }

  theme += `  },\n});\n\nexport default theme;\n`

  return theme
}

// CSS-in-JS (styled-components) 形式でコードを生成
export function generateStyledComponents(
  colors: ColorData[],
  variations: Record<string, Record<string, string>>,
  primaryColorIndex: number,
): string {
  let styled = `// styled-components theme\nimport { createGlobalStyle } from 'styled-components';\n\nexport const theme = {\n  colors: {\n`

  // 各カラーの設定を生成
  colors.forEach((color, index) => {
    const colorVariations = variations[color.name] || {}
    styled += `    ${color.name}: {\n`
    styled += `      main: "${colorVariations.main || color.value}",\n`

    // バリエーション
    Object.entries(colorVariations).forEach(([variant, value]) => {
      if (variant !== "main") {
        styled += `      ${variant}: "${value}",\n`
      }
    })

    styled += `    }${index < colors.length - 1 ? "," : ""}\n`
  })

  styled += `  },\n};\n\n`

  // グローバルスタイル
  styled += `export const GlobalStyle = createGlobalStyle\`\n  :root {\n`
  colors.forEach((color) => {
    const colorVariations = variations[color.name] || {}
    const mainColor = colorVariations.main || color.value

    // メインカラー
    styled += `    --color-${color.name}: ${mainColor};\n`

    // バリエーション
    Object.entries(colorVariations).forEach(([variant, value]) => {
      if (variant !== "main") {
        styled += `    --color-${color.name}-${variant}: ${value};\n`
      }
    })
  })
  styled += `  }\n\`;\n\n`

  // 使用例
  styled += `// Usage Example\n`
  styled += `// import { ThemeProvider } from 'styled-components';\n`
  styled += `// import { theme, GlobalStyle } from './theme';\n\n`
  styled += `// function App() {\n`
  styled += `//   return (\n`
  styled += `//     <ThemeProvider theme={theme}>\n`
  styled += `//       <GlobalStyle />\n`
  styled += `//       <YourComponent />\n`
  styled += `//     </ThemeProvider>\n`
  styled += `//   );\n`
  styled += `// }\n`

  return styled
}

// Chakra UI Theme形式でコードを生成
export function generateChakraTheme(
  colors: ColorData[],
  variations: Record<string, Record<string, string>>,
  primaryColorIndex: number,
): string {
  let chakra = `// Chakra UI Theme\nimport { extendTheme } from '@chakra-ui/react';\n\nconst theme = extendTheme({\n  colors: {\n`

  // 各カラーの設定を生成
  colors.forEach((color, index) => {
    const colorVariations = variations[color.name] || {}
    chakra += `    ${color.name}: {\n`

    // バリエーション
    if (colorVariations.lighter) {
      chakra += `      100: "${colorVariations.lighter}",\n`
    }
    if (colorVariations.light) {
      chakra += `      300: "${colorVariations.light}",\n`
    }
    chakra += `      500: "${colorVariations.main || color.value}",\n`
    if (colorVariations.dark) {
      chakra += `      700: "${colorVariations.dark}",\n`
    }

    chakra += `    }${index < colors.length - 1 ? "," : ""}\n`
  })

  chakra += `  },\n  config: {\n    initialColorMode: 'light',\n    useSystemColorMode: true,\n  },\n});\n\nexport default theme;\n`

  return chakra
}

// CSS Module形式でコードを生成
export function generateCSSModule(
  colors: ColorData[],
  variations: Record<string, Record<string, string>>,
  primaryColorIndex: number,
): string {
  let css = `/* colors.module.css */\n\n:root {\n`

  // 各カラーの変数を生成
  colors.forEach((color) => {
    const colorVariations = variations[color.name] || {}
    const mainColor = colorVariations.main || color.value

    // メインカラー
    css += `  --color-${color.name}: ${mainColor};\n`

    // バリエーション
    Object.entries(colorVariations).forEach(([variant, value]) => {
      if (variant !== "main") {
        css += `  --color-${color.name}-${variant}: ${value};\n`
      }
    })
  })

  css += `}\n\n`

  // 各カラーのクラスを生成
  colors.forEach((color) => {
    const colorVariations = variations[color.name] || {}

    // 背景色
    css += `.bg-${color.name} {\n  background-color: var(--color-${color.name});\n}\n\n`

    // テキスト色
    css += `.text-${color.name} {\n  color: var(--color-${color.name});\n}\n\n`

    // バリエーション
    Object.entries(colorVariations).forEach(([variant, value]) => {
      if (variant !== "main") {
        // 背景色
        css += `.bg-${color.name}-${variant} {\n  background-color: var(--color-${color.name}-${variant});\n}\n\n`

        // テキスト色
        css += `.text-${color.name}-${variant} {\n  color: var(--color-${color.name}-${variant});\n}\n\n`
      }
    })
  })

  // ダークモード
  css += `@media (prefers-color-scheme: dark) {\n  :root {\n`
  colors.forEach((color) => {
    const colorVariations = variations[color.name] || {}
    const darkColor = colorVariations.dark || colorVariations.main || color.value

    // ダークモード用のメインカラー
    css += `    --color-${color.name}: ${darkColor};\n`
  })
  css += `  }\n}\n`

  return css
}
