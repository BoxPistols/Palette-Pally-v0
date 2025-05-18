import React from "react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./ui/tooltip"
import { useLanguage } from "@/lib/language-context"

export function Logo() {
  const { language } = useLanguage()

  return (
    <TooltipProvider>
      <Tooltip>
        <div className="flex items-center gap-2">
          <div className="flex">
            <div className="w-4 h-4 bg-red-500 rounded-full" />
            <div className="w-4 h-4 bg-green-500 rounded-full -ml-1" />
            <div className="w-4 h-4 bg-blue-500 rounded-full -ml-1" />
            <div className="w-4 h-4 bg-purple-500 rounded-full -ml-1" />
          </div>
          <TooltipTrigger asChild>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Palette Pally
            </h1>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" sideOffset={6}>
            <p className="text-xs text-gray-500 font-medium">
              {language === "ja" ? "パレットパレー / カラーパレットジェネレーター" : "Color Palette Generator"}
            </p>
          </TooltipContent>
        </div>
      </Tooltip>
    </TooltipProvider>
  )
}
