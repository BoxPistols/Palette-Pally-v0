import { useState, useEffect, useCallback } from "react"
import { ColorData, TextColorSettings, defaultTextColorSettings } from "@/types/palette"
import { validatePaletteData, isLegacyPaletteFormat } from "@/lib/storage-validation"
import { useToast } from "@/hooks/use-toast"
import type { Typography } from "@/types/palette"

export type ColorMode = "standard" | "tailwind" | "material"

export interface PaletteStorageData {
  colors: ColorData[]
  textColorSettings: TextColorSettings
  primaryColorIndex: number
  colorMode: ColorMode
  showTailwindClasses: boolean
  showMaterialNames: boolean
  typographyTokens: Record<string, Typography>
  isFigmaImportMode: boolean
  isTypographyOnly: boolean
  activeTab: string
}

export interface UseColorPaletteStorageReturn {
  data: PaletteStorageData
  isLoading: boolean
  saveToStorage: (data: Partial<PaletteStorageData>) => void
  resetStorage: () => void
}

const STORAGE_KEY = "palette-pally-data-v4"

const defaultData: PaletteStorageData = {
  colors: [],
  textColorSettings: defaultTextColorSettings,
  primaryColorIndex: 0,
  colorMode: "standard",
  showTailwindClasses: false,
  showMaterialNames: false,
  typographyTokens: {},
  isFigmaImportMode: false,
  isTypographyOnly: false,
  activeTab: "colors",
}

/**
 * カラーパレットデータのlocalStorageへの保存・読み込みを管理するカスタムフック
 */
export function useColorPaletteStorage(language: "jp" | "en"): UseColorPaletteStorageReturn {
  const [data, setData] = useState<PaletteStorageData>(defaultData)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load data from localStorage on mount
  useEffect(() => {
    // Clean up old/unused storage keys
    const oldKeys = ["palette-pally-language", "palette-pally-theme"]
    oldKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key)
      }
    })

    const savedData = localStorage.getItem(STORAGE_KEY)

    if (!savedData) {
      setIsLoading(false)
      return
    }

    try {
      const parsedData = JSON.parse(savedData)

      // Check if this is legacy/incompatible data
      if (isLegacyPaletteFormat(parsedData)) {
        console.warn("Legacy data format detected, clearing localStorage")
        localStorage.removeItem(STORAGE_KEY)
        toast({
          title: language === "jp" ? "データ形式が更新されました" : "Data Format Updated",
          description:
            language === "jp"
              ? "アプリの更新により、パレットがリセットされました。デフォルト値を読み込みました。"
              : "Your palette has been reset due to an app update. Default values loaded.",
        })
        setIsLoading(false)
        return
      }

      // Validate the data structure
      const validation = validatePaletteData(parsedData)

      if (!validation.isValid || !validation.sanitizedData) {
        console.error("Invalid localStorage data:", validation.errors)
        localStorage.removeItem(STORAGE_KEY)
        toast({
          title: language === "jp" ? "データ読み込みエラー" : "Data Load Error",
          description:
            language === "jp"
              ? "保存されたデータが破損していたため、デフォルトにリセットされました。"
              : "Saved data was corrupted and has been reset to defaults.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // If there were validation warnings but data is salvageable
      if (validation.errors.length > 0) {
        console.warn("Data loaded with warnings:", validation.errors)
      }

      // Load the sanitized data
      const loadedData = validation.sanitizedData

      setData({
        colors: loadedData.colors || [],
        textColorSettings: loadedData.textColorSettings || defaultTextColorSettings,
        primaryColorIndex:
          typeof loadedData.primaryColorIndex === "number" && loadedData.primaryColorIndex >= 0
            ? loadedData.primaryColorIndex
            : 0,
        colorMode: loadedData.colorMode || "standard",
        showTailwindClasses: loadedData.showTailwindClasses ?? false,
        showMaterialNames: loadedData.showMaterialNames ?? false,
        typographyTokens: loadedData.typographyTokens || {},
        isFigmaImportMode: loadedData.isFigmaImportMode ?? false,
        isTypographyOnly: loadedData.isTypographyOnly ?? false,
        activeTab: loadedData.activeTab || "colors",
      })

      // Save the sanitized data back if there were any corrections
      if (validation.errors.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedData))
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
      localStorage.removeItem(STORAGE_KEY)
      toast({
        title: language === "jp" ? "データ読み込みエラー" : "Data Load Error",
        description:
          language === "jp"
            ? "保存されたデータの読み込みに失敗しました。デフォルト値を使用します。"
            : "Failed to load saved data. Using default values.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [language, toast])

  // Save data to localStorage
  const saveToStorage = useCallback(
    (partialData: Partial<PaletteStorageData>) => {
      const newData = { ...data, ...partialData }
      setData(newData)

      // Debounce the save operation
      setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
        } catch (error) {
          console.error("Error saving data to localStorage:", error)
          toast({
            title: language === "jp" ? "保存エラー" : "Save Error",
            description:
              language === "jp"
                ? "データの保存に失敗しました。ストレージ容量を確認してください。"
                : "Failed to save data. Please check your storage quota.",
            variant: "destructive",
          })
        }
      }, 100)
    },
    [data, language, toast]
  )

  // Reset storage to defaults
  const resetStorage = useCallback(() => {
    setData(defaultData)
    try {
      localStorage.removeItem(STORAGE_KEY)
      toast({
        title: language === "jp" ? "リセット完了" : "Reset Complete",
        description:
          language === "jp"
            ? "パレットデータをリセットしました。"
            : "Palette data has been reset.",
      })
    } catch (error) {
      console.error("Error resetting localStorage:", error)
    }
  }, [language, toast])

  return {
    data,
    isLoading,
    saveToStorage,
    resetStorage,
  }
}
