import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { calculateContrastRatio, getWCAGLevel } from "@/lib/color-utils"
import type { MUIColorData } from "@/types/palette"

interface MUIColorDisplayProps {
  colorData: MUIColorData
}

export function MUIColorDisplay({ colorData }: MUIColorDisplayProps) {
  if (colorData.type === "simple") {
    // Simple color: only display main color
    const textColor = colorData.contrastText || "#FFFFFF"
    const contrast = calculateContrastRatio(colorData.main, textColor)
    const wcagLevel = getWCAGLevel(contrast)

    const levelColor =
      wcagLevel.level === "AAA"
        ? "bg-green-100 text-green-800"
        : wcagLevel.level === "AA"
          ? "bg-blue-100 text-blue-800"
          : wcagLevel.level === "A"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"

    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2 px-3 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">{colorData.name}</CardTitle>
            <Badge variant="secondary" className="text-[10px]">
              simple
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-3 border-t" style={{ backgroundColor: colorData.main }}>
            <div className="flex items-center gap-1">
              <div style={{ color: textColor }} className="text-xs font-medium">
                {colorData.main}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${levelColor} opacity-80`}
                title={`Contrast: ${contrast.toFixed(2)}:1`}
              >
                {wcagLevel.level}
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800 opacity-80"
                title={`Contrast: ${contrast.toFixed(2)}:1`}
              >
                {contrast.toFixed(1)}:1
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Theme color: display all variations
  const variations = [
    { name: "lighter", color: colorData.lighter || colorData.main },
    { name: "light", color: colorData.light || colorData.main },
    { name: "main", color: colorData.main },
    { name: "dark", color: colorData.dark || colorData.main },
  ]

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 px-3 pt-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{colorData.name}</CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            theme
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {variations.map(({ name, color }) => {
          const textColor = colorData.contrastText || "#FFFFFF"
          const contrast = calculateContrastRatio(color, textColor)
          const wcagLevel = getWCAGLevel(contrast)

          const levelColor =
            wcagLevel.level === "AAA"
              ? "bg-green-100 text-green-800"
              : wcagLevel.level === "AA"
                ? "bg-blue-100 text-blue-800"
                : wcagLevel.level === "A"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"

          return (
            <div
              key={name}
              className="flex items-center justify-between p-2 border-t first:border-t-0"
              style={{ backgroundColor: color }}
            >
              <div className="flex items-center gap-1">
                <div style={{ color: textColor }} className="text-xs font-medium">
                  {name}: {color}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${levelColor} opacity-80`}
                  title={`Contrast: ${contrast.toFixed(2)}:1`}
                >
                  {wcagLevel.level}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800 opacity-80"
                  title={`Contrast: ${contrast.toFixed(2)}:1`}
                >
                  {contrast.toFixed(1)}:1
                </span>
              </div>
            </div>
          )
        })}

        {/* contrastText display */}
        <div className="flex items-center justify-between p-2 border-t" style={{ backgroundColor: colorData.main }}>
          <div className="flex items-center gap-1">
            <div style={{ color: colorData.contrastText }} className="text-xs font-medium">
              contrastText: {colorData.contrastText}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
