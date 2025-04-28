"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { HexColorPicker } from "react-colorful"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GripVertical } from "lucide-react"
import {
  hexToRgb,
  rgbToHex,
  hexToHsl,
  hslToHex,
  hexToOklab,
  oklabToHex,
  calculateContrastRatio,
  getWCAGLevel,
  getBetterContrastColor,
} from "@/lib/color-utils"
import { ColorSuggestions } from "@/components/color-suggestions"
import { Badge } from "@/components/ui/badge"
import type { ColorRole } from "@/types/palette"
import { colorRoleDescriptions } from "@/types/palette"

interface ColorPickerProps {
  index: number
  name: string
  color: string
  isPrimary?: boolean
  onColorChange: (color: string) => void
  onNameChange: (name: string) => void
  onSetAsPrimary?: () => void
  dragHandleProps?: any
  colorRole?: ColorRole
}

// HexColorPickerコンポーネントをラップして、マウスイベントの伝播を停止させる部分を追加
const handlePickerMouseDown = (e: React.MouseEvent) => {
  // カラーピッカー操作中はドラッグイベントが親に伝播しないようにする
  e.stopPropagation()
}

export function ColorPicker({
  index,
  name,
  color,
  isPrimary = false,
  onColorChange,
  onNameChange,
  onSetAsPrimary,
  dragHandleProps,
  colorRole,
}: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(color)
  const [nameValue, setNameValue] = useState(name)
  const [rgbValues, setRgbValues] = useState({ r: 0, g: 0, b: 0 })
  const [hslValues, setHslValues] = useState({ h: 0, s: 0, l: 0 })
  const [oklabValues, setOklabValues] = useState({ l: 0, a: 0, b: 0 })

  useEffect(() => {
    setInputValue(color)
    updateColorValues(color)
  }, [color])

  useEffect(() => {
    setNameValue(name)
  }, [name])

  const updateColorValues = (hexColor: string) => {
    const rgb = hexToRgb(hexColor)
    if (rgb) {
      setRgbValues(rgb)
    }

    const hsl = hexToHsl(hexColor)
    if (hsl) {
      setHslValues(hsl)
    }

    const oklab = hexToOklab(hexColor)
    if (oklab) {
      setOklabValues(oklab)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Validate hex color
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      onColorChange(value)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNameValue(value)
    onNameChange(value)
  }

  const handlePickerChange = (newColor: string) => {
    setInputValue(newColor)
    onColorChange(newColor)
  }

  const getContrastInfo = (bgColor: string) => {
    // 白と黒のコントラスト比を計算
    const whiteContrast = calculateContrastRatio(bgColor, "#FFFFFF")
    const blackContrast = calculateContrastRatio(bgColor, "#000000")

    // 最適なコントラスト比を選択
    const bestContrast = Math.max(whiteContrast, blackContrast)
    const bestContrastColor = getBetterContrastColor(bgColor)

    // WCAGレベルを判定
    const wcagLevel = getWCAGLevel(bestContrast)

    return {
      contrast: bestContrast,
      level: wcagLevel.level,
      textColor: bestContrastColor,
    }
  }

  const handleRgbChange = (channel: "r" | "g" | "b", value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 255) {
      const newRgb = { ...rgbValues, [channel]: numValue }
      const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
      setRgbValues(newRgb)
      setInputValue(newHex)
      onColorChange(newHex)
    }
  }

  const handleHslChange = (channel: "h" | "s" | "l", value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      // Apply appropriate limits based on the channel
      let validValue = numValue
      if (channel === "h") {
        validValue = Math.max(0, Math.min(360, numValue))
      } else {
        validValue = Math.max(0, Math.min(100, numValue))
      }

      const newHsl = { ...hslValues, [channel]: validValue }
      const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l)
      setHslValues(newHsl)
      setInputValue(newHex)
      onColorChange(newHex)
    }
  }

  const handleOklabChange = (channel: "l" | "a" | "b", value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      // Apply appropriate limits based on the channel
      let validValue = numValue
      if (channel === "l") {
        // Lightness in Oklab is typically between 0 and 1
        validValue = Math.max(0, Math.min(1, numValue))
      } else if (channel === "a" || channel === "b") {
        // a and b channels can be negative or positive, typically between -0.4 and 0.4
        validValue = Math.max(-0.4, Math.min(0.4, numValue))
      }

      const newOklab = { ...oklabValues, [channel]: validValue }
      try {
        const newHex = oklabToHex(newOklab.l, newOklab.a, newOklab.b)
        setOklabValues(newOklab)
        setInputValue(newHex)
        onColorChange(newHex)
      } catch (error) {
        console.error("Error converting Oklab to hex:", error)
      }
    }
  }

  const handleBlur = () => {
    // Ensure color is valid on blur
    if (!/^#[0-9A-F]{6}$/i.test(inputValue)) {
      setInputValue(color)
    }
  }

  // カラーロールに基づいたバッジの色を設定
  const getRoleBadgeClass = (role?: ColorRole): string => {
    if (!role) return "bg-gray-50 text-gray-500"

    switch (role) {
      case "primary":
        return "bg-blue-50 text-blue-700"
      case "secondary":
        return "bg-purple-50 text-purple-700"
      case "success":
        return "bg-green-50 text-green-700"
      case "danger":
        return "bg-red-50 text-red-700"
      case "warning":
        return "bg-amber-50 text-amber-700"
      case "info":
        return "bg-sky-50 text-sky-700"
      case "text":
        return "bg-gray-50 text-gray-700"
      case "background":
        return "bg-slate-50 text-slate-700"
      case "border":
        return "bg-zinc-50 text-zinc-700"
      case "accent":
        return "bg-pink-50 text-pink-700"
      case "neutral":
        return "bg-stone-50 text-stone-700"
      default:
        return "bg-gray-50 text-gray-500"
    }
  }

  // カラーロールの表示名を取得
  const getRoleDisplayName = (role?: ColorRole): string => {
    if (!role) return ""
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  return (
    <Card className={`overflow-hidden ${isPrimary ? "ring-1 ring-gray-300" : ""}`}>
      <CardHeader className="pb-2 px-3 pt-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="cursor-move" {...dragHandleProps}>
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            value={nameValue}
            onChange={handleNameChange}
            className="font-medium text-sm h-8"
            placeholder={`color${index + 1}`}
          />
        </div>
        <div className="flex gap-1">
          {isPrimary && (
            <Badge variant="outline" className="ml-2 bg-gray-50 text-gray-500">
              Primary
            </Badge>
          )}
          {colorRole && colorRole !== "primary" && (
            <Badge
              variant="outline"
              className={`ml-2 ${getRoleBadgeClass(colorRole)}`}
              title={colorRoleDescriptions[colorRole]}
            >
              {getRoleDisplayName(colorRole)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="text-sm h-8"
            placeholder="カラーコード"
          />
        </div>

        <div onMouseDown={handlePickerMouseDown}>
          <HexColorPicker color={color} onChange={handlePickerChange} className="w-full" />
        </div>

        <div className="flex justify-between items-center mt-1 mb-1">
          <ColorSuggestions baseColor={color} onSelectColor={onColorChange} />
          {(() => {
            const { contrast, level } = getContrastInfo(color)

            // レベルに応じたバッジの色を設定
            const levelColor =
              level === "AAA"
                ? "bg-green-100 text-green-800"
                : level === "AA"
                  ? "bg-blue-100 text-blue-800"
                  : level === "A"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"

            return (
              <>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${levelColor}`} title="アクセシビリティレベル">
                  {level}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800"
                  title="コントラスト比"
                >
                  {contrast.toFixed(1)}:1
                </span>
              </>
            )
          })()}
        </div>

        <Tabs defaultValue="rgb" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="rgb">RGB</TabsTrigger>
            <TabsTrigger value="hsl">HSL</TabsTrigger>
            <TabsTrigger value="oklab">Oklab</TabsTrigger>
          </TabsList>

          <TabsContent value="rgb" className="mt-2">
            <div className="grid grid-cols-3 gap-1">
              <div>
                <label className="text-xs text-gray-500 block">R</label>
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={rgbValues.r}
                  onChange={(e) => handleRgbChange("r", e.target.value)}
                  className="text-xs h-7"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block">G</label>
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={rgbValues.g}
                  onChange={(e) => handleRgbChange("g", e.target.value)}
                  className="text-xs h-7"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block">B</label>
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={rgbValues.b}
                  onChange={(e) => handleRgbChange("b", e.target.value)}
                  className="text-xs h-7"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hsl" className="mt-2">
            <div className="grid grid-cols-3 gap-1">
              <div>
                <label className="text-xs text-gray-500 block">H</label>
                <Input
                  type="number"
                  min="0"
                  max="360"
                  value={Math.round(hslValues.h)}
                  onChange={(e) => handleHslChange("h", e.target.value)}
                  className="text-xs h-7"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block">S (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={Math.round(hslValues.s)}
                  onChange={(e) => handleHslChange("s", e.target.value)}
                  className="text-xs h-7"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block">L (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={Math.round(hslValues.l)}
                  onChange={(e) => handleHslChange("l", e.target.value)}
                  className="text-xs h-7"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="oklab" className="mt-2">
            <div className="grid grid-cols-3 gap-1">
              <div>
                <label className="text-xs text-gray-500 block">L</label>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={oklabValues.l.toFixed(2)}
                  onChange={(e) => handleOklabChange("l", e.target.value)}
                  className="text-xs h-7"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block">a</label>
                <Input
                  type="number"
                  min="-0.4"
                  max="0.4"
                  step="0.01"
                  value={oklabValues.a.toFixed(2)}
                  onChange={(e) => handleOklabChange("a", e.target.value)}
                  className="text-xs h-7"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block">b</label>
                <Input
                  type="number"
                  min="-0.4"
                  max="0.4"
                  step="0.01"
                  value={oklabValues.b.toFixed(2)}
                  onChange={(e) => handleOklabChange("b", e.target.value)}
                  className="text-xs h-7"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
