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
import { tailwindColors, findClosestTailwindColor } from "@/lib/color-systems"
import type { ColorData } from "@/types/palette"

interface TailwindPaletteOptimizerProps {
  colors: ColorData[]
  primaryColorIndex: number
  onOptimize: (newColors: ColorData[]) => void
}

export function TailwindPaletteOptimizer({ colors, primaryColorIndex, onOptimize }: TailwindPaletteOptimizerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [primaryColor, setPrimaryColor] = useState<string>("blue")
  const [primaryShade, setPrimaryShade] = useState<string>("500")
  const [secondaryColor, setSecondaryColor] = useState<string>("indigo")
  const [secondaryShade, setSecondaryShade] = useState<string>("500")
  const [accentColor, setAccentColor] = useState<string>("pink")
  const [accentShade, setAccentShade] = useState<string>("500")

  const handleOptimize = () => {
    // 新しいカラーパレットを生成
    const newColors = [...colors]

    // プライマリカラーを設定
    const primaryHex = tailwindColors[primaryColor][primaryShade]
    newColors[primaryColorIndex] = { ...newColors[primaryColorIndex], value: primaryHex }

    // セカンダリカラーを設定（2番目のカラーまたは新しいカラー）
    const secondaryIndex = primaryColorIndex === 0 ? 1 : 0
    if (secondaryIndex < newColors.length) {
      const secondaryHex = tailwindColors[secondaryColor][secondaryShade]
      newColors[secondaryIndex] = { ...newColors[secondaryIndex], value: secondaryHex }
    }

    // アクセントカラーを設定（3番目のカラーまたは新しいカラー）
    const accentIndex =
      primaryColorIndex !== 2 && secondaryIndex !== 2 ? 2 : primaryColorIndex !== 3 && secondaryIndex !== 3 ? 3 : -1
    if (accentIndex >= 0 && accentIndex < newColors.length) {
      const accentHex = tailwindColors[accentColor][accentShade]
      newColors[accentIndex] = { ...newColors[accentIndex], value: accentHex }
    }

    // 残りのカラーをTailwindパレットから選択
    const usedColors = new Set([primaryColor, secondaryColor, accentColor])
    let colorIndex = 0

    for (let i = 0; i < newColors.length; i++) {
      if (i !== primaryColorIndex && i !== secondaryIndex && i !== accentIndex) {
        // 使用されていないTailwindカラーを見つける
        const availableColors = Object.keys(tailwindColors).filter((color) => !usedColors.has(color))

        if (availableColors.length > 0) {
          const nextColor = availableColors[colorIndex % availableColors.length]
          usedColors.add(nextColor)
          colorIndex++

          const colorHex = tailwindColors[nextColor]["500"] // 標準的な500シェードを使用
          newColors[i] = { ...newColors[i], value: colorHex }
        }
      }
    }

    // 変更を適用
    onOptimize(newColors)
    setIsOpen(false)

    toast({
      title: "Tailwindパレット適用",
      description: "Tailwind CSSに基づいたカラーパレットを生成しました",
    })
  }

  // 現在のプライマリカラーに最も近いTailwindカラーを初期選択
  const initializeClosestColors = () => {
    if (colors.length > 0) {
      const primaryHex = colors[primaryColorIndex].value
      const closestPrimary = findClosestTailwindColor(primaryHex)
      setPrimaryColor(closestPrimary.color)
      setPrimaryShade(closestPrimary.shade)

      // セカンダリカラーの初期化
      const secondaryIndex = primaryColorIndex === 0 ? 1 : 0
      if (secondaryIndex < colors.length) {
        const secondaryHex = colors[secondaryIndex].value
        const closestSecondary = findClosestTailwindColor(secondaryHex)
        setSecondaryColor(closestSecondary.color)
        setSecondaryShade(closestSecondary.shade)
      }

      // アクセントカラーの初期化
      const accentIndex =
        primaryColorIndex !== 2 && secondaryIndex !== 2 ? 2 : primaryColorIndex !== 3 && secondaryIndex !== 3 ? 3 : -1
      if (accentIndex >= 0 && accentIndex < colors.length) {
        const accentHex = colors[accentIndex].value
        const closestAccent = findClosestTailwindColor(accentHex)
        setAccentColor(closestAccent.color)
        setAccentShade(closestAccent.shade)
      }
    }
  }

  // シェードの選択肢
  const shadeOptions = Object.keys(tailwindColors.blue).sort((a, b) => {
    // 数値シェードを数値順にソート
    if (!isNaN(Number(a)) && !isNaN(Number(b))) {
      return Number(a) - Number(b)
    }
    // A100などのアクセントカラーは後ろに
    return a.localeCompare(b)
  })

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
        <span>Tailwind CSS</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tailwindパレット</DialogTitle>
            <DialogDescription>Tailwind CSSのカラーシステムに基づいたパレットを生成します</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>プライマリカラー</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={primaryColor} onValueChange={setPrimaryColor}>
                    <SelectTrigger>
                      <SelectValue placeholder="カラーを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(tailwindColors).map(([color, shades]) => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: shades["500"] }} />
                            <span>{color}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={primaryShade} onValueChange={setPrimaryShade}>
                    <SelectTrigger>
                      <SelectValue placeholder="シェードを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {shadeOptions.map((shade) => (
                        <SelectItem key={shade} value={shade}>
                          {shade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div
                  className="mt-1 h-6 rounded"
                  style={{ backgroundColor: tailwindColors[primaryColor][primaryShade] }}
                />
                <p className="text-xs text-gray-500">
                  bg-{primaryColor}-{primaryShade}
                </p>
              </div>

              <div className="space-y-1">
                <Label>セカンダリカラー</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={secondaryColor} onValueChange={setSecondaryColor}>
                    <SelectTrigger>
                      <SelectValue placeholder="カラーを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(tailwindColors).map(([color, shades]) => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: shades["500"] }} />
                            <span>{color}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={secondaryShade} onValueChange={setSecondaryShade}>
                    <SelectTrigger>
                      <SelectValue placeholder="シェードを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {shadeOptions.map((shade) => (
                        <SelectItem key={shade} value={shade}>
                          {shade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div
                  className="mt-1 h-6 rounded"
                  style={{ backgroundColor: tailwindColors[secondaryColor][secondaryShade] }}
                />
                <p className="text-xs text-gray-500">
                  bg-{secondaryColor}-{secondaryShade}
                </p>
              </div>

              <div className="space-y-1">
                <Label>アクセントカラー</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={accentColor} onValueChange={setAccentColor}>
                    <SelectTrigger>
                      <SelectValue placeholder="カラーを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(tailwindColors).map(([color, shades]) => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: shades["500"] }} />
                            <span>{color}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={accentShade} onValueChange={setAccentShade}>
                    <SelectTrigger>
                      <SelectValue placeholder="シェードを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {shadeOptions.map((shade) => (
                        <SelectItem key={shade} value={shade}>
                          {shade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div
                  className="mt-1 h-6 rounded"
                  style={{ backgroundColor: tailwindColors[accentColor][accentShade] }}
                />
                <p className="text-xs text-gray-500">
                  bg-{accentColor}-{accentShade}
                </p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                Tailwind CSSでは、カラーとシェード（50〜950）の組み合わせでカラーパレットを構築します。
                一般的に500がベースカラー、それより小さい数字が明るい色、大きい数字が暗い色になります。
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
