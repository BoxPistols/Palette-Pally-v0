"use client"

import { useState, useEffect } from "react"
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
import { HelpCircle, Palette, Sliders, Save, FileJson, Contrast, Type } from "lucide-react"

const HELP_VIEWED_KEY = "palette-pally-help-viewed"

export function HelpModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasViewedHelp, setHasViewedHelp] = useState(true) // デフォルトはtrueにして、useEffectで判定

  useEffect(() => {
    // 初回訪問かどうかをLocalStorageで判定
    const hasViewed = localStorage.getItem(HELP_VIEWED_KEY) === "true"
    setHasViewedHelp(hasViewed)

    // 初回訪問の場合、モーダルを自動的に表示
    if (!hasViewed) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    // ヘルプを表示したことをLocalStorageに記録
    localStorage.setItem(HELP_VIEWED_KEY, "true")
    setHasViewedHelp(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" title="ヘルプ">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Palette Pally の使い方</DialogTitle>
          <DialogDescription>
            カラーパレットの作成・管理・アクセシビリティチェックを簡単に行えるツールです
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">基本機能</TabsTrigger>
            <TabsTrigger value="accessibility">アクセシビリティ</TabsTrigger>
            <TabsTrigger value="advanced">高度な機能</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Palette className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">カラーピッカー</h3>
                  <p className="text-sm text-gray-500">
                    左側のパネルでカラーを選択・編集できます。カラー名を変更したり、HEX、RGB、HSLの値を直接入力することも可能です。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Sliders className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">カラー数の調整</h3>
                  <p className="text-sm text-gray-500">
                    画面上部の「カラー数」入力欄で、パレットに含めるカラーの数を1〜24の間で調整できます。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Save className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">保存とリセット</h3>
                  <p className="text-sm text-gray-500">
                    「保存」ボタンでパレットをブラウザのLocalStorageに保存できます。「リセット」ボタンでデフォルトのカラーに戻せます。
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Contrast className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">コントラスト比とWCAGレベル</h3>
                  <p className="text-sm text-gray-500">
                    各カラーのコントラスト比とWCAGアクセシビリティレベル（AAA、AA、A、Fail）が表示されます。
                    <br />• AAA（7.0:1以上）: 最高レベルのアクセシビリティ
                    <br />• AA（4.5:1以上）: 標準的なアクセシビリティ要件
                    <br />• A（3.0:1以上）: 最低限のアクセシビリティ要件
                    <br />• Fail（3.0:1未満）: アクセシビリティ要件を満たさない
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Type className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">Text to Whiteモード</h3>
                  <p className="text-sm text-gray-500">
                    「Text to
                    White」スイッチをオンにすると、背景色の明るさに関わらず、main、dark、lightのテキストが白色になります。
                    コントラスト比がAA未満の場合は警告アイコンが表示されます。
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FileJson className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">インポート/エクスポート</h3>
                  <p className="text-sm text-gray-500">
                    「Export JSON」ボタンでパレットをJSONファイルとしてエクスポートできます。 「Import
                    JSON」ボタンで以前保存したパレットをインポートできます。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Palette className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">カラーバリエーション</h3>
                  <p className="text-sm text-gray-500">
                    右側のパネルには、各カラーの4つのバリエーション（main、dark、light、lighter）が表示されます。
                    これらは自動的に生成され、コントラスト比とアクセシビリティレベルも確認できます。
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
