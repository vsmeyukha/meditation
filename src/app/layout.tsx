import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Raleway, Comfortaa } from "next/font/google";
import "./globals.css";
import { Header } from "@/widgets/header/ui/Header";
import { FloatingAmbientButton } from "@/shared/ui/floating-player/FloatingAmbientButton";
import { Toaster } from "@/shared/ui/sonner";

const comfortaa = Comfortaa({
  subsets: ["latin", "cyrillic"],
  variable: "--font-comfortaa",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin", "cyrillic"],
  variable: "--font-raleway",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meditation",
  description: "Light, spiritual mindfulness app",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={raleway.className}>
      <body
        className={`${comfortaa.variable} ${raleway.variable} ${geistSans.variable} ${geistMono.variable} antialiased pb-[env(safe-area-inset-bottom)]`}
      >
        <Header />
        {children}
        <FloatingAmbientButton />
        <Toaster />
      </body>
    </html>
  );
}
