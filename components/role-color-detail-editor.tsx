"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimpleColorPicker } from "./simple-color-picker"
import { getContrastText } from "@/lib/color-utils"
import type { PaletteColor } from "@/types/palette"

interface RoleColorDetailEditorProps {
  color: PaletteColor
  onChange: (updatedColor: PaletteColor) => void
}

export function RoleColorDetailEditor({ color, onChange }: RoleColorDetailEditorProps) {
  const [activeTab, setActiveTab] = useState("main")

  const handleColorChange = (role: string, newValue: string) => {
    const updatedColor = { ...color }

    if (role === "main") {
      updatedColor.value = newValue
      updatedColor.contrastText = getContrastText(newValue)
    } else {
      if (!updatedColor.variations) {
        updatedColor.variations = {}
      }

      if (!updatedColor.variations[role]) {
        updatedColor.variations[role] = { value: newValue, contrastText: getContrastText(newValue) }
      } else {
        updatedColor.variations[role].value = newValue
        updatedColor.variations[role].contrastText = getContrastText(newValue)
      }
    }

    onChange(updatedColor)
  }

  const getColorValue = (role: string) => {
    if (role === "main") {
      return color.value
    }

    if (color.variations && color.variations[role]) {
      return color.variations[role].value
    }

    // デフォルト値
    return color.value
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-4">{color.name} - 詳細調整</h3>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="main">メイン</TabsTrigger>
          <TabsTrigger value="light">ライト</TabsTrigger>
          <TabsTrigger value="lighter">ライター</TabsTrigger>
          <TabsTrigger value="dark">ダーク</TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="space-y-4">
          <Label>メインカラー</Label>
          <SimpleColorPicker color={getColorValue("main")} onChange={(value) => handleColorChange("main", value)} />
          <div
            className="h-12 rounded-md flex items-center justify-center mt-2"
            style={{ backgroundColor: getColorValue("main"), color: color.contrastText }}
          >
            プレビュー
          </div>
        </TabsContent>

        <TabsContent value="light" className="space-y-4">
          <Label>ライトカラー</Label>
          <SimpleColorPicker color={getColorValue("light")} onChange={(value) => handleColorChange("light", value)} />
          <div
            className="h-12 rounded-md flex items-center justify-center mt-2"
            style={{
              backgroundColor: getColorValue("light"),
              color: color.variations?.light?.contrastText || getContrastText(getColorValue("light")),
            }}
          >
            プレビュー
          </div>
        </TabsContent>

        <TabsContent value="lighter" className="space-y-4">
          <Label>ライターカラー</Label>
          <SimpleColorPicker
            color={getColorValue("lighter")}
            onChange={(value) => handleColorChange("lighter", value)}
          />
          <div
            className="h-12 rounded-md flex items-center justify-center mt-2"
            style={{
              backgroundColor: getColorValue("lighter"),
              color: color.variations?.lighter?.contrastText || getContrastText(getColorValue("lighter")),
            }}
          >
            プレビュー
          </div>
        </TabsContent>

        <TabsContent value="dark" className="space-y-4">
          <Label>ダークカラー</Label>
          <SimpleColorPicker color={getColorValue("dark")} onChange={(value) => handleColorChange("dark", value)} />
          <div
            className="h-12 rounded-md flex items-center justify-center mt-2"
            style={{
              backgroundColor: getColorValue("dark"),
              color: color.variations?.dark?.contrastText || getContrastText(getColorValue("dark")),
            }}
          >
            プレビュー
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
