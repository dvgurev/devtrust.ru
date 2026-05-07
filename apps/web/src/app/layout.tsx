import type { Metadata } from "next";
import { Provider } from "@/components/providers";
import { AppHeader, AppFooter } from "@/components/app-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DevTrust — Магазин бизнес-приложений",
    template: "%s | DevTrust",
  },
  description: "Платформа для покупки и управления бизнес-приложениями по подписке",
  metadataBase: new URL(process.env.SITE_URL || "https://devtrust.ru"),
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      "application/atom+xml": "/blog/rss.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body bg-bg text-fg">
        <Provider>
          <div className="flex min-h-screen flex-col">
            <AppHeader />
            <main className="flex-1">{children}</main>
            <AppFooter />
          </div>
        </Provider>
      </body>
    </html>
  );
}