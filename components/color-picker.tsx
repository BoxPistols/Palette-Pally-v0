"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { HexColorPicker } from "react-colorful"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { hexToRgb, rgbToHex, hexToHsl, hslToHex, hexToOklab } from "@/lib/color-utils"

interface ColorPickerProps {
  index: number
  name: string
  color: string
  onColorChange: (color: string) => void
  onNameChange: (name: string) => void
}

export function ColorPicker({ index, name, color, onColorChange, onNameChange }: ColorPickerProps) {
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

  const handleBlur = () => {
    // Ensure color is valid on blur
    if (!/^#[0-9A-F]{6}$/i.test(inputValue)) {
      setInputValue(color)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 px-3 pt-3">
        <Input
          value={nameValue}
          onChange={handleNameChange}
          className="font-medium text-sm h-8"
          placeholder={`color${index + 1}`}
        />
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

        <HexColorPicker color={color} onChange={handlePickerChange} className="w-full" />

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
