"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FullscreenModal } from "@/components/fullscreen-modal"
import { useLanguage } from "@/contexts/language-context"
import { Download, Eye } from "lucide-react"

interface FigmaTokensPreviewModalProps {
  tokens: any
  onDownload: () => void
}

export function FigmaTokensPreviewModal({ tokens, onDownload }: FigmaTokensPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { language } = useLanguage()

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="flex items-center gap-1">
        <Eye className="h-4 w-4" />
        {language === "jp" ? "プレビュー" : "Preview"}
      </Button>

      <FullscreenModal
        title={language === "jp" ? "Figmaトークンプレビュー" : "Figma Tokens Preview"}
        description={
          language === "jp" ? "エクスポートする前にトークンを確認してください" : "Review your tokens before exporting"
        }
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className="space-y-4">
          <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto max-h-[500px]">
            {JSON.stringify(tokens, null, 2)}
          </pre>

          <div className="flex justify-end">
            <Button
              onClick={() => {
                onDownload()
                setIsOpen(false)
              }}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              {language === "jp" ? "ダウンロード" : "Download"}
            </Button>
          </div>
        </div>
      </FullscreenModal>
    </>
  )
}
