"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { ColorPicker } from "@/components/color-picker"
import { SimpleColorPicker } from "@/components/simple-color-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { generateColorVariations } from "@/lib/color-utils"
import { ColorDisplay } from "@/components/color-display"
import { ExportImportPanel } from "@/components/export-import-panel"
import { FigmaTokensPanel } from "@/components/figma-tokens-panel"
import { Logo } from "@/components/logo"
import { HelpModal } from "@/components/help-modal"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { TextColorSettings } from "@/components/text-color-settings"
import { ColorModeSettings } from "@/components/color-mode-settings"
import { PaletteOptimizer } from "@/components/palette-optimizer"
import { MaterialPaletteOptimizer } from "@/components/material-palette-optimizer"
import { TailwindPaletteOptimizer } from "@/components/tailwind-palette-optimizer"
import { CodeExportPanel } from "@/components/code-export-panel"
import { ColorBlindSimulator } from "@/components/color-blind-simulator"
import { ColorRoleSettings } from "@/components/color-role-settings"
import { TextColorPreview } from "@/components/text-color-preview"
import { LanguageProvider, useLanguage } from "@/contexts/language-context"
import { ThemeProvider, useTheme } from "@/contexts/theme-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { TypographyPreviewPanel } from "@/components/typography-preview-panel"
import type { PaletteType, ColorData, TextColorSettings as TextColorSettingsType } from "@/types/palette"
import type { ColorMode } from "@/lib/color-systems"

// 必要なインポートを追加
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/resizable-panels"
import { GrayscaleToggle } from "@/components/grayscale-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Paintbrush, Type } from "lucide-react"
import { TypographyPreview } from "@/components/typography-preview"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// getContrastTextのインポートを削除

const MAX_COLORS = 24
const STORAGE_KEY = "palette-pally-data"

