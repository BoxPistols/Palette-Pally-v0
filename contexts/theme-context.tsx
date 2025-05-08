"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// テーマタイプの定義
export type Theme = "light" | "dark"

// コンテキストの型定義
interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

// デフォルト値を持つコンテキストを作成
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
})

// カスタムフックを作成
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

// プロバイダーコンポーネント
export function ThemeProvider({ children }: { children: ReactNode }) {
  // 初期値をlightに設定
  const [theme, setThemeState] = useState<Theme>("light")

  // システムのテーマ設定を取得して初期値を設定
  useEffect(() => {
    // ローカルストレージからテーマ設定を復元
    const savedTheme = localStorage.getItem("palette-pally-theme")
    if (savedTheme === "light" || savedTheme === "dark") {
      setThemeState(savedTheme as Theme)
    } else {
      // 保存されたテーマがない場合はライトモードをデフォルトとする
      setThemeState("light")
    }
  }, [])

  // テーマ設定を保存
  useEffect(() => {
    localStorage.setItem("palette-pally-theme", theme)

    // HTML要素にdata-theme属性を設定
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else {
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  // テーマ切り替え関数
  const toggleTheme = () => {
    setThemeState(theme === "light" ? "dark" : "light")
  }

  // テーマ設定関数
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}
