"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Check, Info, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { calculateContrastRatio } from "@/lib/color-utils"
import type { ColorData } from "@/types/palette"

interface A11yCheckerProps {
  colors: ColorData[]
  variations: Record<string, Record<string, string>>
}

export function A11yChecker({ colors, variations }: A11yCheckerProps) {
  const { language, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const texts = {
    jp: {
      button: "アクセシビリティチェック",
      title: "アクセシビリティチェッカー",
      description: "カラーパレットのアクセシビリティをチェックします",
      overview: "概要",
      contrastCheck: "コントラストチェック",
      combinations: "カラーの組み合わせ",
      guidelines: "ガイドライン",
      close: "閉じる",
      primaryColor: "プライマリカラー",
      overallScore: "総合スコア",
      excellent: "優れている",
      good: "良好",
      fair: "普通",
      poor: "改善が必要",
      contrastRatio: "コントラスト比",
      onWhite: "白背景",
      onBlack: "黒背景",
      wcagAA: "WCAG AA",
      wcagAAA: "WCAG AAA",
      pass: "合格",
      fail: "不合格",
      recommendedCombinations: "推奨される組み合わせ",
      problematicCombinations: "問題のある組み合わせ",
      foreground: "前景",
      background: "背景",
      wcagGuidelines: "WCAGガイドライン",
      wcagGuidelinesDescription:
        "Web Content Accessibility Guidelines (WCAG) 2.1は、ウェブコンテンツをよりアクセシブルにするための国際標準です。",
      contrastRequirements: "コントラスト要件",
      normalText: "通常のテキスト",
      largeText: "大きなテキスト",
      uiComponents: "UIコンポーネント",
      levelAA: "レベルAA",
      levelAAA: "レベルAAA",
      normalTextAA: "4.5:1以上",
      largeTextAA: "3:1以上",
      uiComponentsAA: "3:1以上",
      normalTextAAA: "7:1以上",
      largeTextAAA: "4.5:1以上",
      uiComponentsAAA: "要件なし",
      colorName: "カラー名",
      role: "役割",
      value: "値",
      noRole: "役割なし",
    },
    en: {
      button: "Accessibility Check",
      title: "Accessibility Checker",
      description: "Check the accessibility of your color palette",
      overview: "Overview",
      contrastCheck: "Contrast Check",
      combinations: "Color Combinations",
      guidelines: "Guidelines",
      close: "Close",
      primaryColor: "Primary Color",
      overallScore: "Overall Score",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
      contrastRatio: "Contrast Ratio",
      onWhite: "On White",
      onBlack: "On Black",
      wcagAA: "WCAG AA",
      wcagAAA: "WCAG AAA",
      pass: "Pass",
      fail: "Fail",
      recommendedCombinations: "Recommended Combinations",
      problematicCombinations: "Problematic Combinations",
      foreground: "Foreground",
      background: "Background",
      wcagGuidelines: "WCAG Guidelines",
      wcagGuidelinesDescription:
        "Web Content Accessibility Guidelines (WCAG) 2.1 is the international standard for making web content more accessible.",
      contrastRequirements: "Contrast Requirements",
      normalText: "Normal Text",
      largeText: "Large Text",
      uiComponents: "UI Components",
      levelAA: "Level AA",
      levelAAA: "Level AAA",
      normalTextAA: "4.5:1 or higher",
      largeTextAA: "3:1 or higher",
      uiComponentsAA: "3:1 or higher",
      normalTextAAA: "7:1 or higher",
      largeTextAAA: "4.5:1 or higher",
      uiComponentsAAA: "No requirement",
      colorName: "Color Name",
      role: "Role",
      value: "Value",
      noRole: "No Role",
    },
  }

  const t_local = texts[language]

  // プライマリカラーを取得
  const primaryColor = colors.find((color) => color.role === "primary") || colors[0]

  // コントラスト比を計算
  const calculateContrasts = () => {
    const results: Record<
      string,
      {
        onWhite: number
        onBlack: number
        passAANormal: boolean
        passAAANormal: boolean
        passAALarge: boolean
        passAAALarge: boolean
      }
    > = {}

    colors.forEach((color) => {
      const onWhite = calculateContrastRatio(color.value, "#FFFFFF")
      const onBlack = calculateContrastRatio(color.value, "#000000")

      results[color.name] = {
        onWhite,
        onBlack,
        passAANormal: onWhite >= 4.5 || onBlack >= 4.5,
        passAAANormal: onWhite >= 7 || onBlack >= 7,
        passAALarge: onWhite >= 3 || onBlack >= 3,
        passAAALarge: onWhite >= 4.5 || onBlack >= 4.5,
      }
    })

    return results
  }

  // カラーの組み合わせを評価
  const evaluateCombinations = () => {
    const recommended: Array<{ fg: ColorData; bg: ColorData; contrast: number }> = []
    const problematic: Array<{ fg: ColorData; bg: ColorData; contrast: number }> = []

    // テキストカラーと背景カラーを特定
    const textColors = colors.filter((c) => c.role === "text" || c.name.toLowerCase().includes("text"))
    const bgColors = colors.filter((c) => c.role === "background" || c.name.toLowerCase().includes("background"))

    // テキストカラーがない場合は、すべての色をテキストカラーとして扱う
    const fgColorsToCheck = textColors.length > 0 ? textColors : colors
    // 背景カラーがない場合は、すべての色を背景カラーとして扱う
    const bgColorsToCheck = bgColors.length > 0 ? bgColors : colors

    // すべての組み合わせをチェック
    for (const fg of fgColorsToCheck) {
      for (const bg of bgColorsToCheck) {
        if (fg.name === bg.name) continue // 同じ色の組み合わせはスキップ

        const contrast = calculateContrastRatio(fg.value, bg.value)

        if (contrast >= 4.5) {
          recommended.push({ fg, bg, contrast })
        } else if (contrast < 3) {
          problematic.push({ fg, bg, contrast })
        }
      }
    }

    // コントラスト比で降順ソート
    recommended.sort((a, b) => b.contrast - a.contrast)
    problematic.sort((a, b) => a.contrast - b.contrast)

    return { recommended, problematic }
  }

  // 総合スコアを計算
  const calculateOverallScore = () => {
    const contrasts = calculateContrasts()
    const passCount = Object.values(contrasts).filter((c) => c.passAANormal).length
    const totalColors = colors.length

    // 色が0の場合は0%とする
    if (totalColors === 0) return { score: 0, label: t_local.poor, color: "red" }

    const score = (passCount / totalColors) * 100

    if (score >= 90) return { score, label: t_local.excellent, color: "green" }
    if (score >= 70) return { score, label: t_local.good, color: "blue" }
    if (score >= 50) return { score, label: t_local.fair, color: "yellow" }
    return { score, label: t_local.poor, color: "red" }
  }

  const contrasts = calculateContrasts()
  const combinations = evaluateCombinations()
  const overallScore = calculateOverallScore()

  return (
    <>
      <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setIsOpen(true)}>
        <Eye className="h-4 w-4" />
        <span>{t_local.button}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[800px] w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="sticky top-0 bg-white dark:bg-gray-900 z-20 pb-4 border-b">
            <DialogTitle>{t_local.title}</DialogTitle>
            <DialogDescription>{t_local.description}</DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <TabsList className="mx-4 mt-4">
              <TabsTrigger value="overview">{t_local.overview}</TabsTrigger>
              <TabsTrigger value="contrast">{t_local.contrastCheck}</TabsTrigger>
              <TabsTrigger value="combinations">{t_local.combinations}</TabsTrigger>
              <TabsTrigger value="guidelines">{t_local.guidelines}</TabsTrigger>
            </TabsList>

            <div className="overflow-y-auto flex-1 p-4">
              <TabsContent value="overview" className="mt-0">
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">{t_local.primaryColor}</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md" style={{ backgroundColor: primaryColor.value }}></div>
                      <div>
                        <p className="font-medium">{primaryColor.name}</p>
                        <p className="text-sm text-gray-500">{primaryColor.value}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">{t_local.overallScore}</h3>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl bg-${overallScore.color}-500`}
                      >
                        {Math.round(overallScore.score)}%
                      </div>
                      <div>
                        <p className="font-medium">{overallScore.label}</p>
                        <p className="text-sm text-gray-500">
                          {Math.round(overallScore.score)}% {t_local.wcagAA} {t_local.pass}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">
                        {t_local.wcagAA} {t_local.pass}
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(contrasts)
                          .filter(([_, data]) => data.passAANormal)
                          .map(([name, _]) => {
                            const color = colors.find((c) => c.name === name)
                            if (!color) return null
                            return (
                              <div key={name} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }}></div>
                                <span>{name}</span>
                              </div>
                            )
                          })}
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">
                        {t_local.wcagAA} {t_local.fail}
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(contrasts)
                          .filter(([_, data]) => !data.passAANormal)
                          .map(([name, _]) => {
                            const color = colors.find((c) => c.name === name)
                            if (!color) return null
                            return (
                              <div key={name} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }}></div>
                                <span>{name}</span>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contrast" className="mt-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="p-2 text-left">{t_local.colorName}</th>
                        <th className="p-2 text-left">{t_local.role}</th>
                        <th className="p-2 text-left">{t_local.value}</th>
                        <th className="p-2 text-left">{t_local.onWhite}</th>
                        <th className="p-2 text-left">{t_local.onBlack}</th>
                        <th className="p-2 text-left">{t_local.wcagAA}</th>
                        <th className="p-2 text-left">{t_local.wcagAAA}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {colors.map((color) => {
                        const contrast = contrasts[color.name]
                        if (!contrast) return null

                        return (
                          <tr key={color.name} className="border-b">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }}></div>
                                <span>{color.name}</span>
                              </div>
                            </td>
                            <td className="p-2">{color.role || t_local.noRole}</td>
                            <td className="p-2">{color.value}</td>
                            <td className="p-2">{contrast.onWhite.toFixed(2)}</td>
                            <td className="p-2">{contrast.onBlack.toFixed(2)}</td>
                            <td className="p-2">
                              {contrast.passAANormal ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  {t_local.pass}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  {t_local.fail}
                                </Badge>
                              )}
                            </td>
                            <td className="p-2">
                              {contrast.passAAANormal ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  {t_local.pass}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  {t_local.fail}
                                </Badge>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="combinations" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t_local.recommendedCombinations}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="p-2 text-left">{t_local.foreground}</th>
                            <th className="p-2 text-left">{t_local.background}</th>
                            <th className="p-2 text-left">{t_local.contrastRatio}</th>
                            <th className="p-2 text-left">{t_local.preview}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {combinations.recommended.slice(0, 10).map((combo, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: combo.fg.value }}
                                  ></div>
                                  <span>{combo.fg.name}</span>
                                </div>
                              </td>
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: combo.bg.value }}
                                  ></div>
                                  <span>{combo.bg.name}</span>
                                </div>
                              </td>
                              <td className="p-2">{combo.contrast.toFixed(2)}</td>
                              <td className="p-2">
                                <div
                                  className="px-3 py-1 rounded text-center"
                                  style={{
                                    backgroundColor: combo.bg.value,
                                    color: combo.fg.value,
                                  }}
                                >
                                  Aa
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t_local.problematicCombinations}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="p-2 text-left">{t_local.foreground}</th>
                            <th className="p-2 text-left">{t_local.background}</th>
                            <th className="p-2 text-left">{t_local.contrastRatio}</th>
                            <th className="p-2 text-left">{t_local.preview}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {combinations.problematic.slice(0, 10).map((combo, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: combo.fg.value }}
                                  ></div>
                                  <span>{combo.fg.name}</span>
                                </div>
                              </td>
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: combo.bg.value }}
                                  ></div>
                                  <span>{combo.bg.name}</span>
                                </div>
                              </td>
                              <td className="p-2">{combo.contrast.toFixed(2)}</td>
                              <td className="p-2">
                                <div
                                  className="px-3 py-1 rounded text-center"
                                  style={{
                                    backgroundColor: combo.bg.value,
                                    color: combo.fg.value,
                                  }}
                                >
                                  Aa
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="guidelines" className="mt-0">
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">{t_local.wcagGuidelines}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t_local.wcagGuidelinesDescription}</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">{t_local.contrastRequirements}</h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                          <th className="p-2 text-left"></th>
                          <th className="p-2 text-left">{t_local.levelAA}</th>
                          <th className="p-2 text-left">{t_local.levelAAA}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 font-medium">{t_local.normalText}</td>
                          <td className="p-2">{t_local.normalTextAA}</td>
                          <td className="p-2">{t_local.normalTextAAA}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">{t_local.largeText}</td>
                          <td className="p-2">{t_local.largeTextAA}</td>
                          <td className="p-2">{t_local.largeTextAAA}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">{t_local.uiComponents}</td>
                          <td className="p-2">{t_local.uiComponentsAA}</td>
                          <td className="p-2">{t_local.uiComponentsAAA}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-blue-700 dark:text-blue-300">
                          大きなテキストとは、18ポイント以上の太字でないテキスト、または14ポイント以上の太字テキストを指します。
                        </p>
                        <p className="text-blue-700 dark:text-blue-300 mt-2">
                          UIコンポーネントとは、ユーザーインターフェイスコンポーネントの境界線や、フォーカス状態を示すインジケーターなどを指します。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="sticky bottom-0 bg-white dark:bg-gray-900 z-20 pt-4 border-t">
            <Button onClick={() => setIsOpen(false)}>{t_local.close}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
