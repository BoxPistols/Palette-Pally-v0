"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Type, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/hooks/use-language"
import { TypographyPreview } from "./typography-preview"

interface TypographyValue {
  fontFamily: string
  fontSize: string
  fontWeight: number
  letterSpacing: string
  lineHeight: string
  textTransform: string
  textDecoration: string
}

interface TypographyToken {
  $type: string
  $value: TypographyValue
  $description?: string
}

export function TypographyPanel() {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [typographyTokens, setTypographyTokens] = useState<Record<string, TypographyToken>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 翻訳テキスト
  const texts = {
    jp: {
      button: "タイポグラフィ",
      title: "タイポグラフィトークン",
      description: "Figmaからエクスポートしたタイポグラフィトークンを表示します",
      uploadButton: "JSONをアップロード",
      dropJsonHere: "JSONファイルをここにドロップ",
      orClickToUpload: "またはクリックしてアップロード",
      closeButton: "閉じる",
      importError: "インポートに失敗しました。JSONの形式を確認してください",
      invalidJson: "無効なJSONです。形式を確認してください",
      noTypography: "タイポグラフィトークンがありません",
    },
    en: {
      button: "Typography",
      title: "Typography Tokens",
      description: "View typography tokens exported from Figma",
      uploadButton: "Upload JSON",
      dropJsonHere: "Drop JSON file here",
      orClickToUpload: "or click to upload",
      closeButton: "Close",
      importError: "Import failed. Please check the JSON format",
      invalidJson: "Invalid JSON. Please check the format",
      noTypography: "No typography tokens available",
    },
  }

  const t = texts[language]

  // ファイルアップロードを処理
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        processImportedJson(content)
      } catch (error) {
        console.error("Error reading file:", error)
        toast({
          title: t.importError,
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
        processImportedJson(content)
      } catch (error) {
        console.error("Error reading file:", error)
        toast({
          title: t.importError,
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  // インポートされたJSONを処理する
  const processImportedJson = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString)

      // マニフェストファイルかどうかを確認
      if (data.collections || data.styles) {
        toast({
          title: language === "jp" ? "マニフェストファイルが検出されました" : "Manifest file detected",
          description:
            language === "jp"
              ? "個別のトークンファイルをアップロードしてください"
              : "Please upload individual token files",
        })
        return
      }

      // タイポグラフィトークンを抽出
      const tokens = extractTypographyTokens(data)

      if (Object.keys(tokens).length > 0) {
        setTypographyTokens(tokens)
        toast({
          title: language === "jp" ? "タイポグラフィトークンを検出しました" : "Typography tokens detected",
          description: `${Object.keys(tokens).length} ${language === "jp" ? "個のトークンを読み込みました" : "tokens loaded"}`,
        })
      } else {
        toast({
          title: t.noTypography,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error processing JSON:", error)
      toast({
        title: t.invalidJson,
        variant: "destructive",
      })
    }
  }

  // タイポグラフィトークンを抽出
  const extractTypographyTokens = (data: any, prefix = ""): Record<string, TypographyToken> => {
    const result: Record<string, TypographyToken> = {}

    if (!data || typeof data !== "object") return result

    for (const key in data) {
      const currentPath = prefix ? `${prefix}/${key}` : key

      if (data[key]?.$type === "typography") {
        result[currentPath] = data[key]
      } else if (typeof data[key] === "object") {
        const nestedTokens = extractTypographyTokens(data[key], currentPath)
        Object.assign(result, nestedTokens)
      }
    }

    return result
  }

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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[900px] w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>{t.description}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            {Object.keys(typographyTokens).length === 0 ? (
              <div
                className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md text-center mb-4 flex-1 flex flex-col items-center justify-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input type="file" ref={fileInputRef} accept=".json" onChange={handleFileUpload} className="hidden" />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1"
                >
                  <Upload className="h-4 w-4" />
                  {t.uploadButton}
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {t.dropJsonHere} {t.orClickToUpload}
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-auto p-4">
                <TypographyPreview tokens={typographyTokens} />
              </div>
            )}
          </div>

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
