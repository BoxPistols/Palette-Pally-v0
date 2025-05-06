"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Figma, Upload, Download, Type, FileJson, Sun, Moon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/hooks/use-language"
import { useTheme } from "@/contexts/theme-context"
import type { ColorData } from "@/types/palette"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FigmaTokensPanelProps {
  colors: ColorData[]
  onImport: (colors: ColorData[]) => void
}

// トークンの型定義
interface TokenValue {
  $type: string
  $value: string
  $description?: string
}

interface TypographyValue {
  fontFamily: string
  fontSize: string
  fontWeight: number
  letterSpacing: string
  lineHeight: string
  textTransform: string
  textDecoration: string
}

interface TypographyToken {
  $type: string
  $value: TypographyValue
  $description?: string
}

interface ColorGroup {
  name: string
  path: string
  colors: {
    main?: string
    dark?: string
    light?: string
    lighter?: string
    contrastText?: string
    [key: string]: string | undefined
  }
}

interface ManifestFile {
  name: string
  collections: Record<
    string,
    {
      modes: Record<string, string[]>
    }
  >
  styles: Record<string, string[]>
}

export function FigmaTokensPanel({ colors, onImport }: FigmaTokensPanelProps) {
  const { language } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [jsonPreview, setJsonPreview] = useState<string>("")
  const [importJson, setImportJson] = useState<string>("")
  const [activeTab, setActiveTab] = useState("export")
  const [activeContentTab, setActiveContentTab] = useState("colors")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [colorGroups, setColorGroups] = useState<ColorGroup[]>([])
  const [typographyTokens, setTypographyTokens] = useState<Record<string, any>>({})
  const [schemaMode, setSchemaMode] = useState<"light" | "dark">(theme === "dark" ? "dark" : "light")
  const [schemaData, setSchemaData] = useState<{
    light: Record<string, any> | null
    dark: Record<string, any> | null
  }>({
    light: null,
    dark: null,
  })
  const [manifestData, setManifestData] = useState<ManifestFile | null>(null)
  const [isProcessingManifest, setIsProcessingManifest] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{
    [filename: string]: string
  }>({})

  // テーマが変更されたときにスキーマモードも更新
  useEffect(() => {
    setSchemaMode(theme === "dark" ? "dark" : "light")
  }, [theme])

  // 翻訳テキスト
  const texts = {
    jp: {
      button: "Figmaトークン",
      title: "Figmaデザイントークン",
      description: "Figmaのデザイントークンをエクスポート/インポートできます",
      exportTab: "エクスポート",
      importTab: "インポート",
      exportDescription: "以下のJSONをFigmaのデザイントークンマネージャーにインポートできます",
      importDescription: "Figmaからエクスポートしたデザイントークンを貼り付けてください",
      importPlaceholder: "JSONをここに貼り付け...",
      copyButton: "コピー",
      importButton: "インポート",
      closeButton: "閉じる",
      copySuccess: "JSONをクリップボードにコピーしました",
      copyError: "コピーに失敗しました",
      importSuccess: "デザイントークンをインポートしました",
      importError: "インポートに失敗しました。JSONの形式を確認してください",
      invalidJson: "無効なJSONです。形式を確認してください",
      downloadJson: "JSONをダウンロード",
      uploadJson: "JSONをアップロード",
      dropJsonHere: "JSONファイルをここにドロップ",
      orClickToUpload: "またはクリックしてアップロード",
      colorsTab: "カラー",
      typographyTab: "タイポグラフィ",
      lightMode: "ライトモード",
      darkMode: "ダークモード",
      noTypography: "タイポグラフィトークンがありません",
      fontFamily: "フォントファミリー",
      fontSize: "フォントサイズ",
      fontWeight: "フォントウェイト",
      lineHeight: "行の高さ",
      letterSpacing: "文字間隔",
      preview: "プレビュー",
      noColorTokens: "カラートークンがありません",
      manifestDetected: "マニフェストファイルを検出しました",
      processingManifest: "マニフェストファイルを処理中...",
      uploadRelatedFiles: "関連ファイルをアップロードしてください",
      uploadedFiles: "アップロード済みファイル",
      missingFiles: "不足しているファイル",
      lightModeTooltip: "ライトモードのカラートークンを表示します。アプリのテーマも変更されます。",
      darkModeTooltip: "ダークモードのカラートークンを表示します。アプリのテーマも変更されます。",
      applyToApp: "アプリに適用",
      applyToAppTooltip: "現在表示中のモード（ライト/ダーク）のカラートークンをアプリに適用します",
    },
    en: {
      button: "Figma Tokens",
      title: "Figma Design Tokens",
      description: "Export and import design tokens for Figma",
      exportTab: "Export",
      importTab: "Import",
      exportDescription: "You can import the following JSON into Figma Design Tokens Manager",
      importDescription: "Paste design tokens exported from Figma",
      importPlaceholder: "Paste JSON here...",
      copyButton: "Copy",
      importButton: "Import",
      closeButton: "Close",
      copySuccess: "JSON copied to clipboard",
      copyError: "Failed to copy",
      importSuccess: "Design tokens imported",
      importError: "Import failed. Please check the JSON format",
      invalidJson: "Invalid JSON. Please check the format",
      downloadJson: "Download JSON",
      uploadJson: "Upload JSON",
      dropJsonHere: "Drop JSON file here",
      orClickToUpload: "or click to upload",
      colorsTab: "Colors",
      typographyTab: "Typography",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      noTypography: "No typography tokens available",
      fontFamily: "Font Family",
      fontSize: "Font Size",
      fontWeight: "Font Weight",
      lineHeight: "Line Height",
      letterSpacing: "Letter Spacing",
      preview: "Preview",
      noColorTokens: "No color tokens available",
      manifestDetected: "Manifest file detected",
      processingManifest: "Processing manifest file...",
      uploadRelatedFiles: "Please upload related files",
      uploadedFiles: "Uploaded files",
      missingFiles: "Missing files",
      lightModeTooltip: "Show light mode color tokens. This will also change the app theme.",
      darkModeTooltip: "Show dark mode color tokens. This will also change the app theme.",
      applyToApp: "Apply to App",
      applyToAppTooltip: "Apply the currently displayed mode (light/dark) color tokens to the app",
    },
  }

  const t = texts[language]

  // Figmaデザイントークン形式に変換
  const generateFigmaTokens = () => {
    const tokens: Record<string, any> = {}

    // 基本カラー
    colors.forEach((color) => {
      const name = color.role || color.name

      // ロールに基づいて階層構造を作成
      if (name.includes("/")) {
        // スラッシュで区切られた階層構造を処理
        const parts = name.split("/")
        let current = tokens

        // 最後の部分以外を階層として処理
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {}
          }
          current = current[parts[i]]
        }

        // 最後の部分をトークンとして設定
        current[parts[parts.length - 1]] = {
          $type: "color",
          $value: color.value,
        }
      } else {
        // 通常のフラットな構造
        tokens[name] = {
          $type: "color",
          $value: color.value,
        }
      }
    })

    // common.white, common.blackを追加
    tokens.common = {
      white: {
        $type: "color",
        $value: "#ffffff",
      },
      black: {
        $type: "color",
        $value: "#000000",
      },
    }

    return JSON.stringify(tokens, null, 2)
  }

  // エクスポート用JSONを生成
  const handlePrepareExport = () => {
    try {
      const tokensJson = generateFigmaTokens()
      setJsonPreview(tokensJson)
      setActiveTab("export")
      setIsOpen(true)
    } catch (error) {
      console.error("Error generating Figma tokens:", error)
      toast({
        title: language === "jp" ? "エクスポートエラー" : "Export Error",
        variant: "destructive",
      })
    }
  }

  // クリップボードにコピー
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonPreview).then(
      () => {
        toast({
          title: t.copySuccess,
        })
      },
      (err) => {
        console.error("Failed to copy:", err)
        toast({
          title: t.copyError,
          variant: "destructive",
        })
      },
    )
  }

  // JSONをダウンロード
  const handleDownloadJson = () => {
    const blob = new Blob([jsonPreview], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "figma-tokens.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // ファイルアップロードを処理
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // 複数ファイルのアップロードをサポート
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const fileName = file.name

          // アップロードされたファイルを保存
          setUploadedFiles((prev) => ({
            ...prev,
            [fileName]: content,
          }))

          processImportedJson(content, fileName)
        } catch (error) {
          console.error("Error reading file:", error)
          toast({
            title: t.importError,
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    })
  }

  // ドラッグ&ドロップを処理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    // 複数ファイルのドロップをサポート
    Array.from(files).forEach((file) => {
      if (file.type !== "application/json") {
        toast({
          title: language === "jp" ? "JSONファイルのみ対応しています" : "Only JSON files are supported",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const fileName = file.name

          // アップロードされたファイルを保存
          setUploadedFiles((prev) => ({
            ...prev,
            [fileName]: content,
          }))

          processImportedJson(content, fileName)
        } catch (error) {
          console.error("Error reading file:", error)
          toast({
            title: t.importError,
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    })
  }

  // カラートークンを抽出してグループ化
  const extractColorTokens = (data: any): ColorGroup[] => {
    const colorGroups: Record<string, ColorGroup> = {}

    // 再帰的にカラートークンを検索
    const findColorTokens = (obj: any, path: string[] = []) => {
      if (!obj || typeof obj !== "object") return

      for (const key in obj) {
        const currentPath = [...path, key]
        const currentPathStr = currentPath.join("/")

        // カラートークンの場合
        if (obj[key]?.$type === "color" && obj[key]?.$value) {
          // パスの最後の部分を取得
          const lastPart = currentPath[currentPath.length - 1]

          // パスの残りの部分を処理
          let groupPath = ""
          let groupName = ""
          const variantName = lastPart

          // パスの構造に基づいて処理
          if (currentPath.length >= 2) {
            // 最後から2番目の部分をグループ名として使用
            groupName = currentPath[currentPath.length - 2]

            // それ以前のパスをグループパスとして使用
            groupPath = currentPath.slice(0, -2).join("/")

            // main, dark, light, lighterなどの特定のバリアントを検出
            if (["main", "dark", "light", "lighter", "contrastText"].includes(lastPart)) {
              // グループが存在しない場合は作成
              const groupKey = `${groupPath}/${groupName}`
              if (!colorGroups[groupKey]) {
                colorGroups[groupKey] = {
                  name: groupName,
                  path: groupPath,
                  colors: {},
                }
              }

              // バリアントを追加
              colorGroups[groupKey].colors[variantName] = obj[key].$value
            } else {
              // 通常のカラートークン（バリアントではない）
              const groupKey = `${groupPath}`
              if (!colorGroups[groupKey]) {
                colorGroups[groupKey] = {
                  name: groupName,
                  path: groupPath,
                  colors: {},
                }
              }

              // カラーを追加
              colorGroups[groupKey].colors[`${groupName}/${variantName}`] = obj[key].$value
            }
          } else {
            // 単一レベルのトークン
            groupName = key
            const groupKey = "root"
            if (!colorGroups[groupKey]) {
              colorGroups[groupKey] = {
                name: "root",
                path: "",
                colors: {},
              }
            }

            // カラーを追加
            colorGroups[groupKey].colors[groupName] = obj[key].$value
          }
        }
        // ネストされたオブジェクトを再帰的に処理
        else if (typeof obj[key] === "object") {
          findColorTokens(obj[key], currentPath)
        }
      }
    }

    findColorTokens(data)

    // オブジェクトを配列に変換
    return Object.values(colorGroups)
  }

  // マニフェストファイルを処理
  const processManifestFile = (manifestContent: string, fileName: string) => {
    try {
      const manifest = JSON.parse(manifestContent) as ManifestFile
      setManifestData(manifest)
      setIsProcessingManifest(true)

      toast({
        title: t.manifestDetected,
        description: t.uploadRelatedFiles,
      })

      // マニフェストファイルに記載されているファイルを確認
      const requiredFiles: string[] = []

      // コレクションのファイルを追加
      Object.values(manifest.collections).forEach((collection) => {
        Object.values(collection.modes).forEach((fileList) => {
          fileList.forEach((file) => {
            requiredFiles.push(file)
          })
        })
      })

      // スタイルのファイルを追加
      Object.values(manifest.styles).forEach((fileList) => {
        fileList.forEach((file) => {
          requiredFiles.push(file)
        })
      })

      // すでにアップロードされているファイルを確認
      const missingFiles = requiredFiles.filter((file) => !uploadedFiles[file])

      if (missingFiles.length === 0) {
        // すべてのファイルがアップロード済みの場合、処理を続行
        processAllTokenFiles()
      }
    } catch (error) {
      console.error("Error processing manifest file:", error)
      toast({
        title: language === "jp" ? "マニフェストファイルの処理に失敗しました" : "Failed to process manifest file",
        variant: "destructive",
      })
    }
  }

  // すべてのトークンファイルを処理
  const processAllTokenFiles = () => {
    if (!manifestData) return

    // ライトモードとダークモードのファイルを処理
    Object.entries(manifestData.collections).forEach(([collectionName, collection]) => {
      // ライトモードのファイル
      if (collection.modes.light) {
        collection.modes.light.forEach((fileName) => {
          if (uploadedFiles[fileName]) {
            const lightData = JSON.parse(uploadedFiles[fileName])
            setSchemaData((prev) => ({ ...prev, light: lightData }))

            // カラーグループを抽出
            const lightColorGroups = extractColorTokens(lightData)
            if (lightColorGroups.length > 0 && schemaMode === "light") {
              setColorGroups(lightColorGroups)
            }
          }
        })
      }

      // ダークモードのファイル
      if (collection.modes.dark) {
        collection.modes.dark.forEach((fileName) => {
          if (uploadedFiles[fileName]) {
            const darkData = JSON.parse(uploadedFiles[fileName])
            setSchemaData((prev) => ({ ...prev, dark: darkData }))

            // カラーグループを抽出
            const darkColorGroups = extractColorTokens(darkData)
            if (darkColorGroups.length > 0 && schemaMode === "dark") {
              setColorGroups(darkColorGroups)
            }
          }
        })
      }
    })

    // タイポグラフィファイルを処理
    if (manifestData.styles.text) {
      manifestData.styles.text.forEach((fileName) => {
        if (uploadedFiles[fileName]) {
          const typographyData = JSON.parse(uploadedFiles[fileName])
          const extractedTypography = extractTypographyTokens(typographyData)
          setTypographyTokens(extractedTypography)

          if (Object.keys(extractedTypography).length > 0) {
            setActiveContentTab("typography")
          }
        }
      })
    }

    setIsProcessingManifest(false)

    toast({
      title: language === "jp" ? "すべてのトークンファイルを処理しました" : "Processed all token files",
    })
  }

  // インポートされたJSONを処理する
  const processImportedJson = (jsonString: string, fileName?: string) => {
    try {
      const data = JSON.parse(jsonString)

      // マニフェストファイルかどうかを確認
      if (data.collections || data.styles) {
        processManifestFile(jsonString, fileName || "manifest.json")
        return
      }

      // タイポグラフィトークンかどうかを確認
      const hasTypography = findTypographyTokens(data)
      if (hasTypography) {
        const extractedTypography = extractTypographyTokens(data)
        setTypographyTokens(extractedTypography)

        if (Object.keys(extractedTypography).length > 0) {
          setActiveContentTab("typography")
          toast({
            title: language === "jp" ? "タイポグラフィトークンを検出しました" : "Typography tokens detected",
          })
        }
      }

      // カラートークンを処理
      const colorData = extractColorTokens(data)

      // カラートークンが見つかった場合
      if (colorData.length > 0) {
        // ライト/ダークモードを判断
        const isLightMode = fileName
          ? fileName.toLowerCase().includes("light")
          : jsonString.includes("light") || !jsonString.includes("dark")

        const isDarkMode = fileName ? fileName.toLowerCase().includes("dark") : jsonString.includes("dark")

        if (isLightMode) {
          setSchemaData((prev) => ({ ...prev, light: data }))
          if (schemaMode === "light") {
            setColorGroups(colorData)
          }
        }
        if (isDarkMode) {
          setSchemaData((prev) => ({ ...prev, dark: data }))
          if (schemaMode === "dark") {
            setColorGroups(colorData)
          }
        }

        // モードが特定できない場合は現在のモードに設定
        if (!isLightMode && !isDarkMode) {
          if (schemaMode === "light") {
            setSchemaData((prev) => ({ ...prev, light: data }))
          } else {
            setSchemaData((prev) => ({ ...prev, dark: data }))
          }
          setColorGroups(colorData)
        }

        if (!hasTypography || Object.keys(extractTypographyTokens(data)).length === 0) {
          setActiveContentTab("colors")
        }

        toast({
          title: language === "jp" ? "カラートークンを検出しました" : "Color tokens detected",
        })
      }

      // トークンが見つからなかった場合
      if (colorData.length === 0 && !hasTypography) {
        toast({
          title: language === "jp" ? "トークンが見つかりませんでした" : "No tokens found",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error processing JSON:", error)
      toast({
        title: t.invalidJson,
        variant: "destructive",
      })
    }
  }

  // タイポグラフィトークンを検索
  const findTypographyTokens = (data: any): boolean => {
    if (!data || typeof data !== "object") return false

    for (const key in data) {
      if (typeof data[key] === "object") {
        if (data[key]?.$type === "typography") {
          return true
        }
        if (findTypographyTokens(data[key])) {
          return true
        }
      }
    }

    return false
  }

  // タイポグラフィトークンを抽出
  const extractTypographyTokens = (data: any, prefix = ""): Record<string, any> => {
    const result: Record<string, any> = {}

    if (!data || typeof data !== "object") return result

    for (const key in data) {
      const currentPath = prefix ? `${prefix}/${key}` : key

      if (data[key]?.$type === "typography") {
        result[currentPath] = data[key]
      } else if (typeof data[key] === "object") {
        const nestedTokens = extractTypographyTokens(data[key], currentPath)
        Object.assign(result, nestedTokens)
      }
    }

    return result
  }

  // モードを切り替える
  const handleModeChange = (mode: "light" | "dark") => {
    setSchemaMode(mode)
    setTheme(mode)

    // 選択したモードのカラーグループを表示
    if (mode === "light" && schemaData.light) {
      const lightColorGroups = extractColorTokens(schemaData.light)
      setColorGroups(lightColorGroups)
    } else if (mode === "dark" && schemaData.dark) {
      const darkColorGroups = extractColorTokens(schemaData.dark)
      setColorGroups(darkColorGroups)
    }
  }

  // カラーカードのレンダリング
  const renderColorCard = (group: ColorGroup) => {
    const { name, path, colors } = group
    const displayName = name.charAt(0).toUpperCase() + name.slice(1)

    // カラーエントリーをソート
    const sortedColors = Object.entries(colors).sort(([a], [b]) => {
      // main を最初に表示
      if (a === "main") return -1
      if (b === "main") return 1

      // 次に dark, light, lighter の順
      const order = ["dark", "light", "lighter", "contrastText"]
      const aIndex = order.indexOf(a)
      const bIndex = order.indexOf(b)

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1

      // その他は通常のアルファベット順
      return a.localeCompare(b)
    })

    return (
      <Card key={`${path}/${name}`} className="overflow-hidden">
        <CardHeader className="p-4">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>{displayName}</span>
            {path && (
              <Badge variant="outline" className="ml-2 text-xs">
                {path}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 gap-0">
            {sortedColors.map(([variant, color]) => (
              <div
                key={variant}
                className="flex items-center p-2 border-t first:border-t-0"
                style={{ borderColor: "rgba(0,0,0,0.1)" }}
              >
                <div
                  className="w-6 h-6 rounded-full mr-2 border"
                  style={{ backgroundColor: color, borderColor: "rgba(0,0,0,0.1)" }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{variant}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{color}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // タイポグラフィカードのレンダリング
  const renderTypographyCard = (name: string, token: TypographyToken) => {
    const displayName = name.split("/").pop() || name
    const path = name.split("/").slice(0, -1).join("/")

    return (
      <Card key={name} className="overflow-hidden">
        <CardHeader className="p-4">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>{displayName}</span>
            {path && (
              <Badge variant="outline" className="ml-2 text-xs">
                {path}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="mb-3">
            <p
              className="mb-2 pb-2 border-b"
              style={{
                fontFamily: token.$value.fontFamily,
                fontSize: token.$value.fontSize,
                fontWeight: token.$value.fontWeight,
                letterSpacing: token.$value.letterSpacing,
                lineHeight: token.$value.lineHeight,
                textTransform: token.$value.textTransform as any,
                textDecoration: token.$value.textDecoration as any,
              }}
            >
              {language === "jp" ? "サンプルテキスト" : "Sample Text"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">{t.fontFamily}:</span> {token.$value.fontFamily}
            </div>
            <div>
              <span className="font-medium">{t.fontSize}:</span> {token.$value.fontSize}
            </div>
            <div>
              <span className="font-medium">{t.fontWeight}:</span> {token.$value.fontWeight}
            </div>
            <div>
              <span className="font-medium">{t.lineHeight}:</span> {token.$value.lineHeight}
            </div>
            <div>
              <span className="font-medium">{t.letterSpacing}:</span> {token.$value.letterSpacing}
            </div>
          </div>
          {token.$description && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">{language === "jp" ? "説明" : "Description"}:</span> {token.$description}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // カラーグループをパスでグループ化
  const groupByPath = (groups: ColorGroup[]) => {
    const result: Record<string, ColorGroup[]> = {}

    groups.forEach((group) => {
      if (!result[group.path]) {
        result[group.path] = []
      }
      result[group.path].push(group)
    })

    return result
  }

  // タイポグラフィトークンをパスでグループ化
  const groupTypographyByPath = (tokens: Record<string, TypographyToken>) => {
    const result: Record<string, Record<string, TypographyToken>> = {}

    Object.entries(tokens).forEach(([name, token]) => {
      const parts = name.split("/")
      const tokenName = parts.pop() || name
      const path = parts.join("/")

      if (!result[path]) {
        result[path] = {}
      }
      result[path][tokenName] = token
    })

    return result
  }

  // カラーデータをアプリに適用
  const applyColorsToApp = () => {
    // 現在のモードに基づいてカラーデータを取得
    const currentData = schemaMode === "light" ? schemaData.light : schemaData.dark
    if (!currentData) {
      toast({
        title: language === "jp" ? "適用するカラーデータがありません" : "No color data to apply",
        variant: "destructive",
      })
      return
    }

    // カラーデータを変換
    const newColors: ColorData[] = []

    // カラーグループからColorDataを生成
    colorGroups.forEach((group) => {
      // mainカラーがある場合
      if (group.colors.main) {
        const role =
          group.name === "primary"
            ? "primary"
            : group.name === "secondary"
              ? "secondary"
              : group.name === "success"
                ? "success"
                : group.name === "warning"
                  ? "warning"
                  : group.name === "error"
                    ? "danger"
                    : group.name === "info"
                      ? "info"
                      : group.name === "background"
                        ? "background"
                        : group.name === "text"
                          ? "text"
                          : undefined

        newColors.push({
          name: group.name,
          value: group.colors.main,
          role,
        })
      } else {
        // mainカラーがない場合は最初のカラーを使用
        const firstColor = Object.entries(group.colors)[0]
        if (firstColor) {
          newColors.push({
            name: group.name,
            value: firstColor[1],
            role: undefined,
          })
        }
      }
    })

    // カラーデータが生成できた場合はアプリに適用
    if (newColors.length > 0) {
      onImport(newColors)
      setIsOpen(false)
      toast({
        title: language === "jp" ? "カラーをアプリに適用しました" : "Applied colors to app",
      })
    } else {
      toast({
        title: language === "jp" ? "適用するカラーがありません" : "No colors to apply",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => {
          setIsOpen(true)
          setActiveTab("import")
        }}
        title={t.button}
      >
        <Figma className="h-4 w-4" />
        <span>{t.button}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[900px] w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>{t.description}</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="export">{t.exportTab}</TabsTrigger>
              <TabsTrigger value="import">{t.importTab}</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden flex flex-col">
              <TabsContent value="export" className="h-full flex-1 flex flex-col overflow-hidden mt-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t.exportDescription}</p>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto flex-1 min-h-[300px] text-sm font-mono">
                  <pre className="whitespace-pre">{jsonPreview}</pre>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={handleDownloadJson} className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {t.downloadJson}
                  </Button>
                  <Button onClick={handleCopyToClipboard}>{t.copyButton}</Button>
                </div>
              </TabsContent>

              <TabsContent value="import" className="h-full flex-1 flex flex-col overflow-hidden mt-0">
                <div className="flex-1 flex flex-col min-h-[500px] overflow-hidden">
                  <div className="flex mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t.importDescription}</p>
                      <div
                        className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md text-center mb-4"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept=".json"
                          onChange={handleFileUpload}
                          className="hidden"
                          multiple
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1"
                        >
                          <Upload className="h-4 w-4" />
                          {t.uploadJson}
                        </Button>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {t.dropJsonHere} {t.orClickToUpload}
                        </p>
                      </div>

                      {/* マニフェストファイル処理中の表示 */}
                      {isProcessingManifest && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">{t.processingManifest}</h3>

                          {/* アップロード済みファイル */}
                          <div className="mb-2">
                            <h4 className="text-xs font-medium mb-1">{t.uploadedFiles}</h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {Object.keys(uploadedFiles).map((fileName) => (
                                <div key={fileName} className="flex items-center gap-1 mb-1">
                                  <FileJson className="h-3 w-3" />
                                  <span>{fileName}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 不足しているファイル */}
                          {manifestData && (
                            <div>
                              <h4 className="text-xs font-medium mb-1">{t.missingFiles}</h4>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {/* コレクションのファイル */}
                                {Object.values(manifestData.collections).flatMap((collection) =>
                                  Object.values(collection.modes).flatMap((fileList) =>
                                    fileList
                                      .filter((file) => !uploadedFiles[file])
                                      .map((file) => (
                                        <div key={file} className="flex items-center gap-1 mb-1">
                                          <FileJson className="h-3 w-3" />
                                          <span>{file}</span>
                                        </div>
                                      )),
                                  ),
                                )}

                                {/* スタイルのファイル */}
                                {Object.values(manifestData.styles).flatMap((fileList) =>
                                  fileList
                                    .filter((file) => !uploadedFiles[file])
                                    .map((file) => (
                                      <div key={file} className="flex items-center gap-1 mb-1">
                                        <FileJson className="h-3 w-3" />
                                        <span>{file}</span>
                                      </div>
                                    )),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {(colorGroups.length > 0 || Object.keys(typographyTokens).length > 0) && (
                    <div className="flex-1 overflow-hidden flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <Tabs defaultValue={activeContentTab} onValueChange={setActiveContentTab} className="w-full">
                          <TabsList>
                            <TabsTrigger value="colors" className="flex items-center gap-1">
                              {t.colorsTab}
                            </TabsTrigger>
                            <TabsTrigger value="typography" className="flex items-center gap-1">
                              <Type className="h-4 w-4" />
                              {t.typographyTab}
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>

                        {activeContentTab === "colors" && (
                          <div className="flex items-center ml-4">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={schemaMode === "light" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleModeChange("light")}
                                    className="text-xs"
                                  >
                                    <Sun className="h-4 w-4 mr-1" />
                                    {t.lightMode}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t.lightModeTooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={schemaMode === "dark" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleModeChange("dark")}
                                    className="text-xs ml-2"
                                  >
                                    <Moon className="h-4 w-4 mr-1" />
                                    {t.darkMode}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t.darkModeTooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={applyColorsToApp}
                                    className="text-xs ml-4"
                                  >
                                    {t.applyToApp}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t.applyToAppTooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 overflow-auto">
                        <TabsContent value="colors" className="mt-0">
                          {colorGroups.length > 0 ? (
                            <div>
                              {Object.entries(groupByPath(colorGroups)).map(([path, groups]) => (
                                <div key={path} className="mb-6">
                                  <h3 className="text-sm font-medium mb-3 px-1 flex items-center">
                                    <Badge variant="outline" className="mr-2">
                                      {path || "root"}
                                    </Badge>
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {groups.map((group) => renderColorCard(group))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t.noColorTokens}</div>
                          )}
                        </TabsContent>

                        <TabsContent value="typography" className="mt-0">
                          {Object.keys(typographyTokens).length > 0 ? (
                            <div>
                              {Object.entries(groupTypographyByPath(typographyTokens)).map(([path, tokens]) => (
                                <div key={path} className="mb-6">
                                  <h3 className="text-sm font-medium mb-3 px-1 flex items-center">
                                    <Badge variant="outline" className="mr-2">
                                      {path || "root"}
                                    </Badge>
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(tokens).map(([name, token]) =>
                                      renderTypographyCard(`${path ? path + "/" : ""}${name}`, token),
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t.noTypography}</div>
                          )}
                        </TabsContent>
                      </div>
                    </div>
                  )}

                  {colorGroups.length === 0 && Object.keys(typographyTokens).length === 0 && !isProcessingManifest && (
                    <div className="flex-1">
                      <textarea
                        className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto w-full h-full min-h-[300px] text-sm font-mono resize-none"
                        placeholder={t.importPlaceholder}
                        value={importJson}
                        onChange={(e) => {
                          setImportJson(e.target.value)
                          if (e.target.value) {
                            processImportedJson(e.target.value)
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <Button onClick={applyColorsToApp} variant="secondary" className="mr-2">
                    {t.applyToApp}
                  </Button>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    {t.closeButton}
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
