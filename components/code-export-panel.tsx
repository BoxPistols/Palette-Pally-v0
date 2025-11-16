"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Code } from "lucide-react"
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
import { useModalState } from "@/hooks/use-modal-state"
import type { ColorData } from "@/types/palette"
import {
  generateCSSVariables,
  generateSCSSVariables,
  generateTailwindConfig,
  generateMaterialTheme,
  generateStyledComponents,
  generateChakraTheme,
  generateCSSModule,
} from "@/lib/code-generators"

interface CodeExportPanelProps {
  colors: ColorData[]
  variations: Record<string, Record<string, string>>
  primaryColorIndex: number
}

export function CodeExportPanel({ colors, variations, primaryColorIndex }: CodeExportPanelProps) {
  const { language } = useLanguage()
  const { isOpen, open, close } = useModalState(false)
  const [activeTab, setActiveTab] = useState("css")

  // 翻訳テキスト
  const texts = {
    jp: {
      button: "コードエクスポート",
      title: "コードエクスポート",
      description: "カラーパレットをさまざまな形式でエクスポートします",
      css: "CSS変数",
      scss: "SCSS変数",
      tailwind: "Tailwind CSS",
      material: "Material UI",
      styled: "styled-components",
      chakra: "Chakra UI",
      cssModule: "CSS Modules",
      copy: "コピー",
      close: "閉じる",
      copySuccess: "コピーしました",
      copyError: "コピーに失敗しました",
    },
    en: {
      button: "Code Export",
      title: "Code Export",
      description: "Export your color palette in various formats",
      css: "CSS Variables",
      scss: "SCSS Variables",
      tailwind: "Tailwind CSS",
      material: "Material UI",
      styled: "styled-components",
      chakra: "Chakra UI",
      cssModule: "CSS Modules",
      copy: "Copy",
      close: "Close",
      copySuccess: "Copied to clipboard",
      copyError: "Failed to copy",
    },
  }

  const t = texts[language]

  // コードをクリップボードにコピー
  const copyToClipboard = (code: string) => {
    try {
      navigator.clipboard.writeText(code)
      toast({
        title: t.copySuccess,
        description: "",
      })
    } catch (error) {
      console.error("Copy error:", error)
      toast({
        title: t.copyError,
        description: "",
        variant: "destructive",
      })
    }
  }

  // 各形式のコードを生成
  const cssCode = generateCSSVariables(colors, variations, primaryColorIndex)
  const scssCode = generateSCSSVariables(colors, variations, primaryColorIndex)
  const tailwindCode = generateTailwindConfig(colors, variations, primaryColorIndex)
  const materialCode = generateMaterialTheme(colors, variations, primaryColorIndex)
  const styledCode = generateStyledComponents(colors, variations, primaryColorIndex)
  const chakraCode = generateChakraTheme(colors, variations, primaryColorIndex)
  const cssModuleCode = generateCSSModule(colors, variations, primaryColorIndex)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={open}
        title={t.button}
      >
        <Code className="h-4 w-4" />
        <span>{t.button}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent className="max-w-[800px] w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="sticky top-0 z-10 pb-4 border-b">
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>{t.description}</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid grid-cols-3 sm:grid-cols-7 mb-4 px-4">
              <TabsTrigger value="css">{t.css}</TabsTrigger>
              <TabsTrigger value="scss">{t.scss}</TabsTrigger>
              <TabsTrigger value="tailwind">{t.tailwind}</TabsTrigger>
              <TabsTrigger value="material">{t.material}</TabsTrigger>
              <TabsTrigger value="styled">{t.styled}</TabsTrigger>
              <TabsTrigger value="chakra">{t.chakra}</TabsTrigger>
              <TabsTrigger value="cssModule">{t.cssModule}</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto px-4">
              <TabsContent value="css" className="mt-0 p-0 h-full">
                <div className="relative">
                  <pre className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md overflow-auto max-h-[400px] text-sm">
                    <code>{cssCode}</code>
                  </pre>
                  <Button size="sm" className="absolute top-2 right-2" onClick={() => copyToClipboard(cssCode)}>
                    {t.copy}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="scss" className="mt-0 p-0 h-full">
                <div className="relative">
                  <pre className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md overflow-auto max-h-[400px] text-sm">
                    <code>{scssCode}</code>
                  </pre>
                  <Button size="sm" className="absolute top-2 right-2" onClick={() => copyToClipboard(scssCode)}>
                    {t.copy}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="tailwind" className="mt-0 p-0 h-full">
                <div className="relative">
                  <pre className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md overflow-auto max-h-[400px] text-sm">
                    <code>{tailwindCode}</code>
                  </pre>
                  <Button size="sm" className="absolute top-2 right-2" onClick={() => copyToClipboard(tailwindCode)}>
                    {t.copy}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="material" className="mt-0 p-0 h-full">
                <div className="relative">
                  <pre className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md overflow-auto max-h-[400px] text-sm">
                    <code>{materialCode}</code>
                  </pre>
                  <Button size="sm" className="absolute top-2 right-2" onClick={() => copyToClipboard(materialCode)}>
                    {t.copy}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="styled" className="mt-0 p-0 h-full">
                <div className="relative">
                  <pre className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md overflow-auto max-h-[400px] text-sm">
                    <code>{styledCode}</code>
                  </pre>
                  <Button size="sm" className="absolute top-2 right-2" onClick={() => copyToClipboard(styledCode)}>
                    {t.copy}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="chakra" className="mt-0 p-0 h-full">
                <div className="relative">
                  <pre className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md overflow-auto max-h-[400px] text-sm">
                    <code>{chakraCode}</code>
                  </pre>
                  <Button size="sm" className="absolute top-2 right-2" onClick={() => copyToClipboard(chakraCode)}>
                    {t.copy}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="cssModule" className="mt-0 p-0 h-full">
                <div className="relative">
                  <pre className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md overflow-auto max-h-[400px] text-sm">
                    <code>{cssModuleCode}</code>
                  </pre>
                  <Button size="sm" className="absolute top-2 right-2" onClick={() => copyToClipboard(cssModuleCode)}>
                    {t.copy}
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="sticky bottom-0 z-10 pt-4 border-t mt-4">
            <Button onClick={close}>{t.close}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
