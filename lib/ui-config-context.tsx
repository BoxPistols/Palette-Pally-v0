"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import type { UIConfig } from "@/types/ui-config"
import { DEFAULT_UI_CONFIG, PRESET_CONFIGS } from "@/types/ui-config"

const UI_CONFIG_STORAGE_KEY = "palette-pally-ui-config"

interface UIConfigContextType {
  config: UIConfig
  updateLayout: (layout: Partial<UIConfig["layout"]>) => void
  updateTheme: (theme: Partial<UIConfig["theme"]>) => void
  applyPreset: (presetName: keyof typeof PRESET_CONFIGS) => void
  resetToDefaults: () => void
}

const UIConfigContext = createContext<UIConfigContextType | undefined>(undefined)

export function UIConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<UIConfig>(DEFAULT_UI_CONFIG)

  // Load config from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(UI_CONFIG_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as UIConfig
        setConfig(parsed)
        applyConfigToDOM(parsed)
      } else {
        applyConfigToDOM(DEFAULT_UI_CONFIG)
      }
    } catch (error) {
      console.error("Failed to load UI config:", error)
      applyConfigToDOM(DEFAULT_UI_CONFIG)
    }
  }, [])

  // Apply config to DOM as CSS custom properties
  const applyConfigToDOM = (cfg: UIConfig) => {
    const root = document.documentElement

    // Layout spacing
    root.style.setProperty("--spacing-container", `${cfg.layout.spacing.container}px`)
    root.style.setProperty("--spacing-card", `${cfg.layout.spacing.card}px`)
    root.style.setProperty("--spacing-section", `${cfg.layout.spacing.section}px`)

    // Theme
    root.style.setProperty("--theme-border-radius", `${cfg.theme.borderRadius}px`)
    root.style.setProperty("--theme-animation-speed", `${cfg.theme.animationSpeed}`)
    root.style.setProperty("--theme-font-base", `${cfg.theme.fontSize.base}px`)
    root.style.setProperty("--theme-font-scale", `${cfg.theme.fontSize.scale}`)

    // Card elevation shadows
    const elevations = [
      "none",
      "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
      "0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)",
      "0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)",
      "0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)",
      "0 20px 40px rgba(0,0,0,0.2)",
    ]
    root.style.setProperty("--theme-card-shadow", elevations[cfg.theme.cardElevation] || elevations[1])

    // Grid columns
    root.style.setProperty("--grid-cols-sm", `${cfg.layout.columns.sm}`)
    root.style.setProperty("--grid-cols-md", `${cfg.layout.columns.md}`)
    root.style.setProperty("--grid-cols-lg", `${cfg.layout.columns.lg}`)
    root.style.setProperty("--grid-cols-xl", `${cfg.layout.columns.xl}`)

    // Card sizes
    const cardSizes = {
      small: { minHeight: "200px", maxHeight: "300px" },
      medium: { minHeight: "250px", maxHeight: "400px" },
      large: { minHeight: "300px", maxHeight: "500px" },
    }
    const cardSize = cardSizes[cfg.layout.cardSize]
    root.style.setProperty("--card-min-height", cardSize.minHeight)
    root.style.setProperty("--card-max-height", cardSize.maxHeight)
  }

  // Save config to localStorage and apply to DOM
  const saveConfig = (newConfig: UIConfig) => {
    try {
      localStorage.setItem(UI_CONFIG_STORAGE_KEY, JSON.stringify(newConfig))
      applyConfigToDOM(newConfig)
    } catch (error) {
      console.error("Failed to save UI config:", error)
    }
  }

  const updateLayout = (layout: Partial<UIConfig["layout"]>) => {
    const newConfig = {
      ...config,
      layout: { ...config.layout, ...layout },
    }
    setConfig(newConfig)
    saveConfig(newConfig)
  }

  const updateTheme = (theme: Partial<UIConfig["theme"]>) => {
    const newConfig = {
      ...config,
      theme: { ...config.theme, ...theme },
    }
    setConfig(newConfig)
    saveConfig(newConfig)
  }

  const applyPreset = (presetName: keyof typeof PRESET_CONFIGS) => {
    const preset = PRESET_CONFIGS[presetName]
    if (!preset) return

    const newConfig = {
      layout: { ...config.layout, ...preset.layout },
      theme: { ...config.theme, ...preset.theme },
    }
    setConfig(newConfig)
    saveConfig(newConfig)
  }

  const resetToDefaults = () => {
    setConfig(DEFAULT_UI_CONFIG)
    saveConfig(DEFAULT_UI_CONFIG)
  }

  return (
    <UIConfigContext.Provider
      value={{
        config,
        updateLayout,
        updateTheme,
        applyPreset,
        resetToDefaults,
      }}
    >
      {children}
    </UIConfigContext.Provider>
  )
}

export function useUIConfig() {
  const context = useContext(UIConfigContext)
  if (!context) {
    throw new Error("useUIConfig must be used within a UIConfigProvider")
  }
  return context
}
