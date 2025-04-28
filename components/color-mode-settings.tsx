"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Palette } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { colorSystems, type ColorMode } from "@/lib/color-systems"

interface ColorModeSettingsProps {
  colorMode: ColorMode
  showTailwindClasses: boolean
  showMaterialNames: boolean
  onChangeColorMode: (mode: ColorMode) => void
  onToggleTailwindClasses: (show: boolean) => void
  onToggleMaterialNames: (show: boolean) => void
}

export function ColorModeSettings({
  colorMode,
  showTailwindClasses,
  showMaterialNames,
  onChangeColorMode,
  onToggleTailwindClasses,
  onToggleMaterialNames,
}: ColorModeSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("mode")

  // カラーモードが変更されたときに表示設定を自動調整
  useEffect(() => {
    if (colorMode === "material" && showTailwindClasses) {
      onToggleTailwindClasses(false)
    }
    if (colorMode === "tailwind" && showMaterialNames) {
      onToggleMaterialNames(false)
    }
  }, [colorMode, showTailwindClasses, showMaterialNames, onToggleTailwindClasses, onToggleMaterialNames])

  const handleColorModeChange = (mode: ColorMode) => {
    onChangeColorMode(mode)

    // カラーモードに応じて表示設定を自動調整
    if (mode === "material") {
      onToggleMaterialNames(true)
      onToggleTailwindClasses(false)
    } else if (mode === "tailwind") {
      onToggleTailwindClasses(true)
      onToggleMaterialNames(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 rounded-full border-blue-200 bg-blue-50 hover:bg-blue-100"
        onClick={() => setIsOpen(true)}
        title="カラーモード設定"
      >
        <Palette className="h-4 w-4 text-blue-500" />
        <span className="text-blue-600">カラーモード</span>
      </Button>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>カラーモード設定</DialogTitle>
          <DialogDescription>カラーシステムと表示形式を選択できます</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="mode">カラーシステム</TabsTrigger>
            <TabsTrigger value="display">表示設定</TabsTrigger>
          </TabsList>

          <TabsContent value="mode" className="space-y-4">
            <div className="space-y-4">
              <RadioGroup value={colorMode} onValueChange={(value) => handleColorModeChange(value as ColorMode)}>
                {Object.entries(colorSystems).map(([key, system]) => (
                  <div key={key} className="flex items-start space-x-2">
                    <RadioGroupItem value={key} id={`mode-${key}`} />
                    <div className="grid gap-1.5">
                      <Label htmlFor={`mode-${key}`} className="font-medium">
                        {system.name}
                      </Label>
                      <p className="text-sm text-gray-500">{system.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              {colorMode === "material" && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    Material Designモードでは、Material UIのカラーシステムに基づいたカラーパレットが生成されます。
                    プライマリカラーとセカンダリカラーを設定することで、一貫性のあるデザインが可能です。
                  </p>
                </div>
              )}

              {colorMode === "tailwind" && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    Tailwind CSSモードでは、Tailwindのカラーパレットに基づいた色選択が可能です。
                    選択した色に最も近いTailwindのカラークラスが自動的に表示されます。
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-tailwind" className="font-medium">
                    Tailwindクラス表示
                  </Label>
                  <p className="text-sm text-gray-500">カラーコードと一緒にTailwindのクラス名を表示します</p>
                </div>
                <Switch
                  id="show-tailwind"
                  checked={showTailwindClasses}
                  onCheckedChange={onToggleTailwindClasses}
                  disabled={colorMode === "material"} // Material Designモードの場合は無効化
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-material" className="font-medium">
                    Material名表示
                  </Label>
                  <p className="text-sm text-gray-500">カラーコードと一緒にMaterial Designの色名を表示します</p>
                </div>
                <Switch
                  id="show-material"
                  checked={showMaterialNames}
                  onCheckedChange={onToggleMaterialNames}
                  disabled={colorMode === "tailwind"} // Tailwindモードの場合は無効化
                />
              </div>

              {colorMode === "material" && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    Material Designモードでは、Material名表示が自動的に有効になります。
                  </p>
                </div>
              )}

              {colorMode === "tailwind" && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    Tailwindモードでは、Tailwindクラス表示が自動的に有効になります。
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>閉じる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
