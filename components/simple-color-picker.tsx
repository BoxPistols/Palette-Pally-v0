"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GripVertical } from "lucide-react"
import type { ColorRole } from "@/types/palette"
import { colorRoleDescriptions } from "@/types/palette"
import { getRoleBadgeClass, getRoleDisplayName, getGroupBadgeClass } from "@/lib/color-role-styles"

interface SimpleColorPickerProps {
  index: number
  name: string
  color: string
  isPrimary?: boolean
  onColorChange: (color: string) => void
  onNameChange: (name: string) => void
  dragHandleProps?: any
  colorRole?: ColorRole
  group?: string
}

export function SimpleColorPicker({
  index,
  name,
  color = "#ffffff", // デフォルト値を設定
  isPrimary = false,
  onColorChange,
  onNameChange,
  dragHandleProps,
  colorRole,
  group,
}: SimpleColorPickerProps) {
  // ローカルの状態を追加して、propsの変更を追跡
  const [localColor, setLocalColor] = useState(color || "#ffffff")
  const [localName, setLocalName] = useState(name || `color${index + 1}`)

  // propsが変更されたらローカルの状態を更新
  useEffect(() => {
    if (color) {
      setLocalColor(color)
    }
    if (name) {
      setLocalName(name)
    }
  }, [color, name, index])

  // 名前変更ハンドラ
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setLocalName(newName)
    onNameChange(newName)
  }

  // 色変更ハンドラ
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setLocalColor(newColor)
    onColorChange(newColor)
  }

  // グループの表示名を取得
  const getGroupDisplayName = (groupName?: string): string => {
    if (!groupName) return ""
    return groupName.charAt(0).toUpperCase() + groupName.slice(1)
  }

  return (
    <Card className={`overflow-hidden flex-shrink-0 ${isPrimary ? "ring-1 ring-gray-300 dark:ring-gray-700" : ""}`}>
      <CardHeader className="pb-2 px-3 pt-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="cursor-move" {...dragHandleProps}>
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            value={localName}
            onChange={handleNameChange}
            className="font-medium text-sm h-8"
            placeholder={`color${index + 1}`}
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
          />
        </div>
        <div className="flex gap-1">
          {isPrimary && (
            <Badge variant="outline" className="ml-2 bg-gray-50 text-gray-500">
              Primary
            </Badge>
          )}
          {colorRole && colorRole !== "primary" && (
            <Badge
              variant="outline"
              className={`ml-2 ${getRoleBadgeClass(colorRole)}`}
              title={colorRoleDescriptions[colorRole]}
            >
              {getRoleDisplayName(colorRole)}
            </Badge>
          )}
          {group && !colorRole && (
            <Badge variant="outline" className={`ml-2 ${getGroupBadgeClass(group)}`}>
              {getGroupDisplayName(group)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        <div className="flex gap-2 items-center">
          <div className="w-8 h-8 rounded-md" style={{ backgroundColor: localColor }}></div>
          <NonIntrusiveInput
            value={localColor}
            onChange={handleColorChange}
            className="text-sm h-8"
            placeholder="カラーコード"
          />
          <NonIntrusiveInput
            type="color"
            value={localColor}
            onChange={handleColorChange}
            className="w-8 h-8 p-0 border-0"
          />
        </div>
      </CardContent>
    </Card>
  )
}
