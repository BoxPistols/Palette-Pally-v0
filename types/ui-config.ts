/**
 * UI Configuration Types
 * Defines flexible layout and theme customization options
 */

export type LayoutMode = "grid" | "list" | "compact"
export type ViewDensity = "comfortable" | "standard" | "compact"
export type CardSize = "small" | "medium" | "large"

export interface SpacingConfig {
  container: number // Container padding
  card: number // Card spacing
  section: number // Section spacing
}

export interface LayoutConfig {
  mode: LayoutMode
  columns: {
    sm: number // Mobile
    md: number // Tablet
    lg: number // Desktop
    xl: number // Large desktop
  }
  density: ViewDensity
  cardSize: CardSize
  showLabels: boolean
  showDescriptions: boolean
  spacing: SpacingConfig
}

export interface ThemeConfig {
  borderRadius: number // Border radius in pixels
  cardElevation: number // Shadow intensity (0-5)
  animationSpeed: number // Animation duration multiplier (0.5-2.0)
  fontSize: {
    base: number // Base font size in px
    scale: number // Font scale factor
  }
  colorScheme: "auto" | "light" | "dark"
}

export interface UIConfig {
  layout: LayoutConfig
  theme: ThemeConfig
}

export const DEFAULT_UI_CONFIG: UIConfig = {
  layout: {
    mode: "grid",
    columns: {
      sm: 1,
      md: 2,
      lg: 2,
      xl: 3,
    },
    density: "standard",
    cardSize: "medium",
    showLabels: true,
    showDescriptions: true,
    spacing: {
      container: 16,
      card: 12,
      section: 24,
    },
  },
  theme: {
    borderRadius: 8,
    cardElevation: 1,
    animationSpeed: 1.0,
    fontSize: {
      base: 14,
      scale: 1.0,
    },
    colorScheme: "auto",
  },
}

export const PRESET_CONFIGS: Record<string, Partial<UIConfig>> = {
  minimal: {
    layout: {
      mode: "list",
      columns: { sm: 1, md: 1, lg: 1, xl: 1 },
      density: "compact",
      cardSize: "small",
      showLabels: true,
      showDescriptions: false,
      spacing: { container: 8, card: 8, section: 16 },
    },
    theme: {
      borderRadius: 4,
      cardElevation: 0,
      animationSpeed: 0.7,
      fontSize: { base: 13, scale: 0.95 },
      colorScheme: "auto",
    },
  },
  spacious: {
    layout: {
      mode: "grid",
      columns: { sm: 1, md: 2, lg: 3, xl: 4 },
      density: "comfortable",
      cardSize: "large",
      showLabels: true,
      showDescriptions: true,
      spacing: { container: 24, card: 20, section: 32 },
    },
    theme: {
      borderRadius: 12,
      cardElevation: 2,
      animationSpeed: 1.2,
      fontSize: { base: 16, scale: 1.1 },
      colorScheme: "auto",
    },
  },
  compact: {
    layout: {
      mode: "grid",
      columns: { sm: 2, md: 3, lg: 4, xl: 6 },
      density: "compact",
      cardSize: "small",
      showLabels: false,
      showDescriptions: false,
      spacing: { container: 12, card: 6, section: 12 },
    },
    theme: {
      borderRadius: 6,
      cardElevation: 1,
      animationSpeed: 0.8,
      fontSize: { base: 12, scale: 0.9 },
      colorScheme: "auto",
    },
  },
}
