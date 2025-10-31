"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { GreyPalette } from "@/types/palette"

interface GreyPaletteEditorProps {
  grey: GreyPalette
  onGreyChange: (grey: GreyPalette) => void
}

export function GreyPaletteEditor({ grey, onGreyChange }: GreyPaletteEditorProps) {
  const greyShades: (keyof GreyPalette)[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Grey Palette</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {greyShades.map((shade) => (
            <div key={shade}>
              <Label htmlFor={`grey-${shade}`} className="text-xs">
                {shade}
              </Label>
              <div className="flex gap-1">
                <div className="w-8 h-8 rounded border" style={{ backgroundColor: grey[shade] }} title={grey[shade]} />
                <Input
                  id={`grey-${shade}`}
                  value={grey[shade]}
                  onChange={(e) => onGreyChange({ ...grey, [shade]: e.target.value })}
                  className="h-8 text-xs flex-1"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
