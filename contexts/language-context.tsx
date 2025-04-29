"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// 言語タイプの定義
export type Language = "jp" | "en"

// コンテキストの型定義
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// 翻訳データ
const translations: Record<string, Record<Language, string>> = {
  // ヘッダー
  "app.title": {
    jp: "Palette Pally - カラーパレット作成ツール",
    en: "Palette Pally - Color Palette Tool",
  },
  "app.description": {
    jp: "カラーパレットの作成・管理・アクセシビリティチェックを簡単に行えるツール",
    en: "A tool for creating, managing, and checking accessibility of color palettes",
  },
  "header.colorCount": {
    jp: "カラー数:",
    en: "Color Count:",
  },
  "header.reset": {
    jp: "リセット",
    en: "Reset",
  },
  "header.save": {
    jp: "保存",
    en: "Save",
  },
  "header.help": {
    jp: "ヘルプ",
    en: "Help",
  },

  // セクションタイトル
  "section.colorPicker": {
    jp: "カラーピッカー",
    en: "Color Picker",
  },
  "section.colorPalette": {
    jp: "カラーパレット",
    en: "Color Palette",
  },

  // ボタンとアクション
  "button.exportJson": {
    jp: "JSONエクスポート",
    en: "Export JSON",
  },
  "button.importJson": {
    jp: "JSONインポート",
    en: "Import JSON",
  },
  "button.codeExport": {
    jp: "コード出力",
    en: "Code Export",
  },
  "button.colorBlind": {
    jp: "色覚シミュレーション",
    en: "Color Blindness Simulation",
  },
  "button.textPreview": {
    jp: "テキストプレビュー",
    en: "Text Preview",
  },
  "button.colorMode": {
    jp: "カラーモード",
    en: "Color Mode",
  },
  "button.colorRoles": {
    jp: "カラーロール",
    en: "Color Roles",
  },
  "button.materialDesign": {
    jp: "Material Design",
    en: "Material Design",
  },
  "button.tailwindCss": {
    jp: "Tailwind CSS",
    en: "Tailwind CSS",
  },
  "button.paletteOptimizer": {
    jp: "パレット最適化",
    en: "Palette Optimizer",
  },
  "button.textColorSettings": {
    jp: "テキストカラー設定",
    en: "Text Color Settings",
  },
  "button.figmaTokens": {
    jp: "Figmaトークン",
    en: "Figma Tokens",
  },

  // 通知メッセージ
  "toast.saved": {
    jp: "保存完了",
    en: "Saved",
  },
  "toast.savedDescription": {
    jp: "パレットデータをLocalStorageに保存しました",
    en: "Palette data saved to LocalStorage",
  },
  "toast.error": {
    jp: "エラー",
    en: "Error",
  },
  "toast.importComplete": {
    jp: "インポート完了",
    en: "Import Complete",
  },
  "toast.importError": {
    jp: "インポートエラー",
    en: "Import Error",
  },
  "toast.primaryColorSet": {
    jp: "プライマリカラー設定",
    en: "Primary Color Set",
  },
  "toast.primaryColorSetDescription": {
    jp: "がプライマリカラーに設定されました",
    en: "has been set as the primary color",
  },
  "toast.resetComplete": {
    jp: "リセット完了",
    en: "Reset Complete",
  },
  "toast.resetCompleteDescription": {
    jp: "パレットデータがリセットされました",
    en: "Palette data has been reset",
  },
  "toast.reorderComplete": {
    jp: "並べ替え完了",
    en: "Reordering Complete",
  },
  "toast.reorderCompleteDescription": {
    jp: "カラーの順序が更新されました",
    en: "Color order has been updated",
  },

  // テキストカラー設定
  "textColor.title": {
    jp: "テキストカラー設定",
    en: "Text Color Settings",
  },
  "textColor.description": {
    jp: "各カラーバリエーションのテキストカラーを個別に設定できます。",
    en: "Set text colors for each color variation individually.",
  },
  "textColor.main": {
    jp: "Main",
    en: "Main",
  },
  "textColor.dark": {
    jp: "Dark",
    en: "Dark",
  },
  "textColor.light": {
    jp: "Light",
    en: "Light",
  },
  "textColor.lighter": {
    jp: "Lighter",
    en: "Lighter",
  },
  "textColor.default": {
    jp: "Default (自動)",
    en: "Default (Auto)",
  },
  "textColor.white": {
    jp: "White (白)",
    en: "White",
  },
  "textColor.black": {
    jp: "Black (黒)",
    en: "Black",
  },
  "textColor.reset": {
    jp: "デフォルトに戻す",
    en: "Reset to Default",
  },
  "textColor.close": {
    jp: "閉じる",
    en: "Close",
  },

  // カラーモード設定
  "colorMode.title": {
    jp: "カラーモード設定",
    en: "Color Mode Settings",
  },
  "colorMode.description": {
    jp: "カラーシステムと表示形式を選択できます",
    en: "Select color system and display format",
  },
  "colorMode.standard": {
    jp: "標準",
    en: "Standard",
  },
  "colorMode.standardDesc": {
    jp: "標準のカラーシステム",
    en: "Standard color system",
  },
  "colorMode.material": {
    jp: "Material Design",
    en: "Material Design",
  },
  "colorMode.materialDesc": {
    jp: "Material Designのカラーシステム",
    en: "Material Design color system",
  },
  "colorMode.tailwind": {
    jp: "Tailwind CSS",
    en: "Tailwind CSS",
  },
  "colorMode.tailwindDesc": {
    jp: "Tailwind CSSのカラーシステム",
    en: "Tailwind CSS color system",
  },
  "colorMode.materialNote": {
    jp: "Material Designモードでは、Material UIのカラーシステムに基づいたカラーパレットが生成されます。プライマリカラーとセカンダリカラーを設定することで、一貫性のあるデザインが可能です。",
    en: "In Material Design mode, color palettes are generated based on Material UI's color system. Setting primary and secondary colors allows for consistent design.",
  },
  "colorMode.tailwindNote": {
    jp: "Tailwind CSSモードでは、Tailwindのカラーパレットに基づいた色選択が可能です。選択した色に最も近いTailwindのカラークラスが自動的に表示されます。",
    en: "In Tailwind CSS mode, you can select colors based on Tailwind's color palette. The closest Tailwind color class to your selected color will be automatically displayed.",
  },
  "colorMode.showTailwind": {
    jp: "Tailwindクラス表示",
    en: "Show Tailwind Classes",
  },
  "colorMode.showTailwindDesc": {
    jp: "カラーコードと一緒にTailwindのクラス名を表示します",
    en: "Display Tailwind class names along with color codes",
  },
  "colorMode.showMaterial": {
    jp: "Material名表示",
    en: "Show Material Names",
  },
  "colorMode.showMaterialDesc": {
    jp: "カラーコードと一緒にMaterial Designの色名を表示します",
    en: "Display Material Design color names along with color codes",
  },
  "colorMode.close": {
    jp: "閉じる",
    en: "Close",
  },

  // Palette Optimizer
  "optimizer.title": {
    jp: "パレット最適化",
    en: "Palette Optimizer",
  },
  "optimizer.description": {
    jp: "カラーパレットの一貫性とアクセシビリティを向上させるオプション",
    en: "Options to improve consistency and accessibility of your color palette",
  },
  "optimizer.fixAccessibility": {
    jp: "アクセシビリティ修正",
    en: "Fix Accessibility",
  },
  "optimizer.fixAccessibilityDesc": {
    jp: "コントラスト比の要件を満たすように色を調整します",
    en: "Adjust colors to meet contrast ratio requirements",
  },
  "optimizer.accessibilityLevel": {
    jp: "アクセシビリティレベル",
    en: "Accessibility Level",
  },
  "optimizer.customValue": {
    jp: "カスタム値:",
    en: "Custom value:",
  },
  "optimizer.harmonizeColors": {
    jp: "プライマリカラーとの調和",
    en: "Harmonize with Primary",
  },
  "optimizer.harmonizeColorsDesc": {
    jp: "プライマリカラーに合わせて明度と彩度を調整します（色相は保持）",
    en: "Adjust brightness and saturation to match primary color (preserves hue)",
  },
  "optimizer.harmonyStrength": {
    jp: "調和の強さ:",
    en: "Harmony strength:",
  },
  "optimizer.weak": {
    jp: "弱い",
    en: "Weak",
  },
  "optimizer.strong": {
    jp: "強い",
    en: "Strong",
  },
  "optimizer.harmonizeNote": {
    jp: "注意: この機能は明度と彩度のみを調整し、色相は変更しません",
    en: "Note: This feature only adjusts brightness and saturation, not hue",
  },
  "optimizer.optimizeTextColors": {
    jp: "テキストカラーの最適化",
    en: "Optimize Text Colors",
  },
  "optimizer.optimizeTextColorsDesc": {
    jp: "各バリエーションに最適なテキストカラーを設定します",
    en: "Set optimal text colors for each variation",
  },
  "optimizer.accessibilityIssues": {
    jp: "アクセシビリティの問題が検出されました",
    en: "Accessibility issues detected",
  },
  "optimizer.accessibilityIssuesDesc": {
    jp: "色のコントラスト比が不十分です（",
    en: "colors have insufficient contrast ratio (below ",
  },
  "optimizer.accessibilityIssuesDesc2": {
    jp: ":1未満）。「アクセシビリティ修正」オプションを有効にして自動的に修正できます。",
    en: ':1). Enable "Fix Accessibility" option to automatically fix these issues.',
  },
  "optimizer.cancel": {
    jp: "キャンセル",
    en: "Cancel",
  },
  "optimizer.apply": {
    jp: "最適化を適用",
    en: "Apply Optimization",
  },

  // カラーロール設定
  "colorRole.title": {
    jp: "カラーロール設定",
    en: "Color Role Settings",
  },
  "colorRole.description": {
    jp: "各カラーに役割を割り当て、順序を変更できます。これによりデザインシステムの一貫性が向上します。",
    en: "Assign roles to each color and change their order to improve design system consistency.",
  },
  "colorRole.hint": {
    jp: "ヒント: カラーをドラッグするか矢印ボタンで順序を変更できます。役割を割り当てることで一貫したデザインシステムを作成できます。プライマリカラーはブランドを表し、成功、危険、警告などの他の色は特定のアクションに使用されます。",
    en: "Tip: Drag colors or use arrow buttons to change order. Assigning roles creates a consistent design system. Primary color represents your brand, while success, danger, warning, etc. are used for specific actions.",
  },
  "colorRole.selectRole": {
    jp: "役割を選択",
    en: "Select role",
  },
  "colorRole.cancel": {
    jp: "キャンセル",
    en: "Cancel",
  },
  "colorRole.apply": {
    jp: "適用",
    en: "Apply",
  },

  // コード出力
  "codeExport.title": {
    jp: "コード出力",
    en: "Code Export",
  },
  "codeExport.description": {
    jp: "カラーパレットを様々な形式のコードとして出力できます。必要な形式を選択してください。",
    en: "Export your color palette as code in various formats. Select the format you need.",
  },
  "codeExport.css": {
    jp: "CSS",
    en: "CSS",
  },
  "codeExport.scss": {
    jp: "SCSS",
    en: "SCSS",
  },
  "codeExport.tailwind": {
    jp: "Tailwind",
    en: "Tailwind",
  },
  "codeExport.material": {
    jp: "Material UI",
    en: "Material UI",
  },
  "codeExport.mapping": {
    jp: "クラスマッピング",
    en: "Class Mapping",
  },
  "codeExport.close": {
    jp: "閉じる",
    en: "Close",
  },
  "codeExport.copy": {
    jp: "コピー",
    en: "Copy",
  },

  // 色覚シミュレーション
  "colorBlind.title": {
    jp: "色覚異常シミュレーション",
    en: "Color Blindness Simulation",
  },
  "colorBlind.description": {
    jp: "様々な色覚異常の方にとって、あなたのカラーパレットがどのように見えるかをシミュレーションします。",
    en: "Simulate how your color palette appears to people with various types of color blindness.",
  },
  "colorBlind.overview": {
    jp: "概要",
    en: "Overview",
  },
  "colorBlind.protanopia": {
    jp: "第一色覚異常（赤色弱）",
    en: "Protanopia (Red-Blind)",
  },
  "colorBlind.deuteranopia": {
    jp: "第二色覚異常（緑色弱）",
    en: "Deuteranopia (Green-Blind)",
  },
  "colorBlind.tritanopia": {
    jp: "第三色覚異常（青色弱）",
    en: "Tritanopia (Blue-Blind)",
  },
  "colorBlind.achromatopsia": {
    jp: "完全色覚異常（色盲）",
    en: "Achromatopsia (Monochromacy)",
  },
  "colorBlind.close": {
    jp: "閉じる",
    en: "Close",
  },

  // テキストプレビュー
  "textPreview.title": {
    jp: "テキストカラープレビュー",
    en: "Text Color Preview",
  },
  "textPreview.description": {
    jp: "カラーパレットの色をテキストとして使用した場合のプレビューと、アクセシビリティ評価を確認できます。",
    en: "Preview how your color palette looks as text and check accessibility ratings.",
  },
  "textPreview.standard": {
    jp: "標準テキスト",
    en: "Standard Text",
  },
  "textPreview.heading": {
    jp: "見出し",
    en: "Headings",
  },
  "textPreview.paragraph": {
    jp: "段落",
    en: "Paragraphs",
  },
  "textPreview.allSizes": {
    jp: "サイズ比較",
    en: "Size Comparison",
  },
  "textPreview.close": {
    jp: "閉じる",
    en: "Close",
  },

  // ヘルプモーダル
  "help.title": {
    jp: "Palette Pally の使い方",
    en: "How to use Palette Pally",
  },
  "help.description": {
    jp: "カラーパレットの作成・管理・アクセシビリティチェックを簡単に行えるツールです",
    en: "A tool for easily creating, managing, and checking accessibility of color palettes",
  },
  "help.basic": {
    jp: "基本機能",
    en: "Basic Features",
  },
  "help.accessibility": {
    jp: "アクセシビリティ",
    en: "Accessibility",
  },
  "help.advanced": {
    jp: "高度な機能",
    en: "Advanced Features",
  },
  "help.colorTheory": {
    jp: "色彩理論",
    en: "Color Theory",
  },
  "help.faq": {
    jp: "よくある質問",
    en: "FAQ",
  },
  "help.close": {
    jp: "閉じる",
    en: "Close",
  },
}

// デフォルト値を持つコンテキストを作成
const LanguageContext = createContext<LanguageContextType>({
  language: "jp",
  setLanguage: () => {},
  t: (key) => key,
})

// カスタムフックを作成
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// プロバイダーコンポーネント
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("jp")

  // ブラウザの言語設定を取得して初期値を設定
  useEffect(() => {
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith("en")) {
      setLanguage("en")
    }
    // ローカルストレージから言語設定を復元
    const savedLang = localStorage.getItem("palette-pally-language")
    if (savedLang === "jp" || savedLang === "en") {
      setLanguage(savedLang as Language)
    }
  }, [])

  // 言語設定を保存
  useEffect(() => {
    localStorage.setItem("palette-pally-language", language)
  }, [language])

  // 翻訳関数
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language]
    }
    return key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}
