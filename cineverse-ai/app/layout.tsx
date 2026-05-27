import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineVerse AI — Cinematic Movie Discovery",
  description: "AI-powered cinematic movie discovery platform with premium recommendations, immersive browsing, and intelligent search.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
