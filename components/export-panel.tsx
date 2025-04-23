"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { PaletteType } from "@/types/palette"

interface ExportPanelProps {
  data: PaletteType
}

export function ExportPanel({ data }: ExportPanelProps) {
  const [isImporting, setIsImporting] = useState(false)

  const exportJSON = () => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "palette-pally-export.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        // Handle imported data - this would need to be lifted up to the parent component
        console.log("Imported data:", json)
        // You would typically call a function passed as prop here to update the parent state
      } catch (error) {
        console.error("Error parsing JSON:", error)
        alert("Invalid JSON file")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={exportJSON} variant="default">
        Export JSON
      </Button>
      <div className="relative">
        <Button onClick={() => setIsImporting(true)} variant="outline" className="relative">
          Import JSON
        </Button>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  )
}
