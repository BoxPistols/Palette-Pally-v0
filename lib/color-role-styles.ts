import { ColorRole } from "@/types/palette"

/**
 * カラーロールに応じたバッジのスタイルクラスを取得
 */
export function getRoleBadgeClass(role?: ColorRole): string {
  if (!role) return "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300"

  const badgeClasses: Record<ColorRole, string> = {
    primary: "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    secondary: "bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    success: "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300",
    danger: "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300",
    warning: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    info: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
    text: "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    background: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    border: "bg-pink-50 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
    accent: "bg-orange-50 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    neutral: "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    custom: "bg-teal-50 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  }

  return badgeClasses[role] || badgeClasses.custom
}

/**
 * カラーロールの表示名を取得
 */
export function getRoleDisplayName(role?: ColorRole): string {
  if (!role) return ""

  const roleNames: Record<ColorRole, string> = {
    primary: "Primary",
    secondary: "Secondary",
    success: "Success",
    danger: "Danger",
    warning: "Warning",
    info: "Info",
    text: "Text",
    background: "Background",
    border: "Border",
    accent: "Accent",
    neutral: "Neutral",
    custom: "Custom",
  }

  return roleNames[role] || ""
}

/**
 * グループに応じたバッジのスタイルクラスを取得
 */
export function getGroupBadgeClass(group?: string): string {
  if (!group) return ""

  // グループ名のハッシュ値を計算してカラーを割り当て
  const hash = group.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  const colors = [
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  ]

  return colors[Math.abs(hash) % colors.length]
}

/**
 * カラーロールに応じたアイコン名を取得
 */
export function getRoleIcon(role?: ColorRole): string {
  if (!role) return "circle"

  const roleIcons: Record<ColorRole, string> = {
    primary: "star",
    secondary: "star-half",
    success: "check-circle",
    danger: "x-circle",
    warning: "alert-triangle",
    info: "info",
    text: "type",
    background: "square",
    border: "frame",
    accent: "zap",
    neutral: "minus-circle",
    custom: "settings",
  }

  return roleIcons[role] || "circle"
}
