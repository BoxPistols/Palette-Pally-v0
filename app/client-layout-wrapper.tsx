"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/contexts/theme-context";
import type React from "react";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__react_beautiful_dnd_disable_dev_warnings = true;
    }
  }, []);

  return <ThemeProvider>{children}</ThemeProvider>;
}