"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="h-8 min-w-10"
    >
      {language === "ja" ? "EN" : "日本語"}
    </Button>
  )
} 