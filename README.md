# Palette Pally

カラーパレットを作成・管理するツールです。

## 使用されていないUIコンポーネントの復元方法

このプロジェクトでは、不要なUIコンポーネントを削除しています。
もし必要になった場合は、以下の手順で復元できます。

\`\`\`bash
# バックアップブランチから復元
git checkout backup-ui-components -- components/ui/[復元したいファイル名]

# 例: carousel.tsxを復元する場合
git checkout backup-ui-components -- components/ui/carousel.tsx
\`\`\`

または、すべてのUIコンポーネントを復元する場合：

\`\`\`bash
git checkout backup-ui-components -- components/ui/
\`\`\`

## 言語切替機能

右上の言語切替ボタンで日本語/英語を切り替えることができます。
言語設定はローカルストレージに保存されます。
