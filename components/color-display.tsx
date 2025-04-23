import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { isLightColor } from "@/lib/color-utils"

interface ColorDisplayProps {
  colorKey: string
  variations: Record<string, string>
}

export function ColorDisplay({ colorKey, variations }: ColorDisplayProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 px-3 pt-3">
        <CardTitle className="text-sm">{colorKey}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {Object.entries(variations).map(([name, color]) => {
          const isLight = isLightColor(color)

          return (
            <div
              key={name}
              className="flex items-center p-2 border-t first:border-t-0"
              style={{ backgroundColor: color }}
            >
              <div className={`text-xs font-medium ${isLight ? "text-gray-800" : "text-white"}`}>
                {name}: {color}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
