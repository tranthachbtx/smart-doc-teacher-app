import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "Trợ lý TTCM môn HĐTN, HN & GDĐP",
  description: "Tự động hóa văn bản giáo dục với AI. Hỗ trợ tạo biên bản họp, giáo án và các tài liệu chuyên môn.",
  generator: "Tranthachbtx@gmail.com",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
