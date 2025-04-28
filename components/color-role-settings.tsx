"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import type { ColorData, ColorRole } from "@/types/palette"
import { colorRoleDescriptions } from "@/types/palette"

interface ColorRoleSettingsProps {
  colors: ColorData[]
  onUpdateColors: (colors: ColorData[]) => void
}

export function ColorRoleSettings({ colors, onUpdateColors }: ColorRoleSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [colorRoles, setColorRoles] = useState<Record<string, ColorRole>>(() => {
    // 初期値を設定
    const roles: Record<string, ColorRole> = {}
    colors.forEach((color, index) => {
      roles[color.name] = color.role || (index === 0 ? "primary" : index === 1 ? "secondary" : "custom")
    })
    return roles
  })

  const handleRoleChange = (colorName: string, role: ColorRole) => {
    setColorRoles((prev) => ({
      ...prev,
      [colorName]: role,
    }))
  }

  const handleApply = () => {
    const updatedColors = colors.map((color) => ({
      ...color,
      role: colorRoles[color.name] || "custom",
    }))

    onUpdateColors(updatedColors)
    setIsOpen(false)

    toast({
      title: "Color Role Settings Updated",
      description: "Color roles have been updated",
    })
  }

  // 使用可能なロールのリスト
  const availableRoles: ColorRole[] = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "text",
    "background",
    "border",
    "accent",
    "neutral",
    "custom",
  ]

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 whitespace-nowrap"
        onClick={() => setIsOpen(true)}
        title="Color Role Settings"
      >
        <Tag className="h-4 w-4" />
        <span>Color Roles</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[500px] w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="sticky top-0 bg-white z-20 pb-4 border-b">
            <DialogTitle>Color Role Settings</DialogTitle>
            <DialogDescription>
              Assign roles to each color to define their purpose in your design system.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4 overflow-auto flex-1">
            <div className="grid gap-4">
              {colors.map((color) => (
                <div key={color.name} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-md border border-gray-200 flex-shrink-0"
                    style={{ backgroundColor: color.value }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{color.name}</p>
                    <p className="text-xs text-gray-500 truncate">{color.value}</p>
                  </div>
                  <Select
                    value={colorRoles[color.name] || "custom"}
                    onValueChange={(value) => handleRoleChange(color.name, value as ColorRole)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          <div className="flex flex-col">
                            <span>{role}</span>
                            <span className="text-xs text-gray-500 truncate">{colorRoleDescriptions[role]}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> Assigning roles to colors helps create a consistent design system. Primary colors
                represent your brand, while others like success, danger, and warning are used for specific actions.
              </p>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 bg-white z-20 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
