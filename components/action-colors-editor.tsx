"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { ActionColors } from "@/types/palette"

interface ActionColorsEditorProps {
  action: ActionColors
  onActionChange: (action: ActionColors) => void
}

export function ActionColorsEditor({ action, onActionChange }: ActionColorsEditorProps) {
  const handleColorChange = (key: keyof ActionColors, value: string) => {
    onActionChange({
      ...action,
      [key]: value,
    })
  }

  const actionFields: { key: keyof ActionColors; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "hover", label: "Hover" },
    { key: "selected", label: "Selected" },
    { key: "disabled", label: "Disabled" },
    { key: "disabledBackground", label: "Disabled Background" },
    { key: "focus", label: "Focus" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Action Colors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actionFields.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between gap-3">
            <Label htmlFor={`action-${key}`} className="text-sm min-w-[140px]">
              {label}
            </Label>
            <div className="flex items-center gap-2">
              <input
                id={`action-${key}`}
                type="color"
                value={action[key].startsWith("rgba") ? "#000000" : action[key]}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={action[key]}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="flex-1 px-2 py-1 text-xs font-mono border rounded"
                placeholder="rgba(0, 0, 0, 0.54)"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
