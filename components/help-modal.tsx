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
import { HelpCircle, Palette, Sliders, Save, FileJson, Contrast, Type, Lightbulb, Wand2 } from "lucide-react"

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
          <DialogTitle>Palette Pally の使い方</DialogTitle>
          <DialogDescription>
            カラーパレットの作成・管理・アクセシビリティチェックを簡単に行えるツールです
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">基本機能</TabsTrigger>
            <TabsTrigger value="accessibility">アクセシビリティ</TabsTrigger>
            <TabsTrigger value="advanced">高度な機能</TabsTrigger>
            <TabsTrigger value="color-theory">色彩理論</TabsTrigger>
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
                  <h3 className="text-sm font-semibold">テキストカラー設定</h3>
                  <p className="text-sm text-gray-500">
                    各カラーバリエーション（main、dark、light、lighter）ごとにテキストカラーを設定できます。
                    <br />• Default: 背景色に応じて自動的にテキスト色を調整
                    <br />• White: 強制的に白色のテキストを使用
                    <br />• Black: 強制的に黒色のテキストを使用
                    <br />
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

          <TabsContent value="color-theory" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Palette className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">Oklabカラースペース</h3>
                  <p className="text-sm text-gray-500">
                    Oklabは知覚的に均一なカラースペースで、人間の視覚に合わせて設計されています。従来のRGBやHSLと異なり、色の明るさや彩度の変化が人間の知覚に合わせて均一になるため、より直感的なカラーデザインが可能です。
                    <br />• L: 明度（Lightness）- 色の明るさを表します
                    <br />• a: 緑-赤の軸 - 負の値が緑、正の値が赤を表します
                    <br />• b: 青-黄の軸 - 負の値が青、正の値が黄を表します
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">カラーハーモニー</h3>
                  <p className="text-sm text-gray-500">
                    効果的なカラーパレットを作成するためのガイドライン：
                    <br />• 60-30-10ルール：主要色60%、補助色30%、アクセント色10%の割合で使用
                    <br />• コントラスト：テキストと背景のコントラスト比は最低4.5:1を目指す
                    <br />• 色相の一貫性：同じ色相内でバリエーションを作成すると統一感が生まれる
                    <br />• 彩度の調整：重要な要素ほど彩度を高く、背景などは彩度を低く設定
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Wand2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">カラーパレット最適化</h3>
                  <p className="text-sm text-gray-500">
                    Palette Pallyでは、アクセシビリティを考慮したカラーパレットの自動最適化機能を提供しています。
                    <br />• アクセシビリティ修正：コントラスト比が基準を満たすよう自動調整
                    <br />• カラーハーモニー生成：選択した主要色から調和のとれたパレットを自動生成
                    <br />• バリエーション最適化：明度や彩度を均一に調整し、一貫性のあるバリエーションを作成
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
