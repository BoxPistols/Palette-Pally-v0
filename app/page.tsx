"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { ColorPicker } from "@/components/color-picker"
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
import { LanguageSwitcher } from "@/components/language-switcher"
import type { PaletteType, ColorData, TextColorSettings as TextColorSettingsType } from "@/types/palette"
import type { ColorMode } from "@/lib/color-systems"

const MAX_COLORS = 24
const STORAGE_KEY = "palette-pally-data"

function PaletteApp() {
  const { language, t } = useLanguage()
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
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
      }
    }
  }, [])

  // Generate color variations when colors change
  useEffect(() => {
    const variations: Record<string, Record<string, string>> = {}

    colorData.forEach((color) => {
      variations[color.name] = generateColorVariations(color.value)
    })

    setColorVariations(variations)
  }, [colorData])

  // Save to localStorage function
  const saveToLocalStorage = () => {
    try {
      const dataToSave = {
        colors: colorData,
        variations: colorVariations,
        textColorSettings: textColorSettings,
        primaryColorIndex: primaryColorIndex,
        colorMode: colorMode,
        showTailwindClasses: showTailwindClasses,
        showMaterialNames: showMaterialNames,
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
      light: "default",
      lighter: "default",
    })

    // Reset primary color index
    setPrimaryColorIndex(0)

    // Reset color mode settings
    setColorMode("standard")
    setShowTailwindClasses(false)
    setShowMaterialNames(false)

    toast({
      title: t("toast.resetComplete"),
      description: t("toast.resetCompleteDescription"),
    })
  }

  const exportData = {
    colors: colorData,
    variations: colorVariations,
    textColorSettings: textColorSettings,
    primaryColorIndex: primaryColorIndex,
    colorMode: colorMode,
    showTailwindClasses: showTailwindClasses,
    showMaterialNames: showMaterialNames,
  }

  const handleImport = (
    importedData: PaletteType & {
      primaryColorIndex?: number
      colorMode?: ColorMode
      showTailwindClasses?: boolean
      showMaterialNames?: boolean
    },
  ) => {
    try {
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

          toast({
            title: t("toast.importComplete"),
            description:
              language === "jp"
                ? `${validColors.length}色のパレットをインポートしました`
                : `Imported palette with ${validColors.length} colors`,
          })

          // Save to localStorage immediately after import
          setTimeout(saveToLocalStorage, 100)
        } else {
          throw new Error(language === "jp" ? "有効なカラーデータが見つかりませんでした" : "No valid color data found")
        }
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

  return (
    <main className="container mx-auto px-4 py-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Logo />
            <HelpModal />
            <LanguageSwitcher />
          </div>
          <div className="flex items-center gap-2">
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
              <FigmaTokensPanel colors={colorData} onImport={handleUpdateColors} />
              <CodeExportPanel colors={colorData} variations={colorVariations} primaryColorIndex={primaryColorIndex} />
              <ColorBlindSimulator colors={colorData} variations={colorVariations} />
              <TextColorPreview colors={colorData} />
            </div>

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
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Pickers Section with Drag & Drop */}
        <div>
          <h2 className="text-lg font-semibold mb-3">{t("section.colorPicker")}</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="color-pickers" direction="horizontal">
              {(provided) => (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {colorData.map((color, index) => (
                    <Draggable key={`color-${index}`} draggableId={`color-${index}`} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} className="relative">
                          <ColorPicker
                            index={index}
                            name={color.name}
                            color={color.value}
                            isPrimary={index === primaryColorIndex}
                            onColorChange={(value) => handleColorChange(index, value)}
                            onNameChange={(name) => handleNameChange(index, name)}
                            onSetAsPrimary={index !== primaryColorIndex ? () => handleSetAsPrimary(index) : undefined}
                            dragHandleProps={provided.dragHandleProps}
                            colorRole={color.role}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Color Palette Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">{t("section.colorPalette")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {sortedColorVariations.map(([key, variations]) => {
              // カラー名からcolorDataの中での位置を特定
              const colorIndex = colorData.findIndex((c) => c.name === key)
              const color = colorData[colorIndex]
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
                />
              )
            })}
          </div>
        </div>
      </div>

      <Toaster />
    </main>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <PaletteApp />
    </LanguageProvider>
  )
}
