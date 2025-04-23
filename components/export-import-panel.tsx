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
import type { PaletteType } from "@/types/palette"

interface ExportImportPanelProps {
  data: PaletteType
  onImport: (data: PaletteType) => void
}

export function ExportImportPanel({ data, onImport }: ExportImportPanelProps) {
  const [error, setError] = useState<string | null>(null)
  const [jsonPreview, setJsonPreview] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const prepareExport = () => {
    try {
      const jsonString = JSON.stringify(data, null, 2)
      setJsonPreview(jsonString)
      setError(null)
      setIsDialogOpen(true)
    } catch (err) {
      setError("エクスポート準備中にエラーが発生しました。")
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
        title: "エクスポート完了",
        description: "JSONファイルのダウンロードを開始しました",
      })
    } catch (err) {
      setError("エクスポート中にエラーが発生しました。")
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
          throw new Error("ファイルの読み込みに失敗しました")
        }

        const json = JSON.parse(event.target.result) as PaletteType
        onImport(json)
        setError(null)

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } catch (err) {
        setError("JSONファイルの解析に失敗しました。正しいフォーマットか確認してください。")
        console.error("Error parsing JSON:", err)

        toast({
          title: "インポートエラー",
          description: "JSONファイルの解析に失敗しました。正しいフォーマットか確認してください。",
          variant: "destructive",
        })
      }
    }
    reader.onerror = () => {
      setError("ファイルの読み込みに失敗しました。")
      toast({
        title: "インポートエラー",
        description: "ファイルの読み込みに失敗しました。",
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
              Export JSON
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Export JSON</DialogTitle>
              <DialogDescription>以下のJSONデータをエクスポートします。</DialogDescription>
            </DialogHeader>
            <div className="max-h-[300px] overflow-auto bg-gray-50 p-2 rounded text-xs font-mono">
              <pre>{jsonPreview}</pre>
            </div>
            <DialogFooter>
              <Button onClick={exportJSON} type="submit">
                ダウンロード
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="relative">
          <Button variant="outline" size="sm" className="relative">
            Import JSON
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
