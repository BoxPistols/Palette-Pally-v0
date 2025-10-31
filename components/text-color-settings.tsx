"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { TextColorMode, TextColorSettings as TextColorSettingsType } from "@/types/palette"

interface TextColorSettingsProps {
  settings: TextColorSettingsType
  onChange: (settings: TextColorSettingsType) => void
}

export function TextColorSettings({ settings, onChange }: TextColorSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

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
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setIsOpen(true)}>
        <Settings2 className="h-4 w-4" />
        <span>テキストカラー設定</span>
      </Button>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>テキストカラー設定</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-500 mb-4">各カラーバリエーションのテキストカラーを個別に設定できます。</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Main</label>
              <Select value={settings.main} onValueChange={(value) => handleChange("main", value as TextColorMode)}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default (自動)</SelectItem>
                  <SelectItem value="white">White (白)</SelectItem>
                  <SelectItem value="black">Black (黒)</SelectItem>
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
                  <SelectItem value="default">Default (自動)</SelectItem>
                  <SelectItem value="white">White (白)</SelectItem>
                  <SelectItem value="black">Black (黒)</SelectItem>
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
                  <SelectItem value="default">Default (自動)</SelectItem>
                  <SelectItem value="white">White (白)</SelectItem>
                  <SelectItem value="black">Black (黒)</SelectItem>
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
                  <SelectItem value="default">Default (自動)</SelectItem>
                  <SelectItem value="white">White (白)</SelectItem>
                  <SelectItem value="black">Black (黒)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={resetToDefault}>
            デフォルトに戻す
          </Button>
          <Button onClick={() => setIsOpen(false)}>閉じる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
