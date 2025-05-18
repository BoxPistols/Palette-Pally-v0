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
import { HelpCircle, Palette, Sliders, Save, FileJson, Contrast, Type } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function HelpModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { language } = useLanguage()

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center p-1 h-8"
          title={language === "ja" ? "ヘルプ" : "Help"}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {language === "ja" ? "Palette Pally の使い方" : "How to use Palette Pally"}
          </DialogTitle>
          <DialogDescription>
            {language === "ja" 
              ? "カラーパレットの作成・管理・アクセシビリティチェックを簡単に行えるツールです"
              : "A tool for easily creating, managing, and checking the accessibility of color palettes"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">
              {language === "ja" ? "基本機能" : "Basic Features"}
            </TabsTrigger>
            <TabsTrigger value="accessibility">
              {language === "ja" ? "アクセシビリティ" : "Accessibility"}
            </TabsTrigger>
            <TabsTrigger value="advanced">
              {language === "ja" ? "高度な機能" : "Advanced Features"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Palette className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">
                    {language === "ja" ? "カラーピッカー" : "Color Picker"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === "ja"
                      ? "左側のパネルでカラーを選択・編集できます。カラー名を変更したり、HEX、RGB、HSLの値を直接入力することも可能です。"
                      : "You can select and edit colors in the left panel. You can also change color names or directly input HEX, RGB, and HSL values."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Sliders className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">
                    {language === "ja" ? "カラー数の調整" : "Adjusting Number of Colors"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === "ja"
                      ? "画面上部の「カラー数」入力欄で、パレットに含めるカラーの数を1〜24の間で調整できます。"
                      : "You can adjust the number of colors in the palette between 1 and 24 using the 'Colors' input field at the top of the screen."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Save className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">
                    {language === "ja" ? "保存とリセット" : "Save and Reset"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === "ja"
                      ? "「保存」ボタンでパレットをブラウザのLocalStorageに保存できます。「リセット」ボタンでデフォルトのカラーに戻せます。"
                      : "You can save the palette to your browser's LocalStorage using the 'Save' button. Use the 'Reset' button to return to the default colors."}
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
                  <h3 className="text-sm font-semibold">
                    {language === "ja" ? "コントラスト比とWCAGレベル" : "Contrast Ratio and WCAG Levels"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === "ja" ? (
                      <>
                        各カラーのコントラスト比とWCAGアクセシビリティレベル（AAA、AA、A、Fail）が表示されます。
                        <br />• AAA（7.0:1以上）: 最高レベルのアクセシビリティ
                        <br />• AA（4.5:1以上）: 標準的なアクセシビリティ要件
                        <br />• A（3.0:1以上）: 最低限のアクセシビリティ要件
                        <br />• Fail（3.0:1未満）: アクセシビリティ要件を満たさない
                      </>
                    ) : (
                      <>
                        The contrast ratio and WCAG accessibility level (AAA, AA, A, Fail) are displayed for each color.
                        <br />• AAA (7.0:1 or higher): Highest level of accessibility
                        <br />• AA (4.5:1 or higher): Standard accessibility requirement
                        <br />• A (3.0:1 or higher): Minimum accessibility requirement
                        <br />• Fail (less than 3.0:1): Does not meet accessibility requirements
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Type className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">
                    {language === "ja" ? "テキストカラー設定" : "Text Color Settings"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === "ja" ? (
                      <>
                        各カラーバリエーション（main、dark、light、lighter）ごとにテキストカラーを設定できます。
                        <br />• Default: 背景色に応じて自動的にテキスト色を調整
                        <br />• White: 強制的に白色のテキストを使用
                        <br />• Black: 強制的に黒色のテキストを使用
                        <br />
                        コントラスト比がAA未満の場合は警告アイコンが表示されます。
                      </>
                    ) : (
                      <>
                        You can set text colors for each color variation (main, dark, light, lighter).
                        <br />• Default: Automatically adjusts text color based on background color
                        <br />• White: Forces white text
                        <br />• Black: Forces black text
                        <br />
                        A warning icon is displayed if the contrast ratio is less than AA.
                      </>
                    )}
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
                  <h3 className="text-sm font-semibold">
                    {language === "ja" ? "インポート/エクスポート" : "Import/Export"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === "ja"
                      ? "「Export JSON」ボタンでパレットをJSONファイルとしてエクスポートできます。「Import JSON」ボタンで以前保存したパレットをインポートできます。"
                      : "You can export the palette as a JSON file using the 'Export JSON' button. You can import previously saved palettes using the 'Import JSON' button."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Palette className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold">
                    {language === "ja" ? "カラーバリエーション" : "Color Variations"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === "ja"
                      ? "右側のパネルには、各カラーの4つのバリエーション（main、dark、light、lighter）が表示されます。これらは自動的に生成され、コントラスト比とアクセシビリティレベルも確認できます。"
                      : "The right panel displays four variations (main, dark, light, lighter) for each color. These are automatically generated, and you can also check the contrast ratio and accessibility level."}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={handleClose}>
            {language === "ja" ? "閉じる" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
