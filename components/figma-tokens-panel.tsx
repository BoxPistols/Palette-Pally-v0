"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Figma } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/hooks/use-language"
import { FigmaTokensPreviewModal } from "./figma-tokens-preview-modal"
import { extractColorsFromFigmaTokens } from "@/lib/figma-token-parser"
import type { ColorData } from "@/types/palette"

interface FigmaTokensPanelProps {
  colors: ColorData[]
  onImport: (colors: ColorData[]) => void
}

export function FigmaTokensPanel({ colors, onImport }: FigmaTokensPanelProps) {
  const { language, t } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tokenData, setTokenData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsedData = JSON.parse(content)
        setTokenData(parsedData)
        setIsModalOpen(true)
      } catch (error) {
        console.error("Error parsing JSON:", error)
        toast({
          title: t("toast.error"),
          description: language === "jp" ? "JSONの解析に失敗しました" : "Failed to parse JSON",
          variant: "destructive",
        })
      }
    }

    reader.onerror = () => {
      toast({
        title: t("toast.error"),
        description: language === "jp" ? "ファイルの読み込みに失敗しました" : "Failed to read file",
        variant: "destructive",
      })
    }

    reader.readAsText(file)
  }

  const handleImport = () => {
    try {
      if (!tokenData) {
        toast({
          title: t("toast.error"),
          description: language === "jp" ? "トークンデータがありません" : "No token data available",
          variant: "destructive",
        })
        return
      }

      // Figmaトークンからカラーデータを抽出
      const extractedColors = extractColorsFromFigmaTokens(tokenData)

      // 抽出したカラーデータをColorData[]形式に変換
      const newColors: ColorData[] = Object.entries(extractedColors).map(([name, value]) => {
        // valueがオブジェクトの場合（primary, secondaryなど）
        if (typeof value === "object" && value.main) {
          return {
            name,
            value: value.main,
            role: name === "primary" ? "primary" : name === "secondary" ? "secondary" : undefined,
          }
        }
        // valueが文字列の場合（単色）
        return {
          name,
          value: typeof value === "string" ? value : "#cccccc",
        }
      })

      if (newColors.length > 0) {
        onImport(newColors)
        setIsModalOpen(false)
        toast({
          title: t("toast.importComplete"),
          description:
            language === "jp"
              ? `${newColors.length}色のパレットをインポートしました`
              : `Imported palette with ${newColors.length} colors`,
        })
      } else {
        throw new Error(language === "jp" ? "カラーデータが見つかりませんでした" : "No color data found")
      }
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: t("toast.importError"),
        description:
          error instanceof Error
            ? error.message
            : language === "jp"
              ? "不明なエラーが発生しました"
              : "Unknown error occurred",
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
        onClick={() => fileInputRef.current?.click()}
        title={language === "jp" ? "Figmaトークンをインポート" : "Import Figma Tokens"}
      >
        <Figma className="h-4 w-4" />
        <span>{language === "jp" ? "Figmaトークン" : "Figma Tokens"}</span>
      </Button>

      <input type="file" ref={fileInputRef} accept=".json" onChange={handleFileUpload} className="hidden" />

      <FigmaTokensPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tokens={tokenData}
        title={language === "jp" ? "Figmaトークンプレビュー" : "Figma Tokens Preview"}
      />
    </>
  )
}
