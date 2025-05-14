"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GripVertical } from "lucide-react"
import type { ColorRole } from "@/types/palette"
import { colorRoleDescriptions } from "@/types/palette"

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

  // カラーロールに基づいたバッジの色を設定
  const getRoleBadgeClass = (role?: ColorRole): string => {
    if (!role) return "bg-gray-50 text-gray-500"

    switch (role) {
      case "primary":
        return "bg-blue-50 text-blue-700"
      case "secondary":
        return "bg-purple-50 text-purple-700"
      case "success":
        return "bg-green-50 text-green-700"
      case "danger":
        return "bg-red-50 text-red-700"
      case "warning":
        return "bg-amber-50 text-amber-700"
      case "info":
        return "bg-sky-50 text-sky-700"
      case "text":
        return "bg-gray-50 text-gray-700"
      case "background":
        return "bg-slate-50 text-slate-700"
      case "border":
        return "bg-zinc-50 text-zinc-700"
      case "accent":
        return "bg-pink-50 text-pink-700"
      case "neutral":
        return "bg-stone-50 text-stone-700"
      default:
        return "bg-gray-50 text-gray-500"
    }
  }

  // グループに基づいたバッジの色を設定
  const getGroupBadgeClass = (groupName?: string): string => {
    if (!groupName) return "bg-gray-50 text-gray-500"

    switch (groupName) {
      case "grey":
        return "bg-stone-50 text-stone-700"
      case "common":
        return "bg-zinc-50 text-zinc-700"
      default:
        return "bg-gray-50 text-gray-500"
    }
  }

  // カラーロールの表示名を取得
  const getRoleDisplayName = (role?: ColorRole): string => {
    if (!role) return ""
    return role.charAt(0).toUpperCase() + role.slice(1)
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
          <Input value={localColor} onChange={handleColorChange} className="text-sm h-8" placeholder="カラーコード" />
          <Input type="color" value={localColor} onChange={handleColorChange} className="w-8 h-8 p-0 border-0" />
        </div>
      </CardContent>
    </Card>
  )
}
