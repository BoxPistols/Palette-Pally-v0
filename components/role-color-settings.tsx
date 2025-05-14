"use client"

import type { PaletteColor } from "@/types/palette"

interface RoleColorSettingsProps {
  color: PaletteColor
  onChange: (updatedColor: PaletteColor) => void
}

export function RoleColorSettings({ color, onChange }: RoleColorSettingsProps) {
  // 機能を完全に廃止し、UIも表示しない
  return null
}
