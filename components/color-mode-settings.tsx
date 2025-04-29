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
import { useLanguage } from "@/contexts/language-context"
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
  const { language, t } = useLanguage()
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
        title={t("button.colorMode")}
      >
        <Palette className="h-4 w-4 text-blue-500" />
        <span className="text-blue-600">{t("button.colorMode")}</span>
      </Button>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("colorMode.title")}</DialogTitle>
          <DialogDescription>{t("colorMode.description")}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="mode">{language === "jp" ? "カラーシステム" : "Color System"}</TabsTrigger>
            <TabsTrigger value="display">{language === "jp" ? "表示設定" : "Display Settings"}</TabsTrigger>
          </TabsList>

          <TabsContent value="mode" className="space-y-4">
            <div className="space-y-4">
              <RadioGroup value={colorMode} onValueChange={(value) => handleColorModeChange(value as ColorMode)}>
                {Object.entries(colorSystems).map(([key, system]) => (
                  <div key={key} className="flex items-start space-x-2">
                    <RadioGroupItem value={key} id={`mode-${key}`} />
                    <div className="grid gap-1.5">
                      <Label htmlFor={`mode-${key}`} className="font-medium">
                        {language === "jp" ? system.name : key.charAt(0).toUpperCase() + key.slice(1)}
                      </Label>
                      <p className="text-sm text-gray-500">
                        {language === "jp"
                          ? system.description
                          : `${key.charAt(0).toUpperCase() + key.slice(1)} color system`}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              {colorMode === "material" && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">{t("colorMode.materialNote")}</p>
                </div>
              )}

              {colorMode === "tailwind" && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">{t("colorMode.tailwindNote")}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-tailwind" className="font-medium">
                    {t("colorMode.showTailwind")}
                  </Label>
                  <p className="text-sm text-gray-500">{t("colorMode.showTailwindDesc")}</p>
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
                    {t("colorMode.showMaterial")}
                  </Label>
                  <p className="text-sm text-gray-500">{t("colorMode.showMaterialDesc")}</p>
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
                    {language === "jp"
                      ? "Material Designモードでは、Material名表示が自動的に有効になります。"
                      : "In Material Design mode, Material names display is automatically enabled."}
                  </p>
                </div>
              )}

              {colorMode === "tailwind" && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    {language === "jp"
                      ? "Tailwindモードでは、Tailwindクラス表示が自動的に有効になります。"
                      : "In Tailwind mode, Tailwind class display is automatically enabled."}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>{t("colorMode.close")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
