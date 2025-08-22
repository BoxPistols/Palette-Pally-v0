export interface ColorData {
  name: string
  value: string
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

export type ColorVariationSettings = {
    usePerceptualModel: boolean;
    chromaReduction: number; // 全体の彩度調整 (0.0 - 1.0)
    mainChroma: number;      // Mainカラーの彩度乗数 (相対的)
    darkDelta: number;       // Darkバリエーションの明度デルタ (-1.0 - 0.0)
    lightDelta: number;      // Lightバリエーションの明度デルタ (0.0 - 1.0)
    lighterDelta: number;    // Lighterバリエーションの明度デルタ (0.0 - 1.0)
};

export const defaultVariationSettings: ColorVariationSettings = {
    usePerceptualModel: true,
    chromaReduction: 0.85,
    mainChroma: 1.0,
    darkDelta: -0.25,
    lightDelta: 0.25,
    lighterDelta: 0.5,
};

export interface GreyScaleColor {
  id: string; // e.g., "grey-50", "grey-100"
  originalHex: string;
  adjustedHex: string;
  lightnessAdjustment: number; // e.g., -100 to 100, 0 means no change
}

export type GreyScalePalette = GreyScaleColor[];

export interface PaletteType {
    colors: ColorData[];
    variations: Record<string, Record<string, string>>;
    textColorSettings?: TextColorSettings; // オプショナルに変更
    variationSettings?: ColorVariationSettings;
    greyScale?: GreyScalePalette; // 追加
}
