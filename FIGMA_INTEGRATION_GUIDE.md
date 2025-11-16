# Figmaデザイントークン連携ガイド

## 目次

1. [形式の違いと互換性](#形式の違いと互換性)
2. [Palette Pally → Figma へのエクスポート](#palette-pally--figma-へのエクスポート)
3. [Figma → Palette Pally へのインポート](#figma--palette-pally-へのインポート)
4. [エビデンスと仕様準拠](#エビデンスと仕様準拠)

---

## 形式の違いと互換性

### Figma Variables形式（Figma内部形式）

Figma内部でVariablesをエクスポートすると、以下の形式になります：

```json
{
  "collections": [{
    "id": "VariableCollectionId:1:28",
    "name": "Theme",
    "modes": {
      "1:0": "Light",
      "1:1": "Dark"
    },
    "variableIds": ["VariableID:1:29"],
    "variables": [{
      "id": "VariableID:1:29",
      "name": "Colors/Primary",
      "type": "COLOR",
      "valuesByMode": {
        "1:0": {
          "r": 0.23137254902,
          "g": 0.50980392157,
          "b": 0.96470588235,
          "a": 1
        }
      }
    }]
  }]
}
```

**特徴：**
- カラー値: **RGBAオブジェクト**（0-1の範囲）
- 構造: collection → modes → variables → valuesByMode
- プロパティ: `type`, `valuesByMode`（`$type`, `$value` なし）

### W3C Design Tokens形式（Palette Pally採用形式）

Palette Pallyと多くのデザインツールが採用する標準形式：

```json
{
  "palette": {
    "light": {
      "primary": {
        "main": {
          "$value": "#3b82f6",
          "$type": "color"
        },
        "light": {
          "$value": "#63aaff",
          "$type": "color"
        },
        "dark": {
          "$value": "#135ace",
          "$type": "color"
        }
      }
    }
  }
}
```

**特徴：**
- カラー値: **16進数文字列**（`#RRGGBB`）またはCSS形式
- 構造: 階層的なオブジェクト（`palette.light.primary.main`）
- プロパティ: **`$type`**, **`$value`**（W3C仕様準拠）

### どちらを使用すべきか？

| 用途 | 推奨形式 | 理由 |
|-----|---------|------|
| Figma Variables直接操作 | Figma内部形式 | Figma APIとの直接統合 |
| デザインシステム連携 | **W3C Design Tokens** | 業界標準、ツール間互換性 |
| コード生成（CSS/SCSS等） | **W3C Design Tokens** | 開発ワークフロー統合 |

**Palette Pallyの選択：** W3C Design Tokens形式を採用しています。これにより：
- ✅ Style Dictionary、Tokens Studioなど主要ツールと互換
- ✅ 複数のデザインツール間でトークン共有可能
- ✅ 開発者フレンドリー（CSS/SCSS/Tailwindへの変換が容易）

---

## Palette Pally → Figma へのエクスポート

### ステップ1: Palette Pallyでエクスポート

1. **Figmaトークン**ボタンをクリック
2. **エクスポート**タブを選択
3. **プレビュー**ボタンでJSONを確認
4. **コピー**ボタンでクリップボードにコピー、または
5. **エクスポート**ボタンでJSONファイルをダウンロード

### ステップ2: Figmaへインポート

#### 方法A: Tokens Studio for Figma（推奨）

1. Figmaで**Tokens Studio for Figma**プラグインを開く
2. **Import**をクリック
3. Palette PallyからエクスポートしたJSONを貼り付け
4. **Import**を実行

**利点：**
- W3C Design Tokens形式を完全サポート
- バリエーション（main/light/dark/lighter）を自動認識
- Material UIやTailwindとの互換性

#### 方法B: Design Tokens Managerプラグイン

1. Figmaで**Design Tokens Manager**プラグインを開く
2. **Import Tokens**を選択
3. JSONファイルをアップロードまたはペースト
4. トークンをFigma Variablesまたはスタイルに変換

#### 方法C: 手動でFigma Variablesを作成

Palette PallyのエクスポートJSONを参照しながら：

1. Figmaで**Local variables**パネルを開く
2. 新しいコレクションを作成（例：「Design System」）
3. モードを追加（Light/Dark）
4. 各カラーに対して：
   - 変数名: `primary/main`, `primary/light`, `primary/dark`など
   - タイプ: Color
   - 値: JSONの`$value`から16進数値をコピー

### ステップ3: 検証

エクスポート後、以下を確認：

- ✅ すべてのカラーロール（primary, secondary, success, danger, warning, info）が存在
- ✅ バリエーション（main, light, dark, lighter, contrastText）が正しく設定
- ✅ カラー値が意図した色と一致

---

## Figma → Palette Pally へのインポート

### ステップ1: FigmaからJSONをエクスポート

#### 方法A: Tokens Studio for Figma（推奨）

1. Tokens Studio for Figmaプラグインを開く
2. **Export**をクリック
3. **W3C DTCG Format**を選択
4. JSONをコピーまたはダウンロード

#### 方法B: 公式Figma Variables Export

1. Figmaで変数コレクションの**3点メニュー**をクリック
2. **Export as JSON**を選択
3. JSONファイルをダウンロード

**注意：** この形式はFigma内部形式なので、Palette Pallyで直接インポートする前に変換が必要な場合があります。

#### 方法C: Variables to JSONプラグイン

1. **variables2json**プラグインを開く
2. エクスポートしたいコレクションを選択
3. JSONを生成してコピー

### ステップ2: Palette Pallyにインポート

1. Palette Pallyで**Figmaトークン**ボタンをクリック
2. **インポート**タブを選択
3. FigmaからエクスポートしたJSONを貼り付け、または
4. **JSONをアップロード**ボタンでファイルを選択
5. **インポート**ボタンをクリック

### ステップ3: インポートオプション

JSONにカラーとタイポグラフィ両方が含まれている場合、選択肢が表示されます：

- **両方をインポート**: カラーとタイポグラフィを両方取り込む
- **カラーをインポート**: カラーのみ取り込む
- **タイポグラフィをインポート**: タイポグラフィのみ取り込む

### サポートされるFigma形式

Palette Pallyは以下の形式を自動認識してインポートします：

#### 1. W3C Design Tokens形式

```json
{
  "palette": {
    "light": {
      "primary": {
        "main": { "$value": "#3b82f6", "$type": "color" }
      }
    }
  }
}
```

#### 2. Figma階層形式

```json
{
  "figma": {
    "primary": { "$value": "#3b82f6", "$type": "color" }
  }
}
```

#### 3. グローバル形式

```json
{
  "global": {
    "colors": {
      "primary": {
        "main": { "$value": "#3b82f6", "$type": "color" }
      }
    }
  }
}
```

### インポート後の確認

- ✅ カラーパレットが正しく表示される
- ✅ バリエーション（light/dark/lighter）が適用されている
- ✅ Material UIエクスポートで同じ値が出力される

---

## エビデンスと仕様準拠

### W3C Design Tokens Format Module 2025.10

**公式仕様:** https://tr.designtokens.org/format/

Palette Pallyの実装は、2025年10月にリリースされた**W3C Design Tokens仕様v1.0**に完全準拠しています。

#### 準拠ポイント

✅ **`$value`プロパティ**: トークンの値を格納（必須）
```json
"$value": "#3b82f6"
```

✅ **`$type`プロパティ**: トークンタイプを明示
```json
"$type": "color"
```

✅ **`$`プレフィックス**: W3C予約プロパティ識別子
- 2025年10月の仕様で正式採用
- すべてのツールが対応済み

✅ **16進数カラー形式**: CSS互換
```json
"$value": "#3b82f6"  // ✅ 正しい
"$value": "#3B82F6"  // ✅ 大文字も可
```

✅ **階層的グループ構造**:
```json
{
  "palette": {
    "light": {
      "primary": {
        "main": { ... }
      }
    }
  }
}
```

### Figma公式プラグインとの互換性

#### Variables Import/Export（Figma公式サンプル）

**リポジトリ:** https://github.com/figma/plugin-samples/variables-import-export

Palette Pallyの形式は、Figma公式プラグインサンプルが推奨する形式と互換性があります：

```javascript
// Figma公式サンプルのエクスポートコード
obj.$type = "color"
obj.$value = rgbToHex(value)  // 16進数形式
```

✅ カラー値を16進数形式でエクスポート
✅ `$type`と`$value`プロパティを使用
✅ スラッシュ区切り名前を階層構造に変換（`palette/light/primary/main`）

### 業界標準ツールとの互換性

| ツール | 互換性 | 形式 |
|--------|--------|------|
| **Style Dictionary** | ✅ 完全互換 | W3C Design Tokens |
| **Tokens Studio** | ✅ 完全互換 | W3C Design Tokens |
| **Design Tokens Manager** | ✅ 完全互換 | W3C Design Tokens |
| **Figma Variables API** | ⚠️ 変換必要 | Figma内部形式（RGBA） |
| **variables2json** | ⚠️ 変換必要 | Figma内部形式（RGBA） |

### Material UI完全互換

Palette Pallyは**Material UI v5+のテーマ構造**と完全互換：

```typescript
// Material UIテーマ
{
  palette: {
    primary: {
      main: "#3b82f6",
      light: "#63aaff",
      dark: "#135ace",
      contrastText: "#ffffff"
    }
  }
}
```

↕️ **完全互換** ↕️

```json
// Palette Pally Figmaトークン
{
  "palette": {
    "light": {
      "primary": {
        "main": { "$value": "#3b82f6", "$type": "color" },
        "light": { "$value": "#63aaff", "$type": "color" },
        "dark": { "$value": "#135ace", "$type": "color" },
        "contrastText": { "$value": "#ffffff", "$type": "color" }
      }
    }
  }
}
```

**追加対応:**
- ✅ `lighter`バリエーション（Material UI v5では非標準だが、より柔軟なデザインシステムに対応）

### テスト検証結果

#### Test 1: W3C仕様準拠テスト

```bash
node test-figma-export.js
```

```
✓ primary.main.$value: 正しい形式
✓ $type: 'color' として設定されている
✓ variations: 正しく展開されている
✓ text colors: 正しく配置されている
✓ grey colors: 正しく配置されている

✅ すべてのテストに合格
✅ W3C Design Tokens Format仕様に準拠
```

#### Test 2: 往復テスト（Export → Import）

```bash
node test-roundtrip.js
```

```
✓ primary.value: 一致
✓ primary.variations.main: 一致
✓ primary.variations.dark: 一致
✓ secondary.value: 一致
✓ text-primary.value: 一致
✓ grey-50.value: 一致

✅ 往復テスト合格
✅ export → import が正しく動作
```

#### Test 3: バリエーションテスト

```bash
node test-variations.js
```

```
✓ primary.main: #3b82f6
✓ primary.light: #63aaff
✓ primary.dark: #135ace
✓ primary.lighter: #93c5fd
✓ primary.contrastText: #ffffff

✅ すべてのバリエーションが正しくエクスポートされました
✅ Material UIとの互換性を維持
```

---

## トラブルシューティング

### Q: FigmaでインポートしたトークンがVariablesとして認識されない

**A:** Tokens Studio for Figmaプラグインを使用してください。Figma公式のVariables Import機能は、現時点でW3C Design Tokens形式を直接サポートしていません。

### Q: カラー値が正しく表示されない

**A:** 以下を確認：
1. 16進数形式が正しいか（`#RRGGBB`形式）
2. `$type`が`"color"`に設定されているか
3. JSON構造が正しくネストされているか

### Q: Material UIエクスポートとFigmaトークンエクスポートで値が異なる

**A:** 両方のエクスポートは同じ`colorVariations`データを使用します。違いがある場合：
1. ページをリロードして最新データを読み込む
2. カラーを再生成して同期を確認

### Q: インポートしたカラーのバリエーションが表示されない

**A:** Palette Pallyは`variations`プロパティを自動的にマージします。プレビューで確認してください：
1. Figmaトークンボタン → エクスポートタブ → プレビュー
2. すべてのバリエーション（main/light/dark/lighter）が表示されることを確認

---

## まとめ

### Palette Pallyの強み

✅ **W3C Design Tokens仕様完全準拠**
✅ **Material UI完全互換**
✅ **Figma主要プラグインと互換**（Tokens Studio等）
✅ **開発ワークフロー統合**（CSS/SCSS/Tailwind生成）
✅ **往復変換テスト済み**（データ損失なし）

### 推奨ワークフロー

1. **デザイン → 開発**
   - Figma（Tokens Studio） → JSON → Palette Pally → コード生成

2. **開発 → デザイン**
   - Palette Pally → JSON → Tokens Studio → Figma Variables

3. **デザインシステム管理**
   - Palette Pally を Single Source of Truth として使用
   - Figma、CSS、Material UIに一括エクスポート

---

**ドキュメント更新日:** 2025年

**仕様バージョン:**
- W3C Design Tokens Format: 2025.10 (v1.0)
- Material UI: v5+互換
- Figma Plugin API: 2025対応
