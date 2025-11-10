"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle, Palette, Save, FileJson, Contrast, Sparkles } from "lucide-react"

export function HelpModal() {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 rounded-full border-blue-200 bg-blue-50 hover:bg-blue-100"
          title="ヘルプ"
        >
          <HelpCircle className="h-4 w-4 text-blue-500" />
          <span className="text-blue-600">ヘルプ</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Palette Pally - MUI Color Generator</DialogTitle>
          <DialogDescription>Material-UI公式のカラーシステムに準拠したカラーパレットジェネレーター</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="mui-system">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="mui-system">MUIシステム</TabsTrigger>
            <TabsTrigger value="usage">使い方</TabsTrigger>
            <TabsTrigger value="export">エクスポート</TabsTrigger>
          </TabsList>

          <TabsContent value="mui-system" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Palette className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">6つのカラーロール</h3>
                  <p className="text-sm text-muted-foreground">
                    MUIの標準カラーシステムに基づく6つの役割：
                    <br />• <strong>Primary</strong>: 主要なUI要素
                    <br />• <strong>Secondary</strong>: 副次的なUI要素
                    <br />• <strong>Error</strong>: エラーや警告すべき要素
                    <br />• <strong>Warning</strong>: 潜在的に危険なアクション
                    <br />• <strong>Info</strong>: 中立的な情報
                    <br />• <strong>Success</strong>: 成功の表示
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">4つのカラートークン</h3>
                  <p className="text-sm text-muted-foreground">
                    各カラーロールには4つのバリエーションが自動生成されます：
                    <br />• <strong>main</strong>: メインの色調（あなたが選択）
                    <br />• <strong>light</strong>: mainより明るい色調（自動生成）
                    <br />• <strong>dark</strong>: mainより暗い色調（自動生成）
                    <br />• <strong>contrastText</strong>: mainに対して最適なコントラストを持つテキスト色（自動計算）
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Palette className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">カラーの選択</h3>
                  <p className="text-sm text-muted-foreground">
                    左側のパネルで各カラーロールのmain色を選択・編集できます。
                    カラーピッカーを使用するか、HEX、RGB、HSLの値を直接入力できます。
                    light、dark、contrastTextは自動的に生成されます。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Contrast className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">アクセシビリティチェック</h3>
                  <p className="text-sm text-muted-foreground">
                    各カラーのコントラスト比とWCAGレベル（AAA、AA、A、Fail）が自動的に表示されます。
                    <br />• AAA（7.0:1以上）: 最高レベル
                    <br />• AA（4.5:1以上）: 標準要件
                    <br />• A（3.0:1以上）: 最低限の要件
                    <br />• Fail（3.0:1未満）: 要件を満たさない
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Save className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">保存とリセット</h3>
                  <p className="text-sm text-muted-foreground">
                    「Save」ボタンでパレットをブラウザのLocalStorageに保存できます。 「Reset to MUI
                    Defaults」ボタンでMUIのデフォルトカラーに戻せます。
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FileJson className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">MUIテーマとしてエクスポート</h3>
                  <p className="text-sm text-muted-foreground">
                    「Export」ボタンをクリックすると、2つの形式でエクスポートできます：
                    <br />• <strong>MUI Theme</strong>: createTheme()で使用できるJavaScript/TypeScriptファイル
                    <br />• <strong>JSON</strong>: 汎用的なJSON形式
                  </p>
                </div>
              </div>

              <div className="bg-muted p-3 rounded text-xs font-mono">
                <pre>{`import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    // ... other colors
  },
});`}</pre>
              </div>

              <div className="flex items-start gap-2">
                <FileJson className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">インポート</h3>
                  <p className="text-sm text-muted-foreground">
                    「Import JSON」ボタンで以前エクスポートしたJSONファイルをインポートできます。
                    MUIの6つのカラーロールすべてを含むJSONファイルが必要です。
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={handleClose}>閉じる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
