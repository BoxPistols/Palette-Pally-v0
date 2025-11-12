# Palette Pally - 開発者ガイド

開発者・メンテナー向けの包括的な運用・更新マニュアル

[English](./DEVELOPMENT.md) | 日本語

## 📑 目次

- [プロジェクト概要](#プロジェクト概要)
- [技術スタック](#技術スタック)
- [プロジェクト構造](#プロジェクト構造)
- [開発環境のセットアップ](#開発環境のセットアップ)
- [アーキテクチャ](#アーキテクチャ)
- [開発ワークフロー](#開発ワークフロー)
- [コーディング規約](#コーディング規約)
- [テスト](#テスト)
- [ビルド・デプロイメント](#ビルドデプロイメント)
- [運用・保守](#運用保守)
- [トラブルシューティング](#トラブルシューティング)

## プロジェクト概要

Palette Pallyは、Material-UIカラーパレットを作成・管理するためのWebアプリケーションです。Next.js、React、TypeScriptで構築され、高度にカスタマイズ可能なUIとリアルタイムのカラープレビュー機能を提供します。

### 主な目標

1. **柔軟性**: 大規模なデザインシステムに対応できる柔軟なアーキテクチャ
2. **使いやすさ**: 直感的なUIと包括的なドキュメント
3. **拡張性**: 新機能を簡単に追加できるモジュラー設計
4. **パフォーマンス**: 高速な読み込みとスムーズなインタラクション

## 技術スタック

### コア技術

- **フレームワーク**: Next.js 14.x (App Router)
- **言語**: TypeScript 5.x
- **UIライブラリ**: React 19.x
- **スタイリング**: Tailwind CSS 3.x
- **コンポーネント**: Radix UI

### 主要ライブラリ

```json
{
  "react-colorful": "カラーピッカー",
  "next-themes": "テーマ管理",
  "class-variance-authority": "コンポーネントバリエーション",
  "tailwind-merge": "Tailwindクラスのマージ",
  "lucide-react": "アイコン",
  "sonner": "トースト通知"
}
```

### 開発ツール

- **ビルドツール**: Next.js内蔵（Turbopack）
- **リンター**: ESLint
- **テスト**: Vitest
- **バージョン管理**: Git

## プロジェクト構造

```
Palette-Pally-v0/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # メインページ
│   └── globals.css          # グローバルスタイル
│
├── components/              # Reactコンポーネント
│   ├── ui/                  # 基本UIコンポーネント
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── color-picker.tsx     # カラーピッカー
│   ├── mui-color-picker.tsx # MUI用カラーピッカー
│   ├── mui-color-display.tsx # カラー表示
│   ├── ui-settings-panel.tsx # UI設定パネル
│   └── ...
│
├── lib/                     # ユーティリティ・ヘルパー
│   ├── color-utils.ts       # カラー変換・計算
│   ├── color-constants.ts   # カラー定数
│   ├── ui-config-context.tsx # UI設定コンテキスト
│   └── utils.ts             # 汎用ユーティリティ
│
├── types/                   # TypeScript型定義
│   ├── palette.ts           # パレット型定義
│   └── ui-config.ts         # UI設定型定義
│
├── constants/               # 定数
│   └── app-constants.ts     # アプリケーション定数
│
├── styles/                  # スタイルファイル
│   └── globals.css          # 追加のグローバルスタイル
│
└── public/                  # 静的ファイル
    └── ...
```

### 主要ファイルの説明

#### `/app/page.tsx`
メインページコンポーネント。カラーパレットの管理、状態管理、UI統合を担当。

#### `/lib/ui-config-context.tsx`
UI設定のグローバルコンテキスト。レイアウト、テーマ、スペーシングの設定を管理。

#### `/types/ui-config.ts`
UI設定の型定義とデフォルト値、プリセット設定。

#### `/components/ui-settings-panel.tsx`
UI設定を変更するための設定パネル。

#### `/lib/color-utils.ts`
カラー変換（HEX、RGB、HSL、Oklab）、コントラスト比計算、WCAG判定などのユーティリティ。

## 開発環境のセットアップ

### 前提条件

- Node.js 18.x以降
- npm 9.x以降（またはyarn/pnpm）
- Git

### セットアップ手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/yourusername/Palette-Pally-v0.git
cd Palette-Pally-v0

# 2. 依存関係をインストール
npm install

# 3. 開発サーバーを起動
npm run dev

# ブラウザで http://localhost:3000 を開く
```

### 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start

# リンター実行
npm run lint

# テスト実行
npm run test

# テスト（UIモード）
npm run test:ui

# カバレッジ付きテスト
npm run test:coverage
```

## アーキテクチャ

### コンポーネントアーキテクチャ

```
UIConfigProvider (Context)
└── App Layout
    └── Main Page
        ├── Header
        │   ├── Logo
        │   ├── Help Modal
        │   ├── UI Settings Panel
        │   └── Theme Toggle
        │
        ├── Tabs
        │   ├── Theme Colors Tab
        │   │   ├── Color Picker (多数)
        │   │   └── Color Display (多数)
        │   │
        │   ├── Additional Colors Tab
        │   │   ├── Text Colors Editor
        │   │   ├── Background Colors Editor
        │   │   └── Grey Palette Editor
        │   │
        │   └── System Colors Tab
        │       ├── Action Colors Editor
        │       └── Common Colors Editor
        │
        └── Export/Import Panel
```

### 状態管理

#### 1. ローカルステート（useState）

メインページ（`app/page.tsx`）で管理：
- カラーパレットデータ
- テキストカラー
- 背景カラー
- アクションカラー
- グレーパレット
- モード（light/dark）

#### 2. コンテキスト（React Context）

`UIConfigProvider`で管理：
- レイアウト設定
- テーマ設定
- UI設定プリセット

#### 3. ローカルストレージ

永続化されるデータ：
- カラーパレット設定
- UI設定
- ユーザープリファレンス

### データフロー

```
ユーザーアクション
    ↓
イベントハンドラー (onClick, onChange)
    ↓
状態更新 (setState)
    ↓
ローカルストレージに保存
    ↓
UIの再レンダリング
    ↓
CSS変数の更新（UI設定の場合）
```

### UI設定システムの仕組み

1. **設定の読み込み**: `UIConfigProvider`がマウント時にローカルストレージから設定を読み込み
2. **CSS変数の適用**: `applyConfigToDOM()`がCSS custom propertiesを設定
3. **リアクティブな更新**: 設定が変更されると、CSS変数が即座に更新され、UIに反映
4. **永続化**: すべての変更が自動的にローカルストレージに保存

## 開発ワークフロー

### 新機能の追加

#### 1. 計画
- GitHub Issuesで機能要求を作成
- 設計を文書化
- 必要な変更を特定

#### 2. ブランチの作成
```bash
git checkout -b feature/your-feature-name
```

#### 3. 開発
- コンポーネントを作成/修正
- 型定義を追加/更新
- スタイルを追加
- ユーティリティ関数を作成（必要に応じて）

#### 4. テスト
```bash
npm run test
npm run lint
```

#### 5. コミット
```bash
git add .
git commit -m "feat: add your feature description"
```

コミットメッセージの規約：
- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント
- `style:` コードフォーマット
- `refactor:` リファクタリング
- `test:` テスト追加
- `chore:` ビルド・設定変更

#### 6. プルリクエスト
```bash
git push origin feature/your-feature-name
```
GitHubでプルリクエストを作成

### 例: 新しいUI設定オプションの追加

#### ステップ1: 型定義を更新

`types/ui-config.ts`:
```typescript
export interface ThemeConfig {
  // ...既存のプロパティ
  newOption: string // 新しいオプション
}

export const DEFAULT_UI_CONFIG: UIConfig = {
  // ...
  theme: {
    // ...
    newOption: "default-value"
  }
}
```

#### ステップ2: コンテキストを更新

`lib/ui-config-context.tsx`:
```typescript
const applyConfigToDOM = (cfg: UIConfig) => {
  // ...既存のコード
  root.style.setProperty("--new-option", cfg.theme.newOption)
}
```

#### ステップ3: UIコンポーネントを更新

`components/ui-settings-panel.tsx`:
```typescript
<div className="space-y-2">
  <Label>New Option</Label>
  <RadioGroup
    value={config.theme.newOption}
    onValueChange={(value) => updateTheme({ newOption: value })}
  >
    {/* オプション */}
  </RadioGroup>
</div>
```

#### ステップ4: CSSを追加

`app/globals.css`:
```css
:root {
  --new-option: default-value;
}

.uses-new-option {
  property: var(--new-option);
}
```

## コーディング規約

### TypeScript

```typescript
// ✅ Good: 型を明示
interface Props {
  name: string
  age: number
}

// ❌ Bad: 型が不明確
const handleClick = (data: any) => { }

// ✅ Good: 型を明示
const handleClick = (data: ColorData) => { }
```

### React コンポーネント

```typescript
// ✅ Good: 関数コンポーネント with TypeScript
interface ButtonProps {
  label: string
  onClick: () => void
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}

// ❌ Bad: 型定義なし
export function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}
```

### ファイル命名規則

- コンポーネント: `kebab-case.tsx` (例: `ui-settings-panel.tsx`)
- ユーティリティ: `kebab-case.ts` (例: `color-utils.ts`)
- 型定義: `kebab-case.ts` (例: `ui-config.ts`)

### インポート順序

```typescript
// 1. React・Next.js
import { useState, useEffect } from "react"
import Link from "next/link"

// 2. サードパーティライブラリ
import { HexColorPicker } from "react-colorful"

// 3. 内部コンポーネント
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// 4. ユーティリティ・型
import { cn } from "@/lib/utils"
import type { ColorData } from "@/types/palette"
```

## テスト

### テスト戦略

1. **ユニットテスト**: 個別の関数・ユーティリティ
2. **コンポーネントテスト**: UIコンポーネントの振る舞い
3. **統合テスト**: コンポーネント間の連携
4. **E2Eテスト**: ユーザーフロー全体（将来的に）

### テストの作成例

`lib/color-utils.test.ts`:
```typescript
import { describe, it, expect } from "vitest"
import { hexToRgb, calculateContrastRatio } from "./color-utils"

describe("color-utils", () => {
  describe("hexToRgb", () => {
    it("should convert HEX to RGB", () => {
      const result = hexToRgb("#FF0000")
      expect(result).toEqual({ r: 255, g: 0, b: 0 })
    })
  })

  describe("calculateContrastRatio", () => {
    it("should calculate contrast ratio", () => {
      const ratio = calculateContrastRatio("#FFFFFF", "#000000")
      expect(ratio).toBeCloseTo(21, 0)
    })
  })
})
```

### テスト実行

```bash
# すべてのテストを実行
npm run test

# ウォッチモード
npm run test -- --watch

# カバレッジレポート
npm run test:coverage

# UI付きテスト
npm run test:ui
```

## ビルド・デプロイメント

### プロダクションビルド

```bash
# ビルド
npm run build

# ビルド結果を確認
npm run start
```

### デプロイメント

#### Vercel（推奨）

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel
```

または、GitHubリポジトリをVercelに接続して自動デプロイ。

#### 他のプラットフォーム

- **Netlify**: `next.config.js`で静的エクスポートを設定
- **AWS Amplify**: ビルドコマンドを設定
- **Cloudflare Pages**: Next.jsのサポートを確認

### 環境変数

現在、環境変数は使用していませんが、将来的に追加する場合：

`.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://api.example.com
```

## 運用・保守

### 定期メンテナンス

#### 依存関係の更新

```bash
# 依存関係の確認
npm outdated

# マイナーアップデート
npm update

# メジャーアップデート（注意が必要）
npm install package@latest
```

#### セキュリティ監査

```bash
# 脆弱性スキャン
npm audit

# 自動修正（可能な場合）
npm audit fix
```

### パフォーマンスモニタリング

1. **Lighthouse**: 定期的にスコアを確認
2. **Core Web Vitals**: LCP、FID、CLSを測定
3. **Bundle Analyzer**: バンドルサイズを分析

```bash
# Next.js Bundle Analyzer
npm install @next/bundle-analyzer
```

`next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // config
})
```

実行:
```bash
ANALYZE=true npm run build
```

### データベース（将来的に）

現在はローカルストレージを使用していますが、将来的にバックエンドを追加する場合：

1. **Supabase**: PostgreSQL + Auth
2. **Firebase**: Firestore + Auth
3. **PlanetScale**: MySQL互換

### 監視・ログ

プロダクション環境での監視：

1. **Vercel Analytics**: 自動的に有効化
2. **Sentry**: エラートラッキング
3. **LogRocket**: セッションリプレイ

## トラブルシューティング

### よくある問題と解決策

#### ビルドエラー

**問題**: `Type error: Cannot find module`

**解決策**:
```bash
# node_modulesを削除して再インストール
rm -rf node_modules
npm install
```

#### スタイルが適用されない

**問題**: Tailwindクラスが効かない

**解決策**:
1. `tailwind.config.js`のcontentパスを確認
2. 開発サーバーを再起動
3. ブラウザキャッシュをクリア

#### ローカルストレージの問題

**問題**: 設定が保存されない

**解決策**:
```javascript
// ストレージの確認
console.log(localStorage.getItem("palette-pally-ui-config"))

// ストレージのクリア
localStorage.clear()
```

#### TypeScriptエラー

**問題**: 型定義が見つからない

**解決策**:
```bash
# 型定義を再生成
npm run build
```

### デバッグツール

```typescript
// カラーデータをコンソールに出力
console.log("Color Data:", colorData)

// UI設定を出力
console.log("UI Config:", config)

// ローカルストレージの内容を確認
console.log("Storage:", {
  palette: localStorage.getItem("mui-color-palette"),
  uiConfig: localStorage.getItem("palette-pally-ui-config"),
})
```

### パフォーマンスデバッグ

```typescript
// レンダリング回数を追跡
useEffect(() => {
  console.log("Component rendered")
}, [])

// パフォーマンス測定
console.time("operation")
// ... 処理
console.timeEnd("operation")
```

## 貢献ガイドライン

### プルリクエストのチェックリスト

- [ ] コードがリンターをパスする
- [ ] テストがすべて通る
- [ ] 新機能にテストを追加
- [ ] ドキュメントを更新
- [ ] コミットメッセージが規約に従っている
- [ ] 変更が後方互換性を保っている

### コードレビュープロセス

1. プルリクエストを作成
2. CI/CDチェックが通る
3. レビュアーをアサイン
4. フィードバックに対応
5. 承認後にマージ

## リリースプロセス

### バージョニング

Semantic Versioning (SemVer) を使用：

- **MAJOR**: 破壊的な変更（例: 1.0.0 → 2.0.0）
- **MINOR**: 後方互換性のある新機能（例: 1.0.0 → 1.1.0）
- **PATCH**: バグ修正（例: 1.0.0 → 1.0.1）

### リリース手順

```bash
# 1. バージョンを更新
npm version patch # または minor, major

# 2. CHANGELOGを更新
# CHANGELOG.mdに変更内容を記載

# 3. コミット・プッシュ
git push origin main --tags

# 4. GitHubでリリースを作成
# リリースノートを記載

# 5. デプロイ
# Vercelが自動的にデプロイ
```

## サポート・リソース

- **ドキュメント**: [README.md](./README.md)
- **Issue Tracker**: [GitHub Issues](https://github.com/yourusername/Palette-Pally-v0/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/Palette-Pally-v0/discussions)

---

開発に関する質問や提案があれば、GitHubのIssuesまたはDiscussionsでお気軽にお問い合わせください。
