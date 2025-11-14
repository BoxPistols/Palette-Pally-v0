import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/contexts/theme-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Palette Pally - カラーパレット作成ツール",
  description: "カラーパレットの作成・管理・アクセシビリティチェックを簡単に行えるツール",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress browser extension errors
              (function() {
                const originalError = console.error;
                console.error = function(...args) {
                  // Filter out browser extension errors (content_script.js)
                  const errorString = args.join(' ');
                  if (errorString.includes('content_script.js') ||
                      errorString.includes('reading \\'control\\'')) {
                    return; // Suppress the error
                  }
                  originalError.apply(console, args);
                };

                // Global error handler to prevent extension errors from showing
                window.addEventListener('error', function(event) {
                  if (event.filename && event.filename.includes('content_script.js')) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  }
                }, true);

                // Unhandled promise rejection handler
                window.addEventListener('unhandledrejection', function(event) {
                  if (event.reason && event.reason.stack &&
                      event.reason.stack.includes('content_script.js')) {
                    event.preventDefault();
                    return false;
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
