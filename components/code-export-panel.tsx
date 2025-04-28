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
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("css")

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "コピー完了",
          description: "コードをクリップボードにコピーしました",
        })
      },
      (err) => {
        console.error("クリップボードへのコピーに失敗しました:", err)
        toast({
          title: "コピーエラー",
          description: "コードのコピーに失敗しました",
          variant: "destructive",
        })
      },
    )
  }

  // 各種コード生成
  const cssCode = generateCSSVariables(colors, variations)
  const scssCode = generateSCSSVariables(colors, variations)
  const tailwindCode = generateTailwindConfig(colors, variations)
  const materialUICode = generateMaterialUITheme(colors, variations, primaryColorIndex)
  const tailwindClassMapping = generateTailwindClassMapping(colors, variations)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setIsOpen(true)}
        title="コード出力"
      >
        <Code className="h-4 w-4" />
        <span>コード出力</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[960px] w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
            <DialogTitle>コード出力</DialogTitle>
            <DialogDescription>
              カラーパレットを様々な形式のコードとして出力できます。必要な形式を選択してください。
            </DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex-1 overflow-hidden flex flex-col"
          >
            <TabsList className="grid grid-cols-3 sm:grid-cols-5 mb-2">
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="scss">SCSS</TabsTrigger>
              <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
              <TabsTrigger value="material">Material UI</TabsTrigger>
              <TabsTrigger value="mapping">クラスマッピング</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              <TabsContent value="css" className="h-full flex flex-col">
                <div className="bg-gray-50 p-4 rounded-md overflow-auto flex-1 min-h-[400px] text-sm font-mono">
                  <pre className="whitespace-pre">{cssCode}</pre>
                </div>
              </TabsContent>

              <TabsContent value="scss" className="h-full flex flex-col">
                <div className="bg-gray-50 p-4 rounded-md overflow-auto flex-1 min-h-[400px] text-sm font-mono">
                  <pre className="whitespace-pre">{scssCode}</pre>
                </div>
              </TabsContent>

              <TabsContent value="tailwind" className="h-full flex flex-col">
                <div className="bg-gray-50 p-4 rounded-md overflow-auto flex-1 min-h-[400px] text-sm font-mono">
                  <pre className="whitespace-pre">{tailwindCode}</pre>
                </div>
              </TabsContent>

              <TabsContent value="material" className="h-full flex flex-col">
                <div className="bg-gray-50 p-4 rounded-md overflow-auto flex-1 min-h-[400px] text-sm font-mono">
                  <pre className="whitespace-pre">{materialUICode}</pre>
                </div>
              </TabsContent>

              <TabsContent value="mapping" className="h-full flex flex-col">
                <div className="bg-gray-50 p-4 rounded-md overflow-auto flex-1 min-h-[400px] text-sm font-mono">
                  <pre className="whitespace-pre">{tailwindClassMapping}</pre>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="sticky bottom-0 bg-white z-10 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="mr-2">
              閉じる
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
            >
              コピー
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
