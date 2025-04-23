export interface ColorData {
  name: string
  value: string
}

export interface PaletteType {
  colors: ColorData[]
  variations: Record<string, Record<string, string>>
  textColorSettings?: TextColorSettings
}

export type TextColorMode = "default" | "white" | "black"

export interface TextColorSettings {
  main: TextColorMode
  dark: TextColorMode
  light: TextColorMode
  lighter: TextColorMode
}

export const defaultTextColorSettings: TextColorSettings = {
  main: "default",
  dark: "default",
  light: "default",
  lighter: "default",
}
