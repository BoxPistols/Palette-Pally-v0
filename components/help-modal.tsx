"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  HelpCircle,
  Palette,
  Sliders,
  Save,
  FileJson,
  Contrast,
  Type,
  Lightbulb,
  Wand2,
  Tag,
  Eye,
  Code,
} from "lucide-react"

export function HelpModal() {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 rounded-full border-blue-200 bg-blue-50 hover:bg-blue-100"
        title="ヘルプ"
        onClick={() => setIsOpen(true)}
      >
        <HelpCircle className="h-4 w-4 text-blue-500" />
        <span className="text-blue-600">ヘルプ</span>
      </Button>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Palette Pally の使い方</DialogTitle>
          <DialogDescription>
            カラーパレットの作成・管理・アクセシビリティチェックを簡単に行えるツールです
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="basic">基本機能</TabsTrigger>
            <TabsTrigger value="accessibility">アクセシビリティ</TabsTrigger>
            <TabsTrigger value="advanced">高度な機能</TabsTrigger>
            <TabsTrigger value="color-theory">色彩理論</TabsTrigger>
            <TabsTrigger value="faq">よくある質問</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Palette className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">Color Picker</h3>
                  <p className="text-sm text-gray-500">
                    左側のパネルでカラーを選択・編集できます。カラー名を変更したり、HEX、RGB、HSL、Oklabの値を直接入力することも可能です。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Tag className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">Color Roles</h3>
                  <p className="text-sm text-gray-500">
                    各カラーに役割（プライマリ、セカンダリ、成功、警告など）を割り当てることができます。これにより、デザインシステムの一貫性が向上します。
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

              <div className="flex items-start gap-2">
                <Palette className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">Color Palette</h3>
                  <p className="text-sm text-gray-500">
                    右側のパネルには、各カラーの4つのバリエーション（main、dark、light、lighter）が表示されます。
                    これらは自動的に生成され、コントラスト比とアクセシビリティレベルも確認できます。
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
                  <h3 className="text-sm font-semibold">Contrast Ratio と WCAG レベル</h3>
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
                  <h3 className="text-sm font-semibold">Text Color Settings</h3>
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

              <div className="flex items-start gap-2">
                <Eye className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">Color Blindness Simulator</h3>
                  <p className="text-sm text-gray-500">
                    色覚異常（色覚多様性）のある方にとって、あなたのカラーパレットがどのように見えるかをシミュレーションできます。
                    <br />• 第一色覚異常（赤色弱）: 赤色の感度が低下
                    <br />• 第二色覚異常（緑色弱）: 緑色の感度が低下
                    <br />• 第三色覚異常（青色弱）: 青色の感度が低下
                    <br />• 完全色覚異常（色盲）: 色を全く認識できない
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Type className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">Text Preview</h3>
                  <p className="text-sm text-gray-500">
                    選択したカラーをテキストとして使用した場合のプレビューを確認できます。様々な背景色や文字サイズでのコントラスト比とアクセシビリティレベルを確認できます。
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
                  <h3 className="text-sm font-semibold">Import/Export</h3>
                  <p className="text-sm text-gray-500">
                    「Export JSON」ボタンでパレットをJSONファイルとしてエクスポートできます。 「Import
                    JSON」ボタンで以前保存したパレットをインポートできます。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Code className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">Code Export</h3>
                  <p className="text-sm text-gray-500">
                    作成したカラーパレットを様々な形式のコードとして出力できます：
                    <br />• CSS変数: CSSのカスタムプロパティとして出力
                    <br />• SCSS変数: Sassの変数として出力
                    <br />• Tailwind設定: tailwind.config.jsの形式で出力
                    <br />• Material UI: Material UIのテーマ設定として出力
                    <br />• クラスマッピング: 最も近いTailwindのカラークラスとのマッピング
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Wand2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">Palette Optimizer</h3>
                  <p className="text-sm text-gray-500">
                    カラーパレットを自動的に最適化する機能です：
                    <br />• アクセシビリティ修正: コントラスト比が基準を満たすよう自動調整
                    <br />• プライマリカラーとの調和: プライマリカラーに基づいて他の色の明度と彩度を調整
                    <br />• テキストカラーの最適化: 各バリエーションに最適なテキストカラーを設定
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Palette className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">Color Mode Settings</h3>
                  <p className="text-sm text-gray-500">
                    カラーシステムと表示形式を選択できます：
                    <br />• 標準モード: 独自のカラーパレットを作成
                    <br />• Material Design: Material Designのカラーシステムに基づいたパレット
                    <br />• Tailwind CSS: Tailwind CSSのカラーシステムに基づいたパレット
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
                  <h3 className="text-sm font-semibold">Oklab Color Space</h3>
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
                  <h3 className="text-sm font-semibold">Color Harmony</h3>
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
                  <h3 className="text-sm font-semibold">Color Roles in Design Systems</h3>
                  <p className="text-sm text-gray-500">
                    デザインシステムにおける色の役割：
                    <br />• Primary：ブランドを表す主要な色、最も頻繁に使用される
                    <br />• Secondary：プライマリカラーを補完し、アクセントとして使用
                    <br />• Success：成功や完了を示す（通常は緑系）
                    <br />• Danger：エラーや危険を示す（通常は赤系）
                    <br />• Warning：注意や警告を示す（通常は黄色やオレンジ系）
                    <br />• Info：情報提供を示す（通常は青系）
                    <br />• Background：背景に使用される色
                    <br />• Text：テキストに使用される色
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <h3 className="text-sm font-semibold">カラーパレットを保存するにはどうすればいいですか？</h3>
                <p className="text-sm text-gray-500 mt-1">
                  画面上部の「保存」ボタンをクリックすると、ブラウザのLocalStorageにパレットが保存されます。ブラウザを閉じても次回アクセス時に復元されます。長期保存や共有には「Export
                  JSON」機能を使用してJSONファイルとして保存してください。
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-md">
                <h3 className="text-sm font-semibold">アクセシビリティの基準はどのように判断されていますか？</h3>
                <p className="text-sm text-gray-500 mt-1">
                  WCAG（Web Content Accessibility
                  Guidelines）2.1の基準に基づいています。テキストと背景のコントラスト比が3.0:1以上でA、4.5:1以上でAA、7.0:1以上でAAAとなります。一般的にはAAレベル（4.5:1以上）が推奨されています。
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-md">
                <h3 className="text-sm font-semibold">カラーバリエーションはどのように生成されていますか？</h3>
                <p className="text-sm text-gray-500 mt-1">
                  各カラーに対して、main（元の色）、dark（暗い色）、light（明るい色）、lighter（さらに明るい色）の4つのバリエーションが自動生成されます。これらは明度を調整して生成され、アクセシビリティを考慮しています。
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-md">
                <h3 className="text-sm font-semibold">Material DesignとTailwind CSSのモードの違いは何ですか？</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Material Designモードでは、Material UIのカラーシステムに基づいたパレットが生成されます。Tailwind
                  CSSモードでは、Tailwindのカラーシステムに基づいたパレットが生成されます。それぞれのフレームワークに合わせた色名やシェード番号が表示されます。
                </p>
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
