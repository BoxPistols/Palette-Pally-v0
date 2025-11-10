"use client"

import { useState, useEffect } from "react"
import { DualColorPickerCard } from "@/components/dual-color-picker-card"
import { DualGreyPaletteCard } from "@/components/dual-grey-palette-card"
import { DualColorResultDisplay } from "@/components/dual-color-result-display"
import { ThemeModeToggle } from "@/components/theme-mode-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { HelpModal } from "@/components/help-modal"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Plus } from "lucide-react"
import type {
  MUIColorDataDual,
  GreyPaletteDual,
  PaletteMode,
  ColorType,
  DualModeColor,
} from "@/types/palette"
import {
  MUI_DEFAULT_COLORS_DUAL,
  MUI_DEFAULT_GREY_DUAL,
} from "@/types/palette"

const STORAGE_KEY = "palette-pally-dual-data"

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)
  const [mode, setMode] = useState<PaletteMode>("light")
  const [colorData, setColorData] = useState<MUIColorDataDual[]>(MUI_DEFAULT_COLORS_DUAL)
  const [greyPalette, setGreyPalette] = useState<GreyPaletteDual>(MUI_DEFAULT_GREY_DUAL)

  // Load data from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        if (parsedData.mode) setMode(parsedData.mode)
        if (parsedData.colors && Array.isArray(parsedData.colors)) {
          setColorData(parsedData.colors)
        }
        if (parsedData.grey) setGreyPalette(parsedData.grey)
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    try {
      const dataToSave = {
        mode,
        colors: colorData,
        grey: greyPalette,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
      toast({
        title: "Saved",
        description: "Palette data saved to LocalStorage",
      })
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      toast({
        title: "Save Error",
        description: "Error occurred while saving data",
        variant: "destructive",
      })
    }
  }

  const handleColorChange = (
    index: number,
    mode: PaletteMode,
    property: "main" | "light" | "lighter" | "dark" | "contrastText",
    value: string
  ) => {
    const newColorData = [...colorData]
    if (!newColorData[index][property]) {
      newColorData[index][property] = { light: "#000000", dark: "#ffffff" } as DualModeColor
    }
    if (newColorData[index][property]) {
      newColorData[index][property]![mode] = value
    }
    setColorData(newColorData)
  }

  const handleDeleteColor = (id: string) => {
    const colorToDelete = colorData.find((c) => c.id === id)
    if (colorToDelete?.isDefault) {
      toast({
        title: "Cannot Delete",
        description: "Default MUI colors cannot be deleted",
        variant: "destructive",
      })
      return
    }

    setColorData(colorData.filter((c) => c.id !== id))
    toast({
      title: "Color Deleted",
      description: `${colorToDelete?.name} has been removed from your palette`,
    })
  }

  const handleNameChange = (index: number, name: string) => {
    const newColorData = [...colorData]
    newColorData[index] = {
      ...newColorData[index],
      name,
    }
    setColorData(newColorData)
  }

  const handleAddColor = () => {
    const newColor: MUIColorDataDual = {
      id: `custom-${Date.now()}`,
      name: "Custom Color",
      type: "theme",
      main: { light: "#808080", dark: "#a0a0a0" },
      light: { light: "#a0a0a0", dark: "#c0c0c0" },
      lighter: { light: "#c0c0c0", dark: "#e0e0e0" },
      dark: { light: "#606060", dark: "#808080" },
      contrastText: { light: "#ffffff", dark: "#000000" },
      isDefault: false,
    }

    setColorData([...colorData, newColor])
    toast({
      title: "Color Added",
      description: "New custom color has been added to your palette",
    })
  }

  const handleGreyChange = (shade: keyof GreyPaletteDual, mode: PaletteMode, value: string) => {
    setGreyPalette({
      ...greyPalette,
      [shade]: {
        ...greyPalette[shade],
        [mode]: value,
      },
    })
  }

  const handleModeChange = (newMode: PaletteMode) => {
    setMode(newMode)
  }

  const resetColors = () => {
    localStorage.removeItem(STORAGE_KEY)
    setMode("light")
    setColorData(MUI_DEFAULT_COLORS_DUAL)
    setGreyPalette(MUI_DEFAULT_GREY_DUAL)

    toast({
      title: "Reset Complete",
      description: "Palette reset to MUI defaults",
    })
  }

  // Background color based on current mode
  const backgroundColor = mode === "light" ? "#ffffff" : "#121212"
  const textColor = mode === "light" ? "#000000" : "#ffffff"

  // Prevent hydration mismatch by only rendering after mount
  if (!isMounted) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#ffffff" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor, color: textColor }}
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <Card className="mb-6" style={{ backgroundColor: mode === "light" ? "#ffffff" : "#1e1e1e" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Logo />
              <HelpModal />
            </div>
            <div className="flex items-center gap-2">
              <ThemeModeToggle mode={mode} onModeChange={handleModeChange} />
              <Button onClick={resetColors} variant="secondary" size="sm">
                Reset to Defaults
              </Button>
              <Button onClick={saveToLocalStorage} variant="outline" size="sm">
                Save
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Horizontal Scrollable Color Picker Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Color Palette Editor</h2>
            <Button onClick={handleAddColor} size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Color
            </Button>
          </div>

          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scroll-smooth">
              {/* Color Cards */}
              {colorData.map((color, index) => (
                <div key={color.id} className="snap-start">
                  <DualColorPickerCard
                    colorData={color}
                    currentMode={mode}
                    onColorChange={(mode, property, value) =>
                      handleColorChange(index, mode, property, value)
                    }
                    onDelete={!color.isDefault ? () => handleDeleteColor(color.id) : undefined}
                    onNameChange={(name) => handleNameChange(index, name)}
                  />
                </div>
              ))}

              {/* Greyscale Card */}
              <div className="snap-start">
                <DualGreyPaletteCard
                  greyPalette={greyPalette}
                  currentMode={mode}
                  onGreyChange={handleGreyChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Color Results Display */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Color Palette Results</h2>
          <div className="grid grid-cols-1 gap-6">
            {colorData.map((color) => (
              <DualColorResultDisplay
                key={color.id}
                colorData={color}
                currentMode={mode}
              />
            ))}
          </div>
        </div>

        <Toaster />
      </div>
    </main>
  )
}
