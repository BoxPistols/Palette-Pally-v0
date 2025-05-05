"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Figma, Upload, Download } from "lucide-react"
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
import type { ColorData } from "@/types/palette"

interface FigmaTokensPanelProps {
  colors: ColorData[]
  onImport: (colors: ColorData[]) => void
}

export function FigmaTokensPanel({ colors, onImport }: FigmaTokensPanelProps) {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [jsonPreview, setJsonPreview] = useState<string>("")
  const [importJson, setImportJson] = useState<string>("")
  const [activeTab, setActiveTab] = useState("export")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 翻訳テキスト
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
      downloadJson: "JSONをダウンロード",
      uploadJson: "JSONをアップロード",
      dropJsonHere: "JSONファイルをここにドロップ",
      orClickToUpload: "またはクリックしてアップロード",
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
      downloadJson: "Download JSON",
      uploadJson: "Upload JSON",
      dropJsonHere: "Drop JSON file here",
      orClickToUpload: "or click to upload",
    },
  }

  const translation = texts[language]

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
          title: translation.copySuccess,
        })
      },
      (err) => {
        console.error("Failed to copy:", err)
        toast({
          title: translation.copyError,
          variant: "destructive",
        })
      },
    )
  }

  // JSONをダウンロード
  const handleDownloadJson = () => {
    const blob = new Blob([jsonPreview], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "figma-tokens.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // ファイルアップロードを処理
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        setImportJson(content)
      } catch (error) {
        console.error("Error reading file:", error)
        toast({
          title: translation.importError,
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  // ドラッグ&ドロップを処理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files[0]
    if (!file || file.type !== "application/json") {
      toast({
        title: language === "jp" ? "JSONファイルのみ対応しています" : "Only JSON files are supported",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        setImportJson(content)
      } catch (error) {
        console.error("Error reading file:", error)
        toast({
          title: translation.importError,
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
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
      const currentPath = prefix ? `${prefix}/${key}` : key

      // 直接colorトークンの場合
      if (value && value.$type === "color" && value.$value) {
        result.push({
          name: currentPath,
          value: value.$value,
          role: prefix ? undefined : (key as any), // roleとして使用（ネストされている場合はroleを設定しない）
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
          title: translation.importSuccess,
        })
      } else {
        toast({
          title: translation.importError,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: translation.invalidJson,
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
        title={translation.button}
      >
        <Figma className="h-4 w-4" />
        <span>{translation.button}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[700px] w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{translation.title}</DialogTitle>
            <DialogDescription>{translation.description}</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="export">{translation.exportTab}</TabsTrigger>
              <TabsTrigger value="import">{translation.importTab}</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden flex flex-col">
              <TabsContent value="export" className="h-full flex-1 flex flex-col overflow-hidden mt-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{translation.exportDescription}</p>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto flex-1 min-h-[300px] text-sm font-mono">
                  <pre className="whitespace-pre">{jsonPreview}</pre>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={handleDownloadJson} className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {translation.downloadJson}
                  </Button>
                  <Button onClick={handleCopyToClipboard}>{translation.copyButton}</Button>
                </div>
              </TabsContent>

              <TabsContent value="import" className="h-full flex-1 flex flex-col overflow-hidden mt-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{translation.importDescription}</p>
                <div className="flex-1 flex flex-col min-h-[300px]" onDragOver={handleDragOver} onDrop={handleDrop}>
                  <textarea
                    className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto flex-1 text-sm font-mono resize-none"
                    placeholder={translation.importPlaceholder}
                    value={importJson}
                    onChange={(e) => setImportJson(e.target.value)}
                  />
                  <div className="mt-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1"
                    >
                      <Upload className="h-4 w-4" />
                      {translation.uploadJson}
                    </Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {translation.dropJsonHere} {translation.orClickToUpload}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleImport}>{translation.importButton}</Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="mt-4 pt-4 border-t dark:border-gray-700">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {translation.closeButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
