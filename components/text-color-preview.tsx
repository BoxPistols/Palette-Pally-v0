"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Type } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateContrastRatio, getWCAGLevel } from "@/lib/color-utils"
import { useLanguage } from "@/contexts/language-context"
import type { ColorData } from "@/types/palette"

interface TextColorPreviewProps {
  colors: ColorData[]
}

export function TextColorPreview({ colors }: TextColorPreviewProps) {
  const { language, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  // 背景色のオプション
  const backgroundOptions = [
    { name: language === "jp" ? "白" : "White", value: "#FFFFFF" },
    { name: language === "jp" ? "黒" : "Black", value: "#000000" },
    { name: language === "jp" ? "ライトグレー" : "Light Gray", value: "#F5F5F5" },
    { name: language === "jp" ? "ダークグレー" : "Dark Gray", value: "#333333" },
  ]

  const [selectedBackground, setSelectedBackground] = useState(backgroundOptions[0].value)

  // フォントサイズのオプション
  const fontSizeOptions = [
    { name: language === "jp" ? "小 (12px)" : "Small (12px)", value: "text-xs" },
    { name: language === "jp" ? "標準 (16px)" : "Standard (16px)", value: "text-base" },
    { name: language === "jp" ? "大 (24px)" : "Large (24px)", value: "text-2xl" },
    { name: language === "jp" ? "特大 (32px)" : "Extra Large (32px)", value: "text-4xl" },
  ]

  // コントラスト比に基づいてバッジの色を取得
  const getContrastBadgeClass = (contrastRatio: number) => {
    const wcagLevel = getWCAGLevel(contrastRatio)
    return wcagLevel.level === "AAA"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : wcagLevel.level === "AA"
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        : wcagLevel.level === "A"
          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setIsOpen(true)}
        title={t("button.textPreview")}
      >
        <Type className="h-4 w-4" />
        <span>{t("button.textPreview")}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[960px] w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="sticky top-0 z-10 pb-4 border-b">
            <DialogTitle>{t("textPreview.title")}</DialogTitle>
            <DialogDescription>{t("textPreview.description")}</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="standard" className="w-full flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-2">
              <TabsTrigger value="standard">{t("textPreview.standard")}</TabsTrigger>
              <TabsTrigger value="heading">{t("textPreview.heading")}</TabsTrigger>
              <TabsTrigger value="paragraph">{t("textPreview.paragraph")}</TabsTrigger>
              <TabsTrigger value="all-sizes">{t("textPreview.allSizes")}</TabsTrigger>
            </TabsList>

            <div className="mb-4 flex flex-wrap gap-2">
              {backgroundOptions.map((bg) => (
                <Button
                  key={bg.value}
                  variant={selectedBackground === bg.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedBackground(bg.value)}
                  className="text-xs"
                >
                  {bg.name}
                </Button>
              ))}
            </div>

            <div className="flex-1 overflow-auto">
              <div className="p-6 rounded-md mb-4 transition-colors" style={{ backgroundColor: selectedBackground }}>
                <TabsContent value="standard" className="mt-0">
                  <div className="space-y-6">
                    {colors.map((color) => {
                      const contrastRatio = calculateContrastRatio(selectedBackground, color.value)
                      const wcagLevel = getWCAGLevel(contrastRatio)
                      const contrastBadgeClass = getContrastBadgeClass(contrastRatio)

                      return (
                        <div key={color.name} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span
                              className="text-sm font-medium"
                              style={{ color: selectedBackground === "#FFFFFF" ? "#000000" : "#FFFFFF" }}
                            >
                              {color.name} ({color.value})
                            </span>
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full ${contrastBadgeClass}`}
                                title={language === "jp" ? "アクセシビリティレベル" : "Accessibility Level"}
                              >
                                {wcagLevel.level}
                              </span>
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                title={language === "jp" ? "コントラスト比" : "Contrast Ratio"}
                              >
                                {contrastRatio.toFixed(1)}:1
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-base" style={{ color: color.value }}>
                              {language === "jp"
                                ? `標準テキスト (16px) - これは${color.name}色を使用したテキストです。`
                                : `Standard text (16px) - This is text using the ${color.name} color.`}
                            </p>
                            <p className="text-sm" style={{ color: color.value }}>
                              {language === "jp"
                                ? `小さいテキスト (14px) - これは${color.name}色を使用したテキストです。`
                                : `Small text (14px) - This is text using the ${color.name} color.`}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="heading" className="mt-0">
                  <div className="space-y-8">
                    {colors.map((color) => {
                      const contrastRatio = calculateContrastRatio(selectedBackground, color.value)
                      const wcagLevel = getWCAGLevel(contrastRatio)
                      const contrastBadgeClass = getContrastBadgeClass(contrastRatio)

                      return (
                        <div key={color.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className="text-sm font-medium"
                              style={{ color: selectedBackground === "#FFFFFF" ? "#000000" : "#FFFFFF" }}
                            >
                              {color.name} ({color.value})
                            </span>
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full ${contrastBadgeClass}`}
                                title={language === "jp" ? "アクセシビリティレベル" : "Accessibility Level"}
                              >
                                {wcagLevel.level}
                              </span>
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                title={language === "jp" ? "コントラスト比" : "Contrast Ratio"}
                              >
                                {contrastRatio.toFixed(1)}:1
                              </span>
                            </div>
                          </div>
                          <h1 className="text-4xl font-bold" style={{ color: color.value }}>
                            {language === "jp" ? "見出し1 (32px)" : "Heading 1 (32px)"}
                          </h1>
                          <h2 className="text-3xl font-bold" style={{ color: color.value }}>
                            {language === "jp" ? "見出し2 (24px)" : "Heading 2 (24px)"}
                          </h2>
                          <h3 className="text-2xl font-bold" style={{ color: color.value }}>
                            {language === "jp" ? "見出し3 (20px)" : "Heading 3 (20px)"}
                          </h3>
                          <h4 className="text-xl font-bold" style={{ color: color.value }}>
                            {language === "jp" ? "見出し4 (18px)" : "Heading 4 (18px)"}
                          </h4>
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="paragraph" className="mt-0">
                  <div className="space-y-8">
                    {colors.map((color) => {
                      const contrastRatio = calculateContrastRatio(selectedBackground, color.value)
                      const wcagLevel = getWCAGLevel(contrastRatio)
                      const contrastBadgeClass = getContrastBadgeClass(contrastRatio)

                      return (
                        <div key={color.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className="text-sm font-medium"
                              style={{ color: selectedBackground === "#FFFFFF" ? "#000000" : "#FFFFFF" }}
                            >
                              {color.name} ({color.value})
                            </span>
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full ${contrastBadgeClass}`}
                                title={language === "jp" ? "アクセシビリティレベル" : "Accessibility Level"}
                              >
                                {wcagLevel.level}
                              </span>
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                title={language === "jp" ? "コントラスト比" : "Contrast Ratio"}
                              >
                                {contrastRatio.toFixed(1)}:1
                              </span>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <p className="text-base" style={{ color: color.value }}>
                              {language === "jp"
                                ? `これは${color.name}色を使用した段落テキストです。ウェブサイトやアプリケーションでの読みやすさを確認するために、実際の文章のように表示しています。テキストの色とコントラスト比は、アクセシビリティにおいて非常に重要な要素です。WCAGガイドラインでは、テキストと背景のコントラスト比について明確な基準が設けられています。`
                                : `This is paragraph text using the ${color.name} color. It is displayed like an actual text to check readability on websites and applications. Text color and contrast ratio are very important elements in accessibility. The WCAG guidelines set clear standards for the contrast ratio between text and background.`}
                            </p>
                            <p className="text-base" style={{ color: color.value }}>
                              {language === "jp"
                                ? `標準サイズのテキスト（16px以下）では、AA準拠には4.5:1以上、AAA準拠には7:1以上のコントラスト比が必要です。大きなテキスト（18pt以上、または14pt以上の太字）では、AA準拠には3:1以上、AAA準拠には4.5:1以上が必要です。`
                                : `For standard size text (16px or less), a contrast ratio of at least 4.5:1 is required for AA compliance, and 7:1 for AAA compliance. For large text (18pt or larger, or 14pt or larger bold), a contrast ratio of at least 3:1 is required for AA compliance, and 4.5:1 for AAA compliance.`}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="all-sizes" className="mt-0">
                  <div className="space-y-8">
                    {colors.map((color) => {
                      const contrastRatio = calculateContrastRatio(selectedBackground, color.value)
                      const wcagLevel = getWCAGLevel(contrastRatio)
                      const contrastBadgeClass = getContrastBadgeClass(contrastRatio)

                      return (
                        <div key={color.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className="text-sm font-medium"
                              style={{ color: selectedBackground === "#FFFFFF" ? "#000000" : "#FFFFFF" }}
                            >
                              {color.name} ({color.value})
                            </span>
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full ${contrastBadgeClass}`}
                                title={language === "jp" ? "アクセシビリティレベル" : "Accessibility Level"}
                              >
                                {wcagLevel.level}
                              </span>
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                title={language === "jp" ? "コントラスト比" : "Contrast Ratio"}
                              >
                                {contrastRatio.toFixed(1)}:1
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {fontSizeOptions.map((size) => (
                              <p key={size.value} className={size.value} style={{ color: color.value }}>
                                {size.name} -{" "}
                                {language === "jp"
                                  ? `これは${color.name}色を使用したテキストです。`
                                  : `This is text using the ${color.name} color.`}
                              </p>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>

          <DialogFooter className="sticky bottom-0 z-10 pt-4 border-t mt-4">
            <Button onClick={() => setIsOpen(false)}>{t("textPreview.close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
