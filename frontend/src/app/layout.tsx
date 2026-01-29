import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { AuthProvider } from "@/context/auth-context";
import { NotificationProvider } from "@/context/notification-context";
import { ConfigProvider } from "@/context/config-context";

export const metadata: Metadata = {
  title: "Aegis | Institutional Execution",
  description: "Variance-Weighted Algorithmic Runtime",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevent zoom on mobile for app-like feel
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aegis",
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  }
};

import { ClientLayout } from "@/components/layout/client-layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <ConfigProvider>
          <AuthProvider>
            <ClientLayout>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </ClientLayout>
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
