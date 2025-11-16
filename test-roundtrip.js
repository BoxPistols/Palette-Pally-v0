// Figmaトークンの往復テスト（export → import）

// extractColorsFromFigmaTokens関数の実装（既存コードから）
function extractColorsFromFigmaTokens(data) {
  const extractedColors = [];

  try {
    if (!data) {
      return [];
    }

    // バリアブルコレクション形式（palette.light.primary.main など）
    if (data.palette && data.palette.light) {
      const lightPalette = data.palette.light;

      // 主要なカラーロールを処理
      const colorRoles = ["primary", "secondary", "success", "warning", "error", "info", "text", "background"];
      colorRoles.forEach((role) => {
        if (lightPalette[role]) {
          // main, dark, light, lighter, contrastTextの構造を持つカラー
          if (lightPalette[role].main) {
            const colorValue = lightPalette[role].main.$value || lightPalette[role].main;
            if (typeof colorValue === "string" && /^#[0-9A-F]{6}$/i.test(colorValue)) {
              const colorRole = role === "error" ? "danger" : role;
              extractedColors.push({
                name: role,
                value: colorValue,
                role: colorRole,
                variations: {
                  main: colorValue,
                  dark: lightPalette[role].dark?.$value || lightPalette[role].dark,
                  light: lightPalette[role].light?.$value || lightPalette[role].light,
                  lighter: lightPalette[role].lighter?.$value || lightPalette[role].lighter,
                  contrastText: lightPalette[role].contrastText?.$value || lightPalette[role].contrastText,
                },
              });
            }
          } else {
            // 単一のカラー値
            const colorValue = lightPalette[role].$value || lightPalette[role];
            if (typeof colorValue === "string" && /^#[0-9A-F]{6}$/i.test(colorValue)) {
              const colorRole = role === "error" ? "danger" : role;
              extractedColors.push({
                name: role,
                value: colorValue,
                role: colorRole,
              });
            }
          }
        }
      });

      // テキストカラー
      if (lightPalette.text) {
        Object.entries(lightPalette.text).forEach(([key, value]) => {
          const colorValue = value.$value || value;
          if (typeof colorValue === "string" && /^#[0-9A-F]{6}$/i.test(colorValue)) {
            extractedColors.push({
              name: `text-${key}`,
              value: colorValue,
              role: key === "primary" ? "text" : undefined,
              group: "text",
            });
          }
        });
      }

      // バックグラウンドカラー
      if (lightPalette.background) {
        Object.entries(lightPalette.background).forEach(([key, value]) => {
          const colorValue = value.$value || value;
          if (typeof colorValue === "string" && /^#[0-9A-F]{6}$/i.test(colorValue)) {
            extractedColors.push({
              name: `background-${key}`,
              value: colorValue,
              role: key === "default" ? "background" : undefined,
              group: "background",
            });
          }
        });
      }

      // 共通カラー
      if (lightPalette.common) {
        Object.entries(lightPalette.common).forEach(([key, value]) => {
          const colorValue = value.$value || value;
          if (typeof colorValue === "string" && /^#[0-9A-F]{6}$/i.test(colorValue)) {
            extractedColors.push({
              name: `common-${key}`,
              value: colorValue,
              group: "common",
            });
          }
        });
      }
    }

    // グレースケール
    if (data.palette && data.palette.grey) {
      Object.entries(data.palette.grey).forEach(([shade, value]) => {
        const colorValue = value.$value || value;
        if (typeof colorValue === "string" && /^#[0-9A-F]{6}$/i.test(colorValue)) {
          extractedColors.push({
            name: `grey-${shade}`,
            value: colorValue,
            group: "grey",
          });
        }
      });
    }

    return extractedColors;
  } catch (error) {
    console.error("Error extracting colors from Figma tokens:", error);
    return [];
  }
}

