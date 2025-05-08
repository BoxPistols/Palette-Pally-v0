"use client"

import type React from "react"
import * as ResizablePrimitive from "react-resizable-panels"
import { cn } from "@/lib/utils"
import { GripVertical } from "lucide-react"

interface ResizablePanelGroupProps extends React.ComponentProps<typeof ResizablePrimitive.PanelGroup> {
  className?: string
}

const ResizablePanelGroup = ({ className, children, ...props }: ResizablePanelGroupProps) => (
  <ResizablePrimitive.PanelGroup
    className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
    {...props}
  >
    {children}
  </ResizablePrimitive.PanelGroup>
)

interface ResizablePanelProps extends React.ComponentProps<typeof ResizablePrimitive.Panel> {
  className?: string
}

const ResizablePanel = ({ className, children, ...props }: ResizablePanelProps) => (
  <ResizablePrimitive.Panel className={cn("flex grow basis-0 flex-col", className)} {...props}>
    {children}
  </ResizablePrimitive.Panel>
)

interface ResizableHandleProps extends React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> {
  withHandle?: boolean
  className?: string
}

// リサイズパネルのドラッグバーのトリガーアイコンを最上部に配置するように修正します

// ResizableHandleコンポーネントを修正して、ハンドルを最上部に配置します
export const ResizableHandle = ({ withHandle, className, ...props }: ResizableHandleProps) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel }
