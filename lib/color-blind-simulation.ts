// 色覚異常シミュレーション用の変換行列
// 参考: https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html

// 色覚異常の種類
export type ColorBlindnessType = "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia"

// RGB値を0-1の範囲に正規化
function normalizeRGB(r: number, g: number, b: number): [number, number, number] {
  return [r / 255, g / 255, b / 255]
}

// RGB値を0-255の範囲に戻す
function denormalizeRGB(r: number, g: number, b: number): [number, number, number] {
  return [
    Math.round(Math.max(0, Math.min(255, r * 255))),
    Math.round(Math.max(0, Math.min(255, g * 255))),
    Math.round(Math.max(0, Math.min(255, b * 255))),
  ]
}

// 行列乗算
function matrixMultiply(matrix: number[][], vector: number[]): number[] {
  return matrix.map((row) => row.reduce((sum, cell, i) => sum + cell * vector[i], 0))
}

// 色覚異常シミュレーション用の変換行列
const colorBlindnessMatrices: Record<ColorBlindnessType, number[][]> = {
  // 第一色覚異常（赤色弱）
  protanopia: [
    [0.567, 0.433, 0.0],
    [0.558, 0.442, 0.0],
    [0.0, 0.242, 0.758],
  ],
  // 第二色覚異常（緑色弱）
  deuteranopia: [
    [0.625, 0.375, 0.0],
    [0.7, 0.3, 0.0],
    [0.0, 0.3, 0.7],
  ],
  // 第三色覚異常（青色弱）
  tritanopia: [
    [0.95, 0.05, 0.0],
    [0.0, 0.433, 0.567],
    [0.0, 0.475, 0.525],
  ],
  // 完全色覚異常（色盲）
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
}

// HEXカラーコードをRGB値に変換
function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)]
    : null
}

// RGB値をHEXカラーコードに変換
function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

// 色覚異常シミュレーション
export function simulateColorBlindness(hexColor: string, type: ColorBlindnessType): string {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return hexColor

  const [r, g, b] = rgb
  const normalizedRGB = normalizeRGB(r, g, b)

  // 変換行列を適用
  const matrix = colorBlindnessMatrices[type]
  const simulatedRGB = matrixMultiply(matrix, normalizedRGB)

  // 0-255の範囲に戻す
  const [simR, simG, simB] = denormalizeRGB(simulatedRGB[0], simulatedRGB[1], simulatedRGB[2])

  return rgbToHex(simR, simG, simB)
}

// すべての色覚異常タイプでシミュレーション
export function simulateAllColorBlindness(hexColor: string): Record<ColorBlindnessType, string> {
  return {
    protanopia: simulateColorBlindness(hexColor, "protanopia"),
    deuteranopia: simulateColorBlindness(hexColor, "deuteranopia"),
    tritanopia: simulateColorBlindness(hexColor, "tritanopia"),
    achromatopsia: simulateColorBlindness(hexColor, "achromatopsia"),
  }
}
