"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tag, ArrowRight, GripVertical } from "lucide-react"
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
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import type { ColorData, ColorRole } from "@/types/palette"
import { colorRoleDescriptions } from "@/types/palette"

interface ColorRoleSettingsProps {
  colors: ColorData[]
  onUpdateColors: (colors: ColorData[]) => void
}

export function ColorRoleSettings({ colors, onUpdateColors }: ColorRoleSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [colorRoles, setColorRoles] = useState<Record<string, ColorRole>>({})
  const [orderedColors, setOrderedColors] = useState<ColorData[]>([])

  // Initialize state when dialog opens
  useEffect(() => {
    if (isOpen) {
      const roles: Record<string, ColorRole> = {}
      colors.forEach((color) => {
        roles[color.name] = color.role || "custom"
      })
      setColorRoles(roles)
      setOrderedColors([...colors])
    }
  }, [isOpen, colors])

  const handleRoleChange = (colorName: string, role: ColorRole) => {
    setColorRoles((prev) => ({
      ...prev,
      [colorName]: role,
    }))
  }

  const handleApply = () => {
    // Apply roles to the ordered colors
    const updatedColors = orderedColors.map((color) => ({
      ...color,
      role: colorRoles[color.name] || "custom",
    }))

    onUpdateColors(updatedColors)
    setIsOpen(false)

    toast({
      title: "Color Role Settings Updated",
      description: "Color roles and order have been updated",
    })
  }

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return

    const items = Array.from(orderedColors)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setOrderedColors(items)
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

  // Get role badge class
  const getRoleBadgeClass = (role: ColorRole): string => {
    switch (role) {
      case "primary":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "secondary":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "success":
        return "bg-green-100 text-green-800 border-green-300"
      case "danger":
        return "bg-red-100 text-red-800 border-red-300"
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "info":
        return "bg-sky-100 text-sky-800 border-sky-300"
      case "text":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "background":
        return "bg-slate-100 text-slate-800 border-slate-300"
      case "border":
        return "bg-zinc-100 text-zinc-800 border-zinc-300"
      case "accent":
        return "bg-pink-100 text-pink-800 border-pink-300"
      case "neutral":
        return "bg-stone-100 text-stone-800 border-stone-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

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
        <DialogContent className="max-w-[700px] w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="sticky top-0 bg-white z-20 pb-4 border-b">
            <DialogTitle>Color Role Settings</DialogTitle>
            <DialogDescription>
              Assign roles to each color and drag to reorder. This helps define their purpose in your design system.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4 overflow-auto flex-1">
            <div className="p-3 bg-blue-50 rounded-md mb-4">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> Drag colors to reorder them. Assign roles to create a consistent design system.
                Primary colors represent your brand, while others like success, danger, and warning are used for
                specific actions.
              </p>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="color-roles">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {orderedColors.map((color, index) => (
                      <Draggable key={color.name} draggableId={color.name} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-3 p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors"
                          >
                            <div {...provided.dragHandleProps} className="cursor-move">
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>

                            <div
                              className="w-10 h-10 rounded-md border border-gray-200 flex-shrink-0"
                              style={{ backgroundColor: color.value }}
                            />

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{color.name}</p>
                              <p className="text-xs text-gray-500 truncate">{color.value}</p>
                            </div>

                            <ArrowRight className="h-5 w-5 text-gray-400 mx-2" />

                            <div className="w-[220px]">
                              <Select
                                value={colorRoles[color.name] || "custom"}
                                onValueChange={(value) => handleRoleChange(color.name, value as ColorRole)}
                              >
                                <SelectTrigger
                                  className={`w-full ${getRoleBadgeClass(colorRoles[color.name] || "custom")}`}
                                >
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableRoles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                      <div className="flex flex-col">
                                        <span className="capitalize">{role}</span>
                                        <span className="text-xs text-gray-500 truncate">
                                          {colorRoleDescriptions[role]}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
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
