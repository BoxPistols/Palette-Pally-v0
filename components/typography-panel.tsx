"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"

type TypographyPanelProps = {}

export function TypographyPanel() {
  const { language, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  return <></>
}
