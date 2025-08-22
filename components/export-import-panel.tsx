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
import { useLanguage } from "@/lib/language-context"

interface ExportImportPanelProps {
  data: PaletteType
  onImport: (data: PaletteType) => void
}

export function ExportImportPanel({ data, onImport }: ExportImportPanelProps) {
  const [error, setError] = useState<string | null>(null)
  const [jsonPreview, setJsonPreview] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { language } = useLanguage()

  const prepareExport = () => {
    try {
      const jsonString = JSON.stringify(data, null, 2)
      setJsonPreview(jsonString)
      setError(null)
      setIsDialogOpen(true)
    } catch (err) {
      setError(language === "ja" 
        ? "エクスポート準備中にエラーが発生しました。" 
        : "An error occurred while preparing the export."
      )
      console.error("Export preparation error:", err)
    }
  }

  const exportJSON = () => {
    try {
      // 現在の日時を取得してフォーマット (YYMMDD形式)
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2); // 年の下2桁
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 月（01-12）
      const day = String(now.getDate()).padStart(2, '0'); // 日（01-31）
      const formattedDate = `${year}${month}${day}`;

      // 日時を含むファイル名を生成
      const fileName = `palette-pally-${formattedDate}.json`;

      const blob = new Blob([jsonPreview], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; // 日時を含むファイル名を使用
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setError(null);
      setIsDialogOpen(false);

      toast({
        title: language === "ja" ? "エクスポート完了" : "Export Complete",
        description: language === "ja" 
          ? `${fileName} のダウンロードを開始しました` 
          : `Download of ${fileName} has started`,
        className: "toast-small",
      });
    } catch (err) {
      setError(language === "ja" 
        ? "エクスポート中にエラーが発生しました。" 
        : "An error occurred during export."
      );
      console.error("Export error:", err);
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        if (typeof event.target?.result !== "string") {
          throw new Error(language === "ja" 
            ? "ファイルの読み込みに失敗しました" 
            : "Failed to read the file"
          )
        }

        const json = JSON.parse(event.target.result) as PaletteType
        onImport(json)
        setError(null)

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } catch (err) {
        const errorMsg = language === "ja" 
          ? "JSONファイルの解析に失敗しました。正しいフォーマットか確認してください。"
          : "Failed to parse JSON file. Please check if the format is correct."
        setError(errorMsg)
        console.error("Error parsing JSON:", err)

        toast({
          title: language === "ja" ? "インポートエラー" : "Import Error",
          description: errorMsg,
          variant: "destructive",
          className: "toast-small",
        })
      }
    }
    reader.onerror = () => {
      const errorMsg = language === "ja" 
        ? "ファイルの読み込みに失敗しました。"
        : "Failed to read the file."
      setError(errorMsg)
      toast({
        title: language === "ja" ? "インポートエラー" : "Import Error",
        description: errorMsg,
        variant: "destructive",
        className: "toast-small",
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
              {language === "ja" ? "JSON出力" : "Export JSON"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{language === "ja" ? "JSON出力" : "Export JSON"}</DialogTitle>
              <DialogDescription>
                {language === "ja" 
                  ? "以下のJSONデータをエクスポートします。" 
                  : "Export the following JSON data."}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-auto bg-gray-50 p-4 rounded text-xs font-mono">
              <pre>{jsonPreview}</pre>
            </div>
            <DialogFooter>
              <Button onClick={exportJSON} type="submit">
                {language === "ja" ? "ダウンロード" : "Download"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="relative">
          <Button variant="outline" size="sm" className="relative">
            {language === "ja" ? "JSON取込" : "Import JSON"}
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
