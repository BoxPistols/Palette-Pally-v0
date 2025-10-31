"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TextColors, BackgroundColors } from "@/types/palette"

interface AdditionalColorsEditorProps {
  text: TextColors
  background: BackgroundColors
  divider: string
  onTextChange: (text: TextColors) => void
  onBackgroundChange: (background: BackgroundColors) => void
  onDividerChange: (divider: string) => void
}

export function AdditionalColorsEditor({
  text,
  background,
  divider,
  onTextChange,
  onBackgroundChange,
  onDividerChange,
}: AdditionalColorsEditorProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Additional Colors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text Colors */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-600">Text</h3>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <Label htmlFor="text-primary" className="text-xs">
                Primary
              </Label>
              <Input
                id="text-primary"
                value={text.primary}
                onChange={(e) => onTextChange({ ...text, primary: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="text-secondary" className="text-xs">
                Secondary
              </Label>
              <Input
                id="text-secondary"
                value={text.secondary}
                onChange={(e) => onTextChange({ ...text, secondary: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="text-disabled" className="text-xs">
                Disabled
              </Label>
              <Input
                id="text-disabled"
                value={text.disabled}
                onChange={(e) => onTextChange({ ...text, disabled: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Background Colors */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-600">Background</h3>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <Label htmlFor="bg-default" className="text-xs">
                Default
              </Label>
              <Input
                id="bg-default"
                value={background.default}
                onChange={(e) => onBackgroundChange({ ...background, default: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="bg-paper" className="text-xs">
                Paper
              </Label>
              <Input
                id="bg-paper"
                value={background.paper}
                onChange={(e) => onBackgroundChange({ ...background, paper: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-600">Divider</h3>
          <Input
            value={divider}
            onChange={(e) => onDividerChange(e.target.value)}
            className="h-8 text-xs"
            placeholder="rgba(0, 0, 0, 0.12)"
          />
        </div>
      </CardContent>
    </Card>
  )
}
