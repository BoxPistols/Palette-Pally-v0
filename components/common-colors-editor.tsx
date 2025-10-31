"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { CommonColors } from "@/types/palette"

interface CommonColorsEditorProps {
  common: CommonColors
  onCommonChange: (common: CommonColors) => void
}

export function CommonColorsEditor({ common, onCommonChange }: CommonColorsEditorProps) {
  const handleColorChange = (key: keyof CommonColors, value: string) => {
    onCommonChange({
      ...common,
      [key]: value,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Common Colors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="common-black" className="text-sm min-w-[80px]">
            Black
          </Label>
          <div className="flex items-center gap-2">
            <input
              id="common-black"
              type="color"
              value={common.black}
              onChange={(e) => handleColorChange("black", e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={common.black}
              onChange={(e) => handleColorChange("black", e.target.value)}
              className="flex-1 px-2 py-1 text-xs font-mono border rounded"
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="common-white" className="text-sm min-w-[80px]">
            White
          </Label>
          <div className="flex items-center gap-2">
            <input
              id="common-white"
              type="color"
              value={common.white}
              onChange={(e) => handleColorChange("white", e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={common.white}
              onChange={(e) => handleColorChange("white", e.target.value)}
              className="flex-1 px-2 py-1 text-xs font-mono border rounded"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
