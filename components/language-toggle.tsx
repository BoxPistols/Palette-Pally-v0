"use client"

import { useLanguage } from "@/lib/language-context"

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className='text-sm font-medium dark:text-white border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700'
    >
      {language === "ja" ? "EN" : "日本語"}
    </button>
  )
}
