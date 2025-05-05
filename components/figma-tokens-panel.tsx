"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Figma } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import type { ColorData } from "@/types/palette"

interface FigmaTokensPanelProps {
  colors: ColorData[]
  onImport: (colors: ColorData[]) => void
}

export function FigmaTokensPanel({ colors, onImport }: FigmaTokensPanelProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [jsonPreview, setJsonPreview] = useState<string>("")
  const [importJson, setImportJson] = useState<string>("")
  const [activeTab, setActiveTab] = useState("export")

  // 翻訳テキスト - 言語コンテキストが機能するまでの一時的な対応
  const texts = {
    jp: {
      button: "Figmaトークン",
      title: "Figmaデザイントークン",
      description: "Figmaのデザイントークンをエクスポート/インポートできます",
      exportTab: "エクスポート",
      importTab: "インポート",
      exportDescription: "以下のJSONをFigmaのデザイントークンマネージャーにインポートできます",
      importDescription: "Figmaからエクスポートしたデザイントークンを貼り付けてください",
      importPlaceholder: "JSONをここに貼り付け...",
      copyButton: "コピー",
      importButton: "インポート",
      closeButton: "閉じる",
      copySuccess: "JSONをクリップボードにコピーしました",
      copyError: "コピーに失敗しました",
      importSuccess: "デザイントークンをインポートしました",
      importError: "インポートに失敗しました。JSONの形式を確認してください",
      invalidJson: "無効なJSONです。形式を確認してください",
    },
    en: {
      button: "Figma Tokens",
      title: "Figma Design Tokens",
      description: "Export and import design tokens for Figma",
      exportTab: "Export",
      importTab: "Import",
      exportDescription: "You can import the following JSON into Figma Design Tokens Manager",
      importDescription: "Paste design tokens exported from Figma",
      importPlaceholder: "Paste JSON here...",
      copyButton: "Copy",
      importButton: "Import",
      closeButton: "Close",
      copySuccess: "JSON copied to clipboard",
      copyError: "Failed to copy",
      importSuccess: "Design tokens imported",
      importError: "Import failed. Please check the JSON format",
      invalidJson: "Invalid JSON. Please check the format",
    },
  }

  const t = texts[language || "jp"]

  // Figmaデザイントークン形式に変換
  const generateFigmaTokens = () => {
    const tokens: Record<string, any> = {}

    // 基本カラー
    colors.forEach((color) => {
      const name = color.role || color.name

      // ロールに基づいて階層構造を作成
      if (name.includes("/")) {
        // スラッシュで区切られた階層構造を処理
        const parts = name.split("/")
        let current = tokens

        // 最後の部分以外を階層として処理
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {}
          }
          current = current[parts[i]]
        }

        // 最後の部分をトークンとして設定
        current[parts[parts.length - 1]] = {
          $type: "color",
          $value: color.value,
        }
      } else {
        // 通常のフラットな構造
        tokens[name] = {
          $type: "color",
          $value: color.value,
        }
      }
    })

    // common.white, common.blackを追加
    tokens.common = {
      white: {
        $type: "color",
        $value: "#ffffff",
      },
      black: {
        $type: "color",
        $value: "#000000",
      },
    }

    return JSON.stringify(tokens, null, 2)
  }

  // エクスポート用JSONを生成
  const handlePrepareExport = () => {
    try {
      const tokensJson = generateFigmaTokens()
      setJsonPreview(tokensJson)
      setActiveTab("export")
      setIsOpen(true)
    } catch (error) {
      console.error("Error generating Figma tokens:", error)
      toast({
        title: language === "jp" ? "エクスポートエラー" : "Export Error",
        variant: "destructive",
      })
    }
  }

  // クリップボードにコピー
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonPreview).then(
      () => {
        toast({
          title: t.copySuccess,
        })
      },
      (err) => {
        console.error("Failed to copy:", err)
        toast({
          title: t.copyError,
          variant: "destructive",
        })
      },
    )
  }

  // 再帰的にネストされたトークンを処理する関数
  const processNestedTokens = (tokens: any, prefix = ""): ColorData[] => {
    const result: ColorData[] = []

    // トークンがオブジェクトでない場合は処理しない
    if (!tokens || typeof tokens !== "object") {
      return result
    }

    // オブジェクトの各キーを処理
    Object.entries(tokens).forEach(([key, value]: [string, any]) => {
      // common配下のトークンをスキップ
      if (key === "common" && prefix === "") return

      const currentPath = prefix ? `${prefix}/${key}` : key

      // 直接colorトークンの場合
      if (value && value.$type === "color" && value.$value) {
        result.push({
          name: currentPath,
          value: value.$value,
          role: prefix ? (prefix as any) : (key as any), // roleとして使用
        })
      }
      // ネストされたトークンの場合
      else if (value && typeof value === "object" && !value.$type) {
        // 再帰的に処理
        const nestedTokens = processNestedTokens(value, currentPath)
        result.push(...nestedTokens)
      }
    })

    return result
  }

  // インポート処理
  const handleImport = () => {
    try {
      if (!importJson.trim()) {
        return
      }

      const tokens = JSON.parse(importJson)
      const newColors = processNestedTokens(tokens)

      if (newColors.length > 0) {
        onImport(newColors)
        setIsOpen(false)
        toast({
          title: t.importSuccess,
        })
      } else {
        toast({
          title: t.importError,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: t.invalidJson,
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handlePrepareExport}
        title={t.button}
      >
        <Figma className="h-4 w-4" />
        <span>{t.button}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={`max-w-[700px] w-[90vw] max-h-[85vh] overflow-hidden flex flex-col ${theme === "dark" ? "dark bg-gray-900 text-white" : ""}`}
        >
          <DialogHeader>
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>{t.description}</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="export">{t.exportTab}</TabsTrigger>
              <TabsTrigger value="import">{t.importTab}</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden flex flex-col">
              <TabsContent value="export" className="h-full flex-1 flex flex-col overflow-hidden mt-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t.exportDescription}</p>
                <div
                  className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} p-4 rounded-md overflow-auto flex-1 min-h-[300px] text-sm font-mono`}
                >
                  <pre className="whitespace-pre">{jsonPreview}</pre>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleCopyToClipboard}>{t.copyButton}</Button>
                </div>
              </TabsContent>

              <TabsContent value="import" className="h-full flex-1 flex flex-col overflow-hidden mt-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t.importDescription}</p>
                <textarea
                  className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-50"} p-4 rounded-md overflow-auto flex-1 min-h-[300px] text-sm font-mono resize-none`}
                  placeholder={t.importPlaceholder}
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleImport}>{t.importButton}</Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="mt-4 pt-4 border-t dark:border-gray-700">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t.closeButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
