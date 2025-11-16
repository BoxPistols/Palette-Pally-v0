// Figmaトークンエクスポート機能のテスト

// テスト用のカラーデータ
const testColors = [
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

// convertColorsToFigmaTokens関数の実装をコピー
function convertColorsToFigmaTokens(colors) {
  const figmaTokens = {
    palette: {
      light: {},
    },
  };

  try {
    // カラーをロール別にグループ化
    const roleGroups = {};
    const textColors = [];
    const backgroundColors = [];
    const commonColors = [];
    const greyColors = [];
    const otherColors = [];

    colors.forEach((color) => {
      // グループ別に分類
      if (color.group === "text") {
        textColors.push(color);
      } else if (color.group === "background") {
        backgroundColors.push(color);
      } else if (color.group === "common") {
        commonColors.push(color);
      } else if (color.group === "grey") {
        greyColors.push(color);
      } else if (color.role) {
        // ロールがある場合はロールごとにグループ化
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
console.log("=== Figmaトークンエクスポート機能テスト ===\n");
console.log("入力カラーデータ:");
console.log(JSON.stringify(testColors, null, 2));
console.log("\n");

const exportedTokens = convertColorsToFigmaTokens(testColors);
console.log("エクスポートされたFigmaトークン:");
console.log(JSON.stringify(exportedTokens, null, 2));
console.log("\n");

// 検証チェック
console.log("=== 検証結果 ===");

// W3C Design Tokens仕様の確認
let valid = true;

// 1. palette.light.primary.main.$value が存在するか
if (exportedTokens.palette?.light?.primary?.main?.$value === "#3b82f6") {
  console.log("✓ primary.main.$value: 正しい形式");
} else {
  console.log("✗ primary.main.$value: 形式エラー");
  valid = false;
}

// 2. $type プロパティが "color" か
if (exportedTokens.palette?.light?.primary?.main?.$type === "color") {
  console.log("✓ $type: 'color' として設定されている");
} else {
  console.log("✗ $type: 設定エラー");
  valid = false;
}

// 3. variations が展開されているか
if (exportedTokens.palette?.light?.primary?.dark?.$value === "#2563eb") {
  console.log("✓ variations: 正しく展開されている");
} else {
  console.log("✗ variations: 展開エラー");
  valid = false;
}

// 4. テキストカラーが正しく配置されているか
if (exportedTokens.palette?.light?.text?.primary?.$value === "#111827") {
  console.log("✓ text colors: 正しく配置されている");
} else {
  console.log("✗ text colors: 配置エラー");
  valid = false;
}

// 5. グレースケールが正しく配置されているか
if (exportedTokens.palette?.grey?.["50"]?.$value === "#f9fafb") {
  console.log("✓ grey colors: 正しく配置されている");
} else {
  console.log("✗ grey colors: 配置エラー");
  valid = false;
}

console.log("\n");
if (valid) {
  console.log("✅ すべてのテストに合格しました！");
  console.log("✅ W3C Design Tokens Format仕様に準拠しています");
} else {
  console.log("❌ 一部のテストに失敗しました");
}
