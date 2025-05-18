"use client"

import { useLanguage } from "@/lib/language-context"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { TextColorMode, TextColorSettings as TextColorSettingsType } from "@/types/palette"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { ChevronDownIcon } from "@radix-ui/react-icons"


interface TextColorSettingsProps {
  settings: TextColorSettingsType
  onChange: (settings: TextColorSettingsType) => void
}

export function TextColorSettings({ settings, onChange }: TextColorSettingsProps) {
  const { language } = useLanguage()

  const handleChange = (variant: keyof TextColorSettingsType, value: TextColorMode) => {
    const newSettings = { ...settings, [variant]: value }
    onChange(newSettings)
  }

  const resetToDefault = () => {
    onChange({
      main: "default",
      dark: "default",
      light: "default",
      lighter: "default",
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent >
        <Accordion type="single" collapsible defaultValue="">
          <AccordionItem value="text-color-settings">
            <AccordionTrigger className="py-1 text-sm flex gap-1">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm flex items-center justify-between mt-[-8px]">
                  {language === "ja" ? "テキストカラー設定" : "Text Color Settings"}
                  <ChevronDownIcon className="ml-2 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </CardTitle>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent className="px-2">
              <div className="py-2">
                <p className="text-xs text-gray-500 mb-4">
                  {language === "ja"
                    ? "各カラーバリエーションのテキストカラーを個別に設定できます。"
                    : "You can set text colors individually for each color variation."}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Main</label>
                    <Select value={settings.main} onValueChange={(value) => handleChange("main", value as TextColorMode)}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Default" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">
                          {language === "ja" ? "Default (自動)" : "Default (Auto)"}
                        </SelectItem>
                        <SelectItem value="white">
                          {language === "ja" ? "White (白)" : "White"}
                        </SelectItem>
                        <SelectItem value="black">
                          {language === "ja" ? "Black (黒)" : "Black"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Dark</label>
                    <Select value={settings.dark} onValueChange={(value) => handleChange("dark", value as TextColorMode)}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Default" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">
                          {language === "ja" ? "Default (自動)" : "Default (Auto)"}
                        </SelectItem>
                        <SelectItem value="white">
                          {language === "ja" ? "White (白)" : "White"}
                        </SelectItem>
                        <SelectItem value="black">
                          {language === "ja" ? "Black (黒)" : "Black"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Light</label>
                    <Select value={settings.light} onValueChange={(value) => handleChange("light", value as TextColorMode)}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Default" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">
                          {language === "ja" ? "Default (自動)" : "Default (Auto)"}
                        </SelectItem>
                        <SelectItem value="white">
                          {language === "ja" ? "White (白)" : "White"}
                        </SelectItem>
                        <SelectItem value="black">
                          {language === "ja" ? "Black (黒)" : "Black"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Lighter</label>
                    <Select
                      value={settings.lighter}
                      onValueChange={(value) => handleChange("lighter", value as TextColorMode)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Default" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">
                          {language === "ja" ? "Default (自動)" : "Default (Auto)"}
                        </SelectItem>
                        <SelectItem value="white">
                          {language === "ja" ? "White (白)" : "White"}
                        </SelectItem>
                        <SelectItem value="black">
                          {language === "ja" ? "Black (黒)" : "Black"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 mt-6
                  justify-end">
                  <button onClick={resetToDefault} style={{ padding: '0.5em 1em', border: '1px solid #ccc', borderRadius: 4, background: '#fff', cursor: 'pointer' }}>
                    {language === "ja" ? "デフォルトに戻す" : "Reset to Default"}
                  </button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
