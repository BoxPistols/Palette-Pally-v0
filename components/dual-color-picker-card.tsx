"use client"

import { useState } from "react"
import { HexColorPicker } from "react-colorful"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Sun, Moon } from "lucide-react"
import type { MUIColorDataDual, PaletteMode } from "@/types/palette"

interface DualColorPickerCardProps {
  colorData: MUIColorDataDual
  currentMode: PaletteMode
  onColorChange: (mode: PaletteMode, property: "main" | "light" | "lighter" | "dark" | "contrastText", value: string) => void
  onDelete?: () => void
  onNameChange?: (name: string) => void
}

export function DualColorPickerCard({
  colorData,
  currentMode,
  onColorChange,
  onDelete,
  onNameChange,
}: DualColorPickerCardProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [editingProperty, setEditingProperty] = useState<"main" | "light" | "lighter" | "dark" | "contrastText">("main")
  const [editingMode, setEditingMode] = useState<PaletteMode>(currentMode)
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(colorData.name)

  const handleColorClick = (property: "main" | "light" | "lighter" | "dark" | "contrastText", mode: PaletteMode) => {
    setEditingProperty(property)
    setEditingMode(mode)
    setShowPicker(true)
  }

  const handlePickerChange = (color: string) => {
    onColorChange(editingMode, editingProperty, color)
  }

  const handleHexInputChange = (mode: PaletteMode, property: "main" | "light" | "lighter" | "dark" | "contrastText", value: string) => {
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === "#") {
      onColorChange(mode, property, value)
    }
  }

  const handleNameSave = () => {
    if (onNameChange && tempName.trim()) {
      onNameChange(tempName.trim())
    }
    setIsEditingName(false)
  }

  const renderColorInput = (property: "main" | "light" | "lighter" | "dark" | "contrastText", label: string) => {
    const color = colorData[property]?.[currentMode] || ""

    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="w-10 h-10 rounded border-2 border-gray-300 cursor-pointer transition-transform hover:scale-110 flex-shrink-0"
          style={{ backgroundColor: color }}
          onClick={() => handleColorClick(property, currentMode)}
          title={`${label}`}
        />
        <Input
          value={color}
          onChange={(e) => handleHexInputChange(currentMode, property, e.target.value)}
          placeholder="#000000"
          className="font-mono text-sm flex-1"
        />
      </div>
    )
  }

  const cardBgColor = currentMode === "light" ? "white" : "#1e1e1e"
  const textColor = currentMode === "light" ? "black" : "white"

  return (
    <Card className="flex-shrink-0 w-[320px] relative" style={{ backgroundColor: cardBgColor, color: textColor }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {isEditingName ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNameSave()
                  if (e.key === "Escape") {
                    setTempName(colorData.name)
                    setIsEditingName(false)
                  }
                }}
                className="text-lg font-semibold"
                autoFocus
              />
            </div>
          ) : (
            <CardTitle
              className="cursor-pointer hover:text-blue-600"
              onClick={() => {
                if (onNameChange) {
                  setIsEditingName(true)
                }
              }}
            >
              {colorData.name}
            </CardTitle>
          )}
          {!colorData.isDefault && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Badge variant="secondary" className="w-fit mt-1">
          {colorData.type}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Mode Indicator */}
        <div className="flex items-center gap-2 pb-2 border-b">
          {currentMode === "light" ? (
            <>
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold">Light Mode Colors</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold">Dark Mode Colors</span>
            </>
          )}
        </div>

        {/* Main Color */}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-700">Main</div>
          {renderColorInput("main", "Main Color")}
        </div>

        {/* Additional variations for theme colors */}
        {colorData.type === "theme" && (
          <>
            {colorData.light && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-700">Light</div>
                {renderColorInput("light", "Light Variant")}
              </div>
            )}

            {colorData.lighter && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-700">Lighter</div>
                {renderColorInput("lighter", "Lighter Variant")}
              </div>
            )}

            {colorData.dark && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-700">Dark</div>
                {renderColorInput("dark", "Dark Variant")}
              </div>
            )}
          </>
        )}

        {/* Contrast Text */}
        {colorData.contrastText && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-700">Contrast Text</div>
            {renderColorInput("contrastText", "Text Color")}
          </div>
        )}

        {/* Color Picker Popover */}
        {showPicker && (
          <div className="absolute z-50 top-full left-0 mt-2 p-3 bg-white rounded-lg shadow-xl border">
            <div className="mb-2 text-sm font-semibold flex items-center gap-2">
              {currentMode === "light" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-blue-500" />
              )}
              Editing: {editingProperty}
            </div>
            <HexColorPicker
              color={colorData[editingProperty]?.[currentMode] || "#000000"}
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
