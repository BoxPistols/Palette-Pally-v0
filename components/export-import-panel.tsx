"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import type { PaletteType } from "@/types/palette"

interface ExportImportPanelProps {
  data: PaletteType & { primaryColorIndex?: number }
  onImport: (data: PaletteType & { primaryColorIndex?: number }) => void
}

export function ExportImportPanel({ data, onImport }: ExportImportPanelProps) {
  const { language } = useLanguage()
  const [error, setError] = useState<string | null>(null)
  const [jsonPreview, setJsonPreview] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 翻訳テキスト - 言語コンテキストが機能するまでの一時的な対応
  const texts = {
    jp: {
      exportButton: "JSONエクスポート",
      importButton: "JSONインポート",
      exportTitle: "JSONエクスポート",
      exportDescription: "以下のJSONデータをエクスポートします。",
      downloadButton: "ダウンロード",
      exportSuccess: "エクスポート完了",
      exportSuccessDesc: "JSONファイルのダウンロードを開始しました",
      importError: "インポートエラー",
      parseError: "JSONファイルの解析に失敗しました。正しいフォーマットか確認してください。",
      readError: "ファイルの読み込みに失敗しました。",
    },
    en: {
      exportButton: "Export JSON",
      importButton: "Import JSON",
      exportTitle: "Export JSON",
      exportDescription: "Export the following JSON data.",
      downloadButton: "Download",
      exportSuccess: "Export Complete",
      exportSuccessDesc: "JSON file download started",
      importError: "Import Error",
      parseError: "Failed to parse JSON file. Please check the format.",
      readError: "Failed to read file.",
    },
  }

  const t = texts[language || "jp"]

  const prepareExport = () => {
    try {
      const jsonString = JSON.stringify(data, null, 2)
      setJsonPreview(jsonString)
      setError(null)
      setIsDialogOpen(true)
    } catch (err) {
      setError(language === "jp" ? "エクスポート準備中にエラーが発生しました。" : "Error preparing export.")
      console.error("Export preparation error:", err)
    }
  }

  const exportJSON = () => {
    try {
      const blob = new Blob([jsonPreview], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "palette-pally-export.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setError(null)
      setIsDialogOpen(false)

      toast({
        title: t.exportSuccess,
        description: t.exportSuccessDesc,
      })
    } catch (err) {
      setError(language === "jp" ? "エクスポート中にエラーが発生しました。" : "Error during export.")
      console.error("Export error:", err)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        if (typeof event.target?.result !== "string") {
          throw new Error(language === "jp" ? "ファイルの読み込みに失敗しました" : "Failed to read file")
        }

        const json = JSON.parse(event.target.result) as PaletteType & { primaryColorIndex?: number }
        onImport(json)
        setError(null)

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } catch (err) {
        setError(t.parseError)
        console.error("Error parsing JSON:", err)

        toast({
          title: t.importError,
          description: t.parseError,
          variant: "destructive",
        })
      }
    }
    reader.onerror = () => {
      setError(t.readError)
      toast({
        title: t.importError,
        description: t.readError,
        variant: "destructive",
      })
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 justify-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={prepareExport} variant="default" size="sm">
              {t.exportButton}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t.exportTitle}</DialogTitle>
              <DialogDescription>{t.exportDescription}</DialogDescription>
            </DialogHeader>
            <div className="max-h-[300px] overflow-auto bg-gray-50 p-2 rounded text-xs font-mono">
              <pre>{jsonPreview}</pre>
            </div>
            <DialogFooter>
              <Button onClick={exportJSON} type="submit">
                {t.downloadButton}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="relative">
          <Button variant="outline" size="sm" className="relative">
            {t.importButton}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
