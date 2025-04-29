"use client"

import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "jp" ? "en" : "jp")
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1 rounded-full"
      onClick={toggleLanguage}
      title={language === "jp" ? "Switch to English" : "日本語に切り替え"}
    >
      <Languages className="h-4 w-4" />
      <span>{language === "jp" ? "EN" : "JP"}</span>
    </Button>
  )
}
