import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "Trá»£ lÃ½ TTCM mÃ´n HÄTN, HN & GDÄP",
  description: "Tá»± Ä‘á»™ng hÃ³a vÄƒn báº£n giÃ¡o dá»¥c vá»›i AI. Há»— trá»£ táº¡o biÃªn báº£n há»p, giÃ¡o Ã¡n vÃ  cÃ¡c tÃ i liá»‡u chuyÃªn mÃ´n.",
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
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
