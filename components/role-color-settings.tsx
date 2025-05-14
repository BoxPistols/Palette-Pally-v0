"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RoleColorDetailEditor } from "./role-color-detail-editor"
import type { PaletteColor } from "@/types/palette"
import { Settings2 } from "lucide-react"

interface RoleColorSettingsProps {
  color: PaletteColor
  onChange: (updatedColor: PaletteColor) => void
}

export function RoleColorSettings({ color, onChange }: RoleColorSettingsProps) {
  const [open, setOpen] = useState(false)

  const handleColorChange = (updatedColor: PaletteColor) => {
    onChange(updatedColor)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="詳細設定">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>ロールカラー詳細設定</DialogTitle>
        </DialogHeader>
        <RoleColorDetailEditor color={color} onChange={handleColorChange} />
      </DialogContent>
    </Dialog>
  )
}
