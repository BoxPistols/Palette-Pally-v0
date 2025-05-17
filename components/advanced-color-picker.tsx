// components/advanced-color-picker.tsx
"use client"

import React, { useState, useEffect } from "react"
import { HexColorPicker } from "react-colorful"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { hexToOklab, oklabToHex, adjustColorInOklab } from "@/lib/color-utils"

interface AdvancedColorPickerProps {
  index: number
  name: string
  color: string
  onColorChange: (value: string) => void
  onNameChange: (name: string) => void
}

export function AdvancedColorPicker({
  index,
  name,
  color,
  onColorChange,
  onNameChange
}: AdvancedColorPickerProps) {
  const [localName, setLocalName] = useState(name)
  const [hexValue, setHexValue] = useState(color)

  // OKLABの値を保持する状態
  const [oklabValues, setOklabValues] = useState({
    lightness: 50,
    chroma: 0,
    hue: 0
  })

  // 色が変更されたときにOKLABの値を更新
  useEffect(() => {
    const oklab = hexToOklab(color)
    if (!oklab) return

    const chroma = Math.sqrt(oklab.a * oklab.a + oklab.b * oklab.b)
    let hue = Math.atan2(oklab.b, oklab.a) * 180 / Math.PI
    if (hue < 0) hue += 360

    setOklabValues({
      lightness: Math.round(oklab.l * 100),
      chroma: Math.round(chroma * 100),
      hue: Math.round(hue)
    })

    // HEX値も同期
    setHexValue(color)
  }, [color])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setLocalName(newName)
    onNameChange(newName)
  }

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setHexValue(`#${value}`)

    // 有効なHEX値の場合のみ親に通知
    if (/^#?[0-9A-F]{6}$/i.test(`#${value}`)) {
      onColorChange(`#${value}`)
    }
  }

  const handlePickerChange = (newColor: string) => {
    setHexValue(newColor)
    onColorChange(newColor)
  }

  // Oklabパラメーターの数値入力処理
  const handleOklabNumberInput = (type: 'lightness' | 'chroma' | 'hue', value: string) => {
    const numValue = parseInt(value, 10)
    if (isNaN(numValue)) return

    // 各パラメータの範囲をチェック
    let validValue: number
    switch (type) {
      case 'lightness':
        validValue = Math.min(100, Math.max(0, numValue))
        break
      case 'chroma':
        validValue = Math.min(100, Math.max(0, numValue))
        break
      case 'hue':
        validValue = Math.min(359, Math.max(0, numValue))
        break
      default:
        return
    }

    // 状態を更新
    setOklabValues({
      ...oklabValues,
      [type]: validValue
    })

    // 色を更新
    updateColorFromOklab(type, validValue)
  }

  // Oklab値からの色更新
  const updateColorFromOklab = (type: 'lightness' | 'chroma' | 'hue', value: number) => {
    const oklab = hexToOklab(color)
    if (!oklab) return

    let newColor
    switch (type) {
      case 'lightness':
        // 現在のカラーから明度だけを変更
        newColor = adjustColorInOklab(color, { lightnessDelta: (value - oklabValues.lightness) / 100 })
        break
      case 'chroma':
        // 彩度の調整
        const chromaMultiplier = value / oklabValues.chroma || 1
        newColor = adjustColorInOklab(color, { chromaDelta: chromaMultiplier })
        break
      case 'hue':
        // 色相の調整
        const hueDelta = value - oklabValues.hue
        newColor = adjustColorInOklab(color, { hueDelta })
        break
    }
    onColorChange(newColor)
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col">
        <div className="p-3 rounded-t-lg" style={{ backgroundColor: color }}>
          <div className="h-10 flex items-center gap-2">
            <Input
              value={localName}
              onChange={handleInputChange}
              className="h-8 bg-white/80 backdrop-blur-sm text-black"
            />
          </div>
        </div>

        <div className="p-3 space-y-2">
          <HexColorPicker color={color} onChange={handlePickerChange} className="w-full" />

          <div className="flex justify-between items-center pt-2">
            <span># </span>
            <Input
              value={hexValue.replace('#', '')}
              onChange={handleHexInputChange}
              maxLength={6}
              className="font-mono h-8"
            />
          </div>

          {/* Oklab 明度スライダーと数値入力 */}
          <div className="space-y-1 pt-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs">明度 (Oklab)</Label>
              <div className="flex items-center gap-1">
                <Input
                  value={oklabValues.lightness}
                  onChange={(e) => handleOklabNumberInput('lightness', e.target.value)}
                  className="w-16 h-7 text-xs"
                  type="number"
                  min={0}
                  max={100}
                />
                <span className="text-xs">%</span>
              </div>
            </div>
            <Slider
              value={[oklabValues.lightness]}
              min={0}
              max={100}
              step={1}
              onValueChange={(v) => handleOklabNumberInput('lightness', v[0].toString())}
              className="w-full slider-gray"
            />
          </div>

          {/* Oklab 彩度スライダーと数値入力 */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label className="text-xs">彩度</Label>
              <div className="flex items-center gap-1">
                <Input
                  value={oklabValues.chroma}
                  onChange={(e) => handleOklabNumberInput('chroma', e.target.value)}
                  className="w-16 h-7 text-xs"
                  type="number"
                  min={0}
                  max={100}
                />
                <span className="text-xs">%</span>
              </div>
            </div>
            <Slider
              value={[oklabValues.chroma]}
              min={0}
              max={100}
              step={1}
              onValueChange={(v) => handleOklabNumberInput('chroma', v[0].toString())}
              className="w-full slider-gray"
            />
          </div>

          {/* Oklab 色相スライダーと数値入力 */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label className="text-xs">色相</Label>
              <div className="flex items-center gap-1">
                <Input
                  value={oklabValues.hue}
                  onChange={(e) => handleOklabNumberInput('hue', e.target.value)}
                  className="w-16 h-7 text-xs"
                  type="number"
                  min={0}
                  max={359}
                />
                <span className="text-xs">°</span>
              </div>
            </div>
            <Slider
              value={[oklabValues.hue]}
              min={0}
              max={359}
              step={1}
              onValueChange={(v) => handleOklabNumberInput('hue', v[0].toString())}
              className="w-full slider-gray"
              aria-label="色相スライダー"
              aria-valuenow={oklabValues.hue}
              aria-valuemin={0}
              aria-valuemax={359}
              aria-valuetext={`${oklabValues.hue}°`}
              aria-orientation="horizontal"
              role="slider"
              tabIndex={0}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
            <span>OKLCH: {oklabValues.lightness}% {oklabValues.chroma}% {oklabValues.hue}°</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800" title="コントラスト比">
              {Math.abs(0.5 - oklabValues.lightness / 100) > 0.3 ? "OK" : "!"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}