"use client"

import { useState, useEffect } from "react"
import { MUIColorPicker } from "@/components/mui-color-picker"
import { MUIColorDisplay } from "@/components/mui-color-display"
import { MUIExportPanel } from "@/components/mui-export-panel"
import { AdditionalColorsEditor } from "@/components/additional-colors-editor"
import { GreyPaletteEditor } from "@/components/grey-palette-editor"
import { AddColorDialog } from "@/components/add-color-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Logo } from "@/components/logo"
import { HelpModal } from "@/components/help-modal"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { generateMUIColorVariations } from "@/lib/color-utils"
import type { PaletteType, MUIColorData, TextColors, BackgroundColors, GreyPalette, ColorType } from "@/types/palette"
import {
  MUI_DEFAULT_COLORS,
  MUI_DEFAULT_TEXT,
  MUI_DEFAULT_BACKGROUND,
  MUI_DEFAULT_DIVIDER,
  MUI_DEFAULT_GREY,
} from "@/types/palette"

const STORAGE_KEY = "palette-pally-mui-data"

export default function Home() {
  const [colorData, setColorData] = useState<MUIColorData[]>(MUI_DEFAULT_COLORS)
  const [textColors, setTextColors] = useState<TextColors>(MUI_DEFAULT_TEXT)
  const [backgroundColors, setBackgroundColors] = useState<BackgroundColors>(MUI_DEFAULT_BACKGROUND)
  const [dividerColor, setDividerColor] = useState<string>(MUI_DEFAULT_DIVIDER)
  const [greyPalette, setGreyPalette] = useState<GreyPalette>(MUI_DEFAULT_GREY)

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as PaletteType
        if (parsedData.colors && Array.isArray(parsedData.colors)) {
          setColorData(parsedData.colors)
        }
        if (parsedData.text) setTextColors(parsedData.text)
        if (parsedData.background) setBackgroundColors(parsedData.background)
        if (parsedData.divider) setDividerColor(parsedData.divider)
        if (parsedData.grey) setGreyPalette(parsedData.grey)
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
      }
    }
  }, [])

  // Save to localStorage function
  const saveToLocalStorage = () => {
    try {
      const dataToSave: PaletteType = {
        colors: colorData,
        text: textColors,
        background: backgroundColors,
        divider: dividerColor,
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

  const handleAddColor = (name: string, type: ColorType) => {
    const newColor: MUIColorData = {
      id: `custom-${Date.now()}`,
      name,
      type,
      main: "#808080",
      isDefault: false,
    }

    // Generate variations for theme colors
    if (type === "theme") {
      const variations = generateMUIColorVariations(newColor.main)
      Object.assign(newColor, variations)
    } else {
      // For simple colors, just set contrastText
      newColor.contrastText = "#FFFFFF"
    }

    setColorData([...colorData, newColor])
    toast({
      title: "Color Added",
      description: `${name} has been added to your palette`,
    })
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

  const handleColorChange = (index: number, mainColor: string) => {
    const newColorData = [...colorData]
    const currentColor = newColorData[index]

    if (currentColor.type === "theme") {
      const variations = generateMUIColorVariations(mainColor)
      newColorData[index] = {
        ...currentColor,
        ...variations,
      }
    } else {
      // For simple colors, just update main
      newColorData[index] = {
        ...currentColor,
        main: mainColor,
      }
    }

    setColorData(newColorData)
  }

  const handleNameChange = (index: number, name: string) => {
    const newColorData = [...colorData]
    newColorData[index] = {
      ...newColorData[index],
      name,
    }
    setColorData(newColorData)
  }

  const resetColors = () => {
    localStorage.removeItem(STORAGE_KEY)
    setColorData(MUI_DEFAULT_COLORS)
    setTextColors(MUI_DEFAULT_TEXT)
    setBackgroundColors(MUI_DEFAULT_BACKGROUND)
    setDividerColor(MUI_DEFAULT_DIVIDER)
    setGreyPalette(MUI_DEFAULT_GREY)

    toast({
      title: "Reset Complete",
      description: "Palette reset to MUI defaults",
    })
  }

  const exportData: PaletteType = {
    colors: colorData,
    text: textColors,
    background: backgroundColors,
    divider: dividerColor,
    grey: greyPalette,
  }

  const handleImport = (importedData: PaletteType) => {
    try {
      if (importedData.colors && Array.isArray(importedData.colors)) {
        const validColors = importedData.colors.filter(
          (color) =>
            color &&
            typeof color === "object" &&
            "name" in color &&
            "main" in color &&
            typeof color.main === "string" &&
            /^#[0-9A-F]{6}$/i.test(color.main),
        )

        if (validColors.length > 0) {
          setColorData(validColors)
          if (importedData.text) setTextColors(importedData.text)
          if (importedData.background) setBackgroundColors(importedData.background)
          if (importedData.divider) setDividerColor(importedData.divider)
          if (importedData.grey) setGreyPalette(importedData.grey)

          toast({
            title: "Import Complete",
            description: "MUI palette imported successfully",
          })

          setTimeout(saveToLocalStorage, 100)
        } else {
          throw new Error("Invalid color data")
        }
      } else {
        throw new Error("Color data not found")
      }
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Logo />
            <HelpModal />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={resetColors} variant="secondary" size="sm">
              Reset to MUI Defaults
            </Button>
            <Button onClick={saveToLocalStorage} variant="outline" size="sm">
              Save
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <MUIExportPanel data={exportData} onImport={handleImport} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="theme-colors" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="theme-colors">Theme Colors</TabsTrigger>
          <TabsTrigger value="additional-colors">Additional Colors</TabsTrigger>
        </TabsList>

        <TabsContent value="theme-colors">
          <div className="mb-4 flex justify-end">
            <AddColorDialog onAddColor={handleAddColor} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Color Pickers Section */}
            <div>
              <h2 className="text-lg font-semibold mb-3">MUI Color Roles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {colorData.map((color, index) => (
                  <MUIColorPicker
                    key={color.id}
                    colorData={color}
                    onColorChange={(value) => handleColorChange(index, value)}
                    onDelete={() => handleDeleteColor(color.id)}
                    onNameChange={(name) => handleNameChange(index, name)}
                  />
                ))}
              </div>
            </div>

            {/* Color Palette Section */}
            <div>
              <h2 className="text-lg font-semibold mb-3">MUI Color Palette</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {colorData.map((color) => (
                  <MUIColorDisplay key={color.id} colorData={color} />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="additional-colors">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <AdditionalColorsEditor
                text={textColors}
                background={backgroundColors}
                divider={dividerColor}
                onTextChange={setTextColors}
                onBackgroundChange={setBackgroundColors}
                onDividerChange={setDividerColor}
              />
            </div>
            <div>
              <GreyPaletteEditor grey={greyPalette} onGreyChange={setGreyPalette} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Toaster />
    </main>
  )
}
