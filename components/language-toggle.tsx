"use client"

import { useLanguage } from "@/lib/language-context"

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      style={{ padding: '0.5em 1em', border: '1px solid #ccc', borderRadius: 4, background: '#fff', cursor: 'pointer' }}
    >
      {language === "ja" ? "EN" : "日本語"}
    </button>
  )
} 