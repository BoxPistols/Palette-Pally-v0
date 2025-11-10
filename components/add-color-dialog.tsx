"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus } from "lucide-react"
import type { ColorType } from "@/types/palette"

interface AddColorDialogProps {
  onAddColor: (name: string, type: ColorType) => void
}

export function AddColorDialog({ onAddColor }: AddColorDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [colorName, setColorName] = useState("")
  const [colorType, setColorType] = useState<ColorType>("theme")

  const handleAdd = () => {
    if (colorName.trim()) {
      onAddColor(colorName.trim(), colorType)
      setColorName("")
      setColorType("theme")
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          Add Color
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Color</DialogTitle>
          <DialogDescription>Create a new color for your MUI palette.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="color-name">Color Name</Label>
            <Input
              id="color-name"
              placeholder="e.g., Accent, Brand, Custom"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Color Type</Label>
            <RadioGroup value={colorType} onValueChange={(value) => setColorType(value as ColorType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="theme" id="theme" />
                <Label htmlFor="theme" className="font-normal cursor-pointer">
                  <div>
                    <div className="font-medium">Theme Color</div>
                    <div className="text-xs text-muted-foreground">Includes light, lighter, main, dark, contrastText</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="simple" id="simple" />
                <Label htmlFor="simple" className="font-normal cursor-pointer">
                  <div>
                    <div className="font-medium">Simple Color</div>
                    <div className="text-xs text-muted-foreground">Single color value only</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} disabled={!colorName.trim()}>
            Add Color
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
