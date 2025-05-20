// ======== 基本変換関数 ========

// RGB <-> HEX 変換
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

// sRGB <-> 線形RGB変換
function sRGBToLinear(value: number): number {
  return value <= 0.04045
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}

function linearToSRGB(value: number): number {
  return value <= 0.0031308
    ? 12.92 * value
    : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
}

// ======== Oklab色空間関連の関数 ========

export function hexToOklab(
  hex: string
): { l: number; a: number; b: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  // sRGBから線形RGB
  const r = sRGBToLinear(rgb.r / 255);
  const g = sRGBToLinear(rgb.g / 255);
  const b = sRGBToLinear(rgb.b / 255);

  // 線形RGBからOklab
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    l: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

export function oklabToHex(l: number, a: number, b: number): string {
  // Oklabから線形RGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l_cubed = l_ * l_ * l_;
  const m_cubed = m_ * m_ * m_;
  const s_cubed = s_ * s_ * s_;

  const r =
    4.0767416621 * l_cubed - 3.3077115913 * m_cubed + 0.2309699292 * s_cubed;
  const g =
    -1.2684380046 * l_cubed + 2.6097574011 * m_cubed - 0.3413193965 * s_cubed;
  const b_val =
    -0.0041960863 * l_cubed - 0.7034186147 * m_cubed + 1.707614701 * s_cubed;

  // 線形RGBからsRGB
  const r_srgb = linearToSRGB(r);
  const g_srgb = linearToSRGB(g);
  const b_srgb = linearToSRGB(b_val);

  // 0-255の範囲にクランプ
  const r8 = Math.max(0, Math.min(255, Math.round(r_srgb * 255)));
  const g8 = Math.max(0, Math.min(255, Math.round(g_srgb * 255)));
  const b8 = Math.max(0, Math.min(255, Math.round(b_srgb * 255)));

  return rgbToHex(r8, g8, b8);
}

// ======== HSL色空間関連の関数 (従来との互換性のため維持) ========

export function hexToHsl(
  hex: string
): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return rgbToHex(
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  );
}

// ======== 色の知覚と計算 ========

// Oklabベースの知覚的な色の明るさを計算（0-100の範囲）
export function getOklabLightness(hex: string): number {
  const oklab = hexToOklab(hex);
  if (!oklab) return 0;

  // l値は0-1の範囲なので、0-100にスケーリング
  return oklab.l * 100;
}

// 従来のRGB明るさ計算（互換性のために維持）
export function getColorBrightness(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  // 知覚的重み付き明るさ（0-255の範囲）
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
}

// Oklabベースの色の明暗判定（より正確な知覚ベース）
export function isLightColor(hex: string): boolean {
  const oklab = hexToOklab(hex);
  if (!oklab) return false;

  // Oklabのl値は0-1の範囲。一般的に0.6以上が明るい色と知覚される
  return oklab.l > 0.6;
}

// ======== 色の調整と変換 ========

// Oklab色空間で色を調整する関数（知覚的に均一な調整）
export function adjustColorInOklab(
  color: string,
  options: {
    lightnessDelta?: number; // 明度変化（-1.0〜1.0）
    chromaDelta?: number; // 彩度変化（乗数、1.0が元の彩度）
    hueDelta?: number; // 色相変化（度数、0-360）
  } = {}
): string {
  const oklab = hexToOklab(color);
  if (!oklab) return color;

  const { lightnessDelta = 0, chromaDelta = 1, hueDelta = 0 } = options;

  // 明度調整（0-1の範囲内にクランプ）
  const newL = Math.min(1.0, Math.max(0, oklab.l + lightnessDelta));

  // 現在のクロマ（彩度）と色相を計算
  const chroma = Math.sqrt(oklab.a * oklab.a + oklab.b * oklab.b);
  const hue = (Math.atan2(oklab.b, oklab.a) * 180) / Math.PI;

  // 新しい色相を計算（360度の範囲内に収める）
  const newHue = (((hue + hueDelta) % 360) + 360) % 360;
  const newHueRad = (newHue * Math.PI) / 180;

  // 新しい彩度を適用（乗数として適用）
  const newChroma = Math.max(0, chroma * chromaDelta);

  // 新しいa, b値を計算
  const newA = newChroma * Math.cos(newHueRad);
  const newB = newChroma * Math.sin(newHueRad);

  // デバッグ用コンソールログ（問題診断に役立つ場合）
  // console.log(`Adjusting color: ${color}, L: ${oklab.l} -> ${newL}, Chroma: ${chroma} -> ${newChroma}`);

  return oklabToHex(newL, newA, newB);
}

// Oklab色空間ベースの知覚的に正確なカラーバリエーション生成
export function generateColorVariations(
  baseColor: string
): Record<string, string> {
  return {
    main: baseColor,
    // 明度を下げて暗い色を作成
    dark: adjustColorInOklab(baseColor, { lightnessDelta: -0.15 }),
    // 明度を上げ、彩度をやや下げて明るい色を作成
    light: adjustColorInOklab(baseColor, {
      lightnessDelta: 0.15,
      chromaDelta: 0.85,
    }),
    // 明度をさらに上げ、彩度をより下げて非常に明るい色を作成
    lighter: adjustColorInOklab(baseColor, {
      lightnessDelta: 0.45,
      chromaDelta: 0.5,
    }),
  };
}

