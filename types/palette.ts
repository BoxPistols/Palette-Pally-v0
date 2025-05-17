export interface ColorData {
  name: string
  value: string
}

export interface PaletteType {
  colors: ColorData[];
  variations: Record<string, Record<string, string>>;
  textColorSettings: TextColorSettings;
  variationSettings?: ColorVariationSettings;
}

export type TextColorMode = "default" | "white" | "black";

export interface TextColorSettings {
  main: TextColorMode;
  dark: TextColorMode;
  light: TextColorMode;
  lighter: TextColorMode;
}

export const defaultTextColorSettings: TextColorSettings = {
  main: "default",
  dark: "default",
  light: "default",
  lighter: "default",
};

export interface ColorVariationSettings {
  usePerceptualModel: boolean;
  lightDelta: number;
  lighterDelta: number;
  chromaReduction: number;
}

export interface PaletteType {
  colors: ColorData[];
  variations: Record<string, Record<string, string>>;
  textColorSettings: TextColorSettings;
  variationSettings?: ColorVariationSettings;
}

export interface ColorVariationSettings {
  usePerceptualModel: boolean;
  mainChroma: number; // メイン色の彩度調整（倍率、1.0が元の彩度）
  darkDelta: number; // ダーク色の明度変化（-1.0〜0.0）
  lightDelta: number; // ライト色の明度変化（0.0〜1.0）
  lighterDelta: number; // ライター色の明度変化（0.0〜1.0）
  chromaReduction: number; // 明るい色の彩度低減率（0.0〜1.0）
}

// types/palette.ts の ColorVariationSettings 型の説明コメント更新
export interface ColorVariationSettings {
  usePerceptualModel: boolean;
  mainChroma: number; // メイン色の追加彩度調整（相対倍率、1.0が元の彩度）
  darkDelta: number; // ダーク色の明度変化（-1.0〜0.0）
  lightDelta: number; // ライト色の明度変化（0.0〜1.0）
  lighterDelta: number; // ライター色の明度変化（0.0〜1.0）
  chromaReduction: number; // 全体の彩度調整係数（0.0〜1.0）
}

// PaletteType を拡張
export interface PaletteType {
  colors: ColorData[];
  variations: Record<string, Record<string, string>>;
  textColorSettings: TextColorSettings;
  variationSettings?: ColorVariationSettings;
}

// types/palette.ts の defaultVariationSettings 定義
export const defaultVariationSettings: ColorVariationSettings = {
  usePerceptualModel: true,
  mainChroma: 1.0, // デフォルトは元の彩度を維持
  darkDelta: -0.15, // 15%暗く
  lightDelta: 0.2, // 20%明るく
  lighterDelta: 0.35, // 35%明るく
  chromaReduction: 0.8, // 彩度を80%に維持
};