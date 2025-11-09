"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import type { PaletteType } from "@/types/palette"
import { paletteToFigmaTokens, figmaTokensToPalette, validateFigmaTokens } from "@/lib/figma-tokens"
import { downloadFile } from "@/lib/file-utils"
import { FILE_NAMES, MIME_TYPES, TOAST_MESSAGES } from "@/constants/app-constants"

interface MUIExportPanelProps {
  data: PaletteType
  onImport: (data: PaletteType) => void
}

export function MUIExportPanel({ data, onImport }: MUIExportPanelProps) {
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateMUIThemeCode = () => {
    const paletteObj: Record<string, any> = {}

    // Add mode if specified
    if (data.mode) {
      paletteObj.mode = data.mode
    }

    // Add theme colors
    data.colors.forEach((color) => {
      const colorId = color.name.replace(/\s+/g, "").replace(/^(.)/, (c) => c.toLowerCase())
      paletteObj[colorId] = {
        main: color.main,
        light: color.light,
        lighter: color.lighter,
        dark: color.dark,
        contrastText: color.contrastText,
      }
    })

    if (data.text) {
      paletteObj.text = data.text
    }
    if (data.background) {
      paletteObj.background = data.background
    }
    if (data.action) {
      paletteObj.action = data.action
    }
    if (data.divider) {
      paletteObj.divider = data.divider
    }
    if (data.grey) {
      paletteObj.grey = data.grey
    }
    if (data.common) {
      paletteObj.common = data.common
    }
    if (data.tonalOffset) {
      paletteObj.tonalOffset = data.tonalOffset
    }
    if (data.contrastThreshold) {
      paletteObj.contrastThreshold = data.contrastThreshold
    }

    return `import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: ${JSON.stringify(paletteObj, null, 4)},
});

export default theme;`
  }

  const generateJSONExport = () => {
    return JSON.stringify(data, null, 2)
  }

  const generateFigmaTokens = () => {
    const tokens = paletteToFigmaTokens(data)
    return JSON.stringify(tokens, null, 2)
  }

  const exportJSON = () => {
    try {
      const jsonString = generateJSONExport()
      downloadFile(jsonString, FILE_NAMES.MUI_PALETTE)
      setError(null)
      setIsDialogOpen(false)

      toast({
        title: TOAST_MESSAGES.EXPORT_COMPLETE.EN.title,
        description: TOAST_MESSAGES.EXPORT_COMPLETE.EN.description.JSON,
      })
    } catch (err) {
      setError(TOAST_MESSAGES.EXPORT_ERROR.EN)
      console.error("Export error:", err)
    }
  }

  const exportMUITheme = () => {
    try {
      const themeCode = generateMUIThemeCode()
      downloadFile(themeCode, FILE_NAMES.MUI_THEME, MIME_TYPES.JAVASCRIPT)
      setError(null)
      setIsDialogOpen(false)

      toast({
        title: TOAST_MESSAGES.EXPORT_COMPLETE.EN.title,
        description: TOAST_MESSAGES.EXPORT_COMPLETE.EN.description.MUI_THEME,
      })
    } catch (err) {
      setError(TOAST_MESSAGES.EXPORT_ERROR.EN)
      console.error("Export error:", err)
    }
  }

  const exportFigmaTokens = () => {
    try {
      const tokensString = generateFigmaTokens()
      downloadFile(tokensString, FILE_NAMES.FIGMA_TOKENS)
      setError(null)
      setIsDialogOpen(false)

      toast({
        title: TOAST_MESSAGES.EXPORT_COMPLETE.EN.title,
        description: TOAST_MESSAGES.EXPORT_COMPLETE.EN.description.FIGMA_TOKENS,
      })
    } catch (err) {
      setError(TOAST_MESSAGES.EXPORT_ERROR.EN)
      console.error("Export error:", err)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        if (typeof event.target?.result !== "string") {
          throw new Error("Failed to read file")
        }

        const json = JSON.parse(event.target.result)

        // Check if it's Figma Design Tokens format
        if (validateFigmaTokens(json)) {
          const palette = figmaTokensToPalette(json)
          onImport(palette as PaletteType)
          toast({
            title: "Import Success",
            description: "Figma Design Tokens imported successfully",
          })
        } else {
          // Try as regular JSON format
          const palette = json as PaletteType
          onImport(palette)
          toast({
            title: "Import Success",
            description: "Palette imported successfully",
          })
        }

        setError(null)

        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } catch (err) {
        setError("Failed to parse JSON file. Please check the format.")
        console.error("Error parsing JSON:", err)

        toast({
          title: "Import Error",
          description: "Failed to parse JSON file. Please check the format.",
          variant: "destructive",
        })
      }
    }
    reader.onerror = () => {
      setError("Failed to read file.")
      toast({
        title: "Import Error",
        description: "Failed to read file.",
        variant: "destructive",
      })
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 justify-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm">
              Export
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Export MUI Palette</DialogTitle>
              <DialogDescription>Choose export format for your MUI color palette</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="mui-theme">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mui-theme">MUI Theme</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
                <TabsTrigger value="figma">Figma Tokens</TabsTrigger>
              </TabsList>

              <TabsContent value="mui-theme" className="space-y-4">
                <div className="max-h-[400px] overflow-auto bg-gray-50 p-4 rounded text-xs font-mono">
                  <pre>{generateMUIThemeCode()}</pre>
                </div>
                <Button onClick={exportMUITheme} className="w-full">
                  Download theme.js
                </Button>
              </TabsContent>

              <TabsContent value="json" className="space-y-4">
                <div className="max-h-[400px] overflow-auto bg-gray-50 p-4 rounded text-xs font-mono">
                  <pre>{generateJSONExport()}</pre>
                </div>
                <Button onClick={exportJSON} className="w-full">
                  Download JSON
                </Button>
              </TabsContent>

              <TabsContent value="figma" className="space-y-4">
                <div className="max-h-[400px] overflow-auto bg-gray-50 p-4 rounded text-xs font-mono">
                  <pre>{generateFigmaTokens()}</pre>
                </div>
                <Button onClick={exportFigmaTokens} className="w-full">
                  Download design-tokens.json
                </Button>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="relative">
          <Button variant="outline" size="sm" className="relative bg-transparent">
            Import JSON
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
