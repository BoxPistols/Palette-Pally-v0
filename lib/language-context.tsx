"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// 言語設定の型定義
type Language = "ja" | "en"

// コンテキストの型定義
type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

// デフォルト値
const defaultContext: LanguageContextType = {
  language: "ja",
  setLanguage: () => null,
  toggleLanguage: () => null
}

// コンテキストの作成
const LanguageContext = createContext<LanguageContextType>(defaultContext)

type LanguageProviderProps = {
  children: ReactNode
}

// ローカルストレージのキー
const STORAGE_KEY = "palette-pally-language"

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("ja")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // ローカルストレージから言語設定を取得
    const savedLanguage = localStorage.getItem(STORAGE_KEY)
    if (savedLanguage && (savedLanguage === "ja" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // 言語を設定し、ローカルストレージに保存
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (isClient) {
      localStorage.setItem(STORAGE_KEY, lang)
    }
  }

  // 言語を切り替える
  const toggleLanguage = () => {
    const newLang = language === "ja" ? "en" : "ja"
    setLanguage(newLang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

// カスタムフック
export function useLanguage() {
  return useContext(LanguageContext)
}
