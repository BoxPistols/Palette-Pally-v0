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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
  const [accessibilityPreset, setAccessibilityPreset] = useState<string>("aa") // デフォルトはAA
  const [harmonizationStrength, setHarmonizationStrength] = useState<number>(50) // 調和の強さ（0-100）
  const [useCustomAccessibility, setUseCustomAccessibility] = useState<boolean>(false) /// カスタム値を使用するかどうか

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

      // 明度と彩度の差を計算（色相は維持）
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
      title: "Optimization Complete",
      description: "Palette has been optimized",
    })
  }

  // アクセシビリティレベルのプリセット変更
  const handleAccessibilityPresetChange = (value: string) => {
    setAccessibilityPreset(value)
    setUseCustomAccessibility(false)

    // プリセットに基づいてアクセシビリティレベルを設定
    switch (value) {
      case "a":
        setAccessibilityLevel(3.0)
        break
      case "aa":
        setAccessibilityLevel(4.5)
        break
      case "aaa":
        setAccessibilityLevel(7.0)
        break
      default:
        setAccessibilityLevel(4.5)
    }
  }

  // カスタムアクセシビリティレベルの変更
  const handleCustomAccessibilityChange = (value: number[]) => {
    setAccessibilityLevel(value[0])
    setUseCustomAccessibility(true)

    // 現在の値に最も近いプリセットを選択
    if (value[0] < 3.5) {
      setAccessibilityPreset("a")
    } else if (value[0] < 5.5) {
      setAccessibilityPreset("aa")
    } else {
      setAccessibilityPreset("aaa")
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" className="flex items-center gap-1 relative" onClick={() => setIsOpen(true)}>
        <Wand2 className="h-4 w-4" />
        <span>Palette Optimizer</span>
        {accessibilityIssues > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {accessibilityIssues}
          </span>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[500px] w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="sticky top-0 bg-white z-20 pb-4 border-b">
            <DialogTitle>Palette Optimizer</DialogTitle>
            <DialogDescription>
              Options to improve consistency and accessibility of your color palette
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4 overflow-auto flex-1">
            {accessibilityIssues > 0 && (
              <div className="flex p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 gap-2 items-start">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Accessibility issues detected</p>
                  <p className="text-xs mt-1">
                    {accessibilityIssues} colors have insufficient contrast ratio (below {accessibilityLevel.toFixed(1)}
                    :1). Enable "Fix Accessibility" option to automatically fix these issues.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="fix-accessibility">Fix Accessibility</Label>
                  <p className="text-xs text-gray-500">Adjust colors to meet contrast ratio requirements</p>
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
                  <Label className="text-xs">Accessibility Level</Label>

                  <RadioGroup
                    value={accessibilityPreset}
                    onValueChange={handleAccessibilityPresetChange}
                    className="flex space-x-4 mb-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="a" id="a-level" />
                      <Label htmlFor="a-level" className="text-xs">
                        A (3.0:1)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="aa" id="aa-level" />
                      <Label htmlFor="aa-level" className="text-xs">
                        AA (4.5:1)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="aaa" id="aaa-level" />
                      <Label htmlFor="aaa-level" className="text-xs">
                        AAA (7.0:1)
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label htmlFor="custom-level" className="text-xs">
                        Custom value: {accessibilityLevel.toFixed(1)}:1
                      </Label>
                      <Switch
                        id="use-custom"
                        checked={useCustomAccessibility}
                        onCheckedChange={(checked) => setUseCustomAccessibility(checked)}
                        size="sm"
                        className="h-4 w-8"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">1.0</span>
                      <Slider
                        id="custom-level"
                        min={1.0}
                        max={21.0}
                        step={0.1}
                        value={[accessibilityLevel]}
                        onValueChange={handleCustomAccessibilityChange}
                        className="flex-1"
                        disabled={!useCustomAccessibility}
                      />
                      <span className="text-xs text-gray-500">21.0</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="harmonize-colors">Harmonize with Primary</Label>
                  <p className="text-xs text-gray-500">
                    Adjust brightness and saturation to match primary color (preserves hue)
                  </p>
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
                    Harmony strength: {harmonizationStrength}%
                  </Label>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">Weak</span>
                    <Slider
                      id="harmonization-strength"
                      min={10}
                      max={100}
                      step={5}
                      value={[harmonizationStrength]}
                      onValueChange={(value) => setHarmonizationStrength(value[0])}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500">Strong</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Note: This feature only adjusts brightness and saturation, not hue
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="balance-variations">Optimize Text Colors</Label>
                  <p className="text-xs text-gray-500">Set optimal text colors for each variation</p>
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

          <DialogFooter className="sticky bottom-0 bg-white z-20 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleOptimize}>Apply Optimization</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
