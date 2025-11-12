"use client"

import { useState } from "react"
import { Settings, LayoutGrid, List, Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUIConfig } from "@/lib/ui-config-context"
import type { LayoutMode, ViewDensity, CardSize } from "@/types/ui-config"
import { PRESET_CONFIGS } from "@/types/ui-config"

const layoutModeIcons: Record<LayoutMode, React.ReactNode> = {
  grid: <LayoutGrid className="h-4 w-4" />,
  list: <List className="h-4 w-4" />,
  compact: <Maximize2 className="h-4 w-4" />,
}

export function UISettingsPanel() {
  const { config, updateLayout, updateTheme, applyPreset, resetToDefaults } = useUIConfig()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          UI Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>UI Customization</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Presets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => applyPreset("minimal")} size="sm">
                  Minimal
                </Button>
                <Button variant="outline" onClick={() => applyPreset("spacious")} size="sm">
                  Spacious
                </Button>
                <Button variant="outline" onClick={() => applyPreset("compact")} size="sm">
                  Compact
                </Button>
                <Button variant="outline" onClick={resetToDefaults} size="sm">
                  Default
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Layout Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Layout Mode */}
              <div className="space-y-2">
                <Label>Layout Mode</Label>
                <RadioGroup
                  value={config.layout.mode}
                  onValueChange={(value) => updateLayout({ mode: value as LayoutMode })}
                  className="flex gap-4"
                >
                  {(Object.keys(layoutModeIcons) as LayoutMode[]).map((mode) => (
                    <div key={mode} className="flex items-center space-x-2">
                      <RadioGroupItem value={mode} id={`mode-${mode}`} />
                      <Label htmlFor={`mode-${mode}`} className="flex items-center gap-2 cursor-pointer">
                        {layoutModeIcons[mode]}
                        <span className="capitalize">{mode}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* View Density */}
              <div className="space-y-2">
                <Label>View Density</Label>
                <RadioGroup
                  value={config.layout.density}
                  onValueChange={(value) => updateLayout({ density: value as ViewDensity })}
                  className="flex gap-4"
                >
                  {["comfortable", "standard", "compact"].map((density) => (
                    <div key={density} className="flex items-center space-x-2">
                      <RadioGroupItem value={density} id={`density-${density}`} />
                      <Label htmlFor={`density-${density}`} className="capitalize cursor-pointer">
                        {density}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Card Size */}
              <div className="space-y-2">
                <Label>Card Size</Label>
                <RadioGroup
                  value={config.layout.cardSize}
                  onValueChange={(value) => updateLayout({ cardSize: value as CardSize })}
                  className="flex gap-4"
                >
                  {["small", "medium", "large"].map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <RadioGroupItem value={size} id={`size-${size}`} />
                      <Label htmlFor={`size-${size}`} className="capitalize cursor-pointer">
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Grid Columns */}
              <div className="space-y-2">
                <Label>Desktop Columns</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <Button
                      key={num}
                      variant={config.layout.columns.lg === num ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateLayout({
                          columns: { ...config.layout.columns, lg: num },
                        })
                      }
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Spacing */}
              <div className="space-y-2">
                <Label>Spacing</Label>
                <div className="flex gap-2">
                  <Button
                    variant={config.layout.spacing.card <= 8 ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      updateLayout({
                        spacing: { container: 12, card: 8, section: 16 },
                      })
                    }
                  >
                    Tight
                  </Button>
                  <Button
                    variant={config.layout.spacing.card === 12 ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      updateLayout({
                        spacing: { container: 16, card: 12, section: 24 },
                      })
                    }
                  >
                    Normal
                  </Button>
                  <Button
                    variant={config.layout.spacing.card >= 20 ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      updateLayout({
                        spacing: { container: 24, card: 20, section: 32 },
                      })
                    }
                  >
                    Loose
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Theme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Border Radius */}
              <div className="space-y-2">
                <Label>Border Radius</Label>
                <div className="flex gap-2">
                  {[0, 4, 8, 12, 16].map((radius) => (
                    <Button
                      key={radius}
                      variant={config.theme.borderRadius === radius ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateTheme({ borderRadius: radius })}
                    >
                      {radius}px
                    </Button>
                  ))}
                </div>
              </div>

              {/* Card Elevation */}
              <div className="space-y-2">
                <Label>Card Shadow</Label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map((elevation) => (
                    <Button
                      key={elevation}
                      variant={config.theme.cardElevation === elevation ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateTheme({ cardElevation: elevation })}
                    >
                      {elevation}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Animation Speed */}
              <div className="space-y-2">
                <Label>Animation Speed</Label>
                <div className="flex gap-2">
                  {[
                    { label: "Slow", value: 1.5 },
                    { label: "Normal", value: 1.0 },
                    { label: "Fast", value: 0.7 },
                    { label: "Off", value: 0 },
                  ].map(({ label, value }) => (
                    <Button
                      key={label}
                      variant={config.theme.animationSpeed === value ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateTheme({ animationSpeed: value })}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <Label>Font Size</Label>
                <div className="flex gap-2">
                  {[
                    { label: "Small", base: 12, scale: 0.9 },
                    { label: "Normal", base: 14, scale: 1.0 },
                    { label: "Large", base: 16, scale: 1.1 },
                  ].map(({ label, base, scale }) => (
                    <Button
                      key={label}
                      variant={config.theme.fontSize.base === base ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateTheme({ fontSize: { base, scale } })}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
