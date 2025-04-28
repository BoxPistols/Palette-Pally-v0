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
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>コード出力</DialogTitle>
            <DialogDescription>
              カラーパレットを様々な形式のコードとして出力できます。必要な形式を選択してください。
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full overflow-hidden">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="scss">SCSS</TabsTrigger>
              <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
              <TabsTrigger value="material">Material UI</TabsTrigger>
              <TabsTrigger value="mapping">クラスマッピング</TabsTrigger>
            </TabsList>

            <div className="mt-4 overflow-hidden flex flex-col h-[calc(100%-2rem)]">
              <TabsContent value="css" className="flex-1 overflow-hidden flex flex-col">
                <div className="bg-gray-50 p-4 rounded-md overflow-auto flex-1">
                  <pre className="text-sm font-mono whitespace-pre">{cssCode}</pre>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => handleCopyToClipboard(cssCode)}>コピー</Button>
                </div>
              </TabsContent>

              <TabsContent value="scss" className="flex-1 overflow-hidden flex flex-col">
                <div className="bg-gray-50 p-4 rounded-md overflow-auto flex-1">
                  <pre className="text-sm font-mono whitespace-pre">{scssCode}</pre>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => handleCopyToClipboard(scssCode)}>コピー</Button>
                </div>
              </TabsContent>

              <TabsContent value="tailwind" className="flex-1 overflow-hidden flex flex-col">
                <div className="bg-gray-50 p-4 rounded-md overflow-auto flex-1">
                  <pre className="text-sm font-mono whitespace-pre">{tailwindCode}</pre>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => handleCopyToClipboard(tailwindCode)}>コピー</Button>
                </div>
              </TabsContent>

              <TabsContent value="material" className="flex-1 overflow-hidden flex flex-col">
                <div className="bg-gray-50 p-4 rounded-md overflow-auto flex-1">
                  <pre className="text-sm font-mono whitespace-pre">{materialUICode}</pre>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => handleCopyToClipboard(materialUICode)}>コピー</Button>
                </div>
              </TabsContent>

              <TabsContent value="mapping" className="flex-1 overflow-hidden flex flex-col">
                <div className="bg-gray-50 p-4 rounded-md overflow-auto flex-1">
                  <pre className="text-sm font-mono whitespace-pre">{tailwindClassMapping}</pre>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => handleCopyToClipboard(tailwindClassMapping)}>コピー</Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
