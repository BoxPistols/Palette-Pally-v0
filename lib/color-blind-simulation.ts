// 色覚異常シミュレーション用の変換行列
// 参考: https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html

// 色覚異常の種類
export type ColorBlindnessType = "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia" | "grayscale"

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
  // グレースケール用の行列を追加
  grayscale: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
}

// HEXカラーコードをRGB値に変換
function hexToRgb(hex: string): [number, number, number] {
  // 無効なHEXコードの場合はデフォルト値を返す
  if (!hex || typeof hex !== "string" || !hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)) {
    return [0, 0, 0]
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)]
    : [0, 0, 0]
}

// RGB値をHEXカラーコードに変換
function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

// 色覚異常シミュレーション
export function simulateColorBlindness(hexColor: string, type: ColorBlindnessType): string {
  // 無効なHEXコードの場合はそのまま返す
  if (!hexColor || typeof hexColor !== "string" || !hexColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)) {
    return "#cccccc"
  }

  const rgb = hexToRgb(hexColor)
  const [r, g, b] = rgb
  const normalizedRGB = normalizeRGB(r, g, b)

  // 変換行列を適用
  const matrix = colorBlindnessMatrices[type]
  const simulatedRGB = matrixMultiply(matrix, normalizedRGB)

  // 0-255の範囲に戻す
  const [simR, simG, simB] = denormalizeRGB(simulatedRGB[0], simulatedRGB[1], simulatedRGB[2])

  return rgbToHex(simR, simG, simB)
}

// モノクロ（グレースケール）変換関数
export function simulateMonochromacy(hexColor: string): string {
  // 無効なHEXコードの場合はデフォルト値を返す
  if (!hexColor || typeof hexColor !== "string" || !hexColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)) {
    return "#cccccc"
  }

  // 16進数カラーコードをRGB値に変換
  const r = Number.parseInt(hexColor.slice(1, 3), 16)
  const g = Number.parseInt(hexColor.slice(3, 5), 16)
  const b = Number.parseInt(hexColor.slice(5, 7), 16)

  // グレースケール変換（輝度計算）
  // 人間の目は緑に最も敏感で、次に赤、最後に青という順番で感度が異なるため、
  // 単純な平均ではなく、重み付けされた計算を使用します
  const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b)

  // グレースケール値をRGBの各チャンネルに適用
  const grayHex = gray.toString(16).padStart(2, "0")
  return `#${grayHex}${grayHex}${grayHex}`
}

// グレースケール変換関数のエイリアス
export function simulateGrayscale(hexColor: string): string {
  return simulateMonochromacy(hexColor)
}

// すべての色覚異常タイプでシミュレーション
export function simulateAllColorBlindness(hexColor: string): Record<ColorBlindnessType, string> {
  // 無効なHEXコードの場合はデフォルト値を返す
  if (!hexColor || typeof hexColor !== "string" || !hexColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)) {
    return {
      protanopia: "#cccccc",
      deuteranopia: "#cccccc",
      tritanopia: "#cccccc",
      achromatopsia: "#cccccc",
      grayscale: "#cccccc",
    }
  }

  const rgb = hexToRgb(hexColor)
  const [r, g, b] = rgb

  // 各色覚異常タイプでシミュレーション
  const protanopiaColor = simulateColorBlindness(hexColor, "protanopia")
  const deuteranopiaColor = simulateColorBlindness(hexColor, "deuteranopia")
  const tritanopiaColor = simulateColorBlindness(hexColor, "tritanopia")
  const achromatopsiaColor = simulateColorBlindness(hexColor, "achromatopsia")
  const grayscaleColor = simulateGrayscale(hexColor)

  return {
    protanopia: protanopiaColor,
    deuteranopia: deuteranopiaColor,
    tritanopia: tritanopiaColor,
    achromatopsia: achromatopsiaColor,
    grayscale: grayscaleColor,
  }
}

// 特定の色覚異常タイプでシミュレーション（個別関数）
export function simulateProtanopia(hexColor: string): string {
  return simulateColorBlindness(hexColor, "protanopia")
}

export function simulateDeuteranopia(hexColor: string): string {
  return simulateColorBlindness(hexColor, "deuteranopia")
}

export function simulateTritanopia(hexColor: string): string {
  return simulateColorBlindness(hexColor, "tritanopia")
}
