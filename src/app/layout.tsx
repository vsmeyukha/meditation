import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GradientBackground />
        <Header />
        {children}
        <FloatingAmbientButton />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
