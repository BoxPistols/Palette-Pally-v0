"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimpleColorPicker } from "./simple-color-picker"
import { getBetterContrastColor } from "@/lib/color-utils"
import type { PaletteColor } from "@/types/palette"

interface RoleColorDetailEditorProps {
  color: PaletteColor
  onChange: (updatedColor: PaletteColor) => void
}

export function RoleColorDetailEditor({ color, onChange }: RoleColorDetailEditorProps) {
  const [activeTab, setActiveTab] = useState("main")
  const [localColor, setLocalColor] = useState<PaletteColor>({ ...color })

  // 親コンポーネントからのcolorプロップが変更されたら、ローカルの状態を更新
  useEffect(() => {
    setLocalColor({ ...color })
  }, [color])

  const handleColorChange = (role: string, newValue: string) => {
    const updatedColor = { ...localColor }

    if (role === "main") {
      updatedColor.value = newValue
      updatedColor.contrastText = getBetterContrastColor(newValue)
    } else {
      if (!updatedColor.variations) {
        updatedColor.variations = {}
      }

      if (!updatedColor.variations[role]) {
        updatedColor.variations[role] = { value: newValue, contrastText: getBetterContrastColor(newValue) }
      } else {
        updatedColor.variations[role].value = newValue
        updatedColor.variations[role].contrastText = getBetterContrastColor(newValue)
      }
    }

    setLocalColor(updatedColor)
    onChange(updatedColor)
  }

  const getColorValue = (role: string) => {
    if (role === "main") {
      return localColor.value
    }

    if (localColor.variations && localColor.variations[role]) {
      return localColor.variations[role].value
    }

    // デフォルト値
    return localColor.value
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-4">{localColor.name} - 詳細調整</h3>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="main">メイン</TabsTrigger>
          <TabsTrigger value="light">ライト</TabsTrigger>
          <TabsTrigger value="lighter">ライター</TabsTrigger>
          <TabsTrigger value="dark">ダーク</TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="space-y-4">
          <Label>メインカラー</Label>
          <SimpleColorPicker
            index={0}
            name={localColor.name}
            color={getColorValue("main")}
            onColorChange={(value) => handleColorChange("main", value)}
            onNameChange={() => {}}
          />
          <div
            className="h-12 rounded-md flex items-center justify-center mt-2"
            style={{ backgroundColor: getColorValue("main"), color: localColor.contrastText }}
          >
            プレビュー
          </div>
        </TabsContent>

        <TabsContent value="light" className="space-y-4">
          <Label>ライトカラー</Label>
          <SimpleColorPicker
            index={0}
            name={`${localColor.name}-light`}
            color={getColorValue("light")}
            onColorChange={(value) => handleColorChange("light", value)}
            onNameChange={() => {}}
          />
          <div
            className="h-12 rounded-md flex items-center justify-center mt-2"
            style={{
              backgroundColor: getColorValue("light"),
              color: localColor.variations?.light?.contrastText || getBetterContrastColor(getColorValue("light")),
            }}
          >
            プレビュー
          </div>
        </TabsContent>

        <TabsContent value="lighter" className="space-y-4">
          <Label>ライターカラー</Label>
          <SimpleColorPicker
            index={0}
            name={`${localColor.name}-lighter`}
            color={getColorValue("lighter")}
            onColorChange={(value) => handleColorChange("lighter", value)}
            onNameChange={() => {}}
          />
          <div
            className="h-12 rounded-md flex items-center justify-center mt-2"
            style={{
              backgroundColor: getColorValue("lighter"),
              color: localColor.variations?.lighter?.contrastText || getBetterContrastColor(getColorValue("lighter")),
            }}
          >
            プレビュー
          </div>
        </TabsContent>

        <TabsContent value="dark" className="space-y-4">
          <Label>ダークカラー</Label>
          <SimpleColorPicker
            index={0}
            name={`${localColor.name}-dark`}
            color={getColorValue("dark")}
            onColorChange={(value) => handleColorChange("dark", value)}
            onNameChange={() => {}}
          />
          <div
            className="h-12 rounded-md flex items-center justify-center mt-2"
            style={{
              backgroundColor: getColorValue("dark"),
              color: localColor.variations?.dark?.contrastText || getBetterContrastColor(getColorValue("dark")),
            }}
          >
            プレビュー
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
