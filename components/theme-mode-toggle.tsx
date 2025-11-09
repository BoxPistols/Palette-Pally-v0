"use client"

import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import type { PaletteMode } from "@/types/palette"

interface ThemeModeToggleProps {
  mode: PaletteMode
  onModeChange: (mode: PaletteMode) => void
}

export function ThemeModeToggle({ mode, onModeChange }: ThemeModeToggleProps) {
  const toggleMode = () => {
    onModeChange(mode === "light" ? "dark" : "light")
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleMode}
      className="gap-2"
      title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
    >
      {mode === "light" ? (
        <>
          <Sun className="h-4 w-4" />
          Light
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          Dark
        </>
      )}
    </Button>
  )
}
