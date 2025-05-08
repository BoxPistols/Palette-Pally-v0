"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const [isUserSet, setIsUserSet] = useState<boolean>(false)

  // 初期化時にローカルストレージから設定を読み込む
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null
    const isUserSetTheme = localStorage.getItem("isUserSetTheme") === "true"

    if (storedTheme && isUserSetTheme) {
      setThemeState(storedTheme)
      setIsUserSet(true)
    } else {
      // ユーザーが明示的に設定していない場合はシステム設定に従う
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        setThemeState("dark")
      } else {
        setThemeState("light")
      }
    }
  }, [])

  // テーマが変更されたらDOMに反映
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  // テーマを設定する関数
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    setIsUserSet(true)
    localStorage.setItem("theme", newTheme)
    localStorage.setItem("isUserSetTheme", "true")
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
