import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerCleaner } from "@/components/service-worker-cleaner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trợ lý tổ HOẠT ĐỘNG TRẢI NGHIỆM, HƯỚNG NGHIỆP & GIÁO DỤC ĐỊA PHƯƠNG ",
  description:
    "Trợ lý AI của Trần Thạch :)",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <ServiceWorkerCleaner />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
