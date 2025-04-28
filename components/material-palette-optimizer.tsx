"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { materialColors, findClosestMaterialColor } from "@/lib/color-systems"
import type { ColorData } from "@/types/palette"

interface MaterialPaletteOptimizerProps {
  colors: ColorData[]
  primaryColorIndex: number
  onOptimize: (newColors: ColorData[]) => void
}

export function MaterialPaletteOptimizer({ colors, primaryColorIndex, onOptimize }: MaterialPaletteOptimizerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [primaryColor, setPrimaryColor] = useState<string>("blue")
  const [secondaryColor, setSecondaryColor] = useState<string>("purple")
  const [errorColor, setErrorColor] = useState<string>("red")

  const handleOptimize = () => {
    // 現在のプライマリカラーを取得
    const currentPrimaryColor = colors[primaryColorIndex].value

    // 新しいカラーパレットを生成
    const newColors = [...colors]

    // プライマリカラーを設定（現在のプライマリカラーに最も近い選択されたマテリアルカラーの500シェード）
    const primaryHex = materialColors[primaryColor][500]
    newColors[primaryColorIndex] = { ...newColors[primaryColorIndex], value: primaryHex }

    // セカンダリカラーを設定（2番目のカラーまたは新しいカラー）
    const secondaryIndex = primaryColorIndex === 0 ? 1 : 0
    if (secondaryIndex < newColors.length) {
      const secondaryHex = materialColors[secondaryColor][500]
      newColors[secondaryIndex] = { ...newColors[secondaryIndex], value: secondaryHex }
    }

    // エラーカラーを設定（3番目のカラーまたは新しいカラー）
    const errorIndex =
      primaryColorIndex !== 2 && secondaryIndex !== 2 ? 2 : primaryColorIndex !== 3 && secondaryIndex !== 3 ? 3 : -1
    if (errorIndex >= 0 && errorIndex < newColors.length) {
      const errorHex = materialColors[errorColor][500]
      newColors[errorIndex] = { ...newColors[errorIndex], value: errorHex }
    }

    // 残りのカラーをMaterial Designパレットから選択
    const usedColors = new Set([primaryColor, secondaryColor, errorColor])
    let colorIndex = 0

    for (let i = 0; i < newColors.length; i++) {
      if (i !== primaryColorIndex && i !== secondaryIndex && i !== errorIndex) {
        // 使用されていないマテリアルカラーを見つける
        const availableColors = Object.keys(materialColors).filter((color) => !usedColors.has(color))

        if (availableColors.length > 0) {
          const nextColor = availableColors[colorIndex % availableColors.length]
          usedColors.add(nextColor)
          colorIndex++

          const colorHex = materialColors[nextColor][500]
          newColors[i] = { ...newColors[i], value: colorHex }
        }
      }
    }

    // 変更を適用
    onOptimize(newColors)
    setIsOpen(false)

    toast({
      title: "Material Designパレット適用",
      description: "Material Designに基づいたカラーパレットを生成しました",
    })
  }

  // 現在のプライマリカラーに最も近いマテリアルカラーを初期選択
  const initializeClosestColors = () => {
    if (colors.length > 0) {
      const primaryHex = colors[primaryColorIndex].value
      const closestPrimary = findClosestMaterialColor(primaryHex)
      setPrimaryColor(closestPrimary.color)

      // セカンダリカラーの初期化
      const secondaryIndex = primaryColorIndex === 0 ? 1 : 0
      if (secondaryIndex < colors.length) {
        const secondaryHex = colors[secondaryIndex].value
        const closestSecondary = findClosestMaterialColor(secondaryHex)
        setSecondaryColor(closestSecondary.color)
      }

      // エラーカラーの初期化
      const errorIndex =
        primaryColorIndex !== 2 && secondaryIndex !== 2 ? 2 : primaryColorIndex !== 3 && secondaryIndex !== 3 ? 3 : -1
      if (errorIndex >= 0 && errorIndex < colors.length) {
        const errorHex = colors[errorIndex].value
        const closestError = findClosestMaterialColor(errorHex)
        setErrorColor(closestError.color)
      } else {
        setErrorColor("red") // デフォルト
      }
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => {
          initializeClosestColors()
          setIsOpen(true)
        }}
      >
        <Wand2 className="h-4 w-4" />
        <span>Material Design</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Material Designパレット</DialogTitle>
            <DialogDescription>Material Designのカラーシステムに基づいたパレットを生成します</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="primary-color">プライマリカラー</Label>
                <Select value={primaryColor} onValueChange={setPrimaryColor}>
                  <SelectTrigger id="primary-color">
                    <SelectValue placeholder="カラーを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(materialColors).map(([color, shades]) => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: shades[500] }} />
                          <span>{color}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-1 h-6 rounded" style={{ backgroundColor: materialColors[primaryColor][500] }} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="secondary-color">セカンダリカラー</Label>
                <Select value={secondaryColor} onValueChange={setSecondaryColor}>
                  <SelectTrigger id="secondary-color">
                    <SelectValue placeholder="カラーを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(materialColors).map(([color, shades]) => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: shades[500] }} />
                          <span>{color}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-1 h-6 rounded" style={{ backgroundColor: materialColors[secondaryColor][500] }} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="error-color">エラーカラー</Label>
                <Select value={errorColor} onValueChange={setErrorColor}>
                  <SelectTrigger id="error-color">
                    <SelectValue placeholder="カラーを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(materialColors).map(([color, shades]) => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: shades[500] }} />
                          <span>{color}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-1 h-6 rounded" style={{ backgroundColor: materialColors[errorColor][500] }} />
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                Material Designでは、プライマリカラーとセカンダリカラーを中心に一貫性のあるカラーシステムを構築します。
                エラーカラーは通常赤系統の色が使用されます。
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleOptimize}>適用</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
