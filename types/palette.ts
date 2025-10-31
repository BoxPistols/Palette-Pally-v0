export type ColorRole = "primary" | "secondary" | "error" | "warning" | "info" | "success"

export type ColorType = "theme" | "simple"

export type ThemeMode = "light" | "dark"

export interface MUIColorData {
  id: string
  name: string
  type: ColorType
  main: string
  light?: string
  lighter?: string
  dark?: string
  contrastText?: string
  isDefault?: boolean
}

export interface TextColors {
  primary: string
  secondary: string
  disabled: string
}

export interface BackgroundColors {
  default: string
  paper: string
}

export interface GreyPalette {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  A100: string
  A200: string
  A400: string
  A700: string
}

export interface PaletteType {
  mode: ThemeMode
  colors: MUIColorData[]
  text?: TextColors
  background?: BackgroundColors
  divider?: string
  grey?: GreyPalette
}

export const MUI_DEFAULT_COLORS: MUIColorData[] = [
  {
    id: "primary",
    name: "Primary",
    type: "theme",
    main: "#1976d2",
    light: "#42a5f5",
    lighter: "#64b5f6",
    dark: "#1565c0",
    contrastText: "#fff",
    isDefault: true,
  },
  {
    id: "secondary",
    name: "Secondary",
    type: "theme",
    main: "#9c27b0",
    light: "#ba68c8",
    lighter: "#ce93d8",
    dark: "#7b1fa2",
    contrastText: "#fff",
    isDefault: true,
  },
  {
    id: "error",
    name: "Error",
    type: "theme",
    main: "#d32f2f",
    light: "#ef5350",
    lighter: "#e57373",
    dark: "#c62828",
    contrastText: "#fff",
    isDefault: true,
  },
  {
    id: "warning",
    name: "Warning",
    type: "theme",
    main: "#ed6c02",
    light: "#ff9800",
    lighter: "#ffb74d",
    dark: "#e65100",
    contrastText: "#fff",
    isDefault: true,
  },
  {
    id: "info",
    name: "Info",
    type: "theme",
    main: "#0288d1",
    light: "#03a9f4",
    lighter: "#4fc3f7",
    dark: "#01579b",
    contrastText: "#fff",
    isDefault: true,
  },
  {
    id: "success",
    name: "Success",
    type: "theme",
    main: "#2e7d32",
    light: "#4caf50",
    lighter: "#81c784",
    dark: "#1b5e20",
    contrastText: "#fff",
    isDefault: true,
  },
]

export const MUI_DEFAULT_TEXT_LIGHT: TextColors = {
  primary: "rgba(0, 0, 0, 0.87)",
  secondary: "rgba(0, 0, 0, 0.6)",
  disabled: "rgba(0, 0, 0, 0.38)",
}

export const MUI_DEFAULT_TEXT_DARK: TextColors = {
  primary: "#fff",
  secondary: "rgba(255, 255, 255, 0.7)",
  disabled: "rgba(255, 255, 255, 0.5)",
}

export const MUI_DEFAULT_BACKGROUND_LIGHT: BackgroundColors = {
  default: "#fff",
  paper: "#fff",
}

export const MUI_DEFAULT_BACKGROUND_DARK: BackgroundColors = {
  default: "#121212",
  paper: "#121212",
}

export const MUI_DEFAULT_DIVIDER_LIGHT = "rgba(0, 0, 0, 0.12)"

export const MUI_DEFAULT_DIVIDER_DARK = "rgba(255, 255, 255, 0.12)"

export const MUI_DEFAULT_GREY: GreyPalette = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#eeeeee",
  300: "#e0e0e0",
  400: "#bdbdbd",
  500: "#9e9e9e",
  600: "#757575",
  700: "#616161",
  800: "#424242",
  900: "#212121",
  A100: "#f5f5f5",
  A200: "#eeeeee",
  A400: "#bdbdbd",
  A700: "#616161",
}

export const MUI_DEFAULT_TEXT = MUI_DEFAULT_TEXT_LIGHT
export const MUI_DEFAULT_BACKGROUND = MUI_DEFAULT_BACKGROUND_LIGHT
export const MUI_DEFAULT_DIVIDER = MUI_DEFAULT_DIVIDER_LIGHT
