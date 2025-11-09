"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sun, Moon } from "lucide-react"
import type { MUIColorDataDual, PaletteMode } from "@/types/palette"
import { calculateContrastRatio, getWCAGLevel } from "@/lib/color-utils"

interface DualColorResultDisplayProps {
  colorData: MUIColorDataDual
  currentMode: PaletteMode
}

export function DualColorResultDisplay({ colorData, currentMode }: DualColorResultDisplayProps) {
  const cardBgColor = currentMode === "light" ? "white" : "#1e1e1e"
  const textColor = currentMode === "light" ? "black" : "white"

  const renderColorBox = (mode: PaletteMode, property: "main" | "light" | "lighter" | "dark", label: string) => {
    const bgColor = colorData[property]?.[mode]
    const textColor = colorData.contrastText?.[mode] || "#ffffff"

    if (!bgColor) return null

    const contrast = calculateContrastRatio(bgColor, textColor)
    const wcagLevel = getWCAGLevel(contrast)
    const ModeIcon = mode === "light" ? Sun : Moon

    return (
      <div
        className="rounded-lg p-4 border-2 border-gray-200 transition-all hover:scale-105"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ModeIcon className="w-4 h-4" />
            <span className="font-semibold text-sm">{label}</span>
          </div>
          <Badge
            variant="secondary"
            className={`text-xs ${
              wcagLevel.level === "AAA"
                ? "bg-green-100 text-green-800"
                : wcagLevel.level === "AA"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {wcagLevel.level}
          </Badge>
        </div>
        <div className="font-mono text-xs opacity-90">{bgColor}</div>
        <div className="font-mono text-xs opacity-75 mt-1">Text: {textColor}</div>
        <div className="text-xs opacity-75 mt-1">Contrast: {contrast.toFixed(2)}</div>
      </div>
    )
  }

  return (
    <Card className="w-full" style={{ backgroundColor: cardBgColor, color: textColor }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{colorData.name}</CardTitle>
          <Badge variant="outline">{colorData.type}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Light Mode Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b">
              <Sun className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Light Mode</h3>
            </div>
            {renderColorBox("light", "main", "Main")}
            {colorData.type === "theme" && (
              <>
                {colorData.light && renderColorBox("light", "light", "Light")}
                {colorData.lighter && renderColorBox("light", "lighter", "Lighter")}
                {colorData.dark && renderColorBox("light", "dark", "Dark")}
              </>
            )}
          </div>

          {/* Dark Mode Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b">
              <Moon className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Dark Mode</h3>
            </div>
            {renderColorBox("dark", "main", "Main")}
            {colorData.type === "theme" && (
              <>
                {colorData.light && renderColorBox("dark", "light", "Light")}
                {colorData.lighter && renderColorBox("dark", "lighter", "Lighter")}
                {colorData.dark && renderColorBox("dark", "dark", "Dark")}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
