// Figmaトークンエクスポート - バリエーション対応テスト

// テスト用のカラーデータ（Material UIと同じ構造）
const testColors = [
  {
    name: "primary",
    value: "#3b82f6",
    role: "primary",
    variations: {
      main: "#3b82f6",
      light: "#63aaff",
      dark: "#135ace",
      lighter: "#93c5fd",
      contrastText: "#ffffff",
    },
  },
  {
    name: "secondary",
    value: "#8b5cf6",
    role: "secondary",
    variations: {
      main: "#8b5cf6",
      light: "#b384ff",
      dark: "#6334ce",
      lighter: "#c4a3ff",
      contrastText: "#ffffff",
    },
  },
  {
    name: "success",
    value: "#22c55e",
    role: "success",
    variations: {
      main: "#22c55e",
      light: "#4aed86",
      dark: "#009d36",
      lighter: "#7af5a8",
      contrastText: "#ffffff",
    },
  },
];

// convertColorsToFigmaTokens関数の実装をコピー
function convertColorsToFigmaTokens(colors) {
  const figmaTokens = {
    palette: {
      light: {},
    },
  };

  try {
    const roleGroups = {};
    const textColors = [];
    const backgroundColors = [];
    const commonColors = [];
    const greyColors = [];
    const otherColors = [];

    colors.forEach((color) => {
      if (color.group === "text") {
        textColors.push(color);
      } else if (color.group === "background") {
        backgroundColors.push(color);
      } else if (color.group === "common") {
        commonColors.push(color);
      } else if (color.group === "grey") {
        greyColors.push(color);
      } else if (color.role) {
        if (!roleGroups[color.role]) {
          roleGroups[color.role] = [];
        }
        roleGroups[color.role].push(color);
      } else {
        otherColors.push(color);
      }
    });

    // 主要なカラーロールを処理
    Object.entries(roleGroups).forEach(([role, colorList]) => {
      const color = colorList[0]; // 最初のカラーを使用

      // variationsがある場合は展開
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
        // 単一のカラー値
        figmaTokens.palette.light[role] = {
          main: {
            $value: color.value,
            $type: "color",
          },
        };
      }
    });

    // テキストカラー
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

    // バックグラウンドカラー
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

    // グレースケール
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
  } catch (error) {
    console.error("Error converting colors to Figma tokens:", error);
    return figmaTokens;
  }
}

// テスト実行
console.log("=== Figmaトークンエクスポート - バリエーションテスト ===\n");
console.log("入力カラーデータ（Material UI互換）:");
console.log(JSON.stringify(testColors, null, 2));
console.log("\n");

const exportedTokens = convertColorsToFigmaTokens(testColors);
console.log("エクスポートされたFigmaトークン:");
console.log(JSON.stringify(exportedTokens, null, 2));
console.log("\n");

// 検証チェック
console.log("=== バリエーション検証 ===");

let valid = true;

// primary のすべてのバリエーションをチェック
const primaryVariations = ["main", "light", "dark", "lighter", "contrastText"];
primaryVariations.forEach((variation) => {
  const expected = testColors[0].variations[variation];
  const actual = exportedTokens.palette?.light?.primary?.[variation]?.$value;

  if (actual === expected) {
    console.log(`✓ primary.${variation}: ${actual}`);
  } else {
    console.log(`✗ primary.${variation}: 期待値=${expected}, 実際=${actual}`);
    valid = false;
  }
});

console.log("");

// secondary のすべてのバリエーションをチェック
const secondaryVariations = ["main", "light", "dark", "lighter"];
secondaryVariations.forEach((variation) => {
  const expected = testColors[1].variations[variation];
  const actual = exportedTokens.palette?.light?.secondary?.[variation]?.$value;

  if (actual === expected) {
    console.log(`✓ secondary.${variation}: ${actual}`);
  } else {
    console.log(`✗ secondary.${variation}: 期待値=${expected}, 実際=${actual}`);
    valid = false;
  }
});

console.log("");

// success のバリエーションをチェック
const successVariations = ["main", "light", "dark", "lighter"];
successVariations.forEach((variation) => {
  const expected = testColors[2].variations[variation];
  const actual = exportedTokens.palette?.light?.success?.[variation]?.$value;

  if (actual === expected) {
    console.log(`✓ success.${variation}: ${actual}`);
  } else {
    console.log(`✗ success.${variation}: 期待値=${expected}, 実際=${actual}`);
    valid = false;
  }
});

console.log("\n");
if (valid) {
  console.log("✅ すべてのバリエーションが正しくエクスポートされました！");
  console.log("✅ Material UIとの互換性を維持しています");
} else {
  console.log("❌ 一部のバリエーションが正しくエクスポートされていません");
}

// Material UI形式との比較
console.log("\n=== Material UI形式との比較 ===");
console.log("Material UIテーマ:");
console.log(`primary: {
  main: "${testColors[0].variations.main}",
  light: "${testColors[0].variations.light}",
  dark: "${testColors[0].variations.dark}",
}`);
console.log("");
console.log("Figmaトークン:");
console.log(`palette.light.primary: {
  main: { $value: "${exportedTokens.palette.light.primary.main.$value}", $type: "color" },
  light: { $value: "${exportedTokens.palette.light.primary.light.$value}", $type: "color" },
  dark: { $value: "${exportedTokens.palette.light.primary.dark.$value}", $type: "color" },
  lighter: { $value: "${exportedTokens.palette.light.primary.lighter.$value}", $type: "color" },
}`);
console.log("");
console.log("✅ lighter バリエーションも含まれています（Material UIより完全）");
