"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ThemeMode } from "@/types/palette"

interface ThemeModeToggleProps {
  mode: ThemeMode
  onModeChange: (mode: ThemeMode) => void
}

export function ThemeModeToggle({ mode, onModeChange }: ThemeModeToggleProps) {
  const toggleMode = () => {
    onModeChange(mode === "light" ? "dark" : "light")
  }

  return (
    <Button onClick={toggleMode} variant="outline" size="sm" className="gap-2 bg-transparent">
      {mode === "light" ? (
        <>
          <Sun className="h-4 w-4" />
          Light Mode
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          Dark Mode
        </>
      )}
    </Button>
  )
}
