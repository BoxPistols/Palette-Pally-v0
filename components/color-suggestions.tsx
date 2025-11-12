"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { hexToHsl, hslToHex } from "@/lib/color-utils"

interface ColorSuggestionsProps {
  baseColor: string
  onSelectColor: (color: string) => void
}

export function ColorSuggestions({ baseColor, onSelectColor }: ColorSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  // 補色を生成
  const generateComplementary = (hex: string): string => {
    const hsl = hexToHsl(hex)
    if (!hsl) return hex

    // 色相を180度反転
    const newHue = (hsl.h + 180) % 360
    return hslToHex(newHue, hsl.s, hsl.l)
  }

  // 類似色を生成
  const generateAnalogous = (hex: string): string[] => {
    const hsl = hexToHsl(hex)
    if (!hsl) return [hex, hex]

    // 色相を±30度変化
    const hue1 = (hsl.h + 30) % 360
    const hue2 = (hsl.h + 330) % 360 // -30度と同じ

    return [hslToHex(hue1, hsl.s, hsl.l), hslToHex(hue2, hsl.s, hsl.l)]
  }

  // トライアド（三角形）の色を生成
  const generateTriadic = (hex: string): string[] => {
    const hsl = hexToHsl(hex)
    if (!hsl) return [hex, hex]

    // 色相を120度ずつ変化
    const hue1 = (hsl.h + 120) % 360
    const hue2 = (hsl.h + 240) % 360

    return [hslToHex(hue1, hsl.s, hsl.l), hslToHex(hue2, hsl.s, hsl.l)]
  }

  // スプリットコンプリメンタリー（分割補色）を生成
  const generateSplitComplementary = (hex: string): string[] => {
    const hsl = hexToHsl(hex)
    if (!hsl) return [hex, hex]

    // 補色の両側30度
    const baseComplement = (hsl.h + 180) % 360
    const hue1 = (baseComplement + 30) % 360
    const hue2 = (baseComplement - 30) % 360

    return [hslToHex(hue1, hsl.s, hsl.l), hslToHex(hue2, hsl.s, hsl.l)]
  }

  // モノクロマティック（単色）バリエーションを生成
  const generateMonochromatic = (hex: string): string[] => {
    const hsl = hexToHsl(hex)
    if (!hsl) return [hex, hex, hex, hex]

    // 明度を変化させる
    return [
      hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 30)),
      hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 15)),
      hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 15)),
      hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 30)),
    ]
  }

  // 彩度バリエーションを生成
  const generateSaturationVariations = (hex: string): string[] => {
    const hsl = hexToHsl(hex)
    if (!hsl) return [hex, hex, hex, hex]

    // 彩度を変化させる
    return [
      hslToHex(hsl.h, Math.max(0, hsl.s - 30), hsl.l),
      hslToHex(hsl.h, Math.max(0, hsl.s - 15), hsl.l),
      hslToHex(hsl.h, Math.min(100, hsl.s + 15), hsl.l),
      hslToHex(hsl.h, Math.min(100, hsl.s + 30), hsl.l),
    ]
  }

  const complementaryColor = generateComplementary(baseColor)
  const analogousColors = generateAnalogous(baseColor)
  const triadicColors = generateTriadic(baseColor)
  const splitComplementaryColors = generateSplitComplementary(baseColor)
  const monochromaticColors = generateMonochromatic(baseColor)
  const saturationVariations = generateSaturationVariations(baseColor)

  const handleSelectColor = (color: string) => {
    onSelectColor(color)
    setIsOpen(false)
  }

  return (
    <>
      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => setIsOpen(true)}>
        <Lightbulb className="h-3.5 w-3.5 mr-1" />
        サジェスト
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>カラーサジェスト</DialogTitle>
            <DialogDescription>選択した色に基づいた調和のとれたカラーの提案</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="harmony" className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="harmony">カラーハーモニー</TabsTrigger>
              <TabsTrigger value="variations">バリエーション</TabsTrigger>
              <TabsTrigger value="palettes">パレット例</TabsTrigger>
            </TabsList>

            <TabsContent value="harmony" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">補色</h3>
                <div className="flex gap-2">
                  <div
                    className="w-12 h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                    style={{ backgroundColor: baseColor }}
                    onClick={() => handleSelectColor(baseColor)}
                  />
                  <div
                    className="w-12 h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                    style={{ backgroundColor: complementaryColor }}
                    onClick={() => handleSelectColor(complementaryColor)}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">類似色</h3>
                <div className="flex gap-2">
                  <div
                    className="w-12 h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                    style={{ backgroundColor: analogousColors[0] }}
                    onClick={() => handleSelectColor(analogousColors[0])}
                  />
                  <div
                    className="w-12 h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                    style={{ backgroundColor: baseColor }}
                    onClick={() => handleSelectColor(baseColor)}
                  />
                  <div
                    className="w-12 h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                    style={{ backgroundColor: analogousColors[1] }}
                    onClick={() => handleSelectColor(analogousColors[1])}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">トライアド（三角形）</h3>
                <div className="flex gap-2">
                  <div
                    className="w-12 h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                    style={{ backgroundColor: baseColor }}
                    onClick={() => handleSelectColor(baseColor)}
                  />
                  <div
                    className="w-12 h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                    style={{ backgroundColor: triadicColors[0] }}
                    onClick={() => handleSelectColor(triadicColors[0])}
                  />
                  <div
                    className="w-12 h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                    style={{ backgroundColor: triadicColors[1] }}
                    onClick={() => handleSelectColor(triadicColors[1])}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">分割補色</h3>
                <div className="flex gap-2">
                  <div
                    className="w-12 h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                    style={{ backgroundColor: baseColor }}
                    onClick={() => handleSelectColor(baseColor)}
                  />
                  <div
                    className="w-12 h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                    style={{ backgroundColor: splitComplementaryColors[0] }}
                    onClick={() => handleSelectColor(splitComplementaryColors[0])}
                  />
                  <div
                    className="w-12 h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                    style={{ backgroundColor: splitComplementaryColors[1] }}
                    onClick={() => handleSelectColor(splitComplementaryColors[1])}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="variations" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">モノクロマティック（明度変化）</h3>
                <div className="flex gap-2">
                  {monochromaticColors.map((color, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                      style={{ backgroundColor: color }}
                      onClick={() => handleSelectColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">彩度バリエーション</h3>
                <div className="flex gap-2">
                  {saturationVariations.map((color, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                      style={{ backgroundColor: color }}
                      onClick={() => handleSelectColor(color)}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="palettes" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">モノクロマティックパレット</h3>
                <div className="flex gap-2">
                  <div
                    className="w-full h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                    style={{
                      background: `linear-gradient(to right, ${monochromaticColors[0]}, ${monochromaticColors[1]}, ${baseColor}, ${monochromaticColors[2]}, ${monochromaticColors[3]})`,
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">補色パレット</h3>
                <div className="flex gap-2">
                  <div
                    className="w-full h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                    style={{
                      background: `linear-gradient(to right, ${baseColor}, ${complementaryColor})`,
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">トライアドパレット</h3>
                <div className="flex gap-2">
                  <div
                    className="w-full h-12 rounded-md cursor-pointer border border-gray-200 shadow-sm"
                    style={{
                      background: `linear-gradient(to right, ${baseColor}, ${triadicColors[0]}, ${triadicColors[1]})`,
                    }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>閉じる</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
