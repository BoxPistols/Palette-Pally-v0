"use client"

import { useState, useEffect, type ReactNode } from "react"
import { X, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/hooks/use-language"

interface FullscreenModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
  initialFullscreen?: boolean
}

export function FullscreenModal({
  isOpen,
  onClose,
  title,
  children,
  className,
  initialFullscreen = false,
}: FullscreenModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(initialFullscreen)
  const { t } = useLanguage()

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [onClose])

  // モーダルが開いているときは背景のスクロールを無効にする
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={cn(
          "bg-background flex flex-col rounded-lg shadow-lg",
          isFullscreen
            ? "fixed inset-2 max-h-[calc(100vh-16px)] overflow-auto"
            : "w-full max-w-[600px] max-h-[80vh] overflow-auto",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={isFullscreen ? t("縮小") : t("拡大")}
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={t("閉じる")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  )
}
