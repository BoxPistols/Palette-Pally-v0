"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Code, Copy, Download } from "lucide-react"
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
import {
  generateCSSVariables,
  generateSCSSVariables,
  generateTailwindConfig,
  generateMaterialUITheme,
  generateTailwindClassMapping,
} from "@/lib/code-generators"
import type { ColorData } from "@/types/palette"

interface CodeExportPanelProps {
  colors: ColorData[]
  variations: Record<string, Record<string, string>>
  primaryColorIndex: number
}

export function CodeExportPanel({ colors, variations, primaryColorIndex }: CodeExportPanelProps) {
  const { language, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("css")

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: language === "jp" ? "コピー完了" : "Copy Complete",
          description: language === "jp" ? "コードをクリップボードにコピーしました" : "Code copied to clipboard",
        })
      },
      (err) => {
        console.error(
          language === "jp" ? "クリップボードへのコピーに失敗しました:" : "Failed to copy to clipboard:",
          err,
        )
        toast({
          title: language === "jp" ? "コピーエラー" : "Copy Error",
          description: language === "jp" ? "コードのコピーに失敗しました" : "Failed to copy code",
          variant: "destructive",
        })
      },
    )
  }

  // コードをファイルとしてダウンロード
  const handleDownloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 各種コード生成
  const cssCode = generateCSSVariables(colors, variations)
  const scssCode = generateSCSSVariables(colors, variations)
  const tailwindCode = generateTailwindConfig(colors, variations)
  const materialUICode = generateMaterialUITheme(colors, variations, primaryColorIndex)
  const tailwindClassMapping = generateTailwindClassMapping(colors, variations)

  // ファイル名マッピング
  const filenameMap = {
    css: "variables.css",
    scss: "variables.scss",
    tailwind: "tailwind.config.js",
    material: "theme.js",
    mapping: "tailwind-mapping.js",
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setIsOpen(true)}
        title={t("button.codeExport")}
      >
        <Code className="h-4 w-4" />
        <span>{t("button.codeExport")}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[960px] w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="sticky top-0 z-10 pb-4 border-b">
            <DialogTitle>{t("codeExport.title")}</DialogTitle>
            <DialogDescription>{t("codeExport.description")}</DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex-1 overflow-hidden flex flex-col"
          >
            <TabsList className="grid grid-cols-3 sm:grid-cols-5 mb-2">
              <TabsTrigger value="css">{t("codeExport.css")}</TabsTrigger>
              <TabsTrigger value="scss">{t("codeExport.scss")}</TabsTrigger>
              <TabsTrigger value="tailwind">{t("codeExport.tailwind")}</TabsTrigger>
              <TabsTrigger value="material">{t("codeExport.material")}</TabsTrigger>
              <TabsTrigger value="mapping">{t("codeExport.mapping")}</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              <TabsContent value="css" className="h-full flex flex-col">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto flex-1 min-h-[400px] text-sm font-mono">
                  <pre className="whitespace-pre">{cssCode}</pre>
                </div>
              </TabsContent>

              <TabsContent value="scss" className="h-full flex flex-col">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto flex-1 min-h-[400px] text-sm font-mono">
                  <pre className="whitespace-pre">{scssCode}</pre>
                </div>
              </TabsContent>

              <TabsContent value="tailwind" className="h-full flex flex-col">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto flex-1 min-h-[400px] text-sm font-mono">
                  <pre className="whitespace-pre">{tailwindCode}</pre>
                </div>
              </TabsContent>

              <TabsContent value="material" className="h-full flex flex-col">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto flex-1 min-h-[400px] text-sm font-mono">
                  <pre className="whitespace-pre">{materialUICode}</pre>
                </div>
              </TabsContent>

              <TabsContent value="mapping" className="h-full flex flex-col">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto flex-1 min-h-[400px] text-sm font-mono">
                  <pre className="whitespace-pre">{tailwindClassMapping}</pre>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="sticky bottom-0 z-10 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="mr-2">
              {t("codeExport.close")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const code =
                  activeTab === "css"
                    ? cssCode
                    : activeTab === "scss"
                      ? scssCode
                      : activeTab === "tailwind"
                        ? tailwindCode
                        : activeTab === "material"
                          ? materialUICode
                          : tailwindClassMapping

                handleDownloadCode(code, filenameMap[activeTab as keyof typeof filenameMap])
              }}
              className="mr-2 flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>{language === "jp" ? "ダウンロード" : "Download"}</span>
            </Button>
            <Button
              onClick={() =>
                handleCopyToClipboard(
                  activeTab === "css"
                    ? cssCode
                    : activeTab === "scss"
                      ? scssCode
                      : activeTab === "tailwind"
                        ? tailwindCode
                        : activeTab === "material"
                          ? materialUICode
                          : tailwindClassMapping,
                )
              }
              className="flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              {t("codeExport.copy")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
