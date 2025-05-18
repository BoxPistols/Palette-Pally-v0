// components/color-variation-controls.tsx
"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { ColorVariationSettings } from "@/types/palette"
import { useLanguage } from "@/lib/language-context"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { defaultVariationSettings } from "@/types/palette"

interface ColorVariationControlsProps {
  settings: ColorVariationSettings
  onChange: (settings: ColorVariationSettings) => void
}

export function ColorVariationControls({ settings = defaultVariationSettings,
  onChange }: ColorVariationControlsProps) {
  // ローカルステート - ユーザー操作が終わるまで親コンポーネントに通知しない
  const [localSettings, setLocalSettings] = useState(settings)
  const [changeTimeout, setChangeTimeout] = useState<NodeJS.Timeout | null>(null)
  const { language } = useLanguage()

  // 親コンポーネントからの設定変更を反映
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  // 変更をデバウンスして親コンポーネントに通知
  const handleChange = (newSettings: ColorVariationSettings) => {
    setLocalSettings(newSettings)
    onChange(newSettings);
  }

  const handleMainChromaChange = (value: number[]) => {
    handleChange({
      ...localSettings,
      mainChroma: value[0] / 100
    })
  }

  const handleDarkDeltaChange = (value: number[]) => {
    handleChange({
      ...localSettings,
      darkDelta: value[0] / 100
    })
  }

  const handleLightDeltaChange = (value: number[]) => {
    handleChange({
      ...localSettings,
      lightDelta: value[0] / 100
    })
  }

  const handleLighterDeltaChange = (value: number[]) => {
    handleChange({
      ...localSettings,
      lighterDelta: value[0] / 100
    })
  }

  const handleChromaReductionChange = (value: number[]) => {
    handleChange({
      ...localSettings,
      chromaReduction: value[0] / 100
    })
  }

  const handlePerceptualModelChange = (checked: boolean) => {
    handleChange({
      ...localSettings,
      usePerceptualModel: checked
    })
  }

  // 数値入力ハンドラ
  const handleNumberInput = (field: keyof ColorVariationSettings, value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return

    // 各フィールドの有効範囲を設定
    let validValue: number
    let factor = 100 // デフォルトは%表示なので100で割る

    switch (field) {
      case 'mainChroma':
        validValue = Math.min(150, Math.max(50, numValue)) / factor
        break
      case 'darkDelta':
        validValue = Math.min(0, Math.max(-50, numValue)) / factor
        break
      case 'lightDelta':
        validValue = Math.min(50, Math.max(10, numValue)) / factor
        break
      case 'lighterDelta':
        validValue = Math.min(70, Math.max(20, numValue)) / factor
        break
      case 'chromaReduction':
        validValue = Math.min(100, Math.max(50, numValue)) / factor
        break
      default:
        return
    }

    handleChange({
      ...localSettings,
      [field]: validValue
    })
  }

  return (
    <Card className="w-full">
      <CardContent>
        <Accordion type="single" collapsible defaultValue="">
          <AccordionItem value="settings">
            <AccordionTrigger className="py-1 text-sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm flex items-center justify-between mt-[-8px]">
                  {language === "ja" ? "カラーバリエーション設定" : "Color Variation Settings"}
                  <ChevronDownIcon className="ml-2 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </CardTitle>
              </CardHeader>
              {/* {language === "ja" ? "詳細設定" : "Advanced Settings"} */}
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-3 pt-2">
                <p className="text-xs text-muted-foreground mb-3">
                  {language === "ja"
                    ? "すべてのカラーバリエーションの彩度・明度を細かく調整できます。明るい色ほど彩度が低くなるよう自動調整されます。"
                    : "You can fine-tune the saturation and brightness of all color variations. Brighter colors will automatically have lower saturation."}
                </p>
                <div className="flex items-center justify-between">
                  <Label htmlFor="use-perceptual" className="text-sm">
                    {language === "ja" ? "知覚均一モード (Oklab)" : "Perceptual Uniform Mode (Oklab)"}
                  </Label>
                  <Switch
                    id="use-perceptual"
                    checked={localSettings.usePerceptualModel}
                    onCheckedChange={handlePerceptualModelChange}
                  />
                </div>

                {(localSettings.usePerceptualModel ?? true) && (
                  <>
                    {/* 全体の彩度調整（これだけを残す） */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">
                          {language === "ja" ? "全体の彩度調整" : "Overall Saturation Adjustment"}
                        </Label>
                        <div className="flex items-center gap-1">
                          <Input
                            value={Math.round(localSettings.chromaReduction * 100)}
                            onChange={(e) => handleNumberInput('chromaReduction', e.target.value)}
                            className="w-16 h-7 text-xs"
                            type="number"
                            min={50}
                            max={100}
                          />
                          <span className="text-xs">%</span>
                          <button
                            type="button"
                            style={{ padding: '0.2em 0.7em', border: '1px solid #ccc', borderRadius: 4, background: '#f5f5f5', cursor: 'pointer', fontSize: '0.8em', marginLeft: 4 }}
                            onClick={() => handleChange({ ...localSettings, chromaReduction: defaultVariationSettings.chromaReduction })}
                          >
                            {language === "ja" ? "リセット" : "Reset"}
                          </button>
                        </div>
                      </div>
                      <Slider
                        value={[localSettings.chromaReduction * 100]}
                        min={50}
                        max={100}
                        step={1}
                        onValueChange={handleChromaReductionChange}
                        className="slider-gray"
                      />
                    </div>

                    {/* Main彩度比率（追加） */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">
                          {language === "ja" ? "Main彩度比率" : "Main Saturation Ratio"}
                        </Label>
                        <div className="flex items-center gap-1">
                          <Input
                            value={Math.round(localSettings.mainChroma * 100)}
                            onChange={(e) => handleNumberInput('mainChroma', e.target.value)}
                            className="w-16 h-7 text-xs"
                            type="number"
                            min={50}
                            max={150}
                          />
                          <span className="text-xs">%</span>
                          <button
                            type="button"
                            style={{ padding: '0.2em 0.7em', border: '1px solid #ccc', borderRadius: 4, background: '#f5f5f5', cursor: 'pointer', fontSize: '0.8em', marginLeft: 4 }}
                            onClick={() => handleChange({ ...localSettings, mainChroma: defaultVariationSettings.mainChroma })}
                          >
                            {language === "ja" ? "リセット" : "Reset"}
                          </button>
                        </div>
                      </div>
                      <Slider
                        value={[localSettings.mainChroma * 100]}
                        min={50}
                        max={150}
                        step={1}
                        onValueChange={handleMainChromaChange}
                        className="slider-gray"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">
                          {language === "ja" ? "Dark明度変化" : "Dark Brightness Change"}
                        </Label>
                        <div className="flex items-center gap-1">
                          <Input
                            value={Math.round(localSettings.darkDelta * 100)}
                            onChange={(e) => handleNumberInput('darkDelta', e.target.value)}
                            className="w-16 h-7 text-xs"
                            type="number"
                            min={-50}
                            max={0}
                          />
                          <span className="text-xs">%</span>
                          <button
                            type="button"
                            style={{ padding: '0.2em 0.7em', border: '1px solid #ccc', borderRadius: 4, background: '#f5f5f5', cursor: 'pointer', fontSize: '0.8em', marginLeft: 4 }}
                            onClick={() => handleChange({ ...localSettings, darkDelta: defaultVariationSettings.darkDelta })}
                          >
                            {language === "ja" ? "リセット" : "Reset"}
                          </button>
                        </div>
                      </div>
                      <Slider
                        value={[localSettings.darkDelta * 100]}
                        min={-50}
                        max={0}
                        step={1}
                        onValueChange={handleDarkDeltaChange}
                        className="slider-gray"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">
                          {language === "ja" ? "Light明度変化" : "Light Brightness Change"}
                        </Label>
                        <div className="flex items-center gap-1">
                          <Input
                            value={Math.round(localSettings.lightDelta * 100)}
                            onChange={(e) => handleNumberInput('lightDelta', e.target.value)}
                            className="w-16 h-7 text-xs"
                            type="number"
                            min={10}
                            max={50}
                          />
                          <span className="text-xs">%</span>
                          <button
                            type="button"
                            style={{ padding: '0.2em 0.7em', border: '1px solid #ccc', borderRadius: 4, background: '#f5f5f5', cursor: 'pointer', fontSize: '0.8em', marginLeft: 4 }}
                            onClick={() => handleChange({ ...localSettings, lightDelta: defaultVariationSettings.lightDelta })}
                          >
                            {language === "ja" ? "リセット" : "Reset"}
                          </button>
                        </div>
                      </div>
                      <Slider
                        value={[localSettings.lightDelta * 100]}
                        min={10}
                        max={50}
                        step={1}
                        onValueChange={handleLightDeltaChange}
                        className="slider-gray"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">
                          {language === "ja" ? "Lighter明度変化" : "Lighter Brightness Change"}
                        </Label>
                        <div className="flex items-center gap-1">
                          <Input
                            value={Math.round(localSettings.lighterDelta * 100)}
                            onChange={(e) => handleNumberInput('lighterDelta', e.target.value)}
                            className="w-16 h-7 text-xs"
                            type="number"
                            min={20}
                            max={70}
                          />
                          <span className="text-xs">%</span>
                          <button
                            type="button"
                            style={{ padding: '0.2em 0.7em', border: '1px solid #ccc', borderRadius: 4, background: '#f5f5f5', cursor: 'pointer', fontSize: '0.8em', marginLeft: 4 }}
                            onClick={() => handleChange({ ...localSettings, lighterDelta: defaultVariationSettings.lighterDelta })}
                          >
                            {language === "ja" ? "リセット" : "Reset"}
                          </button>
                        </div>
                      </div>
                      <Slider
                        value={[localSettings.lighterDelta * 100]}
                        min={20}
                        max={70}
                        step={1}
                        onValueChange={handleLighterDeltaChange}
                        className="slider-gray"
                      />
                    </div>
                  </>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
