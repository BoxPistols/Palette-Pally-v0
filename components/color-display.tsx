import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { isLightColor, calculateContrastRatio, getWCAGLevel } from "@/lib/color-utils"
import { AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { findClosestTailwindColor, findClosestMaterialColor } from "@/lib/color-systems"
import type { TextColorSettings } from "@/types/palette"
import type { ColorMode } from "@/lib/color-systems"

interface ColorDisplayProps {
  colorKey: string
  variations: Record<string, string>
  textColorSettings: TextColorSettings
  isPrimary?: boolean
  colorMode: ColorMode
  showTailwindClasses: boolean
  showMaterialNames: boolean
}

export function ColorDisplay({
  colorKey,
  variations,
  textColorSettings,
  isPrimary = false,
  colorMode,
  showTailwindClasses,
  showMaterialNames,
}: ColorDisplayProps) {
  return (
    <Card className={`overflow-hidden ${isPrimary ? "ring-1 ring-gray-300" : ""}`}>
      <CardHeader className="pb-2 px-3 pt-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm">{colorKey}</CardTitle>
        {isPrimary && (
          <Badge variant="outline" className="ml-2 bg-gray-50 text-gray-500">
            Primary
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {Object.entries(variations).map(([name, color]) => {
          // 通常の自動テキスト色判定
          const isLight = isLightColor(color)

          // テキストカラー設定に基づいてテキスト色を決定
          const textColorMode = textColorSettings[name as keyof TextColorSettings]
          let textColor: string

          switch (textColorMode) {
            case "white":
              textColor = "#FFFFFF"
              break
            case "black":
              textColor = "#000000"
              break
            default: // "default"
              textColor = isLight ? "#000000" : "#FFFFFF"
              break
          }

          // コントラスト比の計算
          const contrast = calculateContrastRatio(color, textColor)
          const wcagLevel = getWCAGLevel(contrast)

          // 警告表示の条件：強制カラーモード（defaultでない）かつAAレベルに達していない場合
          const showWarning = textColorMode !== "default" && wcagLevel.level !== "AAA" && wcagLevel.level !== "AA"

          // レベルに応じたバッジの色を設定
          const levelColor =
            wcagLevel.level === "AAA"
              ? "bg-green-100 text-green-800"
              : wcagLevel.level === "AA"
                ? "bg-blue-100 text-blue-800"
                : wcagLevel.level === "A"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"

          // Tailwindの最も近い色を取得
          const closestTailwind = findClosestTailwindColor(color)

          // Material Designの最も近い色を取得
          const closestMaterial = findClosestMaterialColor(color)

          return (
            <div
              key={name}
              className="flex items-center justify-between p-2 border-t first:border-t-0"
              style={{ backgroundColor: color }}
            >
              <div className="flex items-center gap-1">
                <div style={{ color: textColor }} className="text-xs font-medium">
                  {name}: {color}
                  {/* カラーモードに応じた追加情報 */}
                  {colorMode === "tailwind" && showTailwindClasses && (
                    <span className="ml-1 opacity-80">
                      (bg-{closestTailwind.color}-{closestTailwind.shade})
                    </span>
                  )}
                  {colorMode === "material" && showMaterialNames && (
                    <span className="ml-1 opacity-80">
                      ({closestMaterial.color} {closestMaterial.shade})
                    </span>
                  )}
                </div>
                {showWarning && (
                  <AlertTriangle size={14} className="text-red-500" title="コントラスト比が低すぎます（AA未満）" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${levelColor} opacity-80`}
                  title={`コントラスト比: ${contrast.toFixed(2)}:1`}
                >
                  {wcagLevel.level}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800 opacity-80"
                  title={`コントラスト比: ${contrast.toFixed(2)}:1`}
                >
                  {contrast.toFixed(1)}:1
                </span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
