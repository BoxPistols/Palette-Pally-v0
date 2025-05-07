"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

interface FullscreenModalProps {
  title: string
  description?: string
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FullscreenModal({ title, description, children, open, onOpenChange }: FullscreenModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { language } = useLanguage()

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-[600px] transition-all duration-300",
          isFullscreen && "fixed inset-0 w-screen h-screen max-w-none rounded-none",
        )}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            title={
              isFullscreen
                ? language === "jp"
                  ? "通常サイズに戻す"
                  : "Exit fullscreen"
                : language === "jp"
                  ? "全画面表示"
                  : "Fullscreen"
            }
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </DialogHeader>
        <div className={cn("overflow-auto", isFullscreen && "h-[calc(100vh-120px)]")}>{children}</div>
      </DialogContent>
    </Dialog>
  )
}
