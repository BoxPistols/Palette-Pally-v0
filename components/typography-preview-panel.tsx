"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Type, X, Maximize, Minimize } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { TypographyPreview } from "@/components/typography-preview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TypographyPreviewPanelProps {
  tokens: Record<string, any>
}

export function TypographyPreviewPanel({ tokens }: TypographyPreviewPanelProps) {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")

  // 翻訳テキスト
  const texts = {
    jp: {
      button: "タイポグラフィプレビュー",
      title: "タイポグラフィプレビュー",
      description: "インポートしたタイポグラフィをプレビューできます",
      previewTab: "プレビュー",
      jsonTab: "JSON",
      closeButton: "閉じる",
      fullscreen: "全画面表示",
      exitFullscreen: "全画面表示を終了",
      noTokens: "タイポグラフィトークンがありません",
      importTokens: "Figmaトークンをインポートしてください",
    },
    en: {
      button: "Typography Preview",
      title: "Typography Preview",
      description: "Preview imported typography tokens",
      previewTab: "Preview",
      jsonTab: "JSON",
      closeButton: "Close",
      fullscreen: "Fullscreen",
      exitFullscreen: "Exit Fullscreen",
      noTokens: "No typography tokens available",
      importTokens: "Please import Figma tokens",
    },
  }

  const t = texts[language]

  const hasTokens = tokens && Object.keys(tokens).length > 0

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setIsOpen(true)}
        title={t.button}
      >
        <Type className="h-4 w-4" />
        <span>{t.button}</span>
      </Button>

      {isOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFullscreen ? "" : "bg-black/50"}`}>
          <div
            className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col ${
              isFullscreen ? "fixed inset-0" : "w-[90vw] max-w-4xl max-h-[90vh]"
            }`}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{t.title}</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={isFullscreen ? t.exitFullscreen : t.fullscreen}
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 overflow-auto flex-1">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="preview">{t.previewTab}</TabsTrigger>
                    <TabsTrigger value="json">{t.jsonTab}</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="preview">
                  {hasTokens ? (
                    <TypographyPreview tokens={tokens} />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 mb-2">{t.noTokens}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">{t.importTokens}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="json">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <pre className="text-xs overflow-auto max-h-[60vh]">
                      {JSON.stringify(tokens, null, 2) || t.noTokens}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                {t.closeButton}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
