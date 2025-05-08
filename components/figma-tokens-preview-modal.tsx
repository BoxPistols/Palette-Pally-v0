"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { Maximize2, Minimize2 } from "lucide-react"

interface FigmaTokensPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  tokens?: any
  title?: string
}

export function FigmaTokensPreviewModal({
  isOpen,
  onClose,
  tokens = {}, // デフォルト値を空オブジェクトに設定
  title = "Figma Tokens Preview",
}: FigmaTokensPreviewModalProps) {
  const { language } = useLanguage()
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // JSONをきれいに表示するための関数
  const formatJSON = (json: any) => {
    return JSON.stringify(json, null, 2)
  }

  // tokensが存在しない場合のチェック
  const hasTokens = tokens && Object.keys(tokens).length > 0
  const hasPalette = tokens && tokens.palette && Object.keys(tokens.palette).length > 0
  const hasTypography = tokens && tokens.typography && Object.keys(tokens.typography).length > 0

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`${
          isFullscreen ? "max-w-[95vw] w-[95vw] max-h-[90vh]" : "max-w-[600px] w-[90vw] max-h-[80vh]"
        } overflow-hidden flex flex-col`}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{title}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </DialogHeader>

        <Tabs defaultValue="preview" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">{language === "jp" ? "プレビュー" : "Preview"}</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 overflow-auto mt-4">
            {!hasTokens ? (
              <div className="text-center py-8 text-gray-500">
                {language === "jp" ? "トークンデータがありません" : "No token data available"}
              </div>
            ) : (
              <div className="space-y-6">
                {hasPalette && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{language === "jp" ? "カラーパレット" : "Color Palette"}</h3>

                    {/* パレットのプレビュー */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(tokens.palette).map(([paletteName, paletteValue]: [string, any]) => (
                        <div key={paletteName} className="border rounded-md p-4">
                          <h4 className="font-medium mb-2">{paletteName}</h4>
                          <div className="space-y-2">
                            {Object.entries(paletteValue).map(([colorName, colorValue]: [string, any]) => {
                              // カラーグループの場合（primary, secondary など）
                              if (typeof colorValue === "object" && !colorValue.$value) {
                                return (
                                  <div key={colorName} className="mt-3">
                                    <h5 className="text-sm font-medium mb-1">{colorName}</h5>
                                    <div className="grid grid-cols-5 gap-2">
                                      {Object.entries(colorValue).map(([variantName, variant]: [string, any]) => {
                                        const colorHex = variant.$value || "#cccccc"
                                        return (
                                          <div key={variantName} className="flex flex-col items-center">
                                            <div
                                              className="w-8 h-8 rounded-md border"
                                              style={{ backgroundColor: colorHex }}
                                              title={`${colorName}.${variantName}: ${colorHex}`}
                                            />
                                            <span className="text-xs mt-1">{variantName}</span>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )
                              }
                              // 単一カラーの場合
                              else if (colorValue.$value) {
                                const colorHex = colorValue.$value
                                return (
                                  <div key={colorName} className="flex items-center space-x-2">
                                    <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: colorHex }} />
                                    <span className="text-sm">
                                      {colorName}: {colorHex}
                                    </span>
                                  </div>
                                )
                              }
                              return null
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hasTypography && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{language === "jp" ? "タイポグラフィ" : "Typography"}</h3>

                    {/* タイポグラフィのプレビュー */}
                    <div className="space-y-4">
                      {Object.entries(tokens.typography).map(([typeName, typeValue]: [string, any]) => {
                        // タイポグラフィグループの場合（heading, body など）
                        if (typeof typeValue === "object" && !typeValue.$value) {
                          return (
                            <div key={typeName} className="border rounded-md p-4">
                              <h4 className="font-medium mb-2">{typeName}</h4>
                              <div className="space-y-3">
                                {Object.entries(typeValue).map(([variantName, variant]: [string, any]) => {
                                  if (variant.$value) {
                                    const { fontFamily, fontSize, fontWeight, lineHeight } = variant.$value
                                    return (
                                      <div key={variantName} className="border-t pt-2">
                                        <p
                                          style={{
                                            fontFamily,
                                            fontSize,
                                            fontWeight,
                                            lineHeight,
                                          }}
                                        >
                                          {typeName}.{variantName} - {fontSize} {fontWeight}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          {fontFamily}, {fontSize}, weight: {fontWeight}, line-height: {lineHeight}
                                        </p>
                                      </div>
                                    )
                                  }
                                  return null
                                })}
                              </div>
                            </div>
                          )
                        }
                        // 単一タイポグラフィの場合
                        else if (typeValue.$value) {
                          const { fontFamily, fontSize, fontWeight, lineHeight } = typeValue.$value
                          return (
                            <div key={typeName} className="border rounded-md p-3">
                              <p
                                style={{
                                  fontFamily,
                                  fontSize,
                                  fontWeight,
                                  lineHeight,
                                }}
                              >
                                {typeName} - {fontSize} {fontWeight}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {fontFamily}, {fontSize}, weight: {fontWeight}, line-height: {lineHeight}
                              </p>
                            </div>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>
                )}

                {!hasPalette && !hasTypography && (
                  <div className="text-center py-8 text-gray-500">
                    {language === "jp"
                      ? "カラーパレットまたはタイポグラフィのデータがありません"
                      : "No color palette or typography data available"}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="json" className="flex-1 overflow-auto mt-4">
            <pre className="text-xs p-4 bg-gray-50 dark:bg-gray-800 rounded-md overflow-x-auto">
              {formatJSON(tokens)}
            </pre>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button onClick={onClose}>{language === "jp" ? "閉じる" : "Close"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
