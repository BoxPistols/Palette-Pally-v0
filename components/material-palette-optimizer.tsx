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
import { useLanguage } from "@/contexts/language-context"
import type { ColorData } from "@/types/palette"

interface MaterialPaletteOptimizerProps {
  colors: ColorData[]
  primaryColorIndex: number
  onOptimize: (newColors: ColorData[]) => void
}

export function MaterialPaletteOptimizer({ colors, primaryColorIndex, onOptimize }: MaterialPaletteOptimizerProps) {
  const { language, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [primaryColor, setPrimaryColor] = useState<string>("blue")
  const [primaryShade, setPrimaryShade] = useState<string>("500")
  const [secondaryColor, setSecondaryColor] = useState<string>("purple")
  const [secondaryShade, setSecondaryShade] = useState<string>("500")
  const [errorColor, setErrorColor] = useState<string>("red")
  const [errorShade, setErrorShade] = useState<string>("500")
  const [successColor, setSuccessColor] = useState<string>("green")
  const [successShade, setSuccessShade] = useState<string>("500")
  const [warningColor, setWarningColor] = useState<string>("amber")
  const [warningShade, setWarningShade] = useState<string>("500")
  const [infoColor, setInfoColor] = useState<string>("lightBlue")
  const [infoShade, setInfoShade] = useState<string>("500")

  const texts = {
    jp: {
      button: "Material Design",
      title: "Material Design パレット",
      description: "Material Designのカラーシステムに基づいたパレットを生成します",
      primary: "プライマリ",
      secondary: "セカンダリ",
      danger: "デンジャー",
      success: "サクセス",
      warning: "ワーニング",
      info: "インフォ",
      note: "Material Designは、プライマリカラーとセカンダリカラーを中心に一貫したカラーシステムを構築します。各カラーにはシェード（100-900）があり、数字が大きいほど暗くなります。",
      cancel: "キャンセル",
      apply: "適用",
      success_message: "Material Designパレットを適用しました",
      success_description: "Material Designに基づいたパレットを生成しました",
    },
    en: {
      button: "Material Design",
      title: "Material Design Palette",
      description: "Generate a palette based on Material Design color system",
      primary: "Primary",
      secondary: "Secondary",
      danger: "Danger",
      success: "Success",
      warning: "Warning",
      info: "Info",
      note: "Material Design builds a consistent color system around primary and secondary colors. Each color has shades (100-900) with higher numbers being darker.",
      cancel: "Cancel",
      apply: "Apply",
      success_message: "Material Design Palette Applied",
      success_description: "Generated palette based on Material Design",
    },
  }

  const t_local = texts[language]

  const handleOptimize = () => {
    // 新しいカラーパレットを生成
    const newColors = [...colors]

    // 色の役割を追跡するマップ
    const roleMap: Record<string, number> = {}

    // 既存の色の役割を確認
    colors.forEach((color, index) => {
      if (color.role) {
        roleMap[color.role] = index
      }
    })

    // プライマリカラーを設定
    const primaryHex = materialColors[primaryColor][primaryShade]
    const primaryIndex = roleMap.primary !== undefined ? roleMap.primary : primaryColorIndex
    newColors[primaryIndex] = {
      ...newColors[primaryIndex],
      value: primaryHex,
      name: "primary",
      role: "primary",
    }

    // セカンダリカラーを設定
    const secondaryHex = materialColors[secondaryColor][secondaryShade]
    const secondaryIndex = roleMap.secondary !== undefined ? roleMap.secondary : primaryIndex === 0 ? 1 : 0
    if (secondaryIndex < newColors.length) {
      newColors[secondaryIndex] = {
        ...newColors[secondaryIndex],
        value: secondaryHex,
        name: "secondary",
        role: "secondary",
      }
    }

    // エラー/デンジャーカラーを設定
    const errorHex = materialColors[errorColor][errorShade]
    const errorIndex =
      roleMap.danger !== undefined
        ? roleMap.danger
        : newColors.findIndex((c) => c.role === "error") !== -1
          ? newColors.findIndex((c) => c.role === "error")
          : findAvailableIndex(newColors, [primaryIndex, secondaryIndex])
    if (errorIndex >= 0 && errorIndex < newColors.length) {
      newColors[errorIndex] = {
        ...newColors[errorIndex],
        value: errorHex,
        name: "danger",
        role: "danger",
      }
    }

    // サクセスカラーを設定
    const successHex = materialColors[successColor][successShade]
    const successIndex =
      roleMap.success !== undefined
        ? roleMap.success
        : findAvailableIndex(newColors, [primaryIndex, secondaryIndex, errorIndex])
    if (successIndex >= 0 && successIndex < newColors.length) {
      newColors[successIndex] = {
        ...newColors[successIndex],
        value: successHex,
        name: "success",
        role: "success",
      }
    }

    // ワーニングカラーを設定
    const warningHex = materialColors[warningColor][warningShade]
    const warningIndex =
      roleMap.warning !== undefined
        ? roleMap.warning
        : findAvailableIndex(newColors, [primaryIndex, secondaryIndex, errorIndex, successIndex])
    if (warningIndex >= 0 && warningIndex < newColors.length) {
      newColors[warningIndex] = {
        ...newColors[warningIndex],
        value: warningHex,
        name: "warning",
        role: "warning",
      }
    }

    // インフォカラーを設定
    const infoHex = materialColors[infoColor][infoShade]
    const infoIndex =
      roleMap.info !== undefined
        ? roleMap.info
        : findAvailableIndex(newColors, [primaryIndex, secondaryIndex, errorIndex, successIndex, warningIndex])
    if (infoIndex >= 0 && infoIndex < newColors.length) {
      newColors[infoIndex] = {
        ...newColors[infoIndex],
        value: infoHex,
        name: "info",
        role: "info",
      }
    }

    // 変更を適用
    onOptimize(newColors)
    setIsOpen(false)

    toast({
      title: t_local.success_message,
      description: t_local.success_description,
    })
  }

  // 利用可能なインデックスを見つける関数
  const findAvailableIndex = (colors: ColorData[], excludeIndices: number[]): number => {
    for (let i = 0; i < colors.length; i++) {
      if (!excludeIndices.includes(i)) {
        return i
      }
    }
    return -1
  }

  // 現在のプライマリカラーに最も近いマテリアルカラーを初期選択
  const initializeClosestColors = () => {
    if (colors.length > 0) {
      // 役割ごとに色を初期化
      colors.forEach((color) => {
        if (color.role === "primary" || (color.role === undefined && colors.indexOf(color) === primaryColorIndex)) {
          const closestPrimary = findClosestMaterialColor(color.value)
          setPrimaryColor(closestPrimary.color)
          setPrimaryShade(closestPrimary.shade || "500")
        } else if (color.role === "secondary") {
          const closestSecondary = findClosestMaterialColor(color.value)
          setSecondaryColor(closestSecondary.color)
          setSecondaryShade(closestSecondary.shade || "500")
        } else if (color.role === "danger" || color.role === "error") {
          const closestError = findClosestMaterialColor(color.value)
          setErrorColor(closestError.color)
          setErrorShade(closestError.shade || "500")
        } else if (color.role === "success") {
          const closestSuccess = findClosestMaterialColor(color.value)
          setSuccessColor(closestSuccess.color)
          setSuccessShade(closestSuccess.shade || "500")
        } else if (color.role === "warning") {
          const closestWarning = findClosestMaterialColor(color.value)
          setWarningColor(closestWarning.color)
          setWarningShade(closestWarning.shade || "500")
        } else if (color.role === "info") {
          const closestInfo = findClosestMaterialColor(color.value)
          setInfoColor(closestInfo.color)
          setInfoShade(closestInfo.shade || "500")
        }
      })
    }
  }

  // シェードの選択肢
  const getShadeOptions = (colorName: string) => {
    if (!materialColors[colorName]) return ["500"]
    return Object.keys(materialColors[colorName]).sort((a, b) => {
      // 数値シェードを数値順にソート
      if (!isNaN(Number(a)) && !isNaN(Number(b))) {
        return Number(a) - Number(b)
      }
      // A100などのアクセントカラーは後ろに
      return a.localeCompare(b)
    })
  }

  // カラー選択コンポーネント
  const ColorSelector = ({
    label,
    color,
    shade,
    onColorChange,
    onShadeChange,
  }: {
    label: string
    color: string
    shade: string
    onColorChange: (color: string) => void
    onShadeChange: (shade: string) => void
  }) => {
    const shadeOptions = getShadeOptions(color)
    const colorHex = materialColors[color]?.[shade] || "#cccccc"

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <Label>{label}</Label>
        </div>
        <div className="grid grid-cols-2 gap-2 max-w-full">
          <Select value={color} onValueChange={onColorChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent className="max-w-[200px]">
              {Object.entries(materialColors).map(([colorKey, shades]) => (
                <SelectItem key={colorKey} value={colorKey}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: shades["500"] || Object.values(shades)[0] }}
                    />
                    <span className="truncate">{colorKey}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={shade} onValueChange={onShadeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Shade" />
            </SelectTrigger>
            <SelectContent className="max-w-[100px]">
              {shadeOptions.map((shadeOption) => (
                <SelectItem key={shadeOption} value={shadeOption}>
                  {shadeOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    )
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
        <span>{t_local.button}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[500px] w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="sticky top-0 bg-white dark:bg-gray-900 z-20 pb-4 border-b">
            <DialogTitle>{t_local.title}</DialogTitle>
            <DialogDescription>{t_local.description}</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4 overflow-y-auto flex-1 px-2">
            <div className="space-y-4">
              <ColorSelector
                label={t_local.primary}
                color={primaryColor}
                shade={primaryShade}
                onColorChange={setPrimaryColor}
                onShadeChange={setPrimaryShade}
              />

              <ColorSelector
                label={t_local.secondary}
                color={secondaryColor}
                shade={secondaryShade}
                onColorChange={setSecondaryColor}
                onShadeChange={setSecondaryShade}
              />

              <ColorSelector
                label={t_local.danger}
                color={errorColor}
                shade={errorShade}
                onColorChange={setErrorColor}
                onShadeChange={setErrorShade}
              />

              <ColorSelector
                label={t_local.success}
                color={successColor}
                shade={successShade}
                onColorChange={setSuccessColor}
                onShadeChange={setSuccessShade}
              />

              <ColorSelector
                label={t_local.warning}
                color={warningColor}
                shade={warningShade}
                onColorChange={setWarningColor}
                onShadeChange={setWarningShade}
              />

              <ColorSelector
                label={t_local.info}
                color={infoColor}
                shade={infoShade}
                onColorChange={setInfoColor}
                onShadeChange={setInfoShade}
              />
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <p className="text-sm text-blue-700 dark:text-blue-300">{t_local.note}</p>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 bg-white dark:bg-gray-900 z-20 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t_local.cancel}
            </Button>
            <Button onClick={handleOptimize}>{t_local.apply}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
