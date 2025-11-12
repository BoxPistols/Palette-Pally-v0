"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/hooks/use-language"

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

interface TypographyPreviewProps {
  tokens: Record<string, TypographyToken>
}

export function TypographyPreview({ tokens }: TypographyPreviewProps) {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState<string>("all")

  // 翻訳テキスト
  const texts = {
    jp: {
      title: "タイポグラフィプレビュー",
      allTab: "すべて",
      headingsTab: "見出し",
      bodyTab: "本文",
      variantsTab: "バリアント",
      fontFamily: "フォントファミリー",
      fontSize: "フォントサイズ",
      fontWeight: "フォントウェイト",
      lineHeight: "行の高さ",
      letterSpacing: "文字間隔",
      sampleText: "サンプルテキスト",
      noTokens: "タイポグラフィトークンがありません",
    },
    en: {
      title: "Typography Preview",
      allTab: "All",
      headingsTab: "Headings",
      bodyTab: "Body",
      variantsTab: "Variants",
      fontFamily: "Font Family",
      fontSize: "Font Size",
      fontWeight: "Font Weight",
      lineHeight: "Line Height",
      letterSpacing: "Letter Spacing",
      sampleText: "Sample Text",
      noTokens: "No typography tokens available",
    },
  }

  const t = texts[language]

  // トークンをパスでグループ化
  const groupTokensByPath = () => {
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

  // タイポグラフィカードのレンダリング
  const renderTypographyCard = (name: string, token: TypographyToken) => {
    const displayName = name.split("/").pop() || name
    const path = name.split("/").slice(0, -1).join("/")

    // サンプルテキストを生成
    const sampleText = language === "jp" ? "サンプルテキスト" : "Sample Text"
    const longSampleText =
      language === "jp"
        ? "これはより長いサンプルテキストです。タイポグラフィの表示を確認するために使用します。"
        : "This is a longer sample text. It is used to check the typography display."

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
              {sampleText}
            </p>
            <p
              className="mb-2 text-xs"
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
              {longSampleText}
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

  // トークンをフィルタリング
  const filterTokens = (category: string) => {
    if (category === "all") {
      return tokens
    }

    const filtered: Record<string, TypographyToken> = {}

    Object.entries(tokens).forEach(([name, token]) => {
      const lowerName = name.toLowerCase()

      if (
        (category === "headings" &&
          (lowerName.includes("head") ||
            lowerName.includes("h1") ||
            lowerName.includes("h2") ||
            lowerName.includes("h3") ||
            lowerName.includes("h4") ||
            lowerName.includes("h5") ||
            lowerName.includes("h6"))) ||
        (category === "body" && lowerName.includes("body")) ||
        (category === "variants" && lowerName.includes("variant"))
      ) {
        filtered[name] = token
      }
    })

    return filtered
  }

  const groupedTokens = groupTokensByPath()
  const filteredTokens = filterTokens(activeTab)

  if (Object.keys(tokens).length === 0) {
    return <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t.noTokens}</div>
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="all">{t.allTab}</TabsTrigger>
          <TabsTrigger value="headings">{t.headingsTab}</TabsTrigger>
          <TabsTrigger value="body">{t.bodyTab}</TabsTrigger>
          <TabsTrigger value="variants">{t.variantsTab}</TabsTrigger>
        </TabsList>
      </Tabs>

      {Object.keys(filteredTokens).length > 0 ? (
        <div>
          {Object.entries(groupTokensByPath()).map(([path, pathTokens]) => {
            // 現在のフィルターに一致するトークンのみを表示
            const tokensToShow = Object.entries(pathTokens).filter(([name]) =>
              Object.keys(filteredTokens).some((filteredName) => filteredName === `${path ? path + "/" : ""}${name}`),
            )

            if (tokensToShow.length === 0) return null

            return (
              <div key={path} className="mb-6">
                <h3 className="text-sm font-medium mb-3 px-1 flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {path || "root"}
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tokensToShow.map(([name, token]) => renderTypographyCard(`${path ? path + "/" : ""}${name}`, token))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {language === "jp" ? "該当するトークンがありません" : "No matching tokens"}
        </div>
      )}
    </div>
  )
}
