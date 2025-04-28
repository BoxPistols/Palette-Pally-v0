"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { simulateAllColorBlindness, type ColorBlindnessType } from "@/lib/color-blind-simulation"
import type { ColorData } from "@/types/palette"

interface ColorBlindSimulatorProps {
  colors: ColorData[]
  variations: Record<string, Record<string, string>>
}

export function ColorBlindSimulator({ colors, variations }: ColorBlindSimulatorProps) {
  const [isOpen, setIsOpen] = useState(false)

  // 色覚異常の種類と説明
  const colorBlindnessTypes: Record<ColorBlindnessType, { name: string; description: string }> = {
    protanopia: {
      name: "第一色覚異常（赤色弱）",
      description: "赤色の感度が低下し、赤と緑の区別が難しくなります。",
    },
    deuteranopia: {
      name: "第二色覚異常（緑色弱）",
      description: "緑色の感度が低下し、赤と緑の区別が難しくなります。最も一般的な色覚異常です。",
    },
    tritanopia: {
      name: "第三色覚異常（青色弱）",
      description: "青色の感度が低下し、青と黄色の区別が難しくなります。比較的まれな色覚異常です。",
    },
    achromatopsia: {
      name: "完全色覚異常（色盲）",
      description: "色を全く認識できず、白黒やグレースケールでしか見えません。非常にまれです。",
    },
  }

  // カラーブロックを生成する関数
  const renderColorBlock = (color: string, label: string) => (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-md border border-gray-200" style={{ backgroundColor: color }} title={color} />
      <span className="text-xs mt-1">{label}</span>
    </div>
  )

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setIsOpen(true)}
        title="色覚異常シミュレーション"
      >
        <Eye className="h-4 w-4" />
        <span>色覚シミュレーション</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>色覚異常シミュレーション</DialogTitle>
            <DialogDescription>
              様々な色覚異常の方にとって、あなたのカラーパレットがどのように見えるかをシミュレーションします。
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="overview">概要</TabsTrigger>
              <TabsTrigger value="protanopia">{colorBlindnessTypes.protanopia.name}</TabsTrigger>
              <TabsTrigger value="deuteranopia">{colorBlindnessTypes.deuteranopia.name}</TabsTrigger>
              <TabsTrigger value="tritanopia">{colorBlindnessTypes.tritanopia.name}</TabsTrigger>
              <TabsTrigger value="achromatopsia">{colorBlindnessTypes.achromatopsia.name}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <div className="space-y-4">
                <p className="text-sm">
                  色覚異常は、人口の約4.5%（男性の約8%、女性の約0.5%）に見られる特性です。
                  色覚異常の方にも識別しやすいカラーパレットを設計することは、アクセシビリティの観点から重要です。
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(colorBlindnessTypes).map(([key, { name, description }]) => (
                    <div key={key} className="p-3 bg-gray-50 rounded-md">
                      <h3 className="font-medium text-sm">{name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{description}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>ヒント:</strong> 色だけでなく、形やパターン、テキストラベルなどを併用することで、
                    色覚異常の方にも情報が伝わりやすくなります。また、十分なコントラスト比を確保することも重要です。
                  </p>
                </div>
              </div>
            </TabsContent>

            {(["protanopia", "deuteranopia", "tritanopia", "achromatopsia"] as const).map((type) => (
              <TabsContent key={type} value={type} className="mt-4">
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <h3 className="font-medium">{colorBlindnessTypes[type].name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{colorBlindnessTypes[type].description}</p>
                  </div>

                  <h3 className="font-medium text-sm">メインカラー</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {colors.map((color) => {
                      const simulatedColor = simulateAllColorBlindness(color.value)[type]
                      return (
                        <div key={color.name} className="flex flex-col items-center space-y-2">
                          <div className="flex space-x-2">
                            {renderColorBlock(color.value, "通常")}
                            {renderColorBlock(simulatedColor, type)}
                          </div>
                          <span className="text-xs font-medium">{color.name}</span>
                        </div>
                      )
                    })}
                  </div>

                  <h3 className="font-medium text-sm mt-6">カラーバリエーション</h3>
                  {Object.entries(variations).map(([colorName, colorVariations]) => (
                    <div key={colorName} className="mb-4">
                      <h4 className="text-xs font-medium mb-2">{colorName}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Object.entries(colorVariations).map(([variationName, hexValue]) => {
                          const simulatedColor = simulateAllColorBlindness(hexValue)[type]
                          return (
                            <div key={`${colorName}-${variationName}`} className="flex flex-col items-center space-y-2">
                              <div className="flex space-x-2">
                                {renderColorBlock(hexValue, "通常")}
                                {renderColorBlock(simulatedColor, type)}
                              </div>
                              <span className="text-xs">{variationName}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>閉じる</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
