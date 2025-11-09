/**
 * Application-level constants for Palette Pally
 * Centralized constants for file names, storage keys, MIME types, and UI messages
 */

// Local Storage Keys
export const STORAGE_KEY = "palette-pally-mui-data"

// File Names
export const FILE_NAMES = {
  MUI_PALETTE: "mui-palette.json",
  PALETTE_EXPORT: "palette-pally-export.json",
  MUI_THEME: "theme.js",
  FIGMA_TOKENS: "design-tokens.json",
} as const

// MIME Types
export const MIME_TYPES = {
  JSON: "application/json",
  JAVASCRIPT: "text/javascript",
} as const

// File Extensions
export const FILE_EXTENSIONS = {
  JSON: ".json",
} as const

// Toast Messages
export const TOAST_MESSAGES = {
  EXPORT_COMPLETE: {
    EN: {
      title: "Export Complete",
      description: {
        JSON: "JSON file download started",
        MUI_THEME: "MUI theme file download started",
        FIGMA_TOKENS: "Figma Design Tokens file download started",
      },
    },
    JA: {
      title: "エクスポート完了",
      description: "JSONファイルのダウンロードを開始しました",
    },
  },
  IMPORT_SUCCESS: {
    EN: {
      title: "Import Complete",
      description: "Palette data imported successfully",
    },
    JA: {
      title: "インポート完了",
      description: "パレットデータを正常に読み込みました",
    },
  },
  IMPORT_ERROR: {
    EN: "Import error occurred",
    JA: "インポート中にエラーが発生しました",
  },
  EXPORT_ERROR: {
    EN: "Export error occurred",
    JA: "エクスポート中にエラーが発生しました。",
  },
} as const
