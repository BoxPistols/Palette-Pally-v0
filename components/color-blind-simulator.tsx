"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { simulateAllColorBlindness, type ColorBlindnessType } from "@/lib/color-blind-simulation"
import { useLanguage } from "@/contexts/language-context"
import type { ColorData } from "@/types/palette"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ColorBlindSimulatorProps {
  colors: ColorData[]
  variations: Record<string, Record<string, string>>
}

export function ColorBlindSimulator({ colors, variations }: ColorBlindSimulatorProps) {
  const { language, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [showOriginal, setShowOriginal] = useState(true)

  // 色覚異常の種類と説明
  const colorBlindnessTypes: Record<
    ColorBlindnessType,
    { name: { jp: string; en: string }; description: { jp: string; en: string } }
  > = {
    protanopia: {
      name: {
        jp: "第一色覚異常（赤色弱）",
        en: "Protanopia (Red-Blind)",
      },
      description: {
        jp: "赤色の感度が低下し、赤と緑の区別が難しくなります。",
        en: "Decreased sensitivity to red light, making it difficult to distinguish between red and green.",
      },
    },
    deuteranopia: {
      name: {
        jp: "第二色覚異常（緑色弱）",
        en: "Deuteranopia (Green-Blind)",
      },
      description: {
        jp: "緑色の感度が低下し、赤と緑の区別が難しくなります。最も一般的な色覚異常です。",
        en: "Decreased sensitivity to green light, making it difficult to distinguish between red and green. The most common type of color blindness.",
      },
    },
    tritanopia: {
      name: {
        jp: "第三色覚異常（青色弱）",
        en: "Tritanopia (Blue-Blind)",
      },
      description: {
        jp: "青色の感度が低下し、青と黄色の区別が難しくなります。比較的まれな色覚異常です。",
        en: "Decreased sensitivity to blue light, making it difficult to distinguish between blue and yellow. A relatively rare type of color blindness.",
      },
    },
    achromatopsia: {
      name: {
        jp: "完全色覚異常（色盲）",
        en: "Achromatopsia (Monochromacy)",
      },
      description: {
        jp: "色を全く認識できず、白黒やグレースケールでしか見えません。非常にまれです。",
        en: "Complete inability to perceive colors, seeing only in black, white, and shades of gray. Very rare.",
      },
    },
    grayscale: {
      name: {
        jp: "グレースケール",
        en: "Grayscale",
      },
      description: {
        jp: "すべての色をグレースケール（白黒）で表示します。これは色覚異常ではなく、モノクロでの見え方を確認するためのモードです。",
        en: "Displays all colors in grayscale (black and white). This is not a color blindness type but a mode to check how colors appear in monochrome.",
      },
    },
  }

  // カラーブロックを生成する関数
  const renderColorBlock = (color: string, label: string) => {
    // 無効なカラーコードの場合はデフォルト値を使用
    const safeColor =
      color && typeof color === "string" && color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i) ? color : "#cccccc"

    return (
      <div className="flex flex-col items-center">
        <div
          className="w-12 h-12 rounded-md border border-gray-200 dark:border-gray-700"
          style={{ backgroundColor: safeColor }}
          title={safeColor}
        />
        <span className="text-xs mt-1">{label}</span>
      </div>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setIsOpen(true)}
        title={t("button.colorBlind")}
      >
        <Eye className="h-4 w-4" />
        <span>{t("button.colorBlind")}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[960px] w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="sticky top-0 z-10 pb-4 border-b">
            <DialogTitle>{t("colorBlind.title")}</DialogTitle>
            <DialogDescription>{t("colorBlind.description")}</DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-end mb-4 gap-2">
            <Switch id="show-original" checked={showOriginal} onCheckedChange={setShowOriginal} />
            <Label htmlFor="show-original">{language === "jp" ? "元の色を表示" : "Show original colors"}</Label>
          </div>

          <Tabs defaultValue="overview" className="w-full flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid grid-cols-2 sm:grid-cols-6 mb-2">
              <TabsTrigger value="overview">{t("colorBlind.overview")}</TabsTrigger>
              <TabsTrigger value="protanopia">{colorBlindnessTypes.protanopia.name[language]}</TabsTrigger>
              <TabsTrigger value="deuteranopia">{colorBlindnessTypes.deuteranopia.name[language]}</TabsTrigger>
              <TabsTrigger value="tritanopia">{colorBlindnessTypes.tritanopia.name[language]}</TabsTrigger>
              <TabsTrigger value="achromatopsia">{colorBlindnessTypes.achromatopsia.name[language]}</TabsTrigger>
              <TabsTrigger value="grayscale">{colorBlindnessTypes.grayscale.name[language]}</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto px-1">
              <TabsContent value="overview" className="mt-4">
                <div className="space-y-4">
                  <p className="text-sm">
                    {language === "jp"
                      ? "色覚異常は、人口の約4.5%（男性の約8%、女性の約0.5%）に見られる特性です。色覚異常の方にも識別しやすいカラーパレットを設計することは、アクセシビリティの観点から重要です。"
                      : "Color blindness affects approximately 4.5% of the population (about 8% of males and 0.5% of females). Designing color palettes that are distinguishable for people with color blindness is important from an accessibility perspective."}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(colorBlindnessTypes).map(([key, { name, description }]) => (
                      <div key={key} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <h3 className="font-medium text-sm">{name[language]}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{description[language]}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>{language === "jp" ? "ヒント:" : "Tip:"}</strong>{" "}
                      {language === "jp"
                        ? "色だけでなく、形やパターン、テキストラベルなどを併用することで、色覚異常の方にも情報が伝わりやすくなります。また、十分なコントラスト比を確保することも重要です。"
                        : "Using shapes, patterns, and text labels in addition to colors makes information more accessible to people with color blindness. Ensuring sufficient contrast ratios is also important."}
                    </p>
                  </div>
                </div>
              </TabsContent>

              {(["protanopia", "deuteranopia", "tritanopia", "achromatopsia", "grayscale"] as const).map((type) => (
                <TabsContent key={type} value={type} className="mt-4">
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <h3 className="font-medium">{colorBlindnessTypes[type].name[language]}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {colorBlindnessTypes[type].description[language]}
                      </p>
                    </div>

                    <h3 className="font-medium text-sm">{language === "jp" ? "メインカラー" : "Main Colors"}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {colors.map((color) => {
                        const simulatedColor = simulateAllColorBlindness(color.value)[type]
                        return (
                          <div key={color.name} className="flex flex-col items-center space-y-2">
                            <div className="flex space-x-2">
                              {showOriginal && renderColorBlock(color.value, language === "jp" ? "通常" : "Normal")}
                              {renderColorBlock(simulatedColor, type)}
                            </div>
                            <span className="text-xs font-medium">{color.name}</span>
                          </div>
                        )
                      })}
                    </div>

                    <h3 className="font-medium text-sm mt-6">
                      {language === "jp" ? "カラーバリエーション" : "Color Variations"}
                    </h3>
                    {Object.entries(variations).map(([colorName, colorVariations]) => (
                      <div key={colorName} className="mb-4">
                        <h4 className="text-xs font-medium mb-2">{colorName}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {Object.entries(colorVariations).map(([variationName, hexValue]) => {
                            const simulatedColor = simulateAllColorBlindness(hexValue)[type]
                            return (
                              <div
                                key={`${colorName}-${variationName}`}
                                className="flex flex-col items-center space-y-2"
                              >
                                <div className="flex space-x-2">
                                  {showOriginal && renderColorBlock(hexValue, language === "jp" ? "通常" : "Normal")}
                                  {renderColorBlock(simulatedColor, type)}
                                </div>
                                <span className="text-xs">{variationName}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>

          <DialogFooter className="sticky bottom-0 z-10 pt-4 border-t mt-4">
            <Button onClick={() => setIsOpen(false)}>{t("colorBlind.close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
