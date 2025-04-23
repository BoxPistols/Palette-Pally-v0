"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ColorPicker } from "@/components/color-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { generateColorVariations } from "@/lib/color-utils"
import { ColorDisplay } from "@/components/color-display"
import { ExportImportPanel } from "@/components/export-import-panel"
import { Logo } from "@/components/logo"
import { HelpModal } from "@/components/help-modal"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { PaletteType, ColorData } from "@/types/palette"

const MAX_COLORS = 24
const STORAGE_KEY = "palette-pally-data"
const TEXT_MODE_KEY = "palette-pally-text-mode"

export default function Home() {
  const [colorCount, setColorCount] = useState<number>(4)
  const [colorData, setColorData] = useState<ColorData[]>([
    { name: "color1", value: "#e61919" },
    { name: "color2", value: "#80e619" },
    { name: "color3", value: "#19e5e6" },
    { name: "color4", value: "#7f19e6" },
  ])
  const [colorVariations, setColorVariations] = useState<Record<string, Record<string, string>>>({})
  const [forceWhiteText, setForceWhiteText] = useState<boolean>(false)

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as PaletteType
        if (parsedData.colors && Array.isArray(parsedData.colors)) {
          setColorData(parsedData.colors)
          setColorCount(parsedData.colors.length)
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
      }
    }

    // Load text mode preference
    const textMode = localStorage.getItem(TEXT_MODE_KEY)
    if (textMode) {
      setForceWhiteText(textMode === "white")
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

  // Save text mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(TEXT_MODE_KEY, forceWhiteText ? "white" : "auto")
  }, [forceWhiteText])

  // Save to localStorage function
  const saveToLocalStorage = () => {
    try {
      const dataToSave: PaletteType = {
        colors: colorData,
        variations: colorVariations,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
      toast({
        title: "保存完了",
        description: "パレットデータをLocalStorageに保存しました",
      })
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      toast({
        title: "保存エラー",
        description: "データの保存中にエラーが発生しました",
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
      }
    }
  }

  const resetColors = () => {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY)

    const defaultColors = [
      { name: "color1", value: "#e61919" },
      { name: "color2", value: "#80e619" },
      { name: "color3", value: "#19e5e6" },
      { name: "color4", value: "#7f19e6" },
    ]

    setColorData(defaultColors.slice(0, colorCount))
    if (colorCount > 4) {
      const newColorData = [...defaultColors]
      for (let i = 4; i < colorCount; i++) {
        const randomColor = `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`
        newColorData.push({ name: `color${i + 1}`, value: randomColor })
      }
      setColorData(newColorData)
    }

    toast({
      title: "リセット完了",
      description: "パレットデータをリセットしました",
    })
  }

  const exportData: PaletteType = {
    colors: colorData,
    variations: colorVariations,
  }

  const handleImport = (importedData: PaletteType) => {
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

          toast({
            title: "インポート完了",
            description: `${validColors.length}色のパレットをインポートしました`,
          })

          // Save to localStorage immediately after import
          setTimeout(saveToLocalStorage, 100)
        } else {
          throw new Error("有効なカラーデータがありません")
        }
      } else {
        throw new Error("カラーデータが見つかりません")
      }
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: "インポートエラー",
        description: error instanceof Error ? error.message : "不明なエラーが発生しました",
        variant: "destructive",
      })
    }
  }

  const toggleTextMode = () => {
    setForceWhiteText(!forceWhiteText)
    toast({
      title: !forceWhiteText ? "白文字モード有効" : "自動文字色モード有効",
      description: !forceWhiteText
        ? "main, dark, lightのテキストを白色に固定します"
        : "背景色に応じてテキスト色を自動調整します",
    })
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Logo />
            <HelpModal />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="colorCount" className="text-sm font-medium whitespace-nowrap">
              カラー数:
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
              リセット
            </Button>
            <Button onClick={saveToLocalStorage} variant="outline" size="sm">
              保存
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <ExportImportPanel data={exportData} onImport={handleImport} />

            <div className="flex items-center space-x-2">
              <Switch id="text-mode" checked={forceWhiteText} onCheckedChange={toggleTextMode} />
              <Label htmlFor="text-mode" className="text-sm">
                Text to White
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Pickers Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">カラーピッカー</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {colorData.map((color, index) => (
              <ColorPicker
                key={index}
                index={index}
                name={color.name}
                color={color.value}
                onColorChange={(value) => handleColorChange(index, value)}
                onNameChange={(name) => handleNameChange(index, name)}
              />
            ))}
          </div>
        </div>

        {/* Color Palette Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">カラーパレット</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {Object.entries(colorVariations).map(([key, variations], index) => (
              <ColorDisplay key={key} colorKey={key} variations={variations} forceWhiteText={forceWhiteText} />
            ))}
          </div>
        </div>
      </div>

      <Toaster />
    </main>
  )
}