// Material Designスタイルの完全な色スケールを生成（拡張機能）
export function generateExtendedColorScale(
  baseColor: string
): Record<string, string> {
  // ベースカラーのOklab値を取得
  const baseOklab = hexToOklab(baseColor) || { l: 0.5, a: 0, b: 0 };

  return {
    "50": adjustColorInOklab(baseColor, {
      lightnessDelta: 0.45,
      chromaDelta: 0.3,
    }), // 非常に明るく淡い
    "100": adjustColorInOklab(baseColor, {
      lightnessDelta: 0.35,
      chromaDelta: 0.5,
    }), // かなり明るい
    "200": adjustColorInOklab(baseColor, {
      lightnessDelta: 0.25,
      chromaDelta: 0.7,
    }), // 明るい
    "300": adjustColorInOklab(baseColor, {
      lightnessDelta: 0.15,
      chromaDelta: 0.8,
    }), // やや明るい
    "400": adjustColorInOklab(baseColor, {
      lightnessDelta: 0.05,
      chromaDelta: 0.9,
    }), // わずかに明るい
    "500": baseColor, // ベースカラー
    "600": adjustColorInOklab(baseColor, {
      lightnessDelta: -0.05,
      chromaDelta: 1.05,
    }), // わずかに暗く、彩度上昇
    "700": adjustColorInOklab(baseColor, {
      lightnessDelta: -0.15,
      chromaDelta: 1.1,
    }), // やや暗く、彩度上昇
    "800": adjustColorInOklab(baseColor, {
      lightnessDelta: -0.25,
      chromaDelta: 1.05,
    }), // 暗い
    "900": adjustColorInOklab(baseColor, {
      lightnessDelta: -0.35,
      chromaDelta: 1.0,
    }), // とても暗い

    // 互換性のための標準バリエーション
    main: baseColor,
    dark: adjustColorInOklab(baseColor, {
      lightnessDelta: -0.15,
      chromaDelta: 1.1,
    }), // 700相当
    light: adjustColorInOklab(baseColor, {
      lightnessDelta: 0.2,
      chromaDelta: 0.75,
    }), // 200〜300相当
    lighter: adjustColorInOklab(baseColor, {
      lightnessDelta: 0.35,
      chromaDelta: 0.5,
    }), // 100相当
  };
}

// ======== アクセシビリティとコントラスト計算 ========

// コントラスト比の計算（WCAG 2.0準拠）
export function calculateContrastRatio(color1: string, color2: string): number {
  // 相対輝度を計算
  const luminance1 = calculateRelativeLuminance(color1);
  const luminance2 = calculateRelativeLuminance(color2);

  // コントラスト比: (L1 + 0.05) / (L2 + 0.05) ただしL1 >= L2
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

// 相対輝度の計算（WCAG 2.0準拠）
function calculateRelativeLuminance(hexColor: string): number {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return 0;

  // sRGBからリニアRGBへの変換
  const r = normalizeChannel(rgb.r);
  const g = normalizeChannel(rgb.g);
  const b = normalizeChannel(rgb.b);

  // 相対輝度の計算（RGB値に対する知覚的重み付け）
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// チャンネル値の正規化（WCAG計算用）
function normalizeChannel(channel: number): number {
  const sRGB = channel / 255;
  return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
}

// WCAGレベルの判定
export function getWCAGLevel(contrastRatio: number): {
  level: "AAA" | "AA" | "A" | "Fail";
  normalText: boolean;
  largeText: boolean;
} {
  // 大きいテキスト（18pt以上または14pt以上の太字）と通常テキストの判定
  const largeTextAAA = contrastRatio >= 4.5;
  const largeTextAA = contrastRatio >= 3.0;
  const normalTextAAA = contrastRatio >= 7.0;
  const normalTextAA = contrastRatio >= 4.5;

  let level: "AAA" | "AA" | "A" | "Fail" = "Fail";

  if (normalTextAAA && largeTextAAA) {
    level = "AAA";
  } else if (normalTextAA && largeTextAAA) {
    level = "AA";
  } else if (largeTextAA) {
    level = "A";
  }

  return {
    level,
    normalText: normalTextAA,
    largeText: largeTextAA,
  };
}

// Oklabを使用した知覚的により正確なコントラスト色の選択
export function getBetterContrastColor(bgColor: string): string {
  const oklab = hexToOklab(bgColor);

  if (!oklab) {
    // フォールバック: 従来の方法で計算
    const whiteContrast = calculateContrastRatio(bgColor, "#FFFFFF");
    const blackContrast = calculateContrastRatio(bgColor, "#000000");
    return whiteContrast > blackContrast ? "#FFFFFF" : "#000000";
  }

  // Oklabの明度（L）に基づいて判断（より知覚的に正確）
  return oklab.l > 0.6 ? "#000000" : "#FFFFFF";
}

// ======== グレースケール10段階ジェネレーター ========

/**
 * MUIのカラースキーマに合わせた10段階のグレースケールHEXカラーを生成
 * (50, 100, 200, 300, 400, 500, 600, 700, 800, 900)
 * @returns {string[]} HEXカラー配列（長さ10）
 */
export function generateGreyScale10(): string[] {
  // MUIの公式グレースケール値を参考にRGB値を定義 (明るい順: 50 -> 900)
  // 50:  #fafafa (250)
  // 100: #f5f5f5 (245)
  // 200: #eeeeee (238)
  // 300: #e0e0e0 (224)
  // 400: #bdbdbd (189)
  // 500: #9e9e9e (158)
  // 600: #757575 (117)
  // 700: #616161 (97)
  // 800: #424242 (66)
  // 900: #212121 (33)
  const greyValuesRgb = [
    250, // 50
    245, // 100
    238, // 200
    224, // 300
    189, // 400
    158, // 500
    117, // 600
    97,  // 700
    66,  // 800
    33,  // 900
  ];

  const greys: string[] = [];
  for (let i = 0; i < 10; i++) {
    const v = greyValuesRgb[i];
    greys.push(rgbToHex(v, v, v));
  }
  // 返される配列は [色50 (明), 色100, ..., 色800, 色900 (暗)] の順になる
  return greys;
}
