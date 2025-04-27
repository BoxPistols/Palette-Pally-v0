"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wand2, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { calculateContrastRatio, hexToHsl, hslToHex, getBetterContrastColor } from "@/lib/color-utils"
import type { ColorData, TextColorSettings } from "@/types/palette"

interface PaletteOptimizerProps {
  colors: ColorData[]
  textColorSettings: TextColorSettings
  primaryColorIndex: number
  onOptimize: (newColors: ColorData[]) => void
  onUpdateTextSettings: (newSettings: TextColorSettings) => void
}

export function PaletteOptimizer({
  colors,
  textColorSettings,
  primaryColorIndex,
  onOptimize,
  onUpdateTextSettings,
}: PaletteOptimizerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [optimizationOptions, setOptimizationOptions] = useState({
    fixAccessibility: true,
    harmonizeColors: false,
    balanceVariations: true,
  })
  const [accessibilityLevel, setAccessibilityLevel] = useState<number>(4.5) // デフォルトはAA（4.5:1）
  const [harmonizationStrength, setHarmonizationStrength] = useState<number>(50) // 調和の強さ（0-100）

  // アクセシビリティの問題を検出
  const detectAccessibilityIssues = () => {
    let issues = 0

    colors.forEach((color) => {
      const hex = color.value
      const textColor =
        textColorSettings.main === "default"
          ? getBetterContrastColor(hex)
          : textColorSettings.main === "white"
            ? "#FFFFFF"
            : "#000000"

      const contrast = calculateContrastRatio(hex, textColor)
      if (contrast < accessibilityLevel) {
        issues++
      }
    })

    return issues
  }

  const accessibilityIssues = detectAccessibilityIssues()

  // アクセシビリティを修正する関数
  const fixAccessibility = (colorData: ColorData[]): ColorData[] => {
    return colorData.map((color) => {
      const hex = color.value
      let newHex = hex

      // テキストカラーの取得
      const textColor =
        textColorSettings.main === "default"
          ? getBetterContrastColor(hex)
          : textColorSettings.main === "white"
            ? "#FFFFFF"
            : "#000000"

      // コントラスト比の計算
      const contrast = calculateContrastRatio(hex, textColor)

      // コントラスト比が設定値未満の場合は調整
      if (contrast < accessibilityLevel) {
        // HSLに変換して明度を調整
        const hsl = hexToHsl(hex)
        if (hsl) {
          if (textColor === "#FFFFFF") {
            // 白テキストの場合は暗くする
            hsl.l = Math.max(0, hsl.l - 15)
          } else {
            // 黒テキストの場合は明るくする
            hsl.l = Math.min(100, hsl.l + 15)
          }
          newHex = hslToHex(hsl.h, hsl.s, hsl.l)

          // 再度コントラスト比をチェック
          const newContrast = calculateContrastRatio(newHex, textColor)

          // まだ基準を満たさない場合は彩度も調整
          if (newContrast < accessibilityLevel) {
            if (textColor === "#FFFFFF") {
              // 白テキストの場合は彩度を下げる
              hsl.s = Math.max(0, hsl.s - 10)
              hsl.l = Math.max(0, hsl.l - 10)
            } else {
              // 黒テキストの場合は彩度を下げる
              hsl.s = Math.max(0, hsl.s - 10)
              hsl.l = Math.min(100, hsl.l + 10)
            }
            newHex = hslToHex(hsl.h, hsl.s, hsl.l)
          }
        }
      }

      return { ...color, value: newHex }
    })
  }

  // Primaryカラーに基づいた明度と彩度の調和を生成する関数（色相は維持）
  const harmonizeWithPrimary = (colorData: ColorData[]): ColorData[] => {
    if (colorData.length < 2 || primaryColorIndex < 0 || primaryColorIndex >= colorData.length) {
      return colorData
    }

    // Primaryカラーを取得
    const primaryColor = colorData[primaryColorIndex].value
    const primaryHsl = hexToHsl(primaryColor)

    if (!primaryHsl) return colorData

    // 調和の強さを0-1の範囲に変換
    const strength = harmonizationStrength / 100

    // 調和のとれたカラーパレットを生成
    return colorData.map((color, index) => {
      // Primaryカラー自体は変更しない
      if (index === primaryColorIndex) return color

      const currentHsl = hexToHsl(color.value)
      if (!currentHsl) return color

      // 明度と彩度の差を計算
      const saturationDiff = primaryHsl.s - currentHsl.s
      const lightnessDiff = primaryHsl.l - currentHsl.l

      // 明度と彩度を調整（色相は維持）
      // strengthパラメータで調整の強さを制御
      const newSaturation = currentHsl.s + saturationDiff * strength
      const newLightness = currentHsl.l + lightnessDiff * strength * 0.7 // 明度の調整は少し控えめに

      // 範囲を制限
      const adjustedS = Math.max(0, Math.min(100, newSaturation))
      const adjustedL = Math.max(10, Math.min(90, newLightness))

      // 色相は維持したまま、明度と彩度だけを調整
      const newHex = hslToHex(currentHsl.h, adjustedS, adjustedL)
      return { ...color, value: newHex }
    })
  }

  // バリエーションのバランスを調整する関数（テキストカラー設定も更新）
  const optimizeTextSettings = (): TextColorSettings => {
    // 各カラーのコントラスト比を分析
    const newSettings = { ...textColorSettings }

    // メインカラーの分析
    let whiteContrast = 0
    let blackContrast = 0

    colors.forEach((color) => {
      const whiteC = calculateContrastRatio(color.value, "#FFFFFF")
      const blackC = calculateContrastRatio(color.value, "#000000")

      whiteContrast += whiteC
      blackContrast += blackC
    })

    // 平均コントラスト比に基づいて推奨設定
    const avgWhiteContrast = whiteContrast / colors.length
    const avgBlackContrast = blackContrast / colors.length

    // メインカラーのテキスト設定
    if (avgWhiteContrast > avgBlackContrast && avgWhiteContrast >= accessibilityLevel) {
      newSettings.main = "white"
    } else if (avgBlackContrast >= accessibilityLevel) {
      newSettings.main = "black"
    } else {
      newSettings.main = "default" // 自動判定
    }

    // ダークバリエーションは通常白テキストが適切
    newSettings.dark = "white"

    // ライトバリエーションは通常黒テキストが適切
    newSettings.light = "black"
    newSettings.lighter = "black"

    return newSettings
  }

  const handleOptimize = () => {
    let optimizedColors = [...colors]
    let updatedTextSettings = { ...textColorSettings }

    // 選択されたオプションに基づいて最適化
    if (optimizationOptions.fixAccessibility) {
      optimizedColors = fixAccessibility(optimizedColors)
    }

    if (optimizationOptions.harmonizeColors) {
      optimizedColors = harmonizeWithPrimary(optimizedColors)
    }

    if (optimizationOptions.balanceVariations) {
      updatedTextSettings = optimizeTextSettings()
    }

    // 変更を適用
    onOptimize(optimizedColors)
    onUpdateTextSettings(updatedTextSettings)

    setIsOpen(false)
    toast({
      title: "最適化完了",
      description: "パレットが最適化されました",
    })
  }

  // アクセシビリティレベルのラベルを取得
  const getAccessibilityLevelLabel = (value: number): string => {
    if (value >= 7.0) return "AAA (7.0:1)"
    if (value >= 4.5) return "AA (4.5:1)"
    if (value >= 3.0) return "A (3.0:1)"
    return "最小 (3.0:1未満)"
  }

  return (
    <>
      <Button variant="outline" size="sm" className="flex items-center gap-1 relative" onClick={() => setIsOpen(true)}>
        <Wand2 className="h-4 w-4" />
        <span>パレット最適化</span>
        {accessibilityIssues > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {accessibilityIssues}
          </span>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>パレット最適化</DialogTitle>
            <DialogDescription>カラーパレットの一貫性とアクセシビリティを向上させるためのオプション</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {accessibilityIssues > 0 && (
              <div className="flex p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 gap-2 items-start">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">アクセシビリティの問題が検出されました</p>
                  <p className="text-xs mt-1">
                    {accessibilityIssues}個のカラーでコントラスト比が不十分です（{accessibilityLevel.toFixed(1)}
                    :1未満）。 「アクセシビリティ修正」オプションを有効にすることで自動的に修正できます。
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="fix-accessibility">アクセシビリティ修正</Label>
                  <p className="text-xs text-gray-500">コントラスト比が基準値以上になるよう色を調整</p>
                </div>
                <Switch
                  id="fix-accessibility"
                  checked={optimizationOptions.fixAccessibility}
                  onCheckedChange={(checked) =>
                    setOptimizationOptions({ ...optimizationOptions, fixAccessibility: checked })
                  }
                />
              </div>

              {optimizationOptions.fixAccessibility && (
                <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                  <Label htmlFor="accessibility-level" className="text-xs">
                    アクセシビリティレベル: {getAccessibilityLevelLabel(accessibilityLevel)}
                  </Label>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">A</span>
                    <Slider
                      id="accessibility-level"
                      min={3.0}
                      max={7.0}
                      step={0.1}
                      value={[accessibilityLevel]}
                      onValueChange={(value) => setAccessibilityLevel(value[0])}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500">AAA</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="harmonize-colors">Primaryカラーとの調和</Label>
                  <p className="text-xs text-gray-500">Primaryカラーの明度・彩度に合わせて調整（色相は維持）</p>
                </div>
                <Switch
                  id="harmonize-colors"
                  checked={optimizationOptions.harmonizeColors}
                  onCheckedChange={(checked) =>
                    setOptimizationOptions({ ...optimizationOptions, harmonizeColors: checked })
                  }
                />
              </div>

              {optimizationOptions.harmonizeColors && (
                <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                  <Label htmlFor="harmonization-strength" className="text-xs">
                    調和の強さ: {harmonizationStrength}%
                  </Label>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">弱</span>
                    <Slider
                      id="harmonization-strength"
                      min={10}
                      max={100}
                      step={5}
                      value={[harmonizationStrength]}
                      onValueChange={(value) => setHarmonizationStrength(value[0])}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500">強</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="balance-variations">テキストカラー最適化</Label>
                  <p className="text-xs text-gray-500">各バリエーションに最適なテキストカラーを設定</p>
                </div>
                <Switch
                  id="balance-variations"
                  checked={optimizationOptions.balanceVariations}
                  onCheckedChange={(checked) =>
                    setOptimizationOptions({ ...optimizationOptions, balanceVariations: checked })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleOptimize}>最適化を適用</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
