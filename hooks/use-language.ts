"use client"

import { useLanguage as useLanguageFromContext } from "@/contexts/language-context"

// 既存のuseLanguage関数をそのまま再エクスポート
export const useLanguage = useLanguageFromContext
