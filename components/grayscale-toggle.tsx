"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { EyeOff } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function GrayscaleToggle() {
  const { language } = useLanguage()
  const [isGrayscale, setIsGrayscale] = useState(false)

  useEffect(() => {
    // グレースケールモードの切り替え
    if (isGrayscale) {
      document.documentElement.classList.add("grayscale")
    } else {
      document.documentElement.classList.remove("grayscale")
    }
  }, [isGrayscale])

  return (
    <Button
      variant={isGrayscale ? "default" : "outline"}
      size="sm"
      className="flex items-center gap-1"
      onClick={() => setIsGrayscale(!isGrayscale)}
      title={language === "jp" ? "グレースケールモード" : "Grayscale Mode"}
    >
      <EyeOff className="h-4 w-4" />
      <span className="hidden sm:inline">{language === "jp" ? "グレースケール" : "Grayscale"}</span>
    </Button>
  )
}
