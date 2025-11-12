"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useLanguage } from "@/contexts/language-context"

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()
  const { language } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1 rounded-full"
      onClick={toggleTheme}
      title={
        theme === "light"
          ? language === "jp"
            ? "ダークモードに切り替え"
            : "Switch to Dark Mode"
          : language === "jp"
            ? "ライトモードに切り替え"
            : "Switch to Light Mode"
      }
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span>
        {theme === "light" ? (language === "jp" ? "ダーク" : "Dark") : language === "jp" ? "ライト" : "Light"}
      </span>
    </Button>
  )
}