function PaletteApp() {
  const { language, t } = useLanguage()
  const { theme } = useTheme()
  const [colorCount, setColorCount] = useState<number>(8)
  const [colorData, setColorData] = useState<ColorData[]>([
    { name: "primary", value: "#3b82f6", role: "primary" },
    { name: "secondary", value: "#8b5cf6", role: "secondary" },
    { name: "success", value: "#22c55e", role: "success" },
    { name: "danger", value: "#ef4444", role: "danger" },
    { name: "warning", value: "#f59e0b", role: "warning" },
    { name: "info", value: "#06b6d4", role: "info" },
    { name: "background", value: "#f8fafc", role: "background" },
    { name: "text", value: "#1e293b", role: "text" },
  ])
  const [colorVariations, setColorVariations] = useState<Record<string, Record<string, string>>>({})
  const [textColorSettings, setTextColorSettings] = useState<TextColorSettingsType>({
    main: "default",
    dark: "default",
    light: "default",
    lighter: "default",
  })
  const [primaryColorIndex, setPrimaryColorIndex] = useState<number>(0) // デフォルトでcolor1をPrimaryに
  const [colorMode, setColorMode] = useState<ColorMode>("standard") // デフォルトは標準モード
  const [showTailwindClasses, setShowTailwindClasses] = useState<boolean>(false)
  const [showMaterialNames, setShowMaterialNames] = useState<boolean>(false)
  const [typographyTokens, setTypographyTokens] = useState<Record<string, any>>({})
  const [isFigmaImportMode, setIsFigmaImportMode] = useState<boolean>(false)

  // 新しい状態を追加
  const [activeTab, setActiveTab] = useState<"colors" | "typography">("colors")
  const [isTypographyOnly, setIsTypographyOnly] = useState<boolean>(false)

  // 表示モード状態を追加
  const [displayMode, setDisplayMode] = useState<"full" | "picker" | "palette">("full")

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as PaletteType & {
          primaryColorIndex?: number
          colorMode?: ColorMode
          showTailwindClasses?: boolean
          showMaterialNames?: boolean
          typographyTokens?: Record<string, any>
          isFigmaImportMode?: boolean
          isTypographyOnly?: boolean
          activeTab?: "colors" | "typography"
        }
        if (parsedData.colors && Array.isArray(parsedData.colors)) {
          setColorData(parsedData.colors)
          setColorCount(parsedData.colors.length)
        }

        // Load text color settings if available
        if (parsedData.textColorSettings) {
          setTextColorSettings(parsedData.textColorSettings)
        }

        // Load primary color index if available
        if (
          typeof parsedData.primaryColorIndex === "number" &&
          parsedData.primaryColorIndex >= 0 &&
          parsedData.primaryColorIndex < parsedData.colors.length
        ) {
          setPrimaryColorIndex(parsedData.primaryColorIndex)
        }

        // Load color mode settings if available
        if (parsedData.colorMode) {
          setColorMode(parsedData.colorMode)
        }

        if (typeof parsedData.showTailwindClasses === "boolean") {
          setShowTailwindClasses(parsedData.showTailwindClasses)
        }

        if (typeof parsedData.showMaterialNames === "boolean") {
          setShowMaterialNames(parsedData.showMaterialNames)
        }

        // Load typography tokens if available
        if (parsedData.typographyTokens) {
          setTypographyTokens(parsedData.typographyTokens)

          // タイポグラフィトークンがあり、カラートークンがない場合はタイポグラフィモードをアクティブに
          if (
            Object.keys(parsedData.typographyTokens).length > 0 &&
            (!parsedData.colors || parsedData.colors.length === 0)
          ) {
            setIsTypographyOnly(true)
            setActiveTab("typography")
          }
        }

        // Load Figma import mode if available
        if (typeof parsedData.isFigmaImportMode === "boolean") {
          setIsFigmaImportMode(parsedData.isFigmaImportMode)
        }

        // 新しい状態を読み込む
        if (typeof parsedData.isTypographyOnly === "boolean") {
          setIsTypographyOnly(parsedData.isTypographyOnly)
        }

        if (parsedData.activeTab) {
          setActiveTab(parsedData.activeTab)
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
      }
    }
  }, [])

  // Generate color variations when colors change
  useEffect(() => {
    const variations: Record<string, Record<string, string>> = {}

    colorData.forEach((color) => {
      // カスタムバリエーションがある場合はそれを使用し、なければ生成する
      if (color.variations) {
        variations[color.name] = color.variations
      } else {
        // main/dark/light/lighterの展開を持つカラーのみ自動生成
        if (hasStandardVariations(color)) {
          variations[color.name] = generateColorVariations(color.value)
        } else {
          // それ以外は単一カラーとして扱う
          variations[color.name] = { main: color.value }
        }
      }
    })

    setColorVariations(variations)
  }, [colorData])

  // Save to localStorage function
  const saveToLocalStorage = () => {
    try {
      const dataToSave = {
        colors: colorData,
        variations: colorVariations,
        textColorSettings: textColorSettings, // テキストカラー設定を追加
        primaryColorIndex: primaryColorIndex,
        colorMode: colorMode,
        showTailwindClasses: showTailwindClasses,
        showMaterialNames: showMaterialNames,
        typographyTokens: typographyTokens, // タイポグラフィトークンを追加
        isFigmaImportMode: isFigmaImportMode, // Figmaインポートモードを追加
        isTypographyOnly: isTypographyOnly, // タイポグラフィのみモードを追加
        activeTab: activeTab, // アクティブタブを追加
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
      toast({
        title: t("toast.saved"),
        description: t("toast.savedDescription"),
      })
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      toast({
        title: t("toast.error"),
        description: language === "jp" ? "データの保存中にエラーが発生しました" : "Error saving data",
        variant: "destructive",
      })
    }
  }

  const handleColorChange = (index: number, value: string) => {
    const newColorData = [...colorData]
    newColorData[index] = { ...newColorData[index], value }
    setColorData(newColorData)
  }

  const handleNameChange = (index: number, name: string) => {
    const newColorData = [...colorData]
    newColorData[index] = { ...newColorData[index], name }
    setColorData(newColorData)
  }

  const handleSetAsPrimary = (index: number) => {
    // 以前のプライマリカラーのロールを更新
    const newColorData = [...colorData]
    if (primaryColorIndex !== index) {
      // 以前のプライマリカラーがあれば、そのロールを更新
      if (newColorData[primaryColorIndex] && newColorData[primaryColorIndex].role === "primary") {
        newColorData[primaryColorIndex] = {
          ...newColorData[primaryColorIndex],
          role: undefined,
        }
      }

      // 新しいプライマリカラーのロールを設定
      newColorData[index] = {
        ...newColorData[index],
        role: "primary",
      }

      setColorData(newColorData)
    }

    setPrimaryColorIndex(index)
    toast({
      title: t("toast.primaryColorSet"),
      description: `${colorData[index].name}${t("toast.primaryColorSetDescription")}`,
    })

    // 変更後に自動保存
    setTimeout(() => {
      saveToLocalStorage()
    }, 100)
  }

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = Number.parseInt(e.target.value)
    if (count > 0 && count <= MAX_COLORS) {
      setColorCount(count)

      // Adjust colors array length
      if (count > colorData.length) {
        // Add more colors
        const newColorData = [...colorData]
        for (let i = colorData.length; i < count; i++) {
          // Generate random color
          const randomColor = `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`
          newColorData.push({ name: `color${i + 1}`, value: randomColor })
        }
        setColorData(newColorData)
      } else if (count < colorData.length) {
        // Remove excess colors
        setColorData(colorData.slice(0, count))

        // Adjust primaryColorIndex if needed
        if (primaryColorIndex >= count) {
          setPrimaryColorIndex(0)
        }
      }
    }
  }

  // リセット関数を修正
  const resetColors = () => {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY)

    const defaultColors = [
      { name: "primary", value: "#3b82f6", role: "primary" },
      { name: "secondary", value: "#8b5cf6", role: "secondary" },
      { name: "success", value: "#22c55e", role: "success" },
      { name: "danger", value: "#ef4444", role: "danger" },
      { name: "warning", value: "#f59e0b", role: "warning" },
      { name: "info", value: "#06b6d4", role: "info" },
      { name: "background", value: "#f8fafc", role: "background" },
      { name: "text", value: "#1e293b", role: "text" },
    ]

    // 先にカラーバリエーションをリセット
    setColorVariations({})

    // 次にカラーデータをリセット
    setColorData(defaultColors.slice(0, colorCount))
    if (colorCount > 8) {
      const newColorData = [...defaultColors]
      for (let i = 8; i < colorCount; i++) {
        const randomColor = `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`
        newColorData.push({ name: `color${i + 1}`, value: randomColor })
      }
      setColorData(newColorData)
    }

    // Reset text color settings
    setTextColorSettings({
      main: "default",
      dark: "default",
      light: "light",
      lighter: "lighter",
    })

    // Reset primary color index
    setPrimaryColorIndex(0)

    // Reset color mode settings
    setColorMode("standard")
    setShowTailwindClasses(false)
    setShowMaterialNames(false)

    // Reset typography tokens
    setTypographyTokens({})

    // Reset Figma import mode
    setIsFigmaImportMode(false)

    // Reset typography only mode
    setIsTypographyOnly(false)

    // Reset active tab
    setActiveTab("colors")

    toast({
      title: t("toast.resetComplete"),
      description: t("toast.resetCompleteDescription"),
    })
  }

  const exportData = {
    colors: colorData,
    variations: colorVariations,
    textColorSettings: textColorSettings, // テキストカラー設定を追加
    primaryColorIndex: primaryColorIndex,
    colorMode: colorMode,
    showTailwindClasses: showTailwindClasses,
    showMaterialNames: showMaterialNames,
    typographyTokens: typographyTokens, // タイポグラフィトークンを追加
    isFigmaImportMode: isFigmaImportMode, // Figmaインポートモードを追加
    isTypographyOnly: isTypographyOnly, // タイポグラフィのみモードを追加
    activeTab: activeTab, // アクティブタブを追加
  }

  const handleImport = (
    importedData: PaletteType & {
      primaryColorIndex?: number
      colorMode?: ColorMode
      showTailwindClasses?: boolean
      showMaterialNames?: boolean
      typographyTokens?: Record<string, any>
      isFigmaImportMode?: boolean
      isTypographyOnly?: boolean
      activeTab?: "colors" | "typography"
    },
  ) => {
    try {
      // タイポグラフィデータの処理
      if (importedData.typographyTokens && Object.keys(importedData.typographyTokens).length > 0) {
        setTypographyTokens(importedData.typographyTokens)

        // カラーデータがない場合はタイポグラフィのみモードに
        if (!importedData.colors || importedData.colors.length === 0) {
          setIsTypographyOnly(true)
          setActiveTab("typography")
        }
      }

      if (importedData.colors && Array.isArray(importedData.colors)) {
        // Validate each color entry
        const validColors = importedData.colors.filter(
          (color) =>
            color &&
            typeof color === "object" &&
            "name" in color &&
            "value" in color &&
            typeof color.name === "string" &&
            typeof color.value === "string" &&
            /^#[0-9A-F]{6}$/i.test(color.value),
        )

        if (validColors.length > 0) {
          setColorData(validColors)
          setColorCount(validColors.length)

          // Import text color settings if available
          if (importedData.textColorSettings) {
            setTextColorSettings(importedData.textColorSettings)
          }

          // Import primary color index if available
          if (
            typeof importedData.primaryColorIndex === "number" &&
            importedData.primaryColorIndex >= 0 &&
            importedData.primaryColorIndex < validColors.length
          ) {
            setPrimaryColorIndex(importedData.primaryColorIndex)
          } else {
            setPrimaryColorIndex(0) // デフォルト値にリセット
          }

          // Import color mode settings if available
          if (importedData.colorMode) {
            setColorMode(importedData.colorMode)
          }

          if (typeof importedData.showTailwindClasses === "boolean") {
            setShowTailwindClasses(importedData.showTailwindClasses)
          }

          if (typeof importedData.showMaterialNames === "boolean") {
            setShowMaterialNames(importedData.showMaterialNames)
          }

          // Import Figma import mode if available
          if (typeof importedData.isFigmaImportMode === "boolean") {
            setIsFigmaImportMode(importedData.isFigmaImportMode)
          }

          // Import typography only mode if available
          if (typeof importedData.isTypographyOnly === "boolean") {
            setIsTypographyOnly(importedData.isTypographyOnly)
          }

          // Import active tab if available
          if (importedData.activeTab) {
            setActiveTab(importedData.activeTab)
          }

          toast({
            title: t("toast.importComplete"),
            description:
              language === "jp"
                ? `${validColors.length}色のパレットをインポートしました`
                : `Imported palette with ${validColors.length} colors`,
          })

          // Save to localStorage immediately after import
          setTimeout(saveToLocalStorage, 100)
        } else if (importedData.typographyTokens && Object.keys(importedData.typographyTokens).length > 0) {
          // カラーデータがなくてもタイポグラフィデータがあれば成功とする
          toast({
            title: t("toast.importComplete"),
            description: language === "jp" ? "タイポグラフィデータをインポートしました" : "Imported typography data",
          })

          // Save to localStorage immediately after import
          setTimeout(saveToLocalStorage, 100)
        } else {
          throw new Error(language === "jp" ? "有効なカラーデータが見つかりませんでした" : "No valid color data found")
        }
      } else if (importedData.typographyTokens && Object.keys(importedData.typographyTokens).length > 0) {
        // カラーデータがなくてもタイポグラフィデータがあれば成功とする
        toast({
          title: t("toast.importComplete"),
          description: language === "jp" ? "タイポグラフィデータをインポートしました" : "Imported typography data",
        })

        // Save to localStorage immediately after import
        setTimeout(saveToLocalStorage, 100)
      } else {
        throw new Error(language === "jp" ? "カラーデータが見つかりませんでした" : "No color data found")
      }
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: t("toast.importError"),
        description:
          error instanceof Error
            ? error.message
            : language === "jp"
              ? "不明なエラーが発生しました"
              : "Unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const handleTextColorSettingsChange = (newSettings: TextColorSettingsType) => {
    setTextColorSettings(newSettings)
    // 変更後に自動保存
    setTimeout(() => {
      saveToLocalStorage()
    }, 100)
  }

  const handleColorModeChange = (mode: ColorMode) => {
    setColorMode(mode)

    // カラーモードに応じて表示設定を自動調整
    if (mode === "material") {
      setShowMaterialNames(true)
      setShowTailwindClasses(false)
    } else if (mode === "tailwind") {
      setShowTailwindClasses(true)
      setShowMaterialNames(false)
    }

    // 変更後に自動保存
    setTimeout(() => {
      saveToLocalStorage()
    }, 100)
  }

  const handleToggleTailwindClasses = (show: boolean) => {
    setShowTailwindClasses(show)
    // 変更後に自動保存
    setTimeout(() => {
      saveToLocalStorage()
    }, 100)
  }

  const handleToggleMaterialNames = (show: boolean) => {
    setShowMaterialNames(show)
    // 変更後に自動保存
    setTimeout(() => {
      saveToLocalStorage()
    }, 100)
  }

  // カラーロールの更新
  const handleUpdateColors = (newColors: ColorData[]) => {
    setColorData(newColors)
    setIsFigmaImportMode(true)

    // カラーデータがある場合はタイポグラフィのみモードをオフに
    if (newColors.length > 0) {
      setIsTypographyOnly(false)
      setActiveTab("colors")
    }

    // プライマリカラーのインデックスを更新
    const primaryIndex = newColors.findIndex((color) => color.role === "primary")
    if (primaryIndex !== -1) {
      setPrimaryColorIndex(primaryIndex)
    }

    // 変更後に自動保存
    setTimeout(() => {
      saveToLocalStorage()
    }, 100)
  }

  // タイポグラフィトークンの更新
  const handleUpdateTypography = (newTypography: Record<string, any>) => {
    setTypographyTokens(newTypography)

    // タイポグラフィトークンのみの場合
    if (Object.keys(newTypography).length > 0 && colorData.length === 0) {
      setIsTypographyOnly(true)
      setActiveTab("typography")
    }

    // 変更後に自動保存
    setTimeout(() => {
      saveToLocalStorage()
    }, 100)
  }

  // ドラッグ＆ドロップの処理
  const handleDragEnd = (result: any) => {
    // ドロップ先がない場合は何もしない
    if (!result.destination) return

    // 移動元と移動先が同じ場合も何もしない
    if (result.destination.index === result.source.index) return

    // カラーデータの並び替え
    const newColorData = [...colorData]
    const [movedItem] = newColorData.splice(result.source.index, 1)
    newColorData.splice(result.destination.index, 0, movedItem)
    setColorData(newColorData)

    // Primaryカラーのインデックスも更新
    let newPrimaryIndex = primaryColorIndex
    if (primaryColorIndex === result.source.index) {
      // Primaryカラー自体が移動した場合
      newPrimaryIndex = result.destination.index
    } else if (primaryColorIndex > result.source.index && primaryColorIndex <= result.destination.index) {
      // Primaryカラーの前にあるカラーが後ろに移動した場合
      newPrimaryIndex--
    } else if (primaryColorIndex < result.source.index && primaryColorIndex >= result.destination.index) {
      // Primaryカラーの後ろにあるカラーが前に移動した場合
      newPrimaryIndex++
    }
    setPrimaryColorIndex(newPrimaryIndex)

    // 変更後に自動保存
    setTimeout(() => {
      saveToLocalStorage()
    }, 100)

    toast({
      title: t("toast.reorderComplete"),
      description: t("toast.reorderCompleteDescription"),
    })
  }

  // カラーパレットの表示順をカラーピッカーと同じにする
  const sortedColorVariations = Object.entries(colorVariations).sort((a, b) => {
    const indexA = colorData.findIndex((color) => color.name === a[0])
    const indexB = colorData.findIndex((color) => color.name === b[0])
    return indexA - indexB
  })

  // カラーをグループ化する
  const groupedColors = colorData.reduce((groups: Record<string, ColorData[]>, color) => {
    const group = color.group || "default"
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(color)
    return groups
  }, {})

  // カラーがmain/dark/light/lighterの展開を持つかどうかを判定する関数
  const hasStandardVariations = (color: ColorData): boolean => {
    // カスタムバリエーションがある場合はそれを使用
    if (color.variations) {
      return (
        "main" in color.variations &&
        "dark" in color.variations &&
        "light" in color.variations &&
        "lighter" in color.variations
      )
    }

    // グループやネームスペースに基づいて判定
    if (
      color.group === "grey" ||
      color.group === "common" ||
      color.name.startsWith("grey-") ||
      color.name.startsWith("common-") ||
      color.name.includes("text-") ||
      color.name.includes("background-") ||
      (color.role && (color.role === "text" || color.role === "background"))
    ) {
      return false
    }

    // ロールを持つカラーは標準バリエーションを持つと判定（text/backgroundを除く）
    return !!color.role && color.role !== "text" && color.role !== "background"
  }

  // パレットの色を追加する関数を修正
  const addColor = () => {
    setColorData((prev) => {
      const newPalette = [...prev]
      const newColor = {
        name: `color-${newPalette.length + 1}`,
        value: generateRandomColor(),
        variations: colorMode === "standard" ? generateColorVariations(generateRandomColor()) : {},
        role: undefined,
      }

      return [...newPalette, newColor]
    })
  }

  // パレットの色を削除する関数を修正
  const removeColor = (index: number) => {
    setColorData((prev) => {
      const newPalette = [...prev]
      newPalette.splice(index, 1)
      return newPalette
    })
  }

  // ランダムなカラーを生成する関数
  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
  }

  return (
    <main className={`container mx-auto px-4 py-6 ${theme === "dark" ? "dark" : ""}`}>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Logo />
            <HelpModal />
            <LanguageSwitcher />
            <ThemeSwitcher />
            <GrayscaleToggle />
          </div>
          <div className="flex items-center gap-2">
            {!isTypographyOnly && (
              <>
                <label htmlFor="colorCount" className="text-sm font-medium whitespace-nowrap">
                  {t("header.colorCount")}
                </label>
                <Input
                  id="colorCount"
                  type="number"
                  min="1"
                  max={MAX_COLORS}
                  value={colorCount}
                  onChange={handleCountChange}
                  className="w-16"
                />
              </>
            )}
            <Button onClick={resetColors} variant="secondary" size="sm">
              {t("header.reset")}
            </Button>
            <Button onClick={saveToLocalStorage} variant="outline" size="sm">
              {t("header.save")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <ExportImportPanel data={exportData} onImport={handleImport} />
              <FigmaTokensPanel
                colors={colorData}
                onImport={handleUpdateColors}
                onTypographyImport={handleUpdateTypography}
              />
              {!isTypographyOnly && (
                <>
                  <CodeExportPanel
                    colors={colorData}
                    variations={colorVariations}
                    primaryColorIndex={primaryColorIndex}
                  />
                  <ColorBlindSimulator colors={colorData} variations={colorVariations} />
                  <TextColorPreview colors={colorData} />
                </>
              )}
              {Object.keys(typographyTokens).length > 0 && <TypographyPreviewPanel tokens={typographyTokens} />}
            </div>

            {!isTypographyOnly && (
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <ColorModeSettings
                  colorMode={colorMode}
                  showTailwindClasses={showTailwindClasses}
                  showMaterialNames={showMaterialNames}
                  onChangeColorMode={handleColorModeChange}
                  onToggleTailwindClasses={handleToggleTailwindClasses}
                  onToggleMaterialNames={handleToggleMaterialNames}
                />

                <ColorRoleSettings colors={colorData} onUpdateColors={handleUpdateColors} />

                {colorMode === "material" && (
                  <MaterialPaletteOptimizer
                    colors={colorData}
                    primaryColorIndex={primaryColorIndex}
                    onOptimize={handleUpdateColors}
                  />
                )}

                {colorMode === "tailwind" && (
                  <TailwindPaletteOptimizer
                    colors={colorData}
                    primaryColorIndex={primaryColorIndex}
                    onOptimize={handleUpdateColors}
                  />
                )}

                <PaletteOptimizer
                  colors={colorData}
                  textColorSettings={textColorSettings}
                  primaryColorIndex={primaryColorIndex}
                  onOptimize={setColorData}
                  onUpdateTextSettings={handleTextColorSettingsChange}
                />

                <TextColorSettings settings={textColorSettings} onChange={handleTextColorSettingsChange} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 表示モード切替コンポーネントを追加 */}
      <div className="flex items-center space-x-2 mb-4">
        <Label>表示モード:</Label>
        <Select value={displayMode} onValueChange={(value) => setDisplayMode(value as "full" | "picker" | "palette")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="表示モード" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">フル表示</SelectItem>
            <SelectItem value="picker">カラーピッカーのみ</SelectItem>
            <SelectItem value="palette">カラーパレットのみ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* タイポグラフィのみの場合はタイポグラフィプレビューを表示 */}
      {isTypographyOnly ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">タイポグラフィプレビュー</h2>
              {colorData.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsTypographyOnly(false)
                    setActiveTab("colors")
                    saveToLocalStorage()
                  }}
                >
                  カラーモードに切り替え
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <TypographyPreview tokens={typographyTokens} />
          </CardContent>
        </Card>
      ) : // カラーとタイポグラフィの両方がある場合はタブで切り替え
      Object.keys(typographyTokens).length > 0 ? (
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as "colors" | "typography")
            saveToLocalStorage()
          }}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="colors">
              <Paintbrush className="h-4 w-4 mr-2" />
              カラーパレット
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="h-4 w-4 mr-2" />
              タイポグラフィ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="mt-0">
            {/* メインコンテンツ部分を表示モードに応じて条件付きレンダリング */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
              {(displayMode === "full" || displayMode === "picker") && (
                <div className={`${displayMode === "full" ? "w-full md:w-1/2" : "w-full"}`}>
                  {/* カラーピッカー部分 */}
                  <ResizablePanelGroup direction="horizontal" className="min-h-[500px]">
                    <ResizablePanel defaultSize={100} minSize={30}>
                      {/* カラーピッカーの横スクロール対応 */}
                      <div className="pr-2">
                        <h2 className="text-lg font-semibold mb-3">{t("section.colorPicker")}</h2>
                        <DragDropContext onDragEnd={handleDragEnd}>
                          <Droppable droppableId="color-pickers" direction="horizontal">
                            {(provided) => (
                              <div className="space-y-6" {...provided.droppableProps} ref={provided.innerRef}>
                                {/* 標準のカラーピッカー（ロールを持つカラー） */}
                                {colorData.filter((color) => color.role).length > 0 && (
                                  <div className="mb-4">
                                    <h3 className="text-md font-semibold mb-2">Role Colors</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                      {colorData
                                        .filter((color) => color.role)
                                        .map((color, index) => {
                                          const realIndex = colorData.findIndex((c) => c === color)
                                          return (
                                            <Draggable
                                              key={`color-${realIndex}`}
                                              draggableId={`color-${realIndex}`}
                                              index={realIndex}
                                            >
                                              {(provided) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  className="relative"
                                                >
                                                  {hasStandardVariations(color) ? (
                                                    <ColorPicker
                                                      index={realIndex}
                                                      name={color.name}
                                                      color={color.value}
                                                      isPrimary={realIndex === primaryColorIndex}
                                                      onColorChange={(value) => handleColorChange(realIndex, value)}
                                                      onNameChange={(name) => handleNameChange(realIndex, name)}
                                                      onSetAsPrimary={
                                                        realIndex !== primaryColorIndex
                                                          ? () => handleSetAsPrimary(realIndex)
                                                          : undefined
                                                      }
                                                      dragHandleProps={provided.dragHandleProps}
                                                      colorRole={color.role}
                                                    />
                                                  ) : (
                                                    <SimpleColorPicker
                                                      index={realIndex}
                                                      name={color.name}
                                                      color={color.value}
                                                      isPrimary={realIndex === primaryColorIndex}
                                                      onColorChange={(value) => handleColorChange(realIndex, value)}
                                                      onNameChange={(name) => handleNameChange(realIndex, name)}
                                                      dragHandleProps={provided.dragHandleProps}
                                                      colorRole={color.role}
                                                    />
                                                  )}
                                                </div>
                                              )}
                                            </Draggable>
                                          )
                                        })}
                                    </div>
                                  </div>
                                )}

                                {/* グループ化されたカラーピッカー */}
                                {Object.entries(groupedColors)
                                  .filter(
                                    ([group]) => group !== "default" && !colorData.find((c) => c.group === group)?.role,
                                  )
                                  .map(([group, colors]) => {
                                    // 同じグループ内のカラー数が4つ以上の場合は横スクロール
                                    const shouldScroll = colors.length >= 4

                                    return (
                                      <div key={group} className="mb-4">
                                        <h3 className="text-md font-semibold mb-2 capitalize">{group}</h3>
                                        <div className={shouldScroll ? "overflow-x-auto pb-2" : ""}>
                                          <div
                                            className={
                                              shouldScroll
                                                ? "flex gap-3 min-w-max"
                                                : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
                                            }
                                            style={shouldScroll ? { scrollBehavior: "smooth" } : {}}
                                          >
                                            {colors.map((color) => {
                                              const realIndex = colorData.findIndex((c) => c === color)

                                              // グループ化されたカラーは基本的にシンプルピッカーを使用
                                              const useSimplePicker = !hasStandardVariations(color)

                                              return (
                                                <Draggable
                                                  key={`color-${realIndex}`}
                                                  draggableId={`color-${realIndex}`}
                                                  index={realIndex}
                                                >
                                                  {(provided) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      className={
                                                        shouldScroll
                                                          ? useSimplePicker
                                                            ? "w-[200px]"
                                                            : "w-[300px]"
                                                          : "relative"
                                                      }
                                                    >
                                                      {useSimplePicker ? (
                                                        <SimpleColorPicker
                                                          index={realIndex}
                                                          name={color.name}
                                                          color={color.value}
                                                          isPrimary={realIndex === primaryColorIndex}
                                                          onColorChange={(value) => handleColorChange(realIndex, value)}
                                                          onNameChange={(name) => handleNameChange(realIndex, name)}
                                                          dragHandleProps={provided.dragHandleProps}
                                                          colorRole={color.role}
                                                          group={color.group}
                                                        />
                                                      ) : (
                                                        <ColorPicker
                                                          index={realIndex}
                                                          name={color.name}
                                                          color={color.value}
                                                          isPrimary={realIndex === primaryColorIndex}
                                                          onColorChange={(value) => handleColorChange(realIndex, value)}
                                                          onNameChange={(name) => handleNameChange(realIndex, name)}
                                                          onSetAsPrimary={
                                                            realIndex !== primaryColorIndex
                                                              ? () => handleSetAsPrimary(realIndex)
                                                              : undefined
                                                          }
                                                          dragHandleProps={provided.dragHandleProps}
                                                          colorRole={color.role}
                                                        />
                                                      )}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}

                                {/* その他のカラーピッカー（ロールを持たないカラー、グループなし） */}
                                {colorData.filter((color) => !color.role && (!color.group || color.group === "default"))
                                  .length > 0 && (
                                  <div>
                                    <h3 className="text-md font-semibold mb-2">Other Colors</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                      {colorData
                                        .filter((color) => !color.role && (!color.group || color.group === "default"))
                                        .map((color) => {
                                          const realIndex = colorData.findIndex((c) => c === color)
                                          return (
                                            <Draggable
                                              key={`color-${realIndex}`}
                                              draggableId={`color-${realIndex}`}
                                              index={realIndex}
                                            >
                                              {(provided) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  className="relative"
                                                >
                                                  <ColorPicker
                                                    index={realIndex}
                                                    name={color.name}
                                                    color={color.value}
                                                    isPrimary={realIndex === primaryColorIndex}
                                                    onColorChange={(value) => handleColorChange(realIndex, value)}
                                                    onNameChange={(name) => handleNameChange(realIndex, name)}
                                                    onSetAsPrimary={
                                                      realIndex !== primaryColorIndex
                                                        ? () => handleSetAsPrimary(realIndex)
                                                        : undefined
                                                    }
                                                    dragHandleProps={provided.dragHandleProps}
                                                    colorRole={color.role}
                                                  />
                                                </div>
                                              )}
                                            </Draggable>
                                          )
                                        })}
                                    </div>
                                  </div>
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle className="mt-10" />

                    <ResizablePanel defaultSize={50} minSize={30}>
                      <div className="pl-2">
                        <h2 className="text-lg font-semibold mb-3">{t("section.colorPalette")}</h2>
                        {isFigmaImportMode ? (
                          // Figmaインポートモード：グループ化されたカラーを表示
                          <div>
                            {/* 標準のカラーパレット（main, dark, light, lighter, contrastTextの構造を持つカラー） */}
                            {colorData.filter((color) => hasStandardVariations(color)).length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
                                {colorData
                                  .filter((color) => hasStandardVariations(color))
                                  .map((color) => (
                                    <ColorDisplay
                                      key={color.name}
                                      colorKey={color.name}
                                      variations={colorVariations[color.name] || {}}
                                      textColorSettings={textColorSettings}
                                      isPrimary={colorData.indexOf(color) === primaryColorIndex}
                                      colorMode={colorMode}
                                      showTailwindClasses={showTailwindClasses}
                                      showMaterialNames={showMaterialNames}
                                      colorRole={color.role}
                                      customVariations={color.variations}
                                    />
                                  ))}
                              </div>
                            )}

                            {/* グループ化されたカラー */}
                            {Object.entries(groupedColors)
                              .filter(([group]) => group !== "default")
                              .map(([group, colors]) => {
                                // 同じグループ内のカラー数が4つ以上の場合は横スクロール
                                const shouldScroll = colors.length >= 4

                                return (
                                  <div key={group} className="mb-6">
                                    <h3 className="text-md font-semibold mb-2 capitalize">{group}</h3>
                                    <div className={shouldScroll ? "overflow-x-auto pb-2" : ""}>
                                      <div
                                        className={
                                          shouldScroll
                                            ? "flex gap-3 min-w-max"
                                            : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
                                        }
                                        style={shouldScroll ? { scrollBehavior: "smooth" } : {}}
                                      >
                                        {colors
                                          .filter((color) => !hasStandardVariations(color))
                                          .map((color) => (
                                            <div key={color.name} className={shouldScroll ? "w-[200px]" : ""}>
                                              <ColorDisplay
                                                colorKey={color.name}
                                                variations={{ main: color.value }}
                                                textColorSettings={textColorSettings}
                                                isPrimary={colorData.indexOf(color) === primaryColorIndex}
                                                colorMode={colorMode}
                                                showTailwindClasses={showTailwindClasses}
                                                showMaterialNames={showMaterialNames}
                                                colorRole={color.role}
                                                group={color.group}
                                                disableVariationGeneration={true}
                                              />
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}

                            {/* その他のカラー（グループなし、バリエーションなし） */}
                            {colorData.filter(
                              (color) => (!color.group || color.group === "default") && !hasStandardVariations(color),
                            ).length > 0 && (
                              <div className="mb-6">
                                <h3 className="text-md font-semibold mb-2">Other Colors</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                  {colorData
                                    .filter(
                                      (color) =>
                                        (!color.group || color.group === "default") && !hasStandardVariations(color),
                                    )
                                    .map((color) => (
                                      <div key={color.name}>
                                        <ColorDisplay
                                          colorKey={color.name}
                                          variations={{ main: color.value }}
                                          textColorSettings={textColorSettings}
                                          isPrimary={colorData.indexOf(color) === primaryColorIndex}
                                          colorMode={colorMode}
                                          showTailwindClasses={showTailwindClasses}
                                          showMaterialNames={showMaterialNames}
                                          colorRole={color.role}
                                          disableVariationGeneration={true}
                                        />
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          // 標準モード：通常のカラーパレット
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                            {sortedColorVariations.map(([key, variations]) => {
                              // カラー名からcolorDataの中での位置を特定
                              const colorIndex = colorData.findIndex((c) => c.name === key)
                              const color = colorData[colorIndex]

                              // main/dark/light/lighterの展開を持たないカラーは自動展開しない
                              const disableVariationGeneration = !hasStandardVariations(color)

                              return (
                                <ColorDisplay
                                  key={key}
                                  colorKey={key}
                                  variations={variations}
                                  textColorSettings={textColorSettings}
                                  isPrimary={colorIndex === primaryColorIndex}
                                  colorMode={colorMode}
                                  showTailwindClasses={showTailwindClasses}
                                  showMaterialNames={showMaterialNames}
                                  colorRole={color?.role}
                                  disableVariationGeneration={disableVariationGeneration}
                                />
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>
              )}

              {(displayMode === "full" || displayMode === "palette") && (
                <div className={`${displayMode === "full" ? "w-full md:w-1/2" : "w-full"}`}>
                  {/* カラーパレット部分 */}
                  <ResizablePanelGroup direction="horizontal" className="min-h-[500px]">
                    <ResizablePanel defaultSize={50} minSize={30}>
                      {/* カラーピッカーの横スクロール対応 */}
                      <div className="pr-2">
                        <h2 className="text-lg font-semibold mb-3">{t("section.colorPicker")}</h2>
                        <DragDropContext onDragEnd={handleDragEnd}>
                          <Droppable droppableId="color-pickers" direction="horizontal">
                            {(provided) => (
                              <div className="space-y-6" {...provided.droppableProps} ref={provided.innerRef}>
                                {/* 標準のカラーピッカー（ロールを持つカラー） */}
                                {colorData.filter((color) => color.role).length > 0 && (
                                  <div className="mb-4">
                                    <h3 className="text-md font-semibold mb-2">Role Colors</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                      {colorData
                                        .filter((color) => color.role)
                                        .map((color, index) => {
                                          const realIndex = colorData.findIndex((c) => c === color)
                                          return (
                                            <Draggable
                                              key={`color-${realIndex}`}
                                              draggableId={`color-${realIndex}`}
                                              index={realIndex}
                                            >
                                              {(provided) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  className="relative"
                                                >
                                                  <ColorPicker
                                                    index={realIndex}
                                                    name={color.name}
                                                    color={color.value}
                                                    isPrimary={realIndex === primaryColorIndex}
                                                    onColorChange={(value) => handleColorChange(realIndex, value)}
                                                    onNameChange={(name) => handleNameChange(realIndex, name)}
                                                    onSetAsPrimary={
                                                      realIndex !== primaryColorIndex
                                                        ? () => handleSetAsPrimary(realIndex)
                                                        : undefined
                                                    }
                                                    dragHandleProps={provided.dragHandleProps}
                                                    colorRole={color.role}
                                                  />
                                                </div>
                                              )}
                                            </Draggable>
                                          )
                                        })}
                                    </div>
                                  </div>
                                )}

                                {/* グループ化されたカラーピッカー */}
                                {Object.entries(groupedColors)
                                  .filter(
                                    ([group]) => group !== "default" && !colorData.find((c) => c.group === group)?.role,
                                  )
                                  .map(([group, colors]) => {
                                    // 同じグループ内のカラー数が4つ以上の場合は横スクロール
                                    const shouldScroll = colors.length >= 4

                                    return (
                                      <div key={group} className="mb-4">
                                        <h3 className="text-md font-semibold mb-2 capitalize">{group}</h3>
                                        <div className={shouldScroll ? "overflow-x-auto pb-2" : ""}>
                                          <div
                                            className={
                                              shouldScroll
                                                ? "flex gap-3 min-w-max"
                                                : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
                                            }
                                            style={shouldScroll ? { scrollBehavior: "smooth" } : {}}
                                          >
                                            {colors.map((color) => {
                                              const realIndex = colorData.findIndex((c) => c === color)
                                              return (
                                                <Draggable
                                                  key={`color-${realIndex}`}
                                                  draggableId={`color-${realIndex}`}
                                                  index={realIndex}
                                                >
                                                  {(provided) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      className={shouldScroll ? "w-[300px]" : "relative"}
                                                    >
                                                      <ColorPicker
                                                        index={realIndex}
                                                        name={color.name}
                                                        color={color.value}
                                                        isPrimary={realIndex === primaryColorIndex}
                                                        onColorChange={(value) => handleColorChange(realIndex, value)}
                                                        onNameChange={(name) => handleNameChange(realIndex, name)}
                                                        onSetAsPrimary={
                                                          realIndex !== primaryColorIndex
                                                            ? () => handleSetAsPrimary(realIndex)
                                                            : undefined
                                                        }
                                                        dragHandleProps={provided.dragHandleProps}
                                                        colorRole={color.role}
                                                      />
                                                    </div>
                                                  )}
                                                </Draggable>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}

                                {/* その他のカラーピッカー（ロールを持たないカラー、グループなし） */}
                                {colorData.filter((color) => !color.role && (!color.group || color.group === "default"))
                                  .length > 0 && (
                                  <div>
                                    <h3 className="text-md font-semibold mb-2">Other Colors</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                      {colorData
                                        .filter((color) => !color.role && (!color.group || color.group === "default"))
                                        .map((color) => {
                                          const realIndex = colorData.findIndex((c) => c === color)
                                          return (
                                            <Draggable
                                              key={`color-${realIndex}`}
                                              draggableId={`color-${realIndex}`}
                                              index={realIndex}
                                            >
                                              {(provided) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  className="relative"
                                                >
                                                  <ColorPicker
                                                    index={realIndex}
                                                    name={color.name}
                                                    color={color.value}
                                                    isPrimary={realIndex === primaryColorIndex}
                                                    onColorChange={(value) => handleColorChange(realIndex, value)}
                                                    onNameChange={(name) => handleNameChange(realIndex, name)}
                                                    onSetAsPrimary={
                                                      realIndex !== primaryColorIndex
                                                        ? () => handleSetAsPrimary(realIndex)
                                                        : undefined
                                                    }
                                                    dragHandleProps={provided.dragHandleProps}
                                                    colorRole={color.role}
                                                  />
                                                </div>
                                              )}
                                            </Draggable>
                                          )
                                        })}
                                    </div>
                                  </div>
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle className="mt-10" />

                    <ResizablePanel defaultSize={50} minSize={30}>
                      <div className="pl-2">
                        <h2 className="text-lg font-semibold mb-3">{t("section.colorPalette")}</h2>
                        {isFigmaImportMode ? (
                          // Figmaインポートモード：グループ化されたカラーを表示
                          <div>
                            {/* 標準のカラーパレット（main, dark, light, lighter, contrastTextの構造を持つカラー） */}
                            {colorData.filter((color) => hasStandardVariations(color)).length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
                                {colorData
                                  .filter((color) => hasStandardVariations(color))
                                  .map((color) => (
                                    <ColorDisplay
                                      key={color.name}
                                      colorKey={color.name}
                                      variations={colorVariations[color.name] || {}}
                                      textColorSettings={textColorSettings}
                                      isPrimary={colorData.indexOf(color) === primaryColorIndex}
                                      colorMode={colorMode}
                                      showTailwindClasses={showTailwindClasses}
                                      showMaterialNames={showMaterialNames}
                                      colorRole={color.role}
                                      customVariations={color.variations}
                                    />
                                  ))}
                              </div>
                            )}

                            {/* グループ化されたカラー */}
                            {Object.entries(groupedColors)
                              .filter(([group]) => group !== "default")
                              .map(([group, colors]) => {
                                // 同じグループ内のカラー数が4つ以上の場合は横スクロール
                                const shouldScroll = colors.length >= 4

                                return (
                                  <div key={group} className="mb-6">
                                    <h3 className="text-md font-semibold mb-2 capitalize">{group}</h3>
                                    <div className={shouldScroll ? "overflow-x-auto pb-2" : ""}>
                                      <div
                                        className={
                                          shouldScroll
                                            ? "flex gap-3 min-w-max"
                                            : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
                                        }
                                        style={shouldScroll ? { scrollBehavior: "smooth" } : {}}
                                      >
                                        {colors
                                          .filter((color) => !hasStandardVariations(color))
                                          .map((color) => (
                                            <div key={color.name} className={shouldScroll ? "w-[200px]" : ""}>
                                              <ColorDisplay
                                                colorKey={color.name}
                                                variations={{ main: color.value }}
                                                textColorSettings={textColorSettings}
                                                isPrimary={colorData.indexOf(color) === primaryColorIndex}
                                                colorMode={colorMode}
                                                showTailwindClasses={showTailwindClasses}
                                                showMaterialNames={showMaterialNames}
                                                colorRole={color.role}
                                                group={color.group}
                                                disableVariationGeneration={true}
                                              />
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}

                            {/* その他のカラー（グループなし、バリエーションなし） */}
                            {colorData.filter(
                              (color) => (!color.group || color.group === "default") && !hasStandardVariations(color),
                            ).length > 0 && (
                              <div className="mb-6">
                                <h3 className="text-md font-semibold mb-2">Other Colors</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                  {colorData
                                    .filter(
                                      (color) =>
                                        (!color.group || color.group === "default") && !hasStandardVariations(color),
                                    )
                                    .map((color) => (
                                      <div key={color.name}>
                                        <ColorDisplay
                                          colorKey={color.name}
                                          variations={{ main: color.value }}
                                          textColorSettings={textColorSettings}
                                          isPrimary={colorData.indexOf(color) === primaryColorIndex}
                                          colorMode={colorMode}
                                          showTailwindClasses={showTailwindClasses}
                                          showMaterialNames={showMaterialNames}
                                          colorRole={color.role}
                                          disableVariationGeneration={true}
                                        />
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          // 標準モード：通常のカラーパレット
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                            {sortedColorVariations.map(([key, variations]) => {
                              // カラー名からcolorDataの中での位置を特定
                              const colorIndex = colorData.findIndex((c) => c.name === key)
                              const color = colorData[colorIndex]

                              // main/dark/light/lighterの展開を持たないカラーは自動展開しない
                              const disableVariationGeneration = !hasStandardVariations(color)

                              return (
                                <ColorDisplay
                                  key={key}
                                  colorKey={key}
                                  variations={variations}
                                  textColorSettings={textColorSettings}
                                  isPrimary={colorIndex === primaryColorIndex}
                                  colorMode={colorMode}
                                  showTailwindClasses={showTailwindClasses}
                                  showMaterialNames={showMaterialNames}
                                  colorRole={color?.role}
                                  disableVariationGeneration={disableVariationGeneration}
                                />
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="typography" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <TypographyPreview tokens={typographyTokens} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        // カラーのみの場合は通常表示
        <ResizablePanelGroup direction="horizontal" className="min-h-[500px]">
          <ResizablePanel defaultSize={50} minSize={30}>
            {/* カラーピッカーの横スクロール対応 */}
            <div className="pr-2">
              <h2 className="text-lg font-semibold mb-3">{t("section.colorPicker")}</h2>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="color-pickers" direction="horizontal">
                  {(provided) => (
                    <div className="space-y-6" {...provided.droppableProps} ref={provided.innerRef}>
                      {/* 標準のカラーピッカー（ロールを持つカラー） */}
                      {colorData.filter((color) => color.role).length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-md font-semibold mb-2">Role Colors</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                            {colorData
                              .filter((color) => color.role)
                              .map((color, index) => {
                                const realIndex = colorData.findIndex((c) => c === color)
                                return (
                                  <Draggable
                                    key={`color-${realIndex}`}
                                    draggableId={`color-${realIndex}`}
                                    index={realIndex}
                                  >
                                    {(provided) => (
                                      <div ref={provided.innerRef} {...provided.draggableProps} className="relative">
                                        <ColorPicker
                                          index={realIndex}
                                          name={color.name}
                                          color={color.value}
                                          isPrimary={realIndex === primaryColorIndex}
                                          onColorChange={(value) => handleColorChange(realIndex, value)}
                                          onNameChange={(name) => handleNameChange(realIndex, name)}
                                          onSetAsPrimary={
                                            realIndex !== primaryColorIndex
                                              ? () => handleSetAsPrimary(realIndex)
                                              : undefined
                                          }
                                          dragHandleProps={provided.dragHandleProps}
                                          colorRole={color.role}
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                )
                              })}
                          </div>
                        </div>
                      )}

                      {/* グループ化されたカラーピッカー */}
                      {Object.entries(groupedColors)
                        .filter(([group]) => group !== "default" && !colorData.find((c) => c.group === group)?.role)
                        .map(([group, colors]) => {
                          // 同じグループ内のカラー数が4つ以上の場合は横スクロール
                          const shouldScroll = colors.length >= 4

                          return (
                            <div key={group} className="mb-4">
                              <h3 className="text-md font-semibold mb-2 capitalize">{group}</h3>
                              <div className={shouldScroll ? "overflow-x-auto pb-2" : ""}>
                                <div
                                  className={
                                    shouldScroll
                                      ? "flex gap-3 min-w-max"
                                      : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
                                  }
                                  style={shouldScroll ? { scrollBehavior: "smooth" } : {}}
                                >
                                  {colors.map((color) => {
                                    const realIndex = colorData.findIndex((c) => c === color)
                                    return (
                                      <Draggable
                                        key={`color-${realIndex}`}
                                        draggableId={`color-${realIndex}`}
                                        index={realIndex}
                                      >
                                        {(provided) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={shouldScroll ? "w-[300px]" : "relative"}
                                          >
                                            <ColorPicker
                                              index={realIndex}
                                              name={color.name}
                                              color={color.value}
                                              isPrimary={realIndex === primaryColorIndex}
                                              onColorChange={(value) => handleColorChange(realIndex, value)}
                                              onNameChange={(name) => handleNameChange(realIndex, name)}
                                              onSetAsPrimary={
                                                realIndex !== primaryColorIndex
                                                  ? () => handleSetAsPrimary(realIndex)
                                                  : undefined
                                              }
                                              dragHandleProps={provided.dragHandleProps}
                                              colorRole={color.role}
                                            />
                                          </div>
                                        )}
                                      </Draggable>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          )
                        })}

                      {/* その他のカラーピッカー（ロールを持たないカラー、グループなし） */}
                      {colorData.filter((color) => !color.role && (!color.group || color.group === "default")).length >
                        0 && (
                        <div>
                          <h3 className="text-md font-semibold mb-2">Other Colors</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                            {colorData
                              .filter((color) => !color.role && (!color.group || color.group === "default"))
                              .map((color) => {
                                const realIndex = colorData.findIndex((c) => c === color)
                                return (
                                  <Draggable
                                    key={`color-${realIndex}`}
                                    draggableId={`color-${realIndex}`}
                                    index={realIndex}
                                  >
                                    {(provided) => (
                                      <div ref={provided.innerRef} {...provided.draggableProps} className="relative">
                                        <ColorPicker
                                          index={realIndex}
                                          name={color.name}
                                          color={color.value}
                                          isPrimary={realIndex === primaryColorIndex}
                                          onColorChange={(value) => handleColorChange(realIndex, value)}
                                          onNameChange={(name) => handleNameChange(realIndex, name)}
                                          onSetAsPrimary={
                                            realIndex !== primaryColorIndex
                                              ? () => handleSetAsPrimary(realIndex)
                                              : undefined
                                          }
                                          dragHandleProps={provided.dragHandleProps}
                                          colorRole={color.role}
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                )
                              })}
                          </div>
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="mt-10" />

          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="pl-2">
              <h2 className="text-lg font-semibold mb-3">{t("section.colorPalette")}</h2>
              {isFigmaImportMode ? (
                // Figmaインポートモード：グループ化されたカラーを表示
                <div>
                  {/* 標準のカラーパレット（main, dark, light, lighter, contrastTextの構造を持つカラー） */}
                  {colorData.filter((color) => hasStandardVariations(color)).length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
                      {colorData
                        .filter((color) => hasStandardVariations(color))
                        .map((color) => (
                          <ColorDisplay
                            key={color.name}
                            colorKey={color.name}
                            variations={colorVariations[color.name] || {}}
                            textColorSettings={textColorSettings}
                            isPrimary={colorData.indexOf(color) === primaryColorIndex}
                            colorMode={colorMode}
                            showTailwindClasses={showTailwindClasses}
                            showMaterialNames={showMaterialNames}
                            colorRole={color.role}
                            customVariations={color.variations}
                          />
                        ))}
                    </div>
                  )}

                  {/* グループ化されたカラー */}
                  {Object.entries(groupedColors)
                    .filter(([group]) => group !== "default")
                    .map(([group, colors]) => {
                      // 同じグループ内のカラー数が4つ以上の場合は横スクロール
                      const shouldScroll = colors.length >= 4

                      return (
                        <div key={group} className="mb-6">
                          <h3 className="text-md font-semibold mb-2 capitalize">{group}</h3>
                          <div className={shouldScroll ? "overflow-x-auto pb-2" : ""}>
                            <div
                              className={
                                shouldScroll
                                  ? "flex gap-3 min-w-max"
                                  : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
                              }
                              style={shouldScroll ? { scrollBehavior: "smooth" } : {}}
                            >
                              {colors
                                .filter((color) => !hasStandardVariations(color))
                                .map((color) => (
                                  <div key={color.name} className={shouldScroll ? "w-[200px]" : ""}>
                                    <ColorDisplay
                                      colorKey={color.name}
                                      variations={{ main: color.value }}
                                      textColorSettings={textColorSettings}
                                      isPrimary={colorData.indexOf(color) === primaryColorIndex}
                                      colorMode={colorMode}
                                      showTailwindClasses={showTailwindClasses}
                                      showMaterialNames={showMaterialNames}
                                      colorRole={color.role}
                                      group={color.group}
                                      disableVariationGeneration={true}
                                    />
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      )
                    })}

                  {/* その他のカラー（グループなし、バリエーションなし） */}
                  {colorData.filter(
                    (color) => (!color.group || color.group === "default") && !hasStandardVariations(color),
                  ).length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-md font-semibold mb-2">Other Colors</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {colorData
                          .filter(
                            (color) => (!color.group || color.group === "default") && !hasStandardVariations(color),
                          )
                          .map((color) => (
                            <div key={color.name}>
                              <ColorDisplay
                                colorKey={color.name}
                                variations={{ main: color.value }}
                                textColorSettings={textColorSettings}
                                isPrimary={colorData.indexOf(color) === primaryColorIndex}
                                colorMode={colorMode}
                                showTailwindClasses={showTailwindClasses}
                                showMaterialNames={showMaterialNames}
                                colorRole={color.role}
                                disableVariationGeneration={true}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // 標準モード：通常のカラーパレット
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {sortedColorVariations.map(([key, variations]) => {
                    // カラー名からcolorDataの中での位置を特定
                    const colorIndex = colorData.findIndex((c) => c.name === key)
                    const color = colorData[colorIndex]

                    // main/dark/light/lighterの展開を持たないカラーは自動展開しない
                    const disableVariationGeneration = !hasStandardVariations(color)

                    return (
                      <ColorDisplay
                        key={key}
                        colorKey={key}
                        variations={variations}
                        textColorSettings={textColorSettings}
                        isPrimary={colorIndex === primaryColorIndex}
                        colorMode={colorMode}
                        showTailwindClasses={showTailwindClasses}
                        showMaterialNames={showMaterialNames}
                        colorRole={color?.role}
                        disableVariationGeneration={disableVariationGeneration}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      <Toaster />
    </main>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <PaletteApp />
      </ThemeProvider>
    </LanguageProvider>
  )
}