// convertColorsToFigmaTokens関数（前のテストから）
function convertColorsToFigmaTokens(colors) {
  const figmaTokens = { palette: { light: {} } };

  const roleGroups = {};
  const textColors = [];
  const backgroundColors = [];
  const greyColors = [];

  colors.forEach((color) => {
    if (color.group === "text") {
      textColors.push(color);
    } else if (color.group === "background") {
      backgroundColors.push(color);
    } else if (color.group === "grey") {
      greyColors.push(color);
    } else if (color.role) {
      if (!roleGroups[color.role]) {
        roleGroups[color.role] = [];
      }
      roleGroups[color.role].push(color);
    }
  });

  Object.entries(roleGroups).forEach(([role, colorList]) => {
    const color = colorList[0];
    if (color.variations) {
      figmaTokens.palette.light[role] = {};
      Object.entries(color.variations).forEach(([key, value]) => {
        if (value && typeof value === "string") {
          figmaTokens.palette.light[role][key] = {
            $value: value,
            $type: "color",
          };
        }
      });
    } else {
      figmaTokens.palette.light[role] = {
        main: {
          $value: color.value,
          $type: "color",
        },
      };
    }
  });

  if (textColors.length > 0) {
    figmaTokens.palette.light.text = {};
    textColors.forEach((color) => {
      const key = color.name.replace("text-", "");
      figmaTokens.palette.light.text[key] = {
        $value: color.value,
        $type: "color",
      };
    });
  }

  if (backgroundColors.length > 0) {
    figmaTokens.palette.light.background = {};
    backgroundColors.forEach((color) => {
      const key = color.name.replace("background-", "");
      figmaTokens.palette.light.background[key] = {
        $value: color.value,
        $type: "color",
      };
    });
  }

  if (greyColors.length > 0) {
    figmaTokens.palette.grey = {};
    greyColors.forEach((color) => {
      const key = color.name.replace("grey-", "");
      figmaTokens.palette.grey[key] = {
        $value: color.value,
        $type: "color",
      };
    });
  }

  return figmaTokens;
}

// 往復テスト実行
console.log("=== Figmaトークン往復テスト ===\n");

const originalColors = [
  { name: "primary", value: "#3b82f6", role: "primary", variations: {
    main: "#3b82f6",
    dark: "#2563eb",
    light: "#60a5fa",
    lighter: "#93c5fd",
    contrastText: "#ffffff"
  }},
  { name: "secondary", value: "#8b5cf6", role: "secondary" },
  { name: "text-primary", value: "#111827", role: "text", group: "text" },
  { name: "background-default", value: "#ffffff", role: "background", group: "background" },
  { name: "grey-50", value: "#f9fafb", group: "grey" },
];

console.log("1. 元のカラーデータ:");
console.log(JSON.stringify(originalColors, null, 2));
console.log("\n");

// Step 1: Export
const exportedTokens = convertColorsToFigmaTokens(originalColors);
console.log("2. エクスポートされたFigmaトークン:");
console.log(JSON.stringify(exportedTokens, null, 2));
console.log("\n");

// Step 2: Import
const importedColors = extractColorsFromFigmaTokens(exportedTokens);
console.log("3. インポートされたカラーデータ:");
console.log(JSON.stringify(importedColors, null, 2));
console.log("\n");

// 検証
console.log("=== 往復テスト検証 ===");
let passed = true;

// primary colorのチェック
const primaryOriginal = originalColors.find(c => c.name === "primary");
const primaryImported = importedColors.find(c => c.name === "primary");

if (primaryImported && primaryImported.value === primaryOriginal.value) {
  console.log("✓ primary.value: 一致");
} else {
  console.log("✗ primary.value: 不一致");
  passed = false;
}

if (primaryImported && primaryImported.variations?.main === primaryOriginal.variations.main) {
  console.log("✓ primary.variations.main: 一致");
} else {
  console.log("✗ primary.variations.main: 不一致");
  passed = false;
}

if (primaryImported && primaryImported.variations?.dark === primaryOriginal.variations.dark) {
  console.log("✓ primary.variations.dark: 一致");
} else {
  console.log("✗ primary.variations.dark: 不一致");
  passed = false;
}

// secondary colorのチェック
const secondaryOriginal = originalColors.find(c => c.name === "secondary");
const secondaryImported = importedColors.find(c => c.name === "secondary");

if (secondaryImported && secondaryImported.value === secondaryOriginal.value) {
  console.log("✓ secondary.value: 一致");
} else {
  console.log("✗ secondary.value: 不一致");
  passed = false;
}

// text colorのチェック
const textOriginal = originalColors.find(c => c.name === "text-primary");
const textImported = importedColors.find(c => c.name === "text-primary");

if (textImported && textImported.value === textOriginal.value) {
  console.log("✓ text-primary.value: 一致");
} else {
  console.log("✗ text-primary.value: 不一致");
  passed = false;
}

// grey colorのチェック
const greyOriginal = originalColors.find(c => c.name === "grey-50");
const greyImported = importedColors.find(c => c.name === "grey-50");

if (greyImported && greyImported.value === greyOriginal.value) {
  console.log("✓ grey-50.value: 一致");
} else {
  console.log("✗ grey-50.value: 不一致");
  passed = false;
}

console.log("\n");
if (passed) {
  console.log("✅ 往復テストに合格しました！");
  console.log("✅ エクスポート → インポートが正しく動作しています");
} else {
  console.log("❌ 往復テストに失敗しました");
}
