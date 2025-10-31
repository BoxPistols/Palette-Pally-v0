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

interface MUIExportPanelProps {
  data: PaletteType
  onImport: (data: PaletteType) => void
}

export function MUIExportPanel({ data, onImport }: MUIExportPanelProps) {
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateMUIThemeCode = () => {
    const paletteObj: Record<string, any> = {
      mode: data.mode,
    }

    data.colors.forEach((color) => {
      const key = color.name.toLowerCase()
      paletteObj[key] = {
        main: color.main,
        light: color.light,
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
    if (data.divider) {
      paletteObj.divider = data.divider
    }
    if (data.grey) {
      paletteObj.grey = data.grey
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

  const exportJSON = () => {
    try {
      const jsonString = generateJSONExport()
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "mui-palette.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setError(null)
      setIsDialogOpen(false)

      toast({
        title: "Export Complete",
        description: "JSON file download started",
      })
    } catch (err) {
      setError("Export error occurred")
      console.error("Export error:", err)
    }
  }

  const exportMUITheme = () => {
    try {
      const themeCode = generateMUIThemeCode()
      const blob = new Blob([themeCode], { type: "text/javascript" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "theme.js"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setError(null)
      setIsDialogOpen(false)

      toast({
        title: "Export Complete",
        description: "MUI theme file download started",
      })
    } catch (err) {
      setError("Export error occurred")
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

        const json = JSON.parse(event.target.result) as PaletteType
        onImport(json)
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
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mui-theme">MUI Theme</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
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
