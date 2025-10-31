"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { HexColorPicker } from "react-colorful"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import {
  hexToRgb,
  rgbToHex,
  hexToHsl,
  hslToHex,
  hexToOklab,
  calculateContrastRatio,
  getWCAGLevel,
  getBetterContrastColor,
} from "@/lib/color-utils"
import type { MUIColorData } from "@/types/palette"

interface MUIColorPickerProps {
  colorData: MUIColorData
  onColorChange: (color: string) => void
  onDelete?: () => void
  onNameChange?: (name: string) => void
}

export function MUIColorPicker({ colorData, onColorChange, onDelete, onNameChange }: MUIColorPickerProps) {
  const [inputValue, setInputValue] = useState(colorData.main)
  const [nameValue, setNameValue] = useState(colorData.name)
  const [rgbValues, setRgbValues] = useState({ r: 0, g: 0, b: 0 })
  const [hslValues, setHslValues] = useState({ h: 0, s: 0, l: 0 })
  const [oklabValues, setOklabValues] = useState({ l: 0, a: 0, b: 0 })

  useEffect(() => {
    setInputValue(colorData.main)
    updateColorValues(colorData.main)
  }, [colorData.main])

  useEffect(() => {
    setNameValue(colorData.name)
  }, [colorData.name])

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

    if (/^#[0-9A-F]{6}$/i.test(value)) {
      onColorChange(value)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNameValue(value)
    if (onNameChange) {
      onNameChange(value)
    }
  }

  const handlePickerChange = (newColor: string) => {
    setInputValue(newColor)
    onColorChange(newColor)
  }

  const getContrastInfo = (bgColor: string) => {
    const whiteContrast = calculateContrastRatio(bgColor, "#FFFFFF")
    const blackContrast = calculateContrastRatio(bgColor, "#000000")
    const bestContrast = Math.max(whiteContrast, blackContrast)
    const bestContrastColor = getBetterContrastColor(bgColor)
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

  const handleBlur = () => {
    if (!/^#[0-9A-F]{6}$/i.test(inputValue)) {
      setInputValue(colorData.main)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 px-3 pt-3">
        <div className="flex items-center justify-between gap-2">
          <Input
            value={nameValue}
            onChange={handleNameChange}
            className="font-semibold text-sm h-8 flex-1"
            placeholder="Color name"
          />
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
              {colorData.type}
            </Badge>
            {!colorData.isDefault && onDelete && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDelete} title="Delete color">
                <Trash2 className="h-3.5 w-3.5 text-red-500" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="text-sm h-8"
            placeholder="Main color"
          />
        </div>

        <HexColorPicker color={colorData.main} onChange={handlePickerChange} className="w-full" />

        <div className="flex justify-between items-center mt-1 mb-1">
          {(() => {
            const { contrast, level } = getContrastInfo(colorData.main)

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
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${levelColor}`} title="WCAG Level">
                  {level}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800"
                  title="Contrast Ratio"
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
                <Input type="text" value={oklabValues.l.toFixed(2)} readOnly className="text-xs h-7" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block">a</label>
                <Input type="text" value={oklabValues.a.toFixed(2)} readOnly className="text-xs h-7" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block">b</label>
                <Input type="text" value={oklabValues.b.toFixed(2)} readOnly className="text-xs h-7" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
