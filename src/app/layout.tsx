import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/shared/ui/sonner";
import { Header } from "@/widgets/header/ui/Header";
import { FloatingAmbientButton } from "@/shared/ui/floating-player/FloatingAmbientButton";
import { GradientBackground } from "@/shared/ui/GradientBackground";

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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased pb-[env(safe-area-inset-bottom)]`}>
        <GradientBackground />
        <Header />
        {children}
        <FloatingAmbientButton />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
