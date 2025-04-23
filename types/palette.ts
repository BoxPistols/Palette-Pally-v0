export interface ColorData {
  name: string
  value: string
}

export interface PaletteType {
  colors: ColorData[]
  variations: Record<string, Record<string, string>>
}
