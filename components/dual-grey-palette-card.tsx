"use client"

import { useState } from "react"
import { HexColorPicker } from "react-colorful"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import type { GreyPaletteDual, PaletteMode } from "@/types/palette"

interface DualGreyPaletteCardProps {
  greyPalette: GreyPaletteDual
  currentMode: PaletteMode
  onGreyChange: (shade: keyof GreyPaletteDual, mode: PaletteMode, value: string) => void
}

type GreyShade = keyof GreyPaletteDual

export function DualGreyPaletteCard({ greyPalette, currentMode, onGreyChange }: DualGreyPaletteCardProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [editingShade, setEditingShade] = useState<GreyShade>("50")
  const [editingMode, setEditingMode] = useState<PaletteMode>(currentMode)

  const mainShades: GreyShade[] = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"]
  const accentShades: GreyShade[] = ["A100", "A200", "A400", "A700"]

  const handleColorClick = (shade: GreyShade, mode: PaletteMode) => {
    setEditingShade(shade)
    setEditingMode(mode)
    setShowPicker(true)
  }

  const handlePickerChange = (color: string) => {
    onGreyChange(editingShade, editingMode, color)
  }

  const handleHexInputChange = (shade: GreyShade, mode: PaletteMode, value: string) => {
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === "#") {
      onGreyChange(shade, mode, value)
    }
  }

  const renderShadeInput = (shade: GreyShade) => {
    const color = greyPalette[shade][currentMode]

    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer transition-transform hover:scale-110 flex-shrink-0"
          style={{ backgroundColor: color }}
          onClick={() => handleColorClick(shade, currentMode)}
          title={`Grey ${shade}`}
        />
        <Input
          value={color}
          onChange={(e) => handleHexInputChange(shade, currentMode, e.target.value)}
          placeholder="#000000"
          className="font-mono text-xs flex-1 h-7 px-1"
        />
      </div>
    )
  }

  const cardBgColor = currentMode === "light" ? "white" : "#1e1e1e"
  const textColor = currentMode === "light" ? "black" : "white"
  const stickyBgColor = currentMode === "light" ? "white" : "#1e1e1e"

  return (
    <Card className="flex-shrink-0 w-[320px] relative" style={{ backgroundColor: cardBgColor, color: textColor }}>
      <CardHeader className="pb-3">
        <CardTitle>Greyscale Palette</CardTitle>
        {/* Mode Indicator */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t">
          {currentMode === "light" ? (
            <>
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold">Dark Mode</span>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
        {/* Main Shades */}
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-700 sticky top-0 py-1" style={{ backgroundColor: stickyBgColor }}>Main Shades</div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            {mainShades.map((shade) => (
              <div key={shade} className="space-y-1">
                <div className="text-xs font-medium text-gray-600">{shade}</div>
                {renderShadeInput(shade)}
              </div>
            ))}
          </div>
        </div>

        {/* Accent Shades */}
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-700 sticky top-0 py-1" style={{ backgroundColor: stickyBgColor }}>Accent Shades</div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            {accentShades.map((shade) => (
              <div key={shade} className="space-y-1">
                <div className="text-xs font-medium text-gray-600">{shade}</div>
                {renderShadeInput(shade)}
              </div>
            ))}
          </div>
        </div>

        {/* Color Picker Popover */}
        {showPicker && (
          <div className="absolute z-50 top-full left-0 mt-2 p-3 bg-white rounded-lg shadow-xl border">
            <div className="mb-2 text-sm font-semibold flex items-center gap-2">
              {currentMode === "light" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-blue-500" />
              )}
              Editing: Grey {editingShade}
            </div>
            <HexColorPicker
              color={greyPalette[editingShade][currentMode]}
              onChange={handlePickerChange}
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => setShowPicker(false)}
            >
              Close
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
